import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-gradient">
          Klever Bridge
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
          >
            Assets
          </Link>
          <Link
            href="/about"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
