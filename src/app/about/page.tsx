import { Header } from "@/components/header";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
          About Klever Bridge
        </h1>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              What is Klever Bridge?
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Klever Bridge is a cross-chain bridge that enables seamless transfer of assets
              between Klever Blockchain and other blockchain networks including Ethereum, BNB Smart Chain,
              Polygon, and Arbitrum. The bridge allows users to wrap their tokens on Klever Blockchain
              while maintaining full backing by the original assets locked in bridge contracts.
            </p>
          </section>

          {/* How It Works */}
          <section className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              How It Works
            </h2>
            <div className="space-y-4 text-[var(--muted-foreground)]">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Lock</h3>
                  <p className="text-sm">
                    Users deposit tokens into the bridge contract on the source chain (e.g., Ethereum).
                    These tokens are locked and held securely in the contract.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Mint</h3>
                  <p className="text-sm">
                    An equivalent amount of wrapped tokens is minted on Klever Blockchain, representing
                    the locked assets 1:1.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)]">Redeem</h3>
                  <p className="text-sm">
                    When users want to withdraw, wrapped tokens are burned on Klever Blockchain and
                    the original tokens are released from the bridge contract.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Transparency */}
          <section className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              Transparency Dashboard
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              This transparency portal provides real-time verification that all wrapped tokens
              on Klever Blockchain are fully backed by locked assets on source chains. You can verify:
            </p>
            <ul className="space-y-2 text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Locked amounts</strong> — Total assets held in bridge contracts on each source chain</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Minted supply</strong> — Total wrapped tokens circulating on Klever Blockchain</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Backing ratio</strong> — Percentage showing locked vs minted (100% = fully backed)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>On-chain verification</strong> — Direct links to block explorers to verify balances yourself</span>
              </li>
            </ul>
          </section>

          {/* Token Model */}
          <section className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              Token Model
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              The Klever Bridge uses a multi-token model for tracking assets:
            </p>
            <div className="bg-[var(--muted)]/30 rounded-lg p-4 space-y-3 text-sm">
              <div>
                <span className="font-mono text-[var(--primary)]">USDT-XXXX</span>
                <span className="text-[var(--muted-foreground)]"> — Base token (universal wrapped USDT on Klever Blockchain)</span>
              </div>
              <div>
                <span className="font-mono text-[var(--primary)]">ETHUSDT-XXXX</span>
                <span className="text-[var(--muted-foreground)]"> — Liquidity token tracking USDT bridged from Ethereum</span>
              </div>
              <div>
                <span className="font-mono text-[var(--primary)]">BSCUSDT-XXXX</span>
                <span className="text-[var(--muted-foreground)]"> — Liquidity token tracking USDT bridged from BSC</span>
              </div>
            </div>
          </section>

          {/* Supported Chains */}
          <section className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              Supported Networks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Ethereum", logo: "/assets/chains/ethereum.png", badge: "Live" },
                { name: "BNB Smart Chain", logo: "/assets/chains/bsc.png", badge: "Coming Soon" },
                { name: "Polygon", logo: "/assets/chains/polygon.png", badge: "Coming Soon" },
                { name: "Arbitrum", logo: "/assets/chains/arbitrum.png", badge: "Coming Soon" },
                { name: "Tron", logo: "/assets/chains/tron.png", badge: "Coming Soon" },
                { name: "Klever Blockchain", logo: "/assets/chains/klever.png", badge: "Live" },
              ].map((chain) => (
                <div
                  key={chain.name}
                  className="flex items-center gap-3 p-3 bg-[var(--muted)]/30 rounded-lg"
                >
                  <Image
                    src={chain.logo}
                    alt={chain.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-[var(--foreground)]">{chain.name}</span>
                  {chain.badge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      chain.badge === "Live"
                        ? "bg-[var(--success)]/20 text-[var(--success)]"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                    }`}>
                      {chain.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Links */}
          <section className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreground)]">
              Learn More
            </h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://klever.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/20 transition-colors"
              >
                <span>Klever.org</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://bridge.klever.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/20 transition-colors"
              >
                <span>Bridge App</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://kleverscan.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-lg hover:bg-[var(--primary)]/20 transition-colors"
              >
                <span>KleverScan</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>

          {/* Back to Dashboard */}
          <div className="text-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
