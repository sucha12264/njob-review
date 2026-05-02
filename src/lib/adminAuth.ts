import { NextRequest, NextResponse } from "next/server";

/**
 * 관리자 API 요청의 비밀번호를 서버사이드에서 검증합니다.
 * x-admin-password 헤더를 확인합니다.
 *
 * 사용법:
 *   const deny = checkAdminAuth(req);
 *   if (deny) return deny;
 */
export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const pw = req.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    // 환경변수 미설정 → 500
    return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 });
  }
  if (!pw || pw !== expected) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }
  return null; // 통과
}
