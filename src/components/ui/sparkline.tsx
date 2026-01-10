"use client";

import { motion } from "framer-motion";

interface SparklineItem {
  label: string;
  value: number;
  color: string;
}

interface HorizontalSparklineProps {
  data: SparklineItem[];
  className?: string;
  showLegend?: boolean;
}

export function HorizontalSparkline({
  data,
  className = "",
  showLegend = true,
}: HorizontalSparklineProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) return null;

  return (
    <div className={className}>
      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden flex bg-[var(--muted)]">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          if (percentage === 0) return null;

          return (
            <motion.div
              key={item.label}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="h-full"
              style={{ backgroundColor: item.color }}
              title={`${item.label}: ${percentage.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-3 mt-2">
          {data
            .filter((item) => item.value > 0)
            .map((item) => {
              const percentage = (item.value / total) * 100;
              return (
                <div key={item.label} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[var(--muted-foreground)]">{item.label}</span>
                  <span className="text-[var(--foreground)] tabular-nums">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
