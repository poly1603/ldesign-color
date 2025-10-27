/**
 * @ldesign/color - Harmony Tests
 *
 * Tests for color harmony generation and scoring
 */

import { describe, expect, it } from 'vitest'
import { Color } from '../../src/core/Color'
import {
  findBestHarmony,
  generateHarmony,
  generateNatureHarmony,
  optimizeHarmony,
} from '../../src/harmony'

describe('color Harmony', () => {
  const baseColor = '#3498db'

  describe('generateHarmony', () => {
    it('should generate monochromatic harmony', () => {
      const harmony = generateHarmony(baseColor, {
        type: 'monochromatic',
        count: 5,
      })

      expect(harmony.type).toBe('monochromatic')
      expect(harmony.colors).toHaveLength(5)
      expect(harmony.score).toBeGreaterThanOrEqual(0)
      expect(harmony.score).toBeLessThanOrEqual(100)
    })

    it('should generate triadic harmony', () => {
      const harmony = generateHarmony(baseColor, { type: 'triadic' })

      expect(harmony.type).toBe('triadic')
      expect(harmony.colors).toHaveLength(3)

      // Hues should be ~120° apart
      const hues = harmony.colors.map(c => c.hue)
      // Check approximate 120° spacing
      const diff1 = Math.abs(hues[1] - hues[0])
      expect(Math.abs(diff1 - 120)).toBeLessThan(5)
    })

    it('should generate complementary harmony', () => {
      const harmony = generateHarmony(baseColor, { type: 'complementary' })

      expect(harmony.type).toBe('complementary')
      expect(harmony.colors).toHaveLength(2)

      // Hues should be ~180° apart
      const hueDiff = Math.abs(harmony.colors[1].hue - harmony.colors[0].hue)
      expect(Math.abs(hueDiff - 180)).toBeLessThan(5)
    })

    it('should include metrics', () => {
      const harmony = generateHarmony(baseColor, { type: 'triadic' })

      expect(harmony.metrics).toBeDefined()
      expect(harmony.metrics.colorBalance).toBeGreaterThanOrEqual(0)
      expect(harmony.metrics.contrastRange).toBeGreaterThanOrEqual(0)
      expect(harmony.metrics.saturationHarmony).toBeGreaterThanOrEqual(0)
      expect(harmony.metrics.lightnessHarmony).toBeGreaterThanOrEqual(0)
      expect(harmony.metrics.hueRelation).toBeGreaterThanOrEqual(0)
    })

    it('should provide suggestions for low scores', () => {
      const harmony = generateHarmony(baseColor, { type: 'triadic' })

      if (harmony.score < 80) {
        expect(harmony.suggestions).toBeDefined()
        expect(Array.isArray(harmony.suggestions)).toBe(true)
      }
    })
  })

  describe('generateNatureHarmony', () => {
    const themes = ['forest', 'ocean', 'sunset', 'earth', 'sky'] as const

    themes.forEach((theme) => {
      it(`should generate ${theme} harmony`, () => {
        const harmony = generateNatureHarmony(baseColor, theme)

        expect(harmony.colors.length).toBeGreaterThan(0)
        expect(harmony.baseColor).toBeDefined()
        expect(harmony.score).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('optimizeHarmony', () => {
    it('should attempt to improve harmony score', () => {
      const base = new Color(baseColor)
      const colors = [
        new Color('#ff0000'),
        new Color('#00ff00'),
        new Color('#0000ff'),
      ]

      const optimized = optimizeHarmony(colors, base, 85)

      expect(optimized).toHaveLength(colors.length)
      expect(optimized[0]).toBe(colors[0]) // Base color preserved
    })
  })

  describe('findBestHarmony', () => {
    it('should find harmony type with highest score', () => {
      const best = findBestHarmony(baseColor)

      expect(best).toBeDefined()
      expect(best.type).toBeDefined()
      expect(best.score).toBeGreaterThanOrEqual(0)
      expect(best.colors.length).toBeGreaterThan(0)
    })

    it('should return highest scoring harmony', () => {
      const best = findBestHarmony(baseColor)

      // Score should be reasonable
      expect(best.score).toBeGreaterThan(0)
    })
  })

  describe('harmony Scoring', () => {
    it('should score perfect harmonies highly', () => {
      // Complementary should score well
      const complementary = generateHarmony(baseColor, { type: 'complementary' })
      expect(complementary.score).toBeGreaterThan(60)
    })

    it('should score based on multiple metrics', () => {
      const harmony = generateHarmony(baseColor, { type: 'triadic' })

      const metrics = harmony.metrics
      expect(metrics.colorBalance).toBeGreaterThanOrEqual(0)
      expect(metrics.colorBalance).toBeLessThanOrEqual(100)
    })
  })
})
