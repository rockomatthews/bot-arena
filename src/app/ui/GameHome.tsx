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
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import CreateBotDialog from "./_CreateBotDialog";
import { leaderboardColumns } from "./_leaderboard";
import Grid from "@mui/material/Grid";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useTheme } from "@mui/material/styles";
import { ARENA_ABI } from "../abi/arena";
import { USDC_ABI } from "../abi/usdc";
import { ARENA_ADDR, FEE_BPS, MAX_BET_USDC, USDC_BASE, parseUsdcAmount } from "./_onchain";

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

type Balance = {
  bot_id: string;
  usdc: number;
  ore_unrefined: number;
  ore_refined: number;
  ore_staked: number;
  updated_at: string;
};

type Pick = {
  id: number;
  round_id: number;
  bot_id: string;
  side: "UP" | "DOWN";
  created_at: string;
};

export default function GameHome() {
  const { address, isConnected } = useAccount();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [round, setRound] = useState<Round | null>(null);
  const [status, setStatus] = useState<string>("");

  const [bots, setBots] = useState<Bot[]>([]);
  const [balances, setBalances] = useState<Record<string, Balance>>({});
  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const [pick, setPick] = useState<Pick | null>(null);
  const [lastOutcome, setLastOutcome] = useState<
    | null
    | {
        roundId: number;
        result: string;
        picked: "UP" | "DOWN";
        outcome: "WIN" | "LOSS" | "DRAW";
      }
  >(null);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Onchain betting UI state
  const [betAmount, setBetAmount] = useState("1");
  const { writeContractAsync } = useWriteContract();

  const betAmountBn = useMemo(() => parseUsdcAmount(betAmount), [betAmount]);
  const maxBetBn = useMemo(() => parseUsdcAmount(String(MAX_BET_USDC)), []);

  const { data: usdcBal } = useReadContract({
    abi: USDC_ABI,
    address: USDC_BASE,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: allowance } = useReadContract({
    abi: USDC_ABI,
    address: USDC_BASE,
    functionName: "allowance",
    args: address && ARENA_ADDR ? [address, ARENA_ADDR] : undefined,
    query: { enabled: !!address && !!ARENA_ADDR },
  });
  const selectedBot = useMemo(
    () => bots.find((b) => b.id === selectedBotId) || null,
    [bots, selectedBotId]
  );

  const selectedBalance = selectedBot ? balances[selectedBot.id] : null;

  const [createOpen, setCreateOpen] = useState(false);
  const [newBotName, setNewBotName] = useState("My Bot");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refreshRound() {
      try {
        const tickRes = await fetch("/api/round/tick", { cache: "no-store" });
        const tickJson = await tickRes.json().catch(() => null);

        const res = await fetch("/api/round/current", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load round");

        if (!cancelled) {
          setRound(json.round);

          // If we just settled, refresh balances/pick and compute outcome
          const r: Round | null = json.round;
          if (r && r.state === "SETTLED") {
            await refreshSelectedPick(r, selectedBot);
            await refreshLeaderboard();

            if (selectedBot && address) {
              const balRes = await fetch("/api/bot/balances", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ botIds: bots.map((b) => b.id) }),
              });
              const balJson = await balRes.json();
              if (balRes.ok) {
                const map: Record<string, Balance> = {};
                for (const b of balJson.balances || []) map[b.bot_id] = b;
                setBalances(map);
              }
            }

            const settledResult = (tickJson && tickJson.round && tickJson.round.result) || r.result;
            if (settledResult && pick) {
              let outcome: "WIN" | "LOSS" | "DRAW" = "DRAW";
              if (settledResult === "DRAW") outcome = "DRAW";
              else if (pick.side === settledResult) outcome = "WIN";
              else outcome = "LOSS";
              setLastOutcome({ roundId: r.id, result: settledResult, picked: pick.side, outcome });
            }
          }
        }
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
      setBalances({});
      setSelectedBotId("");
      setPick(null);
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
        const loadedBots: Bot[] = json.bots || [];
        setBots(loadedBots);

        // balances
        if (loadedBots.length) {
          const balRes = await fetch("/api/bot/balances", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ botIds: loadedBots.map((b) => b.id) }),
          });
          const balJson = await balRes.json();
          if (balRes.ok) {
            const map: Record<string, Balance> = {};
            for (const b of balJson.balances || []) map[b.bot_id] = b;
            setBalances(map);
          }
        }

        const saved = localStorage.getItem("botsturn:selectedBotId") || "";
        if (saved && loadedBots.some((b) => b.id === saved)) setSelectedBotId(saved);
        else if (loadedBots.length) setSelectedBotId(loadedBots[0].id);
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

  async function refreshSelectedPick(r?: Round | null, b?: Bot | null) {
    const rr = r ?? round;
    const bb = b ?? selectedBot;
    if (!rr || !bb) {
      setPick(null);
      return;
    }
    const res = await fetch("/api/pick/status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ botId: bb.id, roundId: rr.id }),
    });
    const json = await res.json();
    if (res.ok) setPick(json.pick);
  }

  async function refreshLeaderboard() {
    const res = await fetch("/api/leaderboard", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setLeaderboard(json.leaderboard || []);
  }

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
      // refresh balances
      const balRes = await fetch("/api/bot/balances", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ botIds: (listJson.bots || []).map((b: Bot) => b.id) }),
      });
      const balJson = await balRes.json();
      if (balRes.ok) {
        const map: Record<string, Balance> = {};
        for (const b of balJson.balances || []) map[b.bot_id] = b;
        setBalances(map);
      }

      setCreateOpen(false);
      setStatus("Bot created");
      refreshLeaderboard();
    } catch (e: any) {
      setStatus(e?.message || "Error");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    // whenever round or selected bot changes, refresh pick status + leaderboard
    refreshSelectedPick().catch(() => {});
    refreshLeaderboard().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.id, selectedBotId]);

  useEffect(() => {
    // Clear outcome when a new round starts
    if (!round) return;
    if (lastOutcome && lastOutcome.roundId !== round.id) {
      setLastOutcome(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.id]);

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ maxWidth: 1100 }}>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems={{ md: "center" }}>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                ARENA MODE
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                }}
              >
                Is BTC up or down?
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

          <Grid container spacing={2.5} alignItems="stretch">
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
                    <>
                      <Typography sx={{ opacity: 0.85, mt: 2, fontSize: 13, lineHeight: 1.6 }}>
                        Selected: <b>{selectedBot.name}</b>
                        <br />Bankroll: <b>{selectedBalance ? Number(selectedBalance.usdc).toFixed(2) : "—"}</b> (simulated USDC)
                        <br />
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Image src="/ironCoinLogo.png" alt="IRON" width={16} height={16} />
                          <span>IRON:</span>
                        </span>{" "}
                        <b>
                          {selectedBalance
                            ? Number(selectedBalance.ore_unrefined || 0) + Number(selectedBalance.ore_refined || 0)
                            : "—"}
                        </b>
                      </Typography>

                      {selectedBalance && Number(selectedBalance.usdc) < 1 ? (
                        <Alert
                          severity="warning"
                          sx={{ mt: 2 }}
                          action={
                            <Button
                              color="inherit"
                              size="small"
                              onClick={async () => {
                                const res = await fetch("/api/bot/faucet", {
                                  method: "POST",
                                  headers: { "content-type": "application/json" },
                                  body: JSON.stringify({ botId: selectedBot.id, amount: 100 }),
                                });
                                const json = await res.json();
                                if (!res.ok) setStatus(json?.error || "Faucet failed");
                                else {
                                  setStatus("Bankroll topped up");
                                  // reload balances
                                  const balRes = await fetch("/api/bot/balances", {
                                    method: "POST",
                                    headers: { "content-type": "application/json" },
                                    body: JSON.stringify({ botIds: bots.map((b) => b.id) }),
                                  });
                                  const balJson = await balRes.json();
                                  if (balRes.ok) {
                                    const map: Record<string, Balance> = {};
                                    for (const b of balJson.balances || []) map[b.bot_id] = b;
                                    setBalances(map);
                                  }
                                }
                              }}
                            >
                              Faucet 100
                            </Button>
                          }
                        >
                          Insufficient bankroll to play.
                        </Alert>
                      ) : null}
                    </>
                  ) : null}

                  {pick ? (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      This round: your bot picked <b>{pick.side}</b>.
                    </Alert>
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
                    During <b>BETTING</b>, your bot can place one pick.
                  </Typography>

                  {lastOutcome ? (
                    <Alert
                      severity={
                        lastOutcome.outcome === "WIN"
                          ? "success"
                          : lastOutcome.outcome === "LOSS"
                            ? "error"
                            : "info"
                      }
                      sx={{ mt: 2 }}
                    >
                      Last round result: <b>{lastOutcome.result}</b>. Your bot picked <b>{lastOutcome.picked}</b> →{" "}
                      <b>{lastOutcome.outcome}</b>.
                    </Alert>
                  ) : null}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setBetAmount("1")}
                      sx={{ minWidth: 72 }}
                    >
                      1
                    </Button>
                    <Button variant="outlined" onClick={() => setBetAmount("5")} sx={{ minWidth: 72 }}>
                      5
                    </Button>
                    <Button variant="outlined" onClick={() => setBetAmount("10")} sx={{ minWidth: 72 }}>
                      10
                    </Button>
                    <Button variant="outlined" onClick={() => setBetAmount("25")} sx={{ minWidth: 72 }}>
                      25
                    </Button>
                    <Box sx={{ flex: 1 }} />
                    <Box sx={{ minWidth: { xs: "100%", sm: 180 } }}>
                      <Typography sx={{ opacity: 0.7, fontSize: 12, mb: 0.5 }}>Bet amount (USDC)</Typography>
                      <input
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.18)",
                          background: "rgba(0,0,0,0.25)",
                          color: "white",
                          fontSize: 14,
                        }}
                      />
                    </Box>
                  </Stack>

                  <Typography sx={{ opacity: 0.75, mt: 1, fontSize: 13, lineHeight: 1.7 }}>
                    Fee: <b>{(FEE_BPS / 100).toFixed(2)}%</b> per bet · Max: <b>${MAX_BET_USDC}</b> per round
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      disabled={!ARENA_ADDR || !address}
                      onClick={async () => {
                        if (!ARENA_ADDR) return;
                        try {
                          setStatus("");
                          await writeContractAsync({
                            abi: USDC_ABI,
                            address: USDC_BASE,
                            functionName: "approve",
                            args: [ARENA_ADDR, maxBetBn],
                          });
                          setStatus("USDC approved");
                        } catch (e: any) {
                          setStatus(e?.shortMessage || e?.message || "Approve failed");
                        }
                      }}
                    >
                      Approve USDC
                    </Button>
                    <Typography sx={{ opacity: 0.7, fontSize: 12, alignSelf: "center" }}>
                      (Required once before betting)
                    </Typography>
                  </Stack>

                  <Grid container spacing={1.5} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        disabled={!round || round.state !== "BETTING" || !selectedBot || !!pick}
                        onClick={async () => {
                          if (!round || !selectedBot || pick) return;
                          if (!round || !ARENA_ADDR || !address) {
                            setStatus("Connect wallet to bet");
                            return;
                          }
                          try {
                            setStatus("");
                            if (betAmountBn <= 0n) throw new Error("Enter a bet amount");
                            if (betAmountBn > maxBetBn) throw new Error(`Max bet is $${MAX_BET_USDC}`);
                            // requires allowance
                            // Side enum: 1=UP, 2=DOWN
                            await writeContractAsync({
                              abi: ARENA_ABI,
                              address: ARENA_ADDR,
                              functionName: "placeBet",
                              args: [BigInt(round.id), 1, betAmountBn],
                            });
                            setStatus("Bet submitted (onchain)");
                            await refreshSelectedPick(round, selectedBot);
                            await refreshLeaderboard();
                          } catch (e: any) {
                            setStatus(e?.shortMessage || e?.message || "Bet failed");
                          }
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
                        disabled={!round || round.state !== "BETTING" || !selectedBot || !!pick}
                        onClick={async () => {
                          if (!round || !selectedBot || pick) return;
                          if (!round || !ARENA_ADDR || !address) {
                            setStatus("Connect wallet to bet");
                            return;
                          }
                          try {
                            setStatus("");
                            if (betAmountBn <= 0n) throw new Error("Enter a bet amount");
                            if (betAmountBn > maxBetBn) throw new Error(`Max bet is $${MAX_BET_USDC}`);
                            await writeContractAsync({
                              abi: ARENA_ABI,
                              address: ARENA_ADDR,
                              functionName: "placeBet",
                              args: [BigInt(round.id), 2, betAmountBn],
                            });
                            setStatus("Bet submitted (onchain)");
                            await refreshSelectedPick(round, selectedBot);
                            await refreshLeaderboard();
                          } catch (e: any) {
                            setStatus(e?.shortMessage || e?.message || "Bet failed");
                          }
                        }}
                        sx={{ fontWeight: 900, py: 1.6 }}
                      >
                        BOT BET DOWN
                      </Button>
                    </Grid>
                  </Grid>

                  <Typography sx={{ opacity: 0.7, mt: 2, fontSize: 13 }}>
                    Real USDC comes later (opt-in). Right now this is a simulated bankroll so we can ship safely.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
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

            <Grid size={{ xs: 12, md: 7 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Leaderboard
                  </Typography>
                  <Typography sx={{ opacity: 0.75, mt: 0.5, fontSize: 13 }}>
                    Top bots by bankroll (simulated).
                  </Typography>

                  <Box sx={{ mt: 1.5 }}>
                    {isMobile ? (
                      <Stack spacing={1}>
                        {leaderboard.slice(0, 10).map((r) => (
                          <Card key={r.id} variant="outlined" sx={{ bgcolor: "rgba(255,255,255,0.03)" }}>
                            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontWeight: 900 }}>{r.name}</Typography>
                                <Typography sx={{ fontWeight: 900 }}>{Number(r.usdc).toFixed(2)}</Typography>
                              </Stack>
                              <Typography sx={{ opacity: 0.75, fontSize: 12, mt: 0.5 }}>
                                IRON {r.ore} · Picks {r.picks} · Wins {r.wins}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <div style={{ height: 360, width: "100%" }}>
                        <DataGrid
                          rows={leaderboard}
                          columns={leaderboardColumns as GridColDef[]}
                          disableRowSelectionOnClick
                          pageSizeOptions={[10, 25, 50]}
                          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                          density="compact"
                        />
                      </div>
                    )}
                  </Box>
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
