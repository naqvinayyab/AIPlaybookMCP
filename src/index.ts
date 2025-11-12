#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DOCS_DIR = resolve(__dirname, '..', 'docs');

interface DocFile {
  name: string;
  path: string;
  size: number;
  content?: string;
}

export class AIPlaybookMCPServer {
  private server: Server;
  private docFiles: DocFile[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'ai-playbook-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.loadDocFiles();
    this.setupHandlers();
  }

  private loadDocFiles(): void {
    try {
      const files = readdirSync(DOCS_DIR);
      this.docFiles = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
          try {
            const filePath = join(DOCS_DIR, file);
            const stats = statSync(filePath);
            return {
              name: file,
              path: filePath,
              size: stats.size,
            };
          } catch {
            // Skip files that can't be stat'd (may be in process of being deleted)
            return null;
          }
        })
        .filter((file): file is DocFile => file !== null);
    } catch (error) {
      console.error('Error loading doc files:', error);
      console.error('DOCS_DIR:', DOCS_DIR);
    }
  }

  private setupHandlers(): void {
    // eslint-disable-next-line @typescript-eslint/require-await
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
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
        ] satisfies Tool[],
      };
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'list_docs':
          return {
            content: [
              {
                type: 'text',
                text: this.formatDocList(),
              },
            ],
          };

        case 'read_doc':
          return {
            content: [
              {
                type: 'text',
                text: this.readDocument(args?.filename as string),
              },
            ],
          };

        case 'search_docs':
          return {
            content: [
              {
                type: 'text',
                text: this.searchDocuments(
                  args?.query as string,
                  args?.case_sensitive as boolean
                ),
              },
            ],
          };

        case 'get_doc_summary':
          return {
            content: [
              {
                type: 'text',
                text: this.getDocumentSummary(),
              },
            ],
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  // Made public for testing
  public formatDocList(): string {
    const header = 'AI Playbook Documentation Files:\n' + '='.repeat(40) + '\n\n';

    const fileList = this.docFiles
      .map(file => {
        const sizeKB = Math.round(file.size / 1024 * 100) / 100;
        return `📄 ${file.name} (${sizeKB} KB)`;
      })
      .join('\n');

    return header + fileList + `\n\nTotal: ${this.docFiles.length} documents`;
  }

  // Made public for testing
  public readDocument(filename: string): string {
    if (!filename || filename.trim() === '') {
      return 'Error: filename is required';
    }

    const docFile = this.docFiles.find(file => file.name === filename);

    if (!docFile) {
      const availableFiles = this.docFiles.map(f => f.name).join(', ');
      return `Error: Document "${filename}" not found. Available files: ${availableFiles}`;
    }

    try {
      const content = readFileSync(docFile.path, 'utf-8');
      return `# ${filename}\n\n${content}`;
    } catch (error) {
      return `Error reading file "${filename}": ${String(error)}`;
    }
  }

  // Made public for testing
  public searchDocuments(query: string, caseSensitive = false): string {
    const results: { file: string; matches: string[] }[] = [];

    for (const docFile of this.docFiles) {
      try {
        const content = readFileSync(docFile.path, 'utf-8');
        const lines = content.split('\n');
        const matches: string[] = [];

        lines.forEach((line, index) => {
          const searchLine = caseSensitive ? line : line.toLowerCase();
          const searchQuery = caseSensitive ? query : query.toLowerCase();

          if (searchLine.includes(searchQuery)) {
            matches.push(`Line ${index + 1}: ${line.trim()}`);
          }
        });

        if (matches.length > 0) {
          results.push({ file: docFile.name, matches });
        }
      } catch (error) {
        console.error(`Error searching file ${docFile.name}:`, error);
      }
    }

    if (results.length === 0) {
      return `No matches found for "${query}" in AI Playbook documents.`;
    }

    let output = `Search Results for "${query}":\n` + '='.repeat(50) + '\n\n';

    results.forEach(result => {
      output += `📄 ${result.file}:\n`;
      result.matches.slice(0, 5).forEach(match => {
        output += `  ${match}\n`;
      });
      if (result.matches.length > 5) {
        output += `  ... and ${result.matches.length - 5} more matches\n`;
      }
      output += '\n';
    });

    return output;
  }

  // Made public for testing
  public getDocumentSummary(): string {
    const summaries: Record<string, string> = {
      'principles.md': 'The 10 core principles for safe, responsible, and effective use of AI in government',
      'understanding_ai.md': 'Fundamental concepts about AI technology, capabilities, and limitations',
      'using_ai_safely_responsibly.md': 'Guidelines for responsible AI usage and risk mitigation',
      'building_ai_solutions.md': 'Best practices for developing AI solutions in government context',
      'buying_ai.md': 'Guidance for procuring AI solutions and services',
      'governance.md': 'AI governance frameworks and organizational structures',
      'security.md': 'Security considerations and best practices for AI systems',
      'data_protection_privacy.md': 'Data protection and privacy guidelines for AI implementations',
      'legal_considerations.md': 'Legal and regulatory aspects of AI deployment',
      'appendix_use_cases.md': 'Practical use cases and examples of AI implementation'
    };

    let output = 'AI Playbook Document Summaries:\n' + '='.repeat(40) + '\n\n';

    this.docFiles.forEach(file => {
      const summary = summaries[file.name] || 'No summary available';
      output += `📄 ${file.name}\n   ${summary}\n\n`;
    });

    return output;
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AI Playbook MCP Server running on stdio');
  }

  // Public getter for testing
  public getServer(): Server {
    return this.server;
  }
}

const server = new AIPlaybookMCPServer();
server.start().catch(console.error);