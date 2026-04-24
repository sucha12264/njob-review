import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 준비 중 모드 — 런칭 시 false로 변경
const MAINTENANCE_MODE = true;

// 접근 허용 경로 (관리자·준비중 페이지 자체는 항상 접근 가능)
const ALLOWED_PATHS = ["/coming-soon", "/admin", "/api/"];

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next();

  const { pathname } = request.nextUrl;

  const isAllowed = ALLOWED_PATHS.some((p) => pathname.startsWith(p));
  if (isAllowed) return NextResponse.next();

  // 정적 파일 허용
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
