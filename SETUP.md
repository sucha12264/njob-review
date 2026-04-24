# N잡러 부업 안전진단 - 설치 가이드

## 1. 필수 요구사항

- Node.js 18+ ([nodejs.org](https://nodejs.org) 에서 설치)
- Anthropic API Key ([console.anthropic.com](https://console.anthropic.com))
- Supabase 프로젝트 ([supabase.com](https://supabase.com)) *(선택)*

---

## 2. 설치

```bash
cd side-job-checker
npm install
```

---

## 3. 환경 변수 설정

`.env.local.example`을 복사해서 `.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 값을 채워주세요:

```
ANTHROPIC_API_KEY=sk-ant-...   ← Anthropic Console에서 복사

# Supabase (진단 기록 저장을 원할 경우만 필요)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 4. Supabase 테이블 생성 *(선택)*

Supabase Dashboard → SQL Editor에서 `supabase-schema.sql` 내용을 실행하세요.

> Supabase 없이도 앱은 정상 동작합니다. 진단 기록이 저장되지 않을 뿐입니다.

---

## 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 6. 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 주요 파일 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 페이지
│   ├── layout.tsx            # 공통 레이아웃
│   ├── globals.css           # 전역 스타일
│   └── api/analyze/route.ts  # AI 분석 API (Claude)
├── components/
│   ├── DiagnosticForm.tsx    # 3단계 진단 폼
│   ├── ResultCard.tsx        # 결과 카드
│   └── RiskGauge.tsx         # 위험도 게이지
└── lib/
    ├── types.ts              # 타입 정의
    └── supabase.ts           # Supabase 클라이언트
```
