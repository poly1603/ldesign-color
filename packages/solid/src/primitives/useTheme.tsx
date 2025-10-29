/**
 * Solid.js 主题管理 Primitive
 *
 * 基于 BaseThemeAdapter 的 Solid.js 包装。
 *
 * @module primitives/useTheme
 */

import type { ThemeAdapterOptions } from '@ldesign/color-core/themes/BaseThemeAdapter'
import type { ThemeOptions, ThemeState } from '@ldesign/color-core/themes/themeManager'
import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { BaseThemeAdapter } from '@ldesign/color-core/themes/BaseThemeAdapter'

/**
 * Solid 主题 Primitive 选项
 */
export interface UseThemeOptions extends ThemeAdapterOptions { }

/**
 * 创建主题管理 Primitive
 *
 * @param options - 配置选项
 * @returns 主题管理对象
 *
 * @example
 * ```tsx
 * import { useTheme } from '@ldesign/color-solid'
 *
 * function App() {
 *   const theme = useTheme()
 *
 *   return (
 *     <button onClick={() => theme.applyTheme('#667eea')}>
 *       应用主题
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme(options: UseThemeOptions = {}) {
  // 创建适配器实例
  const adapter = new BaseThemeAdapter(options)

  // Signals
  const [currentTheme, setCurrentTheme] = createSignal<ThemeState | null>(
    adapter.getState().currentTheme,
  )
  const [isLoading, setIsLoading] = createSignal(false)

  // Memos
  const primaryColor = createMemo(() => currentTheme()?.primaryColor || '')
  const themeName = createMemo(() => currentTheme()?.themeName || '')
  const isDark = createMemo(() => currentTheme()?.isDark || false)
  const presets = createMemo(() => adapter.getState().presets)

  // 包装方法
  const applyTheme = async (colorOrName: string, themeOptions?: ThemeOptions) => {
    setIsLoading(true)
    try {
      const theme = await adapter.applyTheme(colorOrName, themeOptions)
      setCurrentTheme(theme)
      return theme
    }
    finally {
      setIsLoading(false)
    }
  }

  const applyPresetTheme = async (name: string, themeOptions?: ThemeOptions) => {
    setIsLoading(true)
    try {
      const theme = await adapter.applyPresetTheme(name, themeOptions)
      setCurrentTheme(theme)
      return theme
    }
    finally {
      setIsLoading(false)
    }
  }

  const restoreTheme = () => {
    const theme = adapter.restoreTheme()
    setCurrentTheme(theme)
    return theme
  }

  const clearTheme = () => {
    adapter.clearTheme()
    setCurrentTheme(null)
  }

  const getCurrentTheme = () => {
    const theme = adapter.getCurrentTheme()
    setCurrentTheme(theme)
    return theme
  }

  // 初始化和订阅
  onMount(() => {
    // 订阅适配器变更
    const unsubscribe = adapter.onChange((theme) => {
      setCurrentTheme(theme)
    })

    // 清理
    onCleanup(() => {
      unsubscribe()
      adapter.destroy()
    })
  })

  return {
    // 状态
    currentTheme,
    presets,
    isLoading,
    // 计算值
    primaryColor,
    themeName,
    isDark,
    // 方法
    applyTheme,
    applyPresetTheme,
    restoreTheme,
    clearTheme,
    getCurrentTheme,
  }
}


