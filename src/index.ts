/**
 * @ldesign/color - 强大的颜色处理库
 *
 * 这是一个 monorepo 包装器，重新导出所有子包的功能
 *
 * @module @ldesign/color
 */

// 导出核心功能
export * from '@ldesign/color-core'

// 导出 Vue 功能（排除与 core 冲突的导出）
export {
  // Composables
  useColorTheme,
  useTheme,
  createThemeProvider,
  useColor,
  useThemeMode,
  createThemeModeProvider,
  useColorPerformance,

  // Components
  ThemeColorPicker,
  ThemeModeSwitcher,
  ThemeModeSwitch,

  // Utils
  debounce,
  throttle,
  useDebouncedRef,
  useThrottledRef,
  debouncedWatch,
  throttledWatch,
  batchRAF,
  useDebouncedRefSync,
  useThrottledRefSync,

  // Computed cache
  cachedComputed,
  debouncedComputed,
  throttledComputed,
  memoizedComputed,
  lazyComputed,
  CacheManager,
  globalCacheManager,

  // DevTools
  createColorDevTools,
  addTimelineEvent,
  updateDevToolsState,
  logThemeApplied,
  logModeChanged,
  logPerformanceWarning,
  logError,
  logThemeColorsGenerated,
  logPerformanceMetrics,
  logCacheStats,
  getEventHistory,
  clearEventHistory,
  getCurrentDevToolsState,
  subscribeDevToolsState,

  // SSR
  isServer,
  isClient,
  serializeThemeState,
  deserializeThemeState,
  generateInlineStyleScript,
  generateStateScript,
  getServerState,
  SSRContextManager,
  createSSRPlugin,
  handleHydrationMismatch,
  getSystemThemeSSR,
  getSSRSafeValue,
  setSSRSafeValue,
  waitForHydration,

  // Plugin (renamed to avoid conflict)
  createSimpleColorPlugin,
  LDesignColorPlugin,
  ColorPlugin as VueColorPlugin,
} from '@ldesign/color-vue'

// Re-export Vue-specific types
export type {
  UseColorThemeOptions,
  UseColorThemeReturn,
  UseThemeOptions,
  UseColorOptions,
  UseColorReturn,
  UseThemeModeOptions,
  UseThemeModeReturn,
  UseColorPerformanceOptions,
  UseColorPerformanceReturn,
  PerformanceMetrics as VuePerformanceMetrics,
  PerformanceWarning,
  PerformanceReport,
  CachedComputedOptions,
  CacheStats,
  ColorDevToolsState,
  ColorTimelineEvent,
  DebugPanelProps,
  SSRContext,
  SSROptions,
  SimpleColorPluginOptions,
} from '@ldesign/color-vue'

// Re-export ThemeMode from vue with alias
export type { ThemeMode as VueThemeMode } from '@ldesign/color-vue'

