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

// 新增的调色板 Hook
export { useColorPalette } from './composables/useColorPalette'
export type {
  UseColorPaletteOptions,
  UseColorPaletteReturn,
} from './composables/useColorPalette'

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

// Export components
export { default as ThemeColorPicker } from './components/ThemeColorPicker.vue'
export { default as ThemeModeSwitch } from './components/ThemeModeSwitcher.vue'
export { default as ThemeModeSwitcher } from './components/ThemeModeSwitcher.vue'
export { default as ColorPicker } from './components/ColorPicker.vue'
export { default as PaletteDisplay } from './components/PaletteDisplay.vue'
export { default as ThemeProvider } from './components/ThemeProvider.vue'

// Export plugin
export { createColorPlugin, LDesignColorPlugin } from './plugin/index'
export type { ColorPluginOptions } from './plugin/index'
export { default as ColorPlugin } from './plugin/index'
export { default } from './plugin/index'

// Export engine plugins
export { createColorEnginePlugin } from './plugins'
export type { ColorEnginePluginOptions } from './plugins'
