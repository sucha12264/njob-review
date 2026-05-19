import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`posts-like:${ip}`, 30, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await params;
  const { action } = await req.json().catch(() => ({ action: "like" })) as { action?: string };

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("likes")
    .eq("id", id)
    .single();

  if (!post) return NextResponse.json({ error: "없음" }, { status: 404 });

  const newLikes = action === "unlike"
    ? Math.max(0, post.likes - 1)
    : post.likes + 1;

  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({ likes: newLikes })
    .eq("id", id)
    .select("likes")
    .single();

  if (error) {
    console.error("posts like 에러:", error.message);
    return NextResponse.json({ error: "좋아요 처리에 실패했어요" }, { status: 500 });
  }
  return NextResponse.json({ likes: data.likes });
}
