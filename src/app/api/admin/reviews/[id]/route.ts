import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** DELETE /api/admin/reviews/[id] — 후기 + 딸린 댓글 삭제 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { id } = await params;

  // 댓글 먼저 삭제
  await supabaseAdmin.from("comments").delete().eq("review_id", id);
  // 후기 삭제
  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
