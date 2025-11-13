/**
 * Content Loader Service (T030)
 *
 * Feature: 002-dynamic-api-content
 * Orchestrates API fetch → HTML parse → markdown convert → cache write → DocFile array creation
 */

import type {
  IContentLoader,
  ContentLoaderConfig,
  ContentLoadResult,
  DocFile
} from '../models/doc-file.js';
import type { IApiClient } from './api-fetcher.js';
import type { IHtmlParser } from './content-mapper.js';
import type { IMarkdownConverter } from './html-converter.js';
import type { ICacheManager } from './cache-manager.js';
import type { CacheMetadata, SectionCacheInfo } from '../models/cache-schema.js';
import { SECTION_MAPPINGS } from '../config/section-mapping.js';
import { computeHash } from './cache-manager.js';
import { logInfo, logWarn, logError, logDebug } from './logger.js';

/**
 * Performance metrics for content loading
 */
interface PerformanceMetrics {
  apiFetchMs?: number;
  parseMs?: number;
  convertMs?: number;
  cacheWriteMs?: number;
  totalMs: number;
}

/**
 * Content Loader implementation
 */
export class ContentLoader implements IContentLoader {
  constructor(
    private readonly apiClient: IApiClient,
    private readonly htmlParser: IHtmlParser,
    private readonly markdownConverter: IMarkdownConverter,
    private readonly cacheManager: ICacheManager
  ) {}

  /**
   * Loads documentation content based on configuration
   */
  async loadContent(config: ContentLoaderConfig): Promise<ContentLoadResult> {
    const startTime = Date.now();

    logInfo('Loading documentation content', {
      operation: 'content_load',
      useLocalCache: config.useLocalCache
    });

    try {
      if (config.useLocalCache) {
        return await this.loadFromCache(config, startTime);
      } else {
        return await this.loadFromApi(config, startTime);
      }
    } catch (error) {
      const errorMessage = `Content load failed: ${error instanceof Error ? error.message : String(error)}`;
      logError(errorMessage, {
        operation: 'content_load',
        error: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - startTime
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Loads content from local cache
   */
  private async loadFromCache(
    config: ContentLoaderConfig,
    startTime: number
  ): Promise<ContentLoadResult> {
    logInfo('Loading content from local cache', {
      operation: 'cache_load',
      cacheDir: config.cacheDir
    });

    // Validate cache if requested
    if (config.validateCache) {
      const validation = await this.cacheManager.validateCache();
      if (!validation.valid) {
        throw new Error(
          `Cache validation failed: ${validation.errors.join('; ')}`
        );
      }
    }

    // Read metadata
    const metadata = await this.cacheManager.readMetadata();

    // Load all cached files
    const documents: DocFile[] = [];

    for (const mapping of SECTION_MAPPINGS) {
      const content = await this.cacheManager.readCacheFile(mapping.filename);
      const section = metadata.sections.find(s => s.filename === mapping.filename);

      documents.push({
        name: mapping.filename,
        path: `${config.cacheDir}/${mapping.filename}`,
        size: content.length,
        content,
        cacheInfo: {
          contentHash: section?.contentHash ?? computeHash(content),
          fetchedAt: metadata.fetchedAt,
          source: 'local-cache'
        }
      });
    }

    const durationMs = Date.now() - startTime;

    logInfo('Successfully loaded content from local cache', {
      operation: 'cache_load',
      documentCount: documents.length,
      durationMs
    });

    return {
      documents,
      source: 'local-cache',
      loadedAt: new Date().toISOString(),
      warnings: []
    };
  }

  /**
   * Loads content from API with cache fallback
   */
  private async loadFromApi(
    config: ContentLoaderConfig,
    startTime: number
  ): Promise<ContentLoadResult> {
    const metrics: PerformanceMetrics = { totalMs: 0 };

    try {
      // Step 1: Fetch from API
      const fetchStart = Date.now();
      const htmlContent = await this.apiClient.fetchContent();
      metrics.apiFetchMs = Date.now() - fetchStart;

      logDebug('API fetch completed', {
        operation: 'api_fetch',
        durationMs: metrics.apiFetchMs,
        contentLength: htmlContent.length
      });

      // Step 2: Parse HTML sections
      const parseStart = Date.now();
      const extractionResults = this.htmlParser.extractSections(
        htmlContent,
        SECTION_MAPPINGS
      );
      metrics.parseMs = Date.now() - parseStart;

      logDebug('HTML parsing completed', {
        operation: 'html_parse',
        durationMs: metrics.parseMs,
        sectionsExtracted: extractionResults.length
      });

      // Step 3: Convert to markdown and cache
      const convertStart = Date.now();
      const documents: DocFile[] = [];
      const sections: SectionCacheInfo[] = [];

      for (const result of extractionResults) {
        if (!result.success || !result.htmlContent) {
          throw new Error(
            `Failed to extract section ${result.mapping.filename}: ${result.error?.message}`
          );
        }

        const markdown = this.markdownConverter.convertToMarkdown(result.htmlContent);
        const contentHash = computeHash(markdown);

        // Write to cache
        await this.cacheManager.writeCacheFile(result.mapping.filename, markdown);

        documents.push({
          name: result.mapping.filename,
          path: `${config.cacheDir}/${result.mapping.filename}`,
          size: markdown.length,
          content: markdown,
          cacheInfo: {
            contentHash,
            fetchedAt: new Date().toISOString(),
            source: 'api-fetch'
          }
        });

        sections.push({
          filename: result.mapping.filename,
          headingId: result.matchedHeadingId ?? 'unknown',
          contentHash,
          sizeBytes: markdown.length,
          extracted: true
        });
      }

      metrics.convertMs = Date.now() - convertStart;

      // Step 4: Write metadata
      const cacheWriteStart = Date.now();
      const metadata: CacheMetadata = {
        fetchedAt: new Date().toISOString(),
        apiResponseHash: computeHash(htmlContent),
        sections,
        generatedBy: 'ai-playbook-mcp-server',
        nodeVersion: process.version
      };

      await this.cacheManager.writeMetadata(metadata);
      metrics.cacheWriteMs = Date.now() - cacheWriteStart;

      metrics.totalMs = Date.now() - startTime;

      logInfo('Successfully loaded and cached content from API', {
        operation: 'api_load',
        metrics,
        documentCount: documents.length
      });

      return {
        documents,
        source: 'api-fetch',
        loadedAt: metadata.fetchedAt,
        warnings: []
      };

    } catch (error) {
      // Attempt cache fallback if API fetch failed
      logWarn('API fetch failed, attempting cache fallback', {
        operation: 'api_fallback',
        error: error instanceof Error ? error.message : String(error)
      });

      try {
        const result = await this.loadFromCache(config, startTime);

        // Prepend warning message to indicate fallback
        const warningMessage = `⚠️ WARNING: Unable to fetch latest content from gov.uk API. Serving cached content from ${result.documents[0]?.cacheInfo?.fetchedAt ?? 'unknown timestamp'}. Information may be outdated.`;

        logWarn('Using fallback cache after API failure', {
          operation: 'cache_fallback',
          cachedAt: result.documents[0]?.cacheInfo?.fetchedAt
        });

        return {
          ...result,
          warnings: [warningMessage]
        };

      } catch (cacheError) {
        // No cache available - fail with clear error
        const errorMessage = `Failed to fetch from API and no valid cache available. API error: ${error instanceof Error ? error.message : String(error)}. Cache error: ${cacheError instanceof Error ? cacheError.message : String(cacheError)}`;

        logError(errorMessage, {
          operation: 'content_load_failed',
          apiError: error instanceof Error ? error.message : String(error),
          cacheError: cacheError instanceof Error ? cacheError.message : String(cacheError)
        });

        throw new Error(errorMessage);
      }
    }
  }
}
