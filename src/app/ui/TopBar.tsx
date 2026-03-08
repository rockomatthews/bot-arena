"use client";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

export default function TopBar() {
  return (
    <AppBar position="sticky" elevation={0} sx={{ backdropFilter: "blur(10px)" }}>
      <Toolbar sx={{ maxWidth: 1100, width: "100%", mx: "auto" }}>
        <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
          Bot Arena
        </Typography>
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
