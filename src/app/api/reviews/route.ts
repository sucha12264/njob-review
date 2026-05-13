import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";
import { hashAnonPassword } from "@/lib/serverAuth";

// GET /api/reviews — 후기 목록 (허니팟 제외, 페이지네이션 지원)
// 쿼리 파라미터: page(기본 1), limit(기본 전체), hustle_id(선택)
export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`reviews-get:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const hustleId = searchParams.get("hustle_id") ?? "";
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  let query = supabaseAdmin
    .from("reviews")
    .select("*", { count: "exact" })
    .not("hustle_id", "like", "__hp__%")
    .order("created_at", { ascending: false });

  if (hustleId) {
    query = query.eq("hustle_id", hustleId);
  }

  // 페이지네이션 (파라미터 없으면 전체 반환 — 하위 호환성 유지)
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : null;
  const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam))) : null;

  let finalQuery = query;
  if (page !== null && limit !== null) {
    const offset = (page - 1) * limit;
    finalQuery = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await finalQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 페이지네이션 요청이면 래퍼 객체 반환, 아니면 배열 그대로 (하위 호환)
  const body = (page !== null && limit !== null)
    ? { reviews: data ?? [], total: count ?? 0, page, limit }
    : (data ?? []);

  return NextResponse.json(body, {
    headers: {
      // 브라우저 캐시 30초, CDN 캐시 1분
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}

// POST /api/reviews — 새 후기 작성
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`reviews-post:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const {
      nickname, hustle_id, hustle_name, income_range,
      weekly_hours, difficulty, satisfaction, title,
      content, pros, cons, recommend,
      proof_image_url, kakao_user_id,
      anon_password,           // 익명 작성 시 비밀번호 (선택)
    } = body;

    // 필수 항목 검증 (닉네임·부업·수익·만족도·본문만 필수)
    if (!nickname || !hustle_id || !hustle_name || !income_range ||
        !satisfaction || !content) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

    // 허니팟 hustle_id 삽입 방지
    if (String(hustle_id).startsWith("__hp__")) {
      return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
    }

    // 제목 자동생성 (미입력 시)
    const autoTitle = title
      ? String(title).slice(0, 100)
      : `${String(hustle_name)} 후기`;

    // 추천여부 자동결정 (미입력 시 만족도 기반)
    const autoRecommend = recommend !== undefined
      ? Boolean(recommend)
      : Number(satisfaction) >= 4;

    // 익명 후기: 비밀번호 해시 + IP 저장
    const isAnon = !kakao_user_id;
    const anonPasswordHash =
      isAnon && anon_password && String(anon_password).length >= 4
        ? hashAnonPassword(String(anon_password))
        : null;

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert({
        nickname: String(nickname).slice(0, 30),
        hustle_id: String(hustle_id),
        hustle_name: String(hustle_name).slice(0, 50),
        income_range,
        weekly_hours: Number(weekly_hours) || 0,
        difficulty: Number(difficulty) || 3,
        satisfaction: Number(satisfaction),
        title: autoTitle,
        content: String(content).slice(0, 2000),
        pros: pros ? String(pros).slice(0, 500) : "",
        cons: cons ? String(cons).slice(0, 500) : "",
        recommend: autoRecommend,
        proof_image_url: proof_image_url ?? null,
        kakao_user_id: kakao_user_id ?? null,
        likes: 0,
        anon_password_hash: anonPasswordHash,
        anon_ip: isAnon ? ip : null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("후기 작성 에러:", err);
    return NextResponse.json({ error: "후기 저장에 실패했어요" }, { status: 500 });
  }
}
