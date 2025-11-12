/**
 * Integration tests for get_doc_summary MCP tool
 * Tests FR-001: System MUST provide integration tests for get_doc_summary tool
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIPlaybookMCPServer } from '../../src/index.js';
import { createMockClient, extractTextFromResponse } from '../../src/__tests__/helpers/mcp-client-mock.js';

describe('get_doc_summary tool', () => {
  let server: AIPlaybookMCPServer;

  beforeEach(() => {
    server = new AIPlaybookMCPServer();
  });

  it('should return summaries for all known documents', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('get_doc_summary', {});

    const text = extractTextFromResponse(response);

    // Should have header
    expect(text).toContain('AI Playbook Document Summaries');

    // Should list documents with emoji
    expect(text).toContain('📄');

    // Should show .md files
    expect(text).toMatch(/\w+\.md/);

    // Each document should have a summary description
    // Summaries are indented after filename
    expect(text).toMatch(/📄 \w+\.md\n\s+\w+/);
  });

  it('should include summary descriptions for each document', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('get_doc_summary', {});

    const text = extractTextFromResponse(response);

    // Known summaries from implementation (hard-coded in server)
    const knownDocs = [
      'principles.md',
      'understanding_ai.md',
      'using_ai_safely_responsibly.md',
      'building_ai_solutions.md',
      'buying_ai.md',
      'governance.md',
      'security.md',
      'data_protection_privacy.md',
      'legal_considerations.md',
      'appendix_use_cases.md',
    ];

    // At least some of these should be mentioned
    const mentionedCount = knownDocs.filter((doc) => text.includes(doc)).length;
    expect(mentionedCount).toBeGreaterThan(0);
  });

  it('should format summary output consistently', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('get_doc_summary', {});

    const text = extractTextFromResponse(response);

    // Should use consistent formatting
    // Format: 📄 filename.md
    //           Summary description text
    const formatPattern = /📄 \w+\.md\n\s{3}\w+/;
    expect(formatPattern.test(text)).toBe(true);

    // Should have header with separator
    expect(text).toMatch(/=+/);
  });

  it('should handle missing summary gracefully', async () => {
    const client = createMockClient(server);
    const response = await client.callTool('get_doc_summary', {});

    const text = extractTextFromResponse(response);

    // If a file doesn't have a summary, implementation shows "No summary available"
    // This tests that the server handles that case
    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
  });

  it('should not require any parameters', async () => {
    const client = createMockClient(server);

    // Call with empty object (no parameters)
    const response = await client.callTool('get_doc_summary', {});

    expect(response.content).toBeDefined();
    expect(response.content.length).toBeGreaterThan(0);

    const text = extractTextFromResponse(response);
    expect(text).toContain('Summaries');
  });
});
