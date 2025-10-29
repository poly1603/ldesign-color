import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  name: '@ldesign/color-react',
  entry: './src/index.ts',
  outDir: {
    es: './es',
    lib: './lib'
  },
  formats: ['es', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom', '@ldesign/color-core', 'lucide-react'],
  sourcemap: true
})

