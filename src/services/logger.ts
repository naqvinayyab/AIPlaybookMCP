/**
 * Structured JSON Logging Service
 *
 * Feature: 002-dynamic-api-content
 * Uses @toolprint/mcp-logger for MCP-aware stderr-only logging
 */

import { createLogger } from '@toolprint/mcp-logger';

/**
 * Log levels supported by the logger
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Contextual metadata for log entries
 */
export interface LogContext {
  operation?: string;
  error?: string;
  cacheStatus?: string;
  url?: string;
  attempt?: number;
  delay?: number;
  duration?: number;
  filename?: string;
  [key: string]: unknown;
}

/**
 * Get log level from environment variable or default to 'info'
 */
function getLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel === 'error' || envLevel === 'warn' || envLevel === 'info' || envLevel === 'debug') {
    return envLevel;
  }
  return 'info';
}

/**
 * Create MCP-aware logger instance
 * All logs go to stderr to avoid polluting stdout (MCP protocol requirement)
 */
const loggerPromise = createLogger({
  level: getLogLevel()
});

/**
 * Log error with contextual metadata
 */
export async function logError(message: string, context?: LogContext): Promise<void> {
  const logger = await loggerPromise;
  logger.error(context || {}, message);
}

/**
 * Log warning with contextual metadata
 */
export async function logWarn(message: string, context?: LogContext): Promise<void> {
  const logger = await loggerPromise;
  logger.warn(context || {}, message);
}

/**
 * Log info with contextual metadata
 */
export async function logInfo(message: string, context?: LogContext): Promise<void> {
  const logger = await loggerPromise;
  logger.info(context || {}, message);
}

/**
 * Log debug with contextual metadata
 */
export async function logDebug(message: string, context?: LogContext): Promise<void> {
  const logger = await loggerPromise;
  logger.debug(context || {}, message);
}
