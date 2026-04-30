import { config } from "dotenv";
config({ path: ".env.local", override: true });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DISCLAIMER = " ※ 이 후기는 인터넷 공개 정보를 바탕으로 작성되었습니다";

async function removeDisclaimer() {
  // 전체 후기 가져오기
  const { data, error } = await supabase.from("reviews").select("id, content");
  if (error) { console.error("조회 오류:", error.message); return; }

  console.log(`총 ${data.length}개 후기 처리 시작...`);
  let updated = 0;

  for (const row of data) {
    if (!row.content.includes("※ 이 후기는 인터넷")) continue;

    const newContent = row.content
      .replace(/ ※ 이 후기는 인터넷 공개 정보를 바탕으로 작성되었습니다/g, "")
      .replace(/※ 이 후기는 인터넷 공개 정보를 바탕으로 작성되었습니다/g, "")
      .trimEnd();

    const { error: updateError } = await supabase
      .from("reviews")
      .update({ content: newContent })
      .eq("id", row.id);

    if (updateError) {
      console.error(`❌ 오류 [${row.id}]:`, updateError.message);
    } else {
      updated++;
    }
  }

  console.log(`✅ 완료: ${updated}개 후기에서 면책 문구 제거`);
}

removeDisclaimer();
