#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DocFile, ContentLoadResult } from './models/doc-file.js';
import { ContentLoader } from './services/content-loader.js';
import { ApiClient } from './services/api-fetcher.js';
import { HtmlParser } from './services/content-mapper.js';
import { MarkdownConverter } from './services/html-converter.js';
import { CacheManager } from './services/cache-manager.js';
import { DEFAULT_CACHE_DIR, DEFAULT_METADATA_PATH, GOV_UK_API_URL, API_TIMEOUT_MS } from './config/constants.js';
import { parseCliArgs } from './cli/args-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..');
const CACHE_DIR = resolve(PROJECT_ROOT, DEFAULT_CACHE_DIR);
const METADATA_PATH = resolve(PROJECT_ROOT, DEFAULT_METADATA_PATH);

export class AIPlaybookMCPServer {
  private server: Server;
  private contentLoader: ContentLoader;
  private contentLoadResult: ContentLoadResult | null = null;
  private loadError: Error | null = null;

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

    // Instantiate ContentLoader with all dependencies
    const apiClient = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS);
    const htmlParser = new HtmlParser();
    const markdownConverter = new MarkdownConverter();
    const cacheManager = new CacheManager(CACHE_DIR, METADATA_PATH);

    this.contentLoader = new ContentLoader(
      apiClient,
      htmlParser,
      markdownConverter,
      cacheManager
    );

    this.setupHandlers();
  }

  /**
   * Lazy initialization of content on first tool call
   */
  private async ensureContentLoaded(): Promise<void> {
    if (this.contentLoadResult !== null || this.loadError !== null) {
      return; // Already loaded or failed
    }

    try {
      // Parse CLI arguments to determine cache mode
      const cliArgs = parseCliArgs();

      // Load content based on CLI args
      // --local flag: use cache exclusively (no API fallback)
      // No flag: fetch from API with cache fallback
      this.contentLoadResult = await this.contentLoader.loadContent({
        useLocalCache: cliArgs.useLocalCache,
        cacheDir: CACHE_DIR,
        metadataPath: METADATA_PATH,
        apiUrl: GOV_UK_API_URL,
        apiTimeoutMs: API_TIMEOUT_MS,
        validateCache: true
      });
    } catch (error) {
      this.loadError = error instanceof Error ? error : new Error(String(error));
      throw this.loadError;
    }
  }

  /**
   * Gets warning prefix for tool responses
   */
  private getWarningPrefix(): string {
    if (this.contentLoadResult && this.contentLoadResult.warnings.length > 0) {
      return this.contentLoadResult.warnings.join('\n') + '\n\n';
    }
    return '';
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

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Ensure content is loaded on first tool call
      await this.ensureContentLoaded();

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
    const warningPrefix = this.getWarningPrefix();
    const documents = this.contentLoadResult?.documents || [];

    const header = 'AI Playbook Documentation Files:\n' + '='.repeat(40) + '\n\n';

    const fileList = documents
      .map((file: DocFile) => {
        const sizeKB = Math.round(file.size / 1024 * 100) / 100;
        return `📄 ${file.name} (${sizeKB} KB)`;
      })
      .join('\n');

    return warningPrefix + header + fileList + `\n\nTotal: ${documents.length} documents`;
  }

  // Made public for testing
  public readDocument(filename: string): string {
    const warningPrefix = this.getWarningPrefix();
    const documents = this.contentLoadResult?.documents || [];

    if (!filename || filename.trim() === '') {
      return warningPrefix + 'Error: filename is required';
    }

    const docFile = documents.find((file: DocFile) => file.name === filename);

    if (!docFile) {
      const availableFiles = documents.map((f: DocFile) => f.name).join(', ');
      return warningPrefix + `Error: Document "${filename}" not found. Available files: ${availableFiles}`;
    }

    // Content is already loaded in memory from ContentLoader
    const content = docFile.content || '';
    return warningPrefix + `# ${filename}\n\n${content}`;
  }

  // Made public for testing
  public searchDocuments(query: string, caseSensitive = false): string {
    const warningPrefix = this.getWarningPrefix();
    const documents = this.contentLoadResult?.documents || [];
    const results: { file: string; matches: string[] }[] = [];

    for (const docFile of documents) {
      const content = docFile.content || '';
      const lines = content.split('\n');
      const matches: string[] = [];

      lines.forEach((line: string, index: number) => {
        const searchLine = caseSensitive ? line : line.toLowerCase();
        const searchQuery = caseSensitive ? query : query.toLowerCase();

        if (searchLine.includes(searchQuery)) {
          matches.push(`Line ${index + 1}: ${line.trim()}`);
        }
      });

      if (matches.length > 0) {
        results.push({ file: docFile.name, matches });
      }
    }

    if (results.length === 0) {
      return warningPrefix + `No matches found for "${query}" in AI Playbook documents.`;
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

    return warningPrefix + output;
  }

  // Made public for testing
  public getDocumentSummary(): string {
    const warningPrefix = this.getWarningPrefix();
    const documents = this.contentLoadResult?.documents || [];

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

    documents.forEach((file: DocFile) => {
      const summary = summaries[file.name] || 'No summary available';
      output += `📄 ${file.name}\n   ${summary}\n\n`;
    });

    return warningPrefix + output;
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