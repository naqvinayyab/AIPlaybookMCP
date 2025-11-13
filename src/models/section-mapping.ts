/**
 * Section Mapping Types
 *
 * Feature: 002-dynamic-api-content
 */

/**
 * Configuration that maps HTML heading IDs to markdown filenames
 */
export interface SectionMapping {
  /** Target markdown filename */
  filename: string;

  /** Priority-ordered list of heading IDs to match (first match wins) */
  headingIds: string[];

  /** Human-readable description for error messages */
  description: string;

  /** Optional: h2 heading text patterns for fuzzy matching fallback */
  headingTextPatterns?: RegExp[];
}

/**
 * Result of extracting a section from HTML
 */
export interface SectionExtractionResult {
  /** Section mapping that was used */
  mapping: SectionMapping;

  /** Whether extraction succeeded */
  success: boolean;

  /** Extracted HTML content (if successful) */
  htmlContent?: string;

  /** Which heading ID actually matched */
  matchedHeadingId?: string;

  /** Error information (if failed) */
  error?: {
    message: string;
    code: 'NOT_FOUND' | 'PARSE_ERROR' | 'CONVERSION_ERROR';
  };
}
