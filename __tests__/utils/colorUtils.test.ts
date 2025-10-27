/**
 * @ldesign/color - Color Utils Tests
 *
 * Tests for advanced color utility functions
 */

import { describe, expect, it } from 'vitest'
import { Color } from '../../src/core/Color'
import {
  clusterColors,
  deduplicateColors,
  filterColors,
  findNearestColor,
  findNearestColors,
  getColorStatistics,
  sortColors,
} from '../../src/utils/colorUtils'

describe('color Utilities', () => {
  describe('sortColors', () => {
    it('should sort by hue', () => {
      const colors = [
        new Color('#ff0000'), // Red (0°)
        new Color('#0000ff'), // Blue (240°)
        new Color('#00ff00'), // Green (120°)
      ]

      const sorted = sortColors(colors, 'hue')
      expect(sorted[0].hue).toBeLessThan(sorted[1].hue)
      expect(sorted[1].hue).toBeLessThan(sorted[2].hue)
    })

    it('should sort by saturation', () => {
      const colors = [
        new Color({ h: 0, s: 100, l: 50 }),
        new Color({ h: 0, s: 50, l: 50 }),
        new Color({ h: 0, s: 75, l: 50 }),
      ]

      const sorted = sortColors(colors, 'saturation')
      expect(sorted[0].saturation).toBeLessThan(sorted[1].saturation)
    })

    it('should sort by lightness', () => {
      const colors = [
        new Color({ h: 0, s: 50, l: 80 }),
        new Color({ h: 0, s: 50, l: 20 }),
        new Color({ h: 0, s: 50, l: 50 }),
      ]

      const sorted = sortColors(colors, 'lightness')
      expect(sorted[0].lightness).toBeLessThan(sorted[2].lightness)
    })

    it('should sort by luminance', () => {
      const white = new Color('#ffffff')
      const black = new Color('#000000')
      const gray = new Color('#808080')

      const sorted = sortColors([white, black, gray], 'luminance')
      expect(sorted[0]).toBe(black)
      expect(sorted[2]).toBe(white)
    })

    it('should support descending order', () => {
      const colors = [
        new Color('#ff0000'),
        new Color('#00ff00'),
        new Color('#0000ff'),
      ]

      const desc = sortColors(colors, 'hue', true)
      expect(desc[0].hue).toBeGreaterThan(desc[desc.length - 1].hue)
    })
  })

  describe('findNearestColor', () => {
    const palette = [
      new Color('#ff0000'),
      new Color('#00ff00'),
      new Color('#0000ff'),
    ]

    it('should find nearest color (euclidean)', () => {
      const target = new Color('#ff1111')
      const nearest = findNearestColor(target, palette, 'euclidean')
      expect(nearest?.toHex()).toBe('#FF0000')
    })

    it('should find nearest color (deltaEOKLAB)', () => {
      const target = new Color('#0011ff')
      const nearest = findNearestColor(target, palette, 'deltaEOKLAB')
      expect(nearest?.toHex()).toBe('#0000FF')
    })

    it('should return null for empty palette', () => {
      const target = new Color('#ff0000')
      const nearest = findNearestColor(target, [], 'euclidean')
      expect(nearest).toBeNull()
    })
  })

  describe('findNearestColors', () => {
    const palette = [
      new Color('#ff0000'),
      new Color('#ff1111'),
      new Color('#00ff00'),
      new Color('#0000ff'),
      new Color('#0011ff'),
    ]

    it('should find top N nearest colors', () => {
      const target = new Color('#ff0000')
      const nearest = findNearestColors(target, palette, 3, 'euclidean')

      expect(nearest).toHaveLength(3)
      // First should be exact match or very close
      expect(nearest[0].toHex()).toBe('#FF0000')
    })

    it('should handle N larger than palette size', () => {
      const target = new Color('#ff0000')
      const nearest = findNearestColors(target, palette, 10)
      expect(nearest).toHaveLength(palette.length)
    })
  })

  describe('clusterColors', () => {
    it('should cluster colors using K-means', () => {
      const colors = [
        // Red cluster
        new Color('#ff0000'),
        new Color('#ff1111'),
        new Color('#ee0000'),
        // Green cluster
        new Color('#00ff00'),
        new Color('#11ff11'),
        new Color('#00ee00'),
      ]

      const result = clusterColors(colors, 2)

      expect(result.centers).toHaveLength(2)
      expect(result.assignments).toHaveLength(colors.length)
      expect(result.inertia).toBeGreaterThanOrEqual(0)
    })

    it('should handle k >= color count', () => {
      const colors = [new Color('#ff0000'), new Color('#00ff00')]
      const result = clusterColors(colors, 5)

      expect(result.centers).toHaveLength(2)
    })

    it('should handle empty array', () => {
      const result = clusterColors([], 3)
      expect(result.centers).toHaveLength(0)
    })
  })

  describe('filterColors', () => {
    const colors = [
      new Color({ h: 0, s: 80, l: 50 }), // High sat
      new Color({ h: 0, s: 20, l: 50 }), // Low sat
      new Color({ h: 120, s: 50, l: 30 }), // Dark
      new Color({ h: 120, s: 50, l: 70 }), // Light
    ]

    it('should filter by saturation', () => {
      const vibrant = filterColors(colors, { minSaturation: 50 })
      expect(vibrant.length).toBeLessThan(colors.length)
      vibrant.forEach(c => expect(c.saturation).toBeGreaterThanOrEqual(50))
    })

    it('should filter by lightness range', () => {
      const midtones = filterColors(colors, {
        minLightness: 40,
        maxLightness: 60,
      })

      midtones.forEach((c) => {
        expect(c.lightness).toBeGreaterThanOrEqual(40)
        expect(c.lightness).toBeLessThanOrEqual(60)
      })
    })

    it('should filter by hue range', () => {
      const greens = filterColors(colors, {
        minHue: 100,
        maxHue: 140,
      })

      greens.forEach((c) => {
        expect(c.hue).toBeGreaterThanOrEqual(100)
        expect(c.hue).toBeLessThanOrEqual(140)
      })
    })
  })

  describe('deduplicateColors', () => {
    it('should remove duplicate colors', () => {
      const colors = [
        new Color('#ff0000'),
        new Color('#ff0001'), // Almost same
        new Color('#ff0000'), // Exact duplicate
        new Color('#00ff00'),
      ]

      const unique = deduplicateColors(colors, 2)
      expect(unique.length).toBeLessThan(colors.length)
    })

    it('should keep all if threshold is 0', () => {
      const colors = [
        new Color('#ff0000'),
        new Color('#ff0001'),
        new Color('#ff0002'),
      ]

      const unique = deduplicateColors(colors, 0)
      expect(unique.length).toBe(colors.length)
    })
  })

  describe('getColorStatistics', () => {
    it('should calculate color statistics', () => {
      const colors = [
        new Color({ h: 0, s: 80, l: 50 }),
        new Color({ h: 120, s: 60, l: 40 }),
        new Color({ h: 240, s: 70, l: 60 }),
      ]

      const stats = getColorStatistics(colors)

      expect(stats.count).toBe(3)
      expect(stats.averageHue).toBeGreaterThanOrEqual(0)
      expect(stats.averageSaturation).toBeGreaterThanOrEqual(0)
      expect(stats.averageLightness).toBeGreaterThanOrEqual(0)
      expect(stats.hueDiversity).toBeGreaterThanOrEqual(0)
      expect(stats.saturationRange).toHaveLength(2)
      expect(stats.lightnessRange).toHaveLength(2)
    })

    it('should handle empty array', () => {
      const stats = getColorStatistics([])
      expect(stats.count).toBe(0)
      expect(stats.averageHue).toBe(0)
    })
  })
})
