import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ColorGenerator } from '../src/core/ColorGenerator'
import { isValidColor } from '../src/utils/colorUtils'

describe('colorGenerator', () => {
  let colorGenerator: ColorGenerator

  beforeEach(() => {
    colorGenerator = new ColorGenerator({
      enableCache: false, // 测试时禁用缓存
      useWebWorker: false, // 测试时禁用Web Worker
    })
  })

  afterEach(() => {
    colorGenerator.destroy()
  })

  describe('基础功能测试', () => {
    it('应该能够生成完整的主题', () => {
      const primaryColor = '#1890ff'
      const theme = colorGenerator.generate(primaryColor)

      expect(theme).toBeDefined()
      expect(theme.semanticColors).toBeDefined()
      expect(theme.palettes).toBeDefined()
      expect(theme.cssVariables).toBeDefined()
      expect(theme.timestamp).toBeGreaterThan(0)
    })

    it('应该生成正确的语义化颜色', () => {
      const primaryColor = '#1890ff'
      const theme = colorGenerator.generate(primaryColor)
      const { semanticColors } = theme

      expect(semanticColors.primary).toBe('#1890ff')
      expect(isValidColor(semanticColors.success)).toBe(true)
      expect(isValidColor(semanticColors.warning)).toBe(true)
      expect(isValidColor(semanticColors.danger)).toBe(true)
      expect(isValidColor(semanticColors.gray)).toBe(true)
    })

    it('应该生成正确数量的色阶', () => {
      const primaryColor = '#1890ff'
      const theme = colorGenerator.generate(primaryColor)
      const { palettes } = theme

      // 检查明亮模式
      expect(palettes.light.primary).toHaveLength(12)
      expect(palettes.light.success).toHaveLength(12)
      expect(palettes.light.warning).toHaveLength(12)
      expect(palettes.light.danger).toHaveLength(12)
      expect(palettes.light.gray).toHaveLength(14)

      // 检查暗黑模式
      expect(palettes.dark.primary).toHaveLength(12)
      expect(palettes.dark.success).toHaveLength(12)
      expect(palettes.dark.warning).toHaveLength(12)
      expect(palettes.dark.danger).toHaveLength(12)
      expect(palettes.dark.gray).toHaveLength(14)
    })

    it('应该生成有效的颜色值', () => {
      const primaryColor = '#1890ff'
      const theme = colorGenerator.generate(primaryColor)
      const { palettes } = theme

      // 检查所有颜色都是有效的
      Object.values(palettes.light).forEach((colors) => {
        colors.forEach((color: string) => {
          expect(isValidColor(color)).toBe(true)
        })
      })

      Object.values(palettes.dark).forEach((colors) => {
        colors.forEach((color: string) => {
          expect(isValidColor(color)).toBe(true)
        })
      })
    })

    it('应该生成CSS变量', () => {
      const primaryColor = '#1890ff'
      const theme = colorGenerator.generate(primaryColor)

      expect(theme.cssVariables).toContain('--ldesign-primary-')
      expect(theme.cssVariables).toContain('--ldesign-success-')
      expect(theme.cssVariables).toContain('--ldesign-warning-')
      expect(theme.cssVariables).toContain('--ldesign-danger-')
      expect(theme.cssVariables).toContain('--ldesign-gray-')
      expect(theme.cssVariables).toContain('--ldesign-dark-')
    })
  })

  describe('异步功能测试', () => {
    it('应该能够异步生成主题', async () => {
      const primaryColor = '#1890ff'
      const theme = await colorGenerator.generateAsync(primaryColor)

      expect(theme).toBeDefined()
      expect(theme.semanticColors.primary).toBe('#1890ff')
    })

    it('应该能够批量生成主题', async () => {
      const colors = ['#1890ff', '#52c41a', '#f5222d']
      const themes = await colorGenerator.batchGenerate(colors)

      expect(themes).toHaveLength(3)
      themes.forEach((theme, index) => {
        expect(theme.semanticColors.primary).toBe(colors[index])
      })
    })
  })

  describe('缓存功能测试', () => {
    beforeEach(() => {
      colorGenerator = new ColorGenerator({
        enableCache: true,
        cacheSize: 10,
        useWebWorker: false,
      })
    })

    it('应该能够缓存生成的主题', () => {
      const primaryColor = '#1890ff'

      // 第一次生成
      const theme1 = colorGenerator.generate(primaryColor)

      // 第二次生成（应该从缓存获取）
      const theme2 = colorGenerator.generate(primaryColor)

      expect(theme1).toEqual(theme2)
    })

    it('应该能够清除缓存', () => {
      const primaryColor = '#1890ff'

      // 生成主题
      colorGenerator.generate(primaryColor)

      // 清除缓存
      colorGenerator.clearCache()

      // 再次生成应该是新的实例
      const theme = colorGenerator.generate(primaryColor)
      expect(theme).toBeDefined()
    })
  })

  describe('配置功能测试', () => {
    it('应该能够更新配置', () => {
      const newConfig = {
        cssPrefix: 'custom',
        enableCache: true,
      }

      colorGenerator.updateConfig(newConfig)
      const config = colorGenerator.getConfig()

      expect(config.cssPrefix).toBe('custom')
      expect(config.enableCache).toBe(true)
    })

    it('应该使用自定义CSS前缀', () => {
      colorGenerator.updateConfig({ cssPrefix: 'custom' })

      const primaryColor = '#1890ff'
      const theme = colorGenerator.generate(primaryColor)

      expect(theme.cssVariables).toContain('--custom-primary-')
    })
  })

  describe('性能监控测试', () => {
    it('应该能够获取性能指标', () => {
      const primaryColor = '#1890ff'

      // 重置性能指标
      colorGenerator.resetPerformanceMetrics()

      // 生成主题
      colorGenerator.generate(primaryColor)

      // 获取性能指标
      const metrics = colorGenerator.getPerformanceMetrics()

      expect(metrics.semanticColorGeneration).toBeGreaterThanOrEqual(0)
      expect(metrics.paletteGeneration).toBeGreaterThanOrEqual(0)
      expect(metrics.cssVariableGeneration).toBeGreaterThanOrEqual(0)
      expect(metrics.totalTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('错误处理测试', () => {
    it('应该处理无效的颜色输入', () => {
      const invalidColor = 'invalid-color'

      expect(() => {
        colorGenerator.generate(invalidColor)
      }).toThrow()
    })

    it('应该处理空字符串输入', () => {
      const emptyColor = ''

      expect(() => {
        colorGenerator.generate(emptyColor)
      }).toThrow()
    })
  })

  describe('边界情况测试', () => {
    it('应该处理极端的颜色值', () => {
      const extremeColors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']

      extremeColors.forEach((color) => {
        const theme = colorGenerator.generate(color)
        expect(theme).toBeDefined()
        expect(theme.semanticColors.primary).toBe(color)
      })
    })

    it('应该处理不同格式的颜色输入', () => {
      const colorFormats = [
        '#1890ff',
        'rgb(24, 144, 255)',
        'hsl(210, 100%, 55%)',
      ]

      colorFormats.forEach((color) => {
        const theme = colorGenerator.generate(color)
        expect(theme).toBeDefined()
      })
    })
  })

  describe('内存管理测试', () => {
    it('应该能够正确销毁实例', () => {
      const primaryColor = '#1890ff'
      colorGenerator.generate(primaryColor)

      // 销毁实例
      colorGenerator.destroy()

      // 销毁后缓存应该被清空
      expect(colorGenerator.cache.size).toBe(0)
    })
  })
})
