"use client";

import { useReadContracts } from "wagmi";
import type { SourceChainConfig, ChainBalance, ChainConfig } from "@/types/bridge";
import { formatBalance, normalizeDecimals } from "@/utils/format";
import bridgeAssetsConfig from "@/config/bridge-assets.json";

const BALANCE_OF_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

// Get chains config for logo lookup
const chainsConfig = bridgeAssetsConfig.chains as Record<string, ChainConfig>;

interface UseEvmBalancesOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * Fetch balances from multiple EVM chains using wagmi multicall
 */
export function useEvmBalances(
  sourceChains: SourceChainConfig[],
  targetDecimals: number,
  options: UseEvmBalancesOptions = {}
) {
  const { enabled = true, refetchInterval = 60_000 } = options;

  // Filter to only enabled EVM chains
  const evmChains = sourceChains.filter(
    (chain) => chain.enabled && chain.evmChainId !== undefined
  );

  // Build contract read configurations
  const contracts = evmChains.map((chain) => ({
    address: chain.tokenContract as `0x${string}`,
    abi: BALANCE_OF_ABI,
    functionName: "balanceOf" as const,
    args: [chain.bridgeContract as `0x${string}`] as const,
    chainId: chain.evmChainId as 1 | 56 | 137 | 42161,
  }));

  const result = useReadContracts({
    contracts,
    query: {
      enabled: enabled && contracts.length > 0,
      staleTime: 30_000,
      refetchInterval,
    },
  });

  // Transform results into ChainBalance array
  const balances: ChainBalance[] = evmChains.map((chain, index) => {
    const contractResult = result.data?.[index];
    const balance =
      contractResult?.status === "success"
        ? BigInt(contractResult.result as bigint)
        : BigInt(0);

    // Get chain logo from config
    const chainLogo = chainsConfig[chain.chainId]?.logo;

    return {
      chainId: chain.chainId,
      chainName: chain.chainName,
      logo: chainLogo,
      balance,
      formattedBalance: formatBalance(balance, chain.decimals),
      decimals: chain.decimals,
      percentage: 0, // Will be calculated later
      isLoading: result.isLoading,
      isError: contractResult?.status === "failure",
      error:
        contractResult?.status === "failure"
          ? new Error(String(contractResult.error))
          : undefined,
    };
  });

  // Calculate total for percentage computation
  const totalNormalized = balances.reduce((sum, chain) => {
    const normalized = normalizeDecimals(
      chain.balance,
      chain.decimals,
      targetDecimals
    );
    return sum + normalized;
  }, BigInt(0));

  // Update percentages
  balances.forEach((chain) => {
    if (totalNormalized > BigInt(0)) {
      const normalized = normalizeDecimals(
        chain.balance,
        chain.decimals,
        targetDecimals
      );
      chain.percentage =
        Number((normalized * BigInt(10000)) / totalNormalized) / 100;
    }
  });

  return {
    balances,
    totalLocked: totalNormalized,
    formattedTotalLocked: formatBalance(totalNormalized, targetDecimals),
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
