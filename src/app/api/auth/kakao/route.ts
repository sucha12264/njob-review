import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/?login=fail", req.url));
  }

  try {
    // 1. 액세스 토큰 발급
    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_KAKAO_REST_KEY!,
      redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
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
    if (!tokenData.access_token) throw new Error("토큰 발급 실패");

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
    console.error("카카오 로그인 에러:", err);
    return NextResponse.redirect(new URL("/?login=fail", req.url));
  }
}
