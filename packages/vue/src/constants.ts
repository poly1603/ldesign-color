/**
 * Constants for Vue color adapter
 */

import type { InjectionKey } from 'vue'
import type { BaseThemeAdapter } from '@ldesign/color-core/themes/BaseThemeAdapter'
import type { ColorEnginePluginOptions } from './plugins/engine-plugin'

// Injection keys
export const COLOR_SYMBOL = Symbol('color') as InjectionKey<BaseThemeAdapter>
export const COLOR_INJECTION_KEY = COLOR_SYMBOL // Main injection key
export const colorSymbol = COLOR_SYMBOL // Alias for compatibility

/** 插件配置注入 Key */
export const COLOR_CONFIG_SYMBOL = Symbol('color-config') as InjectionKey<ColorEnginePluginOptions>

// Component names
export const COMPONENT_PREFIX = 'Color'

// Default theme options
export const DEFAULT_THEME_OPTIONS = {
  autoApply: true,
  persistToLocalStorage: true,
  respectSystemPreference: true,
}
