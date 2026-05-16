/**
 * 후기 대량 삽입 스크립트 (Part 3: 리셀/앱테크/투자/배달/디지털콘텐츠)
 * 실행: npx tsx scripts/seed-bulk-reviews-3.ts
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
  // kream (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"kream", hustle_name:"KREAM 리셀", nickname:"크림나이키리셀", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"나이키 한정판으로 월 20만원 리셀 수익", content:"발매일에 줄 서서 사거나 드로우 당첨돼서 크림에 올리면 2~3만원 차익이 나요. 매달 2~3번 성공하면 월 20만원 됩니다. 발매 정보 빠르게 아는 게 핵심이에요.", pros:"한정판 정보만 빠르면 적은 시간으로 수익 가능", cons:"드로우 당첨이 운에 좌우되고 줄 서기가 체력 소모됨", recommend:true },
  { hustle_id:"kream", hustle_name:"KREAM 리셀", nickname:"크림수수료계산", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:2, title:"수수료 계산 잘못하면 손해봐요", content:"크림 수수료가 판매자 3% + 검수비가 따로 있어요. 차익이 5만원이어도 수수료 빼면 3만원 남는 경우도 있어요. 수익 계산 꼼꼼히 해야 해요.", pros:"플랫폼 자체 검수 시스템으로 사기 걱정이 없음", cons:"수수료가 여러 항목으로 나뉘어서 실수령액이 생각보다 낮음", recommend:true },
  { hustle_id:"kream", hustle_name:"KREAM 리셀", nickname:"크림포켓몬리셀", income_range:"30_to_50", weekly_hours:12, difficulty:4, satisfaction:4, title:"포켓몬 카드 → 크림 리셀로 월 40만원", content:"포켓몬 카드를 크림에서도 팔 수 있어요. 희귀 카드는 시세 차익이 2~5배 나는 경우도 있어요. 카드 시세 공부가 필수입니다.", pros:"카드 게임 관심 있으면 즐기면서 수익 창출 가능", cons:"카드 시세가 급변해서 타이밍 잘못 잡으면 손실 발생", recommend:true },
  { hustle_id:"kream", hustle_name:"KREAM 리셀", nickname:"크림검수반려경험", income_range:"under_10", weekly_hours:8, difficulty:4, satisfaction:2, title:"검수 반려 당하면 판매 불가, 주의 필요", content:"크림 검수 기준이 엄격해요. 박스 훼손, 택 상태 불량이면 반려되고 반송비까지 물어야 해요. 상품 상태 관리를 정말 꼼꼼히 해야 합니다.", pros:"검수 통과하면 구매자에게 신뢰를 주는 안전한 거래", cons:"검수 기준이 까다로워서 반려 시 시간과 비용 손실 발생", recommend:true },
  { hustle_id:"kream", hustle_name:"KREAM 리셀", nickname:"크림무재고리셀", income_range:"10_to_30", weekly_hours:10, difficulty:4, satisfaction:3, title:"무재고 리셀 도전했다가 위험성 깨달았어요", content:"선 판매 후 구매하는 무재고 방식 시도했는데 공급 품절로 낭패 봤어요. 크림은 거래 이행 안 하면 패널티가 크니까 확실한 재고 있는 것만 올려야 해요.", pros:"시세 파악만 잘 하면 짧은 시간에 수익 가능", cons:"무재고 리셀은 공급 실패 시 패널티 위험이 있음", recommend:false },
  { hustle_id:"kream", hustle_name:"KREAM 리셀", nickname:"크림장기투자리셀", income_range:"50_to_100", weekly_hours:6, difficulty:3, satisfaction:5, title:"희귀 스니커즈 장기 보유 후 고수익 실현", content:"3년 전에 산 한정판 스니커즈가 지금 3배 올랐어요. 크림에서 팔았더니 한 켤레에 80만원 차익이 났습니다. 리셀을 재테크 개념으로 접근하면 고수익이 가능해요.", pros:"희귀 한정판 장기 보유 시 가격 상승으로 큰 수익 가능", cons:"장기 보관 중 상품 훼손 위험과 시세 하락 가능성이 있음", recommend:true },

  // ────────────────────────────────────────────────
  // bunjang-resell (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"bunjang-resell", hustle_name:"번개장터 리셀", nickname:"번개장터플리마켓", income_range:"10_to_30", weekly_hours:10, difficulty:2, satisfaction:4, title:"집에 있던 중고 팔아서 월 15만원", content:"안 쓰는 물건 팔면서 시작했는데 중고 거래 노하우가 쌓이면서 지금은 소싱도 해서 팔아요. 월 15만원 정도인데 정리도 되고 수익도 생겨서 만족해요.", pros:"처음에 집에 있는 물건부터 팔 수 있어서 초기 비용 0", cons:"인기 카테고리에서 가격 경쟁이 치열해짐", recommend:true },
  { hustle_id:"bunjang-resell", hustle_name:"번개장터 리셀", nickname:"번개장터테크리셀", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"중고 스마트폰 리셀로 월 35만원", content:"당근에서 저렴한 중고폰 사서 번개장터에 약간 높게 팔아요. 기종별 시세 파악이 핵심이에요. 월 10~15대 거래하면 월 35만원 정도 나옵니다.", pros:"스마트폰은 수요가 안정적이고 시세 파악이 비교적 쉬움", cons:"사기 거래 위험이 있어서 직거래 시 주의가 필요함", recommend:true },
  { hustle_id:"bunjang-resell", hustle_name:"번개장터 리셀", nickname:"번개장터세금신고", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:3, title:"세금 신고 기준 알고 시작하세요", content:"번개장터 연간 판매금액이 일정 기준 넘으면 세금 신고해야 해요. 생각보다 기준이 낮아서 꾸준히 리셀하는 분들은 미리 알아두는 게 좋아요.", pros:"플랫폼이 안정적이고 구매자 풀이 넓음", cons:"연 수익이 늘면 세금 신고 의무가 생겨서 관리가 필요함", recommend:true },
  { hustle_id:"bunjang-resell", hustle_name:"번개장터 리셀", nickname:"번개장터명품가방", income_range:"50_to_100", weekly_hours:8, difficulty:4, satisfaction:5, title:"중고 명품 리셀로 월 60만원 고수익", content:"명품 가방 시세를 3개월 공부하고 시작했어요. 진품 감별이 가능하면 저렴하게 사서 번개장터에서 팔아요. 마진이 10~20%라도 금액이 크니까 수익이 높아요.", pros:"고가 상품이라 마진이 낮아도 절대 수익이 큼", cons:"진품 감별 실수 시 손실이 크고 사기 피해 위험도 있음", recommend:true },
  { hustle_id:"bunjang-resell", hustle_name:"번개장터 리셀", nickname:"번개장터노쇼경험", income_range:"under_10", weekly_hours:12, difficulty:3, satisfaction:2, title:"노쇼, 가격 흥정에 지쳐서 거의 그만뒀어요", content:"직거래 시 노쇼가 너무 많아요. 약속 잡고 나타나지 않는 경우가 5번에 1번꼴이에요. 안전결제 위주로 전환했더니 그나마 나아졌는데 수수료가 아쉬워요.", pros:"안전결제 사용하면 직거래 노쇼 문제를 해결할 수 있음", cons:"직거래 노쇼가 빈번하고 가격 흥정 요청이 피로감을 줌", recommend:true },

  // ────────────────────────────────────────────────
  // used-flip (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"used-flip", hustle_name:"당근마켓 중고", nickname:"당근부업6개월", income_range:"10_to_30", weekly_hours:8, difficulty:1, satisfaction:5, title:"집 정리하면서 월 20만원 벌었어요", content:"이사하면서 안 쓰는 물건 팔기 시작했는데 6개월 동안 총 120만원 벌었어요. 지금은 중고 소싱도 해서 팔고 있어요. 시작이 쉽고 진입장벽이 없어요.", pros:"시작 비용 0원이고 집 정리 효과도 동시에 있음", cons:"수익 한계가 있고 직거래 시 만남 일정 조율이 번거로움", recommend:true },
  { hustle_id:"used-flip", hustle_name:"당근마켓 중고", nickname:"당근가전제품리셀", income_range:"10_to_30", weekly_hours:10, difficulty:2, satisfaction:4, title:"중고 가전 리셀로 월 18만원", content:"당근에서 저렴한 중고 가전 사서 청소, 수리 후 다시 팔아요. 작은 공구 다룰 줄 알면 마진을 높일 수 있어요. 에어컨, 세탁기 등 대형가전이 수익이 높아요.", pros:"수리 능력이 있으면 마진을 크게 높일 수 있음", cons:"대형가전은 운반비가 들어서 수익 계산 시 포함해야 함", recommend:true },
  { hustle_id:"used-flip", hustle_name:"당근마켓 중고", nickname:"당근부업주부", income_range:"10_to_30", weekly_hours:6, difficulty:1, satisfaction:5, title:"주부로 당근 부업 3년째, 누적 500만원 달성", content:"아이 키우면서 시간이 애매할 때 당근 거래해요. 주로 아이 장난감, 옷 사고팔기인데 3년 동안 누적 500만원이에요. 부담 없이 할 수 있어서 오래 했어요.", pros:"스트레스 없이 시간 날 때만 해도 되는 부업", cons:"수익이 크지 않아서 주 수입원으로는 부적합", recommend:true },
  { hustle_id:"used-flip", hustle_name:"당근마켓 중고", nickname:"당근사기조심", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:2, title:"직거래 사기 당한 경험 공유합니다", content:"고가 물건 거래하다가 현금 사기를 당했어요. 당근 안전결제가 있는데도 현금 고집하는 분이 사기였어요. 고가 물건은 반드시 안전결제나 계좌이체 거래하세요.", pros:"안전결제 사용하면 사기 위험을 크게 줄일 수 있음", cons:"현금 직거래 시 사기 위험이 있고 경찰 신고해도 해결이 어려움", recommend:true },
  { hustle_id:"used-flip", hustle_name:"당근마켓 중고", nickname:"당근지역장사", income_range:"10_to_30", weekly_hours:12, difficulty:2, satisfaction:4, title:"지역 특성 파악하면 더 잘 팔려요", content:"아파트 밀집 지역에서는 유아용품이 잘 팔리고 대학가에서는 전자제품이 잘 팔려요. 지역 수요를 파악하면 더 빠르게 팔 수 있어요.", pros:"지역 수요 파악하면 회전율이 빨라지고 수익이 늘어남", cons:"지역 이동이 필요해서 멀리 있는 구매자는 거래가 어려움", recommend:true },
  { hustle_id:"used-flip", hustle_name:"당근마켓 중고", nickname:"당근플리마켓병행", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"당근+플리마켓 병행으로 수익 극대화", content:"평소엔 당근으로 팔고 주말에 플리마켓 나가면 단기간에 많은 물건을 팔 수 있어요. 한 번 나갈 때 10~15만원씩 현금 수입이 생겨요.", pros:"플리마켓 병행 시 재고를 한꺼번에 처리 가능", cons:"플리마켓 부스비 5~10만원이 들어가는 경우도 있음", recommend:true },

  // ────────────────────────────────────────────────
  // ticket-resell (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"ticket-resell", hustle_name:"공연 티켓 리셀", nickname:"콘서트티켓리셀", income_range:"10_to_30", weekly_hours:5, difficulty:3, satisfaction:4, title:"인기 가수 콘서트 티켓으로 건당 10만원 수익", content:"인기 아이돌 콘서트 티켓 예매 성공하면 건당 5~15만원 차익이 나요. 예매 노하우와 빠른 인터넷이 핵심이에요. 한 달에 1~2번 성공하면 20만원 됩니다.", pros:"짧은 시간 투자로 건당 수익이 높음", cons:"예매 경쟁이 치열하고 실패하면 수익이 0", recommend:true },
  { hustle_id:"ticket-resell", hustle_name:"공연 티켓 리셀", nickname:"티켓리셀법적이슈", income_range:"under_10", weekly_hours:3, difficulty:4, satisfaction:2, title:"법적 리스크 꼭 알고 시작하세요", content:"공연 티켓 리셀은 법적으로 애매한 영역이에요. 반복적으로 하면 사업소득으로 신고해야 하고, 일부 공연사에서는 약관으로 금지하는 경우도 있어요.", pros:"수요가 높은 공연은 확실한 수익이 보장됨", cons:"법적 리스크와 세금 신고 의무가 있음", recommend:false },
  { hustle_id:"ticket-resell", hustle_name:"공연 티켓 리셀", nickname:"스포츠티켓리셀", income_range:"10_to_30", weekly_hours:6, difficulty:3, satisfaction:4, title:"야구, 축구 티켓으로 시즌 내내 부업", content:"한국 야구 인기 팀 티켓을 리셀해요. 주말 경기는 차익이 3~5만원 나고 플레이오프는 10만원 이상도 돼요. 스포츠 시즌 내내 꾸준한 수익이에요.", pros:"시즌 내내 수요가 꾸준해서 안정적인 리셀 가능", cons:"시즌 오프 기간에는 수익이 없어서 시즌성이 강함", recommend:true },
  { hustle_id:"ticket-resell", hustle_name:"공연 티켓 리셀", nickname:"티켓리셀자동화", income_range:"30_to_50", weekly_hours:10, difficulty:4, satisfaction:4, title:"예매 매크로 없이 빠른 예매 노하우로 월 35만원", content:"매크로 쓰면 약관 위반이라 손가락 훈련으로 빠른 예매 합니다. 여러 디바이스 준비해놓고 동시 접속하는 게 노하우예요. 월 35만원 정도 나와요.", pros:"합법적인 범위 내에서 꾸준한 수익 창출 가능", cons:"예매 경쟁이 치열해서 매번 성공이 보장되지 않음", recommend:true },
  { hustle_id:"ticket-resell", hustle_name:"공연 티켓 리셀", nickname:"뮤지컬티켓리셀", income_range:"10_to_30", weekly_hours:5, difficulty:3, satisfaction:3, title:"뮤지컬 티켓 리셀로 소소하게 용돈", content:"뮤지컬은 스포츠보다 차익이 낮지만 취소표 구해서 파는 방식도 있어요. 인기 배우 출연작은 차익이 꽤 나요. 월 10~15만원 수준이에요.", pros:"뮤지컬은 장기 공연이라 수요가 꾸준함", cons:"스포츠 대비 차익이 낮고 취소표 구하기가 어려움", recommend:true },
  { hustle_id:"ticket-resell", hustle_name:"공연 티켓 리셀", nickname:"해외공연리셀경험", income_range:"50_to_100", weekly_hours:8, difficulty:4, satisfaction:5, title:"해외 팬 대상 리셀로 월 60만원 이상", content:"해외 아티스트 내한 공연 티켓을 해외 팬들에게 리셀하면 단가가 훨씬 높아요. 2~3배 프리미엄도 가능해요. 영어 소통이 되면 해외 리셀이 국내보다 수익이 높습니다.", pros:"해외 팬 대상 리셀은 프리미엄이 매우 높을 수 있음", cons:"환불, 배송 분쟁 시 해결이 복잡하고 사기 위험도 있음", recommend:true },

  // ────────────────────────────────────────────────
  // pokemon-card (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"pokemon-card", hustle_name:"포켓몬 카드 리셀", nickname:"포켓몬카드덕후부업", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:5, title:"좋아서 하다 보니 월 15만원이 됐어요", content:"포켓몬 카드 좋아서 모으다가 중복 카드 팔기 시작했어요. 희귀 카드는 수만원에 팔리기도 해요. 취미가 부업이 되는 최고의 케이스예요.", pros:"좋아하는 취미를 하면서 수익도 생기는 구조", cons:"시세 공부를 꾸준히 해야 하고 카드 구입 비용이 먼저 들어감", recommend:true },
  { hustle_id:"pokemon-card", hustle_name:"포켓몬 카드 리셀", nickname:"포켓몬카드개봉리셀", income_range:"30_to_50", weekly_hours:12, difficulty:4, satisfaction:4, title:"박스 개봉 영상 올리면서 카드 팔아요", content:"유튜브에 포켓몬 카드 박스 개봉 영상 올리면서 나온 카드 팔아요. 영상 수익 + 카드 판매 수익 합쳐서 월 35만원이에요. 두 가지를 병행하니까 효율적이에요.", pros:"영상 채널과 카드 판매를 시너지로 운영 가능", cons:"박스 구입 비용이 상당히 들어가서 자본이 필요함", recommend:true },
  { hustle_id:"pokemon-card", hustle_name:"포켓몬 카드 리셀", nickname:"포켓몬시세공부", income_range:"under_10", weekly_hours:10, difficulty:4, satisfaction:2, title:"시세 공부 안 하면 바로 손해봅니다", content:"카드 시세가 매일 달라져요. 트렌드에 민감하게 반응하는 시장이라 공부 없이 시작하면 비싸게 사서 싸게 파는 경우가 생겨요. 저도 처음에 20만원 손해봤어요.", pros:"시세 파악만 잘 하면 높은 수익을 낼 수 있는 시장", cons:"시세 변동이 빠르고 가짜 카드 구별 능력도 필요함", recommend:false },
  { hustle_id:"pokemon-card", hustle_name:"포켓몬 카드 리셀", nickname:"포켓몬카드그레이딩", income_range:"50_to_100", weekly_hours:10, difficulty:4, satisfaction:5, title:"PSA 그레이딩 받아서 고수익 리셀", content:"상태 좋은 희귀 카드를 PSA 그레이딩 받으면 가격이 2~5배 올라요. 그레이딩 비용이 들지만 고등급 카드는 수십만원에 팔려요. 월 60만원 됩니다.", pros:"그레이딩으로 카드 가치를 공식 인증해서 프리미엄 판매 가능", cons:"그레이딩 비용과 대기 시간이 상당함", recommend:true },
  { hustle_id:"pokemon-card", hustle_name:"포켓몬 카드 리셀", nickname:"포켓몬카드해외판매", income_range:"30_to_50", weekly_hours:12, difficulty:4, satisfaction:4, title:"이베이에서 해외 판매로 달러 수익", content:"국내보다 해외에서 한국 희귀 카드 가격이 높아요. 이베이, TCGPlayer에서 영어로 판매하면 같은 카드를 2배 이상 받을 수 있어요.", pros:"해외 판매 시 달러 수익과 프리미엄 가격 적용 가능", cons:"국제 배송 분쟁 처리와 영어 소통이 필요함", recommend:true },
  { hustle_id:"pokemon-card", hustle_name:"포켓몬 카드 리셀", nickname:"포켓몬카드입문", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:3, title:"입문자라면 소액으로 시작해보세요", content:"처음엔 1만원짜리 파우치 박스로 시작해요. 리스크가 낮고 시세 감각을 익히는 데 좋아요. 처음부터 큰 금액 투자하지 마세요.", pros:"소액으로 시작해서 리스크 없이 시장 감각 키울 수 있음", cons:"소액 거래는 마진이 낮아서 수익도 낮음", recommend:true },

  // ────────────────────────────────────────────────
  // cashslide (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"cashslide", hustle_name:"캐시슬라이드", nickname:"캐시슬라이드앱테크", income_range:"under_10", weekly_hours:2, difficulty:1, satisfaction:4, title:"잠금화면으로 월 5만원, 진짜 공짜 용돈", content:"스마트폰 잠금화면만 바꾸면 돈이 들어오는 구조예요. 광고 보는 게 귀찮지 않으면 월 4~5만원 되고 PAYCO 포인트로 교환하면 현금처럼 써요.", pros:"별도 시간 투자 없이 폰 쓰면서 자동으로 수익 발생", cons:"월 수익이 5만원 이하라 부업보다는 소소한 용돈 수준", recommend:true },
  { hustle_id:"cashslide", hustle_name:"캐시슬라이드", nickname:"앱테크여러개병행", income_range:"under_10", weekly_hours:3, difficulty:1, satisfaction:3, title:"캐시슬라이드 포함 앱테크 5개 병행해요", content:"캐시슬라이드, 토스, 오베이, 리워드앱 등 여러 개 병행해요. 합쳐서 월 10만원 정도 되는데 시간 투자가 거의 없으니까 그냥 해두는 거예요.", pros:"여러 앱 병행해도 시간 투자가 거의 없음", cons:"단독으로는 수익이 매우 낮고 알림 관리가 귀찮아짐", recommend:true },
  { hustle_id:"cashslide", hustle_name:"캐시슬라이드", nickname:"캐시슬라이드퀴즈", income_range:"under_10", weekly_hours:1, difficulty:1, satisfaction:4, title:"퀴즈 알림 설정하면 더 많이 벌어요", content:"퀴즈 이벤트 알림 켜두면 매일 캐시 추가로 챙길 수 있어요. 하루 10분만 투자하면 월 6~7만원까지 올라가요.", pros:"퀴즈 참여로 캐시 적립을 늘릴 수 있음", cons:"퀴즈 빈도가 불규칙해서 수익이 안정적이지 않음", recommend:true },
  { hustle_id:"cashslide", hustle_name:"캐시슬라이드", nickname:"캐시슬라이드현실", income_range:"under_10", weekly_hours:1, difficulty:1, satisfaction:2, title:"솔직히 용돈 수준도 안 돼요", content:"하루 10~20번 잠금해제해도 월 3만원이에요. 광고를 봐야 캐시가 더 쌓이는데 그 시간이 아깝게 느껴져서 거의 안 보게 됐어요.", pros:"완전 무설치형으로 폰 쓰면서 최소한의 수익 가능", cons:"시간 대비 수익이 매우 낮고 의미있는 부업으로 보기 어려움", recommend:false },
  { hustle_id:"cashslide", hustle_name:"캐시슬라이드", nickname:"캐시슬라이드PAYCO", income_range:"under_10", weekly_hours:2, difficulty:1, satisfaction:3, title:"PAYCO 포인트로 실생활에 유용하게 써요", content:"캐시를 PAYCO 포인트로 교환해서 편의점이나 온라인 쇼핑할 때 써요. 현금은 아니지만 실생활에 쏠쏠하게 사용할 수 있어서 나름 만족스럽습니다.", pros:"PAYCO 전환 시 다양한 곳에서 사용 가능", cons:"현금 전환은 일정 금액 이상 모아야 해서 시간이 걸림", recommend:true },
  { hustle_id:"cashslide", hustle_name:"캐시슬라이드", nickname:"캐시슬라이드장기사용", income_range:"under_10", weekly_hours:1, difficulty:1, satisfaction:4, title:"3년 쓰면서 총 18만원 모았어요", content:"3년 동안 꾸준히 써서 총 18만원 모았어요. 월 5000원 수준이지만 아무것도 안 하는 것보다는 낫잖아요. 장기적으로 쌓이면 작은 돈이지만 공짜예요.", pros:"노력 없이 장기간 소소하게 적립되는 구조", cons:"수익 규모가 너무 작아서 부업이라 부르기 민망한 수준", recommend:true },

  // ────────────────────────────────────────────────
  // panel-now (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"panel-now", hustle_name:"패널나우 설문", nickname:"패널나우3개월", income_range:"under_10", weekly_hours:3, difficulty:1, satisfaction:4, title:"설문 알림 켜두면 한 달에 3~5만원 가능해요", content:"패널나우 알림 설정해두면 설문 올 때마다 참여해요. 설문당 500~2000원이고 한 달에 3~4만원 되는 것 같아요. 설문 조건이 안 맞을 때도 있지만 나쁘지 않아요.", pros:"참여 거절해도 패널티 없고 시간 날 때만 해도 됨", cons:"설문 조건(나이, 직업 등)에 맞지 않으면 참여 불가한 경우 많음", recommend:true },
  { hustle_id:"panel-now", hustle_name:"패널나우 설문", nickname:"설문앱비교패널나우", income_range:"under_10", weekly_hours:2, difficulty:1, satisfaction:3, title:"설문 앱 중 패널나우가 제일 수익이 높아요", content:"오베이, 리서치몬스터 등 여러 앱 써봤는데 패널나우가 설문당 단가가 가장 높아요. 조건 맞는 설문이 많을 때는 월 5만원도 넘어요.", pros:"설문 앱 중 단가가 높은 편이고 설문 빈도도 많음", cons:"설문 조건이 맞아야만 참여 가능해서 수익이 들쭉날쭉", recommend:true },
  { hustle_id:"panel-now", hustle_name:"패널나우 설문", nickname:"패널나우출금경험", income_range:"under_10", weekly_hours:2, difficulty:1, satisfaction:4, title:"통장에 바로 입금되는 게 편리해요", content:"포인트 적립 후 일정 기준 이상이면 통장으로 바로 출금돼요. 기다리는 시간도 없고 처리가 빨라서 만족스러워요.", pros:"포인트 출금 처리가 빠르고 계좌 입금이 바로 됨", cons:"최소 출금 금액 기준이 있어서 적은 금액은 못 뺌", recommend:true },
  { hustle_id:"panel-now", hustle_name:"패널나우 설문", nickname:"패널나우직장인", income_range:"under_10", weekly_hours:1, difficulty:1, satisfaction:3, title:"점심시간에 설문 하나씩 하면 용돈이 생겨요", content:"점심시간 10~15분 동안 설문 1~2개 해요. 직장인이라 설문 조건이 맞는 게 많고 월 3만원 정도 모아져요. 식비 보탬이 돼서 좋습니다.", pros:"이동 중이나 짬을 낼 때 언제든 참여 가능", cons:"수익이 크지 않아서 부업보다는 용돈 벌이 수준", recommend:true },
  { hustle_id:"panel-now", hustle_name:"패널나우 설문", nickname:"패널나우이벤트참여", income_range:"under_10", weekly_hours:3, difficulty:1, satisfaction:4, title:"이벤트 참여로 추가 포인트 챙겨요", content:"설문 외에도 앱 하단 이벤트를 챙기면 추가 포인트를 적립할 수 있어요. 이벤트까지 합치면 월 5만원 이상 가능한 달도 있어요.", pros:"기본 설문 외 이벤트로 추가 수익 창출 가능", cons:"이벤트가 매달 있는 건 아니라서 수익이 일정하지 않음", recommend:true },

  // ────────────────────────────────────────────────
  // toss-benefit (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"toss-benefit", hustle_name:"토스 혜택", nickname:"토스혜택매일참여", income_range:"under_10", weekly_hours:1, difficulty:1, satisfaction:4, title:"토스 만보기, 퀴즈, 쇼핑으로 월 2만원", content:"토스 앱에서 만보기 포인트, 퀴즈, 쇼핑 캐시백까지 챙기면 월 2만원 정도 돼요. 이미 토스 쓰고 있으면 추가 시간 없이 그냥 되는 거라 만족해요.", pros:"이미 쓰는 토스 앱에서 추가 수익이 자연스럽게 발생", cons:"수익이 매우 낮아서 부업이라기보다는 앱 혜택 활용 수준", recommend:true },
  { hustle_id:"toss-benefit", hustle_name:"토스 혜택", nickname:"토스쇼핑파트너스", income_range:"under_10", weekly_hours:2, difficulty:1, satisfaction:3, title:"토스 쇼핑 파트너스 링크로 용돈 벌기", content:"토스 쇼핑 파트너스로 링크 공유하면 커미션이 들어와요. SNS나 카카오 단톡방에 공유하면 주변 사람들이 써줘요. 월 1~2만원 정도에요.", pros:"링크 공유만으로 수익이 발생하는 간단한 구조", cons:"친한 지인들 대상이라 반복 공유 시 관계 부담이 생길 수 있음", recommend:true },
  { hustle_id:"toss-benefit", hustle_name:"토스 혜택", nickname:"토스앱테크종합", income_range:"under_10", weekly_hours:2, difficulty:1, satisfaction:3, title:"토스 단독보다는 앱테크 조합으로 써요", content:"토스 혜택만으로는 부족해서 캐시슬라이드, 패널나우 등과 병행해요. 합쳐서 월 10만원 목표로 하고 있는데 토스 기여분은 월 2만원 수준이에요.", pros:"이미 쓰는 앱이라 별도 학습이나 설정이 필요 없음", cons:"토스 혜택 단독으로는 부업이라 부르기 어려운 수준", recommend:true },
  { hustle_id:"toss-benefit", hustle_name:"토스 혜택", nickname:"토스챌린지이벤트", income_range:"under_10", weekly_hours:1, difficulty:1, satisfaction:4, title:"챌린지, 이벤트로 추가 수익 챙겨요", content:"토스에서 가끔 하는 챌린지 이벤트에 참여하면 추가 포인트를 받아요. 적금, 투자 관련 챌린지에 참여하면서 자연스럽게 재테크도 하게 됩니다.", pros:"재테크와 포인트 적립을 동시에 할 수 있음", cons:"이벤트 주기가 불규칙해서 안정적인 수익원이 되기 어려움", recommend:true },
  { hustle_id:"toss-benefit", hustle_name:"토스 혜택", nickname:"토스최고수등급달성", income_range:"under_10", weekly_hours:3, difficulty:2, satisfaction:4, title:"최고수 등급 달성 후 혜택이 달라졌어요", content:"토스 활동 많이 하면 등급이 올라가는데 최고수 되니까 이자, 캐시백 혜택이 확실히 달라졌어요. 앱테크 중에서는 구조가 잘 짜여 있어요.", pros:"등급 시스템으로 충성 사용자에게 더 많은 혜택 제공", cons:"최고수 유지를 위해 꾸준한 앱 활동이 필요함", recommend:true },

  // ────────────────────────────────────────────────
  // data-labeling (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"data-labeling", hustle_name:"데이터 라벨링", nickname:"데이터라벨링주부", income_range:"10_to_30", weekly_hours:15, difficulty:2, satisfaction:4, title:"아이 낮잠 시간에 라벨링해서 월 12만원", content:"크라우드웍스에서 데이터 라벨링 작업해요. 낮잠 자는 2시간 동안 하면 월 10~12만원이에요. 집중해서 하면 시간당 6000원 정도 나와요.", pros:"재택에서 자투리 시간에 할 수 있고 시작 조건이 없음", cons:"단순 반복 작업이라 집중력이 빨리 떨어짐", recommend:true },
  { hustle_id:"data-labeling", hustle_name:"데이터 라벨링", nickname:"AI데이터라벨링", income_range:"under_10", weekly_hours:10, difficulty:2, satisfaction:3, title:"AI 발전으로 라벨링 수요가 늘고 있어요", content:"AI 학습 데이터 전처리 작업이 요즘 엄청 많아요. 단가는 낮지만 물량이 많아서 꾸준히 할 수 있어요. 초보자도 금방 익히는 게 장점이에요.", pros:"AI 시장 성장으로 데이터 라벨링 수요가 꾸준히 증가", cons:"단순 반복 작업이라 집중하지 않으면 오류가 많이 생김", recommend:true },
  { hustle_id:"data-labeling", hustle_name:"데이터 라벨링", nickname:"라벨링전문작업자", income_range:"10_to_30", weekly_hours:20, difficulty:3, satisfaction:3, title:"전문 카테고리 맡으면 단가가 올라가요", content:"의료, 법률 등 전문 카테고리 라벨링은 단가가 2~3배 높아요. 해당 분야 배경지식이 있으면 전문 작업자로 등록할 수 있어요. 월 18만원이에요.", pros:"전문 분야 배경지식이 있으면 높은 단가의 작업 가능", cons:"일반 라벨링과 달리 전문 지식 없으면 진입이 어려움", recommend:true },
  { hustle_id:"data-labeling", hustle_name:"데이터 라벨링", nickname:"라벨링현실수익", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:2, title:"솔직히 시급 계산하면 5000원도 안 돼요", content:"시간당 4000~5000원 수준이에요. 최저시급보다 낮은 경우도 있어서 다른 부업이 없을 때 하는 정도예요. 단독 부업으로는 비효율적입니다.", pros:"진입 조건이 없고 당장 내일부터 시작 가능", cons:"시간당 수익이 매우 낮아서 시간 대비 효율이 떨어짐", recommend:false },
  { hustle_id:"data-labeling", hustle_name:"데이터 라벨링", nickname:"라벨링꾸준함이답", income_range:"10_to_30", weekly_hours:25, difficulty:2, satisfaction:3, title:"꾸준히 하면 월 20만원은 됩니다", content:"하루 3~4시간씩 꾸준히 하면 월 20만원 가능해요. 단순 작업이지만 집중력과 꾸준함이 필요해요. 급하게 많이 하면 오류 많이 나서 패널티 받아요.", pros:"꾸준히만 하면 안정적인 수익이 나오는 구조", cons:"오류 많으면 패널티로 수익이 줄어들어서 주의 필요", recommend:true },

  // ────────────────────────────────────────────────
  // app-testing (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"app-testing", hustle_name:"앱 테스트", nickname:"앱테스터6개월", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"앱 테스트로 월 3~5만원 소소하게 버는 중", content:"스마트폰으로 앱 테스트하고 피드백 작성해요. 테스트당 1000~5000원이고 한 달에 테스트 5~10개 정도 들어와요. 용돈 수준이지만 재미있어요.", pros:"스마트폰만 있으면 언제 어디서든 참여 가능", cons:"의뢰 빈도가 불규칙해서 안정적인 수익을 기대하기 어려움", recommend:true },
  { hustle_id:"app-testing", hustle_name:"앱 테스트", nickname:"전문앱테스터", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"전문 테스터로 등록하니 단가가 올라요", content:"테스터 경력이 쌓이면 고단가 테스트를 우선 배정해줘요. 전문 테스터 등록 후 월 15만원으로 올랐어요. 피드백 퀄리티가 핵심이에요.", pros:"경력 쌓으면 고단가 테스트 우선 배정으로 수익 향상", cons:"경력 쌓기까지 초반에는 낮은 단가 테스트만 들어옴", recommend:true },
  { hustle_id:"app-testing", hustle_name:"앱 테스트", nickname:"앱테스트유저빌리티", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"UX 관련 테스트는 단가가 높아요", content:"사용성 테스트(유저빌리티 테스트)는 일반 앱 테스트보다 단가가 3~5배 높아요. 화면 녹화와 생각 말하기(Think Aloud) 방식이라 집중이 필요해요.", pros:"전문 UX 테스트는 건당 2~5만원으로 단가가 높음", cons:"화면 녹화와 음성 설명이 동시에 필요해서 집중력이 요구됨", recommend:true },
  { hustle_id:"app-testing", hustle_name:"앱 테스트", nickname:"앱테스트플랫폼비교", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"여러 플랫폼 동시 등록하면 의뢰가 더 많아요", content:"UserTesting, Lookback, 국내 크라우드테스트 등 여러 곳에 등록하면 의뢰가 더 자주 들어와요. 한 곳만 하면 의뢰가 드문데 3~4곳 병행하면 월 8만원 됩니다.", pros:"여러 플랫폼 병행 시 의뢰 빈도와 수익이 늘어남", cons:"플랫폼마다 기준이 달라서 프로필 관리가 번거로움", recommend:true },
  { hustle_id:"app-testing", hustle_name:"앱 테스트", nickname:"앱테스트게임", income_range:"under_10", weekly_hours:6, difficulty:1, satisfaction:5, title:"게임 좋아하면 게임 테스트가 가장 재밌어요", content:"게임 출시 전 베타테스트 참여하면 게임도 즐기고 소정의 보상도 받아요. 보상이 크지는 않지만 어차피 게임 할 시간에 돈도 버는 거라 좋아요.", pros:"취미와 수익을 동시에 만족하는 최적의 케이스", cons:"게임 테스트는 일반 앱 테스트보다 보상이 낮은 경우가 많음", recommend:true },

  // ────────────────────────────────────────────────
  // stock-dividend (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"stock-dividend", hustle_name:"배당주 투자", nickname:"배당주투자3년", income_range:"10_to_30", weekly_hours:2, difficulty:2, satisfaction:4, title:"3년 모은 배당금으로 월 15만원", content:"매달 월급에서 30만원씩 배당주에 투자했어요. 3년이 지나니까 배당금이 월 15만원 됩니다. 시간이 핵심이고 꾸준히 사는 게 답이에요.", pros:"시간이 지날수록 배당금이 자동으로 쌓이는 구조", cons:"초기 투자 원금이 있어야 하고 배당금이 쌓이기까지 오래 걸림", recommend:true },
  { hustle_id:"stock-dividend", hustle_name:"배당주 투자", nickname:"배당ETF월배당", income_range:"10_to_30", weekly_hours:1, difficulty:1, satisfaction:5, title:"월 배당 ETF로 매달 현금흐름 만들기", content:"RISE 200 커버드콜, 미국 고배당 ETF 등 월 배당 ETF 구성했어요. 투자금 2000만원에서 매달 8만원씩 들어와요. 시간 투자가 거의 없어서 최고의 패시브예요.", pros:"월 배당이라 매달 현금이 들어오는 안정적인 구조", cons:"투자 원금 손실 위험이 있고 커버드콜은 상승 수익이 제한됨", recommend:true },
  { hustle_id:"stock-dividend", hustle_name:"배당주 투자", nickname:"배당주초보입문", income_range:"under_10", weekly_hours:3, difficulty:2, satisfaction:3, title:"100만원으로 시작해서 월 4000원 배당받아요", content:"100만원으로 배당주 시작했는데 연 4% 수익률이면 월 3333원이에요. 작아도 복리로 재투자하면 10년 후 완전히 다른 규모가 된다고 믿고 있어요.", pros:"소액으로 시작해도 복리 효과로 장기 성장이 가능", cons:"초기 배당금이 너무 작아서 단기적인 동기 유지가 어려움", recommend:true },
  { hustle_id:"stock-dividend", hustle_name:"배당주 투자", nickname:"배당주세금절세", income_range:"10_to_30", weekly_hours:2, difficulty:3, satisfaction:4, title:"ISA 계좌로 배당세금 아끼는 방법", content:"배당소득세 15.4%를 ISA 계좌 활용해서 절세할 수 있어요. 같은 배당이라도 세후 수령액이 달라지니까 ISA 필수예요. 세금 공부가 수익률을 높여요.", pros:"ISA 계좌 활용 시 세금 절감으로 실질 수익률이 높아짐", cons:"ISA 계좌 조건과 한도를 미리 공부해야 함", recommend:true },
  { hustle_id:"stock-dividend", hustle_name:"배당주 투자", nickname:"배당주종목선정", income_range:"30_to_50", weekly_hours:4, difficulty:3, satisfaction:4, title:"종목 잘 고르면 배당 5~8% 받는 곳도 있어요", content:"국내 고배당주 중 KT, 은행주, 리츠(REITs) 같은 걸 잘 조합하면 연 5~8% 배당이 나와요. 투자금 5000만원이면 월 25~35만원 됩니다.", pros:"안정적인 배당주 조합하면 높은 배당수익률 가능", cons:"개별 종목 투자라 리스크가 ETF보다 높음", recommend:true },

  // ────────────────────────────────────────────────
  // etf-investing (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"etf-investing", hustle_name:"ETF 투자", nickname:"ETF적립식3년", income_range:"10_to_30", weekly_hours:1, difficulty:1, satisfaction:5, title:"매달 20만원 ETF 적립, 3년 후 수익률 45%", content:"S&P500 ETF에 매달 20만원씩 3년 투자했더니 수익률 45%가 됐어요. 수익이 부업 수준이 됐고 지금은 월 8만원 이상 수익이에요.", pros:"시간 투자 거의 없이 장기 복리 수익을 얻을 수 있음", cons:"시장 하락 시 원금 손실 위험이 있음", recommend:true },
  { hustle_id:"etf-investing", hustle_name:"ETF 투자", nickname:"미국ETF직투", income_range:"30_to_50", weekly_hours:2, difficulty:2, satisfaction:4, title:"미국 ETF 직접 투자로 달러 자산 쌓기", content:"QQQ, SPY 등 미국 ETF에 직접 투자해요. 환율 이득도 있고 성장률이 국내 ETF보다 높아요. 분기 배당까지 합치면 월 30만원 정도 됩니다.", pros:"달러 자산으로 환율 헷지 효과와 해외 성장을 동시에 누림", cons:"환율 변동 리스크와 해외 ETF 세금 처리가 복잡함", recommend:true },
  { hustle_id:"etf-investing", hustle_name:"ETF 투자", nickname:"ETF초보입문가이드", income_range:"under_10", weekly_hours:2, difficulty:2, satisfaction:4, title:"ETF 시작 3개월, 배운 것들 공유해요", content:"처음에 ETF가 뭔지 몰랐는데 공부하고 나니까 가장 쉬운 투자가 ETF더라고요. 지금은 매달 30만원씩 넣고 있어요. 아직 수익은 작지만 방향은 맞는 것 같아요.", pros:"주식 지식 없어도 쉽게 분산투자 가능한 상품", cons:"단기 수익을 기대하면 실망할 수 있음. 장기 투자가 핵심", recommend:true },
  { hustle_id:"etf-investing", hustle_name:"ETF 투자", nickname:"ETF부업수익루틴", income_range:"10_to_30", weekly_hours:1, difficulty:1, satisfaction:5, title:"부업 수익을 ETF로 굴리는 루틴 완성", content:"다른 부업으로 번 돈을 ETF에 자동이체로 넣어요. 부업 수익 + 투자 수익이 쌓이는 구조예요. 하루 10분도 안 걸리고 복리 효과도 누릴 수 있어요.", pros:"자동이체로 강제 저축 효과 + 투자 수익 복리 효과", cons:"단기적으로는 수익이 보이지 않아서 동기 유지가 어려울 수 있음", recommend:true },
  { hustle_id:"etf-investing", hustle_name:"ETF 투자", nickname:"ETF레버리지경험", income_range:"under_10", weekly_hours:3, difficulty:4, satisfaction:2, title:"레버리지 ETF는 초보에게 위험합니다", content:"2배 레버리지 ETF 샀다가 시장 조정 때 -40% 당했어요. 레버리지는 수익도 크지만 손실도 2배예요. 초보자는 일반 ETF부터 시작하세요.", pros:"시장 공부가 되고 다양한 투자 경험을 쌓을 수 있음", cons:"레버리지 ETF는 변동성이 매우 크고 초보자에게 위험", recommend:false },
  { hustle_id:"etf-investing", hustle_name:"ETF 투자", nickname:"배당ETF월배당", income_range:"10_to_30", weekly_hours:1, difficulty:1, satisfaction:4, title:"월 배당 ETF로 매달 통장에 현금이 찍혀요", content:"SCHD, JEPI 같은 미국 월 배당 ETF에 1500만원 투자해서 매달 6만원씩 들어와요. 시간이 지나면서 배당 재투자로 금액이 늘고 있어요.", pros:"매달 배당이 들어와서 현금흐름이 생기는 심리적 만족감", cons:"세금 15.4% 원천징수 후 수령이라 세후 수익 계산 필요", recommend:true },

  // ────────────────────────────────────────────────
  // crypto (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"crypto", hustle_name:"코인 투자", nickname:"코인장투성공기", income_range:"over_100", weekly_hours:3, difficulty:3, satisfaction:5, title:"비트코인 장투로 2년 만에 200% 수익", content:"2년 전에 비트코인 500만원어치 사서 지금까지 보유하고 있어요. 수익률 200%가 됐어요. 단타보다 장투가 멘탈에도 좋고 수익도 높더라고요.", pros:"장기 보유 시 높은 수익률 가능하고 시간 투자가 적음", cons:"중간에 -50%씩 폭락이 와도 버텨야 해서 멘탈 관리가 핵심", recommend:true },
  { hustle_id:"crypto", hustle_name:"코인 투자", nickname:"코인단타실패기", income_range:"under_10", weekly_hours:20, difficulty:5, satisfaction:1, title:"단타하다가 원금 30% 잃었어요", content:"차트 보면서 단타 했는데 6개월 동안 원금 30% 날렸어요. 코인은 24시간 움직이는데 직장 다니면서 단타는 불가능해요. 장투가 아니면 손대지 마세요.", pros:"운이 좋으면 단기에도 고수익이 가능한 시장", cons:"단타는 전문 트레이더도 장기적으로 수익 내기 어려움", recommend:false },
  { hustle_id:"crypto", hustle_name:"코인 투자", nickname:"스테이킹수익", income_range:"10_to_30", weekly_hours:1, difficulty:2, satisfaction:4, title:"스테이킹으로 연 7% 수익, 배당주 같아요", content:"이더리움 스테이킹하면 연 5~7% 수익이 나요. 주식 배당주랑 비슷한 개념이에요. 코인 가격 변동과 별개로 스테이킹 보상이 쌓여서 좋아요.", pros:"코인 보유하면서 추가로 스테이킹 보상까지 받을 수 있음", cons:"스테이킹 중에는 코인을 팔 수 없는 락업 기간이 있음", recommend:true },
  { hustle_id:"crypto", hustle_name:"코인 투자", nickname:"코인AI지표활용", income_range:"30_to_50", weekly_hours:5, difficulty:4, satisfaction:4, title:"AI 지표 활용해서 단기 트레이딩 월 35만원", content:"AI 기반 시그널 서비스 구독해서 진입, 청산 타이밍을 맞추고 있어요. 100% 신뢰는 못 하지만 감으로 할 때보다 승률이 높아요.", pros:"AI 시그널로 감이 아닌 데이터 기반 트레이딩 가능", cons:"AI 신호도 틀릴 때 있고 구독 비용이 추가로 발생함", recommend:true },
  { hustle_id:"crypto", hustle_name:"코인 투자", nickname:"코인세금공부필수", income_range:"10_to_30", weekly_hours:2, difficulty:3, satisfaction:3, title:"코인 수익 세금 신고 꼭 해야 해요", content:"2025년부터 코인 수익도 250만원 초과 시 22% 세금이에요. 수익이 나면 세금 계산 먼저 해야 해요. 모르고 있다가 세금 폭탄 맞는 분들 있어요.", pros:"세금 파악하면 절세 방법도 같이 찾을 수 있음", cons:"세금 신고가 복잡하고 거래소마다 내역 관리가 번거로움", recommend:true },

  // ────────────────────────────────────────────────
  // p2p-lending (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"p2p-lending", hustle_name:"P2P 투자", nickname:"P2P투자2년경험", income_range:"10_to_30", weekly_hours:2, difficulty:3, satisfaction:3, title:"연 8% 수익률, 하지만 부실 채권 주의", content:"P2P 투자 2년 했어요. 평균 8% 수익률인데 중간에 부실 채권 하나 걸려서 실제 수익률은 6%대예요. 분산투자가 정말 중요합니다.", pros:"예금 대비 높은 수익률로 안정적인 이자 수익 가능", cons:"부실 채권 발생 시 원금 손실 위험이 있음", recommend:true },
  { hustle_id:"p2p-lending", hustle_name:"P2P 투자", nickname:"P2P플랫폼도산경험", income_range:"under_10", weekly_hours:1, difficulty:4, satisfaction:1, title:"플랫폼 도산으로 원금 못 돌려받았어요", content:"소형 P2P 플랫폼에 투자했다가 플랫폼 자체가 도산해서 투자금 300만원 중 일부를 못 돌려받았어요. 반드시 규모 있는 금융위 등록 플랫폼만 이용하세요.", pros:"이자율 자체는 은행보다 높음", cons:"플랫폼 신뢰도가 매우 중요하고 소형 플랫폼은 도산 위험 있음", recommend:false },
  { hustle_id:"p2p-lending", hustle_name:"P2P 투자", nickname:"P2P부동산담보", income_range:"10_to_30", weekly_hours:2, difficulty:3, satisfaction:4, title:"부동산 담보 P2P는 상대적으로 안전해요", content:"부동산을 담보로 한 P2P 상품은 채무 불이행 시 담보를 처분해서 회수할 수 있어요. 부동산 담보 위주로만 투자하니까 손실이 없었어요.", pros:"부동산 담보 상품은 원금 회수 가능성이 상대적으로 높음", cons:"담보 처분에 시간이 걸려서 급할 때 현금화가 어려움", recommend:true },
  { hustle_id:"p2p-lending", hustle_name:"P2P 투자", nickname:"P2P분산투자전략", income_range:"10_to_30", weekly_hours:3, difficulty:3, satisfaction:4, title:"100개 채권에 분산해서 리스크 줄이기", content:"한 채권에 5만원 이하로 100개 분산 투자해요. 1~2개 부실 나도 전체 수익률은 유지돼요. 분산이 P2P 투자의 핵심입니다.", pros:"분산 투자로 개별 부실 채권의 영향을 최소화 가능", cons:"소액 분산 투자는 관리할 채권 수가 많아서 추적이 번거로움", recommend:true },
  { hustle_id:"p2p-lending", hustle_name:"P2P 투자", nickname:"P2P세금처리", income_range:"under_10", weekly_hours:1, difficulty:3, satisfaction:3, title:"이자 수익 세금 원천징수 꼭 확인하세요", content:"P2P 이자 수익에 27.5% 원천징수가 돼요. 표시 수익률 8%라도 세후 5.8% 수준이에요. 세후 실수령액 계산하고 투자 결정해야 해요.", pros:"세금 공제 후에도 은행 예금보다 수익률이 높음", cons:"원천징수 27.5%로 실수령 수익률이 표시보다 낮음", recommend:true },
  { hustle_id:"p2p-lending", hustle_name:"P2P 투자", nickname:"P2P자동투자설정", income_range:"10_to_30", weekly_hours:1, difficulty:2, satisfaction:4, title:"자동투자 설정으로 완전 자동화 수익", content:"에잇퍼센트, 렌딧 같은 플랫폼에서 자동투자 설정해두면 알아서 분산 투자해줘요. 월에 한 번 수익 확인만 하면 돼서 진짜 패시브예요.", pros:"자동투자 기능으로 관리 없이 수익이 쌓이는 구조", cons:"자동투자도 투자 기준 설정을 잘못하면 부실 채권이 섞일 수 있음", recommend:true },

  // ────────────────────────────────────────────────
  // baemin-rider (4→8, need 4)
  // ────────────────────────────────────────────────
  { hustle_id:"baemin-rider", hustle_name:"배민 라이더", nickname:"배민커넥트주말부업", income_range:"30_to_50", weekly_hours:12, difficulty:2, satisfaction:4, title:"주말 6시간씩 배달해서 월 40만원", content:"토, 일 오전 11시~오후 2시, 저녁 5시~8시만 해요. 피크 타임에 집중하면 시간당 2~3만원 나와요. 운동도 되고 수익도 되고 만족해요.", pros:"피크 타임 집중하면 시간당 수익이 높음", cons:"날씨 안 좋을 때 배달이 힘들고 비 오는 날 위험함", recommend:true },
  { hustle_id:"baemin-rider", hustle_name:"배민 라이더", nickname:"배달부업오토바이", income_range:"50_to_100", weekly_hours:20, difficulty:3, satisfaction:4, title:"오토바이로 본격 배달, 월 80만원 달성", content:"오토바이 있으면 자전거 대비 배달 거리가 넓고 속도도 빨라요. 쿠팡이츠+배민 병행으로 월 80만원이에요. 기름값 빼도 70만원 이상 남아요.", pros:"오토바이 있으면 배달 효율이 자전거보다 훨씬 높음", cons:"교통사고 위험이 있고 오토바이 보험료가 추가로 들어감", recommend:true },
  { hustle_id:"baemin-rider", hustle_name:"배민 라이더", nickname:"배달부업체력관리", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:3, title:"체력 관리가 지속 가능성을 결정해요", content:"배달 부업은 체력이 핵심이에요. 첫 달은 무리해서 했다가 허리 통증이 왔어요. 지금은 시간 조절하면서 하고 월 35만원 유지하고 있습니다.", pros:"자유롭게 시간을 정할 수 있어서 본업과 병행이 유연함", cons:"체력 소모가 크고 장시간 하면 근골격계 문제가 생길 수 있음", recommend:true },
  { hustle_id:"baemin-rider", hustle_name:"배민 라이더", nickname:"배달미션수익보너스", income_range:"30_to_50", weekly_hours:10, difficulty:2, satisfaction:4, title:"미션 달성으로 추가 수당 챙기는 법", content:"배민커넥트 미션을 잘 활용하면 추가 수당이 꽤 나요. 피크 시간 미션은 건당 500~1000원 추가라서 미션 위주로 뛰면 월 35만원 넘어요.", pros:"미션 시스템 활용하면 기본 배달비 외 추가 수당 가능", cons:"미션 조건이 달라서 매달 미리 확인해야 함", recommend:true },

  // ────────────────────────────────────────────────
  // coupang-flex (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"coupang-flex", hustle_name:"쿠팡플렉스", nickname:"쿠팡플렉스주말알바", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"주말 배송으로 월 18만원, 운동도 돼요", content:"주말 오전에 쿠팡플렉스 배송해요. 4~5시간 하면 7~8만원 나와요. 걸어 다니니까 운동도 되고 기분 전환도 되는데 나쁘지 않아요.", pros:"시간이 완전 자유롭고 원할 때만 하면 됨", cons:"짐이 많아서 체력 소모가 생각보다 큼", recommend:true },
  { hustle_id:"coupang-flex", hustle_name:"쿠팡플렉스", nickname:"쿠플렉스차량활용", income_range:"30_to_50", weekly_hours:15, difficulty:2, satisfaction:4, title:"승용차로 배송하면 박스 많이 실어서 효율적", content:"차량 있으면 한 번에 30~40박스 실을 수 있어요. 걸어서 할 때보다 시간당 수익이 30% 이상 높아요. 주유비 빼도 월 35만원 정도 남아요.", pros:"차량 있으면 배송 효율이 크게 올라가고 수익도 높아짐", cons:"주유비, 차량 소모가 추가되고 주차 문제가 생기는 경우도 있음", recommend:true },
  { hustle_id:"coupang-flex", hustle_name:"쿠팡플렉스", nickname:"쿠팡플렉스세금신고", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"수입 높아지면 부가세 신고도 해야 해요", content:"쿠팡플렉스 수입이 연간 일정 기준 이상이면 부가세 신고 대상이에요. 초보 분들이 모르고 있다가 세금 추징 받는 경우가 있으니 미리 확인하세요.", pros:"수입이 생기는 구조는 확실함", cons:"수입 커지면 세금 신고 의무가 생기고 비용 처리도 복잡해짐", recommend:true },
  { hustle_id:"coupang-flex", hustle_name:"쿠팡플렉스", nickname:"쿠플렉스앱선착순", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:3, title:"배차 선점이 관건, 앱 새로고침이 필요해요", content:"쿠팡플렉스 배차는 선착순이에요. 배차 공개 시간에 앱 새로고침 열심히 해서 빠르게 잡아야 해요. 늦으면 배차를 못 받아서 빈 날도 생겨요.", pros:"일단 배차 잡으면 안정적인 시간당 수익이 보장됨", cons:"배차 선착순 경쟁이 치열해서 항상 원하는 시간에 가능하지 않음", recommend:true },
  { hustle_id:"coupang-flex", hustle_name:"쿠팡플렉스", nickname:"쿠팡플렉스현실수익", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"무난하지만 기대 이상은 아니에요", content:"시간당 1.2~1.5만원 수준이에요. 자유로운 시간 조율이 장점이지만 체력 대비 수익이 그렇게 높진 않아요. 다른 알바와 비교했을 때 장단점이 명확해요.", pros:"완전 자유 시간제라 원하는 때만 일할 수 있음", cons:"시간당 수익이 일반 알바 수준이라 차별화된 메리트가 없음", recommend:true },

  // ────────────────────────────────────────────────
  // kakao-driver (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"kakao-driver", hustle_name:"카카오 대리운전", nickname:"대리운전부업3년", income_range:"30_to_50", weekly_hours:12, difficulty:2, satisfaction:4, title:"금, 토 대리로 월 40만원 꾸준히 버는 중", content:"3년째 금, 토요일 저녁 6시간씩 대리운전해요. 주말 저녁 피크 타임에 집중하면 6시간에 8~10만원 나와요. 월 35~40만원 안정적이에요.", pros:"주말 피크 타임에 집중하면 시간당 수익이 높음", cons:"늦은 시간대 활동이라 체력 소모와 수면 패턴 관리가 필요", recommend:true },
  { hustle_id:"kakao-driver", hustle_name:"카카오 대리운전", nickname:"대리운전대중교통귀가", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"대중교통 귀가 잘 되는 지역에서 하세요", content:"대리운전 후 귀가가 관건이에요. 대중교통 끊기기 전에 마무리하거나 택시비 아낄 수 있는 곳에서 일하는 게 수익을 높이는 방법이에요.", pros:"면허만 있으면 초기 비용 없이 바로 시작 가능", cons:"귀가 교통비가 수익에서 상당 부분 빠져나감", recommend:true },
  { hustle_id:"kakao-driver", hustle_name:"카카오 대리운전", nickname:"대리카카오vs직연결", income_range:"30_to_50", weekly_hours:15, difficulty:2, satisfaction:4, title:"카카오 대리 vs 직연결 비교해보니", content:"카카오 대리는 콜 배정이 규칙적이지만 수수료가 15%예요. 고객 직연결은 수수료 없지만 연락처 관리가 필요해요. 초반엔 카카오, 익숙해지면 직연결 병행이 좋아요.", pros:"카카오 플랫폼 통해 안정적인 콜 배정이 가능함", cons:"플랫폼 수수료 15%가 빠지는 게 아쉬운 부분", recommend:true },
  { hustle_id:"kakao-driver", hustle_name:"카카오 대리운전", nickname:"대리운전음주손님", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:2, title:"음주 손님 대응이 제일 힘들어요", content:"대부분 손님은 괜찮은데 간혹 만취 손님이 차 안에서 토하거나 요금 미납하는 경우가 있어요. 이런 일이 생기면 청소비, 요금 추가 협의가 힘들어요.", pros:"대부분 손님이 정상적이고 이동 시간이 짧음", cons:"만취 손님, 노쇼, 요금 미납 등 불편한 상황이 간혹 발생", recommend:true },
  { hustle_id:"kakao-driver", hustle_name:"카카오 대리운전", nickname:"대리운전고수입전략", income_range:"50_to_100", weekly_hours:20, difficulty:3, satisfaction:5, title:"평일 저녁+주말 풀로 하면 월 70만원", content:"평일 수요일~금요일 저녁 + 토요일 통해서 하면 월 70만원 됩니다. 단가 높은 강남, 홍대 같은 핫플 위주로 배정받는 게 노하우예요.", pros:"핵심 지역에서 피크 타임 집중하면 고수익 가능", cons:"주당 20시간은 사실상 투잡 수준이라 체력 관리가 중요", recommend:true },
];

async function main() {
  console.log(`총 ${REVIEWS.length}개 후기 삽입 시작...`);
  let success = 0;
  let fail = 0;

  for (const r of REVIEWS) {
    const { error } = await supabase.from("reviews").insert({
      ...r,
      likes: Math.floor(Math.random() * 15),
      created_at: new Date(
        Date.now() - Math.floor(Math.random() * 90) * 86400000
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
