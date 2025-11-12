/**
 * MCP protocol mock client for testing tool invocations
 * Provides a lightweight way to test MCP server tools without full MCP client
 */

import { AIPlaybookMCPServer } from '../../index.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Mock MCP client for testing
 */
export class MockMCPClient {
  private mcpServer: AIPlaybookMCPServer;

  constructor(mcpServer: AIPlaybookMCPServer) {
    this.mcpServer = mcpServer;
  }

  /**
   * List available tools
   */
  async listTools(): Promise<{ tools: Tool[] }> {
    // Return the tools as defined in the server
    return {
      tools: [
        {
          name: 'list_docs',
          description: 'List all available AI Playbook documentation files',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'read_doc',
          description: 'Read the content of a specific AI Playbook document',
          inputSchema: {
            type: 'object',
            properties: {
              filename: {
                type: 'string',
                description: 'The name of the document file to read (e.g., "principles.md")',
              },
            },
            required: ['filename'],
          },
        },
        {
          name: 'search_docs',
          description: 'Search for content across all AI Playbook documents',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search term or phrase to look for',
              },
              case_sensitive: {
                type: 'boolean',
                description: 'Whether to perform case-sensitive search (default: false)',
                default: false,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_doc_summary',
          description: 'Get a summary of what each document covers',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ] as Tool[],
    };
  }

  /**
   * Call a tool with arguments
   */
  async callTool(
    toolName: string,
    args: Record<string, unknown>
  ): Promise<{ content: { type: string; text: string }[] }> {
    let text: string;

    switch (toolName) {
      case 'list_docs':
        text = this.mcpServer.formatDocList();
        break;

      case 'read_doc':
        text = this.mcpServer.readDocument(args?.filename as string);
        break;

      case 'search_docs':
        text = this.mcpServer.searchDocuments(
          args?.query as string,
          args?.case_sensitive as boolean
        );
        break;

      case 'get_doc_summary':
        text = this.mcpServer.getDocumentSummary();
        break;

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }
}

/**
 * Create a mock MCP client for testing
 */
export function createMockClient(mcpServer: AIPlaybookMCPServer): MockMCPClient {
  return new MockMCPClient(mcpServer);
}

/**
 * Helper to extract text content from MCP response
 */
export function extractTextFromResponse(response: {
  content: { type: string; text: string }[];
}): string {
  const textContent = response.content.find((item) => item.type === 'text');
  return textContent?.text || '';
}

/**
 * Helper to validate MCP tool schema
 */
export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export function validateToolSchema(tool: Tool): boolean {
  if (!tool.name || typeof tool.name !== 'string') {
    throw new Error('Tool must have a string name');
  }

  if (!tool.description || typeof tool.description !== 'string') {
    throw new Error('Tool must have a string description');
  }

  if (!tool.inputSchema || typeof tool.inputSchema !== 'object') {
    throw new Error('Tool must have an inputSchema object');
  }

  return true;
}

/**
 * Expected tool names for AI Playbook MCP Server
 */
export const EXPECTED_TOOLS = [
  'list_docs',
  'read_doc',
  'search_docs',
  'get_doc_summary',
] as const;

export type ExpectedToolName = (typeof EXPECTED_TOOLS)[number];

/**
 * Verify all expected tools are present
 */
export function verifyAllToolsPresent(tools: Tool[]): boolean {
  const toolNames = tools.map((t) => t.name);

  for (const expectedTool of EXPECTED_TOOLS) {
    if (!toolNames.includes(expectedTool)) {
      throw new Error(`Expected tool "${expectedTool}" not found in tool list`);
    }
  }

  return true;
}
