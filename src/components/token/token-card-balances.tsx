import { Skeleton } from "@/components/ui/skeleton";
import { formatUsdValue } from "@/services/coingecko-api";

interface TokenCardBalancesProps {
  lockedAmount: string;
  mintedAmount: string;
  lockedUsd?: number;
  mintedUsd?: number;
  priceUsd?: number;
  priceChange24h?: number;
  isLoading: boolean;
}

export function TokenCardBalances({
  lockedAmount,
  mintedAmount,
  lockedUsd,
  mintedUsd,
  priceUsd,
  priceChange24h,
  isLoading,
}: TokenCardBalancesProps) {
  return (
    <div className="space-y-4 mb-4">
      {/* Price display */}
      {priceUsd !== undefined && (
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-[var(--muted-foreground)]">Price</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--foreground)] tabular-nums">
              ${priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {priceChange24h !== undefined && (
              <span
                className={`text-xs tabular-nums ${
                  priceChange24h >= 0
                    ? "text-[var(--success)]"
                    : "text-[var(--error)]"
                }`}
              >
                {priceChange24h >= 0 ? "+" : ""}
                {priceChange24h.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--muted)]/50 rounded-lg p-3">
          <p className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wide">
            Locked
          </p>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <>
              <p className="text-lg font-semibold text-[var(--foreground)] tabular-nums">
                {lockedAmount}
              </p>
              {lockedUsd !== undefined && (
                <p className="text-sm text-[var(--muted-foreground)] tabular-nums">
                  {formatUsdValue(lockedUsd)}
                </p>
              )}
            </>
          )}
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            on source chains
          </p>
        </div>

        <div className="bg-[var(--muted)]/50 rounded-lg p-3">
          <p className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wide">
            Minted
          </p>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <>
              <p className="text-lg font-semibold text-[var(--primary)] tabular-nums">
                {mintedAmount}
              </p>
              {mintedUsd !== undefined && (
                <p className="text-sm text-[var(--muted-foreground)] tabular-nums">
                  {formatUsdValue(mintedUsd)}
                </p>
              )}
            </>
          )}
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            on KleverChain
          </p>
        </div>
      </div>
    </div>
  );
}
