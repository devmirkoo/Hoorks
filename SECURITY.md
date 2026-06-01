# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in this project, we appreciate your help in disclosing it responsibly.

### How to Report

1. **GitHub Security Advisories (preferred):** Go to the [Security Advisories](https://github.com/devmirkoo/Hoorks/security/advisories/new) page and create a new advisory.
2. **Email:** Send a detailed report to the maintainer's email (available on the [GitHub profile](https://github.com/devmirkoo)).

### What to Include

- A description of the vulnerability and its potential impact
- Step-by-step instructions to reproduce the issue
- Any proof-of-concept code, if applicable
- Your suggested fix, if you have one

### What to Expect

- **Acknowledgement** within **48 hours** of your report
- A plan for a fix and coordinated disclosure within **7 days**
- Credit in the release notes (unless you prefer to remain anonymous)

### Scope

This policy applies to the latest release of `roblox-discord-bridge`. If you find a vulnerability in a dependency, please report it to the upstream maintainer and let us know so we can update.

## Best Practices for Deployers

- **Never commit `.env.local`** or any file containing real credentials
- **Rotate secrets** (JWT secret, API keys, Discord webhook URLs) regularly
- **Use environment variables** provided by your hosting platform (e.g., Vercel Environment Variables)
- **Enable HTTPS** for all deployments
- **Restrict CORS** to trusted origins in production
