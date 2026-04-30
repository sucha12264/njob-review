import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/comments?review_id=xxx
export async function GET(req: NextRequest) {
  const reviewId = req.nextUrl.searchParams.get("review_id");
  if (!reviewId) {
    return NextResponse.json({ error: "review_id 필요" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*")
    .eq("review_id", reviewId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/comments
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`comments:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json() as {
      review_id: string;
      nickname: string;
      content: string;
    };
    const { review_id, nickname, content } = body;

    if (!review_id || !nickname?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }
    if (content.length > 500) {
      return NextResponse.json({ error: "댓글은 500자 이내로 작성해주세요" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert({
        review_id,
        nickname: nickname.trim().slice(0, 30),
        content: content.trim(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("댓글 작성 에러:", err);
    return NextResponse.json({ error: "댓글 등록에 실패했어요" }, { status: 500 });
  }
}
