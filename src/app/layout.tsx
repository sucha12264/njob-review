import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { StoreProvider } from "@/lib/store";
import KakaoAuthButton from "@/components/KakaoAuthButton";
import BottomNav from "@/components/BottomNav";
import SearchTrigger from "@/components/SearchTrigger";
import "./globals.css";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "N잡 후기판 | 부업 솔직 후기 커뮤니티",
    template: "%s | N잡 후기판",
  },
  description:
    "N잡러들의 솔직한 부업 경험담. 수익·난이도·만족도 실제 후기를 확인하고 내게 맞는 부업을 찾아보세요.",
  keywords: [
    "N잡러", "부업 후기", "부업 추천", "투잡", "사이드잡",
    "온라인 부업", "재택 부업", "N잡", "부업 수익", "쿠팡파트너스",
  ],
  authors: [{ name: "N잡 후기판" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "N잡 후기판",
    title: "N잡 후기판 | 부업 솔직 후기 커뮤니티",
    description:
      "N잡러들의 솔직한 부업 경험담. 수익·난이도·만족도 실제 후기를 확인하고 내게 맞는 부업을 찾아보세요.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "N잡 후기판 - 부업 솔직 후기 커뮤니티",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "N잡 후기판 | 부업 솔직 후기 커뮤니티",
    description:
      "N잡러들의 솔직한 부업 경험담. 수익·난이도·만족도 실제 후기를 확인하고 내게 맞는 부업을 찾아보세요.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "KO1HpFUZLiQ8iLZRdGgbZqKkoM2Vvrv8Ruez0A4L1Qs",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "N잡 후기판",
      "url": BASE_URL,
      "description": "N잡러들의 솔직한 부업 경험담. 수익·난이도·만족도 실제 후기 커뮤니티.",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/icon.png`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "N잡 후기판",
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* Kakao CDN 사전 연결 — SDK 로딩 지연 감소 */}
        <link rel="preconnect" href="https://t1.kakaocdn.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://t1.kakaocdn.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* afterInteractive: 로그인은 OAuth 리다이렉트, 공유는 waitForKakao()로 대기하므로 렌더 차단 불필요 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen">
        <StoreProvider>
          {/* 헤더 */}
          <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-indigo-700 transition-colors">
                  N
                </div>
                <div>
                  <span className="font-black text-slate-800 text-base leading-none block">
                    N잡 후기판
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:block">부업 솔직 후기 커뮤니티</span>
                </div>
              </Link>
              <div className="flex items-center gap-2.5">
                {/* 검색 — 모바일/데스크톱 모두 표시 */}
                <SearchTrigger />
                <Link
                  href="/recommend"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
                >
                  🎯 <span className="hidden md:inline">추천</span>
                </Link>
                <Link
                  href="/compare"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
                >
                  ⚖️ <span className="hidden md:inline">비교</span>
                </Link>
                <Link
                  href="/ranking"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
                >
                  🏆 <span className="hidden md:inline">랭킹</span>
                </Link>
                <Link
                  href="/board"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
                >
                  📋 <span className="hidden md:inline">게시판</span>
                </Link>
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5"
                >
                  👤 <span className="hidden md:inline">내 후기</span>
                </Link>
                <KakaoAuthButton />
                <Link
                  href="/write"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95"
                >
                  <span>✏️</span>
                  <span className="hidden sm:inline">후기 쓰기</span>
                </Link>
              </div>
            </div>
          </header>

          {/* 콘텐츠 — 모바일 바텀 nav 공간 확보 */}
          <main className="pb-16 sm:pb-0">{children}</main>

          {/* planfix.kr 플로팅 버튼 — 전체 페이지 */}
          <a
            href="https://planfix.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-4 z-40 flex items-center gap-2.5 bg-white border border-indigo-200 shadow-lg rounded-2xl px-3.5 py-2.5 hover:shadow-xl hover:border-indigo-400 transition-all group max-w-[220px]"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
              📱
            </div>
            <p className="text-[11px] font-black text-indigo-700 leading-tight">서브폰(선불폰, 알뜰폰) 개통이 필요하다면?</p>
          </a>

          {/* 모바일 하단 네비게이션 */}
          <BottomNav />

          {/* 푸터 */}
          <footer className="bg-slate-900 text-slate-400 mt-20">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-xs">N</div>
                    <span className="font-bold text-white">N잡 후기판</span>
                  </div>
                  <p className="text-sm leading-relaxed max-w-xs">
                    실제로 해본 사람들의 솔직한 부업 이야기.<br />
                    과장 없이, 광고 없이, 진짜 경험만.
                  </p>
                </div>
                <div className="flex gap-12 text-sm">
                  <div>
                    <p className="font-semibold text-white mb-3">서비스</p>
                    <ul className="space-y-2">
                      <li><Link href="/" className="hover:text-white transition-colors">후기 목록</Link></li>
                      <li><Link href="/recommend" className="hover:text-white transition-colors">부업 추천</Link></li>
                      <li><Link href="/compare" className="hover:text-white transition-colors">부업 비교</Link></li>
                      <li><Link href="/ranking" className="hover:text-white transition-colors">부업 랭킹</Link></li>
                      <li><Link href="/board" className="hover:text-white transition-colors">자유게시판</Link></li>
                      <li><Link href="/write" className="hover:text-white transition-colors">후기 쓰기</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-3">안내</p>
                    <ul className="space-y-2">
                      <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
                      <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-10 pt-6 text-xs text-center space-y-1.5">
                <p>© 2026 N잡 후기판. All rights reserved. 본 사이트의 모든 콘텐츠 및 데이터의 저작권은 운영자에게 귀속됩니다.</p>
                <p className="text-slate-500">
                  ⚠️ 게시된 수익 정보는 작성자 개인의 경험이며, 동일한 수익을 보장하지 않습니다.
                  부업 활동으로 인한 결과에 대해 운영자는 책임을 지지 않습니다.
                </p>
                <p className="text-slate-600">
                  🚫 본 서비스의 콘텐츠·데이터·디자인의 무단 크롤링, 복제, 상업적 이용을 금지합니다.
                  위반 시 저작권법에 따라 법적 조치를 취할 수 있습니다. ·{" "}
                  <Link href="/terms" className="underline hover:text-slate-400 transition-colors">이용약관</Link>
                </p>
                <p className="text-slate-700">
                  이 사이트의 일부 링크는 쿠팡 파트너스 활동의 일환으로, 클릭·구매 시 수수료를 제공받을 수 있습니다.
                </p>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
