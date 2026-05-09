-- ============================================================
-- N잡 후기판 — 수익 업데이트 마이그레이션
-- 실행: npx supabase db query --linked -f supabase-review-updates-migration.sql
-- ============================================================

-- 1. 수익 업데이트 테이블
create table if not exists review_updates (
  id             uuid        primary key default gen_random_uuid(),
  created_at     timestamptz not null    default now(),
  review_id      uuid        references reviews(id) on delete cascade,
  kakao_user_id  text        not null,
  nickname       text        not null,
  months_elapsed int         not null,   -- 1 / 3 / 6 / 12
  income_range   text        not null,   -- under_10 / 10_to_30 / 30_to_50 / 50_to_100 / over_100
  content        text        not null
);

-- review_id 조회용 인덱스
create index if not exists review_updates_review_id_idx
  on review_updates(review_id, months_elapsed asc);

-- 2. RLS 활성화
alter table review_updates enable row level security;

-- 3. RLS 정책
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'review_updates' and policyname = 'read review_updates'
  ) then
    create policy "read review_updates" on review_updates for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'review_updates' and policyname = 'service role review_updates'
  ) then
    create policy "service role review_updates" on review_updates for all using (auth.role() = 'service_role');
  end if;
end $$;
