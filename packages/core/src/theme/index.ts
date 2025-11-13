/**
 * @ldesign/color-core - 主题色彩生成器
 * 
 * 核心功能：基于主色调自动生成完整的色彩体系
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { generateTailwindScale, generateTailwindGrayScale } from '../core/tailwindPalette'
import { generateTailwindDarkScale, generateTailwindDarkGrayScale } from '../palette/darkMode'
import type { HSL } from '../types'

/**
 * 10色阶 Tailwind 风格
 */
export const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
export type ColorShade = typeof COLOR_SHADES[number]

/**
 * 单色调色板（10个色阶）
 */
export type ColorScale = Record<ColorShade, string>

/**
 * 完整的语义色彩体系
 */
export interface SemanticColors {
  primary: ColorScale
  success: ColorScale
  warning: ColorScale
  danger: ColorScale
  gray: ColorScale
}

/**
 * 主题色彩配置（包含亮色和暗色两种模式）
 */
export interface ThemeColors {
  light: SemanticColors
  dark: SemanticColors
}

/**
 * 色彩生成选项
 */
export interface ColorGeneratorOptions {
  /** 是否保留输入色彩在最接近的色阶中 */
  preserveInput?: boolean
  /** 自定义语义色彩的色相偏移 */
  semanticHues?: {
    success?: number
    warning?: number
    danger?: number
  }
}

/**
 * 基于主色调生成语义色彩的色相
 */
function generateSemanticHues(primaryHsl: HSL, customHues?: ColorGeneratorOptions['semanticHues']): {
  success: number
  warning: number
  danger: number
} {
  return {
    // Success: 绿色系 (142° 是标准绿色)
    success: customHues?.success ?? 142,
    // Warning: 橙色系 (38° 是琥珀色)
    warning: customHues?.warning ?? 38,
    // Danger: 红色系 (4° 是偏橙的红色，比纯红(0°)更柔和)
    danger: customHues?.danger ?? 4,
  }
}

/**
 * 基于主色调计算语义色彩的饱和度
 */
function calculateSemanticSaturation(primarySaturation: number, colorType: 'success' | 'warning' | 'danger'): number {
  switch (colorType) {
    case 'success':
      // 成功色保持适中饱和度
      return Math.min(Math.max(primarySaturation * 0.9, 45), 70)
    case 'warning':
      // 警告色需要更高饱和度以引起注意
      return Math.min(Math.max(primarySaturation * 1.1, 60), 85)
    case 'danger':
      // 危险色保持较高饱和度
      return Math.min(Math.max(primarySaturation, 50), 75)
  }
}

/**
 * 转换色阶对象格式（从包含所有色阶到只包含标准10色阶）
 */
function normalizeColorScale(scale: Record<string, string>): ColorScale {
  const result: Partial<ColorScale> = {}

  COLOR_SHADES.forEach(shade => {
    if (scale[shade.toString()]) {
      result[shade] = scale[shade.toString()]
    }
  })

  return result as ColorScale
}

/**
 * 核心函数：基于主色调生成完整的主题色彩体系
 * 
 * @param primaryColor - 主色调（支持任何颜色格式）
 * @param options - 生成选项
 * @returns 包含亮色和暗色模式的完整主题色彩
 * 
 * @example
 * ```ts
 * const theme = generateThemeColors('#1890ff')
 * 
 * // 使用亮色模式
 * console.log(theme.light.primary[500]) // 主色调-500色阶
 * console.log(theme.light.success[600]) // 成功色-600色阶
 * 
 * // 使用暗色模式
 * console.log(theme.dark.primary[500])
 * ```
 */
export function generateThemeColors(
  primaryColor: ColorInput,
  options: ColorGeneratorOptions = {}
): ThemeColors {
  const { preserveInput = true, semanticHues } = options

  // 解析主色调
  const primary = new Color(primaryColor)
  const primaryHsl = primary.toHSL()
  const primaryHex = primary.toHex()

  // 生成语义色彩的色相值
  const hues = generateSemanticHues(primaryHsl, semanticHues)

  // 生成语义色彩的基础颜色
  const semanticBaseColors = {
    success: Color.fromHSL(
      hues.success,
      calculateSemanticSaturation(primaryHsl.s, 'success'),
      45 // 亮度固定在45%，适中的亮度
    ).toHex(),

    warning: Color.fromHSL(
      hues.warning,
      calculateSemanticSaturation(primaryHsl.s, 'warning'),
      50 // 亮度固定在50%
    ).toHex(),

    danger: Color.fromHSL(
      hues.danger,
      calculateSemanticSaturation(primaryHsl.s, 'danger'),
      50 // 亮度固定在50%
    ).toHex(),
  }

  // 生成亮色模式色阶
  const lightRawScales = {
    primary: generateTailwindScale(primaryHex, preserveInput),
    success: generateTailwindScale(semanticBaseColors.success, preserveInput),
    warning: generateTailwindScale(semanticBaseColors.warning, preserveInput),
    danger: generateTailwindScale(semanticBaseColors.danger, preserveInput),
    gray: generateTailwindGrayScale(),
  }

  // 生成暗色模式色阶
  const darkRawScales = {
    primary: generateTailwindDarkScale(primaryHex),
    success: generateTailwindDarkScale(semanticBaseColors.success),
    warning: generateTailwindDarkScale(semanticBaseColors.warning),
    danger: generateTailwindDarkScale(semanticBaseColors.danger),
    gray: generateTailwindDarkGrayScale(),
  }

  // 规范化为标准10色阶
  return {
    light: {
      primary: normalizeColorScale(lightRawScales.primary),
      success: normalizeColorScale(lightRawScales.success),
      warning: normalizeColorScale(lightRawScales.warning),
      danger: normalizeColorScale(lightRawScales.danger),
      gray: normalizeColorScale(lightRawScales.gray),
    },
    dark: {
      primary: normalizeColorScale(darkRawScales.primary),
      success: normalizeColorScale(darkRawScales.success),
      warning: normalizeColorScale(darkRawScales.warning),
      danger: normalizeColorScale(darkRawScales.danger),
      gray: normalizeColorScale(darkRawScales.gray),
    },
  }
}

/**
 * CSS 变量生成选项
 */
export interface CSSVariablesOptions {
  /** CSS 变量前缀，默认为 'color' */
  prefix?: string
  /** 是否包含语义别名（如 --color-primary-default） */
  includeAliases?: boolean
}

/**
 * 生成单个色阶的 CSS 变量
 */
function generateScaleVariables(
  colorName: string,
  scale: ColorScale,
  prefix: string
): string[] {
  const vars: string[] = []

  COLOR_SHADES.forEach(shade => {
    vars.push(`  --${prefix}-${colorName}-${shade}: ${scale[shade]};`)
  })

  return vars
}

/**
 * 生成语义别名 CSS 变量
 */
function generateSemanticAliases(prefix: string): string[] {
  return [
    `  /* 主色调状态别名 */`,
    `  --${prefix}-primary-lighter: var(--${prefix}-primary-100);`,
    `  --${prefix}-primary-light: var(--${prefix}-primary-300);`,
    `  --${prefix}-primary-default: var(--${prefix}-primary-500);`,
    `  --${prefix}-primary-hover: var(--${prefix}-primary-600);`,
    `  --${prefix}-primary-active: var(--${prefix}-primary-700);`,
    `  --${prefix}-primary-disabled: var(--${prefix}-primary-300);`,
    ``,
    `  /* 成功色状态别名 */`,
    `  --${prefix}-success-lighter: var(--${prefix}-success-100);`,
    `  --${prefix}-success-light: var(--${prefix}-success-300);`,
    `  --${prefix}-success-default: var(--${prefix}-success-500);`,
    `  --${prefix}-success-hover: var(--${prefix}-success-600);`,
    `  --${prefix}-success-active: var(--${prefix}-success-700);`,
    `  --${prefix}-success-disabled: var(--${prefix}-success-300);`,
    ``,
    `  /* 警告色状态别名 */`,
    `  --${prefix}-warning-lighter: var(--${prefix}-warning-100);`,
    `  --${prefix}-warning-light: var(--${prefix}-warning-300);`,
    `  --${prefix}-warning-default: var(--${prefix}-warning-500);`,
    `  --${prefix}-warning-hover: var(--${prefix}-warning-600);`,
    `  --${prefix}-warning-active: var(--${prefix}-warning-700);`,
    `  --${prefix}-warning-disabled: var(--${prefix}-warning-300);`,
    ``,
    `  /* 危险色状态别名 */`,
    `  --${prefix}-danger-lighter: var(--${prefix}-danger-100);`,
    `  --${prefix}-danger-light: var(--${prefix}-danger-300);`,
    `  --${prefix}-danger-default: var(--${prefix}-danger-500);`,
    `  --${prefix}-danger-hover: var(--${prefix}-danger-600);`,
    `  --${prefix}-danger-active: var(--${prefix}-danger-700);`,
    `  --${prefix}-danger-disabled: var(--${prefix}-danger-300);`,
  ]
}

/**
 * 生成 CSS 变量字符串
 * 
 * @param themeColors - 主题色彩对象
 * @param options - CSS 变量选项
 * @returns CSS 变量字符串，可直接插入到 `<style>` 标签或 CSS 文件中
 * 
 * @example
 * ```ts
 * const theme = generateThemeColors('#1890ff')
 * const css = generateCSSVariables(theme)
 * 
 * // 输出的 CSS:
 * // :root {
 * //   --color-primary-50: #e6f7ff;
 * //   --color-primary-100: #bae7ff;
 * //   ...
 * // }
 * // 
 * // [data-theme="dark"] {
 * //   --color-primary-50: #111d2c;
 * //   ...
 * // }
 * ```
 */
export function generateCSSVariables(
  themeColors: ThemeColors,
  options: CSSVariablesOptions = {}
): string {
  const { prefix = 'color', includeAliases = true } = options

  const lightVars: string[] = []
  const darkVars: string[] = []

  // 生成亮色模式变量
  const lightColors = themeColors.light
  lightVars.push('  /* Primary */')
  lightVars.push(...generateScaleVariables('primary', lightColors.primary, prefix))
  lightVars.push('')
  lightVars.push('  /* Success */')
  lightVars.push(...generateScaleVariables('success', lightColors.success, prefix))
  lightVars.push('')
  lightVars.push('  /* Warning */')
  lightVars.push(...generateScaleVariables('warning', lightColors.warning, prefix))
  lightVars.push('')
  lightVars.push('  /* Danger */')
  lightVars.push(...generateScaleVariables('danger', lightColors.danger, prefix))
  lightVars.push('')
  lightVars.push('  /* Gray */')
  lightVars.push(...generateScaleVariables('gray', lightColors.gray, prefix))

  if (includeAliases) {
    lightVars.push('')
    lightVars.push(...generateSemanticAliases(prefix))
  }

  // 生成暗色模式变量
  const darkColors = themeColors.dark
  darkVars.push('  /* Primary */')
  darkVars.push(...generateScaleVariables('primary', darkColors.primary, prefix))
  darkVars.push('')
  darkVars.push('  /* Success */')
  darkVars.push(...generateScaleVariables('success', darkColors.success, prefix))
  darkVars.push('')
  darkVars.push('  /* Warning */')
  darkVars.push(...generateScaleVariables('warning', darkColors.warning, prefix))
  darkVars.push('')
  darkVars.push('  /* Danger */')
  darkVars.push(...generateScaleVariables('danger', darkColors.danger, prefix))
  darkVars.push('')
  darkVars.push('  /* Gray */')
  darkVars.push(...generateScaleVariables('gray', darkColors.gray, prefix))

  if (includeAliases) {
    darkVars.push('')
    darkVars.push(...generateSemanticAliases(prefix))
  }

  return `/* 亮色模式（默认） */
:root {
${lightVars.join('\n')}
}

/* 暗色模式 */
[data-theme="dark"] {
${darkVars.join('\n')}
}`
}

/**
 * 将 CSS 变量注入到页面中
 * 
 * @param themeColors - 主题色彩对象
 * @param options - CSS 变量选项
 * 
 * @example
 * ```ts
 * const theme = generateThemeColors('#1890ff')
 * injectCSSVariables(theme)
 * 
 * // 现在可以在 CSS 中使用:
 * // .button-primary {
 * //   background: var(--color-primary-500);
 * // }
 * ```
 */
export function injectCSSVariables(
  themeColors: ThemeColors,
  options: CSSVariablesOptions = {}
): void {
  if (typeof document === 'undefined') {
    console.warn('injectCSSVariables 只能在浏览器环境中使用')
    return
  }

  const css = generateCSSVariables(themeColors, options)

  // 检查是否已存在样式元素
  let styleElement = document.getElementById('ldesign-theme-colors')

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'ldesign-theme-colors'
    document.head.appendChild(styleElement)
  }

  styleElement.textContent = css
}
