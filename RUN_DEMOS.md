# 运行演示项目指南

所有演示项目现在统一使用 `@ldesign/launcher` 进行管理，提供一致的开发体验。

## 📦 演示项目列表

| 包 | 路径 | 端口 | 框架 |
|---|---|---|---|
| Core | `packages/core/examples/vite-demo` | 3000 | Vanilla TS |
| React | `packages/react/examples/vite-demo` | 3001 | React 18 |
| Vue | `packages/vue/examples/vite-demo` | 3002 | Vue 3 |
| Svelte | `packages/svelte/examples/vite-demo` | 3003 | Svelte 4 |
| Solid.js | `packages/solid/examples/vite-demo` | 3004 | Solid.js 1.9 |

## 🚀 使用 Launcher 运行

### 单个项目

```bash
# Core 演示
cd packages/core/examples/vite-demo
pnpm install
pnpm dev          # 启动开发服务器 (端口 3000)
# pnpm build      # 构建生产版本
# pnpm preview    # 预览构建结果

# React 演示
cd packages/react/examples/vite-demo
pnpm install
pnpm dev          # 启动开发服务器 (端口 3001)

# Vue 演示
cd packages/vue/examples/vite-demo
pnpm install
pnpm dev          # 启动开发服务器 (端口 3002)

# Svelte 演示
cd packages/svelte/examples/vite-demo
pnpm install
pnpm dev          # 启动开发服务器 (端口 3003)

# Solid.js 演示
cd packages/solid/examples/vite-demo
pnpm install
pnpm dev          # 启动开发服务器 (端口 3004)
```

### 统一命令

所有演示项目支持相同的命令：

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本
pnpm preview  # 预览构建结果
```

## 🔧 Launcher 配置

每个演示项目都有一个 `launcher.config.ts` 文件，配置开发服务器和构建选项。

### Core 演示配置

```typescript
// packages/core/examples/vite-demo/launcher.config.ts
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
})
```

### React 演示配置

```typescript
// packages/react/examples/vite-demo/launcher.config.ts
import { defineConfig } from '@ldesign/launcher'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Vue 演示配置

```typescript
// packages/vue/examples/vite-demo/launcher.config.ts
import { defineConfig } from '@ldesign/launcher'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3002,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Svelte 演示配置

```typescript
// packages/svelte/examples/vite-demo/launcher.config.ts
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
})
```

### Solid.js 演示配置

```typescript
// packages/solid/examples/vite-demo/launcher.config.ts
import { defineConfig } from '@ldesign/launcher'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3004,
    open: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## 📁 包构建配置

所有包的构建配置已移至 `.ldesign/ldesign.config.ts`：

```
packages/
├── core/
│   ├── .ldesign/
│   │   └── ldesign.config.ts    ✅ 构建配置
│   └── examples/
│       └── vite-demo/
│           └── launcher.config.ts  ✅ 演示配置
├── react/
│   ├── .ldesign/
│   │   └── ldesign.config.ts
│   └── examples/
│       └── vite-demo/
│           └── launcher.config.ts
├── vue/
│   ├── .ldesign/
│   │   └── ldesign.config.ts
│   └── examples/
│       └── vite-demo/
│           └── launcher.config.ts
├── svelte/
│   ├── .ldesign/
│   │   └── ldesign.config.ts
│   └── examples/
│       └── vite-demo/
│           └── launcher.config.ts
└── solid/
    ├── .ldesign/
    │   └── ldesign.config.ts
    └── examples/
        └── vite-demo/
            └── launcher.config.ts
```

## ✨ Launcher 的优势

### 1. 统一的工具链
- 所有项目使用相同的命令
- 一致的开发体验
- 减少学习成本

### 2. 集中配置管理
- 构建配置在 `.ldesign/` 目录
- 演示配置在 `launcher.config.ts`
- 清晰的配置分层

### 3. 基于 Vite
- 继承 Vite 的所有优势
- 快速的 HMR
- 优秀的构建性能

### 4. 扩展性
- 支持自定义插件
- 支持环境配置
- 支持代理配置

## 🔄 从 Vite 迁移到 Launcher

所有演示项目已完成迁移：

### 变更内容

1. **配置文件**
   - 删除：`vite.config.ts`
   - 新增：`launcher.config.ts`

2. **package.json 脚本**
   ```diff
   - "dev": "vite"
   + "dev": "launcher dev"
   
   - "build": "vite build"
   + "build": "launcher build"
   
   - "preview": "vite preview"
   + "preview": "launcher preview"
   ```

3. **依赖包**
   ```diff
   - "vite": "^5.4.10"
   + "@ldesign/launcher": "workspace:*"
   ```

### API 兼容性

Launcher 完全兼容 Vite 的配置，无需修改应用代码。

## 🎯 最佳实践

### 开发时

```bash
# 快速启动开发服务器
pnpm dev

# 自动打开浏览器，端口已配置好
# Core:    http://localhost:3000
# React:   http://localhost:3001
# Vue:     http://localhost:3002
# Svelte:  http://localhost:3003
# Solid:   http://localhost:3004
```

### 构建时

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 清理

```bash
# 清理构建产物
rm -rf dist

# 清理依赖并重新安装
rm -rf node_modules
pnpm install
```

## 📝 常见问题

### Q: 为什么使用 Launcher 而不是直接使用 Vite？

A: Launcher 提供了：
- 统一的配置管理
- 更好的 monorepo 支持
- 扩展的工具链
- 一致的开发体验

### Q: Launcher 和 Vite 有什么区别？

A: Launcher 是基于 Vite JavaScript API 的封装，提供：
- 更简洁的配置语法
- 额外的开发工具
- 更好的错误处理
- 与 ldesign 生态集成

### Q: 可以自定义端口吗？

A: 可以！在 `launcher.config.ts` 中修改：

```typescript
export default defineConfig({
  server: {
    port: 5000, // 修改为你想要的端口
  },
})
```

### Q: 如何添加环境变量？

A: 在项目根目录创建 `.env` 文件：

```bash
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

然后在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 🔗 相关资源

- [Launcher 文档](../../../tools/launcher/README.md)
- [Vite 文档](https://vitejs.dev)
- [各包演示文档](./DEMO_PROJECTS.md)

## 🎉 开始使用

选择你喜欢的框架，进入对应的演示目录，运行 `pnpm dev` 即可！

**祝你使用愉快！** 🎨


