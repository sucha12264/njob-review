import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase.server";
import type { Post } from "@/lib/types";
import PostDetailClient from "./PostDetailClient";

const BASE_URL = "https://njob-review.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("posts")
    .select("title, content, category")
    .eq("id", id)
    .single();

  if (!data) return { title: "게시글 없음 | N잡 후기판" };

  const desc = (data.content as string).slice(0, 150).replace(/\n/g, " ");
  return {
    title: `${data.title} | N잡 후기판`,
    description: desc,
    alternates: { canonical: `${BASE_URL}/board/${id}` },
    openGraph: {
      title: data.title as string,
      description: desc,
      url: `${BASE_URL}/board/${id}`,
      siteName: "N잡 후기판",
      locale: "ko_KR",
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return notFound();
  return <PostDetailClient post={data as Post} />;
}
