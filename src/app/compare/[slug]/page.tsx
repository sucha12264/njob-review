import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { HUSTLE_MAP } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
import { BASE_URL } from "@/lib/constants";
import { COMPARE_PAIRS } from "@/lib/comparePairs";

interface Props {
  params: Promise<{ slug: string }>;
}

const DIFFICULTY_LABEL = ["", "매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"];
const DIFFICULTY_COLOR = [
  "",
  "text-green-600",
  "text-green-600",
  "text-amber-600",
  "text-orange-600",
  "text-red-600",
];
const DIFFICULTY_BG = [
  "",
  "bg-green-50",
  "bg-green-50",
  "bg-amber-50",
  "bg-orange-50",
  "bg-red-50",
];


export async function generateStaticParams() {
  return COMPARE_PAIRS.map(({ a, b }) => ({ slug: `${a}-vs-${b}` }));
}

function parseSlug(slug: string): { idA: string; idB: string } | null {
  // "youtube-vs-tiktok" → idA="youtube", idB="tiktok"
  // "-vs-" 구분자 기준으로 나눔
  const vsIdx = slug.indexOf("-vs-");
  if (vsIdx === -1) return null;
  return { idA: slug.slice(0, vsIdx), idB: slug.slice(vsIdx + 4) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};

  const hustleA = HUSTLE_MAP[parsed.idA];
  const hustleB = HUSTLE_MAP[parsed.idB];
  if (!hustleA || !hustleB) return {};

  const year = new Date().getFullYear();
  const title = `${hustleA.name} vs ${hustleB.name} 비교 (${year}) — 어떤 부업이 나에게 맞을까? | N잡 후기판`;
  const description = `${hustleA.name}과 ${hustleB.name}을 수익·난이도·초기비용·장단점까지 상세 비교. 초보자라면 ${hustleA.difficulty <= hustleB.difficulty ? hustleA.name : hustleB.name}이 더 쉬워요. ${year} 최신 정보 기준.`;
  const url = `${BASE_URL}/compare/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "N잡 후기판",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CompareSlugPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return notFound();

  const hustleA = HUSTLE_MAP[parsed.idA];
  const hustleB = HUSTLE_MAP[parsed.idB];
  if (!hustleA || !hustleB) return notFound();

  const guideA = HUSTLE_GUIDES[parsed.idA] ?? null;
  const guideB = HUSTLE_GUIDES[parsed.idB] ?? null;
  const year = new Date().getFullYear();
  const pageUrl = `${BASE_URL}/compare/${slug}`;

  // 비교 결과 계산
  const easierHustle = hustleA.difficulty <= hustleB.difficulty ? hustleA : hustleB;
  const harderHustle = hustleA.difficulty <= hustleB.difficulty ? hustleB : hustleA;
  const freeStartHustles = [hustleA, hustleB].filter((h) => h.startupCost === "무료");

  // ─── JSON-LD ──────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${hustleA.name}과 ${hustleB.name} 중 어떤 부업이 초보자에게 적합한가요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `초보자에게는 난이도가 낮은 ${easierHustle.name}이 더 적합합니다. ${easierHustle.name}의 진입 난이도는 '${DIFFICULTY_LABEL[easierHustle.difficulty]}'이며, 초기 비용은 ${easierHustle.startupCost}입니다. ${harderHustle.name}은 난이도 '${DIFFICULTY_LABEL[harderHustle.difficulty]}'으로 어느 정도 경험이 쌓인 후 도전하는 것이 좋습니다.`,
        },
      },
      {
        "@type": "Question",
        "name": `${hustleA.name}으로 얼마나 벌 수 있나요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${hustleA.name}의 예상 수익은 ${hustleA.incomeRange}이며, 첫 수익까지 ${hustleA.timeToFirst} 정도 걸립니다. 초기 비용은 ${hustleA.startupCost}입니다.${guideA ? ` 주요 장점으로는 ${guideA.pros[0]}, ${guideA.pros[1] ?? ""}이 있습니다.` : ""}`,
        },
      },
      {
        "@type": "Question",
        "name": `${hustleB.name}으로 얼마나 벌 수 있나요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${hustleB.name}의 예상 수익은 ${hustleB.incomeRange}이며, 첫 수익까지 ${hustleB.timeToFirst} 정도 걸립니다. 초기 비용은 ${hustleB.startupCost}입니다.${guideB ? ` 주요 장점으로는 ${guideB.pros[0]}, ${guideB.pros[1] ?? ""}이 있습니다.` : ""}`,
        },
      },
      {
        "@type": "Question",
        "name": `${hustleA.name}과 ${hustleB.name}을 동시에 할 수 있나요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `두 부업은 카테고리가 다르므로 병행이 가능하지만, 초반에는 한 가지에 집중하는 것이 수익화에 유리합니다. ${hustleA.name}은 ${hustleA.category} 분야, ${hustleB.name}은 ${hustleB.category} 분야로 서로 보완적인 조합이 될 수 있습니다.`,
        },
      },
      {
        "@type": "Question",
        "name": `${hustleA.name}의 단점은 무엇인가요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": guideA
            ? guideA.cons.join(", ") + "이라는 단점이 있습니다."
            : `${hustleA.name}은 ${DIFFICULTY_LABEL[hustleA.difficulty]} 수준의 난이도로, 꾸준한 노력이 필요합니다.`,
        },
      },
      {
        "@type": "Question",
        "name": `${hustleB.name}의 단점은 무엇인가요?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": guideB
            ? guideB.cons.join(", ") + "이라는 단점이 있습니다."
            : `${hustleB.name}은 ${DIFFICULTY_LABEL[hustleB.difficulty]} 수준의 난이도로, 꾸준한 노력이 필요합니다.`,
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${hustleA.name} vs ${hustleB.name} 비교 (${year})`,
    "description": `${hustleA.name}과 ${hustleB.name}을 수익·난이도·초기비용·장단점 기준으로 상세 비교`,
    "url": pageUrl,
    "author": { "@type": "Organization", "name": "N잡 후기판" },
    "publisher": { "@type": "Organization", "name": "N잡 후기판" },
    "dateModified": new Date().toISOString().slice(0, 10),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "부업 비교", "item": `${BASE_URL}/compare` },
      { "@type": "ListItem", "position": 3, "name": `${hustleA.name} vs ${hustleB.name}`, "item": pageUrl },
    ],
  };

  // 관련 비교 (현재 조합 제외)
  const relatedPairs = COMPARE_PAIRS
    .filter((p) => !(p.a === parsed.idA && p.b === parsed.idB))
    .filter((p) => p.a === parsed.idA || p.b === parsed.idB || p.a === parsed.idB || p.b === parsed.idA)
    .slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">

        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6" aria-label="breadcrumb">
          <Link href="/" className="hover:text-slate-600 transition-colors">홈</Link>
          <span>›</span>
          <Link href="/compare" className="hover:text-slate-600 transition-colors">부업 비교</Link>
          <span>›</span>
          <span className="text-slate-600 font-medium">{hustleA.name} vs {hustleB.name}</span>
        </nav>

        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
            {hustleA.emoji} {hustleA.name} vs {hustleB.emoji} {hustleB.name}
            <br />
            <span className="text-indigo-600">상세 비교</span> ({year})
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            {hustleA.name}과 {hustleB.name}, 어떤 부업이 나에게 더 맞을까요?
            수익·난이도·초기비용·장단점까지 {year}년 최신 정보를 기준으로 비교합니다.
          </p>
        </header>

        {/* 한눈에 보는 버딕트 */}
        <section className="card p-6 mb-6 bg-indigo-50 border-indigo-100" aria-labelledby="verdict-heading">
          <h2 id="verdict-heading" className="font-black text-slate-800 text-base mb-4">⚡ 한줄 요약</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-indigo-100">
              <span className="text-sm font-bold text-slate-500 min-w-[90px]">초보자라면</span>
              <span className="text-indigo-700 font-black text-sm">→ {easierHustle.emoji} {easierHustle.name}</span>
              <span className="text-xs text-slate-400 hidden sm:block ml-auto">난이도 {DIFFICULTY_LABEL[easierHustle.difficulty]}</span>
            </div>
            {freeStartHustles.length > 0 && (
              <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-indigo-100">
                <span className="text-sm font-bold text-slate-500 min-w-[90px]">돈 없이 시작</span>
                <span className="text-indigo-700 font-black text-sm">→ {freeStartHustles.map((h) => `${h.emoji} ${h.name}`).join(", ")}</span>
                <span className="text-xs text-slate-400 hidden sm:block ml-auto">초기 비용 무료</span>
              </div>
            )}
            <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-indigo-100">
              <span className="text-sm font-bold text-slate-500 min-w-[90px]">{hustleA.category}</span>
              <span className="text-indigo-700 font-black text-sm">→ {hustleA.emoji} {hustleA.name}</span>
              <span className="text-xs text-slate-400 hidden sm:block ml-auto">{hustleA.category} 분야</span>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-indigo-100">
              <span className="text-sm font-bold text-slate-500 min-w-[90px]">{hustleB.category}</span>
              <span className="text-indigo-700 font-black text-sm">→ {hustleB.emoji} {hustleB.name}</span>
              <span className="text-xs text-slate-400 hidden sm:block ml-auto">{hustleB.category} 분야</span>
            </div>
          </div>
        </section>

        {/* 수치 비교 테이블 */}
        <section className="card p-6 mb-6" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="font-black text-slate-800 text-base mb-5">📊 핵심 지표 비교</h2>

          {/* 헤더 */}
          <div className="grid grid-cols-[1fr_80px_1fr] gap-2 mb-3">
            <div className="text-center">
              <div className="text-2xl mb-1">{hustleA.emoji}</div>
              <p className="font-black text-slate-800 text-sm">{hustleA.name}</p>
            </div>
            <div />
            <div className="text-center">
              <div className="text-2xl mb-1">{hustleB.emoji}</div>
              <p className="font-black text-slate-800 text-sm">{hustleB.name}</p>
            </div>
          </div>

          {/* 행들 */}
          {[
            {
              label: "예상 수익",
              a: <span className="font-bold text-indigo-700">{hustleA.incomeRange}</span>,
              b: <span className="font-bold text-indigo-700">{hustleB.incomeRange}</span>,
              better: null,
            },
            {
              label: "진입 난이도",
              a: (
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${DIFFICULTY_BG[hustleA.difficulty]} ${DIFFICULTY_COLOR[hustleA.difficulty]}`}>
                  {DIFFICULTY_LABEL[hustleA.difficulty]}
                </span>
              ),
              b: (
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${DIFFICULTY_BG[hustleB.difficulty]} ${DIFFICULTY_COLOR[hustleB.difficulty]}`}>
                  {DIFFICULTY_LABEL[hustleB.difficulty]}
                </span>
              ),
              better: hustleA.difficulty < hustleB.difficulty ? "a" : hustleB.difficulty < hustleA.difficulty ? "b" : "equal",
            },
            {
              label: "초기 비용",
              a: <span className="text-sm text-slate-700">{hustleA.startupCost}</span>,
              b: <span className="text-sm text-slate-700">{hustleB.startupCost}</span>,
              better:
                hustleA.startupCost === "무료" && hustleB.startupCost !== "무료" ? "a"
                  : hustleB.startupCost === "무료" && hustleA.startupCost !== "무료" ? "b"
                  : null,
            },
            {
              label: "첫 수익까지",
              a: <span className="text-sm text-slate-700">{hustleA.timeToFirst}</span>,
              b: <span className="text-sm text-slate-700">{hustleB.timeToFirst}</span>,
              better: null,
            },
            {
              label: "카테고리",
              a: <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">{hustleA.category}</span>,
              b: <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">{hustleB.category}</span>,
              better: null,
            },
          ].map((row) => (
            <div key={row.label} className="grid grid-cols-[1fr_80px_1fr] items-center gap-2 py-3 border-b border-slate-100 last:border-0">
              <div className={`text-center px-3 py-2 rounded-xl transition-colors ${row.better === "a" ? "bg-indigo-50 ring-1 ring-indigo-200" : ""}`}>
                {row.a}
              </div>
              <div className="text-[11px] font-bold text-slate-400 text-center">{row.label}</div>
              <div className={`text-center px-3 py-2 rounded-xl transition-colors ${row.better === "b" ? "bg-indigo-50 ring-1 ring-indigo-200" : ""}`}>
                {row.b}
              </div>
            </div>
          ))}
        </section>

        {/* 장단점 비교 */}
        {(guideA ?? guideB) && (
          <section className="mb-6" aria-labelledby="pros-cons-heading">
            <h2 id="pros-cons-heading" className="font-black text-slate-800 text-base mb-4">👍 장단점 비교</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { hustle: hustleA, guide: guideA },
                { hustle: hustleB, guide: guideB },
              ].map(({ hustle, guide }) => (
                <div key={hustle.id} className="card p-5">
                  <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                    <span>{hustle.emoji}</span> {hustle.name}
                  </h3>
                  {guide ? (
                    <>
                      <div className="mb-4">
                        <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">장점</p>
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
                        <p className="text-xs font-bold text-red-600 mb-2 uppercase tracking-wide">단점</p>
                        <ul className="space-y-1.5">
                          {guide.cons.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">가이드 정보 준비 중</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 이런 분께 추천 */}
        <section className="card p-6 mb-6" aria-labelledby="recommend-heading">
          <h2 id="recommend-heading" className="font-black text-slate-800 text-base mb-5">🎯 이런 분께 추천해요</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ hustle: hustleA, guide: guideA }, { hustle: hustleB, guide: guideB }].map(({ hustle, guide }) => (
              <div key={hustle.id} className="bg-slate-50 rounded-2xl p-4">
                <p className="font-black text-slate-800 mb-3 flex items-center gap-1.5">
                  <span>{hustle.emoji}</span>
                  <span>{hustle.name}</span>
                  <span className="text-slate-400 font-normal text-xs ml-auto">이런 분에게</span>
                </p>
                <ul className="space-y-2">
                  {hustle.difficulty <= 2 && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      부업을 처음 시작하는 초보자
                    </li>
                  )}
                  {hustle.startupCost === "무료" && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      초기 투자 없이 시작하고 싶은 분
                    </li>
                  )}
                  {hustle.category === "SNS·콘텐츠" && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      콘텐츠 제작을 즐기는 분
                    </li>
                  )}
                  {hustle.category === "재능판매" && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      특정 기술이나 전문성이 있는 분
                    </li>
                  )}
                  {hustle.category === "쇼핑몰·판매" && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      상품 소싱·판매에 관심 있는 분
                    </li>
                  )}
                  {hustle.category === "배달·서비스" && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      빠른 현금 수입이 필요한 분
                    </li>
                  )}
                  {guide && (
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-indigo-500 flex-shrink-0">→</span>
                      {guide.pros[0]}을 원하는 분
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="card p-6 mb-6" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-black text-slate-800 text-base mb-5">
            ❓ {hustleA.name} vs {hustleB.name} 자주 묻는 질문
          </h2>
          <div className="space-y-5">
            {[
              {
                q: `${hustleA.name}과 ${hustleB.name} 중 초보자에게 더 적합한 건?`,
                a: `초보자에게는 난이도가 낮은 ${easierHustle.name}(${DIFFICULTY_LABEL[easierHustle.difficulty]})이 더 적합합니다. ${easierHustle.name}은 초기 비용 ${easierHustle.startupCost}으로 시작할 수 있으며, 첫 수익까지 ${easierHustle.timeToFirst} 정도 소요됩니다.`,
              },
              {
                q: `${hustleA.name}과 ${hustleB.name}의 가장 큰 차이점은?`,
                a: `${hustleA.name}은 ${hustleA.category} 분야로 ${hustleA.incomeRange}의 수익을 기대할 수 있습니다. 반면 ${hustleB.name}은 ${hustleB.category} 분야로 ${hustleB.incomeRange}의 수익이 가능합니다. 난이도 면에서는 ${hustleA.name}이 '${DIFFICULTY_LABEL[hustleA.difficulty]}', ${hustleB.name}이 '${DIFFICULTY_LABEL[hustleB.difficulty]}'입니다.`,
              },
              {
                q: `${hustleA.name}과 ${hustleB.name}을 동시에 병행할 수 있나요?`,
                a: `두 부업을 동시에 병행하는 것은 가능하지만, 처음에는 한 가지에 집중하는 것이 빠른 수익화에 유리합니다. ${hustleA.name}(${hustleA.category})과 ${hustleB.name}(${hustleB.category})은 서로 다른 분야로 시너지를 낼 수 있는 조합이기도 합니다.`,
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-start gap-2">
                  <span className="text-indigo-500 font-black flex-shrink-0">Q.</span>
                  {item.q}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pl-5">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 후기 & 가이드 바로가기 */}
        <section className="grid sm:grid-cols-2 gap-4 mb-8" aria-label="관련 페이지 바로가기">
          {[hustleA, hustleB].map((h) => (
            <div key={h.id} className="card p-5">
              <p className="font-black text-slate-800 mb-3">{h.emoji} {h.name}</p>
              <div className="space-y-2">
                <Link
                  href={`/hustle/${h.id}`}
                  className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-4 py-2.5 transition-colors group"
                >
                  <span className="text-sm font-semibold text-indigo-700">실제 후기 보기</span>
                  <span className="text-indigo-400 text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
                <Link
                  href={`/hustle/${h.id}/guide`}
                  className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-600">시작 가이드</span>
                  <span className="text-slate-400 text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* 인터랙티브 비교 CTA */}
        <div className="card p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-center mb-8">
          <p className="text-2xl mb-2" aria-hidden="true">⚖️</p>
          <h2 className="font-black text-lg mb-2">다른 부업도 비교해보세요</h2>
          <p className="text-indigo-200 text-sm mb-5">
            62개 부업 중 원하는 조합을 자유롭게 비교할 수 있어요.
          </p>
          <Link
            href="/compare"
            className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            자유 비교 도구 사용하기 →
          </Link>
        </div>

        {/* 관련 비교 */}
        {relatedPairs.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-bold text-slate-700 text-sm mb-3">관련 비교</h2>
            <div className="flex flex-wrap gap-2">
              {relatedPairs.map((pair) => {
                const ha = HUSTLE_MAP[pair.a];
                const hb = HUSTLE_MAP[pair.b];
                if (!ha || !hb) return null;
                return (
                  <Link
                    key={`${pair.a}-vs-${pair.b}`}
                    href={`/compare/${pair.a}-vs-${pair.b}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-all"
                  >
                    {ha.emoji} {ha.name} vs {hb.emoji} {hb.name} →
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </>
  );
}
