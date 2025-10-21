/**
 * Vue 3 Integration
 *
 * This file provides Vue-specific exports for @ldesign/color
 */
export { ColorPluginSymbol, createColorPlugin } from '../plugin';
export type { ColorPlugin, ColorPluginOptions } from '../plugin';
export { default as ThemePicker } from './ThemePicker.vue';
export { default as VueThemePicker } from './ThemePicker.vue';
export { default as ThemeModeSwitcher } from './VueThemeModeSwitcher.vue';
export { default as VueThemeModeSwitcher } from './VueThemeModeSwitcher.vue';
export { useTheme } from './useTheme';
export type { UseThemeOptions } from './useTheme';
