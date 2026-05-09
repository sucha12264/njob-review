import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId } from "@/lib/serverAuth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 인증: httpOnly 쿠키에서 읽음 (IDOR 방지)
  const authUserId = await getAuthUserId();
  if (!authUserId) {
    return NextResponse.json({ error: "인증 정보가 없습니다" }, { status: 401 });
  }

  const { data: comment } = await supabaseAdmin
    .from("post_comments")
    .select("kakao_user_id")
    .eq("id", id)
    .single();

  if (!comment) return NextResponse.json({ error: "없음" }, { status: 404 });
  if (comment.kakao_user_id !== authUserId) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  await supabaseAdmin.from("post_comments").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
