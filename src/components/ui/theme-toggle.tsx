"use client";

import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") {
      // From system, go to opposite of what's currently showing
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // From light, go to system
      setTheme("system");
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-(--muted) hover:bg-(--border) transition-colors"
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {/* Sun icon - visible in light mode */}
      <svg
        className={`w-5 h-5 transition-all ${
          resolvedTheme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon icon - visible in dark mode */}
      <svg
        className={`w-5 h-5 absolute transition-all ${
          resolvedTheme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* System indicator dot */}
      {theme === "system" && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-(--primary) rounded-full border border-(--background)" />
      )}
    </button>
  );
}
