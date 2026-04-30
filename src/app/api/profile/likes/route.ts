import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

// GET /api/profile/likes?kakao_user_id=xxx
// 카카오 로그인 유저의 좋아요한 review_id 목록 반환
export async function GET(req: NextRequest) {
  const kakaoUserId = req.nextUrl.searchParams.get("kakao_user_id");
  if (!kakaoUserId) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await supabaseAdmin
    .from("user_likes")
    .select("review_id")
    .eq("user_id", kakaoUserId);

  if (error) {
    return NextResponse.json([], { status: 200 }); // 에러여도 빈 배열 반환
  }

  const ids = (data ?? []).map((row: { review_id: string }) => row.review_id);
  return NextResponse.json(ids);
}
