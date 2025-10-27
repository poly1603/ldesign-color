# 颜色操作

本指南介绍如何操作和转换颜色。所有操作都是不可变的，返回新的颜色实例。

## 明度调整

### 增加/减少明度

```typescript
const color = new Color('#3498db')

// 增加明度
const lighter = color.lighten(20)  // 增加 20%
const muchLighter = color.lighten(40)

// 减少明度
const darker = color.darken(20)    // 降低 20%
const muchDarker = color.darken(40)

// 链式调用
const adjusted = color.lighten(10).darken(5)
```

### 设置明度

```typescript
// 设置为特定明度值（0-100）
const light = color.lightness(80)  // 80% 明度
const dark = color.lightness(20)   // 20% 明度
```

### 调整亮度

```typescript
// 亮度调整（基于 RGB）
const brighter = color.brightness(150)  // 150% 亮度
const dimmer = color.brightness(50)     // 50% 亮度
```

## 饱和度调整

### 增加/减少饱和度

```typescript
const color = new Color('#3498db')

// 增加饱和度
const saturated = color.saturate(30)   // 增加 30%
const moreSaturated = color.saturate(50)

// 减少饱和度
const desaturated = color.desaturate(30) // 降低 30%
const lessVibrant = color.desaturate(50)

// 完全去饱和（灰度）
const gray = color.grayscale()
const gray2 = color.desaturate(100)  // 等效
```

### 设置饱和度

```typescript
// 设置为特定饱和度值（0-100）
const vibrant = color.saturation(90)  // 90% 饱和度
const muted = color.saturation(30)    // 30% 饱和度
```

## 色相调整

### 旋转色相

```typescript
const color = new Color('#3498db')

// 顺时针旋转
const rotated30 = color.rotate(30)   // 旋转 30 度
const rotated90 = color.rotate(90)   // 旋转 90 度

// 逆时针旋转
const rotatedBack = color.rotate(-30)

// 互补色（旋转 180 度）
const complementary = color.rotate(180)
```

### 设置色相

```typescript
// 设置为特定色相值（0-360）
const red = color.hue(0)     // 红色系
const green = color.hue(120) // 绿色系
const blue = color.hue(240)  // 蓝色系
```

### 色相偏移

```typescript
// 相对当前色相偏移
const shifted = color.shiftHue(30)    // 偏移 30 度
const shiftedBack = color.shiftHue(-30)
```

## 透明度调整

### 设置透明度

```typescript
const color = new Color('#3498db')

// 设置透明度（0-1）
const transparent = color.alpha(0.5)   // 50% 透明
const almostOpaque = color.alpha(0.9)  // 90% 不透明
const fullyOpaque = color.alpha(1)     // 完全不透明
const invisible = color.alpha(0)       // 完全透明
```

### 淡入/淡出

```typescript
// 淡出（降低不透明度）
const faded = color.fade(0.3)      // 降低 30% 不透明度

// 淡入（增加不透明度）
const moreSolid = color.fadeIn(0.3) // 增加 30% 不透明度

// 完全淡出
const fullyFaded = color.fadeOut()  // 完全透明
```

## 颜色混合

### 基础混合

```typescript
const blue = new Color('#3498db')
const red = new Color('#e74c3c')

// 50% 混合
const purple = blue.mix(red)

// 自定义混合比例
const moreBl ue = blue.mix(red, 0.2)  // 20% red, 80% blue
const moreRed = blue.mix(red, 0.8)    // 80% red, 20% blue
```

### 混合模式

```typescript
// 不同混合模式
const multiply = blue.blend(red, 'multiply')
const screen = blue.blend(red, 'screen')
const overlay = blue.blend(red, 'overlay')
const hardLight = blue.blend(red, 'hard-light')
const softLight = blue.blend(red, 'soft-light')
const colorDodge = blue.blend(red, 'color-dodge')
const colorBurn = blue.blend(red, 'color-burn')
```

### 色彩空间混合

```typescript
// 在不同色彩空间混合
const mixedRGB = blue.mix(red, 0.5, { space: 'rgb' })
const mixedHSL = blue.mix(red, 0.5, { space: 'hsl' })
const mixedOKLCH = blue.mix(red, 0.5, { space: 'oklch' }) // 最平滑
```

## 温度调整

### 暖色/冷色

```typescript
const color = new Color('#3498db')

// 变暖（增加红/黄色调）
const warmer = color.warm(20)     // 增加 20% 暖色调
const muchWarmer = color.warm(40)

// 变冷（增加蓝色调）
const cooler = color.cool(20)     // 增加 20% 冷色调
const muchCooler = color.cool(40)
```

## 色调调整

### 调整色调

```typescript
const color = new Color('#3498db')

// 调整为特定色调
const sepia = color.sepia()       // 怀旧褐色
const tinted = color.tint(20)     // 混入白色
const shaded = color.shade(20)    // 混入黑色
const toned = color.tone(20)      // 混入灰色
```

## 反转和互补

### 颜色反转

```typescript
const color = new Color('#3498db')

// RGB 反转
const inverted = color.invert()   // 互补色的一种形式

// 只反转明度
const invertedLightness = color.invertLightness()
```

### 互补色

```typescript
// 互补色（色相旋转 180 度）
const complementary = color.complementary()
const complementary2 = color.rotate(180) // 等效
```

## 灰度处理

### 转为灰度

```typescript
const color = new Color('#3498db')

// 标准灰度
const gray1 = color.grayscale()

// 亮度保持灰度（感知均匀）
const gray2 = color.grayscalePerceptual()

// 自定义灰度算法
const gray3 = color.toGrayscale('luminance')
const gray4 = color.toGrayscale('lightness')
const gray5 = color.toGrayscale('average')
```

## 钳位和归一化

### 钳位到有效范围

```typescript
// 确保所有值在有效范围内
const clamped = color.clamp()

// 钳位特定通道
const clampedRGB = color.clampRGB()
const clampedHSL = color.clampHSL()
```

### 归一化

```typescript
// 归一化颜色值
const normalized = color.normalize()
```

## 链式操作

所有操作都返回新实例，支持链式调用：

```typescript
const color = new Color('#3498db')

// 复杂的链式操作
const result = color
  .lighten(10)           // 1. 增加明度
  .saturate(20)          // 2. 增加饱和度
  .rotate(30)            // 3. 旋转色相
  .alpha(0.8)            // 4. 设置透明度
  .warm(10)              // 5. 增加暖色调
  .toHex()               // 6. 转换为 HEX

console.log(result)      // '#...'

// 原始颜色未改变
console.log(color.toHex()) // '#3498db'
```

## 条件操作

### 基于条件调整

```typescript
const color = new Color('#3498db')

// 如果太暗则增亮
const adjusted = color.isLight() 
  ? color 
  : color.lighten(20)

// 确保足够对比度
const contrastColor = color.contrast('#ffffff') < 4.5
  ? color.darken(30)
  : color
```

## 批量操作

对多个颜色应用相同操作：

```typescript
import { ColorBatchProcessor } from '@ldesign/color/batch'

const colors = [
  new Color('#3498db'),
  new Color('#e74c3c'),
  new Color('#2ecc71')
]

const processor = new ColorBatchProcessor()

// 批量增亮
const lightened = await processor.applyOperation(
  colors,
  color => color.lighten(20),
  { parallel: true }
)

// 批量饱和
const saturated = await processor.applyOperation(
  colors,
  color => color.saturate(30)
)
```

## 动画支持

创建颜色动画：

```typescript
import { ColorAnimation } from '@ldesign/color/animation'

const animation = new ColorAnimation()

// 从一个颜色过渡到另一个
animation.fromTo('#3498db', '#e74c3c', {
  duration: 1000,
  easing: 'ease-in-out',
  onUpdate: (color) => {
    element.style.backgroundColor = color.toHex()
  },
  onComplete: () => {
    console.log('Animation complete!')
  }
})

// 启动动画
animation.play()

// 控制动画
animation.pause()
animation.resume()
animation.stop()
```

## 实用示例

### 创建悬停效果

```typescript
const buttonColor = new Color('#3498db')

// 悬停时增亮
const hoverColor = buttonColor.lighten(10)

// 按下时变暗
const activeColor = buttonColor.darken(10)

// 禁用状态
const disabledColor = buttonColor.desaturate(50).lighten(20)
```

### 生成状态颜色

```typescript
const primary = new Color('#3498db')

// 成功色（绿色调）
const success = primary.hue(120).saturate(20)

// 警告色（黄色调）
const warning = primary.hue(45).lighten(10)

// 错误色（红色调）
const error = primary.hue(0).saturate(30)

// 信息色（保持蓝色）
const info = primary.saturate(10)
```

### 创建深浅变体

```typescript
const baseColor = new Color('#3498db')

// 生成不同深浅
const variants = {
  lighter: baseColor.lighten(30),
  light: baseColor.lighten(15),
  base: baseColor,
  dark: baseColor.darken(15),
  darker: baseColor.darken(30)
}
```

### 确保可读性

```typescript
const backgroundColor = new Color('#3498db')

// 自动选择文本颜色
const textColor = backgroundColor.isLight()
  ? new Color('#000000')
  : new Color('#ffffff')

// 确保足够对比度
const ensureContrast = (bg: Color, text: Color, minContrast = 4.5) => {
  let adjusted = text
  while (bg.contrast(adjusted) < minContrast) {
    adjusted = adjusted.isLight() 
      ? adjusted.darken(5)
      : adjusted.lighten(5)
  }
  return adjusted
}

const readableText = ensureContrast(backgroundColor, textColor)
```

## 最佳实践

### 1. 使用语义化操作

```typescript
// ✅ 好 - 语义清晰
const lighter = color.lighten(20)
const desaturated = color.desaturate(30)

// ❌ 避免 - 直接修改 HSL 值
const hsl = color.toHSL()
hsl.l += 20
const lighter = Color.fromHSL(hsl) // 繁琐且易错
```

### 2. 利用链式调用

```typescript
// ✅ 好 - 链式调用
const result = color.lighten(10).saturate(20).rotate(30)

// ❌ 避免 - 多个中间变量
const step1 = color.lighten(10)
const step2 = step1.saturate(20)
const result = step2.rotate(30)
```

### 3. 选择合适的混合空间

```typescript
// ✅ 好 - 根据需求选择
const smoothGradient = color1.mix(color2, 0.5, { space: 'oklch' })
const simpleBlend = color1.mix(color2, 0.5, { space: 'rgb' })

// ❌ 避免 - 不考虑色彩空间
const mixed = color1.mix(color2) // 默认 RGB，可能不够平滑
```

### 4. 保持原色不变

```typescript
// ✅ 好 - 创建新变量
const originalColor = new Color('#3498db')
const modifiedColor = originalColor.lighten(20)
// originalColor 保持不变

// ❌ 避免 - 尝试修改原色（不可能，但语义不清）
originalColor.lighten(20) // 返回新实例，但容易被忽略
```

## 性能建议

### 1. 缓存复杂操作

```typescript
// ✅ 好 - 缓存结果
const color = new Color('#3498db')
const processed = color.lighten(10).saturate(20).rotate(30)
// 多次使用 processed

// ❌ 避免 - 重复计算
for (let i = 0; i < 1000; i++) {
  const temp = color.lighten(10).saturate(20).rotate(30)
  // 使用 temp
}
```

### 2. 使用批量 API

```typescript
// ✅ 好 - 批量处理
const processor = new ColorBatchProcessor()
const results = await processor.applyOperation(colors, c => c.lighten(20))

// ❌ 避免 - 单独处理
const results = colors.map(c => c.lighten(20))
```

## 下一步

- 📊 学习 [颜色分析](./color-analysis)
- 🎨 探索 [调色板生成](./palette-generation)
- 🌈 了解 [渐变系统](./gradients)
- 🎯 查看 [色彩和谐](./color-harmony)


