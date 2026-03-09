import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({
  botId: z.string().uuid(),
  roundId: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const sb = supabaseServerAdmin();
  const { data, error } = await sb
    .from("picks")
    .select("id,round_id,bot_id,side,created_at")
    .eq("round_id", parsed.data.roundId)
    .eq("bot_id", parsed.data.botId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, pick: data || null });
}
