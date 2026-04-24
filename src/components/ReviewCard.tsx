"use client";

import Link from "next/link";
import type { Review } from "@/lib/types";
import { INCOME_LABELS, INCOME_COLORS } from "@/lib/types";
import { useStore } from "@/lib/store";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < value ? "text-amber-400" : "text-slate-200"}`}>★</span>
      ))}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

const DIFFICULTY_LABELS = ["", "매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"];
const DIFFICULTY_COLORS = ["", "text-green-500", "text-green-400", "text-amber-500", "text-orange-500", "text-red-500"];

export default function ReviewCard({ review }: { review: Review }) {
  const { toggleLike, likedIds } = useStore();
  const isLiked = likedIds.has(review.id);

  return (
    <div className="card p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200 animate-fade-in group flex flex-col">
      {/* 상단 */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={`/hustle/${review.hustle_id}`}
            className="tag bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {review.hustle_name}
          </Link>
          <span className={`tag ${INCOME_COLORS[review.income_range]} font-semibold`}>
            💰 {INCOME_LABELS[review.income_range]}
          </span>
          {review.proof_image_url && (
            <span className="tag bg-blue-50 text-blue-600 font-semibold">
              📸 수익인증
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{timeAgo(review.created_at)}</span>
      </div>

      {/* 추천 여부 */}
      <div className="mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${review.recommend ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {review.recommend ? "👍 추천" : "👎 비추"}
        </span>
      </div>

      {/* 제목 */}
      <Link href={`/review/${review.id}`}>
        <h3 className="font-bold text-slate-800 text-[15px] mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer">
          {review.title}
        </h3>
      </Link>

      {/* 본문 */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">{review.content}</p>

      {/* 지표 */}
      <div className="flex items-center gap-4 py-3 border-y border-slate-50 mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">만족도</span>
          <Stars value={review.satisfaction} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">난이도</span>
          <span className={`font-medium ${DIFFICULTY_COLORS[review.difficulty]}`}>
            {DIFFICULTY_LABELS[review.difficulty]}
          </span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-slate-400">⏱</span>
          <span>주 {review.weekly_hours}시간</span>
        </div>
      </div>

      {/* 하단 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">✍️ {review.nickname}</span>
        <button
          onClick={() => toggleLike(review.id)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 active:scale-95 ${
            isLiked
              ? "bg-red-50 border-red-200 text-red-500 font-semibold"
              : "bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400"
          }`}
        >
          <span>{isLiked ? "❤️" : "🤍"}</span>
          <span>{review.likes}</span>
        </button>
      </div>
    </div>
  );
}
