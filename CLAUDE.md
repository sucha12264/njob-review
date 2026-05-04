# CLAUDE.md — 솔로 개발자 최적화 지침서

---

## 🏗️ Project Context

```
Project Name   : N잡 후기판 (side-job-checker)
Stack          : Next.js 16 (App Router) / TypeScript 5 / Supabase (PostgreSQL) / Tailwind CSS 3
                 Anthropic Claude API (AI 요약) / Kakao OAuth / Framer Motion
Package Manager: npm
Node Version   : 20.x (@types/node ^20)
Test Runner    : [미입력] — 테스트 없음 (수동 검증)
Lint/Format    : ESLint (eslint-config-next 15.3.1) — Prettier 미설정
Deploy Target  : Vercel (Production: https://njob-review.vercel.app)
Env File       : .env.local (never commit)
```

### Key Commands
```bash
dev    : npm run dev        # Next.js 개발 서버 (localhost:3000)
build  : npm run build      # 프로덕션 빌드 + 타입 체크
lint   : npm run lint       # ESLint
start  : npm run start      # 빌드 후 프로덕션 서버
deploy : npx vercel --prod  # Vercel 수동 배포 (git push main → 자동 배포)
tsc    : npx tsc --noEmit   # 타입 검사만 (빌드 없이)
batch  : npx tsx scripts/generate-all-summaries.ts  # AI 요약 일괄 생성
```

### Folder Structure
```
src/
├── app/
│   ├── page.tsx                  # 홈 (후기 피드 + 부업 목록)
│   ├── layout.tsx                # 루트 레이아웃 (헤더, 푸터, JSON-LD)
│   ├── board/                    # 자유게시판
│   │   ├── page.tsx
│   │   ├── BoardClient.tsx       # 카테고리 탭 + 목록 (client)
│   │   ├── write/page.tsx        # 글쓰기 폼
│   │   └── [id]/
│   │       ├── page.tsx          # 글 상세 (server, OG 메타)
│   │       └── PostDetailClient.tsx
│   ├── hustle/[id]/              # 부업 상세 페이지
│   │   ├── page.tsx              # JSON-LD (Service, FAQ, Breadcrumb) + SSR
│   │   ├── HustlePageClient.tsx  # AI 요약, 후기 목록, QuickWriteBox
│   │   └── opengraph-image.tsx
│   ├── review/[id]/              # 후기 상세 페이지
│   │   ├── page.tsx              # JSON-LD (Review, Breadcrumb)
│   │   ├── ReviewDetailClient.tsx # 좋아요, 신고, 공유 배너, 댓글
│   │   └── opengraph-image.tsx
│   ├── write/page.tsx            # 후기 작성 (5필드 + 선택 섹션 접기)
│   ├── admin/page.tsx            # 어드민 대시보드 (5탭)
│   ├── profile/page.tsx          # 내 후기 목록
│   ├── api/
│   │   ├── reviews/              # GET(목록) POST(작성) / [id]/like
│   │   ├── review/[id]/          # DELETE (작성자 본인)
│   │   ├── comments/             # GET POST (후기 댓글)
│   │   ├── posts/                # GET POST / [id]/ like/ view/
│   │   ├── post-comments/        # GET POST / [id]/
│   │   ├── ai-summary/           # GET(캐시) POST(생성+저장)
│   │   ├── click/                # POST (클릭 이벤트)
│   │   ├── report/               # POST (신고)
│   │   ├── upload/               # POST (이미지 → Supabase Storage)
│   │   ├── auth/kakao/           # GET (OAuth 콜백)
│   │   ├── profile/              # likes/ reviews/ (카카오 유저 기반)
│   │   └── admin/                # auth/ reviews/ comments/ clicks/ reports/ summaries/
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── BottomNav.tsx             # 모바일 하단 네비 (5탭)
│   ├── Comments.tsx              # 후기 댓글 섹션
│   ├── FilterBar.tsx             # 카테고리/정렬 필터
│   ├── KakaoAuthButton.tsx       # 카카오 로그인 버튼
│   ├── QuickWriteBox.tsx         # 부업 페이지 인라인 후기 작성
│   ├── ReviewCard.tsx            # 후기 카드 컴포넌트
│   └── ShareButtons.tsx          # 카카오/링크 공유 버튼
├── lib/
│   ├── types.ts                  # Review, Post, PostComment, IncomeRange 등
│   ├── store.tsx                 # Zustand-like Context (리뷰 상태, 좋아요)
│   ├── supabase.ts               # 클라이언트 Supabase (NEXT_PUBLIC_ 키)
│   ├── supabase.server.ts        # 서버 전용 (Service Role — 절대 client import 금지)
│   ├── adminAuth.ts              # x-admin-password 헤더 검증
│   ├── hustleData.ts             # HUSTLE_MAP (부업 메타데이터 정적 데이터)
│   ├── hustleGuides.ts           # HUSTLE_GUIDES (시작 가이드, pros/cons)
│   ├── kakaoAuth.ts              # 카카오 SDK 초기화, 유저 스토리지
│   ├── mockData.ts               # 로컬 개발용 목 데이터
│   └── rateLimit.ts              # 간단한 API 레이트 리밋
├── middleware.ts                  # 허니팟 리다이렉트
scripts/
└── generate-all-summaries.ts     # AI 요약 일괄 생성 (tsx로 직접 실행)
```

---

## ⚙️ Workflow Orchestration

### 1. Plan Node Default
- 3단계 이상 또는 아키텍처 결정이 필요한 작업 → 무조건 plan 모드 진입
- 문제가 생기면 즉시 STOP → 재계획
- 검증 단계에도 plan 모드 사용 (빌드만이 아니라)
- 모호함을 줄이기 위해 상세 스펙을 먼저 작성

### 2. Subagent Strategy
- 메인 컨텍스트 윈도우를 깨끗하게 유지하기 위해 서브에이전트 적극 활용
- 리서치·탐색·병렬 분석은 서브에이전트로 오프로드
- 복잡한 문제는 서브에이전트에 더 많은 연산 할당
- 서브에이전트 1개당 1개의 태스크 (집중 실행)

### 3. Self-Improvement Loop
- 사용자 수정 발생 시: tasks/lessons.md에 패턴 즉시 기록
- 같은 실수를 막는 룰을 스스로 작성
- 실수율이 떨어질 때까지 lessons를 무자비하게 반복 검토
- 세션 시작 시 관련 프로젝트의 lessons 먼저 리뷰

### 4. Verification Before Done
- 작동 증명 없이는 절대 완료 선언 금지
- **모든 코드 변경 후 반드시**: `npx tsc --noEmit` → `npm run build` 순서로 검증
- "시니어 개발자가 이 PR을 승인할까?" 자문
- 테스트 실행 → 로그 확인 → 정확성 증명

### 5. Demand Elegance (Balanced)
- 비자명한 변경: "더 우아한 방법이 있는가?" 먼저 질문
- 해킹성 수정이 느껴지면: "모든 걸 알고 있다면, 우아한 해결책은?" 으로 재접근
- 간단하고 명확한 수정은 과도한 추상화 금지
- 제출 전 반드시 자기 코드 비판

### 6. Autonomous Bug Fixing
- 버그 리포트 수신 → 바로 수정. 손잡아달라고 하지 않기
- 로그·에러·실패 테스트를 직접 찾아서 해결
- 사용자 컨텍스트 스위칭 요구 없이 해결
- CI 실패 테스트는 지시 없이도 직접 수정

---

## 🛡️ Security & Code Quality

### 보안 기준 (이 프로젝트 전용)
- **supabase.server.ts는 절대 "use client" 파일에서 import 금지** — Service Role 키 노출됨
- **어드민 API**: 모든 `/api/admin/*` 라우트는 `checkAdminAuth()` 먼저 호출
- **Secrets**: API 키·토큰·비밀번호는 절대 하드코딩 금지. 환경변수만 사용
- **Input Validation**: 모든 외부 입력(form, API, URL params)은 진입점에서 검증
- **SQL Injection**: Supabase SDK 파라미터 바인딩 사용 (raw query 금지)
- **XSS**: `dangerouslySetInnerHTML`은 JSON.stringify(schema) 전용으로만 사용
- **Auth**: 인증/인가 로직은 서버 사이드에서만 처리

### 이 프로젝트의 env 변수 목록
```bash
# 클라이언트 노출 가능
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_KAKAO_JS_KEY
NEXT_PUBLIC_KAKAO_REST_KEY
NEXT_PUBLIC_KAKAO_REDIRECT_URI

# 서버 전용 (절대 NEXT_PUBLIC 금지)
SUPABASE_SERVICE_ROLE_KEY   # supabase.server.ts 전용
KAKAO_CLIENT_SECRET
ANTHROPIC_API_KEY
ADMIN_PASSWORD              # x-admin-password 헤더 검증용
```

### 코드 품질 기준
- 함수 길이: 단일 책임 원칙. 50줄 초과 시 분리 검토
- 변수명: 축약어보다 명확한 이름 (예: `u` → `currentUser`)
- 주석: "무엇"이 아닌 "왜"를 설명
- 타입: `any` 사용 금지. 불가피하면 `unknown` + 타입가드
- 중복: DRY 원칙. 3회 반복되면 추상화 검토

### PR 셀프 체크리스트
```
[ ] npx tsc --noEmit 통과했는가?
[ ] npm run build 통과했는가?
[ ] supabase.server.ts를 client 컴포넌트에서 import하지 않았는가?
[ ] 새로운 env 변수가 이 파일의 env 목록에 추가됐는가?
[ ] 어드민 API에 checkAdminAuth()가 붙어있는가?
[ ] 에러 메시지에 민감 정보(키, 비밀번호)가 노출되지 않는가?
[ ] 새 의존성이 정말 필요한가?
```

---

## 🚨 Error Handling Strategy

### 에러 계층 구조
```
UserError     → 사용자에게 친절한 메시지 표시 (4xx)
SystemError   → 내부 로그 + 모니터링 알림 (5xx)
NetworkError  → 재시도 로직 + fallback UI
ValidationError → 필드별 구체적 피드백
```

### 에러 처리 원칙
- **Fail Fast**: 문제를 조용히 삼키지 말고 빠르게 표면화
- **Graceful Degradation**: 전체 페이지 crash 대신 해당 컴포넌트만 fallback
- **Log Context**: 에러 로그에는 항상 `userId`, `requestId`, `timestamp` 포함
- **No Silent Catch**: `catch(e) {}` 빈 블록 절대 금지 — 최소 console.error
- **Retry Logic**: 네트워크 요청은 최대 3회, exponential backoff 적용

### 솔로 개발자 모니터링
- 에러 경계(Error Boundary) 필수 설정
- 치명 에러는 본인 이메일/슬랙으로 즉시 알림
- 로컬 에러: console.error + 재현 방법 주석
- 프로덕션 에러: [미입력] — Sentry 미연동 (도입 고려)

---

## 📋 Task Management

1. **Plan First**    : tasks/todo.md에 체크 가능한 항목으로 계획 작성
2. **Verify Plan**   : 구현 시작 전 계획 재확인
3. **Track Progress**: 완료 항목 즉시 체크
4. **Explain Changes**: 각 단계별 고수준 요약
5. **Document Results**: tasks/todo.md에 리뷰 섹션 추가
6. **Capture Lessons**: 수정 발생 후 tasks/lessons.md 업데이트

---

## 🧠 Core Principles

- **Simplicity First** : 변경은 최대한 단순하게. 최소 코드에 최대 임팩트
- **No Laziness**      : 근본 원인 해결. 임시방편·하드코딩 금지. 시니어 기준
- **Minimal Impact**   : 필요한 것만 건드리기. 버그 유입 방지
- **Solo-Friendly**    : 미래의 나도 이해할 수 있는 코드를 작성
- **Ship It**          : 완벽주의보다 작동하는 결과물 우선. 단 품질 기준 내에서

---

## 📝 Notes — 프로젝트 특이사항

### 아키텍처 결정 사항
- **서버/클라이언트 분리 패턴**: 페이지는 `page.tsx`(Server) + `*Client.tsx`(Client) 쌍으로 구성
- **Supabase 이중 클라이언트**: `supabase.ts`(클라이언트, RLS 적용) vs `supabase.server.ts`(서버, Service Role)
- **상태 관리**: Zustand 대신 React Context + useReducer 패턴 (`src/lib/store.tsx`)
- **어드민 인증**: JWT/세션 없이 단순 헤더(`x-admin-password`) 방식 사용

### 알려진 기술 부채
- 테스트 코드 전무 — E2E나 단위 테스트 도입 필요
- `src/lib/mockData.ts`가 여전히 존재 — 정리 필요
- PowerShell에서 한글 git commit 메시지 인코딩 오류 → **영문 커밋 메시지** 사용
- Sentry 등 에러 트래킹 미연동

### 한글 커밋 메시지 주의
PowerShell에서 한글 포함 커밋 메시지는 pathspec 에러 발생.
→ **항상 영문으로 커밋 메시지 작성**
```bash
# ❌ 오류
git commit -m "자유게시판 추가"
# ✅ 정상
git commit -m "feat: free board (posts + comments)"
```

### Supabase 테이블 목록
- `reviews` — 부업 후기
- `comments` — 후기 댓글
- `posts` — 자유게시판 글
- `post_comments` — 게시판 댓글 (트리거로 posts.comment_count 자동 업데이트)
- `hustle_summaries` — AI 요약 캐시 (hustle_id PK)
- `reports` — 신고
- `click_events` — 클릭 통계
- `honeypot_*` — 스팸 봇 트랩용 (middleware.ts에서 처리)

### 배포 플로우
```
git push origin main → Vercel 자동 배포 (약 1~2분)
환경변수: Vercel 대시보드에서 관리 (npx vercel env add로 추가)
```
