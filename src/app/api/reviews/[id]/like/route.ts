import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

// PATCH /api/reviews/[id]/like — 좋아요 토글
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed } = rateLimit(`like:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json() as {
      action: "like" | "unlike";
      kakao_user_id?: string;
    };
    const { action, kakao_user_id } = body;

    if (action !== "like" && action !== "unlike") {
      return NextResponse.json({ error: "잘못된 action" }, { status: 400 });
    }

    // 현재 좋아요 수 조회
    const { data: review, error: fetchErr } = await supabaseAdmin
      .from("reviews")
      .select("id, likes")
      .eq("id", id)
      .not("hustle_id", "like", "__hp__%")
      .single();

    if (fetchErr || !review) {
      return NextResponse.json({ error: "후기를 찾을 수 없습니다" }, { status: 404 });
    }

    const delta = action === "like" ? 1 : -1;
    const newLikes = Math.max(0, (review.likes ?? 0) + delta);

    // 좋아요 수 업데이트
    const { error: updateErr } = await supabaseAdmin
      .from("reviews")
      .update({ likes: newLikes })
      .eq("id", id);

    if (updateErr) throw updateErr;

    // 카카오 로그인 유저: user_likes 동기화
    if (kakao_user_id) {
      if (action === "unlike") {
        await supabaseAdmin
          .from("user_likes")
          .delete()
          .match({ user_id: kakao_user_id, review_id: id });
      } else {
        await supabaseAdmin
          .from("user_likes")
          .upsert({ user_id: kakao_user_id, review_id: id });
      }
    }

    return NextResponse.json({ likes: newLikes });
  } catch (err) {
    console.error("좋아요 에러:", err);
    return NextResponse.json({ error: "좋아요 처리에 실패했어요" }, { status: 500 });
  }
}
