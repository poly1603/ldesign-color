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

// Export components - 使用新的目录结构
export { default as ColorPicker } from './color-picker'
export { default as PaletteDisplay } from './palette-display'
export { default as ThemeColorPicker } from './theme-color-picker'
export { default as ThemeModeSwitch } from './theme-mode-switcher'
export { default as ThemeModeSwitcher } from './theme-mode-switcher'
export { default as ThemeProvider } from './theme-provider'

// Export plugin
export { createColorPlugin, LDesignColorPlugin } from './plugin/index'
export type { ColorPluginOptions } from './plugin/index'
export { default as ColorPlugin } from './plugin/index'
export { default } from './plugin/index'
