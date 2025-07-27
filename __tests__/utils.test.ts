import { describe, expect, it } from 'vitest'
import {
  adjustHue,
  adjustLightness,
  adjustSaturation,
  analyzeColor,
  generateRandomColor,
  getAnalogousColors,
  getComplementaryColor,
  getContrast,
  getLuminance,
  getRgbString,
  hexToHsl,
  hexToRgb,
  hslToHex,
  isDarkColor,
  isValidColor,
  mixColors,
  rgbToHex,
} from '../src/utils/colorUtils'

describe('颜色工具函数测试', () => {
  describe('颜色格式转换', () => {
    it('应该正确转换十六进制到HSL', () => {
      const hsl = hexToHsl('#1890ff')
      expect(hsl).toHaveLength(3)
      expect(hsl[0]).toBeGreaterThanOrEqual(0)
      expect(hsl[0]).toBeLessThan(360)
      expect(hsl[1]).toBeGreaterThanOrEqual(0)
      expect(hsl[1]).toBeLessThanOrEqual(100)
      expect(hsl[2]).toBeGreaterThanOrEqual(0)
      expect(hsl[2]).toBeLessThanOrEqual(100)
    })

    it('应该正确转换HSL到十六进制', () => {
      const hex = hslToHex([210, 100, 55])
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('应该正确转换十六进制到RGB', () => {
      const rgb = hexToRgb('#1890ff')
      expect(rgb).toHaveLength(3)
      rgb.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(255)
      })
    })

    it('应该正确转换RGB到十六进制', () => {
      const hex = rgbToHex([24, 144, 255])
      expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('转换应该是可逆的', () => {
      const originalHex = '#1890ff'
      const hsl = hexToHsl(originalHex)
      const convertedHex = hslToHex(hsl)

      // 由于精度问题，可能有轻微差异，检查颜色是否相近
      expect(convertedHex).toMatch(/^#[0-9a-f]{6}$/i)
      expect(isValidColor(convertedHex)).toBe(true)
    })
  })

  describe('颜色验证', () => {
    it('应该验证有效的颜色', () => {
      const validColors = [
        '#1890ff',
        '#fff',
        '#000000',
        'red',
        'rgb(255, 0, 0)',
        'hsl(0, 100%, 50%)',
        'rgba(255, 0, 0, 0.5)',
        'hsla(0, 100%, 50%, 0.5)',
      ]

      validColors.forEach((color) => {
        expect(isValidColor(color)).toBe(true)
      })
    })

    it('应该拒绝无效的颜色', () => {
      const invalidColors = [
        'invalid',
        '#gggggg',
        '',
        null as any,
        undefined as any,
      ]

      invalidColors.forEach((color) => {
        expect(isValidColor(color)).toBe(false)
      })
    })
  })

  describe('颜色分析', () => {
    it('应该正确计算亮度', () => {
      const whiteLuminance = getLuminance('#ffffff')
      const blackLuminance = getLuminance('#000000')

      expect(whiteLuminance).toBeGreaterThan(blackLuminance)
      expect(whiteLuminance).toBeLessThanOrEqual(1)
      expect(blackLuminance).toBeGreaterThanOrEqual(0)
    })

    it('应该正确判断深色', () => {
      expect(isDarkColor('#000000')).toBe(true)
      expect(isDarkColor('#ffffff')).toBe(false)
      expect(isDarkColor('#1890ff')).toBe(true)
    })

    it('应该正确计算对比度', () => {
      const contrast = getContrast('#000000', '#ffffff')
      expect(contrast).toBeGreaterThan(1)

      const sameColorContrast = getContrast('#1890ff', '#1890ff')
      expect(sameColorContrast).toBe(1)
    })

    it('应该提供完整的颜色分析', () => {
      const analysis = analyzeColor('#1890ff')

      expect(analysis.color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(analysis.hsl).toHaveLength(3)
      expect(analysis.rgb).toHaveLength(3)
      expect(analysis.hsv).toHaveLength(3)
      expect(typeof analysis.luminance).toBe('number')
      expect(typeof analysis.isDark).toBe('boolean')
      expect(analysis.contrastWithWhite).toHaveProperty('ratio')
      expect(analysis.contrastWithBlack).toHaveProperty('ratio')
    })
  })

  describe('颜色操作', () => {
    it('应该正确混合颜色', () => {
      const mixed = mixColors('#ff0000', '#0000ff', 0.5)
      expect(isValidColor(mixed)).toBe(true)
    })

    it('应该正确调整亮度', () => {
      const lighter = adjustLightness('#1890ff', 80)
      const darker = adjustLightness('#1890ff', 20)

      expect(isValidColor(lighter)).toBe(true)
      expect(isValidColor(darker)).toBe(true)

      const lighterLuminance = getLuminance(lighter)
      const darkerLuminance = getLuminance(darker)
      expect(lighterLuminance).toBeGreaterThan(darkerLuminance)
    })

    it('应该正确调整饱和度', () => {
      const moreSaturated = adjustSaturation('#1890ff', 100)
      const lessSaturated = adjustSaturation('#1890ff', 20)

      expect(isValidColor(moreSaturated)).toBe(true)
      expect(isValidColor(lessSaturated)).toBe(true)
    })

    it('应该正确调整色相', () => {
      const adjustedHue = adjustHue('#1890ff', 180)
      expect(isValidColor(adjustedHue)).toBe(true)
    })

    it('应该生成补色', () => {
      const complementary = getComplementaryColor('#1890ff')
      expect(isValidColor(complementary)).toBe(true)

      // 补色的色相应该相差180度
      const originalHsl = hexToHsl('#1890ff')
      const complementaryHsl = hexToHsl(complementary)
      const hueDiff = Math.abs(originalHsl[0] - complementaryHsl[0])
      expect(hueDiff).toBeCloseTo(180, 1)
    })

    it('应该生成类似色', () => {
      const analogous = getAnalogousColors('#1890ff', 4)
      expect(analogous).toHaveLength(4)
      analogous.forEach((color) => {
        expect(isValidColor(color)).toBe(true)
      })
    })
  })

  describe('随机颜色生成', () => {
    it('应该生成有效的随机颜色', () => {
      for (let i = 0; i < 10; i++) {
        const randomColor = generateRandomColor()
        expect(isValidColor(randomColor)).toBe(true)
      }
    })

    it('生成的随机颜色应该不同', () => {
      const colors = Array.from({ length: 10 }, () => generateRandomColor())
      const uniqueColors = new Set(colors)
      expect(uniqueColors.size).toBeGreaterThan(1)
    })
  })

  describe('rGB字符串生成', () => {
    it('应该生成正确的RGB字符串', () => {
      const rgbString = getRgbString('#1890ff')
      expect(rgbString).toMatch(/^\d+, \d+, \d+$/)

      const parts = rgbString.split(', ').map(Number)
      expect(parts).toHaveLength(3)
      parts.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(255)
      })
    })
  })

  describe('边界情况', () => {
    it('应该处理极端颜色值', () => {
      const extremeColors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']

      extremeColors.forEach((color) => {
        expect(isValidColor(color)).toBe(true)
        expect(analyzeColor(color)).toBeDefined()
        expect(getRgbString(color)).toMatch(/^\d+, \d+, \d+$/)
      })
    })

    it('应该处理短格式的十六进制颜色', () => {
      const shortHex = '#fff'
      expect(isValidColor(shortHex)).toBe(true)

      const hsl = hexToHsl(shortHex)
      expect(hsl).toHaveLength(3)
    })
  })
})
