"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { getStoredUser } from "@/lib/kakaoAuth";
import { ALL_HUSTLES, searchHustles, type SideHustle } from "@/lib/hustleData";
import {
  INCOME_LABELS,
  type IncomeRange,
  type Difficulty,
  type Satisfaction,
  type ReviewInput,
} from "@/lib/types";

const INCOME_RANGES = Object.keys(INCOME_LABELS) as IncomeRange[];

function StarPicker({ value, onChange, labels }: { value: number; onChange: (v: number) => void; labels: string[] }) {
  const [hover, setHover] = useState(0);
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
            className={`text-2xl transition-transform hover:scale-110 ${n <= (hover || value) ? "text-amber-400" : "text-slate-200"}`}
          >
            ★
          </button>
        ))}
      </div>
      {(hover || value) > 0 && (
        <span className="text-sm text-slate-500">{labels[(hover || value) - 1]}</span>
      )}
    </div>
  );
}

function HustleSearchPicker({
  selected,
  onSelect,
}: {
  selected: SideHustle | null;
  onSelect: (h: SideHustle) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = searchHustles(query).slice(0, 10);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
          onClick={() => { setQuery(""); setOpen(false); onSelect(null as unknown as SideHustle); }}
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
          placeholder="부업 이름 검색... (예: 쿠팡파트너스, E심팔이, 크몽)"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
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
      {/* 인기 부업 빠른 선택 */}
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

function WritePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addReview } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [selectedHustle, setSelectedHustle] = useState<SideHustle | null>(null);
  const [form, setForm] = useState<Partial<ReviewInput>>({
    recommend: true,
    weekly_hours: 5,
  });
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");

  // URL 파라미터로 미리 선택된 부업 처리
  useEffect(() => {
    const hustleId = searchParams.get("hustle");
    const hustleName = searchParams.get("name");
    if (hustleId) {
      const found = ALL_HUSTLES.find((h) => h.id === hustleId);
      if (found) {
        setSelectedHustle(found);
        setForm((f) => ({ ...f, hustle_id: found.id, hustle_name: found.name }));
      } else if (hustleName) {
        // 직접 입력된 이름 처리
        setForm((f) => ({ ...f, hustle_id: hustleId, hustle_name: hustleName }));
      }
    }
  }, [searchParams]);

  // 카카오 로그인 시 닉네임 자동 입력
  useEffect(() => {
    const user = getStoredUser();
    if (user?.nickname) {
      setForm((f) => ({ ...f, nickname: user.nickname }));
    }
  }, []);

  const set = (key: keyof ReviewInput, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleHustleSelect = (h: SideHustle | null) => {
    setSelectedHustle(h);
    if (h) {
      set("hustle_id", h.id);
      set("hustle_name", h.name);
    } else {
      setForm((f) => ({ ...f, hustle_id: undefined, hustle_name: undefined }));
    }
  };

  const isValid =
    form.nickname &&
    form.hustle_id &&
    form.income_range &&
    form.difficulty &&
    form.satisfaction &&
    form.title &&
    form.content &&
    form.pros &&
    form.cons;

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
    if (!isValid) return;
    setSubmitting(true);

    let proofImageUrl: string | null = null;

    if (proofImage) {
      const ext = proofImage.name.split(".").pop();
      const path = `proofs/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("review-proofs")
        .upload(path, proofImage, { upsert: false });
      if (!error) {
        const { data } = supabase.storage.from("review-proofs").getPublicUrl(path);
        proofImageUrl = data.publicUrl;
      }
    }

    const review = await addReview({ ...(form as ReviewInput), proof_image_url: proofImageUrl });
    router.push(`/review/${review.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 mb-6 transition-colors">
        ← 목록으로
      </Link>

      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-black text-slate-800 mb-1">✏️ 후기 작성</h1>
        <p className="text-slate-400 text-sm mb-5">
          솔직한 경험담이 다른 N잡러에게 큰 도움이 됩니다
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-700 leading-relaxed">
          ⚠️ 작성하신 수익 정보는 개인 경험 기반이며, 동일 수익을 보장하지 않습니다. 허위·과장 정보는 삭제될 수 있습니다.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              닉네임 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.nickname || ""}
              onChange={(e) => set("nickname", e.target.value)}
              placeholder="예: 직장인A, 퇴근후N잡러"
              maxLength={20}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* 부업 선택 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              어떤 부업 후기인가요? <span className="text-red-400">*</span>
            </label>
            <HustleSearchPicker
              selected={selectedHustle}
              onSelect={handleHustleSelect}
            />
          </div>

          {/* 월 수익 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              월 평균 수익 <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INCOME_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => set("income_range", range)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.income_range === range
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {INCOME_LABELS[range]}
                </button>
              ))}
            </div>
          </div>

          {/* 주 투자 시간 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              주 투자 시간:{" "}
              <span className="text-indigo-600 font-bold">{form.weekly_hours}시간</span>
            </label>
            <input
              type="range"
              min={1}
              max={40}
              value={form.weekly_hours || 5}
              onChange={(e) => set("weekly_hours", Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1시간</span>
              <span>40시간</span>
            </div>
          </div>

          {/* 만족도 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              만족도 <span className="text-red-400">*</span>
            </label>
            <StarPicker
              value={form.satisfaction || 0}
              onChange={(v) => set("satisfaction", v as Satisfaction)}
              labels={["별로예요", "그저 그래요", "보통이에요", "만족해요", "최고예요"]}
            />
          </div>

          {/* 난이도 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              난이도 <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {([
                [1, "매우 쉬움"],
                [2, "쉬움"],
                [3, "보통"],
                [4, "어려움"],
                [5, "매우 어려움"],
              ] as [number, string][]).map(([n, label]) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("difficulty", n as Difficulty)}
                  className={`flex-1 py-2 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.difficulty === n
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-500 hover:border-indigo-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              제목 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title || ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="예: 쿠팡파트너스 3개월 후기 - 블로그 없이도 가능할까?"
              maxLength={60}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* 본문 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              솔직한 후기 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.content || ""}
              onChange={(e) => set("content", e.target.value)}
              placeholder="얼마나 했는지, 실제로 얼마 벌었는지, 어떤 점이 좋고 나빴는지 솔직하게 써주세요."
              rows={5}
              maxLength={1000}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
            <p className="text-xs text-right text-slate-300 mt-1">
              {(form.content || "").length}/1000
            </p>
          </div>

          {/* 장점 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              👍 장점 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.pros || ""}
              onChange={(e) => set("pros", e.target.value)}
              placeholder="이 부업의 좋은 점은?"
              rows={2}
              maxLength={300}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* 단점 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              👎 단점 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.cons || ""}
              onChange={(e) => set("cons", e.target.value)}
              placeholder="이 부업의 아쉬운 점은?"
              rows={2}
              maxLength={300}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* 추천 여부 */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              다른 사람에게 추천하시겠어요?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => set("recommend", true)}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                  form.recommend
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 text-slate-500 hover:border-green-300"
                }`}
              >
                👍 추천해요
              </button>
              <button
                type="button"
                onClick={() => set("recommend", false)}
                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                  form.recommend === false
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-slate-200 text-slate-500 hover:border-red-300"
                }`}
              >
                👎 비추해요
              </button>
            </div>
          </div>

          {/* 수익 인증 이미지 (선택) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              📸 수익 인증 이미지 <span className="text-slate-400 font-normal">(선택)</span>
            </label>
            <p className="text-xs text-slate-400 mb-3">
              수익 캡처, 정산 내역 등을 첨부하면 신뢰도가 높아져요. 개인 정보는 가려주세요.
            </p>

            {proofPreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofPreview}
                  alt="수익 인증 미리보기"
                  className="max-h-48 rounded-xl border border-slate-200 object-contain"
                />
                <button
                  type="button"
                  onClick={() => { setProofImage(null); setProofPreview(null); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-sm text-slate-400">클릭해서 이미지 업로드</span>
                <span className="text-xs text-slate-300 mt-0.5">JPG, PNG, WEBP · 최대 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full btn-primary py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                등록 중...
              </>
            ) : (
              "후기 등록하기 ✨"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-10 animate-pulse"><div className="h-8 w-48 bg-slate-100 rounded mb-6" /><div className="h-96 bg-slate-50 rounded-2xl" /></div>}>
      <WritePageInner />
    </Suspense>
  );
}
