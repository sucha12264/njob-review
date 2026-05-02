import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { kakao_user_id } = await req.json().catch(() => ({})) as { kakao_user_id?: string };

  const { data: comment } = await supabaseAdmin
    .from("post_comments")
    .select("kakao_user_id")
    .eq("id", id)
    .single();

  if (!comment) return NextResponse.json({ error: "없음" }, { status: 404 });
  if (!kakao_user_id || comment.kakao_user_id !== kakao_user_id) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  await supabaseAdmin.from("post_comments").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
