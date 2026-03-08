"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

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

  const openPx = round?.open_price ? Number(round.open_price) : null;
  const closePx = round?.close_price ? Number(round.close_price) : null;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                ARENA MODE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
                BTC Up / Down
              </Typography>
              <Typography sx={{ opacity: 0.8, mt: 0.5 }}>
                Own a bot. Coach it. It competes in 1-minute rounds.
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Card variant="outlined" sx={{ minWidth: 320 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                    {round ? `Round #${round.id}` : "Round"}
                  </Typography>
                  <Chip
                    label={round?.state || "—"}
                    color={
                      round?.state === "BETTING"
                        ? "success"
                        : round?.state === "LOCKED"
                          ? "warning"
                          : "default"
                    }
                    size="small"
                  />
                </Stack>

                <Typography sx={{ mt: 1, fontSize: 34, fontWeight: 900 }}>
                  {countdown !== null ? `${countdown}s` : "—"}
                </Typography>

                <Typography sx={{ opacity: 0.8, mt: 0.5 }}>
                  Open: {openPx ? `$${formatMoney(openPx)}` : "—"} · Close: {closePx ? `$${formatMoney(closePx)}` : "—"}
                </Typography>

                {round?.result ? (
                  <Typography sx={{ opacity: 0.9, mt: 1 }}>
                    Result: <b>{round.result}</b>
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Your Bot
                  </Typography>
                  <Typography sx={{ opacity: 0.8, mt: 1 }}>
                    Create a bot tied to your wallet. Your bot places picks each round.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button variant="outlined" onClick={() => alert("Next: create bot")}> 
                      Create bot
                    </Button>
                    <Button variant="outlined" onClick={() => alert("Next: select bot")}> 
                      Select bot
                    </Button>
                  </Stack>

                  <Typography sx={{ opacity: 0.7, mt: 2, fontSize: 13 }}>
                    Autopilot comes later (opt-in + risk caps). For now, you coach the bot.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Arena Actions
                  </Typography>
                  <Typography sx={{ opacity: 0.8, mt: 1 }}>
                    During <b>BETTING</b>, your bot can place one pick (1 USDC simulated for now).
                  </Typography>

                  <Grid container spacing={1.5} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        disabled={!round || round.state !== "BETTING"}
                        onClick={() => alert("Next: submit bot pick UP")}
                        sx={{ fontWeight: 900, py: 1.6 }}
                      >
                        BOT BET UP
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        disabled={!round || round.state !== "BETTING"}
                        onClick={() => alert("Next: submit bot pick DOWN")}
                        sx={{ fontWeight: 900, py: 1.6 }}
                      >
                        BOT BET DOWN
                      </Button>
                    </Grid>
                  </Grid>

                  <Typography sx={{ opacity: 0.7, mt: 2, fontSize: 13 }}>
                    We only turn on real USDC when you approve. Nothing spends money silently.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Mining + Staking (coming next)
                  </Typography>
                  <Typography sx={{ opacity: 0.85, mt: 1, lineHeight: 1.6 }}>
                    • Mine <b>Ore</b> by playing rounds (wins mine more)
                    <br />• Refine Ore over time (instant claim = penalty)
                    <br />• Stake Ore to unlock higher tiers + cosmetics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {status ? (
            <Typography sx={{ opacity: 0.8, fontSize: 12 }}>Error: {status}</Typography>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
