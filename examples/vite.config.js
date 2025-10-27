import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@ldesign/color': path.resolve(__dirname, '../src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
