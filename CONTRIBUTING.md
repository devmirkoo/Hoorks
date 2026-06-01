# Contributing to Roblox-Discord Bridge

Thank you for your interest in contributing! Every contribution matters — from bug reports to feature ideas to code.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. Use the [Bug Report template](https://github.com/devmirkoo/Hoorks/issues/new?template=bug_report.md)
3. Include:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, deployment target)

### Suggesting Features

1. Open a [Feature Request](https://github.com/devmirkoo/Hoorks/issues/new?template=feature_request.md)
2. Describe the problem you're solving, not just the solution you want
3. Explain why this would be valuable to other users

### Submitting Code

1. **Fork** the repository
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your environment**: Copy `.env.example` to `.env.local` and fill in your values
5. **Make your changes** following our coding standards (see below)
6. **Run checks locally**:
   ```bash
   npm run lint
   npm run build
   ```
7. **Commit** with [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add support for bundle purchases
   fix: correct webhook retry logic
   docs: update API endpoint documentation
   ```
8. **Push** and open a **Pull Request** against `main`

## Development Setup

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Turso](https://turso.tech/) account (free tier available)
- A Discord server with a webhook URL

### Getting Started

```bash
# Clone your fork
git clone https://github.com/<your-username>/Hoorks.git
cd Hoorks

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Coding Standards

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js App Router
- **Linting**: ESLint — run `npm run lint` before committing
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/types
- **Comments**: Write them for *why*, not *what*

## Pull Request Process

1. PRs require at least **one maintainer review**
2. All CI checks must pass (lint + build)
3. Update `CHANGELOG.md` under the `[Unreleased]` section for user-facing changes
4. Keep PRs focused — one feature or fix per PR
5. Squash commits on merge

## Branch Naming

| Type    | Pattern                          |
| ------- | -------------------------------- |
| Feature | `feat/short-description`         |
| Fix     | `fix/short-description`          |
| Docs    | `docs/short-description`         |
| Chore   | `chore/short-description`        |

## Need Help?

- Open a [Discussion](https://github.com/devmirkoo/Hoorks/discussions) for questions
- Check the [README](README.md) for setup and usage
- Review [open issues](https://github.com/devmirkoo/Hoorks/issues) for things to work on

We label beginner-friendly tasks with `good first issue` — look for those if you're just getting started!
