# 快速开始

欢迎使用 @ldesign/color！这是一个高性能的颜色生成和管理库，能够智能地根据主色调生成完整的配色方案。

## 安装

::: code-group

```bash [pnpm]
pnpm add @ldesign/color
```

```bash [npm]
npm install @ldesign/color
```

```bash [yarn]
yarn add @ldesign/color
```

:::

## 基础使用

### 1. 快速生成主题

最简单的使用方式是调用 `generateTheme` 函数：

```typescript
import { generateTheme } from '@ldesign/color'

// 🎨 输入主色调，生成完整主题
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

### 2. Vue 3 组合式API

在 Vue 3 项目中，推荐使用组合式API：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useColor } from '@ldesign/color'

const primaryColor = ref('#1890ff')

// 🚀 自动响应颜色变化，生成主题
const { theme, loading, error } = useColor(primaryColor)

function handleColorChange() {
  console.log('主题已更新:', theme.value)
}
</script>

<template>
  <div>
    <!-- 颜色选择器 -->
    <input
      v-model="primaryColor"
      type="color"
      @change="handleColorChange"
    >

    <!-- 主题预览 -->
    <div v-if="theme" class="theme-preview">
      <div
        v-for="(color, name) in theme.semanticColors"
        :key="name"
        :style="{ backgroundColor: color }"
        class="color-block"
      >
        {{ name }}: {{ color }}
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading">
      正在生成主题...
    </div>
  </div>
</template>

<style scoped>
.color-block {
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
```

### 3. 使用预制组件

@ldesign/color 提供了开箱即用的组件：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  ColorPalette,
  ColorPicker,
  ColorProvider,
  ThemePreview,
  presetColors,
  useColorTheme
} from '@ldesign/color'

const selectedColor = ref('#1890ff')
const { theme } = useColorTheme()

function handleColorClick({ color, index }) {
  console.log(`点击了第${index + 1}个颜色: ${color}`)
}
</script>

<template>
  <ColorProvider primary-color="#1890ff">
    <!-- 颜色选择器 -->
    <ColorPicker
      v-model="selectedColor"
      :preset-colors="presetColors"
    />

    <!-- 主题预览 -->
    <ThemePreview />

    <!-- 色阶展示 -->
    <ColorPalette
      color-name="primary"
      :colors="theme?.palettes.light.primary || []"
      :show-values="true"
      @color-click="handleColorClick"
    />
  </ColorProvider>
</template>
```

## 核心特性

### 🎨 智能颜色生成

基于色彩理论的科学算法，自动生成和谐的配色方案：

- **语义化颜色**：自动生成 success、warning、danger、gray 四种语义色
- **色阶生成**：主色调和语义色生成12色阶，灰色生成14色阶
- **明暗模式**：自动生成对应的暗黑模式色阶

### ⚡ 高性能优化

多重性能优化，确保流畅的用户体验：

- **Web Worker**：在独立线程中处理颜色计算
- **智能缓存**：LRU缓存策略，避免重复计算
- **防抖处理**：避免频繁的颜色生成操作

### 🔧 Vue 3 集成

原生支持 Vue 3 生态：

- **组合式API**：响应式的颜色管理
- **组件库**：开箱即用的UI组件
- **TypeScript**：完整的类型定义

### 🎯 CSS变量

自动生成和注入CSS变量：

```css
/* 自动生成的CSS变量 */
:root {
  --ldesign-primary-1: #e6f7ff;
  --ldesign-primary-2: #bae7ff;
  /* ... 更多色阶 */

  --ldesign-success-1: #f6ffed;
  /* ... */

  /* 语义化变量 */
  --ldesign-primary: var(--ldesign-primary-6);
  --ldesign-primary-hover: var(--ldesign-primary-5);
  --ldesign-primary-active: var(--ldesign-primary-7);
}

/* 暗黑模式 */
[data-theme="dark"] {
  --ldesign-dark-primary-1: #111d2c;
  /* ... */
}
```

## 下一步

- 📖 阅读 [基础概念](./concepts) 了解核心原理
- 🎨 查看 [颜色生成](./color-generation) 学习颜色算法
- 🔧 探索 [Vue集成](./vue-composables) 了解Vue用法
- 📊 查看 [示例](../examples/) 获取更多灵感

## 需要帮助？

- 🐛 [报告问题](https://github.com/ldesign/color/issues)
- 💬 [讨论交流](https://github.com/ldesign/color/discussions)
- 📧 [联系我们](mailto:team@ldesign.dev)

::: tip 提示
建议在开发环境中禁用缓存，在生产环境中启用所有性能优化功能。
:::

::: warning 注意
确保你的项目支持 ES2020+ 语法，因为库使用了现代JavaScript特性。
:::
