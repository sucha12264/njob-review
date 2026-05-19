import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`post-comments-get:${ip}`, 60, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const post_id = new URL(req.url).searchParams.get("post_id");
  if (!post_id) return NextResponse.json({ error: "post_id 필요" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("post_comments")
    .select("*")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("post-comments GET 에러:", error.message);
    return NextResponse.json({ error: "댓글을 불러오지 못했어요" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`post-comments:${ip}`, 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const body = await req.json().catch(() => ({})) as Record<string, string>;
  const { post_id, nickname, content, kakao_user_id } = body;

  if (!post_id || !nickname?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }
  if (nickname.trim().length < 2) {
    return NextResponse.json({ error: "닉네임은 2자 이상 입력해주세요" }, { status: 400 });
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

  if (error) {
    console.error("post-comments POST 에러:", error.message);
    return NextResponse.json({ error: "댓글 등록에 실패했어요" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
