/**
 * NEXT_PUBLIC_ 변수를 서버 전용 변수로 복사하여 .env.local에 추가
 *
 * 실행: npx tsx scripts/setup-server-env.ts
 *
 * 이 스크립트는 한 번만 실행하면 됩니다.
 * 이후 Vercel 대시보드에서도 동일하게 추가해야 합니다.
 */
import { config } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

config({ path: ".env.local", override: true });

const envPath = resolve(process.cwd(), ".env.local");
const existing = readFileSync(envPath, "utf-8");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 .env.local에서 찾을 수 없습니다.");
  process.exit(1);
}

const additions: string[] = [];

if (!existing.includes("SUPABASE_URL=")) {
  additions.push(`SUPABASE_URL=${supabaseUrl}`);
  console.log("✅ SUPABASE_URL 추가");
} else {
  console.log("⏭  SUPABASE_URL 이미 존재");
}

if (!existing.includes("SUPABASE_ANON_KEY=")) {
  additions.push(`SUPABASE_ANON_KEY=${supabaseAnonKey}`);
  console.log("✅ SUPABASE_ANON_KEY 추가");
} else {
  console.log("⏭  SUPABASE_ANON_KEY 이미 존재");
}

if (additions.length > 0) {
  const newContent = existing.trimEnd() + "\n\n# 서버 전용 Supabase 변수 (브라우저에 노출되지 않음)\n" + additions.join("\n") + "\n";
  writeFileSync(envPath, newContent, "utf-8");
  console.log("\n✅ .env.local 업데이트 완료");
  console.log("\n⚠️  Vercel 대시보드에도 아래 변수를 추가해야 합니다:");
  additions.forEach((line) => console.log(`   ${line.split("=")[0]}=***`));
} else {
  console.log("\n✅ 이미 모든 변수가 설정되어 있습니다.");
}
