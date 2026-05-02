import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUSTLE_MAP } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
import { supabaseAdmin } from "@/lib/supabase.server";
import HustlePageClient from "./HustlePageClient";

const BASE_URL = "https://njob-review.vercel.app";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return {};

  const title = `${hustle.name} 후기 & 수익 정보 | N잡 후기판`;
  const description = `${hustle.name} 실제 경험자 후기 모음. 예상 수익 ${hustle.incomeRange}, 난이도·초기비용·첫 수익까지 기간을 한눈에 확인하세요.`;
  const url = `${BASE_URL}/hustle/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "N잡 후기판",
      locale: "ko_KR",
      images: [
        {
          url: `${BASE_URL}/hustle/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${hustle.name} 부업 정보 & 후기`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/hustle/${id}/opengraph-image`],
    },
  };
}

export default async function HustlePage({ params }: Props) {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return notFound();

  const guide = HUSTLE_GUIDES[id] ?? null;

  // 후기 데이터 서버사이드 로드 (Schema.org AggregateRating용)
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("satisfaction, nickname, content, title, created_at")
    .eq("hustle_id", id)
    .not("hustle_id", "like", "__hp__%")
    .order("created_at", { ascending: false })
    .limit(5);

  const reviewList = reviews ?? [];
  const reviewCount = reviewList.length;
  const avgRating =
    reviewCount > 0
      ? (reviewList.reduce((s, r) => s + r.satisfaction, 0) / reviewCount).toFixed(1)
      : null;

  // ─── JSON-LD 스키마 조립 ─────────────────────────────
  const pageUrl = `${BASE_URL}/hustle/${id}`;

  // 1. Service + AggregateRating (후기 1개 이상일 때만)
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    "name": hustle.name,
    "description": hustle.description,
    "url": pageUrl,
    "provider": {
      "@type": "Organization",
      "name": "N잡 후기판",
      "@id": `${BASE_URL}/#organization`,
    },
    ...(avgRating && reviewCount >= 1
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": avgRating,
            "reviewCount": String(reviewCount),
            "bestRating": "5",
            "worstRating": "1",
          },
          "review": reviewList.slice(0, 3).map((r) => ({
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": String(r.satisfaction),
              "bestRating": "5",
              "worstRating": "1",
            },
            "author": {
              "@type": "Person",
              "name": r.nickname,
            },
            "name": r.title,
            "reviewBody": r.content.slice(0, 300),
            "datePublished": r.created_at.slice(0, 10),
          })),
        }
      : {}),
  };

  // 2. FAQPage (가이드가 있을 때)
  const faqSchema = guide
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${hustle.name} 어떻게 시작하나요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": guide.steps
                .map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`)
                .join(" "),
            },
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 얼마나 벌 수 있나요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${hustle.name}의 예상 수익은 ${hustle.incomeRange}이며, 첫 수익까지 ${hustle.timeToFirst} 정도 소요됩니다. 초기 비용은 ${hustle.startupCost}입니다.`,
            },
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 장단점은 무엇인가요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `장점: ${guide.pros.join(", ")}. 단점: ${guide.cons.join(", ")}.`,
            },
          },
        ],
      }
    : null;

  // 3. BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": BASE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": hustle.category,
        "item": `${BASE_URL}/?category=${encodeURIComponent(hustle.category)}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": hustle.name,
        "item": pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HustlePageClient hustle={hustle} guide={guide} />
    </>
  );
}
