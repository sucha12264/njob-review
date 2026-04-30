/**
 * 부업별 후기 시드 스크립트
 * 실행: npx tsx scripts/seed-reviews.ts
 *
 * 인터넷 공개 정보를 바탕으로 Claude가 후기를 생성해 Supabase에 삽입합니다.
 * 각 후기 말미에 "※ 이 후기는 인터넷 공개 정보를 바탕으로 작성되었습니다" 고지가 포함됩니다.
 */

import { config } from "dotenv";
config({ path: ".env.local", override: true });
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// ─── 환경변수 ──────────────────────────────────────────────
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ 환경변수 누락: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 확인");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── 부업 목록 (hustleData.ts에서 추출) ───────────────────
const ALL_HUSTLES = [
  { id: "youtube", name: "유튜브 채널 운영", incomeRange: "월 0~500만원+", difficulty: 5 },
  { id: "youtube-shorts", name: "유튜브 쇼츠", incomeRange: "월 0~50만원", difficulty: 3 },
  { id: "tiktok", name: "틱톡 크리에이터", incomeRange: "월 0~200만원", difficulty: 3 },
  { id: "instagram-sponsor", name: "인스타그램 협찬·광고", incomeRange: "건당 5~500만원", difficulty: 4 },
  { id: "naver-influencer", name: "네이버 인플루언서", incomeRange: "월 10~200만원", difficulty: 3 },
  { id: "naver-blog", name: "네이버 블로그 (애드포스트)", incomeRange: "월 5~100만원", difficulty: 2 },
  { id: "tistory", name: "티스토리 블로그 (구글 애드센스)", incomeRange: "월 0~150만원", difficulty: 3 },
  { id: "kakao-view", name: "카카오뷰", incomeRange: "월 0~30만원", difficulty: 1 },
  { id: "brunch", name: "브런치 작가", incomeRange: "부가 수익", difficulty: 2 },
  { id: "newsletter", name: "뉴스레터 (서브스택·스티비)", incomeRange: "월 0~300만원", difficulty: 3 },
  { id: "threads", name: "스레드 (Threads) 운영", incomeRange: "협찬 수익", difficulty: 2 },
  { id: "coupang-partners", name: "쿠팡파트너스", incomeRange: "월 1~500만원", difficulty: 1 },
  { id: "linkprice", name: "링크프라이스", incomeRange: "월 1~100만원", difficulty: 2 },
  { id: "tenping", name: "텐핑", incomeRange: "월 1~50만원", difficulty: 1 },
  { id: "amazon-associates", name: "아마존 어소시에이트", incomeRange: "월 1~200만원", difficulty: 3 },
  { id: "ilikepick", name: "아이라이크픽", incomeRange: "월 5~50만원", difficulty: 1 },
  { id: "kmong", name: "크몽", incomeRange: "월 10~500만원", difficulty: 3 },
  { id: "soomgo", name: "숨고", incomeRange: "월 10~300만원", difficulty: 2 },
  { id: "wishket", name: "위시켓", incomeRange: "프로젝트당 100~3000만원", difficulty: 4 },
  { id: "freemoa", name: "프리모아", incomeRange: "프로젝트당 50~2000만원", difficulty: 4 },
  { id: "upwork", name: "업워크 (해외 프리랜서)", incomeRange: "시간당 $10~$100", difficulty: 5 },
  { id: "class101", name: "클래스101", incomeRange: "월 10~500만원", difficulty: 3 },
  { id: "taling", name: "탈잉", incomeRange: "월 10~200만원", difficulty: 3 },
  { id: "online-tutoring", name: "온라인 과외", incomeRange: "월 20~200만원", difficulty: 2 },
  { id: "udemy", name: "유데미 강의 등록", incomeRange: "월 5~300만원", difficulty: 3 },
  { id: "smart-store", name: "스마트스토어", incomeRange: "월 0~1000만원+", difficulty: 3 },
  { id: "coupang-rocket", name: "쿠팡 로켓그로스", incomeRange: "월 0~500만원", difficulty: 3 },
  { id: "ably-seller", name: "에이블리 셀러", incomeRange: "월 0~300만원", difficulty: 3 },
  { id: "amazon-fba", name: "아마존 FBA", incomeRange: "월 0~1000만원+", difficulty: 5 },
  { id: "aliexpress-dropshipping", name: "알리 드롭쉬핑", incomeRange: "월 0~200만원", difficulty: 3 },
  { id: "instagram-shop", name: "인스타그램 쇼핑몰", incomeRange: "월 0~300만원", difficulty: 3 },
  { id: "musinsa-store", name: "무신사 스토어", incomeRange: "월 0~수천만원", difficulty: 5 },
  { id: "kream", name: "KREAM 스니커즈 리셀", incomeRange: "건당 1~50만원", difficulty: 3 },
  { id: "bunjang-resell", name: "번개장터 리셀", incomeRange: "건당 1~30만원", difficulty: 2 },
  { id: "used-flip", name: "당근마켓 중고 플리핑", incomeRange: "월 10~100만원", difficulty: 2 },
  { id: "ticket-resell", name: "공연 티켓 리셀", incomeRange: "건당 1~20만원", difficulty: 2 },
  { id: "pokemon-card", name: "포켓몬·트레이딩 카드 리셀", incomeRange: "건당 1~100만원", difficulty: 3 },
  { id: "cashslide", name: "캐시슬라이드·잠금화면 앱테크", incomeRange: "월 1~5만원", difficulty: 1 },
  { id: "panel-now", name: "패널나우·설문조사", incomeRange: "월 1~10만원", difficulty: 1 },
  { id: "toss-benefit", name: "토스·금융앱 혜택 수익", incomeRange: "월 1~5만원", difficulty: 1 },
  { id: "data-labeling", name: "데이터 라벨링", incomeRange: "월 5~30만원", difficulty: 1 },
  { id: "app-testing", name: "앱·웹 테스트 (유저테스팅)", incomeRange: "건당 1~3만원", difficulty: 1 },
  { id: "stock-dividend", name: "배당주 투자", incomeRange: "연 2~8% 배당", difficulty: 3 },
  { id: "etf-investing", name: "ETF 적립식 투자", incomeRange: "연 5~15% 기대수익", difficulty: 2 },
  { id: "crypto", name: "코인 투자", incomeRange: "변동성 매우 높음", difficulty: 4 },
  { id: "p2p-lending", name: "P2P 투자 (피플펀드 등)", incomeRange: "연 5~10%", difficulty: 2 },
  { id: "baemin-rider", name: "배달의민족 라이더", incomeRange: "시간당 1.5~2.5만원", difficulty: 2 },
  { id: "coupang-flex", name: "쿠팡플렉스", incomeRange: "4~5시간에 5~8만원", difficulty: 2 },
  { id: "kakao-driver", name: "카카오T 대리운전", incomeRange: "시간당 1.5~3만원", difficulty: 2 },
  { id: "kick-charge", name: "킥보드 충전 (라임·씽씽)", incomeRange: "건당 1,000~5,000원", difficulty: 1 },
  { id: "ebook", name: "전자책 출판", incomeRange: "월 5~500만원", difficulty: 2 },
  { id: "notion-template", name: "노션 템플릿 판매", incomeRange: "월 5~200만원", difficulty: 2 },
  { id: "stock-photo", name: "스톡 사진·영상 판매", incomeRange: "월 1~50만원", difficulty: 3 },
  { id: "ai-prompt", name: "AI 프롬프트 판매", incomeRange: "건당 1~5달러", difficulty: 2 },
  { id: "bgm-music", name: "BGM·음악 판매 (AudioJungle)", incomeRange: "건당 $5~$50", difficulty: 4 },
  { id: "figma-template", name: "Figma·PPT 템플릿 판매", incomeRange: "건당 $5~$50", difficulty: 3 },
  { id: "esim-palee", name: "E심팔이 (eSIM 재판매)", incomeRange: "월 10~200만원", difficulty: 2 },
  { id: "reelfix", name: "릴픽스", incomeRange: "건당 2~10만원", difficulty: 3 },
  { id: "chatgpt-service", name: "AI 자동화 서비스 판매", incomeRange: "건당 5~100만원", difficulty: 3 },
  { id: "translation", name: "번역 프리랜서 (플리토 등)", incomeRange: "월 10~100만원", difficulty: 3 },
  { id: "virtual-assistant", name: "가상 비서 (VA) 서비스", incomeRange: "시간당 1~5만원", difficulty: 2 },
  { id: "nft", name: "NFT 제작·판매", incomeRange: "변동성 매우 높음", difficulty: 4 },
  { id: "game-boosting", name: "게임 대리육성·코칭", incomeRange: "건당 1~5만원", difficulty: 3 },
];

// ─── 닉네임 풀 ─────────────────────────────────────────────
const NICKNAMES = [
  "직장인박씨", "부업러김씨", "프리랜서최씨", "N잡러이씨", "사이드잡유씨",
  "월급쟁이정씨", "부업도전장씨", "투잡러강씨", "온라인벌이임씨", "퇴근후부업조씨",
  "주말부업오씨", "수익다각화한씨", "부업3년차신씨", "N잡경험자민씨", "부업초보서씨",
];

function randomNick() {
  return NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
}

// ─── income_range 추론 ─────────────────────────────────────
function guessIncomeRange(incomeStr: string): "under_10" | "10_to_30" | "30_to_50" | "50_to_100" | "over_100" {
  const s = incomeStr.toLowerCase();
  if (s.includes("500") || s.includes("1000") || s.includes("over_100") || s.includes("300만원+")) return "over_100";
  if (s.includes("100") || s.includes("200")) return "50_to_100";
  if (s.includes("50") || s.includes("30~50")) return "30_to_50";
  if (s.includes("10") || s.includes("20")) return "10_to_30";
  return "under_10";
}

// ─── Claude로 후기 배치 생성 ───────────────────────────────
interface ReviewData {
  title: string;
  content: string;
  pros: string;
  cons: string;
  income_range: "under_10" | "10_to_30" | "30_to_50" | "50_to_100" | "over_100";
  weekly_hours: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  satisfaction: 1 | 2 | 3 | 4 | 5;
  recommend: boolean;
}

async function generateReviews(hustles: typeof ALL_HUSTLES): Promise<Map<string, ReviewData[]>> {
  const hustleList = hustles.map(h => `- ${h.id}: ${h.name} (예상수익: ${h.incomeRange})`).join("\n");

  const prompt = `당신은 한국의 N잡러(부업 경험자)들의 솔직한 후기를 작성하는 역할입니다.
아래 부업 목록 각각에 대해 후기 2개를 JSON 형식으로 작성해 주세요.

부업 목록:
${hustleList}

요구사항:
- 각 부업의 현실적인 경험을 담은 솔직한 후기 (긍정 1개, 부정적이거나 현실적인 1개)
- 한국어로 자연스럽게 작성
- content는 3~5문장, pros/cons는 한 문장씩
- 내용 말미에 반드시 "※ 이 후기는 인터넷 공개 정보를 바탕으로 작성되었습니다" 추가
- income_range는 "under_10" | "10_to_30" | "30_to_50" | "50_to_100" | "over_100" 중 하나
- weekly_hours는 1~40 사이 숫자
- difficulty는 1~5 (1=매우쉬움, 5=매우어려움)
- satisfaction은 1~5
- recommend는 true/false

반드시 아래 JSON 형식만 반환 (마크다운 코드블록 없이):
{
  "reviews": {
    "hustle_id": [
      {
        "title": "...",
        "content": "...",
        "pros": "...",
        "cons": "...",
        "income_range": "...",
        "weekly_hours": 숫자,
        "difficulty": 숫자,
        "satisfaction": 숫자,
        "recommend": true/false
      }
    ]
  }
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (response.content[0] as { type: string; text: string }).text.trim();

  // JSON 파싱 (코드블록 제거)
  const jsonStr = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  const parsed = JSON.parse(jsonStr) as { reviews: Record<string, ReviewData[]> };

  const result = new Map<string, ReviewData[]>();
  for (const [id, reviews] of Object.entries(parsed.reviews)) {
    result.set(id, reviews);
  }
  return result;
}

// ─── Supabase 삽입 ─────────────────────────────────────────
async function insertReviews(hustleId: string, hustleName: string, reviews: ReviewData[]) {
  for (const r of reviews) {
    const row = {
      nickname: randomNick(),
      hustle_id: hustleId,
      hustle_name: hustleName,
      income_range: r.income_range,
      weekly_hours: r.weekly_hours,
      difficulty: r.difficulty,
      satisfaction: r.satisfaction,
      title: r.title,
      content: r.content,
      pros: r.pros,
      cons: r.cons,
      recommend: r.recommend,
      likes: Math.floor(Math.random() * 60),
      kakao_user_id: null,
    };

    const { error } = await supabase.from("reviews").insert(row);
    if (error) {
      console.error(`  ❌ 삽입 실패 (${hustleId}):`, error.message);
    } else {
      console.log(`  ✅ 삽입 완료: [${hustleName}] "${r.title.slice(0, 30)}..."`);
    }
  }
}

// ─── 메인 ──────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 후기 시드 시작: 총 ${ALL_HUSTLES.length}개 부업, 배치 5개씩\n`);

  const BATCH_SIZE = 5;
  let total = 0;

  for (let i = 0; i < ALL_HUSTLES.length; i += BATCH_SIZE) {
    const batch = ALL_HUSTLES.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 배치 ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ALL_HUSTLES.length / BATCH_SIZE)}: ${batch.map(h => h.name).join(", ")}`);

    try {
      const reviewMap = await generateReviews(batch);

      for (const hustle of batch) {
        const reviews = reviewMap.get(hustle.id);
        if (!reviews || reviews.length === 0) {
          console.warn(`  ⚠️  ${hustle.name}: 생성된 후기 없음`);
          continue;
        }
        await insertReviews(hustle.id, hustle.name, reviews);
        total += reviews.length;
      }
    } catch (err) {
      console.error(`  ❌ 배치 처리 오류:`, err);
    }

    // API rate limit 방지
    if (i + BATCH_SIZE < ALL_HUSTLES.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`\n✨ 완료! 총 ${total}개 후기 삽입\n`);
}

main().catch(console.error);
