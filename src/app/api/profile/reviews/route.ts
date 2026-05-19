import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthUserId } from "@/lib/serverAuth";

// GET /api/profile/reviews — 로그인한 본인의 후기 목록
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`profile-reviews:${ip}`, 30, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  // 서버 쿠키로 로그인 여부 확인 — 타인 프로필 조회 방지
  const authUserId = await getAuthUserId();
  if (!authUserId) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("kakao_user_id", authUserId)
    .not("hustle_id", "like", "__hp__%")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("profile-reviews GET 에러:", error.message);
    return NextResponse.json({ error: "후기 목록을 불러오지 못했어요" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
