/**
 * @ldesign/color-vue - SSR Support
 * 
 * 服务端渲染(SSR)增强和 Hydration 优化
 */

import type { App } from 'vue'

/**
 * SSR 上下文
 */
export interface SSRContext {
  /** 初始主题状态 */
  initialTheme?: any
  /** 初始主色调 */
  initialColor?: string
  /** 初始模式 */
  initialMode?: 'light' | 'dark' | 'auto'
  /** 序列化的主题数据 */
  serializedTheme?: string
}

/**
 * SSR 配置选项
 */
export interface SSROptions {
  /** 是否启用 SSR */
  enabled?: boolean
  /** 是否自动注入内联样式 */
  inlineStyles?: boolean
  /** 是否预加载主题 */
  preloadTheme?: boolean
  /** 状态序列化键名 */
  stateKey?: string
}

/**
 * 默认状态键名
 */
const DEFAULT_STATE_KEY = '__LDESIGN_COLOR_STATE__'

/**
 * 检查是否在服务端
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * 检查是否在客户端
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * 序列化主题状态
 * 
 * @param state - 主题状态
 * @returns 序列化后的 JSON 字符串
 */
export function serializeThemeState(state: any): string {
  try {
    return JSON.stringify(state)
  }
  catch (error) {
    console.error('[SSR] Failed to serialize theme state:', error)
    return '{}'
  }
}

/**
 * 反序列化主题状态
 * 
 * @param serialized - 序列化的字符串
 * @returns 主题状态对象
 */
export function deserializeThemeState(serialized: string): any {
  try {
    return JSON.parse(serialized)
  }
  catch (error) {
    console.error('[SSR] Failed to deserialize theme state:', error)
    return null
  }
}

/**
 * 生成内联样式脚本
 * 用于在 HTML head 中注入,避免闪烁
 * 
 * @param cssVariables - CSS 变量字符串
 * @param mode - 主题模式
 * @returns 内联脚本代码
 */
export function generateInlineStyleScript(
  cssVariables: string,
  mode: 'light' | 'dark' = 'light',
): string {
  return `
(function() {
  try {
    // 设置主题模式属性
    document.documentElement.setAttribute('data-theme', '${mode}');
    
    // 注入 CSS 变量
    var style = document.createElement('style');
    style.id = 'ldesign-theme-colors-ssr';
    style.textContent = ${JSON.stringify(cssVariables)};
    document.head.appendChild(style);
  } catch (e) {
    console.error('[LDesign Color SSR] Failed to inject styles:', e);
  }
})();
`.trim()
}

/**
 * 生成状态注入脚本
 * 
 * @param state - 主题状态
 * @param stateKey - 状态键名
 * @returns 脚本标签字符串
 */
export function generateStateScript(
  state: any,
  stateKey: string = DEFAULT_STATE_KEY,
): string {
  const serialized = serializeThemeState(state)
  return `<script>window.${stateKey}=${serialized}</script>`
}

/**
 * 从 window 中获取服务端注入的状态
 * 
 * @param stateKey - 状态键名
 * @returns 主题状态或 null
 */
export function getServerState(stateKey: string = DEFAULT_STATE_KEY): any {
  if (isServer()) {
    return null
  }

  try {
    const state = (window as any)[stateKey]
    if (state) {
      // 获取后立即删除,避免污染全局
      delete (window as any)[stateKey]
      return state
    }
  }
  catch (error) {
    console.error('[SSR] Failed to get server state:', error)
  }

  return null
}

/**
 * SSR 上下文管理器
 */
export class SSRContextManager {
  private context: SSRContext = {}

  /**
   * 设置上下文
   */
  setContext(context: Partial<SSRContext>): void {
    this.context = {
      ...this.context,
      ...context,
    }
  }

  /**
   * 获取上下文
   */
  getContext(): SSRContext {
    return { ...this.context }
  }

  /**
   * 清除上下文
   */
  clearContext(): void {
    this.context = {}
  }

  /**
   * 生成 HTML 注入代码
   */
  generateInjectionHTML(options: SSROptions = {}): string {
    const {
      inlineStyles = true,
      stateKey = DEFAULT_STATE_KEY,
    } = options

    const parts: string[] = []

    // 注入状态
    if (this.context.initialTheme || this.context.initialColor) {
      const state = {
        theme: this.context.initialTheme,
        color: this.context.initialColor,
        mode: this.context.initialMode || 'light',
      }
      parts.push(generateStateScript(state, stateKey))
    }

    // 注入内联样式
    if (inlineStyles && this.context.serializedTheme) {
      const initialMode = this.context.initialMode || 'light'
      // auto 模式在 SSR 时转换为 light
      const mode = initialMode === 'auto' ? 'light' : initialMode
      const script = generateInlineStyleScript(this.context.serializedTheme, mode)
      parts.push(`<script>${script}</script>`)
    }

    return parts.join('\n')
  }
}

/**
 * 创建 SSR 插件
 * 
 * @param options - SSR 选项
 * @returns Vue 插件
 * 
 * @example
 * ```ts
 * // 服务端
 * import { createSSRApp } from 'vue'
 * import { createSSRPlugin } from '@ldesign/color-vue'
 * 
 * const app = createSSRApp(App)
 * app.use(createSSRPlugin({
 *   enabled: true,
 *   inlineStyles: true
 * }))
 * 
 * // 客户端
 * import { createApp } from 'vue'
 * import { createSSRPlugin, getServerState } from '@ldesign/color-vue'
 * 
 * const serverState = getServerState()
 * const app = createApp(App)
 * app.use(createSSRPlugin({
 *   enabled: false // 客户端不需要
 * }))
 * ```
 */
export function createSSRPlugin(options: SSROptions = {}) {
  const {
    enabled = isServer(),
    stateKey = DEFAULT_STATE_KEY,
  } = options

  const contextManager = new SSRContextManager()

  return {
    install(app: App) {
      // 仅在服务端启用
      if (!enabled) {
        return
      }

      // 提供 SSR 上下文管理器
      app.provide('ssrContextManager', contextManager)

      // 添加全局属性
      app.config.globalProperties.$ssrContext = contextManager
    },
  }
}

/**
 * Hydration 不匹配处理
 * 
 * @param callback - 修复回调
 */
export function handleHydrationMismatch(callback: () => void): void {
  if (isClient()) {
    // 在客户端 hydration 完成后执行
    if (typeof window !== 'undefined') {
      // 使用 requestIdleCallback 延迟执行,避免阻塞
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback)
      }
      else {
        setTimeout(callback, 0)
      }
    }
  }
}

/**
 * 获取系统主题偏好(SSR 安全)
 */
export function getSystemThemeSSR(): 'light' | 'dark' {
  if (isServer()) {
    // 服务端默认返回 light
    return 'light'
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

/**
 * 创建 SSR 安全的 ref
 * 在服务端使用默认值,客户端从 localStorage 恢复
 * 
 * @param key - localStorage 键
 * @param defaultValue - 默认值
 * @returns 值
 */
export function getSSRSafeValue<T>(key: string, defaultValue: T): T {
  if (isServer()) {
    return defaultValue
  }

  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      return JSON.parse(stored) as T
    }
  }
  catch (error) {
    console.error(`[SSR] Failed to get value for key "${key}":`, error)
  }

  return defaultValue
}

/**
 * SSR 安全的 localStorage 设置
 * 
 * @param key - 键
 * @param value - 值
 */
export function setSSRSafeValue<T>(key: string, value: T): void {
  if (isServer()) {
    return
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
  }
  catch (error) {
    console.error(`[SSR] Failed to set value for key "${key}":`, error)
  }
}

/**
 * 等待 hydration 完成
 * 
 * @returns Promise
 */
export function waitForHydration(): Promise<void> {
  if (isServer()) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve()
    }
    else {
      window.addEventListener('load', () => resolve(), { once: true })
    }
  })
}