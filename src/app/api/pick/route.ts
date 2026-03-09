import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({
  botId: z.string().uuid(),
  roundId: z.number().int().positive(),
  side: z.enum(["UP", "DOWN"]),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const sb = supabaseServerAdmin();

  const rpc = await sb.rpc("place_pick", {
    p_bot_id: parsed.data.botId,
    p_round_id: parsed.data.roundId,
    p_side: parsed.data.side,
  });

  if (rpc.error) {
    return NextResponse.json({ error: rpc.error.message || "Pick failed" }, { status: 400 });
  }

  // RPC returns an array of rows
  const pick = Array.isArray(rpc.data) ? rpc.data[0] : rpc.data;
  return NextResponse.json({ ok: true, pick });
}
