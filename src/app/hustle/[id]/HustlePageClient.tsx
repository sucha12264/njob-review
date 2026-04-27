"use client";

import Link from "next/link";
import { useState } from "react";
import { ALL_HUSTLES, type SideHustle } from "@/lib/hustleData";
import { type HustleGuide } from "@/lib/hustleGuides";
import { useStore } from "@/lib/store";
import ReviewCard from "@/components/ReviewCard";
import ShareButtons from "@/components/ShareButtons";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/lib/types";

interface AISummary {
  verdict: "긍정적" | "중립" | "부정적";
  summary: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

function AISummaryBox({ hustleName, reviews }: { hustleName: string; reviews: Review[] }) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSummary() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hustleName,
          reviews: reviews.map((r) => ({
            income_range: r.income_range,
            satisfaction: r.satisfaction,
            recommend: r.recommend,
            content: r.content,
            pros: r.pros,
            cons: r.cons,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "요청 실패");
      setSummary(data as AISummary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI 요약 생성에 실패했어요");
    } finally {
      setLoading(false);
    }
  }

  const verdictStyle = {
    긍정적: { bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700", icon: "✅" },
    중립: { bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", icon: "⚖️" },
    부정적: { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", icon: "⚠️" },
  };

  if (summary) {
    const style = verdictStyle[summary.verdict];
    return (
      <div className={`card p-5 border ${style.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            🤖 AI 후기 분석
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${style.badge}`}>
              {style.icon} {summary.verdict}
            </span>
          </h2>
          <span className="text-[10px] text-slate-400">claude-sonnet-4-6</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">{summary.summary}</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs font-semibold text-green-600 mb-1.5">👍 주요 장점</p>
            <ul className="space-y-1">
              {summary.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="text-green-500 mt-0.5">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-500 mb-1.5">👎 주의할 점</p>
            <ul className="space-y-1">
              {summary.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="text-red-400 mt-0.5">✗</span>{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-xs bg-white/70 rounded-lg px-3 py-2 text-slate-600 border border-slate-100">
          💡 <strong>추천 대상:</strong> {summary.bestFor}
        </div>
      </div>
    );
  }

  if (reviews.length < 3) {
    return null;
  }

  return (
    <div className="card p-5 border border-dashed border-indigo-200 bg-indigo-50/30">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-0.5">🤖 AI 후기 분석</h3>
          <p className="text-xs text-slate-500">후기 {reviews.length}개를 AI가 분석해 핵심을 요약해드려요</p>
        </div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              분석 중...
            </>
          ) : (
            "✨ 요약 보기"
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}

async function trackClick(hustleId: string, hustleName: string) {
  try {
    await supabase.from("click_events").insert({ hustle_id: hustleId, hustle_name: hustleName, event: "official_url_click" });
  } catch { /* 클릭 트래킹 실패는 무시 */ }
}

const DIFFICULTY_LABEL = ["", "매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"];
const DIFFICULTY_COLOR = ["", "text-green-500", "text-green-500", "text-amber-500", "text-orange-500", "text-red-500"];
const DIFFICULTY_BG = ["", "bg-green-100", "bg-green-100", "bg-amber-100", "bg-orange-100", "bg-red-100"];

interface Props {
  hustle: SideHustle;
  guide: HustleGuide | null;
}

export default function HustlePageClient({ hustle, guide }: Props) {
  const id = hustle.id;
  const { reviews } = useStore();

  const hustleReviews = reviews
    .filter((r) => r.hustle_id === id)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  const allReviews = reviews.filter((r) => r.hustle_id === id);
  const avgSatisfaction = allReviews.length
    ? (allReviews.reduce((s, r) => s + r.satisfaction, 0) / allReviews.length).toFixed(1)
    : null;
  const recommendRate = allReviews.length
    ? Math.round((allReviews.filter((r) => r.recommend).length / allReviews.length) * 100)
    : null;

  const relatedHustles = ALL_HUSTLES
    .filter((h) => h.category === hustle.category && h.id !== id)
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
            >
              ← 전체 부업 목록
            </Link>
            <ShareButtons title={`${hustle.name} 후기 & 수익 정보`} description={hustle.oneline} />
          </div>

          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {hustle.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full">
                  {hustle.category}
                </span>
                {hustle.isHot && (
                  <span className="text-xs font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                    🔥 HOT
                  </span>
                )}
                {hustle.isNew && (
                  <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">{hustle.name}</h1>
              <p className="text-slate-300 text-lg">{hustle.oneline}</p>
            </div>
          </div>

          {/* 핵심 지표 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: "예상 수익", value: hustle.incomeRange, icon: "💰" },
              { label: "초기 비용", value: hustle.startupCost, icon: "💳" },
              { label: "첫 수익까지", value: hustle.timeToFirst, icon: "⏱" },
              { label: "진입 난이도", value: DIFFICULTY_LABEL[hustle.difficulty], icon: "📊", color: DIFFICULTY_COLOR[hustle.difficulty] },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className={`font-bold text-sm mb-0.5 ${stat.color || "text-white"}`}>{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex gap-7">
          {/* 메인 */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* 설명 */}
            <div className="card p-5">
              <h2 className="font-bold text-slate-800 mb-3">📌 이 부업이란?</h2>
              <p className="text-slate-600 leading-relaxed">{hustle.description}</p>
              {hustle.officialUrl && (
                <a
                  href={hustle.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(hustle.id, hustle.name)}
                  className="inline-flex items-center gap-1.5 mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  🔗 공식 사이트 바로가기 →
                </a>
              )}
            </div>

            {/* 모바일 전용: 진입 정보 */}
            <div className="lg:hidden card p-4">
              <h3 className="font-bold text-slate-700 text-sm mb-3">진입 정보</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <div className={`font-bold text-sm ${DIFFICULTY_COLOR[hustle.difficulty]}`}>
                    {DIFFICULTY_LABEL[hustle.difficulty]}
                  </div>
                  <div className="text-slate-400 mt-0.5">난이도</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <div className="font-bold text-slate-700 text-sm">{hustle.startupCost}</div>
                  <div className="text-slate-400 mt-0.5">초기 비용</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5">
                  <div className="font-bold text-slate-700 text-sm">{hustle.timeToFirst}</div>
                  <div className="text-slate-400 mt-0.5">첫 수익</div>
                </div>
              </div>
            </div>

            {/* 가이드 - 장단점 */}
            {guide && (
              <div className="card p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-1.5">
                      <span className="text-green-500">👍</span> 장점
                    </h3>
                    <ul className="space-y-1.5">
                      {guide.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-1.5">
                      <span className="text-red-400">👎</span> 단점
                    </h3>
                    <ul className="space-y-1.5">
                      {guide.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 가이드 - 시작하는 법 */}
            {guide && (
              <div className="card p-5">
                <h2 className="font-bold text-slate-800 mb-5">🚀 시작하는 법</h2>
                <div className="space-y-4">
                  {guide.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="pt-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                        <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 가이드 - 관련 플랫폼 */}
            {guide && guide.platforms.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-slate-800 mb-4">🔗 관련 플랫폼 / 사이트</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {guide.platforms.map((plat, i) => (
                    <a
                      key={i}
                      href={plat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <span className="text-base">🌐</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{plat.name}</p>
                        <p className="text-xs text-slate-500 truncate">{plat.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 가이드 - 꿀팁 */}
            {guide && guide.tips.length > 0 && (
              <div className="card p-5 bg-amber-50 border border-amber-200">
                <h2 className="font-bold text-slate-800 mb-4">💡 실전 꿀팁</h2>
                <ul className="space-y-2.5">
                  {guide.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">TIP {i + 1}</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 커뮤니티 통계 */}
            {allReviews.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-slate-800 mb-4">📊 커뮤니티 평가</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-black text-indigo-600">{avgSatisfaction}</div>
                    <div className="flex justify-center mt-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < Number(avgSatisfaction) ? "text-amber-400" : "text-slate-200"}`}>★</span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-400">평균 만족도</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-green-600">{recommendRate}%</div>
                    <div className="text-xs text-slate-400 mt-2">추천률</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-700">{allReviews.length}</div>
                    <div className="text-xs text-slate-400 mt-2">총 후기 수</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI 후기 요약 */}
            <AISummaryBox hustleName={hustle.name} reviews={allReviews} />

            {/* 관련 후기 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 text-lg">
                  {hustle.emoji} {hustle.name} 실제 후기
                </h2>
                <Link
                  href={`/write?hustle=${id}&name=${encodeURIComponent(hustle.name)}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  후기 쓰기 →
                </Link>
              </div>

              {hustleReviews.length > 0 ? (
                <div className="space-y-3">
                  {hustleReviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              ) : (
                <div className="card p-10 text-center">
                  <p className="text-3xl mb-3">📝</p>
                  <p className="text-slate-500 mb-4">아직 후기가 없어요. 첫 번째로 남겨보세요!</p>
                  <Link
                    href={`/write?hustle=${id}&name=${encodeURIComponent(hustle.name)}`}
                    className="btn-primary inline-block"
                  >
                    후기 쓰기 →
                  </Link>
                </div>
              )}
            </div>

            {/* 모바일 전용: 비슷한 부업 */}
            {relatedHustles.length > 0 && (
              <div className="lg:hidden card p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">비슷한 부업 보기</h3>
                <div className="grid grid-cols-2 gap-2">
                  {relatedHustles.map((h) => (
                    <Link
                      key={h.id}
                      href={`/hustle/${h.id}`}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group text-sm"
                    >
                      <span>{h.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-slate-700 group-hover:text-indigo-600 transition-colors truncate font-medium text-xs">{h.name}</p>
                        <p className="text-slate-400 text-[10px] truncate">{h.incomeRange}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 데스크탑 사이드바 */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
            {/* 후기 쓰기 CTA */}
            <div className="card p-5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <p className="font-bold mb-1">✏️ 후기 작성하기</p>
              <p className="text-sm text-indigo-200 mb-4">
                {hustle.name} 경험이 있으신가요? 솔직한 수익 후기를 공유해주세요.
              </p>
              <Link
                href={`/write?hustle=${id}&name=${encodeURIComponent(hustle.name)}`}
                className="block text-center bg-white text-indigo-700 font-bold text-sm py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                후기 쓰기 →
              </Link>
            </div>

            {/* 같은 카테고리 부업 */}
            {relatedHustles.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-4 text-sm">비슷한 부업 보기</h3>
                <div className="space-y-2">
                  {relatedHustles.map((h) => (
                    <Link
                      key={h.id}
                      href={`/hustle/${h.id}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors group text-sm"
                    >
                      <span>{h.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-600 group-hover:text-indigo-600 transition-colors truncate font-medium text-xs">{h.name}</p>
                        <p className="text-slate-400 text-[11px] truncate">{h.incomeRange}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 난이도 뱃지 */}
            <div className="card p-4">
              <h3 className="font-bold text-slate-700 text-sm mb-3">진입 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">난이도</span>
                  <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${DIFFICULTY_BG[hustle.difficulty]} ${DIFFICULTY_COLOR[hustle.difficulty]}`}>
                    {DIFFICULTY_LABEL[hustle.difficulty]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">초기 비용</span>
                  <span className="font-semibold text-slate-700 text-xs">{hustle.startupCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">첫 수익</span>
                  <span className="font-semibold text-slate-700 text-xs">{hustle.timeToFirst}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
