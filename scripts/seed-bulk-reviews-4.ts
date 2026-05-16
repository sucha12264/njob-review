/**
 * 후기 대량 삽입 스크립트 (Part 4: 킥보드충전/디지털콘텐츠/기타)
 * 실행: npx tsx scripts/seed-bulk-reviews-4.ts
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
  // kick-charge (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"kick-charge", hustle_name:"킥보드 충전", nickname:"킥보드충전3개월", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:3, title:"새벽에 킥보드 줍고 충전해서 월 8만원", content:"새벽 5~6시에 방전된 킥보드 수거해서 집에서 충전하고 반납해요. 한 대당 2000~4000원이고 한 번에 5~7대 가능해요. 새벽형 인간에게 맞는 부업이에요.", pros:"이미 이른 아침에 일어나는 사람이라면 최적의 루틴 부업", cons:"새벽 수거라 수면 패턴 변화가 생길 수 있음", recommend:true },
  { hustle_id:"kick-charge", hustle_name:"킥보드 충전", nickname:"킥충전앱종류비교", income_range:"under_10", weekly_hours:6, difficulty:2, satisfaction:3, title:"라임, 씽씽, 킥고잉 세 군데 다 해봤어요", content:"라임은 단가가 높고, 씽씽은 킥보드 수가 많고, 킥고잉은 앱이 편리해요. 지역마다 많은 브랜드가 다르니까 내 동네에서 많은 곳 선택하면 돼요.", pros:"여러 앱 동시 등록해서 수거 효율을 높일 수 있음", cons:"브랜드마다 충전기가 달라서 여러 개 준비해야 하는 초기 비용 발생", recommend:true },
  { hustle_id:"kick-charge", hustle_name:"킥보드 충전", nickname:"킥보드충전수익현실", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:2, title:"생각보다 경쟁이 심해서 수거량이 적어요", content:"킥보드 충전 부업이 알려지면서 경쟁자가 많아졌어요. 좋은 자리에 있는 킥보드는 새벽 4시에도 이미 없어진 경우가 많아요. 수익이 처음보다 30% 줄었어요.", pros:"시작 진입장벽이 낮고 특별한 기술이 필요 없음", cons:"경쟁자 증가로 수거 가능한 킥보드 수가 줄어들고 있음", recommend:false },
  { hustle_id:"kick-charge", hustle_name:"킥보드 충전", nickname:"킥보드차량활용", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"차 있으면 한 번에 20대 수거 가능해요", content:"트렁크에 20대까지 싣고 한 번에 수거해요. 차량 있으면 반경이 넓어지고 수거량이 많아져서 월 15만원까지 올라갔어요.", pros:"차량 있으면 수거 효율이 크게 올라가고 수익도 비례해서 증가", cons:"주유비, 차량 소모가 추가되어 순수익 계산 필요", recommend:true },
  { hustle_id:"kick-charge", hustle_name:"킥보드 충전", nickname:"킥충전전기요금계산", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"전기요금 빼면 실수익이 더 낮아요", content:"킥보드 10대 충전하면 전기요금이 3000~4000원 나와요. 수익에서 전기요금 빼면 실수익이 생각보다 낮아요. 전기료까지 계산하고 시작하세요.", pros:"진입 비용이 낮고 충전기 무상 지원해주는 경우도 있음", cons:"전기요금, 이동 비용 빼면 실제 수익이 낮아짐", recommend:true },
  { hustle_id:"kick-charge", hustle_name:"킥보드 충전", nickname:"킥보드충전아침루틴", income_range:"under_10", weekly_hours:4, difficulty:1, satisfaction:4, title:"아침 운동 겸 킥보드 수거해요", content:"매일 아침 6시에 조깅하면서 킥보드 수거해요. 운동 코스에 킥보드가 많은 동네라서 한 번에 5대는 잡아요. 운동+수익이라 만족도가 높아요.", pros:"운동 루틴과 병행하면 시간 낭비 없이 수익 가능", cons:"수거할 킥보드가 없는 날은 운동만 하고 오는 경우도 있음", recommend:true },

  // ────────────────────────────────────────────────
  // ebook (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"ebook", hustle_name:"전자책 출판", nickname:"전자책첫출판", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:3, title:"첫 전자책 출판, 첫 달 수익 5만원", content:"3개월 걸려서 전자책 한 권 만들었어요. 크몽에 올렸더니 첫 달 5만원이에요. 기대보단 낮지만 패시브 인컴 구조라서 계속 쌓이겠지 하는 마음이에요.", pros:"한 번 만들면 별도 노력 없이 지속적으로 수익 발생", cons:"첫 판매까지 시간이 걸리고 마케팅 없이는 노출이 어려움", recommend:true },
  { hustle_id:"ebook", hustle_name:"전자책 출판", nickname:"전자책크몽베스트셀러", income_range:"30_to_50", weekly_hours:5, difficulty:3, satisfaction:5, title:"크몽 베스트셀러 달성 후 월 40만원 패시브", content:"부업 노하우 전자책이 베스트셀러 됐어요. 베스트셀러 뱃지 달리니까 자연 유입이 폭발했어요. 지금은 거의 손 안 대도 월 40만원 들어와요.", pros:"베스트셀러 달성 후 자연 유입으로 완전 패시브 수익 가능", cons:"베스트셀러가 되려면 초기 마케팅과 좋은 후기가 필수", recommend:true },
  { hustle_id:"ebook", hustle_name:"전자책 출판", nickname:"전자책주제선정중요", income_range:"under_10", weekly_hours:15, difficulty:4, satisfaction:2, title:"주제 잘못 고르면 아무도 안 사요", content:"관심 있는 주제로 전자책 썼는데 수요가 없는 주제였어요. 출판 전에 수요 조사 먼저 하고, 실제로 사람들이 검색하는 주제로 써야 해요.", pros:"디지털 상품이라 재고 없고 추가 비용이 없음", cons:"주제 선정 잘못하면 아무리 잘 만들어도 판매가 안 됨", recommend:false },
  { hustle_id:"ebook", hustle_name:"전자책 출판", nickname:"전자책노션템플릿번들", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"전자책+노션 템플릿 번들로 판매 단가 높이기", content:"전자책 단독보다 관련 노션 템플릿을 같이 묶어서 팔면 단가를 높일 수 있어요. 번들 상품이 단품보다 2배 이상 팔려요.", pros:"번들 상품으로 단가를 높이고 고객 만족도도 올라감", cons:"추가 콘텐츠 제작에 시간이 더 들어감", recommend:true },
  { hustle_id:"ebook", hustle_name:"전자책 출판", nickname:"직장인전자책부업", income_range:"10_to_30", weekly_hours:6, difficulty:3, satisfaction:4, title:"회사 경험 정리해서 전자책으로 월 15만원", content:"10년 직장 생활 노하우를 전자책으로 정리했어요. 취준생, 직장인 대상이라 수요가 꾸준해요. 내가 살아온 경험이 상품이 된다는 게 신기하고 보람 있어요.", pros:"특별한 전문 기술 없어도 경험을 상품화할 수 있음", cons:"비슷한 내용의 책이 많아서 차별화 포인트가 중요함", recommend:true },
  { hustle_id:"ebook", hustle_name:"전자책 출판", nickname:"전자책시리즈전략", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:5, title:"시리즈 전자책 4권으로 월 35만원", content:"첫 책이 팔리면 같은 주제로 시리즈 출판하는 게 효과적이에요. 첫 권 구매자가 시리즈를 다 사주거든요. 4권 시리즈 완성하니까 월 35만원이에요.", pros:"시리즈로 만들면 한 구매자가 여러 권 구매하는 경우가 많음", cons:"시리즈 완성까지 시간과 노력이 상당히 필요함", recommend:true },

  // ────────────────────────────────────────────────
  // notion-template (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"notion-template", hustle_name:"노션 템플릿", nickname:"노션템플릿첫판매", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:4, title:"첫 노션 템플릿 팔린 날 너무 신기했어요", content:"내가 쓰던 업무 관리 템플릿 크몽에 올렸더니 첫 주에 2개 팔렸어요. 건당 9900원이지만 만든 게 팔린다는 느낌이 새로워서 더 열심히 만들게 됐어요.", pros:"이미 만들어 쓰던 템플릿을 그대로 상품화 가능", cons:"경쟁 템플릿이 많아서 차별화와 마케팅이 필요함", recommend:true },
  { hustle_id:"notion-template", hustle_name:"노션 템플릿", nickname:"노션템플릿월수익", income_range:"10_to_30", weekly_hours:5, difficulty:2, satisfaction:4, title:"노션 템플릿 10개로 월 12만원 패시브", content:"다양한 주제 템플릿 10개 올려두니까 월 12만원 들어와요. 처음에 만드는 시간이 있지만 올려두면 추가 작업 없이 계속 팔려요.", pros:"여러 템플릿 올릴수록 수익이 비례해서 늘어남", cons:"유사 템플릿이 많아서 초반에 판매가 적을 수 있음", recommend:true },
  { hustle_id:"notion-template", hustle_name:"노션 템플릿", nickname:"노션해외판매영어", income_range:"30_to_50", weekly_hours:8, difficulty:3, satisfaction:5, title:"Gumroad에서 영어 템플릿으로 달러 수익", content:"크몽보다 Gumroad에서 영어 템플릿 팔면 훨씬 더 많이 팔려요. 글로벌 노션 사용자가 국내보다 훨씬 많아서 영어 버전 만들고 나서 수익이 3배 됐어요.", pros:"영어 버전으로 만들면 글로벌 시장 접근으로 수익이 폭발적으로 늘어남", cons:"영어 설명과 마케팅이 추가로 필요함", recommend:true },
  { hustle_id:"notion-template", hustle_name:"노션 템플릿", nickname:"노션템플릿SNS마케팅", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"SNS 마케팅 없으면 묻혀요", content:"좋은 템플릿 만들어도 홍보 안 하면 안 팔려요. 인스타, 블로그에 노션 활용법 올리면서 자연스럽게 템플릿 연결하는 마케팅이 필수예요.", pros:"콘텐츠 마케팅과 연계하면 유기적으로 판매 증가", cons:"마케팅 없이는 플랫폼 내 노출이 거의 안 됨", recommend:true },
  { hustle_id:"notion-template", hustle_name:"노션 템플릿", nickname:"노션템플릿기업버전", income_range:"30_to_50", weekly_hours:8, difficulty:3, satisfaction:5, title:"기업용 템플릿으로 고단가 판매 성공", content:"개인용보다 팀 협업용, 기업 관리용 템플릿이 단가가 3~5배 높아요. 라이선스 가격으로 팔면 건당 10만원 이상도 가능해요.", pros:"B2B 타겟 템플릿은 단가가 개인용보다 훨씬 높음", cons:"기업 니즈 파악과 전문적인 기능 구현이 필요함", recommend:true },

  // ────────────────────────────────────────────────
  // bgm-music (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"bgm-music", hustle_name:"BGM 음악 판매", nickname:"BGM음악첫수익", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:4, title:"AI 음악 툴로 BGM 만들어서 첫 수익 발생", content:"Mureka, Suno 같은 AI 음악 생성 툴로 BGM 만들어서 음원 플랫폼에 올렸어요. 첫 달 3만원인데 점점 쌓이고 있어요. 음악 지식 없어도 AI로 가능해요.", pros:"AI 툴로 음악 지식 없어도 BGM 제작이 가능해짐", cons:"AI 생성 음원이 넘쳐나면서 경쟁이 치열해지고 있음", recommend:true },
  { hustle_id:"bgm-music", hustle_name:"BGM 음악 판매", nickname:"유튜버BGM판매", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:4, title:"유튜버 대상 BGM 제작 의뢰로 월 18만원", content:"유튜버들에게 맞춤 BGM 제작해줘요. 건당 3~5만원이고 한 달에 4~5건 들어와요. 음원 플랫폼 판매보다 의뢰가 단가가 높아요.", pros:"의뢰 제작은 플랫폼 판매보다 단가가 훨씬 높음", cons:"의뢰 건수가 불규칙해서 수입이 들쭉날쭉함", recommend:true },
  { hustle_id:"bgm-music", hustle_name:"BGM 음악 판매", nickname:"BGM스톡뮤직등록", income_range:"under_10", weekly_hours:8, difficulty:3, satisfaction:3, title:"Epidemic Sound, 아트리스트에 BGM 등록", content:"글로벌 BGM 플랫폼에 음원 등록했는데 심사 기준이 높아서 절반이 탈락했어요. 통과된 곡은 꾸준히 수익이 들어오는데 월 5만원 수준이에요.", pros:"한 번 등록하면 지속적으로 라이선스 수익이 발생", cons:"심사 기준이 높아서 초보자는 탈락률이 높음", recommend:true },
  { hustle_id:"bgm-music", hustle_name:"BGM 음악 판매", nickname:"작곡가BGM수익공개", income_range:"30_to_50", weekly_hours:15, difficulty:4, satisfaction:4, title:"작곡 전공자라면 BGM이 최고 부업이에요", content:"작곡을 전공한 덕에 BGM 퀄리티가 높아요. 유튜브 BGM 제공 채널도 운영하면서 광고 수익 + 의뢰 제작으로 월 35만원이에요.", pros:"음악 전공자는 빠른 제작과 높은 퀄리티로 경쟁 우위", cons:"음악 전공이 없으면 퀄리티 높이는 데 상당한 시간이 필요", recommend:true },
  { hustle_id:"bgm-music", hustle_name:"BGM 음악 판매", nickname:"BGM카페배경음악", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"카페, 식당 배경음악 납품해봤어요", content:"주변 카페에 맞춤 배경음악 패키지 판매 시도했는데 수요가 생각보다 적어요. 월정액으로 구독하는 곳도 거의 없어서 B2B 판매가 쉽지 않았어요.", pros:"로컬 비즈니스 대상으로 틈새 시장 접근 가능", cons:"B2B 판매는 영업 노력이 많이 필요하고 계약 성공률이 낮음", recommend:false },
  { hustle_id:"bgm-music", hustle_name:"BGM 음악 판매", nickname:"BGM패시브인컴완성", income_range:"10_to_30", weekly_hours:4, difficulty:3, satisfaction:5, title:"200곡 등록 후 월 20만원 패시브 달성", content:"2년 동안 200곡을 여러 플랫폼에 등록했더니 이제 월 20만원이 자동으로 들어와요. 지금도 가끔 신곡 올리는데 수익이 꾸준히 늘고 있어요.", pros:"곡이 쌓일수록 수익이 자연스럽게 늘어나는 구조", cons:"200곡 등록까지 2년 이상의 꾸준한 노력이 필요", recommend:true },

  // ────────────────────────────────────────────────
  // figma-template (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"figma-template", hustle_name:"피그마 템플릿", nickname:"피그마UI키트판매", income_range:"10_to_30", weekly_hours:15, difficulty:4, satisfaction:4, title:"UI 키트 판매로 월 18만원 패시브", content:"피그마 UI 키트 만들어서 Gumroad에 올렸어요. 디자이너들이 시간 절약용으로 많이 구매해요. 한 번 만들어두면 계속 팔려요.", pros:"글로벌 디자이너 시장이 넓고 수요가 꾸준함", cons:"디자인 실력이 필요하고 퀄리티가 낮으면 안 팔림", recommend:true },
  { hustle_id:"figma-template", hustle_name:"피그마 템플릿", nickname:"피그마소셜미디어", income_range:"under_10", weekly_hours:8, difficulty:3, satisfaction:3, title:"소셜 미디어 게시물 템플릿 판매 시작", content:"인스타그램, 유튜브 썸네일용 피그마 템플릿 팔고 있어요. 경쟁이 많아서 처음엔 안 팔리다가 SNS 마케팅 시작하고 나서 조금씩 팔리기 시작했어요.", pros:"수요가 있는 실용적인 카테고리라 잠재력이 있음", cons:"비슷한 무료 템플릿이 많아서 유료 판매가 쉽지 않음", recommend:true },
  { hustle_id:"figma-template", hustle_name:"피그마 템플릿", nickname:"피그마상세페이지제작", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:5, title:"쇼핑몰 상세페이지 템플릿으로 월 35만원", content:"스마트스토어, 쿠팡 판매자용 상세페이지 피그마 템플릿이 불티나게 팔려요. 국내 온라인 쇼핑 증가로 수요가 많아요. 월 35만원 이상 안정적이에요.", pros:"국내 쇼핑몰 셀러 시장이 크고 상세페이지 수요가 높음", cons:"포토샵, 캔바 등 경쟁 템플릿 플랫폼이 많음", recommend:true },
  { hustle_id:"figma-template", hustle_name:"피그마 템플릿", nickname:"피그마프리미엄vs무료", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:2, title:"무료 템플릿 경쟁에서 유료 팔기가 너무 어려워요", content:"피그마 커뮤니티에 무료 템플릿이 넘쳐나서 유료 판매가 정말 어려워요. 엄청 잘 만들거나 독특한 니즈를 공략하지 않으면 팔리지 않아요.", pros:"한 번 성공하면 패시브 수익이 됨", cons:"무료 경쟁 템플릿이 너무 많아서 유료 판매 진입이 어려움", recommend:false },
  { hustle_id:"figma-template", hustle_name:"피그마 템플릿", nickname:"피그마Creative Market", income_range:"10_to_30", weekly_hours:10, difficulty:4, satisfaction:4, title:"Creative Market에서 월 15만원 달러 수익", content:"Creative Market 플랫폼에 피그마 템플릿 등록했어요. 국내 플랫폼보다 글로벌 구매자가 많고 달러 결제라 환율 이득도 있어요.", pros:"글로벌 플랫폼이라 구매자 풀이 넓고 달러 수익 가능", cons:"영어로 상품 설명과 태그를 잘 써야 노출이 됨", recommend:true },
  { hustle_id:"figma-template", hustle_name:"피그마 템플릿", nickname:"UX디자이너피그마부업", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:5, title:"UX 디자이너의 자연스러운 부업", content:"본업이 UX 디자이너라 업무에서 만든 컴포넌트를 정리해서 팔아요. 추가 제작 시간이 거의 없는데 월 30만원 패시브 인컴이에요.", pros:"본업 결과물을 재활용해서 추가 시간 없이 수익 창출", cons:"회사 프로젝트 결과물은 저작권 확인이 필요함", recommend:true },

  // ────────────────────────────────────────────────
  // esim-palee (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"esim-palee", hustle_name:"E심팔이", nickname:"E심팔이여행자대상", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"해외여행자 대상으로 E심 판매 시작", content:"블로그에 해외여행 정보 올리면서 E심팔이 링크 공유해요. 여행 성수기에는 꽤 팔리는데 비수기에는 거의 없어요. 월 평균 5만원 정도예요.", pros:"해외여행 콘텐츠와 자연스럽게 연계 가능", cons:"여행 비수기에는 수요가 급격히 줄어드는 시즌성", recommend:true },
  { hustle_id:"esim-palee", hustle_name:"E심팔이", nickname:"E심팔이인스타활용", income_range:"under_10", weekly_hours:6, difficulty:2, satisfaction:3, title:"여행 인스타 계정으로 E심 판매", content:"여행 사진 올리는 인스타 계정 운영하는데 팔로워 2000명에서 E심팔이 링크 공유해요. 링크 클릭수 대비 구매 전환율이 생각보다 낮아서 아직 수익이 적어요.", pros:"여행 콘텐츠 계정이라면 자연스러운 수익화 가능", cons:"여행자들이 직접 검색해서 구매하는 경우가 많아서 전환율이 낮음", recommend:true },
  { hustle_id:"esim-palee", hustle_name:"E심팔이", nickname:"E심팔이블로그SEO", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"국가별 E심 후기 블로그로 월 12만원", content:"일본, 유럽, 동남아 E심 사용 후기를 상세하게 블로그에 올렸더니 SEO로 유입이 꾸준해요. 비교 글이 구매로 연결이 잘 돼요.", pros:"SEO로 유입되는 트래픽이 구매 전환율이 높음", cons:"나라별 후기를 직접 경험하거나 자료 조사 시간이 필요함", recommend:true },
  { hustle_id:"esim-palee", hustle_name:"E심팔이", nickname:"E심팔이유튜브연계", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:4, title:"해외여행 유튜브 채널 + E심 링크 시너지", content:"해외여행 브이로그 유튜브 채널에 E심팔이 링크 설명란에 넣었어요. 영상 조회수가 높을 때는 하루에도 몇 건씩 수익이 나요. 합쳐서 월 15만원이에요.", pros:"유튜브 채널이 있으면 시너지 효과로 수익이 자연스럽게 발생", cons:"유튜브 채널 성장이 전제 조건이라 진입 장벽이 있음", recommend:true },
  { hustle_id:"esim-palee", hustle_name:"E심팔이", nickname:"E심팔이커뮤니티활동", income_range:"under_10", weekly_hours:4, difficulty:1, satisfaction:3, title:"여행 카페에서 자연스럽게 공유해요", content:"여행 관련 카카오 오픈채팅, 네이버 카페에서 E심 관련 질문에 답변하면서 링크 공유해요. 강요 없이 자연스럽게 해야 스팸으로 안 보여요. 월 3~4만원이에요.", pros:"커뮤니티 활동 자체가 즐겁고 수익도 생기는 구조", cons:"과도한 링크 공유는 카페 규정 위반이 될 수 있음", recommend:true },
  { hustle_id:"esim-palee", hustle_name:"E심팔이", nickname:"E심팔이장단점종합", income_range:"under_10", weekly_hours:3, difficulty:1, satisfaction:3, title:"E심팔이 3개월 해본 솔직한 총평", content:"채널 없으면 수익이 거의 없고, 채널 있으면 자연스러운 부수입이 돼요. 여행 콘텐츠를 이미 하는 사람에게 추가 수익원으로 딱 좋아요. 단독으로는 힘들어요.", pros:"여행 콘텐츠 채널이 있다면 자연스러운 수익화 가능", cons:"단독 부업으로는 수익이 너무 낮음", recommend:true },

  // ────────────────────────────────────────────────
  // reelfix (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"reelfix", hustle_name:"릴픽스", nickname:"릴픽스영상편집부업", income_range:"10_to_30", weekly_hours:15, difficulty:3, satisfaction:4, title:"릴픽스로 숏폼 편집 의뢰 받아서 월 20만원", content:"릴픽스 플랫폼으로 숏폼 편집 의뢰가 들어와요. 템플릿 기반이라 편집 속도가 빠르고 의뢰당 3~5만원이에요. 영상 편집 초보도 할 수 있어요.", pros:"템플릿 기반 편집이라 초보도 빠르게 시작 가능", cons:"릴픽스 플랫폼 수수료가 있어서 실수령이 줄어듦", recommend:true },
  { hustle_id:"reelfix", hustle_name:"릴픽스", nickname:"릴픽스AI자동화", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"AI 자동화로 편집 시간을 30분으로 줄였어요", content:"릴픽스 AI 기능 활용하면 영상 한 편 편집에 30분이면 돼요. 의뢰 8건 받아서 월 20만원인데 하루 4시간이면 충분해요.", pros:"AI 기능으로 편집 속도가 비약적으로 향상됨", cons:"AI 자동 편집 퀄리티가 수동 편집보다 낮을 수 있음", recommend:true },
  { hustle_id:"reelfix", hustle_name:"릴픽스", nickname:"릴픽스멘토활동", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:5, title:"릴픽스 멘토로 활동해서 추가 수익까지", content:"릴픽스 멘토 활동을 하면 영상 제작 외에 교육 수익도 생겨요. 멘토 수당이 따로 있고 새 크리에이터 영입 시 인센티브도 있어요. 월 40만원이에요.", pros:"영상 제작 + 멘토링으로 수익 구조를 다양화 가능", cons:"멘토 자격까지 올라가려면 실적이 필요함", recommend:true },
  { hustle_id:"reelfix", hustle_name:"릴픽스", nickname:"릴픽스플랫폼의존도", income_range:"under_10", weekly_hours:6, difficulty:3, satisfaction:2, title:"플랫폼 의존도가 높아서 리스크가 있어요", content:"릴픽스 특정 플랫폼에 의존하는 구조라 플랫폼 정책이 바뀌면 수익이 급변해요. 경험과 스킬을 쌓아서 독립 프리랜서로 전환하는 걸 추천해요.", pros:"플랫폼이 초보자에게 의뢰를 연결해주는 시스템이 있음", cons:"플랫폼 의존도가 높아서 장기적 독립성이 제한될 수 있음", recommend:true },
  { hustle_id:"reelfix", hustle_name:"릴픽스", nickname:"릴픽스1석4조수익", income_range:"10_to_30", weekly_hours:10, difficulty:2, satisfaction:4, title:"영상 제작, 교육, 의뢰, 유통 4가지 수익", content:"릴픽스는 영상 직접 제작, 교육, 외부 의뢰, 영상 유통까지 4가지 수익 구조가 있어요. 처음엔 1~2가지만 하다가 익숙해지면 다 활용하면 월 20만원 됩니다.", pros:"단일 플랫폼에서 여러 수익 구조를 동시에 운영 가능", cons:"모든 구조를 활용하려면 학습 시간이 필요함", recommend:true },
  { hustle_id:"reelfix", hustle_name:"릴픽스", nickname:"릴픽스숏폼마케팅", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"소상공인 마케팅 숏폼 제작으로 월 40만원", content:"릴픽스를 통해 주변 소상공인에게 숏폼 마케팅 영상 제작 서비스를 팔아요. 한 곳당 월 15만원씩 계약하고 3곳이라 월 45만원이에요.", pros:"지역 소상공인 대상으로 안정적인 월 계약 수익 가능", cons:"영업이 필요하고 고객 유지를 위해 지속적인 퀄리티 관리 요구", recommend:true },

  // ────────────────────────────────────────────────
  // chatgpt-service (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"chatgpt-service", hustle_name:"AI 자동화 서비스", nickname:"AI자동화콘텐츠", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"AI 자동화로 블로그 대량 포스팅 서비스", content:"ChatGPT로 블로그 포스팅 자동 생성해서 의뢰자에게 납품해요. 글 50개 기준 20만원 받고, AI + 제 검수로 2~3시간이면 완성해요.", pros:"AI로 작업 속도를 극대화해서 시간 대비 수익이 높음", cons:"AI 글의 퀄리티 검수를 잘 안 하면 의뢰인 불만 위험", recommend:true },
  { hustle_id:"chatgpt-service", hustle_name:"AI 자동화 서비스", nickname:"AI업무자동화컨설팅", income_range:"50_to_100", weekly_hours:12, difficulty:4, satisfaction:5, title:"기업 업무 자동화 컨설팅으로 월 80만원", content:"소규모 기업들의 반복 업무를 ChatGPT, n8n 등으로 자동화해줘요. 한 번 컨설팅에 30~50만원이고 월 2~3건 받으면 80만원 됩니다.", pros:"AI 자동화 수요가 폭발적으로 늘고 있어서 의뢰가 많음", cons:"기술 트렌드 공부를 계속해야 해서 자기 계발 비용이 발생함", recommend:true },
  { hustle_id:"chatgpt-service", hustle_name:"AI 자동화 서비스", nickname:"AI영상자동화채널", income_range:"30_to_50", weekly_hours:6, difficulty:3, satisfaction:4, title:"AI로 유튜브 영상 자동 생성해서 월 35만원", content:"주제를 입력하면 AI가 스크립트, 영상, 썸네일까지 자동 생성해줘요. 주 5편 올리면서 채널 키우고 있어요. 월 35만원이고 시간 투자는 하루 1시간이에요.", pros:"AI 자동화로 콘텐츠 제작 시간을 극도로 단축 가능", cons:"AI 생성 콘텐츠 퀄리티가 낮으면 채널 성장이 느릴 수 있음", recommend:true },
  { hustle_id:"chatgpt-service", hustle_name:"AI 자동화 서비스", nickname:"AI번역자동화서비스", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:3, title:"AI 번역 + 검수 서비스로 월 15만원", content:"DeepL + ChatGPT 조합으로 번역하고 제가 검수하는 방식이에요. 순수 번역사보다 빠르고 단가는 좀 낮지만 의뢰가 꾸준해요.", pros:"AI 툴 조합으로 번역 속도가 비약적으로 빨라짐", cons:"AI 번역 한계로 전문 용어 오역이 생기는 경우 있음", recommend:true },
  { hustle_id:"chatgpt-service", hustle_name:"AI 자동화 서비스", nickname:"AI부업시장과열경고", income_range:"under_10", weekly_hours:10, difficulty:4, satisfaction:2, title:"AI 부업 시장이 과열돼서 경쟁이 너무 심해요", content:"작년만 해도 AI 서비스가 새로웠는데 지금은 비슷한 서비스 판매자가 넘쳐나요. 차별화 없이는 살아남기 힘든 구조가 됐어요. 조기 진입자가 유리했어요.", pros:"AI 툴 자체는 계속 발전하고 있어서 새로운 서비스 개발 가능", cons:"경쟁자가 급증해서 차별화가 점점 어려워지고 있음", recommend:false },
  { hustle_id:"chatgpt-service", hustle_name:"AI 자동화 서비스", nickname:"AI월정액서비스운영", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:5, title:"월정액 AI 자동화 서비스로 안정 수익", content:"소상공인에게 월 2만원 AI 자동화 서비스 구독으로 팔아요. 한 번 구축하면 자동으로 돌아가고 구독자 20명에 월 40만원이에요. 진짜 자동 수익이에요.", pros:"월정액 구독 모델로 안정적이고 예측 가능한 수익 구조", cons:"구독자 이탈 방지를 위해 서비스 유지 관리가 지속적으로 필요", recommend:true },

  // ────────────────────────────────────────────────
  // translation (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"translation", hustle_name:"번역 프리랜서", nickname:"번역프리랜서5년", income_range:"50_to_100", weekly_hours:20, difficulty:3, satisfaction:4, title:"번역 5년차, 안정적으로 월 70만원", content:"영어→한국어 IT 기술 번역 전문이에요. 전문 분야 특화가 핵심이에요. 일반 번역보다 단가가 2배 높고 장기 클라이언트가 생기면 안정적이에요.", pros:"전문 분야 특화하면 단가가 일반 번역보다 훨씬 높음", cons:"전문 분야 공부와 번역 퀄리티 유지에 지속적인 노력 필요", recommend:true },
  { hustle_id:"translation", hustle_name:"번역 프리랜서", nickname:"자막번역부업", income_range:"10_to_30", weekly_hours:12, difficulty:2, satisfaction:4, title:"유튜브 자막 번역으로 월 18만원", content:"유튜브 크리에이터들의 자막 번역 의뢰를 받아요. 영어, 일본어 자막 작업이 많고 분당 500~1000원 수준이에요. 재택에서 편하게 할 수 있어요.", pros:"재택에서 자유롭게 할 수 있고 의뢰가 꾸준한 편", cons:"영상 자막은 말투와 뉘앙스 번역이 어려워서 집중력이 필요", recommend:true },
  { hustle_id:"translation", hustle_name:"번역 프리랜서", nickname:"번역AI보조활용", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"AI 번역 + 검수로 속도 2배 올렸어요", content:"DeepL로 초벌 번역하고 제가 검수하는 방식으로 속도를 2배 올렸어요. 같은 시간에 2배 더 납품 가능해져서 수익도 2배가 됐어요.", pros:"AI 번역 보조 활용으로 생산성과 수익이 동시에 향상", cons:"AI 오역을 놓치면 의뢰인 신뢰를 잃을 수 있어서 검수가 중요", recommend:true },
  { hustle_id:"translation", hustle_name:"번역 프리랜서", nickname:"일본어번역수요", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"일본어 번역은 수요도 많고 단가도 높아요", content:"영어보다 일본어 번역 단가가 20% 이상 높아요. 수요도 꾸준하고 일한 능력자가 영어보다 적어서 경쟁이 덜해요. 월 40만원 안정적이에요.", pros:"일본어는 영어보다 경쟁이 적고 단가가 높은 편", cons:"일본어 실력을 유지하려면 지속적인 공부가 필요", recommend:true },
  { hustle_id:"translation", hustle_name:"번역 프리랜서", nickname:"번역초보시작", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:2, title:"처음엔 단가가 너무 낮아서 힘들어요", content:"번역 경력이 없으면 처음엔 단어당 10원 이하 저단가 의뢰밖에 못 받아요. 경력 쌓으면서 단가를 높여가야 하는데 초반이 제일 힘들어요.", pros:"경력이 쌓이면 단가가 올라가는 명확한 성장 구조", cons:"초반에 포트폴리오 없으면 저단가 의뢰만 들어오는 현실", recommend:true },

  // ────────────────────────────────────────────────
  // virtual-assistant (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"virtual-assistant", hustle_name:"가상 비서", nickname:"VA부업6개월", income_range:"10_to_30", weekly_hours:15, difficulty:2, satisfaction:4, title:"영어 VA로 해외 클라이언트 월 25만원", content:"업워크에서 영어 VA로 활동 중이에요. 이메일 정리, 일정 관리, 데이터 입력 등 단순 업무예요. 영어 되면 시간당 7~10달러 받아요.", pros:"특별한 전문 기술 없이도 시작 가능한 재택 부업", cons:"시간당 단가가 낮고 많은 시간을 투자해야 의미있는 수익", recommend:true },
  { hustle_id:"virtual-assistant", hustle_name:"가상 비서", nickname:"SNS관리VA", income_range:"30_to_50", weekly_hours:12, difficulty:2, satisfaction:4, title:"SNS 관리 VA로 월 35만원", content:"인플루언서, 소상공인 SNS 계정 관리 VA 해요. 게시물 예약, 댓글 관리, DM 답변 등 해줘요. 클라이언트 2명에 각 15만원씩 월 30만원이에요.", pros:"SNS 사용에 익숙한 사람이라면 어렵지 않게 시작 가능", cons:"클라이언트 요구가 다양해서 유연한 대응이 필요함", recommend:true },
  { hustle_id:"virtual-assistant", hustle_name:"가상 비서", nickname:"VA데이터정리", income_range:"under_10", weekly_hours:10, difficulty:1, satisfaction:3, title:"데이터 정리 VA는 단순하지만 지루해요", content:"엑셀 데이터 정리, 리서치 등 단순 업무인데 시간당 8000원 수준이에요. 어렵지는 않지만 단조로워서 집중하기 힘들어요. 시작하기는 좋아요.", pros:"어떤 기술도 필요 없어서 당장 내일부터 시작 가능", cons:"단조로운 작업이 많아서 집중력 유지가 어려움", recommend:true },
  { hustle_id:"virtual-assistant", hustle_name:"가상 비서", nickname:"전문VA고수익", income_range:"50_to_100", weekly_hours:20, difficulty:3, satisfaction:5, title:"마케팅 VA 전문화로 월 80만원", content:"일반 VA에서 디지털 마케팅 전문 VA로 포지셔닝했어요. 광고 운영, 분석 리포트까지 해주니까 단가가 일반 VA의 3배예요. 월 80만원이에요.", pros:"전문 분야 특화하면 단가가 비약적으로 올라감", cons:"마케팅 전문 지식을 별도로 공부해야 해서 진입에 시간이 걸림", recommend:true },
  { hustle_id:"virtual-assistant", hustle_name:"가상 비서", nickname:"VA클라이언트관리", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"장기 클라이언트 1명이 핵심이에요", content:"VA는 장기 클라이언트 1명만 잘 잡으면 안정적이에요. 처음엔 단기 의뢰로 신뢰 쌓고 장기 계약으로 전환하는 전략이 효과적이에요.", pros:"장기 클라이언트 확보하면 매달 안정적인 수입이 보장됨", cons:"처음에 장기 클라이언트 찾기까지 시간이 걸림", recommend:true },
  { hustle_id:"virtual-assistant", hustle_name:"가상 비서", nickname:"VA커뮤니케이션중요", income_range:"10_to_30", weekly_hours:10, difficulty:2, satisfaction:3, title:"소통이 제일 중요한 직종이에요", content:"VA는 기술보다 소통 능력이 핵심이에요. 클라이언트 요구를 정확히 이해하고 빠른 응대하면 재의뢰율이 높아요. 소통 잘 하면 단가도 올릴 수 있어요.", pros:"소통 능력이 좋으면 재의뢰율이 높아지고 안정적인 수입 가능", cons:"클라이언트 요구사항이 불분명하면 소통 피로가 쌓임", recommend:true },

  // ────────────────────────────────────────────────
  // nft (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"nft", hustle_name:"NFT 판매", nickname:"NFT아트작가", income_range:"under_10", weekly_hours:15, difficulty:5, satisfaction:2, title:"NFT 시장 침체로 수익이 사실상 0이에요", content:"2022년에 NFT 붐 때 시작했는데 지금은 거래량이 너무 줄었어요. 작품을 올려도 팔리지 않고 가스비만 나가요. 타이밍이 너무 늦었던 것 같아요.", pros:"디지털 아트를 소유권과 함께 판매하는 새로운 개념", cons:"시장이 크게 침체되어 현재 거래량이 매우 낮음", recommend:false },
  { hustle_id:"nft", hustle_name:"NFT 판매", nickname:"NFT커뮤니티활동", income_range:"under_10", weekly_hours:8, difficulty:4, satisfaction:3, title:"커뮤니티 참여가 NFT 판매의 핵심이에요", content:"NFT는 작품만 올린다고 팔리지 않아요. 디스코드, 트위터 커뮤니티 활동하면서 네트워크 쌓는 게 선행돼야 해요. 시간 투자가 엄청 필요해요.", pros:"커뮤니티가 잘 구축되면 작품 판매와 컬렉터 확보가 가능", cons:"커뮤니티 구축에 엄청난 시간과 노력이 필요함", recommend:false },
  { hustle_id:"nft", hustle_name:"NFT 판매", nickname:"NFT2021대박경험", income_range:"over_100", weekly_hours:10, difficulty:3, satisfaction:5, title:"2021년에 NFT로 1000만원 벌었어요", content:"2021년 붐 때 픽셀 아트 NFT가 며칠 만에 완판됐어요. 지금은 시장이 다르지만 그때 경험이 너무 좋았어요. 지금도 소규모로 계속하고 있어요.", pros:"NFT 상승기에는 디지털 아트로 큰 수익이 가능했음", cons:"현재 시장은 2021년과 다르고 수익 불확실성이 높음", recommend:false },
  { hustle_id:"nft", hustle_name:"NFT 판매", nickname:"NFT실용적활용", income_range:"under_10", weekly_hours:5, difficulty:4, satisfaction:3, title:"투기보다 로열티 수익 구조로 접근해요", content:"NFT의 장점인 재판매 시 로열티(5~10%)를 노리고 있어요. 한 번 팔면 다시 팔릴 때마다 수익이 들어와요. 투기성보다 이 구조가 더 가치있다고 봐요.", pros:"재판매 시 로열티 수익으로 지속적인 수익 구조 가능", cons:"처음 판매 자체가 어려워서 로열티 수익까지 오기가 힘듦", recommend:true },
  { hustle_id:"nft", hustle_name:"NFT 판매", nickname:"NFT가스비경고", income_range:"under_10", weekly_hours:3, difficulty:4, satisfaction:1, title:"민팅 가스비만 날리고 끝났어요", content:"이더리움 기반 NFT 민팅했는데 가스비가 5~10만원씩 나왔어요. 팔리지도 않는 NFT에 가스비만 수십만원 날렸어요. Polygon 같은 저렴한 체인 쓰세요.", pros:"Polygon 등 저렴한 블록체인 사용 시 가스비 부담을 줄일 수 있음", cons:"이더리움 가스비가 높아서 판매 없으면 비용만 나가는 구조", recommend:false },
  { hustle_id:"nft", hustle_name:"NFT 판매", nickname:"NFT미래전망", income_range:"under_10", weekly_hours:4, difficulty:4, satisfaction:3, title:"NFT는 다음 사이클을 기다리는 중이에요", content:"암호화폐 시장처럼 NFT도 사이클이 있어요. 지금은 침체기지만 다음 불장이 오면 다시 기회가 생길 수 있어요. 지금은 준비 단계로 포트폴리오 구축 중이에요.", pros:"다음 시장 상승기에 대비한 선행 투자 개념으로 접근 가능", cons:"언제 다음 사이클이 올지 불확실하고 그때까지 수익이 없음", recommend:false },

  // ────────────────────────────────────────────────
  // game-boosting (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"game-boosting", hustle_name:"게임 대리육성", nickname:"대리육성전업선수", income_range:"50_to_100", weekly_hours:25, difficulty:3, satisfaction:4, title:"롤 챌린저 실력으로 월 80만원 대리", content:"롤 챌린저 티어라서 골드~플래티넘 부스팅 의뢰가 계속 들어와요. 실력이 높을수록 단가가 올라요. 게임을 즐기면서 월 80만원 벌 수 있어요.", pros:"게임 실력이 뛰어나면 즐기면서 고수익 가능", cons:"윤리적 논란이 있고 계정 정지 위험도 존재함", recommend:true },
  { hustle_id:"game-boosting", hustle_name:"게임 대리육성", nickname:"대리육성법적주의", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"법적, 약관 문제 꼭 알고 시작하세요", content:"게임 대리육성은 게임사 약관 위반이에요. 계정 정지 위험이 있고 사업소득으로 반복하면 세금 신고도 해야 해요. 리스크 알고 시작해야 해요.", pros:"게임 잘 하는 사람에게는 빠른 수익 창출 가능", cons:"게임사 약관 위반으로 계정 정지 위험이 있음", recommend:false },
  { hustle_id:"game-boosting", hustle_name:"게임 대리육성", nickname:"롤코치병행", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"대리육성 대신 코칭으로 안전하게 수익", content:"직접 대리육성은 리스크가 있어서 코칭으로 전환했어요. 고객 계정이 아닌 내 계정에서 코칭하는 방식이라 정지 위험이 없어요. 월 35만원이에요.", pros:"코칭은 약관 위반 없이 합법적으로 게임 실력을 수익화 가능", cons:"코칭은 대리육성보다 고객 확보가 더 어려움", recommend:true },
  { hustle_id:"game-boosting", hustle_name:"게임 대리육성", nickname:"대리육성아이템거래", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:3, title:"게임 아이템 거래로 대리육성과 병행", content:"대리육성하면서 얻은 아이템을 거래사이트에서 팔아요. 아이템 가격이 매달 달라서 시세 파악이 중요하고 합치면 월 20만원이에요.", pros:"대리육성과 아이템 거래를 병행하면 추가 수익 창출", cons:"아이템 거래도 게임사 약관 위반인 경우가 있어서 주의 필요", recommend:true },
  { hustle_id:"game-boosting", hustle_name:"게임 대리육성", nickname:"대리육성단기집중", income_range:"10_to_30", weekly_hours:20, difficulty:2, satisfaction:3, title:"방학 때 집중해서 월 30만원 벌었어요", content:"대학생인데 방학 때만 집중해서 대리육성 해요. 의뢰 2~3건 동시에 받아서 열심히 하면 방학 2달 동안 60만원 벌 수 있어요.", pros:"방학 등 여유 시간에 집중적으로 수익을 올릴 수 있음", cons:"게임 장시간 하면 눈 피로와 생체 리듬 변화가 생김", recommend:true },
  { hustle_id:"game-boosting", hustle_name:"게임 대리육성", nickname:"게임대리플랫폼비교", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:3, title:"안전한 플랫폼 선택이 중요해요", content:"대리육성 의뢰는 부스팅 전문 사이트나 클라이언트와 직접 계약해요. 사기 의뢰인이 있어서 신뢰할 수 있는 플랫폼 이용하거나 선불 결제를 요구하는 게 안전해요.", pros:"신뢰할 수 있는 플랫폼 이용 시 사기 위험을 줄일 수 있음", cons:"의뢰인 신뢰도 확인이 어렵고 사기 의뢰가 간혹 있음", recommend:true },

  // ────────────────────────────────────────────────
  // ai-prompt (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"ai-prompt", hustle_name:"AI 프롬프트", nickname:"AI프롬프트판매첫경험", income_range:"under_10", weekly_hours:8, difficulty:3, satisfaction:3, title:"프롬프트 판매 첫 달 수익 4만원이에요", content:"ChatGPT 프롬프트 모음집을 크몽에 올렸어요. 업무 자동화, 마케팅 카피 용도 프롬프트가 잘 팔려요. 아직 초반이라 월 4만원이에요.", pros:"디지털 상품이라 재고 없고 추가 비용이 없음", cons:"AI가 발전하면서 직접 작성하는 사람이 늘어 수요가 줄어들 수 있음", recommend:true },
  { hustle_id:"ai-prompt", hustle_name:"AI 프롬프트", nickname:"미드저니프롬프트", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"Midjourney 이미지 프롬프트로 월 15만원", content:"AI 이미지 생성 프롬프트가 잘 팔려요. 특정 스타일, 분위기의 프롬프트 모음집을 5천원에 팔고 있어요. 월 30건 이상 팔리면 월 15만원이에요.", pros:"AI 이미지 생성 수요가 늘면서 좋은 프롬프트 수요도 증가", cons:"AI 모델 업데이트되면 기존 프롬프트가 작동 안 할 수 있음", recommend:true },
  { hustle_id:"ai-prompt", hustle_name:"AI 프롬프트", nickname:"프롬프트마켓비교", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:3, title:"PromptBase vs 크몽 비교해봤어요", content:"PromptBase는 영어 프롬프트라 글로벌 판매 가능하고, 크몽은 한국어 마켓이라 국내 경쟁이 덜해요. 둘 다 올리면 합쳐서 월 20만원 정도 나와요.", pros:"글로벌 + 국내 동시 판매로 수익 극대화 가능", cons:"플랫폼마다 등록 형식이 달라서 각각 최적화가 필요함", recommend:true },
  { hustle_id:"ai-prompt", hustle_name:"AI 프롬프트", nickname:"프롬프트엔지니어링전문", income_range:"30_to_50", weekly_hours:12, difficulty:4, satisfaction:4, title:"기업 대상 프롬프트 컨설팅으로 월 40만원", content:"개인 판매보다 기업 대상 맞춤 프롬프트 설계 컨설팅이 단가가 높아요. 건당 10~30만원이고 AI 도입을 원하는 기업이 늘고 있어요.", pros:"B2B 컨설팅은 개인 판매보다 단가가 훨씬 높음", cons:"기업 영업이 필요하고 납기 압박이 있는 프로젝트 형식임", recommend:true },
  { hustle_id:"ai-prompt", hustle_name:"AI 프롬프트", nickname:"프롬프트시장한계", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:2, title:"AI가 발전하면서 프롬프트 가치가 떨어지고 있어요", content:"GPT-4가 나온 후로 단순 프롬프트는 누구나 쉽게 만들어요. 예전에는 잘 팔렸는데 지금은 경쟁도 많고 구매자도 줄었어요. 시장 변화가 너무 빨라요.", pros:"초기 진입자는 빠르게 수익을 올릴 수 있었음", cons:"AI 발전으로 프롬프트의 가치가 점점 떨어지는 추세", recommend:false },

  // ────────────────────────────────────────────────
  // stock-photo (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"stock-photo", hustle_name:"스톡 사진", nickname:"스톡사진취미수익", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:4, title:"사진 취미를 스톡으로 수익화 성공", content:"여행 다니며 찍은 사진 셔터스톡에 올렸어요. 처음엔 심사 탈락 많았는데 요령 파악하니까 승인률이 높아졌어요. 월 5만원 정도 패시브 인컴이에요.", pros:"취미로 찍은 사진이 지속적인 수익을 만들어주는 구조", cons:"초반에 심사 탈락률이 높고 단가도 낮아서 수익이 느리게 쌓임", recommend:true },
  { hustle_id:"stock-photo", hustle_name:"스톡 사진", nickname:"스톡사진전문촬영", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:4, title:"음식, 라이프스타일 전문으로 월 15만원", content:"음식 스타일링, 라이프스타일 사진을 전문으로 올려요. 수요가 많은 카테고리라 심사 통과율도 높고 다운로드도 자주 돼요.", pros:"수요 많은 카테고리 특화 시 판매 빈도가 높아짐", cons:"비슷한 스타일의 경쟁 사진이 많아서 차별화가 필요", recommend:true },
  { hustle_id:"stock-photo", hustle_name:"스톡 사진", nickname:"스톡멀티플랫폼", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:4, title:"셔터스톡+어도비스톡+게티 동시 등록으로 수익 극대화", content:"같은 사진을 3개 플랫폼에 동시 올려요. 같은 노력으로 수익이 3배가 돼요. 플랫폼마다 심사 기준이 달라서 최적화가 필요해요.", pros:"동일 사진으로 여러 플랫폼에서 수익을 동시에 창출 가능", cons:"플랫폼마다 요구 사항이 달라서 각각 최적화가 필요함", recommend:true },
  { hustle_id:"stock-photo", hustle_name:"스톡 사진", nickname:"스톡1000장패시브", income_range:"30_to_50", weekly_hours:5, difficulty:3, satisfaction:5, title:"1000장 등록 후 월 30만원 완전 패시브", content:"3년에 걸쳐 1000장 등록했어요. 지금은 업로드 거의 안 해도 월 30만원이 자동으로 들어와요. 장수가 쌓일수록 수익이 늘어나는 구조예요.", pros:"장수가 쌓일수록 자동으로 수익이 증가하는 패시브 구조", cons:"1000장 등록까지 3년 이상의 꾸준한 노력과 시간이 필요", recommend:true },
  { hustle_id:"stock-photo", hustle_name:"스톡 사진", nickname:"스톡AI이미지경쟁", income_range:"under_10", weekly_hours:8, difficulty:3, satisfaction:2, title:"AI 생성 이미지에 밀려서 판매가 줄었어요", content:"AI 이미지 생성 툴이 나온 후로 스톡 사진 시장이 예전 같지 않아요. 일부 플랫폼은 AI 생성 이미지 허용해서 실사 사진 수요가 줄어들고 있어요.", pros:"실사 사진의 품질과 신뢰도는 AI 이미지보다 여전히 높음", cons:"AI 이미지 확산으로 스톡 사진 시장이 위축되고 있음", recommend:true },
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
