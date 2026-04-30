import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  // comments 테이블
  const { data: c, error: ce } = await supabase.from("comments").select("id").limit(1);
  console.log("comments 테이블:", ce ? `❌ 없음 (${ce.message})` : "✅ 있음");

  // user_likes 테이블
  const { data: l, error: le } = await supabase.from("user_likes").select("review_id").limit(1);
  console.log("user_likes 테이블:", le ? `❌ 없음 (${le.message})` : "✅ 있음");

  // reports 테이블
  const { data: r, error: re } = await supabase.from("reports").select("id").limit(1);
  console.log("reports 테이블:", re ? `❌ 없음 (${re.message})` : "✅ 있음");

  // reviews likes 필드 확인
  const { data: rv } = await supabase.from("reviews").select("id, likes").limit(1);
  console.log("reviews.likes 필드:", rv ? `✅ 있음 (예시값: ${rv[0]?.likes})` : "❌ 없음");
}

check();
