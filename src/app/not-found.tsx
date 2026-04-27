import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-4xl font-black text-slate-800 mb-3">404</h1>
        <p className="text-lg font-bold text-slate-700 mb-2">페이지를 찾을 수 없어요</p>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          주소가 잘못됐거나 삭제된 페이지입니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="btn-primary px-6 py-3 text-sm"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/write"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            후기 쓰기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
