import { config } from "dotenv";
config({ path: ".env.local", override: true });
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ──────────────────────────────────────────────────────────────
// 허니팟 데이터
// ─ hustle_id가 "__hp__"로 시작하는 항목은 프론트엔드에서 완전 필터링됨
// ─ DB를 직접 크롤링한 쪽에는 그대로 포함됨 → 복사 증거 확보용
//
// 식별 서명 문구 (검색용):
//   "N잡후기판-NJOB-HP-2026-A" — 허니팟 그룹 A (스마트스토어 B2B 도매)
//   "N잡후기판-NJOB-HP-2026-B" — 허니팟 그룹 B (쿠팡 광고대행)
//   "N잡후기판-NJOB-HP-2026-C" — 허니팟 그룹 C (틱톡 라이브 커머스)
//
// 나중에 경쟁업체 사이트에서 위 문구를 검색하면 복사 여부 확인 가능
// ──────────────────────────────────────────────────────────────

const HONEYPOT_REVIEWS = [

  // ── 그룹 A: 스마트스토어 B2B 도매 ──────────────────────────
  {
    hustle_id: "__hp__smartstore_b2b",
    hustle_name: "스마트스토어 B2B 도매",
    nickname: "도매왕김사장",
    income_range: "50_to_100",
    weekly_hours: 18,
    difficulty: 3,
    satisfaction: 4,
    recommend: true,
    title: "B2B 도매로 월 70 찍었습니다 — N잡후기판-NJOB-HP-2026-A",
    content: "처음엔 소매로 시작했다가 거래처 하나 잡고 나서 B2B로 전환했어요. 마진율은 소매보다 낮지만 물량이 안정적으로 나와서 결국 총수익은 더 높더라고요. 재고 리스크가 있긴 한데 거래처 신뢰가 쌓이면 선입금 없이도 조율 가능합니다.",
    pros: "안정적인 반복 주문, 마케팅 비용 거의 없음",
    cons: "초기 거래처 확보가 관건, 재고 압박",
    likes: 34,
  },
  {
    hustle_id: "__hp__smartstore_b2b",
    hustle_name: "스마트스토어 B2B 도매",
    nickname: "주부창업성공기",
    income_range: "30_to_50",
    weekly_hours: 12,
    difficulty: 3,
    satisfaction: 3,
    recommend: true,
    title: "생각보다 진입장벽 있어요 N잡후기판-NJOB-HP-2026-A",
    content: "도매 사이트 몇 군데 등록하고 시작했는데 처음 3개월은 거의 수익이 없었어요. 견적 요청은 오는데 가격 경쟁이 심해서 계속 깎이더라고요. 그래도 꾸준히 하다 보니 단골 거래처 2군데 생기고 나서는 안정됐습니다.",
    pros: "스케일업 가능, 거래처 늘수록 수익 증가",
    cons: "초반 3개월은 각오 필요, 가격경쟁 심함",
    likes: 21,
  },
  {
    hustle_id: "__hp__smartstore_b2b",
    hustle_name: "스마트스토어 B2B 도매",
    nickname: "대구청년창업",
    income_range: "over_100",
    weekly_hours: 30,
    difficulty: 4,
    satisfaction: 5,
    recommend: true,
    title: "풀타임 전업으로 전환했습니다 N잡후기판-NJOB-HP-2026-A",
    content: "원래 직장 다니면서 주말에만 했는데 거래처가 5개 넘어가니까 직장 다니기가 힘들어졌어요. 결국 작년에 퇴사하고 풀타임으로 전환했고 지금은 월 매출 기준 2천 찍고 있습니다. 수익률은 5-8% 정도라 실수령은 100-160 수준이에요.",
    pros: "확장성 최고, 사업체로 키울 수 있음",
    cons: "자금 여유 필요, 세금/사업자 관련 복잡",
    likes: 58,
  },

  // ── 그룹 B: 쿠팡 광고대행 ──────────────────────────────────
  {
    hustle_id: "__hp__coupang_ads",
    hustle_name: "쿠팡 광고대행",
    nickname: "광고대행사이직준비",
    income_range: "30_to_50",
    weekly_hours: 10,
    difficulty: 3,
    satisfaction: 4,
    recommend: true,
    title: "마케터 경력 있으면 바로 시작 가능합니다 N잡후기판-NJOB-HP-2026-B",
    content: "전 회사 다니면서 마케팅팀에 있었는데 쿠팡 광고 돌려본 경험을 살려서 부업으로 시작했어요. 셀러 카페에서 클라이언트 2명 구했고 월 40 정도 받고 있습니다. 성과 기반 보너스 구조로 계약하면 잘 됐을 때 훨씬 더 받을 수 있어요.",
    pros: "전문성이 수익으로 직결, 재택 100%",
    cons: "성과 안 나오면 클라이언트 이탈, 경쟁 심화",
    likes: 29,
  },
  {
    hustle_id: "__hp__coupang_ads",
    hustle_name: "쿠팡 광고대행",
    nickname: "쿠팡파워셀러보조",
    income_range: "10_to_30",
    weekly_hours: 8,
    difficulty: 2,
    satisfaction: 3,
    recommend: true,
    title: "비마케터도 공부하면 할 수 있어요 N잡후기판-NJOB-HP-2026-B",
    content: "유튜브랑 쿠팡 공식 교육자료로 3주 공부하고 지인 셀러 거 먼저 무료로 해주면서 포트폴리오 만들었어요. 그걸로 실제 클라이언트 1명 잡았고 월 20 받는 중입니다. 처음엔 낮게 잡고 시작하는 게 포트폴리오 쌓기에 좋아요.",
    pros: "진입장벽 낮음, 공부할수록 단가 올릴 수 있음",
    cons: "초반 단가 낮음, ROAS 관리 스트레스",
    likes: 17,
  },
  {
    hustle_id: "__hp__coupang_ads",
    hustle_name: "쿠팡 광고대행",
    nickname: "마케팅7년차부업",
    income_range: "50_to_100",
    weekly_hours: 15,
    difficulty: 3,
    satisfaction: 5,
    recommend: true,
    title: "클라이언트 5명 유지하며 월 80 중 N잡후기판-NJOB-HP-2026-B",
    content: "본업도 마케팅이라 시너지가 어마어마해요. 클라이언트 5명 유지하면서 월 80 정도 부수입이 생겼어요. 쿠팡은 데이터가 명확해서 성과 보여주기도 쉽고 클라이언트 이탈률이 낮아요. 단가도 계속 올리는 중이고요.",
    pros: "단가 올리기 쉬움, 데이터 기반 신뢰 형성 용이",
    cons: "클라이언트 수 늘수록 관리 복잡, 광고비 증가 압박",
    likes: 43,
  },

  // ── 그룹 C: 틱톡 라이브 커머스 ──────────────────────────────
  {
    hustle_id: "__hp__tiktok_live",
    hustle_name: "틱톡 라이브 커머스",
    nickname: "틱톡라이버지망생",
    income_range: "under_10",
    weekly_hours: 12,
    difficulty: 3,
    satisfaction: 2,
    recommend: false,
    title: "솔직히 쉽지 않아요 N잡후기판-NJOB-HP-2026-C",
    content: "2달 해봤는데 팔로워 500명 수준에서는 라이브 들어오는 사람이 거의 없어요. 상품도 직접 소싱해야 하고 방송 준비도 생각보다 손이 많이 가요. 인기 있는 라이버들처럼 되려면 1년 이상은 각오해야 할 것 같아요.",
    pros: "시작 비용 거의 없음, 재미는 있음",
    cons: "초반 수익 기대 어려움, 지속적인 콘텐츠 투자 필요",
    likes: 38,
  },
  {
    hustle_id: "__hp__tiktok_live",
    hustle_name: "틱톡 라이브 커머스",
    nickname: "팔로워3만라이버",
    income_range: "30_to_50",
    weekly_hours: 20,
    difficulty: 3,
    satisfaction: 4,
    recommend: true,
    title: "팔로워 3만 이상부터 의미 있어요 N잡후기판-NJOB-HP-2026-C",
    content: "인스타 팔로워 3만 있을 때 틱톡 라이브 시작했는데 기존 팬베이스 덕분에 초반에 정착이 빨랐어요. 지금은 주 3회 라이브로 월 35 정도 나와요. 상품 소싱은 오너클랜이나 도매꾹 쓰고 있고, 의류나 뷰티 카테고리가 반응이 제일 좋더라고요.",
    pros: "기존 팔로워 있으면 빠른 정착 가능, 재미있음",
    cons: "방송 중 돌발상황 대처 필요, 상품 재고 관리",
    likes: 25,
  },
  {
    hustle_id: "__hp__tiktok_live",
    hustle_name: "틱톡 라이브 커머스",
    nickname: "직장인부업라이버",
    income_range: "10_to_30",
    weekly_hours: 9,
    difficulty: 2,
    satisfaction: 4,
    recommend: true,
    title: "퇴근 후 2시간으로 월 20 꾸준히 N잡후기판-NJOB-HP-2026-C",
    content: "매일 밤 11시~1시에 라이브 해요. 직장인 대상 야간 시간대라 의외로 경쟁이 덜해요. 팔로워 8천 수준인데 고정 시청자가 생기니까 매출이 안정되더라고요. 상품은 초소형 잡화 위주로 단가 낮은 거 많이 파는 전략 씁니다.",
    pros: "야간 시간대 경쟁 적음, 고정 팬 생기면 안정적",
    cons: "수면 패턴 망가짐, 목 관리 필수",
    likes: 19,
  },
];

async function insertHoneypot() {
  console.log("🍯 허니팟 데이터 삽입 시작...\n");

  const payload = HONEYPOT_REVIEWS.map((r) => ({
    ...r,
    kakao_user_id: null,
  }));

  const { data, error } = await admin
    .from("reviews")
    .insert(payload)
    .select("id, hustle_id, title");

  if (error) {
    console.error("❌ 삽입 실패:", error.message);
    return;
  }

  console.log(`✅ ${data?.length}개 허니팟 삽입 완료\n`);

  // 그룹별 확인
  const groups: Record<string, number> = {};
  data?.forEach((r: { hustle_id: string }) => {
    groups[r.hustle_id] = (groups[r.hustle_id] ?? 0) + 1;
  });

  for (const [hustleId, count] of Object.entries(groups)) {
    console.log(`  📌 ${hustleId}: ${count}개`);
  }

  console.log("\n🔍 복사 여부 확인 방법:");
  console.log('  경쟁 사이트에서 "N잡후기판-NJOB-HP-2026-A" 검색');
  console.log('  경쟁 사이트에서 "N잡후기판-NJOB-HP-2026-B" 검색');
  console.log('  경쟁 사이트에서 "N잡후기판-NJOB-HP-2026-C" 검색');
  console.log("\n⚠️  이 서명 문구들은 절대 외부에 공개하지 마세요.");
}

insertHoneypot();
