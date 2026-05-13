import type { Metadata } from "next";
import CompareClient from "./CompareClient";
import { HUSTLE_MAP } from "@/lib/hustleData";

const BASE_URL = "https://njob-review.vercel.app";

interface Props {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { a, b } = await searchParams;
  const hustleA = a ? HUSTLE_MAP[a] : null;
  const hustleB = b ? HUSTLE_MAP[b] : null;

  if (hustleA && hustleB) {
    const title = `${hustleA.name} vs ${hustleB.name} 비교 | N잡 후기판`;
    const description = `${hustleA.name}과 ${hustleB.name}을 수익·난이도·초기비용 기준으로 비교해드려요. 내게 맞는 부업을 한눈에 확인하세요.`;
    return {
      title,
      description,
      openGraph: { title, description, url: `${BASE_URL}/compare?a=${a}&b=${b}` },
      alternates: { canonical: `${BASE_URL}/compare?a=${a}&b=${b}` },
    };
  }

  const title = "부업 비교 | 두 부업 나란히 비교 — N잡 후기판";
  const description = "유튜브 vs 틱톡, 스마트스토어 vs 쿠팡로켓그로스 등 두 부업을 수익·난이도·초기비용 기준으로 나란히 비교해보세요.";
  return {
    title,
    description,
    openGraph: { title, description, url: `${BASE_URL}/compare` },
    alternates: { canonical: `${BASE_URL}/compare` },
  };
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams;
  return <CompareClient initialA={a ?? "youtube"} initialB={b ?? "tiktok"} />;
}
