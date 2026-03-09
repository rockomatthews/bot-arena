"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, mainnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "BotsTurn",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    "e442eaaa1d55a9f4a094cccd35c0d0ad",
  chains: [base, mainnet],
  ssr: true,
});
