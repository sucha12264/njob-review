import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthUserId } from "@/lib/serverAuth";

// GET /api/profile/likes — 로그인한 본인의 좋아요한 review_id 목록 반환
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`profile-likes:${ip}`, 30, 60_000);
  if (!allowed) return NextResponse.json([], { status: 429 });

  // 서버 쿠키로 로그인 여부 확인 — 타인의 좋아요 목록 조회 방지
  const authUserId = await getAuthUserId();
  if (!authUserId) {
    return NextResponse.json([], { status: 200 }); // 비로그인 시 빈 배열 (조용히 처리)
  }

  const { data, error } = await supabaseAdmin
    .from("user_likes")
    .select("review_id")
    .eq("user_id", authUserId);

  if (error) {
    return NextResponse.json([], { status: 200 }); // 에러여도 빈 배열 반환
  }

  const ids = (data ?? []).map((row: { review_id: string }) => row.review_id);
  return NextResponse.json(ids);
}
