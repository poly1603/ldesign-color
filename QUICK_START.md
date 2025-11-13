# Color 包重构 - 快速开始

## 📦 重构完成

已完成 `@ldesign/color` 包的核心功能重构，提供基于主色调自动生成完整色彩体系的能力。

## 🎯 核心功能

### 1. 主题色彩生成（@ldesign/color-core）

**一行代码生成完整主题**：

```typescript
import { generateThemeColors } from '@ldesign/color-core'

const theme = generateThemeColors('#1890ff')
// 输出：
// {
//   light: { primary, success, warning, danger, gray },
//   dark: { primary, success, warning, danger, gray }
// }
// 每个颜色包含 10 个色阶：50-900
```

**生成并注入 CSS 变量**：

```typescript
import { generateThemeColors, injectCSSVariables } from '@ldesign/color-core'

const theme = generateThemeColors('#1890ff')
injectCSSVariables(theme, {
  prefix: 'app',
  includeAliases: true
})

// CSS 中使用：
// background: var(--app-primary-500);
// color: var(--app-primary-hover);
```

### 2. Vue 适配（@ldesign/color-vue）

**使用 Composable**：

```vue
<script setup>
import { useColorTheme } from '@ldesign/color-vue'

const { primaryColor, toggleMode } = useColorTheme({
  primaryColor: '#1890ff',
  autoInject: true,  // 自动注入 CSS 变量
  persist: true      // 持久化用户偏好
})
</script>

<template>
  <input v-model="primaryColor" type="color" />
  <button @click="toggleMode">切换主题</button>
</template>
```

**使用 Plugin**：

```typescript
// main.ts
import { createSimpleColorPlugin } from '@ldesign/color-vue'

app.use(createSimpleColorPlugin({
  primaryColor: '#1890ff',
  initialMode: 'auto'
}))
```

## 📁 新增文件

```
packages/color/
├── packages/
│   ├── core/
│   │   ├── src/theme/index.ts               # ⭐ 核心 API
│   │   ├── examples/theme-demo.ts           # 使用示例
│   │   └── THEME_USAGE.md                   # 详细文档
│   └── vue/
│       ├── src/
│       │   ├── composables/useColorTheme.ts # ⭐ Vue Hook
│       │   └── plugin/color-plugin.ts       # ⭐ Vue Plugin
│       └── VUE_USAGE.md                     # Vue 文档
├── REFACTOR_SUMMARY.md                      # 重构总结
└── QUICK_START.md                           # 本文档
```

## 🔧 如何使用

### 步骤 1: 构建包

```bash
cd packages/color/packages/core
pnpm build

cd ../vue
pnpm build
```

### 步骤 2: 在项目中使用

#### 纯 TypeScript/JavaScript 项目

```typescript
import {
  generateThemeColors,
  generateCSSVariables,
  injectCSSVariables
} from '@ldesign/color-core'

// 生成主题
const theme = generateThemeColors('#1890ff')

// 注入到页面
injectCSSVariables(theme)

// 或者获取 CSS 字符串
const css = generateCSSVariables(theme)
console.log(css)
```

#### Vue 3 项目

```vue
<script setup>
import { useColorTheme } from '@ldesign/color-vue'

const theme = useColorTheme({
  primaryColor: '#1890ff',
  autoInject: true
})
</script>

<template>
  <div class="container">
    <input v-model="theme.primaryColor.value" type="color" />
    <button @click="theme.toggleMode()">
      {{ theme.mode.value }}
    </button>
  </div>
</template>

<style>
.container {
  background: var(--color-gray-50);
  padding: 20px;
}
</style>
```

## ✨ 核心特性

✅ **10 色阶** - Tailwind 风格（50-900）
✅ **智能生成** - 自动生成 Success/Warning/Danger
✅ **暗色优化** - 针对暗色背景优化对比度
✅ **CSS 变量** - 一键生成并注入
✅ **Vue 响应式** - 完全响应式的 Hook
✅ **TypeScript** - 完整类型支持
✅ **持久化** - localStorage 自动保存
✅ **Auto 模式** - 跟随系统主题

## 📚 文档

- [Core 包详细文档](./packages/core/THEME_USAGE.md)
- [Vue 包详细文档](./packages/vue/VUE_USAGE.md)
- [重构总结](./REFACTOR_SUMMARY.md)
- [使用示例](./packages/core/examples/theme-demo.ts)

## 🎨 生成的颜色

基于一个主色调（如 `#1890ff`），自动生成：

- **Primary**: 主色系（10 个色阶）
- **Success**: 绿色系（色相 142°）
- **Warning**: 琥珀色系（色相 38°）
- **Danger**: 红色系（色相 4°）
- **Gray**: 纯灰色系

每个颜色都有亮色和暗色两个版本，暗色版本经过对比度优化。

## 🔄 与现有代码的关系

✅ **完全兼容** - 新 API 作为补充，不影响现有功能
✅ **可选使用** - 可以选择性地在新功能中使用
✅ **渐进迁移** - 可以逐步替换旧代码

## 💡 设计理念

1. **简单易用** - 一行代码搞定主题生成
2. **智能算法** - 基于色彩理论的成熟算法
3. **暗色优化** - 不只反转，还优化对比度
4. **框架友好** - 提供各框架的适配层
5. **类型安全** - TypeScript 全覆盖

## 📝 下一步

1. **测试** - 在实际项目中测试功能
2. **反馈** - 收集使用反馈，持续优化
3. **组件** - 开发更多 Vue 组件
4. **扩展** - 支持更多框架（React、Svelte）
