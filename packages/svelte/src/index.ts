/**
 * @ldesign/color-svelte
 *
 * Svelte components and stores for color theme management
 *
 * @packageDocumentation
 */

// Export stores
export { useTheme } from './stores/useTheme'
export type { UseThemeOptions } from './stores/useTheme'

// Export components
export { default as ThemePicker } from './components/ThemePicker.svelte'
export { default as ThemeModeSwitcher } from './components/ThemeModeSwitcher.svelte'
export type { ThemeMode } from './components/ThemeModeSwitcher.svelte'


