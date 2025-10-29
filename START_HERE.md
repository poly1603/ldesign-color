# 从这里开始 🚀

欢迎使用 `@ldesign/color` - 多框架通用的主题色管理库！

## 🎯 我想要...

### 💡 快速了解项目

👉 阅读 [主 README](./README.md)

**5 分钟了解**：
- 项目是什么
- 支持哪些框架
- 核心功能有哪些
- 如何安装使用

---

### 🎨 在我的项目中使用

#### React 项目

```bash
# 1. 安装
pnpm add @ldesign/color-react @ldesign/color-core

# 2. 使用
```

```tsx
import { ThemeProvider, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-react'

function App() {
  return (
    <ThemeProvider>
      <ThemePicker />
      <ThemeModeSwitcher />
    </ThemeProvider>
  )
}
```

👉 详细文档：[React README](./packages/react/README.md)

#### Vue 项目

```bash
# 1. 安装
pnpm add @ldesign/color-vue @ldesign/color-core

# 2. 使用
```

```vue
<script setup>
import { ThemePicker, ThemeModeSwitcher } from '@ldesign/color-vue'
</script>

<template>
  <ThemePicker />
  <ThemeModeSwitcher />
</template>
```

👉 详细文档：[Vue README](./packages/vue/README.md)

#### Svelte 项目

```bash
# 1. 安装
pnpm add @ldesign/color-svelte @ldesign/color-core

# 2. 使用
```

```svelte
<script>
import { ThemePicker, ThemeModeSwitcher } from '@ldesign/color-svelte'
</script>

<ThemePicker />
<ThemeModeSwitcher />
```

👉 详细文档：[Svelte README](./packages/svelte/README.md)

#### Solid.js 项目

```bash
# 1. 安装
pnpm add @ldesign/color-solid @ldesign/color-core

# 2. 使用
```

```tsx
import { ThemePicker, ThemeModeSwitcher } from '@ldesign/color-solid'

function App() {
  return (
    <>
      <ThemePicker />
      <ThemeModeSwitcher />
    </>
  )
}
```

👉 详细文档：[Solid.js README](./packages/solid/README.md)

---

### 🎬 运行演示项目

想看看实际效果？运行演示项目：

```bash
# 选择你喜欢的框架
cd packages/react/examples/vite-demo    # 或 vue/svelte/solid/core

# 安装依赖
pnpm install

# 启动演示（会自动打开浏览器）
pnpm dev
```

**演示项目端口**：
- Core (Vanilla TS): http://localhost:3000
- React: http://localhost:3001
- Vue: http://localhost:3002
- Svelte: http://localhost:3003
- Solid.js: http://localhost:3004

👉 详细说明：[运行演示指南](./RUN_DEMOS.md)

---

### 📚 深入学习

#### 理解 API 设计

👉 [框架对比文档](./FRAMEWORK_COMPARISON.md)

**内容包括**：
- 4 个框架的语法对比
- 响应式系统差异
- 性能特点分析
- 最佳实践建议

#### 理解架构设计

👉 [框架支持完成报告](./FRAMEWORK_SUPPORT_COMPLETE.md)

**内容包括**：
- 架构设计原则
- 包职责分工
- API 一致性说明
- 扩展性分析

#### 查看完整统计

👉 [项目完整总结](./PROJECT_COMPLETE_SUMMARY.md)

**内容包括**：
- 完整的功能清单
- 代码统计数据
- 性能分析
- 文档索引

---

### 🔧 参与开发

#### 构建包

```bash
# 在项目根目录

# 构建所有包
pnpm build

# 构建单个包
pnpm build:react    # 或 vue/svelte/solid/core
```

**构建配置位置**: `packages/[package]/.ldesign/ldesign.config.ts`

#### 修改演示项目

```bash
# 进入演示目录
cd packages/[package]/examples/vite-demo

# 启动开发服务器
pnpm dev

# 修改代码后会自动热更新
```

**演示配置位置**: `launcher.config.ts`

👉 技术报告：[Launcher 迁移完成报告](./LAUNCHER_MIGRATION_COMPLETE.md)

---

## 🗺️ 目录导航

### 包源码

```
packages/
├── core/              # 核心库
├── react/             # React 适配
├── vue/               # Vue 适配
├── svelte/            # Svelte 适配
└── solid/             # Solid.js 适配
```

### 演示项目

```
packages/*/examples/vite-demo/
```

### 文档

```
根目录下的 *.md 文件
```

---

## ❓ 常见问题

### 我应该使用哪个包？

- 使用 **React**？ → `@ldesign/color-react`
- 使用 **Vue 3**？ → `@ldesign/color-vue`
- 使用 **Svelte**？ → `@ldesign/color-svelte`
- 使用 **Solid.js**？ → `@ldesign/color-solid`
- 不使用框架？ → `@ldesign/color-core`

### 所有框架的 API 一样吗？

是的！所有框架提供**完全相同**的 API，只是响应式访问方式略有不同：

- React: `primaryColor`
- Vue: `primaryColor.value`
- Svelte: `$primaryColor`
- Solid.js: `primaryColor()`

### 如何自定义主题色？

```javascript
const { applyTheme } = useTheme()
applyTheme('#1890ff')  // 应用任何颜色
```

### 如何切换明暗模式？

使用 `ThemeModeSwitcher` 组件，或者：

```javascript
// 手动设置
document.documentElement.setAttribute('theme-mode', 'dark')
```

### 主题会自动保存吗？

是的！默认保存到 localStorage，页面刷新后会自动恢复。

---

## 🎉 开始使用

1. **选择框架** - React / Vue / Svelte / Solid.js
2. **安装包** - `pnpm add @ldesign/color-[framework]`
3. **查看文档** - 阅读对应框架的 README
4. **运行演示** - 看看实际效果
5. **集成到项目** - 复制示例代码

**祝你使用愉快！** 🎨

---

## 📞 获取帮助

- 📖 查看文档（13 个详细文档）
- 🎬 运行演示项目
- 💬 提交 Issue
- 🤝 贡献代码

**项目地址**: `D:\WorkBench\ldesign\packages\color`
