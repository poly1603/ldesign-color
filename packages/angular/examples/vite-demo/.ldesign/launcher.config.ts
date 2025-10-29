import { defineConfig } from '@ldesign/launcher'

export default defineConfig({
  // Angular 构建需要特殊配置
  build: {
    target: 'es2020',
    minify: 'esbuild',
    outDir: 'dist',
    sourcemap: true,
  },

  // 开发服务器配置
  server: {
    port: 3005,
    host: true,
    open: true,
  },

  // 优化配置
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      '@angular/forms',
      'rxjs',
      'zone.js',
    ],
  },

  // TypeScript 配置
  esbuild: {
    target: 'es2020',
    // Angular 装饰器需要保留元数据
    keepNames: true,
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
      },
    },
  },

  // 路径别名
  resolve: {
    alias: [
      { find: '@', replacement: './src' },
      { find: '~', replacement: './' },
    ],
  },

  // 定义全局变量
  define: {
    ngDevMode: true,
    ngI18nClosureMode: false,
  },
})

