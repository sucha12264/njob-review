"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { getStoredUser } from "@/lib/kakaoAuth";
import { INCOME_LABELS, type IncomeRange, type ReviewInput } from "@/lib/types";
import type { SideHustle } from "@/lib/hustleData";

const INCOME_RANGES = Object.keys(INCOME_LABELS) as IncomeRange[];
const STAR_LABELS = ["별로예요", "그저 그래요", "보통이에요", "만족해요", "최고예요"];

interface Props {
  hustle: SideHustle;
  existingCount: number; // 현재 후기 수
}

export default function QuickWriteBox({ hustle, existingCount }: Props) {
  const { addReview } = useStore();

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [nickname, setNickname] = useState("");
  const [satisfaction, setSatisfaction] = useState(0);
  const [hover, setHover] = useState(0);
  const [incomeRange, setIncomeRange] = useState<IncomeRange | "">("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.nickname) setNickname(user.nickname);
  }, []);

  const isValid =
    nickname.trim() && satisfaction > 0 && incomeRange && content.trim().length >= 20;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError("");
    try {
      await addReview({
        nickname: nickname.trim(),
        hustle_id: hustle.id,
        hustle_name: hustle.name,
        income_range: incomeRange as IncomeRange,
        weekly_hours: 0,
        difficulty: 3,
        satisfaction: satisfaction as ReviewInput["satisfaction"],
        title: `${hustle.name} 후기`,
        content: content.trim(),
        pros: "",
        cons: "",
        recommend: satisfaction >= 4,
        proof_image_url: null,
        kakao_user_id: getStoredUser() ? String(getStoredUser()!.id) : null,
      } as ReviewInput & { kakao_user_id: string | null });
      setDone(true);
    } catch {
      setError("등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── 작성 완료 ───────────────────────────────────────
  if (done) {
    return (
      <div className="card p-6 border border-green-200 bg-green-50 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-bold text-green-800 mb-1">후기가 등록됐어요!</p>
        <p className="text-sm text-green-600">
          {hustle.name}에 대한 솔직한 경험을 나눠줘서 고마워요.
        </p>
        <Link
          href={`/write?hustle=${hustle.id}`}
          className="inline-block mt-4 text-xs text-green-700 underline underline-offset-2 hover:text-green-900"
        >
          더 자세한 후기 남기기 →
        </Link>
      </div>
    );
  }

  // ─── 후기 0개: 임팩트 있는 첫 후기 유도 ──────────────
  if (existingCount === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-violet-50/40 overflow-hidden">
        {/* 헤더 */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✨</span>
            <h3 className="font-black text-slate-800 text-base">
              이 부업, 직접 해보셨나요?
            </h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong className="text-indigo-600">{hustle.name}</strong>에 대한 후기가 아직 없어요.
            <br />
            첫 번째 후기를 남기면 같은 고민 중인 분들에게 큰 도움이 돼요.
          </p>

          {/* 유령 후기 카드 (미리보기) */}
          {!open && (
            <div className="mt-4 p-3.5 bg-white rounded-xl border border-slate-100 opacity-40 pointer-events-none select-none">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-slate-200" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="ml-auto flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} className="text-amber-300 text-sm">★</span>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 bg-slate-100 rounded w-full" />
                <div className="h-2.5 bg-slate-100 rounded w-4/5" />
                <div className="h-2.5 bg-slate-100 rounded w-3/5" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-5 w-16 bg-indigo-100 rounded-full" />
                <div className="h-5 w-14 bg-slate-100 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* 인라인 폼 or 버튼 */}
        {!open ? (
          <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-colors"
            >
              ✏️ 첫 번째 후기 남기기
            </button>
            <Link
              href={`/write?hustle=${hustle.id}`}
              className="flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-indigo-600 transition-colors px-3"
            >
              자세히 작성하기 →
            </Link>
          </div>
        ) : (
          <QuickForm
            hustle={hustle}
            nickname={nickname}
            setNickname={setNickname}
            satisfaction={satisfaction}
            setSatisfaction={setSatisfaction}
            hover={hover}
            setHover={setHover}
            incomeRange={incomeRange}
            setIncomeRange={setIncomeRange}
            content={content}
            setContent={setContent}
            isValid={!!isValid}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        )}
      </div>
    );
  }

  // ─── 후기 1~4개: 소박한 추가 유도 ──────────────────────
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">✏️</span>
            <div className="text-left">
              <p className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">
                경험이 있으시다면 후기를 남겨주세요
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {existingCount}명이 참여했어요 · 1분이면 작성 가능
              </p>
            </div>
          </div>
          <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-lg">→</span>
        </button>
      ) : (
        <QuickForm
          hustle={hustle}
          nickname={nickname}
          setNickname={setNickname}
          satisfaction={satisfaction}
          setSatisfaction={setSatisfaction}
          hover={hover}
          setHover={setHover}
          incomeRange={incomeRange}
          setIncomeRange={setIncomeRange}
          content={content}
          setContent={setContent}
          isValid={!!isValid}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}

// ─── 공통 미니 폼 ──────────────────────────────────────
function QuickForm({
  hustle,
  nickname, setNickname,
  satisfaction, setSatisfaction,
  hover, setHover,
  incomeRange, setIncomeRange,
  content, setContent,
  isValid, submitting, error,
  onSubmit, onCancel,
}: {
  hustle: SideHustle;
  nickname: string; setNickname: (v: string) => void;
  satisfaction: number; setSatisfaction: (v: number) => void;
  hover: number; setHover: (v: number) => void;
  incomeRange: IncomeRange | ""; setIncomeRange: (v: IncomeRange | "") => void;
  content: string; setContent: (v: string) => void;
  isValid: boolean; submitting: boolean; error: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) {
  const active = hover || satisfaction;

  return (
    <form onSubmit={onSubmit} className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100">
      <div className="flex items-center justify-between pt-3">
        <p className="text-xs font-semibold text-slate-500">{hustle.name} 후기 빠르게 남기기</p>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
      </div>

      {/* 만족도 */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-1.5">만족도 *</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSatisfaction(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className={`text-2xl transition-transform hover:scale-110 ${n <= active ? "text-amber-400" : "text-slate-200"}`}
              >
                ★
              </button>
            ))}
          </div>
          {active > 0 && <span className="text-xs text-slate-500">{STAR_LABELS[active - 1]}</span>}
        </div>
      </div>

      {/* 수익 */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-1.5">월 수익 *</p>
        <div className="flex flex-wrap gap-1.5">
          {INCOME_RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setIncomeRange(r)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                incomeRange === r
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-500 hover:border-indigo-300"
              }`}
            >
              {INCOME_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-1.5">솔직한 후기 * <span className="font-normal text-slate-400">(최소 20자)</span></p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="실제로 해보니 어땠나요? 수익은요? 어떤 분께 추천하나요?"
          rows={3}
          maxLength={500}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none resize-none"
        />
        {content.length > 0 && content.length < 20 && (
          <p className="text-xs text-red-400 mt-0.5">{20 - content.length}자 더 필요해요</p>
        )}
      </div>

      {/* 닉네임 */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-1.5">닉네임 *</p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="예: 직장인A"
          maxLength={20}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : null}
          {submitting ? "등록 중..." : "후기 등록하기"}
        </button>
        <Link
          href={`/write?hustle=${hustle.id}`}
          className="flex items-center text-xs text-slate-400 hover:text-indigo-600 transition-colors px-2"
        >
          자세히 →
        </Link>
      </div>
    </form>
  );
}
