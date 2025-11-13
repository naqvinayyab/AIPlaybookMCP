/**
 * Cache Manager Unit Tests (T022)
 *
 * Feature: 002-dynamic-api-content
 * Tests file operations and integrity validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { CacheManager, computeHash } from '../../src/services/cache-manager.js';
import type { CacheMetadata } from '../../src/models/cache-schema.js';

describe('CacheManager', () => {
  const TEST_CACHE_DIR = resolve(process.cwd(), '.cache-test');
  const TEST_METADATA_PATH = resolve(TEST_CACHE_DIR, 'metadata-test.json');
  let cacheManager: CacheManager;

  beforeEach(async () => {
    // Create test cache directory
    await fs.mkdir(TEST_CACHE_DIR, { recursive: true });
    cacheManager = new CacheManager(TEST_CACHE_DIR, TEST_METADATA_PATH);
  });

  afterEach(async () => {
    // Clean up test cache directory
    try {
      await fs.rm(TEST_CACHE_DIR, { recursive: true, force: true });
    } catch (_error) {
      // Ignore cleanup errors
    }
  });

  it('should write cache file to directory', async () => {
    const filename = 'principles.md';
    const content = '# Test Principles\n\nTest content';

    await cacheManager.writeCacheFile(filename, content);

    // Verify file exists and content matches
    const filePath = resolve(TEST_CACHE_DIR, filename);
    const readContent = await fs.readFile(filePath, 'utf-8');
    expect(readContent).toBe(content);
  });

  it('should read cache file from directory', async () => {
    const filename = 'governance.md';
    const content = '# Governance\n\nGovernance content';

    // Write file first
    const filePath = resolve(TEST_CACHE_DIR, filename);
    await fs.writeFile(filePath, content, 'utf-8');

    // Read using cache manager
    const result = await cacheManager.readCacheFile(filename);
    expect(result).toBe(content);
  });

  it('should write and read metadata', async () => {
    const metadata: CacheMetadata = {
      fetchedAt: new Date().toISOString(),
      apiResponseHash: 'abc123hash',
      govUkContentId: 'test-content-id',
      sections: [
        'principles.md', 'understanding_ai.md', 'using_ai_safely_responsibly.md',
        'building_ai_solutions.md', 'buying_ai.md', 'governance.md', 'security.md',
        'data_protection_privacy.md', 'legal_considerations.md', 'appendix_use_cases.md'
      ].map((name, i) => ({
        filename: name,
        headingId: name.replace('.md', ''),
        contentHash: `hash${i}`,
        sizeBytes: 100 * (i + 1),
        extracted: true
      })),
      generatedBy: 'test-suite',
      nodeVersion: process.version
    };

    await cacheManager.writeMetadata(metadata);

    const result = await cacheManager.readMetadata();
    expect(result).toEqual(metadata);
  });

  it('should compute SHA-256 hash of content', () => {
    const content = 'Test content for hashing';
    const hash = computeHash(content);

    // SHA-256 hash is 64 hex characters
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);

    // Same content produces same hash
    const hash2 = computeHash(content);
    expect(hash2).toBe(hash);

    // Different content produces different hash
    const hash3 = computeHash('Different content');
    expect(hash3).not.toBe(hash);
  });

  it('should validate cache with matching hashes', async () => {
    // Write test files
    const files = [
      { name: 'principles.md', content: '# Principles' },
      { name: 'understanding_ai.md', content: '# Understanding AI' },
      { name: 'using_ai_safely_responsibly.md', content: '# Using AI Safely' },
      { name: 'building_ai_solutions.md', content: '# Building AI' },
      { name: 'buying_ai.md', content: '# Buying AI' },
      { name: 'governance.md', content: '# Governance' },
      { name: 'security.md', content: '# Security' },
      { name: 'data_protection_privacy.md', content: '# Data Protection' },
      { name: 'legal_considerations.md', content: '# Legal' },
      { name: 'appendix_use_cases.md', content: '# Appendix' }
    ];

    // Write all files
    for (const file of files) {
      await cacheManager.writeCacheFile(file.name, file.content);
    }

    // Create metadata with correct hashes
    const metadata: CacheMetadata = {
      fetchedAt: new Date().toISOString(),
      apiResponseHash: 'test-hash',
      sections: files.map(f => ({
        filename: f.name,
        headingId: f.name.replace('.md', ''),
        contentHash: computeHash(f.content),
        sizeBytes: f.content.length,
        extracted: true
      })),
      generatedBy: 'test',
      nodeVersion: process.version
    };

    await cacheManager.writeMetadata(metadata);

    // Validate cache
    const result = await cacheManager.validateCache();
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect hash mismatch (corrupted file)', async () => {
    const filename = 'principles.md';
    const originalContent = '# Original Content';
    const corruptedContent = '# Corrupted Content';

    // Write file
    await cacheManager.writeCacheFile(filename, originalContent);

    // Create metadata with original hash
    const metadata: CacheMetadata = {
      fetchedAt: new Date().toISOString(),
      apiResponseHash: 'test-hash',
      sections: [
        {
          filename,
          headingId: 'principles',
          contentHash: computeHash(originalContent),
          sizeBytes: originalContent.length,
          extracted: true
        },
        // Add other required files as minimal entries
        ...['understanding_ai.md', 'using_ai_safely_responsibly.md', 'building_ai_solutions.md',
            'buying_ai.md', 'governance.md', 'security.md', 'data_protection_privacy.md',
            'legal_considerations.md', 'appendix_use_cases.md'].map(name => ({
          filename: name,
          headingId: name.replace('.md', ''),
          contentHash: 'placeholder',
          sizeBytes: 0,
          extracted: false
        }))
      ],
      generatedBy: 'test',
      nodeVersion: process.version
    };

    await cacheManager.writeMetadata(metadata);

    // Corrupt the file directly
    const filePath = resolve(TEST_CACHE_DIR, filename);
    await fs.writeFile(filePath, corruptedContent, 'utf-8');

    // Validation should detect mismatch
    const result = await cacheManager.validateCache();
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.includes('Hash mismatch'))).toBe(true);
  });

  it('should detect missing cache file', async () => {
    // Create metadata without writing files
    const metadata: CacheMetadata = {
      fetchedAt: new Date().toISOString(),
      apiResponseHash: 'test-hash',
      sections: [
        {
          filename: 'principles.md',
          headingId: 'principles',
          contentHash: 'somehash',
          sizeBytes: 100,
          extracted: true
        },
        ...['understanding_ai.md', 'using_ai_safely_responsibly.md', 'building_ai_solutions.md',
            'buying_ai.md', 'governance.md', 'security.md', 'data_protection_privacy.md',
            'legal_considerations.md', 'appendix_use_cases.md'].map(name => ({
          filename: name,
          headingId: name.replace('.md', ''),
          contentHash: 'placeholder',
          sizeBytes: 0,
          extracted: false
        }))
      ],
      generatedBy: 'test',
      nodeVersion: process.version
    };

    await cacheManager.writeMetadata(metadata);

    // Validation should detect missing files
    const result = await cacheManager.validateCache();
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Missing cache file'))).toBe(true);
  });

  it('should list all cache files', async () => {
    // Write multiple files
    await cacheManager.writeCacheFile('principles.md', 'content1');
    await cacheManager.writeCacheFile('governance.md', 'content2');
    await cacheManager.writeCacheFile('security.md', 'content3');

    const files = await cacheManager.listCacheFiles();

    expect(files).toContain('principles.md');
    expect(files).toContain('governance.md');
    expect(files).toContain('security.md');
    expect(files.length).toBe(3);
  });

  it('should reject invalid filename (no .md extension)', async () => {
    await expect(
      cacheManager.writeCacheFile('invalid.txt', 'content')
    ).rejects.toThrow('Invalid filename');
  });

  it('should reject filename with path separators', async () => {
    await expect(
      cacheManager.writeCacheFile('../escape.md', 'content')
    ).rejects.toThrow('Invalid filename');

    await expect(
      cacheManager.writeCacheFile('subdir/file.md', 'content')
    ).rejects.toThrow('Invalid filename');
  });

  it('should reject unexpected filename', async () => {
    await expect(
      cacheManager.writeCacheFile('unexpected.md', 'content')
    ).rejects.toThrow('Unexpected filename');
  });

  it('should use atomic write (temp file + rename)', async () => {
    const filename = 'principles.md';
    const content = '# Atomic Write Test';

    // This test verifies the file is written atomically
    // by checking that after write, only the final file exists (no .tmp file)
    await cacheManager.writeCacheFile(filename, content);

    const finalPath = resolve(TEST_CACHE_DIR, filename);
    const tempPath = `${finalPath}.tmp`;

    // Final file should exist
    await expect(fs.access(finalPath)).resolves.not.toThrow();

    // Temp file should not exist (cleaned up after rename)
    await expect(fs.access(tempPath)).rejects.toThrow();
  });
});
