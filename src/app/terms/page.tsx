import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 mb-8 inline-block">
        ← 홈으로
      </Link>

      <h1 className="text-3xl font-black text-slate-900 mb-2">이용약관</h1>
      <p className="text-slate-400 text-sm mb-10">최종 수정일: 2026년 4월 29일</p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제1조 (목적)</h2>
          <p>
            본 약관은 N잡 후기판(이하 &quot;서비스&quot;)이 제공하는 온라인 부업 정보 및 커뮤니티 서비스 이용에 관한
            조건과 절차, 운영자와 이용자 간의 권리·의무 관계를 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제2조 (수익 정보 면책)</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
            <p className="font-semibold text-amber-800 mb-1">⚠️ 중요 안내</p>
            <p className="text-amber-700">
              본 서비스에 게시된 모든 수익 정보, 수익 인증, 예상 수익 범위는 <strong>작성자 개인의 경험</strong>을
              바탕으로 한 것이며, 동일한 수익을 보장하지 않습니다.
              부업의 실제 수익은 개인의 노력, 시간 투자, 시장 상황 등에 따라 크게 다를 수 있습니다.
              본 서비스의 정보를 참고하여 발생한 손해에 대해 서비스 운영자는 책임을 지지 않습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제3조 (이용자 의무)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>허위 수익 정보 또는 과장된 내용을 게시하지 않습니다.</li>
            <li>타인의 명예를 훼손하거나 비방하는 내용을 게시하지 않습니다.</li>
            <li>스팸, 광고성 게시물을 무단으로 게시하지 않습니다.</li>
            <li>저작권 등 타인의 권리를 침해하는 내용을 게시하지 않습니다.</li>
          </ul>
          <p className="mt-2">
            위반 시 운영자는 해당 게시물을 사전 통보 없이 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제4조 (서비스 운영자의 의무)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>이용자의 개인정보를 개인정보처리방침에 따라 보호합니다.</li>
            <li>서비스의 안정적 운영을 위해 최선을 다합니다.</li>
            <li>불법적이거나 부적절한 게시물 신고 시 검토 후 조치합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제5조 (게시물의 저작권)</h2>
          <p>
            이용자가 서비스에 작성한 후기의 저작권은 작성자 본인에게 있습니다.
            단, 서비스 내 노출 및 홍보를 위한 범위 내에서 운영자가 활용할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제6조 (서비스 콘텐츠의 저작권 및 소유권)</h2>
          <p className="mb-2">
            본 서비스에서 운영자가 직접 제작·편집한 모든 콘텐츠(부업 정보, 가이드, 분류 체계, 데이터 구조,
            UI 디자인 등)의 저작권은 운영자에게 귀속됩니다.
            이는 대한민국 저작권법 및 관련 법령의 보호를 받습니다.
          </p>
          <p>
            운영자의 사전 서면 동의 없이 본 서비스의 콘텐츠를 복제, 배포, 전송, 수정, 2차 저작물 작성,
            상업적 목적으로 이용하는 행위는 엄격히 금지됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제7조 (크롤링·자동 수집 금지)</h2>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-2 mb-3">
            <p className="font-semibold text-red-700 mb-1">🚫 데이터 무단 수집 엄금</p>
            <p className="text-red-600 text-xs">
              본 조항은 법적 효력을 가지며, 위반 시 민·형사상 책임을 질 수 있습니다.
            </p>
          </div>
          <p className="mb-2">
            다음 각 호에 해당하는 행위는 운영자의 명시적 서면 동의 없이 엄격히 금지됩니다.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-3">
            <li>
              <strong>크롤링(Crawling) 및 스크래핑(Scraping)</strong> — 자동화된 프로그램, 봇, 스파이더,
              스크립트 등을 이용하여 본 서비스의 데이터를 수집하는 행위
            </li>
            <li>
              <strong>API 무단 호출</strong> — 서비스 운영에 사용되는 데이터베이스 API, 내부 엔드포인트에
              무단으로 접근하거나 대량의 데이터를 수집하는 행위
            </li>
            <li>
              <strong>데이터베이스 복제</strong> — 본 서비스의 후기 데이터, 부업 정보, 분류 체계 등
              데이터베이스 전체 또는 일부를 복사·저장하는 행위
            </li>
            <li>
              <strong>디자인·구조 무단 복제</strong> — 본 서비스의 UI 디자인, 페이지 구성, 정보 구조를
              모방하거나 복제하여 유사 서비스를 만드는 행위
            </li>
            <li>
              <strong>상업적 재활용</strong> — 수집한 데이터를 제3자에게 제공하거나 상업적 목적으로 이용하는 행위
            </li>
          </ul>
          <p className="mb-2">
            위반이 확인된 경우 운영자는 다음 조치를 취할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>해당 IP·계정에 대한 접근 즉시 차단</li>
            <li>저작권법, 부정경쟁방지법, 정보통신망법 등에 따른 민사·형사 고소·고발</li>
            <li>손해배상 청구</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            본 서비스는 데이터 무단 수집 여부를 기술적으로 탐지·추적하고 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제8조 (접근 제한)</h2>
          <p>
            운영자는 서비스의 안정적 운영 및 데이터 보호를 위해 비정상적인 접근 패턴이 감지된
            IP 주소, 사용자 에이전트, 계정에 대해 사전 통보 없이 접근을 제한하거나 차단할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제9조 (면책조항)</h2>
          <p>
            운영자는 이용자가 서비스를 통해 얻은 정보를 기반으로 진행한 부업 활동, 투자, 계약 등으로 인해
            발생한 손해에 대해 책임을 지지 않습니다.
            서비스 내 외부 링크(플랫폼, 사이트)로 인한 피해에 대해서도 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제10조 (문의)</h2>
          <p>서비스 관련 문의: <span className="text-indigo-600">njob.community@gmail.com</span></p>
        </section>

      </div>
    </div>
  );
}
