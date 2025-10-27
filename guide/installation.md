# 安装

## 包管理器安装

@ldesign/color 可以通过 npm、yarn 或 pnpm 安装：

::: code-group

```bash [npm]
npm install @ldesign/color
```

```bash [yarn]
yarn add @ldesign/color
```

```bash [pnpm]
pnpm add @ldesign/color
```

:::

## CDN 引入

你也可以通过 CDN 直接在浏览器中使用：

### UNPKG

```html
<!-- 最新版本 -->
<script src="https://unpkg.com/@ldesign/color"></script>

<!-- 指定版本 -->
<script src="https://unpkg.com/@ldesign/color@1.1.0"></script>
```

### jsDelivr

```html
<!-- 最新版本 -->
<script src="https://cdn.jsdelivr.net/npm/@ldesign/color"></script>

<!-- 指定版本 -->
<script src="https://cdn.jsdelivr.net/npm/@ldesign/color@1.1.0"></script>
```

使用 CDN 时，库会暴露为全局变量 `LDesignColor`：

```html
<script src="https://unpkg.com/@ldesign/color"></script>
<script>
  const { Color, gradient } = LDesignColor
  
  const color = new Color('#3498db')
  console.log(color.toHex())
</script>
```

## TypeScript 支持

@ldesign/color 使用 TypeScript 编写，自带完整的类型定义。无需额外安装 `@types` 包。

```typescript
import { Color, ColorSpace, WCAGLevel } from '@ldesign/color'

const color: Color = new Color('#3498db')
const space: ColorSpace = 'oklch'
const level: WCAGLevel = 'AA'
```

## 框架集成

### React

如果你要在 React 中使用，建议同时安装 React 组件：

```bash
npm install @ldesign/color
# React 已作为 peer dependency，确保已安装
```

然后导入 React 组件：

```typescript
import { ThemePicker, useTheme } from '@ldesign/color/react'
```

### Vue

如果你要在 Vue 3 中使用，建议同时安装 Vue 组件：

```bash
npm install @ldesign/color
# Vue 3 已作为 peer dependency，确保已安装
```

然后导入 Vue 组件：

```typescript
import { ThemePicker, useTheme } from '@ldesign/color/vue'
```

## 按需导入

@ldesign/color 支持 tree-shaking，你可以只导入需要的功能：

```typescript
// 只导入核心功能
import { Color } from '@ldesign/color/core'

// 导入特定模块
import { generateColorScheme } from '@ldesign/color/schemes'
import { gradient } from '@ldesign/color/gradient'
import { ColorBatchProcessor } from '@ldesign/color/batch'

// 导入设计系统
import { generateAntDesignPalette } from '@ldesign/color/design-systems'
```

这样可以显著减小打包体积。

## 浏览器兼容性

@ldesign/color 支持所有现代浏览器：

| 浏览器 | 版本 |
|--------|------|
| Chrome | 88+ |
| Edge | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| iOS Safari | 14+ |
| Android Chrome | 88+ |

### Polyfills

如果需要支持更旧的浏览器，你可能需要添加以下 polyfills：

- `Promise`（IE 11）
- `Object.assign`（IE 11）
- `Array.from`（IE 11）

推荐使用 [core-js](https://github.com/zloirock/core-js)：

```bash
npm install core-js
```

```typescript
import 'core-js/stable/promise'
import 'core-js/stable/object/assign'
import 'core-js/stable/array/from'
```

## Node.js 支持

@ldesign/color 完全支持 Node.js 环境：

- Node.js 14+
- 支持 CommonJS 和 ESM
- 无 DOM 依赖（核心功能）

```javascript
// CommonJS
const { Color } = require('@ldesign/color')

// ESM
import { Color } from '@ldesign/color'
```

## 验证安装

安装完成后，你可以运行以下代码验证：

```typescript
import { Color } from '@ldesign/color'

const color = new Color('#3498db')
console.log(color.toHex()) // '#3498db'
console.log('✅ @ldesign/color 安装成功！')
```

## 下一步

- 📖 阅读 [快速开始](./getting-started) 学习基础用法
- 🎨 查看 [核心概念](./core-concepts) 了解设计理念
- 💡 浏览 [示例](../examples/basic) 获取实用代码


