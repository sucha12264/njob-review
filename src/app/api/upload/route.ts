import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 서비스 롤 키로 Storage 업로드 (RLS 우회)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydXltZGVrcXVpa3RlcmJxaGRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgxNTU4MCwiZXhwIjoyMDkyMzkxNTgwfQ.xGSxl5Q5Z38waPJI--TlMxuw3ASjx2KyD796_uS9G0c"
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

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

    const ext = file.name.split(".").pop() ?? "jpg";
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
