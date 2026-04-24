export interface KakaoUser {
  id: number;
  nickname: string;
  profileImage?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

function waitForKakao(timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (typeof window.Kakao !== "undefined") {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error("Kakao SDK 로딩 실패"));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

export async function initKakao() {
  if (typeof window === "undefined") return;
  await waitForKakao();
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
  }
}

// SDK 없이 직접 OAuth URL로 리다이렉트
export function kakaoLogin() {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!);
  window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
}

export async function kakaoLogout(): Promise<void> {
  localStorage.removeItem("kakao_user");
}

export function getStoredUser(): KakaoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("kakao_user");
    return stored ? (JSON.parse(stored) as KakaoUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: KakaoUser) {
  localStorage.setItem("kakao_user", JSON.stringify(user));
}
