"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import SearchModal from "./SearchModal";

export default function BottomNav() {
  const { activeTab, setActiveTab } = useStore();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            onClick={() => setActiveTab("directory")}
            aria-label="홈"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              isHome && activeTab === "directory" ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            <span className="text-xl" aria-hidden="true">🏠</span>
            <span className="text-[10px] font-medium">홈</span>
          </Link>

          {/* 검색 버튼 */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="검색"
            className="flex flex-col items-center gap-0.5 px-3 py-1 transition-colors text-slate-500 hover:text-indigo-600"
          >
            <span className="text-xl" aria-hidden="true">🔍</span>
            <span className="text-[10px] font-medium">검색</span>
          </button>

          <Link href="/write" aria-label="후기 쓰기" className="flex flex-col items-center gap-0.5 px-3 py-1">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg -mt-5 active:scale-95 transition-transform">
              <span className="text-xl" aria-hidden="true">✏️</span>
            </div>
            <span className="text-[10px] font-medium text-indigo-600 mt-0.5">후기 쓰기</span>
          </Link>

          <Link
            href="/recommend"
            aria-label="부업 추천"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              pathname === "/recommend" ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            <span className="text-xl" aria-hidden="true">🎯</span>
            <span className="text-[10px] font-medium">추천</span>
          </Link>

          <Link
            href="/profile"
            aria-label="내 후기"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              pathname === "/profile" ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            <span className="text-xl" aria-hidden="true">👤</span>
            <span className="text-[10px] font-medium">내 후기</span>
          </Link>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
