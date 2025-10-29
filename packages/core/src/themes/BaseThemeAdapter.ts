/**
 * @ldesign/color - 基础主题适配器
 *
 * 框架无关的主题管理基类，提供所有框架共享的核心逻辑。
 * 各框架包只需要提供响应式包装即可。
 *
 * @module themes/BaseThemeAdapter
 */

import type { ThemeOptions, ThemeState } from './themeManager'
import type { PresetTheme } from './presets'
import { ThemeManager } from './themeManager'
import { presetThemes } from './presets'

/**
 * 主题适配器状态
 */
export interface ThemeAdapterState {
  /** 当前主题 */
  currentTheme: ThemeState | null
  /** 预设主题列表 */
  presets: PresetTheme[]
  /** 是否加载中 */
  isLoading: boolean
  /** 主要颜色 */
  primaryColor: string
  /** 主题名称 */
  themeName: string
  /** 是否暗黑模式 */
  isDark: boolean
}

/**
 * 主题适配器选项
 */
export interface ThemeAdapterOptions extends ThemeOptions {
  /** 是否立即初始化 */
  immediate?: boolean
}

/**
 * 主题变更回调函数
 */
export type ThemeChangeCallback = (theme: ThemeState | null) => void

/**
 * 基础主题适配器
 *
 * 提供框架无关的主题管理核心逻辑，各框架包通过继承此类
 * 实现各自的响应式包装。
 *
 * @example
 * ```typescript
 * // 在 Vue/React/etc 中继承此类
 * class VueThemeAdapter extends BaseThemeAdapter {
 *   // 添加框架特定的响应式逻辑
 * }
 * ```
 */
export class BaseThemeAdapter {
  protected manager: ThemeManager
  protected state: ThemeAdapterState
  protected changeListeners: Set<ThemeChangeCallback> = new Set()
  protected unsubscribeManager?: () => void
  protected destroyed = false

  /**
   * 创建主题适配器
   *
   * @param options - 配置选项
   */
  constructor(options: ThemeAdapterOptions = {}) {
    this.manager = new ThemeManager(options)

    // 初始化状态
    this.state = {
      currentTheme: null,
      presets: presetThemes,
      isLoading: false,
      primaryColor: '',
      themeName: '',
      isDark: false,
    }

    // 立即初始化
    if (options.immediate !== false) {
      this.initialize()
    }
  }

  /**
   * 初始化主题
   *
   * 恢复或获取当前主题，并订阅主题变更。
   */
  protected initialize(): void {
    // 恢复或获取当前主题
    const theme = this.manager.getCurrentTheme() || this.manager.restore()
    if (theme) {
      this.updateState(theme)
    }

    // 订阅主题变更
    this.unsubscribeManager = this.manager.onChange((theme) => {
      this.updateState(theme)
      this.notifyListeners(theme)
    })
  }

  /**
   * 更新状态
   *
   * @param theme - 主题状态
   */
  protected updateState(theme: ThemeState | null): void {
    this.state.currentTheme = theme
    this.state.primaryColor = theme?.primaryColor || ''
    this.state.themeName = theme?.themeName || ''
    this.state.isDark = theme?.isDark || false
  }

  /**
   * 通知所有监听器
   *
   * @param theme - 主题状态
   */
  protected notifyListeners(theme: ThemeState | null): void {
    this.changeListeners.forEach((listener) => {
      try {
        listener(theme)
      }
      catch (error) {
        console.error('[BaseThemeAdapter] 主题变更监听器错误:', error)
      }
    })
  }

  /**
   * 应用主题
   *
   * @param colorOrName - 颜色值或预设主题名
   * @param themeOptions - 主题选项
   * @returns 主题状态
   *
   * @example
   * ```typescript
   * const theme = adapter.applyTheme('#667eea')
   * const presetTheme = adapter.applyTheme('blue')
   * ```
   */
  async applyTheme(colorOrName: string, themeOptions?: ThemeOptions): Promise<ThemeState> {
    if (this.destroyed) {
      throw new Error('[BaseThemeAdapter] 适配器已销毁')
    }

    this.state.isLoading = true

    try {
      const theme = this.manager.applyTheme(colorOrName, themeOptions)
      this.updateState(theme)
      return theme
    }
    finally {
      this.state.isLoading = false
    }
  }

  /**
   * 应用预设主题
   *
   * @param name - 预设主题名
   * @param themeOptions - 主题选项
   * @returns 主题状态
   *
   * @example
   * ```typescript
   * const theme = adapter.applyPresetTheme('blue')
   * ```
   */
  async applyPresetTheme(name: string, themeOptions?: ThemeOptions): Promise<ThemeState> {
    if (this.destroyed) {
      throw new Error('[BaseThemeAdapter] 适配器已销毁')
    }

    this.state.isLoading = true

    try {
      const theme = this.manager.applyPresetTheme(name, themeOptions)
      this.updateState(theme)
      return theme
    }
    finally {
      this.state.isLoading = false
    }
  }

  /**
   * 恢复主题
   *
   * 从存储中恢复之前保存的主题。
   *
   * @returns 主题状态，如果没有保存则返回 null
   */
  restoreTheme(): ThemeState | null {
    if (this.destroyed) {
      throw new Error('[BaseThemeAdapter] 适配器已销毁')
    }

    const theme = this.manager.restore()
    if (theme) {
      this.updateState(theme)
    }
    return theme
  }

  /**
   * 清除主题
   *
   * 清除当前主题并从存储中删除。
   */
  clearTheme(): void {
    if (this.destroyed) {
      throw new Error('[BaseThemeAdapter] 适配器已销毁')
    }

    this.manager.clear()
    this.updateState(null)
  }

  /**
   * 获取当前主题
   *
   * @returns 当前主题状态
   */
  getCurrentTheme(): ThemeState | null {
    if (this.destroyed) {
      throw new Error('[BaseThemeAdapter] 适配器已销毁')
    }

    const theme = this.manager.getCurrentTheme()
    if (theme) {
      this.updateState(theme)
    }
    return theme
  }

  /**
   * 订阅主题变更
   *
   * @param callback - 变更回调函数
   * @returns 取消订阅函数
   *
   * @example
   * ```typescript
   * const unsubscribe = adapter.onChange((theme) => {
   *   console.log('主题已更改:', theme)
   * })
   *
   * // 取消订阅
   * unsubscribe()
   * ```
   */
  onChange(callback: ThemeChangeCallback): () => void {
    this.changeListeners.add(callback)

    return () => {
      this.changeListeners.delete(callback)
    }
  }

  /**
   * 获取当前状态
   *
   * @returns 状态对象的副本
   */
  getState(): Readonly<ThemeAdapterState> {
    return { ...this.state }
  }

  /**
   * 销毁适配器
   *
   * 清理所有资源和监听器。
   */
  destroy(): void {
    if (this.destroyed) {
      return
    }

    // 取消订阅管理器
    if (this.unsubscribeManager) {
      this.unsubscribeManager()
      this.unsubscribeManager = undefined
    }

    // 销毁主题管理器
    if (this.manager && typeof this.manager.destroy === 'function') {
      this.manager.destroy()
    }

    // 清空监听器
    this.changeListeners.clear()

    // 标记为已销毁
    this.destroyed = true
  }

  /**
   * 检查是否已销毁
   *
   * @returns 是否已销毁
   */
  isDestroyed(): boolean {
    return this.destroyed
  }
}

