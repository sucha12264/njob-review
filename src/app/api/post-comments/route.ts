import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

export async function GET(req: NextRequest) {
  const post_id = new URL(req.url).searchParams.get("post_id");
  if (!post_id) return NextResponse.json({ error: "post_id 필요" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("post_comments")
    .select("*")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as Record<string, string>;
  const { post_id, nickname, content, kakao_user_id } = body;

  if (!post_id || !nickname?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "댓글은 500자 이내로 작성해주세요" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("post_comments")
    .insert({
      post_id,
      nickname: nickname.trim(),
      content: content.trim(),
      kakao_user_id: kakao_user_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
