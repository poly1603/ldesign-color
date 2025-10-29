import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: '@ldesign/color-core',
  entry: './src/index.ts',
  outDir: {
    es: './es',
    lib: './lib'
  },
  formats: ['es', 'cjs'],
  dts: true,
  clean: true,
  external: [],
  sourcemap: true
})

