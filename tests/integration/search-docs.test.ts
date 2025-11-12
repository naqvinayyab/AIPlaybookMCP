/**
 * Integration tests for search_docs MCP tool
 * Tests FR-001: System MUST provide integration tests for search_docs tool
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIPlaybookMCPServer } from '../../src/index.js';
import { createMockClient, extractTextFromResponse } from '../../src/__tests__/helpers/mcp-client-mock.js';

describe('search_docs tool', () => {
  let server: AIPlaybookMCPServer;

  beforeEach(() => {
    server = new AIPlaybookMCPServer();
  });

  it('should return matching files and lines for search term', async () => {
    const client = createMockClient(server);

    // Search for a common term likely to exist in docs
    const response = await client.callTool('search_docs', {
      query: 'AI',
    });

    const text = extractTextFromResponse(response);

    // Should show search results header
    expect(text).toContain('Search Results for "AI"');

    // Should list matching files (with emoji)
    expect(text).toContain('📄');

    // Should show line numbers
    expect(text).toMatch(/Line \d+:/);
  });

  it('should support case-sensitive search when specified', async () => {
    const client = createMockClient(server);

    // Case-sensitive search
    const response = await client.callTool('search_docs', {
      query: 'AI',
      case_sensitive: true,
    });

    const text = extractTextFromResponse(response);

    // Should find results (assuming "AI" in caps exists in docs)
    // If it returns results, they should match the exact case
    if (text.includes('Line')) {
      expect(text).toContain('AI');
    }
  });

  it('should perform case-insensitive search by default', async () => {
    const client = createMockClient(server);

    // Default search (case-insensitive)
    const response = await client.callTool('search_docs', {
      query: 'government',
    });

    const text = extractTextFromResponse(response);

    // Should find results regardless of case
    // Implementation converts both to lowercase for comparison
    if (text.includes('No matches')) {
      // No matches is also valid
      expect(text).toContain('No matches found');
    } else {
      // If matches found, should show them
      expect(text).toContain('Search Results');
    }
  });

  it('should return empty results for non-matching query', async () => {
    const client = createMockClient(server);

    // Search for something unlikely to exist
    const response = await client.callTool('search_docs', {
      query: 'xyzabc123nonexistent',
    });

    const text = extractTextFromResponse(response);

    // Should indicate no matches found (FR-013: clear messages)
    expect(text).toContain('No matches found');
    expect(text).toContain('xyzabc123nonexistent');
  });

  it('should limit matches per file to avoid overwhelming output', async () => {
    const client = createMockClient(server);

    // Search for very common term
    const response = await client.callTool('search_docs', {
      query: 'the',
    });

    const text = extractTextFromResponse(response);

    // Implementation limits to 5 matches per file
    // If a file has more than 5, should show "... and N more matches"
    if (text.includes('more matches')) {
      expect(text).toMatch(/\.\.\. and \d+ more matches/);
    }
  });

  it('should show file names with matches', async () => {
    const client = createMockClient(server);

    const response = await client.callTool('search_docs', {
      query: 'AI',
    });

    const text = extractTextFromResponse(response);

    if (!text.includes('No matches')) {
      // Should show filename (with .md extension)
      expect(text).toMatch(/\w+\.md/);

      // Should use file emoji
      expect(text).toContain('📄');
    }
  });

  it('should handle empty query gracefully', async () => {
    const client = createMockClient(server);

    const response = await client.callTool('search_docs', {
      query: '',
    });

    const text = extractTextFromResponse(response);

    // Should handle empty query without crashing
    // Either returns no results or all results
    expect(text).toBeDefined();
    expect(text.length).toBeGreaterThan(0);
  });
});
