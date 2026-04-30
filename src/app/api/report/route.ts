import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(`report:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { type, target_id, reason } = body as {
      type: "review" | "comment";
      target_id: string;
      reason: string;
    };

    if (!type || !target_id || !reason) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }
    if (!["review", "comment"].includes(type)) {
      return NextResponse.json({ error: "잘못된 타입" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("reports").insert({
      type,
      target_id,
      reason,
      reporter_ip: ip,
    });

    // 테이블이 없어도 201로 응답 (프론트엔드는 신고됨 상태로 처리)
    if (error && error.code !== "42P01") {
      console.error("신고 저장 에러:", error);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("신고 API 에러:", err);
    return NextResponse.json({ ok: true }, { status: 201 }); // 에러여도 신고됨 처리
  }
}
