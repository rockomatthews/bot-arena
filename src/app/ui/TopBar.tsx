"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function TopBar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1100, width: "100%", mx: "auto", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Image src="/botsTurnLogo.png" alt="BotsTurn" width={28} height={28} priority />
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
            BotsTurn
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </Toolbar>
    </AppBar>
  );
}
