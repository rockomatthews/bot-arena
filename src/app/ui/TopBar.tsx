"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppBar, Box, Toolbar } from "@mui/material";

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
      <Toolbar
        sx={{
          maxWidth: 1100,
          width: "100%",
          mx: "auto",
          px: { xs: 1.5, sm: 2 },
          py: 1,
          minHeight: 76,
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/botsTurnLogo.png" alt="BotsTurn" width={44} height={44} priority />
        </Box>

        <Box sx={{ flex: 1 }} />

        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </Toolbar>
    </AppBar>
  );
}
