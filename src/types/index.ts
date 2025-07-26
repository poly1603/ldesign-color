/**
 * 颜色格式类型
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv'

/**
 * HSL颜色值类型 [色相, 饱和度, 亮度]
 */
export type HSLColor = [number, number, number]

/**
 * RGB颜色值类型 [红, 绿, 蓝]
 */
export type RGBColor = [number, number, number]

/**
 * HSV颜色值类型 [色相, 饱和度, 明度]
 */
export type HSVColor = [number, number, number]

/**
 * 语义化颜色类型
 */
export interface SemanticColors {
  /** 主色调 */
  primary: string
  /** 成功色 */
  success: string
  /** 警告色 */
  warning: string
  /** 危险色 */
  danger: string
  /** 灰色 */
  gray: string
}

/**
 * 颜色色阶类型
 */
export interface ColorPalette {
  /** 主色调12色阶 */
  primary: string[]
  /** 成功色12色阶 */
  success: string[]
  /** 警告色12色阶 */
  warning: string[]
  /** 危险色12色阶 */
  danger: string[]
  /** 灰色14色阶 */
  gray: string[]
}

/**
 * 完整的颜色色阶（包含明暗模式）
 */
export interface ColorPalettes {
  /** 明亮模式色阶 */
  light: ColorPalette
  /** 暗黑模式色阶 */
  dark: ColorPalette
}

/**
 * 生成的主题数据
 */
export interface GeneratedTheme {
  /** 语义化颜色 */
  semanticColors: SemanticColors
  /** 颜色色阶 */
  palettes: ColorPalettes
  /** CSS变量字符串 */
  cssVariables: string
  /** 生成时间戳 */
  timestamp: number
  /** CSS生成器实例 */
  cssGenerator?: any
}

/**
 * 色阶生成选项
 */
export interface PaletteOptions {
  /** 颜色格式 */
  format?: ColorFormat
  /** 是否生成暗黑模式 */
  includeDark?: boolean
  /** 自定义色阶数量 */
  customSteps?: {
    primary?: number
    success?: number
    warning?: number
    danger?: number
    gray?: number
  }
}

/**
 * 颜色生成器配置
 */
export interface ColorGeneratorConfig {
  /** 是否启用缓存 */
  enableCache?: boolean
  /** 缓存大小限制 */
  cacheSize?: number
  /** 是否使用Web Worker */
  useWebWorker?: boolean
  /** CSS变量前缀 */
  cssPrefix?: string
  /** 是否自动注入CSS变量 */
  autoInject?: boolean
  /** 是否在灰色中混入主色调 */
  grayMixPrimary?: boolean
  /** 主色调混入比例 (0-1) */
  grayMixRatio?: number
  /** 语义化颜色名称映射 */
  semanticNames?: {
    primary?: string
    success?: string
    warning?: string
    danger?: string
    gray?: string
  }
}

/**
 * 预设主题类型
 */
export interface PresetTheme {
  /** 主题名称 */
  name: string
  /** 主题颜色 */
  color: string
  /** 主题描述 */
  description?: string
  /** 是否启用 */
  enabled?: boolean
}

/**
 * 缓存项类型
 */
export interface CacheItem<T = any> {
  /** 缓存值 */
  value: T
  /** 创建时间 */
  timestamp: number
  /** 访问次数 */
  accessCount: number
  /** 最后访问时间 */
  lastAccess: number
}

/**
 * Web Worker 消息类型
 */
export interface WorkerMessage {
  /** 消息ID */
  id: string
  /** 消息类型 */
  type: 'generatePalettes' | 'generateSemanticColors'
  /** 消息数据 */
  data: any
}

/**
 * Web Worker 响应类型
 */
export interface WorkerResponse {
  /** 消息ID */
  id: string
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data?: any
  /** 错误信息 */
  error?: string
}

/**
 * 颜色对比度信息
 */
export interface ColorContrast {
  /** 对比度比值 */
  ratio: number
  /** 是否符合WCAG AA标准 */
  aa: boolean
  /** 是否符合WCAG AAA标准 */
  aaa: boolean
}

/**
 * 颜色分析结果
 */
export interface ColorAnalysis {
  /** 颜色值 */
  color: string
  /** HSL值 */
  hsl: HSLColor
  /** RGB值 */
  rgb: RGBColor
  /** HSV值 */
  hsv: HSVColor
  /** 亮度值 */
  luminance: number
  /** 是否为深色 */
  isDark: boolean
  /** 与白色的对比度 */
  contrastWithWhite: ColorContrast
  /** 与黑色的对比度 */
  contrastWithBlack: ColorContrast
}

/**
 * 性能监控数据
 */
export interface PerformanceMetrics {
  /** 语义化颜色生成耗时 */
  semanticColorGeneration: number
  /** 色阶生成耗时 */
  paletteGeneration: number
  /** CSS变量生成耗时 */
  cssVariableGeneration: number
  /** 总耗时 */
  totalTime: number
  /** 缓存命中率 */
  cacheHitRate: number
}
