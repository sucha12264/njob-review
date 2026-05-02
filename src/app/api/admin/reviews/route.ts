import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/reviews — 전체 후기 목록 */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviews = data ?? [];
  const stats = {
    total: reviews.length,
    today: reviews.filter((r) => new Date(r.created_at) >= today).length,
    withProof: reviews.filter((r) => r.proof_image_url).length,
  };

  return NextResponse.json({ reviews, stats });
}
