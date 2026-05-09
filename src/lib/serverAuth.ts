import { cookies } from "next/headers";

/**
 * Returns the authenticated user's Kakao ID from the httpOnly session cookie.
 * Returns null if not authenticated (not logged in).
 *
 * Use this in any server-side route that needs to verify ownership.
 * Never trust kakao_user_id from the request body for auth — it's IDOR-prone.
 */
export async function getAuthUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("njob_uid")?.value ?? null;
}
