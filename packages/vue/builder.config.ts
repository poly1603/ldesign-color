/**
 * @ldesign/color-vue Builder Configuration
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
  external: ['vue', '@ldesign/color-core'],
  minify: false,
  sourcemap: true,
})

