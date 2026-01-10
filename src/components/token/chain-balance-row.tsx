import { ChainIcon } from "@/components/ui/chain-icon";
import { Skeleton } from "@/components/ui/skeleton";

interface ChainBalanceRowProps {
  chainId: string;
  chainName: string;
  logo?: string;
  balance: string;
  percentage: number;
  isLoading: boolean;
  isError: boolean;
  symbol: string;
  explorerUrl?: string;
  explorerName?: string;
}

export function ChainBalanceRow({
  chainId,
  chainName,
  logo,
  balance,
  percentage,
  isLoading,
  isError,
  symbol,
  explorerUrl,
  explorerName,
}: ChainBalanceRowProps) {
  return (
    <div
      role="listitem"
      className="flex items-center justify-between py-2 px-3 bg-[var(--muted)]/30 rounded-lg hover:bg-[var(--muted)]/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <ChainIcon chainId={chainId} chainName={chainName} logo={logo} size="md" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {chainName}
          </span>
          {explorerUrl && !isLoading && !isError && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 explorer-link"
              aria-label={`Verify on ${explorerName || "explorer"}`}
            >
              <span>Verify on {explorerName || "Explorer"}</span>
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
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-4 w-20" />
        ) : isError ? (
          <span className="text-sm text-[var(--error)]" role="alert">
            Error
          </span>
        ) : (
          <>
            <span className="text-sm font-medium text-[var(--foreground)] tabular-nums">
              {balance} {symbol}
            </span>
            <span className="text-xs text-[var(--muted-foreground)] w-12 text-right tabular-nums">
              {percentage.toFixed(1)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}
