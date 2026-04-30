// ⚠️ 서버 전용 — "use client" 파일에서 절대 import 금지
// 브라우저에 Supabase 키가 노출되지 않도록 NEXT_PUBLIC_ 없는 변수 사용
// .env.local 및 Vercel 환경변수에 SUPABASE_URL, SUPABASE_ANON_KEY 추가 필요
// (값은 기존 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY와 동일)

import { createClient } from "@supabase/supabase-js";

const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!;
const anon = (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 일반 쿼리용 (RLS 적용)
export const supabaseServer = createClient(url, anon);

// 관리 작업용 (RLS 우회)
export const supabaseAdmin = createClient(url, service);
