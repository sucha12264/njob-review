import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/clicks — 공식 URL 클릭 통계 */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  // DB에서 집계 — 전체 테이블 전송 방지
  const { data: stats, error } = await supabaseAdmin
    .from("click_events")
    .select("hustle_name")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // JS 집계 (PostgREST GROUP BY 미지원)
  const counts: Record<string, number> = {};
  (stats ?? []).forEach((c: { hustle_name: string }) => {
    counts[c.hustle_name] = (counts[c.hustle_name] ?? 0) + 1;
  });

  const ranked = Object.entries(counts)
    .map(([hustle_name, count]) => ({ hustle_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return NextResponse.json({ stats: ranked, total: stats?.length ?? 0 });
}
