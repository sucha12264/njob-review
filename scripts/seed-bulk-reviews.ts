/**
 * 후기 대량 삽입 스크립트 (Part 1: SNS/콘텐츠, 제휴마케팅, 재능판매, 강의)
 * 실행: npx tsx scripts/seed-bulk-reviews.ts
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
  // youtube (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"youtube", hustle_name:"유튜브 채널 운영", nickname:"영상생활9개월", income_range:"under_10", weekly_hours:15, difficulty:4, satisfaction:3, title:"9개월째인데 아직 수익창출 조건 못 채웠어요", content:"구독자 200명, 조회수도 들쭉날쭉합니다. 영상 퀄리티보다 꾸준함이 답인 것 같은데 본업 병행이 너무 힘드네요. 롱폼 대신 쇼츠를 섞어서 올리고 있습니다.", pros:"창작의 즐거움, 나만의 브랜드 구축 가능", cons:"수익 나기까지 최소 1년 이상, 편집 시간 부담 큼", recommend:false },
  { hustle_id:"youtube", hustle_name:"유튜브 채널 운영", nickname:"테크리뷰채널", income_range:"30_to_50", weekly_hours:20, difficulty:5, satisfaction:4, title:"IT 리뷰 채널로 월 35만원 달성", content:"테크 제품 리뷰 전문 채널입니다. 구독자 5천명 넘어서면서 협찬 제의가 들어오기 시작했어요. 광고 수익보다 협찬이 훨씬 낫습니다.", pros:"협찬받은 제품으로 생활비 절감 효과도 있음", cons:"알고리즘 불안정해서 조회수 편차가 큼", recommend:true },
  { hustle_id:"youtube", hustle_name:"유튜브 채널 운영", nickname:"육아채널맘", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"육아 브이로그로 소소하게 용돈 벌어요", content:"아이 키우는 일상을 올리는데 비슷한 처지 엄마들이 많이 봐줘요. 월 15만원 정도 나오는데 편집을 간단하게 해서 부담이 적어요.", pros:"생활 기록도 되고 수익도 생기는 일석이조", cons:"아이 얼굴 노출 등 프라이버시 고민 필요", recommend:true },
  { hustle_id:"youtube", hustle_name:"유튜브 채널 운영", nickname:"부업유튜버2년차", income_range:"50_to_100", weekly_hours:25, difficulty:5, satisfaction:5, title:"2년 꾸준히 올렸더니 월 80만원 됩니다", content:"처음 6개월은 조회수 0~100이었는데 2년 버티니까 구독자 1.2만명 됐어요. 광고+협찬 합쳐서 월 80만원 정도. 편집 실력 늘수록 퀄리티도 오릅니다.", pros:"채널이 커질수록 수익이 자동으로 늘어남", cons:"초반 6~12개월은 사실상 무수익, 정신력 필요", recommend:true },
  { hustle_id:"youtube", hustle_name:"유튜브 채널 운영", nickname:"퇴근후편집러", income_range:"under_10", weekly_hours:12, difficulty:4, satisfaction:2, title:"솔직히 첫 1년은 시간 낭비일 수도", content:"편집하고 썸네일 만들고 업로드까지 영상 하나에 3~4시간씩 투자했는데 조회수는 100도 안 나왔어요. 콘텐츠 기획력이 기본이라는 걸 뒤늦게 깨달았습니다.", pros:"영상 편집 스킬이 자연스럽게 늘어남", cons:"기획력 없으면 시간만 버림, 채널 방향성이 핵심", recommend:false },
  { hustle_id:"youtube", hustle_name:"유튜브 채널 운영", nickname:"AI활용유튜버", income_range:"10_to_30", weekly_hours:6, difficulty:3, satisfaction:4, title:"AI 툴 써서 제작 시간 확 줄였어요", content:"ChatGPT로 스크립트, AI 편집 툴로 컷편집까지 자동화하니까 영상 하나 만드는 데 1시간이면 됩니다. 주 3편 올리면서 월 18만원 나오고 있어요.", pros:"AI 활용하면 진입장벽이 많이 낮아짐", cons:"AI 툴 비용이 월 3~5만원 들어가는 게 단점", recommend:true },

  // ────────────────────────────────────────────────
  // youtube-shorts (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"youtube-shorts", hustle_name:"유튜브 쇼츠", nickname:"쇼츠전문채널", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"쇼츠로 채널 노출 빠르게 늘리는 중", content:"롱폼 대신 쇼츠만 올리고 있어요. 제작 시간이 짧고 알고리즘 타면 폭발적으로 퍼집니다. 광고 수익은 롱폼보다 낮지만 유입 효과는 훨씬 좋아요.", pros:"제작 시간 짧고 알고리즘 잘 타면 빠른 성장 가능", cons:"광고 단가가 롱폼 대비 1/10 수준", recommend:true },
  { hustle_id:"youtube-shorts", hustle_name:"유튜브 쇼츠", nickname:"쇼츠3개월째", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"3개월만에 구독자 500명, 수익은 아직 극소", content:"수익창출 조건은 채웠어요. 하지만 쇼츠 수익은 진짜 낮습니다. 기대치를 낮추고 채널 키우는 용도로 접근하는 걸 추천해요.", pros:"진입장벽 낮고 스마트폰만 있으면 시작 가능", cons:"단독으로 수익화하기엔 단가가 너무 낮음", recommend:true },
  { hustle_id:"youtube-shorts", hustle_name:"유튜브 쇼츠", nickname:"요리쇼츠부업", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"퇴근 후 1시간으로 월 12만원", content:"요리 쇼츠 채널 운영 중인데 세로 촬영하고 간단히 편집해서 올리면 끝이에요. 처음 2개월은 수익 없었고 3개월부터 조금씩 들어오기 시작했습니다.", pros:"소재가 일상에서 나오고 제작 진입장벽이 낮음", cons:"인기 영상이 나와도 지속적인 성과로 이어지기 어려움", recommend:true },
  { hustle_id:"youtube-shorts", hustle_name:"유튜브 쇼츠", nickname:"해외쇼츠계정", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:5, title:"한국+일본 계정 운영해서 수익 두 배!", content:"같은 콘텐츠를 한국어/일본어 두 계정에 올리고 있어요. 합쳐서 월 40만원 정도입니다. 해외 확장하면 수익이 배수로 늘어요.", pros:"해외 계정까지 확장하면 수익 배수로 늘어남", cons:"번역 및 현지화 작업이 추가로 필요", recommend:true },
  { hustle_id:"youtube-shorts", hustle_name:"유튜브 쇼츠", nickname:"쇼츠현실6개월", income_range:"under_10", weekly_hours:15, difficulty:3, satisfaction:2, title:"6개월 했는데 수익 3만원... 현실입니다", content:"조회수 1만 넘긴 영상도 있는데 수익이 너무 적어요. 쇼츠 1만뷰에 광고 수익이 100원 수준입니다. 채널 성장 목적으로만 쓰고 다른 부업이랑 병행해야 할 것 같아요.", pros:"바이럴되면 팔로워 빠르게 모을 수 있음", cons:"단독 수익화로는 한계 명확. 다른 수익원과 병행 필수", recommend:false },

  // ────────────────────────────────────────────────
  // tiktok (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"tiktok", hustle_name:"틱톡 크리에이터", nickname:"틱톡6개월차", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:3, title:"팔로워 3천 모았는데 수익 창출이 어렵네요", content:"국내 틱톡은 크리에이터 펀드 조건이 까다롭고 수익도 낮아요. 인스타 계정이랑 연동해서 협찬을 노리는 게 현실적인 전략입니다.", pros:"알고리즘이 신규 계정에도 유리해서 빠른 팔로워 확보 가능", cons:"국내 수익화 구조가 유튜브보다 불투명함", recommend:true },
  { hustle_id:"tiktok", hustle_name:"틱톡 크리에이터", nickname:"댄스틱토커", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"팔로워 1만명 넘어서 협찬 제의 들어와요", content:"댄스 챌린지 영상 위주로 올리는데 바이럴이 몇 번 터지면서 팔로워가 빠르게 늘었어요. 뷰티 브랜드에서 협찬이 들어오기 시작해서 월 15만원 정도.", pros:"바이럴 한 번이면 팔로워가 폭발적으로 증가", cons:"트렌드를 계속 따라가야 해서 콘텐츠 기획이 피곤함", recommend:true },
  { hustle_id:"tiktok", hustle_name:"틱톡 크리에이터", nickname:"틱톡라이브도전", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:3, title:"라이브 선물 수익이 생각보다 나쁘지 않아요", content:"라이브 방송으로 코인 선물 받는 수익 구조인데 팔로워 5천명 정도에서 하루 1~2시간 방송하면 월 20만원 수준 나왔어요.", pros:"라이브 방송은 팔로워 적어도 수익 바로 발생 가능", cons:"라이브 시간 규칙적으로 유지해야 해서 체력 부담", recommend:true },
  { hustle_id:"tiktok", hustle_name:"틱톡 크리에이터", nickname:"맛집틱톡계정", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:4, title:"맛집 영상으로 월 5만원 용돈벌이", content:"맛집 다니면서 영상 올리는데 팔로워 2천명 정도에요. 지역 맛집 협찬 제의가 가끔 들어오는데 실제 돈보다는 무료 식사 혜택 위주예요.", pros:"일상 기록하면서 자연스럽게 수익화 가능", cons:"소규모 팔로워로는 금전 수익보다 혜택 위주", recommend:true },
  { hustle_id:"tiktok", hustle_name:"틱톡 크리에이터", nickname:"틱톡현실체험", income_range:"under_10", weekly_hours:20, difficulty:4, satisfaction:2, title:"시간 대비 수익이 너무 낮아요", content:"영상 기획, 촬영, 편집에 시간을 많이 쏟는데 수익이 너무 적어요. 팔로워가 최소 1만 이상 돼야 의미있는 수익이 시작됩니다. 그 전까진 비효율적인 부업이에요.", pros:"트렌드 민감하면 빠른 성장 가능", cons:"수익화까지 최소 6~12개월, 불확실성 높음", recommend:false },
  { hustle_id:"tiktok", hustle_name:"틱톡 크리에이터", nickname:"틱톡에이전시활동", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:5, title:"에이전시 통해서 안정적인 수익 만들었어요", content:"틱톡 라이브 에이전시에 가입해서 활동하니까 방송 스케줄 잡아주고 수익도 안정적으로 정산됩니다. 혼자 하는 것보다 훨씬 낫습니다.", pros:"에이전시가 수익 관리와 협찬 연결까지 지원", cons:"에이전시와 수익 배분으로 50~60%만 가져옴", recommend:true },

  // ────────────────────────────────────────────────
  // instagram-sponsor (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"instagram-sponsor", hustle_name:"인스타그램 협찬", nickname:"인스타협찬2년", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:4, title:"팔로워 8천명에 월 협찬 3건, 40만원", content:"뷰티/라이프스타일 계정 운영 중이에요. 팔로워 8천명 정도에서 매월 2~3건 협찬이 들어와요. 건당 10~20만원 수준이고 제품 협찬도 따로 들어옵니다.", pros:"현금 협찬 외에 제품 협찬으로 생활비 절감 효과도 큼", cons:"팔로워 관리와 콘텐츠 퀄리티 유지에 꾸준한 노력 필요", recommend:true },
  { hustle_id:"instagram-sponsor", hustle_name:"인스타그램 협찬", nickname:"협찬플러스후기", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"협찬플러스 앱으로 소규모 협찬 받기", content:"팔로워 500명이어도 협찬플러스 같은 앱에서 소규모 협찬 미션이 들어와요. 건당 1~3만원 수준이지만 꾸준히 하면 월 15만원 됩니다.", pros:"팔로워 적어도 시작 가능한 앱 기반 협찬 플랫폼", cons:"건당 금액이 낮아서 건수 많이 해야 의미있는 수익", recommend:true },
  { hustle_id:"instagram-sponsor", hustle_name:"인스타그램 협찬", nickname:"맛집인스타협찬", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:3, title:"맛집 계정 운영해서 레스토랑 협찬 받아요", content:"맛집 소개 계정인데 팔로워 3천명 수준에서 주변 식당에서 식사 협찬 제의가 들어와요. 현금보다 현물 위주지만 식비 절감 효과가 큽니다.", pros:"관심사를 콘텐츠화해서 혜택 받는 구조", cons:"현물 위주라 실제 현금 수입은 낮은 편", recommend:true },
  { hustle_id:"instagram-sponsor", hustle_name:"인스타그램 협찬", nickname:"인스타키우기중", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:3, title:"팔로워 1000명 달성까지 현실 과정", content:"6개월 동안 팔로워 1000명 겨우 모았어요. 협찬은 아직 없고 체험단 신청 위주로 하고 있습니다. 팔로워 1000명이 넘어야 의미있는 협찬이 시작된다고 하는데 아직 기다리는 중이에요.", pros:"꾸준히 올리다 보면 알고리즘이 도와주는 시점이 옴", cons:"초반 팔로워 확보 속도가 느려서 인내심이 많이 필요", recommend:true },
  { hustle_id:"instagram-sponsor", hustle_name:"인스타그램 협찬", nickname:"뷰티협찬전문가", income_range:"50_to_100", weekly_hours:15, difficulty:3, satisfaction:5, title:"팔로워 2만명으로 월 80만원 협찬 수익", content:"스킨케어/메이크업 계정을 2년 운영했어요. 팔로워 2만명 되니까 협찬 단가가 확 올라갔습니다. 월 4~5건 협찬에 제품까지 합치면 80만원 이상이에요.", pros:"팔로워 1만 이상이면 협찬 단가와 빈도가 확연히 달라짐", cons:"팔로워 1만 달성까지 시간과 꾸준한 노력이 필요", recommend:true },

  // ────────────────────────────────────────────────
  // naver-influencer (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"naver-influencer", hustle_name:"네이버 인플루언서", nickname:"인플루언서2년차", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"인플루언서 2년차 솔직한 수익 공개", content:"네이버 인플루언서 되고나서 애드포스트 수익이 일반 블로그보다 3배 이상 높아요. 체험단 기회도 훨씬 많이 들어옵니다. 월 20만원 꾸준히 나오고 있어요.", pros:"일반 블로그 대비 노출 우선순위 높고 체험단 기회 많음", cons:"인플루언서 조건 달성이 생각보다 까다로움", recommend:true },
  { hustle_id:"naver-influencer", hustle_name:"네이버 인플루언서", nickname:"리빙인플루언서", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:5, title:"인테리어 주제로 월 45만원 달성", content:"집 꾸미기 콘텐츠 전문으로 하니까 가구, 소품 브랜드 체험단 제의가 계속 들어와요. 직접 협찬도 받고 애드포스트도 합치면 월 40~50만원 됩니다.", pros:"전문 카테고리로 특화하면 고정 수익 창출 가능", cons:"주제를 좁혀야 해서 글감이 떨어지는 시기가 옴", recommend:true },
  { hustle_id:"naver-influencer", hustle_name:"네이버 인플루언서", nickname:"뷰티블로거3수", income_range:"under_10", weekly_hours:15, difficulty:4, satisfaction:3, title:"인플루언서 신청 탈락 두 번, 세 번째 성공", content:"처음 신청할 때 팔로워도 적고 글 퀄리티가 낮아서 두 번 탈락했어요. 3개월 더 준비하고 세 번째에 겨우 됐는데 수익은 아직 미미한 수준입니다.", pros:"한 번 인플루언서 되면 채널 브랜드 가치가 올라감", cons:"신청 조건이 까다롭고 탈락 가능성 높음", recommend:true },
  { hustle_id:"naver-influencer", hustle_name:"네이버 인플루언서", nickname:"육아맘블로거수익", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"아이 육아 일기가 수익이 될 줄 몰랐어요", content:"출산 후 육아 일기 쓰다가 인플루언서 됐어요. 분유, 유아용품 체험단이 엄청 많이 들어와서 생활비 절감 효과가 커요. 현물이 더 값어치 있더라고요.", pros:"육아 카테고리는 체험단 제의가 끊이질 않음", cons:"아이 성장하면 육아 콘텐츠 수명이 점차 줄어듦", recommend:true },
  { hustle_id:"naver-influencer", hustle_name:"네이버 인플루언서", nickname:"맛집블로거인플루", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"맛집 리뷰로 월 35만원, 식사도 공짜로", content:"맛집 카테고리로 인플루언서 됐는데 식당 체험단이 주기적으로 들어와요. 현금 수익은 월 20만원이고 무료 식사 혜택이 월 15만원 상당이에요.", pros:"현금+현물 합치면 실질 수익이 상당함", cons:"리뷰 약속 지키느라 주말마다 외식해야 하는 피로감", recommend:true },
  { hustle_id:"naver-influencer", hustle_name:"네이버 인플루언서", nickname:"신규인플루언서", income_range:"under_10", weekly_hours:6, difficulty:3, satisfaction:3, title:"인플루언서 된 지 한 달, 아직 미미해요", content:"드디어 인플루언서 됐는데 첫 달 애드포스트 수익이 3만원이에요. 기대가 너무 높았나봐요. 꾸준히 글 올리고 SEO 신경쓰면서 키워나가는 중입니다.", pros:"네이버 검색에서 일반 블로거보다 상단 노출 유리", cons:"수익 나기까지 시간이 꽤 걸림, 인내심 필요", recommend:true },

  // ────────────────────────────────────────────────
  // naver-blog (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"naver-blog", hustle_name:"네이버 블로그 애드포스트", nickname:"블로그4년운영", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"4년 운영하니까 월 40만원 안정적으로 나와요", content:"초반 2년은 월 5만원도 안 됐는데 포스팅 수가 쌓이고 SEO 실력이 늘면서 수익이 자연스럽게 올랐어요. 꾸준함이 진짜 답입니다.", pros:"글이 쌓일수록 방문자와 수익이 자동으로 늘어남", cons:"초반 2년 이상은 수익이 거의 없어서 인내심 필요", recommend:true },
  { hustle_id:"naver-blog", hustle_name:"네이버 블로그 애드포스트", nickname:"상위노출블로거", income_range:"50_to_100", weekly_hours:20, difficulty:4, satisfaction:5, title:"키워드 전략으로 월 70만원 달성", content:"상위노출 키워드 공략을 집중적으로 공부했어요. 일 방문자 2000명 넘어서면서 애드포스트+체험단 합쳐서 월 70만원 됩니다.", pros:"키워드 SEO 공부하면 수익 성장 속도가 빨라짐", cons:"저품질 글 쓰면 네이버 알고리즘 패널티 위험", recommend:true },
  { hustle_id:"naver-blog", hustle_name:"네이버 블로그 애드포스트", nickname:"초보블로거현실", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:3, title:"6개월 운영 중인데 월 3만원이에요", content:"매일 글 올리는데 방문자가 생각보다 안 늘어요. 키워드 선정을 잘못한 것 같아요. 유명 블로거들이 이미 좋은 키워드 다 차지해서 신규가 비집고 들어가기 쉽지 않습니다.", pros:"무료로 시작할 수 있고 글쓰기 실력이 늘어남", cons:"경쟁이 치열해서 새 블로그가 상위노출 되기 어려움", recommend:true },
  { hustle_id:"naver-blog", hustle_name:"네이버 블로그 애드포스트", nickname:"체험단블로거", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"체험단 위주로 하면 현물 수익이 짭짤해요", content:"애드포스트 수익보다 체험단으로 받는 제품이 더 가치있어요. 월 현금 10만원 + 제품 협찬 20만원 상당. 뷰티, 식품 체험단 위주로 신청하고 있어요.", pros:"제품 체험단 누적하면 실질 수익이 상당히 커짐", cons:"체험 의무 포스팅이 쌓이면 원하는 글을 못 쓰는 경우도 생김", recommend:true },
  { hustle_id:"naver-blog", hustle_name:"네이버 블로그 애드포스트", nickname:"IT정보블로거", income_range:"10_to_30", weekly_hours:12, difficulty:3, satisfaction:3, title:"IT 정보 블로그로 소소한 부수입", content:"스마트폰, 앱 사용법 위주로 포스팅하는데 검색 유입이 꾸준해요. 애드포스트 단가는 낮지만 방문자가 많아서 월 15만원 정도 나옵니다.", pros:"검색 수요가 있는 주제면 방문자 확보가 안정적", cons:"애드포스트 단가 자체가 낮아서 방문자 많아야 의미있음", recommend:true },

  // ────────────────────────────────────────────────
  // tistory (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"tistory", hustle_name:"티스토리 애드센스", nickname:"애드센스2년차", income_range:"30_to_50", weekly_hours:12, difficulty:4, satisfaction:4, title:"애드센스 승인 후 2년, 월 35만원 달성", content:"승인까지 3개월 걸렸고 처음엔 월 5만원이었는데 지금은 35만원이에요. 영어 키워드 공략하면 단가가 훨씬 높습니다.", pros:"영어 키워드 포스팅하면 단가가 확연히 올라감", cons:"티스토리 서비스 정책 변경 이슈가 가끔 있어서 불안함", recommend:true },
  { hustle_id:"tistory", hustle_name:"티스토리 애드센스", nickname:"워드프레스vs티스토리", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"워드프레스 대신 티스토리 선택한 이유", content:"워드프레스는 서버비가 들어가는데 티스토리는 무료라 선택했어요. 애드센스 단가는 비슷한데 관리가 훨씬 편합니다. 월 20만원 정도 나와요.", pros:"무료 플랫폼으로 서버비 없이 애드센스 가능", cons:"커스터마이징 한계가 있고 티스토리 정책 변경에 취약", recommend:true },
  { hustle_id:"tistory", hustle_name:"티스토리 애드센스", nickname:"애드센스승인고생", income_range:"under_10", weekly_hours:15, difficulty:4, satisfaction:3, title:"승인까지 5번 탈락, 결국 성공했습니다", content:"애드센스 승인이 정말 까다로워요. 글 퀄리티, 반응형 스킨, 개인정보처리방침 페이지 등 꼼꼼히 챙겨야 해요. 5번 탈락하고 6번째에 겨우 됐습니다.", pros:"한 번 승인 되면 안정적인 광고 수익 구조 완성", cons:"승인 과정이 까다롭고 탈락 시 재신청 대기 기간 있음", recommend:true },
  { hustle_id:"tistory", hustle_name:"티스토리 애드센스", nickname:"정보글티스토리", income_range:"50_to_100", weekly_hours:20, difficulty:4, satisfaction:5, title:"생활정보 블로그로 월 60만원 달성", content:"생활 꿀팁, 관공서 신청 방법 등 실용 정보 위주로 올리는데 검색 유입이 꾸준해요. 일 방문자 3000명 넘으니까 월 60만원 됩니다.", pros:"실용 정보 포스팅은 시간이 지나도 검색 유입이 꾸준함", cons:"AI 요약 검색 확대로 트래픽이 점점 줄어드는 추세", recommend:true },
  { hustle_id:"tistory", hustle_name:"티스토리 애드센스", nickname:"부업블로그초보", income_range:"under_10", weekly_hours:8, difficulty:3, satisfaction:2, title:"4개월째인데 수익 0원입니다", content:"글을 30개 올렸는데 애드센스 승인이 안 나요. 스킨도 반응형으로 바꾸고 개인정보처리방침도 달았는데 뭐가 문제인지 모르겠어요.", pros:"무료로 블로그 만들어서 시작할 수 있음", cons:"애드센스 승인 기준이 불투명하고 탈락 이유 안 알려줌", recommend:false },

  // ────────────────────────────────────────────────
  // brunch (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"brunch", hustle_name:"브런치 작가", nickname:"브런치3년작가", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:3, title:"브런치로 돈 벌기는 정말 어렵습니다", content:"3년째 브런치 작가인데 직접 수익은 거의 없어요. 외주 강의나 책 출판 제안으로 이어진 경우가 있었는데 브런치 자체 수익은 미미합니다.", pros:"글쓰기 포트폴리오로 활용 가치가 높음", cons:"직접 수익화 구조가 없어서 단독 부업으로는 부적합", recommend:false },
  { hustle_id:"brunch", hustle_name:"브런치 작가", nickname:"브런치출판연결", income_range:"under_10", weekly_hours:6, difficulty:2, satisfaction:4, title:"출판 제안 받은 후 인생이 바뀌었어요", content:"브런치에 에세이 올리다가 출판사에서 연락 왔어요. 책 계약금이 500만원이었는데 브런치 자체 수익은 0이지만 이 경로 자체가 가치있다고 생각해요.", pros:"전문 작가로 인정받는 포트폴리오 플랫폼", cons:"직접 수익은 없고 기회 연결에 시간이 걸림", recommend:true },
  { hustle_id:"brunch", hustle_name:"브런치 작가", nickname:"직장인글쓰기취미", income_range:"under_10", weekly_hours:4, difficulty:1, satisfaction:3, title:"부업보다는 자기계발용이에요", content:"글 쓰는 습관 들이려고 시작했는데 수익보다는 생각 정리에 더 도움됩니다. 온라인 강의 플랫폼에서 글쓰기 강의 제안이 와서 그건 따로 수익이 생겼어요.", pros:"글쓰기 실력 향상과 사색의 시간 확보 가능", cons:"플랫폼 자체 수익화가 전혀 안 됨", recommend:false },
  { hustle_id:"brunch", hustle_name:"브런치 작가", nickname:"책인세수익중", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:5, title:"브런치 → 책 출판 → 인세 수입까지!", content:"2년간 브런치에 꾸준히 올린 글이 책으로 출판됐어요. 인세가 분기마다 들어오는데 평균 15만원 정도. 브런치 자체는 무료지만 파생 수익이 있습니다.", pros:"좋은 글이 쌓이면 출판으로 연결되는 경우가 있음", cons:"출판까지 긴 시간과 꾸준함이 필요함", recommend:true },
  { hustle_id:"brunch", hustle_name:"브런치 작가", nickname:"취미에세이스트", income_range:"under_10", weekly_hours:3, difficulty:1, satisfaction:4, title:"수익 기대 안 하면 만족스러운 플랫폼", content:"수익 목적이 아니라 일상 에세이 올리는 공간으로 쓰고 있어요. 독자들 반응이 좋고 댓글 소통이 활발해서 만족스럽습니다. 돈은 못 버는 대신 글 실력은 늡니다.", pros:"진지한 독자층과 깊은 소통이 가능한 플랫폼", cons:"직접 수익이 없어서 순수 취미 활동으로만 가능", recommend:false },
  { hustle_id:"brunch", hustle_name:"브런치 작가", nickname:"강의홍보채널활용", income_range:"10_to_30", weekly_hours:5, difficulty:2, satisfaction:4, title:"강의 홍보 채널로 활용해서 간접수익", content:"온라인 글쓰기 강의를 운영하면서 브런치를 홍보 채널로 써요. 직접 수익은 없지만 수강생 유입 창구가 돼서 간접적으로 월 20만원 이상 수익에 기여합니다.", pros:"타 수익 채널과 연계 시 시너지 효과 큼", cons:"독립적인 수익원으로는 불완전함", recommend:true },

  // ────────────────────────────────────────────────
  // newsletter (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"newsletter", hustle_name:"뉴스레터", nickname:"IT뉴스레터6개월", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"구독자 500명에 월 15만원 수익", content:"IT 트렌드 뉴스레터 운영 중인데 서브스택 유료 구독 50명 정도에서 월 15만원 나와요. 콘텐츠 퀄리티 유지가 핵심입니다.", pros:"구독자가 고정 팬층이라 안정적인 수익 기반", cons:"매주 발행 부담이 있고 구독자 이탈 관리가 필요", recommend:true },
  { hustle_id:"newsletter", hustle_name:"뉴스레터", nickname:"재테크뉴스레터운영", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:5, title:"경제/투자 뉴스레터로 월 45만원", content:"직장 다니면서 투자 정보 큐레이팅해서 뉴스레터 발행해요. 유료 구독자 150명 정도에 월 45만원. 이메일 마케팅 이해하면 수익화가 빠릅니다.", pros:"전문 지식이 있으면 빠르게 수익 구조 만들 수 있음", cons:"경쟁 뉴스레터가 많아서 차별화 전략이 필수", recommend:true },
  { hustle_id:"newsletter", hustle_name:"뉴스레터", nickname:"구독자모으기중", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:3, title:"3개월 운영 중인데 구독자 늘리기 힘들어요", content:"무료 뉴스레터로 시작했는데 구독자 모으는 게 생각보다 훨씬 어려워요. SNS 마케팅 병행해야 한다는 걸 뒤늦게 깨달았어요.", pros:"발행 자유도가 높고 시작 비용 거의 없음", cons:"구독자 없으면 수익도 없음. 초기 마케팅이 필수", recommend:false },
  { hustle_id:"newsletter", hustle_name:"뉴스레터", nickname:"B2B광고뉴스레터", income_range:"50_to_100", weekly_hours:15, difficulty:4, satisfaction:5, title:"기업 광고 협찬으로 월 70만원", content:"스타트업 생태계 관련 뉴스레터인데 구독자 2천명 넘어서 기업 광고 제의가 들어옵니다. 회당 광고 15만원씩 월 4~5개 받으면 월 70만원 수준이에요.", pros:"특정 분야 전문성이 있으면 기업 광고 단가가 높음", cons:"구독자 2천명 이상이 되어야 광고 제의가 오기 시작", recommend:true },
  { hustle_id:"newsletter", hustle_name:"뉴스레터", nickname:"스티비뉴스레터초보", income_range:"under_10", weekly_hours:6, difficulty:2, satisfaction:3, title:"스티비로 쉽게 시작했는데 수익화가 관문", content:"스티비 플랫폼이 한국어 뉴스레터 발행하기는 편리해요. 구독자 150명인데 유료 전환이 어려워요. 300명은 돼야 유료 가입자가 생길 것 같아요.", pros:"스티비, 서브스택 등 발행 도구가 사용하기 쉬움", cons:"유료 전환율이 낮아서 구독자 수가 충분해야 함", recommend:true },
  { hustle_id:"newsletter", hustle_name:"뉴스레터", nickname:"AI반자동화발행", income_range:"30_to_50", weekly_hours:4, difficulty:2, satisfaction:5, title:"AI로 반자동화해서 효율적으로 수익", content:"GPT로 초안 잡고 제가 편집하는 방식으로 발행 시간을 절반으로 줄였어요. 주 2회 발행하면서 월 40만원 나오는데 시간 대비 효율이 좋아요.", pros:"AI 자동화로 발행 부담을 크게 줄일 수 있음", cons:"AI 콘텐츠 품질 체크 안 하면 신뢰도 하락 위험", recommend:true },

  // ────────────────────────────────────────────────
  // threads (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"threads", hustle_name:"스레드 운영", nickname:"스레드마케터", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"스레드로 팔로워 모으기는 쉬운데 수익화가...", content:"텍스트 중심 플랫폼이라 진입장벽이 낮아요. 팔로워 800명인데 수익으로 이어지는 구조가 아직 불명확합니다. 제휴 링크 공유로 소액 발생 중이에요.", pros:"텍스트 위주라 제작 부담이 낮고 빠르게 글 올릴 수 있음", cons:"수익화 방법이 간접적이라 단독으로는 효율 낮음", recommend:false },
  { hustle_id:"threads", hustle_name:"스레드 운영", nickname:"재테크스레드계정", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:4, title:"재테크 정보로 팔로워 1천명 → 제휴수익 발생", content:"매일 재테크 팁 하나씩 올리는 계정인데 팔로워 1100명 됐어요. 제휴 링크 공유해서 월 12만원 수준 수익 나고 있어요.", pros:"전문성 있는 정보면 팔로워가 빠르게 모임", cons:"팔로워 규모 대비 수익화 효율이 낮은 편", recommend:true },
  { hustle_id:"threads", hustle_name:"스레드 운영", nickname:"스레드일상기록", income_range:"under_10", weekly_hours:3, difficulty:1, satisfaction:3, title:"수익보다 소통 목적으로 쓰세요", content:"인스타그램이랑 연동돼서 시작했는데 수익보다는 커뮤니티 느낌이 강해요. 팔로워 모으는 부업으로는 괜찮지만 단독 수익화는 한계가 있습니다.", pros:"인스타그램과 연동 관리가 용이함", cons:"독자적인 수익 구조가 없어서 다른 채널과 연계 필요", recommend:false },
  { hustle_id:"threads", hustle_name:"스레드 운영", nickname:"브랜딩스레드활용", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:4, title:"개인 브랜딩 채널로 활용해 강의 수익 연결", content:"스레드에서 마케팅 팁 올리다 보니 온라인 강의 수강생이 스레드에서 유입되기 시작했어요. 간접 수익이 월 20만원 정도예요.", pros:"개인 브랜딩 채널로 다른 수익원과 시너지 효과", cons:"직접 수익 없이 트래픽 생성 역할에 그침", recommend:true },
  { hustle_id:"threads", hustle_name:"스레드 운영", nickname:"스레드첫협찬", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"팔로워 2천명 넘어서 소규모 협찬 제의 왔어요", content:"스레드 계정으로 첫 협찬 제의를 받았는데 금액이 5만원이었어요. 기대보다 낮지만 계정 방향성에 맞는 브랜드라서 수락했습니다.", pros:"팔로워 2천 이상이면 소규모 협찬 가능성 있음", cons:"협찬 단가가 유튜브나 인스타보다 훨씬 낮음", recommend:true },
  { hustle_id:"threads", hustle_name:"스레드 운영", nickname:"멀티SNS운영자", income_range:"10_to_30", weekly_hours:4, difficulty:1, satisfaction:4, title:"5개 계정 운영 중 하나로 관리하는 채널", content:"여러 SNS 중 하나로 관리하고 있어요. 스레드만으로는 부족하지만 다른 채널들이랑 묶어서 통합 패키지 협찬으로 제안하면 수익이 괜찮습니다.", pros:"다른 SNS 계정과 번들 협찬 제안 시 시너지 큼", cons:"단독으로는 수익화 한계 명확", recommend:true },

  // ────────────────────────────────────────────────
  // coupang-partners (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"coupang-partners", hustle_name:"쿠팡파트너스", nickname:"쿠팡파트너스1년차", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:4, title:"블로그 방문자 300명으로 월 12만원", content:"일 방문자 300명 수준인데 구매 전환율 좋은 키워드로 글 쓰면 의외로 수익이 나요. 쿠팡 수요가 높은 계절 상품 위주로 공략하고 있습니다.", pros:"구매 전환율이 높고 정산이 빠른 편", cons:"쿠팡 정책 변경 시 수수료 조건이 달라질 수 있음", recommend:true },
  { hustle_id:"coupang-partners", hustle_name:"쿠팡파트너스", nickname:"릴스쿠팡활용", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:4, title:"릴스 영상에 링크 넣어서 월 40만원", content:"인스타그램 릴스 영상에 쿠팡 링크 공유하는 방식으로 운영해요. 팔로워 1만명 수준에서 월 35~40만원 나와요. 영상 조회수가 많은 날은 하루에 10만원도 나옵니다.", pros:"릴스 + 쿠팡파트너스 조합이 현재 가장 효율적인 구조", cons:"릴스 영상 트렌드를 계속 따라가야 하는 부담", recommend:true },
  { hustle_id:"coupang-partners", hustle_name:"쿠팡파트너스", nickname:"첫수익492원", income_range:"under_10", weekly_hours:4, difficulty:1, satisfaction:4, title:"첫 수익 492원인데 이게 진짜 신기해요", content:"처음 수익이 492원이었는데 너무 신기했어요. 내 링크를 통해 실제로 누군가 구매했다는 게요. 수익은 작아도 구조를 이해하니까 앞으로 키울 수 있겠다는 자신감이 생겼습니다.", pros:"시작 비용 0원이고 가입 조건이 거의 없음", cons:"초반에는 트래픽이 없어서 수익이 극소로 작음", recommend:true },
  { hustle_id:"coupang-partners", hustle_name:"쿠팡파트너스", nickname:"유튜브쿠팡조합", income_range:"50_to_100", weekly_hours:15, difficulty:3, satisfaction:5, title:"유튜브 채널에 쿠팡 링크 넣어서 월 80만원", content:"제품 리뷰 유튜브 채널 운영하면서 쿠팡 파트너스 링크를 설명란에 넣어요. 구독자 2만명 수준에서 월 80만원 이상 나와요. 영상 조회수가 높을 때는 더 많이 나옵니다.", pros:"유튜브 채널 규모가 클수록 수익이 폭발적으로 늘어남", cons:"유튜브 채널 성장이 전제 조건이라 진입 장벽이 높음", recommend:true },
  { hustle_id:"coupang-partners", hustle_name:"쿠팡파트너스", nickname:"파트너스현실직시", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:2, title:"블로그 방문자 없으면 의미없어요", content:"아무 기반 없이 블로그 개설하고 파트너스 링크 달았는데 4개월째 수익 총 3000원이에요. 트래픽이 없으면 링크가 있어도 의미가 없다는 걸 깨달았습니다.", pros:"무료로 시작 가능하고 복잡한 과정이 없음", cons:"기반 채널 없이 시작하면 사실상 수익 없음", recommend:false },

  // ────────────────────────────────────────────────
  // linkprice (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"linkprice", hustle_name:"링크프라이스", nickname:"링크프라이스1년", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"쿠팡파트너스 대안으로 괜찮아요", content:"쿠팡에 없는 브랜드들이 링크프라이스에 많이 있어요. 여행, 보험, 금융 카테고리 단가가 높아서 쿠팡파트너스랑 병행하고 있습니다. 합쳐서 월 20만원이에요.", pros:"쿠팡파트너스보다 다양한 분야 브랜드와 협력 가능", cons:"쿠팡보다 전환율이 낮고 정산 주기가 느림", recommend:true },
  { hustle_id:"linkprice", hustle_name:"링크프라이스", nickname:"여행블로거링크", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:4, title:"여행 블로그에서 항공권, 호텔 링크로 월 35만원", content:"여행 정보 블로그 운영하는데 링크프라이스의 항공권, 숙박 제휴가 단가가 높아요. 성수기에는 월 50만원 이상 나오는 때도 있어요.", pros:"여행 카테고리는 구매금액이 커서 커미션도 높음", cons:"시즌성이 강해서 비수기에 수익이 확 줄어듦", recommend:true },
  { hustle_id:"linkprice", hustle_name:"링크프라이스", nickname:"보험링크특화", income_range:"50_to_100", weekly_hours:10, difficulty:3, satisfaction:5, title:"보험 비교 콘텐츠로 월 70만원 달성", content:"보험 비교 정보 블로그인데 링크프라이스 보험 제휴 단가가 건당 2~5만원이에요. 월 방문자 5천명 수준에서 월 70만원 됩니다.", pros:"보험, 금융 카테고리는 단가가 매우 높음", cons:"E-A-T(전문성) 기준이 높아서 전문 분야가 필요", recommend:true },
  { hustle_id:"linkprice", hustle_name:"링크프라이스", nickname:"링크프라이스초보", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:3, title:"가입 자체는 쉬운데 승인 브랜드 고르기가 핵심", content:"링크프라이스 가입은 쉬운데 어떤 브랜드 제휴를 선택하느냐가 수익을 결정해요. 단가 낮은 브랜드만 고르면 아무리 해도 수익이 안 나요.", pros:"다양한 카테고리의 브랜드를 선택할 수 있는 자유도", cons:"브랜드별 수수료 차이가 크고 초보자는 선택이 어려움", recommend:true },
  { hustle_id:"linkprice", hustle_name:"링크프라이스", nickname:"제휴마케팅병행", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:3, title:"쿠팡+링크프라이스 병행하니 안정적이에요", content:"쿠팡파트너스만 했을 때는 수익이 불안정했는데 링크프라이스를 추가하니 더 안정됐어요. 합쳐서 월 25만원 정도 꾸준히 나오고 있습니다.", pros:"여러 제휴 플랫폼 병행 시 수익이 안정됨", cons:"각 플랫폼 조건과 정책을 따로 공부해야 함", recommend:true },

  // ────────────────────────────────────────────────
  // tenping (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"tenping", hustle_name:"텐핑", nickname:"텐핑6개월도전", income_range:"under_10", weekly_hours:15, difficulty:3, satisfaction:2, title:"6개월 해봤는데 기반 없으면 힘들어요", content:"자연스럽게 광고 노출하는 방식으로는 수익이 정말 낮아요. 클릭당 단가도 낮고 심사도 까다로워서 실망했습니다. 블로그 방문자가 많아야 의미있어요.", pros:"가입 조건이 없어서 시작은 쉬움", cons:"블로그 방문자 없으면 수익이 사실상 0", recommend:false },
  { hustle_id:"tenping", hustle_name:"텐핑", nickname:"블로거텐핑병행", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"블로그 방문자 일 500명이면 월 8만원", content:"일 방문자 500명 수준에서 텐핑 광고 달았더니 월 7~8만원 나왔어요. 단독으로는 부족하지만 애드포스트랑 같이 운영하면 나쁘지 않아요.", pros:"애드포스트와 함께 운영하면 수익 보완 효과", cons:"트래픽이 없으면 무의미한 수익", recommend:true },
  { hustle_id:"tenping", hustle_name:"텐핑", nickname:"텐핑고수등급달성", income_range:"30_to_50", weekly_hours:10, difficulty:3, satisfaction:4, title:"고수 등급 달성 후 수익이 달라졌어요", content:"텐핑 고수 등급 달성했더니 단가가 올라갔어요. 초반 3개월 동안 열심히 해서 최고수 빠르게 달았더니 수익이 달라졌습니다. 현재 월 35만원이에요.", pros:"등급 올라갈수록 단가와 노출 기회 확실히 증가", cons:"초반 저수익 기간을 버텨야 하는 인내심 필요", recommend:true },
  { hustle_id:"tenping", hustle_name:"텐핑", nickname:"인스타텐핑활용", income_range:"10_to_30", weekly_hours:5, difficulty:2, satisfaction:4, title:"인스타그램에 텐핑 링크 공유해서 수익", content:"블로그가 아닌 인스타그램에서 자연스럽게 소개하는 방식으로 운영 중이에요. 팔로워 3천명 수준에서 월 12만원 정도 나옵니다.", pros:"SNS 팔로워 있으면 블로그 없이도 가능", cons:"SNS에서 광고성 게시물은 팔로워 이탈 위험", recommend:true },
  { hustle_id:"tenping", hustle_name:"텐핑", nickname:"텐핑3개월포기", income_range:"under_10", weekly_hours:10, difficulty:3, satisfaction:1, title:"3개월 만에 포기했습니다. 시간 낭비예요", content:"블로그 방문자도 없고 SNS도 팔로워 적은 상태에서 시작했는데 3개월 수익이 총 1500원이었어요. 기반이 없으면 시작도 하지 마세요.", pros:"무료로 시작 가능한 진입장벽", cons:"기반 채널 없으면 사실상 수익 0. 선행 조건이 핵심", recommend:false },
  { hustle_id:"tenping", hustle_name:"텐핑", nickname:"카카오채널텐핑", income_range:"10_to_30", weekly_hours:6, difficulty:2, satisfaction:3, title:"카카오채널이랑 병행하니까 나쁘지 않아요", content:"카카오 채널 구독자 500명에서 텐핑 링크 공유하는 방식으로 운영해요. 월 10만원 정도인데 다른 채널과 병행하면 꽤 쓸 만합니다.", pros:"카카오, 밴드 등 다양한 플랫폼에서 활용 가능", cons:"주력 채널이 없으면 효과가 분산됨", recommend:true },

  // ────────────────────────────────────────────────
  // amazon-associates (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"amazon-associates", hustle_name:"아마존 어소시에이트", nickname:"영어블로그부업", income_range:"10_to_30", weekly_hours:15, difficulty:4, satisfaction:4, title:"영어 블로그로 아마존 어소시에이트 월 20만원", content:"영어로 제품 리뷰 블로그 운영 중인데 미국 독자 대상이라 커미션이 높아요. 처음에 영어 콘텐츠 만들기가 힘들었지만 3개월 후부터 수익 발생했습니다.", pros:"달러 수입이라 환율 혜택이 있음", cons:"영어 콘텐츠 작성이 부담이고 SEO 경쟁이 치열함", recommend:true },
  { hustle_id:"amazon-associates", hustle_name:"아마존 어소시에이트", nickname:"한국아마존부업", income_range:"under_10", weekly_hours:8, difficulty:3, satisfaction:2, title:"한국에서 아마존 어소시에이트는 힘들어요", content:"한국어 블로그에 아마존 링크 달았는데 한국 독자들이 아마존에서 직구하는 비율이 낮아서 수익이 거의 없어요. 글로벌 독자층이 없으면 비추합니다.", pros:"글로벌 상품 다루면 제휴 수익 범위가 넓음", cons:"한국 독자만 대상이면 전환율이 극히 낮음", recommend:false },
  { hustle_id:"amazon-associates", hustle_name:"아마존 어소시에이트", nickname:"직구정보블로거", income_range:"30_to_50", weekly_hours:12, difficulty:4, satisfaction:4, title:"직구 정보 블로그로 아마존 수익 월 35만원", content:"아마존 직구 방법, 미국 블랙프라이데이 정보 블로그 운영 중이에요. 이미 직구에 관심있는 독자들이라 전환율이 높습니다. 11월이 최대 수익 달이에요.", pros:"직구 정보 특화하면 전환율이 일반 쇼핑보다 높음", cons:"블랙프라이데이 등 시즌 편향이 심함", recommend:true },
  { hustle_id:"amazon-associates", hustle_name:"아마존 어소시에이트", nickname:"테크영어리뷰어", income_range:"10_to_30", weekly_hours:20, difficulty:5, satisfaction:4, title:"미국 IT 제품 리뷰로 달러 수익 창출 중", content:"스마트폰, 노트북 영어 리뷰 블로그인데 구글 SEO로 월 방문자 1만명 달성하니까 수익이 안정됐어요. 영어와 SEO 능력이 핵심입니다.", pros:"달러 수익 + 구글 SEO 트래픽으로 안정적 수익 가능", cons:"SEO 경쟁이 매우 치열하고 콘텐츠 퀄리티 기준도 높음", recommend:true },
  { hustle_id:"amazon-associates", hustle_name:"아마존 어소시에이트", nickname:"아마존계정주의사항", income_range:"under_10", weekly_hours:6, difficulty:3, satisfaction:3, title:"처음 시작하는 분들 현실 알고 시작하세요", content:"가입 자체는 쉬운데 수익 창출까지 진짜 오래 걸려요. 첫 3개월 기다리다 보면 계정 비활성화 될 수도 있어서 초반에 빠르게 판매 실적 만들어야 합니다.", pros:"글로벌 제휴마케팅 시스템이 체계적으로 잘 되어있음", cons:"초기 90일 내 판매 실적 없으면 계정 해지 위험", recommend:true },
  { hustle_id:"amazon-associates", hustle_name:"아마존 어소시에이트", nickname:"세금신고아마존", income_range:"10_to_30", weekly_hours:10, difficulty:4, satisfaction:3, title:"W-8BEN 세금 양식 처음엔 정말 복잡해요", content:"아마존 수익 받으려면 W-8BEN 양식 제출해야 하는데 처음에 복잡해서 한참 걸렸어요. 연간 수익 발생하면 종합소득세 신고도 해야 합니다.", pros:"달러로 받아서 환전 시 추가 수익 가능", cons:"세금 처리가 복잡하고 한국 종합소득세 신고도 필요", recommend:true },

  // ────────────────────────────────────────────────
  // ilikepick (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"ilikepick", hustle_name:"아이라이크픽", nickname:"크픽3개월후기", income_range:"under_10", weekly_hours:8, difficulty:2, satisfaction:3, title:"크라우드픽에서 처음 판매됐을 때 정말 신기했어요", content:"일러스트 그려서 올렸는데 3개월 만에 첫 판매가 됐어요. 건당 500원 수준이라 큰 돈은 아니지만 내 그림이 팔린다는 게 신기합니다.", pros:"내 그림이 지속적으로 수익을 만들어주는 구조", cons:"건당 수익이 낮아서 많은 작품을 올려야 의미있음", recommend:true },
  { hustle_id:"ilikepick", hustle_name:"아이라이크픽", nickname:"미캔기여자활동", income_range:"under_10", weekly_hours:5, difficulty:2, satisfaction:4, title:"미리캔버스 기여자로 소소하게 용돈벌기", content:"미리캔버스에 디자인 소스 올리는 기여자로 활동 중이에요. 건당 수익은 작지만 한 번 올려두면 계속 팔리는 구조라 패시브 인컴으로 괜찮아요.", pros:"한 번 올리면 지속적으로 판매되는 패시브 수익", cons:"초반에 판매까지 시간이 걸리고 건당 단가가 낮음", recommend:true },
  { hustle_id:"ilikepick", hustle_name:"아이라이크픽", nickname:"스톡아이콘판매", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:3, title:"아이콘, 벡터 소스로 월 15만원", content:"아이콘 세트나 벡터 그래픽 위주로 올리고 있어요. 퀄리티 좋은 세트 하나가 꾸준히 팔리면 월 15만원 정도 나옵니다. 소스가 쌓일수록 수익도 늘어요.", pros:"퀄리티 좋은 소스 한 개가 장기간 수익 창출", cons:"경쟁이 많아서 차별화된 디자인이 아니면 판매가 안 됨", recommend:true },
  { hustle_id:"ilikepick", hustle_name:"아이라이크픽", nickname:"다중플랫폼등록", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:4, title:"크픽+셔터스톡+어도비스톡 동시 등록으로 수익 극대화", content:"같은 소스를 여러 플랫폼에 등록했어요. 국내는 크라우드픽, 해외는 셔터스톡에 올리니까 합쳐서 월 20만원 정도 나옵니다.", pros:"동일 소스로 여러 플랫폼에서 수익 창출 가능", cons:"플랫폼마다 등록 조건이 달라서 관리가 번거로움", recommend:true },
  { hustle_id:"ilikepick", hustle_name:"아이라이크픽", nickname:"크픽승인탈락경험", income_range:"under_10", weekly_hours:6, difficulty:3, satisfaction:2, title:"등록 심사가 까다로워서 탈락이 많아요", content:"업로드했는데 심사에서 탈락되는 소스가 절반 이상이에요. 품질 기준이 생각보다 높고 비슷한 소스는 중복 심사에서 걸러져요.", pros:"심사 통과하면 그만큼 퀄리티 보장이 된다는 의미", cons:"심사 탈락률이 높아서 초보자는 시행착오가 많음", recommend:true },
  { hustle_id:"ilikepick", hustle_name:"아이라이크픽", nickname:"디자이너패시브인컴", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:5, title:"디자이너라면 추천하는 패시브 인컴", content:"디자이너로 일하면서 퇴근 후 소스 등록하고 있어요. 소스가 300개 넘어서면서 월 40만원 정도 꾸준히 나오기 시작했습니다. 한 번 올리면 계속 들어오는 게 매력이에요.", pros:"업무에서 만든 소스를 재활용해서 수익화 가능", cons:"300개 이상 등록까지 상당한 시간과 노력 필요", recommend:true },

  // ────────────────────────────────────────────────
  // kmong (5→8, need 3)
  // ────────────────────────────────────────────────
  { hustle_id:"kmong", hustle_name:"크몽", nickname:"크몽디자인전문", income_range:"50_to_100", weekly_hours:20, difficulty:3, satisfaction:5, title:"디자인 전문으로 월 80만원 달성", content:"로고, 상세페이지 디자인 전문으로 크몽에서 활동한 지 1년 됐어요. 처음엔 저단가 서비스로 후기 쌓고 지금은 건당 30만원 이상 받아요. 월 80만원 안정적입니다.", pros:"후기가 쌓이면 단가 올릴 수 있고 재구매 고객 생김", cons:"초반에 저단가로 후기 쌓는 기간이 힘듦", recommend:true },
  { hustle_id:"kmong", hustle_name:"크몽", nickname:"크몽번역프리랜서", income_range:"30_to_50", weekly_hours:12, difficulty:2, satisfaction:4, title:"영한 번역으로 크몽에서 꾸준한 수익", content:"영어 번역 서비스 올려두니까 꾸준히 의뢰가 들어와요. 건당 3~10만원 수준이고 월 35만원 정도. 번역 속도가 빠르면 그만큼 수익도 늘어요.", pros:"번역 실력만 있으면 별도 장비 없이 바로 시작 가능", cons:"단가 낮은 의뢰인도 많아서 처음엔 선별이 힘듦", recommend:true },
  { hustle_id:"kmong", hustle_name:"크몽", nickname:"크몽부업현실직시", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:3, title:"시작 3개월, 월 20만원 수준", content:"크몽 시작한 지 3개월인데 아직 후기가 5개밖에 없어서 의뢰가 자주 안 들어와요. 후기 수가 수익에 직접적인 영향을 미치는 구조입니다. 초반 인내심이 핵심이에요.", pros:"전문 기술이 있으면 플랫폼 활용이 비교적 쉬움", cons:"후기 적은 신규 판매자는 의뢰 확보가 어려움", recommend:true },

  // ────────────────────────────────────────────────
  // soomgo (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"soomgo", hustle_name:"숨고", nickname:"숨고PT강사부업", income_range:"50_to_100", weekly_hours:15, difficulty:3, satisfaction:5, title:"PT 강사로 숨고 통해 월 70만원 추가 수입", content:"본업 헬스 트레이너인데 숨고로 개인 PT 부업을 시작했어요. 플랫폼 수수료 15% 내고도 월 70만원 이상 나와요. 고객 후기가 쌓이면서 단가도 올렸습니다.", pros:"기술직은 시간당 단가가 높아서 수익 효율이 좋음", cons:"초반에 첫 고객 확보가 어렵고 후기가 없으면 불리함", recommend:true },
  { hustle_id:"soomgo", hustle_name:"숨고", nickname:"숨고번역의뢰경험", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"번역 서비스로 소소하게 월 18만원", content:"숨고에서 번역 의뢰 받는데 크몽이랑 비교하면 단가는 비슷한데 의뢰 빈도가 좀 낮아요. 두 플랫폼을 병행하는 게 좋을 것 같아요.", pros:"플랫폼 수수료가 크몽보다 낮아서 실수령액이 높음", cons:"크몽 대비 의뢰 건수가 적은 편", recommend:true },
  { hustle_id:"soomgo", hustle_name:"숨고", nickname:"숨고레슨부업", income_range:"30_to_50", weekly_hours:10, difficulty:2, satisfaction:4, title:"피아노 레슨으로 숨고 통해 학생 모집", content:"피아노 레슨을 숨고에서 학생 모집해서 하고 있어요. 지역 기반 의뢰라 주변 학생들 연결이 잘 돼요. 월 40만원 정도 추가 수입이에요.", pros:"지역 기반 의뢰라 원하는 시간대에 맞춰 조율 가능", cons:"이동 시간이 들어가고 학생 관리가 필요함", recommend:true },
  { hustle_id:"soomgo", hustle_name:"숨고", nickname:"숨고초보시작법", income_range:"under_10", weekly_hours:5, difficulty:3, satisfaction:3, title:"처음 3일에 첫 수주, 생각보다 빨랐어요", content:"프로필 잘 만들고 서비스 등록 3일 만에 첫 의뢰가 들어왔어요. 초반에 약간 저렴하게 가격 설정한 게 도움이 된 것 같아요. 첫 달 10만원이에요.", pros:"서비스 등록 후 비교적 빠르게 첫 의뢰 들어오는 경우 있음", cons:"초반에 저단가 서비스로 경쟁해야 하는 부담", recommend:true },
  { hustle_id:"soomgo", hustle_name:"숨고", nickname:"숨고월수입공개", income_range:"30_to_50", weekly_hours:12, difficulty:3, satisfaction:4, title:"디자인 의뢰로 주말 부업 월 35만원", content:"금요일 저녁과 주말 오전에만 작업하는데 월 35만원 정도 나와요. 플랫폼 수수료 15% 제하고도 본업 대비 추가 수입으로 만족스러운 수준입니다.", pros:"시간 조율이 자유롭고 원하는 의뢰만 선택 가능", cons:"플랫폼 수수료 15%가 수익에서 빠지는 게 아쉬움", recommend:true },

  // ────────────────────────────────────────────────
  // wishket (3→8, need 5)
  // ────────────────────────────────────────────────
  { hustle_id:"wishket", hustle_name:"위시켓", nickname:"위시켓개발자부업", income_range:"over_100", weekly_hours:20, difficulty:3, satisfaction:5, title:"개발자라면 위시켓이 가장 효율적인 부업", content:"풀스택 개발자인데 위시켓으로 프로젝트 받으면 월 150만원 이상 나와요. 단 기술 스택이 명확해야 하고 포트폴리오가 있어야 의뢰가 들어옵니다.", pros:"기술직은 단가가 매우 높아서 시간 대비 수익 최상", cons:"프로젝트 마감 압박이 있고 본업과 병행이 힘들 수 있음", recommend:true },
  { hustle_id:"wishket", hustle_name:"위시켓", nickname:"위시켓마케터경험", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"디지털 마케팅 프리랜서로 월 40만원", content:"본업이 마케터인데 위시켓에서 SNS 광고 운영, 콘텐츠 기획 의뢰를 받아요. 건당 30~50만원 수준이고 한 달에 1~2건이면 충분합니다.", pros:"본업 경험을 활용할 수 있어서 추가 학습 부담이 낮음", cons:"클라이언트 요구사항이 복잡한 경우 야근 위험", recommend:true },
  { hustle_id:"wishket", hustle_name:"위시켓", nickname:"위시켓초보프리랜서", income_range:"under_10", weekly_hours:10, difficulty:4, satisfaction:2, title:"포트폴리오 없으면 제안서 통과가 안 돼요", content:"위시켓에서 프로젝트 지원했는데 포트폴리오가 부족해서 계속 탈락했어요. 먼저 크몽 같은 소액 의뢰로 포트폴리오 쌓고 위시켓으로 오는 걸 추천해요.", pros:"프로젝트 규모가 커서 한 건에 수익이 상당함", cons:"포트폴리오 없으면 프로젝트 수주 거의 불가능", recommend:false },
  { hustle_id:"wishket", hustle_name:"위시켓", nickname:"위시켓기획자부업", income_range:"50_to_100", weekly_hours:18, difficulty:4, satisfaction:4, title:"UX 기획자로 위시켓 프로젝트 월 80만원", content:"UX 기획 프리랜서로 위시켓에서 프로젝트 3개월에 1~2개씩 수주해요. 건당 100~200만원 수준이라 월 평균 80만원 정도 됩니다.", pros:"전문 기술이 있으면 건당 단가가 매우 높음", cons:"납기 압박이 있어서 본업과 동시에 하면 체력 소모 큼", recommend:true },
  { hustle_id:"wishket", hustle_name:"위시켓", nickname:"위시켓vs크몽비교", income_range:"10_to_30", weekly_hours:8, difficulty:3, satisfaction:3, title:"크몽 vs 위시켓 솔직 비교", content:"크몽은 소액 고정 서비스, 위시켓은 대형 프로젝트 위주예요. 저는 크몽으로 월 20만원 안정적으로 하면서 위시켓 대형 프로젝트 가끔 수주하는 방식이 맞더라고요.", pros:"두 플랫폼을 병행하면 안정성과 고수익을 모두 잡을 수 있음", cons:"위시켓 단독으로는 수주 불규칙해서 수입이 들쭉날쭉", recommend:true },

  // ────────────────────────────────────────────────
  // freemoa (2→8, need 6)
  // ────────────────────────────────────────────────
  { hustle_id:"freemoa", hustle_name:"프리모아", nickname:"프리모아문서작성", income_range:"10_to_30", weekly_hours:10, difficulty:2, satisfaction:3, title:"문서 작성, 데이터 입력으로 월 15만원", content:"기획서, 보고서 작성 의뢰 위주로 받아요. 건당 5~10만원 수준이고 한 달에 2~3건 들어와서 월 15만원 정도입니다. 가볍게 부업하기엔 괜찮아요.", pros:"특별한 기술 없어도 문서 작성 능력만 있으면 시작 가능", cons:"의뢰 건수가 불규칙하고 단가가 낮은 편", recommend:true },
  { hustle_id:"freemoa", hustle_name:"프리모아", nickname:"프리모아IT의뢰수주", income_range:"30_to_50", weekly_hours:15, difficulty:3, satisfaction:4, title:"IT 의뢰 전문으로 월 35만원", content:"프리모아에서 IT 관련 의뢰가 생각보다 많아요. 데이터 분석, 엑셀 자동화 등 건당 20~50만원 수준. 한 달에 1~2건만 수주해도 30~40만원 됩니다.", pros:"IT 기술 보유자라면 의뢰 단가가 높아서 효율적", cons:"플랫폼 인지도가 크몽보다 낮아서 경쟁이 낮은 대신 의뢰도 적음", recommend:true },
  { hustle_id:"freemoa", hustle_name:"프리모아", nickname:"프리모아vs크몽", income_range:"10_to_30", weekly_hours:8, difficulty:2, satisfaction:3, title:"크몽보다 수수료가 낮은 게 장점이에요", content:"크몽 수수료 20%에 비해 프리모아는 수수료 구조가 유리해요. 의뢰 건수는 크몽보다 적지만 수수료가 낮아서 실수령이 더 높습니다.", pros:"수수료 구조가 유리해서 실수령액이 높음", cons:"크몽보다 플랫폼 규모가 작아서 의뢰 총 건수가 적음", recommend:true },
  { hustle_id:"freemoa", hustle_name:"프리모아", nickname:"프리모아번역작업", income_range:"under_10", weekly_hours:6, difficulty:2, satisfaction:3, title:"번역 의뢰로 소소하게 용돈 벌어요", content:"영어→한국어 번역 의뢰를 주로 받는데 건당 2~5만원이에요. 의뢰가 자주 들어오지 않아서 크몽이랑 병행하는 게 더 나은 것 같아요.", pros:"소규모 의뢰로 시작해서 경험 쌓기에 좋음", cons:"의뢰 빈도가 낮아서 단독으로는 수익이 불안정", recommend:false },
  { hustle_id:"freemoa", hustle_name:"프리모아", nickname:"프리모아콘텐츠제작", income_range:"10_to_30", weekly_hours:10, difficulty:3, satisfaction:4, title:"SNS 콘텐츠 제작 의뢰로 월 20만원", content:"소규모 사업자들이 SNS 콘텐츠 제작 의뢰를 많이 올려요. 인스타그램 게시물 디자인, 카드뉴스 제작 위주로 하고 있어요.", pros:"소규모 사업자 대상 의뢰가 많아서 진입이 쉬운 편", cons:"단가가 낮은 의뢰도 많아서 선별이 필요함", recommend:true },
  { hustle_id:"freemoa", hustle_name:"프리모아", nickname:"프리모아장기고객", income_range:"30_to_50", weekly_hours:12, difficulty:2, satisfaction:5, title:"장기 클라이언트 확보 후 안정적 수익", content:"처음에 한 번 의뢰 잘 마무리하니까 같은 클라이언트가 계속 다시 의뢰해요. 지금은 장기 고객 3명에서 월 40만원이 고정으로 나옵니다.", pros:"장기 고객 확보하면 매달 안정적인 수익 보장", cons:"첫 고객 확보까지 시간이 걸리고 실망시키면 끊김", recommend:true },
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
