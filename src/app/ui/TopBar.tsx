"use client";

import Image from "next/image";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

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
      <Toolbar sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Image src="/botsTurnLogo.png" alt="BotsTurn" width={28} height={28} priority />
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
            BotsTurn
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          onClick={() => alert("Next: wagmi wallet connect")}
          sx={{ textTransform: "none", fontWeight: 800 }}
        >
          Connect wallet
        </Button>
      </Toolbar>
    </AppBar>
  );
}
