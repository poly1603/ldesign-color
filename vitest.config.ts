/**
 * Vitest Configuration for @ldesign/color
 */

import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        'dist/',
        'es/',
        'lib/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/benchmarks/**',
        '**/examples/**',
      ],
      include: ['src/**/*.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    include: ['__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'es', 'lib'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
