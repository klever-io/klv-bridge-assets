import type { Metadata } from "next";
import { Web3Provider } from "@/providers/web3-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klever Bridge Assets",
  description: "Asset transparency for Klever Blockchain Bridge wrapped tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <Web3Provider>{children}</Web3Provider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
