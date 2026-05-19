import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";
import { rateLimit } from "@/lib/rateLimit";

// 클라이언트에서 마운트 시 호출 — 실제 방문만 카운트
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // IP+게시글 단위로 1분 1회 제한 (조회수 어뷰징 방지)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { id } = await params;
  const { allowed } = rateLimit(`post-view:${ip}:${id}`, 1, 60_000);
  if (!allowed) return NextResponse.json({ ok: true }); // 조용히 무시 (에러 표시 불필요)

  await supabaseAdmin.rpc("increment_post_views", { pid: id });
  return NextResponse.json({ ok: true });
}
