import type { ColorGeneratorConfig, ColorPalettes } from '../types'

/**
 * CSS变量生成器
 * 负责将颜色色阶转换为CSS变量并注入到页面中
 */
export class CSSVariableGenerator {
  private config: Required<ColorGeneratorConfig>
  private styleElement: HTMLStyleElement | null = null

  constructor(config: ColorGeneratorConfig = {}) {
    this.config = {
      enableCache: true,
      cacheSize: 100,
      useWebWorker: false,
      cssPrefix: 'ldesign',
      autoInject: true,
      grayMixPrimary: true,
      grayMixRatio: 0.2,
      semanticNames: {
        primary: 'primary',
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        gray: 'gray',
      },
      ...config,
    }
  }

  /**
   * 生成CSS变量字符串
   */
  public generateCSSVariables(palettes: ColorPalettes): string {
    const variables: string[] = []

    // 生成明亮模式变量
    variables.push('/* 明亮模式颜色变量 */')
    variables.push(':root {')
    variables.push(...this.generateModeVariables(palettes.light, false))
    variables.push('}')

    // 生成暗黑模式变量
    variables.push('')
    variables.push('/* 暗黑模式颜色变量 */')
    variables.push('[data-theme="dark"], .dark {')
    variables.push(...this.generateModeVariables(palettes.dark, true))
    variables.push('}')

    // 生成语义化变量
    variables.push('')
    variables.push('/* 语义化颜色变量 */')
    variables.push(':root {')
    variables.push(...this.generateSemanticVariables())
    variables.push('}')

    return variables.join('\n')
  }

  /**
   * 生成单个模式的变量
   */
  private generateModeVariables(palette: any, isDark: boolean): string[] {
    const variables: string[] = []
    const prefix = this.config.cssPrefix
    const modePrefix = isDark ? 'dark-' : ''
    const names = this.config.semanticNames || {}

    // 生成主色调变量（12色阶）
    const primaryName = names.primary || 'primary'
    palette.primary.forEach((color: string, index: number) => {
      const step = index + 1
      variables.push(`  --${prefix}-${modePrefix}${primaryName}-${step}: ${color};`)
    })

    // 生成成功色变量（12色阶）
    const successName = names.success || 'success'
    palette.success.forEach((color: string, index: number) => {
      const step = index + 1
      variables.push(`  --${prefix}-${modePrefix}${successName}-${step}: ${color};`)
    })

    // 生成警告色变量（12色阶）
    const warningName = names.warning || 'warning'
    palette.warning.forEach((color: string, index: number) => {
      const step = index + 1
      variables.push(`  --${prefix}-${modePrefix}${warningName}-${step}: ${color};`)
    })

    // 生成危险色变量（12色阶）
    const dangerName = names.danger || 'danger'
    palette.danger.forEach((color: string, index: number) => {
      const step = index + 1
      variables.push(`  --${prefix}-${modePrefix}${dangerName}-${step}: ${color};`)
    })

    // 生成灰色变量（14色阶）
    const grayName = names.gray || 'gray'
    palette.gray.forEach((color: string, index: number) => {
      const step = index + 1
      variables.push(`  --${prefix}-${modePrefix}${grayName}-${step}: ${color};`)
    })

    return variables
  }

  /**
   * 生成语义化变量（指向具体色阶）
   */
  private generateSemanticVariables(): string[] {
    const variables: string[] = []
    const prefix = this.config.cssPrefix

    // 主要语义化变量
    variables.push(`  --${prefix}-primary: var(--${prefix}-primary-6);`)
    variables.push(`  --${prefix}-primary-hover: var(--${prefix}-primary-5);`)
    variables.push(`  --${prefix}-primary-active: var(--${prefix}-primary-7);`)
    variables.push(`  --${prefix}-primary-disabled: var(--${prefix}-primary-3);`)

    variables.push(`  --${prefix}-success: var(--${prefix}-success-6);`)
    variables.push(`  --${prefix}-success-hover: var(--${prefix}-success-5);`)
    variables.push(`  --${prefix}-success-active: var(--${prefix}-success-7);`)
    variables.push(`  --${prefix}-success-disabled: var(--${prefix}-success-3);`)

    variables.push(`  --${prefix}-warning: var(--${prefix}-warning-6);`)
    variables.push(`  --${prefix}-warning-hover: var(--${prefix}-warning-5);`)
    variables.push(`  --${prefix}-warning-active: var(--${prefix}-warning-7);`)
    variables.push(`  --${prefix}-warning-disabled: var(--${prefix}-warning-3);`)

    variables.push(`  --${prefix}-danger: var(--${prefix}-danger-6);`)
    variables.push(`  --${prefix}-danger-hover: var(--${prefix}-danger-5);`)
    variables.push(`  --${prefix}-danger-active: var(--${prefix}-danger-7);`)
    variables.push(`  --${prefix}-danger-disabled: var(--${prefix}-danger-3);`)

    // 文本颜色变量
    variables.push(`  --${prefix}-text-primary: var(--${prefix}-gray-13);`)
    variables.push(`  --${prefix}-text-secondary: var(--${prefix}-gray-10);`)
    variables.push(`  --${prefix}-text-tertiary: var(--${prefix}-gray-8);`)
    variables.push(`  --${prefix}-text-disabled: var(--${prefix}-gray-5);`)

    // 背景颜色变量
    variables.push(`  --${prefix}-bg-primary: var(--${prefix}-gray-1);`)
    variables.push(`  --${prefix}-bg-secondary: var(--${prefix}-gray-2);`)
    variables.push(`  --${prefix}-bg-tertiary: var(--${prefix}-gray-3);`)

    // 边框颜色变量
    variables.push(`  --${prefix}-border-primary: var(--${prefix}-gray-4);`)
    variables.push(`  --${prefix}-border-secondary: var(--${prefix}-gray-3);`)
    variables.push(`  --${prefix}-border-tertiary: var(--${prefix}-gray-2);`)

    return variables
  }

  /**
   * 将CSS变量注入到页面头部
   */
  public injectToHead(cssVariables: string, styleId?: string): HTMLStyleElement {
    if (typeof document === 'undefined') {
      console.warn('Document is not available, cannot inject CSS variables')
      throw new Error('Document is not available')
    }

    const id = styleId || `${this.config.cssPrefix}-color-variables`

    // 移除旧的样式元素
    const existingStyle = document.getElementById(id)
    if (existingStyle) {
      existingStyle.remove()
    }

    // 创建新的样式元素
    const styleElement = document.createElement('style')
    styleElement.id = id
    styleElement.setAttribute('data-ldesign-colors', 'true')
    styleElement.textContent = cssVariables

    // 插入到头部
    document.head.appendChild(styleElement)

    // 更新实例的样式元素引用
    if (!styleId) {
      this.styleElement = styleElement
    }

    return styleElement
  }

  /**
   * 移除注入的CSS变量
   */
  public removeFromHead(): void {
    if (this.styleElement) {
      this.styleElement.remove()
      this.styleElement = null
    }
  }

  /**
   * 批量生成多个主题的CSS变量
   */
  public batchGenerateCSS(themes: { name: string, palettes: ColorPalettes }[]): string {
    const allVariables: string[] = []

    themes.forEach(({ name, palettes }) => {
      allVariables.push(`/* ${name} 主题 */`)
      allVariables.push(`[data-theme="${name}"] {`)
      allVariables.push(...this.generateModeVariables(palettes.light, false))
      allVariables.push('}')
      allVariables.push('')

      allVariables.push(`[data-theme="${name}"].dark {`)
      allVariables.push(...this.generateModeVariables(palettes.dark, true))
      allVariables.push('}')
      allVariables.push('')
    })

    return allVariables.join('\n')
  }

  /**
   * 生成CSS变量的TypeScript类型定义
   */
  public generateTypeDefinitions(): string {
    const prefix = this.config.cssPrefix
    const types: string[] = []

    types.push('declare module "*.css" {')
    types.push('  interface CSSVariables {')

    // 主色调类型
    for (let i = 1; i <= 12; i++) {
      types.push(`    "--${prefix}-primary-${i}": string;`)
      types.push(`    "--${prefix}-primary-${i}-rgb": string;`)
      types.push(`    "--${prefix}-dark-primary-${i}": string;`)
      types.push(`    "--${prefix}-dark-primary-${i}-rgb": string;`)
    }

    // 其他语义化颜色类型
    ['success', 'warning', 'danger'].forEach((color) => {
      for (let i = 1; i <= 12; i++) {
        types.push(`    "--${prefix}-${color}-${i}": string;`)
        types.push(`    "--${prefix}-${color}-${i}-rgb": string;`)
        types.push(`    "--${prefix}-dark-${color}-${i}": string;`)
        types.push(`    "--${prefix}-dark-${color}-${i}-rgb": string;`)
      }
    })

    // 灰色类型
    for (let i = 1; i <= 14; i++) {
      types.push(`    "--${prefix}-gray-${i}": string;`)
      types.push(`    "--${prefix}-gray-${i}-rgb": string;`)
      types.push(`    "--${prefix}-dark-gray-${i}": string;`)
      types.push(`    "--${prefix}-dark-gray-${i}-rgb": string;`)
    }

    types.push('  }')
    types.push('}')

    return types.join('\n')
  }

  /**
   * 生成SCSS变量文件
   */
  public generateSCSSVariables(palettes: ColorPalettes): string {
    const variables: string[] = []
    const prefix = this.config.cssPrefix

    variables.push('// LDesign 颜色变量')
    variables.push('// 自动生成，请勿手动修改')
    variables.push('')

    // 明亮模式变量
    variables.push('// 明亮模式')
    Object.entries(palettes.light).forEach(([colorName, colors]) => {
      (colors as string[]).forEach((color, index) => {
        const step = index + 1
        variables.push(`$${prefix}-${colorName}-${step}: ${color};`)
      })
    })

    variables.push('')
    variables.push('// 暗黑模式')
    Object.entries(palettes.dark).forEach(([colorName, colors]) => {
      (colors as string[]).forEach((color, index) => {
        const step = index + 1
        variables.push(`$${prefix}-dark-${colorName}-${step}: ${color};`)
      })
    })

    return variables.join('\n')
  }

  /**
   * 生成Less变量文件
   */
  public generateLessVariables(palettes: ColorPalettes): string {
    const variables: string[] = []
    const prefix = this.config.cssPrefix

    variables.push('// LDesign 颜色变量')
    variables.push('// 自动生成，请勿手动修改')
    variables.push('')

    // 明亮模式变量
    variables.push('// 明亮模式')
    Object.entries(palettes.light).forEach(([colorName, colors]) => {
      (colors as string[]).forEach((color, index) => {
        const step = index + 1
        variables.push(`@${prefix}-${colorName}-${step}: ${color};`)
      })
    })

    variables.push('')
    variables.push('// 暗黑模式')
    Object.entries(palettes.dark).forEach(([colorName, colors]) => {
      (colors as string[]).forEach((color, index) => {
        const step = index + 1
        variables.push(`@${prefix}-dark-${colorName}-${step}: ${color};`)
      })
    })

    return variables.join('\n')
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<ColorGeneratorConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取当前配置
   */
  public getConfig(): Required<ColorGeneratorConfig> {
    return { ...this.config }
  }
}
