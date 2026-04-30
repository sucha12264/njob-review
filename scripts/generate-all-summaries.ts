/**
 * 모든 부업의 AI 요약을 배치 생성하여 hustle_summaries 테이블에 저장합니다.
 *
 * 실행: npx tsx scripts/generate-all-summaries.ts
 *
 * 옵션:
 *   --force       이미 캐시된 요약도 재생성
 *   --hustle <id> 특정 부업만 생성
 */
import { config } from "dotenv";
config({ path: ".env.local", override: true });

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { ALL_HUSTLES } from "../src/lib/hustleData";

const FORCE = process.argv.includes("--force");
const HUSTLE_FILTER = (() => {
  const idx = process.argv.indexOf("--hustle");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const INCOME_LABELS: Record<string, string> = {
  under_10: "10만원 미만",
  "10_to_30": "10~30만원",
  "30_to_50": "30~50만원",
  "50_to_100": "50~100만원",
  over_100: "100만원 이상",
};

async function generateSummary(hustleId: string, hustleName: string) {
  // 리뷰 가져오기 (허니팟 제외)
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("income_range, satisfaction, recommend, content, pros, cons")
    .eq("hustle_id", hustleId)
    .not("hustle_id", "like", "__hp__%")
    .limit(15);

  if (error) throw error;
  if (!reviews || reviews.length < 3) {
    return { skipped: true, reason: `후기 ${reviews?.length ?? 0}개 (최소 3개 필요)` };
  }

  const reviewText = reviews
    .map(
      (r, i) =>
        `[후기 ${i + 1}] 수익: ${INCOME_LABELS[r.income_range] ?? r.income_range}, 만족도: ${r.satisfaction}/5, 추천: ${r.recommend ? "예" : "아니오"}\n내용: ${r.content.slice(0, 200)}\n장점: ${r.pros.slice(0, 100)}\n단점: ${r.cons.slice(0, 100)}`
    )
    .join("\n\n");

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",  // 배치는 저렴한 모델 사용
    max_tokens: 600,
    system:
      "당신은 N잡 부업 분석 전문가입니다. 실제 경험자들의 후기를 분석해 핵심만 요약합니다. 반드시 유효한 JSON만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.",
    messages: [
      {
        role: "user",
        content: `${hustleName} 부업의 실제 후기 ${reviews.length}개를 분석해주세요:\n\n${reviewText}\n\n다음 JSON 형식으로만 응답하세요:\n{"verdict":"긍정적"|"중립"|"부정적","summary":"2~3문장 핵심 요약","pros":["장점1","장점2","장점3"],"cons":["단점1","단점2"],"bestFor":"이런 분께 추천"}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Invalid response");

  const jsonText = content.text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
  const result = JSON.parse(jsonText) as {
    verdict: string;
    summary: string;
    pros: string[];
    cons: string[];
    bestFor: string;
  };

  // DB upsert
  const { error: upsertErr } = await supabase.from("hustle_summaries").upsert(
    {
      hustle_id: hustleId,
      hustle_name: hustleName,
      verdict: result.verdict,
      summary: result.summary,
      pros: result.pros,
      cons: result.cons,
      best_for: result.bestFor,
      review_count: reviews.length,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "hustle_id" }
  );
  if (upsertErr) throw upsertErr;

  return { skipped: false, reviewCount: reviews.length, verdict: result.verdict };
}

async function main() {
  const hustles = HUSTLE_FILTER
    ? ALL_HUSTLES.filter((h) => h.id === HUSTLE_FILTER)
    : ALL_HUSTLES;

  if (hustles.length === 0) {
    console.error(`❌ 부업을 찾을 수 없습니다: ${HUSTLE_FILTER}`);
    process.exit(1);
  }

  // 이미 캐시된 항목 가져오기 (--force 아닐 때만)
  let cached = new Set<string>();
  if (!FORCE) {
    const { data } = await supabase.from("hustle_summaries").select("hustle_id");
    cached = new Set((data ?? []).map((r: { hustle_id: string }) => r.hustle_id));
    console.log(`캐시됨: ${cached.size}개`);
  }

  console.log(`\n대상 부업: ${hustles.length}개${FORCE ? " (강제 재생성)" : ""}\n`);

  let done = 0, skipped = 0, failed = 0;

  for (const hustle of hustles) {
    if (!FORCE && cached.has(hustle.id)) {
      console.log(`  ⏭  [${hustle.id}] ${hustle.name} — 캐시 있음, 건너뜀`);
      skipped++;
      continue;
    }

    process.stdout.write(`  ⏳ [${hustle.id}] ${hustle.name} ... `);
    try {
      const result = await generateSummary(hustle.id, hustle.name);
      if (result.skipped) {
        console.log(`⏭  스킵 (${result.reason})`);
        skipped++;
      } else {
        console.log(`✅ ${result.verdict} (후기 ${result.reviewCount}개)`);
        done++;
      }
    } catch (err) {
      console.log(`❌ 실패: ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }

    // API 속도 제한 방지 (300ms 대기)
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n완료: ${done}개 생성 / ${skipped}개 건너뜀 / ${failed}개 실패`);
}

main().catch((err) => {
  console.error("치명적 오류:", err);
  process.exit(1);
});
