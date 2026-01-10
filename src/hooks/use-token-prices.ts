"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices, type TokenPrices } from "@/services/coingecko-api";
import bridgeAssetsConfig from "@/config/bridge-assets.json";
import type { BridgeAssetsConfig } from "@/types/bridge";

const config = bridgeAssetsConfig as BridgeAssetsConfig;

interface UseTokenPricesOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseTokenPricesResult {
  prices: TokenPrices;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook to fetch current USD prices for all configured tokens from CoinGecko
 * Caches prices and refreshes every 60 seconds by default
 */
export function useTokenPrices(
  options: UseTokenPricesOptions = {}
): UseTokenPricesResult {
  const { enabled = true, refetchInterval = 60_000 } = options;

  // Get all token IDs from config
  const tokenIds = config.baseTokens.map((token) => token.id);

  const {
    data: prices = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tokenPrices", tokenIds],
    queryFn: () => fetchTokenPrices(tokenIds),
    enabled,
    refetchInterval,
    staleTime: 30_000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60_000, // Keep in cache for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    prices,
    isLoading,
    isError,
    error: error as Error | null,
  };
}

/**
 * Calculate total USD value from token balances and prices
 */
export function calculateTotalUsdValue(
  tokens: Array<{ tokenId: string; totalLocked: bigint; decimals: number }>,
  prices: TokenPrices
): number {
  let totalUsd = 0;

  for (const token of tokens) {
    const price = prices[token.tokenId]?.usd;
    if (price !== undefined) {
      const tokenAmount = Number(token.totalLocked) / 10 ** token.decimals;
      totalUsd += tokenAmount * price;
    }
  }

  return totalUsd;
}

/**
 * Calculate USD value for a single token balance
 */
export function calculateTokenUsdValue(
  balance: bigint,
  decimals: number,
  priceUsd: number | undefined
): number | null {
  if (priceUsd === undefined) return null;
  const tokenAmount = Number(balance) / 10 ** decimals;
  return tokenAmount * priceUsd;
}
