/**
 * Application Constants
 *
 * Feature: 002-dynamic-api-content
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Gov.uk API endpoint for AI Playbook content
 */
export const GOV_UK_API_URL =
  'https://www.gov.uk/api/content/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html' as const;

/**
 * Default cache directory (absolute path)
 */
export const DEFAULT_CACHE_DIR = resolve(__dirname, '../../.cache/docs');

/**
 * Default metadata file path (absolute path)
 */
export const DEFAULT_METADATA_PATH = resolve(__dirname, '../../.cache/metadata.json');

/**
 * Expected documentation filenames
 */
export const EXPECTED_FILENAMES = [
  'principles.md',
  'understanding_ai.md',
  'using_ai_safely_responsibly.md',
  'building_ai_solutions.md',
  'buying_ai.md',
  'governance.md',
  'security.md',
  'data_protection_privacy.md',
  'legal_considerations.md',
  'appendix_use_cases.md',
] as const;

/**
 * API request timeout in milliseconds (15 seconds per research.md R5)
 */
export const API_TIMEOUT_MS = 15000 as const;

/**
 * Maximum API response size in megabytes
 */
export const MAX_RESPONSE_SIZE_MB = 5 as const;

/**
 * Retry configuration for API fetching
 */
export const RETRY_CONFIG = {
  /** Number of retry attempts */
  maxAttempts: 7,
  /** Exponential backoff delays in milliseconds: 1s, 2s, 4s, 8s, 16s, 32s, 64s */
  delays: [1000, 2000, 4000, 8000, 16000, 32000, 64000]
} as const;
