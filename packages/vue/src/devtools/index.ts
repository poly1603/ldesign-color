/**
 * @ldesign/color-vue - Vue DevTools Integration
 * 
 * 轻量级 DevTools 集成,用于调试和监控主题状态
 * 不依赖 @vue/devtools-api,使用原生 Vue 3 API
 */

import type { App, Plugin } from 'vue'

/**
 * DevTools 状态快照
 */
export interface ColorDevToolsState {
  currentTheme: any
  primaryColor: string
  mode: string
  effectiveMode: string
  themeColors: any
  performanceMetrics?: any
  cacheStats?: any
}

/**
 * DevTools 时间线事件
 */
export interface ColorTimelineEvent {
  time: number
  type: 'info' | 'warning' | 'error'
  title: string
  subtitle?: string
  data?: any
}

/**
 * 事件历史记录
 */
const eventHistory: ColorTimelineEvent[] = []
const MAX_EVENTS = 100

/**
 * 状态订阅者
 */
const stateSubscribers: Array<(state: ColorDevToolsState) => void> = []

/**
 * 当前状态
 */
let currentState: ColorDevToolsState = {
  currentTheme: null,
  primaryColor: '',
  mode: 'light',
  effectiveMode: 'light',
  themeColors: null,
}

/**
 * 创建 DevTools 插件
 * 
 * @param options - 插件选项
 * @returns Vue 插件
 * 
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createColorDevTools } from '@ldesign/color-vue'
 * 
 * const app = createApp(App)
 * 
 * if (import.meta.env.DEV) {
 *   app.use(createColorDevTools({
 *     enableTimeline: true,
 *     maxEvents: 100
 *   }))
 * }
 * ```
 */
export function createColorDevTools(options: {
  enableTimeline?: boolean
  maxEvents?: number
} = {}): Plugin {
  const { maxEvents = MAX_EVENTS } = options

  return {
    install(app: App) {
      // 仅在开发环境启用
      if (import.meta.env.PROD) {
        return
      }

      // 添加全局属性
      app.config.globalProperties.$colorDevTools = {
        getState: () => currentState,
        getEvents: () => [...eventHistory],
        clearEvents: () => {
          eventHistory.length = 0
        },
        subscribe: (callback: (state: ColorDevToolsState) => void) => {
          stateSubscribers.push(callback)
          return () => {
            const index = stateSubscribers.indexOf(callback)
            if (index > -1) {
              stateSubscribers.splice(index, 1)
            }
          }
        },
      }

      // 在控制台打印信息
      console.log(
        '%c🎨 LDesign Color DevTools',
        'background: #667eea; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;',
        '\nDevTools enabled. Access via app.$colorDevTools',
      )
    },
  }
}

/**
 * 添加时间线事件
 * 
 * @param event - 事件信息
 */
export function addTimelineEvent(event: Omit<ColorTimelineEvent, 'time'>): void {
  const fullEvent: ColorTimelineEvent = {
    ...event,
    time: Date.now(),
  }

  // 添加到历史记录
  eventHistory.push(fullEvent)
  if (eventHistory.length > MAX_EVENTS) {
    eventHistory.shift()
  }

  // 开发环境输出到控制台
  if (import.meta.env.DEV) {
    const styles = {
      info: 'color: #667eea',
      warning: 'color: #f59e0b',
      error: 'color: #ef4444',
    }

    console.log(
      `%c[LDesign Color] ${fullEvent.title}`,
      styles[fullEvent.type],
      fullEvent.subtitle || '',
      fullEvent.data || '',
    )
  }
}

/**
 * 更新 DevTools 状态
 * 
 * @param state - 新状态
 */
export function updateDevToolsState(state: Partial<ColorDevToolsState>): void {
  currentState = {
    ...currentState,
    ...state,
  }

  // 通知订阅者
  stateSubscribers.forEach((callback) => {
    try {
      callback(currentState)
    }
    catch (error) {
      console.error('[LDesign Color DevTools] Subscriber error:', error)
    }
  })
}

/**
 * 记录主题应用事件
 */
export function logThemeApplied(color: string, themeName?: string): void {
  addTimelineEvent({
    type: 'info',
    title: '主题已应用',
    subtitle: themeName || color,
    data: {
      color,
      themeName,
      timestamp: new Date().toLocaleTimeString(),
    },
  })

  updateDevToolsState({
    primaryColor: color,
    currentTheme: { ...currentState.currentTheme, primaryColor: color },
  })
}

/**
 * 记录主题模式切换事件
 */
export function logModeChanged(mode: string, effectiveMode: string): void {
  addTimelineEvent({
    type: 'info',
    title: '模式已切换',
    subtitle: `${mode} → ${effectiveMode}`,
    data: {
      mode,
      effectiveMode,
      timestamp: new Date().toLocaleTimeString(),
    },
  })

  updateDevToolsState({
    mode,
    effectiveMode,
  })
}

/**
 * 记录性能警告
 */
export function logPerformanceWarning(message: string, data?: any): void {
  addTimelineEvent({
    type: 'warning',
    title: '性能警告',
    subtitle: message,
    data: {
      ...data,
      timestamp: new Date().toLocaleTimeString(),
    },
  })
}

/**
 * 记录错误事件
 */
export function logError(message: string, error?: Error): void {
  addTimelineEvent({
    type: 'error',
    title: '错误',
    subtitle: message,
    data: {
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toLocaleTimeString(),
    },
  })
}

/**
 * 记录主题色彩生成事件
 */
export function logThemeColorsGenerated(colors: any): void {
  addTimelineEvent({
    type: 'info',
    title: '主题色彩已生成',
    subtitle: `${Object.keys(colors).length} 个色彩`,
    data: {
      colors,
      timestamp: new Date().toLocaleTimeString(),
    },
  })

  updateDevToolsState({
    themeColors: colors,
  })
}

/**
 * 记录性能指标
 */
export function logPerformanceMetrics(metrics: any): void {
  updateDevToolsState({
    performanceMetrics: metrics,
  })
}

/**
 * 记录缓存统计
 */
export function logCacheStats(stats: any): void {
  updateDevToolsState({
    cacheStats: stats,
  })
}

/**
 * 获取事件历史
 */
export function getEventHistory(): ColorTimelineEvent[] {
  return [...eventHistory]
}

/**
 * 清除事件历史
 */
export function clearEventHistory(): void {
  eventHistory.length = 0
}

/**
 * 获取当前状态
 */
export function getCurrentDevToolsState(): ColorDevToolsState {
  return { ...currentState }
}

/**
 * 订阅状态变化
 */
export function subscribeDevToolsState(
  callback: (state: ColorDevToolsState) => void,
): () => void {
  stateSubscribers.push(callback)
  
  // 返回取消订阅函数
  return () => {
    const index = stateSubscribers.indexOf(callback)
    if (index > -1) {
      stateSubscribers.splice(index, 1)
    }
  }
}

/**
 * 导出调试面板组件的 Props
 */
export interface DebugPanelProps {
  /** 是否显示面板 */
  visible?: boolean
  /** 面板位置 */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** 是否可拖动 */
  draggable?: boolean
}