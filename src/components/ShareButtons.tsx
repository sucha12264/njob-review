"use client";

import { useState, useEffect } from "react";
import { initKakao } from "@/lib/kakaoAuth";

interface Props {
  title: string;
  description?: string;
}

export default function ShareButtons({ title, description }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    initKakao().catch(() => {});
  }, []);

  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: description, url });
    } else {
      copyLink();
    }
  };

  const shareKakao = async () => {
    if (typeof window === "undefined") return;
    await initKakao().catch(() => {});
    const kakao = (window as { Kakao?: { isInitialized?: () => boolean; Share?: { sendDefault: (opts: unknown) => void } } }).Kakao;
    if (!kakao?.isInitialized?.() || !kakao.Share) {
      copyLink(); // 카카오 초기화 실패 시 링크 복사로 대체
      return;
    }
    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description: description ?? "",
        imageUrl: "https://njob-review.vercel.app/opengraph-image",
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: "후기 보러가기", link: { mobileWebUrl: url, webUrl: url } }],
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">공유</span>
      {/* 카카오 공유 */}
      <button
        onClick={shareKakao}
        className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-300 flex items-center justify-center transition-colors"
        title="카카오톡 공유"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#3C1E1E">
          <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6l-.8 3.2 3.6-2.4c1 .2 2.1.3 3.2.3 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
        </svg>
      </button>
      {/* 링크 복사 */}
      <button
        onClick={copyLink}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm ${
          copied ? "bg-green-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
        }`}
        title="링크 복사"
      >
        {copied ? "✓" : "🔗"}
      </button>
      {/* 네이티브 공유 (모바일) */}
      <button
        onClick={shareNative}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-sm"
        title="공유하기"
      >
        ↗
      </button>
    </div>
  );
}
