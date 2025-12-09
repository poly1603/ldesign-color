/**
 * @ldesign/color-vue 构建配置
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  input: {
    index: 'src/index.ts',
    'color-picker/index': 'src/color-picker/index.ts',
    'devtools/index': 'src/devtools/index.ts',
    'palette-display/index': 'src/palette-display/index.ts',
    'plugin/index': 'src/plugin/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'ssr/index': 'src/ssr/index.ts',
    'theme-color-picker/index': 'src/theme-color-picker/index.ts',
    'theme-mode-switcher/index': 'src/theme-mode-switcher/index.ts',
    'theme-provider/index': 'src/theme-provider/index.ts',
  },

  output: {
    format: ['esm', 'cjs', 'umd'],
    esm: { dir: 'esm', preserveStructure: true },
    cjs: { dir: 'cjs', preserveStructure: true },
    umd: { dir: 'dist', name: 'LDesignColorVue', minify: true },
  },

  dts: true,
  external: [
    'vue',
    '@ldesign/color-core',
    '@ldesign/color-core/types',
    '@ldesign/engine-core',
    '@ldesign/engine-core/types',
    '@ldesign/engine-core/constants/events',
  ],
  globals: {
    vue: 'Vue',
    '@ldesign/color-core': 'LDesignColorCore',
    '@ldesign/engine-core': 'LDesignEngineCore'
  },
  clean: true,
  sourcemap: false,
})
