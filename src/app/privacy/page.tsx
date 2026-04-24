import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 mb-8 inline-block">
        ← 홈으로
      </Link>

      <h1 className="text-3xl font-black text-slate-900 mb-2">개인정보처리방침</h1>
      <p className="text-slate-400 text-sm mb-10">최종 수정일: 2026년 4월 23일</p>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">1. 수집하는 개인정보 항목</h2>
          <p>
            N잡 후기판은 후기 작성 시 아래 정보를 수집합니다.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>닉네임 (필수): 후기 작성자 표시 목적</li>
            <li>카카오 소셜 로그인 이용 시: 카카오 회원번호, 닉네임, 프로필 이미지 (카카오 정책 범위 내)</li>
          </ul>
          <p className="mt-2">
            이메일, 전화번호, 주민등록번호 등 민감한 개인정보는 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">2. 개인정보 수집 및 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>후기 게시 및 커뮤니티 서비스 운영</li>
            <li>이용자 식별 및 부정 이용 방지</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">3. 개인정보 보유 및 이용기간</h2>
          <p>
            이용자가 직접 삭제 요청하거나 서비스가 종료될 때까지 보유합니다.
            관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관 후 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">4. 제3자 제공</h2>
          <p>
            수집한 개인정보는 원칙적으로 외부에 제공하지 않습니다.
            단, 법령에 의거한 수사기관의 요청이 있는 경우 예외적으로 제공할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">5. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
            후기 삭제 또는 개인정보 처리 관련 문의는 아래 이메일로 연락해 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">6. 쿠키 및 로컬스토리지</h2>
          <p>
            본 사이트는 좋아요 기능 유지를 위해 브라우저의 로컬스토리지를 사용합니다.
            이는 서버로 전송되지 않으며 이용자가 직접 브라우저 설정에서 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">7. 개인정보 보호책임자</h2>
          <p>개인정보 관련 문의: <span className="text-indigo-600">njob.community@gmail.com</span></p>
        </section>

      </div>
    </div>
  );
}
