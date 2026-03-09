import { NextResponse } from "next/server";
import { supabaseServerAdmin } from "@/lib/supabase_server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseServerAdmin();

  // Simple leaderboard: bankroll + ore, plus total picks and wins.
  // (Offchain MVP; optimize later.)
  const bots = await sb
    .from("bots")
    .select("id,name,avatar,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (bots.error) return NextResponse.json({ error: bots.error.message }, { status: 500 });

  const botIds = (bots.data || []).map((b) => b.id);

  const balances = await sb
    .from("bot_balances")
    .select("bot_id,usdc,ore_unrefined,ore_refined,ore_staked")
    .in("bot_id", botIds);
  if (balances.error) return NextResponse.json({ error: balances.error.message }, { status: 500 });

  // Aggregate picks
  const picks = await sb
    .from("picks")
    .select("bot_id,round_id,side");
  if (picks.error) return NextResponse.json({ error: picks.error.message }, { status: 500 });

  const rounds = await sb.from("rounds").select("id,result");
  if (rounds.error) return NextResponse.json({ error: rounds.error.message }, { status: 500 });

  const roundResult = new Map<number, string>();
  for (const r of rounds.data || []) roundResult.set(r.id, r.result || "");

  const totals = new Map<string, { picks: number; wins: number }>();
  for (const p of picks.data || []) {
    const t = totals.get(p.bot_id) || { picks: 0, wins: 0 };
    t.picks += 1;
    const res = roundResult.get(p.round_id as any) || "";
    if (res && res !== "DRAW" && p.side === res) t.wins += 1;
    totals.set(p.bot_id, t);
  }

  const balMap = new Map<string, any>();
  for (const b of balances.data || []) balMap.set(b.bot_id, b);

  const rows = (bots.data || []).map((b) => {
    const bal = balMap.get(b.id) || {};
    const t = totals.get(b.id) || { picks: 0, wins: 0 };
    return {
      id: b.id,
      name: b.name,
      usdc: Number(bal.usdc || 0),
      ore: Number(bal.ore_unrefined || 0) + Number(bal.ore_refined || 0),
      picks: t.picks,
      wins: t.wins,
    };
  });

  rows.sort((a, b) => b.usdc - a.usdc);

  return NextResponse.json({ ok: true, leaderboard: rows.slice(0, 100) });
}
