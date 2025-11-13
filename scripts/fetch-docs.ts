#!/usr/bin/env node
/**
 * Build-time Cache Generation Script (T049)
 *
 * Feature: 002-dynamic-api-content
 * Fetches AI Playbook content from gov.uk API and generates cache files
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ContentLoader } from '../src/services/content-loader.js';
import { ApiClient } from '../src/services/api-fetcher.js';
import { HtmlParser } from '../src/services/content-mapper.js';
import { MarkdownConverter } from '../src/services/html-converter.js';
import { CacheManager } from '../src/services/cache-manager.js';
import { DEFAULT_CACHE_DIR, DEFAULT_METADATA_PATH, GOV_UK_API_URL, API_TIMEOUT_MS } from '../src/config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..');
const CACHE_DIR = resolve(PROJECT_ROOT, DEFAULT_CACHE_DIR);
const METADATA_PATH = resolve(PROJECT_ROOT, DEFAULT_METADATA_PATH);

/**
 * Main script execution
 */
async function main(): Promise<void> {
  const startTime = Date.now();

  // Parse command-line flags
  const args = process.argv.slice(2);
  const failOnError = args.includes('--fail-on-error');

  console.log('🚀 AI Playbook Cache Generation');
  console.log('='.repeat(60));
  console.log(`Cache directory: ${CACHE_DIR}`);
  console.log(`Metadata path: ${METADATA_PATH}`);
  console.log(`Fail on error: ${failOnError}`);
  console.log('='.repeat(60));
  console.log();

  try {
    // Initialize services
    console.log('📦 Initializing services...');
    const apiClient = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS);
    const htmlParser = new HtmlParser();
    const markdownConverter = new MarkdownConverter();
    const cacheManager = new CacheManager(CACHE_DIR, METADATA_PATH);

    const contentLoader = new ContentLoader(
      apiClient,
      htmlParser,
      markdownConverter,
      cacheManager
    );

    // Fetch and cache content
    console.log('🌐 Fetching content from gov.uk API...');
    console.log(`   URL: ${GOV_UK_API_URL}`);
    console.log();

    const result = await contentLoader.loadContent({
      useLocalCache: false, // Always fetch from API for build-time generation
      cacheDir: CACHE_DIR,
      metadataPath: METADATA_PATH,
      apiUrl: GOV_UK_API_URL,
      apiTimeoutMs: API_TIMEOUT_MS,
      validateCache: false // Don't validate existing cache, we're regenerating
    });

    // Calculate metrics
    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(2);
    const totalSizeBytes = result.documents.reduce((sum, doc) => sum + doc.size, 0);
    const totalSizeKB = (totalSizeBytes / 1024).toFixed(2);

    // Output success
    console.log('✅ Cache generation completed successfully!');
    console.log();
    console.log('📊 Summary:');
    console.log(`   Documents generated: ${result.documents.length}`);
    console.log(`   Total size: ${totalSizeKB} KB`);
    console.log(`   Duration: ${durationSec}s`);
    console.log(`   Source: ${result.source}`);
    console.log(`   Generated at: ${result.loadedAt}`);
    console.log();

    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
      console.log();
    }

    console.log('📄 Generated files:');
    result.documents.forEach(doc => {
      const sizeKB = (doc.size / 1024).toFixed(2);
      console.log(`   ✓ ${doc.name} (${sizeKB} KB)`);
    });
    console.log();

    console.log('🎉 Cache is ready for deployment!');
    process.exit(0);

  } catch (error) {
    const durationMs = Date.now() - startTime;
    const durationSec = (durationMs / 1000).toFixed(2);

    // Output error to stderr
    console.error();
    console.error('❌ Cache generation failed!');
    console.error();
    console.error('Error details:');
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    console.error();
    console.error(`Duration: ${durationSec}s`);
    console.error();

    if (failOnError) {
      console.error('Exiting with error code 1 (--fail-on-error enabled)');
      process.exit(1);
    } else {
      console.error('Exiting with code 0 (--fail-on-error not enabled, allows CI skip)');
      process.exit(0);
    }
  }
}

// Execute main function
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
