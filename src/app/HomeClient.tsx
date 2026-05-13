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
import type { DifficultyFilter, SatisfactionFilter } from "@/lib/store";
import { INCOME_LABELS, type IncomeRange } from "@/lib/types";

const DIFFICULTY_LABEL = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
const DIFFICULTY_COLOR = ["", "text-green-500", "text-green-500", "text-amber-500", "text-orange-500", "text-red-500"];

// 프리셋: 자주 쓰는 필터 조합
const FILTER_PRESETS = [
  {
    label: "🌱 초보자 추천",
    desc: "쉬움이하 · 만족도4+",
    income: "" as IncomeRange | "",
    difficulty: 2 as DifficultyFilter,
    satisfaction: 4 as SatisfactionFilter,
    category: "all" as HustleCategory | "all",
  },
  {
    label: "💰 고수익 부업",
    desc: "100만↑ · 만족도3+",
    income: "over_100" as IncomeRange | "",
    difficulty: 0 as DifficultyFilter,
    satisfaction: 3 as SatisfactionFilter,
    category: "all" as HustleCategory | "all",
  },
  {
    label: "📱 SNS·콘텐츠",
    desc: "SNS 카테고리 전체",
    income: "" as IncomeRange | "",
    difficulty: 0 as DifficultyFilter,
    satisfaction: 0 as SatisfactionFilter,
    category: "SNS·콘텐츠" as HustleCategory | "all",
  },
  {
    label: "⭐ 만족도 최상",
    desc: "만족도 5점만",
    income: "" as IncomeRange | "",
    difficulty: 0 as DifficultyFilter,
    satisfaction: 5 as SatisfactionFilter,
    category: "all" as HustleCategory | "all",
  },
];

// ─── 히어로 ───────────────────────────────────────────────
function HeroSection() {
  const { reviews } = useStore();

  return (
    <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 text-center">
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
        <p className="text-indigo-300 text-sm sm:text-base mb-7">
          과장 없이, 직접 경험한 N잡러들의 현실 수익 이야기
        </p>

        <div className="flex items-center justify-center gap-6 sm:gap-12">
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

  if (hustle.isTerminated) {
    return (
      <Link
        href={`/hustle/${hustle.id}`}
        className="card p-4 opacity-50 grayscale hover:opacity-70 transition-all duration-200 group flex flex-col gap-3 border-dashed"
      >
        <div className="flex items-start justify-between">
          <span className="text-3xl leading-none">{hustle.emoji}</span>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">서비스 종료</span>
        </div>
        <div>
          <p className="text-base font-black text-slate-400 leading-none line-through">{hustle.incomeRange}</p>
          <p className="text-xs text-slate-300 mt-0.5">예상 수익</p>
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-500 leading-snug">{hustle.name}</h3>
          <p className="text-xs text-slate-300 mt-0.5">{hustle.category}</p>
        </div>
        <div className="mt-auto pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">📛 서비스 종료됨</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/hustle/${hustle.id}`}
      className="card p-4 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group flex flex-col gap-3"
    >
      {/* 상단: 이모지 + 뱃지 */}
      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none">{hustle.emoji}</span>
        <div className="flex gap-1 flex-wrap justify-end">
          {hustle.isHot && (
            <span className="text-[10px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">🔥 HOT</span>
          )}
          {hustle.isNew && !hustle.isHot && (
            <span className="text-[10px] font-bold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">NEW</span>
          )}
        </div>
      </div>

      {/* 수익 범위 — 가장 눈에 띄게 */}
      <div>
        <p className="text-base font-black text-indigo-600 leading-none">{hustle.incomeRange}</p>
        <p className="text-xs text-slate-400 mt-0.5">예상 수익</p>
      </div>

      {/* 부업명 + 카테고리 */}
      <div>
        <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
          {hustle.name}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{hustle.category}</p>
      </div>

      {/* 하단: 난이도 + 후기 수 */}
      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className={`text-xs font-medium ${DIFFICULTY_COLOR[hustle.difficulty]}`}>
          {DIFFICULTY_LABEL[hustle.difficulty]}
        </span>
        {reviewCount > 0 ? (
          <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            💬 {reviewCount}
          </span>
        ) : (
          <span className="text-[11px] text-slate-300">후기 없음</span>
        )}
      </div>
    </Link>
  );
}

// ─── 부업 탐색 탭 ──────────────────────────────────────────
function DirectoryTab() {
  const [activeCategory, setActiveCategory] = useState<"all" | HustleCategory>("all");
  const [search, setSearch] = useState("");

  const filtered = ALL_HUSTLES.filter((h) => {
    const matchCat = activeCategory === "all" || h.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || h.name.toLowerCase().includes(q) || h.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* 검색 */}
      <div className="relative mb-4">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="부업 이름으로 검색... (예: 쿠팡파트너스)"
          className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* 카테고리 — 가로 스크롤 한 줄 */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
          }`}
        >
          전체 {ALL_HUSTLES.length}
        </button>
        {HUSTLE_CATEGORIES.map((cat) => {
          const count = ALL_HUSTLES.filter((h) => h.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
              }`}
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
          <button
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
            className="text-sm text-indigo-500 hover:underline"
          >
            초기화하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filtered.map((h) => <HustleCard key={h.id} hustle={h} />)}
        </div>
      )}
    </div>
  );
}

// ─── 후기 피드 탭 ──────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "latest" as const, label: "최신순" },
  { value: "likes" as const, label: "좋아요순" },
  { value: "satisfaction" as const, label: "평점순" },
  { value: "income" as const, label: "고수익순" },
];

const INCOME_FILTER_OPTIONS: { value: IncomeRange | ""; label: string }[] = [
  { value: "", label: "전체" },
  { value: "under_10", label: "10만↓" },
  { value: "10_to_30", label: "10~30만" },
  { value: "30_to_50", label: "30~50만" },
  { value: "50_to_100", label: "50~100만" },
  { value: "over_100", label: "100만↑" },
];

const DIFFICULTY_FILTER_OPTIONS: { value: DifficultyFilter; label: string; color: string }[] = [
  { value: 0, label: "전체", color: "border-slate-200 text-slate-500" },
  { value: 2, label: "쉬움 이하", color: "border-green-200 text-green-600" },
  { value: 3, label: "보통 이하", color: "border-amber-200 text-amber-600" },
  { value: 4, label: "어려운 부업", color: "border-red-200 text-red-600" },
];

const SATISFACTION_FILTER_OPTIONS: { value: SatisfactionFilter; label: string }[] = [
  { value: 0, label: "전체" },
  { value: 3, label: "★3 이상" },
  { value: 4, label: "★4 이상" },
  { value: 5, label: "★5만" },
];

const GROUPS_PER_PAGE = 8;

function ReviewTab() {
  const {
    reviews, filteredReviews, loading, sortBy, setSort, searchQuery, setSearch,
    filterReviewCategory, setFilterReviewCategory,
    filterIncome, setFilterIncome,
    filterDifficulty, setFilterDifficulty,
    filterSatisfaction, setFilterSatisfaction,
    activeFilterCount, resetFilters,
  } = useStore();
  const [visibleGroups, setVisibleGroups] = useState(GROUPS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);

  // 각 필터 옵션별 매칭 후기 수 계산 (현재 다른 필터 조건 유지한 채)
  const countForIncome = (income: IncomeRange | "") =>
    reviews.filter((r) => {
      const catOk = filterReviewCategory === "all" || ALL_HUSTLES.find((h) => h.id === r.hustle_id)?.category === filterReviewCategory;
      const diffOk = !filterDifficulty || (filterDifficulty === 4 ? r.difficulty >= 4 : r.difficulty <= filterDifficulty);
      const satOk = !filterSatisfaction || r.satisfaction >= filterSatisfaction;
      const incOk = !income || r.income_range === income;
      return catOk && diffOk && satOk && incOk;
    }).length;

  const countForDifficulty = (diff: DifficultyFilter) =>
    reviews.filter((r) => {
      const catOk = filterReviewCategory === "all" || ALL_HUSTLES.find((h) => h.id === r.hustle_id)?.category === filterReviewCategory;
      const incOk = !filterIncome || r.income_range === filterIncome;
      const satOk = !filterSatisfaction || r.satisfaction >= filterSatisfaction;
      const diffOk = !diff || (diff === 4 ? r.difficulty >= 4 : r.difficulty <= diff);
      return catOk && incOk && satOk && diffOk;
    }).length;

  const countForSatisfaction = (sat: SatisfactionFilter) =>
    reviews.filter((r) => {
      const catOk = filterReviewCategory === "all" || ALL_HUSTLES.find((h) => h.id === r.hustle_id)?.category === filterReviewCategory;
      const incOk = !filterIncome || r.income_range === filterIncome;
      const diffOk = !filterDifficulty || (filterDifficulty === 4 ? r.difficulty >= 4 : r.difficulty <= filterDifficulty);
      const satOk = !sat || r.satisfaction >= sat;
      return catOk && incOk && diffOk && satOk;
    }).length;

  // 검색/정렬/필터 변경 시 페이지 초기화
  const handleSearch = (q: string) => { setSearch(q); setVisibleGroups(GROUPS_PER_PAGE); };
  const handleSort = (s: "latest" | "likes" | "income" | "satisfaction") => { setSort(s); setVisibleGroups(GROUPS_PER_PAGE); };
  const handleReset = () => { resetFilters(); setVisibleGroups(GROUPS_PER_PAGE); };
  const applyPreset = (preset: typeof FILTER_PRESETS[number]) => {
    setFilterReviewCategory(preset.category);
    setFilterIncome(preset.income);
    setFilterDifficulty(preset.difficulty);
    setFilterSatisfaction(preset.satisfaction);
    setVisibleGroups(GROUPS_PER_PAGE);
  };

  // hustle_id 기준으로 그룹핑, 그룹 내 순서는 정렬 기준 유지
  const grouped = filteredReviews.reduce<
    { hustleId: string; hustleName: string; emoji: string; reviews: typeof filteredReviews }[]
  >((acc, review) => {
    const existing = acc.find((g) => g.hustleId === review.hustle_id);
    const hustle = ALL_HUSTLES.find((h) => h.id === review.hustle_id);
    if (existing) {
      existing.reviews.push(review);
    } else {
      acc.push({
        hustleId: review.hustle_id,
        hustleName: review.hustle_name,
        emoji: hustle?.emoji ?? "💼",
        reviews: [review],
      });
    }
    return acc;
  }, []);

  const visibleGroupsList = grouped.slice(0, visibleGroups);
  const hasMore = grouped.length > visibleGroups;

  return (
    <div>
      {/* 검색 + 정렬 + 필터 토글 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="후기 검색..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex gap-1">
          {/* 필터 버튼 */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
              showFilters || activeFilterCount > 0
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-400"
            }`}
          >
            🎚 필터
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
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

      {/* 필터 패널 */}
      {showFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 space-y-4">
          {/* 프리셋 빠른 선택 */}
          <div>
            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">⚡ 빠른 선택</p>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_PRESETS.map((preset) => {
                const isActive =
                  filterReviewCategory === preset.category &&
                  filterIncome === preset.income &&
                  filterDifficulty === preset.difficulty &&
                  filterSatisfaction === preset.satisfaction;
                return (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className={`flex flex-col items-start px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                    }`}
                  >
                    <span className="font-bold">{preset.label}</span>
                    <span className={`text-[10px] ${isActive ? "text-indigo-200" : "text-slate-400"}`}>{preset.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200" />

          {/* 카테고리 */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">🗂 카테고리</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setFilterReviewCategory("all"); setVisibleGroups(GROUPS_PER_PAGE); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterReviewCategory === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                전체
              </button>
              {HUSTLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setFilterReviewCategory(cat); setVisibleGroups(GROUPS_PER_PAGE); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filterReviewCategory === cat
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {CATEGORY_EMOJI[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 수입범위 */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">💰 수입범위</p>
            <div className="flex flex-wrap gap-1.5">
              {INCOME_FILTER_OPTIONS.map((opt) => {
                const cnt = countForIncome(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setFilterIncome(opt.value); setVisibleGroups(GROUPS_PER_PAGE); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      filterIncome === opt.value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : cnt === 0
                        ? "bg-white border-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                    }`}
                  >
                    {opt.label}
                    {opt.value !== "" && <span className={`ml-1 ${filterIncome === opt.value ? "text-indigo-200" : "text-slate-400"}`}>({cnt})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 난이도 */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">⚡ 난이도</p>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTY_FILTER_OPTIONS.map((opt) => {
                const cnt = countForDifficulty(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setFilterDifficulty(opt.value); setVisibleGroups(GROUPS_PER_PAGE); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      filterDifficulty === opt.value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : cnt === 0
                        ? "bg-white border-slate-100 text-slate-300 cursor-not-allowed"
                        : `bg-white ${opt.color} hover:border-indigo-300`
                    }`}
                  >
                    {opt.label}
                    {opt.value !== 0 && <span className={`ml-1 ${filterDifficulty === opt.value ? "text-indigo-200" : "text-slate-400"}`}>({cnt})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 만족도 */}
          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">⭐ 최소 만족도</p>
            <div className="flex flex-wrap gap-1.5">
              {SATISFACTION_FILTER_OPTIONS.map((opt) => {
                const cnt = countForSatisfaction(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => { setFilterSatisfaction(opt.value); setVisibleGroups(GROUPS_PER_PAGE); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      filterSatisfaction === opt.value
                        ? "bg-amber-500 text-white border-amber-500"
                        : cnt === 0
                        ? "bg-white border-slate-100 text-slate-300 cursor-not-allowed"
                        : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
                    }`}
                  >
                    {opt.label}
                    {opt.value !== 0 && <span className={`ml-1 ${filterSatisfaction === opt.value ? "text-amber-200" : "text-slate-400"}`}>({cnt})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 활성 필터 요약 + 초기화 */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {activeFilterCount > 0
                ? `${activeFilterCount}개 필터 적용 중 · `
                : ""}
              <span className="font-semibold text-indigo-600">{filteredReviews.length}개</span> 후기
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                전체 초기화 ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 활성 필터 칩 (패널 닫혔을 때도 표시) */}
      {!showFilters && activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filterReviewCategory !== "all" && (
            <span className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium">
              🗂 {filterReviewCategory}
              <button onClick={() => setFilterReviewCategory("all")} className="text-violet-400 hover:text-violet-700 ml-0.5">✕</button>
            </span>
          )}
          {filterIncome && (
            <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
              💰 {INCOME_LABELS[filterIncome]}
              <button onClick={() => setFilterIncome("")} className="text-indigo-400 hover:text-indigo-700 ml-0.5">✕</button>
            </span>
          )}
          {filterDifficulty > 0 && (
            <span className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
              ⚡ {DIFFICULTY_FILTER_OPTIONS.find((o) => o.value === filterDifficulty)?.label}
              <button onClick={() => setFilterDifficulty(0)} className="text-indigo-400 hover:text-indigo-700 ml-0.5">✕</button>
            </span>
          )}
          {filterSatisfaction > 0 && (
            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
              ⭐ {SATISFACTION_FILTER_OPTIONS.find((o) => o.value === filterSatisfaction)?.label}
              <button onClick={() => setFilterSatisfaction(0)} className="text-amber-400 hover:text-amber-700 ml-0.5">✕</button>
            </span>
          )}
          <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 transition-colors">
            전체 초기화
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i}>
              <div className="h-6 w-40 bg-slate-100 rounded-lg mb-3 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2].map((j) => (
                  <div key={j} className="card p-5 animate-pulse">
                    <div className="h-5 w-3/4 bg-slate-100 rounded mb-3" />
                    <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="card p-10 text-center">
          {searchQuery ? (
            <>
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-slate-700 mb-1">&ldquo;{searchQuery}&rdquo; 후기가 없어요</p>
              <p className="text-sm text-slate-400 mb-5">직접 경험이 있으시다면 첫 번째로 남겨보세요</p>
              <Link href={`/write`} className="btn-primary inline-block text-sm">
                {searchQuery} 후기 쓰기 →
              </Link>
            </>
          ) : (
            <>
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-slate-700 mb-1">아직 후기가 없어요</p>
              <p className="text-sm text-slate-400 mb-5">부업을 경험해보셨다면 첫 번째 후기를 남겨보세요</p>
              <Link href="/write" className="btn-primary inline-block text-sm">후기 남기기 →</Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {visibleGroupsList.map((group) => (
            <div key={group.hustleId}>
              {/* 부업 섹션 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/hustle/${group.hustleId}`}
                  className="flex items-center gap-2 group"
                >
                  <span className="text-xl">{group.emoji}</span>
                  <span className="font-black text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                    {group.hustleName}
                  </span>
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">
                    {group.reviews.length}개
                  </span>
                </Link>
                <Link
                  href={`/hustle/${group.hustleId}`}
                  className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  부업 정보 →
                </Link>
              </div>
              {/* 해당 부업의 후기 카드들 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} hideHustleTag />
                ))}
              </div>
            </div>
          ))}

          {/* 더 보기 버튼 */}
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleGroups((n) => n + GROUPS_PER_PAGE)}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 text-sm font-semibold px-6 py-3 rounded-xl transition-all"
              >
                더 보기 ({grouped.length - visibleGroups}개 부업 남음) ↓
              </button>
            </div>
          )}
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
export default function HomeClient() {
  const { reviews, activeTab, setActiveTab } = useStore();

  return (
    <div>
      <HeroSection />

      {/* 탭 네비게이션 */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex">
            {([
              { id: "directory" as "directory" | "reviews", label: "📋 부업 탐색", badge: ALL_HUSTLES.length },
              { id: "reviews" as "directory" | "reviews", label: "💬 후기 피드", badge: reviews.length },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-5 py-4 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
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
      <div className="mx-auto max-w-6xl px-4 py-5">
        {activeTab === "directory" && <DirectoryTab />}
        {activeTab === "reviews" && <ReviewTab />}
      </div>

      <PartnerBanner />
    </div>
  );
}
