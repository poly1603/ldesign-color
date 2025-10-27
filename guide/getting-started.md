# 快速开始

本指南将帮助你快速上手 @ldesign/color。

## 安装

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

## 基础用法

### 创建颜色

@ldesign/color 支持多种方式创建颜色对象：

```typescript
import { Color } from '@ldesign/color'

// 从 HEX 字符串创建
const color1 = new Color('#3498db')

// 从 RGB 创建
const color2 = Color.fromRGB(52, 152, 219)

// 从 HSL 创建
const color3 = Color.fromHSL(204, 70, 53)

// 从命名颜色创建
const color4 = new Color('blue')

// 创建随机颜色
const random = Color.random()
```

### 颜色转换

轻松在不同格式之间转换：

```typescript
const color = new Color('#3498db')

// 转换为 HEX
color.toHex() // '#3498db'

// 转换为 RGB
color.toRGB() // { r: 52, g: 152, b: 219 }

// 转换为 HSL
color.toHSL() // { h: 204, s: 70, l: 53 }

// 转换为 CSS 字符串
color.toRGBString() // 'rgb(52, 152, 219)'
color.toHSLString() // 'hsl(204, 70%, 53%)'
```

### 颜色操作

所有操作都是不可变的，返回新的颜色对象：

```typescript
const color = new Color('#3498db')

// 调整亮度
const lighter = color.lighten(20) // 增加 20% 亮度
const darker = color.darken(20)   // 降低 20% 亮度

// 调整饱和度
const saturated = color.saturate(30)   // 增加 30% 饱和度
const desaturated = color.desaturate(30) // 降低 30% 饱和度

// 旋转色相
const rotated = color.rotate(180) // 旋转 180 度（互补色）

// 设置透明度
const transparent = color.alpha(0.5) // 50% 透明度

// 链式调用
const result = color
  .lighten(10)
  .saturate(20)
  .rotate(30)
  .alpha(0.8)
```

### 颜色分析

分析颜色的各种属性：

```typescript
const color = new Color('#3498db')

// 获取亮度（0-1）
const luminance = color.getLuminance() // 0.296

// 判断是否为浅色
const isLight = color.isLight() // true

// 计算对比度
const contrast = color.contrast('#ffffff') // 3.96

// WCAG 无障碍检查
const isAccessible = color.isWCAGCompliant('#ffffff', 'AA')
// false - 对比度不足 AA 级别

// 检查对比度等级
const level = color.getContrastLevel('#ffffff')
// 'Fail' | 'AA' | 'AAA'
```

## 高级功能预览

### 高级色彩空间

```typescript
// 转换到感知均匀的色彩空间
const oklch = color.toOKLCH()
const lab = color.toLAB()

// 计算感知色差
const deltaE = color.deltaE2000(otherColor)
// < 1.0: 不可察觉
// 1.0-2.3: 几乎不可察觉
// 2.3-5.0: 轻微可察觉
```

### 平滑渐变

```typescript
import { gradient, interpolate } from '@ldesign/color'

// 生成平滑渐变
const colors = gradient(
  ['#FF0080', '#00FF80'],
  10,
  { space: 'oklch' } // 在 OKLCH 空间插值
)

// 插值两个颜色
const mid = interpolate('#FF0080', '#00FF80', 0.5, {
  space: 'oklch'
})
```

### 调色板生成

```typescript
// 生成 Tailwind 风格调色板
const palette = color.toTailwindPalette()
// {
//   50: '#eff6ff',
//   100: '#dbeafe',
//   ...
//   900: '#1e3a8a'
// }

// 生成自然色阶
const natural = color.toNaturalPalette(10)
```

### 设计系统集成

```typescript
import { 
  generateAntDesignPalette,
  generateMaterialDesignPalette 
} from '@ldesign/color/design-systems'

// Ant Design 调色板
const antPalette = generateAntDesignPalette('#1890ff')

// Material Design 调色板
const mdPalette = generateMaterialDesignPalette('#2196f3')
```

## 下一步

- 📖 阅读 [核心概念](./core-concepts) 了解更多
- 🎨 查看 [颜色操作](./color-manipulation) 学习所有操作方法
- 🚀 探索 [高级功能](./color-spaces) 掌握高级色彩空间
- 💡 浏览 [示例](../examples/basic) 获取实用代码

## 常见问题

### 如何确保颜色无障碍？

使用 WCAG 检查方法：

```typescript
const bg = new Color('#3498db')
const text = new Color('#ffffff')

// 检查对比度
const contrast = bg.contrast(text) // 3.96

// 检查 WCAG 等级
const isAA = bg.isWCAGCompliant(text, 'AA') // false
const isAAA = bg.isWCAGCompliant(text, 'AAA') // false

// 自动调整到符合标准
import { adjustToWCAG } from '@ldesign/color/accessibility'
const adjusted = adjustToWCAG(bg, text, 'AA')
```

### 如何生成和谐的配色方案？

```typescript
import { generateColorScheme } from '@ldesign/color/schemes'

const schemes = generateColorScheme('#3498db', 'triadic')
// 返回三色调配色方案
```

### 如何处理大量颜色数据？

使用批量处理：

```typescript
import { ColorBatchProcessor } from '@ldesign/color/batch'

const processor = new ColorBatchProcessor()
const results = await processor.convertBatch(
  colors,
  'hex',
  { parallel: true }
)
```

### 如何集成到 React/Vue？

查看框架集成指南：
- [React 集成](./react)
- [Vue 集成](./vue)

## 性能提示

1. **使用对象池**：处理大量颜色时启用对象池
2. **启用缓存**：重复操作会被自动缓存
3. **按需导入**：只导入需要的功能模块
4. **批量处理**：使用批量 API 处理大数据集

```typescript
import { enableObjectPool } from '@ldesign/color/performance'

// 启用对象池
enableObjectPool({ maxSize: 1000 })

// 禁用对象池
disableObjectPool()
```

更多性能优化技巧，请查看 [性能最佳实践](./performance)。


