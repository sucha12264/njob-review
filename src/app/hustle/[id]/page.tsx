import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUSTLE_MAP } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
import HustlePageClient from "./HustlePageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return {};

  const title = `${hustle.name} 후기 & 수익 정보 | N잡 후기판`;
  const description = `${hustle.name} 실제 경험자 후기 모음. 예상 수익 ${hustle.incomeRange}, 난이도·초기비용·첫 수익까지 기간을 한눈에 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function HustlePage({ params }: Props) {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return notFound();

  const guide = HUSTLE_GUIDES[id] ?? null;

  return <HustlePageClient hustle={hustle} guide={guide} />;
}
