import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@ldesign/color': path.resolve(__dirname, '../src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})