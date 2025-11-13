/**
 * Cache Manager Service (T029)
 *
 * Feature: 002-dynamic-api-content
 * Manages cache file read/write operations with integrity validation
 */

import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import { resolve, dirname } from 'path';
import type { CacheMetadata, CacheValidationResult } from '../models/cache-schema.js';
import { isValidCacheMetadata } from '../models/cache-schema.js';
import { DEFAULT_CACHE_DIR, DEFAULT_METADATA_PATH, EXPECTED_FILENAMES } from '../config/constants.js';
import { logInfo, logWarn, logDebug, logError } from './logger.js';
import { formatErrorMessage } from '../utils/error-formatter.js';

/**
 * Cache Manager Interface
 */
export interface ICacheManager {
  writeCacheFile(filename: string, content: string): Promise<void>;
  readCacheFile(filename: string): Promise<string>;
  writeMetadata(metadata: CacheMetadata): Promise<void>;
  readMetadata(): Promise<CacheMetadata>;
  validateCache(): Promise<CacheValidationResult>;
  listCacheFiles(): Promise<string[]>;
}

/**
 * Computes SHA-256 hash of content
 */
export function computeHash(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Cache Manager implementation
 */
export class CacheManager implements ICacheManager {
  constructor(
    private readonly cacheDir: string = DEFAULT_CACHE_DIR,
    private readonly metadataPath: string = DEFAULT_METADATA_PATH
  ) {
    // Validate paths are absolute
    if (!resolve(cacheDir)) {
      throw new Error(`Cache directory must be an absolute path: ${cacheDir}`);
    }
    if (!resolve(metadataPath)) {
      throw new Error(`Metadata path must be an absolute path: ${metadataPath}`);
    }
  }

  /**
   * Writes markdown content to cache directory
   */
  async writeCacheFile(filename: string, content: string): Promise<void> {
    this.validateFilename(filename);

    const filePath = resolve(this.cacheDir, filename);

    logDebug('Writing cache file', {
      operation: 'cache_write',
      filename,
      path: filePath,
      contentLength: content.length
    });

    try {
      // Ensure cache directory exists
      await fs.mkdir(this.cacheDir, { recursive: true });

      // Write file atomically (write to temp, then rename)
      const tempPath = `${filePath}.tmp`;
      await fs.writeFile(tempPath, content, 'utf-8');
      await fs.rename(tempPath, filePath);

      logInfo('Successfully wrote cache file', {
        operation: 'cache_write',
        filename,
        sizeBytes: content.length
      });
    } catch (error) {
      const errorMessage = `Failed to write cache file ${filename}: ${formatErrorMessage(error)}`;
      logError(errorMessage, {
        operation: 'cache_write',
        filename,
        error: formatErrorMessage(error)
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Reads markdown content from cache
   */
  async readCacheFile(filename: string): Promise<string> {
    this.validateFilename(filename);

    const filePath = resolve(this.cacheDir, filename);

    logDebug('Reading cache file', {
      operation: 'cache_read',
      filename,
      path: filePath
    });

    try {
      // Verify file exists
      await fs.access(filePath);

      const content = await fs.readFile(filePath, 'utf-8');

      logDebug('Successfully read cache file', {
        operation: 'cache_read',
        filename,
        contentLength: content.length
      });

      return content;
    } catch (error) {
      const errorMessage = `Failed to read cache file ${filename}: ${error instanceof Error ? error.message : String(error)}`;
      logError(errorMessage, {
        operation: 'cache_read',
        filename,
        error: error instanceof Error ? error.message : String(error)
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Writes cache metadata file
   */
  async writeMetadata(metadata: CacheMetadata): Promise<void> {
    logDebug('Writing cache metadata', {
      operation: 'metadata_write',
      path: this.metadataPath,
      sectionsCount: metadata.sections.length
    });

    try {
      // Ensure parent directory exists
      const dir = dirname(this.metadataPath);
      await fs.mkdir(dir, { recursive: true });

      // Write as pretty JSON
      const json = JSON.stringify(metadata, null, 2);
      await fs.writeFile(this.metadataPath, json, 'utf-8');

      logInfo('Successfully wrote cache metadata', {
        operation: 'metadata_write',
        sectionsCount: metadata.sections.length
      });
    } catch (error) {
      const errorMessage = `Failed to write metadata: ${error instanceof Error ? error.message : String(error)}`;
      logError(errorMessage, {
        operation: 'metadata_write',
        error: error instanceof Error ? error.message : String(error)
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Reads cache metadata file
   */
  async readMetadata(): Promise<CacheMetadata> {
    logDebug('Reading cache metadata', {
      operation: 'metadata_read',
      path: this.metadataPath
    });

    try {
      const content = await fs.readFile(this.metadataPath, 'utf-8');
      const metadata = JSON.parse(content) as unknown;

      if (!isValidCacheMetadata(metadata)) {
        throw new Error('Invalid cache metadata structure');
      }

      logDebug('Successfully read cache metadata', {
        operation: 'metadata_read',
        sectionsCount: metadata.sections.length,
        fetchedAt: metadata.fetchedAt
      });

      return metadata;
    } catch (error) {
      const errorMessage = `Failed to read metadata: ${error instanceof Error ? error.message : String(error)}`;
      logError(errorMessage, {
        operation: 'metadata_read',
        error: error instanceof Error ? error.message : String(error)
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Validates cache integrity
   */
  async validateCache(): Promise<CacheValidationResult> {
    logInfo('Validating cache integrity', {
      operation: 'cache_validate'
    });

    const errors: string[] = [];

    try {
      // 1. Verify metadata file exists and is valid
      const metadata = await this.readMetadata();

      // 2. Verify all expected files exist
      for (const filename of EXPECTED_FILENAMES) {
        const filePath = resolve(this.cacheDir, filename);

        try {
          await fs.access(filePath);
        } catch {
          errors.push(`Missing cache file: ${filename}`);
          continue;
        }

        // 3. Verify content hash matches metadata
        const section = metadata.sections.find(s => s.filename === filename);
        if (!section) {
          errors.push(`No metadata entry for ${filename}`);
          continue;
        }

        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const actualHash = computeHash(content);

          if (actualHash !== section.contentHash) {
            errors.push(`Hash mismatch for ${filename}: expected ${section.contentHash}, got ${actualHash}`);
          }
        } catch (error) {
          errors.push(`Failed to validate ${filename}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      if (errors.length > 0) {
        logWarn('Cache validation failed', {
          operation: 'cache_validate',
          errorCount: errors.length,
          errors: errors.join('; ')
        });

        return {
          valid: false,
          errors,
          metadata
        };
      }

      logInfo('Cache validation passed', {
        operation: 'cache_validate',
        filesValidated: EXPECTED_FILENAMES.length
      });

      return {
        valid: true,
        errors: [],
        metadata
      };

    } catch (error) {
      const errorMessage = `Cache validation error: ${error instanceof Error ? error.message : String(error)}`;
      logError(errorMessage, {
        operation: 'cache_validate',
        error: error instanceof Error ? error.message : String(error)
      });

      return {
        valid: false,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Lists all cached markdown files
   */
  async listCacheFiles(): Promise<string[]> {
    logDebug('Listing cache files', {
      operation: 'cache_list',
      cacheDir: this.cacheDir
    });

    try {
      const files = await fs.readdir(this.cacheDir);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      logDebug('Found cache files', {
        operation: 'cache_list',
        count: mdFiles.length,
        files: mdFiles
      });

      return mdFiles;
    } catch (error) {
      const errorMessage = `Failed to list cache files: ${error instanceof Error ? error.message : String(error)}`;
      logError(errorMessage, {
        operation: 'cache_list',
        error: error instanceof Error ? error.message : String(error)
      });
      throw new Error(errorMessage);
    }
  }

  /**
   * Validates filename is safe and expected
   */
  private validateFilename(filename: string): void {
    if (!filename.endsWith('.md')) {
      throw new Error(`Invalid filename: ${filename} (must end with .md)`);
    }

    if (filename.includes('/') || filename.includes('\\')) {
      throw new Error(`Invalid filename: ${filename} (must not contain path separators)`);
    }

    if (!EXPECTED_FILENAMES.includes(filename as typeof EXPECTED_FILENAMES[number])) {
      throw new Error(`Unexpected filename: ${filename} (not in expected list)`);
    }
  }
}
