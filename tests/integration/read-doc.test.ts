/**
 * Integration tests for read_doc MCP tool
 * Tests FR-001: System MUST provide integration tests for read_doc tool
 * Tests Principle II: Security - path traversal prevention
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIPlaybookMCPServer } from '../../src/index.js';
import { createMockClient, extractTextFromResponse } from '../../src/__tests__/helpers/mcp-client-mock.js';
import { readdirSync } from 'fs';
import { join } from 'path';

describe('read_doc tool', () => {
  let server: AIPlaybookMCPServer;
  let availableDoc: string;

  beforeEach(() => {
    server = new AIPlaybookMCPServer();

    // Get first available document from docs/ directory
    const docsDir = join(process.cwd(), 'docs');
    const docs = readdirSync(docsDir).filter((f) => f.endsWith('.md'));
    availableDoc = docs[0];
  });

  it('should return full document content for valid filename', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('read_doc', { filename: availableDoc });

    expect(response.content).toBeDefined();
    expect(response.content.length).toBeGreaterThan(0);

    const text = extractTextFromResponse(response);

    // Should contain markdown content
    expect(text.length).toBeGreaterThan(0);

    // Should include the filename as a heading
    expect(text).toContain('#');

    // Content should be substantial (more than just header)
    expect(text.length).toBeGreaterThan(100);
  });

  it('should return error for missing document with available file list', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('read_doc', {
      filename: 'nonexistent-file.md',
    });

    const text = extractTextFromResponse(response);

    // Should indicate file not found
    expect(text).toContain('not found');

    // Should include the problematic filename (FR-013: actionable error messages)
    expect(text).toContain('nonexistent-file.md');

    // Should list available files
    expect(text).toContain('Available files:');
  });

  it('should prevent path traversal attacks (Principle II: Secure by Design)', async () => {
    const client = createMockClient(server);

    // Attempt path traversal
    const maliciousFilenames = [
      '../../../etc/passwd',
      '../../package.json',
      '../src/index.ts',
      'docs/../src/index.ts',
    ];

    for (const maliciousFilename of maliciousFilenames) {
      const response = await client.callTool('read_doc', {
        filename: maliciousFilename,
      });

      const text = extractTextFromResponse(response);

      // Should not return sensitive file content
      // Should either reject path or treat as "not found"
      expect(text).toContain('not found');
    }
  });

  it('should handle empty filename gracefully', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('read_doc', { filename: '' });

    const text = extractTextFromResponse(response);

    // Should provide actionable error message (FR-013)
    expect(text).toContain('Error');
    expect(text.toLowerCase()).toMatch(/filename|required/);
  });

  it('should include document heading in response', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('read_doc', { filename: availableDoc });

    const text = extractTextFromResponse(response);

    // Response should include the filename as prefix
    expect(text).toContain(`# ${availableDoc}`);
  });
});
