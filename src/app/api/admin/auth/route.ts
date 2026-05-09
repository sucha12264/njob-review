import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

/** POST /api/admin/auth  — 비밀번호 검증 */
export async function POST(req: NextRequest) {
  // 브루트포스 방어: IP당 분당 10회
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`admin-auth:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

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
