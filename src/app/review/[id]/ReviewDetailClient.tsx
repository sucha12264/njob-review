"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { INCOME_LABELS, INCOME_COLORS } from "@/lib/types";
import type { Review } from "@/lib/types";
import { getStoredUser, initKakao } from "@/lib/kakaoAuth";
import ShareButtons from "@/components/ShareButtons";
import Comments from "@/components/Comments";

function Stars({ value }: { value: number }) {
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-amber-400" : "text-slate-200"}>
          ★
        </span>
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

function ReportButton({ type, targetId }: { type: "review" | "comment"; targetId: string }) {
  const storageKey = `reported_${type}_${targetId}`;
  const [reported, setReported] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem(storageKey)
  );
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const REASONS = ["스팸/홍보", "허위 정보", "욕설/비방", "개인정보 노출", "기타"];

  async function handleReport() {
    if (!reason) return;
    setSubmitting(true);
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, target_id: targetId, reason }),
      });
    } catch {}
    localStorage.setItem(storageKey, "1");
    setReported(true);
    setShowModal(false);
  }

  if (reported) {
    return (
      <span className="text-[11px] text-slate-300 px-2 py-1">✅ 신고됨</span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-[11px] text-slate-300 hover:text-red-400 transition-colors px-2 py-1 rounded"
      >
        🚨 신고
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-slate-800 mb-1">신고 사유 선택</h3>
            <p className="text-xs text-slate-400 mb-4">
              부적절한 {type === "review" ? "후기" : "댓글"}을 신고해주세요. 검토 후 조치하겠습니다.
            </p>
            <div className="space-y-2 mb-5">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${
                    reason === r
                      ? "border-red-400 bg-red-50 text-red-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:border-red-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleReport}
                disabled={!reason || submitting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
              >
                {submitting ? "신고 중..." : "신고하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── 신규 작성 후 공유 배너 ───────────────���───────────
function NewReviewShareBannerInner({ review }: { review: Review }) {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";
  const [show, setShow] = useState(isNew);
  const [copied, setCopied] = useState(false);
  const [kakaoLoading, setKakaoLoading] = useState(false);

  // URL에서 ?new=1 제거 (히스토리 오염 방지)
  useEffect(() => {
    if (isNew) {
      const url = window.location.pathname;
      window.history.replaceState({}, "", url);
    }
  }, [isNew]);

  if (!show) return null;

  const reviewUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const shareTitle = `${review.hustle_name} 후기: ${review.title}`;
  const shareDesc = review.content.slice(0, 80).replace(/\n/g, " ");

  async function handleKakao() {
    setKakaoLoading(true);
    try {
      await initKakao();
      const kakao = (window as { Kakao?: { isInitialized?: () => boolean; Share?: { sendDefault: (opts: unknown) => void } } }).Kakao;
      if (!kakao?.isInitialized?.() || !kakao.Share) {
        handleCopy();
        return;
      }
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: shareTitle,
          description: shareDesc,
          imageUrl: "https://njob-review.vercel.app/opengraph-image",
          link: { mobileWebUrl: reviewUrl, webUrl: reviewUrl },
        },
        buttons: [{ title: "후기 보러가기", link: { mobileWebUrl: reviewUrl, webUrl: reviewUrl } }],
      });
    } finally {
      setKakaoLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleNative() {
    if (navigator.share) {
      await navigator.share({ title: shareTitle, text: shareDesc, url: reviewUrl });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="mb-5 rounded-2xl overflow-hidden border border-indigo-200 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-lg font-black mb-0.5">🎉 후기가 등록됐어요!</p>
            <p className="text-indigo-200 text-sm">
              같은 고민 중인 분들에게 도움이 될 수 있어요
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-indigo-300 hover:text-white transition-colors text-xl leading-none mt-0.5 ml-3"
          >
            ✕
          </button>
        </div>

        {/* 공유 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {/* 카카오 — 메인 CTA */}
          <button
            onClick={handleKakao}
            disabled={kakaoLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#F0D900] text-[#191919] font-bold py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6l-.8 3.2 3.6-2.4c1 .2 2.1.3 3.2.3 5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
            </svg>
            {kakaoLoading ? "공유 중..." : "카카오톡으로 공유하기"}
          </button>

          {/* 링크 복사 */}
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-xl transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            {copied ? "✓ 복사됨" : "🔗 링크 복사"}
          </button>

          {/* 네이티브 공유 (모바일) */}
          <button
            onClick={handleNative}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-colors sm:hidden"
          >
            ↗ 공유
          </button>
        </div>
      </div>

      <div className="bg-white/10 px-5 py-2.5 flex items-center justify-between">
        <p className="text-xs text-indigo-200">
          N잡 후기판 · 직접 경험한 {review.hustle_name} 후기
        </p>
        <button
          onClick={() => setShow(false)}
          className="text-xs text-indigo-300 hover:text-white transition-colors"
        >
          나중에
        </button>
      </div>
    </div>
  );
}

function NewReviewShareBanner({ review }: { review: Review }) {
  return (
    <Suspense fallback={null}>
      <NewReviewShareBannerInner review={review} />
    </Suspense>
  );
}

export default function ReviewDetailClient({ review }: { review: Review }) {
  const router = useRouter();
  const { toggleLike, likedIds } = useStore();
  const isLiked = likedIds.has(review.id);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user && review.kakao_user_id && String(user.id) === review.kakao_user_id) {
      setIsOwner(true);
    }
  }, [review.kakao_user_id]);

  async function handleDelete() {
    if (!confirm("내 후기를 삭제할까요? 되돌릴 수 없습니다.")) return;
    setDeleting(true);
    const user = getStoredUser();
    const res = await fetch(`/api/review/${review.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kakao_user_id: String(user?.id) }),
    });
    if (res.ok) {
      router.push(`/hustle/${review.hustle_id}`);
    } else {
      alert("삭제에 실패했어요. 다시 시도해주세요.");
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <Link
        href={`/hustle/${review.hustle_id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        ← {review.hustle_name} 후기 목록
      </Link>

      {/* 신규 작성 후 공유 유도 배너 (?new=1) */}
      <NewReviewShareBanner review={review} />

      <div className="card p-5 sm:p-8">
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

        <h1 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">{review.title}</h1>

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <span>✍️ {review.nickname}</span>
          <span>·</span>
          <span>{timeAgo(review.created_at)}</span>
        </div>

        {/* 지표 3개 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
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
          <div className="flex items-center gap-3 flex-wrap">
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
            {isOwner ? (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-[11px] text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-40"
              >
                {deleting ? "삭제 중..." : "🗑 내 후기 삭제"}
              </button>
            ) : (
              <ReportButton type="review" targetId={review.id} />
            )}
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="card p-5 sm:p-8 mt-4">
        <Comments reviewId={review.id} />
      </div>

      {/* 모바일 하단 여백 (bottom nav) */}
      <div className="h-4 sm:h-0" />
    </div>
  );
}
