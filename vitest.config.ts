import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable global test APIs (describe, it, expect)
    globals: true,

    // Node environment for server-side testing
    environment: 'node',

    // Test file patterns
    include: ['tests/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],

    // Exclude patterns
    exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],

    // No automatic retries (strict reliability per clarification)
    retry: 0,

    // Test timeout (5 seconds per test)
    testTimeout: 5000,

    // Global setup file
    setupFiles: ['tests/setup.ts'],

    // Reset mocks between tests (ensures isolation per FR-014)
    mockReset: true,

    // Restore original implementations after tests
    restoreMocks: true,
  },

  coverage: {
    // V8 coverage provider (fast, native ES modules support)
    provider: 'v8',

    // Enable coverage collection
    enabled: true,

    // Coverage report formats
    reporter: ['text', 'html', 'json-summary'],

    // Source files to include in coverage
    include: ['src/**/*.ts'],

    // Files to exclude from coverage
    exclude: [
      'src/**/__tests__/**',
      'src/**/*.test.ts',
      '**/*.d.ts',
      '**/node_modules/**',
    ],

    // Coverage thresholds (starting at 70%, will increase to 80%)
    thresholds: {
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },

    // Clean coverage directory before running
    clean: true,

    // Coverage reports directory
    reportsDirectory: './coverage',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
});
