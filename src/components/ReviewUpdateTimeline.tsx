"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoredUser } from "@/lib/kakaoAuth";
import {
  INCOME_LABELS,
  INCOME_COLORS,
  UPDATE_MONTHS,
  UPDATE_MONTH_LABELS,
} from "@/lib/types";
import type { ReviewUpdate, IncomeRange, UpdateMonths } from "@/lib/types";

const INCOME_ARROW: Record<string, string> = {
  under_10:   "text-slate-500",
  "10_to_30": "text-blue-500",
  "30_to_50": "text-green-500",
  "50_to_100":"text-amber-500",
  over_100:   "text-purple-600",
};

/** 두 income_range 사이 방향 아이콘 */
function IncomeArrow({ from, to }: { from: string; to: string }) {
  const ORDER: Record<string, number> = {
    under_10: 0, "10_to_30": 1, "30_to_50": 2, "50_to_100": 3, over_100: 4,
  };
  const diff = (ORDER[to] ?? 0) - (ORDER[from] ?? 0);
  if (diff > 0) return <span className="text-green-500 font-bold">↑</span>;
  if (diff < 0) return <span className="text-red-400 font-bold">↓</span>;
  return <span className="text-slate-400">→</span>;
}

/* ─── 업데이트 추가 폼 ───────────────────────────────────── */
function AddUpdateForm({
  reviewId,
  originalIncome,
  nickname,
  existingMonths,
  onAdded,
  onCancel,
}: {
  reviewId: string;
  originalIncome: IncomeRange;
  nickname: string;
  existingMonths: number[];
  onAdded: (u: ReviewUpdate) => void;
  onCancel: () => void;
}) {
  const [months, setMonths]         = useState<UpdateMonths | null>(null);
  const [income, setIncome]         = useState<IncomeRange>(originalIncome);
  const [content, setContent]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const availableMonths = UPDATE_MONTHS.filter((m) => !existingMonths.includes(m));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!months) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/review-updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_id: reviewId,
        nickname,
        months_elapsed: months,
        income_range: income,
        content: content.trim(),
      }),
    });

    if (res.ok) {
      const u: ReviewUpdate = await res.json();
      onAdded(u);
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했어요");
    }
    setSubmitting(false);
  }

  if (availableMonths.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-slate-400">
        모든 업데이트 시점(1·3·6·12개월)을 이미 기록하셨어요 🎉
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 border-2 border-indigo-200 bg-indigo-50/30 mt-4">
      <p className="text-sm font-bold text-indigo-700 mb-3">📊 수익 업데이트 추가</p>

      {/* 시점 선택 */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1.5 font-medium">시작 후 몇 개월째인가요?</p>
        <div className="flex gap-2 flex-wrap">
          {availableMonths.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonths(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                months === m
                  ? "border-indigo-500 bg-indigo-600 text-white"
                  : "border-slate-200 text-slate-600 hover:border-indigo-300"
              }`}
            >
              {UPDATE_MONTH_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* 현재 수익 */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 mb-1.5 font-medium">현재 월 수익은?</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {(Object.entries(INCOME_LABELS) as [IncomeRange, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setIncome(key)}
              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                income === key
                  ? `border-transparent ${INCOME_COLORS[key]}`
                  : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 한마디 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="지금 어떤가요? 수익 변화, 느낀 점 등 솔직하게 알려주세요 (5자 이상)"
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white resize-none mb-2"
      />

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-100 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!months || content.trim().length < 5 || submitting}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
        >
          {submitting ? "저장 중..." : "업데이트 등록"}
        </button>
      </div>
    </form>
  );
}

/* ─── 메인 컴포넌트 ─────────────────────────────────────── */
interface Props {
  reviewId: string;
  reviewKakaoUserId: string | null | undefined;
  originalIncome: IncomeRange;
  originalNickname: string;
}

export default function ReviewUpdateTimeline({
  reviewId,
  reviewKakaoUserId,
  originalIncome,
  originalNickname,
}: Props) {
  const [updates, setUpdates]     = useState<ReviewUpdate[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [isOwner, setIsOwner]     = useState(false);
  const [nickname, setNickname]   = useState(originalNickname);

  const load = useCallback(async () => {
    const res = await fetch(`/api/review-updates?review_id=${reviewId}`);
    if (res.ok) setUpdates(await res.json());
    setLoading(false);
  }, [reviewId]);

  useEffect(() => {
    load();
    const user = getStoredUser();
    if (user && reviewKakaoUserId && String(user.id) === reviewKakaoUserId) {
      setIsOwner(true);
      setNickname(user.nickname ?? originalNickname);
    }
  }, [load, reviewKakaoUserId, originalNickname]);

  function handleAdded(u: ReviewUpdate) {
    setUpdates((prev) =>
      [...prev, u].sort((a, b) => a.months_elapsed - b.months_elapsed)
    );
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/review-updates/${id}`, { method: "DELETE" });
    setUpdates((prev) => prev.filter((u) => u.id !== id));
  }

  const existingMonths = updates.map((u) => u.months_elapsed);
  const allDone = existingMonths.length === UPDATE_MONTHS.length;

  if (loading) return null;

  // 업데이트가 없고 오너도 아니면 섹션 자체 숨김
  if (updates.length === 0 && !isOwner) return null;

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          📈 수익 업데이트
          {updates.length > 0 && (
            <span className="text-xs font-normal text-slate-400">{updates.length}개</span>
          )}
        </h3>
        {isOwner && !allDone && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            + 업데이트 추가
          </button>
        )}
      </div>

      {/* 타임라인 */}
      {updates.length > 0 && (
        <div className="relative">
          {/* 세로 선 */}
          <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-slate-100" />

          <div className="space-y-4">
            {/* 최초 후기 (출발점) */}
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm z-10">
                시작
              </div>
              <div className="pt-2">
                <span className={`tag text-xs ${INCOME_COLORS[originalIncome]}`}>
                  {INCOME_LABELS[originalIncome]}
                </span>
                <span className="ml-2 text-xs text-slate-400">후기 작성 시점</span>
              </div>
            </div>

            {/* 업데이트들 */}
            {updates.map((u) => (
              <div key={u.id} className="flex gap-4 items-start group">
                <div className="w-11 h-11 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-indigo-600 text-[10px] font-black flex-shrink-0 shadow-sm z-10">
                  {u.months_elapsed}개월
                </div>
                <div className="flex-1 card p-3.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-bold text-slate-500">
                      {UPDATE_MONTH_LABELS[u.months_elapsed as UpdateMonths]}
                    </span>
                    <IncomeArrow from={originalIncome} to={u.income_range} />
                    <span className={`tag text-xs ${INCOME_COLORS[u.income_range as IncomeRange]}`}>
                      {INCOME_LABELS[u.income_range as IncomeRange]}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="ml-auto text-[10px] text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{u.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업데이트 없을 때 + 오너인 경우 안내 */}
      {updates.length === 0 && isOwner && !showForm && (
        <div className="text-center py-6 text-sm text-slate-400 bg-slate-50 rounded-xl">
          <p className="text-xl mb-1">📊</p>
          <p className="font-medium text-slate-500 mb-0.5">수익 업데이트를 남겨보세요</p>
          <p className="text-xs">1개월, 3개월, 6개월 후 수익 변화를 기록하면<br />다른 분들에게 큰 도움이 됩니다</p>
        </div>
      )}

      {/* 폼 */}
      {showForm && isOwner && (
        <AddUpdateForm
          reviewId={reviewId}
          originalIncome={originalIncome}
          nickname={nickname}
          existingMonths={existingMonths}
          onAdded={handleAdded}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
