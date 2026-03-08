import { NextResponse } from "next/server";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseServerAdmin();
  const { data, error } = await sb
    .from("rounds")
    .select("*")
    .order("start_ts", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, round: data || null });
}
