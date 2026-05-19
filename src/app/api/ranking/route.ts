import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";
import { ALL_HUSTLES } from "@/lib/hustleData";

export interface RankedHustle {
  hustle_id: string;
  hustle_name: string;
  emoji: string;
  category: string;
  incomeRange: string;
  difficulty: number;
  review_count: number;
  avg_satisfaction: number;       // 소수점 1자리
  recommend_rate: number;         // 0~100 정수
  total_likes: number;
  top_income_rate: number;        // 50만원 이상 비율 (0~100)
}

const HUSTLE_MAP = new Map(ALL_HUSTLES.map((h) => [h.id, h]));

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`ranking:${ip}`, 30, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { data: reviews, error } = await supabaseAdmin
    .from("reviews")
    .select("hustle_id, hustle_name, satisfaction, recommend, likes, income_range")
    .not("hustle_id", "like", "__hp__%");

  if (error) {
    console.error("ranking GET 에러:", error.message);
    return NextResponse.json({ error: "랭킹을 불러오지 못했어요" }, { status: 500 });
  }

  // JS에서 hustle_id 기준 집계
  const statsMap = new Map<
    string,
    {
      hustle_name: string;
      count: number;
      satSum: number;
      recommendCount: number;
      totalLikes: number;
      highIncomeCount: number;   // 50_to_100 or over_100
    }
  >();

  for (const r of reviews ?? []) {
    const existing = statsMap.get(r.hustle_id);
    const isHighIncome = r.income_range === "50_to_100" || r.income_range === "over_100";

    if (existing) {
      existing.count++;
      existing.satSum += r.satisfaction ?? 0;
      if (r.recommend) existing.recommendCount++;
      existing.totalLikes += r.likes ?? 0;
      if (isHighIncome) existing.highIncomeCount++;
    } else {
      statsMap.set(r.hustle_id, {
        hustle_name: r.hustle_name,
        count: 1,
        satSum: r.satisfaction ?? 0,
        recommendCount: r.recommend ? 1 : 0,
        totalLikes: r.likes ?? 0,
        highIncomeCount: isHighIncome ? 1 : 0,
      });
    }
  }

  const ranked: RankedHustle[] = [];

  for (const [hustle_id, s] of statsMap.entries()) {
    const meta = HUSTLE_MAP.get(hustle_id);
    ranked.push({
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
    });
  }

  return NextResponse.json(ranked, {
    headers: {
      // Vercel Edge Cache 5분, stale-while-revalidate 30초
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=30",
    },
  });
}
