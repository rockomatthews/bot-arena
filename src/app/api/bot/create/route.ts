import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

const Body = z.object({
  address: z.string().min(6),
  name: z.string().min(1).max(40),
  avatar: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const { name, avatar } = parsed.data;
  const address = parsed.data.address.toLowerCase();
  const sb = supabaseServerAdmin();

  // Ensure owner exists
  const owner = await sb
    .from("owners")
    .upsert({ address }, { onConflict: "address" })
    .select("id")
    .single();

  if (owner.error) return NextResponse.json({ error: owner.error.message }, { status: 500 });

  const bot = await sb
    .from("bots")
    .insert({ owner_id: owner.data.id, name, avatar: avatar || null })
    .select("id,name,avatar,created_at")
    .single();

  if (bot.error) return NextResponse.json({ error: bot.error.message }, { status: 500 });

  // Ensure balance row
  const bal = await sb
    .from("bot_balances")
    .upsert({ bot_id: bot.data.id }, { onConflict: "bot_id" })
    .select("bot_id")
    .single();
  if (bal.error) return NextResponse.json({ error: bal.error.message }, { status: 500 });

  return NextResponse.json({ ok: true, bot: bot.data });
}
