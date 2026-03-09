import { NextResponse } from "next/server";
import { getAddress } from "viem";

export const dynamic = "force-dynamic";

function normalize(addr: string | null) {
  if (!addr) return null;
  try {
    return getAddress(addr);
  } catch {
    return addr;
  }
}

export async function GET() {
  const arenaRaw = process.env.NEXT_PUBLIC_ARENA_CONTRACT_ADDRESS || null;
  const usdcRaw =
    process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE ||
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  return NextResponse.json({
    ok: true,
    commit:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
      null,
    arena: normalize(arenaRaw),
    arenaRaw,
    usdcBase: normalize(usdcRaw),
    usdcRaw,
  });
}
