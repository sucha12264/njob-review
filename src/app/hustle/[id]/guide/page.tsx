import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { HUSTLE_MAP } from "@/lib/hustleData";
import { HUSTLE_GUIDES } from "@/lib/hustleGuides";
import { BASE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

const DIFFICULTY_LABEL = ["", "매우 쉬움", "쉬움", "보통", "어려움", "매우 어려움"];
const DIFFICULTY_COLOR = ["", "text-green-600", "text-green-600", "text-amber-600", "text-orange-600", "text-red-600"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return {};

  const guide = HUSTLE_GUIDES[id] ?? null;
  const year = new Date().getFullYear();
  const title = `${hustle.name} 시작하는 법 완벽 가이드 (${year}) | N잡 후기판`;
  const description = guide
    ? `${hustle.name} 수익화 방법 A to Z. 초기 비용 ${hustle.startupCost}, 예상 수익 ${hustle.incomeRange}. 단계별 시작 가이드, 실전 꿀팁 ${guide.tips.length}가지, 추천 플랫폼 정리.`
    : `${hustle.name} 시작하는 법. 예상 수익 ${hustle.incomeRange}, 난이도 ${DIFFICULTY_LABEL[hustle.difficulty]}, 초기 비용 ${hustle.startupCost}. N잡러 실전 가이드.`;
  const url = `${BASE_URL}/hustle/${id}/guide`;

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

export default async function HustleGuidePage({ params }: Props) {
  const { id } = await params;
  const hustle = HUSTLE_MAP[id];
  if (!hustle) return notFound();

  const guide = HUSTLE_GUIDES[id] ?? null;
  const year = new Date().getFullYear();
  const pageUrl = `${BASE_URL}/hustle/${id}/guide`;

  // ─── JSON-LD 스키마 ────────────────────────────────────
  // 1. HowTo 스키마 (가이드 단계)
  const howToSchema = guide
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `${hustle.name} 시작하는 법`,
        "description": `${hustle.name} 수익화 단계별 가이드. 예상 수익 ${hustle.incomeRange}, 초기 비용 ${hustle.startupCost}.`,
        "totalTime": hustle.timeToFirst,
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "KRW",
          "value": hustle.startupCost,
        },
        "step": guide.steps.map((step, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": step.title,
          "text": step.desc,
        })),
        "tool": guide.platforms.map((p) => ({
          "@type": "HowToTool",
          "name": p.name,
        })),
      }
    : null;

  // 2. FAQPage 스키마
  const faqSchema = guide
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${hustle.name} 얼마나 벌 수 있나요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${hustle.name}의 예상 수익은 ${hustle.incomeRange}이며, 첫 수익까지 ${hustle.timeToFirst} 정도 걸립니다. 초기 비용은 ${hustle.startupCost}입니다.`,
            },
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 난이도는 어떤가요?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${hustle.name}의 진입 난이도는 ${DIFFICULTY_LABEL[hustle.difficulty]}입니다. 장점: ${guide.pros.join(", ")}. 단점: ${guide.cons.join(", ")}.`,
            },
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 시작하는 법은?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": guide.steps.map((s, i) => `${i + 1}단계 ${s.title}: ${s.desc}`).join(" "),
            },
          },
          {
            "@type": "Question",
            "name": `${hustle.name} 시작할 때 필요한 것은?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `초기 비용 ${hustle.startupCost}이 필요하며, 추천 플랫폼은 ${guide.platforms.map((p) => p.name).join(", ")}입니다.`,
            },
          },
        ],
      }
    : null;

  // 3. Article 스키마
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${hustle.name} 시작하는 법 완벽 가이드 (${year})`,
    "description": hustle.description,
    "url": pageUrl,
    "author": {
      "@type": "Organization",
      "name": "N잡 후기판",
      "@id": `${BASE_URL}/#organization`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "N잡 후기판",
      "@id": `${BASE_URL}/#organization`,
    },
    "dateModified": new Date().toISOString().slice(0, 10),
    "mainEntityOfPage": pageUrl,
  };

  // 4. BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "홈", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": hustle.category, "item": `${BASE_URL}/category/${encodeURIComponent(hustle.category)}` },
      { "@type": "ListItem", "position": 3, "name": hustle.name, "item": `${BASE_URL}/hustle/${id}` },
      { "@type": "ListItem", "position": 4, "name": "시작 가이드", "item": pageUrl },
    ],
  };

  return (
    <>
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">

        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6" aria-label="breadcrumb">
          <Link href="/" className="hover:text-slate-600 transition-colors">홈</Link>
          <span>›</span>
          <Link href={`/hustle/${id}`} className="hover:text-slate-600 transition-colors">{hustle.name}</Link>
          <span>›</span>
          <span className="text-slate-600 font-medium">시작 가이드</span>
        </nav>

        {/* 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl" aria-hidden="true">{hustle.emoji}</span>
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium">
              {hustle.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
            {hustle.name} 시작하는 법<br />
            <span className="text-indigo-600">완벽 가이드</span> ({year})
          </h1>
          <p className="text-slate-500 leading-relaxed text-base">
            {hustle.description}
          </p>
        </header>

        {/* 핵심 수치 요약 */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8" aria-label="핵심 정보">
          {[
            { label: "예상 수익", value: hustle.incomeRange, icon: "💰" },
            { label: "초기 비용", value: hustle.startupCost, icon: "💳" },
            { label: "첫 수익까지", value: hustle.timeToFirst, icon: "⏱" },
            {
              label: "진입 난이도",
              value: DIFFICULTY_LABEL[hustle.difficulty],
              icon: "📊",
              colorClass: DIFFICULTY_COLOR[hustle.difficulty],
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
              <div className="text-xl mb-1" aria-hidden="true">{stat.icon}</div>
              <div className={`font-bold text-sm mb-0.5 ${stat.colorClass ?? "text-slate-800"}`}>{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* 장단점 */}
        {guide && (
          <section className="card p-6 mb-6" aria-labelledby="pros-cons-heading">
            <h2 id="pros-cons-heading" className="font-bold text-slate-800 text-lg mb-5">
              👍 {hustle.name} 장단점 한눈에 보기
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                  장점
                </h3>
                <ul className="space-y-2.5">
                  {guide.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-xs">✗</span>
                  단점
                </h3>
                <ul className="space-y-2.5">
                  {guide.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                      <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✗</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 단계별 가이드 */}
        {guide && (
          <section className="card p-6 mb-6" aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="font-bold text-slate-800 text-lg mb-6">
              🚀 {hustle.name} 단계별 시작 방법
            </h2>
            <ol className="space-y-6" role="list">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div
                    className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-black flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <div className="pt-1 min-w-0">
                    <h3 className="font-bold text-slate-800 mb-1.5">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 추천 플랫폼 */}
        {guide && guide.platforms.length > 0 && (
          <section className="card p-6 mb-6" aria-labelledby="platforms-heading">
            <h2 id="platforms-heading" className="font-bold text-slate-800 text-lg mb-4">
              🔗 {hustle.name}에 필요한 플랫폼 & 사이트
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {guide.platforms.map((plat, i) => (
                <a
                  key={i}
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center flex-shrink-0 transition-colors">
                    <span className="text-base" aria-hidden="true">🌐</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
                      {plat.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{plat.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 실전 꿀팁 */}
        {guide && guide.tips.length > 0 && (
          <section className="card p-6 mb-6 bg-amber-50 border border-amber-200" aria-labelledby="tips-heading">
            <h2 id="tips-heading" className="font-bold text-slate-800 text-lg mb-5">
              💡 {hustle.name} 실전 꿀팁 {guide.tips.length}가지
            </h2>
            <ul className="space-y-4" role="list">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-14 text-center text-xs font-black text-amber-700 bg-amber-200 px-2 py-1 rounded-lg mt-0.5">
                    TIP {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {guide && (
          <section className="card p-6 mb-8" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-bold text-slate-800 text-lg mb-5">
              ❓ {hustle.name} 자주 묻는 질문
            </h2>
            <div className="space-y-5">
              {[
                {
                  q: `${hustle.name} 얼마나 벌 수 있나요?`,
                  a: `예상 수익은 ${hustle.incomeRange}이며, 첫 수익까지 ${hustle.timeToFirst} 정도 걸립니다. 초기 비용은 ${hustle.startupCost}로 ${hustle.startupCost === "무료" ? "별도 초기 비용 없이 시작 가능합니다." : "준비가 필요합니다."}`,
                },
                {
                  q: `${hustle.name} 난이도는 어떤가요?`,
                  a: `진입 난이도는 '${DIFFICULTY_LABEL[hustle.difficulty]}'입니다. ${guide.pros[0]}이라는 장점이 있지만, ${guide.cons[0]}이라는 단점도 있어 사전에 충분히 파악하고 시작하는 것이 좋습니다.`,
                },
                {
                  q: `${hustle.name} 처음 시작할 때 가장 중요한 것은?`,
                  a: guide.steps[0]
                    ? `가장 먼저 해야 할 것은 '${guide.steps[0].title}'입니다. ${guide.steps[0].desc} 이후 단계를 차근차근 따라가면 빠르게 시작할 수 있습니다.`
                    : `${hustle.name}의 특성을 파악하고 작게 시작해보는 것이 중요합니다.`,
                },
                {
                  q: `${hustle.name}으로 수익을 높이는 핵심 팁은?`,
                  a: guide.tips[0] ?? `꾸준함과 시장 조사가 핵심입니다. ${hustle.name} 경험자들의 실제 후기를 참고하면 더 빠르게 성장할 수 있습니다.`,
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
        )}

        {/* 실제 후기 CTA */}
        <div className="card p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-center">
          <p className="text-2xl mb-2" aria-hidden="true">📊</p>
          <h2 className="font-black text-lg mb-2">
            {hustle.name} 실제 경험자 후기 보기
          </h2>
          <p className="text-indigo-200 text-sm mb-5">
            가이드만으론 부족해요. 실제로 해본 사람들의 솔직한 수익·난이도·만족도 후기를 확인하세요.
          </p>
          <Link
            href={`/hustle/${id}`}
            className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            실제 후기 {hustle.name.length > 0 ? hustle.name : ""} 보러가기 →
          </Link>
        </div>

      </div>
    </>
  );
}
