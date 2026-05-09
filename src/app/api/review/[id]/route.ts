import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId } from "@/lib/serverAuth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 인증: 클라이언트 바디가 아닌 httpOnly 쿠키에서 읽음 (IDOR 방지)
  const authUserId = await getAuthUserId();
  if (!authUserId) {
    return NextResponse.json({ error: "인증 정보가 없습니다" }, { status: 401 });
  }

  const { data: review, error: fetchError } = await supabaseAdmin
    .from("reviews")
    .select("id, kakao_user_id")
    .eq("id", id)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: "후기를 찾을 수 없습니다" }, { status: 404 });
  }

  if (review.kakao_user_id !== authUserId) {
    return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "삭제에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
