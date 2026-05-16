/**
 * 익명 후기 비밀번호/IP 컬럼 추가 마이그레이션
 * 실행: npx tsx scripts/migrate-anon-fields.ts
 */

const PROJECT_REF = "qruymdekquikterbqhdo";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydXltZGVrcXVpa3RlcmJxaGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgxNTU4MCwiZXhwIjoyMDkyMzkxNTgwfQ.xGSxl5Q5Z38waPJI--TlMxuw3ASjx2KyD796_uS9G0c";

const SQL = `
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS anon_password_hash TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS anon_ip TEXT;
`;

async function run() {
  console.log("DB 마이그레이션 시작: anon_password_hash, anon_ip 컬럼 추가...");

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: SQL }),
    }
  );

  if (res.ok) {
    console.log("✅ 마이그레이션 완료");
    return;
  }

  // Management API 실패 → SQL Editor 안내
  console.log("⚠️  자동 마이그레이션 실패. Supabase SQL Editor에서 아래 SQL을 실행해주세요:");
  console.log("─".repeat(60));
  console.log(SQL);
  console.log("─".repeat(60));
  console.log("URL: https://supabase.com/dashboard/project/qruymdekquikterbqhdo/sql");
}

run().catch(console.error);
