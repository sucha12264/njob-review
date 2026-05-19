import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

/** GET /api/hustle-questions/[id]/answers — 특정 질문의 답변 목록 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("hustle_answers")
    .select("*")
    .eq("question_id", id)
    .order("is_best", { ascending: false })   // 채택 답변 최상단
    .order("created_at", { ascending: true });

  if (error) {
    console.error("hustle-answers GET 에러:", error.message);
    return NextResponse.json({ error: "답변을 불러오지 못했어요" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

/** POST /api/hustle-questions/[id]/answers — 답변 작성 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`hustle-a:${ip}`, 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id: question_id } = await params;
  const body = await req.json().catch(() => ({})) as Record<string, string>;
  const { nickname, content, kakao_user_id } = body;

  if (!nickname?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }
  if (content.trim().length < 5) {
    return NextResponse.json({ error: "답변은 5자 이상 작성해주세요" }, { status: 400 });
  }
  if (content.trim().length > 1000) {
    return NextResponse.json({ error: "답변은 1000자 이내로 작성해주세요" }, { status: 400 });
  }
  if (nickname.trim().length > 20) {
    return NextResponse.json({ error: "닉네임은 20자 이내로 작성해주세요" }, { status: 400 });
  }

  // 질문 존재 여부 확인
  const { data: question } = await supabaseAdmin
    .from("hustle_questions")
    .select("id")
    .eq("id", question_id)
    .single();

  if (!question) return NextResponse.json({ error: "질문을 찾을 수 없어요" }, { status: 404 });

  const { data, error } = await supabaseAdmin
    .from("hustle_answers")
    .insert({
      question_id,
      nickname: nickname.trim(),
      content: content.trim(),
      kakao_user_id: kakao_user_id ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("hustle-answers POST 에러:", error.message);
    return NextResponse.json({ error: "답변 등록에 실패했어요" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
