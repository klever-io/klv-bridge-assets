import type { BackingStatus } from "@/types/bridge";

interface StatusBadgeProps {
  status: BackingStatus;
  ratio?: number;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  status,
  ratio,
  size = "md",
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1 min-h-[28px]",
    md: "text-sm px-3 py-1.5 min-h-[36px]",
    lg: "text-base px-4 py-2 min-h-[44px]",
  };

  const getStatusConfig = () => {
    switch (status) {
      case "fully-backed":
        return {
          label: "Fully Backed",
          ariaLabel: "Token is fully backed at 100%",
          icon: "✓",
          bgClass: "bg-[var(--success)]/20",
          textClass: "text-[var(--success)]",
          borderClass: "border-[var(--success)]/30",
        };
      case "over-backed":
        return {
          label: ratio ? `${(ratio * 100).toFixed(1)}% Backed` : "Over Backed",
          ariaLabel: ratio
            ? `Token is over-backed at ${(ratio * 100).toFixed(1)}%`
            : "Token is over-backed",
          icon: "✓+",
          bgClass: "bg-[var(--success)]/20",
          textClass: "text-[var(--success)]",
          borderClass: "border-[var(--success)]/30",
        };
      case "under-backed":
        return {
          label: ratio ? `${(ratio * 100).toFixed(1)}% Backed` : "Under Backed",
          ariaLabel: ratio
            ? `Warning: Token is under-backed at ${(ratio * 100).toFixed(1)}%`
            : "Warning: Token is under-backed",
          icon: "⚠",
          bgClass: "bg-[var(--warning)]/20",
          textClass: "text-[var(--warning)]",
          borderClass: "border-[var(--warning)]/30",
        };
      case "loading":
        return {
          label: "Loading",
          ariaLabel: "Loading backing status",
          icon: "◌",
          bgClass: "bg-[var(--muted)]",
          textClass: "text-[var(--muted-foreground)]",
          borderClass: "border-[var(--border)]",
        };
      case "error":
        return {
          label: "Error",
          ariaLabel: "Error loading backing status",
          icon: "✕",
          bgClass: "bg-[var(--error)]/20",
          textClass: "text-[var(--error)]",
          borderClass: "border-[var(--error)]/30",
        };
      default:
        return {
          label: "Unknown",
          ariaLabel: "Unknown backing status",
          icon: "?",
          bgClass: "bg-[var(--muted)]",
          textClass: "text-[var(--muted-foreground)]",
          borderClass: "border-[var(--border)]",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      role="status"
      aria-label={config.ariaLabel}
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${sizeClasses[size]}
        ${config.bgClass}
        ${config.textClass}
        ${config.borderClass}
      `}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span className="tabular-nums">{config.label}</span>
    </span>
  );
}
