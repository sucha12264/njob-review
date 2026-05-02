import { NextRequest, NextResponse } from "next/server";

/** POST /api/admin/auth  — 비밀번호 검증 */
export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 });
  }
  if (!password || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
