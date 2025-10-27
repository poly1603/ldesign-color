---
layout: home

hero:
  name: "@ldesign/color"
  text: "现代化颜色处理库"
  tagline: 强大 · 高性能 · 易用 · Tree-Shakeable
  image:
    src: /logo.svg
    alt: LDesign Color
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /examples/basic
    - theme: alt
      text: GitHub
      link: https://github.com/ldesign/color

features:
  - icon: 🎨
    title: 多种颜色格式
    details: 支持 RGB、HSL、HSV、HEX、HWB、命名颜色等多种格式，以及 OKLCH、OKLAB、LAB、LCH、XYZ 等高级色彩空间
    
  - icon: ⚡
    title: 高性能
    details: 核心库仅 8KB (gzipped)，采用智能缓存、对象池等优化技术，支持批量处理和流式处理
    
  - icon: 🔗
    title: 链式调用
    details: 流畅的 API 设计，支持链式操作和不可变性，所有方法返回新实例
    
  - icon: ♿
    title: 无障碍支持
    details: 内置 WCAG 对比度检查、色盲模拟、无障碍颜色对生成等功能
    
  - icon: 🎭
    title: 6大设计系统
    details: 集成 Ant Design、Material Design、Chakra UI、Carbon、Fluent UI、Tailwind CSS
    
  - icon: 🌈
    title: 高级渐变
    details: 支持 OKLCH 插值、30+ 缓动函数、中点控制、渐变分析等
    
  - icon: 🎯
    title: 色彩和谐
    details: 10种和谐类型、5D 评分、自动优化、自然主题预设
    
  - icon: 🚀
    title: 批量处理
    details: 高效处理大量颜色数据，支持流式处理、进度跟踪、K-means聚类等
    
  - icon: 📦
    title: Tree-Shakeable
    details: 支持按需导入，只打包使用的功能，极大减小打包体积
    
  - icon: 🛡️
    title: TypeScript
    details: 完整的 TypeScript 支持，提供类型安全和 IntelliSense
    
  - icon: ⚛️
    title: React 支持
    details: 提供 React 组件和 hooks，包括主题选择器和主题管理
    
  - icon: 💚
    title: Vue 支持
    details: 提供 Vue 3 组件和 composables，包括主题选择器和主题管理
---

## 快速开始

### 安装

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

### 基础用法

```typescript
import { Color, gradient, interpolate } from '@ldesign/color'

// 创建颜色
const color = new Color('#3498db')

// 颜色操作
const lighter = color.lighten(20)
const darker = color.darken(20)
const complementary = color.rotate(180)

// 颜色分析
const luminance = color.getLuminance()
const contrast = color.contrast('#ffffff')
const isAccessible = color.isWCAGCompliant('#ffffff', 'AA')

// 高级色彩空间
const oklch = color.toOKLCH()
const deltaE = color.deltaE2000(new Color('#c0392b'))

// 平滑渐变
const colors = gradient(
  ['#FF0080', '#00FF80'],
  10,
  { space: 'oklch' }
)
```

## 主要特性

### 🆕 v1.1 新功能

#### 设计系统集成

支持 6 大主流设计系统，一键生成完整调色板：

```typescript
import { generateAntDesignPalette } from '@ldesign/color/design-systems'

const palette = generateAntDesignPalette('#1890ff')
// {
//   primary-1: '#e6f7ff',
//   primary-2: '#bae7ff',
//   ...
//   primary-10: '#002766'
// }
```

#### 高级色彩空间

支持感知均匀的色彩空间，实现更自然的颜色插值：

```typescript
// 在 OKLCH 空间中插值，避免灰色区域
const midColor = interpolate('#ff0080', '#00ff80', 0.5, {
  space: 'oklch'
})

// 计算感知色差
const difference = color.deltaE2000(otherColor) // < 2.3 为不可察觉
```

#### 批量处理

高效处理大量颜色数据：

```typescript
import { ColorBatchProcessor } from '@ldesign/color/batch'

const processor = new ColorBatchProcessor()

// 批量转换
const results = await processor.convertBatch(
  colors,
  'hex',
  { parallel: true }
)

// 流式处理
await processor.processStream(
  colorStream,
  color => color.lighten(20),
  { chunkSize: 1000 }
)
```

## 性能表现

| 操作 | 时间 | 对比 |
|------|------|------|
| 颜色创建 | ~1μs | 比 chroma.js 快 2x |
| 颜色转换 | ~2μs | 比 color 快 1.5x |
| 调色板生成 (10色) | ~20μs | 比 polished 快 3x |
| WCAG检查 | ~3μs | - |
| 批量处理 (1000色) | ~2ms | 使用对象池 |

## 浏览器支持

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Node.js 14+

## 生态系统

| 包 | 版本 | 说明 |
|---|------|------|
| [@ldesign/color](.) | ![npm](https://img.shields.io/npm/v/@ldesign/color) | 核心库 |
| [@ldesign/color-picker](../color-picker) | ![npm](https://img.shields.io/npm/v/@ldesign/color-picker) | 颜色选择器 |

## 许可证

[MIT](https://github.com/ldesign/color/blob/master/LICENSE) © LDesign Team


