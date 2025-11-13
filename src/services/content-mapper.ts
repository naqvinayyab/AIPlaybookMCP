/**
 * HTML Parser Service (T027)
 *
 * Feature: 002-dynamic-api-content
 * Extracts sections from HTML using linkedom
 */

import { parseHTML } from 'linkedom';
import type { SectionMapping, SectionExtractionResult } from '../models/section-mapping.js';
import { logInfo, logWarn, logDebug, logError } from './logger.js';

/**
 * HTML Parser Interface
 */
export interface IHtmlParser {
  extractSections(htmlContent: string, mappings: SectionMapping[]): Promise<SectionExtractionResult[]>;
}

/**
 * HTML Parser implementation using linkedom
 */
export class HtmlParser implements IHtmlParser {
  /**
   * Extracts sections from HTML based on mapping configuration
   */
  async extractSections(
    htmlContent: string,
    mappings: SectionMapping[]
  ): Promise<SectionExtractionResult[]> {
    logInfo('Parsing HTML and extracting sections', {
      operation: 'html_parse',
      mappingsCount: mappings.length,
      htmlLength: htmlContent.length
    });

    const { document } = parseHTML(htmlContent);
    const results: SectionExtractionResult[] = [];

    for (const mapping of mappings) {
      const result = await this.extractSection(document, mapping);
      results.push(result);

      if (result.success) {
        logDebug(`Successfully extracted section: ${mapping.filename}`, {
          operation: 'section_extract',
          filename: mapping.filename,
          headingId: result.matchedHeadingId,
          contentLength: result.htmlContent?.length || 0
        });
      } else {
        logWarn(`Failed to extract section: ${mapping.filename}`, {
          operation: 'section_extract',
          filename: mapping.filename,
          error: result.error?.message
        });
      }
    }

    // Verify 100% success rate (FR-015 requirement)
    const successCount = results.filter(r => r.success).length;
    if (successCount !== mappings.length) {
      const failedSections = results
        .filter(r => !r.success)
        .map(r => r.mapping.filename)
        .join(', ');

      const errorMessage = `Failed to extract all sections (${successCount}/${mappings.length} successful). Failed: ${failedSections}`;
      logError(errorMessage, {
        operation: 'html_parse',
        successCount,
        totalCount: mappings.length,
        failedSections
      });

      throw new Error(errorMessage);
    }

    logInfo('Successfully extracted all sections', {
      operation: 'html_parse',
      extractedCount: results.length
    });

    return results;
  }

  /**
   * Extracts a single section from the document
   */
  private async extractSection(
    document: Document,
    mapping: SectionMapping
  ): Promise<SectionExtractionResult> {
    // Try heading IDs in priority order
    for (const headingId of mapping.headingIds) {
      const heading = document.getElementById(headingId);

      if (heading && this.isHeading(heading)) {
        const htmlContent = this.extractContentUntilNextH2(heading);

        return {
          mapping,
          success: true,
          htmlContent,
          matchedHeadingId: headingId
        };
      }
    }

    // Fallback to fuzzy matching if heading IDs don't match
    if (mapping.headingTextPatterns) {
      const headings = document.querySelectorAll('h2');

      for (const heading of Array.from(headings)) {
        const headingText = heading.textContent?.trim() || '';

        for (const pattern of mapping.headingTextPatterns) {
          if (pattern.test(headingText)) {
            const htmlContent = this.extractContentUntilNextH2(heading);

            logDebug('Matched section using fuzzy pattern', {
              operation: 'fuzzy_match',
              filename: mapping.filename,
              pattern: pattern.source,
              matchedText: headingText
            });

            return {
              mapping,
              success: true,
              htmlContent,
              matchedHeadingId: `fuzzy:${headingText}`
            };
          }
        }
      }
    }

    // Section not found
    return {
      mapping,
      success: false,
      error: {
        message: `Section not found. Tried heading IDs: ${mapping.headingIds.join(', ')}`,
        code: 'NOT_FOUND'
      }
    };
  }

  /**
   * Checks if element is a heading
   */
  private isHeading(element: Element): boolean {
    const tagName = element.tagName.toLowerCase();
    return tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6';
  }

  /**
   * Extracts content from a heading until the next h2
   */
  private extractContentUntilNextH2(heading: Element): string {
    const parts: string[] = [];

    // Include the heading itself
    parts.push(heading.outerHTML);

    // Walk through siblings until we hit another h2 or end of document
    let current = heading.nextElementSibling;

    while (current) {
      // Stop at next h2
      if (current.tagName.toLowerCase() === 'h2') {
        break;
      }

      // Include all other elements (h3, h4, p, ul, table, etc.)
      parts.push(current.outerHTML);
      current = current.nextElementSibling;
    }

    return parts.join('\n');
  }
}
