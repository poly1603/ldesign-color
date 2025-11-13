/**
 * @ldesign/color-vue - Vue Plugin
 * 
 * Vue 3 插件，用于全局安装色彩主题功能
 */

import type { App, Plugin } from 'vue'

/**
 * 插件选项
 */
export interface ColorPluginOptions {
  /** 初始主色调 */
  primaryColor?: string
  /** 初始主题模式 */
  initialMode?: 'light' | 'dark' | 'auto'
  /** CSS 变量前缀 */
  prefix?: string
  /** 是否包含语义别名 */
  includeAliases?: boolean
  /** 是否持久化 */
  persist?: boolean
}

/**
 * 创建色彩插件
 * 
 * @param options - 插件选项
 * @returns Vue 插件
 * 
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createColorPlugin } from '@ldesign/color-vue'
 * import App from './App.vue'
 * 
 * const app = createApp(App)
 * 
 * app.use(createColorPlugin({
 *   primaryColor: '#1890ff',
 *   initialMode: 'auto',
 *   prefix: 'color',
 *   includeAliases: true
 * }))
 * 
 * app.mount('#app')
 * ```
 */
export function createColorPlugin(options: ColorPluginOptions = {}): Plugin {
  return {
    install(app: App) {
      // 这里会在后续实现中注入全局功能
      // 暂时先提供基础结构

      app.config.globalProperties.$colorTheme = {
        options,
      }

      console.log('[@ldesign/color-vue] Plugin installed with options:', options)
    },
  }
}

export default createColorPlugin
