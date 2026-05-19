"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { getStoredUser } from "./kakaoAuth";
import { ALL_HUSTLES } from "./hustleData";
import type { Review, ReviewInput, IncomeRange } from "./types";
import type { HustleCategory } from "./hustleData";

// 0 = 전체, 2 = 쉬움이하(<=2), 3 = 보통이하(<=3), 4 = 어려운부업(>=4)
export type DifficultyFilter = 0 | 2 | 3 | 4;
export type SatisfactionFilter = 0 | 1 | 2 | 3 | 4 | 5; // 0 = 전체 (min)

interface StoreState {
  reviews: Review[];
  likedIds: Set<string>;
  filterCategory: string;
  filterHustleId: string;
  filterReviewCategory: HustleCategory | "all";
  filterIncome: IncomeRange | "";
  filterDifficulty: DifficultyFilter;
  filterSatisfaction: SatisfactionFilter;
  sortBy: "latest" | "likes" | "income" | "satisfaction";
  searchQuery: string;
  loading: boolean;
  fetchError: boolean;
  activeTab: "directory" | "reviews";
  activeFilterCount: number;
  setActiveTab: (tab: "directory" | "reviews") => void;
  setFilterCategory: (cat: string) => void;
  setFilterHustleId: (id: string) => void;
  setFilterReviewCategory: (cat: HustleCategory | "all") => void;
  setFilterIncome: (v: IncomeRange | "") => void;
  setFilterDifficulty: (v: DifficultyFilter) => void;
  setFilterSatisfaction: (v: SatisfactionFilter) => void;
  resetFilters: () => void;
  setSort: (sort: "latest" | "likes" | "income" | "satisfaction") => void;
  setSearch: (query: string) => void;
  toggleLike: (id: string) => void;
  addReview: (input: ReviewInput & { kakao_user_id?: string | null; anon_password?: string }) => Promise<Review>;
  getReviewById: (id: string) => Review | undefined;
  getReviewsByHustle: (hustleId: string) => Review[];
  filteredReviews: Review[];
}

const INCOME_ORDER: IncomeRange[] = ["under_10", "10_to_30", "30_to_50", "50_to_100", "over_100"];

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategoryState] = useState("all");
  const [filterHustleId, setFilterHustleIdState] = useState("all");
  const [filterReviewCategory, setFilterReviewCategoryState] = useState<HustleCategory | "all">("all");
  const [filterIncome, setFilterIncomeState] = useState<IncomeRange | "">("");
  const [filterDifficulty, setFilterDifficultyState] = useState<DifficultyFilter>(0);
  const [filterSatisfaction, setFilterSatisfactionState] = useState<SatisfactionFilter>(0);
  const [sortBy, setSortBy] = useState<"latest" | "likes" | "income" | "satisfaction">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [activeTab, setActiveTabState] = useState<"directory" | "reviews">("directory");
  const setActiveTab = useCallback((tab: "directory" | "reviews") => setActiveTabState(tab), []);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) throw new Error("fetch failed");
        const data: Review[] = await res.json();
        setReviews(Array.isArray(data) ? data : []);
        setFetchError(false);
      } catch {
        setReviews([]);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();

    // localStorage에서 좋아요 목록 복원
    try {
      const saved = localStorage.getItem("njob_likes");
      if (saved) setLikedIds(new Set(JSON.parse(saved) as string[]));
    } catch {}

    // 카카오 로그인 유저: 서버에서 좋아요 목록 동기화
    loadKakaoLikes();
  }, []);

  async function loadKakaoLikes() {
    const kakaoUser = getStoredUser();
    if (!kakaoUser) return;
    try {
      // 서버가 쿠키로 본인 인증 — kakao_user_id 파라미터 불필요
      const res = await fetch("/api/profile/likes");
      if (!res.ok) return;
      const dbIds: string[] = await res.json();
      if (dbIds.length > 0) {
        setLikedIds((prev) => {
          const merged = new Set([...prev, ...dbIds]);
          localStorage.setItem("njob_likes", JSON.stringify([...merged]));
          return merged;
        });
      }
    } catch {}
  }

  const setFilterCategory = useCallback((cat: string) => {
    setFilterCategoryState(cat);
    setFilterHustleIdState("all");
  }, []);

  const setFilterHustleId = useCallback((id: string) => {
    setFilterHustleIdState(id);
    setFilterCategoryState("all");
  }, []);

  const setFilterReviewCategory = useCallback((cat: HustleCategory | "all") => setFilterReviewCategoryState(cat), []);
  const setFilterIncome = useCallback((v: IncomeRange | "") => setFilterIncomeState(v), []);
  const setFilterDifficulty = useCallback((v: DifficultyFilter) => setFilterDifficultyState(v), []);
  const setFilterSatisfaction = useCallback((v: SatisfactionFilter) => setFilterSatisfactionState(v), []);

  const resetFilters = useCallback(() => {
    setFilterReviewCategoryState("all");
    setFilterIncomeState("");
    setFilterDifficultyState(0);
    setFilterSatisfactionState(0);
    setSearchQuery("");
  }, []);

  const setSort = useCallback((sort: "latest" | "likes" | "income" | "satisfaction") => setSortBy(sort), []);
  const setSearch = useCallback((query: string) => setSearchQuery(query), []);

  const toggleLike = useCallback(
    async (id: string) => {
      const isLiked = likedIds.has(id);
      const action = isLiked ? "unlike" : "like";
      const delta = isLiked ? -1 : 1;

      // 낙관적 업데이트 (UI 즉시 반영)
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (isLiked) { next.delete(id); } else { next.add(id); }
        localStorage.setItem("njob_likes", JSON.stringify([...next]));
        return next;
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: r.likes + delta } : r))
      );

      // 서버 동기화 — 실패 시 롤백
      try {
        const kakaoUser = getStoredUser();
        const res = await fetch(`/api/reviews/${id}/like`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            kakao_user_id: kakaoUser ? String(kakaoUser.id) : undefined,
          }),
        });
        if (!res.ok) throw new Error("like sync failed");
      } catch (err) {
        // 서버 동기화 실패 → 낙관적 업데이트 롤백
        console.error("좋아요 동기화 실패:", err);
        setLikedIds((prev) => {
          const rolled = new Set(prev);
          if (isLiked) { rolled.add(id); } else { rolled.delete(id); }
          localStorage.setItem("njob_likes", JSON.stringify([...rolled]));
          return rolled;
        });
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, likes: r.likes - delta } : r))
        );
      }
    },
    [likedIds]
  );

  const addReview = useCallback(
    async (input: ReviewInput & { kakao_user_id?: string | null; anon_password?: string }): Promise<Review> => {
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? "서버 오류");
        }
        const newReview: Review = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        return newReview;
      } catch (e) {
        // 오프라인 등 실패 시 로컬 임시 등록
        const newReview: Review = {
          ...input,
          id: `local_${Date.now()}`,
          created_at: new Date().toISOString(),
          likes: 0,
        };
        setReviews((prev) => [newReview, ...prev]);
        throw e; // write 페이지에서 에러 처리할 수 있도록 rethrow
      }
    },
    []
  );

  const getReviewById = useCallback(
    (id: string) => reviews.find((r) => r.id === id),
    [reviews]
  );

  const getReviewsByHustle = useCallback(
    (hustleId: string) => reviews.filter((r) => r.hustle_id === hustleId),
    [reviews]
  );

  const activeFilterCount =
    (filterReviewCategory !== "all" ? 1 : 0) +
    (filterIncome ? 1 : 0) +
    (filterDifficulty ? 1 : 0) +
    (filterSatisfaction ? 1 : 0);

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reviews
      .filter((r) => {
        if (filterHustleId !== "all") return r.hustle_id === filterHustleId;
        return true;
      })
      .filter((r) => {
        if (filterReviewCategory === "all") return true;
        const hustle = ALL_HUSTLES.find((h) => h.id === r.hustle_id);
        return hustle?.category === filterReviewCategory;
      })
      .filter((r) => !filterIncome || r.income_range === filterIncome)
      .filter((r) => {
        if (!filterDifficulty) return true;
        if (filterDifficulty === 4) return r.difficulty >= 4;
        return r.difficulty <= filterDifficulty;
      })
      .filter((r) => !filterSatisfaction || r.satisfaction >= filterSatisfaction)
      .filter((r) => {
        if (q === "") return true;
        return (
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          r.nickname.toLowerCase().includes(q) ||
          r.hustle_name.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "latest")
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === "likes") return b.likes - a.likes;
        if (sortBy === "income")
          return INCOME_ORDER.indexOf(b.income_range) - INCOME_ORDER.indexOf(a.income_range);
        if (sortBy === "satisfaction") return b.satisfaction - a.satisfaction;
        return 0;
      });
  }, [reviews, filterHustleId, filterReviewCategory, filterIncome, filterDifficulty, filterSatisfaction, searchQuery, sortBy]);

  return (
    <StoreContext.Provider
      value={{
        reviews,
        likedIds,
        filterCategory,
        filterHustleId,
        filterReviewCategory,
        filterIncome,
        filterDifficulty,
        filterSatisfaction,
        sortBy,
        searchQuery,
        loading,
        fetchError,
        activeTab,
        activeFilterCount,
        setActiveTab,
        setFilterCategory,
        setFilterHustleId,
        setFilterReviewCategory,
        setFilterIncome,
        setFilterDifficulty,
        setFilterSatisfaction,
        resetFilters,
        setSort,
        setSearch,
        toggleLike,
        addReview,
        getReviewById,
        getReviewsByHustle,
        filteredReviews,
      }}
    >
      {children}
      {/* 후기 데이터 로드 실패 시 전역 토스트 */}
      {fetchError && !loading && (
        <div
          role="alert"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-slate-800 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg"
        >
          <span>⚠️</span>
          <span>후기 데이터를 불러오지 못했어요.</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-1 underline underline-offset-2 text-indigo-300 hover:text-white transition-colors"
          >
            새로고침
          </button>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
