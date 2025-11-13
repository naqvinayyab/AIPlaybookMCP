/**
 * Markdown Converter Service (T028)
 *
 * Feature: 002-dynamic-api-content
 * Converts HTML to Markdown using turndown with GFM support
 */

import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { logDebug } from './logger.js';

/**
 * Markdown Converter Interface
 */
export interface IMarkdownConverter {
  convertToMarkdown(htmlContent: string): string;
}

/**
 * Markdown Converter implementation using turndown
 */
export class MarkdownConverter implements IMarkdownConverter {
  private readonly turndownService: TurndownService;

  constructor() {
    // Initialize turndown with GFM support
    this.turndownService = new TurndownService({
      headingStyle: 'atx',  // Use # heading style
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '_',
      hr: '---'
    });

    // Add GFM plugin for table support
    this.turndownService.use(gfm);

    // Custom rule to remove govspeak classes and IDs
    this.turndownService.addRule('removeGovspeakAttributes', {
      filter: (node) => {
        if (node.nodeType === 1) { // Element node
          const element = node;
          return element.hasAttribute('class') || element.hasAttribute('id');
        }
        return false;
      },
      replacement: (content, _node) => {
        // Return content without the wrapping element's attributes
        // This effectively removes class and id attributes while preserving content
        return content;
      }
    });

    // Custom rule to clean up govspeak divs
    this.turndownService.addRule('removeGovspeakDivs', {
      filter: (node) => {
        if (node.nodeName === 'DIV') {
          const element = node;
          const className = element.getAttribute('class') ?? '';
          return className.includes('govspeak') || className.includes('govuk');
        }
        return false;
      },
      replacement: (content) => {
        // Just return the content without the div wrapper
        return content;
      }
    });
  }

  /**
   * Converts HTML content to markdown
   */
  convertToMarkdown(htmlContent: string): string {
    logDebug('Converting HTML to markdown', {
      operation: 'html_to_markdown',
      htmlLength: htmlContent.length
    });

    const markdown = this.turndownService.turndown(htmlContent);

    logDebug('Successfully converted HTML to markdown', {
      operation: 'html_to_markdown',
      markdownLength: markdown.length
    });

    return markdown;
  }
}
