"use client";

import { useState } from "react";
import Link from "next/link";
import ReviewCard from "@/components/ReviewCard";
import { useStore } from "@/lib/store";
import {
  ALL_HUSTLES,
  HUSTLE_CATEGORIES,
  CATEGORY_EMOJI,
  type HustleCategory,
  type SideHustle,
} from "@/lib/hustleData";

const DIFFICULTY_DOT = (d: number) => {
  const colors = ["", "bg-green-400", "bg-green-400", "bg-amber-400", "bg-orange-400", "bg-red-500"];
  const labels = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
  return { color: colors[d], label: labels[d] };
};

// ─── 히어로 ───────────────────────────────────────────────
function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const { reviews } = useStore();
  const [q, setQ] = useState("");

  return (
    <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          N잡·온라인 부업 정보 커뮤니티
        </div>

        <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-3">
          모든 부업 후기,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
            한 곳에서 확인하세요
          </span>
        </h1>
        <p className="text-indigo-300 text-sm sm:text-base mb-8">
          과장 없이, 직접 경험한 N잡러들의 현실 수익 이야기
        </p>

        {/* 검색 */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSearch(q); }}
          className="flex gap-2 max-w-xl mx-auto mb-8"
        >
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="부업 이름 검색 (예: 쿠팡파트너스, E심팔이)"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all text-sm flex-shrink-0"
          >
            검색
          </button>
        </form>

        {/* 통계 */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          {[
            { value: `${ALL_HUSTLES.length}+`, label: "등록 부업" },
            { value: `${reviews.length}+`, label: "실제 후기" },
            { value: "100%", label: "무료 이용" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs text-indigo-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 부업 카드 ─────────────────────────────────────────────
function HustleCard({ hustle }: { hustle: SideHustle }) {
  const { reviews } = useStore();
  const reviewCount = reviews.filter((r) => r.hustle_id === hustle.id).length;
  const dot = DIFFICULTY_DOT(hustle.difficulty);

  return (
    <Link
      href={`/hustle/${hustle.id}`}
      className="card p-4 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{hustle.emoji}</span>
        <div className="flex gap-1">
          {hustle.isHot && (
            <span className="text-[10px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">🔥 HOT</span>
          )}
          {hustle.isNew && !hustle.isHot && (
            <span className="text-[10px] font-bold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">NEW</span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
          {hustle.name}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{hustle.category}</p>
      </div>

      <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-600">{hustle.incomeRange}</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${dot.color}`} />
            <span className="text-[10px] text-slate-400">{dot.label}</span>
          </div>
          {reviewCount > 0 && (
            <span className="text-[10px] text-indigo-400 font-semibold">후기 {reviewCount}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── 부업 탐색 탭 ──────────────────────────────────────────
function DirectoryTab({ searchQuery }: { searchQuery: string }) {
  const [activeCategory, setActiveCategory] = useState<"all" | HustleCategory>("all");
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const filtered = ALL_HUSTLES.filter((h) => {
    const matchCat = activeCategory === "all" || h.category === activeCategory;
    const q = (localSearch || searchQuery).toLowerCase();
    const matchSearch = !q || h.name.toLowerCase().includes(q) || h.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* 검색 */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="부업 이름으로 검색..."
          className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
        />
        {localSearch && (
          <button onClick={() => setLocalSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl">×</button>
        )}
      </div>

      {/* 카테고리 */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}
        >
          전체 {ALL_HUSTLES.length}
        </button>
        {HUSTLE_CATEGORIES.map((cat) => {
          const count = ALL_HUSTLES.filter((h) => h.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}
            >
              {CATEGORY_EMOJI[cat]} {cat} {count}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-500 mb-2">조건에 맞는 부업이 없어요</p>
          <button onClick={() => { setLocalSearch(""); setActiveCategory("all"); }} className="text-sm text-indigo-500 hover:underline">
            초기화하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((h) => <HustleCard key={h.id} hustle={h} />)}
        </div>
      )}
    </div>
  );
}

// ─── 후기 피드 탭 ──────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "latest" as const, label: "최신순" },
  { value: "likes" as const, label: "공감순" },
  { value: "income" as const, label: "고수익순" },
];

function ReviewTab() {
  const { filteredReviews, loading, sortBy, setSort, searchQuery, setSearch } = useStore();

  return (
    <div>
      {/* 검색 + 정렬 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="후기 검색..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 bg-white"
          />
          {searchQuery && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">×</button>
          )}
        </div>
        <div className="flex gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${sortBy === opt.value ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 w-3/4 bg-slate-100 rounded mb-2" />
              <div className="h-4 w-full bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">{searchQuery ? "🔍" : "📭"}</p>
          <p className="font-bold text-slate-700 mb-2">
            {searchQuery ? `"${searchQuery}"에 대한 후기가 없어요` : "아직 후기가 없어요"}
          </p>
          <p className="text-sm text-slate-400 mb-6">첫 번째 후기를 작성해보세요!</p>
          <Link href="/write" className="btn-primary inline-block">후기 쓰기 →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 파트너 배너 ───────────────────────────────────────────
function PartnerBanner() {
  return (
    <section className="bg-slate-900 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <a
          href="https://blog.naver.com/leted1968/224072273734"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center gap-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/40 rounded-2xl p-5 sm:p-6 transition-all group"
        >
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 p-2">
            <img src="/partners/ntelecom.png" alt="N텔레콤" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-1.5">
              <span className="text-xs font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-full">⭐ 파이프라인 부업</span>
              <span className="text-xs font-bold bg-green-400/20 text-green-300 border border-green-400/30 px-2 py-0.5 rounded-full">💰 매달 자동 수수료</span>
            </div>
            <h3 className="text-base font-black text-white group-hover:text-yellow-300 transition-colors">N텔레콤 (앤텔레콤)</h3>
            <p className="text-slate-400 text-xs mt-0.5">한 번 구축하면 매달 자동으로 쌓이는 통신 수수료 파이프라인</p>
          </div>
          <span className="text-yellow-400 font-bold text-sm flex-shrink-0 group-hover:translate-x-1 transition-transform">자세히 →</span>
        </a>
        <p className="text-center text-slate-600 text-xs mt-4">파트너 입점 문의는 카카오톡 채널로 연락주세요</p>
      </div>
    </section>
  );
}

// ─── 메인 ──────────────────────────────────────────────────
type Tab = "directory" | "reviews";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("directory");
  const [heroSearch, setHeroSearch] = useState("");

  function handleHeroSearch(q: string) {
    setHeroSearch(q);
    setActiveTab("directory");
    setTimeout(() => {
      document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div>
      <HeroSection onSearch={handleHeroSearch} />

      {/* 탭 네비게이션 */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex">
            {([
              { id: "directory", label: "📋 부업 탐색" },
              { id: "reviews", label: "💬 후기 피드" },
            ] as { id: Tab; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center pr-1">
              <Link href="/write" className="btn-primary text-xs py-2 px-4">
                + 후기 쓰기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div id="main-content" className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === "directory" && <DirectoryTab searchQuery={heroSearch} />}
        {activeTab === "reviews" && <ReviewTab />}
      </div>

      <PartnerBanner />
    </div>
  );
}
