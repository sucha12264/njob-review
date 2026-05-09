"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { RankedHustle } from "@/app/api/ranking/route";

type SortKey = "review_count" | "avg_satisfaction" | "recommend_rate" | "top_income_rate";

const TABS: { key: SortKey; label: string; emoji: string; desc: string }[] = [
  { key: "review_count",    label: "후기 많은 순",  emoji: "📝", desc: "후기 수 기준" },
  { key: "avg_satisfaction",label: "만족도 높은 순", emoji: "⭐", desc: "평균 만족도 기준" },
  { key: "recommend_rate",  label: "추천률 높은 순", emoji: "👍", desc: "추천 비율 기준" },
  { key: "top_income_rate", label: "고수익 비율 순", emoji: "💰", desc: "월 50만원 이상 비율 기준" },
];

const MEDAL = ["🥇", "🥈", "🥉"];
const DIFFICULTY_LABEL = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
const DIFFICULTY_COLOR = ["", "text-green-500", "text-green-500", "text-amber-500", "text-orange-500", "text-red-500"];

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-bold text-slate-800 text-sm">{value}</div>
      <div className="text-[10px] text-slate-400">{label}</div>
    </div>
  );
}

function PodiumCard({ rank, item, sortKey }: { rank: number; item: RankedHustle; sortKey: SortKey }) {
  const podiumStyles = [
    "order-2 scale-105 shadow-xl ring-2 ring-yellow-400/50",   // 1위
    "order-1 scale-100 shadow-md",                              // 2위
    "order-3 scale-100 shadow-md",                             // 3위
  ];
  const heights = ["h-24", "h-16", "h-12"];

  const mainValue =
    sortKey === "review_count"     ? `${item.review_count}개` :
    sortKey === "avg_satisfaction" ? `${item.avg_satisfaction}점` :
    sortKey === "recommend_rate"   ? `${item.recommend_rate}%` :
                                     `${item.top_income_rate}%`;

  return (
    <Link
      href={`/hustle/${item.hustle_id}`}
      className={`flex flex-col items-center gap-2 rounded-2xl p-4 bg-white border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer ${podiumStyles[rank]}`}
    >
      <span className="text-2xl">{MEDAL[rank]}</span>
      <span className="text-3xl">{item.emoji}</span>
      <span className="font-bold text-slate-800 text-sm text-center leading-tight">
        {item.hustle_name}
      </span>
      <span className="text-lg font-black text-indigo-600">{mainValue}</span>
      {/* 포디움 바 */}
      <div className={`w-full bg-indigo-100 rounded-t-lg ${heights[rank]} mt-auto`} />
    </Link>
  );
}

function RankRow({
  rank,
  item,
  sortKey,
}: {
  rank: number;
  item: RankedHustle;
  sortKey: SortKey;
}) {
  const isTop3 = rank < 3;

  return (
    <Link
      href={`/hustle/${item.hustle_id}`}
      className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-indigo-50/50 transition-colors group"
    >
      {/* 순위 */}
      <div className={`w-8 text-center font-black text-sm flex-shrink-0 ${isTop3 ? "text-xl" : "text-slate-400"}`}>
        {isTop3 ? MEDAL[rank] : rank + 1}
      </div>

      {/* 이모지 */}
      <span className="text-2xl flex-shrink-0">{item.emoji}</span>

      {/* 이름 + 카테고리 */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors truncate">
          {item.hustle_name}
        </p>
        <p className="text-xs text-slate-400 truncate">{item.category} · {item.incomeRange}</p>
      </div>

      {/* 주요 지표 */}
      <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
        <StatBadge value={`${item.review_count}개`}       label="후기 수" />
        <StatBadge value={`${item.avg_satisfaction}점`}    label="만족도" />
        <StatBadge value={`${item.recommend_rate}%`}       label="추천률" />
        <StatBadge value={`${item.top_income_rate}%`}      label="고수익 비율" />
      </div>

      {/* 모바일: 핵심 지표 1개만 */}
      <div className="sm:hidden flex-shrink-0 text-right">
        <div className="font-black text-indigo-600 text-sm">
          {sortKey === "review_count"     ? `${item.review_count}개` :
           sortKey === "avg_satisfaction" ? `${item.avg_satisfaction}점` :
           sortKey === "recommend_rate"   ? `${item.recommend_rate}%` :
                                            `${item.top_income_rate}%`}
        </div>
        <div className="text-[10px] text-slate-400">
          {TABS.find((t) => t.key === sortKey)?.emoji}
        </div>
      </div>

      <span className="text-slate-300 group-hover:text-indigo-400 transition-colors text-xs flex-shrink-0">→</span>
    </Link>
  );
}

interface Props {
  initialData: RankedHustle[];
}

export default function RankingClient({ initialData }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("review_count");
  const [copied, setCopied]   = useState(false);

  const sorted = useMemo(() => {
    // 후기가 최소 1개 이상인 것만, 정렬
    return [...initialData]
      .filter((h) => h.review_count >= 1)
      .sort((a, b) => {
        // 1차: 선택된 지표 내림차순
        const diff = b[sortKey] - a[sortKey];
        if (diff !== 0) return diff;
        // 2차 동점: 후기 수 내림차순
        return b.review_count - a.review_count;
      });
  }, [initialData, sortKey]);

  const top3   = sorted.slice(0, 3);
  const others = sorted.slice(3);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const activeTab = TABS.find((t) => t.key === sortKey)!;

  return (
    <div className="animate-fade-in">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-5">
            🏆 실시간 부업 랭킹
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            어떤 부업이 제일 잘 될까?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mb-6">
            실제 후기 데이터 기반 · 만족도 · 추천률 · 고수익 비율로 순위를 매겼어요
          </p>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {copied ? "✅ 복사됨!" : "🔗 랭킹 공유하기"}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortKey(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                sortKey === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-slate-600 font-semibold">아직 후기가 없어요</p>
            <p className="text-sm text-slate-400 mt-1">후기가 쌓이면 랭킹이 표시됩니다</p>
            <Link
              href="/write"
              className="inline-block mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              첫 후기 작성하기
            </Link>
          </div>
        ) : (
          <>
            {/* 포디움 (TOP 3) */}
            {top3.length === 3 && (
              <div className="mb-10">
                <h2 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
                  🏆 TOP 3
                  <span className="text-sm font-normal text-slate-400">— {activeTab.desc}</span>
                </h2>
                <div className="flex items-end gap-3 justify-center">
                  {[top3[1], top3[0], top3[2]].map((item, i) => {
                    const realRank = i === 0 ? 1 : i === 1 ? 0 : 2;
                    return <PodiumCard key={item.hustle_id} rank={realRank} item={item} sortKey={sortKey} />;
                  })}
                </div>
              </div>
            )}

            {/* 전체 순위 목록 */}
            <div className="card divide-y divide-slate-50">
              {/* 테이블 헤더 (데스크탑) */}
              <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 text-[11px] text-slate-400 font-semibold">
                <div className="w-8 text-center">#</div>
                <div className="w-8" />
                <div className="flex-1">부업</div>
                <div className="flex items-center gap-5 pr-6">
                  {[
                    { label: "후기 수",     key: "review_count"     },
                    { label: "만족도",      key: "avg_satisfaction" },
                    { label: "추천률",      key: "recommend_rate"   },
                    { label: "고수익 비율", key: "top_income_rate"  },
                  ].map((col) => (
                    <div
                      key={col.key}
                      className={`w-16 text-center cursor-pointer hover:text-indigo-600 transition-colors ${
                        sortKey === col.key ? "text-indigo-600 font-bold" : ""
                      }`}
                      onClick={() => setSortKey(col.key as SortKey)}
                    >
                      {col.label}
                      {sortKey === col.key && " ▼"}
                    </div>
                  ))}
                </div>
                <div className="w-4" />
              </div>

              {sorted.map((item, i) => (
                <RankRow key={item.hustle_id} rank={i} item={item} sortKey={sortKey} />
              ))}
            </div>

            {/* 하단 CTA */}
            <div className="mt-8 card p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-center">
              <p className="font-bold text-lg mb-1">내 경험도 랭킹에 반영해요</p>
              <p className="text-indigo-200 text-sm mb-4">
                실제로 해본 부업 후기를 남기면 이 랭킹에 실시간 반영됩니다
              </p>
              <Link
                href="/write"
                className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                ✏️ 후기 작성하기
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
