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

  // Create pick (unique constraint prevents double picks)
  const ins = await sb
    .from("picks")
    .insert({ round_id: parsed.data.roundId, bot_id: parsed.data.botId, side: parsed.data.side })
    .select("id,round_id,bot_id,side,created_at")
    .single();

  if (ins.error) {
    // handle duplicate
    const msg = ins.error.message || "Pick failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json({ ok: true, pick: ins.data });
}
