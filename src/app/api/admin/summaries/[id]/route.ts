import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** DELETE /api/admin/summaries/[hustle_id] — 캐시 삭제 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from("hustle_summaries")
    .delete()
    .eq("hustle_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
