/**
 * Vue 3 Plugin for Color Theme Management
 */

import type { App, Plugin } from 'vue'
import type { UseThemeOptions } from '../composables/useTheme'
import { createThemeProvider } from '../composables/useTheme'
import ThemePicker from '../components/ThemePicker.vue'
import VueThemeModeSwitcher from '../components/VueThemeModeSwitcher.vue'

export interface ColorPluginOptions extends UseThemeOptions {
  // 鎻掍欢鐗瑰畾閫夐」
}

const ColorPlugin: Plugin = {
  install(app: App, options: ColorPluginOptions = {}) {
    // 娉ㄥ唽鍏ㄥ眬缁勪欢
    app.component('ThemePicker', ThemePicker)
    app.component('VueThemePicker', ThemePicker)
    app.component('ThemeModeSwitcher', VueThemeModeSwitcher)
    app.component('VueThemeModeSwitcher', VueThemeModeSwitcher)

    // 瀹夎涓婚鎻愪緵鑰?    const themeProvider = createThemeProvider(options)
    app.use(themeProvider)
  }
}

export default ColorPlugin
