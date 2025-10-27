# Color - 核心 API

`Color` 类是 @ldesign/color 的核心，提供颜色创建、转换、操作和分析的完整功能。

## 构造函数

### `new Color(input: ColorInput)`

创建一个颜色实例。

**参数:**
- `input`: 颜色输入，支持多种格式

**支持的格式:**
- HEX: `'#3498db'`, `'#3498dbcc'`
- RGB: `'rgb(52, 152, 219)'`, `'rgba(52, 152, 219, 0.8)'`
- HSL: `'hsl(204, 70%, 53%)'`, `'hsla(204, 70%, 53%, 0.8)'`
- 命名颜色: `'blue'`, `'cornflowerblue'`
- 数字: `0x3498db`

**示例:**

```typescript
const color1 = new Color('#3498db')
const color2 = new Color('rgb(52, 152, 219)')
const color3 = new Color('blue')
const color4 = new Color(0x3498db)
```

## 静态工厂方法

### `Color.fromRGB(r, g, b, a?): Color`

从 RGB 值创建颜色。

**参数:**
- `r`: 红色 (0-255)
- `g`: 绿色 (0-255)
- `b`: 蓝色 (0-255)
- `a`: 可选，透明度 (0-1)

**返回:** `Color` 实例

**示例:**

```typescript
const color = Color.fromRGB(52, 152, 219)
const transparent = Color.fromRGB(52, 152, 219, 0.5)
```

### `Color.fromHSL(h, s, l, a?): Color`

从 HSL 值创建颜色。

**参数:**
- `h`: 色相 (0-360)
- `s`: 饱和度 (0-100)
- `l`: 明度 (0-100)
- `a`: 可选，透明度 (0-1)

**返回:** `Color` 实例

**示例:**

```typescript
const color = Color.fromHSL(204, 70, 53)
const transparent = Color.fromHSL(204, 70, 53, 0.8)
```

### `Color.fromHSV(h, s, v, a?): Color`

从 HSV 值创建颜色。

**参数:**
- `h`: 色相 (0-360)
- `s`: 饱和度 (0-100)
- `v`: 明度值 (0-100)
- `a`: 可选，透明度 (0-1)

**返回:** `Color` 实例

### `Color.random(options?): Color`

创建随机颜色。

**参数:**
- `options`: 可选，约束条件
  - `minSaturation`: 最小饱和度 (0-100)
  - `maxSaturation`: 最大饱和度 (0-100)
  - `minLightness`: 最小明度 (0-100)
  - `maxLightness`: 最大明度 (0-100)

**返回:** `Color` 实例

**示例:**

```typescript
// 完全随机
const random = Color.random()

// 鲜艳的随机颜色
const vibrant = Color.random({
  minSaturation: 70,
  minLightness: 40,
  maxLightness: 60
})
```

## 转换方法

### `toHex(options?): string`

转换为 HEX 字符串。

**参数:**
- `options`: 可选配置
  - `alpha`: 是否包含透明度，默认 `false`
  - `uppercase`: 是否大写，默认 `false`

**返回:** HEX 字符串

**示例:**

```typescript
color.toHex()                          // '#3498db'
color.alpha(0.5).toHex({ alpha: true }) // '#3498db80'
color.toHex({ uppercase: true })       // '#3498DB'
```

### `toRGB(): RGB`

转换为 RGB 对象。

**返回:** `{ r: number, g: number, b: number, a?: number }`

**示例:**

```typescript
color.toRGB() // { r: 52, g: 152, b: 219 }
```

### `toRGBString(): string`

转换为 RGB 字符串。

**返回:** RGB/RGBA 字符串

**示例:**

```typescript
color.toRGBString()              // 'rgb(52, 152, 219)'
color.alpha(0.8).toRGBString()   // 'rgba(52, 152, 219, 0.8)'
```

### `toRGBArray(): number[]`

转换为 RGB 数组。

**返回:** `[r, g, b]` 或 `[r, g, b, a]`

**示例:**

```typescript
color.toRGBArray()              // [52, 152, 219]
color.alpha(0.8).toRGBArray()   // [52, 152, 219, 0.8]
```

### `toHSL(): HSL`

转换为 HSL 对象。

**返回:** `{ h: number, s: number, l: number, a?: number }`

**示例:**

```typescript
color.toHSL() // { h: 204, s: 70, l: 53 }
```

### `toHSLString(): string`

转换为 HSL 字符串。

**返回:** HSL/HSLA 字符串

**示例:**

```typescript
color.toHSLString()              // 'hsl(204, 70%, 53%)'
color.alpha(0.8).toHSLString()   // 'hsla(204, 70%, 53%, 0.8)'
```

### `toHSV(): HSV`

转换为 HSV 对象。

**返回:** `{ h: number, s: number, v: number, a?: number }`

### `toOKLCH(): OKLCH`

转换为 OKLCH 对象（感知均匀色彩空间）。

**返回:** `{ l: number, c: number, h: number, a?: number }`

### `toOKLAB(): OKLAB`

转换为 OKLAB 对象。

**返回:** `{ l: number, a: number, b: number, alpha?: number }`

### `toLAB(): LAB`

转换为 CIE LAB 对象。

**返回:** `{ l: number, a: number, b: number, alpha?: number }`

### `toLCH(): LCH`

转换为 LCH 对象。

**返回:** `{ l: number, c: number, h: number, a?: number }`

### `toXYZ(): XYZ`

转换为 XYZ 对象。

**返回:** `{ x: number, y: number, z: number }`

### `toNumber(): number`

转换为 24/32 位整数。

**返回:** 数字表示的颜色

### `toCSS(format?): string`

转换为 CSS 颜色字符串。

**参数:**
- `format`: 可选，`'hex' | 'rgb' | 'hsl'`

**返回:** CSS 颜色字符串

## 操作方法

### `lighten(amount: number): Color`

增加明度。

**参数:**
- `amount`: 增加的百分比 (0-100)

**返回:** 新的 `Color` 实例

**示例:**

```typescript
const lighter = color.lighten(20)  // 增加 20% 明度
```

### `darken(amount: number): Color`

降低明度。

**参数:**
- `amount`: 降低的百分比 (0-100)

**返回:** 新的 `Color` 实例

**示例:**

```typescript
const darker = color.darken(20)  // 降低 20% 明度
```

### `saturate(amount: number): Color`

增加饱和度。

**参数:**
- `amount`: 增加的百分比 (0-100)

**返回:** 新的 `Color` 实例

### `desaturate(amount: number): Color`

降低饱和度。

**参数:**
- `amount`: 降低的百分比 (0-100)

**返回:** 新的 `Color` 实例

### `grayscale(): Color`

转换为灰度（完全去饱和）。

**返回:** 新的 `Color` 实例

**示例:**

```typescript
const gray = color.grayscale()
```

### `rotate(degrees: number): Color`

旋转色相。

**参数:**
- `degrees`: 旋转角度 (-360 到 360)

**返回:** 新的 `Color` 实例

**示例:**

```typescript
const rotated = color.rotate(180)  // 互补色
```

### `alpha(value: number): Color`

设置透明度。

**参数:**
- `value`: 透明度值 (0-1)

**返回:** 新的 `Color` 实例

**示例:**

```typescript
const transparent = color.alpha(0.5)  // 50% 透明
```

### `fade(amount: number): Color`

降低不透明度。

**参数:**
- `amount`: 降低的量 (0-1)

**返回:** 新的 `Color` 实例

### `fadeIn(amount: number): Color`

增加不透明度。

**参数:**
- `amount`: 增加的量 (0-1)

**返回:** 新的 `Color` 实例

### `mix(color: Color, weight?: number, options?): Color`

混合两个颜色。

**参数:**
- `color`: 要混合的颜色
- `weight`: 可选，混合权重 (0-1)，默认 0.5
- `options`: 可选配置
  - `space`: 色彩空间，默认 `'rgb'`

**返回:** 新的 `Color` 实例

**示例:**

```typescript
const mixed = color1.mix(color2)              // 50% 混合
const moreBl ue = color1.mix(color2, 0.2)     // 20% color2
const smoothMix = color1.mix(color2, 0.5, { space: 'oklch' })
```

### `blend(color: Color, mode: BlendMode): Color`

使用混合模式混合颜色。

**参数:**
- `color`: 要混合的颜色
- `mode`: 混合模式

**支持的模式:**
- `'multiply'` - 正片叠底
- `'screen'` - 滤色
- `'overlay'` - 叠加
- `'hard-light'` - 强光
- `'soft-light'` - 柔光
- `'color-dodge'` - 颜色减淡
- `'color-burn'` - 颜色加深

**返回:** 新的 `Color` 实例

## 分析方法

### `getLuminance(): number`

获取相对亮度（WCAG 标准）。

**返回:** 亮度值 (0-1)

**示例:**

```typescript
const luminance = color.getLuminance() // 0.296
```

### `contrast(other: Color): number`

计算与另一颜色的对比度。

**参数:**
- `other`: 另一个颜色

**返回:** 对比度 (1-21)

**示例:**

```typescript
const ratio = color.contrast('#ffffff') // 3.96
```

### `isLight(): boolean`

判断是否为浅色。

**返回:** 布尔值

**示例:**

```typescript
if (color.isLight()) {
  // 使用深色文本
}
```

### `isDark(): boolean`

判断是否为深色。

**返回:** 布尔值

### `isWCAGCompliant(other: Color, level: WCAGLevel): boolean`

检查 WCAG 对比度合规性。

**参数:**
- `other`: 另一个颜色
- `level`: WCAG 等级 (`'AA'` 或 `'AAA'`)

**返回:** 布尔值

**示例:**

```typescript
const isAccessible = color.isWCAGCompliant('#ffffff', 'AA')
// false - 对比度不足
```

### `getContrastLevel(other: Color): string`

获取对比度等级。

**参数:**
- `other`: 另一个颜色

**返回:** `'Fail' | 'AA' | 'AAA'`

### `deltaE2000(other: Color): number`

计算感知色差（Delta E 2000）。

**参数:**
- `other`: 另一个颜色

**返回:** 色差值
- `< 1.0`: 不可察觉
- `1.0-2.3`: 几乎不可察觉
- `2.3-5.0`: 轻微可察觉
- `> 5.0`: 明显可察觉

**示例:**

```typescript
const diff = color.deltaE2000(otherColor) // 2.3
```

## 调色板方法

### `toTailwindPalette(): TailwindPalette`

生成 Tailwind CSS 风格调色板。

**返回:** 包含 50-900 的对象

**示例:**

```typescript
const palette = color.toTailwindPalette()
// {
//   50: '#eff6ff',
//   100: '#dbeafe',
//   ...
//   900: '#1e3a8a'
// }
```

### `toNaturalPalette(steps: number): string[]`

生成自然色阶。

**参数:**
- `steps`: 色阶数量

**返回:** 颜色数组

**示例:**

```typescript
const palette = color.toNaturalPalette(10)
```

## 工具方法

### `clone(): Color`

克隆颜色实例。

**返回:** 新的 `Color` 实例

### `equals(other: Color): boolean`

检查两个颜色是否相等。

**参数:**
- `other`: 另一个颜色

**返回:** 布尔值

### `toString(): string`

转换为字符串（HEX 格式）。

**返回:** HEX 字符串

## 类型定义

```typescript
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

interface HSV {
  h: number  // 0-360
  s: number  // 0-100
  v: number  // 0-100
  a?: number // 0-1
}

interface OKLCH {
  l: number  // 0-1
  c: number  // 0-0.4
  h: number  // 0-360
  a?: number // 0-1
}

type WCAGLevel = 'AA' | 'AAA'

type ColorInput = string | number | RGB | HSL | HSV

type BlendMode = 
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'hard-light'
  | 'soft-light'
  | 'color-dodge'
  | 'color-burn'
```

## 完整示例

```typescript
import { Color } from '@ldesign/color'

// 创建颜色
const color = new Color('#3498db')

// 操作颜色
const result = color
  .lighten(10)
  .saturate(20)
  .rotate(30)
  .alpha(0.8)

// 转换格式
console.log(result.toHex())        // '#...'
console.log(result.toRGBString())  // 'rgba(...)'
console.log(result.toHSLString())  // 'hsla(...)'

// 分析颜色
console.log(color.getLuminance())            // 0.296
console.log(color.contrast('#ffffff'))       // 3.96
console.log(color.isWCAGCompliant('#fff', 'AA')) // false

// 生成调色板
const palette = color.toTailwindPalette()
console.log(palette[500]) // '#3498db'

// 混合颜色
const mixed = color.mix(new Color('#e74c3c'))
console.log(mixed.toHex())
```

## 相关文档

- [快速开始](../guide/getting-started)
- [颜色操作](../guide/color-manipulation)
- [颜色分析](../guide/color-analysis)
- [调色板生成](../guide/palette-generation)


