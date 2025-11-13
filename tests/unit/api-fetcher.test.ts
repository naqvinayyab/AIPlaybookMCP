/**
 * API Fetcher Unit Tests (T019)
 *
 * Feature: 002-dynamic-api-content
 * Tests API client with retry logic and timeout handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RETRY_CONFIG, API_TIMEOUT_MS, MAX_RESPONSE_SIZE_MB, GOV_UK_API_URL } from '../../src/config/constants.js';
import { ApiClient, ApiError } from '../../src/services/api-fetcher.js';

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully fetch HTML content from gov.uk API', async () => {
    // Mock successful fetch
    const mockHtmlContent = '<div><h2 id="test">Test Content</h2></div>';
    const mockResponse = {
      details: {
        body: mockHtmlContent
      },
      content_id: 'test-id'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      headers: {
        get: vi.fn().mockReturnValue(null)
      }
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS);
    const result = await client.fetchContent();

    expect(result).toBe(mockHtmlContent);
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  it('should retry 7 times with exponential backoff before failing', async () => {
    let attemptCount = 0;

    global.fetch = vi.fn().mockImplementation(async () => {
      attemptCount++;
      throw new Error('Network error');
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 7, [10, 20, 30, 40, 50, 60, 70]);

    // Should reject after all retries
    try {
      await client.fetchContent();
      expect.fail('Should have thrown ApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as Error).message).toContain('Failed to fetch from gov.uk API after 7 attempts');
    }

    expect(attemptCount).toBe(7);
  }, 10000);

  it('should succeed on retry attempt', async () => {
    let attemptCount = 0;
    const mockHtmlContent = '<div>Success after retry</div>';

    global.fetch = vi.fn().mockImplementation(async () => {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error('Network error');
      }
      return {
        ok: true,
        json: async () => ({
          details: { body: mockHtmlContent },
          content_id: 'test-id'
        }),
        headers: {
          get: vi.fn().mockReturnValue(null)
        }
      };
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 7, [10, 20]);

    const result = await client.fetchContent();
    expect(result).toBe(mockHtmlContent);
    expect(attemptCount).toBe(3);
  }, 5000);

  it('should verify retry configuration (7 attempts, exponential backoff)', async () => {
    expect(RETRY_CONFIG.maxAttempts).toBe(7);
    expect(RETRY_CONFIG.delays).toEqual([1000, 2000, 4000, 8000, 16000, 32000, 64000]);
  });

  it('should throw ApiError on non-200 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 1);

    await expect(client.fetchContent()).rejects.toThrow(ApiError);
    await expect(client.fetchContent()).rejects.toThrow('500');
  });

  it('should enforce 5MB size limit via content-length header', async () => {
    const oversizeLength = (MAX_RESPONSE_SIZE_MB + 1) * 1024 * 1024;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue(oversizeLength.toString())
      }
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 1);

    await expect(client.fetchContent()).rejects.toThrow(ApiError);
    await expect(client.fetchContent()).rejects.toThrow('exceeds maximum allowed');
  });

  it('should enforce 5MB size limit on actual HTML content', async () => {
    // Create HTML larger than 5MB
    const largeHtml = 'x'.repeat((MAX_RESPONSE_SIZE_MB + 1) * 1024 * 1024);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        details: { body: largeHtml },
        content_id: 'test-id'
      }),
      headers: {
        get: vi.fn().mockReturnValue(null)
      }
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 1);

    await expect(client.fetchContent()).rejects.toThrow(ApiError);
    await expect(client.fetchContent()).rejects.toThrow('exceeds maximum allowed');
  });

  it('should extract HTML from response.details.body', async () => {
    const mockHtmlContent = '<div>Extracted Content</div>';
    const mockResponse = {
      details: {
        body: mockHtmlContent
      },
      content_id: 'test-id'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
      headers: {
        get: vi.fn().mockReturnValue(null)
      }
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS);
    const result = await client.fetchContent();

    expect(result).toBe(mockHtmlContent);
  });

  it('should throw ApiError on invalid response structure', async () => {
    const invalidResponse = {
      // Missing details.body
      content_id: 'test-id'
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => invalidResponse,
      headers: {
        get: vi.fn().mockReturnValue(null)
      }
    });

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 1);

    await expect(client.fetchContent()).rejects.toThrow(ApiError);
    await expect(client.fetchContent()).rejects.toThrow('Invalid API response');
  });

  it('should throw ApiError on network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const client = new ApiClient(GOV_UK_API_URL, API_TIMEOUT_MS, 1);

    await expect(client.fetchContent()).rejects.toThrow(ApiError);
    await expect(client.fetchContent()).rejects.toThrow('Failed to fetch from gov.uk API after 1 attempts');
  });
});
