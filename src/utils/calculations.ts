import type { BackingStatus } from "@/types/bridge";

/**
 * Calculate backing ratio (locked / minted)
 * Returns a number where 1.0 = 100% backed
 */
export function calculateBackingRatio(
  totalLocked: bigint,
  totalMinted: bigint
): number {
  if (totalMinted === BigInt(0)) {
    return totalLocked > BigInt(0) ? Infinity : 1;
  }

  // Use high precision for calculation
  const precision = BigInt(10 ** 18);
  const ratio = (totalLocked * precision) / totalMinted;

  return Number(ratio) / 10 ** 18;
}

/**
 * Determine backing status from ratio and loading state
 */
export function getBackingStatus(
  ratio: number,
  isLoading: boolean,
  isError: boolean
): BackingStatus {
  if (isLoading) return "loading";
  if (isError) return "error";

  if (ratio >= 1.0001) return "over-backed";
  if (ratio >= 0.9999) return "fully-backed";
  return "under-backed";
}
