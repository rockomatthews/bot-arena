import { parseUnits } from "viem";

export const USDC_BASE =
  (process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE as `0x${string}` | undefined) ||
  ("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const);

export const ARENA_ADDR =
  (process.env.NEXT_PUBLIC_ARENA_CONTRACT_ADDRESS as `0x${string}` | undefined) ||
  null;

export const FEE_BPS = 100; // 1%
export const MAX_BET_USDC = 25;

export function parseUsdcAmount(amount: string) {
  // USDC has 6 decimals on Base
  return parseUnits(amount || "0", 6);
}
