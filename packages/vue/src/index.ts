/**
 * @ldesign/color-vue
 *
 * Vue 3 components and composables for color theme management
 *
 * @packageDocumentation
 */

// Export composables
export { createThemeProvider, useTheme } from './composables/useTheme'
export type { UseThemeOptions } from './composables/useTheme'

// Export components
export { default as ThemePicker } from './components/ThemePicker.vue'
export { default as VueThemePicker } from './components/ThemePicker.vue'
export { default as ThemeModeSwitcher } from './components/VueThemeModeSwitcher.vue'
export { default as VueThemeModeSwitcher } from './components/VueThemeModeSwitcher.vue'

// Export plugin
export { default as ColorPlugin } from './plugin/index'
export { default } from './plugin/index'
