import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "N잡 후기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INCOME_LABELS: Record<string, string> = {
  under_10: "월 10만원 미만",
  "10_to_30": "월 10~30만원",
  "30_to_50": "월 30~50만원",
  "50_to_100": "월 50~100만원",
  over_100: "월 100만원 이상",
};

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const supabase = createClient(
      (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!,
      (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );

    const { data } = await supabase
      .from("reviews")
      .select("hustle_name, title, content, income_range, satisfaction, recommend")
      .eq("id", params.id)
      .single();

    const title = (data?.title ?? "N잡 후기").slice(0, 50);
    const hustle = data?.hustle_name ?? "";
    const desc = (data?.content ?? "").slice(0, 100);
    const income = INCOME_LABELS[data?.income_range as string] ?? "";
    const recommend = data?.recommend;
    const stars = data?.satisfaction ?? 0;

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
            <span style={{ color: "#a5b4fc", fontSize: 22, fontWeight: 600 }}>
              N잡 후기판
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 22 }}>·</span>
            <span
              style={{
                background: "#6366f1",
                color: "white",
                borderRadius: 20,
                padding: "4px 16px",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {hustle}
            </span>
          </div>

          {/* 중앙 - 제목 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: desc ? 52 : 60,
                fontWeight: 900,
                color: "white",
                lineHeight: 1.2,
                letterSpacing: "-1px",
              }}
            >
              {title}
            </div>
            {desc && (
              <div
                style={{
                  fontSize: 26,
                  color: "#c7d2fe",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {desc}
              </div>
            )}
          </div>

          {/* 하단 - 정보 */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
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
            {stars > 0 && (
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
                {"★".repeat(stars)}{"☆".repeat(5 - stars)} {stars}/5
              </div>
            )}
            {recommend !== null && recommend !== undefined && (
              <div
                style={{
                  background: recommend ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                  border: `1px solid ${recommend ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                  borderRadius: 30,
                  padding: "8px 24px",
                  color: recommend ? "#86efac" : "#fca5a5",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {recommend ? "👍 추천해요" : "👎 비추해요"}
              </div>
            )}
          </div>
        </div>
      ),
      { ...size }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#312e81",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 60,
            fontWeight: 900,
            fontFamily: "sans-serif",
          }}
        >
          N잡 후기판
        </div>
      ),
      { ...size }
    );
  }
}
