import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "N잡 후기판 - 부업 솔직 후기 커뮤니티";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* 로고 */}
        <div
          style={{
            width: 96,
            height: 96,
            background: "#6366f1",
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
            fontWeight: 900,
            color: "white",
            marginBottom: 36,
            boxShadow: "0 8px 32px rgba(99,102,241,0.5)",
          }}
        >
          N
        </div>

        {/* 타이틀 */}
        <div
          style={{
            fontSize: 74,
            fontWeight: 900,
            color: "white",
            marginBottom: 18,
            letterSpacing: "-2px",
          }}
        >
          N잡 후기판
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            fontSize: 30,
            color: "#a5b4fc",
            textAlign: "center",
            marginBottom: 52,
          }}
        >
          모든 온라인 부업 · 솔직 후기 커뮤니티
        </div>

        {/* 뱃지들 */}
        <div style={{ display: "flex", gap: 20 }}>
          {["📝 실제 후기", "💰 수익 인증", "⭐ 난이도 평가"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 40,
                padding: "10px 28px",
                color: "#e0e7ff",
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
