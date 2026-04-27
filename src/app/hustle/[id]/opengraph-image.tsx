import { ImageResponse } from "next/og";
import { HUSTLE_MAP } from "@/lib/hustleData";

export const runtime = "edge";
export const alt = "N잡 부업 정보";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const hustle = HUSTLE_MAP[params.id];

  const name = hustle?.name ?? "부업 정보";
  const emoji = hustle?.emoji ?? "💼";
  const income = hustle?.incomeRange ?? "";
  const startupCost = hustle?.startupCost ?? "";
  const timeToFirst = hustle?.timeToFirst ?? "";
  const desc = hustle?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          padding: "56px 64px",
        }}
      >
        {/* 상단 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#6366f1",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "white",
            }}
          >
            N
          </div>
          <span style={{ color: "#a5b4fc", fontSize: 22, fontWeight: 600 }}>N잡 후기판</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 22 }}>·</span>
          <span
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#e0e7ff",
              borderRadius: 20,
              padding: "4px 16px",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            부업 정보
          </span>
        </div>

        {/* 중앙 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, lineHeight: 1 }}>{emoji}</div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {name}
          </div>
          {desc && (
            <div style={{ fontSize: 26, color: "#c7d2fe", lineHeight: 1.5 }}>
              {desc.slice(0, 80)}
            </div>
          )}
        </div>

        {/* 하단 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {income && (
            <div
              style={{
                background: "rgba(99,102,241,0.3)",
                border: "1px solid rgba(99,102,241,0.6)",
                borderRadius: 30,
                padding: "8px 24px",
                color: "#e0e7ff",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              💰 {income}
            </div>
          )}
          {startupCost && (
            <div
              style={{
                background: "rgba(16,185,129,0.2)",
                border: "1px solid rgba(16,185,129,0.4)",
                borderRadius: 30,
                padding: "8px 24px",
                color: "#a7f3d0",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              🚀 초기비용 {startupCost}
            </div>
          )}
          {timeToFirst && (
            <div
              style={{
                background: "rgba(251,191,36,0.2)",
                border: "1px solid rgba(251,191,36,0.4)",
                borderRadius: 30,
                padding: "8px 24px",
                color: "#fde68a",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              ⏱ 첫수익 {timeToFirst}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
