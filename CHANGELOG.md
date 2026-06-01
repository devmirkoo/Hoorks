# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-06-01

### Added

- Serverless Next.js API bridge connecting Roblox game servers to Discord
- `POST /api/make-buy` endpoint for recording gamepass and developer product purchases
- `GET /api/items` endpoint for listing transactions
- Rich Discord webhook embeds with purchase details and player info
- Admin dashboard at `/admin` for managing transactions, API keys, and settings
- Turso (libsql) edge-compatible database integration
- JWT-based admin authentication with httpOnly cookies
- SHA-256 hashed API keys with constant-time comparison
- Rate limiting middleware for API endpoints
- Input validation and sanitization layer
- `.env.example` template for required environment variables

[Unreleased]: https://github.com/devmirkoo/Hoorks/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/devmirkoo/Hoorks/releases/tag/v0.1.0
