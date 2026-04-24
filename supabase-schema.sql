-- N잡 후기판 - Supabase 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- 기존 테이블 삭제 후 재생성합니다

-- 의존성 순서대로 삭제 (comments → reviews → click_events)
drop table if exists public.comments;
drop table if exists public.reviews;
drop table if exists public.click_events;

-- 후기 테이블
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),

  nickname text not null,
  hustle_id text not null,        -- "coupang-partners", "esim-palee" 등
  hustle_name text not null,      -- "쿠팡파트너스", "E심팔이" 등

  income_range text not null check (income_range in ('under_10','10_to_30','30_to_50','50_to_100','over_100')),
  weekly_hours integer not null check (weekly_hours >= 0),
  difficulty integer not null check (difficulty between 1 and 5),
  satisfaction integer not null check (satisfaction between 1 and 5),
  title text not null,
  content text not null,
  pros text not null,
  cons text not null,
  recommend boolean not null default true,
  likes integer not null default 0,

  -- 수익 인증 이미지 (Supabase Storage URL)
  proof_image_url text
);

-- 인덱스
create index idx_reviews_created_at on public.reviews(created_at desc);
create index idx_reviews_hustle_id on public.reviews(hustle_id);
create index idx_reviews_likes on public.reviews(likes desc);

-- Row Level Security
alter table public.reviews enable row level security;

create policy "Anyone can read reviews" on public.reviews
  for select using (true);

create policy "Anyone can insert reviews" on public.reviews
  for insert with check (true);

create policy "Anyone can update likes" on public.reviews
  for update using (true) with check (true);


-- ─────────────────────────────────────────
-- 댓글 테이블
-- ─────────────────────────────────────────

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  nickname text not null,
  content text not null check (char_length(content) between 1 and 500)
);

create index idx_comments_review_id on public.comments(review_id);
create index idx_comments_created_at on public.comments(created_at desc);

alter table public.comments enable row level security;

create policy "Anyone can read comments" on public.comments
  for select using (true);

create policy "Anyone can insert comments" on public.comments
  for insert with check (true);

create policy "Anyone can delete own comments" on public.comments
  for delete using (true);


-- ─────────────────────────────────────────
-- 클릭 이벤트 트래킹 (어느 부업에 관심 많은지 파악)
-- ─────────────────────────────────────────

create table public.click_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  hustle_id text not null,
  hustle_name text not null,
  event text not null default 'official_url_click'
);

create index idx_click_events_hustle_id on public.click_events(hustle_id);
create index idx_click_events_created_at on public.click_events(created_at desc);

alter table public.click_events enable row level security;

create policy "Anyone can insert click events" on public.click_events
  for insert with check (true);

create policy "Anyone can read click events" on public.click_events
  for select using (true);


-- ─────────────────────────────────────────
-- Storage 버킷은 Supabase Dashboard에서 수동 생성:
-- Storage > New bucket > 이름: review-proofs > Public 체크
-- ─────────────────────────────────────────
