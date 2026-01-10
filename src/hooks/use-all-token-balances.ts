"use client";

import { useMemo, useRef } from "react";
import bridgeAssetsConfig from "@/config/bridge-assets.json";
import type { BridgeAssetsConfig, TokenBalanceData } from "@/types/bridge";
import { useTokenBalances } from "./use-token-balances";

const config = bridgeAssetsConfig as BridgeAssetsConfig;

interface UseAllTokenBalancesOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseAllTokenBalancesResult {
  tokens: TokenBalanceData[];
  isLoading: boolean;
  isError: boolean;
  dataUpdatedAt: number | null;
}

/**
 * Hook to fetch balances for all configured tokens
 * Note: This creates multiple hooks, one per token
 */
export function useAllTokenBalances(
  options: UseAllTokenBalancesOptions = {}
): UseAllTokenBalancesResult {
  // Get all token configs
  const tokenConfigs = config.baseTokens;
  const lastUpdatedRef = useRef<number | null>(null);

  // Create individual token balance hooks
  // Note: This is a pattern that works because the number of tokens is fixed
  // at build time (from JSON config)
  const token0 = useTokenBalances(tokenConfigs[0], options);
  const token1 = useTokenBalances(
    tokenConfigs[1] ?? tokenConfigs[0],
    { ...options, enabled: options.enabled && tokenConfigs.length > 1 }
  );
  const token2 = useTokenBalances(
    tokenConfigs[2] ?? tokenConfigs[0],
    { ...options, enabled: options.enabled && tokenConfigs.length > 2 }
  );
  const token3 = useTokenBalances(
    tokenConfigs[3] ?? tokenConfigs[0],
    { ...options, enabled: options.enabled && tokenConfigs.length > 3 }
  );

  return useMemo(() => {
    const allTokens = [token0, token1, token2, token3].slice(
      0,
      tokenConfigs.length
    );

    const isLoading = allTokens.some((t) => t.isLoading);
    const isError = allTokens.some((t) => t.isError);

    // Update timestamp when we have fresh data (not loading and not error)
    if (!isLoading && !isError && allTokens.length > 0) {
      lastUpdatedRef.current = Date.now();
    }

    return {
      tokens: allTokens,
      isLoading,
      isError,
      dataUpdatedAt: lastUpdatedRef.current,
    };
  }, [token0, token1, token2, token3, tokenConfigs.length]);
}

/**
 * Get the bridge assets configuration
 */
export function useBridgeConfig(): BridgeAssetsConfig {
  return config;
}
