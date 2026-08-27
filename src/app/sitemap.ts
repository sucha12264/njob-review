import { MetadataRoute } from "next";
import { ALL_HUSTLES, CATEGORY_SLUG } from "@/lib/hustleData";
import { COMPARE_PAIRS } from "@/lib/comparePairs";
import { createClient } from "@supabase/supabase-js";
import { BASE_URL, STATIC_CONTENT_UPDATED } from "@/lib/constants";

/**
 * 개별 후기 페이지(/review/[id])는 사이트맵에 넣지 않는다.
 * 후기 본문이 평균 100자 남짓이라 단독 페이지로는 색인 기준을 넘지 못하고,
 * 이런 URL이 사이트맵의 대부분을 차지하면 사이트 전체가 저품질로 평가된다.
 * 후기 콘텐츠는 /hustle/[id] 페이지에 모아서 노출한다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hustleUrls = ALL_HUSTLES.map((h) => ({
    url: `${BASE_URL}/hustle/${h.id}`,
    lastModified: STATIC_CONTENT_UPDATED,
    changeFrequency: "weekly" as const,
    priority: h.isHot ? 0.9 : 0.7,
  }));

  const compareUrls = COMPARE_PAIRS.map(({ a, b }) => ({
    url: `${BASE_URL}/compare/${a}-vs-${b}`,
    lastModified: STATIC_CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const guideUrls = ALL_HUSTLES.map((h) => ({
    url: `${BASE_URL}/hustle/${h.id}/guide`,
    lastModified: STATIC_CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: h.isHot ? 0.85 : 0.65,
  }));

  const categoryUrls = Object.values(CATEGORY_SLUG).map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: STATIC_CONTENT_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  let boardUrls: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!,
      (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    if (postsError) {
      console.error("[sitemap] posts 조회 실패:", postsError.message);
    }

    if (posts) {
      boardUrls = posts.map((p: { id: string; created_at: string }) => ({
        url: `${BASE_URL}/board/${p.id}`,
        lastModified: new Date(p.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
    }
  } catch (e) {
    // 게시판 URL이 통째로 빠져도 사이트맵 자체는 나가야 하므로 계속 진행하되,
    // 조용히 삼키면 원인 추적이 불가능하므로 반드시 남긴다.
    console.error("[sitemap] Supabase 접근 실패:", e instanceof Error ? e.message : e);
  }

  return [
    { url: BASE_URL, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/recommend`, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/compare`, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/ranking`, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/board`, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: STATIC_CONTENT_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    ...categoryUrls,
    ...compareUrls,
    ...hustleUrls,
    ...guideUrls,
    ...boardUrls,
  ];
}
