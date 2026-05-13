import type { Metadata } from "next";
import Link from "next/link";
import { ALL_HUSTLES } from "@/lib/hustleData";
import type { SideHustle } from "@/lib/hustleData";

const BASE_URL = "https://side-job-checker.vercel.app";

export const metadata: Metadata = {
  title: "내게 맞는 부업 추천 | 상황별 N잡 추천 — N잡 후기판",
  description:
    "초보자·직장인·주부·학생 등 상황에 맞는 부업을 추천해드려요. 난이도·초기비용·수익으로 필터링한 맞춤 부업 목록.",
  openGraph: {
    title: "내게 맞는 부업 추천 | 상황별 N잡 추천 — N잡 후기판",
    description: "초보자·직장인·주부·학생 등 상황에 맞는 부업을 추천해드려요.",
    url: `${BASE_URL}/recommend`,
    type: "website",
  },
  alternates: { canonical: `${BASE_URL}/recommend` },
};

interface Scenario {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  hustles: SideHustle[];
  badge?: string;
  badgeColor?: string;
}

const ALL_ACTIVE = ALL_HUSTLES.filter((h) => !h.isTerminated);

const SCENARIOS: Scenario[] = [
  {
    id: "beginner",
    emoji: "🌱",
    title: "부업 처음이에요 (초보자)",
    desc: "가입 즉시 시작 가능하고 초기비용 없는 난이도 낮은 부업",
    badge: "입문",
    badgeColor: "bg-green-100 text-green-700",
    hustles: ALL_ACTIVE.filter(
      (h) => h.difficulty <= 2 && h.startupCost === "무료"
    ).slice(0, 8),
  },
  {
    id: "worker",
    emoji: "💼",
    title: "직장 다니면서 퇴근 후에 할 부업",
    desc: "시간 유연하고 재택으로 가능, 시간 투자 대비 효율 좋은 부업",
    badge: "투잡",
    badgeColor: "bg-blue-100 text-blue-700",
    hustles: ALL_ACTIVE.filter(
      (h) =>
        (h.category === "제휴마케팅" ||
          h.category === "디지털콘텐츠" ||
          h.category === "앱테크·설문" ||
          h.category === "투자") &&
        h.difficulty <= 3
    ).slice(0, 8),
  },
  {
    id: "homemaker",
    emoji: "🏠",
    title: "재택으로 할 수 있는 부업",
    desc: "집에서 인터넷만 있으면 시작 가능한 부업",
    badge: "재택",
    badgeColor: "bg-purple-100 text-purple-700",
    hustles: ALL_ACTIVE.filter(
      (h) =>
        h.category !== "배달·서비스" &&
        h.category !== "리셀" &&
        h.difficulty <= 4
    ).slice(0, 8),
  },
  {
    id: "free",
    emoji: "💸",
    title: "돈 없어도 시작하는 부업 (초기비용 무료)",
    desc: "가입비·장비 등 별도 비용 없이 지금 당장 시작 가능",
    badge: "무료 시작",
    badgeColor: "bg-emerald-100 text-emerald-700",
    hustles: ALL_ACTIVE.filter((h) => h.startupCost === "무료").slice(0, 8),
  },
  {
    id: "high-income",
    emoji: "🚀",
    title: "월 100만원 이상 가능한 고수익 부업",
    desc: "시간과 노력이 필요하지만 수익 천장이 높은 부업",
    badge: "고수익",
    badgeColor: "bg-amber-100 text-amber-700",
    hustles: ALL_ACTIVE.filter(
      (h) =>
        h.incomeRange.includes("100만") ||
        h.incomeRange.includes("500만") ||
        h.incomeRange.includes("∞") ||
        h.incomeRange.includes("+")
    ).slice(0, 8),
  },
  {
    id: "content",
    emoji: "📱",
    title: "콘텐츠·SNS로 수익 내는 부업",
    desc: "유튜브·인스타·블로그 등 콘텐츠 기반 부업",
    badge: "크리에이터",
    badgeColor: "bg-rose-100 text-rose-700",
    hustles: ALL_ACTIVE.filter(
      (h) =>
        h.category === "SNS·콘텐츠" || h.category === "디지털콘텐츠"
    ).slice(0, 8),
  },
  {
    id: "skill",
    emoji: "🎯",
    title: "전문 기술이 있다면 (재능 판매·프리랜서)",
    desc: "내 실력을 돈으로 바꾸는 프리랜서·재능 판매 부업",
    badge: "전문직",
    badgeColor: "bg-indigo-100 text-indigo-700",
    hustles: ALL_ACTIVE.filter(
      (h) =>
        h.category === "재능판매" || h.category === "온라인강의"
    ).slice(0, 8),
  },
  {
    id: "passive",
    emoji: "💤",
    title: "한번 만들면 자동 수익 (패시브인컴)",
    desc: "초반 작업 이후 자동으로 수익이 들어오는 구조",
    badge: "자동화",
    badgeColor: "bg-cyan-100 text-cyan-700",
    hustles: ALL_ACTIVE.filter(
      (h) =>
        h.id === "coupang-partners" ||
        h.id === "naver-blog" ||
        h.id === "tistory" ||
        h.id === "ebook" ||
        h.id === "notion-template" ||
        h.id === "stock-photo" ||
        h.id === "bgm-music" ||
        h.id === "stock-dividend" ||
        h.id === "etf-investing" ||
        h.id === "figma-template" ||
        h.id === "n-telecom"
    ).slice(0, 8),
  },
];

const DIFFICULTY_LABEL = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
const DIFFICULTY_COLOR = ["", "text-green-600", "text-green-600", "text-amber-600", "text-orange-600", "text-red-600"];

function HustleCard({ hustle }: { hustle: SideHustle }) {
  return (
    <Link
      href={`/hustle/${hustle.id}`}
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
    >
      <span className="text-2xl flex-shrink-0">{hustle.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors truncate">
          {hustle.name}
        </p>
        <p className="text-xs text-slate-400 truncate">{hustle.oneline}</p>
        {hustle.tags && hustle.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {hustle.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                ★ {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-bold text-indigo-600">{hustle.incomeRange}</p>
        <p className={`text-[10px] ${DIFFICULTY_COLOR[hustle.difficulty]}`}>
          {DIFFICULTY_LABEL[hustle.difficulty]}
        </p>
      </div>
    </Link>
  );
}

// JSON-LD: ItemList schema
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": SCENARIOS.slice(0, 4).map((s) => ({
    "@type": "Question",
    "name": `${s.title}에 적합한 부업은?`,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": `${s.desc}. 추천 부업: ${s.hustles
        .slice(0, 3)
        .map((h) => h.name)
        .join(", ")}`,
    },
  })),
};

export default function RecommendPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <div className="animate-fade-in">
        {/* 히어로 */}
        <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-indigo-900 text-white">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-4">
              🎯 맞춤 부업 추천
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              내 상황에 딱 맞는 부업 찾기
            </h1>
            <p className="text-emerald-200 text-sm sm:text-base">
              초보자·직장인·주부·학생 등 상황별로 추천 부업을 모았어요
            </p>
          </div>
        </section>

        {/* 빠른 이동 */}
        <div className="sticky top-[57px] z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="mx-auto max-w-4xl px-4 py-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {SCENARIOS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  {s.emoji} {s.title.split(" ")[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8 space-y-12">
          {SCENARIOS.map((scenario) => (
            <section key={scenario.id} id={scenario.id} className="scroll-mt-28">
              {/* 섹션 헤더 */}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{scenario.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-black text-slate-800 text-lg">{scenario.title}</h2>
                    {scenario.badge && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${scenario.badgeColor}`}>
                        {scenario.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{scenario.desc}</p>
                </div>
              </div>

              {/* 부업 목록 */}
              {scenario.hustles.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-2 card p-3">
                  {scenario.hustles.map((h) => (
                    <HustleCard key={h.id} hustle={h} />
                  ))}
                </div>
              ) : (
                <div className="card p-6 text-center text-slate-400 text-sm">
                  조건에 맞는 부업이 없어요
                </div>
              )}

              {/* 후기 보러가기 */}
              <div className="mt-3 flex gap-2">
                <Link
                  href="/?tab=reviews"
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
                >
                  → 이 부업들의 실제 후기 보기
                </Link>
                <span className="text-slate-300">·</span>
                <Link
                  href="/compare"
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                >
                  두 부업 비교하기 →
                </Link>
              </div>
            </section>
          ))}

          {/* 하단 CTA */}
          <div className="card p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-center">
            <p className="font-bold text-lg mb-1">직접 해봤다면 후기를 남겨주세요</p>
            <p className="text-indigo-200 text-sm mb-4">
              실제 경험이 쌓일수록 추천이 더 정확해져요
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/write"
                className="bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                ✏️ 후기 작성하기
              </Link>
              <Link
                href="/ranking"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                🏆 랭킹 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
