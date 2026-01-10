"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";
import { formatUsdValue } from "@/services/coingecko-api";
import type { TokenBalanceData } from "@/types/bridge";
import type { TokenPrices } from "@/services/coingecko-api";
import bridgeAssetsConfig from "@/config/bridge-assets.json";
import type { BridgeAssetsConfig } from "@/types/bridge";

const config = bridgeAssetsConfig as BridgeAssetsConfig;

interface ChainDistribution {
  chainId: string;
  chainName: string;
  logo: string;
  usdValue: number;
  percentage: number;
  color: string;
}

interface TVLHeroProps {
  tokens: TokenBalanceData[];
  prices: TokenPrices;
  isLoading: boolean;
  isPricesLoading: boolean;
}

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  bsc: "#F3BA2F",
  polygon: "#8247E5",
  arbitrum: "#28A0F0",
  tron: "#FF0013",
  klever: "#e91e8c",
};

export function TVLHero({ tokens, prices, isLoading, isPricesLoading }: TVLHeroProps) {
  const stats = useMemo(() => {
    // Calculate total USD value across all tokens and chains
    let totalUsdLocked = 0;
    let totalUsdMinted = 0;
    const chainUsdAmounts = new Map<string, number>();

    for (const token of tokens) {
      // Get price for this token (fallback to $1 for stablecoins)
      const tokenPrice = prices[token.tokenId]?.usd ??
        (token.tokenId === "usdt" || token.tokenId === "usdc" ? 1 : 0);

      // Convert to USD using proper decimals
      const lockedAmount = Number(token.totalLocked) / 10 ** token.decimals;
      const mintedAmount = Number(token.kleverMinted) / 10 ** token.decimals;

      const lockedUsd = lockedAmount * tokenPrice;
      const mintedUsd = mintedAmount * tokenPrice;

      totalUsdLocked += lockedUsd;
      totalUsdMinted += mintedUsd;

      // Calculate USD value per chain
      for (const chain of token.sourceChainBalances) {
        const chainAmount = Number(chain.balance) / 10 ** chain.decimals;
        const chainUsd = chainAmount * tokenPrice;
        const current = chainUsdAmounts.get(chain.chainId) ?? 0;
        chainUsdAmounts.set(chain.chainId, current + chainUsd);
      }
    }

    // Build chain distribution
    const chainDistribution: ChainDistribution[] = [];
    for (const [chainId, usdValue] of chainUsdAmounts) {
      const chainConfig = config.chains[chainId];
      const percentage = totalUsdLocked > 0 ? (usdValue / totalUsdLocked) * 100 : 0;

      chainDistribution.push({
        chainId,
        chainName: chainConfig?.name ?? chainId,
        logo: chainConfig?.logo ?? `/assets/chains/${chainId}.png`,
        usdValue,
        percentage,
        color: CHAIN_COLORS[chainId] ?? "#6b7280",
      });
    }

    // Sort by USD value descending
    chainDistribution.sort((a, b) => b.usdValue - a.usdValue);

    // Calculate overall backing ratio (using USD values for weighted average)
    const backingRatio = totalUsdMinted > 0 ? (totalUsdLocked / totalUsdMinted) * 100 : 100;

    // Count unique chains with activity
    const activeChains = chainDistribution.filter((c) => c.usdValue > 0).length;

    return {
      totalUsdLocked,
      totalUsdMinted,
      chainDistribution,
      backingRatio,
      totalTokens: tokens.length,
      activeChains,
    };
  }, [tokens, prices]);

  // Display TVL in USD
  const displayTVL = stats.totalUsdLocked;
  const showLoading = isLoading || isPricesLoading;

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-glass rounded-2xl p-6 md:p-8 mb-8"
      aria-label="Bridge statistics overview"
    >
      {/* TVL Counter */}
      <div className="text-center mb-6">
        <p className="stat-label mb-2">Total Value Locked</p>
        {showLoading ? (
          <div className="h-14 flex items-center justify-center">
            <div className="animate-shimmer h-10 w-48 rounded-lg" />
          </div>
        ) : (
          <h2 className="stat-tvl text-gradient tabular-nums">
            <AnimatedNumber
              value={displayTVL}
              decimals={2}
              prefix="$"
              compact={displayTVL >= 1000}
              duration={1200}
            />
          </h2>
        )}
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Across {stats.activeChains} source chains
        </p>
      </div>

      {/* Chain Distribution Bar */}
      {!showLoading && stats.chainDistribution.length > 0 && (
        <div className="mb-6">
          <p className="stat-label mb-3 text-center">Chain Distribution</p>
          <div className="h-4 rounded-full overflow-hidden flex bg-(--muted) shadow-inner">
            {stats.chainDistribution.map((chain, index) => (
              <motion.div
                key={chain.chainId}
                initial={{ width: 0 }}
                animate={{ width: `${chain.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className="h-full relative group cursor-pointer hover:brightness-110 transition-all"
                style={{ backgroundColor: chain.color }}
              >
                {/* Enhanced tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-(--background-secondary) border border-(--border) rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src={chain.logo}
                      alt={chain.chainName}
                      width={16}
                      height={16}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-(--foreground)">{chain.chainName}</span>
                  </div>
                  <div className="text-(--muted-foreground) space-y-0.5">
                    <div className="flex justify-between gap-4">
                      <span>Value:</span>
                      <span className="text-(--foreground) tabular-nums">{formatUsdValue(chain.usdValue)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Share:</span>
                      <span className="text-(--foreground) tabular-nums">{chain.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-(--border)" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Chain Legend with icons */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
            {stats.chainDistribution.map((chain) => (
              <motion.div
                key={chain.chainId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-2 text-xs group cursor-default"
              >
                <div className="relative">
                  <Image
                    src={chain.logo}
                    alt={chain.chainName}
                    width={20}
                    height={20}
                    className="rounded-full ring-2 ring-transparent group-hover:ring-(--primary)/50 transition-all"
                  />
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-(--background)"
                    style={{ backgroundColor: chain.color }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-(--foreground) font-medium">{chain.chainName}</span>
                  <span className="text-(--muted-foreground) tabular-nums text-[10px]">
                    {formatUsdValue(chain.usdValue)} · {chain.percentage.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tabular-nums">
            {showLoading ? "..." : stats.totalTokens}
          </p>
          <p className="stat-label">Tokens</p>
        </div>
        <div>
          <p className="text-2xl md:text-3xl font-bold text-[var(--foreground)] tabular-nums">
            {showLoading ? "..." : stats.activeChains}
          </p>
          <p className="stat-label">Chains</p>
        </div>
        <div>
          <p
            className={`text-2xl md:text-3xl font-bold tabular-nums ${
              stats.backingRatio >= 100
                ? "text-[var(--success)] ratio-glow-success"
                : "text-[var(--warning)] ratio-glow-warning"
            }`}
          >
            {showLoading ? "..." : `${stats.backingRatio.toFixed(1)}%`}
          </p>
          <p className="stat-label">Backed</p>
        </div>
      </div>

      {/* Confetti celebration when fully backed */}
      <ConfettiCelebration
        trigger={!showLoading && stats.backingRatio >= 100}
        colors={["#e91e8c", "#9333ea", "#22c55e", "#d946ef"]}
        particleCount={40}
      />

      {/* Backing Status Badge */}
      {!showLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-6"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              stats.backingRatio >= 100
                ? "bg-[var(--success)]/20 text-[var(--success)] glow-success-pulse"
                : "bg-[var(--warning)]/20 text-[var(--warning)]"
            }`}
          >
            {stats.backingRatio >= 100 ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>All Assets Fully Backed</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Review Asset Backing</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
