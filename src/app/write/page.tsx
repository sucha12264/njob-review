"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { getStoredUser } from "@/lib/kakaoAuth";
import { ALL_HUSTLES, searchHustles, type SideHustle } from "@/lib/hustleData";
import { INCOME_LABELS, type IncomeRange, type Satisfaction, type ReviewInput } from "@/lib/types";

const INCOME_RANGES = Object.keys(INCOME_LABELS) as IncomeRange[];

// ─── 별점 피커 ─────────────────────────────────────────
const STAR_LABELS = ["별로예요", "그저 그래요", "보통이에요", "만족해요", "최고예요"];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={`text-3xl transition-transform hover:scale-110 ${n <= active ? "text-amber-400" : "text-slate-200"}`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && (
        <span className="text-sm font-medium text-slate-600">{STAR_LABELS[active - 1]}</span>
      )}
    </div>
  );
}

// ─── 부업 검색 피커 ────────────────────────────────────
function HustleSearchPicker({
  selected,
  onSelect,
}: {
  selected: SideHustle | null;
  onSelect: (h: SideHustle | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = searchHustles(query).slice(0, 8);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (selected) {
    return (
      <div className="flex items-center gap-3 p-3 border-2 border-indigo-400 bg-indigo-50 rounded-xl">
        <span className="text-2xl">{selected.emoji}</span>
        <div className="flex-1">
          <p className="font-semibold text-indigo-700">{selected.name}</p>
          <p className="text-xs text-slate-400">{selected.category}</p>
        </div>
        <button
          type="button"
          onClick={() => { setQuery(""); onSelect(null); }}
          className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
        >
          변경
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="부업 이름 검색... (예: 쿠팡파트너스, 크몽)"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">검색 결과가 없어요</div>
          ) : (
            results.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => { onSelect(h); setOpen(false); setQuery(""); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
              >
                <span className="text-xl flex-shrink-0">{h.emoji}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-700 truncate">{h.name}</p>
                  <p className="text-xs text-slate-400">{h.category} · {h.incomeRange}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
      {!query && (
        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-2">🔥 인기 부업</p>
          <div className="flex flex-wrap gap-2">
            {ALL_HUSTLES.filter((h) => h.isHot).slice(0, 6).map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => onSelect(h)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 rounded-full transition-colors"
              >
                {h.emoji} {h.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 진행 단계 표시 ────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all ${
            i < step ? "bg-indigo-600" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── 메인 폼 ───────────────────────────────────────────
function WritePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addReview } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<SideHustle | null>(null);

  // 핵심 필드
  const [nickname, setNickname] = useState("");
  const [incomeRange, setIncomeRange] = useState<IncomeRange | "">("");
  const [satisfaction, setSatisfaction] = useState(0);
  const [content, setContent] = useState("");

  // 선택 필드
  const [showExtra, setShowExtra] = useState(false);
  const [title, setTitle] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  // URL 파라미터로 미리 선택
  useEffect(() => {
    const hustleId = searchParams.get("hustle");
    if (hustleId) {
      const found = ALL_HUSTLES.find((h) => h.id === hustleId);
      if (found) setSelectedHustle(found);
    }
  }, [searchParams]);

  // 카카오 로그인 닉네임 자동 입력
  useEffect(() => {
    const user = getStoredUser();
    if (user?.nickname) setNickname(user.nickname);
  }, []);

  const isValid = selectedHustle && nickname.trim() && incomeRange && satisfaction > 0 && content.trim().length >= 20;

  // 완성도 계산 (선택 항목 채울수록 올라감)
  const completeness = [
    !!title,
    !!pros,
    !!cons,
    difficulty !== 3,
    weeklyHours !== 5,
    !!proofImage,
  ].filter(Boolean).length;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("이미지는 5MB 이하만 업로드 가능해요.");
      return;
    }
    setUploadError("");
    setProofImage(file);
    setProofPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || !selectedHustle) return;
    setSubmitting(true);

    let proofImageUrl: string | null = null;
    if (proofImage) {
      try {
        const fd = new FormData();
        fd.append("file", proofImage);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) proofImageUrl = json.url;
      } catch { /* 업로드 실패 무시 */ }
    }

    const kakaoUser = getStoredUser();
    const review = await addReview({
      nickname: nickname.trim(),
      hustle_id: selectedHustle.id,
      hustle_name: selectedHustle.name,
      income_range: incomeRange as IncomeRange,
      weekly_hours: weeklyHours,
      difficulty: difficulty as ReviewInput["difficulty"],
      satisfaction: satisfaction as ReviewInput["satisfaction"],
      title: title.trim() || `${selectedHustle.name} 후기`,
      content: content.trim(),
      pros: pros.trim(),
      cons: cons.trim(),
      recommend: satisfaction >= 4,
      proof_image_url: proofImageUrl,
      kakao_user_id: kakaoUser ? String(kakaoUser.id) : null,
    } as ReviewInput & { kakao_user_id: string | null });

    router.push(`/review/${review.id}`);
  }

  // 현재 진행 단계 (필수 항목 기준)
  const filledSteps = [!!selectedHustle, !!incomeRange, satisfaction > 0, content.trim().length >= 20].filter(Boolean).length;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8 animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 mb-6 transition-colors">
        ← 목록으로
      </Link>

      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">✏️ 후기 작성</h1>
        <p className="text-slate-400 text-sm mb-5">솔직한 경험이 다른 N잡러에게 큰 도움이 됩니다</p>

        {/* 진행 바 */}
        <ProgressBar step={filledSteps} total={4} />

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* ① 부업 선택 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              어떤 부업인가요? <span className="text-red-400">*</span>
            </label>
            <HustleSearchPicker selected={selectedHustle} onSelect={setSelectedHustle} />
          </div>

          {/* ② 닉네임 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              닉네임 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 직장인A, 퇴근후N잡러"
              maxLength={20}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* ③ 월 수익 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              월 평균 수익 <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INCOME_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setIncomeRange(range)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    incomeRange === range
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {INCOME_LABELS[range]}
                </button>
              ))}
            </div>
          </div>

          {/* ④ 만족도 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              만족도 <span className="text-red-400">*</span>
            </label>
            <StarPicker value={satisfaction} onChange={setSatisfaction} />
          </div>

          {/* ⑤ 후기 본문 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              솔직한 후기 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="실제로 얼마나 했는지, 수익은 어떻게 됐는지, 어떤 점이 좋고 나빴는지 자유롭게 써주세요. (최소 20자)"
              rows={5}
              maxLength={2000}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
            <p className={`text-xs text-right mt-1 ${content.length < 20 && content.length > 0 ? "text-red-400" : "text-slate-300"}`}>
              {content.length}/2000{content.length < 20 && content.length > 0 ? ` (${20 - content.length}자 더 필요)` : ""}
            </p>
          </div>

          {/* ─── 선택 정보 ─── */}
          <div className="border border-dashed border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowExtra((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>➕ 더 자세히 작성하기</span>
                {completeness > 0 && (
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {completeness}/6
                  </span>
                )}
              </span>
              <span className="text-slate-400 text-lg leading-none">{showExtra ? "−" : "+"}</span>
            </button>

            {showExtra && (
              <div className="px-4 pb-5 pt-1 space-y-5 border-t border-slate-100">
                <p className="text-xs text-slate-400">선택 사항이에요. 채울수록 후기의 신뢰도가 높아져요.</p>

                {/* 제목 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">제목</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={selectedHustle ? `예: ${selectedHustle.name} 3개월 후기` : "후기 제목"}
                    maxLength={60}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>

                {/* 장점 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">👍 장점</label>
                  <textarea
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    placeholder="이 부업의 좋은 점"
                    rows={2}
                    maxLength={300}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none resize-none"
                  />
                </div>

                {/* 단점 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">👎 단점</label>
                  <textarea
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    placeholder="이 부업의 아쉬운 점"
                    rows={2}
                    maxLength={300}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none resize-none"
                  />
                </div>

                {/* 난이도 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">난이도</label>
                  <div className="flex gap-1.5">
                    {(["매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"] as const).map((label, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setDifficulty(i + 1)}
                        className={`flex-1 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                          difficulty === i + 1
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-400 hover:border-indigo-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 주 투자 시간 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    주 투자 시간: <span className="text-indigo-600 font-bold">{weeklyHours}시간</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-300 mt-0.5">
                    <span>1시간</span>
                    <span>40시간</span>
                  </div>
                </div>

                {/* 수익 인증 이미지 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    📸 수익 인증 이미지
                  </label>
                  <p className="text-xs text-slate-400 mb-2">수익 캡처, 정산 내역 등을 첨부하면 신뢰도가 높아져요.</p>
                  {proofPreview ? (
                    <div className="relative inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={proofPreview} alt="수익 인증" className="max-h-40 rounded-xl border border-slate-200 object-contain" />
                      <button
                        type="button"
                        onClick={() => { setProofImage(null); setProofPreview(null); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                      <span className="text-xl mb-0.5">📷</span>
                      <span className="text-xs text-slate-400">클릭해서 업로드</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                  {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
                </div>
              </div>
            )}
          </div>

          {/* 제출 */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full btn-primary py-3.5 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                등록 중...
              </>
            ) : (
              "후기 등록하기 →"
            )}
          </button>

          {!isValid && (nickname || incomeRange || satisfaction || content) && (
            <p className="text-xs text-center text-slate-400 -mt-3">
              {!selectedHustle ? "부업을 선택해주세요" :
               !incomeRange ? "월 수익을 선택해주세요" :
               satisfaction === 0 ? "만족도를 선택해주세요" :
               content.trim().length < 20 ? `후기를 ${20 - content.trim().length}자 더 써주세요` : ""}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded mb-6" />
        <div className="h-96 bg-slate-50 rounded-2xl" />
      </div>
    }>
      <WritePageInner />
    </Suspense>
  );
}
