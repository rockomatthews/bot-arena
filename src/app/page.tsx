"use client";

import dynamic from "next/dynamic";
import GameHome from "./ui/GameHome";
import TopBar from "./ui/TopBar";

const Web3Providers = dynamic(() => import("./Web3Providers"), { ssr: false });

export default function Home() {
  return (
    <Web3Providers>
      <TopBar />
      <GameHome />
    </Web3Providers>
  );
}
