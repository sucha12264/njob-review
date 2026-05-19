import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthUserId } from "@/lib/serverAuth";

// GET /api/profile/liked-reviews — 로그인한 본인이 좋아요한 후기 목록 반환
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`profile-liked:${ip}`, 30, 60_000);
  if (!allowed) return NextResponse.json([], { status: 429 });

  // 서버 쿠키로 로그인 여부 확인 — 타인의 좋아요 목록 조회 방지
  const kakaoUserId = await getAuthUserId();
  if (!kakaoUserId) {
    return NextResponse.json([], { status: 200 }); // 비로그인 시 빈 배열
  }

  // user_likes → reviews JOIN
  const { data: likeRows, error: likesError } = await supabaseAdmin
    .from("user_likes")
    .select("review_id")
    .eq("user_id", kakaoUserId)
    .order("created_at", { ascending: false });

  if (likesError || !likeRows || likeRows.length === 0) {
    return NextResponse.json([]);
  }

  const reviewIds = likeRows.map((row: { review_id: string }) => row.review_id);

  const { data: reviews, error: reviewsError } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .in("id", reviewIds)
    .not("hustle_id", "like", "__hp__%");

  if (reviewsError) {
    return NextResponse.json([], { status: 200 });
  }

  // likeRows 순서 유지 (최신 좋아요 먼저)
  const reviewMap = new Map((reviews ?? []).map((r: Record<string, unknown>) => [r.id, r]));
  const ordered = reviewIds
    .map((id: string) => reviewMap.get(id))
    .filter(Boolean);

  return NextResponse.json(ordered);
}
