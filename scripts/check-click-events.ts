import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function check() {
  const { error } = await admin.from("click_events").select("id").limit(1);
  console.log("click_events:", error ? `❌ 없음 (${error.message})` : "✅ 있음");
}
check();
