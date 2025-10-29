import { defineConfig } from '@ldesign/launcher'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3003,
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
