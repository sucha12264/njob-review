import * as Sentry from "@sentry/nextjs";

/**
 * 브라우저 Sentry 초기화. NEXT_PUBLIC_SENTRY_DSN이 없으면 no-op.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    tracesSampleRate: 0.05,
    // 광고 차단기 등이 뿜는 노이즈 에러 무시
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
