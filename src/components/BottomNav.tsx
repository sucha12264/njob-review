"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export default function BottomNav() {
  const { activeTab, setActiveTab } = useStore();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 safe-area-pb">
      <div className="flex items-center justify-around py-2">
        <Link
          href="/"
          onClick={() => setActiveTab("directory")}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
            isHome && activeTab === "directory" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">홈</span>
        </Link>

        <Link
          href="/"
          onClick={() => setActiveTab("directory")}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
            isHome && activeTab === "directory" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <span className="text-xl">📋</span>
          <span className="text-[10px] font-medium">부업목록</span>
        </Link>

        <Link href="/write" className="flex flex-col items-center gap-0.5 px-4 py-1">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg -mt-5 active:scale-95 transition-transform">
            <span className="text-xl">✏️</span>
          </div>
          <span className="text-[10px] font-medium text-indigo-600 mt-0.5">후기 쓰기</span>
        </Link>

        <Link
          href="/"
          onClick={() => setActiveTab("reviews")}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
            isHome && activeTab === "reviews" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <span className="text-xl">💬</span>
          <span className="text-[10px] font-medium">후기피드</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
            pathname === "/profile" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
          }`}
        >
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-medium">내 후기</span>
        </Link>
      </div>
    </nav>
  );
}
