"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#070A12",
      paper: "rgba(255,255,255,0.06)",
    },
    primary: { main: "#7C5CFF" },
    secondary: { main: "#2DD4BF" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },
});
