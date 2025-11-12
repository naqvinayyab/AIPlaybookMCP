# AI Playbook MCP Server

[![CI](https://github.com/naqvinayyab/AIPlaybookMCP/workflows/CI/badge.svg)](https://github.com/naqvinayyab/AIPlaybookMCP/actions)
[![codecov](https://codecov.io/gh/naqvinayyab/AIPlaybookMCP/branch/main/graph/badge.svg)](https://codecov.io/gh/naqvinayyab/AIPlaybookMCP)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%20|%2022-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An MCP (Model Context Protocol) server that provides access to AI Playbook documentation through structured tools.

## Overview

This MCP server exposes the AI Playbook documentation (10 markdown files covering AI principles, governance, security, etc.) through a set of tools that can be used by MCP clients like Claude Desktop.

## Available Tools

- **list_docs**: List all available AI Playbook documentation files
- **read_doc**: Read the content of a specific document by filename
- **search_docs**: Search for content across all documents with optional case sensitivity
- **get_doc_summary**: Get an overview of what each document covers

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

3. Run the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

Note for contributors: This project requires Node.js 20 or newer. We recommend using nvm — run `nvm use` in the repo root (the `.nvmrc` file specifies Node 20).

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

**Test Coverage**: The project maintains >80% code coverage across all files. Coverage thresholds are automatically enforced in CI/CD.

**Test Structure**:
- **Integration Tests** (21 tests): Test each MCP tool's functionality
- **E2E Tests** (14 tests): Test complete server lifecycle and request-response cycles

## Usage with Claude Desktop

Add this server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "ai-playbook": {
      "command": "node",
      "args": ["/path/to/AIPlaybookMCP/dist/index.js"]
    }
  }
}
```

## Documents Available

The server provides access to these AI Playbook documents:

- **principles.md**: The 10 core principles for safe, responsible AI use
- **understanding_ai.md**: Fundamental AI concepts and limitations
- **using_ai_safely_responsibly.md**: Guidelines for responsible AI usage
- **building_ai_solutions.md**: Best practices for AI solution development
- **buying_ai.md**: Guidance for AI procurement
- **governance.md**: AI governance frameworks
- **security.md**: Security considerations for AI systems
- **data_protection_privacy.md**: Data protection and privacy guidelines
- **legal_considerations.md**: Legal and regulatory aspects
- **appendix_use_cases.md**: Practical AI use cases and examples

## Example Usage

Once connected to an MCP client:

- List all documents: Use the `list_docs` tool
- Read a specific document: Use `read_doc` with filename like "principles.md"
- Search for terms: Use `search_docs` with a query like "security"
- Get document overview: Use `get_doc_summary`