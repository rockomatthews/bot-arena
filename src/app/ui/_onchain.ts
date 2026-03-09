import { getAddress, parseUnits } from "viem";

function normalizeAddress(addr: string | undefined | null) {
  if (!addr) return null;
  try {
    return getAddress(addr);
  } catch {
    return null;
  }
}

export const USDC_BASE =
  (normalizeAddress(process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE) as `0x${string}` | null) ||
  ("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const);

export const ARENA_ADDR =
  (normalizeAddress(process.env.NEXT_PUBLIC_ARENA_CONTRACT_ADDRESS) as `0x${string}` | null) ||
  null;

export const FEE_BPS = 100; // 1%
export const MAX_BET_USDC = 25;
export const APPROVE_CAP_USDC = 500;

export const BET_CHIPS = [1, 2, 5, 10, 20, 25] as const;

export function parseUsdcAmount(amount: string) {
  // USDC has 6 decimals on Base
  return parseUnits(amount || "0", 6);
}
