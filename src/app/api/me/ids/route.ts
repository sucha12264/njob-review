import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { getAuthUserId } from "@/lib/serverAuth";

/**
 * GET /api/me/ids — 로그인한 본인이 작성한 콘텐츠의 id 목록.
 *
 * 예전에는 목록/상세 응답에 작성자의 kakao_user_id를 실어 보내고 클라이언트가
 * 자기 id와 비교해 "내 글" 여부를 판단했다. 그 탓에 모든 방문자가 작성자 식별자를
 * 볼 수 있었고, 같은 사람이 쓴 글을 서로 연결할 수 있었다.
 *
 * 삭제 권한 자체는 각 DELETE 라우트가 httpOnly 쿠키로 이미 검증하므로,
 * 클라이언트에는 "내 것인지" 여부만 알려주면 충분하다.
 */
export async function GET() {
  const authUserId = await getAuthUserId();

  const empty = { reviewIds: [], postIds: [], questionIds: [], answerIds: [] };
  if (!authUserId) return NextResponse.json(empty);

  const [reviews, posts, questions, answers] = await Promise.all([
    supabaseAdmin.from("reviews").select("id").eq("kakao_user_id", authUserId),
    supabaseAdmin.from("posts").select("id").eq("kakao_user_id", authUserId),
    supabaseAdmin.from("hustle_questions").select("id").eq("kakao_user_id", authUserId),
    supabaseAdmin.from("hustle_answers").select("id").eq("kakao_user_id", authUserId),
  ]);

  for (const r of [reviews, posts, questions, answers]) {
    if (r.error) console.error("me/ids 조회 실패:", r.error.message);
  }

  const ids = (r: { data: { id: string }[] | null }) => (r.data ?? []).map((x) => String(x.id));

  return NextResponse.json(
    {
      reviewIds: ids(reviews),
      postIds: ids(posts),
      questionIds: ids(questions),
      answerIds: ids(answers),
    },
    // 사용자별 응답이므로 절대 공유 캐시에 올리면 안 된다
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
