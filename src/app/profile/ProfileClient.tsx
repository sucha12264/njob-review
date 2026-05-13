"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredUser, type KakaoUser } from "@/lib/kakaoAuth";
import type { Review } from "@/lib/types";
import { INCOME_LABELS } from "@/lib/types";
import ReviewCard from "@/components/ReviewCard";

type ProfileTab = "my" | "liked";

export default function ProfileClient() {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [likedReviews, setLikedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedLoading, setLikedLoading] = useState(false);
  const [tab, setTab] = useState<ProfileTab>("my");

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    if (u) {
      loadMyReviews(u);
    } else {
      setLoading(false);
    }
  }, []);

  // 좋아요 탭 전환 시 로드
  useEffect(() => {
    if (tab === "liked" && user && likedReviews.length === 0 && !likedLoading) {
      loadLikedReviews(user);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  async function loadMyReviews(u: KakaoUser) {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/reviews?kakao_user_id=${String(u.id)}`);
      if (res.ok) {
        const data: Review[] = await res.json();
        setReviews(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadLikedReviews(u: KakaoUser) {
    setLikedLoading(true);
    try {
      const res = await fetch(`/api/profile/liked-reviews?kakao_user_id=${String(u.id)}`);
      if (res.ok) {
        const data: Review[] = await res.json();
        setLikedReviews(data);
      }
    } finally {
      setLikedLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">👤</p>
        <h1 className="text-xl font-black text-slate-800 mb-2">로그인이 필요해요</h1>
        <p className="text-slate-400 text-sm mb-6">카카오 로그인 후 내 후기를 확인할 수 있어요.</p>
        <Link href="/" className="btn-primary inline-block">
          홈으로 가서 로그인
        </Link>
      </div>
    );
  }

  // 수익 업데이트 nudge: 작성 후 30일 이상 된 후기
  const updateableReviews = reviews.filter((r) => {
    const daysSince = (Date.now() - new Date(r.created_at).getTime()) / 86400000;
    return daysSince >= 30;
  });

  const totalReviews = reviews.length;
  const avgSatisfaction = reviews.length
    ? (reviews.reduce((s, r) => s + r.satisfaction, 0) / reviews.length).toFixed(1)
    : null;
  const recommendCount = reviews.filter((r) => r.recommend).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      {/* 프로필 헤더 */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profileImage}
              alt={user.nickname}
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
              👤
            </div>
          )}
          <div>
            <h1 className="text-xl font-black text-slate-800">{user.nickname}</h1>
            <p className="text-slate-400 text-sm mt-0.5">N잡러</p>
          </div>
          <Link
            href="/write"
            className="ml-auto btn-primary text-sm py-2 px-4"
          >
            + 후기 쓰기
          </Link>
        </div>

        {/* 내 활동 통계 */}
        {totalReviews > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-600">{totalReviews}</div>
              <div className="text-xs text-slate-400 mt-0.5">작성한 후기</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-amber-500">{avgSatisfaction ?? "-"}</div>
              <div className="text-xs text-slate-400 mt-0.5">평균 만족도</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">{recommendCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">추천한 부업</div>
            </div>
          </div>
        )}
      </div>

      {/* 수익 업데이트 nudge */}
      {updateableReviews.length > 0 && tab === "my" && (
        <div className="card p-5 mb-6 border-2 border-amber-200 bg-amber-50/40">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📊</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 mb-0.5">수익 업데이트할 후기가 있어요!</p>
              <p className="text-sm text-slate-500 mb-3">
                {updateableReviews.length}개 후기가 작성 후 한 달 이상 지났어요.
                지금 수익이 어떻게 변했는지 알려주면 다른 분들에게 큰 도움이 됩니다.
              </p>
              <div className="space-y-2">
                {updateableReviews.slice(0, 3).map((r) => {
                  const daysSince = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000);
                  const monthsSince = Math.floor(daysSince / 30);
                  return (
                    <Link
                      key={r.id}
                      href={`/review/${r.id}`}
                      className="flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-amber-100 hover:border-amber-300 transition-colors group"
                    >
                      <span className="text-lg">{r.hustle_name.slice(0, 1)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-700 truncate group-hover:text-amber-700 transition-colors">
                          {r.hustle_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {INCOME_LABELS[r.income_range]} · {monthsSince}개월 전 작성
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        업데이트 →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탭 */}
      <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1">
        <button
          onClick={() => setTab("my")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            tab === "my"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          ✏️ 내가 쓴 후기
          {totalReviews > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "my" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
              {totalReviews}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("liked")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
            tab === "liked"
              ? "bg-white text-rose-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          ❤️ 좋아요한 후기
          {likedReviews.length > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === "liked" ? "bg-rose-100 text-rose-600" : "bg-slate-200 text-slate-500"}`}>
              {likedReviews.length}
            </span>
          )}
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {tab === "my" ? (
        loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 w-1/2 bg-slate-100 rounded mb-3" />
                <div className="h-3 w-full bg-slate-50 rounded mb-2" />
                <div className="h-3 w-2/3 bg-slate-50 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-slate-500 mb-2">아직 작성한 후기가 없어요.</p>
            <p className="text-slate-400 text-sm mb-5">경험한 부업의 솔직한 후기를 남겨보세요!</p>
            <Link href="/write" className="btn-primary inline-block">
              첫 후기 쓰기 →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )
      ) : likedLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 w-1/2 bg-slate-100 rounded mb-3" />
              <div className="h-3 w-full bg-slate-50 rounded mb-2" />
              <div className="h-3 w-2/3 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      ) : likedReviews.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">❤️</p>
          <p className="text-slate-500 mb-2">좋아요한 후기가 없어요.</p>
          <p className="text-slate-400 text-sm mb-5">마음에 드는 후기에 좋아요를 눌러보세요!</p>
          <Link href="/" className="btn-primary inline-block">
            후기 보러 가기 →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {likedReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
