"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TokenCard } from "./token-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useAllTokenBalances } from "@/hooks/use-all-token-balances";
import type { TokenPrices } from "@/services/coingecko-api";

type SortBy = "symbol" | "totalLocked" | "backingRatio";
type SortOrder = "asc" | "desc";

interface TokenListProps {
  prices: TokenPrices;
}

export function TokenList({ prices }: TokenListProps) {
  const { tokens, isLoading, isError, dataUpdatedAt } = useAllTokenBalances({ enabled: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("symbol");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const filteredAndSortedTokens = useMemo(() => {
    let result = [...tokens];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "totalLocked":
          comparison = Number(a.totalLocked - b.totalLocked);
          break;
        case "backingRatio":
          comparison = a.backingRatio - b.backingRatio;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tokens, searchQuery, sortBy, sortOrder]);

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatLastUpdated = () => {
    if (!dataUpdatedAt) return null;
    const date = new Date(dataUpdatedAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading && tokens.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError && tokens.length === 0) {
    return (
      <div className="text-center py-12" role="alert">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--error)]/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--error)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-[var(--error)] mb-4">
          Failed to load token data
        </p>
        <button
          onClick={() => window.location.reload()}
          className="min-h-[44px] px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <label htmlFor="token-search" className="sr-only">
            Search tokens
          </label>
          <input
            id="token-search"
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] px-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Sort options">
          <SortButton
            label="Symbol"
            field="symbol"
            currentSort={sortBy}
            sortOrder={sortOrder}
            onClick={() => toggleSort("symbol")}
          />
          <SortButton
            label="Locked"
            field="totalLocked"
            currentSort={sortBy}
            sortOrder={sortOrder}
            onClick={() => toggleSort("totalLocked")}
          />
          <SortButton
            label="Backing"
            field="backingRatio"
            currentSort={sortBy}
            sortOrder={sortOrder}
            onClick={() => toggleSort("backingRatio")}
          />
        </div>
      </div>

      {/* Last updated timestamp with live pulse */}
      {dataUpdatedAt && (
        <div className="flex items-center justify-end gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
          </span>
          <span>Live</span>
          <span className="text-[var(--border)]">|</span>
          <span>Updated: {formatLastUpdated()}</span>
        </div>
      )}

      {/* Token Grid */}
      {filteredAndSortedTokens.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--muted)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--muted-foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-[var(--muted-foreground)]">
            No tokens found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm text-[var(--primary)] hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          role="list"
          aria-label="Bridge tokens"
          initial={false}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedTokens.map((token, index) => (
              <motion.div
                key={token.tokenId}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <TokenCard
                  token={token}
                  priceUsd={prices[token.tokenId]?.usd}
                  priceChange24h={prices[token.tokenId]?.change24h}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function SortButton({
  label,
  field,
  currentSort,
  sortOrder,
  onClick,
}: {
  label: string;
  field: SortBy;
  currentSort: SortBy;
  sortOrder: SortOrder;
  onClick: () => void;
}) {
  const isActive = currentSort === field;
  const sortDirection = sortOrder === "asc" ? "ascending" : "descending";

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Sort by ${label}${isActive ? `, currently ${sortDirection}` : ""}`}
      className={`
        min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${
          isActive
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)]"
        }
      `}
    >
      {label}
      {isActive && (
        <span className="ml-1" aria-hidden="true">
          {sortOrder === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}
