/**
 * Vue 3 Color Theme Engine 插件
 *
 * 将 Vue Color Theme 功能集成到 LDesign Engine 中
 *
 * @module plugins/engine-plugin
 */

import type { Plugin } from '@ldesign/engine-core/types'
import { BaseThemeAdapter, setThemeMode } from '@ldesign/color-core'
import type { ThemeAdapterOptions, PresetTheme } from '@ldesign/color-core'
import { createColorPlugin } from '../plugin/index'
import { COLOR_SYMBOL, COLOR_CONFIG_SYMBOL } from '../constants'

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
 * 自定义主题色预设 (带多语言支持)
 */
export interface CustomColorPreset {
  /** 预设唯一名称 */
  name: string
  /** 颜色值 */
  color: string
  /** 多语言标签和描述 */
  i18n: {
    zh: { label: string; description: string }
    en: { label: string; description: string }
  }
}

/**
 * 主题色选择器配置
 */
export interface ColorPickerConfig {
  /** 禁用的内置主题色 (通过 name 禁用) */
  disabledPresets?: string[]
  /** 自定义主题色 (会追加到内置列表) */
  customPresets?: CustomColorPreset[]
  /** 是否只使用自定义主题色 (不显示内置的) */
  useOnlyCustom?: boolean
  /** 样式配置 */
  style?: {
    /** 弹窗宽度 */
    width?: string
    /** 列表最大高度 */
    maxHeight?: string
  }
}

/**
 * 主题模式选择器配置
 */
export interface ModeSwitcherConfig {
  /** 可用的模式 (默认全部可用) */
  modes?: ThemeMode[]
  /** 样式配置 */
  style?: {
    /** 弹窗最小宽度 */
    minWidth?: string
  }
}

/**
 * 插件上下文 - 用于 onReady 钩子
 */
export interface ColorPluginContext {
  /** 设置主题色 */
  setColor: (color: string) => void
  /** 设置主题模式 */
  setMode: (mode: ThemeMode) => void
  /** 获取当前主题色 */
  getColor: () => string
  /** 获取当前主题模式 */
  getMode: () => ThemeMode
  /** 主题适配器实例 */
  adapter: BaseThemeAdapter
}

/**
 * Color Engine 插件选项
 */
export interface ColorEnginePluginOptions extends Partial<ThemeAdapterOptions> {
  /** 插件名称 */
  name?: string
  /** 插件版本 */
  version?: string
  /** 是否启用调试模式 */
  debug?: boolean
  /** 是否注册全局属性 */
  globalProperties?: boolean
  /** 是否注册全局组件 */
  globalComponents?: boolean
  /** 主题色（支持色值或预设名称） */
  primaryColor?: string
  /** 主题模式 */
  mode?: ThemeMode
  /** 自定义预设主题数组 */
  customPresets?: PresetTheme[]
  /** 持久化配置 */
  persistence?: {
    enabled?: boolean
    key?: string
    storage?: 'localStorage' | 'sessionStorage'
  }

  // ==================== 新增配置 ====================

  /** 主题色选择器配置 */
  colorPicker?: ColorPickerConfig
  /** 主题模式选择器配置 */
  modeSwitcher?: ModeSwitcherConfig

  // ==================== 事件回调 ====================

  /** 主题色变化回调 */
  onColorChange?: (color: string, oldColor: string) => void | Promise<void>
  /** 主题模式变化回调 */
  onModeChange?: (mode: ThemeMode, oldMode: ThemeMode) => void | Promise<void>

  // ==================== 生命周期钩子 ====================

  /** 初始化完成钩子 - 可用于从服务器获取用户配置 */
  onReady?: (context: ColorPluginContext) => void | Promise<void>
}

/**
 * 创建 Color Engine 插件
 *
 * @param options - 插件选项
 * @returns LDesign Engine 插件
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
    mode = 'auto',
    customPresets,
    persistence,
    colorPicker,
    modeSwitcher,
    onColorChange,
    onModeChange,
    onReady,
    ...adapterOptions
  } = options

  if (debug) {
    console.log('[Color Engine Plugin] Creating plugin with options:', options)
  }

  // ==================== 持久化配置 ====================
  const STORAGE_KEY = persistence?.key || 'ldesign-theme'
  const storageType = persistence?.storage || 'localStorage'
  const persistenceEnabled = persistence?.enabled !== false // 默认启用

  // 从 Storage 读取
  const loadFromStorage = (): { color?: string; mode?: ThemeMode } | null => {
    if (!persistenceEnabled) return null
    try {
      const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage
      const data = storage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  // 保存到 Storage
  const saveToStorage = (color: string, themeMode: ThemeMode) => {
    if (!persistenceEnabled) return
    try {
      const storage = storageType === 'sessionStorage' ? sessionStorage : localStorage
      storage.setItem(STORAGE_KEY, JSON.stringify({ color, mode: themeMode }))
    } catch (e) {
      console.warn('[Color Engine Plugin] Failed to save to storage:', e)
    }
  }

  // ==================== 初始化状态 ====================
  // 优先级: Storage > options
  const storedData = loadFromStorage()
  let currentColor = storedData?.color || primaryColor || '#1890ff'
  let currentMode: ThemeMode = storedData?.mode || mode

  // 创建适配器
  const themeAdapter = new BaseThemeAdapter({
    ...adapterOptions,
    primaryColor: currentColor,
    mode: currentMode,
    customPresets,
    persistence,
  })

  // 包装 applyTheme 以触发回调和持久化
  const originalApplyTheme = themeAdapter.applyTheme.bind(themeAdapter)
    ; (themeAdapter as any).applyTheme = async (color: string, themeOptions?: any) => {
      const oldColor = currentColor
      currentColor = color
      const result = await originalApplyTheme(color, themeOptions)

      // 保存到 Storage
      saveToStorage(color, currentMode)

      // 触发回调
      if (onColorChange && oldColor !== color) {
        try {
          await onColorChange(color, oldColor)
        } catch (e) {
          console.error('[Color Engine Plugin] onColorChange error:', e)
        }
      }
      return result
    }

  // 包装 setThemeMode 以触发回调和持久化
  const wrappedSetMode = async (newMode: ThemeMode) => {
    const oldMode = currentMode
    currentMode = newMode
    setThemeMode(newMode)

    // 保存到 Storage
    saveToStorage(currentColor, newMode)

    // 触发回调
    if (onModeChange && oldMode !== newMode) {
      try {
        await onModeChange(newMode, oldMode)
      } catch (e) {
        console.error('[Color Engine Plugin] onModeChange error:', e)
      }
    }
  }

  // 创建插件上下文
  const pluginContext: ColorPluginContext = {
    setColor: (color: string) => themeAdapter.applyTheme(color),
    setMode: wrappedSetMode,
    getColor: () => currentColor,
    getMode: () => currentMode,
    adapter: themeAdapter,
  }

  // 创建 Vue 插件
  const vuePlugin = createColorPlugin({
    globalProperties,
    globalComponents,
    primaryColor,
    customPresets,
  })

  // 标记 Vue 插件是否已安装
  let vueInstalled = false

  // 安装到 Vue 应用的公共函数
  const installToVueApp = async (app: any) => {
    if (vueInstalled) return

    // 提供适配器实例
    app.provide(COLOR_SYMBOL, themeAdapter)

    // 提供插件配置 (供组件读取)
    app.provide(COLOR_CONFIG_SYMBOL, options)

    // 安装 Vue 插件
    try {
      app.use(vuePlugin)
      vueInstalled = true
      console.log('[Color Engine Plugin] Vue plugin installed')

      // 触发 onReady 钩子
      if (onReady) {
        try {
          await onReady(pluginContext)
          if (debug) {
            console.log('[Color Engine Plugin] onReady hook executed')
          }
        } catch (e) {
          console.error('[Color Engine Plugin] onReady error:', e)
        }
      }
    } catch (error) {
      console.error('[Color Engine Plugin] Error installing Vue plugin:', error)
    }
  }

  // 返回 Engine 插件
  return {
    name,
    version,

    /**
     * 安装插件
     */
    async install(context: any) {
      if (debug) {
        console.log(`[Color Engine Plugin] Installing plugin: ${name}`)
      }

      // 兼容 Engine Core 的插件上下文
      const engine: any = context?.engine || context

      // 1. 注册到 Engine 状态
      if (engine?.state) {
        engine.state.set(`plugins.${name}`, themeAdapter)
        engine.state.set(`plugins.${name}.config`, options)
      }

      // 注册 Color API 到 API 注册表
      if (engine?.api) {
        const colorAPI = {
          name: 'color',
          version: version || '1.0.0',
          applyTheme: (color: string) => themeAdapter.applyTheme(color),
          getCurrentTheme: () => themeAdapter.getCurrentTheme(),
          setMode: wrappedSetMode,
          getPresets: () => themeAdapter.getPresets(),
          getState: () => themeAdapter.getState(),
          getConfig: () => options,
          context: pluginContext,
        }
        engine.api.register(colorAPI)
        if (debug) {
          console.log('[Color Engine Plugin] Color API registered to API registry')
        }
      }

      // 3. 安装到 Vue 应用
      const app = engine?.getApp?.() || context?.framework?.app

      console.log('[Color] Checking Vue app:', { hasApp: !!app, vueInstalled })

      if (app && !vueInstalled) {
        console.log('[Color] Vue app already exists, installing immediately')
        await installToVueApp(app)
      }
      else if (!vueInstalled) {
        console.log('[Color] Vue app not ready, waiting for app:created event')
        // 如果应用还未创建，等待应用创建事件
        engine?.events?.once?.('app:created', async () => {
          if (vueInstalled) {
            console.log('[Color] color already installed to Vue app, skipping')
            return
          }

          console.log('[Color] Installing color to Vue app')
          const app = engine?.getApp?.() || context?.framework?.app
          if (app) {
            await installToVueApp(app)
          }
          else {
            console.error('[Color] Vue app not found after app:created event')
          }
        })
      }

      if (debug) {
        console.log(`[Color Engine Plugin] Plugin installed: ${name}`)
      }
    },

    /**
     * 卸载插件
     */
    async uninstall(engine: any) {
      if (debug) {
        console.log(`[Color Engine Plugin] Uninstalling plugin: ${name}`)
      }

      // 销毁适配器
      if (themeAdapter.destroy) {
        themeAdapter.destroy()
      }

      // 从 Engine 状态中移除
      if (engine.state) {
        engine.state.delete(`plugins.${name}`)
      }

      // 注销 Color API
      if (engine?.api) {
        engine.api.unregister('color')
      }

      if (debug) {
        console.log(`[Color Engine Plugin] Plugin uninstalled: ${name}`)
      }
    },
  }
}

/**
 * 从 Engine 获取 Color 适配器
 */
export function useColorFromEngine(engine: any): BaseThemeAdapter | undefined {
  return engine?.state?.get?.('plugins.color')
}
