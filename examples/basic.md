# 基础示例

本页展示 @ldesign/color 的基础用法示例。

## 创建颜色

### 从不同格式创建

```typescript
import { Color } from '@ldesign/color'

// HEX 格式
const hex = new Color('#3498db')

// RGB 格式
const rgb = Color.fromRGB(52, 152, 219)

// HSL 格式
const hsl = Color.fromHSL(204, 70, 53)

// 命名颜色
const named = new Color('cornflowerblue')

// 随机颜色
const random = Color.random()

console.log('所有颜色:', {
  hex: hex.toHex(),
  rgb: rgb.toRGBString(),
  hsl: hsl.toHSLString(),
  named: named.toHex(),
  random: random.toHex()
})
```

<div class="color-palette">
  <div class="color-swatch" style="background: #3498db;">#3498db</div>
  <div class="color-swatch" style="background: rgb(52, 152, 219);">rgb</div>
  <div class="color-swatch" style="background: hsl(204, 70%, 53%);">hsl</div>
</div>

## 颜色转换

### 在不同格式间转换

```typescript
const color = new Color('#3498db')

// 转换为不同格式
const formats = {
  hex: color.toHex(),                    // '#3498db'
  rgb: color.toRGB(),                    // { r: 52, g: 152, b: 219 }
  hsl: color.toHSL(),                    // { h: 204, s: 70, l: 53 }
  rgbString: color.toRGBString(),        // 'rgb(52, 152, 219)'
  hslString: color.toHSLString()         // 'hsl(204, 70%, 53%)'
}

console.log('颜色格式:', formats)
```

### 在线演示

<div class="example-container">
  <div class="color-preview" style="background: #3498db; width: 100%; height: 100px; border-radius: 8px; margin-bottom: 16px;"></div>
  
  <table>
    <tr>
      <th>格式</th>
      <th>值</th>
    </tr>
    <tr>
      <td>HEX</td>
      <td><code>#3498db</code></td>
    </tr>
    <tr>
      <td>RGB</td>
      <td><code>rgb(52, 152, 219)</code></td>
    </tr>
    <tr>
      <td>HSL</td>
      <td><code>hsl(204, 70%, 53%)</code></td>
    </tr>
  </table>
</div>

## 基础操作

### 调整明度

```typescript
const color = new Color('#3498db')

// 增加明度
const lighter = color.lighten(20)      // 增加 20%
const veryLight = color.lighten(40)    // 增加 40%

// 降低明度
const darker = color.darken(20)        // 降低 20%
const veryDark = color.darken(40)      // 降低 40%

console.log('明度变化:', {
  original: color.toHex(),
  lighter: lighter.toHex(),
  veryLight: veryLight.toHex(),
  darker: darker.toHex(),
  veryDark: veryDark.toHex()
})
```

<div class="color-palette">
  <div class="color-swatch" style="background: #85c1e9;">+40%</div>
  <div class="color-swatch" style="background: #5dade2;">+20%</div>
  <div class="color-swatch" style="background: #3498db;">原色</div>
  <div class="color-swatch" style="background: #2980b9;">-20%</div>
  <div class="color-swatch" style="background: #1f618d;">-40%</div>
</div>

### 调整饱和度

```typescript
const color = new Color('#3498db')

// 增加饱和度
const saturated = color.saturate(30)     // 增加 30%
const vibranti = color.saturate(50)      // 增加 50%

// 降低饱和度
const desaturated = color.desaturate(30) // 降低 30%
const muted = color.desaturate(50)       // 降低 50%
const gray = color.grayscale()           // 完全去饱和

console.log('饱和度变化:', {
  saturated: saturated.toHex(),
  original: color.toHex(),
  desaturated: desaturated.toHex(),
  gray: gray.toHex()
})
```

<div class="color-palette">
  <div class="color-swatch" style="background: #0099ff;">+50%</div>
  <div class="color-swatch" style="background: #2196f3;">+30%</div>
  <div class="color-swatch" style="background: #3498db;">原色</div>
  <div class="color-swatch" style="background: #5a9ec4;">-30%</div>
  <div class="color-swatch" style="background: #7ea3ad;">-50%</div>
  <div class="color-swatch" style="background: #999999;">灰度</div>
</div>

### 旋转色相

```typescript
const color = new Color('#3498db')

// 旋转不同角度
const rotations = {
  30: color.rotate(30),       // 蓝绿色
  60: color.rotate(60),       // 青色
  120: color.rotate(120),     // 绿色
  180: color.rotate(180),     // 橙色（互补色）
  240: color.rotate(240),     // 红色
  300: color.rotate(300)      // 品红
}

Object.entries(rotations).forEach(([deg, rotated]) => {
  console.log(`旋转 ${deg}°:`, rotated.toHex())
})
```

<div class="color-palette">
  <div class="color-swatch" style="background: #3498db;">0°</div>
  <div class="color-swatch" style="background: #34b4db;">30°</div>
  <div class="color-swatch" style="background: #34dbd4;">60°</div>
  <div class="color-swatch" style="background: #5adb34;">120°</div>
  <div class="color-swatch" style="background: #db8034;">180°</div>
  <div class="color-swatch" style="background: #db3498;">300°</div>
</div>

## 透明度

### 设置和调整透明度

```typescript
const color = new Color('#3498db')

// 设置透明度
const transparent50 = color.alpha(0.5)   // 50% 透明
const transparent30 = color.alpha(0.3)   // 30% 不透明

// 渐进淡出
const fadeSteps = [1, 0.8, 0.6, 0.4, 0.2, 0].map(a => 
  color.alpha(a).toRGBString()
)

console.log('透明度层级:', fadeSteps)
```

<div class="color-palette">
  <div class="color-swatch" style="background: rgba(52, 152, 219, 1);">100%</div>
  <div class="color-swatch" style="background: rgba(52, 152, 219, 0.8);">80%</div>
  <div class="color-swatch" style="background: rgba(52, 152, 219, 0.6);">60%</div>
  <div class="color-swatch" style="background: rgba(52, 152, 219, 0.4);">40%</div>
  <div class="color-swatch" style="background: rgba(52, 152, 219, 0.2);">20%</div>
  <div class="color-swatch" style="background: rgba(52, 152, 219, 0);">0%</div>
</div>

## 颜色混合

### 混合两个颜色

```typescript
const blue = new Color('#3498db')
const red = new Color('#e74c3c')

// 不同混合比例
const mixes = {
  10: blue.mix(red, 0.1),    // 10% 红色
  30: blue.mix(red, 0.3),    // 30% 红色
  50: blue.mix(red, 0.5),    // 50% 混合
  70: blue.mix(red, 0.7),    // 70% 红色
  90: blue.mix(red, 0.9)     // 90% 红色
}

Object.entries(mixes).forEach(([ratio, mixed]) => {
  console.log(`${ratio}% 红色:`, mixed.toHex())
})
```

<div class="color-palette">
  <div class="color-swatch" style="background: #3498db;">蓝色</div>
  <div class="color-swatch" style="background: #4892d5;">10%</div>
  <div class="color-swatch" style="background: #6e7fb8;">30%</div>
  <div class="color-swatch" style="background: #8e728c;">50%</div>
  <div class="color-swatch" style="background: #ae665f;">70%</div>
  <div class="color-swatch" style="background: #ce5a32;">90%</div>
  <div class="color-swatch" style="background: #e74c3c;">红色</div>
</div>

## 链式调用

### 组合多个操作

```typescript
const color = new Color('#3498db')

// 链式调用多个操作
const result = color
  .lighten(10)       // 1. 增加明度
  .saturate(20)      // 2. 增加饱和度
  .rotate(30)        // 3. 旋转色相
  .alpha(0.9)        // 4. 设置透明度

console.log('链式操作结果:', result.toRGBString())

// 创建变体
const variants = {
  light: color.lighten(30).desaturate(20),
  dark: color.darken(30).saturate(20),
  muted: color.desaturate(50).lighten(20),
  vibrant: color.saturate(40).darken(10)
}
```

## 实用场景

### 按钮状态颜色

```typescript
const primaryColor = new Color('#3498db')

// 生成按钮所有状态
const buttonColors = {
  normal: primaryColor,
  hover: primaryColor.lighten(10),
  active: primaryColor.darken(10),
  disabled: primaryColor.desaturate(50).lighten(20)
}

console.log('按钮颜色:', {
  normal: buttonColors.normal.toHex(),
  hover: buttonColors.hover.toHex(),
  active: buttonColors.active.toHex(),
  disabled: buttonColors.disabled.toHex()
})
```

<div class="feature-cards">
  <div class="feature-card" style="background: #3498db; color: white;">
    <h4>正常</h4>
    <code>#3498db</code>
  </div>
  <div class="feature-card" style="background: #5dade2; color: white;">
    <h4>悬停</h4>
    <code>#5dade2</code>
  </div>
  <div class="feature-card" style="background: #2980b9; color: white;">
    <h4>按下</h4>
    <code>#2980b9</code>
  </div>
  <div class="feature-card" style="background: #b8d4ea; color: #333;">
    <h4>禁用</h4>
    <code>#b8d4ea</code>
  </div>
</div>

### 主题色生成

```typescript
const brandColor = new Color('#3498db')

// 生成主题色系
const theme = {
  primary: brandColor,
  secondary: brandColor.rotate(180),
  success: brandColor.hue(120).saturate(20),
  warning: brandColor.hue(45),
  error: brandColor.hue(0).saturate(30),
  info: brandColor
}

console.log('主题色系:', {
  primary: theme.primary.toHex(),
  secondary: theme.secondary.toHex(),
  success: theme.success.toHex(),
  warning: theme.warning.toHex(),
  error: theme.error.toHex()
})
```

<div class="color-palette">
  <div class="color-swatch" style="background: #3498db;">主色</div>
  <div class="color-swatch" style="background: #db8034;">次色</div>
  <div class="color-swatch" style="background: #2ecc71;">成功</div>
  <div class="color-swatch" style="background: #f39c12;">警告</div>
  <div class="color-swatch" style="background: #e74c3c;">错误</div>
  <div class="color-swatch" style="background: #3498db;">信息</div>
</div>

### 深浅变体

```typescript
const baseColor = new Color('#3498db')

// 生成 5 个深浅变体
const variants = {
  lightest: baseColor.lighten(40),
  lighter: baseColor.lighten(20),
  base: baseColor,
  darker: baseColor.darken(20),
  darkest: baseColor.darken(40)
}

console.log('深浅变体:', Object.entries(variants).map(
  ([name, color]) => `${name}: ${color.toHex()}`
))
```

<div class="color-palette">
  <div class="color-swatch" style="background: #aed6f1;">最浅</div>
  <div class="color-swatch" style="background: #5dade2;">较浅</div>
  <div class="color-swatch" style="background: #3498db;">基色</div>
  <div class="color-swatch" style="background: #2874a6;">较深</div>
  <div class="color-swatch" style="background: #1b4f72;">最深</div>
</div>

## 完整代码示例

```typescript
import { Color } from '@ldesign/color'

// 1. 创建颜色
const color = new Color('#3498db')

// 2. 颜色操作
const lighter = color.lighten(20)
const darker = color.darken(20)
const saturated = color.saturate(30)
const rotated = color.rotate(180)

// 3. 颜色混合
const blue = new Color('#3498db')
const red = new Color('#e74c3c')
const purple = blue.mix(red, 0.5)

// 4. 链式调用
const result = color
  .lighten(10)
  .saturate(20)
  .rotate(30)
  .alpha(0.9)

// 5. 格式转换
console.log(color.toHex())        // '#3498db'
console.log(color.toRGBString())  // 'rgb(52, 152, 219)'
console.log(color.toHSLString())  // 'hsl(204, 70%, 53%)'

// 6. 实用应用
const buttonStates = {
  normal: color,
  hover: color.lighten(10),
  active: color.darken(10),
  disabled: color.desaturate(50).lighten(20)
}

// 7. 输出所有状态
Object.entries(buttonStates).forEach(([state, c]) => {
  console.log(`${state}:`, c.toHex())
})
```

## 下一步

- 📖 学习 [颜色分析](./conversion) 
- 🎨 探索 [高级示例](./advanced)
- 🌈 查看 [调色板生成](./palettes)
- 🚀 了解 [性能优化](./performance)


