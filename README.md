# 🎨 @ldesign/color

> 一个超级强大的颜色生成和管理库！让你的应用瞬间拥有专业级的配色方案 ✨

[![npm version](https://img.shields.io/npm/v/@ldesign/color.svg)](https://www.npmjs.com/package/@ldesign/color)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 特性亮点

- 🎯 **智能颜色生成**：输入一个主色调，自动生成 success、warning、danger、gray 四种语义化颜色
- 🌓 **明暗模式支持**：完美支持明暗主题切换，自动生成对应的色阶
- 📊 **丰富色阶**：主色调和语义色生成12色阶，灰色生成14色阶，满足各种设计需求
- 🎨 **灰色深度优化**：支持纯中性灰色和混入主色调两种模式，最深灰色更深更实用
- ⚡ **超高性能**：Web Worker、智能缓存、防抖优化，避免阻塞主线程
- 🔧 **Vue 3 友好**：提供组合式API和开箱即用的组件
- 💪 **TypeScript**：完整的类型定义，开发体验一流
- 🎨 **CSS变量定制**：支持自定义前缀和语义化名称，自动生成CSS变量并注入
- 🎭 **预设主题管理**：内置12个精美预设主题，支持响应式数据和完整CRUD操作
- 📱 **响应式设计**：完美适配各种屏幕尺寸

## 📦 安装

```bash
# 使用 pnpm（推荐）
pnpm add @ldesign/color

# 使用 npm
npm install @ldesign/color

# 使用 yarn
yarn add @ldesign/color
```

## 🎯 在线演示

🌟 **[在线体验](https://ldesign.github.io/color/demo/)** - 实时体验颜色生成效果

📖 **[完整文档](https://ldesign.github.io/color/)** - 详细的使用指南和API文档

## 🎯 快速开始

### 基础用法

```typescript
import { generateTheme } from '@ldesign/color';

// 🎨 一行代码生成完整主题
const theme = generateTheme('#1890ff');

console.log(theme.semanticColors);
// {
//   primary: '#1890ff',
//   success: '#52c41a',
//   warning: '#faad14',
//   danger: '#f5222d',
//   gray: '#8c8c8c'
// }

console.log(theme.palettes.light.primary);
// ['#e6f7ff', '#bae7ff', '#91d5ff', ...] // 12个色阶

console.log(theme.palettes.dark.primary);
// ['#111d2c', '#112a3a', '#15395b', ...] // 暗黑模式12个色阶
```

### 🆕 高级配置

```typescript
import { generateTheme, createPresetThemeManager } from '@ldesign/color';

// 🎨 完整配置示例
const theme = generateTheme('#1890ff', {
  grayMixPrimary: false,        // 使用纯中性灰色（更深更实用）
  cssPrefix: 'my-app',          // 自定义CSS变量前缀
  semanticNames: {              // 自定义语义化名称
    primary: 'brand',
    success: 'positive',
    warning: 'caution',
    danger: 'negative',
    gray: 'neutral'
  },
  autoInject: true              // 自动注入CSS变量到页面
});

// 🎭 预设主题管理
const presetManager = createPresetThemeManager();

// 添加自定义预设
presetManager.addTheme({
  name: '企业蓝',
  color: '#0066cc',
  description: '企业级蓝色主题'
});

// 获取启用的主题（响应式）
const enabledThemes = presetManager.getEnabledThemes();

// 手动注入样式到页面
theme.cssGenerator.injectToHead(theme.cssVariables);
```

### Vue 3 组合式API

```vue
<template>
  <div>
    <!-- 🎨 颜色选择器 -->
    <ColorPicker v-model="primaryColor" />

    <!-- 📊 主题预览 -->
    <ThemePreview v-if="theme" />

    <!-- ⚡ 加载状态 -->
    <div v-if="loading">正在生成主题...</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useColor, ColorPicker, ThemePreview } from '@ldesign/color';

const primaryColor = ref('#1890ff');

// 🚀 自动响应颜色变化，生成主题
const { theme, loading, error } = useColor(primaryColor);
</script>
```

### Vue 组件方式

```vue
<template>
  <!-- 🎯 提供颜色上下文 -->
  <ColorProvider primary-color="#1890ff">
    <div class="my-app">
      <!-- 🎨 所有子组件都能访问主题 -->
      <MyButton type="primary">主要按钮</MyButton>
      <MyButton type="success">成功按钮</MyButton>
      <MyButton type="warning">警告按钮</MyButton>
      <MyButton type="danger">危险按钮</MyButton>
    </div>
  </ColorProvider>
</template>

<script setup lang="ts">
import { ColorProvider } from '@ldesign/color';
</script>
```

## 🎨 高级用法

### 高性能配置

```typescript
import { useHighPerformanceColor } from '@ldesign/color';

const { theme, loading } = useHighPerformanceColor(primaryColor, {
  enableCache: true,      // 🚀 启用智能缓存
  cacheSize: 200,         // 📦 缓存大小
  useWebWorker: true,     // ⚡ 使用Web Worker
  autoInject: true        // 🎯 自动注入CSS变量
});
```

### 批量处理

```typescript
import { useBatchColor } from '@ldesign/color';

const colors = ref(['#1890ff', '#52c41a', '#f5222d']);
const { themes, loading } = useBatchColor(colors);

// 🚀 一次性生成多个主题
```

### 自定义配置

```typescript
import { ColorGenerator } from '@ldesign/color';

const generator = new ColorGenerator({
  cssPrefix: 'my-app',    // 🏷️ 自定义CSS变量前缀
  enableCache: true,      // 🚀 启用缓存
  useWebWorker: true,     // ⚡ 使用Web Worker
  autoInject: false       // 🎯 手动控制CSS注入
});

const theme = await generator.generateAsync('#1890ff');
```

## 🎯 API 文档

### 核心函数

#### `generateTheme(primaryColor, config?)`

快速生成主题的便捷函数。

```typescript
const theme = generateTheme('#1890ff', {
  enableCache: true,
  useWebWorker: false
});
```

#### `generateThemeAsync(primaryColor, config?)`

异步生成主题，避免阻塞主线程。

```typescript
const theme = await generateThemeAsync('#1890ff');
```

### Vue 组合式API

#### `useColor(primaryColor, config?)`

主要的颜色管理Hook。

```typescript
const {
  theme,              // 🎨 生成的主题
  loading,            // ⏳ 加载状态
  error,              // ❌ 错误信息
  isValid,            // ✅ 颜色是否有效
  generateTheme,      // 🔄 手动生成主题
  clearCache,         // 🗑️ 清除缓存
  getPerformanceMetrics // 📊 获取性能指标
} = useColor(primaryColor);
```

#### `useSimpleColor(primaryColor)`

简化版本，只关注基本功能。

```typescript
const { theme, loading, error } = useSimpleColor(primaryColor);
```

#### `useThemeSwitch()`

主题切换管理。

```typescript
const {
  currentTheme,       // 🌓 当前主题（light/dark）
  toggleTheme,        // 🔄 切换主题
  setTheme,           // 🎯 设置主题
  isDark              // 🌙 是否为暗黑模式
} = useThemeSwitch();
```

### Vue 组件

#### `<ColorProvider>`

为子组件提供颜色上下文。

```vue
<ColorProvider
  primary-color="#1890ff"
  :config="{ enableCache: true }"
  :show-loading="true"
  loading-text="生成中..."
>
  <!-- 子组件 -->
</ColorProvider>
```

#### `<ColorPicker>`

颜色选择器组件。

```vue
<ColorPicker
  v-model="color"
  :preset-colors="['#1890ff', '#52c41a']"
  :show-presets="true"
  :disabled="false"
  @change="handleColorChange"
/>
```

#### `<ColorPalette>`

色阶展示组件。

```vue
<ColorPalette
  color-name="primary"
  :colors="theme.palettes.light.primary"
  :show-values="true"
  :copyable="true"
  @color-click="handleColorClick"
/>
```

## 🎨 CSS 变量

生成的CSS变量遵循以下命名规范：

```css
/* 明亮模式 */
:root {
  --ldesign-primary-1: #e6f7ff;
  --ldesign-primary-2: #bae7ff;
  /* ... */
  --ldesign-primary-12: #003a8c;

  --ldesign-success-1: #f6ffed;
  /* ... */

  --ldesign-gray-1: #ffffff;
  /* ... */
  --ldesign-gray-14: #000000;
}

/* 暗黑模式 */
[data-theme="dark"] {
  --ldesign-dark-primary-1: #111d2c;
  /* ... */
}

/* 语义化变量 */
:root {
  --ldesign-primary: var(--ldesign-primary-6);
  --ldesign-primary-hover: var(--ldesign-primary-5);
  --ldesign-primary-active: var(--ldesign-primary-7);
}
```

## 🚀 性能优化

### 缓存策略

```typescript
// 🚀 启用LRU缓存
const generator = new ColorGenerator({
  enableCache: true,
  cacheSize: 200  // 缓存200个主题
});

// 📊 查看缓存统计
const stats = generator.cache.getStats();
console.log(`缓存命中率: ${stats.hitRate * 100}%`);
```

### Web Worker

```typescript
// ⚡ 在独立线程中生成颜色
const generator = new ColorGenerator({
  useWebWorker: true
});

const theme = await generator.generateAsync('#1890ff');
```

### 防抖处理

```typescript
// 🎯 防抖生成，避免频繁计算
generator.generateDebounced('#1890ff', (theme) => {
  console.log('主题生成完成:', theme);
});
```

## 🎯 最佳实践

### 1. 选择合适的主色调

```typescript
// ✅ 推荐：饱和度适中的颜色
const goodColors = [
  '#1890ff',  // 蓝色
  '#52c41a',  // 绿色
  '#722ed1',  // 紫色
  '#fa541c'   // 橙色
];

// ❌ 避免：过于极端的颜色
const badColors = [
  '#000000',  // 纯黑
  '#ffffff',  // 纯白
  '#ff0000'   // 纯红
];
```

### 2. 合理使用缓存

```typescript
// 🚀 开发环境：禁用缓存，便于调试
const devConfig = {
  enableCache: false,
  useWebWorker: false
};

// 🏭 生产环境：启用所有优化
const prodConfig = {
  enableCache: true,
  cacheSize: 500,
  useWebWorker: true
};
```

### 3. 主题切换

```typescript
// 🌓 响应系统主题偏好
const { currentTheme, setTheme } = useThemeSwitch();

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
  setTheme(e.matches ? 'dark' : 'light');
});
```

## 🔧 配置选项

```typescript
interface ColorGeneratorConfig {
  enableCache?: boolean;     // 🚀 启用缓存
  cacheSize?: number;        // 📦 缓存大小
  useWebWorker?: boolean;    // ⚡ 使用Web Worker
  cssPrefix?: string;        // 🏷️ CSS变量前缀
  autoInject?: boolean;      // 🎯 自动注入CSS
}
```

## 📊 性能监控

```typescript
const { getPerformanceMetrics } = useColor(primaryColor);

const metrics = getPerformanceMetrics();
console.log({
  语义化颜色生成: `${metrics.semanticColorGeneration}ms`,
  色阶生成: `${metrics.paletteGeneration}ms`,
  CSS变量生成: `${metrics.cssVariableGeneration}ms`,
  总耗时: `${metrics.totalTime}ms`,
  缓存命中率: `${metrics.cacheHitRate * 100}%`
});
```

## 🎨 示例项目

查看 `examples/` 目录获取完整示例：

- 📱 基础用法示例
- 🚀 高性能配置示例
- 🎨 自定义主题示例
- 📊 性能监控示例

## 🆕 更新日志

### v2.1.0 (最新)

🎉 **重大更新和修复**

**🔧 修复**
- ✅ 修复随机颜色生成报错问题，现在返回正确的十六进制格式
- ✅ 修复灰色色阶偏红问题，支持纯中性灰色生成
- ✅ 优化灰色深度，明亮模式最深灰色从30%调整到25%，暗黑模式从15%调整到10%

**🚀 新功能**
- 🎨 **CSS变量定制**：支持自定义前缀和语义化颜色名称
- 🎭 **预设主题管理器**：内置12个精美预设，支持响应式数据和完整CRUD操作
- 💉 **样式注入功能**：支持手动注入CSS变量到页面head中
- 🎯 **灰色混入控制**：`grayMixPrimary` 参数控制是否混入主色调

**📈 改进**
- 🔧 更可靠的随机颜色生成算法
- 🎨 更深的灰色色阶，提供更好的对比度
- 📱 示例应用新增配置选项和预设主题管理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT © LDesign Team
