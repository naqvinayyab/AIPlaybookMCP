/**
 * CLI Arguments Parser (T040)
 *
 * Feature: 002-dynamic-api-content
 * Parses command-line arguments for --local flag
 */

/**
 * Parsed CLI arguments
 */
export interface CliArgs {
  useLocalCache: boolean;
}

/**
 * List of recognized flags
 */
const RECOGNIZED_FLAGS = new Set(['--local']);

/**
 * Parses command-line arguments
 *
 * @returns Parsed CLI arguments
 * @note Unknown flags are silently ignored (for test framework compatibility)
 */
export function parseCliArgs(): CliArgs {
  // process.argv[0] is node executable
  // process.argv[1] is script path
  // Everything from index 2 onwards is actual arguments
  const args = process.argv.slice(2);

  let useLocalCache = false;

  for (const arg of args) {
    // Check if it's a recognized flag
    if (RECOGNIZED_FLAGS.has(arg)) {
      if (arg === '--local') {
        useLocalCache = true;
      }
    }
    // Unknown flags are silently ignored to allow test frameworks
    // and other tooling to pass their own flags
  }

  return {
    useLocalCache
  };
}
