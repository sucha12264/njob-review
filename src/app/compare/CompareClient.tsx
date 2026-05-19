"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_HUSTLES, HUSTLE_MAP } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
import type { SideHustle } from "@/lib/hustleData";

const DIFFICULTY_LABEL = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
const DIFFICULTY_COLOR = [
  "",
  "text-green-600 bg-green-50",
  "text-green-600 bg-green-50",
  "text-amber-600 bg-amber-50",
  "text-orange-600 bg-orange-50",
  "text-red-600 bg-red-50",
];

const POPULAR_PAIRS: { a: string; b: string; label: string }[] = [
  { a: "youtube", b: "tiktok", label: "유튜브 vs 틱톡" },
  { a: "smart-store", b: "coupang-rocket", label: "스마트스토어 vs 쿠팡로켓" },
  { a: "kmong", b: "soomgo", label: "크몽 vs 숨고" },
  { a: "coupang-partners", b: "naver-blog", label: "쿠팡파트너스 vs 블로그" },
  { a: "naver-blog", b: "tistory", label: "네이버블로그 vs 티스토리" },
  { a: "ebook", b: "notion-template", label: "전자책 vs 노션템플릿" },
  { a: "baemin-rider", b: "coupang-flex", label: "배민라이더 vs 쿠팡플렉스" },
  { a: "kream", b: "used-flip", label: "KREAM vs 중고 플리핑" },
];

function HustleSelector({
  value,
  onChange,
  exclude,
  label,
}: {
  value: string;
  onChange: (id: string) => void;
  exclude: string;
  label: string;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const options = ALL_HUSTLES.filter(
    (h) => !h.isTerminated && h.id !== exclude && h.name.includes(search)
  );

  const selected = HUSTLE_MAP[value];

  return (
    <div className="relative flex-1 min-w-0">
      <p className="text-xs font-bold text-slate-500 mb-1.5">{label}</p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-left hover:border-indigo-300 transition-colors"
      >
        {selected ? (
          <>
            <span className="text-2xl">{selected.emoji}</span>
            <span className="font-bold text-slate-800 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-slate-400 text-sm">부업 선택...</span>
        )}
        <span className="ml-auto text-slate-400 text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="부업 검색..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {options.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => { onChange(h.id); setOpen(false); setSearch(""); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors text-left"
                >
                  <span className="text-xl">{h.emoji}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{h.name}</p>
                    <p className="text-xs text-slate-400">{h.category} · {h.incomeRange}</p>
                  </div>
                </button>
              </li>
            ))}
            {options.length === 0 && (
              <li className="px-4 py-4 text-center text-sm text-slate-400">검색 결과 없음</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
  better,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  better?: "a" | "b" | "equal" | null;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 border-b border-slate-100 last:border-0">
      <div className={`text-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${better === "a" ? "bg-indigo-50 ring-1 ring-indigo-200" : ""}`}>
        {a}
      </div>
      <div className="text-[11px] font-bold text-slate-400 text-center whitespace-nowrap px-2">{label}</div>
      <div className={`text-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${better === "b" ? "bg-indigo-50 ring-1 ring-indigo-200" : ""}`}>
        {b}
      </div>
    </div>
  );
}

function Verdict({ hustleA, hustleB }: { hustleA: SideHustle; hustleB: SideHustle }) {
  const guideA = HUSTLE_GUIDES[hustleA.id];
  const guideB = HUSTLE_GUIDES[hustleB.id];

  const scenarios = [
    {
      label: "초보자라면",
      pick: hustleA.difficulty <= hustleB.difficulty ? hustleA : hustleB,
      reason: "난이도가 더 낮아 시작하기 쉬워요",
    },
    {
      label: "빠른 수익을 원한다면",
      pick:
        hustleA.timeToFirst.localeCompare(hustleB.timeToFirst) <= 0
          ? hustleA
          : hustleB,
      reason: "첫 수익까지 시간이 더 짧아요",
    },
    {
      label: "초기비용 아끼려면",
      pick: hustleA.startupCost === "무료" ? hustleA : hustleB.startupCost === "무료" ? hustleB : null,
      reason: "초기 비용 없이 시작 가능해요",
    },
  ].filter((s) => s.pick);

  return (
    <div className="mt-6 space-y-3">
      <h3 className="font-black text-slate-800 text-base">💡 이런 분께 추천해요</h3>
      {scenarios.map((s) => (
        <div key={s.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
          <span className="text-sm text-slate-500 font-medium min-w-max">{s.label}</span>
          <span className="text-indigo-600 font-black text-sm">→ {(s.pick as SideHustle).emoji} {(s.pick as SideHustle).name}</span>
          <span className="text-xs text-slate-400 hidden sm:block">({s.reason})</span>
        </div>
      ))}

      {guideA && guideB && (
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {[{ hustle: hustleA, guide: guideA }, { hustle: hustleB, guide: guideB }].map(({ hustle, guide }) => (
            <div key={hustle.id} className="card p-4">
              <p className="font-bold text-slate-800 text-sm mb-2">{hustle.emoji} {hustle.name} — 장단점</p>
              <ul className="text-xs space-y-1 mb-2">
                {guide.pros.slice(0, 3).map((p) => (
                  <li key={p} className="text-green-700 flex gap-1"><span>✓</span>{p}</li>
                ))}
              </ul>
              <ul className="text-xs space-y-1">
                {guide.cons.slice(0, 2).map((c) => (
                  <li key={c} className="text-red-600 flex gap-1"><span>✗</span>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  initialA?: string;
  initialB?: string;
}

export default function CompareClient({ initialA = "youtube", initialB = "tiktok" }: Props) {
  const [idA, setIdA] = useState(initialA);
  const [idB, setIdB] = useState(initialB);

  const hustleA = useMemo(() => HUSTLE_MAP[idA], [idA]);
  const hustleB = useMemo(() => HUSTLE_MAP[idB], [idB]);

  const INCOME_ORDER = ["under_10", "10_to_30", "30_to_50", "50_to_100", "over_100"];

  function shareUrl() {
    const url = `${window.location.origin}/compare?a=${idA}&b=${idB}`;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  return (
    <div className="animate-fade-in">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4">
            ⚖️ 부업 비교
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">어떤 부업이 나한테 맞을까?</h1>
          <p className="text-indigo-300 text-sm">두 부업을 나란히 비교해 최적의 선택을 찾아보세요</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 인기 비교 쌍 */}
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">🔥 인기 비교</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PAIRS.map((pair) => {
              const isActive = idA === pair.a && idB === pair.b;
              return (
                <Link
                  key={pair.label}
                  href={`/compare/${pair.a}-vs-${pair.b}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                  }`}
                >
                  {pair.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 부업 선택 */}
        <div className="flex items-end gap-3 mb-6">
          <HustleSelector value={idA} onChange={setIdA} exclude={idB} label="부업 A" />
          <div className="pb-3 text-xl font-black text-slate-300 flex-shrink-0">VS</div>
          <HustleSelector value={idB} onChange={setIdB} exclude={idA} label="부업 B" />
        </div>

        {hustleA && hustleB ? (
          <>
            {/* 상단 카드 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[hustleA, hustleB].map((h) => (
                <Link
                  key={h.id}
                  href={`/hustle/${h.id}`}
                  className="card p-5 hover:border-indigo-200 transition-all group text-center"
                >
                  <div className="text-4xl mb-2">{h.emoji}</div>
                  <p className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors text-sm leading-snug">{h.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{h.category}</p>
                  <p className="text-indigo-600 font-bold text-sm mt-2">{h.incomeRange}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">예상 수익</p>
                </Link>
              ))}
            </div>

            {/* 상세 비교 테이블 */}
            <div className="card p-4 mb-4">
              <h2 className="font-black text-slate-800 mb-4 text-base">📊 상세 비교</h2>

              <CompareRow
                label="예상 수익"
                a={<span className="font-semibold text-indigo-700">{hustleA.incomeRange}</span>}
                b={<span className="font-semibold text-indigo-700">{hustleB.incomeRange}</span>}
              />
              <CompareRow
                label="난이도"
                a={
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${DIFFICULTY_COLOR[hustleA.difficulty]}`}>
                    {DIFFICULTY_LABEL[hustleA.difficulty]}
                  </span>
                }
                b={
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${DIFFICULTY_COLOR[hustleB.difficulty]}`}>
                    {DIFFICULTY_LABEL[hustleB.difficulty]}
                  </span>
                }
                better={
                  hustleA.difficulty < hustleB.difficulty ? "a" :
                  hustleB.difficulty < hustleA.difficulty ? "b" : "equal"
                }
              />
              <CompareRow
                label="초기 비용"
                a={<span className="text-slate-700">{hustleA.startupCost}</span>}
                b={<span className="text-slate-700">{hustleB.startupCost}</span>}
                better={
                  hustleA.startupCost === "무료" && hustleB.startupCost !== "무료" ? "a" :
                  hustleB.startupCost === "무료" && hustleA.startupCost !== "무료" ? "b" : null
                }
              />
              <CompareRow
                label="첫 수익까지"
                a={<span className="text-slate-700">{hustleA.timeToFirst}</span>}
                b={<span className="text-slate-700">{hustleB.timeToFirst}</span>}
              />
              <CompareRow
                label="카테고리"
                a={<span className="text-slate-500 text-xs">{hustleA.category}</span>}
                b={<span className="text-slate-500 text-xs">{hustleB.category}</span>}
              />
            </div>

            {/* 후기 바로가기 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[hustleA, hustleB].map((h) => (
                <Link
                  key={h.id}
                  href={`/hustle/${h.id}`}
                  className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-4 py-3 transition-colors group"
                >
                  <span className="text-sm font-semibold text-indigo-700 group-hover:text-indigo-900">{h.emoji} {h.name} 후기</span>
                  <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform text-xs">→</span>
                </Link>
              ))}
            </div>

            {/* 추천 버딕트 */}
            <div className="card p-5">
              <Verdict hustleA={hustleA} hustleB={hustleB} />
            </div>

            {/* 공유 버튼 */}
            <div className="mt-6 text-center">
              <button
                onClick={shareUrl}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
              >
                🔗 이 비교 링크 공유하기
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <p className="text-3xl mb-2">⚖️</p>
            <p>비교할 부업 두 가지를 선택해주세요</p>
          </div>
        )}

        {/* 다른 비교 추천 */}
        <div className="mt-10">
          <p className="font-bold text-slate-700 mb-3 text-sm">다른 비교도 해보세요</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PAIRS.filter((p) => !(p.a === idA && p.b === idB)).map((pair) => (
              <button
                key={pair.label}
                onClick={() => { setIdA(pair.a); setIdB(pair.b); }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-all"
              >
                {pair.label} →
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
