"use client";

import { useMemo } from "react";
import type {
  BaseTokenConfig,
  TokenBalanceData,
  LiquidityBreakdown,
} from "@/types/bridge";
import { useKleverAsset, useKleverAssets } from "./use-klever-asset";
import { useEvmBalances } from "./use-evm-balance";
import { formatBalance } from "@/utils/format";
import {
  calculateBackingRatio,
  getBackingStatus,
} from "@/utils/calculations";

interface UseTokenBalancesOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * Aggregate all balance data for a single token
 */
export function useTokenBalances(
  token: BaseTokenConfig,
  options: UseTokenBalancesOptions = {}
): TokenBalanceData {
  const { enabled = true, refetchInterval = 60_000 } = options;

  // Fetch EVM chain balances
  const evmBalances = useEvmBalances(
    token.sourceChains,
    token.decimals,
    { enabled, refetchInterval }
  );

  // Fetch KleverChain base token supply
  const kleverBaseToken = useKleverAsset(token.kleverChain.baseTokenId, {
    enabled,
    refetchInterval,
  });

  // Fetch liquidity token supplies
  const liquidityTokenIds = token.liquidityTokens.map((lt) => lt.kdaId);
  const liquidityTokens = useKleverAssets(liquidityTokenIds, {
    enabled,
    refetchInterval,
  });

  return useMemo(() => {
    const isLoading =
      evmBalances.isLoading ||
      kleverBaseToken.isLoading ||
      liquidityTokens.isLoading;

    const isError =
      evmBalances.isError ||
      kleverBaseToken.isError ||
      liquidityTokens.isError;

    // KleverChain minted supply
    const kleverMinted =
      kleverBaseToken.data?.circulatingSupply ?? BigInt(0);

    // Total locked on source chains
    const totalLocked = evmBalances.totalLocked;

    // Calculate backing ratio
    const backingRatio = calculateBackingRatio(totalLocked, kleverMinted);
    const backingStatus = getBackingStatus(backingRatio, isLoading, isError);

    // Build liquidity breakdown
    const liquidityBreakdown: LiquidityBreakdown[] = token.liquidityTokens.map(
      (lt) => {
        const assetData = liquidityTokens.data?.get(lt.kdaId);
        const balance = assetData?.circulatingSupply ?? BigInt(0);
        const totalLiquidity = kleverMinted;
        const percentage =
          totalLiquidity > BigInt(0)
            ? Number((balance * BigInt(10000)) / totalLiquidity) / 100
            : 0;

        return {
          chainId: lt.chainId,
          kdaId: lt.kdaId,
          balance,
          formattedBalance: formatBalance(balance, token.decimals),
          percentage,
          isLoading: liquidityTokens.isLoading,
          isError: liquidityTokens.isError,
        };
      }
    );

    return {
      tokenId: token.id,
      symbol: token.symbol,
      name: token.name,
      logo: token.logo,
      decimals: token.decimals,
      baseTokenId: token.kleverChain.baseTokenId,
      kleverMinted,
      formattedKleverMinted: formatBalance(kleverMinted, token.decimals),
      totalLocked,
      formattedTotalLocked: formatBalance(totalLocked, token.decimals),
      sourceChainBalances: evmBalances.balances,
      liquidityBreakdown,
      backingRatio,
      backingStatus,
      holdersCount: kleverBaseToken.data?.holdersCount,
      transactionsCount: kleverBaseToken.data?.transactionsCount,
      isLoading,
      isError,
    };
  }, [
    token,
    evmBalances,
    kleverBaseToken.data,
    kleverBaseToken.isLoading,
    kleverBaseToken.isError,
    liquidityTokens.data,
    liquidityTokens.isLoading,
    liquidityTokens.isError,
  ]);
}
