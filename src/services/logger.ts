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

// Initialize logger synchronously at module load
let loggerInstance: Awaited<ReturnType<typeof createLogger>> | null = null;

loggerPromise
  .then(logger => {
    loggerInstance = logger;
  })
  .catch(err => {
    console.error('Failed to initialize logger:', err);
  });

/**
 * Log error with contextual metadata
 * Synchronous wrapper with fallback to console.error if logger not initialized
 */
export function logError(message: string, context?: LogContext): void {
  if (loggerInstance) {
    loggerInstance.error(context ?? {}, message);
  } else {
    console.error(`[ERROR] ${message}`, context);
  }
}

/**
 * Log warning with contextual metadata
 * Synchronous wrapper with fallback to console.warn if logger not initialized
 */
export function logWarn(message: string, context?: LogContext): void {
  if (loggerInstance) {
    loggerInstance.warn(context ?? {}, message);
  } else {
    console.warn(`[WARN] ${message}`, context);
  }
}

/**
 * Log info with contextual metadata
 * Synchronous wrapper with fallback to console.log if logger not initialized
 */
export function logInfo(message: string, context?: LogContext): void {
  if (loggerInstance) {
    loggerInstance.info(context ?? {}, message);
  } else {
    console.error(`[INFO] ${message}`, context);
  }
}

/**
 * Log debug with contextual metadata
 * Synchronous wrapper with fallback to console.log if logger not initialized
 */
export function logDebug(message: string, context?: LogContext): void {
  if (loggerInstance) {
    loggerInstance.debug(context ?? {}, message);
  } else {
    console.error(`[DEBUG] ${message}`, context);
  }
}
