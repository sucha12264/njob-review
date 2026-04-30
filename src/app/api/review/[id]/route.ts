import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { kakao_user_id } = body as { kakao_user_id?: string };

  if (!kakao_user_id) {
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

  if (review.kakao_user_id !== kakao_user_id) {
    return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "삭제에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
