import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

// GET /api/profile/reviews?kakao_user_id=xxx
export async function GET(req: NextRequest) {
  const kakaoUserId = req.nextUrl.searchParams.get("kakao_user_id");
  if (!kakaoUserId) {
    return NextResponse.json({ error: "kakao_user_id 필요" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("kakao_user_id", kakaoUserId)
    .not("hustle_id", "like", "__hp__%")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
