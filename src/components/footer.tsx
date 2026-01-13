import Image from "next/image";

const footerLinks = {
  "Klever Blockchain": [
    { label: "About Us", href: "https://klever.org/about-us" },
    { label: "Privacy Policy", href: "https://klever.org/privacy-policy" },
    { label: "Terms of Use", href: "https://klever.org/terms-of-use" },
    { label: "Work with Us", href: "https://klever.org/work-with-us" },
  ],
  "Klever World": [
    { label: "Documentation", href: "https://docs.klever.org" },
    { label: "Forum", href: "https://forum.klever.org" },
    { label: "Support", href: "https://support.klever.org" },
    { label: "Whitepaper", href: "https://storage.googleapis.com/kleverchain-public/Klever-Blockchain-Whitepaper-v.2.0-lr.pdf" },
  ],
  Ecosystem: [
    { label: "KleverScan", href: "https://kleverscan.org" },
    { label: "Klever Wallet", href: "https://klever.io" },
    { label: "Klever Extension", href: "https://klever.io/extension" },
    { label: "Bridge", href: "https://bridge.klever.org" },
  ],
  "Virtual Machine": [
    { label: "Klever SDK", href: "https://docs.klever.org/introduction-to-kleverchain-sdk" },
    { label: "Smart Contracts", href: "https://docs.klever.org/smart-contracts" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-black mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              {/* Dark logo for light mode */}
              <Image
                src="/assets/klever-logo-dark.png"
                alt="Klever"
                width={110}
                height={28}
                className="dark:hidden"
              />
              {/* White logo for dark mode */}
              <Image
                src="/assets/klever-logo-white.png"
                alt="Klever"
                width={110}
                height={28}
                className="hidden dark:block"
              />
            </div>
            <p className="text-sm text-(--muted-foreground) max-w-48">
              Transparent verification of bridged assets on Klever Blockchain.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-(--muted-foreground) mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-(--foreground) hover:text-(--primary) transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-(--muted-foreground)">
            Copyrights © {currentYear} Klever Foundation. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://klever.org/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-(--muted-foreground) hover:text-(--primary) transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://klever.org/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-(--muted-foreground) hover:text-(--primary) transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
