export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 로고 */}
        <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 shadow-sm px-4 py-2 rounded-full mb-8">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
            N
          </div>
          <span className="text-sm font-bold text-slate-700">N잡 후기판</span>
        </div>

        {/* 메인 텍스트 */}
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4 leading-tight">
          곧 오픈합니다
        </h1>
        <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8">
          국내 최대 N잡 후기 커뮤니티를 준비 중이에요.
          <br />
          실제 경험자들의 솔직한 후기로 돌아올게요.
        </p>

        {/* 준비 중인 기능 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 text-left space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            준비 중인 기능
          </p>
          {[
            { emoji: "📋", text: "60개 이상 부업 정보 & 가이드" },
            { emoji: "✍️", text: "실제 경험자 솔직 후기" },
            { emoji: "💰", text: "수익 인증 이미지 공유" },
            { emoji: "💬", text: "부업별 실시간 댓글" },
            { emoji: "📊", text: "수익대·난이도·추천률 필터" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm text-slate-600">{item.text}</span>
              <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                준비 중
              </span>
            </div>
          ))}
        </div>

        {/* 오픈 알림 신청 */}
        <p className="text-xs text-slate-400">
          오픈 소식이 궁금하다면{" "}
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
