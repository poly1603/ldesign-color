# @ldesign/color-core 主题色彩生成使用指南

## 概述

基于主色调自动生成完整色彩体系，包括：
- **Primary**（主色）
- **Success**（成功色）
- **Warning**（警告色）
- **Danger**（危险色）
- **Gray**（中性色）

每种颜色生成 **10 个色阶**：50, 100, 200, 300, 400, 500, 600, 700, 800, 900

同时支持 **亮色模式** 和 **暗色模式**。

## 快速开始

### 1. 基础使用

```typescript
import { generateThemeColors } from '@ldesign/color-core'

// 输入主色调，自动生成完整主题
const theme = generateThemeColors('#1890ff')

// 使用亮色模式的颜色
console.log(theme.light.primary[500])  // 主色-500色阶
console.log(theme.light.success[600])  // 成功色-600色阶
console.log(theme.light.warning[700])  // 警告色-700色阶

// 使用暗色模式的颜色
console.log(theme.dark.primary[500])   // 暗色主题下的主色
console.log(theme.dark.danger[400])    // 暗色主题下的危险色
```

### 2. 生成 CSS 变量

```typescript
import { generateThemeColors, generateCSSVariables } from '@ldesign/color-core'

const theme = generateThemeColors('#1890ff')

// 生成 CSS 变量字符串
const css = generateCSSVariables(theme, {
  prefix: 'app',           // CSS 变量前缀
  includeAliases: true     // 包含语义别名
})

console.log(css)
```

**输出示例**：

```css
/* 亮色模式（默认） */
:root {
  /* Primary */
  --app-primary-50: #e6f7ff;
  --app-primary-100: #bae7ff;
  --app-primary-200: #91d5ff;
  /* ... 更多色阶 ... */
  
  /* 语义别名 */
  --app-primary-default: var(--app-primary-500);
  --app-primary-hover: var(--app-primary-600);
  /* ... */
}

/* 暗色模式 */
[data-theme="dark"] {
  /* Primary */
  --app-primary-50: #111d2c;
  /* ... */
}
```

### 3. 注入到页面

```typescript
import { generateThemeColors, injectCSSVariables } from '@ldesign/color-core'

const theme = generateThemeColors('#1890ff')

// 自动注入到页面
injectCSSVariables(theme, {
  prefix: 'color',
  includeAliases: true
})
```

然后在 CSS 中使用：

```css
.button-primary {
  background: var(--color-primary-500);
  color: white;
}

.button-primary:hover {
  background: var(--color-primary-hover); /* 使用别名 */
}

.text-success {
  color: var(--color-success-600);
}
```

## 高级用法

### 自定义语义色相

```typescript
const theme = generateThemeColors('#7c3aed', {
  semanticHues: {
    success: 150,  // 自定义成功色的色相
    warning: 45,   // 自定义警告色的色相
    danger: 0      // 自定义危险色的色相（纯红）
  }
})
```

### 保留输入颜色

```typescript
const theme = generateThemeColors('#1890ff', {
  preserveInput: true  // 将输入颜色保留在最接近的色阶中
})
```

## TypeScript 类型

```typescript
// 色阶类型
type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

// 单色调色板
type ColorScale = Record<ColorShade, string>

// 语义色彩
interface SemanticColors {
  primary: ColorScale
  success: ColorScale
  warning: ColorScale
  danger: ColorScale
  gray: ColorScale
}

// 主题色彩（亮色+暗色）
interface ThemeColors {
  light: SemanticColors
  dark: SemanticColors
}
```

## 色彩理论

### 亮色模式

- **50-400**：浅色系，用于背景、边框
- **500**：标准色，用于主要元素
- **600-900**：深色系，用于文本、强调

### 暗色模式

暗色模式的色彩经过特殊计算，确保：
1. 在暗色背景下有足够的对比度
2. 保持与亮色模式相同的语义
3. 视觉感受一致

### 语义色生成算法

基于主色调自动生成其他语义颜色：

- **Success**：色相 142°（绿色），饱和度 90%
- **Warning**：色相 38°（琥珀色），饱和度 110%
- **Danger**：色相 4°（红色），饱和度 100%
- **Gray**：饱和度 0%（纯灰色）

## 最佳实践

1. **使用语义别名**：优先使用 `--color-primary-default`、`--color-primary-hover` 等别名
2. **保持一致性**：在整个应用中使用相同的主色调
3. **测试对比度**：确保在两种模式下都有足够的对比度
4. **渐进式迁移**：可以先在部分组件中使用，逐步替换
