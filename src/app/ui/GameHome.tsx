"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../page.module.css";

type RoundState = "BETTING" | "LOCKED" | "SETTLED";

type Round = {
  id: number;
  symbol: string;
  start_ts: string;
  betting_ends_ts: string;
  end_ts: string;
  state: RoundState;
  open_price: number | string | null;
  close_price: number | string | null;
  result: "UP" | "DOWN" | "DRAW" | null;
};

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function msUntil(iso: string) {
  return new Date(iso).getTime() - Date.now();
}

export default function GameHome() {
  const [round, setRound] = useState<Round | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        // Keep the game moving in the browser while we don't have a cron yet.
        await fetch("/api/round/tick", { cache: "no-store" });
        const res = await fetch("/api/round/current", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load round");
        if (!cancelled) setRound(json.round);
      } catch (e: any) {
        if (!cancelled) setStatus(e?.message || "Error");
      }
    }

    refresh();
    const t = setInterval(refresh, 2000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const countdown = useMemo(() => {
    if (!round) return null;
    const target =
      round.state === "BETTING"
        ? round.betting_ends_ts
        : round.state === "LOCKED"
          ? round.end_ts
          : null;
    if (!target) return null;
    const ms = msUntil(target);
    const s = Math.max(0, Math.floor(ms / 1000));
    return s;
  }, [round]);

  const roundLabel = round ? `Round #${round.id}` : "";

  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ width: "100%", maxWidth: 980 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, width: "100%" }}>
          <div>
            <div style={{ opacity: 0.8, fontSize: 12 }}>BOT ARENA</div>
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>BTC Up / Down</div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>{roundLabel}</div>
          </div>

          <div
            style={{
              minWidth: 240,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ opacity: 0.8, fontSize: 12 }}>STATE</div>
              <div style={{ fontWeight: 800 }}>{round?.state || "—"}</div>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
              <div style={{ opacity: 0.8, fontSize: 12 }}>
                {round?.state === "BETTING" ? "LOCKS IN" : round?.state === "LOCKED" ? "SETTLES IN" : ""}
              </div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{countdown !== null ? `${countdown}s` : "—"}</div>
            </div>
            <div style={{ marginTop: 10, opacity: 0.85, fontSize: 12 }}>
              Open: {round?.open_price ? `$${formatMoney(Number(round.open_price))}` : "—"} · Close: {round?.close_price ? `$${formatMoney(Number(round.close_price))}` : "—"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            width: "100%",
            marginTop: 16,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 900 }}>Your Bot</div>
            <div style={{ marginTop: 8, opacity: 0.85, lineHeight: 1.45 }}>
              Connect a wallet, create a bot, then your bot competes in the arena.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <button className={styles.secondary} onClick={() => alert("Next: wallet connect") }>
                Connect wallet
              </button>
              <button className={styles.secondary} onClick={() => alert("Next: create/select bot") }>
                Create bot
              </button>
            </div>
            <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>
              Autopilot is coming later (opt-in + risk caps).
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 900 }}>Arena Actions</div>
            <div style={{ marginTop: 8, opacity: 0.85, lineHeight: 1.45 }}>
              During BETTING, your bot can place one pick: UP or DOWN (1 USDC).
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <button
                className={styles.primary}
                disabled={!round || round.state !== "BETTING"}
                onClick={() => alert("Next: submit bot pick UP")}
                style={{ padding: 14, fontSize: 16, fontWeight: 900 }}
              >
                BOT BET UP
              </button>
              <button
                className={styles.primary}
                disabled={!round || round.state !== "BETTING"}
                onClick={() => alert("Next: submit bot pick DOWN")}
                style={{ padding: 14, fontSize: 16, fontWeight: 900 }}
              >
                BOT BET DOWN
              </button>
            </div>
            <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>
              For now this is simulated. We’ll turn on real USDC only when you approve.
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            marginTop: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 14,
            opacity: 0.9,
          }}
        >
          <div style={{ fontWeight: 900 }}>Mining + Staking (coming next)</div>
          <div style={{ marginTop: 8, lineHeight: 1.45 }}>
            • Mine <b>Ore</b> by playing rounds (wins mine more)
            <br />• Refine Ore over time (instant claim = penalty)
            <br />• Stake Ore to unlock higher tiers + cosmetics
          </div>
        </div>

        {status ? (
          <div style={{ width: "100%", marginTop: 12, opacity: 0.8, fontSize: 12 }}>Error: {status}</div>
        ) : null}
      </main>
    </div>
  );
}
