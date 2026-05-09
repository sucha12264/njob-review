import { NextResponse } from "next/server";

/** POST /api/auth/logout — clears the httpOnly session cookie */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("njob_uid", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
