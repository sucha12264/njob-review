import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase.server";

/** GET /api/admin/reports */
export async function GET(req: NextRequest) {
  const deny = checkAdminAuth(req);
  if (deny) return deny;

  const { data, error } = await supabaseAdmin
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reports: data ?? [] });
}
