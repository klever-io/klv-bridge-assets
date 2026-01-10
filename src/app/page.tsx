import { Header } from "@/components/header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <section className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gradient">
            Bridge Transparency
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-sm md:text-base">
            Real-time verification of wrapped token balances across Klever Blockchain and connected
            networks. Full transparency for all bridged assets.
          </p>
        </section>

        <DashboardContent />

        {/* Legend */}
        <section className="mt-8">
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--success)]" />
              <span>Fully Backed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--warning)]" />
              <span>Under Backed</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
