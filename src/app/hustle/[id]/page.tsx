import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUSTLE_MAP, ALL_HUSTLES } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
import { supabaseAdmin } from "@/lib/supabase.server";
import HustlePageClient from "./HustlePageClient";
import { BASE_URL } from "@/lib/constants";
import type { Review } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

// ISR — 매 요청 Supabase 왕복(TTFB ~1.1s) 대신 CDN 캐시를 태운다
export const revalidate = 3600;

// 부업 64종은 ALL_HUSTLES에 정적으로 있으므로 빌드 시점에 전부 프리렌더한다.
// generateStaticParams가 없으면 revalidate를 줘도 Next가 매 요청 렌더링(no-store)한다.
export async function generateStaticParams() {
  return ALL_HUSTLES.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return {};

  const guide = HUSTLE_GUIDES[id] ?? null;
  const prosSnippet = guide?.pros.slice(0, 2).join(", ");
  const title = `${hustle.name} 후기 & 수익 정보`;
  const description = prosSnippet
    ? `${hustle.name} 실제 후기 모음. ${hustle.oneline}. 예상 수익 ${hustle.incomeRange}, 난이도 ${["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"][hustle.difficulty]}. 장점: ${prosSnippet}.`
    : `${hustle.name} 실제 경험자 후기 모음. ${hustle.oneline}. 예상 수익 ${hustle.incomeRange}, 초기비용 ${hustle.startupCost}, 첫 수익까지 ${hustle.timeToFirst}.`;
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

  // 후기 전량을 서버에서 로드해 초기 HTML에 본문까지 렌더링한다.
  // (예전에는 limit(5)로 잘라 스키마에만 썼기 때문에 실제 페이지에 후기가 없었고,
  //  AggregateRating의 reviewCount도 최대 5로 잘못 집계됐다.)
  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select(
      "id, created_at, nickname, hustle_id, hustle_name, income_range, weekly_hours, difficulty, satisfaction, title, content, pros, cons, recommend, likes, proof_image_url"
    )
    .eq("hustle_id", id)
    .order("created_at", { ascending: false });

  const reviewList = (reviews ?? []) as Review[];
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
      <HustlePageClient hustle={hustle} guide={guide} initialReviews={reviewList} />
    </>
  );
}
