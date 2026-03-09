import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({
  botIds: z.array(z.string().uuid()).max(50),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const sb = supabaseServerAdmin();
  const { data, error } = await sb
    .from("bot_balances")
    .select("bot_id,usdc,ore_unrefined,ore_refined,ore_staked,updated_at")
    .in("bot_id", parsed.data.botIds);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, balances: data || [] });
}
