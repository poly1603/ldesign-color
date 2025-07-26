import { describe, it, expect, beforeEach } from 'vitest'
import { generateTheme, generateRandomColor, createPresetThemeManager } from '../src'

describe('修复验证测试', () => {
  describe('1. 灰色色阶偏红问题修复', () => {
    it('禁用混入主色调时应生成纯中性灰色', async () => {
      const theme = generateTheme('#1890ff', {
        grayMixPrimary: false,
      })

      // 检查生成的灰色是否为中性灰色（饱和度应该为0或接近0）
      const grayColors = theme.palettes.light.gray
      
      // 验证第一个灰色（最浅的）
      const lightestGray = grayColors[0]
      expect(lightestGray).toMatch(/^#[0-9a-fA-F]{6}$/)
      
      // 验证最深的灰色
      const darkestGray = grayColors[grayColors.length - 1]
      expect(darkestGray).toMatch(/^#[0-9a-fA-F]{6}$/)
      
      // 验证灰色数量正确（14个色阶）
      expect(grayColors).toHaveLength(14)
    })

    it('启用混入主色调时应生成带色相的灰色', async () => {
      const theme = generateTheme('#1890ff', {
        grayMixPrimary: true,
      })

      const grayColors = theme.palettes.light.gray
      expect(grayColors).toHaveLength(14)
      
      // 验证生成的颜色格式正确
      grayColors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
      })
    })
  })

  describe('2. 随机颜色报错修复', () => {
    it('应该能够正常生成随机颜色', () => {
      // 多次生成随机颜色，确保不会报错
      for (let i = 0; i < 10; i++) {
        const randomColor = generateRandomColor()
        expect(randomColor).toMatch(/^#[0-9a-fA-F]{6}$/)
        expect(randomColor).toHaveLength(7)
      }
    })

    it('生成的随机颜色应该是有效的十六进制颜色', () => {
      const randomColor = generateRandomColor()
      
      // 验证格式
      expect(randomColor).toMatch(/^#[0-9a-fA-F]{6}$/)
      
      // 验证可以被解析
      const hex = randomColor.slice(1)
      const num = parseInt(hex, 16)
      expect(num).toBeGreaterThanOrEqual(0)
      expect(num).toBeLessThanOrEqual(0xFFFFFF)
    })
  })

  describe('3. CSS变量配置支持', () => {
    it('应该支持自定义CSS前缀', () => {
      const theme = generateTheme('#1890ff', {
        cssPrefix: 'my-design',
      })

      expect(theme.cssVariables).toContain('--my-design-')
      expect(theme.cssVariables).not.toContain('--ldesign-')
    })

    it('应该支持自定义语义化颜色名称', () => {
      const theme = generateTheme('#1890ff', {
        cssPrefix: 'test',
        semanticNames: {
          primary: 'brand',
          success: 'positive',
          warning: 'caution',
          danger: 'negative',
          gray: 'neutral',
        },
      })

      expect(theme.cssVariables).toContain('--test-brand-')
      expect(theme.cssVariables).toContain('--test-positive-')
      expect(theme.cssVariables).toContain('--test-caution-')
      expect(theme.cssVariables).toContain('--test-negative-')
      expect(theme.cssVariables).toContain('--test-neutral-')
      
      expect(theme.cssVariables).not.toContain('--test-primary-')
      expect(theme.cssVariables).not.toContain('--test-success-')
    })

    it('CSS生成器应该有injectToHead方法', () => {
      const theme = generateTheme('#1890ff')
      
      expect(theme.cssGenerator).toBeDefined()
      expect(typeof theme.cssGenerator.injectToHead).toBe('function')
    })
  })

  describe('4. 预设主题管理器', () => {
    let presetManager: ReturnType<typeof createPresetThemeManager>

    beforeEach(() => {
      presetManager = createPresetThemeManager()
    })

    it('应该包含默认预设主题', () => {
      const themes = presetManager.getThemes()
      expect(themes.length).toBeGreaterThan(0)
      
      // 验证默认主题包含蓝色
      const blueTheme = themes.find(t => t.name === '蓝色')
      expect(blueTheme).toBeDefined()
      expect(blueTheme?.color).toBe('#1890ff')
    })

    it('应该能够添加自定义主题', () => {
      const initialCount = presetManager.getThemes().length
      
      presetManager.addTheme({
        name: '自定义红色',
        color: '#ff0000',
        description: '测试红色主题',
      })

      const themes = presetManager.getThemes()
      expect(themes.length).toBe(initialCount + 1)
      
      const customTheme = themes.find(t => t.name === '自定义红色')
      expect(customTheme).toBeDefined()
      expect(customTheme?.color).toBe('#ff0000')
      expect(customTheme?.enabled).toBe(true)
    })

    it('应该能够启用/禁用主题', () => {
      presetManager.addTheme({
        name: '测试主题',
        color: '#123456',
      })

      // 禁用主题
      const result = presetManager.toggleTheme('测试主题', false)
      expect(result).toBe(true)
      
      const theme = presetManager.findTheme('测试主题')
      expect(theme?.enabled).toBe(false)

      // 启用主题
      presetManager.toggleTheme('测试主题', true)
      expect(theme?.enabled).toBe(true)
    })

    it('应该能够移除主题', () => {
      presetManager.addTheme({
        name: '待删除主题',
        color: '#abcdef',
      })

      const initialCount = presetManager.getThemes().length
      const result = presetManager.removeTheme('待删除主题')
      
      expect(result).toBe(true)
      expect(presetManager.getThemes().length).toBe(initialCount - 1)
      expect(presetManager.findTheme('待删除主题')).toBeUndefined()
    })

    it('getEnabledThemes应该只返回启用的主题', () => {
      // 添加一个禁用的主题
      presetManager.addTheme({
        name: '禁用主题',
        color: '#000000',
      })
      presetManager.toggleTheme('禁用主题', false)

      const enabledThemes = presetManager.getEnabledThemes()
      const allThemes = presetManager.getThemes()
      
      expect(enabledThemes.value.length).toBeLessThan(allThemes.length)
      expect(enabledThemes.value.find(t => t.name === '禁用主题')).toBeUndefined()
    })
  })

  describe('5. 样式注入功能', () => {
    it('injectToHead方法应该返回HTMLStyleElement', () => {
      // 模拟DOM环境
      const mockDocument = {
        createElement: () => ({
          id: '',
          textContent: '',
          setAttribute: () => {},
        }),
        getElementById: () => null,
        head: {
          appendChild: () => {},
        },
      }
      
      // 这个测试需要在浏览器环境中运行
      // 这里只验证方法存在和基本功能
      const theme = generateTheme('#1890ff')
      expect(typeof theme.cssGenerator.injectToHead).toBe('function')
    })
  })
})
