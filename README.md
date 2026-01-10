# Klever Bridge Assets

[![CI](https://github.com/klever-io/klv-bridge-assets/actions/workflows/ci.yml/badge.svg)](https://github.com/klever-io/klv-bridge-assets/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A transparency dashboard for the Klever Bridge, providing real-time verification that wrapped tokens on KleverChain are fully backed by assets locked on source chains.

## Overview

The Klever Bridge enables cross-chain asset transfers between KleverChain and other blockchain networks. This dashboard provides transparent, real-time proof that all wrapped tokens are 100% backed by locked collateral.

### Features

- **Real-time Balance Verification** - Live data from bridge contracts and KleverChain
- **Multi-chain Support** - Ethereum (live), BSC, Polygon, Arbitrum, Tron (coming soon)
- **Backing Ratio Display** - Visual indicators showing locked vs minted amounts
- **On-chain Verification Links** - Direct links to block explorers for independent verification
- **Responsive Design** - Optimized for desktop and mobile devices

## Supported Networks

| Network | Status | Explorer |
|---------|--------|----------|
| Ethereum | Live | [Etherscan](https://etherscan.io) |
| BNB Smart Chain | Coming Soon | [BscScan](https://bscscan.com) |
| Polygon | Coming Soon | [PolygonScan](https://polygonscan.com) |
| Arbitrum | Coming Soon | [Arbiscan](https://arbiscan.io) |
| Tron | Coming Soon | [Tronscan](https://tronscan.org) |
| KleverChain | Live | [KleverScan](https://kleverscan.org) |

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Web3**: [wagmi](https://wagmi.sh/) + [viem](https://viem.sh/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/klever-io/klv-bridge-assets.git
cd klv-bridge-assets

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_KLEVER_API_URL` | KleverChain API endpoint | `https://api.mainnet.klever.org` |

## Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # Run TypeScript type checking
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   ├── token/              # Token display components
│   └── ui/                 # Reusable UI primitives
├── config/
│   ├── bridge-assets.json  # Token registry configuration
│   └── wagmi.ts            # Web3 configuration
├── hooks/                  # React hooks for data fetching
├── services/               # API service clients
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions

public/assets/
├── chains/                 # Chain logo images
└── *.png                   # Token logo images
```

## Adding New Tokens

1. Edit `src/config/bridge-assets.json`
2. Add token configuration with:
   - Symbol, name, decimals
   - KleverChain base token ID
   - Liquidity tokens for each chain
   - Source chain configurations (bridge/token contracts)
3. Add token logo to `public/assets/`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

## Architecture

### Token Model

The Klever Bridge uses a multi-token model:

- **Base Token**: Universal wrapped token on KleverChain (e.g., `USDT-XXXX`)
- **Liquidity Tokens**: Per-chain tracking tokens (e.g., `ETHUSDT-XXXX`, `BSCUSDT-XXXX`)

### Data Flow

1. Token configuration loaded from JSON registry
2. EVM balances fetched via wagmi multicall
3. KleverChain data fetched from Klever API
4. Data aggregated and backing ratio calculated
5. UI displays real-time verification status

## Security

This application is a read-only dashboard with no authentication or sensitive operations. Security measures include:

- HTTPS-only API communication
- Input validation with Zod schemas
- Security headers (X-Frame-Options, CSP, etc.)
- No hardcoded secrets
- Regular dependency updates

See [SECURITY.md](SECURITY.md) for our security policy.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Links

- [Klever.org](https://klever.org)
- [Klever Bridge App](https://bridge.klever.org)
- [KleverScan Explorer](https://kleverscan.org)
- [Documentation](https://docs.klever.org)

## Support

- [GitHub Issues](https://github.com/klever-io/klv-bridge-assets/issues)
- [Discord Community](https://discord.gg/klever)
- [Telegram](https://t.me/klaboratories)
