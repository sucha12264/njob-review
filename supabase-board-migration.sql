-- ============================================================
-- N잡 후기판 — 자유게시판 마이그레이션
-- 실행: Supabase 대시보드 > SQL Editor > New Query > 붙여넣기 > Run
-- URL: https://supabase.com/dashboard/project/qruymdekquikterbqhdo/sql/new
-- ============================================================

-- 1. 게시판 글 테이블
create table if not exists posts (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null    default now(),
  title         text        not null,
  content       text        not null,
  nickname      text        not null,
  kakao_user_id text,
  category      text        not null    default '자유수다',
  likes         int         not null    default 0,
  views         int         not null    default 0,
  comment_count int         not null    default 0
);

-- 2. 게시판 댓글 테이블
create table if not exists post_comments (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null    default now(),
  post_id       uuid        references posts(id) on delete cascade,
  nickname      text        not null,
  kakao_user_id text,
  content       text        not null
);

-- 3. RLS 활성화
alter table posts         enable row level security;
alter table post_comments enable row level security;

-- 4. RLS 정책 — 읽기는 누구나, 쓰기는 서비스롤만
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'posts' and policyname = 'read posts'
  ) then
    create policy "read posts" on posts for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'posts' and policyname = 'service role posts'
  ) then
    create policy "service role posts" on posts for all using (auth.role() = 'service_role');
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'post_comments' and policyname = 'read post_comments'
  ) then
    create policy "read post_comments" on post_comments for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'post_comments' and policyname = 'service role post_comments'
  ) then
    create policy "service role post_comments" on post_comments for all using (auth.role() = 'service_role');
  end if;
end $$;

-- 5. 조회수 증가 함수 (race condition 없이 atomic 업데이트)
create or replace function increment_post_views(pid uuid)
returns void
language sql
security definer
as $$
  update posts set views = views + 1 where id = pid;
$$;

-- 6. 댓글 수 자동 업데이트 함수
create or replace function update_post_comment_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

-- 7. 댓글 수 트리거 (없으면 생성)
do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_post_comment_count'
  ) then
    create trigger trg_post_comment_count
    after insert or delete on post_comments
    for each row execute function update_post_comment_count();
  end if;
end $$;

-- ============================================================
-- 완료 확인 쿼리 (위 실행 후 별도로 실행해서 확인)
-- ============================================================
-- select table_name from information_schema.tables
-- where table_schema = 'public'
--   and table_name in ('posts', 'post_comments')
-- order by table_name;
