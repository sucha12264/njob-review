import { MetadataRoute } from "next";
import { ALL_HUSTLES } from "@/lib/hustleData";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://njob-review.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hustleUrls = ALL_HUSTLES.map((h) => ({
    url: `${BASE_URL}/hustle/${h.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: h.isHot ? 0.9 : 0.7,
  }));

  let reviewUrls: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!,
      (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
    );
    const { data } = await supabase
      .from("reviews")
      .select("id, created_at")
      .not("hustle_id", "like", "__hp__%")
      .order("created_at", { ascending: false });

    if (data) {
      reviewUrls = data.map((r: { id: string; created_at: string }) => ({
        url: `${BASE_URL}/review/${r.id}`,
        lastModified: new Date(r.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Supabase 연결 실패 시 후기 URL 제외하고 계속
  }

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/write`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...hustleUrls,
    ...reviewUrls,
  ];
}
