-- ============================================================
-- N잡 후기판 — 부업별 Q&A 마이그레이션
-- 실행: npx supabase db query --linked -f supabase-qna-migration.sql
-- ============================================================

-- 1. 질문 테이블
create table if not exists hustle_questions (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null    default now(),
  hustle_id     text        not null,
  nickname      text        not null,
  kakao_user_id text,
  content       text        not null,
  answer_count  int         not null    default 0
);

-- hustle_id 기준 조회를 위한 인덱스
create index if not exists hustle_questions_hustle_id_idx
  on hustle_questions(hustle_id, created_at desc);

-- 2. 답변 테이블
create table if not exists hustle_answers (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null    default now(),
  question_id   uuid        references hustle_questions(id) on delete cascade,
  nickname      text        not null,
  kakao_user_id text,
  content       text        not null,
  is_best       bool        not null    default false
);

-- 3. RLS 활성화
alter table hustle_questions enable row level security;
alter table hustle_answers   enable row level security;

-- 4. RLS 정책
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'hustle_questions' and policyname = 'read hustle_questions'
  ) then
    create policy "read hustle_questions" on hustle_questions for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'hustle_questions' and policyname = 'service role hustle_questions'
  ) then
    create policy "service role hustle_questions" on hustle_questions for all using (auth.role() = 'service_role');
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'hustle_answers' and policyname = 'read hustle_answers'
  ) then
    create policy "read hustle_answers" on hustle_answers for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'hustle_answers' and policyname = 'service role hustle_answers'
  ) then
    create policy "service role hustle_answers" on hustle_answers for all using (auth.role() = 'service_role');
  end if;
end $$;

-- 5. 답변 수 자동 업데이트 트리거 함수
create or replace function update_question_answer_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update hustle_questions set answer_count = answer_count + 1 where id = new.question_id;
  elsif tg_op = 'DELETE' then
    update hustle_questions set answer_count = greatest(answer_count - 1, 0) where id = old.question_id;
  end if;
  return null;
end;
$$;

-- 6. 트리거 등록
do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_question_answer_count'
  ) then
    create trigger trg_question_answer_count
    after insert or delete on hustle_answers
    for each row execute function update_question_answer_count();
  end if;
end $$;

-- ============================================================
-- 확인 쿼리
-- select table_name from information_schema.tables
-- where table_schema = 'public'
--   and table_name in ('hustle_questions', 'hustle_answers')
-- order by table_name;
-- ============================================================
