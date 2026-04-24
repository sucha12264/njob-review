"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getStoredUser, type KakaoUser } from "@/lib/kakaoAuth";
import type { Review } from "@/lib/types";
import ReviewCard from "@/components/ReviewCard";

export default function ProfilePage() {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    if (u?.nickname) loadMyReviews(u.nickname);
    else setLoading(false);
  }, []);

  async function loadMyReviews(nickname: string) {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("nickname", nickname)
      .order("created_at", { ascending: false });
    if (data) setReviews(data as Review[]);
    setLoading(false);
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

      {/* 내 후기 목록 */}
      <h2 className="font-bold text-slate-800 mb-4">✏️ 내가 쓴 후기</h2>

      {loading ? (
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
      )}
    </div>
  );
}
