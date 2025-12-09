/**
 * @ldesign/color-core 构建配置
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  // 单入口配置 - 通过主入口重导出所有模块
  input: 'src/index.ts',

  // 输出配置 - 完整产物
  output: {
    format: ['esm', 'cjs', 'umd'],
    esm: { dir: 'es', preserveStructure: true },
    cjs: { dir: 'lib', preserveStructure: true },
    umd: { dir: 'dist', name: 'LDesignColorCore', minify: true },
  },

  dts: true,
  external: [],
  clean: true,
  sourcemap: false,
})
