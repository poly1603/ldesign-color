/**
 * Vue 3 主题模式管理 Composable
 *
 * 基于 ThemeModeManager 的 Vue 3 响应式包装
 * 提供 light/dark/auto 模式切换功能
 *
 * @module composables/useThemeMode
 */

import type {
  EffectiveTheme,
  ThemeMode,
  ThemeModeOptions,
  ThemeModeState,
} from '@ldesign/color-core'
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, readonly, ref } from 'vue'
import { ThemeModeManager } from '@ldesign/color-core'

/**
 * Vue 主题模式 Composable 选项
 */
export interface UseThemeModeOptions extends ThemeModeOptions { }

/**
 * Vue 主题模式返回值
 */
export interface UseThemeModeReturn {
  /** 当前模式 */
  mode: Readonly<Ref<ThemeMode>>
  /** 系统偏好 */
  systemPreference: Readonly<Ref<EffectiveTheme>>
  /** 实际生效的主题 */
  effectiveTheme: Readonly<Ref<EffectiveTheme>>
  /** 是否为浅色模式 */
  isLight: Readonly<Ref<boolean>>
  /** 是否为深色模式 */
  isDark: Readonly<Ref<boolean>>
  /** 是否为自动模式 */
  isAuto: Readonly<Ref<boolean>>
  /** 设置模式 */
  setMode: (mode: ThemeMode) => void
  /** 切换模式（循环） */
  toggleMode: () => void
  /** 设置为浅色模式 */
  setLight: () => void
  /** 设置为深色模式 */
  setDark: () => void
  /** 设置为自动模式 */
  setAuto: () => void
}

/**
 * 使用主题模式管理
 *
 * 提供响应式的主题模式管理功能，支持 light/dark/auto 三种模式。
 * 基于 @ldesign/color-core 的 ThemeModeManager。
 *
 * @param options - 配置选项
 * @returns 主题模式管理对象
 *
 * @example
 * ```vue
 * <script setup>
 * import { useThemeMode } from '@ldesign/color-vue'
 *
 * const {
 *   mode,
 *   effectiveTheme,
 *   isLight,
 *   isDark,
 *   toggleMode,
 *   setLight,
 *   setDark,
 *   setAuto
 * } = useThemeMode()
 *
 * // 切换模式
 * toggleMode()
 *
 * // 设置为深色模式
 * setDark()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>当前模式: {{ mode }}</p>
 *     <p>实际主题: {{ effectiveTheme }}</p>
 *     <button @click="toggleMode">切换模式</button>
 *   </div>
 * </template>
 * ```
 */
export function useThemeMode(options: UseThemeModeOptions = {}): UseThemeModeReturn {
  // 创建管理器实例
  const manager = new ThemeModeManager(options)

  // 响应式状态
  const mode = ref<ThemeMode>(manager.getMode())
  const systemPreference = ref<EffectiveTheme>(manager.getSystemPreference())
  const effectiveTheme = ref<EffectiveTheme>(manager.getEffectiveTheme())

  // 计算属性
  const isLight = computed(() => effectiveTheme.value === 'light')
  const isDark = computed(() => effectiveTheme.value === 'dark')
  const isAuto = computed(() => mode.value === 'auto')

  // 更新状态
  const updateState = (state: ThemeModeState) => {
    mode.value = state.mode
    systemPreference.value = state.systemPreference
    effectiveTheme.value = state.effectiveTheme
  }

  // 包装方法
  const setMode = (newMode: ThemeMode) => {
    const state = manager.setMode(newMode)
    updateState(state)
  }

  const toggleMode = () => {
    const state = manager.toggleMode()
    updateState(state)
  }

  const setLight = () => setMode('light')
  const setDark = () => setMode('dark')
  const setAuto = () => setMode('auto')

  // 订阅管理器变化
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    unsubscribe = manager.onChange(updateState)
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
    manager.destroy()
  })

  return {
    // 状态
    mode: readonly(mode),
    systemPreference: readonly(systemPreference),
    effectiveTheme: readonly(effectiveTheme),
    // 计算属性
    isLight: readonly(isLight),
    isDark: readonly(isDark),
    isAuto: readonly(isAuto),
    // 方法
    setMode,
    toggleMode,
    setLight,
    setDark,
    setAuto,
  }
}

/**
 * 全局主题模式管理器实例（单例）
 */
let globalModeManager: ThemeModeManager | null = null

/**
 * 创建主题模式提供者
 *
 * 用于在 Vue 应用中全局提供主题模式管理功能
 *
 * @param options - 配置选项
 * @returns Vue 插件对象
 *
 * @example
 * ```typescript
 * import { createApp } from 'vue'
 * import { createThemeModeProvider } from '@ldesign/color-vue'
 *
 * const app = createApp(App)
 * app.use(createThemeModeProvider({
 *   defaultMode: 'auto',
 *   autoApply: true
 * }))
 * ```
 */
export function createThemeModeProvider(options: UseThemeModeOptions = {}) {
  // 使用单例模式
  if (!globalModeManager) {
    globalModeManager = new ThemeModeManager(options)
  }

  return {
    install(app: any) {
      app.provide('themeModeManager', globalModeManager)
      app.config.globalProperties.$themeMode = globalModeManager

      // 应用卸载时清理
      const originalUnmount = app.unmount
      app.unmount = function (...args: any[]) {
        if (globalModeManager) {
          globalModeManager.destroy()
          globalModeManager = null
        }
        return originalUnmount.apply(this, args)
      }
    },
  }
}
