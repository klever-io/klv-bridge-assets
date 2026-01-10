"use client";

import { useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

interface ConfettiCelebrationProps {
  trigger: boolean;
  colors?: string[];
  particleCount?: number;
}

export function ConfettiCelebration({
  trigger,
  colors = ["#e91e8c", "#9333ea", "#22c55e", "#d946ef"],
  particleCount = 30,
}: ConfettiCelebrationProps) {
  const hasTriggeredRef = useRef(false);

  const fireConfetti = useCallback(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      return;
    }

    const defaults = {
      spread: 60,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 20,
      colors,
    };

    // Fire from left
    confetti({
      ...defaults,
      particleCount: Math.floor(particleCount / 2),
      origin: { x: 0.3, y: 0.6 },
      angle: 60,
    });

    // Fire from right
    confetti({
      ...defaults,
      particleCount: Math.floor(particleCount / 2),
      origin: { x: 0.7, y: 0.6 },
      angle: 120,
    });
  }, [colors, particleCount]);

  useEffect(() => {
    if (trigger && !hasTriggeredRef.current) {
      // Small delay to ensure the component is visible
      const timer = setTimeout(() => {
        fireConfetti();
        hasTriggeredRef.current = true;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [trigger, fireConfetti]);

  // Reset when trigger becomes false
  useEffect(() => {
    if (!trigger) {
      hasTriggeredRef.current = false;
    }
  }, [trigger]);

  return null; // This component doesn't render anything visible
}

/**
 * Hook for triggering confetti programmatically
 */
export function useConfetti() {
  const fire = useCallback(
    (options?: {
      particleCount?: number;
      spread?: number;
      origin?: { x: number; y: number };
      colors?: string[];
    }) => {
      // Check for reduced motion preference
      if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
        return;
      }

      const {
        particleCount = 50,
        spread = 60,
        origin = { x: 0.5, y: 0.5 },
        colors = ["#e91e8c", "#9333ea", "#22c55e", "#d946ef"],
      } = options ?? {};

      confetti({
        particleCount,
        spread,
        origin,
        colors,
        ticks: 100,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 25,
      });
    },
    []
  );

  const fireStars = useCallback(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      return;
    }

    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 15,
      colors: ["#e91e8c", "#9333ea", "#22c55e"],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, []);

  return { fire, fireStars };
}
