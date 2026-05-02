import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** PATCH /api/admin/reports/[id] — 신고 상태 변경 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { id } = await params;
  const { status } = await req.json() as { status: "resolved" | "dismissed" };

  const { error } = await supabaseAdmin
    .from("reports")
    .update({ status })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
