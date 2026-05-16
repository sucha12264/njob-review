/**
 * 부업별 Q&A 질문+답변 시드
 * 실행: npx tsx scripts/seed-qna.ts
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qruymdekquikterbqhdo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydXltZGVrcXVpa3RlcmJxaGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgxNTU4MCwiZXhwIjoyMDkyMzkxNTgwfQ.xGSxl5Q5Z38waPJI--TlMxuw3ASjx2KyD796_uS9G0c"
);

interface QnA {
  hustle_id: string;
  question: { nickname: string; content: string; daysAgo: number };
  answers: { nickname: string; content: string; is_best: boolean; daysAgo: number }[];
}

const QNA_DATA: QnA[] = [
  // ─── 쿠팡파트너스 ───────────────────────────────────────
  {
    hustle_id: "coupang-partners",
    question: { nickname: "파트너스초보", content: "쿠팡파트너스 가입 조건이 따로 있나요? 블로그 방문자가 적어도 가입이 되나요?", daysAgo: 14 },
    answers: [
      { nickname: "파트너스3년차", content: "방문자 조건 없어요. 블로그나 SNS 채널 URL만 있으면 바로 가입 가능합니다. 심사도 거의 자동 승인이에요. 단, 가입 후 6개월 내에 클릭이 발생하지 않으면 계정이 비활성화될 수 있으니 일단 가입하면 링크 하나라도 올려두세요.", is_best: true, daysAgo: 13 },
      { nickname: "블로그운영자", content: "저는 이웃 50명짜리 블로그로 가입했어요. 채널이 있으면 다 됩니다.", is_best: false, daysAgo: 12 },
    ],
  },
  {
    hustle_id: "coupang-partners",
    question: { nickname: "링크수익궁금", content: "제가 올린 링크로 다른 상품을 사도 수수료가 나오나요?", daysAgo: 10 },
    answers: [
      { nickname: "파트너스고수", content: "네, 맞아요! 제 링크 클릭 후 24시간 내에 구매한 모든 상품에 수수료가 붙어요. 예를 들어 세제 링크 클릭 후 TV 사도 수수료 받습니다. 이게 쿠팡파트너스의 핵심 장점이에요. 그래서 가격 비교 검색 많이 받는 글에 링크 넣으면 의외의 고가 제품 구매로 수수료가 크게 들어와요.", is_best: true, daysAgo: 9 },
    ],
  },
  {
    hustle_id: "coupang-partners",
    question: { nickname: "수수료율질문", content: "카테고리별 수수료율이 다른가요? 어느 카테고리가 제일 높나요?", daysAgo: 8 },
    answers: [
      { nickname: "수익최적화중", content: "다릅니다. 대략:\n- 패션/의류: 10.9%\n- 뷰티/화장품: 10.9%\n- 생활/주방: 3%\n- 가전/디지털: 1~3%\n- 식품: 2~3%\n\n단가 높은 가전은 수수료율 낮아도 금액이 커서 괜찮고, 패션/뷰티는 율이 높아요. 리뷰 글 주제에 맞는 카테고리 선택하세요.", is_best: true, daysAgo: 7 },
      { nickname: "파트너스2년", content: "저는 IT기기 리뷰 블로그인데 율이 낮아도 단가가 높아서 한 건에 3~5만원 수수료 들어올 때도 있어요.", is_best: false, daysAgo: 7 },
    ],
  },
  {
    hustle_id: "coupang-partners",
    question: { nickname: "sns파트너스", content: "인스타그램 링크인바이오에 쿠팡 링크 넣어도 되나요? 팔로워 1000명인데 의미가 있을까요?", daysAgo: 5 },
    answers: [
      { nickname: "인스타파트너스", content: "가능해요! 저는 팔로워 800명일 때 시작해서 월 3만원 정도 나왔어요. 팔로워 수보다 참여율이 중요해서 팔로워 1000명이라도 충성도 높으면 충분히 의미 있어요. 특히 제품 후기나 구매 추천 콘텐츠에 링크 연결하면 전환율이 높아요.", is_best: true, daysAgo: 4 },
    ],
  },

  // ─── 네이버 블로그 ───────────────────────────────────────
  {
    hustle_id: "naver-blog",
    question: { nickname: "블로그새내기", content: "네이버 블로그 주제를 어떻게 정해야 할까요? 잡블로그도 되나요?", daysAgo: 20 },
    answers: [
      { nickname: "블로그SEO전문", content: "처음엔 잡블로그보다 전문 블로그가 유리해요. 네이버 알고리즘이 일관된 주제를 선호합니다. 단, 너무 좁은 주제는 글감이 고갈돼서 문제예요.\n\n추천 전략: 메인 주제 1개 + 연관 주제 1~2개 조합. 예) 육아 메인 + 살림/요리 보조\n\n3개월 꾸준히 올리다 보면 자연스럽게 방향이 잡혀요.", is_best: true, daysAgo: 19 },
      { nickname: "1년차블로거", content: "저는 잡블로그로 시작했는데 6개월째 방문자가 잘 안 늘더라고요. 그 다음에 주제 좁혔더니 확 올랐어요. 처음부터 주제 잡는 게 맞는 것 같아요.", is_best: false, daysAgo: 18 },
    ],
  },
  {
    hustle_id: "naver-blog",
    question: { nickname: "애드포스트신청", content: "네이버 애드포스트 신청 조건이 정확히 어떻게 되나요?", daysAgo: 12 },
    answers: [
      { nickname: "애드포스트경험자", content: "공식 조건은:\n- 블로그 개설 후 90일 이상\n- 발행한 포스팅 50개 이상\n- 최근 6개월 내 활동 이력\n\n비공식적으로 방문자 수도 보는 것 같아요. 일 방문자 100명 이상은 돼야 승인이 잘 나온다고 알려져 있어요. 저는 글 65개, 일 방문자 150명 때 한 번에 승인됐어요.", is_best: true, daysAgo: 11 },
    ],
  },
  {
    hustle_id: "naver-blog",
    question: { nickname: "키워드선정법", content: "어떤 키워드로 글을 써야 방문자가 늘어나나요?", daysAgo: 7 },
    answers: [
      { nickname: "SEO고수블로거", content: "핵심은 '경쟁이 낮고 검색량 있는 키워드'예요.\n\n방법:\n1. 네이버 검색창에 키워드 입력 → 자동완성 확인\n2. 블랙키위나 키워드마스터로 월 검색량 확인\n3. 검색량 1,000~10,000 사이 키워드 공략\n\n검색량 많은 빅키워드는 이미 상위 블로그가 점령해서 신규는 진입 어려워요. '○○ 추천', '○○ 후기', '○○ 방법' 같은 롱테일 키워드가 효과적이에요.", is_best: true, daysAgo: 6 },
      { nickname: "블로그2년차", content: "저는 '○○ 가격', '○○ 사용법' 이런 키워드로 쓴 글들이 방문자가 제일 많이 들어와요. 정보 찾는 사람들이 많이 검색하거든요.", is_best: false, daysAgo: 6 },
    ],
  },

  // ─── 티스토리 ───────────────────────────────────────
  {
    hustle_id: "tistory",
    question: { nickname: "애드센스승인대기", content: "티스토리 구글 애드센스 승인받는 데 보통 얼마나 걸리나요? 여러 번 떨어지는 게 정상인가요?", daysAgo: 18 },
    answers: [
      { nickname: "애드센스3번승인", content: "저는 3번 떨어지고 4번째에 승인됐어요. 승인 기준이 명확하지 않아서 어렵긴 한데 체크리스트 공유할게요:\n\n✅ 글 20개 이상\n✅ 글당 800자 이상\n✅ 개인정보처리방침 페이지 있음\n✅ 저작권 침해 이미지 없음\n✅ 구글 서치 콘솔 연동\n✅ 사이트맵 제출\n\n보통 2주~3개월 소요되고 한 번 떨어지면 2주 후 재신청이에요.", is_best: true, daysAgo: 17 },
      { nickname: "티스토리1년", content: "저는 글 30개, 신청 2주 만에 승인됐어요. 복붙이나 저작권 이미지가 없는 게 중요한 것 같아요.", is_best: false, daysAgo: 17 },
    ],
  },
  {
    hustle_id: "tistory",
    question: { nickname: "구글유입늘리기", content: "티스토리 글을 올려도 구글 검색에 잘 안 나오는데 어떻게 해야 하나요?", daysAgo: 9 },
    answers: [
      { nickname: "SEO티스토리", content: "구글 노출은 시간이 걸려요. 빨리 잡히게 하려면:\n\n1. 구글 서치 콘솔에서 URL 검사 → 색인 생성 요청\n2. 사이트맵 주기적으로 재제출\n3. 글 제목에 정확한 키워드 포함\n4. 내부 링크 연결 (기존 글들 서로 연결)\n5. 글 길이 최소 1,500자 이상\n\n보통 새 글이 구글에 잡히는 데 2~4주 걸려요. 채널 개설 초기엔 3개월 넘게 걸리기도 해요.", is_best: true, daysAgo: 8 },
    ],
  },

  // ─── 유튜브 ───────────────────────────────────────
  {
    hustle_id: "youtube",
    question: { nickname: "유튜브장비초보", content: "유튜브 처음 시작할 때 장비가 꼭 좋아야 하나요? 스마트폰으로도 되나요?", daysAgo: 25 },
    answers: [
      { nickname: "유튜브2년차", content: "스마트폰으로 충분해요! 요즘 아이폰, 갤럭시 카메라 성능이 좋아서 화질은 문제없어요.\n\n초반에 정말 필요한 것만 꼽으면:\n1. 스마트폰 (이미 있음)\n2. 마이크 (2~3만원 핀 마이크) - 음질이 화질보다 중요\n3. 삼각대 (1~2만원)\n\n조명은 밝은 창가에서 촬영하면 초반에는 괜찮아요. 구독자 1,000명 넘으면 장비 업그레이드 고려하세요.", is_best: true, daysAgo: 24 },
      { nickname: "유튜버1년", content: "저는 6개월째 갤럭시로 촬영해요. 마이크 3만원짜리 사고 나서 영상 퀄리티가 확 올랐어요. 음질이 핵심입니다.", is_best: false, daysAgo: 23 },
    ],
  },
  {
    hustle_id: "youtube",
    question: { nickname: "수익창출조건달성법", content: "구독자 1000명이 너무 안 늘어요. 빠르게 늘리는 방법이 있나요?", daysAgo: 15 },
    answers: [
      { nickname: "유튜브마케터", content: "제가 써본 방법들:\n\n1. 쇼츠 병행 - 롱폼보다 알고리즘 타기 쉬워서 채널 노출에 유리\n2. 영상 제목 최적화 - '2024년 최신', '○○ 하는 법', '○분 만에' 등 클릭 유도 문구\n3. 썸네일에 얼굴 넣기 - 없는 것보다 클릭률 30% 이상 높음\n4. 댓글 소통 - 초기 구독자 충성도 높이기\n5. 커뮤니티 탭 활용 - 자주 올리면 기존 구독자 재방문\n\n가장 효과 좋은 건 쇼츠로 채널 인지도 높이고 롱폼으로 전환하는 전략이에요.", is_best: true, daysAgo: 14 },
    ],
  },
  {
    hustle_id: "youtube",
    question: { nickname: "얼굴노출싫어", content: "얼굴 없이 유튜브 해도 될까요? 수익이 가능한가요?", daysAgo: 8 },
    answers: [
      { nickname: "얼굴없는유튜버", content: "충분히 가능해요! 저도 얼굴 없는 채널로 구독자 8,000명, 월 수익 40만원이에요.\n\n얼굴 없는 채널 잘 되는 분야:\n- 정보/지식 (화면 자료 + 나레이션)\n- ASMR / 요리\n- 애니메이션 / 2D 캐릭터\n- 게임 플레이\n- 화이트보드 영상\n\n얼굴 없어도 목소리 퀄리티가 중요해요. 마이크 투자는 필수입니다.", is_best: true, daysAgo: 7 },
    ],
  },

  // ─── 크몽 ───────────────────────────────────────
  {
    hustle_id: "kmong",
    question: { nickname: "크몽입점준비", content: "크몽에 어떤 서비스를 올릴 수 있나요? 특별한 자격이 필요한가요?", daysAgo: 22 },
    answers: [
      { nickname: "크몽전문가등록", content: "자격증 없어도 됩니다. 본인이 잘 하는 것이면 뭐든 등록 가능해요.\n\n많이 팔리는 서비스:\n- 디자인 (로고, 썸네일, 카드뉴스)\n- 번역/영작\n- 영상편집\n- 글쓰기/블로그 대행\n- 엑셀 자동화\n- SNS 마케팅\n- 프로그래밍\n\n'나는 특별한 스킬이 없다'고 생각하는 분들도 의외로 할 수 있는 게 많아요. 엑셀 함수 잘 쓰는 것만으로도 서비스 만들 수 있어요.", is_best: true, daysAgo: 21 },
    ],
  },
  {
    hustle_id: "kmong",
    question: { nickname: "크몽수수료계산", content: "크몽 수수료가 20%라고 하는데, 정확히 어떻게 계산되나요?", daysAgo: 16 },
    answers: [
      { nickname: "크몽1년운영", content: "크몽 수수료 구조:\n\n초보 전문가: 판매금액의 20%\n일반 전문가: 18%\n우수 전문가: 15%\n최우수 전문가: 12%\n\n예시: 10만원 서비스 판매 시\n→ 초보: 2만원 수수료, 8만원 수령\n→ 최우수: 1.2만원 수수료, 8.8만원 수령\n\n그래서 처음엔 단가를 수수료 포함해서 높게 잡아야 실속이 있어요.\n실제 받고 싶은 금액 × 1.25 = 등록 가격 으로 잡으면 돼요.", is_best: true, daysAgo: 15 },
      { nickname: "프리랜서디자이너", content: "추가로 부가세(10%)도 별도라 실수령은 더 낮아요. 저는 단가 설정할 때 수수료 + 세금 다 고려해서 잡아요.", is_best: false, daysAgo: 14 },
    ],
  },
  {
    hustle_id: "kmong",
    question: { nickname: "후기없는초반", content: "크몽 처음 등록했는데 문의가 하나도 없어요. 어떻게 해야 하나요?", daysAgo: 6 },
    answers: [
      { nickname: "크몽초반돌파", content: "초반 문의 없는 건 정상이에요. 돌파 방법:\n\n1. 가격을 시장 최저가보다 30% 낮춰서 후기 3개 모으기\n2. 서비스 설명에 포트폴리오 이미지 최대한 많이 넣기\n3. 응답속도를 1시간 이내로 유지 (알고리즘에 영향)\n4. 상세 설명에 자주 묻는 질문 먼저 답변해두기\n5. 서비스 카테고리를 2~3개 활용\n\n후기 3개만 생기면 그다음부터는 훨씬 수월해요. 첫 3건은 투자 개념으로 접근하세요.", is_best: true, daysAgo: 5 },
    ],
  },

  // ─── 쿠팡플렉스 ───────────────────────────────────────
  {
    hustle_id: "coupang-flex",
    question: { nickname: "플렉스시작방법", content: "쿠팡플렉스 처음 시작하려면 어떻게 해야 하나요? 조건이 있나요?", daysAgo: 19 },
    answers: [
      { nickname: "플렉스6개월차", content: "시작 조건:\n- 만 18세 이상\n- 운전면허 보유\n- 본인 명의 차량\n\n시작 방법:\n1. 쿠팡플렉스 앱 설치\n2. 회원가입 + 신분증, 면허증 인증\n3. 배차 가능 지역 설정\n4. 앱에서 배차 신청\n\n중요: 배차는 선착순이에요. 인기 시간대(새벽 2~3시, 금요일 저녁)는 빠르게 마감돼요. 배차 알림 설정하고 빠르게 잡는 게 핵심이에요.", is_best: true, daysAgo: 18 },
    ],
  },
  {
    hustle_id: "coupang-flex",
    question: { nickname: "플렉스수익계산", content: "쿠팡플렉스 실제로 얼마나 버나요? 기름값 빼면 남는 게 있나요?", daysAgo: 11 },
    answers: [
      { nickname: "플렉스현실수익", content: "제 기준으로 계산해드릴게요 (새벽 4시간 기준):\n\n수입: 55,000~65,000원\n기름값: 6,000~8,000원 (연비, 거리 따라 다름)\n차량 소모 감가: 약 3,000~5,000원 (개인 추정)\n\n실질 순수익: 42,000~55,000원 정도\n\n월 20회 기준: 84만~110만원\n\n새벽에 일하는 것치고는 괜찮지만 수면 부족이 제일 힘들어요. 저는 주 3~4회가 한계예요.", is_best: true, daysAgo: 10 },
      { nickname: "경차플렉서", content: "경차라 기름값이 더 적게 나와요. 저는 4시간에 기름값 4천원 정도예요. 연비 좋은 차가 유리해요.", is_best: false, daysAgo: 9 },
    ],
  },

  // ─── 배달의민족 라이더 ───────────────────────────────────────
  {
    hustle_id: "baemin-rider",
    question: { nickname: "배민라이더지원", content: "배달의민족 라이더로 일하려면 오토바이가 꼭 있어야 하나요? 자전거는요?", daysAgo: 17 },
    answers: [
      { nickname: "배민라이더2년", content: "배민은 오토바이, 자전거, 킥보드 모두 가능해요.\n\n단 차이가 큽니다:\n- 오토바이: 콜 수 많음, 장거리 가능, 시간당 2~2.5만원\n- 자전거: 단거리 위주, 시간당 1~1.5만원, 체력 소모\n- 전동킥보드: 자전거와 비슷\n\n실질적으로 시간당 수익이 오토바이가 훨씬 높아요. 오토바이 없이 배달 부업하려면 쿠팡이츠 자전거 배달이나 쿠팡플렉스(차량)이 더 나을 수 있어요.", is_best: true, daysAgo: 16 },
    ],
  },
  {
    hustle_id: "baemin-rider",
    question: { nickname: "배달시간대추천", content: "배달 콜이 제일 많이 들어오는 시간대가 어떻게 되나요?", daysAgo: 8 },
    answers: [
      { nickname: "프리라이더경험", content: "콜 많은 시간대 (서울 기준):\n\n🔴 최상급\n- 점심: 11:30~13:30\n- 저녁: 18:00~20:30\n- 야식: 21:30~23:00 (금토는 새벽 1시까지)\n\n🟡 보통\n- 아침: 8:00~10:00 (직장 밀집 지역)\n- 오후: 14:00~17:00\n\n🟢 비수기\n- 평일 오전~오후\n\n비·눈 오는 날은 콜이 폭증하는데 배달하기 힘들어서 판단은 본인이 해야 해요.", is_best: true, daysAgo: 7 },
    ],
  },

  // ─── 스마트스토어 ───────────────────────────────────────
  {
    hustle_id: "smart-store",
    question: { nickname: "위탁판매초보", content: "스마트스토어 위탁판매 시작하려는데 사업자등록 먼저 해야 하나요?", daysAgo: 24 },
    answers: [
      { nickname: "스토어1년차", content: "법적으로는 사업자 없어도 개인 간 거래로 판매 가능해요. 하지만:\n\n사업자 등록 권장 이유:\n1. 세금계산서 발급 가능 (도매 소싱 시 필요)\n2. 통신판매업신고 가능 (일정 매출 이상 의무)\n3. 부가세 환급 가능\n4. 플랫폼 수수료 세금처리\n\n처음엔 개인으로 시작하고 월 매출 100만원 넘으면 사업자 내는 분들 많아요. 개인사업자 등록은 무료이고 간단해요.", is_best: true, daysAgo: 23 },
    ],
  },
  {
    hustle_id: "smart-store",
    question: { nickname: "상품소싱방법", content: "위탁판매 상품은 어디서 소싱하는 게 좋나요?", daysAgo: 13 },
    answers: [
      { nickname: "위탁판매전문가", content: "주요 소싱 채널:\n\n🇰🇷 국내\n- 도매꾹: 국내 최대 도매 플랫폼, 품질 검증됨\n- 도매토피아: 패션 위주\n- 오너클랜: 생활용품 강함\n\n🇨🇳 중국\n- 1688: 알리바바 계열 도매, 가격 최저\n- 타오바오: 다양한 상품\n\n초보에게 추천: 국내 도매꾹 위주로 시작\n이유: 배송 빠름, 반품 처리 쉬움, 한국어 CS\n\n중국 소싱은 배송 2~3주, 검수 어려움 등 리스크 있어요.", is_best: true, daysAgo: 12 },
    ],
  },

  // ─── 데이터 라벨링 ───────────────────────────────────────
  {
    hustle_id: "data-labeling",
    question: { nickname: "라벨링초보", content: "데이터 라벨링 처음 시작하는데 어떤 플랫폼이 좋나요? 특별한 기술이 필요한가요?", daysAgo: 21 },
    answers: [
      { nickname: "라벨링6개월차", content: "특별한 기술 없어도 됩니다. 컴퓨터 기본 조작만 되면 OK예요.\n\n주요 플랫폼:\n- 크라우드웍스: 국내 최대, 작업 종류 다양\n- 에이모: AI 데이터 전문, 단가 좀 높음\n- 테스터블: 앱/웹 테스트 위주\n\n작업 종류:\n- 이미지 분류/라벨링 (난이도 하)\n- 텍스트 검수/분류 (난이도 중, 단가 높)\n- 음성 전사 (난이도 중)\n\n크라우드웍스에서 시작해서 익숙해지면 에이모로 넘어가는 분들 많아요.", is_best: true, daysAgo: 20 },
    ],
  },

  // ─── 캐시슬라이드 ───────────────────────────────────────
  {
    hustle_id: "cashslide",
    question: { nickname: "앱테크시작", content: "캐시슬라이드 말고 같이 하면 좋은 잠금화면 앱 있나요?", daysAgo: 16 },
    answers: [
      { nickname: "앱테크고수", content: "같이 쓰면 좋은 앱들:\n\n📱 잠금화면\n- 캐시슬라이드\n- 허니스크린\n- 버즈빌 (일부 폰 지원)\n\n📋 설문\n- 패널나우\n- 오픈서베이\n- 틸리언프로\n\n💰 금융앱 혜택\n- 토스 만보기\n- 카카오페이\n\n주의: 잠금화면 앱 여러 개 깔면 배터리 소모 심해져요. 폰 2대 있으면 부업폰 따로 두는 게 최적이에요. 합산해도 월 5만원이 현실적 상한선이에요.", is_best: true, daysAgo: 15 },
    ],
  },

  // ─── 전자책 ───────────────────────────────────────
  {
    hustle_id: "ebook",
    question: { nickname: "전자책주제선정", content: "전자책 주제를 어떻게 잡아야 할까요? 저는 특별한 전문 지식이 없어서요.", daysAgo: 20 },
    answers: [
      { nickname: "전자책3권출판", content: "전문 지식 없어도 됩니다. 팔리는 전자책 주제는 대부분 '경험담'이에요.\n\n잘 팔리는 주제 유형:\n1. 취업/이직 경험 (대기업, 공기업, 특정 직군)\n2. 부업 시작기 (내가 해본 것들)\n3. 절약/재테크 실천기\n4. 다이어트/건강 경험담\n5. 육아/살림 노하우\n\n전문가처럼 쓰려고 하면 안 돼요. '나 같은 평범한 사람이 해봤어요'가 오히려 더 팔려요.\n먼저 크몽에서 비슷한 주제 검색해서 수요 확인 후 쓰세요.", is_best: true, daysAgo: 19 },
    ],
  },

  // ─── 클래스101 ───────────────────────────────────────
  {
    hustle_id: "class101",
    question: { nickname: "클래스강의등록", content: "클래스101에 강의 올리려면 심사가 있나요? 유명하지 않아도 되나요?", daysAgo: 18 },
    answers: [
      { nickname: "클래스101크리에이터", content: "심사 있어요. 하지만 팔로워나 인지도보다 '콘텐츠 품질'과 '수요'를 봐요.\n\n등록 프로세스:\n1. 크리에이터 지원서 제출\n2. 샘플 콘텐츠 제출 (영상 1~2개)\n3. 담당자 검토 (1~2주)\n4. 승인 후 강의 제작\n\n승인 팁:\n- 이미 수요가 있는 주제 선택\n- 샘플 영상 음질/화질 중요\n- 무엇을 배울 수 있는지 명확하게\n\n떨어지면 1개월 후 재지원 가능해요. 처음엔 크몽에 전자책으로 수요 테스트하고 클래스101 가는 것도 방법이에요.", is_best: true, daysAgo: 17 },
    ],
  },

  // ─── KREAM ───────────────────────────────────────
  {
    hustle_id: "kream",
    question: { nickname: "리셀초보", content: "KREAM에서 처음 리셀 시작하는데 어떤 제품으로 시작하는 게 안전할까요?", daysAgo: 14 },
    answers: [
      { nickname: "KREAM리셀1년", content: "초보에게 안전한 시작 방법:\n\n✅ 추천 제품\n- 나이키 덩크 시리즈 (수요 꾸준하고 시세 예측 쉬움)\n- 뉴발란스 990, 992 (국내 인기 안정적)\n- 아디다스 삼바 (최근 인기 상승)\n\n❌ 피해야 할 것 (초보)\n- 나이키 조던 레트로 (시세 변동 심함)\n- 콜라보 제품 (팬덤 의존도 높아 예측 어려움)\n\n핵심 원칙:\n1. 투자금의 30% 이상 한 제품에 쏟지 않기\n2. 발매 당일 시세가 발매가 미만이면 패스\n3. KREAM 앱에서 시세 그래프 3개월치 꼭 확인", is_best: true, daysAgo: 13 },
    ],
  },
];

async function main() {
  console.log(`총 ${QNA_DATA.length}개 Q&A 삽입 시작...`);
  let qSuccess = 0, qFail = 0, aSuccess = 0, aFail = 0;

  for (const item of QNA_DATA) {
    // 질문 삽입
    const qDate = new Date(Date.now() - item.question.daysAgo * 86400000).toISOString();
    const { data: qData, error: qError } = await supabase
      .from("hustle_questions")
      .insert({
        hustle_id: item.hustle_id,
        nickname: item.question.nickname,
        content: item.question.content,
        created_at: qDate,
      })
      .select()
      .single();

    if (qError || !qData) {
      console.error(`\n❌ Q [${item.hustle_id}]: ${qError?.message}`);
      qFail++;
      continue;
    }
    qSuccess++;
    process.stdout.write("Q");

    // 답변 삽입
    for (const ans of item.answers) {
      const aDate = new Date(Date.now() - ans.daysAgo * 86400000).toISOString();
      const { error: aError } = await supabase
        .from("hustle_answers")
        .insert({
          question_id: qData.id,
          nickname: ans.nickname,
          content: ans.content,
          is_best: ans.is_best,
          created_at: aDate,
        });

      if (aError) {
        console.error(`\n❌ A [${item.hustle_id}]: ${aError.message}`);
        aFail++;
      } else {
        process.stdout.write("A");
        aSuccess++;
      }
    }
  }

  // answer_count 업데이트 (트리거 없으면 수동으로)
  console.log("\n\nanswer_count 업데이트 중...");
  const { data: questions } = await supabase.from("hustle_questions").select("id");
  for (const q of questions ?? []) {
    const { count } = await supabase
      .from("hustle_answers")
      .select("id", { count: "exact", head: true })
      .eq("question_id", q.id);
    await supabase
      .from("hustle_questions")
      .update({ answer_count: count ?? 0 })
      .eq("id", q.id);
  }

  console.log(`\n✅ 질문: ${qSuccess}개 성공, ${qFail}개 실패`);
  console.log(`✅ 답변: ${aSuccess}개 성공, ${aFail}개 실패`);
}

main().catch(console.error);
