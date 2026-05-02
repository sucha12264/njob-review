import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/comments — 전체 댓글 목록 */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: data ?? [] });
}
