import type { Metadata } from "next";
import RankingClient from "./RankingClient";
import type { RankedHustle } from "@/app/api/ranking/route";

const BASE_URL = "https://njob-review.vercel.app";

export const metadata: Metadata = {
  title: "부업 랭킹 | 만족도·추천률·후기 수 TOP 순위",
  description:
    "실제 후기 데이터 기반 부업 랭킹. 만족도·추천률·고수익 비율로 어떤 부업이 가장 잘 되는지 확인하세요.",
  openGraph: {
    title: "부업 랭킹 | 만족도·추천률 TOP 순위 — N잡 후기판",
    description: "실제 후기 데이터 기반 부업 랭킹. 만족도·추천률·고수익 비율로 어떤 부업이 가장 잘 되는지 확인하세요.",
    url: `${BASE_URL}/ranking`,
    type: "website",
  },
  alternates: {
    canonical: `${BASE_URL}/ranking`,
  },
};

async function fetchRanking(): Promise<RankedHustle[]> {
  try {
    // 빌드 타임에는 절대 URL이 없으므로 직접 서버에서 같은 로직 실행
    const { supabaseAdmin } = await import("@/lib/supabase.server");
    const { ALL_HUSTLES } = await import("@/lib/hustleData");

    const { data: reviews } = await supabaseAdmin
      .from("reviews")
      .select("hustle_id, hustle_name, satisfaction, recommend, likes, income_range")
      .not("hustle_id", "like", "__hp__%");

    const HUSTLE_MAP = new Map(ALL_HUSTLES.map((h) => [h.id, h]));

    type Stats = {
      hustle_name: string;
      count: number;
      satSum: number;
      recommendCount: number;
      totalLikes: number;
      highIncomeCount: number;
    };

    const statsMap = new Map<string, Stats>();

    for (const r of reviews ?? []) {
      const isHigh = r.income_range === "50_to_100" || r.income_range === "over_100";
      const s = statsMap.get(r.hustle_id);
      if (s) {
        s.count++;
        s.satSum += r.satisfaction ?? 0;
        if (r.recommend) s.recommendCount++;
        s.totalLikes += r.likes ?? 0;
        if (isHigh) s.highIncomeCount++;
      } else {
        statsMap.set(r.hustle_id, {
          hustle_name: r.hustle_name,
          count: 1,
          satSum: r.satisfaction ?? 0,
          recommendCount: r.recommend ? 1 : 0,
          totalLikes: r.likes ?? 0,
          highIncomeCount: isHigh ? 1 : 0,
        });
      }
    }

    return Array.from(statsMap.entries()).map(([hustle_id, s]) => {
      const meta = HUSTLE_MAP.get(hustle_id);
      return {
        hustle_id,
        hustle_name: meta?.name ?? s.hustle_name,
        emoji: meta?.emoji ?? "💼",
        category: meta?.category ?? "기타",
        incomeRange: meta?.incomeRange ?? "-",
        difficulty: meta?.difficulty ?? 3,
        review_count: s.count,
        avg_satisfaction: Math.round((s.satSum / s.count) * 10) / 10,
        recommend_rate: Math.round((s.recommendCount / s.count) * 100),
        total_likes: s.totalLikes,
        top_income_rate: Math.round((s.highIncomeCount / s.count) * 100),
      };
    });
  } catch (err) {
    console.error("[ranking] fetchRanking 실패:", err);
    return [];
  }
}

// JSON-LD: ItemList schema
function buildSchema(ranked: RankedHustle[]) {
  const top10 = [...ranked]
    .sort((a, b) => b.review_count - a.review_count)
    .slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "부업 랭킹 TOP 10 — N잡 후기판",
    "description": "실제 후기 데이터 기반 부업 랭킹. 만족도·추천률로 정렬한 N잡 순위.",
    "url": `${BASE_URL}/ranking`,
    "numberOfItems": top10.length,
    "itemListElement": top10.map((h, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": h.hustle_name,
      "url": `${BASE_URL}/hustle/${h.hustle_id}`,
      "description": `후기 ${h.review_count}개 · 평균 만족도 ${h.avg_satisfaction}점 · 추천률 ${h.recommend_rate}%`,
    })),
  };
}

export default async function RankingPage() {
  const ranked = await fetchRanking();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema(ranked)) }}
      />
      <RankingClient initialData={ranked} />
    </>
  );
}
