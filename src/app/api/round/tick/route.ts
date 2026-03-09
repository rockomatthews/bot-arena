import { NextResponse } from "next/server";
import { supabaseServerAdmin } from "@/lib/supabase_server";
import { fetchCoinbaseBTCUSD } from "@/lib/price";

export const dynamic = "force-dynamic";

function roundTimes(now: Date) {
  const roundSeconds = Number(process.env.ROUND_SECONDS || "60");
  const bettingSeconds = Number(process.env.BETTING_SECONDS || "30");

  const t = Math.floor(now.getTime() / 1000);
  const start = Math.floor(t / roundSeconds) * roundSeconds;

  const startTs = new Date(start * 1000);
  const bettingEndsTs = new Date((start + bettingSeconds) * 1000);
  const endTs = new Date((start + roundSeconds) * 1000);

  return { startTs, bettingEndsTs, endTs };
}

async function tick() {
  const sb = supabaseServerAdmin();

  // Determine the current round boundaries.
  const now = new Date();
  const { startTs, bettingEndsTs, endTs } = roundTimes(now);

  // Ensure round exists
  const { data: existing, error: selErr } = await sb
    .from("rounds")
    .select("*")
    .eq("symbol", "BTCUSD")
    .eq("start_ts", startTs.toISOString())
    .maybeSingle();

  if (selErr) return NextResponse.json({ error: selErr.message }, { status: 500 });

  let round = existing;
  if (!round) {
    const openPrice = await fetchCoinbaseBTCUSD();
    const ins = await sb
      .from("rounds")
      .insert({
        symbol: "BTCUSD",
        start_ts: startTs.toISOString(),
        betting_ends_ts: bettingEndsTs.toISOString(),
        end_ts: endTs.toISOString(),
        state: "BETTING",
        open_price: openPrice,
      })
      .select("*")
      .single();

    if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });
    round = ins.data;
  }

  // State transitions
  const nowMs = now.getTime();

  if (round.state === "BETTING" && nowMs >= new Date(round.betting_ends_ts).getTime()) {
    const up = await sb.from("rounds").update({ state: "LOCKED" }).eq("id", round.id).select("*").single();
    if (up.error) return NextResponse.json({ error: up.error.message }, { status: 500 });
    round = up.data;
  }

  if (round.state !== "SETTLED" && nowMs >= new Date(round.end_ts).getTime()) {
    const closePrice = await fetchCoinbaseBTCUSD();
    let result: "UP" | "DOWN" | "DRAW" = "DRAW";
    if (Number(closePrice) > Number(round.open_price)) result = "UP";
    else if (Number(closePrice) < Number(round.open_price)) result = "DOWN";

    const up = await sb
      .from("rounds")
      .update({ state: "SETTLED", close_price: closePrice, result })
      .eq("id", round.id)
      .select("*")
      .single();

    if (up.error) return NextResponse.json({ error: up.error.message }, { status: 500 });
    round = up.data;
  }

  // If the round is settled, ensure payouts are applied exactly once.
  if (round.state === "SETTLED") {
    const settle = await sb.rpc("settle_round", { p_round_id: round.id });
    if (settle.error) {
      return NextResponse.json({ error: settle.error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, round, settle: settle.data });
  }

  return NextResponse.json({ ok: true, round });
}

export async function POST() {
  return tick();
}

// Convenience for browser testing
export async function GET() {
  return tick();
}
