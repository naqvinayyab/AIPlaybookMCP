/**
 * Document File Types
 *
 * Feature: 002-dynamic-api-content
 * Extends existing DocFile interface with cache metadata
 */

/**
 * Represents a cached documentation file in memory
 */
export interface DocFile {
  /** Filename (e.g., "principles.md") */
  name: string;

  /** Full filesystem path to cached markdown file */
  path: string;

  /** File size in bytes */
  size: number;

  /** Cached content (loaded lazily when needed) */
  content?: string;

  /** Cache metadata for this specific file */
  cacheInfo?: {
    contentHash: string;
    fetchedAt: string;
    source: 'api-fetch' | 'local-cache';
  };
}

/**
 * Configuration for content loading
 */
export interface ContentLoaderConfig {
  useLocalCache: boolean;
  cacheDir: string;
  metadataPath: string;
  apiUrl: string;
  apiTimeoutMs: number;
  validateCache: boolean;
}

/**
 * Result of content loading operation
 */
export interface ContentLoadResult {
  /** Successfully loaded documents */
  documents: DocFile[];

  /** Source of content */
  source: 'api-fetch' | 'local-cache';

  /** Timestamp of operation */
  loadedAt: string;

  /** Any warnings (non-fatal) */
  warnings: string[];
}

/**
 * Orchestrator service that coordinates content loading
 */
export interface IContentLoader {
  /**
   * Loads documentation content based on configuration
   */
  loadContent(config: ContentLoaderConfig): Promise<ContentLoadResult>;
}
