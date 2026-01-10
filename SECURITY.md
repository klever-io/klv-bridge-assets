# Security Policy

## Overview

The Klever Bridge Assets dashboard is a read-only transparency tool that displays publicly available blockchain data. It does not handle private keys, user authentication, or sensitive financial operations.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please email us at: **security@klever.org**

Include the following information:
- Type of vulnerability
- Full path to the affected file(s)
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt within 48 hours
2. **Assessment**: We will assess the vulnerability within 7 days
3. **Resolution**: Critical issues will be addressed within 30 days
4. **Disclosure**: We will coordinate disclosure timing with you

### Scope

The following are in scope for security reports:

- XSS vulnerabilities
- Data injection attacks
- Sensitive data exposure
- Security misconfigurations
- Dependency vulnerabilities with exploitable impact

The following are **out of scope**:

- Issues in third-party services (RPC providers, explorers)
- Social engineering attacks
- Physical security issues
- Issues requiring unlikely user interaction
- Theoretical vulnerabilities without proof of concept

## Security Measures

This application implements the following security measures:

### Input Validation
- All API responses validated with Zod schemas
- Asset IDs validated with regex patterns
- URLs validated to enforce HTTPS

### HTTP Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### External Links
- All external links use `rel="noopener noreferrer"`
- Links to block explorers for independent verification

### Dependencies
- Regular dependency updates via Dependabot
- Automated security scanning in CI pipeline

## Security Best Practices for Contributors

When contributing code, please follow these security guidelines:

1. **Never commit secrets** - Use environment variables
2. **Validate all inputs** - Use Zod schemas for API responses
3. **Sanitize outputs** - React auto-escapes, but be cautious with `dangerouslySetInnerHTML`
4. **Use HTTPS only** - All external API calls must use HTTPS
5. **Keep dependencies updated** - Run `pnpm audit` regularly

## Acknowledgments

We appreciate security researchers who help keep Klever Bridge Assets secure. Responsible disclosure helps protect our users.

Contributors who report valid security issues will be acknowledged in our security hall of fame (with permission).

## Contact

- Security issues: security@klever.org
- General questions: [GitHub Discussions](https://github.com/klever-io/klv-bridge-assets/discussions)
