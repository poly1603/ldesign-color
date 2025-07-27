---
layout: home

hero:
  name: "@ldesign/color"
  text: "高性能颜色生成库"
  tagline: 智能生成语义化颜色，支持明暗模式和12/14色阶
  image:
    src: /logo.svg
    alt: LDesign Color
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线演示
      link: /demo/
    - theme: alt
      text: 查看示例
      link: /examples/

features:
  - icon: 🎨
    title: 智能颜色生成
    details: 输入主色调，自动生成 success、warning、danger、gray 语义化颜色
  - icon: 🌓
    title: 明暗模式支持
    details: 完美支持明暗主题切换，自动生成对应的色阶
  - icon: 📊
    title: 丰富色阶
    details: 主色调和语义色生成12色阶，灰色生成14色阶，支持纯中性灰色
  - icon: 🎭
    title: 预设主题管理
    details: 内置12个精美预设主题，支持响应式数据和完整CRUD操作
  - icon: ⚡
    title: 超高性能
    details: Web Worker、智能缓存、防抖优化，避免阻塞主线程
  - icon: 🔧
    title: Vue 3 友好
    details: 提供组合式API和开箱即用的组件
  - icon: 💪
    title: TypeScript
    details: 完整的类型定义，开发体验一流
  - icon: 🎨
    title: CSS变量定制
    details: 支持自定义前缀和语义化名称，自动注入CSS变量到页面
---

## 快速预览

```typescript
import { generateTheme } from '@ldesign/color'

// 🎨 一行代码生成完整主题
const theme = generateTheme('#1890ff')

console.log(theme.semanticColors)
// {
//   primary: '#1890ff',
//   success: '#52c41a',
//   warning: '#faad14',
//   danger: '#f5222d',
//   gray: '#8c8c8c'
// }

console.log(theme.palettes.light.primary)
// ['#e6f7ff', '#bae7ff', '#91d5ff', ...] // 12个色阶

console.log(theme.palettes.dark.primary)
// ['#111d2c', '#112a3a', '#15395b', ...] // 暗黑模式12个色阶
```

## 🆕 新功能预览

```typescript
import { createPresetThemeManager, generateTheme } from '@ldesign/color'

// 🎨 高级配置
const theme = generateTheme('#1890ff', {
  grayMixPrimary: false, // 使用纯中性灰色（更深更实用）
  cssPrefix: 'my-app', // 自定义CSS变量前缀
  semanticNames: { // 自定义语义化名称
    primary: 'brand',
    success: 'positive'
  }
})

// 🎭 预设主题管理
const presetManager = createPresetThemeManager()
presetManager.addTheme({
  name: '企业蓝',
  color: '#0066cc'
})

// 💉 样式注入
theme.cssGenerator.injectToHead(theme.cssVariables)
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ColorPicker, ThemePreview, useColor } from '@ldesign/color'

const primaryColor = ref('#1890ff')

// 🚀 自动响应颜色变化，生成主题
const { theme, loading, error } = useColor(primaryColor)
</script>

<template>
  <div>
    <!-- 🎨 颜色选择器 -->
    <ColorPicker v-model="primaryColor" />

    <!-- 📊 主题预览 -->
    <ThemePreview v-if="theme" />

    <!-- ⚡ 加载状态 -->
    <div v-if="loading">
      正在生成主题...
    </div>
  </div>
</template>
```

## 为什么选择 @ldesign/color？

### 🎨 智能颜色生成

传统的手动配色：

```css
/* 需要手动定义每个颜色 */
:root {
  --primary: #1890ff;
  --success: #52c41a;  /* 手动选择 */
  --warning: #faad14;  /* 手动选择 */
  --danger: #f5222d;   /* 手动选择 */
  --gray: #8c8c8c;     /* 手动选择 */

  /* 还需要手动定义色阶... */
  --primary-1: #e6f7ff;
  --primary-2: #bae7ff;
  /* ... 更多色阶 */
}
```

使用 @ldesign/color：

```typescript
// 🎨 一行代码生成完整配色方案
const theme = generateTheme('#1890ff')

// ✨ 自动生成语义化颜色和完整色阶
// 🌓 自动支持明暗模式
// 🎯 自动注入CSS变量
```

### 🚀 强大的功能

- **智能算法** - 基于色彩理论的科学配色算法
- **性能优化** - Web Worker、缓存、防抖等多重优化
- **Vue 3 集成** - 原生支持组合式API和组件
- **TypeScript** - 完整的类型定义和智能提示
- **CSS变量** - 自动生成和注入CSS变量

### 📈 更好的开发体验

- **一键生成** - 输入主色调，自动生成完整主题
- **实时预览** - 颜色变化实时反馈
- **组件丰富** - 提供颜色选择器、色阶展示等组件
- **文档完善** - 详细的使用指南和API文档
