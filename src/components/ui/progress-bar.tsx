import type { BackingStatus } from "@/types/bridge";

interface ProgressBarProps {
  value: number; // 0-1 scale, can exceed 1 for over-backed
  status: BackingStatus;
  showLabel?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  status,
  showLabel = true,
  showTooltip = false,
  className = "",
}: ProgressBarProps) {
  // Clamp display width to 100% but keep value for label
  const displayWidth = Math.min(value * 100, 100);
  const percentage = value * 100;

  const getBarColor = () => {
    switch (status) {
      case "fully-backed":
      case "over-backed":
        return "bg-[var(--success)]";
      case "under-backed":
        return "bg-[var(--warning)]";
      case "error":
        return "bg-[var(--error)]";
      default:
        return "bg-[var(--muted)]";
    }
  };

  const getGlowClass = () => {
    switch (status) {
      case "fully-backed":
      case "over-backed":
        return "shadow-[0_0_10px_rgba(0,208,132,0.5)]";
      case "under-backed":
        return "shadow-[0_0_10px_rgba(245,158,11,0.5)]";
      default:
        return "";
    }
  };

  const getAriaLabel = () => {
    if (status === "loading") return "Loading backing ratio";
    if (status === "error") return "Error loading backing ratio";
    return `Backing ratio: ${percentage.toFixed(1)}%`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        {showTooltip && (
          <div className="tooltip-below inline-block absolute -top-1 right-0">
            <button
              type="button"
              className="w-5 h-5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-xs flex items-center justify-center hover:bg-[var(--border)] transition-colors"
              aria-label="What is backing ratio?"
            >
              ?
            </button>
            <div className="tooltip-content-below w-64 whitespace-normal text-[var(--foreground-secondary)]">
              <strong className="text-[var(--foreground)]">Backing Ratio</strong>
              <br />
              Shows the ratio of tokens locked on source chains compared to tokens minted on Klever Blockchain. 100% or higher means fully backed.
            </div>
          </div>
        )}
        <div
          className="h-3 bg-[var(--muted)] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={getAriaLabel()}
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor()} ${getGlowClass()} ${
              (status === "fully-backed" || status === "over-backed") && displayWidth >= 100
                ? "glow-success-pulse progress-wave"
                : ""
            }`}
            style={{ width: `${displayWidth}%` }}
          />
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-[var(--muted-foreground)]">Backing Ratio</span>
          <span
            className={`font-medium tabular-nums ${
              status === "under-backed"
                ? "text-[var(--warning)]"
                : "text-[var(--success)]"
            }`}
          >
            {status === "loading"
              ? "Loading..."
              : status === "error"
              ? "Error"
              : `${percentage.toFixed(1)}%`}
          </span>
        </div>
      )}
    </div>
  );
}
