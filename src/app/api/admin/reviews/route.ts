import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/reviews — 전체 후기 목록 */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  // 목록: 전체 필드 조회
  const { data: reviews, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 통계: 별도 count 쿼리 (전체 스캔 최소화)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [{ count: totalCount }, { count: todayCount }, { count: proofCount }] = await Promise.all([
    supabaseAdmin.from("reviews").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("reviews").select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabaseAdmin.from("reviews").select("*", { count: "exact", head: true })
      .not("proof_image_url", "is", null),
  ]);

  const stats = {
    total: totalCount ?? 0,
    today: todayCount ?? 0,
    withProof: proofCount ?? 0,
  };

  return NextResponse.json({ reviews: reviews ?? [], stats });
}
