import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({ address: z.string().min(6) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const address = parsed.data.address.toLowerCase();
  const sb = supabaseServerAdmin();

  const owner = await sb.from("owners").select("id").eq("address", address).maybeSingle();
  if (owner.error) return NextResponse.json({ error: owner.error.message }, { status: 500 });
  if (!owner.data) return NextResponse.json({ ok: true, bots: [] });

  const bots = await sb
    .from("bots")
    .select("id,name,avatar,created_at")
    .eq("owner_id", owner.data.id)
    .order("created_at", { ascending: false });

  if (bots.error) return NextResponse.json({ error: bots.error.message }, { status: 500 });
  return NextResponse.json({ ok: true, bots: bots.data });
}
