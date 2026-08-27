import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Review } from "@/lib/types";
import { supabaseAdmin } from "@/lib/supabase.server";
import { HUSTLE_MAP } from "@/lib/hustleData";
import ReviewDetailClient from "./ReviewDetailClient";
import { BASE_URL } from "@/lib/constants";
import { isIndexableReview } from "@/lib/reviewQuality";

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await supabaseAdmin
      .from("reviews")
      .select("hustle_id, hustle_name, title, content, pros, cons, income_range")
      .eq("id", id)
      .single();

    if (!data) return { title: "후기를 찾을 수 없어요" };

    const rev = data as Pick<Review, "hustle_name" | "title" | "content" | "pros" | "cons" | "income_range" | "hustle_id">;

    // 허니팟 페이지는 검색엔진 인덱싱 차단
    if (String(rev.hustle_id ?? "").startsWith("__hp__")) {
      return { robots: { index: false, follow: false } };
    }

    // 작성자가 제목에 이미 부업명을 넣은 경우가 많다 → 접두사를 붙이면 같은 말이 두 번 나온다
    const ogTitle = rev.title.includes(rev.hustle_name)
      ? rev.title
      : `${rev.hustle_name} 후기: ${rev.title}`;
    const ogDesc = rev.content.slice(0, 150).replace(/\n/g, " ");
    const ogUrl = `${BASE_URL}/review/${id}`;

    return {
      title: ogTitle,
      description: ogDesc,
      alternates: { canonical: ogUrl },
      // 분량이 기준을 넘긴 후기만 색인한다. 짧은 후기는 색인에서 빼되 follow는 유지해
      // 부업 페이지로 링크 가치가 흐르게 한다. 카카오 공유 OG는 어느 쪽이든 그대로 동작.
      robots: { index: isIndexableReview(rev), follow: true },
      openGraph: {
        type: "article",
        title: ogTitle,
        description: ogDesc,
        url: ogUrl,
        siteName: "N잡 후기판",
        locale: "ko_KR",
        images: [
          {
            url: `${BASE_URL}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDesc,
      },
    };
  } catch {
    return { title: "N잡 후기" };
  }
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // select("*")는 anon_ip / anon_password_hash / kakao_user_id 까지 클라이언트 컴포넌트
  // props로 흘러가 페이지 HTML에 그대로 박힌다. 화면에 필요한 컬럼만 가져온다.
  const { data } = await supabaseAdmin
    .from("reviews")
    .select("id, created_at, nickname, hustle_id, hustle_name, income_range, weekly_hours, difficulty, satisfaction, title, content, pros, cons, recommend, likes, proof_image_url")
    .eq("id", id)
    .single();
  if (!data) return notFound();

  const review = data as Review;

  // 허니팟 후기는 스키마 없이 렌더
  const isHoneypot = review.hustle_id.startsWith("__hp__");

  // ─── JSON-LD: Review 스키마 ────────────────────────────
  const hustle = HUSTLE_MAP[review.hustle_id];
  const hustleUrl = hustle ? `${BASE_URL}/hustle/${review.hustle_id}` : BASE_URL;

  const reviewSchema = !isHoneypot
    ? {
        "@context": "https://schema.org",
        "@type": "Review",
        "name": review.title,
        "reviewBody": review.content.slice(0, 500),
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(review.satisfaction),
          "bestRating": "5",
          "worstRating": "1",
        },
        "author": {
          "@type": "Person",
          "name": review.nickname,
        },
        "datePublished": review.created_at.slice(0, 10),
        "publisher": {
          "@type": "Organization",
          "name": "N잡 후기판",
          "@id": `${BASE_URL}/#organization`,
        },
        "itemReviewed": {
          "@type": "Service",
          "name": review.hustle_name,
          "url": hustleUrl,
        },
        "url": `${BASE_URL}/review/${id}`,
      }
    : null;

  // ─── BreadcrumbList ────────────────────────────────────
  const breadcrumbSchema = !isHoneypot
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE_URL },
          {
            "@type": "ListItem",
            "position": 2,
            "name": review.hustle_name,
            "item": hustleUrl,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": review.title,
            "item": `${BASE_URL}/review/${id}`,
          },
        ],
      }
    : null;

  return (
    <>
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <ReviewDetailClient review={review} />
    </>
  );
}
