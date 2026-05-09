import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId } from "@/lib/serverAuth";
import { INCOME_LABELS, UPDATE_MONTHS } from "@/lib/types";
import type { IncomeRange, UpdateMonths } from "@/lib/types";

const VALID_MONTHS = UPDATE_MONTHS as unknown as number[];
const VALID_INCOME = Object.keys(INCOME_LABELS) as IncomeRange[];

/** GET /api/review-updates?review_id=xxx */
export async function GET(req: NextRequest) {
  const review_id = new URL(req.url).searchParams.get("review_id");
  if (!review_id) return NextResponse.json({ error: "review_id 필요" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("review_updates")
    .select("*")
    .eq("review_id", review_id)
    .order("months_elapsed", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/** POST /api/review-updates */
export async function POST(req: NextRequest) {
  // 인증: httpOnly 쿠키에서 읽음 (IDOR 방지)
  const authUserId = await getAuthUserId();
  if (!authUserId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const { review_id, nickname, months_elapsed, income_range, content } = body;

  // 필수 검증 (kakao_user_id는 쿠키에서 가져오므로 body에서 제외)
  if (!review_id || !nickname || !months_elapsed || !income_range || !content) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }
  if (!VALID_MONTHS.includes(Number(months_elapsed))) {
    return NextResponse.json({ error: "months_elapsed는 1, 3, 6, 12 중 하나여야 합니다" }, { status: 400 });
  }
  if (!VALID_INCOME.includes(income_range as IncomeRange)) {
    return NextResponse.json({ error: "유효하지 않은 income_range" }, { status: 400 });
  }
  if (String(content).trim().length < 5) {
    return NextResponse.json({ error: "내용은 5자 이상 입력해주세요" }, { status: 400 });
  }
  if (String(content).trim().length > 500) {
    return NextResponse.json({ error: "내용은 500자 이내로 입력해주세요" }, { status: 400 });
  }

  // 작성자 본인 확인 — 쿠키 userId가 reviews.kakao_user_id와 일치해야 함
  const { data: review } = await supabaseAdmin
    .from("reviews")
    .select("kakao_user_id")
    .eq("id", review_id)
    .single();

  if (!review) return NextResponse.json({ error: "후기를 찾을 수 없어요" }, { status: 404 });
  if (review.kakao_user_id !== authUserId) {
    return NextResponse.json({ error: "본인 후기에만 업데이트를 추가할 수 있어요" }, { status: 403 });
  }

  // 같은 months_elapsed 중복 방지
  const { data: existing } = await supabaseAdmin
    .from("review_updates")
    .select("id")
    .eq("review_id", review_id)
    .eq("months_elapsed", Number(months_elapsed))
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "이미 해당 시점의 업데이트가 존재해요" }, { status: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from("review_updates")
    .insert({
      review_id: String(review_id),
      kakao_user_id: authUserId, // 쿠키에서 가져온 검증된 ID
      nickname: String(nickname).trim().slice(0, 30),
      months_elapsed: Number(months_elapsed) as UpdateMonths,
      income_range: income_range as IncomeRange,
      content: String(content).trim(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
