import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "게시글을 찾을 수 없어요" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { kakao_user_id } = await req.json().catch(() => ({})) as { kakao_user_id?: string };

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("kakao_user_id")
    .eq("id", id)
    .single();

  if (!post) return NextResponse.json({ error: "없음" }, { status: 404 });
  if (!kakao_user_id || post.kakao_user_id !== kakao_user_id) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  await supabaseAdmin.from("posts").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
