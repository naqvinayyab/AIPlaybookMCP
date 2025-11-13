/**
 * Cache Schema Types
 *
 * Feature: 002-dynamic-api-content
 */

/**
 * Cache metadata structure
 * Stored in .cache/metadata.json
 */
export interface CacheMetadata {
  /** ISO 8601 timestamp of when cache was generated */
  fetchedAt: string;

  /** SHA-256 hash of complete API response for change detection */
  apiResponseHash: string;

  /** Gov.uk API version or content_id if available */
  govUkContentId?: string;

  /** Information about each extracted section */
  sections: SectionCacheInfo[];

  /** Version of the cache generator tool */
  generatedBy: string;  // e.g., "ai-playbook-mcp-server@1.1.0"

  /** Node.js version used during generation (for debugging) */
  nodeVersion: string;
}

/**
 * Information about a cached section
 */
export interface SectionCacheInfo {
  /** Markdown filename (e.g., "principles.md") */
  filename: string;

  /** Which heading ID from mapping config matched */
  headingId: string;

  /** SHA-256 hash of the markdown content for integrity verification */
  contentHash: string;

  /** Size of markdown file in bytes */
  sizeBytes: number;

  /** True if section was successfully extracted */
  extracted: boolean;

  /** Error message if extraction failed */
  error?: string;
}

/**
 * Cache validation result
 */
export interface CacheValidationResult {
  valid: boolean;
  errors: string[];
  metadata?: CacheMetadata;
}

/**
 * Type guard for valid CacheMetadata
 */
export function isValidCacheMetadata(obj: unknown): obj is CacheMetadata {
  if (typeof obj !== 'object' || obj === null) return false;
  const meta = obj as Partial<CacheMetadata>;

  return (
    typeof meta.fetchedAt === 'string' &&
    typeof meta.apiResponseHash === 'string' &&
    Array.isArray(meta.sections) &&
    meta.sections.length === 10 &&
    typeof meta.generatedBy === 'string' &&
    typeof meta.nodeVersion === 'string'
  );
}
