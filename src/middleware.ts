import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── 유지보수 모드 ─────────────────────────────────────────
const MAINTENANCE_MODE = false;
const ALLOWED_PATHS = ["/coming-soon", "/admin", "/api/"];

// ─── 차단할 User-Agent 패턴 ────────────────────────────────
// 스크래핑 라이브러리, 헤드리스 브라우저, 악성 크롤러
const BLOCKED_UA_PATTERNS = [
  // HTTP 라이브러리 / 스크래핑 도구
  /python[-\s]?requests/i,
  /scrapy/i,
  /httpx/i,
  /urllib/i,
  /libwww-perl/i,
  /lwp-trivial/i,
  /mechanize/i,
  /curl\//i,
  /wget\//i,
  /go-http-client/i,
  /java\/\d/i,
  /\baxios\//i,
  /node-fetch/i,
  /\bgot\b/i,
  /undici/i,
  /scraperapi/i,
  /apify/i,
  // 헤드리스 브라우저 / 자동화
  /phantomjs/i,
  /headlesschrome/i,
  /selenium/i,
  /webdriver/i,
  /puppeteer/i,
  /playwright/i,
  /cypress/i,
  // 알려진 악성 SEO / 데이터 수집 봇
  /ahrefsbot/i,
  /semrushbot/i,
  /mj12bot/i,
  /dotbot/i,
  /blexbot/i,
  /petalbot/i,
  /bytespider/i,
  /gptbot/i,
  /claudebot/i,
  /ccbot/i,
  /common\s?crawl/i,
  /dataforseo/i,
  /serpstatbot/i,
  /sistrix/i,
  /rogerbot/i,
  /exabot/i,
  /ia_archiver/i,
];

// ─── Rate Limiter (Edge, in-memory) ───────────────────────
// 주의: Vercel 서버리스는 인스턴스가 여러 개일 수 있어 완전한 보장은 어려우나
// 단일 인스턴스 내에서 동작하며 기본 방어선 역할을 함
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function edgeRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

// 오래된 엔트리 정리 (메모리 누수 방지)
let lastCleanup = Date.now();
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

// ─── 미들웨어 ──────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  maybeCleanup();

  // 정적 파일은 모든 검사 제외
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?|ttf|eot|map)$/.test(pathname);

  if (isStatic) {
    if (!MAINTENANCE_MODE) return NextResponse.next();
    return NextResponse.next();
  }

  // ── 1. 빈 User-Agent 차단 ───────────────────────────────
  if (!ua || ua.trim().length < 5) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ── 2. 알려진 봇 / 스크래퍼 User-Agent 차단 ────────────
  if (BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const isApi = pathname.startsWith("/api/");

  // ── 3. API 라우트 추가 보호 ─────────────────────────────
  if (isApi) {
    // 카카오 OAuth 콜백은 외부에서 오므로 제외
    const isKakaoCallback = pathname.startsWith("/api/auth/kakao");

    if (!isKakaoCallback) {
      // Origin 또는 Referer가 자기 도메인이어야 함
      const origin = request.headers.get("origin") ?? "";
      const referer = request.headers.get("referer") ?? "";
      const host = request.headers.get("host") ?? "";

      const isLocalDev = host.includes("localhost") || host.includes("127.0.0.1");
      const isOwnDomain =
        origin.includes("njob-review.vercel.app") ||
        referer.includes("njob-review.vercel.app") ||
        isLocalDev;

      if (!isOwnDomain) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: external API access is not allowed" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      // API Rate Limit: 1분에 20회 (일반 rate limit보다 엄격)
      const allowed = edgeRateLimit(`api:${ip}`, 20, 60_000);
      if (!allowed) {
        return new NextResponse(
          JSON.stringify({ error: "Too Many Requests" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // ── 4. 페이지 Rate Limit: IP당 1분 30회 ─────────────────
  const pageAllowed = edgeRateLimit(`page:${ip}`, 30, 60_000);
  if (!pageAllowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // ── 5. 유지보수 모드 ─────────────────────────────────────
  if (!MAINTENANCE_MODE) return NextResponse.next();

  const isAllowed = ALLOWED_PATHS.some((p) => pathname.startsWith(p));
  if (isAllowed) return NextResponse.next();

  const loginParam = request.nextUrl.searchParams.get("login");
  if (loginParam) return NextResponse.next();

  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
