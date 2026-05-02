import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/clicks — 공식 URL 클릭 통계 */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { data, error } = await supabaseAdmin
    .from("click_events")
    .select("hustle_name, created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const counts: Record<string, number> = {};
  (data ?? []).forEach((c: { hustle_name: string }) => {
    counts[c.hustle_name] = (counts[c.hustle_name] ?? 0) + 1;
  });

  const stats = Object.entries(counts)
    .map(([hustle_name, count]) => ({ hustle_name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return NextResponse.json({ stats, total: data?.length ?? 0 });
}
