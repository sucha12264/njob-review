import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

// 클라이언트에서 마운트 시 호출 — 실제 방문만 카운트
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await supabaseAdmin.rpc("increment_post_views", { pid: id });
  return NextResponse.json({ ok: true });
}
