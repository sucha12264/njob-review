import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 mb-8 inline-block">
        ← 홈으로
      </Link>

      <h1 className="text-3xl font-black text-slate-900 mb-2">이용약관</h1>
      <p className="text-slate-400 text-sm mb-10">최종 수정일: 2026년 4월 23일</p>

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
          <h2 className="text-base font-bold text-slate-800 mb-2">제6조 (면책조항)</h2>
          <p>
            운영자는 이용자가 서비스를 통해 얻은 정보를 기반으로 진행한 부업 활동, 투자, 계약 등으로 인해
            발생한 손해에 대해 책임을 지지 않습니다.
            서비스 내 외부 링크(플랫폼, 사이트)로 인한 피해에 대해서도 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">제7조 (문의)</h2>
          <p>서비스 관련 문의: <span className="text-indigo-600">njob.community@gmail.com</span></p>
        </section>

      </div>
    </div>
  );
}
