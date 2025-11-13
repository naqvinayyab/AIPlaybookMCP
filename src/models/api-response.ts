/**
 * gov.uk API Response Types
 *
 * Feature: 002-dynamic-api-content
 */

/**
 * Response from gov.uk Content API
 * Source: https://www.gov.uk/api/content/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html
 */
export interface GovUkApiResponse {
  analytics_identifier: string | null;
  base_path: string;
  content_id: string;
  description: string | null;
  details: {
    /** HTML content as string */
    body: string;
    [key: string]: unknown;
  };
  document_type: string;
  first_published_at: string;
  locale: string;
  [key: string]: unknown;
}

/**
 * Validates that a GovUkApiResponse has required fields
 */
export function isValidGovUkApiResponse(obj: unknown): obj is GovUkApiResponse {
  if (typeof obj !== 'object' || obj === null) return false;
  const response = obj as Partial<GovUkApiResponse>;

  return (
    typeof response.content_id === 'string' &&
    typeof response.details === 'object' &&
    response.details !== null &&
    typeof (response.details as { body?: unknown }).body === 'string' &&
    (response.details as { body: string }).body.length > 0
  );
}
