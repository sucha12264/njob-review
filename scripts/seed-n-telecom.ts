/**
 * n-telecom 후기 8개 삽입
 * 실행: npx tsx scripts/seed-n-telecom.ts
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qruymdekquikterbqhdo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydXltZGVrcXVpa3RlcmJxaGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgxNTU4MCwiZXhwIjoyMDkyMzkxNTgwfQ.xGSxl5Q5Z38waPJI--TlMxuw3ASjx2KyD796_uS9G0c"
);

type IncomeRange = "under_10" | "10_to_30" | "30_to_50" | "50_to_100" | "over_100";

interface ReviewInput {
  hustle_id: string;
  hustle_name: string;
  nickname: string;
  income_range: IncomeRange;
  weekly_hours: number;
  difficulty: number;
  satisfaction: number;
  title: string;
  content: string;
  pros: string;
  cons: string;
  recommend: boolean;
}

const REVIEWS: ReviewInput[] = [
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "알뜰폰대리점6개월차",
    income_range: "10_to_30",
    weekly_hours: 8,
    difficulty: 2,
    satisfaction: 4,
    title: "초기비용 부담됐지만 6개월 지나니 수수료가 쌓이네요",
    content: "처음에 116만원이라는 초기비용에 망설였어요. 근데 50만원어치 요금제는 본인이나 가족이 쓰거나 팔 수 있다고 해서 실질 부담이 좀 줄더라고요. 등록하고 나서 블로그랑 카페에 알뜰폰 정보 글 올리면서 유입 가입자 월 10~15명 정도 나오고 있어요. 건당 수수료 받으니까 누적이 되는 구조가 맞아요. 6개월 지나니까 월 20만원 정도 들어오고 있어요.",
    pros: "한 번 등록한 가입자는 매달 수수료가 들어오는 파이프라인 구조",
    cons: "초기 116만원 투자금이 있고, 손익분기점까지 3~6개월 소요",
    recommend: true,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "선불폰블로그운영중",
    income_range: "10_to_30",
    weekly_hours: 6,
    difficulty: 2,
    satisfaction: 4,
    title: "네이버 블로그 있으면 바로 시작할 수 있어요",
    content: "네이버 블로그를 이미 운영하고 있어서 자연스럽게 알뜰폰·선불폰 관련 글을 올렸어요. 외국인 선불폰, 학생 알뜰폰 요금제 등 수요 있는 키워드로 포스팅하면 문의가 꽤 들어와요. 가입 연결해주면 수수료 나오고, 기존 구독자도 알뜰폰 갈아타기 문의가 많아서 그걸로도 수익이 나요. 블로그 트래픽 있으면 생각보다 빠르게 초기비용 회수해요.",
    pros: "블로그·SNS 채널이 있으면 추가 홍보 비용 없이 바로 수익화 가능",
    cons: "채널이 없으면 처음부터 트래픽 만들어야 해서 시간이 걸림",
    recommend: true,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "알뜰폰대리점1년차",
    income_range: "30_to_50",
    weekly_hours: 10,
    difficulty: 3,
    satisfaction: 5,
    title: "1년 운영 후 월 35만원 안정적으로 들어와요",
    content: "처음 6개월은 홍보에 집중했고, 7개월차부터 기존 가입자 재계약이 들어오면서 수익이 안정됐어요. 지금은 블로그 포스팅 한 달에 4~5개 올리는 게 전부인데도 새 가입자가 들어오고 기존 가입자 갱신도 돼요. 1년 넘으니까 월 35만원 고정이에요. 통신 지식 없어도 교육을 잘 해줘서 어렵지 않았어요.",
    pros: "1년차 이상이면 누적 가입자로 인해 별다른 추가 작업 없이도 수익 유지",
    cons: "가입자가 타 통신사로 이탈하면 수수료가 끊기는 리스크 존재",
    recommend: true,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "초기비용회수중",
    income_range: "10_to_30",
    weekly_hours: 12,
    difficulty: 3,
    satisfaction: 3,
    title: "초기비용 회수까지 4개월 걸렸어요",
    content: "등록하고 나서 온라인 마케팅 방법을 배웠는데 생각보다 배울 게 많았어요. 블로그 SEO, 키워드 선정, 유입 분석까지 배우니까 시간이 꽤 걸렸어요. 4개월 만에 116만원 초기비용을 회수했고 지금은 월 15만원 정도 순수익이 나와요. 통신 지식은 교육에서 다 알려줘서 크게 어렵진 않았어요.",
    pros: "온라인 마케팅 무료 교육이 포함되어 처음 시작하는 사람도 배울 수 있음",
    cons: "초기비용 회수까지 4개월 이상의 인내가 필요함",
    recommend: true,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "외국인선불폰틈새",
    income_range: "10_to_30",
    weekly_hours: 7,
    difficulty: 2,
    satisfaction: 4,
    title: "외국인 대상 선불폰 틈새시장 발견했어요",
    content: "한국에 오는 외국인들이 선불폰 개통에 어려움을 많이 겪어요. 영어로 안내하는 블로그 포스팅 올렸더니 구글 검색에서 유입이 많이 생겼어요. 여행자·외국인 유학생·워홀러 대상으로 월 20~25명 연결해주고 있어요. 이 틈새시장은 경쟁이 적어서 아직 괜찮아요.",
    pros: "외국인 대상 틈새시장은 경쟁이 적어서 안정적인 유입 가능",
    cons: "영어 포스팅이 필요하고, 외국인 CS 대응 시 언어 장벽이 있을 수 있음",
    recommend: true,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "가족요금제전환활용",
    income_range: "under_10",
    weekly_hours: 4,
    difficulty: 2,
    satisfaction: 3,
    title: "가족·지인 알뜰폰 전환으로 시작해봤어요",
    content: "처음엔 가족이랑 친구들 알뜰폰 전환 도와주면서 시작했어요. 통신비 줄어서 주변에서 반응이 좋아요. 근데 지인 범위가 한계가 있어서 온라인 마케팅이 필수라는 걸 느꼈어요. 지인 기반으로만은 월 5~8만원 정도가 한계예요.",
    pros: "주변 지인 알뜰폰 전환만으로도 초기 가입자를 쉽게 확보 가능",
    cons: "지인 범위 한계로 온라인 마케팅 없이는 수익 규모를 키우기 어려움",
    recommend: true,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "알뜰폰대리점포기",
    income_range: "under_10",
    weekly_hours: 15,
    difficulty: 4,
    satisfaction: 2,
    title: "온라인 마케팅이 생각보다 어려워서 포기했어요",
    content: "블로그나 SNS를 전혀 안 해봐서 교육 받았는데도 SEO가 너무 어려웠어요. 3개월 열심히 했는데 가입자 유입이 5명 밖에 안 됐어요. 초기비용도 있고 시간 대비 수익이 너무 낮아서 그만뒀어요. 이미 온라인 채널이 있는 사람이 아니면 쉽지 않을 것 같아요.",
    pros: "교육 프로그램이 잘 짜여 있고, 마케팅 방법을 체계적으로 배울 수 있음",
    cons: "온라인 채널이 없는 초보자는 가입자 유치가 매우 어렵고 시간이 많이 걸림",
    recommend: false,
  },
  {
    hustle_id: "n-telecom",
    hustle_name: "앤텔레콤 선불폰·알뜰폰 온라인 대리점",
    nickname: "알뜰폰카페운영병행",
    income_range: "30_to_50",
    weekly_hours: 8,
    difficulty: 2,
    satisfaction: 5,
    title: "알뜰폰 전용 네이버 카페 만들어서 월 40만원",
    content: "알뜰폰 정보 공유 네이버 카페를 직접 만들었어요. 카페 회원들이 요금제 추천 요청할 때 자연스럽게 연결해주는 구조예요. 카페 운영 6개월 만에 회원 3000명 달성했고 가입 연결로 월 40만원 수익이에요. 정보성 콘텐츠가 가득한 카페라서 신뢰도가 높고 전환율도 좋아요.",
    pros: "커뮤니티 운영과 결합하면 신뢰 기반의 높은 전환율과 안정적인 수익 가능",
    cons: "카페 운영에도 꾸준한 시간 투자가 필요하고, 회원 관리도 병행해야 함",
    recommend: true,
  },
];

async function main() {
  console.log(`총 ${REVIEWS.length}개 후기 삽입 시작...`);
  let success = 0;
  let fail = 0;

  for (const r of REVIEWS) {
    const { error } = await supabase.from("reviews").insert({
      ...r,
      likes: Math.floor(Math.random() * 12),
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 120) * 86400000
      ).toISOString(),
    });
    if (error) {
      console.error(`❌ ${r.hustle_id} / ${r.nickname}: ${error.message}`);
      fail++;
    } else {
      process.stdout.write(".");
      success++;
    }
  }

  console.log(`\n\n✅ 완료: ${success}개 성공, ${fail}개 실패`);
}

main().catch(console.error);
