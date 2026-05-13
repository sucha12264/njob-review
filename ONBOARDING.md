# N잡 후기판 (side-job-checker) — 온보딩 문서

## 프로젝트 개요
- **서비스**: N잡·온라인 부업 후기 커뮤니티
- **URL**: https://side-job-checker.vercel.app
- **스택**: Next.js 16 (App Router) / TypeScript / Supabase / Tailwind CSS
- **경로**: `C:\Users\정수찬\Desktop\클로드\side-job-checker`

---

## 최근 완료된 작업 (이 세션)

### 1. 리뷰 대량 삽입 완료
- 62개 hustle 페이지 각 8개 리뷰 완성 (총 507개)
- 스크립트: `scripts/seed-bulk-reviews.ts` ~ `seed-bulk-reviews-4.ts`

### 2. 익명 리뷰 작성 (IP + 비밀번호)
- `reviews` 테이블에 `anon_password_hash`, `anon_ip` 컬럼 추가 (Supabase SQL Editor에서 직접 실행)
- `src/lib/serverAuth.ts` — `hashAnonPassword()` HMAC-SHA256 함수 추가
- `src/app/api/reviews/route.ts` — 익명 작성 시 비밀번호 해시 + IP 저장
- `src/app/api/review/[id]/route.ts` — 카카오 OR 비밀번호 기반 DELETE
- `src/app/api/review/[id]/verify-password/route.ts` — 비밀번호 검증 엔드포인트 (NEW)
- `src/app/write/page.tsx` — 미로그인 시 🔒 익명 섹션 + 비밀번호 필드 표시
- `src/app/review/[id]/ReviewDetailClient.tsx` — 익명 작성 후기 localStorage 저장 + 삭제 모달

### 3. 조합 필터 (수입범위/난이도/만족도)
- `src/lib/store.tsx` — `filterIncome`, `filterDifficulty`, `filterSatisfaction`, `activeFilterCount`, `resetFilters` 추가
- `src/app/HomeClient.tsx` — 🎚 필터 버튼, 3개 필터 패널, 활성 칩, 초기화 버튼

### 4. 부업 이름 검색 (전역 검색 모달)
- `src/components/SearchModal.tsx` — 인스턴트 검색, 키보드 네비(↑↓↵), 최근 검색어 localStorage
- `src/components/SearchTrigger.tsx` — 헤더 검색 버튼 + Ctrl+K 단축키
- `src/app/layout.tsx` — 헤더에 SearchTrigger 삽입
- `src/components/BottomNav.tsx` — 모바일 하단 네비에 🔍 검색 탭 추가

### 5. 리뷰 정렬 개선
- `src/lib/store.tsx` — sortBy에 `"satisfaction"` 추가, 정렬 로직 추가
- `src/app/HomeClient.tsx` — "평점순" 정렬 버튼 추가
- `src/app/hustle/[id]/HustlePageClient.tsx` — 🕐최신/❤️좋아요/⭐평점 정렬 버튼 + 더보기 페이지네이션

---

### 6. 필터링 강화 (조합 필터 개선)
- `src/lib/store.tsx` — `filterReviewCategory` 추가, 난이도 필터 이하(<=) 방식 변경, DifficultyFilter 타입 `0|2|3|4`
- `src/app/HomeClient.tsx` — 카테고리 필터 행, 프리셋 버튼(초보자/고수익/SNS/만족도최상), 옵션별 후기 수 표시

### 7. 부업 비교 페이지 /compare
- `src/app/compare/page.tsx` + `CompareClient.tsx` — URL params(?a=&b=), 인기 비교 6쌍, 상세 비교 테이블, 버딕트 추천

### 8. 부업 추천 페이지 /recommend
- `src/app/recommend/page.tsx` — 8가지 시나리오(초보자/직장인/재택/무료/고수익/콘텐츠/전문직/패시브인컴), FAQ JSON-LD

### 9. 네비게이션 + SEO 업데이트
- `src/app/layout.tsx` — 헤더에 추천·비교 링크 추가, 푸터 링크 추가
- `src/components/BottomNav.tsx` — 모바일 랭킹 탭 → 추천 탭으로 교체
- `src/app/sitemap.ts` — /recommend, /compare 우선순위 높게 추가
- `src/app/hustle/[id]/page.tsx` — 메타 description에 oneline·장점 포함

---

## 아직 하지 않은 것들 (잠재적 다음 작업)

- SEO: 구글 서치콘솔 등록, 네이버 서치어드바이저 등록 (아래 가이드 참고)
- 실제 사용자 유입 SNS 홍보
- Sentry 에러 트래킹 연동
- 어드민 대시보드에서 IP 기반 어뷰징 차단 기능

### 구글 서치콘솔 등록 방법
1. https://search.google.com/search-console 접속 → 속성 추가
2. URL 접두어 방식 선택 → `https://njob-review.vercel.app` 입력
3. HTML 태그 인증 방식 선택 → 메타태그 복사
4. `src/app/layout.tsx`의 `metadata` 객체에 추가:
   ```ts
   verification: { google: "발급받은_코드" }
   ```
5. Vercel 배포 후 서치콘솔에서 확인 클릭
6. 사이드바 → Sitemaps → `https://njob-review.vercel.app/sitemap.xml` 제출

### 네이버 서치어드바이저 등록 방법
1. https://searchadvisor.naver.com 접속 → 사이트 등록
2. `https://njob-review.vercel.app` 입력
3. HTML 태그 인증 → 메타태그 복사
4. `src/app/layout.tsx`의 `metadata` 객체에 추가:
   ```ts
   verification: { google: "구글코드", naver: "네이버코드" }
   ```
   (Next.js는 naver를 other로 처리: `other: { "naver-site-verification": "코드" }`)
5. 배포 후 서치어드바이저에서 소유 확인
6. 요청 → 웹 페이지 수집 → sitemap.xml URL 제출

---

## 핵심 환경 정보

### Supabase
- URL: `https://qruymdekquikterbqhdo.supabase.co`
- Service Role Key: `.env.local`의 `SUPABASE_SERVICE_ROLE_KEY`
- SQL Editor: https://supabase.com/dashboard/project/qruymdekquikterbqhdo/sql

### 배포
```bash
npx vercel --prod   # Vercel 배포
npx tsc --noEmit    # 타입 체크
npm run build       # 빌드 검증
```

### 주요 DB 테이블
- `reviews` — 부업 후기 (anon_password_hash, anon_ip 포함)
- `comments` — 후기 댓글
- `posts` / `post_comments` — 자유게시판
- `hustle_questions` / `hustle_answers` — 부업별 Q&A
- `reports`, `click_events` — 신고, 클릭 통계

### 주요 파일
- `src/lib/store.tsx` — 전역 상태 (리뷰, 필터, 정렬)
- `src/lib/hustleData.ts` — 62개 부업 정적 데이터
- `src/app/write/page.tsx` — 후기 작성 폼
- `src/app/HomeClient.tsx` — 홈 (부업 탐색 + 후기 피드)
- `src/app/hustle/[id]/HustlePageClient.tsx` — 부업 상세
- `CLAUDE.md` — 전체 프로젝트 지침서
