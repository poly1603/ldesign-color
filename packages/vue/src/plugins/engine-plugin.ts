/**
 * Vue 3 Color Theme Engine 插件
 *
 * 将 Vue Color Theme 功能集成到 LDesign Engine 中
 * 
 * @module plugins/engine-plugin
 */

import type { Plugin } from '@ldesign/engine-core/types'
import { BaseThemeAdapter, getPresetColor } from '@ldesign/color-core'
import type { ThemeAdapterOptions, PresetTheme } from '@ldesign/color-core'
import type { PresetThemeName } from '@ldesign/color-core/types'
import { createColorPlugin } from '../plugin/index'
import { COLOR_SYMBOL } from '../constants'

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题预设名称
 */
export type ThemePresetName =
  | 'blue' | 'cyan' | 'green' | 'orange' | 'red' | 'purple'
  | 'pink' | 'gray' | 'yellow' | 'teal' | 'indigo' | 'lime'
  | 'sunset' | 'forest' | 'midnight' | 'lavender' | 'coral'

/**
 * 主题预设配置
 */
export interface ThemePreset {
  /** 预设名称 */
  name: string
  /** 主题色 */
  primaryColor: string
  /** 是否启用 */
  enabled?: boolean
  /** 自定义标签 */
  label?: string
  /** 自定义图标 */
  icon?: string
}

/**
 * 主题预设管理配置
 */
export interface ThemePresetsConfig {
  /** 启用的预设列表（如果为空，启用所有） */
  enabled?: ThemePresetName[]
  /** 禁用的预设列表 */
  disabled?: ThemePresetName[]
  /** 自定义预设 */
  custom?: ThemePreset[]
  /** 是否允许用户添加自定义主题 */
  allowCustom?: boolean
  /** 最大自定义主题数量 */
  maxCustomThemes?: number
}

/**
 * 主题持久化配置
 */
export interface ThemePersistenceConfig {
  /** 是否启用持久化 */
  enabled?: boolean
  /** 存储键名 */
  key?: string
  /** 存储类型 */
  storage?: 'localStorage' | 'sessionStorage' | 'cookie'
  /** 是否持久化主题模式 */
  persistMode?: boolean
  /** 是否持久化主题色 */
  persistColor?: boolean
  /** 是否持久化自定义主题 */
  persistCustomThemes?: boolean
}

/**
 * 主题过渡动画配置
 */
export interface ThemeTransitionConfig {
  /** 是否启用过渡动画 */
  enabled?: boolean
  /** 过渡持续时间（毫秒） */
  duration?: number
  /** 缓动函数 */
  easing?: string
  /** 过渡属性 */
  properties?: string[]
}

/**
 * 主题 CSS 变量配置
 */
export interface ThemeCSSVariablesConfig {
  /** 是否启用 CSS 变量 */
  enabled?: boolean
  /** CSS 变量前缀 */
  prefix?: string
  /** 是否生成色阶 */
  generateShades?: boolean
  /** 色阶数量 */
  shadeCount?: number
  /** 自定义 CSS 变量映射 */
  customVariables?: Record<string, string>
}

/**
 * 主题国际化配置
 */
export interface ThemeI18nConfig {
  /** 是否启用国际化 */
  enabled?: boolean
  /** 当前语言 */
  locale?: string
  /** 是否使用外部 i18n */
  useExternalI18n?: boolean
  /** 自定义翻译 */
  customMessages?: Record<string, Record<string, any>>
}

/**
 * 主题性能配置
 */
export interface ThemePerformanceConfig {
  /** 是否启用缓存 */
  cache?: boolean
  /** 缓存大小 */
  cacheSize?: number
  /** 是否启用防抖 */
  debounce?: boolean
  /** 防抖延迟（毫秒） */
  debounceDelay?: number
  /** 是否启用节流 */
  throttle?: boolean
  /** 节流间隔（毫秒） */
  throttleInterval?: number
}

/**
 * 主题选择器配置
 */
export interface ThemePickerConfig {
  /** 是否显示主题选择器 */
  show?: boolean
  /** 选择器位置 */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom'
  /** 自定义位置 */
  customPosition?: { top?: string; right?: string; bottom?: string; left?: string }
  /** 是否显示预设主题 */
  showPresets?: boolean
  /** 是否显示自定义颜色选择器 */
  showCustomPicker?: boolean
  /** 是否显示主题模式切换器 */
  showModeSwitcher?: boolean
}

/**
 * Color Engine 插件完整配置选项
 */
export interface ColorEnginePluginOptions extends Omit<ThemeAdapterOptions, 'primaryColor'> {
  // ========== 基础配置 ==========
  /** 插件名称 */
  name?: string
  /** 插件版本 */
  version?: string

  /**
   * 主题色
   *
   * 支持两种类型：
   * 1. 具体色值：如 '#1890ff'、'rgb(24, 144, 255)' 等
   * 2. 预设主题色名称：如 'blue'、'purple'、'cyan' 等
   *
   * @example
   * ```ts
   * // 方式 1：使用具体色值
   * primaryColor: '#1890ff'
   *
   * // 方式 2：使用预设主题色名称（有代码提示）
   * primaryColor: 'blue' // IDE 会提示所有可用的预设名称
   * ```
   */
  primaryColor?: string | PresetThemeName

  /** 主题模式 */
  // mode?: ThemeMode (已在 ThemeAdapterOptions 中定义)
  /** 初始主题名称 */
  // themeName?: string (已在 ThemeAdapterOptions 中定义)

  // ========== 预设配置 ==========
  /** 主题预设管理 */
  presets?: ThemePresetsConfig

  /**
   * 自定义预设主题色数组
   *
   * 用于扩展或覆盖内置预设主题色。如果自定义预设的 name 与内置预设重复，
   * 自定义预设将覆盖内置预设。
   *
   * @example
   * ```ts
   * customPresets: [
   *   {
   *     name: 'brand-primary',
   *     label: '品牌主色',
   *     color: '#FF6B6B',
   *     description: '公司品牌主色调',
   *     order: 1, // 排在第一位
   *   },
   *   {
   *     name: 'brand-secondary',
   *     label: '品牌辅色',
   *     color: '#4ECDC4',
   *     description: '公司品牌辅助色',
   *     order: 2,
   *   },
   * ]
   * ```
   */
  customPresets?: PresetTheme[]

  // ========== 持久化配置 ==========
  /** 持久化配置（扩展 ThemeAdapterOptions 中的 persistence） */
  persistence?: ThemePersistenceConfig

  // ========== 动画配置 ==========
  /** 过渡动画配置 */
  transition?: ThemeTransitionConfig

  // ========== CSS 变量配置 ==========
  /** CSS 变量配置 */
  cssVariables?: ThemeCSSVariablesConfig

  // ========== 国际化配置 ==========
  /** 国际化配置 */
  i18n?: ThemeI18nConfig

  // ========== 性能配置 ==========
  /** 性能配置 */
  performance?: ThemePerformanceConfig

  // ========== UI 组件配置 ==========
  /** 主题选择器配置 */
  picker?: ThemePickerConfig

  // ========== Vue 集成配置 ==========
  /** 是否注册全局属性 */
  globalProperties?: boolean
  /** 是否注册全局组件 */
  globalComponents?: boolean
  /** 要注册的组件列表 */
  components?: Array<'ThemeColorPicker' | 'ThemeModeSwitcher' | 'ThemeProvider'>

  // ========== 调试配置 ==========
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否启用性能监控 */
  performanceMonitoring?: boolean

  // ========== 扩展配置 ==========
  /** 自定义元数据 */
  meta?: Record<string, any>
  /** 自定义钩子 */
  hooks?: {
    onBeforeInstall?: () => void | Promise<void>
    onAfterInstall?: () => void | Promise<void>
    onThemeChange?: (theme: any) => void
    onModeChange?: (mode: ThemeMode) => void
  }
}

/**
 * Color 预设配置
 */
export const ColorPresets = {
  /** 基础配置 */
  basic: {
    // primaryColor: '#1890ff', // 需要用户提供
    // mode: 'light' as ThemeMode,
    persistence: { enabled: true },
  },
  /** 完整功能配置 */
  full: {
    // primaryColor: '#1890ff',
    // mode: 'auto' as ThemeMode,
    presets: { allowCustom: true, maxCustomThemes: 10 },
    persistence: { enabled: true, persistMode: true, persistColor: true },
    transition: { enabled: true, duration: 300 },
    cssVariables: { enabled: true, generateShades: true },
    i18n: { enabled: true, useExternalI18n: true },
  },
  /** 高性能配置 */
  performance: {
    // primaryColor: '#1890ff',
    // mode: 'light' as ThemeMode,
    performance: { cache: true, debounce: true, throttle: true },
    transition: { enabled: false },
  },
  /** 开发配置 */
  development: {
    // primaryColor: '#1890ff',
    // mode: 'light' as ThemeMode,
    debug: true,
    performanceMonitoring: true,
  },
}

/**
 * Engine 接口（简化版）
 */
interface EngineLike {
  logger?: {
    info?: (...args: any[]) => void
    warn?: (...args: any[]) => void
    error?: (...args: any[]) => void
  }
  events?: {
    once?: (event: string, cb: () => void) => void
    emit?: (event: string, payload?: any) => void
    on?: (event: string, cb: (payload?: any) => void) => void
    off?: (event: string, cb?: (payload?: any) => void) => void
  }
  getApp?: () => any
  state?: {
    set?: (k: string, v: any) => void
    get?: (k: string) => any
    delete?: (k: string) => void
  }
  color?: BaseThemeAdapter
  setColor?: (color: BaseThemeAdapter) => void
}

/**
 * 创建 Vue 3 Color Theme Engine 插件
 *
 * @param options - 插件配置选项
 * @returns Engine 插件实例
 * 
 * @example
 * ```typescript
 * const colorPlugin = createColorEnginePlugin({
 *   primaryColor: '#1890ff',
 *   mode: 'light',
 *   persistence: {
 *     enabled: true,
 *     key: 'app-theme',
 *   }
 * })
 * 
 * engine.use(colorPlugin)
 * ```
 */
export function createColorEnginePlugin(
  options: ColorEnginePluginOptions = {},
): Plugin {
  const {
    name = 'color',
    version = '1.0.0',
    debug = false,
    globalProperties = true,
    globalComponents = true,
    primaryColor,
    customPresets,
    ...themeOptions
  } = options

  if (debug) {
    console.log('[Vue Color Plugin] createColorEnginePlugin called with options:', options)
  }

  // 处理 primaryColor：如果是预设名称，转换为实际颜色值
  let resolvedPrimaryColor = primaryColor
  if (primaryColor && typeof primaryColor === 'string') {
    // 尝试从预设中获取颜色值
    const presetColor = getPresetColor(primaryColor)
    if (presetColor) {
      resolvedPrimaryColor = presetColor
      if (debug) {
        console.log(`[Vue Color Plugin] Resolved preset '${primaryColor}' to color '${presetColor}'`)
      }
    }
  }

  // 标志，防止重复安装到 Vue 应用
  let vueInstalled = false

  return {
    name,
    version,
    dependencies: [],

    async install(context: any) {
      try {
        console.log('[Vue Color Plugin] ========== install method called ==========')
        if (debug) {
          console.log('[Vue Color Plugin] install method called with context:', context)
        }

        const engine: EngineLike = context?.engine || context

        if (!engine) {
          throw new Error('Engine instance not found in context')
        }

        engine.logger?.info?.('Installing Vue color theme plugin...', {
          version,
        })

        // 创建主题适配器实例（自动初始化）
        const themeAdapter = new BaseThemeAdapter({
          ...themeOptions,
          primaryColor: resolvedPrimaryColor,
          customPresets,
        })

        // ========== 跨插件通信：i18n 集成 ==========

        // 1. 尝试从容器获取 i18n 实例（可选依赖）
        let i18nInstance: any = null
        try {
          const container = context?.container || (engine as any).container
          if (container && typeof container.has === 'function' && container.has('i18n')) {
            i18nInstance = container.resolve('i18n')
            if (debug) {
              console.log('[Color] Found i18n instance from container, will use external i18n')
            }
          }
        } catch (error) {
          if (debug) {
            console.log('[Color] No i18n instance found in container, using built-in locales')
          }
        }

        // 2. 获取初始语言（优先使用 i18n 实例，否则使用状态，最后使用默认值）
        let initialLocale = 'zh-CN'
        if (i18nInstance && typeof i18nInstance.getLocale === 'function') {
          initialLocale = i18nInstance.getLocale()
        } else if (engine.state?.get) {
          initialLocale = engine.state.get('i18n:locale') || 'zh-CN'
        }

        if (debug) {
          console.log('[Color] Initial locale:', initialLocale)
        }

        // 3. 设置初始语言到 themeAdapter（如果 themeAdapter 支持）
        // 注意：当前 BaseThemeAdapter 还没有 setLocale 方法，这是为未来扩展预留
        if (typeof (themeAdapter as any).setLocale === 'function') {
          (themeAdapter as any).setLocale(initialLocale)
        }

        // 4. 监听语言变化事件（响应式更新）
        if (engine.events?.on) {
          engine.events.on('i18n:localeChanged', (payload: any) => {
            const locale = payload?.locale || payload
            if (debug) {
              console.log('[Color] Locale changed to:', locale)
            }
            // 更新 themeAdapter 的语言（如果支持）
            if (typeof (themeAdapter as any).setLocale === 'function') {
              (themeAdapter as any).setLocale(locale)
            }
          })
        }

        // 获取当前主题状态
        const currentTheme = themeAdapter.getCurrentTheme()

        // 保存主题配置到状态
        engine.state?.set?.('color:primaryColor', currentTheme?.primaryColor || '')
        engine.state?.set?.('color:themeName', currentTheme?.themeName || '')

        // 监听主题变化事件
        themeAdapter.onChange((theme) => {
          engine.logger?.info?.('Theme changed:', theme)
          engine.state?.set?.('color:primaryColor', theme?.primaryColor || '')
          engine.state?.set?.('color:themeName', theme?.themeName || '')
          engine.events?.emit?.('color:themeChanged', theme)
        })

        // 将 themeAdapter 暴露到 engine
        if (typeof engine.setColor === 'function') {
          engine.setColor(themeAdapter)
        } else {
          (engine as any).color = themeAdapter
        }

        // 注册 color 服务到容器（与 router 和 i18n 保持一致）
        try {
          const container = context?.container || (engine as any).container
          if (container && typeof container.singleton === 'function') {
            container.singleton('color', themeAdapter)
            if (debug) {
              console.log('[Color] Color service registered to container')
            }
          }
        } catch (error) {
          if (debug) {
            console.log('[Color] Failed to register color service to container:', error)
          }
        }

        // 安装到 Vue 应用
        const app = engine.getApp?.()

        console.log('[Color] Checking Vue app:', { hasApp: !!app, vueInstalled })

        if (app && !vueInstalled) {
          console.log('[Color] Vue app already exists, installing immediately')
          // 使用 Vue Color Plugin（会自动 provide themeAdapter 实例）
          const vuePlugin = createColorPlugin({
            globalProperties,
            globalComponents,
            primaryColor: resolvedPrimaryColor,
            customPresets,
            ...themeOptions,
          })
          app.use(vuePlugin)
          vueInstalled = true
        }
        else if (!vueInstalled) {
          console.log('[Color] Vue app not ready, waiting for app:created event')
          // 如果应用还未创建，等待应用创建事件
          engine.events?.once?.('app:created', () => {
            if (vueInstalled) {
              console.log('[Color] color already installed to Vue app, skipping')
              return
            }

            console.log('[Color] Installing color to Vue app')
            const app = engine.getApp?.()
            if (app) {
              const vuePlugin = createColorPlugin({
                globalProperties,
                globalComponents,
                primaryColor: resolvedPrimaryColor,
                customPresets,
                ...themeOptions,
              })
              app.use(vuePlugin)
              vueInstalled = true
              console.log('[Color] color installed to Vue app')
            }
            else {
              console.error('[Color] Vue app not found after app:created event')
            }
          })
        }

        engine.logger?.info?.('Vue color theme plugin installed successfully')
      }
      catch (error) {
        console.error('[Vue Color Plugin] Error during installation:', error)
        const eng: EngineLike = context?.engine || context
        eng?.logger?.error?.('Failed to install Vue color theme plugin:', error)
        throw error
      }
    },

    async uninstall(context: any) {
      const engine: EngineLike = context?.engine || context
      engine.logger?.info?.('Uninstalling Vue color theme plugin...')

      // 清理状态
      engine.state?.delete?.('color:primaryColor')
      engine.state?.delete?.('color:themeName')

      // 销毁主题适配器
      if (engine.color) {
        engine.color.destroy()
      }

      engine.logger?.info?.('Vue color theme plugin uninstalled')
    },
  }
}

export default createColorEnginePlugin
