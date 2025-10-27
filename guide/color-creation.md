# 颜色创建与转换

本指南介绍如何创建颜色对象以及在不同格式之间转换。

## 创建颜色

### 从字符串创建

支持多种字符串格式：

```typescript
import { Color } from '@ldesign/color'

// HEX 格式
const hex3 = new Color('#fff')           // 3位 HEX
const hex6 = new Color('#3498db')        // 6位 HEX
const hex8 = new Color('#3498dbcc')      // 8位 HEX（带透明度）

// RGB 格式
const rgb = new Color('rgb(52, 152, 219)')
const rgba = new Color('rgba(52, 152, 219, 0.8)')

// HSL 格式
const hsl = new Color('hsl(204, 70%, 53%)')
const hsla = new Color('hsla(204, 70%, 53%, 0.8)')

// 命名颜色
const named = new Color('blue')
const named2 = new Color('cornflowerblue')
```

### 从 RGB 创建

```typescript
// 基础 RGB
const color1 = Color.fromRGB(52, 152, 219)

// 带透明度的 RGBA
const color2 = Color.fromRGB(52, 152, 219, 0.8)

// 从 RGB 对象创建
const color3 = Color.fromRGB({ r: 52, g: 152, b: 219 })
const color4 = Color.fromRGB({ r: 52, g: 152, b: 219, a: 0.8 })
```

### 从 HSL 创建

```typescript
// 基础 HSL
const color1 = Color.fromHSL(204, 70, 53)

// 带透明度的 HSLA
const color2 = Color.fromHSL(204, 70, 53, 0.8)

// 从 HSL 对象创建
const color3 = Color.fromHSL({ h: 204, s: 70, l: 53 })
const color4 = Color.fromHSL({ h: 204, s: 70, l: 53, a: 0.8 })
```

### 从 HSV 创建

```typescript
// 基础 HSV
const color1 = Color.fromHSV(204, 76, 86)

// 带透明度
const color2 = Color.fromHSV(204, 76, 86, 0.8)

// 从对象创建
const color3 = Color.fromHSV({ h: 204, s: 76, v: 86 })
```

### 特殊创建方法

```typescript
// 随机颜色
const random = Color.random()

// 随机鲜艳颜色（高饱和度）
const vibrant = Color.random({ 
  minSaturation: 70,
  minLightness: 40,
  maxLightness: 60
})

// 随机柔和颜色
const soft = Color.random({
  maxSaturation: 30,
  minLightness: 80
})

// 从数字创建（24位整数）
const fromNumber = new Color(0x3498db)
```

## 颜色转换

### 转换为 HEX

```typescript
const color = Color.fromRGB(52, 152, 219)

// 6位 HEX
color.toHex()        // '#3498db'

// 8位 HEX（带透明度）
color.alpha(0.8).toHex() // '#3498dbcc'

// 转换选项
color.toHex({ 
  alpha: true,       // 包含透明度
  uppercase: true    // 大写字母
}) // '#3498DBFF'
```

### 转换为 RGB

```typescript
const color = new Color('#3498db')

// RGB 对象
color.toRGB()        // { r: 52, g: 152, b: 219 }

// RGBA 对象（带透明度）
color.alpha(0.8).toRGB() // { r: 52, g: 152, b: 219, a: 0.8 }

// RGB 字符串
color.toRGBString()  // 'rgb(52, 152, 219)'
color.alpha(0.8).toRGBString() // 'rgba(52, 152, 219, 0.8)'

// RGB 数组
color.toRGBArray()   // [52, 152, 219]
color.alpha(0.8).toRGBArray() // [52, 152, 219, 0.8]
```

### 转换为 HSL

```typescript
const color = new Color('#3498db')

// HSL 对象
color.toHSL()        // { h: 204, s: 70, l: 53 }

// HSLA 对象
color.alpha(0.8).toHSL() // { h: 204, s: 70, l: 53, a: 0.8 }

// HSL 字符串
color.toHSLString()  // 'hsl(204, 70%, 53%)'
color.alpha(0.8).toHSLString() // 'hsla(204, 70%, 53%, 0.8)'

// HSL 数组
color.toHSLArray()   // [204, 70, 53]
```

### 转换为 HSV

```typescript
const color = new Color('#3498db')

// HSV 对象
color.toHSV()        // { h: 204, s: 76, v: 86 }

// HSVA 对象
color.alpha(0.8).toHSV() // { h: 204, s: 76, v: 86, a: 0.8 }

// HSV 字符串
color.toHSVString()  // 'hsv(204, 76%, 86%)'
```

### 转换为高级色彩空间

```typescript
const color = new Color('#3498db')

// OKLCH（感知均匀）
color.toOKLCH()      // { l: 0.648, c: 0.139, h: 233.7 }

// OKLAB
color.toOKLAB()      // { l: 0.648, a: -0.042, b: -0.131 }

// LAB
color.toLAB()        // { l: 62.5, a: -5.0, b: -37.8 }

// LCH
color.toLCH()        // { l: 62.5, c: 38.1, h: 262.5 }

// XYZ
color.toXYZ()        // { x: 0.244, y: 0.296, z: 0.632 }

// HWB
color.toHWB()        // { h: 204, w: 20, b: 14 }
```

### 转换为 CSS 值

```typescript
const color = new Color('#3498db')

// CSS 颜色字符串（自动选择最优格式）
color.toCSS()        // 'rgb(52, 152, 219)'

// 指定格式
color.toCSS('hex')   // '#3498db'
color.toCSS('rgb')   // 'rgb(52, 152, 219)'
color.toCSS('hsl')   // 'hsl(204, 70%, 53%)'

// CSS 变量值
color.toCSSVar()     // '--color: #3498db'
color.toCSSVar('primary') // '--color-primary: #3498db'
```

### 转换为数字

```typescript
const color = new Color('#3498db')

// 24位整数
color.toNumber()     // 3447003

// 32位整数（带透明度）
color.alpha(0.5).toNumber() // 3447003127
```

## 批量转换

处理大量颜色转换时，使用批量 API 可以获得更好的性能：

```typescript
import { ColorBatchProcessor } from '@ldesign/color/batch'

const processor = new ColorBatchProcessor()

// 批量转换为 HEX
const colors = [
  'rgb(52, 152, 219)',
  'hsl(204, 70%, 53%)',
  'blue'
]

const hexColors = await processor.convertBatch(colors, 'hex')
// ['#3498db', '#3498db', '#0000ff']

// 批量转换为 RGB
const rgbColors = await processor.convertBatch(colors, 'rgb')

// 带选项的批量转换
const results = await processor.convertBatch(colors, 'hex', {
  parallel: true,      // 并行处理
  uppercase: true,     // 大写
  includeAlpha: true   // 包含透明度
})
```

## 颜色验证

检查颜色字符串是否有效：

```typescript
import { isValidColor, parseColor } from '@ldesign/color/utils'

// 验证颜色
isValidColor('#3498db')              // true
isValidColor('rgb(52, 152, 219)')    // true
isValidColor('blue')                 // true
isValidColor('invalid')              // false

// 解析颜色字符串
const parsed = parseColor('#3498db')
// {
//   format: 'hex',
//   value: { r: 52, g: 152, b: 219 },
//   valid: true
// }

// 获取颜色格式
import { getColorFormat } from '@ldesign/color/utils'
getColorFormat('#3498db')            // 'hex'
getColorFormat('rgb(52, 152, 219)')  // 'rgb'
getColorFormat('hsl(204, 70%, 53%)') // 'hsl'
```

## 颜色克隆

创建颜色的副本：

```typescript
const color1 = new Color('#3498db')

// 克隆颜色
const color2 = color1.clone()

// 修改克隆不影响原始颜色
color2.lighten(20)
console.log(color1.toHex()) // '#3498db' - 未改变
console.log(color2.toHex()) // '#5dade2' - 已改变
```

## 颜色比较

比较两个颜色是否相同：

```typescript
const color1 = new Color('#3498db')
const color2 = new Color('rgb(52, 152, 219)')
const color3 = new Color('#2980b9')

// 相等性检查
color1.equals(color2)        // true（相同颜色）
color1.equals(color3)        // false（不同颜色）

// 近似相等（允许微小差异）
color1.approximatelyEquals(color3, 10) // 允许 10 的色差
```

## 命名颜色

支持 140+ CSS 命名颜色：

```typescript
import { getNamedColor, getColorName, namedColors } from '@ldesign/color/constants'

// 从名称获取颜色
const blue = getNamedColor('blue')         // '#0000ff'
const crimson = getNamedColor('crimson')   // '#dc143c'

// 从颜色获取名称（最接近的命名颜色）
const name = getColorName('#0000ff')       // 'blue'
const name2 = getColorName('#dc143c')      // 'crimson'

// 获取所有命名颜色
console.log(namedColors)
// {
//   aliceblue: '#f0f8ff',
//   antiquewhite: '#faebd7',
//   aqua: '#00ffff',
//   ...
// }

// 查找最接近的命名颜色
import { findNearestNamedColor } from '@ldesign/color/utils'
const nearest = findNearestNamedColor('#3498db')
// { name: 'cornflowerblue', hex: '#6495ed', distance: 2.3 }
```

## 实用函数

### 颜色插值

在两个颜色之间插值：

```typescript
import { interpolate } from '@ldesign/color'

// 50% 混合
const mid = interpolate('#ff0080', '#00ff80', 0.5)

// 在不同色彩空间插值
const midRGB = interpolate('#ff0080', '#00ff80', 0.5, { space: 'rgb' })
const midHSL = interpolate('#ff0080', '#00ff80', 0.5, { space: 'hsl' })
const midOKLCH = interpolate('#ff0080', '#00ff80', 0.5, { space: 'oklch' })

// 使用缓动函数
const eased = interpolate('#ff0080', '#00ff80', 0.5, {
  space: 'oklch',
  easing: 'ease-in-out'
})
```

### 渐变生成

生成多个颜色的平滑渐变：

```typescript
import { gradient } from '@ldesign/color'

// 基础渐变
const colors = gradient(['#ff0080', '#00ff80'], 10)
// 返回 10 个颜色的数组

// 多色渐变
const multiColor = gradient(
  ['#ff0080', '#ff8000', '#00ff80', '#0080ff'],
  20
)

// 高质量渐变（OKLCH 空间）
const smooth = gradient(
  ['#ff0080', '#00ff80'],
  10,
  { space: 'oklch' }
)

// 带缓动的渐变
const eased = gradient(
  ['#ff0080', '#00ff80'],
  10,
  { 
    space: 'oklch',
    easing: 'ease-in-out'
  }
)
```

## 最佳实践

### 1. 选择合适的输入格式

```typescript
// ✅ 好 - 使用最方便的格式
const color1 = new Color('#3498db')       // HEX 简洁
const color2 = Color.fromRGB(52, 152, 219) // RGB 精确
const color3 = Color.fromHSL(204, 70, 53)  // HSL 直观

// ❌ 避免 - 不必要的转换
const rgb = { r: 52, g: 152, b: 219 }
const hex = `#${rgb.r.toString(16)}${rgb.g.toString(16)}${rgb.b.toString(16)}`
const color = new Color(hex) // 直接用 Color.fromRGB(rgb)
```

### 2. 批量处理大数据

```typescript
// ✅ 好 - 使用批量 API
const processor = new ColorBatchProcessor()
const results = await processor.convertBatch(colors, 'hex')

// ❌ 避免 - 循环处理
const results = colors.map(c => new Color(c).toHex())
```

### 3. 验证用户输入

```typescript
// ✅ 好 - 先验证再创建
if (isValidColor(userInput)) {
  const color = new Color(userInput)
  // 使用颜色
} else {
  // 处理错误
}

// ❌ 避免 - 直接创建可能抛出错误
const color = new Color(userInput) // 可能抛出异常
```

### 4. 使用类型注解

```typescript
// ✅ 好 - 明确类型
const color: Color = new Color('#3498db')
const rgb: RGB = color.toRGB()
const hex: string = color.toHex()

// 更好 - 使用导出的类型
import type { Color, RGB, HSL } from '@ldesign/color'
```

## 下一步

- 🎨 学习 [颜色操作](./color-manipulation)
- 📊 了解 [颜色分析](./color-analysis)
- 🌈 探索 [调色板生成](./palette-generation)
- 🚀 查看 [完整 API 文档](../api/core)


