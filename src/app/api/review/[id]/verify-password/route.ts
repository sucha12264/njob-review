import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { hashAnonPassword } from "@/lib/serverAuth";

// POST /api/review/[id]/verify-password
// 익명 후기 비밀번호 검증 (삭제 전 확인용)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json().catch(() => ({})) as { anon_password?: string };
  const { anon_password } = body;

  if (!anon_password) {
    return NextResponse.json({ valid: false, error: "비밀번호를 입력해주세요" }, { status: 400 });
  }

  const { data: review, error } = await supabaseAdmin
    .from("reviews")
    .select("id, kakao_user_id, anon_password_hash")
    .eq("id", id)
    .single();

  if (error || !review) {
    return NextResponse.json({ valid: false, error: "후기를 찾을 수 없습니다" }, { status: 404 });
  }

  // 카카오 후기는 비밀번호로 삭제 불가
  if (review.kakao_user_id) {
    return NextResponse.json({ valid: false, error: "카카오 로그인으로 작성한 후기입니다" }, { status: 403 });
  }

  if (!review.anon_password_hash) {
    return NextResponse.json({ valid: false, error: "비밀번호가 설정되지 않은 후기입니다" }, { status: 403 });
  }

  const valid = hashAnonPassword(String(anon_password)) === review.anon_password_hash;
  return NextResponse.json({ valid });
}
