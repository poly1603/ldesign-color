﻿/**
* @ldesign/color-vue
*
* Vue 3 components and composables for color theme management
*
* @packageDocumentation
*/

// ========== 新的主题色彩 API ==========
// 基于主色调生成完整主题的响应式 Hook
export { useColorTheme } from './composables/useColorTheme'
export type {
  ThemeMode,
  UseColorThemeOptions,
  UseColorThemeReturn,
} from './composables/useColorTheme'

// Vue Plugin - 新的简化 API
export { createColorPlugin as createSimpleColorPlugin } from './plugin/color-plugin'
export type { ColorPluginOptions as SimpleColorPluginOptions } from './plugin/color-plugin'

// ========== 原有 API（保持向后兼容） ==========

// Export constants
export * from './constants'

// Export composables
export { createThemeProvider, useTheme } from './composables/useTheme'
export type { UseThemeOptions } from './composables/useTheme'

export { useColor } from './composables/useColor'
export type { UseColorOptions, UseColorReturn } from './composables/useColor'

export { createThemeModeProvider, useThemeMode } from './composables/useThemeMode'
export type { UseThemeModeOptions, UseThemeModeReturn } from './composables/useThemeMode'

// Performance monitoring
export { useColorPerformance } from './composables/useColorPerformance'
export type {
  UseColorPerformanceOptions,
  UseColorPerformanceReturn,
  PerformanceMetrics,
  PerformanceWarning,
  PerformanceReport,
} from './composables/useColorPerformance'

// Throttle & Debounce utilities
export {
  debounce,
  throttle,
  useDebouncedRef,
  useThrottledRef,
  debouncedWatch,
  throttledWatch,
  batchRAF,
  useDebouncedRefSync,
  useThrottledRefSync,
} from './utils/throttle-debounce'

// Computed cache utilities
export {
  cachedComputed,
  debouncedComputed,
  throttledComputed,
  memoizedComputed,
  lazyComputed,
  CacheManager,
  globalCacheManager,
} from './utils/computed-cache'
export type {
  CachedComputedOptions,
  CacheStats,
} from './utils/computed-cache'

// DevTools integration
export {
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
} from './devtools/index'
export type {
  ColorDevToolsState,
  ColorTimelineEvent,
  DebugPanelProps,
} from './devtools/index'

// SSR support
export {
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
} from './ssr/index'
export type {
  SSRContext,
  SSROptions,
} from './ssr/index'

// Export components
export { default as ThemeColorPicker } from './components/ThemeColorPicker'
export { default as ThemeModeSwitch } from './components/ThemeModeSwitcher'
export { default as ThemeModeSwitcher } from './components/ThemeModeSwitcher'

// Export plugin
export { createColorPlugin, LDesignColorPlugin } from './plugin/index'
export type { ColorPluginOptions } from './plugin/index'
export { default as ColorPlugin } from './plugin/index'
export { default } from './plugin/index'
