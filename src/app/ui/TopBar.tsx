"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppBar, Box, IconButton, Tooltip, Toolbar } from "@mui/material";

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

        {/* Placeholder icons for upcoming features */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Marketplace (coming soon)">
            <span>
              <IconButton
                disabled
                size="small"
                sx={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 2,
                }}
              >
                <Image src="/botsTurnMarketplaceIcon.png" alt="Marketplace" width={22} height={22} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Scripting Playground (coming soon)">
            <span>
              <IconButton
                disabled
                size="small"
                sx={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 2,
                }}
              >
                <Image src="/botsTurnScriptingIcon.png" alt="Scripting" width={22} height={22} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </Toolbar>
    </AppBar>
  );
}
