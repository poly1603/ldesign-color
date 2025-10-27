/**
 * @ldesign/color - Color Class Tests
 *
 * Comprehensive tests for the core Color class
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Color } from '../../src/core/Color'

describe('color Class', () => {
  afterEach(() => {
    // Cleanup after each test
    Color.cleanup()
  })

  describe('construction', () => {
    it('should create color from hex string', () => {
      const color = new Color('#3498db')
      expect(color.toHex()).toBe('#3498DB')
    })

    it('should create color from RGB object', () => {
      const color = new Color({ r: 52, g: 152, b: 219 })
      expect(color.red).toBe(52)
      expect(color.green).toBe(152)
      expect(color.blue).toBe(219)
    })

    it('should create color from HSL object', () => {
      const color = new Color({ h: 204, s: 70, l: 53 })
      expect(color.hue).toBeCloseTo(204, 0)
    })

    it('should handle 3-char hex', () => {
      const color = new Color('#fff')
      expect(color.toHex()).toBe('#FFFFFF')
    })

    it('should handle 8-char hex with alpha', () => {
      const color = new Color('#3498db80')
      expect(color.alpha).toBeCloseTo(0.5, 1)
    })

    it('should create from static factory methods', () => {
      const fromRGB = Color.fromRGB(255, 0, 0)
      expect(fromRGB.toHex()).toBe('#FF0000')

      const fromHSL = Color.fromHSL(0, 100, 50)
      expect(fromHSL.toHex()).toBe('#FF0000')

      const fromHSV = Color.fromHSV(0, 100, 100)
      expect(fromHSV.toHex()).toBe('#FF0000')
    })

    it('should create random color', () => {
      const color = Color.random()
      expect(color.red).toBeGreaterThanOrEqual(0)
      expect(color.red).toBeLessThanOrEqual(255)
      expect(color.isValid()).toBe(true)
    })
  })

  describe('getters', () => {
    it('should get RGB channels', () => {
      const color = new Color('#3498db')
      expect(color.red).toBe(52)
      expect(color.green).toBe(152)
      expect(color.blue).toBe(219)
      expect(color.alpha).toBe(1)
    })

    it('should get HSL values', () => {
      const color = new Color('#3498db')
      expect(color.hue).toBeCloseTo(204, 0)
      expect(color.saturation).toBeCloseTo(70, 0)
      expect(color.lightness).toBeCloseTo(53, 0)
    })
  })

  describe('conversions', () => {
    let color: Color

    beforeEach(() => {
      color = new Color('#3498db')
    })

    it('should convert to hex', () => {
      expect(color.toHex()).toBe('#3498DB')
      expect(color.toHex(true)).toBe('#3498DBFF')
    })

    it('should convert to RGB object', () => {
      const rgb = color.toRGB()
      expect(rgb.r).toBe(52)
      expect(rgb.g).toBe(152)
      expect(rgb.b).toBe(219)
    })

    it('should convert to RGB tuple (direct)', () => {
      const [r, g, b, a] = color.toRGBDirect()
      expect(r).toBe(52)
      expect(g).toBe(152)
      expect(b).toBe(219)
      expect(a).toBe(1)
    })

    it('should convert to RGB string', () => {
      expect(color.toRGBString()).toBe('rgb(52, 152, 219)')

      const withAlpha = new Color('rgba(52, 152, 219, 0.5)')
      expect(withAlpha.toRGBString()).toBe('rgba(52, 152, 219, 0.5)')
    })

    it('should convert to HSL object', () => {
      const hsl = color.toHSL()
      expect(hsl.h).toBeCloseTo(204, 0)
      expect(hsl.s).toBeCloseTo(70, 0)
      expect(hsl.l).toBeCloseTo(53, 0)
    })

    it('should convert to HSL string', () => {
      const hslStr = color.toHSLString()
      expect(hslStr).toMatch(/^hsl\(/)
    })

    it('should convert to HSV object', () => {
      const hsv = color.toHSV()
      expect(hsv.h).toBeCloseTo(204, 0)
      expect(hsv.s).toBeGreaterThan(0)
      expect(hsv.v).toBeGreaterThan(0)
    })
  })

  describe('manipulations', () => {
    let color: Color

    beforeEach(() => {
      color = new Color('#3498db')
    })

    it('should lighten color', () => {
      const lighter = color.lighten(20)
      expect(lighter.lightness).toBeGreaterThan(color.lightness)
    })

    it('should darken color', () => {
      const darker = color.darken(20)
      expect(darker.lightness).toBeLessThan(color.lightness)
    })

    it('should saturate color', () => {
      const saturated = color.saturate(20)
      expect(saturated.saturation).toBeGreaterThan(color.saturation)
    })

    it('should desaturate color', () => {
      const desaturated = color.desaturate(20)
      expect(desaturated.saturation).toBeLessThan(color.saturation)
    })

    it('should rotate hue', () => {
      const rotated = color.rotate(180)
      expect(Math.abs(rotated.hue - color.hue - 180)).toBeLessThan(1)
    })

    it('should convert to grayscale', () => {
      const gray = color.grayscale()
      expect(gray.saturation).toBe(0)
    })

    it('should invert color', () => {
      const inverted = color.invert()
      expect(inverted.red).toBe(255 - color.red)
      expect(inverted.green).toBe(255 - color.green)
      expect(inverted.blue).toBe(255 - color.blue)
    })

    it('should set alpha', () => {
      const transparent = color.setAlpha(0.5)
      expect(transparent.alpha).toBe(0.5)
    })

    it('should fade color', () => {
      const faded = color.fade(50)
      expect(faded.alpha).toBeLessThan(color.alpha)
    })

    it('should mix colors', () => {
      const red = new Color('#ff0000')
      const mixed = color.mix(red, 50)
      // Mixed color should be between blue and red
      expect(mixed.red).toBeGreaterThan(color.red)
      expect(mixed.blue).toBeLessThan(color.blue)
    })
  })

  describe('analysis', () => {
    it('should calculate luminance', () => {
      const white = new Color('#ffffff')
      expect(white.getLuminance()).toBeCloseTo(1, 1)

      const black = new Color('#000000')
      expect(black.getLuminance()).toBeCloseTo(0, 1)
    })

    it('should calculate contrast', () => {
      const white = new Color('#ffffff')
      const black = new Color('#000000')
      const contrast = white.contrast(black)
      expect(contrast).toBeCloseTo(21, 0)
    })

    it('should check if color is light', () => {
      const white = new Color('#ffffff')
      expect(white.isLight()).toBe(true)

      const black = new Color('#000000')
      expect(black.isLight()).toBe(false)
    })

    it('should check if color is dark', () => {
      const white = new Color('#ffffff')
      expect(white.isDark()).toBe(false)

      const black = new Color('#000000')
      expect(black.isDark()).toBe(true)
    })

    it('should check WCAG compliance', () => {
      const white = new Color('#ffffff')
      const black = new Color('#000000')
      expect(white.isWCAGCompliant(black, 'AA', 'normal')).toBe(true)
      expect(white.isWCAGCompliant(black, 'AAA', 'normal')).toBe(true)
    })
  })

  describe('harmony', () => {
    let color: Color

    beforeEach(() => {
      color = new Color('#3498db')
    })

    it('should generate complementary color', () => {
      const complement = color.complementary()
      const hueDiff = Math.abs(complement.hue - color.hue)
      expect(hueDiff).toBeCloseTo(180, 0)
    })

    it('should generate analogous colors', () => {
      const [left, right] = color.analogous(30)
      expect(left.hue).toBeCloseTo(color.hue - 30, 0)
      expect(right.hue).toBeCloseTo(color.hue + 30, 0)
    })

    it('should generate triadic colors', () => {
      const [c1, c2] = color.triadic()
      expect(c1.hue).toBeCloseTo((color.hue + 120) % 360, 0)
      expect(c2.hue).toBeCloseTo((color.hue + 240) % 360, 0)
    })

    it('should generate tetradic colors', () => {
      const [c1, c2, c3] = color.tetradic()
      expect(c1.hue).toBeCloseTo((color.hue + 90) % 360, 0)
    })

    it('should generate split complementary', () => {
      const [c1, c2] = color.splitComplementary()
      expect(c1).toBeDefined()
      expect(c2).toBeDefined()
    })

    it('should generate harmony by type', () => {
      const triadic = color.harmony('triadic')
      expect(triadic).toHaveLength(3)

      const mono = color.harmony('monochromatic')
      expect(mono).toHaveLength(5)
    })
  })

  describe('utilities', () => {
    it('should clone color', () => {
      const color = new Color('#3498db')
      const cloned = color.clone()

      expect(cloned.equals(color)).toBe(true)
      expect(cloned).not.toBe(color) // Different instances
    })

    it('should check equality', () => {
      const color1 = new Color('#3498db')
      const color2 = new Color('#3498db')
      const _color3 = new Color('#e74c3c')

      expect(color1.equals(color2)).toBe(true)
      expect(color1.equals('#e74c3c')).toBe(false)
    })

    it('should calculate distance', () => {
      const color1 = new Color('#ff0000')
      const color2 = new Color('#00ff00')
      const distance = color1.distance(color2)
      expect(distance).toBeGreaterThan(0)
    })

    it('should validate color', () => {
      const valid = new Color('#3498db')
      expect(valid.isValid()).toBe(true)
    })

    it('should export to JSON', () => {
      const color = new Color('#3498db')
      const json = color.toJSON()
      expect(json).toHaveProperty('rgb')
      expect(json).toHaveProperty('hsl')
      expect(json).toHaveProperty('hex')
    })
  })

  describe('object Pool', () => {
    it('should reuse objects from pool', () => {
      const color1 = Color.fromRGB(255, 0, 0)
      color1.dispose()

      const color2 = Color.fromRGB(0, 255, 0)
      // Should reuse the disposed object
      expect(color2).toBeDefined()
    })

    it('should handle RGB object pooling', () => {
      const color = new Color('#3498db')
      const rgb1 = color.toRGB()
      Color.returnRGB(rgb1)

      const rgb2 = color.toRGB()
      // Should potentially reuse object (can't guarantee same instance)
      expect(rgb2).toBeDefined()
    })
  })

  describe('edge Cases', () => {
    it('should clamp RGB values', () => {
      const color = Color.fromRGB(300, -10, 128)
      expect(color.red).toBe(255)
      expect(color.green).toBe(0)
      expect(color.blue).toBe(128)
    })

    it('should clamp alpha values', () => {
      const color = Color.fromRGB(255, 0, 0, 2)
      expect(color.alpha).toBe(1)

      const color2 = Color.fromRGB(255, 0, 0, -0.5)
      expect(color2.alpha).toBe(0)
    })

    it('should handle hue wrapping', () => {
      const color = Color.fromHSL(400, 50, 50)
      expect(color.hue).toBeLessThan(360)
      expect(color.hue).toBeGreaterThanOrEqual(0)
    })

    it('should handle zero saturation (grayscale)', () => {
      const gray = Color.fromHSL(180, 0, 50)
      expect(gray.saturation).toBe(0)
      expect(gray.red).toBe(gray.green)
      expect(gray.green).toBe(gray.blue)
    })
  })

  describe('performance', () => {
    it('should be fast for basic operations', () => {
      const iterations = 10000
      const start = performance.now()

      for (let i = 0; i < iterations; i++) {
        const c = Color.fromRGB(Math.random() * 255, Math.random() * 255, Math.random() * 255)
        c.lighten(20)
        c.dispose()
      }

      const end = performance.now()
      const timePerOp = (end - start) / iterations

      // Should complete in reasonable time (<0.01ms per op)
      expect(timePerOp).toBeLessThan(0.01)
    })
  })
})
