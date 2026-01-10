"use client";

import { useCountAnimation, formatAnimatedNumber } from "@/hooks/use-count-animation";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  compact = false,
  duration = 800,
  className = "",
}: AnimatedNumberProps) {
  const animatedValue = useCountAnimation(value, {
    duration,
    decimals,
    enabled: true,
  });

  return (
    <span className={`animate-count-in ${className}`}>
      {formatAnimatedNumber(animatedValue, { decimals, prefix, suffix, compact })}
    </span>
  );
}
