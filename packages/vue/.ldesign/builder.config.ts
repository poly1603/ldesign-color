import { defineConfig } from '@ldesign/builder'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  name: '@ldesign/color-vue',
  entry: './src/index.ts',
  outDir: {
    es: './es',
    lib: './lib'
  },
  formats: ['es', 'cjs'],
  dts: true,
  clean: true,
  external: ['vue', '@ldesign/color-core'],
  sourcemap: true,
  umd: {
    enabled: false
  },
  vite: {
    plugins: [vue()]
  }
})

