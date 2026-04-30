import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase.server";

export async function POST(req: NextRequest) {
  try {
    const { hustle_id, hustle_name } = await req.json() as {
      hustle_id: string;
      hustle_name: string;
    };
    if (!hustle_id) {
      return NextResponse.json({ error: "hustle_id 필요" }, { status: 400 });
    }
    await supabaseAdmin
      .from("click_events")
      .insert({ hustle_id, hustle_name, event: "official_url_click" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
