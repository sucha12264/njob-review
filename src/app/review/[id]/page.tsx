"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStore } from "@/lib/store";
import { INCOME_LABELS, INCOME_COLORS } from "@/lib/types";
import ShareButtons from "@/components/ShareButtons";
import Comments from "@/components/Comments";

function Stars({ value }: { value: number }) {
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-amber-400" : "text-slate-200"}>★</span>
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

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getReviewById, toggleLike, likedIds } = useStore();
  const review = getReviewById(id);

  if (!review) return notFound();

  const isLiked = likedIds.has(review.id);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link
        href={`/hustle/${review.hustle_id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← {review.hustle_name} 후기 목록
      </Link>

      <div className="card p-6 sm:p-8">
        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href={`/hustle/${review.hustle_id}`}
            className="tag bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100 transition-colors"
          >
            {review.hustle_name}
          </Link>
          <span className={`tag text-sm ${INCOME_COLORS[review.income_range]}`}>
            💰 {INCOME_LABELS[review.income_range]}
          </span>
          {review.recommend ? (
            <span className="tag bg-green-50 text-green-700 text-sm">👍 추천해요</span>
          ) : (
            <span className="tag bg-red-50 text-red-600 text-sm">👎 비추해요</span>
          )}
        </div>

        <h1 className="text-2xl font-black text-slate-800 mb-2">{review.title}</h1>

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <span>✍️ {review.nickname}</span>
          <span>·</span>
          <span>{timeAgo(review.created_at)}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">만족도</div>
            <Stars value={review.satisfaction} />
            <div className="text-sm font-bold text-slate-700 mt-0.5">{review.satisfaction}/5</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">난이도</div>
            <div className="text-sm font-bold text-slate-700 mt-1">
              {["", "매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"][review.difficulty]}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">투자 시간</div>
            <div className="text-sm font-bold text-slate-700 mt-1">주 {review.weekly_hours}시간</div>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-6">{review.content}</p>

        {/* 수익 인증 이미지 */}
        {review.proof_image_url && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 mb-2">📸 수익 인증</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.proof_image_url}
              alt="수익 인증 이미지"
              className="rounded-xl border border-slate-200 max-h-72 object-contain w-full"
            />
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-bold text-green-700 mb-2">👍 장점</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{review.pros}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <h3 className="font-bold text-red-600 mb-2">👎 단점</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{review.cons}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => toggleLike(review.id)}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-all active:scale-95 ${
              isLiked
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400"
            }`}
          >
            <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
            <span>도움이 됐어요 {review.likes}</span>
          </button>
          <div className="flex items-center gap-4">
            <ShareButtons
              title={`${review.hustle_name} 후기: ${review.title}`}
              description={review.content.slice(0, 80)}
            />
            <Link
              href={`/write?hustle=${review.hustle_id}&name=${encodeURIComponent(review.hustle_name)}`}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              나도 후기 쓰기 →
            </Link>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="card p-6 sm:p-8 mt-4">
        <Comments reviewId={review.id} />
      </div>
    </div>
  );
}
