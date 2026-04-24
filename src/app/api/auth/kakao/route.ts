import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  // IP별 Rate Limiting: 1분에 10회 제한
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(ip, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/?login=fail", req.url));
  }

  try {
    // 1. 액세스 토큰 발급
    // NEXT_PUBLIC_ 변수는 서버에서 못 읽는 경우를 대비해 폴백 설정
    const restKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY
      ?? process.env.KAKAO_REST_KEY
      ?? "ca6d3ed39713fc962d92d1c154f79092";
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
      ?? process.env.KAKAO_REDIRECT_URI
      ?? "https://njob-review.vercel.app/api/auth/kakao";

    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: restKey,
      redirect_uri: redirectUri,
      code,
    };
    if (process.env.KAKAO_CLIENT_SECRET) {
      tokenParams.client_secret = process.env.KAKAO_CLIENT_SECRET;
    }

    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenParams),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      throw new Error(`TOKEN_FAIL: ${JSON.stringify(tokenData)}`);
    }

    // 2. 사용자 정보 조회
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    const user = {
      id: userData.id,
      nickname:
        userData.kakao_account?.profile?.nickname || `user_${userData.id}`,
      profileImage: userData.kakao_account?.profile?.profile_image_url || null,
    };

    // 3. 유저 정보를 쿼리스트링으로 전달 (클라이언트에서 저장)
    const params = new URLSearchParams({
      user: JSON.stringify(user),
    });
    return NextResponse.redirect(
      new URL(`/?login=success&${params}`, req.url)
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("카카오 로그인 에러:", msg);
    return NextResponse.redirect(new URL(`/?login=fail&reason=${encodeURIComponent(msg)}`, req.url));
  }
}
