/**
 * @ldesign/color-core Builder Configuration
 */

import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  output: {
    formats: ['esm', 'cjs', 'dts'],
  },
  dts: {
    enabled: true,
  },
  external: [],
  minify: false, // 保持可读性，便于调试
  sourcemap: true,
})

