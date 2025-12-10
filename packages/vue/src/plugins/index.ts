/**
 * Color Vue Plugins
 *
 * 导出 Engine 插件和类型
 */
export {
  createColorEnginePlugin,
  useColorFromEngine,
} from './engine-plugin'

export type {
  ThemeMode,
  ThemePresetName,
  ThemePreset,
  CustomColorPreset,
  ColorPickerConfig,
  ModeSwitcherConfig,
  ColorPluginContext,
  ColorEnginePluginOptions,
} from './engine-plugin'
