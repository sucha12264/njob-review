import * as Sentry from "@sentry/nextjs";

/**
 * 서버/엣지 런타임 Sentry 초기화.
 * SENTRY_DSN이 없으면 init을 건너뛰어 완전한 no-op이 된다 — 로컬 개발에는 DSN이 필요 없다.
 */
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? "development",
    // 에러 트래킹이 목적이므로 성능 트레이싱은 최소만 샘플링한다 (무료 플랜 쿼터 보호)
    tracesSampleRate: 0.05,
  });
}

export const onRequestError = Sentry.captureRequestError;
