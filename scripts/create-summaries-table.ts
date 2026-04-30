import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createTable() {
  console.log("hustle_summaries 테이블 생성 중...\n");

  const { error } = await admin.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS hustle_summaries (
        hustle_id   TEXT PRIMARY KEY,
        hustle_name TEXT NOT NULL,
        verdict     TEXT NOT NULL CHECK (verdict IN ('긍정적', '중립', '부정적')),
        summary     TEXT NOT NULL,
        pros        TEXT[] NOT NULL DEFAULT '{}',
        cons        TEXT[] NOT NULL DEFAULT '{}',
        best_for    TEXT NOT NULL,
        review_count INT NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      -- RLS: 누구나 읽기 가능, 쓰기는 service role만
      ALTER TABLE hustle_summaries ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "allow_read" ON hustle_summaries;
      CREATE POLICY "allow_read" ON hustle_summaries FOR SELECT USING (true);
    `,
  });

  if (error) {
    // rpc exec_sql 없으면 직접 insert로 테이블 존재 확인
    console.log("rpc 방식 실패, 직접 확인합니다...");
    const { error: checkErr } = await admin
      .from("hustle_summaries")
      .select("hustle_id")
      .limit(1);

    if (checkErr?.code === "42P01") {
      console.error("❌ 테이블이 없습니다. Supabase 대시보드에서 아래 SQL을 실행하세요:\n");
      console.log(`
CREATE TABLE hustle_summaries (
  hustle_id   TEXT PRIMARY KEY,
  hustle_name TEXT NOT NULL,
  verdict     TEXT NOT NULL,
  summary     TEXT NOT NULL,
  pros        TEXT[] NOT NULL DEFAULT '{}',
  cons        TEXT[] NOT NULL DEFAULT '{}',
  best_for    TEXT NOT NULL,
  review_count INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hustle_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_read" ON hustle_summaries FOR SELECT USING (true);
      `);
    } else {
      console.log("✅ hustle_summaries 테이블 이미 존재합니다.");
    }
  } else {
    console.log("✅ hustle_summaries 테이블 생성 완료");
  }
}

createTable();
