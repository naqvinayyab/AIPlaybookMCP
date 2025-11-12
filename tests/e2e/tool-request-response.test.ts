/**
 * End-to-end tests for complete MCP request-response cycles
 * Tests FR-002: System MUST verify complete request-response cycles
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIPlaybookMCPServer } from '../../src/index.js';
import { createMockClient, EXPECTED_TOOLS } from '../../src/__tests__/helpers/mcp-client-mock.js';

describe('MCP Tool Request-Response Cycle', () => {
  let server: AIPlaybookMCPServer;

  beforeEach(() => {
    server = new AIPlaybookMCPServer();
  });

  it('should complete full cycle from MCP request to tool execution to response', async () => {
    const client = createMockClient(server);

    // 1. List tools (ListTools request)
    const listResponse = await client.listTools();
    expect(listResponse.tools).toBeDefined();
    expect(listResponse.tools.length).toBe(4);

    // 2. Call a tool (CallTool request)
    const callResponse = await client.callTool('list_docs', {});
    expect(callResponse.content).toBeDefined();
    expect(callResponse.content.length).toBeGreaterThan(0);

    // 3. Verify response format matches MCP spec
    expect(callResponse.content[0].type).toBe('text');
    expect(typeof callResponse.content[0].text).toBe('string');
  });

  it('should handle multiple sequential tool calls', async () => {
    const client = createMockClient(server);

    // Call multiple tools in sequence
    const listResponse = await client.callTool('list_docs', {});
    expect(listResponse.content).toBeDefined();

    const summaryResponse = await client.callTool('get_doc_summary', {});
    expect(summaryResponse.content).toBeDefined();

    const searchResponse = await client.callTool('search_docs', {
      query: 'AI',
    });
    expect(searchResponse.content).toBeDefined();

    // All should complete successfully
    expect(listResponse.content.length).toBeGreaterThan(0);
    expect(summaryResponse.content.length).toBeGreaterThan(0);
    expect(searchResponse.content.length).toBeGreaterThan(0);
  });

  it('should return proper MCP response format for all tools', async () => {
    const client = createMockClient(server);

    for (const toolName of EXPECTED_TOOLS) {
      let args: Record<string, unknown> = {};

      // Provide required args for tools that need them
      if (toolName === 'read_doc') {
        args = { filename: 'principles.md' };
      } else if (toolName === 'search_docs') {
        args = { query: 'test' };
      }

      const response = await client.callTool(toolName, args);

      // Verify MCP response structure
      expect(response).toHaveProperty('content');
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content.length).toBeGreaterThan(0);
      expect(response.content[0]).toHaveProperty('type');
      expect(response.content[0]).toHaveProperty('text');
      expect(response.content[0].type).toBe('text');
    }
  });

  it('should handle error responses in proper MCP format', async () => {
    const client = createMockClient(server);

    // Call tool with invalid parameters
    const response = await client.callTool('read_doc', {
      filename: 'nonexistent.md',
    });

    // Error response should still have proper MCP structure
    expect(response.content).toBeDefined();
    expect(response.content[0].type).toBe('text');

    const errorText = response.content[0].text;
    expect(errorText).toContain('not found');
  });

  it('should maintain server state across multiple requests', async () => {
    const client = createMockClient(server);

    // First request
    const response1 = await client.listTools();
    const toolCount1 = response1.tools.length;

    // Second request (should have same tools)
    const response2 = await client.listTools();
    const toolCount2 = response2.tools.length;

    // Tool count should be consistent
    expect(toolCount1).toBe(toolCount2);
    expect(toolCount1).toBe(4);
  });

  it('should handle concurrent-like sequential requests without errors', async () => {
    const client = createMockClient(server);

    // Make multiple rapid sequential calls
    const promises = [
      client.callTool('list_docs', {}),
      client.callTool('get_doc_summary', {}),
      client.callTool('search_docs', { query: 'AI' }),
      client.callTool('list_docs', {}),
    ];

    const responses = await Promise.all(promises);

    // All should succeed
    expect(responses.length).toBe(4);
    responses.forEach((response) => {
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);
    });
  });

  it('should validate tool input schemas before execution', async () => {
    const client = createMockClient(server);

    // The tools should have valid input schemas
    const { tools } = await client.listTools();

    tools.forEach((tool) => {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
    });
  });
});
