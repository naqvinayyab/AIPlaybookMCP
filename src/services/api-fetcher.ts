/**
 * API Client Service (T026)
 *
 * Feature: 002-dynamic-api-content
 * Fetches content from gov.uk API with retry logic
 */

import { GOV_UK_API_URL, RETRY_CONFIG, API_TIMEOUT_MS, MAX_RESPONSE_SIZE_MB } from '../config/constants.js';
import type { GovUkApiResponse } from '../models/api-response.js';
import { isValidGovUkApiResponse } from '../models/api-response.js';
import { logInfo, logWarn, logError, logDebug } from './logger.js';

/**
 * Custom error for API operations
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Client Interface
 */
export interface IApiClient {
  fetchContent(): Promise<string>;
}

/**
 * Waits for specified milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * API Client implementation with retry logic
 */
export class ApiClient implements IApiClient {
  private readonly url: string;
  private readonly timeoutMs: number;
  private readonly maxAttempts: number;
  private readonly retryDelays: number[];

  constructor(
    url: string = GOV_UK_API_URL,
    timeoutMs: number = API_TIMEOUT_MS,
    maxAttempts: number = RETRY_CONFIG.maxAttempts,
    retryDelays: number[] = [...RETRY_CONFIG.delays]
  ) {
    this.url = url;
    this.timeoutMs = timeoutMs;
    this.maxAttempts = maxAttempts;
    this.retryDelays = retryDelays;
  }

  /**
   * Fetches content from gov.uk API with retry logic
   */
  async fetchContent(): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        logInfo('Fetching content from gov.uk API', {
          operation: 'api_fetch',
          url: this.url,
          attempt,
          maxAttempts: this.maxAttempts
        });

        const html = await this.fetchWithTimeout();

        logInfo('Successfully fetched content from gov.uk API', {
          operation: 'api_fetch',
          attempt,
          contentLength: html.length
        });

        return html;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        logWarn(`API fetch attempt ${attempt} failed`, {
          operation: 'api_fetch',
          attempt,
          maxAttempts: this.maxAttempts,
          error: lastError.message
        });

        // Don't retry if this was the last attempt
        if (attempt === this.maxAttempts) {
          break;
        }

        // Calculate delay for next retry (exponential backoff)
        const delayMs = this.retryDelays[attempt - 1] || this.retryDelays[this.retryDelays.length - 1];

        logInfo(`Retrying in ${delayMs}ms`, {
          operation: 'api_retry',
          attempt: attempt + 1,
          delay: delayMs
        });

        await delay(delayMs);
      }
    }

    // All retries exhausted
    const errorMessage = `Failed to fetch from gov.uk API after ${this.maxAttempts} attempts: ${lastError?.message}`;
    logError(errorMessage, {
      operation: 'api_fetch',
      error: lastError?.message,
      attempts: this.maxAttempts
    });

    throw new ApiError(errorMessage, undefined, lastError || undefined);
  }

  /**
   * Fetches with timeout enforcement
   */
  private async fetchWithTimeout(): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(this.url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ai-playbook-mcp-server/1.1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `API returned ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      // Check content length before parsing
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeInMB = parseInt(contentLength, 10) / (1024 * 1024);
        if (sizeInMB > MAX_RESPONSE_SIZE_MB) {
          throw new ApiError(
            `Response size ${sizeInMB.toFixed(2)}MB exceeds maximum allowed ${MAX_RESPONSE_SIZE_MB}MB`
          );
        }
      }

      const data = await response.json() as unknown;

      if (!isValidGovUkApiResponse(data)) {
        throw new ApiError('Invalid API response: missing details.body field');
      }

      const html = data.details.body;

      // Verify size after extraction
      const sizeInMB = new Blob([html]).size / (1024 * 1024);
      if (sizeInMB > MAX_RESPONSE_SIZE_MB) {
        throw new ApiError(
          `HTML content size ${sizeInMB.toFixed(2)}MB exceeds maximum allowed ${MAX_RESPONSE_SIZE_MB}MB`
        );
      }

      logDebug('API response validated', {
        operation: 'api_fetch',
        contentLength: html.length,
        contentId: data.content_id
      });

      return html;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(`API request timeout after ${this.timeoutMs}ms`);
      }

      throw new ApiError(
        `Failed to fetch from gov.uk API: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }
}
