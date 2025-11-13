/**
 * Constants for Vue color adapter
 */

import type { InjectionKey } from 'vue'
import type { BaseThemeAdapter } from '@ldesign/color-core/themes/BaseThemeAdapter'

// Injection keys
export const COLOR_SYMBOL = Symbol('color') as InjectionKey<BaseThemeAdapter>
export const COLOR_INJECTION_KEY = COLOR_SYMBOL // Main injection key
export const colorSymbol = COLOR_SYMBOL // Alias for compatibility

// Component names
export const COMPONENT_PREFIX = 'Color'

// Default theme options
export const DEFAULT_THEME_OPTIONS = {
  autoApply: true,
  persistToLocalStorage: true,
  respectSystemPreference: true,
}
