# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-13

### Added

- **Dynamic API Content Fetching**: Server now automatically fetches latest AI Playbook documentation from gov.uk API on startup
- **Offline Mode**: New `--local` flag for running server without network requests using cached content
- **Build-time Cache Generation**: New `npm run cache-docs` command to pre-generate documentation cache
- **Automatic Cache Fallback**: Server automatically falls back to cached content if API is unavailable, with warning message
- **Content Integrity Validation**: SHA-256 hash verification for all cached documentation files
- **Structured Logging**: Comprehensive logging using @toolprint/mcp-logger with operation tracking and performance metrics

### Changed

- **Content Source**: Documentation now sourced dynamically from gov.uk API instead of static files
- **Cache Location**: Documentation cache moved to `.cache/docs/` directory (committed to version control)
- **Startup Behavior**: Server performs lazy content loading on first tool call instead of eager loading
- **MCP Tool Interface**: All existing tools (list_docs, read_doc, search_docs, get_doc_summary) maintain backward compatibility with no interface changes

### Dependencies

- Added `turndown` (^7.2.2) for HTML to Markdown conversion
- Added `turndown-plugin-gfm` (^1.0.2) for GitHub Flavored Markdown table support
- Added `linkedom` (^0.18.12) for lightweight DOM parsing
- Added `@toolprint/mcp-logger` (^0.0.7) for MCP-aware structured logging

### Removed

- **Static `docs/` directory**: Replaced with dynamic content fetching and caching system

### Performance

- API fetch time: <20s on first attempt, <150s worst-case with 7 retries
- Cache load time: <5s when using --local flag
- Tool response time: <200ms (p95)

### Security

- Implemented exponential backoff retry logic (7 attempts: 1/2/4/8/16/32/64 seconds)
- Added 5MB response size limit to prevent memory issues
- Added 15s timeout per API request
- All cache files include SHA-256 integrity hashes
- No vulnerabilities found in dependencies (npm audit clean)

## [1.0.0] - 2024-01-01

### Added

- Initial MCP server implementation
- Four MCP tools: list_docs, read_doc, search_docs, get_doc_summary
- Support for 10 AI Playbook documentation files
- Comprehensive test suite with >80% coverage
- TypeScript strict mode compilation
- ESLint configuration
- CI/CD pipeline with GitHub Actions
