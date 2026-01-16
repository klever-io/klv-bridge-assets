"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
    {/* Overlay - Outside header for proper z-index stacking */}
    {mobileMenuOpen && (
      <div
        className="fixed inset-0 top-16 z-40 bg-black/20 dark:bg-black/50 md:hidden"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
    )}

    <header className="border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Dark logo for light mode */}
          <Image
            src="/assets/klever-logo-dark.png"
            alt="Klever"
            width={110}
            height={28}
            className="transition-transform group-hover:scale-105 dark:hidden"
            priority
          />
          {/* White logo for dark mode */}
          <Image
            src="/assets/klever-logo-white.png"
            alt="Klever"
            width={110}
            height={28}
            className="transition-transform group-hover:scale-105 hidden dark:block"
            priority
          />
        </Link>

        {/* Center - Desktop Navigation (absolutely positioned for true centering) */}
        <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-10 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-sm text-gray-900 dark:text-white hover:text-(--primary) transition-colors"
          >
            Assets
          </Link>
          <a
            href="https://bridge.klever.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-(--primary) transition-colors"
          >
            Bridge
          </a>
          <Link
            href="/about"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-(--primary) transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            ref={buttonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`md:hidden border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-black/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0"
        }`}
        inert={!mobileMenuOpen ? true : undefined}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            Assets
          </Link>
          <a
            href="https://bridge.klever.org"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            Bridge
          </a>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 py-3 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
    </>
  );
}
