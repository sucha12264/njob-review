import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId } from "@/lib/serverAuth";

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
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 인증: httpOnly 쿠키에서 읽음 (IDOR 방지)
  const authUserId = await getAuthUserId();
  if (!authUserId) {
    return NextResponse.json({ error: "인증 정보가 없습니다" }, { status: 401 });
  }

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("kakao_user_id")
    .eq("id", id)
    .single();

  if (!post) return NextResponse.json({ error: "없음" }, { status: 404 });
  if (post.kakao_user_id !== authUserId) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  await supabaseAdmin.from("posts").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
