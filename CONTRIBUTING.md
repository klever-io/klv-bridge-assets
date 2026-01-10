# Contributing to Klever Bridge Assets

Thank you for your interest in contributing to the Klever Bridge Assets transparency dashboard! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Adding New Tokens](#adding-new-tokens)
- [Adding New Chains](#adding-new-chains)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [security@klever.org](mailto:security@klever.org).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/klv-bridge-assets.git
   cd klv-bridge-assets
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/klever-io/klv-bridge-assets.git
   ```

## Development Setup

### Prerequisites

- Node.js 20 or higher
- pnpm 9 or higher
- Git

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm type-check` | Run TypeScript type checking |

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When filing a bug report, include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Any relevant error messages

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing issues/discussions first
- Provide a clear use case
- Explain how it benefits users
- Consider implementation complexity

### Contributing Code

1. **Find an issue** to work on, or create one
2. **Comment on the issue** to let others know you're working on it
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
4. **Make your changes** following our coding standards
5. **Test thoroughly** - ensure lint and type-check pass
6. **Commit your changes** using conventional commits
7. **Push and create a PR**

## Pull Request Process

### Before Submitting

- [ ] Run `pnpm lint` and fix any issues
- [ ] Run `pnpm type-check` and fix any errors
- [ ] Run `pnpm build` to ensure production build works
- [ ] Update documentation if needed
- [ ] Add/update tests if applicable

### PR Guidelines

1. **Title**: Use a clear, descriptive title
   - `feat: Add BSC chain support`
   - `fix: Correct balance calculation for 18-decimal tokens`
   - `docs: Update README with new setup instructions`

2. **Description**: Fill out the PR template completely
   - Describe what changes you made
   - Link related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Size**: Keep PRs focused and reasonably sized
   - One feature/fix per PR
   - Break large changes into smaller PRs

### Review Process

1. Automated checks must pass (lint, type-check, build)
2. At least one maintainer review required
3. Address review feedback promptly
4. Squash commits before merging (if requested)

## Coding Standards

### TypeScript

- Use strict TypeScript - no `any` types
- Define interfaces for all data structures
- Use Zod for runtime validation
- Export types from `src/types/`

```typescript
// Good
interface TokenConfig {
  id: string;
  symbol: string;
  decimals: number;
}

// Avoid
const token: any = { ... };
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper TypeScript props interfaces
- Follow accessibility best practices

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {label}
    </button>
  );
}
```

### CSS/Tailwind

- Use Tailwind CSS utilities
- Use CSS variables for theming (`var(--primary)`)
- Follow mobile-first responsive design
- Maintain accessibility (color contrast, focus states)

### File Organization

```
src/
├── app/              # Pages and layouts
├── components/
│   ├── ui/           # Reusable primitives
│   └── [feature]/    # Feature-specific components
├── hooks/            # Custom React hooks
├── services/         # API clients
├── types/            # TypeScript definitions
└── utils/            # Utility functions
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(chains): add Polygon network support
fix(balance): correct decimal conversion for USDC
docs(readme): add deployment instructions
```

## Adding New Tokens

To add a new token to the dashboard:

1. **Edit `src/config/bridge-assets.json`**:
   ```json
   {
     "id": "newtoken",
     "symbol": "NEW",
     "name": "New Token",
     "decimals": 18,
     "logo": "/assets/wNEW.png",
     "kleverChain": {
       "baseTokenId": "NEW-XXXX"
     },
     "liquidityTokens": [
       { "chainId": "ethereum", "kdaId": "ETHNEW-XXXX" }
     ],
     "sourceChains": [
       {
         "chainId": "ethereum",
         "chainName": "Ethereum",
         "evmChainId": 1,
         "bridgeContract": "0x...",
         "tokenContract": "0x...",
         "decimals": 18,
         "enabled": true
       }
     ]
   }
   ```

2. **Add token logo** to `public/assets/wNEW.png`
   - Use PNG format
   - Recommended size: 128x128 or 256x256
   - Transparent background

3. **Test the changes**:
   ```bash
   pnpm dev
   # Verify token appears and data loads correctly
   ```

4. **Submit a PR** with your changes

## Adding New Chains

To add support for a new blockchain:

1. **Add chain to wagmi config** (`src/config/wagmi.ts`)
2. **Add chain logo** to `public/assets/chains/`
3. **Update chain config** in `src/config/bridge-assets.json`
4. **Add chain color** to `src/app/globals.css`
5. **Update About page** chain list
6. **Test thoroughly** with actual RPC endpoints

## Questions?

- Open a [GitHub Discussion](https://github.com/klever-io/klv-bridge-assets/discussions)
- Join our [Discord](https://discord.gg/klever)
- Check existing [Issues](https://github.com/klever-io/klv-bridge-assets/issues)

Thank you for contributing!
