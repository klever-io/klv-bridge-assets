"use client";

import type { ChainBalance, LiquidityBreakdown } from "@/types/bridge";
import { ChainBalanceRow } from "./chain-balance-row";
import { HorizontalSparkline } from "@/components/ui/sparkline";

const KLEVERSCAN_URL = "https://kleverscan.org";

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  bsc: "#F3BA2F",
  polygon: "#8247E5",
  arbitrum: "#28A0F0",
  tron: "#FF0013",
};

const EXPLORERS: Record<string, { name: string; baseUrl: string }> = {
  ethereum: { name: "Etherscan", baseUrl: "https://etherscan.io" },
  bsc: { name: "BscScan", baseUrl: "https://bscscan.com" },
  polygon: { name: "PolygonScan", baseUrl: "https://polygonscan.com" },
  arbitrum: { name: "Arbiscan", baseUrl: "https://arbiscan.io" },
  tron: { name: "Tronscan", baseUrl: "https://tronscan.org" },
};

interface TokenCardDetailsProps {
  sourceChainBalances: ChainBalance[];
  liquidityBreakdown: LiquidityBreakdown[];
  symbol: string;
  baseTokenId: string;
  formattedKleverMinted: string;
  holdersCount?: number;
  transactionsCount?: number;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function TokenCardDetails({
  sourceChainBalances,
  liquidityBreakdown,
  symbol,
  baseTokenId,
  formattedKleverMinted,
  holdersCount,
  transactionsCount,
}: TokenCardDetailsProps) {
  const hasSourceBalances = sourceChainBalances.length > 0;
  const hasLiquidityTokens = liquidityBreakdown.length > 0;

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h4
          id="stats-heading"
          className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2"
        >
          Statistics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--muted)]/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <svg
                className="w-4 h-4 text-[var(--muted-foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-xs text-[var(--muted-foreground)]">Holders</span>
            </div>
            <p className="text-lg font-semibold text-[var(--foreground)] tabular-nums">
              {holdersCount !== undefined ? formatNumber(holdersCount) : "—"}
            </p>
          </div>
          <div className="bg-[var(--muted)]/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <svg
                className="w-4 h-4 text-[var(--muted-foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
              <span className="text-xs text-[var(--muted-foreground)]">Transactions</span>
            </div>
            <p className="text-lg font-semibold text-[var(--foreground)] tabular-nums">
              {transactionsCount !== undefined ? formatNumber(transactionsCount) : "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Universal Token on KleverChain */}
      <section aria-labelledby="universal-token-heading">
        <h4
          id="universal-token-heading"
          className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2"
        >
          Universal Token (Klever BlockChain)
        </h4>
        <div className="bg-[var(--muted)]/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={`${KLEVERSCAN_URL}/asset/${baseTokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                {baseTokenId}
                <ExternalLinkIcon />
              </a>
            </div>
            <span className="text-sm font-medium text-[var(--foreground)] tabular-nums">
              {formattedKleverMinted} {symbol}
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Total minted supply on Klever Blockchain
          </p>
        </div>
      </section>

      {/* Source Chain Balances */}
      {hasSourceBalances && (
        <section aria-labelledby="source-chains-heading">
          <h4
            id="source-chains-heading"
            className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3"
          >
            Source Chain Liquidity
          </h4>

          {/* Sparkline visualization */}
          <HorizontalSparkline
            data={sourceChainBalances.map((chain) => ({
              label: chain.chainName,
              value: Number(chain.balance),
              color: CHAIN_COLORS[chain.chainId] ?? "#6b7280",
            }))}
            className="mb-4"
            showLegend={false}
          />

          <div className="space-y-2" role="list">
            {sourceChainBalances.map((chain) => (
              <ChainBalanceRow
                key={chain.chainId}
                chainId={chain.chainId}
                chainName={chain.chainName}
                logo={chain.logo}
                balance={chain.formattedBalance}
                percentage={chain.percentage}
                isLoading={chain.isLoading}
                isError={chain.isError}
                symbol={symbol}
                explorerUrl={EXPLORERS[chain.chainId]?.baseUrl}
                explorerName={EXPLORERS[chain.chainId]?.name}
              />
            ))}
          </div>
        </section>
      )}

      {/* KleverChain Liquidity Tokens */}
      {hasLiquidityTokens && (
        <section aria-labelledby="liquidity-tokens-heading">
          <h4
            id="liquidity-tokens-heading"
            className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2"
          >
            KleverChain Liquidity Tokens
          </h4>
          <div className="space-y-2" role="list">
            {liquidityBreakdown.map((lt) => (
              <div
                key={lt.kdaId}
                role="listitem"
                className="flex items-center justify-between py-2 px-3 bg-[var(--muted)]/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <a
                    href={`${KLEVERSCAN_URL}/asset/${lt.kdaId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-[var(--primary)] hover:underline flex items-center gap-1"
                  >
                    {lt.kdaId}
                    <ExternalLinkIcon />
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--foreground)] tabular-nums">
                    {lt.isLoading ? "..." : lt.formattedBalance}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] w-12 text-right tabular-nums">
                    {lt.isLoading ? "..." : `${lt.percentage.toFixed(1)}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!hasSourceBalances && !hasLiquidityTokens && (
        <p className="text-sm text-[var(--muted-foreground)] text-center py-4">
          No chain data available
        </p>
      )}
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="w-3 h-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
