import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/reviews — 전체 후기 목록 (허니팟 제외)
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`reviews-get:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .not("hustle_id", "like", "__hp__%")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], {
    headers: {
      // 브라우저 캐시 30초, CDN 캐시 1분
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}

// POST /api/reviews — 새 후기 작성
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`reviews-post:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const {
      nickname, hustle_id, hustle_name, income_range,
      weekly_hours, difficulty, satisfaction, title,
      content, pros, cons, recommend,
      proof_image_url, kakao_user_id,
    } = body;

    // 필수 항목 검증
    if (!nickname || !hustle_id || !hustle_name || !income_range ||
        !difficulty || !satisfaction || !title || !content || !pros || !cons) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

    // 허니팟 hustle_id 삽입 방지
    if (String(hustle_id).startsWith("__hp__")) {
      return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        nickname: String(nickname).slice(0, 30),
        hustle_id: String(hustle_id),
        hustle_name: String(hustle_name).slice(0, 50),
        income_range,
        weekly_hours: Number(weekly_hours) || 0,
        difficulty: Number(difficulty),
        satisfaction: Number(satisfaction),
        title: String(title).slice(0, 100),
        content: String(content).slice(0, 2000),
        pros: String(pros).slice(0, 500),
        cons: String(cons).slice(0, 500),
        recommend: Boolean(recommend),
        proof_image_url: proof_image_url ?? null,
        kakao_user_id: kakao_user_id ?? null,
        likes: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("후기 작성 에러:", err);
    return NextResponse.json({ error: "후기 저장에 실패했어요" }, { status: 500 });
  }
}
