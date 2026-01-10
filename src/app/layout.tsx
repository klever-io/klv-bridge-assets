import type { Metadata } from "next";
import { Web3Provider } from "@/providers/web3-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klever Bridge Proof",
  description: "Asset transparency for Klever Blockchain Bridge wrapped tokens. Verify that locked assets on source chains match minted supply on Klever Blockchain.",
  metadataBase: new URL("https://bridge-proof.klever.org"),
  openGraph: {
    title: "Klever Bridge Proof",
    description: "Verify bridge asset backing - locked assets on Ethereum match minted tokens on Klever Blockchain",
    url: "https://bridge-proof.klever.org",
    siteName: "Klever Bridge Proof",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Klever Bridge Proof - Asset Transparency Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klever Bridge Proof",
    description: "Verify bridge asset backing - locked assets on Ethereum match minted tokens on Klever Blockchain",
    images: ["/og-image.png"],
  },
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
