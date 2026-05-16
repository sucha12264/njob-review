/**
 * 후기 대량 삽입 스크립트 (Part 2: 재능판매/강의/쇼핑몰/판매)
 * 실행: npx tsx scripts/seed-bulk-reviews-2.ts
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
  // upwork (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"upwork", hustle_name:"업워크", nickname:"업워크영어번역", income_range:"10_to_30", weekly_hours:12, difficulty:4, satisfaction:4, title:"영어 번역으로 업워크 월 25만원", content:"영한 번역 의뢰가 꾸준히 들어와요. 초반에 낮은 단가로 후기를 10개 쌓고 나서 단가를 올렸어요. 달러로 받으니까 환율 이득도 있습니다.", pros:"달러 수입이라 환율 혜택이 있고 전 세계 클라이언트 접근 가능", cons:"초반에 저단가로 포트폴리오 쌓는 기간이 힘듦", recommend:true },
  { hustle_id:"upwork", hustle_name:"업워크", nickname:"업워크개발프리랜서", income_range:"over_100", weekly_hours:20, difficulty:4, satisfaction:5, title:"개발자라면 업워크가 최고의 부업입니다", content:"React 개발자인데 업워크에서 프로젝트 수주하면 건당 500~1000달러예요. 본업 외 월 150만원 이상 추가 수입 가능합니다. 영어 소통만 된다면 강추해요.", pros:"기술직 단가가 국내 플랫폼 대비 훨씬 높음", cons:"영어 소통 필수, 시간대 차이로 야간 미팅이 생기는 경우 있음", recommend:true },
  { hustle_id:"upwork", hustle_name:"업워크", nickname:"업워크초보현실", income_range:"under_10", weekly_hours:10, difficulty:5, satisfaction:2, title:"포트폴리오 없으면 제안도 안 받아줍니다", content:"업워크 가입 후 3개월 동안 30개 프로젝트 지원했는데 단 한 건도 수주 못 했어요. 해외 프리랜서들과 경쟁에서 포트폴리오 없으면 클라이언트가 쳐다보지도 않아요.", pros:"글로벌 고단가 시장 접근 가능", cons:"초보자 진입 장벽이 매우 높고 경쟁이 치열함", recommend:false },
  { hustle_id:"upwork", hustle_name:"업워크", nickname:"업워크데이터분석", income_range:"50_to_100", weekly_hours:15, difficulty:3, satisfaction:4, title:"데이터 분석으로 월 80만원 달성", content:"파이썬, SQL 데이터 분석 의뢰를 주로 받아요. 한국 플랫폼보다 단가가 2~3배 높고 의뢰가 꾸준해요. 영어 리포트 작성만 익숙해지면 됩니다.", pros:"데이터 분석 기술은 업워크에서 수요가 매우 높음", cons:"영어로 보고서 작성하는 게 초반에 시간이 많이 걸림", recommend:true },
  { hustle_id:"upwork", hustle_name:"업워크", nickname:"업워크영상편집러", income_range:"30_to_50", weekly_hours:18, difficulty:3, satisfaction:4, title:"영상 편집으로 업워크 월 45만원", content:"유튜브 영상 편집 의뢰가 업워크에 많아요. 해외 유튜버들 영상 편집해주는데 건당 50~100달러. 의뢰 많을 때는 월 45만원 이상 됩니다.", pros:"영상 편집 기술만 있으면 비교적 쉽게 의뢰 확보 가능", cons:"클라이언트와 시간대 차이로 소통이 불편한 경우 있음", recommend:true },
  { hustle_id:"upwork", hustle_name:"업워크", nickname:"업워크세금처리", income_range:"10_to_30", weekly_hours:8, difficulty:4, satisfaction:3, title:"수익보다 세금 처리가 복잡해서 고민", content:"업워크 수익이 달러라 환전 과정이 복잡하고 종합소득세 신고도 따로 해야 해요. 수익이 연 500만원 이상이면 세무사 쓰는 게 나을 수 있습니다.", pros:"달러 수입으로 환율 이득이 있음", cons:"세금 처리가 복잡하고 환전 수수료도 신경 써야 함", recommend:true },

  // ────────────────────────────────────────────────
  // class101 (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"class101", hustle_name:"클래스101", nickname:"클래스101드로잉강사", income_range:"30_to_50", weekly_hours:15, difficulty:4, satisfaction:4, title:"드로잉 강의 개설 후 월 40만원 고정수입", content:"아이패드 드로잉 강의를 클래스101에 올렸어요. 초반에 수강생이 없었는데 플랫폼 큐레이션에 선정되면서 폭발적으로 늘었습니다. 지금은 월 40만원 패시브 인컴이에요.", pros:"한 번 제작한 강의가 지속적으로 수익 창출하는 구조", cons:"강의 제작 초기 비용(장비, 편집)이 100만원 이상 들 수 있음", recommend:true },
  { hustle_id:"class101", hustle_name:"클래스101", nickname:"클래스101요리강사", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"요리 강의 올렸는데 생각보다 경쟁이 치열해요", content:"집밥 요리 강의를 개설했는데 비슷한 강의가 이미 많아서 노출이 잘 안 돼요. 플랫폼 내 마케팅이나 외부 SNS 마케팅 없이는 수강생 모으기 힘듭니다.", pros:"강의 플랫폼이 이미 구축되어 있어서 결제, 고객 관리가 편리", cons:"유사 강의가 많아서 차별화 없으면 노출 경쟁에서 불리", recommend:true },
  { hustle_id:"class101", hustle_name:"클래스101", nickname:"클래스101강의수입", income_range:"50_to_100", weekly_hours:8, difficulty:3, satisfaction:5, title:"강의 한 개로 2년째 월 60만원 들어와요", content:"2년 전에 포토샵 강의 하나 올려놨는데 지금도 꾸준히 수강생이 등록해요. 업데이트 없이 월 60만원 패시브 인컴이 만들어졌습니다. 진짜 부업의 꿈이에요.", pros:"한 번 잘 만들면 수년간 수익이 들어오는 완전 패시브 구조", cons:"초반에 강의 퀄리티를 높게 만들어야 장기 수익 가능", recommend:true },
  { hustle_id:"class101", hustle_name:"클래스101", nickname:"클래스101실패사례", income_range:"under_10", weekly_hours:20, difficulty:5, satisfaction:1, title:"강의 제작에 300만원 들었는데 수익 20만원이에요", content:"카메라, 마이크, 조명 등 장비 사고 강의 제작에 3개월 걸렸는데 수강생이 안 모여요. 주제 선정과 마케팅 전략 없이 무작정 만들면 안 된다는 걸 뼈저리게 배웠어요.", pros:"강의 제작 경험 자체가 스킬 향상에 도움이 됨", cons:"주제 선정이 잘못되면 제작비만 날릴 수 있음", recommend:false },
  { hustle_id:"class101", hustle_name:"클래스101", nickname:"클래스101수강후기", income_range:"10_to_30", weekly_hours:5, difficulty:2, satisfaction:4, title:"수강하면서 배우고, 나도 강사 준비 중", content:"일단 플랫폼 강의를 수강하면서 어떤 강의가 잘 팔리는지 연구했어요. 인기 강의 구조를 파악하고 나서 제 강의를 만드는 중입니다. 현재 월 10만원 수익이에요.", pros:"수강생으로 먼저 플랫폼 파악 후 강사 전환이 현명한 전략", cons:"강의 준비 기간 동안 수익이 없어서 인내심 필요", recommend:true },
  { hustle_id:"class101", hustle_name:"클래스101", nickname:"클래스101마케팅강사", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:4, title:"SNS 마케팅 강의로 직장인 타겟 잘 먹혀요", content:"디지털 마케팅 강의인데 직장인들이 많이 찾더라고요. 회사에서 쓸 수 있는 실용적인 내용으로 구성했더니 수강 후기가 좋아요. 월 35만원 안정적이에요.", pros:"실무에 바로 쓸 수 있는 내용이면 수강생 확보가 빠름", cons:"강의 내용 업데이트를 주기적으로 해야 평점 유지가 됨", recommend:true },

  // ────────────────────────────────────────────────
  // taling (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"taling", hustle_name:"탈잉", nickname:"탈잉블로그강의", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"네이버 블로그 강의로 월 15만원 꾸준히", content:"블로그 수익화 강의를 탈잉에서 운영하는데 수강생이 꾸준히 들어와요. 1대1 과외 형식이라 단가가 높지만 수강생 수가 제한적인 게 아쉬워요.", pros:"1대1 형식이라 단가가 온라인 강의보다 높음", cons:"수강생 수에 제한이 있어서 수익 확장이 어려움", recommend:true },
  { hustle_id:"taling", hustle_name:"탈잉", nickname:"탈잉영어회화튜터", income_range:"30_to_50", weekly_hours:15, difficulty:2, satisfaction:5, title:"영어 회화 튜터로 탈잉에서 월 40만원", content:"영어 원어민 수준은 아니지만 비즈니스 영어 특화로 포지셔닝했더니 직장인 수강생이 많이 찾아요. 월 10~12명 수강생에서 월 40만원 정도 됩니다.", pros:"특정 분야에 특화하면 경쟁 없이 안정적인 수강생 확보", cons:"수강생 스케줄 조율이 번거롭고 노쇼 대처가 필요함", recommend:true },
  { hustle_id:"taling", hustle_name:"탈잉", nickname:"탈잉강의초기수익", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:3, title:"처음엔 후기 없어서 수강생 모으기 어려워요", content:"탈잉 등록한 첫 달은 수강생 0명이었어요. 지인들한테 부탁해서 먼저 후기 쌓고 나서야 자연 유입이 시작됐습니다. 후기 5개 이상이 기준인 것 같아요.", pros:"한 번 후기가 쌓이면 자연 유입으로 안정적인 수강생 확보", cons:"처음 후기 만드는 과정이 힘들고 시간이 걸림", recommend:true },
  { hustle_id:"taling", hustle_name:"탈잉", nickname:"탈잉vs클래스101비교", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"클래스101과 탈잉 병행해보니 장단점이 달라요", content:"클래스101은 온라인 영상 강의, 탈잉은 실시간 과외 형식이에요. 클래스101은 패시브지만 단가 낮고, 탈잉은 단가 높지만 시간 투입이 필요해요.", pros:"두 플랫폼을 병행하면 패시브와 능동 수익을 함께 만들 수 있음", cons:"두 플랫폼 동시 관리가 번거롭고 시간 분산이 필요", recommend:true },
  { hustle_id:"taling", hustle_name:"탈잉", nickname:"탈잉디자인강의", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:4, title:"피그마 강의로 탈잉에서 월 35만원", content:"UI/UX 디자인 툴 피그마 강의를 탈잉에서 운영해요. 취준생, 직장인 전환 희망자 대상인데 수요가 꾸준합니다. 수강생 1명당 10만원이에요.", pros:"실무 기반 강의는 수요가 안정적이고 단가 설정이 자유로움", cons:"강의 준비와 수강생 관리에 매주 일정 시간 투자 필요", recommend:true },

  // ────────────────────────────────────────────────
  // online-tutoring (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"online-tutoring", hustle_name:"온라인 과외", nickname:"온라인과외수학", income_range:"50_to_100", weekly_hours:15, difficulty:2, satisfaction:5, title:"수학 과외로 주말에만 월 70만원", content:"중고등 수학 온라인 과외를 주말에만 해요. 화상으로 하니까 이동 시간이 없어서 효율적이에요. 학생 5명에 시간당 4만원이면 월 70만원이 나옵니다.", pros:"화상 과외라 이동 없고 시간 활용이 효율적", cons:"학생 관리와 학부모 응대가 쉽지 않은 경우도 있음", recommend:true },
  { hustle_id:"online-tutoring", hustle_name:"온라인 과외", nickname:"영어과외줌수업", income_range:"30_to_50", weekly_hours:10, difficulty:2, satisfaction:4, title:"줌으로 영어 과외, 학생 4명에 월 40만원", content:"초등 영어 과외를 줌으로 진행해요. 오프라인보다 편하고 지역 제한도 없어서 전국 학생 받을 수 있어요. 월 40만원 정도 안정적이에요.", pros:"지역 제한 없이 전국 학생 대상으로 가능", cons:"화면으로 집중도 파악이 어렵고 기술 문제로 수업이 끊기는 경우 있음", recommend:true },
  { hustle_id:"online-tutoring", hustle_name:"온라인 과외", nickname:"과외플랫폼비교", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"과외 플랫폼 3개 비교해보니 이게 낫더라고요", content:"과외히어로, 튜터링, 숨고 세 곳 모두 써봤는데 각자 장단점이 달라요. 저는 숨고에서 지역 학생 연결하고 화상 수업은 줌으로 해서 월 20만원 나와요.", pros:"여러 플랫폼 병행 시 학생 모집 경로 다양화 가능", cons:"플랫폼마다 수수료가 달라서 수익 계산이 복잡해짐", recommend:true },
  { hustle_id:"online-tutoring", hustle_name:"온라인 과외", nickname:"노쇼학부모스트레스", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:2, title:"노쇼와 갑자기 취소가 제일 스트레스에요", content:"온라인 과외의 가장 큰 단점이 학생이나 학부모가 갑자기 노쇼하거나 취소하는 거예요. 한 달에 2~3번은 이런 일이 생겨서 수익이 들쭉날쭉해요.", pros:"시작 진입장벽이 낮고 추가 비용이 거의 없음", cons:"노쇼, 갑작스러운 취소로 수익 예측이 어려움", recommend:true },
  { hustle_id:"online-tutoring", hustle_name:"온라인 과외", nickname:"대학생과외부업", income_range:"10_to_30", weekly_hours:6, difficulty:1, satisfaction:4, title:"대학생 때 온라인 과외로 용돈 해결", content:"대학교 1학년 때부터 고등학생 과외 시작했어요. 전공 관련 과목 위주로 가르치는데 시간당 3만원에 주 2회면 월 25만원 정도 나와요.", pros:"대학생도 전공 과목만 있으면 바로 시작 가능", cons:"공부와 병행하다 보면 시간 관리가 어려워지는 경우 있음", recommend:true },
  { hustle_id:"online-tutoring", hustle_name:"온라인 과외", nickname:"코딩과외월백", income_range:"over_100", weekly_hours:20, difficulty:3, satisfaction:5, title:"코딩 과외로 월 150만원 달성", content:"파이썬, 자바스크립트 코딩 과외 수요가 어마어마해요. 시간당 6~8만원 받고 주당 20시간 하니까 월 150만원 넘어요. 기술 있으면 코딩 과외가 최고의 부업입니다.", pros:"코딩 과외 수요가 폭발적이고 시간당 단가가 높음", cons:"20시간이면 사실상 투잡 수준이라 체력 관리 중요", recommend:true },

  // ────────────────────────────────────────────────
  // udemy (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"udemy", hustle_name:"유데미", nickname:"유데미강의등록경험", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:3, title:"강의 등록까지 3개월, 수익은 기대 이하", content:"강의 제작, 자막, 프로모션 영상까지 준비하는 데 3개월이 걸렸어요. 첫 달 수익은 7만원이에요. 할인 프로모션 때 판매가 몰리는 구조라 평소 수익은 낮아요.", pros:"글로벌 학습자에게 영어 강의 판매 가능", cons:"유데미 자체 할인 정책으로 강의 단가가 자주 낮아짐", recommend:true },
  { hustle_id:"udemy", hustle_name:"유데미", nickname:"유데미영어강의", income_range:"30_to_50", weekly_hours:10, difficulty:4, satisfaction:4, title:"영어 강의로 전 세계 학생에게 월 35만원", content:"파이썬 프로그래밍 영어 강의를 올렸어요. 인도, 동남아시아 학생들이 많이 수강해요. 환율 이득도 있고 한 번 만들면 계속 팔려서 패시브 인컴으로 좋아요.", pros:"글로벌 수요가 있어서 국내보다 학습자 풀이 훨씬 넓음", cons:"영어 강의 제작이 한국어보다 시간이 2배 이상 걸림", recommend:true },
  { hustle_id:"udemy", hustle_name:"유데미", nickname:"유데미한국어강의", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:2, title:"한국어 강의는 수강생이 거의 없어요", content:"유데미에 한국어 강의 올렸는데 플랫폼 자체가 영어권 위주라 한국어 강의 노출이 잘 안 돼요. 국내 플랫폼(클래스101, 탈잉)이 훨씬 낫습니다.", pros:"이미 구축된 글로벌 플랫폼 활용 가능", cons:"한국어 강의는 타겟이 좁아서 노출 기회가 적음", recommend:false },
  { hustle_id:"udemy", hustle_name:"유데미", nickname:"유데미ChatGPT강의", income_range:"50_to_100", weekly_hours:12, difficulty:3, satisfaction:5, title:"AI 강의로 폭발적인 수강생 증가", content:"ChatGPT 활용 강의를 올렸는데 AI 붐 타고 수강생이 폭발적으로 늘었어요. 트렌드 주제는 빠르게 올리는 게 핵심이에요. 월 60만원 됩니다.", pros:"AI 같은 트렌드 주제는 수요가 폭발적으로 늘어남", cons:"트렌드 주제는 관심이 식으면 수강생이 급격히 줄어들 수 있음", recommend:true },
  { hustle_id:"udemy", hustle_name:"유데미", nickname:"유데미수익구조이해", income_range:"10_to_30", weekly_hours:6, difficulty:3, satisfaction:3, title:"수익 구조 이해하고 나서 전략이 달라졌어요", content:"유데미는 자체 프로모션이 많아서 정가로 팔리는 경우가 드물어요. 수강생 수가 핵심이지 판매 단가가 핵심이 아닙니다. 이걸 알고 나서 마케팅 전략을 바꿨어요.", pros:"플랫폼 프로모션으로 노출 기회가 자동으로 만들어짐", cons:"할인 프로모션이 잦아서 강의 단가 통제가 어려움", recommend:true },
  { hustle_id:"udemy", hustle_name:"유데미", nickname:"유데미디자인강의패시브", income_range:"30_to_50", weekly_hours:4, difficulty:3, satisfaction:5, title:"3년 전 올린 강의에서 아직도 월 30만원", content:"3년 전에 포토샵 강의 올려놨는데 지금도 매달 수강생이 등록해요. 업데이트 거의 안 하는데 월 30만원씩 들어오는 진짜 패시브 인컴이에요.", pros:"퀄리티 좋은 강의는 수년간 수익이 지속됨", cons:"오래된 강의는 내용 업데이트가 필요할 수 있고, 평점 관리도 중요", recommend:true },

  // ────────────────────────────────────────────────
  // smart-store (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"smart-store", hustle_name:"스마트스토어", nickname:"스마트스토어6개월", income_range:"30_to_50", weekly_hours:20, difficulty:4, satisfaction:4, title:"6개월 만에 월 매출 300만원 달성", content:"위탁판매로 시작해서 6개월 만에 월 매출 300만원 됐어요. 마진 15% 정도니까 순수익은 45만원 정도예요. 상품 소싱이 핵심이고 처음이 제일 힘들었어요.", pros:"초기 자본 없이 위탁판매로 시작 가능", cons:"마진율이 낮아서 매출 대비 수익이 낮음", recommend:true },
  { hustle_id:"smart-store", hustle_name:"스마트스토어", nickname:"스마트스토어키워드", income_range:"10_to_30", weekly_hours:15, difficulty:4, satisfaction:3, title:"키워드 분석이 성패를 가릅니다", content:"네이버 쇼핑 알고리즘을 모르고 시작했다가 3개월 동안 판매가 없었어요. 키워드 분석 공부하고 나서야 조금씩 팔리기 시작했습니다. 공부 없이는 시작하지 마세요.", pros:"네이버 쇼핑 트래픽이 매우 높아서 노출만 되면 판매 가능", cons:"키워드 분석, 상품 소싱 등 배워야 할 것이 많음", recommend:true },
  { hustle_id:"smart-store", hustle_name:"스마트스토어", nickname:"스마트스토어이것만파는사람", income_range:"50_to_100", weekly_hours:25, difficulty:4, satisfaction:5, title:"한 가지 상품만 3년째 팔아서 월 80만원", content:"경쟁이 덜한 틈새 상품 하나를 발견해서 3년째 팔고 있어요. 상품이 안정되면 하루 1시간만 관리해도 돼요. 비결은 경쟁 없는 카테고리 찾기입니다.", pros:"한 가지 안정적인 상품만 있으면 관리가 매우 편해짐", cons:"안정적인 틈새 상품 찾는 데 시행착오가 많이 필요", recommend:true },
  { hustle_id:"smart-store", hustle_name:"스마트스토어", nickname:"스마트스토어CS지옥", income_range:"10_to_30", weekly_hours:20, difficulty:5, satisfaction:2, title:"고객 CS가 이렇게 힘들 줄 몰랐어요", content:"판매는 잘 되는데 반품, 교환, 불만 고객 CS가 너무 힘들어요. 하루에 문의 10건 이상 오면 본업에 영향을 줄 정도예요. CS 자동화 없으면 지속이 어렵습니다.", pros:"제대로 운영하면 수익 자체는 나쁘지 않음", cons:"CS 부담이 크고 반품/환불 처리에 시간이 많이 소요됨", recommend:false },
  { hustle_id:"smart-store", hustle_name:"스마트스토어", nickname:"스마트스토어사진중요", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:3, title:"상품 사진이 판매량을 결정합니다", content:"같은 상품이어도 사진 퀄리티에 따라 판매량이 10배 차이 나요. 처음엔 핸드폰 사진으로 했다가 실패하고, 제대로 된 상품 사진 찍으니까 판매가 늘었어요.", pros:"사진 퀄리티 올리면 전환율이 눈에 띄게 올라감", cons:"사진 촬영과 편집에 시간과 비용이 추가로 들어감", recommend:true },
  { hustle_id:"smart-store", hustle_name:"스마트스토어", nickname:"스마트스토어대학생창업", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"대학교 4학년, 스마트스토어로 학비 벌었어요", content:"취업 준비하면서 스마트스토어로 소품 팔기 시작했어요. 인테리어 소품 카테고리로 월 20만원 정도 나오는데 창업 경험도 쌓이고 포트폴리오도 됩니다.", pros:"창업 경험을 쌓으면서 실질 수익도 만들 수 있음", cons:"재고 관리와 포장, 발송 등 직접 해야 할 일이 많음", recommend:true },

  // ────────────────────────────────────────────────
  // coupang-rocket (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"coupang-rocket", hustle_name:"쿠팡 로켓그로스", nickname:"로켓그로스3개월", income_range:"30_to_50", weekly_hours:15, difficulty:4, satisfaction:4, title:"로켓그로스 3개월, 월 순수익 40만원", content:"쿠팡이 물류를 다 처리해줘서 주문 처리 스트레스가 없어요. 상품 입고만 하면 되는데 초기에 어떤 상품 소싱할지 연구하는 게 제일 중요했어요.", pros:"쿠팡이 배송, 반품 모두 처리해줘서 운영이 편함", cons:"쿠팡 창고 입고 과정이 복잡하고 수수료가 높은 편", recommend:true },
  { hustle_id:"coupang-rocket", hustle_name:"쿠팡 로켓그로스", nickname:"로켓그로스초기투자", income_range:"under_10", weekly_hours:10, difficulty:4, satisfaction:2, title:"초기 상품 구매 비용이 생각보다 많이 들어요", content:"로켓그로스는 상품을 먼저 사서 쿠팡 창고에 보내야 해요. 처음에 50만원어치 재고 사서 입고했는데 아직 절반도 안 팔렸어요. 재고 위험이 있습니다.", pros:"쿠팡 물류 시스템이 잘 되어있어서 운영은 편함", cons:"재고를 직접 구매해야 해서 초기 투자 비용이 필요하고 재고 위험 있음", recommend:false },
  { hustle_id:"coupang-rocket", hustle_name:"쿠팡 로켓그로스", nickname:"로켓그로스성공상품", income_range:"50_to_100", weekly_hours:12, difficulty:3, satisfaction:5, title:"히트 상품 하나 찾으면 자동수익이에요", content:"쿠팡 인기 검색어 분석해서 틈새 상품 찾았어요. 한 달에 한 번 재입고만 하는데 월 70만원 들어옵니다. 상품 발굴이 핵심이에요.", pros:"좋은 상품만 있으면 운영 시간이 매우 적게 들어감", cons:"경쟁자가 생기면 가격 경쟁이 심해지고 수익이 줄어들 수 있음", recommend:true },
  { hustle_id:"coupang-rocket", hustle_name:"쿠팡 로켓그로스", nickname:"로켓그로스vs스마트스토어", income_range:"30_to_50", weekly_hours:15, difficulty:4, satisfaction:3, title:"스마트스토어 하다가 로켓그로스 전환한 후기", content:"스마트스토어는 CS가 힘들어서 로켓그로스로 옮겼어요. 수수료가 좀 높지만 배송, 반품, CS를 쿠팡이 다 해줘서 정신 건강에 훨씬 좋아요.", pros:"CS와 물류 스트레스에서 해방되는 게 가장 큰 장점", cons:"쿠팡 수수료가 스마트스토어보다 높아서 마진율이 낮아짐", recommend:true },
  { hustle_id:"coupang-rocket", hustle_name:"쿠팡 로켓그로스", nickname:"로켓그로스시작가이드", income_range:"10_to_30", weekly_hours:8, difficulty:4, satisfaction:4, title:"3주만에 물품 등록하고 첫 판매 성공", content:"강의 듣고 3주 만에 첫 판매 성공했어요. 초반엔 창고 입고 과정이 복잡했지만 두 번째부터는 익숙해졌어요. 첫 달 18만원이에요.", pros:"한 번 프로세스 익히면 반복 운영이 쉬워짐", cons:"첫 번째 창고 입고 과정이 복잡해서 익히는 데 시간이 걸림", recommend:true },

  // ────────────────────────────────────────────────
  // ably-seller (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"ably-seller", hustle_name:"에이블리 셀러", nickname:"에이블리패션셀러", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:4, title:"에이블리에서 의류 팔아서 월 20만원", content:"대도매, 도매꾹에서 소싱해서 에이블리에서 팔고 있어요. 트렌디한 상품 선정이 핵심이에요. 의류 패션 카테고리라 반품이 많은 게 단점입니다.", pros:"에이블리 내 고정 고객층이 있어서 재구매율이 높음", cons:"의류 특성상 반품률이 높고 사이즈 CS가 빈번함", recommend:true },
  { hustle_id:"ably-seller", hustle_name:"에이블리 셀러", nickname:"에이블리악세사리", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"악세서리로 에이블리 시작해서 월 15만원", content:"의류보다 악세서리가 반품도 적고 관리가 쉬워요. 마진이 50% 이상이라 판매량 대비 수익이 높습니다. 처음 시작하는 분들께 악세서리 카테고리를 추천해요.", pros:"악세서리는 반품이 적고 마진이 높은 편", cons:"의류에 비해 판매량 자체가 적을 수 있음", recommend:true },
  { hustle_id:"ably-seller", hustle_name:"에이블리 셀러", nickname:"에이블리상품등록노하우", income_range:"under_10", weekly_hours:15, difficulty:4, satisfaction:2, title:"상품 등록 심사가 생각보다 까다롭습니다", content:"에이블리 판매자 등록하고 상품 올렸는데 심사에서 2번 탈락했어요. 사진 퀄리티, 상품 설명 기준이 높아서 처음에 고생했어요.", pros:"심사 기준이 높다는 건 그만큼 플랫폼 신뢰도가 있다는 의미", cons:"상품 등록 심사가 까다로워서 초반에 시행착오가 많음", recommend:false },
  { hustle_id:"ably-seller", hustle_name:"에이블리 셀러", nickname:"에이블리크리에이터수익", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:3, title:"에이블리 크리에이터 활동으로 추가 수익", content:"에이블리 크리에이터로 활동하면서 내가 좋아하는 옷 링크 공유하고 수익 받는 구조예요. 직접 판매보다 부담이 낮아서 입문으로 괜찮아요.", pros:"직접 판매 없이 링크 공유만으로 수익 가능", cons:"크리에이터 수익은 직접 판매보다 낮음", recommend:true },
  { hustle_id:"ably-seller", hustle_name:"에이블리 셀러", nickname:"에이블리반품지옥", income_range:"under_10", weekly_hours:20, difficulty:5, satisfaction:1, title:"반품 처리하다가 포기했습니다", content:"의류 카테고리 특성상 반품이 너무 많아요. 하루에 반품 3~4건씩 오면 재포장, 반품 처리, 재고 관리에 시간이 다 쏟려요. 실제 수익보다 손실이 더 많았어요.", pros:"에이블리 플랫폼 자체 트래픽이 높음", cons:"의류 반품률이 30~40%로 높아서 실제 수익이 크게 줄어듦", recommend:false },
  { hustle_id:"ably-seller", hustle_name:"에이블리 셀러", nickname:"에이블리위탁판매", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:4, title:"재고 없는 위탁판매로 리스크 줄이니 편해요", content:"도매 사이트와 연동해서 주문 들어오면 자동으로 발주하는 위탁 구조예요. 재고 부담 없이 에이블리에서 월 35만원 나와요.", pros:"재고 부담 없는 위탁판매라 초기 투자 위험이 없음", cons:"위탁 공급사 재고 소진 시 품절 처리가 번거로움", recommend:true },

  // ────────────────────────────────────────────────
  // amazon-fba (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"amazon-fba", hustle_name:"아마존 FBA", nickname:"아마존FBA1년", income_range:"50_to_100", weekly_hours:15, difficulty:5, satisfaction:4, title:"1년 공부하고 진입해서 월 60만원 달성", content:"아마존 FBA는 진입 전 공부가 필수예요. 상품 리서치, 중국 공장 소싱, FBA 수수료 계산까지 공부하는 데 6개월 걸렸어요. 제대로 배우면 월 60만원 나옵니다.", pros:"아마존 물류가 모든 배송을 처리해줘서 운영 편의성이 높음", cons:"초기 공부 기간 6개월 이상 + 상품 소싱 비용 필요", recommend:true },
  { hustle_id:"amazon-fba", hustle_name:"아마존 FBA", nickname:"아마존FBA실패사례", income_range:"under_10", weekly_hours:20, difficulty:5, satisfaction:1, title:"첫 상품으로 300만원 날렸습니다", content:"아마존 FBA 유혹에 빠져서 무작정 중국에서 상품 500개 만들었는데 판매가 전혀 안 됐어요. 상품 리서치 없이 시작하면 초기 투자 전부 날립니다. 신중하게 접근하세요.", pros:"성공하면 글로벌 시장에서 큰 수익 가능", cons:"공부 없이 시작하면 초기 투자금 전부 날릴 위험이 매우 큼", recommend:false },
  { hustle_id:"amazon-fba", hustle_name:"아마존 FBA", nickname:"아마존PL브랜드", income_range:"over_100", weekly_hours:20, difficulty:5, satisfaction:5, title:"PL 상품으로 월 150만원, 2년 걸렸지만 값어치 있어요", content:"Private Label로 나만의 브랜드 상품을 만들어 팔고 있어요. 2년 투자해서 만든 브랜드가 지금 월 150만원 수익 내고 있어요. 시간이 걸리지만 확장성이 있습니다.", pros:"자체 브랜드 구축하면 수익 확장성이 무한함", cons:"PL 상품 개발까지 2년 이상의 시간과 투자 필요", recommend:true },
  { hustle_id:"amazon-fba", hustle_name:"아마존 FBA", nickname:"아마존FBA수수료계산", income_range:"10_to_30", weekly_hours:10, difficulty:4, satisfaction:3, title:"수수료 계산 잘못하면 적자예요", content:"아마존 FBA 수수료가 생각보다 많아요. 판매가의 30~40%가 수수료로 나가는 경우도 있어서 처음엔 적자를 봤어요. 수수료 계산기 필수입니다.", pros:"공식 수익 계산기로 사전에 수익성 검증이 가능", cons:"수수료가 복잡하고 항목이 많아서 초보자는 계산 실수 위험", recommend:true },
  { hustle_id:"amazon-fba", hustle_name:"아마존 FBA", nickname:"아마존중국소싱", income_range:"30_to_50", weekly_hours:15, difficulty:4, satisfaction:4, title:"알리바바 소싱으로 마진 확보한 전략", content:"알리바바에서 공장 직접 컨택해서 마진 40% 이상 확보했어요. 영어 소통이 가능하면 공장 협상이 생각보다 쉬워요. 월 35만원 수익이에요.", pros:"알리바바 공장 직소싱으로 마진을 높일 수 있음", cons:"MOQ(최소 발주량) 기준이 있어서 초기 재고 투자가 필요", recommend:true },
  { hustle_id:"amazon-fba", hustle_name:"아마존 FBA", nickname:"아마존FBM비교", income_range:"10_to_30", weekly_hours:12, difficulty:4, satisfaction:3, title:"FBA vs FBM 직접 비교해봤어요", content:"처음엔 직접 배송(FBM)으로 시작해서 FBA로 전환했는데 배송 시간, 반품 처리 모두 FBA가 압도적으로 편해요. 수수료 더 내도 FBA가 낫습니다.", pros:"FBA 전환 후 운영 부담이 크게 줄어듦", cons:"FBA 수수료가 FBM보다 높아서 마진 계산을 다시 해야 함", recommend:true },

  // ────────────────────────────────────────────────
  // aliexpress-dropshipping (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"aliexpress-dropshipping", hustle_name:"알리 드롭쉬핑", nickname:"드롭쉬핑6개월", income_range:"10_to_30", weekly_hours:15, difficulty:4, satisfaction:3, title:"6개월 만에 드롭쉬핑 구조 완성했어요", content:"쇼피파이 + 알리익스프레스 드롭쉬핑으로 재고 없이 판매해요. 배송이 2~3주 걸리는 게 단점이지만 재고 부담이 없는 게 최대 장점이에요. 월 20만원이에요.", pros:"재고 없이 판매 가능해서 초기 투자 비용이 최소화됨", cons:"알리 배송 기간이 2~3주라 고객 불만이 생기기 쉬움", recommend:true },
  { hustle_id:"aliexpress-dropshipping", hustle_name:"알리 드롭쉬핑", nickname:"드롭쉬핑사기주의", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:1, title:"강의비만 날린 드롭쉬핑 사기 경험", content:"드롭쉬핑 강의비로 100만원 냈는데 실제 수익은 0원이에요. 과장된 수익 후기에 속지 마세요. 실제 성공률은 낮고 경쟁이 치열합니다.", pros:"이론상 재고 없이 창업 가능한 구조는 맞음", cons:"실제 성공 사례가 홍보만큼 많지 않고 사기성 강의가 많음", recommend:false },
  { hustle_id:"aliexpress-dropshipping", hustle_name:"알리 드롭쉬핑", nickname:"드롭쉬핑페이스북광고", income_range:"30_to_50", weekly_hours:20, difficulty:5, satisfaction:4, title:"페이스북 광고로 드롭쉬핑 월 40만원 순익", content:"페이스북 광고 최적화가 드롭쉬핑 성패를 가려요. 광고비 대비 수익률(ROAS)을 3배 이상 유지하면 수익이 나요. 광고 공부 필수입니다.", pros:"광고 최적화만 되면 자동화된 수익 구조 완성 가능", cons:"광고비가 높아서 초기에 광고비 날릴 위험이 있음", recommend:true },
  { hustle_id:"aliexpress-dropshipping", hustle_name:"알리 드롭쉬핑", nickname:"드롭쉬핑틈새시장", income_range:"10_to_30", weekly_hours:12, difficulty:4, satisfaction:3, title:"틈새 제품 찾는 게 핵심입니다", content:"경쟁이 적은 틈새 제품을 찾아야 해요. 경쟁이 심한 제품은 광고비 올려도 수익이 안 나요. 제품 리서치에 가장 많은 시간을 써야 합니다.", pros:"틈새 제품 찾으면 경쟁 없이 안정적인 수익 가능", cons:"틈새 제품 리서치에 많은 시간과 시행착오가 필요함", recommend:true },
  { hustle_id:"aliexpress-dropshipping", hustle_name:"알리 드롭쉬핑", nickname:"드롭쉬핑CS문제", income_range:"under_10", weekly_hours:15, difficulty:4, satisfaction:2, title:"배송 지연 CS 처리가 정말 힘들어요", content:"알리 배송이 2~3주 걸리다 보니까 구매자들이 배송 문의를 엄청나게 해요. CS 처리에 하루 1~2시간씩 쏟는데 이게 제일 힘들어요.", pros:"재고 없이 운영 가능한 구조는 분명한 장점", cons:"배송 지연 CS가 빈번하고 환불 요청도 많아서 스트레스가 큼", recommend:false },
  { hustle_id:"aliexpress-dropshipping", hustle_name:"알리 드롭쉬핑", nickname:"드롭쉬핑자동화성공", income_range:"50_to_100", weekly_hours:8, difficulty:4, satisfaction:5, title:"자동화 완성 후 월 60만원, 하루 1시간", content:"쇼피파이 앱으로 주문 자동 처리, CS봇으로 기본 문의 자동 응대까지 구축했어요. 지금은 하루 1시간만 투자해서 월 60만원 나옵니다.", pros:"자동화 구축하면 진정한 패시브 인컴에 가까워짐", cons:"자동화 시스템 구축까지 6개월 이상의 시행착오 필요", recommend:true },

  // ────────────────────────────────────────────────
  // instagram-shop (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"instagram-shop", hustle_name:"인스타그램 쇼핑몰", nickname:"인스타핸드메이드", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:4, title:"핸드메이드 제품으로 인스타 쇼핑몰 운영", content:"직접 만든 캔들, 디퓨저를 인스타에서 팔고 있어요. 팔로워 2천명에서 월 20만원 정도 나와요. 제품 퀄리티가 곧 팔로워 증가로 이어지는 구조예요.", pros:"나만의 제품이라 차별화되고 팬층이 생기는 구조", cons:"핸드메이드라 수량 늘리는 데 한계가 있음", recommend:true },
  { hustle_id:"instagram-shop", hustle_name:"인스타그램 쇼핑몰", nickname:"인스타소호몰", income_range:"30_to_50", weekly_hours:20, difficulty:4, satisfaction:4, title:"인스타 팔로워 5천명으로 소호몰 월 40만원", content:"팔로워 5천명이면 의류 소호몰 운영이 가능해요. 주기적으로 공구(공동구매) 진행하고 커미션 받는 방식도 병행하고 있어요.", pros:"팔로워가 구매 고객으로 직결되어 효율적인 판매 구조", cons:"신상품 계속 업로드해야 해서 소싱과 촬영에 시간이 많이 듦", recommend:true },
  { hustle_id:"instagram-shop", hustle_name:"인스타그램 쇼핑몰", nickname:"인스타쇼핑초보", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:2, title:"팔로워 없으면 시작도 힘들어요", content:"인스타 팔로워가 500명인데 제품 올려도 아무도 안 봐요. 쇼핑몰 오픈 전에 팔로워를 먼저 모아야 한다는 걸 뒤늦게 알았어요.", pros:"SNS 채널이 있으면 별도 쇼핑몰 없이 판매 가능", cons:"팔로워 없으면 판매 자체가 불가능한 구조", recommend:false },
  { hustle_id:"instagram-shop", hustle_name:"인스타그램 쇼핑몰", nickname:"인스타AI활용", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"AI로 상품 사진, 설명 제작해서 효율 높였어요", content:"AI 이미지 생성으로 상품 홍보 이미지 만들고 ChatGPT로 상품 설명 작성해요. 콘텐츠 제작 시간이 절반으로 줄었고 월 15만원 나오고 있어요.", pros:"AI 툴로 콘텐츠 제작 시간을 대폭 단축 가능", cons:"AI 생성 이미지가 실제 상품과 다르면 구매자 실망 위험", recommend:true },
  { hustle_id:"instagram-shop", hustle_name:"인스타그램 쇼핑몰", nickname:"인스타공구전문", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:4, title:"공동구매 전문으로 브랜드 협업 월 35만원", content:"공구 진행하면 판매량 많을 때 브랜드가 별도 커미션 줘요. 팔로워 3천명 이상이면 공구 제의가 들어옵니다. 직접 재고 관리 없이 수익을 낼 수 있어서 좋아요.", pros:"재고 없이 커미션 수익만 가져가는 효율적 구조", cons:"공구 상품 퀄리티가 낮으면 팔로워 이탈 위험", recommend:true },
  { hustle_id:"instagram-shop", hustle_name:"인스타그램 쇼핑몰", nickname:"인스타빈티지셀러", income_range:"10_to_30", weekly_hours:15, difficulty:3, satisfaction:3, title:"중고 빈티지 옷 팔아서 월 18만원", content:"당근이나 구제 옷가게에서 빈티지 옷 사서 인스타에서 팔아요. 스타일링 사진이 좋으면 팔려요. 마진이 50% 이상이고 재고 회전이 빠릅니다.", pros:"소자본으로 시작 가능하고 마진율이 높음", cons:"매물 발굴과 촬영에 시간이 많이 들어감", recommend:true },

  // ────────────────────────────────────────────────
  // musinsa-store (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"musinsa-store", hustle_name:"무신사 스토어", nickname:"무신사브랜드런칭", income_range:"50_to_100", weekly_hours:20, difficulty:5, satisfaction:5, title:"무신사 입점 후 월 70만원 순수익", content:"직접 디자인한 티셔츠 브랜드로 무신사에 입점했어요. 입점 심사가 까다롭지만 한 번 들어가면 트래픽이 어마어마해요. 월 매출 500만원에 순수익 70만원이에요.", pros:"무신사 자체 트래픽이 엄청나서 노출만 되면 판매 가능", cons:"입점 심사 기준이 매우 높고 가격 경쟁이 치열함", recommend:true },
  { hustle_id:"musinsa-store", hustle_name:"무신사 스토어", nickname:"무신사추천인활동", income_range:"10_to_30", weekly_hours:5, difficulty:1, satisfaction:4, title:"추천인 링크만으로 소소하게 월 12만원", content:"무신사 상품 리뷰 쓰고 추천인 링크 공유하는 방식이에요. 팔로워나 블로그 방문자 있으면 쉽게 할 수 있어요. 시간 투자가 적어서 부담이 없습니다.", pros:"직접 판매 없이 링크 공유만으로 수익 창출", cons:"추천인 수수료가 낮아서 트래픽이 많아야 의미있음", recommend:true },
  { hustle_id:"musinsa-store", hustle_name:"무신사 스토어", nickname:"무신사입점심사탈락", income_range:"under_10", weekly_hours:10, difficulty:5, satisfaction:2, title:"입점 심사 3번 탈락, 브랜드 기준이 높아요", content:"무신사 입점 신청했는데 3번 탈락했어요. 브랜드 스토리, 시즌 컬렉션, 사진 퀄리티 등 기준이 엄격해요. 개인 셀러보다는 브랜드 수준이 되어야 입점 가능합니다.", pros:"입점만 되면 대규모 트래픽을 무료로 활용 가능", cons:"입점 심사 기준이 매우 높아서 소규모 셀러는 진입이 어려움", recommend:false },
  { hustle_id:"musinsa-store", hustle_name:"무신사 스토어", nickname:"무신사리뷰블로거", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"무신사 리뷰 쓰면서 포인트와 수익 챙겨요", content:"내돈내산 리뷰 작성하면 포인트 적립되고, 추천 링크로 수익도 생겨요. 패션에 관심 있으면 즐기면서 할 수 있는 부업이에요.", pros:"패션에 관심 있으면 즐기면서 소소한 수익 창출 가능", cons:"수익 규모가 크지 않아서 전업 부업보다는 용돈 수준", recommend:true },
  { hustle_id:"musinsa-store", hustle_name:"무신사 스토어", nickname:"무신사스트릿셀러", income_range:"30_to_50", weekly_hours:15, difficulty:4, satisfaction:4, title:"스트릿 패션 특화로 무신사에서 월 40만원", content:"스트릿, 힙합 스타일 특화 브랜드로 무신사에서 팔고 있어요. 타겟이 명확하니까 구매 전환율이 높아요. 월 40만원 안정적으로 나오고 있습니다.", pros:"명확한 타겟 스타일로 충성 고객층 형성이 가능", cons:"재고 관리와 신상품 주기적 출시가 필수라 부담이 있음", recommend:true },
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
