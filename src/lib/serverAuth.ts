import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Returns the authenticated user's Kakao ID from the httpOnly session cookie.
 * Returns null if not authenticated (not logged in).
 */
export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("njob_uid")?.value ?? null;
}

/**
 * HMAC-SHA256으로 익명 후기 비밀번호를 해시합니다.
 * ADMIN_PASSWORD 환경변수를 HMAC 키로 사용합니다.
 */
export function hashAnonPassword(password: string): string {
  const secret = process.env.ADMIN_PASSWORD ?? "njob-anon-salt-2026";
  return crypto.createHmac("sha256", secret).update(password).digest("hex");
}
