"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import { MOCK_REVIEWS } from "./mockData";
import { getStoredUser } from "./kakaoAuth";
import type { Review, ReviewInput, IncomeRange } from "./types";

interface StoreState {
  reviews: Review[];
  likedIds: Set<string>;
  filterCategory: string;
  filterHustleId: string;
  sortBy: "latest" | "likes" | "income";
  searchQuery: string;
  loading: boolean;
  activeTab: "directory" | "reviews";
  setActiveTab: (tab: "directory" | "reviews") => void;
  setFilterCategory: (cat: string) => void;
  setFilterHustleId: (id: string) => void;
  setSort: (sort: "latest" | "likes" | "income") => void;
  setSearch: (query: string) => void;
  toggleLike: (id: string) => void;
  addReview: (input: ReviewInput & { kakao_user_id?: string | null }) => Promise<Review>;
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
  const [sortBy, setSortBy] = useState<"latest" | "likes" | "income">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<"directory" | "reviews">("directory");
  const setActiveTab = useCallback((tab: "directory" | "reviews") => setActiveTabState(tab), []);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setReviews(data as Review[]);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch {
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();

    try {
      const saved = localStorage.getItem("njob_likes");
      if (saved) setLikedIds(new Set(JSON.parse(saved) as string[]));
    } catch {}

    loadKakaoLikes();
  }, []);

  async function loadKakaoLikes() {
    const kakaoUser = getStoredUser();
    if (!kakaoUser) return;
    try {
      const { data: userLikes } = await supabase
        .from("user_likes")
        .select("review_id")
        .eq("user_id", String(kakaoUser.id));
      if (userLikes && userLikes.length > 0) {
        const dbIds = (userLikes as { review_id: string }[]).map((l) => l.review_id);
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

  const setSort = useCallback((sort: "latest" | "likes" | "income") => setSortBy(sort), []);
  const setSearch = useCallback((query: string) => setSearchQuery(query), []);

  const toggleLike = useCallback(
    async (id: string) => {
      const isLiked = likedIds.has(id);
      const delta = isLiked ? -1 : 1;

      setLikedIds((prev) => {
        const next = new Set(prev);
        if (isLiked) { next.delete(id); } else { next.add(id); }
        localStorage.setItem("njob_likes", JSON.stringify([...next]));
        return next;
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, likes: r.likes + delta } : r))
      );

      try {
        const current = reviews.find((r) => r.id === id);
        if (current) {
          await supabase
            .from("reviews")
            .update({ likes: current.likes + delta })
            .eq("id", id);
        }
      } catch {}

      // 카카오 로그인 유저: user_likes 테이블 동기화
      const kakaoUser = getStoredUser();
      if (kakaoUser) {
        try {
          if (isLiked) {
            await supabase
              .from("user_likes")
              .delete()
              .match({ user_id: String(kakaoUser.id), review_id: id });
          } else {
            await supabase
              .from("user_likes")
              .upsert({ user_id: String(kakaoUser.id), review_id: id });
          }
        } catch {}
      }
    },
    [likedIds, reviews]
  );

  const addReview = useCallback(async (input: ReviewInput & { kakao_user_id?: string | null }): Promise<Review> => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({ ...input, likes: 0 })
        .select()
        .single();

      if (error) throw error;
      const newReview = data as Review;
      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    } catch {
      const newReview: Review = {
        ...input,
        id: `local_${Date.now()}`,
        created_at: new Date().toISOString(),
        likes: 0,
      };
      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    }
  }, []);

  const getReviewById = useCallback(
    (id: string) => reviews.find((r) => r.id === id),
    [reviews]
  );

  const getReviewsByHustle = useCallback(
    (hustleId: string) => reviews.filter((r) => r.hustle_id === hustleId),
    [reviews]
  );

  // import HUSTLE_MAP lazily to get category
  const q = searchQuery.trim().toLowerCase();
  const filteredReviews = reviews
    .filter((r) => {
      if (filterHustleId !== "all") return r.hustle_id === filterHustleId;
      return true;
    })
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
      return 0;
    });

  return (
    <StoreContext.Provider
      value={{
        reviews,
        likedIds,
        filterCategory,
        filterHustleId,
        sortBy,
        searchQuery,
        loading,
        activeTab,
        setActiveTab,
        setFilterCategory,
        setFilterHustleId,
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
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
