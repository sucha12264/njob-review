"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * 루트 레이아웃까지 뚫고 올라온 치명 에러의 최후 방어선.
 * 여기 도달하면 루트 layout.tsx가 죽은 상태라 html/body를 직접 렌더링해야 한다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ fontFamily: "sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>
          일시적인 오류가 발생했어요
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          잠시 후 다시 시도해 주세요. 문제가 계속되면 새로고침해 주세요.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.6rem 1.4rem",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
