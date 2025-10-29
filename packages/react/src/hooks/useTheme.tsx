/**
 * React 主题管理 Hook
 *
 * 基于 BaseThemeAdapter 的 React 包装。
 *
 * @module hooks/useTheme
 */

import type { ReactNode } from 'react'
import type { ThemeAdapterOptions } from '@ldesign/color-core/themes/BaseThemeAdapter'
import type { ThemeOptions, ThemeState } from '@ldesign/color-core/themes/themeManager'
import type { PresetTheme } from '@ldesign/color-core/themes/presets'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BaseThemeAdapter } from '@ldesign/color-core/themes/BaseThemeAdapter'

/**
 * React 主题 Hook 选项
 */
export interface UseThemeOptions extends ThemeAdapterOptions { }

/**
 * 使用主题管理
 *
 * 提供主题管理功能的 React Hook。
 *
 * @param options - 配置选项
 * @returns 主题管理对象
 *
 * @example
 * ```tsx
 * import { useTheme } from '@ldesign/color-react'
 *
 * function App() {
 *   const { applyTheme, currentTheme } = useTheme()
 *
 *   return (
 *     <button onClick={() => applyTheme('#667eea')}>
 *       应用主题
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme(options: UseThemeOptions = {}) {
  // 使用 useMemo 创建稳定的适配器实例
  const adapter = useMemo(() => new BaseThemeAdapter(options), [])
  const [currentTheme, setCurrentTheme] = useState<ThemeState | null>(
    adapter.getState().currentTheme,
  )
  const [isLoading, setIsLoading] = useState(false)

  // 计算值
  const primaryColor = useMemo(() => currentTheme?.primaryColor || '', [currentTheme])
  const themeName = useMemo(() => currentTheme?.themeName || '', [currentTheme])
  const isDark = useMemo(() => currentTheme?.isDark || false, [currentTheme])
  const presets = useMemo(() => adapter.getState().presets, [adapter])

  // 包装方法
  const applyTheme = useCallback(
    async (colorOrName: string, themeOptions?: ThemeOptions) => {
      setIsLoading(true)
      try {
        const theme = await adapter.applyTheme(colorOrName, themeOptions)
        setCurrentTheme(theme)
        return theme
      }
      finally {
        setIsLoading(false)
      }
    },
    [adapter],
  )

  const applyPresetTheme = useCallback(
    async (name: string, themeOptions?: ThemeOptions) => {
      setIsLoading(true)
      try {
        const theme = await adapter.applyPresetTheme(name, themeOptions)
        setCurrentTheme(theme)
        return theme
      }
      finally {
        setIsLoading(false)
      }
    },
    [adapter],
  )

  const restoreTheme = useCallback(() => {
    const theme = adapter.restoreTheme()
    setCurrentTheme(theme)
    return theme
  }, [adapter])

  const clearTheme = useCallback(() => {
    adapter.clearTheme()
    setCurrentTheme(null)
  }, [adapter])

  const getCurrentTheme = useCallback(() => {
    const theme = adapter.getCurrentTheme()
    setCurrentTheme(theme)
    return theme
  }, [adapter])

  // 初始化和订阅主题变更
  useEffect(() => {
    // 订阅适配器的状态变更
    const unsubscribe = adapter.onChange((theme) => {
      setCurrentTheme(theme)
    })

    // 清理：取消订阅和销毁适配器
    return () => {
      unsubscribe()
      adapter.destroy()
    }
  }, [adapter])

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

interface ThemeContextValue {
  currentTheme: ThemeState | null
  presets: PresetTheme[]
  isLoading: boolean
  primaryColor: string
  themeName: string
  isDark: boolean
  applyTheme: (colorOrName: string, options?: ThemeOptions) => Promise<ThemeState>
  applyPresetTheme: (name: string, options?: ThemeOptions) => Promise<ThemeState>
  restoreTheme: () => ThemeState | null
  clearTheme: () => void
  getCurrentTheme: () => ThemeState | null
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: ReactNode
  options?: UseThemeOptions
}

export function ThemeProvider({ children, options = {} }: ThemeProviderProps) {
  const theme = useTheme(options)

  // 使用 memo 优化，防止不必要的重新渲染
  const contextValue = useMemo(() => theme, [
    theme.currentTheme,
    theme.isLoading,
    theme.primaryColor,
    theme.themeName,
    theme.isDark,
    theme.applyTheme,
    theme.applyPresetTheme,
    theme.restoreTheme,
    theme.clearTheme,
    theme.getCurrentTheme,
  ])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
