import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/summaries — 캐시된 AI 요약 목록 */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { data, error } = await supabaseAdmin
    .from("hustle_summaries")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ summaries: data ?? [] });
}
