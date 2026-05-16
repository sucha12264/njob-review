/**
 * seed-reviews.ts
 *
 * 후기가 0개인 부업에 대해:
 *  1. 네이버 블로그 검색 API로 실제 경험 스니펫 수집
 *  2. Claude Haiku로 2차 재창작 후기 2개 생성
 *  3. Supabase에 직접 삽입
 *
 * 실행: npx tsx scripts/seed-reviews.ts
 */

import { config } from "dotenv";
config({ path: ".env.local", override: true });

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// ─── 환경변수 검증 ─────────────────────────────────────────
const ENV = {
  supabaseUrl:    process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey:    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  anthropicKey:   process.env.ANTHROPIC_API_KEY!,
  naverClientId:  process.env.NAVER_CLIENT_ID!,
  naverSecret:    process.env.NAVER_CLIENT_SECRET!,
};

for (const [k, v] of Object.entries(ENV)) {
  if (!v) { console.error(`❌ 환경변수 누락: ${k}`); process.exit(1); }
}

// ─── 클라이언트 ────────────────────────────────────────────
const supabase  = createClient(ENV.supabaseUrl, ENV.supabaseKey);
const anthropic = new Anthropic({ apiKey: ENV.anthropicKey });

// ─── 타입 ──────────────────────────────────────────────────
type IncomeRange = "under_10" | "10_to_30" | "30_to_50" | "50_to_100" | "over_100";

interface Hustle {
  id: string;
  name: string;
  incomeRange: string;
  difficulty: number;
  isTerminated?: boolean;
}

interface GeneratedReview {
  nickname:     string;
  income_range: IncomeRange;
  weekly_hours: number;
  difficulty:   number;
  satisfaction: number;
  title:        string;
  content:      string;
  pros:         string;
  cons:         string;
  recommend:    boolean;
}

// ─── 부업 목록 ─────────────────────────────────────────────
const ALL_HUSTLES: Hustle[] = [
  { id: "youtube",             name: "유튜브 채널 운영",                 incomeRange: "월 0~500만원+",          difficulty: 5 },
  { id: "youtube-shorts",      name: "유튜브 쇼츠",                      incomeRange: "월 0~50만원",             difficulty: 3 },
  { id: "tiktok",              name: "틱톡 크리에이터",                   incomeRange: "월 0~200만원",            difficulty: 3 },
  { id: "instagram-sponsor",   name: "인스타그램 협찬·광고",              incomeRange: "건당 5~500만원",          difficulty: 4 },
  { id: "naver-influencer",    name: "네이버 인플루언서",                 incomeRange: "월 10~200만원",           difficulty: 3 },
  { id: "naver-blog",          name: "네이버 블로그 애드포스트",           incomeRange: "월 5~100만원",            difficulty: 2 },
  { id: "tistory",             name: "티스토리 블로그 구글 애드센스",      incomeRange: "월 0~150만원",            difficulty: 3 },
  { id: "kakao-view",          name: "카카오뷰",                          incomeRange: "월 0~30만원",             difficulty: 1, isTerminated: true },
  { id: "brunch",              name: "브런치 작가",                       incomeRange: "부가 수익",               difficulty: 2 },
  { id: "newsletter",          name: "뉴스레터 서브스택 스티비",           incomeRange: "월 0~300만원",            difficulty: 3 },
  { id: "threads",             name: "스레드 운영",                       incomeRange: "협찬 수익",               difficulty: 2 },
  { id: "coupang-partners",    name: "쿠팡파트너스",                      incomeRange: "월 1~500만원",            difficulty: 1 },
  { id: "linkprice",           name: "링크프라이스",                      incomeRange: "월 1~100만원",            difficulty: 2 },
  { id: "tenping",             name: "텐핑",                              incomeRange: "월 1~50만원",             difficulty: 1 },
  { id: "amazon-associates",   name: "아마존 어소시에이트",               incomeRange: "월 1~200만원",            difficulty: 3 },
  { id: "ilikepick",           name: "아이라이크픽",                      incomeRange: "월 5~50만원",             difficulty: 1 },
  { id: "kmong",               name: "크몽",                              incomeRange: "월 10~500만원",           difficulty: 3 },
  { id: "soomgo",              name: "숨고",                              incomeRange: "월 10~300만원",           difficulty: 2 },
  { id: "wishket",             name: "위시켓",                            incomeRange: "프로젝트당 100~3000만원", difficulty: 4 },
  { id: "freemoa",             name: "프리모아",                          incomeRange: "프로젝트당 50~2000만원",  difficulty: 4 },
  { id: "upwork",              name: "업워크 해외 프리랜서",              incomeRange: "시간당 $10~$100",         difficulty: 5 },
  { id: "class101",            name: "클래스101",                         incomeRange: "월 10~500만원",           difficulty: 3 },
  { id: "taling",              name: "탈잉",                              incomeRange: "월 10~200만원",           difficulty: 3 },
  { id: "online-tutoring",     name: "온라인 과외",                       incomeRange: "월 20~200만원",           difficulty: 2 },
  { id: "udemy",               name: "유데미 강의 등록",                  incomeRange: "월 5~300만원",            difficulty: 3 },
  { id: "smart-store",         name: "스마트스토어",                      incomeRange: "월 0~1000만원+",          difficulty: 3 },
  { id: "coupang-rocket",      name: "쿠팡 로켓그로스",                   incomeRange: "월 0~500만원",            difficulty: 3 },
  { id: "ably-seller",         name: "에이블리 셀러",                     incomeRange: "월 0~300만원",            difficulty: 3 },
  { id: "amazon-fba",          name: "아마존 FBA",                        incomeRange: "월 0~1000만원+",          difficulty: 5 },
  { id: "aliexpress-dropshipping", name: "알리 드롭쉬핑",                incomeRange: "월 0~200만원",            difficulty: 3 },
  { id: "instagram-shop",      name: "인스타그램 쇼핑몰",                 incomeRange: "월 0~300만원",            difficulty: 3 },
  { id: "musinsa-store",       name: "무신사 스토어",                     incomeRange: "월 0~수천만원",           difficulty: 5 },
  { id: "kream",               name: "KREAM 스니커즈 리셀",               incomeRange: "건당 1~50만원",           difficulty: 3 },
  { id: "bunjang-resell",      name: "번개장터 리셀",                     incomeRange: "건당 1~30만원",           difficulty: 2 },
  { id: "used-flip",           name: "당근마켓 중고 플리핑",              incomeRange: "월 10~100만원",           difficulty: 2 },
  { id: "ticket-resell",       name: "공연 티켓 리셀",                    incomeRange: "건당 1~20만원",           difficulty: 2 },
  { id: "pokemon-card",        name: "포켓몬 트레이딩 카드 리셀",         incomeRange: "건당 1~100만원",          difficulty: 3 },
  { id: "cashslide",           name: "캐시슬라이드 잠금화면 앱테크",      incomeRange: "월 1~5만원",              difficulty: 1 },
  { id: "panel-now",           name: "패널나우 설문조사",                 incomeRange: "월 1~10만원",             difficulty: 1 },
  { id: "toss-benefit",        name: "토스 금융앱 혜택 수익",             incomeRange: "월 1~5만원",              difficulty: 1 },
  { id: "data-labeling",       name: "데이터 라벨링",                     incomeRange: "월 5~30만원",             difficulty: 1 },
  { id: "app-testing",         name: "앱 웹 테스트 유저테스팅",           incomeRange: "건당 1~3만원",            difficulty: 1 },
  { id: "stock-dividend",      name: "배당주 투자",                       incomeRange: "연 2~8% 배당",            difficulty: 3 },
  { id: "etf-investing",       name: "ETF 적립식 투자",                   incomeRange: "연 5~15% 기대수익",       difficulty: 2 },
  { id: "crypto",              name: "코인 투자",                         incomeRange: "변동성 매우 높음",         difficulty: 4 },
  { id: "p2p-lending",         name: "P2P 투자 피플펀드",                 incomeRange: "연 5~10%",                difficulty: 2 },
  { id: "baemin-rider",        name: "배달의민족 라이더",                 incomeRange: "시간당 1.5~2.5만원",      difficulty: 2 },
  { id: "coupang-flex",        name: "쿠팡플렉스",                        incomeRange: "4~5시간에 5~8만원",       difficulty: 2 },
  { id: "kakao-driver",        name: "카카오T 대리운전",                  incomeRange: "시간당 1.5~3만원",        difficulty: 2 },
  { id: "kick-charge",         name: "킥보드 충전 씽씽",                  incomeRange: "건당 1000~5000원",        difficulty: 1 },
  { id: "ebook",               name: "전자책 출판",                       incomeRange: "월 5~500만원",            difficulty: 2 },
  { id: "notion-template",     name: "노션 템플릿 판매",                  incomeRange: "월 5~200만원",            difficulty: 2 },
  { id: "stock-photo",         name: "스톡 사진 영상 판매",               incomeRange: "월 1~50만원",             difficulty: 3 },
  { id: "ai-prompt",           name: "AI 프롬프트 판매",                  incomeRange: "건당 1~5달러",            difficulty: 2 },
  { id: "bgm-music",           name: "BGM 음악 판매 AudioJungle",         incomeRange: "건당 $5~$50",             difficulty: 4 },
  { id: "figma-template",      name: "Figma PPT 템플릿 판매",             incomeRange: "건당 $5~$50",             difficulty: 3 },
  { id: "esim-palee",          name: "E심팔이 eSIM 재판매",               incomeRange: "월 10~200만원",           difficulty: 2 },
  { id: "reelfix",             name: "릴픽스",                            incomeRange: "건당 2~10만원",           difficulty: 3 },
  { id: "chatgpt-service",     name: "AI 자동화 서비스 판매",             incomeRange: "건당 5~100만원",          difficulty: 3 },
  { id: "translation",         name: "번역 프리랜서 플리토",              incomeRange: "월 10~100만원",           difficulty: 3 },
  { id: "virtual-assistant",   name: "가상 비서 VA 서비스",               incomeRange: "시간당 1~5만원",          difficulty: 2 },
  { id: "nft",                 name: "NFT 제작 판매",                     incomeRange: "변동성 매우 높음",         difficulty: 4 },
  { id: "game-boosting",       name: "게임 대리육성 코칭",                incomeRange: "건당 1~5만원",            difficulty: 3 },
];

// ─── 네이버 블로그 검색 ────────────────────────────────────
async function searchNaver(hustleName: string): Promise<string[]> {
  const query = `${hustleName} 후기 수익 실제`;
  const url = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=5&sort=sim`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id":     ENV.naverClientId,
      "X-Naver-Client-Secret": ENV.naverSecret,
    },
  });

  if (!res.ok) return [];

  const data = await res.json() as { items?: { description: string }[] };
  return (data.items ?? [])
    .map((item) => item.description.replace(/<[^>]+>/g, "").trim())
    .filter((s) => s.length > 30);
}

// ─── Claude Haiku 재창작 (count개 생성) ──────────────────
async function generateReviews(
  hustle: Hustle,
  snippets: string[],
  count: number = 3,
  round: number = 1,       // 라운드별로 다양한 관점 유도
): Promise<GeneratedReview[]> {
  const context = snippets.length > 0
    ? `네이버 블로그 실제 경험 스니펫:\n---\n${snippets.slice(0, 5).join("\n---\n")}\n---`
    : `블로그 스니펫 없음. 부업 특성(${hustle.incomeRange} 수익, 난이도 ${hustle.difficulty}/5)을 바탕으로 작성.`;

  // 라운드마다 다른 페르소나 지시로 다양성 확보
  const personas = [
    "직장인(30대), 주부(40대), 대학생(20대)",
    "자영업자(40대), 프리랜서(30대), 취준생(20대)",
    "퇴직자(50대), 육아맘(30대), 직장초년생(20대)",
  ];
  const persona = personas[(round - 1) % personas.length];

  const prompt = `당신은 한국의 N잡러 커뮤니티에서 솔직한 부업 경험을 공유하는 사람입니다.

${context}

"${hustle.name}" 부업을 직접 해본 ${count}명의 후기를 완전히 새로운 문장으로 재창작해 주세요.
페르소나: ${persona}

조건:
- 각자 다른 경험, 다른 수익, 다른 시각
- 과장 없이 구체적 (실제 수치 포함)
- 만족도 분포: ${count}명 중 절반은 3점 이상, 절반은 3점 이하
- 이전 라운드와 겹치지 않도록 새로운 경험담

JSON 배열만 반환:
[
  {
    "nickname": "닉네임 (10자 이내, 예: 직장인김씨, 투잡30대, 육아맘, N잡초보)",
    "income_range": "under_10 또는 10_to_30 또는 30_to_50 또는 50_to_100 또는 over_100",
    "weekly_hours": 주당시간_1에서40,
    "difficulty": 난이도_1에서5,
    "satisfaction": 만족도_1에서5,
    "title": "후기 제목 (35자 이내)",
    "content": "후기 본문 (180자~280자)",
    "pros": "장점 한 문장 (40~80자)",
    "cons": "단점 한 문장 (40~80자)",
    "recommend": true 또는 false
  }
]`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: count * 700,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (msg.content[0] as { text: string }).text.trim();
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];

  try {
    return JSON.parse(match[0]) as GeneratedReview[];
  } catch {
    return [];
  }
}

// ─── DB: 부업별 현재 후기 수 조회 ────────────────────────
async function getReviewCounts(): Promise<Map<string, number>> {
  const { data } = await supabase
    .from("reviews")
    .select("hustle_id")
    .not("hustle_id", "like", "__hp__%");

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.hustle_id, (counts.get(row.hustle_id) ?? 0) + 1);
  }
  return counts;
}

// ─── DB: 빈 필드 있는 후기 보정 ──────────────────────────
async function patchEmptyReviews() {
  // pros 또는 cons가 비어있는 후기 조회
  const { data } = await supabase
    .from("reviews")
    .select("id, hustle_name, content, pros, cons")
    .not("hustle_id", "like", "__hp__%")
    .or("pros.eq.,cons.eq.,pros.is.null,cons.is.null");

  if (!data || data.length === 0) return;

  console.log(`\n🔧 빈 필드 후기 보정: ${data.length}개`);

  for (const review of data) {
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: `다음 부업 후기의 빈 장점/단점을 각각 한 문장(40~70자)으로 채워주세요.
부업명: ${review.hustle_name}
후기 내용: ${review.content}
JSON만 반환: {"pros": "장점 한 문장", "cons": "단점 한 문장"}`
      }],
    });

    const text = (msg.content[0] as { text: string }).text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) continue;

    try {
      const { pros, cons } = JSON.parse(match[0]) as { pros: string; cons: string };
      await supabase.from("reviews").update({
        pros: review.pros || String(pros).slice(0, 500),
        cons: review.cons || String(cons).slice(0, 500),
      }).eq("id", review.id);
      console.log(`  ✅ 보정: "${String(review.content).slice(0, 30)}..."`);
    } catch { /* 무시 */ }

    await sleep(600);
  }
}

// ─── sleep ────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── DB 삽입 헬퍼 ────────────────────────────────────────
async function insertReviews(hustle: Hustle, reviews: GeneratedReview[]): Promise<number> {
  let count = 0;
  for (const r of reviews) {
    const row = {
      nickname:        String(r.nickname ?? "익명").slice(0, 30),
      hustle_id:       hustle.id,
      hustle_name:     hustle.name,
      income_range:    r.income_range ?? "under_10",
      weekly_hours:    Math.min(40, Math.max(1, Number(r.weekly_hours) || 5)),
      difficulty:      Math.min(5,  Math.max(1, Number(r.difficulty)   || 3)),
      satisfaction:    Math.min(5,  Math.max(1, Number(r.satisfaction) || 3)),
      title:           String(r.title   ?? `${hustle.name} 후기`).slice(0, 100),
      content:         String(r.content ?? "").slice(0, 2000),
      pros:            String(r.pros    ?? "").slice(0, 500),
      cons:            String(r.cons    ?? "").slice(0, 500),
      recommend:       Boolean(r.recommend),
      proof_image_url: null,
      kakao_user_id:   null,
      likes:           0,
    };
    const { error } = await supabase.from("reviews").insert(row);
    if (error) console.error(`    ❌ DB 오류: ${error.message}`);
    else { console.log(`    ✅ ${row.nickname} — "${row.title}"`); count++; }
  }
  return count;
}

// ─── 메인 ────────────────────────────────────────────────
// 목표: 부업당 최소 TARGET_PER_HUSTLE개 후기
const TARGET_PER_HUSTLE = 8;
const PER_ROUND         = 3;   // 한 번 API 호출당 생성 수

async function main() {
  console.log("🚀 후기 대량 시딩 시작\n");

  // 1단계: 빈 필드 보정
  await patchEmptyReviews();

  // 2단계: 부업별 후기 수 확인
  const reviewCounts = await getReviewCounts();
  const targets = ALL_HUSTLES.filter((h) => !h.isTerminated);

  console.log(`\n📦 대상 부업: ${targets.length}개 (종료 제외)`);
  console.log(`🎯 목표: 부업당 최소 ${TARGET_PER_HUSTLE}개\n`);

  let totalInserted = 0;
  let totalSkipped  = 0;

  for (let i = 0; i < targets.length; i++) {
    const hustle   = targets[i];
    const existing = reviewCounts.get(hustle.id) ?? 0;
    const needed   = Math.max(0, TARGET_PER_HUSTLE - existing);

    if (needed === 0) {
      console.log(`[${i + 1}/${targets.length}] ✓ ${hustle.name} (이미 ${existing}개)`);
      continue;
    }

    console.log(`[${i + 1}/${targets.length}] ⚙️  ${hustle.name} (현재 ${existing}개 → +${needed}개 필요)`);

    // 네이버 검색 (부업당 한 번만)
    const snippets = await searchNaver(hustle.name);
    console.log(`    📰 스니펫 ${snippets.length}개`);

    // 필요한 만큼 라운드 반복 (PER_ROUND개씩)
    let addedForHustle = 0;
    let round = 1;

    while (addedForHustle < needed) {
      const toGenerate = Math.min(PER_ROUND, needed - addedForHustle);

      let reviews: GeneratedReview[] = [];
      try {
        reviews = await generateReviews(hustle, snippets, toGenerate, round);
      } catch (e) {
        console.error(`    ❌ 생성 실패 (라운드 ${round}):`, e);
        totalSkipped++;
        break;
      }

      if (reviews.length === 0) {
        console.log(`    ⚠️  결과 없음 (라운드 ${round})`);
        break;
      }

      const inserted = await insertReviews(hustle, reviews);
      addedForHustle += inserted;
      totalInserted  += inserted;
      round++;

      await sleep(1000);
    }

    await sleep(600);
  }

  console.log("\n─────────────────────────────────────");
  console.log(`🎉 완료!  총 등록: ${totalInserted}개  건너뜀: ${totalSkipped}건`);
}

main().catch((e) => { console.error(e); process.exit(1); });
