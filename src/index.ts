/**
 * @ldesign/color - 高性能颜色生成和管理库
 *
 * 特性：
 * - 基于主色调自动生成语义化颜色（success, warning, danger, gray）
 * - 支持明暗模式的12/14色阶生成
 * - 高性能优化：Web Worker、缓存、防抖
 * - Vue 3 组合式API和组件支持
 * - TypeScript 完整类型支持
 * - CSS变量自动生成和注入
 */

// 核心类导入和导出
import { ColorGenerator } from './core/ColorGenerator'
import { generateRandomColor } from './utils/colorUtils'

export { CSSVariableGenerator } from './core/CSSVariableGenerator'
export { PaletteGenerator } from './core/PaletteGenerator'
export { SemanticColorGenerator } from './core/SemanticColorGenerator'
export { ColorGenerator }

// 工具函数导出
export { CacheKeyGenerator, globalCacheManager, LRUCache, MemoryCacheManager } from './utils/cacheUtils'
export * from './utils/colorUtils'
export {
  AsyncQueue,
  BatchProcessor,
  debounce,
  MemoryMonitor,
  PerformanceMonitor,
  runInIdleTime,
  throttle
} from './utils/performanceUtils'

// Vue相关导出
export {
  useBatchColor,
  useColor,
  useColorAnalysis,
  useHighPerformanceColor,
  useSimpleColor,
  useThemeSwitch
} from './vue/useColor'

export {
  ColorPalette as ColorPaletteComponent,
  ColorPicker,
  ColorProvider,
  ColorThemeKey,
  ThemePreview,
  useColorTheme
} from './vue/ColorProvider'

// 预设主题管理器导出
export {
  createPresetThemeManager, DEFAULT_PRESET_THEMES, globalPresetThemeManager, PresetThemeManager
} from './core/PresetThemeManager'

// 类型定义导出
export type {
  CacheItem,
  ColorAnalysis,
  ColorContrast,
  ColorFormat,
  ColorGeneratorConfig,
  ColorPalette,
  ColorPalettes,
  GeneratedTheme,
  HSLColor,
  HSVColor,
  PaletteOptions,
  PerformanceMetrics,
  RGBColor,
  SemanticColors,
  WorkerMessage,
  WorkerResponse
} from './types'

/**
 * 创建默认的颜色生成器实例
 */
export function createColorGenerator(config?: import('./types').ColorGeneratorConfig) {
  return new ColorGenerator(config)
}

/**
 * 快速生成主题的便捷函数
 */
export function generateTheme(primaryColor: string, config?: import('./types').ColorGeneratorConfig) {
  const generator = createColorGenerator(config)
  return generator.generate(primaryColor)
}

/**
 * 异步生成主题的便捷函数
 */
export async function generateThemeAsync(primaryColor: string, config?: import('./types').ColorGeneratorConfig) {
  const generator = createColorGenerator(config)
  return await generator.generateAsync(primaryColor)
}

/**
 * 批量生成主题的便捷函数
 */
export async function batchGenerateThemes(colors: string[], config?: import('./types').ColorGeneratorConfig) {
  const generator = createColorGenerator(config)
  return await generator.batchGenerate(colors)
}

/**
 * 预设的颜色配置
 */
export const presetConfigs = {
  /**
   * 高性能配置 - 启用所有优化
   */
  highPerformance: {
    enableCache: true,
    cacheSize: 200,
    useWebWorker: true,
    autoInject: true,
  } as import('./types').ColorGeneratorConfig,

  /**
   * 简单配置 - 基础功能
   */
  simple: {
    enableCache: true,
    cacheSize: 50,
    useWebWorker: false,
    autoInject: true,
  } as import('./types').ColorGeneratorConfig,

  /**
   * 开发配置 - 适合开发环境
   */
  development: {
    enableCache: false,
    cacheSize: 10,
    useWebWorker: false,
    autoInject: true,
  } as import('./types').ColorGeneratorConfig,

  /**
   * 生产配置 - 适合生产环境
   */
  production: {
    enableCache: true,
    cacheSize: 500,
    useWebWorker: true,
    autoInject: true,
  } as import('./types').ColorGeneratorConfig,
}

/**
 * 常用的预设颜色
 */
export const presetColors = {
  // 蓝色系
  blue: '#1890ff',
  lightBlue: '#40a9ff',
  darkBlue: '#096dd9',

  // 绿色系
  green: '#52c41a',
  lightGreen: '#73d13d',
  darkGreen: '#389e0d',

  // 红色系
  red: '#f5222d',
  lightRed: '#ff4d4f',
  darkRed: '#cf1322',

  // 橙色系
  orange: '#fa541c',
  lightOrange: '#ff7a45',
  darkOrange: '#d4380d',

  // 紫色系
  purple: '#722ed1',
  lightPurple: '#9254de',
  darkPurple: '#531dab',

  // 青色系
  cyan: '#13c2c2',
  lightCyan: '#36cfc9',
  darkCyan: '#08979c',

  // 黄色系
  yellow: '#faad14',
  lightYellow: '#ffc53d',
  darkYellow: '#d48806',

  // 粉色系
  pink: '#eb2f96',
  lightPink: '#f759ab',
  darkPink: '#c41d7f',

  // 灰色系
  gray: '#8c8c8c',
  lightGray: '#bfbfbf',
  darkGray: '#595959',
}

/**
 * 工具函数：验证颜色值
 */
export async function validateColor(color: string): Promise<boolean> {
  const utils = await import('./utils/colorUtils')
  return utils.isValidColor(color)
}

/**
 * 工具函数：获取颜色分析
 */
export async function analyzeColor(color: string) {
  const utils = await import('./utils/colorUtils')
  return utils.analyzeColor(color)
}

// generateRandomColor 从 colorUtils 导入，不需要重复定义

/**
 * 默认导出 - 包含最常用的功能
 */
const ldesignColor = {
  // 核心功能
  ColorGenerator,
  createColorGenerator,
  generateTheme,
  generateThemeAsync,
  batchGenerateThemes,

  // 预设配置
  presetConfigs,
  presetColors,

  // 工具函数
  generateRandomColor,
}

export default ldesignColor

/**
 * 版本信息
 */
export const version = '1.0.0'

/**
 * 库信息
 */
export const info = {
  name: '@ldesign/color',
  version,
  description: '高性能颜色生成和管理库',
  author: 'LDesign Team',
  license: 'MIT',
}
