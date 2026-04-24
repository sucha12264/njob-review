import { MetadataRoute } from "next";
import { ALL_HUSTLES } from "@/lib/hustleData";

const BASE_URL = "https://njob-review.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const hustleUrls = ALL_HUSTLES.map((h) => ({
    url: `${BASE_URL}/hustle/${h.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: h.isHot ? 0.9 : 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/write`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...hustleUrls,
  ];
}
