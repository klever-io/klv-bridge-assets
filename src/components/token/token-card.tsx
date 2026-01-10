"use client";

import { useState } from "react";
import type { TokenBalanceData } from "@/types/bridge";
import { TokenCardHeader } from "./token-card-header";
import { TokenCardBalances } from "./token-card-balances";
import { TokenCardDetails } from "./token-card-details";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";

interface TokenCardProps {
  token: TokenBalanceData;
  priceUsd?: number;
  priceChange24h?: number;
}

function getStatusGlowClass(status: string): string {
  switch (status) {
    case "fully-backed":
      return "card-status-success";
    case "over-backed":
      return "card-status-success glow-over-backed";
    case "under-backed":
      return "card-status-warning";
    case "error":
      return "card-status-error";
    default:
      return "";
  }
}

export function TokenCard({ token, priceUsd, priceChange24h }: TokenCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusGlowClass = getStatusGlowClass(token.backingStatus);

  // Calculate USD values
  const lockedUsd = priceUsd
    ? (Number(token.totalLocked) / 10 ** token.decimals) * priceUsd
    : undefined;
  const mintedUsd = priceUsd
    ? (Number(token.kleverMinted) / 10 ** token.decimals) * priceUsd
    : undefined;

  return (
    <>
      <article
        className={`border-gradient card-glass card-gradient-border p-5 card-hover-lift hover:glow-primary rounded-xl ${statusGlowClass}`}
        role="listitem"
        aria-labelledby={`token-title-${token.tokenId}`}
      >
        <TokenCardHeader
          symbol={token.symbol}
          name={token.name}
          logo={token.logo}
          tokenId={token.tokenId}
        />

        <TokenCardBalances
          lockedAmount={token.formattedTotalLocked}
          mintedAmount={token.formattedKleverMinted}
          lockedUsd={lockedUsd}
          mintedUsd={mintedUsd}
          priceUsd={priceUsd}
          priceChange24h={priceChange24h}
          isLoading={token.isLoading}
        />

        <div className="mb-4">
          <ProgressBar
            value={token.backingRatio}
            status={token.backingStatus}
            showLabel={false}
            showTooltip={true}
          />
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge
            status={token.backingStatus}
            ratio={token.backingRatio}
            size="sm"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="min-h-[44px] flex items-center gap-1 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--muted)]/50"
          >
            <span>View Details</span>
            <svg
              className="w-4 h-4"
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
          </button>
        </div>
      </article>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${token.symbol} Details`}
      >
        <TokenCardDetails
          sourceChainBalances={token.sourceChainBalances}
          liquidityBreakdown={token.liquidityBreakdown}
          symbol={token.symbol}
          baseTokenId={token.baseTokenId}
          formattedKleverMinted={token.formattedKleverMinted}
          holdersCount={token.holdersCount}
          transactionsCount={token.transactionsCount}
        />
      </Modal>
    </>
  );
}
