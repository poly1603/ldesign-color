/**
 * @ldesign/color - Theme Mode Manager
 * 
 * 管理主题模式（light/dark/auto）的核心逻辑
 * 支持系统主题检测、持久化存储、自动切换
 */

export type ThemeMode = 'light' | 'dark' | 'auto'
export type EffectiveTheme = 'light' | 'dark'

export interface ThemeModeOptions {
  /** 存储键名 */
  storageKey?: string
  /** 默认模式 */
  defaultMode?: ThemeMode
  /** 是否自动应用 */
  autoApply?: boolean
  /** 是否持久化 */
  persistence?: boolean
}

export interface ThemeModeState {
  /** 当前模式 */
  mode: ThemeMode
  /** 系统偏好 */
  systemPreference: EffectiveTheme
  /** 实际生效的主题 */
  effectiveTheme: EffectiveTheme
}

type ModeChangeCallback = (state: ThemeModeState) => void

const DEFAULT_STORAGE_KEY = 'ldesign-theme-mode'
const DEFAULT_MODE: ThemeMode = 'light'

/**
 * 主题模式管理器
 * 
 * 核心功能：
 * - 管理 light/dark/auto 三种模式
 * - 自动检测系统主题偏好
 * - 监听系统主题变化
 * - 持久化用户选择
 * - 自动应用 DOM 属性
 */
export class ThemeModeManager {
  private storageKey: string
  private persistence: boolean
  private currentMode: ThemeMode = DEFAULT_MODE
  private systemPreference: EffectiveTheme = 'light'
  private listeners: Set<ModeChangeCallback> = new Set()
  private systemMediaQuery?: MediaQueryList
  private systemMediaHandler?: (e: MediaQueryListEvent) => void
  private destroyed = false

  constructor(options: ThemeModeOptions = {}) {
    this.storageKey = options.storageKey || DEFAULT_STORAGE_KEY
    this.persistence = options.persistence !== false

    // 初始化系统偏好检测
    this.detectSystemPreference()
    this.setupSystemWatcher()

    // 恢复或应用默认模式
    if (options.autoApply !== false) {
      const restoredMode = this.restore()
      this.currentMode = restoredMode || options.defaultMode || DEFAULT_MODE
      this.applyMode(this.currentMode)
    }
  }

  /**
   * 获取当前模式
   */
  getMode(): ThemeMode {
    return this.currentMode
  }

  /**
   * 获取系统偏好
   */
  getSystemPreference(): EffectiveTheme {
    return this.systemPreference
  }

  /**
   * 获取实际生效的主题
   */
  getEffectiveTheme(): EffectiveTheme {
    if (this.currentMode === 'auto') {
      return this.systemPreference
    }
    return this.currentMode
  }

  /**
   * 获取完整状态
   */
  getState(): ThemeModeState {
    return {
      mode: this.currentMode,
      systemPreference: this.systemPreference,
      effectiveTheme: this.getEffectiveTheme(),
    }
  }

  /**
   * 设置模式
   */
  setMode(mode: ThemeMode): ThemeModeState {
    if (this.destroyed) {
      console.warn('ThemeModeManager has been destroyed')
      return this.getState()
    }

    this.currentMode = mode
    this.applyMode(mode)

    // 持久化
    if (this.persistence) {
      this.save(mode)
    }

    // 通知监听器
    const state = this.getState()
    this.notifyListeners(state)

    return state
  }

  /**
   * 切换到下一个模式（循环切换）
   */
  toggleMode(): ThemeModeState {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(this.currentMode)
    const nextIndex = (currentIndex + 1) % modes.length
    return this.setMode(modes[nextIndex])
  }

  /**
   * 检测系统主题偏好
   */
  private detectSystemPreference(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.systemPreference = mediaQuery.matches ? 'dark' : 'light'
    }
    catch (error) {
      console.warn('Failed to detect system theme preference:', error)
      this.systemPreference = 'light'
    }
  }

  /**
   * 设置系统主题监听器
   */
  private setupSystemWatcher(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    try {
      this.systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      this.systemMediaHandler = (e: MediaQueryListEvent) => {
        if (!this.destroyed) {
          this.systemPreference = e.matches ? 'dark' : 'light'

          // 如果当前是 auto 模式，需要重新应用
          if (this.currentMode === 'auto') {
            this.applyTheme(this.systemPreference)
            this.notifyListeners(this.getState())
          }
        }
      }

      this.systemMediaQuery.addEventListener('change', this.systemMediaHandler)
    }
    catch (error) {
      console.warn('Failed to setup system theme watcher:', error)
    }
  }

  /**
   * 清理系统主题监听器
   */
  private cleanupSystemWatcher(): void {
    if (this.systemMediaQuery && this.systemMediaHandler) {
      try {
        this.systemMediaQuery.removeEventListener('change', this.systemMediaHandler)
      }
      catch (error) {
        console.warn('Failed to cleanup system theme watcher:', error)
      }
      this.systemMediaHandler = undefined
    }
  }

  /**
   * 应用模式到 DOM
   */
  private applyMode(mode: ThemeMode): void {
    const effectiveTheme = mode === 'auto' ? this.systemPreference : mode
    this.applyTheme(effectiveTheme)
  }

  /**
   * 应用主题到 DOM
   */
  private applyTheme(theme: EffectiveTheme): void {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement

    // 设置 data-theme-mode 属性
    root.setAttribute('data-theme-mode', theme)

    // 设置类名（兼容性）
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    }
    else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    // 可选：设置 body 样式
    if (typeof document.body !== 'undefined') {
      if (theme === 'dark') {
        document.body.style.colorScheme = 'dark'
      }
      else {
        document.body.style.colorScheme = 'light'
      }
    }
  }

  /**
   * 保存到本地存储
   */
  private save(mode: ThemeMode): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      localStorage.setItem(this.storageKey, mode)
    }
    catch (error) {
      console.error('Failed to save theme mode:', error)
    }
  }

  /**
   * 从本地存储恢复
   */
  private restore(): ThemeMode | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored
      }
    }
    catch (error) {
      console.error('Failed to restore theme mode:', error)
    }

    return null
  }

  /**
   * 清除存储
   */
  clear(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      localStorage.removeItem(this.storageKey)
    }
    catch (error) {
      console.error('Failed to clear theme mode:', error)
    }
  }

  /**
   * 添加监听器
   */
  onChange(callback: ModeChangeCallback): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(state: ThemeModeState): void {
    this.listeners.forEach((listener) => {
      try {
        listener(state)
      }
      catch (error) {
        console.error('Error in theme mode listener:', error)
      }
    })
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.destroyed = true
    this.cleanupSystemWatcher()
    this.listeners.clear()
  }
}

// 创建默认实例
export const defaultThemeModeManager = new ThemeModeManager()

// 全局清理
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    defaultThemeModeManager.destroy()
  }, { once: true })
}

/**
 * 快捷方法：设置模式
 */
export function setThemeMode(mode: ThemeMode): ThemeModeState {
  return defaultThemeModeManager.setMode(mode)
}

/**
 * 快捷方法：获取当前模式
 */
export function getThemeMode(): ThemeMode {
  return defaultThemeModeManager.getMode()
}

/**
 * 快捷方法：切换模式
 */
export function toggleThemeMode(): ThemeModeState {
  return defaultThemeModeManager.toggleMode()
}

/**
 * 快捷方法：获取实际生效的主题
 */
export function getEffectiveTheme(): EffectiveTheme {
  return defaultThemeModeManager.getEffectiveTheme()
}
