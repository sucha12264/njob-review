import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";

const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  // 1. 익명 유저 댓글 INSERT 가능 여부
  const { error: commentErr } = await anon.from("comments").insert({
    review_id: "00000000-0000-0000-0000-000000000000",
    nickname: "테스트",
    content: "테스트 댓글",
  });
  console.log("댓글 익명 INSERT:", commentErr
    ? `❌ 실패 - ${commentErr.message} (code: ${commentErr.code})`
    : "✅ 성공");
  // 테스트 데이터 제거
  await admin.from("comments").delete().eq("nickname", "테스트").eq("content", "테스트 댓글");

  // 2. 익명 유저 reviews likes UPDATE 가능 여부
  const { data: rv } = await admin.from("reviews").select("id,likes").limit(1).single();
  if (rv) {
    const { error: likeErr } = await anon.from("reviews").update({ likes: rv.likes }).eq("id", rv.id);
    console.log("좋아요 익명 UPDATE:", likeErr
      ? `❌ 실패 - ${likeErr.message} (code: ${likeErr.code})`
      : "✅ 성공");
  }

  // 3. Storage 버킷 확인
  const { data: buckets, error: bucketErr } = await admin.storage.listBuckets();
  if (bucketErr) {
    console.log("Storage 버킷:", `❌ 조회 실패 - ${bucketErr.message}`);
  } else {
    const bucket = buckets.find(b => b.name === "review-proofs");
    console.log("review-proofs 버킷:", bucket
      ? `✅ 있음 (public: ${bucket.public})`
      : "❌ 없음 - 이미지 업로드 불가!");
  }

  // 4. 익명 유저 reviews INSERT 가능 여부 (후기 쓰기)
  const { error: reviewErr } = await anon.from("reviews").insert({
    nickname: "테스트유저",
    hustle_id: "youtube",
    hustle_name: "유튜브",
    income_range: "under_10",
    weekly_hours: 5,
    difficulty: 3,
    satisfaction: 3,
    title: "테스트",
    content: "테스트 내용",
    pros: "장점",
    cons: "단점",
    recommend: true,
    likes: 0,
  });
  console.log("후기 익명 INSERT:", reviewErr
    ? `❌ 실패 - ${reviewErr.message} (code: ${reviewErr.code})`
    : "✅ 성공");
  await admin.from("reviews").delete().eq("nickname", "테스트유저").eq("title", "테스트");
}

check();
