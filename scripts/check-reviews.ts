import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qruymdekquikterbqhdo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydXltZGVrcXVpa3RlcmJxaGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgxNTU4MCwiZXhwIjoyMDkyMzkxNTgwfQ.xGSxl5Q5Z38waPJI--TlMxuw3ASjx2KyD796_uS9G0c"
);

async function check() {
  const { data, error } = await supabase
    .from("reviews")
    .select("hustle_id")
    .order("hustle_id");

  if (error) {
    console.error(error);
    return;
  }

  const counts: Record<string, number> = {};
  for (const r of data) {
    counts[r.hustle_id] = (counts[r.hustle_id] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1]);
  console.log("총 hustles:", sorted.length);
  console.log("총 reviews:", data.length);

  const under8 = sorted.filter(([, c]) => c < 8);
  const exact8 = sorted.filter(([, c]) => c === 8);
  const over8 = sorted.filter(([, c]) => c > 8);

  console.log("\n=== 8개 미만 ===");
  if (under8.length === 0) console.log("없음!");
  else under8.forEach(([id, c]) => console.log(`  ${id}: ${c}개`));

  console.log("\n=== 8개 정확 ===", exact8.length, "개");
  console.log("=== 8개 초과 ===");
  if (over8.length === 0) console.log("없음!");
  else over8.forEach(([id, c]) => console.log(`  ${id}: ${c}개`));
}

check().catch(console.error);
