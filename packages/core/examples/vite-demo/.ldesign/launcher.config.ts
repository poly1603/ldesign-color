import { defineConfig } from '@ldesign/launcher'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: './src' },
      { find: '~', replacement: './' },
    ],
  },
})
