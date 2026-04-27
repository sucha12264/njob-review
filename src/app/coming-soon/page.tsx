import Link from "next/link";

const LIVE_FEATURES = [
  { emoji: "📋", text: "100개 이상 부업 정보 & 가이드" },
  { emoji: "✍️", text: "실제 경험자 솔직 후기 & 수익 인증" },
  { emoji: "💬", text: "부업별 댓글 & 소통" },
  { emoji: "📊", text: "수익대·난이도·추천률 필터" },
  { emoji: "🔍", text: "부업 검색 & 카테고리 탐색" },
  { emoji: "🚨", text: "신고 시스템 & 커뮤니티 안전 관리" },
];

const UPCOMING_FEATURES = [
  { emoji: "🤖", text: "AI 후기 요약 (베타 출시)", badge: "곧 출시" },
  { emoji: "📱", text: "모바일 앱 출시", badge: "개발 중" },
  { emoji: "🔔", text: "신규 후기 알림 구독", badge: "기획 중" },
  { emoji: "🏆", text: "부업 랭킹 & 월간 트렌드", badge: "기획 중" },
];

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-lg w-full">
        {/* 로고 */}
        <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 shadow-sm px-4 py-2 rounded-full mb-8">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
            N
          </div>
          <span className="text-sm font-bold text-slate-700">N잡 후기판</span>
        </div>

        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3 leading-tight">
          지금 바로 이용 가능해요
        </h1>
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          국내 N잡러들의 솔직한 부업 후기 커뮤니티가 오픈되었습니다.
        </p>

        {/* 현재 이용 가능 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4 text-left space-y-2.5">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-4">
            ✅ 현재 이용 가능
          </p>
          {LIVE_FEATURES.map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm text-slate-700">{item.text}</span>
              <span className="ml-auto text-xs bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                이용 가능
              </span>
            </div>
          ))}
        </div>

        {/* 출시 예정 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 text-left space-y-2.5">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4">
            🔜 출시 예정
          </p>
          {UPCOMING_FEATURES.map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm text-slate-600">{item.text}</span>
              <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors mb-4"
        >
          지금 후기 보러 가기 →
        </Link>

        <p className="text-xs text-slate-400 mt-4">
          업데이트 소식은{" "}
          <a
            href="https://open.kakao.com/o/njob-review"
            className="text-indigo-500 hover:underline font-medium"
          >
            카카오 오픈채팅
          </a>
          에서 확인하세요
        </p>
      </div>
    </div>
  );
}
