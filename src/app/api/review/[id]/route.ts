import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId, hashAnonPassword } from "@/lib/serverAuth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: review, error: fetchError } = await supabaseAdmin
    .from("reviews")
    .select("id, kakao_user_id, anon_password_hash")
    .eq("id", id)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: "후기를 찾을 수 없습니다" }, { status: 404 });
  }

  // ─── 카카오 유저: 쿠키 기반 인증 ─────────────────────
  if (review.kakao_user_id) {
    const authUserId = await getAuthUserId();
    if (!authUserId) {
      return NextResponse.json({ error: "인증 정보가 없습니다" }, { status: 401 });
    }
    if (review.kakao_user_id !== authUserId) {
      return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 });
    }
  }
  // ─── 익명 유저: 비밀번호 기반 인증 ───────────────────
  else {
    const body = await req.json().catch(() => ({})) as { anon_password?: string };
    const { anon_password } = body;

    if (!anon_password) {
      return NextResponse.json({ error: "비밀번호를 입력해주세요" }, { status: 401 });
    }
    if (!review.anon_password_hash) {
      return NextResponse.json({ error: "이 후기는 비밀번호가 설정되지 않았습니다" }, { status: 403 });
    }
    if (hashAnonPassword(String(anon_password)) !== review.anon_password_hash) {
      return NextResponse.json({ error: "비밀번호가 일치하지 않습니다" }, { status: 403 });
    }
  }

  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "삭제에 실패했습니다" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
