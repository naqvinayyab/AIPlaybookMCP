/**
 * Global test setup file
 * Runs before all tests to configure the testing environment
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test configuration
beforeAll(() => {
  // Set test environment variables if needed
  process.env.NODE_ENV = 'test';

  // Any global setup that needs to run once before all tests
  console.log('🧪 Test suite starting...');
});

afterAll(() => {
  // Global cleanup after all tests complete
  console.log('✅ Test suite complete');
});

beforeEach(() => {
  // Reset state before each test to ensure isolation (FR-014)
  // This runs automatically due to mockReset: true in vitest.config.ts
});

afterEach(() => {
  // Cleanup after each test
  // Mocks are automatically restored due to restoreMocks: true
});

// Export helper functions for test files
export function getTestTimeout(): number {
  return 5000; // 5 seconds per test (matches vitest.config.ts)
}
