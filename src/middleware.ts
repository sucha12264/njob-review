import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 준비 중 모드 — 런칭 시 false로 변경
const MAINTENANCE_MODE = true;

// 접근 허용 경로 (관리자·준비중 페이지 자체는 항상 접근 가능)
const ALLOWED_PATHS = ["/coming-soon", "/admin", "/api/"];

// 간단한 Edge Rate Limiter (IP별 요청 횟수 제한)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function edgeRateLimit(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일은 Rate Limit 제외
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".");

  if (!isStatic) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const allowed = edgeRateLimit(ip, 60, 60_000); // 1분에 60회 제한
    if (!allowed) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  if (!MAINTENANCE_MODE) return NextResponse.next();

  const isAllowed = ALLOWED_PATHS.some((p) => pathname.startsWith(p));
  if (isAllowed) return NextResponse.next();

  if (isStatic) return NextResponse.next();

  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
