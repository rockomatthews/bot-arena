"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      // Dark but friendlier. Designed to make the BTC palette pop.
      default: "#05070D",
      paper: "rgba(255,255,255,0.06)",
    },
    // Palette inspired by BTCColorPallette.png
    // Orange (BTC), Blue, Green with neutral grays.
    primary: { main: "#F09020" },
    secondary: { main: "#1050A0" },
    success: { main: "#309040" },
    warning: { main: "#F09020" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 14,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundImage:
            "radial-gradient(1200px 600px at 0% 0%, rgba(240,144,32,0.10) 0%, rgba(0,0,0,0) 55%)," +
            "radial-gradient(900px 500px at 100% 0%, rgba(16,80,160,0.10) 0%, rgba(0,0,0,0) 55%)," +
            "radial-gradient(900px 600px at 30% 120%, rgba(48,144,64,0.08) 0%, rgba(0,0,0,0) 55%)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(90deg, rgba(240,144,32,0.12) 0%, rgba(16,80,160,0.12) 50%, rgba(48,144,64,0.10) 100%)",
        },
      },
    },
  },
});
