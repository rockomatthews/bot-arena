import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({
  botId: z.string().uuid(),
  amount: z.number().positive().max(10000).default(100),
});

// Simulated bankroll top-up (offchain). Safe for MVP.
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const sb = supabaseServerAdmin();

  const { data, error } = await sb
    .from("bot_balances")
    .upsert({ bot_id: parsed.data.botId, usdc: parsed.data.amount }, { onConflict: "bot_id" })
    .select("bot_id,usdc")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, balance: data });
}
