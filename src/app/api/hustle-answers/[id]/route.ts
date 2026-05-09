import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId } from "@/lib/serverAuth";

/** DELETE /api/hustle-answers/[id] — 답변 삭제 (작성자 본인만) */
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

  const { data: answer } = await supabaseAdmin
    .from("hustle_answers")
    .select("kakao_user_id")
    .eq("id", id)
    .single();

  if (!answer) return NextResponse.json({ error: "없음" }, { status: 404 });
  if (answer.kakao_user_id !== authUserId) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  await supabaseAdmin.from("hustle_answers").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
