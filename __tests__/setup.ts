/**
 * @ldesign/color - Test Setup
 *
 * Global test setup and utilities
 */

import { afterEach } from 'vitest'
import { Color } from '../packages/core/src/core/Color'
import { poolManager } from '../packages/core/src/utils/objectPool'

// Global cleanup after each test
afterEach(() => {
  // Cleanup color resources
  Color.cleanup()

  // Clear all pools
  poolManager.clearAll()
})

// Custom matchers for color testing
expect.extend({
  toBeValidHex: (received: string) => {
    const pass = /^#[0-9A-F]{6}$/i.test(received)
    return {
      pass,
      message: () => `expected ${received} to be a valid hex color`,
    }
  },

  toBeCloseToColor: (received: Color, expected: Color, tolerance = 5) => {
    const distance = received.distance(expected)
    const pass = distance <= tolerance

    return {
      pass,
      message: () => `expected ${received.toHex()} to be close to ${expected.toHex()} (distance: ${distance})`,
    }
  },

  toHaveHighContrast: (foreground: Color, background: Color, minRatio = 4.5) => {
    const contrast = foreground.contrast(background)
    const pass = contrast >= minRatio

    return {
      pass,
      message: () => `expected contrast ${contrast} to be >= ${minRatio}`,
    }
  },
})

// Type augmentation for custom matchers
declare module 'vitest' {
  interface Assertion {
    toBeValidHex: () => void
    toBeCloseToColor: (expected: Color, tolerance?: number) => void
    toHaveHighContrast: (background: Color, minRatio?: number) => void
  }
}
