/**
 * @ldesign/color - Design Systems Tests
 *
 * Tests for design system palette generators
 */

import { describe, expect, it } from 'vitest'
import {
  generateAntDesignColorSystem,
  generateAntDesignPalette,
} from '../../src/design-systems/antDesign'
import {
  generateChakraUIScale,
} from '../../src/design-systems/chakraUI'
import {
  compareDesignSystems,
  generateCompleteColorSystem,
  generateDesignSystemPalette,
} from '../../src/design-systems/generator'
import {
  generateTailwindScale,
} from '../../src/design-systems/tailwind'

describe('design Systems', () => {
  const testColor = '#3498db'

  describe('ant Design', () => {
    it('should generate 10-shade palette', () => {
      const palette = generateAntDesignPalette(testColor)

      // Should have shades 1-10
      for (let i = 1; i <= 10; i++) {
        expect(palette[i as keyof typeof palette]).toBeDefined()
        expect(palette[i as keyof typeof palette]).toMatch(/^#[0-9A-F]{6}$/)
      }
    })

    it('should have shade 6 close to input', () => {
      const palette = generateAntDesignPalette(testColor)
      // Shade 6 should be similar to input
      expect(palette[6]).toBeDefined()
    })

    it('should generate complete color system', () => {
      const system = generateAntDesignColorSystem(testColor)

      expect(system.primary).toBeDefined()
      expect(system.success).toBeDefined()
      expect(system.warning).toBeDefined()
      expect(system.error).toBeDefined()
      expect(system.info).toBeDefined()
    })
  })

  describe('chakra UI', () => {
    it('should generate 50-900 scale', () => {
      const scale = generateChakraUIScale(testColor)

      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
      shades.forEach((shade) => {
        expect(scale[shade as keyof typeof scale]).toBeDefined()
        expect(scale[shade as keyof typeof scale]).toMatch(/^#[0-9A-F]{6}$/)
      })
    })

    it('should have shade 500 as base', () => {
      const scale = generateChakraUIScale(testColor)
      expect(scale[500]).toBeDefined()
    })
  })

  describe('tailwind CSS', () => {
    it('should generate 50-950 scale', () => {
      const scale = generateTailwindScale(testColor)

      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      shades.forEach((shade) => {
        expect(scale[shade as keyof typeof scale]).toBeDefined()
      })
    })

    it('should preserve base color at 500', () => {
      const scale = generateTailwindScale(testColor)
      // Shade 500 should be the base color (or very close)
      expect(scale[500].toUpperCase()).toBe(testColor.toUpperCase())
    })
  })

  describe('unified Interface', () => {
    it('should generate palette for any design system', () => {
      const systems: Array<'ant-design' | 'chakra-ui' | 'tailwind'> = [
        'ant-design',
        'chakra-ui',
        'tailwind',
      ]

      systems.forEach((system) => {
        const palette = generateDesignSystemPalette(testColor, system)
        expect(palette).toBeDefined()
        expect(Object.keys(palette).length).toBeGreaterThan(0)
      })
    })

    it('should generate complete system', () => {
      const system = generateCompleteColorSystem(testColor, 'ant-design')
      expect(system).toBeDefined()
      expect(system.primary).toBeDefined()
    })

    it('should compare design systems', () => {
      const comparison = compareDesignSystems(testColor)

      expect(comparison.antDesign).toBeDefined()
      expect(comparison.chakraUI).toBeDefined()
      expect(comparison.tailwind).toBeDefined()
    })
  })

  describe('palette Validation', () => {
    it('should generate progressively lighter shades', () => {
      const palette = generateAntDesignPalette(testColor)
      const { Color: ColorClass } = await import('../../src/core/Color')

      // Lower numbers should be lighter
      const shade1 = new ColorClass(palette[1])
      const shade5 = new ColorClass(palette[5])
      const shade10 = new ColorClass(palette[10])

      expect(shade1.lightness).toBeGreaterThan(shade5.lightness)
      expect(shade5.lightness).toBeGreaterThan(shade10.lightness)
    })
  })
})
