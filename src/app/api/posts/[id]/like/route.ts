import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ likes: data.likes });
}
