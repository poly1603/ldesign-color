/**
 * useColor - Main composable for Vue color management
 */

import type { ComputedRef, Ref } from 'vue'
import type { ThemeState, ThemeOptions, BaseThemeAdapter } from '@ldesign/color-core'
import { computed, inject, onUnmounted, ref, getCurrentInstance } from 'vue'
import { COLOR_SYMBOL } from '../constants'

export interface UseColorOptions {
  /** 使用范围: 全局或局部 */
  useScope?: 'global' | 'local'
  /** 自动应用主题 */
  autoApply?: boolean
  /** 持久化到 localStorage */
  persistToLocalStorage?: boolean
  /** 尊重系统偏好设置 */
  respectSystemPreference?: boolean
}

export interface UseColorReturn {
  // Properties
  currentTheme: Ref<ThemeState | null>
  presets: ComputedRef<Record<string, any>>
  isLoading: Ref<boolean>

  // Computed properties
  primaryColor: ComputedRef<string>
  themeName: ComputedRef<string>
  isDark: ComputedRef<boolean>

  // Methods
  applyTheme: (colorOrName: string, options?: ThemeOptions) => Promise<ThemeState>
  applyPresetTheme: (name: string, options?: ThemeOptions) => Promise<ThemeState>
  restoreTheme: () => ThemeState | null
  clearTheme: () => void
  getCurrentTheme: () => ThemeState | null

  // Instance
  adapter: BaseThemeAdapter
}

/**
 * 使用颜色管理
 * 
 * @param options - 配置选项
 * @returns 颜色管理对象
 * 
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useColor } from '@ldesign/color-vue'
 * 
 * const {
 *   currentTheme,
 *   primaryColor,
 *   applyTheme,
 *   isDark
 * } = useColor()
 * 
 * // 应用主题
 * await applyTheme('#667eea')
 * </script>
 * ```
 */
export function useColor(options: UseColorOptions = {}): UseColorReturn {
  const {
    useScope = 'global',
  } = options

  // 尝试注入全局适配器
  let globalAdapter = inject(COLOR_SYMBOL, undefined as any) as BaseThemeAdapter | undefined

  // Fallback 1: 尝试字符串 key
  if (!globalAdapter) {
    globalAdapter = inject('color' as any) as BaseThemeAdapter | undefined
  }

  // Fallback 2: 从 globalProperties 读取
  if (!globalAdapter) {
    try {
      const inst = getCurrentInstance()
      const gp = inst?.appContext?.config?.globalProperties as any
      if (gp?.$color) {
        globalAdapter = gp.$color as BaseThemeAdapter
      }
      else if (gp?.$theme) {
        globalAdapter = gp.$theme as BaseThemeAdapter
      }
    }
    catch { }
  }

  if (!globalAdapter) {
    console.error('[useColor] Failed to inject color adapter!')
    console.error('[useColor] COLOR_SYMBOL used for inject:', COLOR_SYMBOL)
    throw new Error('[useColor] No color adapter instance found. Make sure to install the color plugin.')
  }

  // 使用全局或局部适配器
  const adapter = globalAdapter

  // 响应式状态
  const currentTheme = ref<ThemeState | null>(adapter.getState().currentTheme)
  const isLoading = ref(false)

  // 计算属性
  const primaryColor = computed(() => currentTheme.value?.primaryColor || '')
  const themeName = computed(() => currentTheme.value?.themeName || '')
  const isDark = computed(() => currentTheme.value?.isDark || false)
  const presets = computed(() => adapter.getState().presets)

  // 包装方法并同步状态
  const applyTheme = async (colorOrName: string, themeOptions?: ThemeOptions): Promise<ThemeState> => {
    isLoading.value = true
    try {
      const theme = await adapter.applyTheme(colorOrName, themeOptions)
      currentTheme.value = theme
      return theme
    }
    finally {
      isLoading.value = false
    }
  }

  const applyPresetTheme = async (name: string, themeOptions?: ThemeOptions): Promise<ThemeState> => {
    isLoading.value = true
    try {
      const theme = await adapter.applyPresetTheme(name, themeOptions)
      currentTheme.value = theme
      return theme
    }
    finally {
      isLoading.value = false
    }
  }

  const restoreTheme = (): ThemeState | null => {
    const theme = adapter.restoreTheme()
    currentTheme.value = theme
    return theme
  }

  const clearTheme = (): void => {
    adapter.clearTheme()
    currentTheme.value = null
  }

  const getCurrentTheme = (): ThemeState | null => {
    const theme = adapter.getCurrentTheme()
    currentTheme.value = theme
    return theme
  }

  // 订阅主题变更
  let unsubscribe: (() => void) | null = null

  // 监听适配器的状态变更
  unsubscribe = adapter.onChange((theme) => {
    currentTheme.value = theme
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
    // 注意: 不要销毁全局适配器，只有在 useScope === 'local' 时才销毁
    if (useScope === 'local' && adapter !== globalAdapter) {
      adapter.destroy()
    }
  })

  return {
    // Properties
    currentTheme,
    presets,
    isLoading,

    // Computed properties
    primaryColor,
    themeName,
    isDark,

    // Methods
    applyTheme,
    applyPresetTheme,
    restoreTheme,
    clearTheme,
    getCurrentTheme,

    // Instance
    adapter,
  }
}
