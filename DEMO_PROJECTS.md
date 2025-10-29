# 演示项目指南

本文档介绍如何运行各个包的演示项目。每个包都提供了一个完整的演示应用，展示其核心功能。

**🔧 统一工具**: 所有演示项目使用 `@ldesign/launcher` 进行管理，提供一致的开发体验。

## 📦 演示项目列表

### 1. Core 包演示（Vanilla TypeScript）
**路径**: `packages/core/examples/vite-demo`  
**端口**: 3000  
**技术栈**: Vanilla TypeScript + Vite

**运行命令**:
```bash
cd packages/core/examples/vite-demo
pnpm install
pnpm dev          # 使用 launcher dev
# pnpm build      # 使用 launcher build
# pnpm preview    # 使用 launcher preview
```

**功能展示**:
- ✅ ThemeManager 主题管理
- ✅ 颜色操作（变亮、变暗、饱和度）
- ✅ Tailwind 调色板生成
- ✅ WCAG 无障碍检查
- ✅ 明暗模式切换

---

### 2. React 包演示
**路径**: `packages/react/examples/vite-demo`  
**端口**: 3001  
**技术栈**: React 18 + TypeScript + Vite

**运行命令**:
```bash
cd packages/react/examples/vite-demo
pnpm install
pnpm dev
```

**功能展示**:
- ✅ ThemeProvider 上下文
- ✅ useTheme Hook
- ✅ ThemePicker 组件
- ✅ ThemeModeSwitcher 组件
- ✅ 自定义主题色
- ✅ 预设主题切换
- ✅ 实时颜色操作演示

---

### 3. Vue 包演示
**路径**: `packages/vue/examples/vite-demo`  
**端口**: 3002  
**技术栈**: Vue 3 + TypeScript + Vite

**运行命令**:
```bash
cd packages/vue/examples/vite-demo
pnpm install
pnpm dev
```

**功能展示**:
- ✅ useTheme Composable
- ✅ ThemePicker 组件
- ✅ ThemeModeSwitcher 组件
- ✅ 响应式主题管理
- ✅ 自定义主题色
- ✅ 预设主题切换
- ✅ 实时颜色操作演示

---

### 4. Svelte 包演示
**路径**: `packages/svelte/examples/vite-demo`  
**端口**: 3003  
**技术栈**: Svelte 4 + TypeScript + Vite

**运行命令**:
```bash
cd packages/svelte/examples/vite-demo
pnpm install
pnpm dev
```

**功能展示**:
- ✅ useTheme Stores
- ✅ ThemePicker 组件
- ✅ ThemeModeSwitcher 组件
- ✅ Svelte 响应式系统
- ✅ 自定义主题色
- ✅ 预设主题切换
- ✅ 实时颜色操作演示

---

### 5. Solid.js 包演示
**路径**: `packages/solid/examples/vite-demo`  
**端口**: 3004  
**技术栈**: Solid.js 1.9 + TypeScript + Vite

**运行命令**:
```bash
cd packages/solid/examples/vite-demo
pnpm install
pnpm dev
```

**功能展示**:
- ✅ useTheme Primitive
- ✅ ThemePicker 组件
- ✅ ThemeModeSwitcher 组件
- ✅ 细粒度响应式
- ✅ 自定义主题色
- ✅ 预设主题切换
- ✅ 实时颜色操作演示

---

## 🚀 使用 Launcher 运行

### 单个演示项目

所有演示项目使用统一的 launcher 命令：

```bash
# 进入任意演示目录
cd packages/[package]/examples/vite-demo

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 同时运行多个演示

```bash
# Windows PowerShell
Start-Process pnpm -ArgumentList "dev" -WorkingDirectory "packages/core/examples/vite-demo"
Start-Process pnpm -ArgumentList "dev" -WorkingDirectory "packages/react/examples/vite-demo"
Start-Process pnpm -ArgumentList "dev" -WorkingDirectory "packages/vue/examples/vite-demo"
Start-Process pnpm -ArgumentList "dev" -WorkingDirectory "packages/svelte/examples/vite-demo"
Start-Process pnpm -ArgumentList "dev" -WorkingDirectory "packages/solid/examples/vite-demo"
```

**访问地址**:
- Core: http://localhost:3000
- React: http://localhost:3001
- Vue: http://localhost:3002
- Svelte: http://localhost:3003
- Solid.js: http://localhost:3004

---

## 📁 项目结构

每个演示项目都遵循标准结构，使用 Launcher 管理：

```
examples/vite-demo/
├── index.html          # HTML 入口
├── package.json        # 依赖配置
├── launcher.config.ts  # Launcher 配置 (替代 vite.config.ts)
├── tsconfig.json       # TypeScript 配置
└── src/
    ├── main.ts/tsx     # 应用入口
    ├── App.vue/svelte  # 主组件（框架特定）
    └── style.css       # 样式文件
```

## 🔧 Launcher 配置

每个演示项目的 `launcher.config.ts` 配置了开发服务器端口和构建选项：

```typescript
import { defineConfig } from '@ldesign/launcher'
import frameworkPlugin from '@framework/plugin' // 框架特定插件

export default defineConfig({
  plugins: [frameworkPlugin()],
  server: {
    port: 3000,  // 演示项目专用端口
    open: true,  // 自动打开浏览器
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

---

## 🎨 演示功能对比

所有演示项目提供相同的功能，只是使用各自框架的语法：

| 功能 | Core | React | Vue | Svelte | Solid.js |
|------|------|-------|-----|--------|----------|
| 主题管理 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 主题选择器 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 模式切换器 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 预设主题 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 自定义颜色 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 颜色操作 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 调色板生成 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 无障碍检查 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 主题持久化 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 明暗模式 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🛠️ 开发技巧

### 修改演示代码

所有演示项目都支持热模块替换（HMR），你可以：

1. 修改主题色
2. 调整组件样式
3. 添加新功能
4. 测试 API

修改会立即反映在浏览器中，无需刷新页面。

### 调试

每个演示项目都包含一个"Debug"面板，显示当前主题的完整状态：

```typescript
{
  "primaryColor": "#1890ff",
  "themeName": "blue",
  "isDark": false,
  "prefix": "demo",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### 性能监控

打开浏览器开发者工具的 Performance 标签，可以对比不同框架的性能特点：

- **React**: 基于 Virtual DOM，适度的重渲染
- **Vue**: 响应式系统，精确的更新
- **Svelte**: 编译时优化，最小的运行时
- **Solid.js**: 细粒度响应式，极致性能

---

## 🔧 故障排查

### 端口被占用

如果端口已被占用，可以修改 `vite.config.ts` 中的端口号：

```typescript
export default defineConfig({
  server: {
    port: 3005, // 修改为其他端口
  },
})
```

### 依赖安装失败

确保使用 pnpm 并且在 monorepo 根目录先执行：

```bash
pnpm install
```

### 类型错误

如果遇到 TypeScript 类型错误，尝试重新构建核心包：

```bash
# 在项目根目录
pnpm build:core
```

### 样式未生效

确保 CSS 变量已正确注入。检查 `<html>` 元素的 attributes：

```html
<html data-theme-mode="dark" theme-mode="dark" class="dark">
```

---

## 📝 贡献指南

欢迎为演示项目贡献新功能或改进：

1. **添加新示例**: 在 `src/` 目录添加新的演示组件
2. **改进 UI**: 更新样式使其更美观
3. **性能优化**: 优化渲染性能
4. **文档**: 改进代码注释和说明

---

## 🎓 学习资源

通过运行这些演示项目，你可以学习：

1. **如何集成主题管理**: 查看各框架的初始化代码
2. **响应式系统差异**: 对比不同框架的响应式实现
3. **组件设计**: 学习如何设计跨框架的组件 API
4. **性能优化**: 观察不同框架的性能特点

---

## 📱 移动端支持

所有演示项目都支持移动端访问：

1. 确保设备与开发机在同一网络
2. 查找开发机的 IP 地址
3. 在移动设备浏览器访问 `http://[IP]:[PORT]`

例如：`http://192.168.1.100:3001`

---

## 🌐 部署

### 构建生产版本

```bash
cd packages/[package-name]/examples/vite-demo
pnpm build
```

构建产物在 `dist/` 目录，可以部署到任何静态托管服务：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### 预览生产构建

```bash
pnpm preview
```

---

## ❓ 常见问题

### Q: 为什么要为每个包创建单独的演示？

A: 每个包都有其独特的 API 和使用方式，独立的演示项目可以：
- 展示框架特定的最佳实践
- 提供完整的使用示例
- 方便测试和调试
- 帮助开发者快速上手

### Q: 可以在生产项目中使用这些演示代码吗？

A: 可以！这些演示代码都是生产就绪的，你可以：
- 复制组件代码
- 参考API使用方式
- 学习最佳实践

### Q: 演示项目会随着包更新吗？

A: 是的，演示项目会保持与主包同步，展示最新的功能和 API。

---

## 🎉 开始探索

选择你喜欢的框架，运行对应的演示项目，开始探索 `@ldesign/color` 的强大功能吧！

如果你有任何问题或建议，欢迎提交 Issue 或 Pull Request。

**祝你使用愉快！** 🎨

