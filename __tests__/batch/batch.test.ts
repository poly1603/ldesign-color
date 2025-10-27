/**
 * @ldesign/color - Batch Processing Tests
 *
 * Tests for batch color processing functions
 */

import { describe, expect, it } from 'vitest'
import {
  batchConvert,
  batchManipulate,
  ColorStreamProcessor,
  countColors,
  groupColors,
} from '../../src/batch'
import { Color } from '../../src/core/Color'

describe('batch Processing', () => {
  describe('batchConvert', () => {
    it('should convert array of colors', async () => {
      const inputs = ['#ff0000', '#00ff00', '#0000ff']
      const results = await batchConvert(inputs, 'hex')

      expect(results).toHaveLength(3)
      results.forEach((hex) => {
        expect(hex).toMatch(/^#[0-9A-F]{6}$/)
      })
    })

    it('should support progress callback', async () => {
      const inputs = Array.from({ length: 100 }, (_, i) => `#${i.toString(16).padStart(6, '0')}`)
      let progressCalls = 0

      await batchConvert(inputs, 'hex', {
        chunkSize: 10,
        onProgress: (done, total) => {
          progressCalls++
          expect(done).toBeLessThanOrEqual(total)
        },
      })

      expect(progressCalls).toBeGreaterThan(0)
    })

    it('should handle large batches', async () => {
      const inputs = Array.from({ length: 1000 }, () => Color.random().toHex())
      const results = await batchConvert(inputs, 'rgb')

      expect(results).toHaveLength(1000)
    })
  })

  describe('batchManipulate', () => {
    it('should apply single operation', async () => {
      const inputs = ['#808080', '#808080', '#808080']
      const results = await batchManipulate(inputs, [
        { type: 'lighten', amount: 20 },
      ])

      expect(results).toHaveLength(3)
      results.forEach((color) => {
        expect(color.lightness).toBeGreaterThan(50)
      })
    })

    it('should apply multiple operations', async () => {
      const inputs = ['#3498db']
      const results = await batchManipulate(inputs, [
        { type: 'lighten', amount: 10 },
        { type: 'saturate', amount: 10 },
        { type: 'rotate', degrees: 30 },
      ])

      expect(results).toHaveLength(1)
      const result = results[0]

      expect(result.lightness).toBeGreaterThan(53)
      expect(result.saturation).toBeGreaterThan(70)
    })

    it('should support all operation types', async () => {
      const input = '#3498db'

      const operations = [
        { type: 'lighten' as const, amount: 10 },
        { type: 'darken' as const, amount: 10 },
        { type: 'saturate' as const, amount: 10 },
        { type: 'desaturate' as const, amount: 10 },
        { type: 'rotate' as const, degrees: 30 },
        { type: 'setAlpha' as const, value: 0.5 },
        { type: 'grayscale' as const },
        { type: 'invert' as const },
      ]

      for (const op of operations) {
        const result = await batchManipulate([input], [op])
        expect(result).toHaveLength(1)
      }
    })
  })

  describe('colorStreamProcessor', () => {
    it('should process colors as stream', async () => {
      const inputs = ['#ff0000', '#00ff00', '#0000ff']
      const processor = new ColorStreamProcessor()

      const results: string[] = []
      for await (const hex of processor.process(inputs, color => color.toHex())) {
        results.push(hex)
      }

      expect(results).toHaveLength(3)
    })

    it('should track statistics', async () => {
      const inputs = ['#ff0000', '#00ff00', '#0000ff']
      const processor = new ColorStreamProcessor()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const hex of processor.process(inputs, color => color.toHex())) {
        // Process
      }

      const stats = processor.getStats()
      expect(stats.processed).toBe(3)
      expect(stats.errors).toBe(0)
    })

    it('should handle errors gracefully', async () => {
      const inputs = ['#ff0000', 'invalid', '#0000ff']
      const processor = new ColorStreamProcessor()

      const errors: Error[] = []
      const results: string[] = []

      for await (const hex of processor.process(
        inputs,
        color => color.toHex(),
        {
          onError: error => errors.push(error),
        },
      )) {
        results.push(hex)
      }

      expect(results.length).toBeLessThan(inputs.length)
      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('countColors', () => {
    it('should count colors matching predicate', async () => {
      const colors = [
        '#ffffff', // Light
        '#000000', // Dark
        '#808080', // Light
        '#333333', // Dark
      ]

      const count = await countColors(colors, c => c.isLight())
      expect(count).toBe(2)
    })
  })

  describe('groupColors', () => {
    it('should group colors by criteria', async () => {
      const colors = [
        '#ffffff',
        '#000000',
        '#f0f0f0',
        '#101010',
      ]

      const grouped = await groupColors(colors, c =>
        c.isLight() ? 'light' : 'dark')

      expect(grouped.has('light')).toBe(true)
      expect(grouped.has('dark')).toBe(true)
      expect(grouped.get('light')!.length).toBeGreaterThan(0)
      expect(grouped.get('dark')!.length).toBeGreaterThan(0)
    })
  })
})
