/**
 * 후기 대량 삽입 스크립트 (Part 5: 인기 부업 20개 × 4개 = 80개)
 * 실행: npx tsx scripts/seed-bulk-reviews-5.ts
 *
 * ※ 모든 내용은 100% 직접 창작한 원본 후기입니다.
 *    실제 부업 경험의 일반적 사례를 바탕으로 작성되었으며
 *    특정 사이트의 내용을 복사하지 않았습니다.
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

  // ────────────────────────────────────────────────
  // 쿠팡파트너스 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "coupang-partners", hustle_name: "쿠팡파트너스",
    nickname: "블로그쿠팡연동3년차",
    income_range: "50_to_100", weekly_hours: 5, difficulty: 2, satisfaction: 5,
    title: "블로그 방문자 하루 500명으로 월 60만원 찍었어요",
    content: "3년 동안 꾸준히 리뷰 포스팅 올린 결과 하루 방문자 500명에 월 60만원 달성했어요. 포스팅 하나에 3~4개 파트너스 링크 자연스럽게 넣는 게 핵심이에요. 방문자가 구매 안 해도 쿠팡 접속만 해도 하루 안에 다른 상품 사면 수수료가 들어오니까 생각보다 전환율이 높아요.",
    pros: "블로그 방문자만 있으면 별도 작업 없이 자동으로 수익이 발생함",
    cons: "블로그 트래픽을 쌓기까지 최소 1~2년은 꾸준히 써야 함",
    recommend: true,
  },
  {
    hustle_id: "coupang-partners", hustle_name: "쿠팡파트너스",
    nickname: "유튜브쿠팡링크활용",
    income_range: "10_to_30", weekly_hours: 3, difficulty: 1, satisfaction: 4,
    title: "유튜브 영상 설명란 링크로 월 22만원 추가 수익",
    content: "제품 리뷰 유튜브 영상 설명란에 쿠팡파트너스 링크 달아두니까 월 22만원 수익이 생겼어요. 영상 올리는 건 본업처럼 하면서 링크는 한 번 달아두면 끝이라 추가 시간이 거의 없어요. 특히 전자기기, 생활용품 리뷰 영상에서 클릭률이 높아요.",
    pros: "기존 유튜브 운영에 링크만 추가하면 되는 가장 쉬운 수익 다각화",
    cons: "유튜브 구독자가 없으면 클릭 자체가 없어서 수익이 미미함",
    recommend: true,
  },
  {
    hustle_id: "coupang-partners", hustle_name: "쿠팡파트너스",
    nickname: "카카오채널쿠팡링크",
    income_range: "under_10", weekly_hours: 4, difficulty: 2, satisfaction: 3,
    title: "카카오채널 친구 300명인데 월 4만원밖에 안 돼요",
    content: "카카오채널에서 쿠팡 특가 정보 공유하면서 링크 올리고 있어요. 친구 300명인데 구매 전환이 낮아서 월 4만원 정도예요. 채널 친구가 최소 3000명은 돼야 의미 있는 수익이 나올 것 같아요. 그래도 특가 알림이 반응이 좋아서 계속 하고 있어요.",
    pros: "특가 정보를 찾아오는 구독자라 구매 전환율이 일반 블로그보다 높음",
    cons: "채널 친구 수가 적으면 절대적인 클릭 수가 너무 낮아서 수익이 미미함",
    recommend: true,
  },
  {
    hustle_id: "coupang-partners", hustle_name: "쿠팡파트너스",
    nickname: "쿠팡파트너스현실직시",
    income_range: "under_10", weekly_hours: 6, difficulty: 2, satisfaction: 2,
    title: "트래픽 없으면 정말 아무것도 안 돼요",
    content: "채널 없이 커뮤니티에 링크만 올렸더니 도배로 신고당하고 계정도 삭제됐어요. 결국 쿠팡파트너스는 블로그, 유튜브, SNS 등 본인 채널이 있어야 의미 있어요. 채널 없는 상태에서 파트너스만 먼저 시작하는 건 비추예요.",
    pros: "이미 운영 중인 채널이 있다면 추가 수익화가 매우 쉬움",
    cons: "채널 없이 시작하면 스팸으로 몰리기 쉽고 수익이 거의 없음",
    recommend: false,
  },

  // ────────────────────────────────────────────────
  // 네이버 블로그 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "naver-blog", hustle_name: "네이버 블로그 (애드포스트)",
    nickname: "맛집블로그월세벌이",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 2, satisfaction: 4,
    title: "맛집 리뷰로 시작해서 지금은 월 18만원",
    content: "동네 맛집 리뷰로 시작했는데 지역 검색 1위가 여러 개 생기면서 방문자가 늘었어요. 애드포스트 수익 외에 체험단 요청도 들어오기 시작해서 외식비가 거의 없어졌어요. 맛집 사진 잘 찍는 스마트폰 하나면 시작할 수 있어요.",
    pros: "지역 맛집 리뷰는 경쟁이 적고 지역 1위 달성이 상대적으로 쉬움",
    cons: "외식을 자주 해야 해서 식비 지출이 늘 수 있음 (수익이 없을 때 손해)",
    recommend: true,
  },
  {
    hustle_id: "naver-blog", hustle_name: "네이버 블로그 (애드포스트)",
    nickname: "블로그저품질경험담",
    income_range: "under_10", weekly_hours: 10, difficulty: 3, satisfaction: 2,
    title: "저품질 한 번 걸리면 진짜 답 없어요",
    content: "1년 열심히 썼는데 저품질 판정 받고 나서 방문자가 10분의 1로 줄었어요. 복사 없이 직접 쓴 글인데도 비슷한 주제가 많아서인지 저품질 됐어요. 저품질 탈출이 거의 불가능해서 새 블로그 파야 했어요.",
    pros: "초기에 방향 잘 잡으면 빠르게 성장할 수 있음",
    cons: "저품질 한 번 걸리면 탈출이 어렵고 1년 노력이 허사가 될 수 있음",
    recommend: false,
  },
  {
    hustle_id: "naver-blog", hustle_name: "네이버 블로그 (애드포스트)",
    nickname: "블로그체험단병행",
    income_range: "30_to_50", weekly_hours: 12, difficulty: 2, satisfaction: 5,
    title: "애드포스트+체험단으로 월 40만원 넘겼어요",
    content: "리뷰어스, 강남맛집 등 체험단 플랫폼 3개 동시에 등록해서 매주 2~3개 체험단 다니고 있어요. 체험단 원고료 + 애드포스트 수익 합치면 월 40만원이에요. 무엇보다 좋아하는 맛집, 카페, 제품을 공짜로 즐길 수 있는 게 최고예요.",
    pros: "체험단과 함께하면 현금 + 현물 혜택으로 실질 가치가 더 높아짐",
    cons: "체험단 글쓰기 기준이 있어서 마감 압박과 퀄리티 요구가 있음",
    recommend: true,
  },
  {
    hustle_id: "naver-blog", hustle_name: "네이버 블로그 (애드포스트)",
    nickname: "블로그인플루언서도전",
    income_range: "10_to_30", weekly_hours: 10, difficulty: 3, satisfaction: 4,
    title: "인플루언서 도전 중, 애드포스트보다 인플루언서가 훨씬 수익이 높아요",
    content: "애드포스트 월 8만원인데 인플루언서 선정되면 키워드 챌린지, 광고 단가 등 수익이 3~5배 높다고 해서 지금 인플루언서 선정 도전 중이에요. 방문자 꾸준히 올리면서 네이버 생태계 잘 활용하는 게 중요한 것 같아요.",
    pros: "인플루언서 선정되면 수익 구조가 완전히 달라지고 협업 기회도 많아짐",
    cons: "인플루언서 선정 기준이 명확하지 않고 선정되기까지 시간이 오래 걸림",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 쿠팡플렉스 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "coupang-flex", hustle_name: "쿠팡플렉스",
    nickname: "플렉스새벽반년경험",
    income_range: "30_to_50", weekly_hours: 20, difficulty: 3, satisfaction: 4,
    title: "주 5일 새벽 배송으로 월 35만원 추가 수입",
    content: "평일 새벽 4시에 캠프 가서 4~5시간 배송해요. 아파트 단지 위주로 돌면 엘리베이터 덕에 체력 소모가 적고 시간도 줄어요. 주 5일 하면 월 35만원 정도예요. 새벽형 인간이거나 이른 출근 전에 할 수 있는 사람에게 딱이에요.",
    pros: "낮 시간 본업에 영향을 주지 않고 이른 새벽에 짧게 끝낼 수 있음",
    cons: "새벽 2~4시 기상이 필요해서 수면 패턴이 흐트러질 수 있음",
    recommend: true,
  },
  {
    hustle_id: "coupang-flex", hustle_name: "쿠팡플렉스",
    nickname: "플렉스배정경쟁현실",
    income_range: "10_to_30", weekly_hours: 12, difficulty: 3, satisfaction: 3,
    title: "배정 경쟁이 치열해서 원하는 날 못 잡는 경우 많아요",
    content: "플렉스 앱에서 배송 블록 잡으려면 새벽 0시 오픈 때 바로 눌러야 해요. 1~2초 늦으면 다 잡혀있어요. 특히 토요일은 경쟁이 제일 심해서 잡기가 하늘의 별 따기예요. 원하는 날 항상 일할 수 없다는 불확실성이 제일 불편해요.",
    pros: "잡을 수만 있으면 시간당 수익이 높고 근무 시간이 자유로움",
    cons: "배송 블록 경쟁이 치열해서 원하는 날짜에 일하는 것이 보장되지 않음",
    recommend: true,
  },
  {
    hustle_id: "coupang-flex", hustle_name: "쿠팡플렉스",
    nickname: "플렉스차량필수경험",
    income_range: "30_to_50", weekly_hours: 18, difficulty: 2, satisfaction: 5,
    title: "SUV로 한 번에 많이 싣고 다니면 효율 최고예요",
    content: "SUV 트렁크에 박스 50개까지 실리면서 왕복 횟수가 줄어서 시간 효율이 많이 올랐어요. 아파트 한 동 전체 다 맡기도 하고 창고 하나 통째로 맡기도 해서 이동 없이 집중 배송 가능해요. 한 번에 많이 싣는 차일수록 수익률이 높아요.",
    pros: "큰 차량일수록 한 번에 많이 실어 시간 대비 수익이 올라감",
    cons: "연비가 나쁜 큰 차량은 주유비를 고려하면 실수익이 줄어들 수 있음",
    recommend: true,
  },
  {
    hustle_id: "coupang-flex", hustle_name: "쿠팡플렉스",
    nickname: "플렉스경비원아파트팁",
    income_range: "10_to_30", weekly_hours: 10, difficulty: 2, satisfaction: 4,
    title: "경비실 관계 잘 유지하는 게 배송 속도 키워요",
    content: "경비원 분들이랑 인사 잘 하고 가끔 음료수 한 캔씩 드리면서 관계 맺었더니 무거운 박스 가끔 도움도 주시고 지하 주차장 자리도 편하게 써요. 사소한 것 같지만 배송 속도에 차이가 꽤 나요. 사람 대하는 게 중요한 일이에요.",
    pros: "친절하고 요령을 익힐수록 배송 속도가 빨라져 시간당 수익이 올라감",
    cons: "날씨가 안 좋거나 체력이 안 되는 날엔 힘들고 실수할 수도 있음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 배달의민족 라이더 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "baemin-rider", hustle_name: "배달의민족 라이더",
    nickname: "주말라이더3년째",
    income_range: "30_to_50", weekly_hours: 16, difficulty: 3, satisfaction: 4,
    title: "주말 토일 이틀만 해도 월 35만원",
    content: "평일엔 직장 다니고 토일만 배달해요. 오전 11시~오후 3시, 저녁 5시~9시 피크 타임 위주로 잡으면 이틀에 17~18만원은 나와요. 주말 내내 쉬고 싶은 마음도 있지만 통장에 찍히면 뿌듯해서 계속하게 되더라고요.",
    pros: "피크 타임만 노리면 짧은 시간에 효율적으로 수익을 낼 수 있음",
    cons: "비, 눈, 폭염 등 날씨에 완전히 노출되어 악천후엔 체력 소모가 심함",
    recommend: true,
  },
  {
    hustle_id: "baemin-rider", hustle_name: "배달의민족 라이더",
    nickname: "자전거배달도시형",
    income_range: "10_to_30", weekly_hours: 12, difficulty: 2, satisfaction: 4,
    title: "전기자전거로 시내 배달, 주유비 없이 월 18만원",
    content: "오토바이 없어도 전기자전거로 배달 가능한 구역이 있어요. 운동도 되고 주유비도 없어서 실수익이 더 높아요. 반경이 좁고 한 번에 많이 못 싣는 단점이 있지만 도심 카페, 음식점 밀집 지역에서는 충분히 효율적이에요.",
    pros: "주유비가 없고 운동 효과까지 있어 실수익률이 오토바이보다 높을 수 있음",
    cons: "배달 반경이 좁고 날씨 영향을 오토바이보다 더 많이 받음",
    recommend: true,
  },
  {
    hustle_id: "baemin-rider", hustle_name: "배달의민족 라이더",
    nickname: "라이더보험필수",
    income_range: "30_to_50", weekly_hours: 20, difficulty: 3, satisfaction: 3,
    title: "사고 나기 전에 반드시 라이더 보험 가입하세요",
    content: "6개월 하다가 신호 위반 차량과 접촉 사고 났어요. 라이더 보험 미리 가입해뒀던 덕에 치료비 다 나왔는데 보험 없었으면 큰일 날 뻔했어요. 배달하기 전에 배달 전용 보험 필수 가입하고 헬멧, 무릎 보호대 꼭 챙기세요.",
    pros: "보험 잘 챙기고 안전 운전하면 안정적인 수익 구조가 가능함",
    cons: "사고 위험이 항상 있고, 보험 미가입 시 부상 치료비가 막대할 수 있음",
    recommend: true,
  },
  {
    hustle_id: "baemin-rider", hustle_name: "배달의민족 라이더",
    nickname: "라이더앱비교경험",
    income_range: "50_to_100", weekly_hours: 40, difficulty: 3, satisfaction: 4,
    title: "배민+쿠팡이츠 동시 앱으로 대기 없이 월 70만원",
    content: "배민 하나만 쓰면 콜 없는 대기 시간이 생겨요. 배민, 쿠팡이츠, 요기요 앱 동시 켜두고 먼저 오는 콜 잡으면 대기 시간이 확 줄어요. 앱 3개 동시 운영하면서 월 70만원까지 올렸어요. 주문이 겹치지 않도록 타이밍 조율이 핵심이에요.",
    pros: "여러 앱 동시 운영으로 대기 없이 콜을 이어가 시간당 수익 극대화 가능",
    cons: "주문이 겹치면 취소 패널티를 받을 수 있어 일정 조율 능력이 필요함",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 크몽 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "kmong", hustle_name: "크몽",
    nickname: "크몽디자이너2년",
    income_range: "50_to_100", weekly_hours: 20, difficulty: 3, satisfaction: 5,
    title: "로고 디자인 하나로 월 80만원 찍었어요",
    content: "로고 디자인 서비스를 건당 15만원에 올렸는데 후기가 쌓이면서 예약이 밀리기 시작했어요. 이제 한 달치 예약이 항상 차 있어서 오히려 가격을 올려서 수요를 조절하고 있어요. 크몽에서 후기 관리가 제일 중요해요.",
    pros: "후기가 쌓이면 자연 유입이 생기고 가격을 올려도 수요가 유지됨",
    cons: "초반 후기 없을 때 첫 주문 받기가 어렵고 낮은 가격에 시작해야 함",
    recommend: true,
  },
  {
    hustle_id: "kmong", hustle_name: "크몽",
    nickname: "크몽영상편집시작",
    income_range: "10_to_30", weekly_hours: 15, difficulty: 3, satisfaction: 3,
    title: "영상 편집 서비스, 단가가 생각보다 낮아서 아쉬워요",
    content: "유튜브 영상 편집 서비스 올렸는데 크몽에서 분당 5천 원이 시장 가격이에요. 10분짜리 영상 편집에 3~4시간 걸리는데 5만 원이면 시간당 1만~1.5만 원 수준이에요. 포트폴리오 쌓고 단가 올리거나 다른 플랫폼 병행하는 게 나을 것 같아요.",
    pros: "포트폴리오 쌓기 좋고 다양한 클라이언트 경험을 빠르게 할 수 있음",
    cons: "시장 단가가 낮아서 시간 대비 수익이 다른 서비스보다 낮을 수 있음",
    recommend: true,
  },
  {
    hustle_id: "kmong", hustle_name: "크몽",
    nickname: "크몽번역전문가",
    income_range: "30_to_50", weekly_hours: 12, difficulty: 3, satisfaction: 4,
    title: "영한 번역 서비스로 안정적인 월 35만원",
    content: "영한 IT 문서 번역 전문으로 올렸더니 반응이 좋아요. 일반 번역보다 단가가 높고 전문용어 아는 번역가가 별로 없어서 경쟁이 적어요. 재의뢰율도 높고 한 번 구매한 클라이언트가 계속 오는 게 장점이에요.",
    pros: "전문 분야 번역은 일반 번역보다 단가가 높고 재구매율이 좋음",
    cons: "전문 분야 지식이 없으면 퀄리티를 높이기 어려움",
    recommend: true,
  },
  {
    hustle_id: "kmong", hustle_name: "크몽",
    nickname: "크몽리뷰어빌기술",
    income_range: "under_10", weekly_hours: 5, difficulty: 3, satisfaction: 2,
    title: "초반 후기 없을 땐 진짜 아무도 안 사요",
    content: "서비스 올리고 한 달간 주문이 0건이었어요. 결국 지인한테 정가보다 낮은 가격에 의뢰해서 후기를 먼저 만들었어요. 그 후기 2개 달리고 나서 진짜 주문이 들어오기 시작했어요. 크몽은 후기 없이 시작하는 게 제일 어려워요.",
    pros: "한번 후기가 쌓이기 시작하면 자연적으로 주문이 늘어나는 구조",
    cons: "첫 후기를 만들기가 너무 어렵고 초반 포기하는 사람이 많음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 스마트스토어 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "smart-store", hustle_name: "스마트스토어",
    nickname: "위탁판매1년경험",
    income_range: "10_to_30", weekly_hours: 10, difficulty: 3, satisfaction: 3,
    title: "위탁판매로 시작, 재고 리스크 없이 월 20만원",
    content: "중국 도매 사이트에서 위탁 가능한 상품 찾아서 스마트스토어에 올렸어요. 주문 들어오면 도매처에 발주해서 직배송 방식이라 재고 없어도 돼요. 마진이 10~20% 수준이라 많이 팔아야 의미 있는 수익이 되지만 재고 없는 게 최대 장점이에요.",
    pros: "재고 없이 시작 가능해서 초기 투자 리스크가 없음",
    cons: "마진율이 낮고 배송 품질 관리가 안 돼서 CS 처리가 많아질 수 있음",
    recommend: true,
  },
  {
    hustle_id: "smart-store", hustle_name: "스마트스토어",
    nickname: "스토어CS지옥경험",
    income_range: "30_to_50", weekly_hours: 20, difficulty: 4, satisfaction: 2,
    title: "매출은 나오는데 CS가 너무 힘들어요",
    content: "월 매출 200만 원 나오는데 마진 30%면 60만 원이에요. 그런데 반품, 교환, 불량 CS에 하루 2~3시간씩 쓰다 보니 시간당 수익이 생각보다 낮아요. CS 잘 못 받으면 리뷰 테러에 평점 폭락이라 항상 긴장 상태예요.",
    pros: "매출 규모가 커지면 수익도 커지고 자동화할 수 있는 부분이 생김",
    cons: "CS 처리 시간과 스트레스가 예상보다 훨씬 많아서 번아웃이 올 수 있음",
    recommend: false,
  },
  {
    hustle_id: "smart-store", hustle_name: "스마트스토어",
    nickname: "스토어상위노출비법",
    income_range: "50_to_100", weekly_hours: 15, difficulty: 4, satisfaction: 5,
    title: "상위 노출 잡는 순간 매출이 10배 터져요",
    content: "네이버 쇼핑 상위 노출 공식을 찾은 뒤로 매출이 완전 달라졌어요. 상품명에 키워드 정확히 넣고, 리뷰 빠르게 쌓고, 광고 초반에 집중 투자했더니 상위 3개 안에 들어가면서 월 매출 400만 원 찍었어요. 상위 노출이 전부예요.",
    pros: "상위 노출 달성 후에는 광고 없이도 자연 유입으로 매출이 유지됨",
    cons: "상위 노출까지 광고비 투자가 필요하고 초반 손실이 있을 수 있음",
    recommend: true,
  },
  {
    hustle_id: "smart-store", hustle_name: "스마트스토어",
    nickname: "수제품스토어성공",
    income_range: "30_to_50", weekly_hours: 25, difficulty: 3, satisfaction: 5,
    title: "직접 만든 수제 비누로 월 45만원 매출",
    content: "취미로 만들던 수제 비누를 스마트스토어에 올렸는데 예쁜 포장과 수제라는 희소성 덕에 잘 팔려요. 대량 생산 상품과 경쟁 안 해도 되고 나만의 브랜드를 만들 수 있어요. 직접 만든 게 팔린다는 뿌듯함이 커서 오래 할 것 같아요.",
    pros: "수제 상품은 경쟁이 적고 프리미엄 가격 책정이 가능함",
    cons: "주문이 늘수록 제작 시간도 비례해서 늘어나 혼자 감당하기 어려워질 수 있음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 유튜브 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "youtube", hustle_name: "유튜브 채널 운영",
    nickname: "유튜브구독자1만달성",
    income_range: "10_to_30", weekly_hours: 20, difficulty: 5, satisfaction: 4,
    title: "구독자 1만까지 2년, 수익화는 6개월 만에",
    content: "구독자 1천 명과 시청 4000시간 채워서 수익화 승인까지 2년 걸렸어요. 처음 6개월은 반응이 거의 없어서 포기할 뻔했어요. 지금은 구독자 1.2만 명에 월 18만 원 들어오는데 아직 유튜브 하나만으로는 생계는 어려워요. 부업으로는 충분히 의미 있어요.",
    pros: "구독자가 쌓이면 영상 올릴 때마다 자동으로 수익이 발생하는 구조",
    cons: "수익화까지 최소 1~2년의 꾸준한 영상 업로드가 필요함",
    recommend: true,
  },
  {
    hustle_id: "youtube", hustle_name: "유튜브 채널 운영",
    nickname: "유튜브협찬수익",
    income_range: "50_to_100", weekly_hours: 25, difficulty: 4, satisfaction: 5,
    title: "구독자 5천인데 협찬으로 광고 수익의 3배 벌어요",
    content: "구독자 5천인데 세부 분야 특화 채널이라 협찬 제안이 자주 와요. 광고 수익은 월 5만 원인데 협찬 수익이 월 60~70만 원이에요. 구독자 수보다 타겟이 명확한 채널이 협찬 단가가 훨씬 높아요. 세분화된 분야로 시작하는 걸 추천해요.",
    pros: "세분화된 분야는 구독자 수가 적어도 협찬 단가가 높음",
    cons: "세분화 분야는 구독자 성장이 더디고 알고리즘 노출이 제한적일 수 있음",
    recommend: true,
  },
  {
    hustle_id: "youtube", hustle_name: "유튜브 채널 운영",
    nickname: "유튜브장비투자현실",
    income_range: "under_10", weekly_hours: 15, difficulty: 5, satisfaction: 2,
    title: "1년 했는데 장비 값도 못 건졌어요",
    content: "카메라, 마이크, 조명 사는 데 200만 원 썼는데 1년 뒤 수익이 30만 원도 안 돼요. 유튜브는 초반에 시청자가 없으면 아무리 좋은 영상도 노출이 안 돼요. 장비보다 주제 선정이 훨씬 중요한데 이걸 너무 늦게 깨달았어요.",
    pros: "주제 방향만 잘 잡으면 스마트폰만으로도 시작 가능함",
    cons: "장비보다 주제·편집·업로드 주기가 훨씬 중요한데 이걸 모르고 시작하면 낭비가 큼",
    recommend: false,
  },
  {
    hustle_id: "youtube", hustle_name: "유튜브 채널 운영",
    nickname: "유튜브쇼츠투롱폼전략",
    income_range: "30_to_50", weekly_hours: 18, difficulty: 4, satisfaction: 4,
    title: "쇼츠로 구독자 모아서 롱폼으로 수익 올리는 전략",
    content: "쇼츠로 6개월 만에 구독자 3만 모았어요. 쇼츠 광고 수익은 낮지만 구독자가 빠르게 붙어서 그 구독자들한테 롱폼 영상 보여주는 전략이에요. 롱폼 CPM이 쇼츠의 10배라서 채널이 빠르게 성장 중이에요.",
    pros: "쇼츠로 빠르게 구독자 확보 후 롱폼으로 수익을 극대화하는 전략이 유효함",
    cons: "쇼츠 구독자가 롱폼까지 이어서 보게 만드는 콘텐츠 연결이 쉽지 않음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 티스토리 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "tistory", hustle_name: "티스토리 블로그 (구글 애드센스)",
    nickname: "티스토리IT블로그",
    income_range: "10_to_30", weekly_hours: 10, difficulty: 3, satisfaction: 4,
    title: "IT 정보 블로그로 월 22만원 애드센스 수익",
    content: "개발 에러 해결법, IT 팁 위주로 올렸더니 구글 검색 유입이 꾸준히 들어와요. 영어권 방문자도 있어서 CPM이 한국 블로그보다 높아요. 네이버 블로그보다 구글 SEO가 확실히 효과적이라는 걸 체감하고 있어요.",
    pros: "구글 SEO가 잘 되면 해외 트래픽까지 잡혀 CPM과 수익이 올라감",
    cons: "구글 SEO는 결과가 나오기까지 6개월~1년의 시간이 필요함",
    recommend: true,
  },
  {
    hustle_id: "tistory", hustle_name: "티스토리 블로그 (구글 애드센스)",
    nickname: "애드센스승인팁",
    income_range: "under_10", weekly_hours: 8, difficulty: 3, satisfaction: 3,
    title: "애드센스 승인 3번 탈락 후 4번째에 통과했어요",
    content: "콘텐츠 부족, 광고 정책 위반 등 이유로 3번 탈락했어요. 포스팅 30개 이상 쓰고, 개인정보처리방침, 문의하기 페이지 추가하고, 저작권 이미지 없앤 후에 통과됐어요. 승인 통과가 생각보다 까다로우니 기준 꼼꼼히 확인하세요.",
    pros: "승인 나면 자동으로 광고가 붙어서 글만 잘 써도 수익이 발생함",
    cons: "승인 기준이 엄격해서 여러 번 탈락하는 경우가 많고 시간이 오래 걸림",
    recommend: true,
  },
  {
    hustle_id: "tistory", hustle_name: "티스토리 블로그 (구글 애드센스)",
    nickname: "티스토리월수익공개",
    income_range: "30_to_50", weekly_hours: 12, difficulty: 3, satisfaction: 5,
    title: "일 방문자 800명에 월 38만원, 티스토리 최고예요",
    content: "하루 방문자 800명에 월 38만원이에요. 네이버 블로그 같은 시간 썼을 때 수익 차이가 3배 이상 나요. 애드센스 CPM이 확실히 높고, 트래픽이 쌓이면 수익이 빠르게 올라가요. 정보성 글 위주로 꾸준히 쓰는 것만이 답이에요.",
    pros: "애드센스 CPM이 높아서 같은 방문자로 네이버보다 훨씬 높은 수익을 올릴 수 있음",
    cons: "초반에 구글 색인이 느려서 수익이 나기까지 인내가 필요함",
    recommend: true,
  },
  {
    hustle_id: "tistory", hustle_name: "티스토리 블로그 (구글 애드센스)",
    nickname: "티스토리카카오합병",
    income_range: "under_10", weekly_hours: 5, difficulty: 4, satisfaction: 2,
    title: "카카오와 합쳐지면서 기능이 자꾸 바뀌어서 불편해요",
    content: "예전에 비해 티스토리 스킨 커스터마이징이 제한되고 자꾸 정책이 바뀌어요. 갑자기 광고 정책 위반으로 수익이 정지된 경우도 봤어요. 이미 운영 중인 블로그라면 계속 써도 되지만 새로 시작한다면 워드프레스도 고려해보세요.",
    pros: "이미 콘텐츠가 쌓인 블로그라면 수익이 꾸준히 유지됨",
    cons: "플랫폼 정책 변경이 잦아 장기적인 안정성이 워드프레스보다 낮을 수 있음",
    recommend: false,
  },

  // ────────────────────────────────────────────────
  // 클래스101 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "class101", hustle_name: "클래스101",
    nickname: "일러스트강의월수익",
    income_range: "30_to_50", weekly_hours: 5, difficulty: 3, satisfaction: 5,
    title: "일러스트 강의 올린 지 2년, 지금도 월 40만원",
    content: "2년 전에 올린 디지털 일러스트 강의가 지금도 매달 수강생이 들어와요. 초반에 강의 만드는 데 3개월 걸렸지만 지금은 아무것도 안 해도 들어오는 진짜 패시브 인컴이에요. 플랫폼이 마케팅 해주니까 저는 강의 퀄리티만 신경 쓰면 됐어요.",
    pros: "한 번 만들어 두면 2년 넘게 수익이 계속 발생하는 완전한 패시브 인컴",
    cons: "강의 초기 제작에 3개월 이상의 시간과 장비 비용이 들어감",
    recommend: true,
  },
  {
    hustle_id: "class101", hustle_name: "클래스101",
    nickname: "클래스101초기투자현실",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 4, satisfaction: 3,
    title: "강의 만드는 데 300만 원 들었는데 회수까지 1년",
    content: "조명, 카메라, 마이크, 편집 프로그램 등 세팅하는 데 300만 원 들었어요. 월 수익이 25만 원 정도라 초기 투자 회수에만 1년 넘게 걸렸어요. 장비 없이 스마트폰으로 먼저 테스트해보고 반응 보고 나서 투자하는 게 나았을 것 같아요.",
    pros: "초기 투자 회수 후에는 순수 패시브 인컴이 되어 수익성이 올라감",
    cons: "장비 투자 비용이 크고 회수까지 시간이 걸려 초반 손실이 있을 수 있음",
    recommend: true,
  },
  {
    hustle_id: "class101", hustle_name: "클래스101",
    nickname: "클래스101심사탈락",
    income_range: "under_10", weekly_hours: 20, difficulty: 5, satisfaction: 2,
    title: "심사 3번 탈락, 퀄리티 기준이 매우 높아요",
    content: "강의 계획서 3번 탈락했어요. 클래스101은 심사가 꽤 까다롭고 이미 비슷한 강의가 있으면 차별점을 명확히 해야 해요. 승인 탈락하면 강의 기획에 쏟은 시간이 아까워요. 다른 플랫폼 병행 고려해보세요.",
    pros: "심사를 통과하면 클래스101 인지도 덕에 초기 수강생 모집이 수월함",
    cons: "심사 기준이 높아서 탈락 시 기획에 들인 시간과 노력이 허사가 됨",
    recommend: false,
  },
  {
    hustle_id: "class101", hustle_name: "클래스101",
    nickname: "클래스101쿠키강의",
    income_range: "50_to_100", weekly_hours: 8, difficulty: 3, satisfaction: 5,
    title: "쿠키 클래스로 월 70만원, 취미가 수익이 됐어요",
    content: "취미로 배우던 버터크림 케이크 만들기를 강의로 만들었어요. 눈으로 보이는 결과물이 있는 취미 강의는 반응이 정말 좋아요. 초보자도 쉽게 만들 수 있게 단계별 구성했더니 수강생이 꾸준히 들어와요.",
    pros: "취미 분야도 강의화가 가능하고 눈에 보이는 결과물이 있는 강의가 인기가 높음",
    cons: "재료 소진되는 취미 강의는 촬영 준비 비용이 반복적으로 발생함",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 데이터 라벨링 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "data-labeling", hustle_name: "데이터 라벨링",
    nickname: "라벨링이미지분류",
    income_range: "under_10", weekly_hours: 10, difficulty: 1, satisfaction: 3,
    title: "이미지 분류 라벨링으로 월 6만원, 단순하지만 뇌가 편해요",
    content: "크라우드웍스에서 이미지 분류 작업해요. 고양이다/아니다, 자동차가 있다/없다 같은 단순 분류라서 유튜브 보면서 할 수 있어요. 단가가 낮아서 월 6만 원이지만 집중 안 해도 되는 게 장점이에요. 멍하게 있는 시간 활용하기 좋아요.",
    pros: "집중력 없이도 할 수 있어서 다른 활동과 병행이 가능함",
    cons: "단가가 매우 낮아서 시간을 많이 투자해도 수익이 크지 않음",
    recommend: true,
  },
  {
    hustle_id: "data-labeling", hustle_name: "데이터 라벨링",
    nickname: "라벨링전문작업자",
    income_range: "10_to_30", weekly_hours: 20, difficulty: 2, satisfaction: 3,
    title: "전문 라벨러로 인정받으면 단가가 올라가요",
    content: "처음엔 건당 50~100원이었는데 정확도가 높아서 전문 작업자로 선정됐어요. 전문 작업자는 건당 300~500원짜리 어려운 작업을 받아요. 많이 해봐서 속도도 빨라지면서 지금은 월 20만 원 수준이에요.",
    pros: "작업 정확도와 속도가 올라갈수록 더 높은 단가 작업을 받을 수 있음",
    cons: "초반에는 단가가 너무 낮아서 최저시급에도 못 미칠 수 있음",
    recommend: true,
  },
  {
    hustle_id: "data-labeling", hustle_name: "데이터 라벨링",
    nickname: "텍스트라벨링도전",
    income_range: "under_10", weekly_hours: 8, difficulty: 2, satisfaction: 3,
    title: "텍스트 감정 분류 라벨링, 긍정/부정 판단이 애매해요",
    content: "이미지보다 텍스트 감정 분류가 단가는 조금 높아요. 근데 '좋은 것 같기도 하고 나쁜 것 같기도 한' 애매한 문장이 많아서 판단이 어려울 때가 있어요. 정답률 기준 있어서 틀리면 작업 취소되는 압박이 있어요.",
    pros: "이미지 분류보다 단가가 조금 높고 언어 감각을 활용할 수 있음",
    cons: "판단 기준이 애매한 경우가 많고 정답률이 낮으면 작업이 취소됨",
    recommend: true,
  },
  {
    hustle_id: "data-labeling", hustle_name: "데이터 라벨링",
    nickname: "라벨링AI시대전망",
    income_range: "under_10", weekly_hours: 15, difficulty: 1, satisfaction: 2,
    title: "AI가 발전할수록 단순 라벨링 일감이 줄고 있어요",
    content: "2년 전보다 단순 이미지 분류 작업이 확실히 줄었어요. AI가 그 역할을 점점 대체하고 있어서 앞으로 단순 라벨링 수요는 더 줄어들 것 같아요. 지금 당장 부업으로 하기엔 괜찮지만 장기적으로는 더 복잡한 라벨링이나 다른 부업으로 전환하는 게 나을 것 같아요.",
    pros: "당장 시작할 수 있고 특별한 기술이 전혀 필요 없음",
    cons: "AI 발전으로 단순 라벨링 수요가 장기적으로 감소할 가능성이 높음",
    recommend: false,
  },

  // ────────────────────────────────────────────────
  // KREAM 리셀 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "kream", hustle_name: "KREAM 스니커즈·의류 리셀",
    nickname: "나이키발매리셀성공",
    income_range: "30_to_50", weekly_hours: 5, difficulty: 3, satisfaction: 4,
    title: "조던 발매 성공 후 프리미엄 20만원 붙여서 팔았어요",
    content: "조던1 레트로 발매에 성공해서 KREAM에 올렸더니 3일 만에 팔렸어요. 발매가 18만 원에 팔린 가격 38만 원, 수수료 빼고 18만 원 순이익이에요. 발매 성공이 어려운 게 문제지만 한 번 성공하면 짭짤해요.",
    pros: "발매 성공 시 투자 대비 수익률이 매우 높음",
    cons: "발매 성공 자체가 어렵고 실패하면 수익이 없음",
    recommend: true,
  },
  {
    hustle_id: "kream", hustle_name: "KREAM 스니커즈·의류 리셀",
    nickname: "KREAM수수료계산",
    income_range: "10_to_30", weekly_hours: 4, difficulty: 3, satisfaction: 3,
    title: "KREAM 수수료 생각하면 마진이 많이 줄어요",
    content: "KREAM 판매 수수료가 5~7%에 검수비까지 있어서 처음 계산보다 마진이 20~30% 줄어요. 10만 원 프리미엄 예상하고 팔았는데 실수익이 6~7만 원인 경우가 많았어요. 수수료까지 계산하고 팔 물건 선정해야 해요.",
    pros: "KREAM이 정품 검수를 해줘서 구매자 신뢰도가 높고 판매가 빠름",
    cons: "수수료와 검수비 합치면 마진의 20~30%가 빠져나감",
    recommend: true,
  },
  {
    hustle_id: "kream", hustle_name: "KREAM 스니커즈·의류 리셀",
    nickname: "리셀시세공부중요",
    income_range: "under_10", weekly_hours: 3, difficulty: 4, satisfaction: 2,
    title: "시세 파악 못 하면 오히려 손해 봐요",
    content: "트렌드 모르고 프리미엄 붙을 것 같다고 생각한 신발이 발매 후 시세가 오히려 내려갔어요. 발매가보다 낮게 팔아야 했고 수수료까지 빼니까 5만 원 손해 봤어요. 리셀은 발매 시세 예측 공부 없이 감으로 하면 안 돼요.",
    pros: "시세 공부를 잘 하면 리스크를 최소화하고 안정적인 수익이 가능함",
    cons: "시세 예측 실패 시 발매가보다 낮게 팔아야 하는 손실 위험이 있음",
    recommend: false,
  },
  {
    hustle_id: "kream", hustle_name: "KREAM 스니커즈·의류 리셀",
    nickname: "중고리셀KREAM전략",
    income_range: "10_to_30", weekly_hours: 6, difficulty: 3, satisfaction: 4,
    title: "번개장터에서 저렴하게 사서 KREAM에 파는 전략",
    content: "번개장터에서 상태 좋은 한정판 신발을 싸게 구매해서 KREAM 정품 검수 후 더 비싸게 팔아요. 직접 검수 과정이 있어서 구매자 신뢰가 높아 잘 팔려요. 번개에서 가격 협상 잘 하고 KREAM 시세 미리 체크하는 게 핵심이에요.",
    pros: "중고 플랫폼과 KREAM 가격차를 활용해 추가 마진을 얻을 수 있음",
    cons: "번개장터에서 가품을 잘못 구매하면 KREAM 검수에서 걸려 손실이 생길 수 있음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 온라인 과외 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "online-tutoring", hustle_name: "온라인 과외 (과외앱)",
    nickname: "수학과외대학생",
    income_range: "30_to_50", weekly_hours: 12, difficulty: 2, satisfaction: 5,
    title: "주 3회 수학 과외로 월 40만원, 학생도 잘 따라와서 보람 있어요",
    content: "아이캔, 과외닷컴에서 중등 수학 과외 2명 연결했어요. 비대면이라 이동 시간 없고 집에서 편하게 할 수 있어서 좋아요. 주 3회씩 두 명 하면 월 40만 원이에요. 학생이 성적 오르면 재계약도 하고 추가 소개도 받아요.",
    pros: "이동 없는 비대면이라 시간 효율이 높고 재계약률이 높음",
    cons: "첫 학생 연결이 어렵고 처음엔 후기 없어서 플랫폼 내 경쟁이 심함",
    recommend: true,
  },
  {
    hustle_id: "online-tutoring", hustle_name: "온라인 과외 (과외앱)",
    nickname: "영어과외전문",
    income_range: "50_to_100", weekly_hours: 15, difficulty: 2, satisfaction: 5,
    title: "영어 회화 과외 5명으로 월 65만원",
    content: "화상 영어 회화 과외 5명 해요. 성인 직장인 대상이라 저녁 시간 위주라 낮 직장과 병행이 가능해요. 영어 실력만 있으면 특별한 교재 준비 없이도 프리토킹으로 충분히 가르칠 수 있어요. 직장인 수강생은 꾸준히 오래 다녀서 안정적이에요.",
    pros: "성인 영어는 주 1~2회 꾸준히 하는 경우가 많아 안정적인 수입이 보장됨",
    cons: "수강생이 중간에 그만두면 새 학생 연결까지 수익 공백이 생길 수 있음",
    recommend: true,
  },
  {
    hustle_id: "online-tutoring", hustle_name: "온라인 과외 (과외앱)",
    nickname: "코딩과외수요증가",
    income_range: "30_to_50", weekly_hours: 8, difficulty: 3, satisfaction: 4,
    title: "코딩 과외 수요가 많아서 학생 구하기가 쉬워요",
    content: "파이썬, 스크래치 과외 문의가 요즘 정말 많아요. 초등학생 대상 코딩 교육 수요가 늘면서 시간당 3~4만 원 받고 있어요. 수학, 영어보다 경쟁 과외 선생님이 적어서 찾기가 더 쉬워요.",
    pros: "코딩 과외는 경쟁이 적고 수요가 빠르게 늘어나는 분야",
    cons: "나이에 맞는 교육 방법론을 갖추지 않으면 수업 퀄리티가 떨어질 수 있음",
    recommend: true,
  },
  {
    hustle_id: "online-tutoring", hustle_name: "온라인 과외 (과외앱)",
    nickname: "과외노쇼클레임고충",
    income_range: "10_to_30", weekly_hours: 10, difficulty: 2, satisfaction: 2,
    title: "노쇼, 돌발 취소가 너무 스트레스예요",
    content: "비대면이 편한 대신 갑자기 연락두절 되거나 당일 취소하는 학생이 생각보다 있어요. 선결제 구조가 아니면 취소해도 보상을 받기 어려워요. 계약서 제대로 쓰고 선결제 하는 조건으로 시작하는 게 나중에 분쟁 없이 깔끔해요.",
    pros: "제대로 된 계약 구조만 갖추면 안정적으로 운영할 수 있음",
    cons: "개인 계약이라 노쇼나 돌발 취소 시 보호받기 어렵고 심리적 스트레스가 있음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 번역 프리랜서 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "translation", hustle_name: "번역 프리랜서 (플리토 등)",
    nickname: "플리토번역3년차",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 3, satisfaction: 4,
    title: "플리토로 시작해서 지금은 직접 클라이언트 받아요",
    content: "처음엔 플리토에서 단가 낮은 번역 받으면서 포트폴리오 쌓았어요. 3년 하다 보니 단골 클라이언트가 생겨서 이제 직접 의뢰받고 있어요. 플리토 단가는 낮지만 경력 쌓기엔 최고예요. 지금은 월 25만 원 버는 중이에요.",
    pros: "플리토로 포트폴리오 쌓은 후 직접 클라이언트로 단가를 올릴 수 있음",
    cons: "플리토 자체 단가가 낮아서 오래 의존하면 시간 대비 수익이 낮음",
    recommend: true,
  },
  {
    hustle_id: "translation", hustle_name: "번역 프리랜서 (플리토 등)",
    nickname: "법률번역전문고단가",
    income_range: "50_to_100", weekly_hours: 15, difficulty: 4, satisfaction: 5,
    title: "법률 문서 영한 번역으로 월 70만원",
    content: "법학 전공 살려서 법률 번역 전문으로 시작했어요. 계약서, 소장, 판결문 번역은 전문 지식 필요해서 단가가 일반 번역의 3~5배예요. 크몽, 링크프라이스 통해 의뢰받다가 지금은 법무법인에서 직접 연락 와요.",
    pros: "전문 분야 번역은 단가가 높고 법인 클라이언트라 결제가 안정적임",
    cons: "법학, 의학 등 전문 지식이 없으면 진입 자체가 어려운 분야",
    recommend: true,
  },
  {
    hustle_id: "translation", hustle_name: "번역 프리랜서 (플리토 등)",
    nickname: "자막번역유튜브",
    income_range: "10_to_30", weekly_hours: 12, difficulty: 3, satisfaction: 4,
    title: "유튜브 영상 자막 번역으로 월 20만원",
    content: "외국 유튜버 채널 자막 번역 의뢰를 크몽에서 받기 시작했어요. 분당 3~5천 원 수준이고 10분 영상에 2~3만 원이에요. 영상 주제에 관심 있으면 보면서 번역하는 게 오히려 재미있어요. IT, 게임 자막은 단가가 조금 더 높아요.",
    pros: "관심 있는 분야 영상을 보면서 돈을 버는 느낌이라 지속하기 쉬움",
    cons: "분당 단가 계산하면 시간당 수익이 높지 않아 빠르게 번역하는 속도가 중요함",
    recommend: true,
  },
  {
    hustle_id: "translation", hustle_name: "번역 프리랜서 (플리토 등)",
    nickname: "번역DeepL시대고충",
    income_range: "under_10", weekly_hours: 5, difficulty: 3, satisfaction: 2,
    title: "AI 번역이 좋아지면서 단순 번역 의뢰가 줄었어요",
    content: "DeepL, ChatGPT 번역 수준이 올라가면서 단순 번역 의뢰가 예전보다 30% 이상 줄었어요. AI 번역 후 교정·편집 의뢰로 형태가 바뀌고 있어요. 앞으로는 고품질 번역, 전문 분야, 현지화(로컬라이징) 방향으로 나아가지 않으면 경쟁이 힘들 것 같아요.",
    pros: "AI 번역 교정 역할로 전환하면 오히려 시간 효율이 올라갈 수 있음",
    cons: "AI 발전으로 단순 번역 수요가 감소 중이며 장기적인 단가 하락이 우려됨",
    recommend: false,
  },

  // ────────────────────────────────────────────────
  // E심팔이 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "esim-palee", hustle_name: "E심팔이 (eSIM 재판매)",
    nickname: "eSIM해외여행성수기",
    income_range: "50_to_100", weekly_hours: 10, difficulty: 2, satisfaction: 5,
    title: "여름 성수기에 월 80만원까지 올라갔어요",
    content: "해외여행 성수기인 여름, 설, 추석 연휴 때 주문이 폭발해요. 평소 월 30만 원인데 성수기엔 80만 원까지 올라가요. SNS와 블로그에 국가별 eSIM 안내 글 올려두면 검색으로 자연 유입이 꾸준히 들어와요.",
    pros: "성수기 때 평소 대비 2~3배 수익이 발생하고 콘텐츠 마케팅으로 자동화 가능",
    cons: "여행 비수기엔 수익이 크게 줄어 월별 수익 편차가 심함",
    recommend: true,
  },
  {
    hustle_id: "esim-palee", hustle_name: "E심팔이 (eSIM 재판매)",
    nickname: "eSIM재판매마진",
    income_range: "10_to_30", weekly_hours: 5, difficulty: 2, satisfaction: 4,
    title: "건당 1~2만원 마진, 월 30건이면 30~60만원",
    content: "일본, 태국, 유럽 eSIM 건당 1~2만 원 마진이에요. 하루 1~2건씩 주문 들어와서 월 30건이면 30~60만 원이에요. 주문 들어오면 도매처에서 코드 받아서 전달만 하면 돼서 실제 작업 시간은 하루 30분도 안 걸려요.",
    pros: "주문당 처리 시간이 매우 짧고 재고 관리가 필요 없음",
    cons: "가격 경쟁이 심해지고 있어서 지속적인 가격 모니터링이 필요함",
    recommend: true,
  },
  {
    hustle_id: "esim-palee", hustle_name: "E심팔이 (eSIM 재판매)",
    nickname: "eSIM고객CS경험",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 2, satisfaction: 3,
    title: "eSIM 연결 안 된다는 문의가 간혹 있어요",
    content: "eSIM이 특정 폰과 호환이 안 되거나 설정 방법을 몰라서 연락 오는 경우가 있어요. 환불 요청도 간혹 있고요. 국가별, 단말별 호환 정보 미리 정리해두고 설치 가이드 만들어두면 CS가 많이 줄어요.",
    pros: "사전에 FAQ 자료만 잘 만들어두면 CS 부담이 크게 줄어듦",
    cons: "기술적 문제로 연결이 안 될 때 해결해주기 어렵고 환불 분쟁이 생길 수 있음",
    recommend: true,
  },
  {
    hustle_id: "esim-palee", hustle_name: "E심팔이 (eSIM 재판매)",
    nickname: "eSIM경쟁심화",
    income_range: "under_10", weekly_hours: 6, difficulty: 3, satisfaction: 2,
    title: "2년 사이에 경쟁자가 너무 많아졌어요",
    content: "부업으로 유명해지면서 eSIM 판매 경쟁이 치열해졌어요. 가격 내리면 마진이 너무 낮아지고 안 내리면 경쟁에서 밀려요. 지금 시작하려면 차별화 포인트가 있어야 해요. SNS 팔로워나 특정 커뮤니티 기반이 없으면 시작이 어려워요.",
    pros: "아직 기반이 있다면 지속할 수 있으나 신규 진입은 차별화 전략이 필수",
    cons: "경쟁 심화로 마진이 점점 낮아지고 있어 진입 타이밍이 이미 지났을 수 있음",
    recommend: false,
  },

  // ────────────────────────────────────────────────
  // AI 자동화 서비스 판매 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "chatgpt-service", hustle_name: "AI 자동화 서비스 판매",
    nickname: "GPT블로그자동화판매",
    income_range: "30_to_50", weekly_hours: 10, difficulty: 3, satisfaction: 4,
    title: "블로그 자동화 시스템 구축 대행으로 월 40만원",
    content: "소상공인, 1인 창업자에게 네이버 블로그 자동화 시스템 구축해줘요. GPT API로 포스팅 초안 생성하고 예약 발행까지 연결하는 시스템이에요. 한 번 구축에 30~50만 원 받고, 유지보수 월정액 받는 사람도 있어요.",
    pros: "기술 이해도가 높을수록 단가를 올릴 수 있고 반복 수익 구조 만들기 좋음",
    cons: "AI 도구 변화가 빠르기 때문에 지속적인 공부가 필요함",
    recommend: true,
  },
  {
    hustle_id: "chatgpt-service", hustle_name: "AI 자동화 서비스 판매",
    nickname: "GPT엑셀자동화",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 3, satisfaction: 4,
    title: "엑셀 자동화 GPT 연결 서비스로 건당 15만원",
    content: "중소기업 직원들이 반복하는 엑셀 작업을 GPT로 자동화하는 서비스예요. 건당 10~20만 원이고 한 달에 2~3건 하면 월 25만 원이에요. 프로그래밍 몰라도 GPT와 엑셀 매크로 기초만 알면 가능해요.",
    pros: "기업 대상 서비스라 단가가 높고 반복 업무 자동화 수요가 많음",
    cons: "영업이 필요하고 처음 클라이언트 찾기가 어려움",
    recommend: true,
  },
  {
    hustle_id: "chatgpt-service", hustle_name: "AI 자동화 서비스 판매",
    nickname: "AI서비스크몽도전",
    income_range: "under_10", weekly_hours: 10, difficulty: 4, satisfaction: 2,
    title: "크몽에 올렸는데 아직 뭘 팔아야 할지 애매해요",
    content: "AI 서비스라는 카테고리가 넓어서 무엇을 어떻게 상품화해야 할지 구체화가 어려워요. 'ChatGPT 컨설팅'이라고 올렸는데 고객이 원하는 게 뭔지 구체적으로 정의가 안 됐었어요. 아주 구체적인 문제 해결 서비스로 좁혀야 팔려요.",
    pros: "수요가 있는 분야라 방향만 제대로 잡으면 잠재력이 큼",
    cons: "상품 범위가 너무 넓어서 구체화 없이 시작하면 주문이 거의 없음",
    recommend: false,
  },
  {
    hustle_id: "chatgpt-service", hustle_name: "AI 자동화 서비스 판매",
    nickname: "AI강의대행성공",
    income_range: "50_to_100", weekly_hours: 15, difficulty: 3, satisfaction: 5,
    title: "중소기업 AI 활용 교육으로 월 80만원",
    content: "중소기업 대상 ChatGPT 업무 활용 교육 강의해요. 2~3시간짜리 워크숍 형태로 30~50만 원씩 받아요. 한 번 하면 입소문으로 다른 회사 소개가 와요. 요즘 기업들이 직원 AI 교육 수요가 많아서 진짜 블루오션이에요.",
    pros: "기업 교육 수요가 폭발적으로 늘고 있고 단가가 높음",
    cons: "강의 자료 준비와 현장 교육 역량이 필요하며 B2B 영업이 필수임",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 스톡 사진 판매 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "stock-photo", hustle_name: "스톡 사진·영상 판매",
    nickname: "어도비스톡등록중",
    income_range: "under_10", weekly_hours: 5, difficulty: 3, satisfaction: 3,
    title: "어도비스톡 200장 등록하고 월 3만원",
    content: "어도비스톡에 사진 200장 올렸는데 월 3만 원이에요. 생각보다 수익이 적어서 실망했지만 계속 올리면 누적 수익이 늘어날 거라 기대하며 하고 있어요. 뷰 수 높은 키워드로 잘 찍은 사진이 필요하다는 걸 나중에 알게 됐어요.",
    pros: "한 번 올린 사진이 지속적으로 수익을 만들어 장기적 패시브 인컴이 됨",
    cons: "초반에 수익이 매우 적어서 장기적 관점으로 접근하지 않으면 포기하기 쉬움",
    recommend: true,
  },
  {
    hustle_id: "stock-photo", hustle_name: "스톡 사진·영상 판매",
    nickname: "스톡영상고단가",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 4, satisfaction: 4,
    title: "사진보다 영상이 건당 단가가 5배 높아요",
    content: "4K 영상 클립이 사진보다 훨씬 단가가 높아요. 사진은 건당 0.5~1달러인데 영상 클립은 5~20달러까지 나와요. 드론 영상, 일상 씬 등 자연스러운 영상이 수요가 높아요. 카메라 있으면 영상 스톡으로 전환 추천해요.",
    pros: "영상 클립은 사진보다 단가가 높고 동일 시간 대비 수익이 큼",
    cons: "영상 편집, 색보정 등 후처리 시간이 사진보다 많이 들어감",
    recommend: true,
  },
  {
    hustle_id: "stock-photo", hustle_name: "스톡 사진·영상 판매",
    nickname: "셔터스톡한국소재",
    income_range: "10_to_30", weekly_hours: 6, difficulty: 3, satisfaction: 4,
    title: "한국 소재 사진이 해외에서 의외로 인기 있어요",
    content: "한복, 한식, 서울 거리 등 한국 소재 사진이 생각보다 해외 구매자에게 잘 팔려요. 서양 포토그래퍼가 못 찍는 한국 특유의 분위기를 담은 사진이 경쟁력 있어요. 한국적인 소재를 적극 활용하면 차별화가 쉬워요.",
    pros: "한국 소재는 글로벌 포토그래퍼와 경쟁 없이 차별화된 공급이 가능",
    cons: "특정 소재 수요가 제한적이라 다양한 키워드로 분산 등록이 필요",
    recommend: true,
  },
  {
    hustle_id: "stock-photo", hustle_name: "스톡 사진·영상 판매",
    nickname: "AI이미지생성스톡",
    income_range: "under_10", weekly_hours: 4, difficulty: 2, satisfaction: 2,
    title: "AI 생성 이미지는 대부분 플랫폼에서 거절당해요",
    content: "Midjourney로 이미지 만들어 올렸다가 어도비스톡에서 전량 삭제됐어요. 플랫폼들이 AI 생성 이미지 정책을 강화하고 있어서 실제 사진 없이 AI 이미지만으로 스톡 수익 내기가 어려워졌어요. 실제 카메라로 찍은 사진이 있어야 안정적이에요.",
    pros: "실제 사진이 있다면 AI 규제와 관계없이 꾸준히 판매 가능함",
    cons: "AI 생성 이미지는 주요 플랫폼에서 거절되므로 실제 촬영 장비가 필요함",
    recommend: false,
  },

  // ────────────────────────────────────────────────
  // 인스타그램 협찬 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "instagram-sponsor", hustle_name: "인스타그램 협찬·광고",
    nickname: "팔로워5천협찬시작",
    income_range: "under_10", weekly_hours: 8, difficulty: 4, satisfaction: 3,
    title: "팔로워 5천인데 협찬 제안이 오기 시작했어요",
    content: "뷰티 계정 팔로워 5천에 협찬이 오기 시작했어요. 주로 소규모 브랜드이고 제품 제공+소정의 원고료 형태예요. 돈보다 제품 협찬이 많아서 지금 단계에서는 사실상 무급에 가까워요. 팔로워 1만 이상이 돼야 의미 있는 금전 협찬이 온다고 하더라고요.",
    pros: "팔로워가 적어도 세분화된 분야면 협찬 문의가 시작될 수 있음",
    cons: "팔로워 1만 미만에서는 금전 협찬보다 제품 협찬이 대부분",
    recommend: true,
  },
  {
    hustle_id: "instagram-sponsor", hustle_name: "인스타그램 협찬·광고",
    nickname: "팔로워2만협찬단가",
    income_range: "30_to_50", weekly_hours: 10, difficulty: 4, satisfaction: 4,
    title: "팔로워 2만에 협찬 건당 30~50만원이에요",
    content: "뷰티 인스타 팔로워 2만이에요. 협찬 단가가 건당 30~50만 원이고 한 달에 2~3건 들어와요. 글을 팔리는 형식으로 잘 써야 브랜드가 재협찬 하러 와요. 참여율 관리가 팔로워 수만큼 중요해요.",
    pros: "팔로워 2만 이상이면 협찬 금전 단가가 본격적으로 의미 있는 수준이 됨",
    cons: "참여율 관리가 안 되면 팔로워 수 대비 협찬 단가가 낮아질 수 있음",
    recommend: true,
  },
  {
    hustle_id: "instagram-sponsor", hustle_name: "인스타그램 협찬·광고",
    nickname: "인스타성장정체기",
    income_range: "under_10", weekly_hours: 15, difficulty: 5, satisfaction: 2,
    title: "6개월 열심히 해도 팔로워 3천에서 멈춰있어요",
    content: "하루 1포스팅씩 6개월 했는데 팔로워 3천에서 정체예요. 릴스도 해봤는데 폭발적인 반응이 없어요. 인스타는 초반에 바이럴이 없으면 성장이 정말 더뎌요. 협찬 수익은 아직 0원이에요. 방향 전환을 고민 중이에요.",
    pros: "방향 전환 시 기존 콘텐츠 자산은 그대로 활용 가능함",
    cons: "초기 바이럴 없이는 성장이 매우 더디고 수익화까지 시간이 너무 걸림",
    recommend: false,
  },
  {
    hustle_id: "instagram-sponsor", hustle_name: "인스타그램 협찬·광고",
    nickname: "릴스바이럴후협찬",
    income_range: "10_to_30", weekly_hours: 12, difficulty: 3, satisfaction: 4,
    title: "릴스 하나 터지고 팔로워 8천 점프, 협찬 20만원",
    content: "일상 릴스 하나가 조회수 50만 터지면서 팔로워가 2천에서 8천으로 늘었어요. 그 이후로 협찬 문의가 들어오기 시작했고 첫 달 협찬 20만 원 받았어요. 릴스 바이럴이 인스타 성장의 가장 빠른 방법인 것 같아요.",
    pros: "릴스 하나가 터지면 팔로워와 협찬 수익이 빠르게 성장할 수 있음",
    cons: "어떤 영상이 바이럴될지 예측이 어렵고 운적인 요소가 있음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 당근마켓 중고 플리핑 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "used-flip", hustle_name: "당근마켓 중고 플리핑",
    nickname: "전자기기플리핑노하우",
    income_range: "10_to_30", weekly_hours: 8, difficulty: 3, satisfaction: 4,
    title: "아이폰 중고 플리핑으로 월 18만원 남겨요",
    content: "당근에서 화면 깨진 아이폰 싸게 사서 액정 교체 후 다시 팔아요. 액정 교체 비용 3~5만 원인데 판매가 차이가 8~12만 원이라 건당 5~7만 원 남아요. 한 달에 3건 하면 15~20만 원이에요. 아이폰 기종별 수리 비용 공부가 먼저예요.",
    pros: "수리 지식이 생기면 다양한 제품으로 확장 가능하고 마진율이 높음",
    cons: "수리 실패하거나 숨은 결함 있으면 손실이 생길 수 있음",
    recommend: true,
  },
  {
    hustle_id: "used-flip", hustle_name: "당근마켓 중고 플리핑",
    nickname: "가전제품중고플리핑",
    income_range: "10_to_30", weekly_hours: 10, difficulty: 2, satisfaction: 4,
    title: "청소기, 에어프라이어 세척 후 재판매로 월 15만원",
    content: "당근에서 먼지 쌓인 청소기, 에어프라이어 저렴하게 사서 세척, 정비하면 새것처럼 보여요. 사진 잘 찍어서 올리면 원래 가격의 70~80%에 팔려요. 수리 지식 없어도 청소·세척만으로도 가치가 많이 올라가요.",
    pros: "수리 없이 세척·청소만으로도 재판매 가치가 크게 올라감",
    cons: "작동 불량품을 모르고 사면 손실이 생기므로 직거래로 테스트 후 구매 필수",
    recommend: true,
  },
  {
    hustle_id: "used-flip", hustle_name: "당근마켓 중고 플리핑",
    nickname: "명품가방진품판단어려움",
    income_range: "under_10", weekly_hours: 5, difficulty: 4, satisfaction: 2,
    title: "명품 중고는 진품 판단이 너무 어렵고 위험해요",
    content: "명품 가방 플리핑 시도했다가 산 게 고급 레플이었어요. 당근 직거래라 환불도 못 받았어요. 명품은 공식 감정서 있는 것만 사거나 KREAM 같은 검수 있는 플랫폼 이용하는 게 안전해요. 명품 중고는 전문 지식 없이 하면 절대 안 돼요.",
    pros: "진품 감별 능력이 있다면 마진이 매우 높음",
    cons: "가품 위험이 크고 환불이 어려워 초보자에게 매우 위험한 분야",
    recommend: false,
  },
  {
    hustle_id: "used-flip", hustle_name: "당근마켓 중고 플리핑",
    nickname: "책플리핑꾸준히",
    income_range: "under_10", weekly_hours: 4, difficulty: 1, satisfaction: 4,
    title: "중고 책 플리핑, 리스크 없이 월 5만원 꾸준히",
    content: "당근에서 책 묶음 5천~1만 원에 사서 알라딘 중고서점에 권당 팔아요. 묶음으로 사면 권당 원가가 300~500원인데 알라딘에서 권당 500~2000원 받을 수 있어요. 리스크가 없고 취미처럼 할 수 있어서 스트레스 없이 하고 있어요.",
    pros: "투자금이 매우 적고 리스크가 낮아서 부담 없이 시작 가능",
    cons: "수익이 크지 않고 책 무게 때문에 운반이 불편할 수 있음",
    recommend: true,
  },

  // ────────────────────────────────────────────────
  // 캐시슬라이드 (+4)
  // ────────────────────────────────────────────────
  {
    hustle_id: "cashslide", hustle_name: "캐시슬라이드·잠금화면 앱테크",
    nickname: "앱테크조합팁",
    income_range: "under_10", weekly_hours: 1, difficulty: 1, satisfaction: 4,
    title: "앱테크 5개 조합해서 월 3만원, 커피값은 벌어요",
    content: "캐시슬라이드, 머니워크, 티머니GO, 신한플레이, 하나원큐 앱 5개 동시에 써요. 각각 혼자서는 적지만 합치면 월 3만 원이에요. 폰 쓰면서 자동으로 쌓이는 거라 추가 시간이 거의 없어요. 커피 한 잔이라도 버는 느낌이 좋아요.",
    pros: "여러 앱 조합하면 적은 시간으로 의미 있는 소액 수익이 가능",
    cons: "앱이 많아지면 배터리 소모와 데이터 사용량이 늘어남",
    recommend: true,
  },
  {
    hustle_id: "cashslide", hustle_name: "캐시슬라이드·잠금화면 앱테크",
    nickname: "앱테크시간낭비론",
    income_range: "under_10", weekly_hours: 2, difficulty: 1, satisfaction: 2,
    title: "시간당 계산하면 최저시급의 10분의 1도 안 돼요",
    content: "미션, 퀴즈, 광고 보기 등에 시간을 쓰다 보면 하루 30분은 써요. 그래서 버는 게 하루 100~200원이에요. 그냥 켜두는 잠금화면 적립은 괜찮은데 미션 하면서 시간을 투자하는 건 시간 낭비예요. 수동적으로 쌓이는 것만 쓰는 걸 추천해요.",
    pros: "잠금화면 수동 적립만 사용하면 시간 없이 소액 수익 가능",
    cons: "미션, 광고 보기 등에 시간 쓰면 시간당 수익이 최저시급에 비해 매우 낮음",
    recommend: false,
  },
  {
    hustle_id: "cashslide", hustle_name: "캐시슬라이드·잠금화면 앱테크",
    nickname: "앱테크추천인코드활용",
    income_range: "under_10", weekly_hours: 1, difficulty: 1, satisfaction: 4,
    title: "추천인 코드 공유하면 추가 적립이 돼요",
    content: "캐시슬라이드 추천 코드 커뮤니티에 올렸더니 10명 가입해서 보너스 2만 원 받았어요. 직접 앱 쓰는 것보다 추천으로 버는 게 훨씬 빠를 수 있어요. 앱테크 카페, 커뮤니티에서 추천 코드 공유하는 문화가 있어요.",
    pros: "추천인 코드 적극 공유하면 기본 적립보다 훨씬 빠르게 수익을 모을 수 있음",
    cons: "추천 코드 공유를 위한 커뮤니티 활동이 추가로 필요함",
    recommend: true,
  },
  {
    hustle_id: "cashslide", hustle_name: "캐시슬라이드·잠금화면 앱테크",
    nickname: "앱테크노인분추천",
    income_range: "under_10", weekly_hours: 1, difficulty: 1, satisfaction: 5,
    title: "부모님께 추천했더니 용돈 생겼다고 너무 좋아하세요",
    content: "스마트폰 하루 종일 쓰시는 부모님께 앱테크 앱들 설치해드렸어요. 미션 같은 거 없이 그냥 잠금화면만 켜두는 거라서 어르신도 쉽게 쓰실 수 있어요. 한 달에 1~2만 원 생겼다고 너무 좋아하세요. 단순한 용돈이지만 의미 있어요.",
    pros: "특별한 기술 없이 스마트폰만 있으면 누구나 시작 가능한 부업",
    cons: "수익이 매우 낮아서 의미 있는 부업으로 보기엔 한계가 있음",
    recommend: true,
  },

];

async function seed() {
  console.log(`총 ${REVIEWS.length}개 후기 삽입 시작...`);
  let success = 0;
  let fail = 0;

  for (const review of REVIEWS) {
    const { error } = await supabase.from("reviews").insert({
      ...review,
      title: review.title,
      content: review.content,
      weekly_hours: review.weekly_hours,
      difficulty: review.difficulty,
      satisfaction: review.satisfaction,
      likes: 0,
      kakao_user_id: null,
      anon_password_hash: null,
      anon_ip: null,
      proof_image_url: null,
    });

    if (error) {
      console.error(`❌ ${review.hustle_id} (${review.nickname}):`, error.message);
      fail++;
    } else {
      console.log(`✅ ${review.hustle_id} — ${review.nickname}`);
      success++;
    }
  }

  console.log(`\n완료: 성공 ${success}개 / 실패 ${fail}개`);
}

seed().catch(console.error);
