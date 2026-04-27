import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HUSTLE_MAP } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
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

  const jsonLd = guide
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${hustle.name} 어떻게 시작하나요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": guide.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.desc}`).join(" ")
            }
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 얼마나 벌 수 있나요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${hustle.name}의 예상 수익은 ${hustle.incomeRange}이며, 첫 수익까지 ${hustle.timeToFirst} 정도 소요됩니다. 초기 비용은 ${hustle.startupCost}입니다.`
            }
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 장단점은 무엇인가요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `장점: ${guide.pros.join(", ")}. 단점: ${guide.cons.join(", ")}.`
            }
          }
        ]
      }
    : {
        "@context": "https://schema.org",
        "@type": "Article",
        "name": `${hustle.name} 부업 정보 & 후기`,
        "description": `${hustle.name} 실제 수익 정보. 예상 수익 ${hustle.incomeRange}.`,
        "publisher": { "@type": "Organization", "name": "N잡 후기판" }
      };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HustlePageClient hustle={hustle} guide={guide} />
    </>
  );
}
