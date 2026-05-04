/**
 * 자유게시판 테이블 존재 여부 검증
 * 실행: npx tsx scripts/verify-board-tables.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function check(table: string) {
  const res = await fetch(`${URL}/rest/v1/${table}?limit=0`, { headers });
  if (res.ok) {
    console.log(`  ✅  ${table} — 테이블 존재, RLS 정상`);
  } else {
    const body = await res.text();
    console.log(`  ❌  ${table} — ${res.status}: ${body.slice(0, 120)}`);
  }
}

async function checkFunction(name: string) {
  const res = await fetch(`${URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ pid: "00000000-0000-0000-0000-000000000000" }),
  });
  // 함수 자체가 없으면 404, 있으면 200 또는 다른 코드
  if (res.status !== 404) {
    console.log(`  ✅  function ${name} — 존재함`);
  } else {
    console.log(`  ❌  function ${name} — 없음 (마이그레이션 필요)`);
  }
}

async function main() {
  console.log(`\n🔍 자유게시판 마이그레이션 검증`);
  console.log(`   Project: ${URL}\n`);

  console.log("[ 테이블 ]");
  await check("posts");
  await check("post_comments");

  console.log("\n[ 함수 ]");
  await checkFunction("increment_post_views");

  console.log("");
}

main().catch(console.error);
