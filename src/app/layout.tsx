import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { StoreProvider } from "@/lib/store";
import KakaoAuthButton from "@/components/KakaoAuthButton";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const BASE_URL = "https://njob-review.vercel.app";

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
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
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
