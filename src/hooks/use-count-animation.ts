"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountAnimationOptions {
  duration?: number;
  enabled?: boolean;
  decimals?: number;
}

/**
 * Hook for animating numbers counting up from 0 (or previous value) to target value
 */
export function useCountAnimation(
  targetValue: number,
  options: UseCountAnimationOptions = {}
): number {
  const { duration = 800, enabled = true, decimals = 2 } = options;
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(targetValue);
      return;
    }

    // Cancel any existing animation
    if (frameRef.current !== undefined) {
      cancelAnimationFrame(frameRef.current);
    }

    startValueRef.current = displayValue;
    startTimeRef.current = undefined;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue =
        startValueRef.current +
        (targetValue - startValueRef.current) * easeOut;

      // Round to specified decimals to avoid floating point issues
      const multiplier = Math.pow(10, decimals);
      setDisplayValue(Math.round(currentValue * multiplier) / multiplier);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- displayValue intentionally omitted to prevent infinite re-renders
  }, [targetValue, duration, enabled, decimals]);

  return displayValue;
}

/**
 * Format a number with locale-aware separators and optional decimal places
 */
export function formatAnimatedNumber(
  value: number,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    compact?: boolean;
  } = {}
): string {
  const { decimals = 2, prefix = "", suffix = "", compact = false } = options;

  if (compact) {
    if (value >= 1_000_000_000) {
      return `${prefix}${(value / 1_000_000_000).toFixed(2)}B${suffix}`;
    }
    if (value >= 1_000_000) {
      return `${prefix}${(value / 1_000_000).toFixed(2)}M${suffix}`;
    }
    if (value >= 1_000) {
      return `${prefix}${(value / 1_000).toFixed(2)}K${suffix}`;
    }
  }

  return `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}
