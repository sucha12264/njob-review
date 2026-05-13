import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ALL_HUSTLES,
  SLUG_CATEGORY,
  CATEGORY_SLUG,
  CATEGORY_EMOJI,
  type SideHustle,
} from "@/lib/hustleData";
import { supabaseAdmin } from "@/lib/supabase.server";
import type { Review } from "@/lib/types";
import { INCOME_LABELS } from "@/lib/types";

const BASE_URL = "https://side-job-checker.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_DESC: Record<string, string> = {
  "SNS·콘텐츠": "유튜브·인스타·틱톡 등 SNS로 수익을 내는 콘텐츠 크리에이터 부업",
  "제휴마케팅": "쿠팡파트너스·네이버 블로그 등 링크 추천으로 수수료를 버는 부업",
  "재능판매": "크몽·숨고 등에서 내 기술과 재능을 팔아 수익을 내는 프리랜서 부업",
  "온라인강의": "클래스101·탈잉 등 플랫폼에서 내 노하우를 강의로 만들어 판매하는 부업",
  "쇼핑몰·판매": "스마트스토어·쿠팡로켓그로스 등 온라인 쇼핑몰 운영 부업",
  "리셀": "한정판 스니커즈·명품 등 희소 아이템을 되파는 리셀 부업",
  "앱테크·설문": "앱 설치·설문 참여·잠금화면 광고로 소액을 적립하는 생활형 부업",
  "투자": "주식·ETF·P2P 등 자산을 불려 수익을 내는 재테크 부업",
  "배달·서비스": "배달·대리운전·킥보드 충전 등 오프라인 기반 시간제 부업",
  "디지털콘텐츠": "전자책·노션 템플릿·스톡사진 등 한 번 만들면 계속 팔리는 디지털 상품",
  "기타": "특수 온라인 부업 및 신규 부업 유형 모음",
};

export async function generateStaticParams() {
  return Object.values(CATEGORY_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = SLUG_CATEGORY[slug];
  if (!category) return { title: "카테고리 없음" };

  const title = `${category} 부업 추천 & 후기 | N잡 후기판`;
  const description = `${CATEGORY_DESC[category] ?? category + " 부업 목록과 실제 후기"}. 난이도·수익·초기비용을 한눈에 비교하고 내게 맞는 부업을 찾아보세요.`;
  const url = `${BASE_URL}/category/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "N잡 후기판",
      locale: "ko_KR",
    },
  };
}

const DIFFICULTY_LABEL = ["", "매우쉬움", "쉬움", "보통", "어려움", "매우어려움"];
const DIFFICULTY_COLOR = ["", "text-green-600", "text-green-500", "text-amber-600", "text-orange-500", "text-red-500"];

function HustleCard({ h }: { h: SideHustle }) {
  return (
    <Link
      href={`/hustle/${h.id}`}
      className="card p-4 hover:border-indigo-200 hover:shadow-md transition-all group block"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{h.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
              {h.name}
            </p>
            {h.isHot && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">🔥 HOT</span>
            )}
            {h.isNew && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">NEW</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2">{h.oneline}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            <span className="text-indigo-600 font-bold">{h.incomeRange}</span>
            <span className="text-slate-400">초기비용 {h.startupCost}</span>
            <span className={DIFFICULTY_COLOR[h.difficulty]}>난이도 {DIFFICULTY_LABEL[h.difficulty]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <Link href={`/review/${r.id}`} className="block group">
      <div className="card p-4 hover:border-indigo-200 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{r.hustle_name}</span>
          <span className="text-amber-400 text-xs">{"★".repeat(r.satisfaction)}{"☆".repeat(5 - r.satisfaction)}</span>
        </div>
        <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors line-clamp-1 mb-1">
          {r.title}
        </p>
        <p className="text-xs text-slate-500 line-clamp-2">{r.content}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>{r.nickname}</span>
          <span>·</span>
          <span className="text-indigo-600 font-medium">{INCOME_LABELS[r.income_range]}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = SLUG_CATEGORY[slug];
  if (!category) return notFound();

  const hustles = ALL_HUSTLES.filter((h) => h.category === category && !h.isTerminated);

  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("id, hustle_id, hustle_name, title, content, satisfaction, income_range, nickname, created_at")
    .not("hustle_id", "like", "__hp__%")
    .in("hustle_id", hustles.map((h) => h.id))
    .order("created_at", { ascending: false })
    .limit(6);

  const reviewList = (reviews ?? []) as Review[];
  const emoji = CATEGORY_EMOJI[category];
  const desc = CATEGORY_DESC[category] ?? "";
  const pageUrl = `${BASE_URL}/category/${slug}`;

  // JSON-LD
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: category + " 부업", item: pageUrl },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} 부업 목록`,
    description: desc,
    url: pageUrl,
    numberOfItems: hustles.length,
    itemListElement: hustles.map((h, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: h.name,
      url: `${BASE_URL}/hustle/${h.id}`,
      description: h.oneline,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <div className="animate-fade-in">
        {/* 히어로 */}
        <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 text-white">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center">
            <div className="text-5xl mb-3">{emoji}</div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">{category} 부업</h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">{desc}</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">
                총 {hustles.length}개 부업
              </span>
              {reviewList.length > 0 && (
                <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1">
                  후기 {reviewList.length}개+
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-8 space-y-10">
          {/* 부업 목록 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-4">{emoji} {category} 부업 목록</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {hustles.map((h) => <HustleCard key={h.id} h={h} />)}
            </div>
          </section>

          {/* 실제 후기 */}
          {reviewList.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-800">✍️ 실제 후기</h2>
                <Link href="/" className="text-sm text-indigo-500 hover:text-indigo-700 font-semibold transition-colors">
                  전체 후기 보기 →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {reviewList.map((r) => <ReviewCard key={r.id} r={r} />)}
              </div>
            </section>
          )}

          {/* 관련 카테고리 */}
          <section>
            <h2 className="text-lg font-black text-slate-800 mb-4">🗂️ 다른 카테고리 부업</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_SLUG)
                .filter(([cat]) => cat !== category)
                .map(([cat, sl]) => (
                  <Link
                    key={sl}
                    href={`/category/${sl}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all bg-white"
                  >
                    {CATEGORY_EMOJI[cat as keyof typeof CATEGORY_EMOJI]} {cat}
                  </Link>
                ))}
            </div>
          </section>

          {/* CTA */}
          <div className="card p-6 bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-center">
            <p className="font-bold text-lg mb-1">{category} 부업 직접 해보셨나요?</p>
            <p className="text-indigo-200 text-sm mb-4">솔직한 후기가 쌓일수록 추천이 더 정확해져요</p>
            <Link
              href="/write"
              className="inline-block bg-white text-indigo-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              ✏️ 후기 작성하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
