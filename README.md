# @ldesign/color

一个强大、高性能的颜色操作库，支持多种前端框架的主题管理功能。

> 📚 **新手？** 从这里开始 → [START_HERE.md](./START_HERE.md)  
> 🎬 **想看效果？** 查看 → [运行演示指南](./RUN_DEMOS.md)  
> 🔍 **深入了解？** 阅读 → [项目完整总结](./PROJECT_COMPLETE_SUMMARY.md)

## 🆕 v2.0.1 代码质量优化

**2026-01-05 更新**: 完成代码质量优化和健壮性增强！

### 🛠️ 代码结构优化
- ✅ **统一对象池实现** - 移除重复代码，统一使用 objectPool.ts
- ✅ **增强类型系统** - 新增 DeepReadonly、Branded、NumberInRange 等工具类型
- ✅ **完善类型守卫** - 新增 isRGBObject、isHSLObject、isHexColor 等函数

### 🛡️ 健壮性增强
- ✅ **NaN/Infinity 处理** - isFiniteNumber、assertFiniteNumber、clampSafe
- ✅ **循环引用检测** - hasCircularReference、assertNoCircularReference
- ✅ **批量验证** - validateColorArray、validateGradientStops

### 🎨 Color 类新功能
- ✨ `Color.fromCSSVariable()` - 从 CSS 变量创建颜色
- ✨ `color.toCSSVariables()` - 生成 CSS 变量对象
- ✨ `color.applyToElement()` - 应用颜色到 DOM 元素
- ✨ `color.gamutMap()` - 色域压缩算法
- ✨ `color.generateShades()` - 生成色谱色阶
- ✨ `color.harmonize()` - 计算调和色

### 📚 文档完善
- ✅ **JSDoc 注释** - 统一注释风格，添加 @example、@performance
- ✅ **README 更新** - 更新 API 文档和使用示例
- ✅ **版本号同步** - 更新至 v2.0.1

---

## 🚀 v2.0 全面优化

### 性能提升
- ⚡ **响应式更新减少 40-50%** - 使用 shallowRef/shallowReactive 优化
- ⚡ **Computed 计算减少 50%** - 智能缓存层和记忆化
- ⚡ **DOM 操作减少 80%** - 批量 RAF 更新策略
- ⚡ **内存占用优化 20-30%** - 改进缓存策略和对象池
- ⚡ **首次渲染提升 30%** - SSR 优化和预加载

### Core 包增强
- ✨ **高级插值算法** - Bezier、B-spline、自然样条插值
- ✨ **颜色科学功能** - 色差计算(Delta E)、色彩适应、色域映射
- ✨ **更多设计系统** - 新增 Bootstrap、GitHub Primer、Shopify Polaris
- ✅ **增强型验证** - 完整的输入验证和错误处理
- ✅ **智能缓存** - LRU 策略、TTL 过期、自动清理

### Vue 包优化
- 🔥 **性能监控** - useColorPerformance hook，实时性能评分和建议
- 🔥 **防抖节流** - 响应式 debounce/throttle 工具函数
- 🔥 **Computed 缓存** - 带 TTL、LRU 的缓存 computed
- 🔥 **DevTools 集成** - 事件时间线、状态检查器、性能追踪
- 🔥 **SSR 增强** - 完整的服务端渲染支持和 Hydration 优化

### 📖 详细信息
- 查看 [性能优化指南](./PERFORMANCE_GUIDE.md) 了解最佳实践
- 查看 [常见问题](./FAQ.md) 获取使用帮助
- **100% 向后兼容** - 无需更改现有代码

## 包结构

此包现在是一个 monorepo，包含以下子包：

### [@ldesign/color-core](./packages/core)
核心颜色处理库，框架无关。
```bash
pnpm add @ldesign/color-core
```

### [@ldesign/color-vue](./packages/vue)
Vue 3 组件和组合式 API。
```bash
pnpm add @ldesign/color-vue @ldesign/color-core
```

### [@ldesign/color-react](./packages/react)
React 组件和 Hooks。
```bash
pnpm add @ldesign/color-react @ldesign/color-core
```

### [@ldesign/color-svelte](./packages/svelte)
Svelte 组件和 Stores。
```bash
pnpm add @ldesign/color-svelte @ldesign/color-core
```

### [@ldesign/color-solid](./packages/solid)
Solid.js 组件和 Primitives。
```bash
pnpm add @ldesign/color-solid @ldesign/color-core
```

## 演示项目

每个包都提供了完整的演示项目，使用 `@ldesign/launcher` 统一管理：

- 🎨 [Core 演示](./packages/core/examples/vite-demo) - Vanilla TypeScript (端口 3000)
- ⚛️ [React 演示](./packages/react/examples/vite-demo) - React 18 (端口 3001)
- 💚 [Vue 演示](./packages/vue/examples/vite-demo) - Vue 3 (端口 3002)
- 🧡 [Svelte 演示](./packages/svelte/examples/vite-demo) - Svelte 4 (端口 3003)
- 🔵 [Solid.js 演示](./packages/solid/examples/vite-demo) - Solid.js 1.9 (端口 3004)

### 快速运行

```bash
# 进入任意演示目录
cd packages/[package]/examples/vite-demo

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

详细说明请查看：
- [演示项目指南](./DEMO_PROJECTS.md)
- [运行演示指南](./RUN_DEMOS.md)
- [Launcher 迁移报告](./LAUNCHER_MIGRATION_COMPLETE.md)

## 快速开始

### 核心库使用

```typescript
import { Color } from '@ldesign/color-core'

const color = new Color('#3b82f6')
const lighter = color.lighten(20)
const darker = color.darken(20)

// 生成调色板
import { generateTailwindPalette } from '@ldesign/color-core'
const palette = generateTailwindPalette('#3b82f6')
```

### Vue 3 使用

```vue
<script setup>
import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-vue'

const { currentTheme, primaryColor, applyTheme } = useTheme()
</script>

<template>
  <div>
    <ThemePicker />
    <ThemeModeSwitcher />
    <p>当前主题色: {{ primaryColor }}</p>
  </div>
</template>
```

### React 使用

```tsx
import { ThemeProvider, useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-react'

function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  )
}

function MyComponent() {
  const { currentTheme, primaryColor, applyTheme } = useTheme()
  
  return (
    <div>
      <ThemePicker />
      <ThemeModeSwitcher />
      <p>当前主题色: {primaryColor}</p>
    </div>
  )
}
```

### Svelte 使用

```svelte
<script>
  import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-svelte'

  const { currentTheme, primaryColor, applyTheme } = useTheme()
</script>

<div>
  <ThemePicker />
  <ThemeModeSwitcher />
  <p>当前主题色: {$primaryColor}</p>
</div>
```

### Solid.js 使用

```tsx
import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-solid'

function App() {
  const { currentTheme, primaryColor, applyTheme } = useTheme()
  
  return (
    <div>
      <ThemePicker />
      <ThemeModeSwitcher />
      <p>当前主题色: {primaryColor()}</p>
    </div>
  )
}
```

## 特性

- 🎨 **强大的颜色操作** - 支持 RGB、HSL、HSV、HWB、LAB、LCH、OKLAB、OKLCH 等多种颜色空间
- 🎭 **主题管理** - 内置明暗模式切换，支持自定义主题
- 🌈 **调色板生成** - 支持 Material Design、Tailwind、Ant Design 等设计系统
- ♿ **无障碍支持** - WCAG 合规性检查，色盲模拟
- 🚀 **高性能** - 优化的算法、缓存机制、内存管理
- 📦 **Tree-shakeable** - 只导入你需要的功能
- 💪 **TypeScript** - 完整的类型安全和智能提示
- 🔌 **多框架支持** - React、Vue、Svelte、Solid.js 统一 API

## 开发

### 构建包

```bash
# 安装依赖
pnpm install

# 构建所有子包
pnpm build

# 构建特定子包
pnpm build:core
pnpm build:vue
pnpm build:react
pnpm build:svelte
pnpm build:solid

# 开发模式（所有包）
pnpm dev

# 开发模式（特定包）
pnpm dev:core
pnpm dev:vue
pnpm dev:react
pnpm dev:svelte
pnpm dev:solid
```

### 运行演示项目

所有演示项目使用 `@ldesign/launcher` 管理：

```bash
# 进入演示目录
cd packages/[package]/examples/vite-demo

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览
pnpm preview
```

## 文档

详细文档请访问各子包的 README：
- [Core 文档](./packages/core/README.md)
- [Vue 文档](./packages/vue/README.md)
- [React 文档](./packages/react/README.md)
- [Svelte 文档](./packages/svelte/README.md)
- [Solid.js 文档](./packages/solid/README.md)

## 架构设计

### 核心原则

1. **框架无关的核心** - 所有颜色操作逻辑在 `@ldesign/color-core` 中实现
2. **框架特定的封装** - 每个框架包只负责适配框架特性（响应式、组件）
3. **统一的 API** - 所有框架包提供相同的方法和属性
4. **最小化依赖** - 框架包只依赖 core 和对应的框架

### 包职责

- **core**: 颜色操作、主题管理器、类型定义、工具函数
- **react**: useTheme hook、ThemeProvider、React 组件
- **vue**: useTheme composable、插件、Vue 组件
- **svelte**: useTheme store、Svelte 组件
- **solid**: useTheme primitive、Solid.js 组件

## License

MIT © ldesign
