import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

const VALID_CATEGORIES = ["자유수다", "수익인증", "질문해요", "정보공유", "N잡시작"];
const LIMIT = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const offset = (page - 1) * LIMIT;

  let query = supabaseAdmin
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + LIMIT - 1);

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data ?? [], total: count ?? 0, page, limit: LIMIT });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as Record<string, string>;
  const { title, content, nickname, category, kakao_user_id } = body;

  if (!title?.trim() || !content?.trim() || !nickname?.trim() || !category) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
  }
  if (title.trim().length < 2) {
    return NextResponse.json({ error: "제목은 2자 이상 입력해주세요" }, { status: 400 });
  }
  if (content.trim().length < 10) {
    return NextResponse.json({ error: "내용을 10자 이상 입력해주세요" }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "올바른 카테고리를 선택해주세요" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert({
      title: title.trim(),
      content: content.trim(),
      nickname: nickname.trim(),
      category,
      kakao_user_id: kakao_user_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
