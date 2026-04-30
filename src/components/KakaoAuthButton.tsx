"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  kakaoLogin,
  kakaoLogout,
  getStoredUser,
  saveUser,
  type KakaoUser,
} from "@/lib/kakaoAuth";

function KakaoAuthButtonInner() {
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // 카카오 로그인 콜백 처리
    const loginStatus = searchParams.get("login");
    const userParam = searchParams.get("user");

    if (loginStatus === "success" && userParam) {
      try {
        const u = JSON.parse(userParam) as KakaoUser;
        saveUser(u);
        setUser(u);
        // 로그인 전 페이지로 복귀 (없으면 홈)
        const returnUrl = sessionStorage.getItem("kakao_return_url") ?? "/";
        sessionStorage.removeItem("kakao_return_url");
        window.history.replaceState({}, "", returnUrl);
      } catch {}
    } else if (loginStatus === "fail") {
      const reason = searchParams.get("reason") ?? "알 수 없는 오류";
      alert(`카카오 로그인에 실패했어요.\n\n오류: ${reason}`);
      // 실패 시에도 원래 페이지로
      const returnUrl = sessionStorage.getItem("kakao_return_url") ?? "/";
      sessionStorage.removeItem("kakao_return_url");
      window.history.replaceState({}, "", returnUrl);
    } else {
      setUser(getStoredUser());
    }
  }, [searchParams]);

  function handleLogin() {
    setLoading(true);
    kakaoLogin(); // 카카오 페이지로 리다이렉트
  }

  async function handleLogout() {
    await kakaoLogout();
    setUser(null);
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.profileImage}
            alt={user.nickname}
            className="w-7 h-7 rounded-full object-cover"
          />
        )}
        <span className="text-sm font-medium text-slate-700 hidden sm:block">
          {user.nickname}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center gap-2 bg-[#FEE500] hover:bg-[#F0D900] text-[#191919] text-sm font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-[#191919] border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#191919">
          <path d="M12 3C6.477 3 2 6.477 2 12c0 3.53 1.87 6.614 4.664 8.388L5.5 24l4.388-2.906C10.55 21.35 11.26 21.5 12 21.5c5.523 0 10-4.477 10-9.5S17.523 3 12 3z" />
        </svg>
      )}
      카카오 로그인
    </button>
  );
}

export default function KakaoAuthButton() {
  return (
    <Suspense fallback={<div className="w-24 h-9 bg-slate-100 rounded-lg animate-pulse" />}>
      <KakaoAuthButtonInner />
    </Suspense>
  );
}
