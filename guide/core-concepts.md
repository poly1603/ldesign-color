# 核心概念

了解 @ldesign/color 的核心设计理念和概念。

## 设计理念

@ldesign/color 的设计遵循以下原则：

### 1. 不可变性

所有颜色操作都返回新的颜色实例，而不修改原始对象：

```typescript
const blue = new Color('#3498db')
const lighter = blue.lighten(20)

console.log(blue.toHex())    // '#3498db' - 原始颜色未改变
console.log(lighter.toHex()) // '#5dade2' - 新的颜色实例
```

**为什么不可变？**
- ✅ 避免意外的副作用
- ✅ 使代码更可预测
- ✅ 便于调试和测试
- ✅ 支持时间旅行调试

### 2. 链式调用

支持流畅的 API 设计，可以链式调用多个方法：

```typescript
const result = new Color('#3498db')
  .lighten(10)
  .saturate(20)
  .rotate(30)
  .alpha(0.8)
  .toHex()
```

### 3. 类型安全

完整的 TypeScript 支持，提供编译时类型检查：

```typescript
import { Color, ColorSpace, WCAGLevel } from '@ldesign/color'

// 类型安全的参数
const color = new Color('#3498db')
const space: ColorSpace = 'oklch' // 只能是有效的色彩空间
const level: WCAGLevel = 'AA'     // 只能是 'AA' 或 'AAA'

// IDE 自动补全
color. // 会显示所有可用方法
```

### 4. 零依赖

核心库没有任何外部运行时依赖：

- 📦 体积小（核心 ~8KB gzipped）
- ⚡ 加载快
- 🔒 安全可靠

### 5. Tree-Shakeable

支持按需导入，未使用的功能不会被打包：

```typescript
// 只导入需要的功能
import { Color } from '@ldesign/color/core'
import { gradient } from '@ldesign/color/gradient'

// 其他未导入的功能不会增加打包体积
```

## 核心概念

### Color 类

`Color` 是库的核心类，代表一个颜色对象：

```typescript
class Color {
  // 创建
  constructor(color: string | number)
  static fromRGB(r: number, g: number, b: number): Color
  static fromHSL(h: number, s: number, l: number): Color
  static random(): Color
  
  // 转换
  toHex(): string
  toRGB(): RGB
  toHSL(): HSL
  toOKLCH(): OKLCH
  
  // 操作
  lighten(amount: number): Color
  darken(amount: number): Color
  saturate(amount: number): Color
  rotate(degrees: number): Color
  
  // 分析
  getLuminance(): number
  contrast(other: Color): number
  isWCAGCompliant(other: Color, level: WCAGLevel): boolean
}
```

### 色彩空间

@ldesign/color 支持多种色彩空间，每种都有不同的用途：

#### RGB（Red, Green, Blue）

- **用途**：屏幕显示、Web 开发
- **特点**：与设备直接对应，计算简单
- **范围**：R, G, B ∈ [0, 255]

```typescript
const color = Color.fromRGB(52, 152, 219)
const rgb = color.toRGB() // { r: 52, g: 152, b: 219 }
```

#### HSL（Hue, Saturation, Lightness）

- **用途**：颜色调整、UI 设计
- **特点**：直观易懂，适合人类理解
- **范围**：H ∈ [0, 360], S, L ∈ [0, 100]

```typescript
const color = Color.fromHSL(204, 70, 53)
const hsl = color.toHSL() // { h: 204, s: 70, l: 53 }

// 调整更直观
color.rotate(180)    // 调整色相
color.saturate(20)   // 调整饱和度
color.lighten(10)    // 调整明度
```

#### HSV（Hue, Saturation, Value）

- **用途**：颜色选择器、图像处理
- **特点**：与 HSL 类似但亮度定义不同
- **范围**：H ∈ [0, 360], S, V ∈ [0, 100]

```typescript
const hsv = color.toHSV() // { h: 204, s: 76, v: 86 }
```

#### OKLCH（感知均匀色彩空间）

- **用途**：高质量渐变、颜色插值
- **特点**：感知均匀，避免灰色区域
- **范围**：L ∈ [0, 1], C ∈ [0, 0.4], H ∈ [0, 360]

```typescript
const oklch = color.toOKLCH() // { l: 0.65, c: 0.14, h: 234 }

// 在 OKLCH 空间插值，渐变更平滑
import { interpolate } from '@ldesign/color'
const mid = interpolate('#ff0080', '#00ff80', 0.5, {
  space: 'oklch' // 避免经过灰色
})
```

#### LAB（CIE L*a*b*）

- **用途**：颜色差异计算、专业设计
- **特点**：设备无关，感知均匀
- **范围**：L ∈ [0, 100], a, b ∈ [-128, 127]

```typescript
const lab = color.toLAB() // { l: 62.5, a: -5, b: -38 }

// 计算感知色差
const deltaE = color.deltaE2000(otherColor)
// < 1.0: 不可察觉的差异
// 1.0-2.3: 几乎不可察觉
// 2.3-5.0: 轻微可察觉
```

### 颜色操作类型

#### 1. 明度操作

调整颜色的明暗：

```typescript
const color = new Color('#3498db')

color.lighten(20)  // 增加 20% 明度
color.darken(20)   // 降低 20% 明度
color.brightness(150) // 设置为 150% 亮度
```

#### 2. 饱和度操作

调整颜色的鲜艳程度：

```typescript
color.saturate(30)    // 增加 30% 饱和度
color.desaturate(30)  // 降低 30% 饱和度
color.grayscale()     // 完全去饱和（灰度）
```

#### 3. 色相操作

旋转色相环：

```typescript
color.rotate(60)     // 旋转 60 度
color.rotate(180)    // 互补色（旋转 180 度）
color.rotate(-30)    // 反向旋转
```

#### 4. 透明度操作

调整透明度：

```typescript
color.alpha(0.5)     // 设置为 50% 透明度
color.fade(0.3)      // 降低 30% 不透明度
color.fadeIn(0.2)    // 增加 20% 不透明度
```

#### 5. 混合操作

混合两个颜色：

```typescript
color.mix(otherColor)           // 50% 混合
color.mix(otherColor, 0.3)      // 30% 混合
color.blend(otherColor, 'multiply') // 使用混合模式
```

### 不可变性的实现

每个操作都创建新实例：

```typescript
const original = new Color('#3498db')

// 每个操作都返回新实例
const lighter = original.lighten(20)
const saturated = original.saturate(30)
const rotated = original.rotate(60)

// 原始颜色保持不变
console.log(original.toHex()) // '#3498db'

// 新颜色是独立的
console.log(lighter.toHex())   // '#5dade2'
console.log(saturated.toHex()) // '#2f9adb'
console.log(rotated.toHex())   // '#349bdb'
```

### 性能优化

#### 1. 智能缓存

重复的操作会被自动缓存：

```typescript
const color = new Color('#3498db')

// 第一次计算
const oklch1 = color.toOKLCH() // 计算并缓存

// 第二次直接从缓存读取
const oklch2 = color.toOKLCH() // 从缓存读取，极快
```

#### 2. 对象池

处理大量颜色时可以启用对象池：

```typescript
import { enableObjectPool } from '@ldesign/color/performance'

// 启用对象池
enableObjectPool({ maxSize: 1000 })

// 处理大量颜色
for (let i = 0; i < 10000; i++) {
  const color = new Color(`#${i.toString(16)}`)
  // 对象会被重用，减少内存分配
}
```

#### 3. 批量处理

使用批量 API 处理大数据集：

```typescript
import { ColorBatchProcessor } from '@ldesign/color/batch'

const processor = new ColorBatchProcessor()

// 批量转换，比循环快 3-5x
const hexColors = await processor.convertBatch(
  rgbColors,
  'hex',
  { parallel: true }
)
```

### 类型系统

完整的 TypeScript 类型定义：

```typescript
// 基础类型
type ColorInput = string | number | RGB | HSL | HSV
type ColorSpace = 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab' | 'lab' | 'lch'
type WCAGLevel = 'AA' | 'AAA'

// 接口
interface RGB {
  r: number  // 0-255
  g: number  // 0-255
  b: number  // 0-255
  a?: number // 0-1
}

interface HSL {
  h: number  // 0-360
  s: number  // 0-100
  l: number  // 0-100
  a?: number // 0-1
}

interface OKLCH {
  l: number  // 0-1
  c: number  // 0-0.4
  h: number  // 0-360
  a?: number // 0-1
}

// 调色板类型
interface Palette {
  [key: string]: string
}

interface TailwindPalette {
  50: string
  100: string
  200: string
  // ... 到 900
  900: string
}
```

## 最佳实践

### 1. 选择合适的色彩空间

- **UI 调整**：使用 HSL
- **渐变插值**：使用 OKLCH
- **色差计算**：使用 LAB + deltaE2000
- **设备显示**：最终转换为 RGB

### 2. 利用链式调用

```typescript
// ✅ 好 - 链式调用
const result = color
  .lighten(10)
  .saturate(20)
  .alpha(0.8)

// ❌ 避免 - 冗余中间变量
const step1 = color.lighten(10)
const step2 = step1.saturate(20)
const result = step2.alpha(0.8)
```

### 3. 按需导入

```typescript
// ✅ 好 - 按需导入
import { Color } from '@ldesign/color/core'
import { gradient } from '@ldesign/color/gradient'

// ❌ 避免 - 导入全部
import * as ColorLib from '@ldesign/color'
```

### 4. 处理大数据集

```typescript
// ✅ 好 - 使用批量 API
import { ColorBatchProcessor } from '@ldesign/color/batch'
const processor = new ColorBatchProcessor()
const results = await processor.convertBatch(colors, 'hex')

// ❌ 避免 - 循环处理
const results = colors.map(c => new Color(c).toHex())
```

## 下一步

- 🎨 学习 [颜色操作](./color-manipulation)
- 📊 了解 [颜色分析](./color-analysis)
- 🌈 探索 [调色板生成](./palette-generation)
- 🚀 掌握 [高级色彩空间](./color-spaces)


