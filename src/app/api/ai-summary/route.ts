import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(`ai-summary:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  try {
    const { hustleName, reviews } = await req.json() as {
      hustleName: string;
      reviews: Array<{
        income_range: string;
        satisfaction: number;
        recommend: boolean;
        content: string;
        pros: string;
        cons: string;
      }>;
    };

    if (!hustleName || !reviews?.length) {
      return NextResponse.json({ error: "후기가 없어요" }, { status: 400 });
    }

    const INCOME_LABELS: Record<string, string> = {
      under_10: "10만원 미만",
      "10_to_30": "10~30만원",
      "30_to_50": "30~50만원",
      "50_to_100": "50~100만원",
      over_100: "100만원 이상",
    };

    const reviewText = reviews
      .slice(0, 15)
      .map(
        (r, i) =>
          `[후기 ${i + 1}] 수익: ${INCOME_LABELS[r.income_range] ?? r.income_range}, 만족도: ${r.satisfaction}/5, 추천: ${r.recommend ? "예" : "아니오"}\n내용: ${r.content.slice(0, 200)}\n장점: ${r.pros.slice(0, 100)}\n단점: ${r.cons.slice(0, 100)}`
      )
      .join("\n\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: "당신은 N잡 부업 분석 전문가입니다. 실제 경험자들의 후기를 분석해 핵심만 요약합니다. 반드시 유효한 JSON만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cache_control: { type: "ephemeral" } as any,
        },
      ],
      messages: [
        {
          role: "user",
          content: `${hustleName} 부업의 실제 후기 ${reviews.length}개를 분석해주세요:\n\n${reviewText}\n\n다음 JSON 형식으로만 응답하세요:\n{"verdict":"긍정적"|"중립"|"부정적","summary":"2~3문장 핵심 요약","pros":["장점1","장점2","장점3"],"cons":["단점1","단점2"],"bestFor":"이런 분께 추천"}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Invalid response type");

    const jsonText = content.text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const result = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI 요약 에러:", err);
    return NextResponse.json({ error: "AI 요약 생성에 실패했어요" }, { status: 500 });
  }
}
