import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthUserId } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  // 업로드: IP당 분당 5회
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`upload:${ip}`, 5, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 서버 쿠키로 로그인 여부 검증 (클라이언트 제공값 신뢰 금지)
    const kakaoUserId = await getAuthUserId();
    if (!kakaoUserId) {
      return NextResponse.json({ error: "로그인 후 이미지를 업로드할 수 있어요" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다" }, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "5MB 이하 파일만 업로드 가능합니다" }, { status: 400 });
    }

    // 이미지 타입만 허용
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다" }, { status: 400 });
    }

    // 확장자는 MIME 타입에서 결정 (클라이언트 파일명 신뢰 금지)
    const MIME_TO_EXT: Record<string, string> = {
      "image/jpeg": "jpg", "image/png": "png",
      "image/webp": "webp", "image/gif": "gif", "image/heic": "heic",
    };
    const ext = MIME_TO_EXT[file.type] ?? "jpg";
    const path = `proofs/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from("review-proofs")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from("review-proofs").getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("업로드 에러:", err);
    return NextResponse.json({ error: "업로드에 실패했습니다" }, { status: 500 });
  }
}
