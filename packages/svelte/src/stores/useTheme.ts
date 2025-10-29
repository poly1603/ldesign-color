/**
 * Svelte 主题管理 Store
 *
 * 基于 BaseThemeAdapter 的 Svelte 包装。
 *
 * @module stores/useTheme
 */

import type { ThemeAdapterOptions } from '@ldesign/color-core/themes/BaseThemeAdapter'
import type { ThemeOptions, ThemeState } from '@ldesign/color-core/themes/themeManager'
import { derived, readable, writable } from 'svelte/store'
import { BaseThemeAdapter } from '@ldesign/color-core/themes/BaseThemeAdapter'

/**
 * Svelte 主题 Store 选项
 */
export interface UseThemeOptions extends ThemeAdapterOptions { }

/**
 * 创建主题管理 Store
 *
 * @param options - 配置选项
 * @returns 主题管理对象
 *
 * @example
 * ```svelte
 * <script>
 * import { useTheme } from '@ldesign/color-svelte'
 *
 * const theme = useTheme()
 *
 * function handleApply() {
 *   theme.applyTheme('#667eea')
 * }
 * </script>
 * ```
 */
export function useTheme(options: UseThemeOptions = {}) {
  // 创建适配器实例
  const adapter = new BaseThemeAdapter(options)

  // 可写 Store
  const currentTheme = writable<ThemeState | null>(adapter.getState().currentTheme)
  const isLoading = writable(false)

  // 只读 Store（预设列表）
  const presets = readable(adapter.getState().presets)

  // 派生 Store
  const primaryColor = derived(currentTheme, $theme => $theme?.primaryColor || '')
  const themeName = derived(currentTheme, $theme => $theme?.themeName || '')
  const isDark = derived(currentTheme, $theme => $theme?.isDark || false)

  // 包装方法
  const applyTheme = async (colorOrName: string, themeOptions?: ThemeOptions) => {
    isLoading.set(true)
    try {
      const theme = await adapter.applyTheme(colorOrName, themeOptions)
      currentTheme.set(theme)
      return theme
    }
    finally {
      isLoading.set(false)
    }
  }

  const applyPresetTheme = async (name: string, themeOptions?: ThemeOptions) => {
    isLoading.set(true)
    try {
      const theme = await adapter.applyPresetTheme(name, themeOptions)
      currentTheme.set(theme)
      return theme
    }
    finally {
      isLoading.set(false)
    }
  }

  const restoreTheme = () => {
    const theme = adapter.restoreTheme()
    currentTheme.set(theme)
    return theme
  }

  const clearTheme = () => {
    adapter.clearTheme()
    currentTheme.set(null)
  }

  const getCurrentTheme = () => {
    const theme = adapter.getCurrentTheme()
    currentTheme.set(theme)
    return theme
  }

  // 订阅适配器变更
  const unsubscribe = adapter.onChange((theme) => {
    currentTheme.set(theme)
  })

  // 销毁函数
  const destroy = () => {
    unsubscribe()
    adapter.destroy()
  }

  return {
    // Stores
    currentTheme,
    presets,
    isLoading,
    // 派生 Stores
    primaryColor,
    themeName,
    isDark,
    // 方法
    applyTheme,
    applyPresetTheme,
    restoreTheme,
    clearTheme,
    getCurrentTheme,
    destroy,
  }
}


