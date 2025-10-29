/**
 * @ldesign/color-react
 *
 * React components and hooks for color theme management
 *
 * @packageDocumentation
 */

// Export hooks
export { ThemeProvider, useTheme, useThemeContext } from './hooks/useTheme'
export type { ThemeProviderProps, UseThemeOptions } from './hooks/useTheme'

// Export components
export { ThemePicker } from './components/ThemePicker'
export type { ThemePickerProps } from './components/ThemePicker'
export { ReactThemeModeSwitcher as ThemeModeSwitcher } from './components/ReactThemeModeSwitcher'
export type { ThemeMode, ReactThemeModeSwitcherProps as ThemeModeSwitcherProps } from './components/ReactThemeModeSwitcher'
