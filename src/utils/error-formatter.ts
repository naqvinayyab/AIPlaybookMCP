/**
 * Error Formatting Utility
 *
 * Feature: 002-dynamic-api-content
 * Provides consistent error message formatting across the application
 */

/**
 * Formats an unknown error value into a string message
 *
 * @param error - The error to format (can be Error, string, or any other value)
 * @returns A formatted error message string
 *
 * @example
 * ```typescript
 * try {
 *   // ...
 * } catch (error) {
 *   const message = formatErrorMessage(error);
 *   console.error('Operation failed:', message);
 * }
 * ```
 */
export function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
