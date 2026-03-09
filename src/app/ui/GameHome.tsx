"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import CreateBotDialog from "./_CreateBotDialog";
import Grid from "@mui/material/Grid";
import { useAccount } from "wagmi";

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

type Bot = { id: string; name: string; avatar: string | null; created_at: string };

export default function GameHome() {
  const { address, isConnected } = useAccount();

  const [round, setRound] = useState<Round | null>(null);
  const [status, setStatus] = useState<string>("");

  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const selectedBot = useMemo(
    () => bots.find((b) => b.id === selectedBotId) || null,
    [bots, selectedBotId]
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("My Bot");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refreshRound() {
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

    refreshRound();
    const t = setInterval(refreshRound, 2000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    // Load bot list for connected wallet
    if (!isConnected || !address) {
      setBots([]);
      setSelectedBotId("");
      return;
    }

    let cancelled = false;

    async function loadBots() {
      setStatus("");
      // ensure owner exists
      await fetch("/api/me/ensure-owner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const res = await fetch("/api/bot/list", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load bots");

      if (!cancelled) {
        setBots(json.bots || []);
        const saved = localStorage.getItem("botsturn:selectedBotId") || "";
        if (saved && (json.bots || []).some((b: Bot) => b.id === saved)) setSelectedBotId(saved);
        else if ((json.bots || []).length) setSelectedBotId((json.bots || [])[0].id);
      }
    }

    loadBots().catch((e) => setStatus(e?.message || "Error"));
    return () => {
      cancelled = true;
    };
  }, [isConnected, address]);

  useEffect(() => {
    if (selectedBotId) localStorage.setItem("botsturn:selectedBotId", selectedBotId);
  }, [selectedBotId]);

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

  async function createBot() {
    if (!address) return;
    setCreating(true);
    setStatus("");
    try {
      const res = await fetch("/api/bot/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address, name: newBotName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Create failed");

      // reload bots
      const list = await fetch("/api/bot/list", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const listJson = await list.json();
      if (!list.ok) throw new Error(listJson?.error || "List failed");
      setBots(listJson.bots || []);
      setSelectedBotId(json.bot.id);
      setCreateOpen(false);
      setStatus("Bot created");
    } catch (e: any) {
      setStatus(e?.message || "Error");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
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

                  {!isConnected ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Connect your wallet (top right) to create/select a bot.
                    </Alert>
                  ) : null}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                    <Button variant="outlined" disabled={!isConnected} onClick={() => setCreateOpen(true)}>
                      Create bot
                    </Button>

                    <Select
                      size="small"
                      value={selectedBotId}
                      disabled={!isConnected || bots.length === 0}
                      displayEmpty
                      onChange={(e) => setSelectedBotId(String(e.target.value))}
                      sx={{ minWidth: 220 }}
                    >
                      <MenuItem value="">
                        <em>{bots.length ? "Select bot" : "No bots yet"}</em>
                      </MenuItem>
                      {bots.map((b) => (
                        <MenuItem key={b.id} value={b.id}>
                          {b.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>

                  {selectedBot ? (
                    <Typography sx={{ opacity: 0.8, mt: 2, fontSize: 13 }}>
                      Selected: <b>{selectedBot.name}</b>
                    </Typography>
                  ) : null}

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
                        disabled={!round || round.state !== "BETTING" || !selectedBot}
                        onClick={async () => {
                          if (!round || !selectedBot) return;
                          const res = await fetch("/api/pick", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ botId: selectedBot.id, roundId: round.id, side: "UP" }),
                          });
                          const json = await res.json();
                          if (!res.ok) setStatus(json?.error || "Pick failed");
                          else setStatus("Pick submitted");
                        }}
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
                        disabled={!round || round.state !== "BETTING" || !selectedBot}
                        onClick={async () => {
                          if (!round || !selectedBot) return;
                          const res = await fetch("/api/pick", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify({ botId: selectedBot.id, roundId: round.id, side: "DOWN" }),
                          });
                          const json = await res.json();
                          if (!res.ok) setStatus(json?.error || "Pick failed");
                          else setStatus("Pick submitted");
                        }}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Autopilot (coming soon)
                  </Typography>
                  <Typography sx={{ opacity: 0.85, mt: 1, lineHeight: 1.6 }}>
                    Soon you’ll be able to automate your bot with:
                    <br />• <b>Your own scripts</b>
                    <br />• <b>Purchased strategies</b> (marketplace)
                    <br />• <b>Risk caps</b> + explicit approvals (no silent spending)
                  </Typography>
                  <Typography sx={{ opacity: 0.7, mt: 1, fontSize: 13 }}>
                    For now: manual coaching + stats. Then we unlock automation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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
            <Typography sx={{ opacity: 0.8, fontSize: 12 }}>{status}</Typography>
          ) : null}

          <CreateBotDialog
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            name={newBotName}
            setName={setNewBotName}
            onCreate={createBot}
            disabled={!isConnected || creating}
          />
        </Stack>
      </Container>
    </Box>
  );
}
