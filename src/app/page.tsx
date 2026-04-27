"use client";

import { useState, useEffect } from "react";
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

const SORT_OPTIONS = [
  { value: "latest" as const, label: "최신순" },
  { value: "likes" as const, label: "공감순" },
  { value: "income" as const, label: "고수익순" },
];

const DIFFICULTY_DOT = (d: number) => {
  const colors = ["", "bg-green-400", "bg-green-400", "bg-amber-400", "bg-orange-400", "bg-red-500"];
  const labels = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
  return { color: colors[d], label: labels[d] };
};

function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const { reviews } = useStore();
  const [heroSearch, setHeroSearch] = useState("");
  const hotTags = ALL_HUSTLES.filter((h) => h.isHot).slice(0, 6);
  const recentReviews = reviews.slice(0, 3);

  const handleSearch = (q: string) => {
    onSearch(q);
    setTimeout(() => {
      document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* 좌측: 텍스트 + 검색 */}
          <div className="flex-1 min-w-0 w-full">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              N잡·온라인 부업 정보 커뮤니티
            </div>

            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2">
              모든 온라인 부업,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                한 곳에서 확인하세요
              </span>
            </h1>
            <p className="text-indigo-300 text-sm mb-5">
              과장 없이, 직접 경험한 N잡러들의 현실 수익 이야기.
            </p>

            {/* 히어로 검색창 */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(heroSearch);
              }}
              className="flex gap-2 mb-4"
            >
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="어떤 부업이 궁금하세요? (예: E심팔이, 쿠팡파트너스)"
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-5 py-3 rounded-xl transition-all text-sm flex-shrink-0"
              >
                검색
              </button>
            </form>

            {/* 인기 부업 빠른 접근 */}
            <div className="flex flex-wrap gap-2">
              <span className="text-indigo-400 text-xs self-center">🔥 인기</span>
              {hotTags.map((h) => (
                <Link
                  key={h.id}
                  href={`/hustle/${h.id}`}
                  className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors"
                >
                  {h.emoji} {h.name}
                </Link>
              ))}
            </div>

            {/* 통계 */}
            <div className="flex gap-5 mt-5">
              {[
                { value: `${ALL_HUSTLES.length}+`, label: "등록된 부업" },
                { value: `${reviews.length}+`, label: "실제 후기" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-indigo-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 최신 후기 미리보기 (데스크탑) */}
          {recentReviews.length > 0 && (
            <div className="hidden lg:flex flex-col gap-2.5 w-72 flex-shrink-0">
              <p className="text-xs text-indigo-400 font-medium mb-1">💬 방금 올라온 후기</p>
              {recentReviews.map((r) => (
                <Link
                  key={r.id}
                  href={`/review/${r.id}`}
                  className="bg-white/8 hover:bg-white/15 border border-white/10 rounded-xl p-3.5 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                      {r.hustle_name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${r.recommend ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                      {r.recommend ? "👍 추천" : "👎 비추"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors line-clamp-1">
                    {r.title}
                  </p>
                  <p className="text-xs text-indigo-300 line-clamp-1 mt-0.5">{r.content}</p>
                </Link>
              ))}
              <Link href="/write" className="text-center text-xs text-indigo-400 hover:text-white transition-colors py-1">
                + 내 후기 쓰기
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HustleCard({ hustle }: { hustle: SideHustle }) {
  const { reviews } = useStore();
  const reviewCount = reviews.filter((r) => r.hustle_id === hustle.id).length;
  const dot = DIFFICULTY_DOT(hustle.difficulty);

  return (
    <Link
      href={`/hustle/${hustle.id}`}
      className="card p-4 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl flex-shrink-0">{hustle.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight truncate">
              {hustle.name}
            </h3>
            <span className="text-xs text-slate-400">{hustle.category}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {hustle.isHot && (
            <span className="text-[10px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">
              🔥 HOT
            </span>
          )}
          {hustle.isNew && !hustle.isHot && (
            <span className="text-[10px] font-bold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{hustle.oneline}</p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{hustle.incomeRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${dot.color}`} />
            <span className="text-[10px] text-slate-400">{dot.label}</span>
          </div>
          {reviewCount > 0 && (
            <span className="text-[10px] text-indigo-500 font-semibold">
              후기 {reviewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface FeaturedPartner {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  badge: string;
  url: string;
  highlight: string;
}

const FEATURED_PARTNERS: FeaturedPartner[] = [
  {
    name: "N텔레콤 (앤텔레콤)",
    logo: "/partners/ntelecom.png",
    tagline: "한 번 구축하면 매달 자동으로 수익이 쌓이는 통신 파이프라인",
    description: "통신사 대리점 없이도 개인이 통신 상품을 판매하고 매달 지속적인 수수료 수익을 만들 수 있는 구조. 초기 셋업 후 고객이 쌓일수록 월 수익이 자동으로 늘어나는 진정한 파이프라인 부업.",
    badge: "파이프라인 부업",
    url: "https://blog.naver.com/leted1968/224072273734",
    highlight: "매달 자동 수수료 수익",
  },
];

function FeaturedSection() {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            🔥 지금 주목받는 파이프라인 부업
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            한 번 구축하면 매달 자동으로 쌓이는 수익
          </h2>
          <p className="text-slate-400 text-sm">
            시간을 팔지 않고, 시스템이 대신 일하는 파이프라인형 부업을 소개합니다
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {FEATURED_PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-400/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* 로고 */}
                <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg p-3">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* 내용 */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="text-xs font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 px-2.5 py-1 rounded-full">
                      ⭐ {partner.badge}
                    </span>
                    <span className="text-xs font-bold bg-green-400/20 text-green-300 border border-green-400/30 px-2.5 py-1 rounded-full">
                      💰 {partner.highlight}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-yellow-300 transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-slate-300 text-sm font-medium mb-3">{partner.tagline}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{partner.description}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-yellow-400 font-bold text-sm group-hover:gap-3 transition-all">
                    자세히 알아보기 →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          파이프라인 부업 입점·광고 문의는 카카오톡 채널로 연락주세요
        </p>
      </div>
    </section>
  );
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type CostFilter = "all" | "free" | "low" | "high";
type SortFilter = "default" | "difficulty-asc" | "difficulty-desc";

function DirectorySection({ externalSearch }: { externalSearch: string }) {
  const [activeCategory, setActiveCategory] = useState<"all" | HustleCategory>("all");
  const [searchQuery, setSearchQuery] = useState(externalSearch);
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("all");
  const [costFilter, setCostFilter] = useState<CostFilter>("all");
  const [sortFilter, setSortFilter] = useState<SortFilter>("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setSearchQuery(externalSearch); }, [externalSearch]);

  const filtered = ALL_HUSTLES.filter((h) => {
    const matchCat = activeCategory === "all" || h.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || h.name.toLowerCase().includes(q) || h.oneline.toLowerCase().includes(q) || h.category.toLowerCase().includes(q);
    const matchDiff =
      diffFilter === "all" ||
      (diffFilter === "easy" && h.difficulty <= 2) ||
      (diffFilter === "medium" && h.difficulty === 3) ||
      (diffFilter === "hard" && h.difficulty >= 4);
    const cost = h.startupCost ?? "";
    const matchCost =
      costFilter === "all" ||
      (costFilter === "free" && cost.includes("무료")) ||
      (costFilter === "low" && (cost.includes("소액") || cost.includes("면허") || cost.includes("이동수단") || cost.includes("가스비") || cost.includes("차량") || cost.includes("카메라") || cost.includes("장비"))) ||
      (costFilter === "high" && (cost.includes("수백만원") || cost.includes("재고") || cost.includes("투자") || cost.includes("구매 자금") || cost.includes("티켓")));
    return matchCat && matchSearch && matchDiff && matchCost;
  }).sort((a, b) => {
    if (sortFilter === "difficulty-asc") return a.difficulty - b.difficulty;
    if (sortFilter === "difficulty-desc") return b.difficulty - a.difficulty;
    return 0;
  });

  const activeFilterCount = [diffFilter !== "all", costFilter !== "all", sortFilter !== "default"].filter(Boolean).length;

  return (
    <section id="directory" className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-800 mb-1">📋 전체 부업 목록</h2>
        <p className="text-slate-400 text-sm">클릭하면 상세 정보와 실제 후기를 볼 수 있어요</p>
      </div>

      {/* 검색창 + 필터 버튼 */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="부업 이름으로 검색... (예: 쿠팡파트너스, E심팔이)"
            className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            showFilters || activeFilterCount > 0
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
          }`}
        >
          <span>⚙️</span>
          <span className="hidden sm:inline">필터</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-white text-indigo-600 rounded-full text-xs font-black flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* 상세 필터 패널 */}
      {showFilters && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">상세 필터</span>
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setDiffFilter("all"); setCostFilter("all"); setSortFilter("default"); }}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
              >
                초기화
              </button>
            )}
          </div>

          {/* 난이도 */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">난이도</p>
            <div className="flex gap-2 flex-wrap">
              {([["all","전체"], ["easy","🟢 입문"], ["medium","🟡 보통"], ["hard","🔴 고급"]] as [DifficultyFilter, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setDiffFilter(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${diffFilter === v ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 초기비용 */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">초기 비용</p>
            <div className="flex gap-2 flex-wrap">
              {([["all","전체"], ["free","💚 무자본"], ["low","💛 소액"], ["high","🔴 수백만원+"]] as [CostFilter, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setCostFilter(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${costFilter === v ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">정렬</p>
            <div className="flex gap-2 flex-wrap">
              {([["default","기본순"], ["difficulty-asc","쉬운 순"], ["difficulty-desc","어려운 순"]] as [SortFilter, string][]).map(([v, label]) => (
                <button key={v} onClick={() => setSortFilter(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${sortFilter === v ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
          전체 {ALL_HUSTLES.length}
        </button>
        {HUSTLE_CATEGORIES.map((cat) => {
          const count = ALL_HUSTLES.filter((h) => h.category === cat).length;
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
              {CATEGORY_EMOJI[cat]} {cat} {count}
            </button>
          );
        })}
      </div>

      {/* 결과 수 */}
      {(activeFilterCount > 0 || searchQuery) && (
        <p className="text-sm text-slate-500 mb-4">
          <span className="font-bold text-indigo-600">{filtered.length}개</span> 부업 조건에 맞아요
        </p>
      )}

      {/* 부업 카드 그리드 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-slate-500 mb-2">조건에 맞는 부업이 없어요</p>
          <button onClick={() => { setDiffFilter("all"); setCostFilter("all"); setSortFilter("default"); setSearchQuery(""); setActiveCategory("all"); }}
            className="text-sm text-indigo-500 hover:underline">필터 초기화하기</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((hustle) => (
            <HustleCard key={hustle.id} hustle={hustle} />
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewFeedSection() {
  const { filteredReviews, loading, sortBy, setSort, searchQuery, setSearch } = useStore();

  return (
    <section className="bg-slate-50 border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-1">💬 실제 후기 피드</h2>
            <p className="text-slate-400 text-sm">N잡러들의 솔직한 수익 인증</p>
          </div>
          <Link href="/write" className="btn-primary text-sm py-2 px-4">
            + 후기 쓰기
          </Link>
        </div>

        {/* 검색 + 정렬 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="후기 검색..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  sortBy === opt.value
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"
                }`}
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
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-24 bg-slate-100 rounded-full" />
                  <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-slate-100 rounded mb-2" />
                <div className="h-4 w-full bg-slate-100 rounded mb-1" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
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
    </section>
  );
}

export default function Home() {
  const [directorySearch, setDirectorySearch] = useState("");

  return (
    <div>
      <HeroSection onSearch={setDirectorySearch} />
      <DirectorySection externalSearch={directorySearch} />
      <FeaturedSection />
      <ReviewFeedSection />
    </div>
  );
}
