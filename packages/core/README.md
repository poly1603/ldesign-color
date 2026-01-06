# @ldesign/color-core

框架无关的高性能颜色处理核心库，提供强大的颜色操作和设计系统集成功能。

## ✨ 特性

- 🎨 **全面的颜色空间支持** - RGB, HSL, HSV, HWB, LAB, LCH, OKLAB, OKLCH, CMYK, XYZ
- 🔄 **无缝颜色转换** - 支持所有颜色空间之间的高精度转换
- 🎯 **丰富的颜色操作** - 明暗调整、饱和度、混合、渐变等
- 📊 **颜色分析** - 对比度、亮度、色温、可访问性检测
- 🌈 **调色板生成** - Material Design、Tailwind、Ant Design 等设计系统
- ♿ **无障碍支持** - WCAG 合规性检查、色盲模拟
- 🚀 **高性能** - 对象池、LRU 缓存、位运算优化
- 📦 **Tree-shakeable** - 按需导入，减小打包体积
- 💪 **TypeScript** - 完整的类型安全和智能提示

## 📦 安装

```bash
# pnpm (推荐)
pnpm add @ldesign/color-core

# npm
npm install @ldesign/color-core

# yarn
yarn add @ldesign/color-core
```

## 🚀 快速开始

### 基础用法

```typescript
import { Color } from '@ldesign/color-core'

// 创建颜色 - 支持多种格式
const color = new Color('#3B82F6')
const fromRgb = Color.fromRGB(59, 130, 246)
const fromHsl = Color.fromHSL(217, 91, 60)
const random = Color.random()

// 颜色操作 - 链式调用
const modified = color
  .lighten(10)
  .saturate(20)
  .rotate(30)

// 格式转换
color.toHex()       // '#3B82F6'
color.toRGB()       // { r: 59, g: 130, b: 246 }
color.toHSL()       // { h: 217, s: 91, l: 60 }
color.toRGBString() // 'rgb(59, 130, 246)'
color.toHSLString() // 'hsl(217, 91%, 60%)'
color.toOKLCH()     // { l: 0.67, c: 0.13, h: 258 }
```

### 颜色操作

```typescript
const blue = new Color('#3B82F6')

// 明度调整
blue.lighten(20)    // 变亮 20%
blue.darken(20)     // 变暗 20%

// 饱和度调整
blue.saturate(30)   // 增加饱和度 30%
blue.desaturate(30) // 降低饱和度 30%
blue.grayscale()    // 转为灰度

// 色相旋转
blue.rotate(180)    // 互补色
blue.rotate(120)    // 三等分色

// 颜色混合
blue.mix('#FF0000', 50)  // 与红色混合 50%
blue.blend('#FF0000', 'overlay') // 使用叠加模式混合

// 颜色反转
blue.invert()       // 反色
```

### 颜色分析与可访问性

```typescript
import { Color, getAccessibilityReport } from '@ldesign/color-core'

const foreground = new Color('#3B82F6')
const background = new Color('#FFFFFF')

// 对比度检测
const contrast = foreground.contrast(background) // 3.28

// WCAG 合规性检查
foreground.isWCAGCompliant(background, 'AA', 'normal') // false
foreground.isWCAGCompliant(background, 'AA', 'large')  // true

// 亮度分析
foreground.getLuminance() // 0.35
foreground.isLight()      // false
foreground.isDark()       // true

// 获取最佳文本颜色
const textColor = foreground.getBestTextColor() // 白色
```

### 调色板生成

```typescript
import {
  generateTailwindPalette,
  generateMaterialPalette,
  generateAntDesignPalette,
} from '@ldesign/color-core'

const primary = '#3B82F6'

// Tailwind CSS 风格调色板
const tailwind = generateTailwindPalette(primary)
// { 50: '#EFF6FF', 100: '#DBEAFE', ..., 950: '#172554' }

// Material Design 调色板
const material = generateMaterialPalette(primary)

// Ant Design 调色板
const antd = generateAntDesignPalette(primary)
```

### CSS 变量集成

```typescript
const primary = new Color('#3B82F6')

// 生成 CSS 变量声明
const cssVar = primary.toCSSVariable('primary')
// '--primary: #3B82F6;'

// 生成完整的 CSS 变量对象
const vars = primary.toCSSVariables('primary')
// {
//   '--primary': '#3B82F6',
//   '--primary-rgb': '59, 130, 246',
//   '--primary-hsl': '217, 91%, 60%',
//   '--primary-h': '217',
//   '--primary-s': '91%',
//   '--primary-l': '60%'
// }

// 应用到元素
primary.applyToElement(document.documentElement, 'primary')

// 从 CSS 变量读取颜色
const fromVar = Color.fromCSSVariable('--primary-color')
```

### 色阶生成

```typescript
const blue = new Color('#3B82F6')

// 生成色阶 (浅色到深色)
const shades = blue.generateShades(10)

// 生成渐变色阶
const scale = blue.generateScale('#FFFFFF', 5)
```

## 🔧 高级功能

### 性能优化

```typescript
import { Color } from '@ldesign/color-core'

// 对象池统计
const poolStats = Color.getPoolStats()
console.log(`命中率: ${(poolStats.hitRate * 100).toFixed(2)}%`)

// 缓存预热
Color.preheatCache([
  new Color('#3B82F6'),
  new Color('#10B981'),
])

// 释放颜色对象回池
const color = Color.fromRGB(255, 0, 0)
color.release()

// 清理所有缓存
Color.cleanup()
```

### 类型安全

```typescript
import type { RGB, HSL, ColorInput } from '@ldesign/color-core'
import { isRGBObject, isHSLObject, isHexColor } from '@ldesign/color-core'

// 类型守卫
const value: unknown = { r: 255, g: 128, b: 0 }
if (isRGBObject(value)) {
  console.log(value.r) // TypeScript 知道这是 RGB
}

// 输入验证
import { validateColorInput } from '@ldesign/color-core'

try {
  validateColorInput(userInput, '用户输入')
} catch (error) {
  console.error('无效颜色:', error.message)
}
```

## 📊 性能基准

在 Apple M1 MacBook Pro 上的基准测试结果：

- Color 创建 (hex): ~1,500,000 ops/s
- RGB → HSL: ~2,000,000 ops/s
- HSL → RGB: ~2,200,000 ops/s
- 颜色混合: ~800,000 ops/s
- Delta E 2000: ~300,000 ops/s
- 调色板生成: ~50,000 ops/s

## 🔗 相关包

- [@ldesign/color-vue](../vue) - Vue 3 组件和组合式 API
- [@ldesign/color-react](../react) - React 组件和 Hooks
- [@ldesign/color-svelte](../svelte) - Svelte 组件
- [@ldesign/color-solid](../solid) - Solid.js 组件

## 📝 API 参考

完整 API 文档请访问 [ldesign 文档站点](https://ldesign.dev/color)。

## 📜 许可证

MIT © ldesign

