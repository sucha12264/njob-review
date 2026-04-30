import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Review } from "@/lib/types";
import ReviewDetailClient from "./ReviewDetailClient";

function getSupabase() {
  return createClient(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!,
    (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await getSupabase()
      .from("reviews")
      .select("hustle_id, hustle_name, title, content, income_range")
      .eq("id", id)
      .single();

    if (!data) return { title: "후기를 찾을 수 없어요 | N잡 후기판" };

    const rev = data as Pick<Review, "hustle_name" | "title" | "content" | "income_range" | "hustle_id">;

    // 허니팟 페이지는 검색엔진 인덱싱 차단
    if (String(rev.hustle_id ?? "").startsWith("__hp__")) {
      return { robots: { index: false, follow: false } };
    }

    const ogTitle = `${rev.hustle_name} 후기: ${rev.title}`;
    const ogDesc = rev.content.slice(0, 150).replace(/\n/g, " ");
    const ogUrl = `https://njob-review.vercel.app/review/${id}`;

    return {
      title: ogTitle,
      description: ogDesc,
      openGraph: {
        type: "article",
        title: ogTitle,
        description: ogDesc,
        url: ogUrl,
        siteName: "N잡 후기판",
        locale: "ko_KR",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDesc,
      },
    };
  } catch {
    return { title: "N잡 후기 | N잡 후기판" };
  }
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await getSupabase().from("reviews").select("*").eq("id", id).single();
  if (!data) return notFound();
  return <ReviewDetailClient review={data as Review} />;
}
