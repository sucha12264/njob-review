import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hustle_id = searchParams.get("hustle_id");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  if (!hustle_id) return NextResponse.json({ error: "hustle_id 필요" }, { status: 400 });

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabaseAdmin
    .from("hustle_questions")
    .select("*", { count: "exact" })
    .eq("hustle_id", hustle_id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ questions: data ?? [], total: count ?? 0 });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`hustle-q:${ip}`, 5, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const body = await req.json().catch(() => ({})) as Record<string, string>;
  const { hustle_id, nickname, content, kakao_user_id } = body;

  if (!hustle_id?.trim() || !nickname?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }
  if (content.trim().length < 10) {
    return NextResponse.json({ error: "질문은 10자 이상 작성해주세요" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "질문은 500자 이내로 작성해주세요" }, { status: 400 });
  }
  if (nickname.trim().length > 20) {
    return NextResponse.json({ error: "닉네임은 20자 이내로 작성해주세요" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("hustle_questions")
    .insert({
      hustle_id: hustle_id.trim(),
      nickname: nickname.trim(),
      content: content.trim(),
      kakao_user_id: kakao_user_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
