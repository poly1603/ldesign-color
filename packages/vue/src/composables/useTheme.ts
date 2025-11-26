/**
 * Vue 3 主题管理 Composable
 *
 * 基于 BaseThemeAdapter 的 Vue 3 响应式包装。
 *
 * @module composables/useTheme
 */

import type { ThemeAdapterOptions, ThemeOptions, ThemeState, BaseThemeAdapter as BaseThemeAdapterType } from '@ldesign/color-core'
import { computed, onMounted, onUnmounted, ref, shallowRef, readonly } from 'vue'
import { BaseThemeAdapter } from '@ldesign/color-core'

/**
 * Vue 主题 Composable 选项
 */
export interface UseThemeOptions extends ThemeAdapterOptions { }

/**
 * 使用主题管理
 *
 * 提供响应式的主题管理功能。
 *
 * @param options - 配置选项
 * @returns 主题管理对象
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTheme } from '@ldesign/color-vue'
 *
 * const {
 *   currentTheme,
 *   applyTheme,
 *   applyPresetTheme
 * } = useTheme()
 *
 * // 应用主题
 * await applyTheme('#667eea')
 * </script>
 * ```
 */
export function useTheme(options: UseThemeOptions = {}) {
  // 创建适配器实例
  const adapter = new BaseThemeAdapter(options)

  // 响应式状态 - 使用 shallowRef 优化性能
  const currentTheme = shallowRef<ThemeState | null>(adapter.getState().currentTheme)
  const isLoading = ref(false)

  // 计算属性
  const primaryColor = computed(() => currentTheme.value?.primaryColor || '')
  const themeName = computed(() => currentTheme.value?.themeName || '')
  const isDark = computed(() => currentTheme.value?.isDark || false)
  const presets = readonly(ref(adapter.getState().presets))

  // 包装方法并同步状态
  const applyTheme = async (colorOrName: string, themeOptions?: ThemeOptions) => {
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

  const applyPresetTheme = async (name: string, themeOptions?: ThemeOptions) => {
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

  const restoreTheme = () => {
    const theme = adapter.restoreTheme()
    currentTheme.value = theme
    return theme
  }

  const clearTheme = () => {
    adapter.clearTheme()
    currentTheme.value = null
  }

  const getCurrentTheme = () => {
    const theme = adapter.getCurrentTheme()
    currentTheme.value = theme
    return theme
  }

  // 订阅主题变更
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    // 订阅适配器的状态变更
    unsubscribe = adapter.onChange((theme) => {
      currentTheme.value = theme
    })
  })

  onUnmounted(() => {
    // 取消订阅
    if (unsubscribe) {
      unsubscribe()
    }
    // 销毁适配器
    adapter.destroy()
  })

  return {
    // 状态
    currentTheme: readonly(currentTheme),
    presets,
    isLoading: readonly(isLoading),
    // 计算属性
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

/**
 * 全局主题适配器实例（单例）
 */
let globalAdapter: BaseThemeAdapter | null = null

/**
 * 创建主题提供者插件
 *
 * 用于在 Vue 应用中全局提供主题管理功能。
 *
 * @param options - 配置选项
 * @returns Vue 插件对象
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue'
 * import { createThemeProvider } from '@ldesign/color-vue'
 *
 * const app = createApp(App)
 * app.use(createThemeProvider({
 *   autoApply: true
 * }))
 * ```
 */
export function createThemeProvider(options: UseThemeOptions = {}) {
  // 使用单例模式，避免重复创建
  if (!globalAdapter) {
    globalAdapter = new BaseThemeAdapter(options)
  }

  return {
    install(app: any) {
      app.provide('themeAdapter', globalAdapter)
      app.config.globalProperties.$theme = globalAdapter

      // 应用卸载时清理
      const originalUnmount = app.unmount
      app.unmount = function (...args: any[]) {
        if (globalAdapter) {
          globalAdapter.destroy()
          globalAdapter = null
        }
        return originalUnmount.apply(this, args)
      }
    },
  }
}
