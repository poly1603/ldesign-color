/**
* Vue 3 Plugin for Color Theme Management
*/

import type { App, Plugin } from 'vue'
import type { UseThemeOptions } from '../composables/useTheme'
import type { PresetTheme } from '@ldesign/color-core'
import { BaseThemeAdapter } from '@ldesign/color-core'
import { COLOR_SYMBOL } from '../constants'
import ThemeColorPicker from '../components/ThemeColorPicker.vue'
import ThemeModeSwitcher from '../components/ThemeModeSwitcher.vue'

export interface ColorPluginOptions extends UseThemeOptions {
  /** 是否注册全局组件 */
  globalComponents?: boolean
  /** 是否添加全局属性 */
  globalProperties?: boolean
  /** 主题色（支持色值或预设名称） */
  primaryColor?: string
  /** 自定义预设主题数组 */
  customPresets?: PresetTheme[]
}

/**
 * 创建颜色主题插件
 * 
 * @param options - 插件配置选项
 * @returns Vue 插件
 */
export function createColorPlugin(options: ColorPluginOptions = {}): Plugin {
  const {
    globalComponents = true,
    globalProperties = true,
    ...themeOptions
  } = options

  // 创建全局主题适配器实例
  const themeAdapter = new BaseThemeAdapter(themeOptions)

  return {
    install(app: App) {
      console.log('[createColorPlugin] install() called')
      console.log('[createColorPlugin] COLOR_SYMBOL:', COLOR_SYMBOL)

      // Provide theme adapter instance
      app.provide(COLOR_SYMBOL, themeAdapter)
      console.log('[createColorPlugin] app.provide() completed')

      // Add global properties
      if (globalProperties) {
        app.config.globalProperties.$color = themeAdapter
        app.config.globalProperties.$theme = themeAdapter
        console.log('[createColorPlugin] Global properties added')
      }

      // Register global components
      if (globalComponents) {
        app.component('ThemeColorPicker', ThemeColorPicker)
        app.component('ThemeModeSwitcher', ThemeModeSwitcher)
        app.component('ThemeModeSwitch', ThemeModeSwitcher)
        console.log('[createColorPlugin] Global components registered')
      }

      // Cleanup on app unmount
      const originalUnmount = app.unmount
      app.unmount = function () {
        themeAdapter.destroy()
        console.log('[createColorPlugin] Theme adapter destroyed')
        // @ts-expect-error - unmount types
        return originalUnmount.apply(this, arguments)
      }
    },
  }
}

/**
 * 颜色主题插件类
 */
export class LDesignColorPlugin {
  private options: ColorPluginOptions

  constructor(options: ColorPluginOptions = {}) {
    this.options = options
  }

  install(app: App) {
    createColorPlugin(this.options).install(app)
  }
}

/**
 * 默认导出插件实例
 */
const ColorPlugin = {
  install(app: App, options: ColorPluginOptions = {}) {
    createColorPlugin(options).install(app)
  },
}

export default ColorPlugin
