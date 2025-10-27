# 🚀 快速开始 - @ldesign/color v1.1.0

## 新功能亮点

### ✨ OKLCH - 最好的渐变

```typescript
import { interpolate } from '@ldesign/color'

// 创建平滑、鲜艳的渐变
const colors = interpolate('#FF0080', '#00FF80', 0.5, { space: 'oklch' })
```

**对比效果：**

- 旧方式 (RGB): 红 → 棕色 → 灰色 → 青色 😞
- 新方式 (OKLCH): 红 → 橙色 → 黄色 → 绿色 → 青色 🎨

---

## 5 分钟上手

### 1. 创建美丽渐变

```typescript
import { gradient } from '@ldesign/color'

// 彩虹渐变
const rainbow = gradient(
  ['#FF0080', '#FF8000', '#FFFF00', '#00FF80', '#0080FF'],
  20,
  { space: 'oklch' }
)

// 输出 Hex 值
rainbow.forEach(c => console.log(c.toHex()))
```

### 2. 测量色彩差异

```typescript
import { Color } from '@ldesign/color'

const color1 = new Color('#FF6B6B')
const color2 = new Color('#FF8C94')

const deltaE = color1.deltaE2000(color2)
// 0 = 相同, <1 = 看不出, 1-2 = 勉强可见, >2 = 明显不同

console.log(`色差: ${deltaE.toFixed(2)}`)
```

### 3. 转换色彩空间

```typescript
const color = new Color('#FF6B6B')

// 现代感知均匀色彩空间
console.log(color.toOKLCH()) // { l: 0.68, c: 0.20, h: 25 }
console.log(color.toOKLAB()) // { l: 0.68, a: 0.18, b: 0.09 }
console.log(color.toLAB()) // { l: 62.5, a: 42.3, b: 25.6 }
```

### 4. 性能优化

```typescript
// 热路径优化 - 零内存分配
for (let i = 0; i < 10000; i++) {
  const [r, g, b, a] = color.toRGBDirect()
  // 比 toRGB() 快 2-3 倍
}
```

---

## 常见场景

### 场景 1: UI 主题色阶

```typescript
import { Color, gradient } from '@ldesign/color'

function createThemeScale(primaryColor: string) {
  const base = new Color(primaryColor)
  const oklch = base.toOKLCH()

  // 生成从浅到深的 10 个色阶
  const lightest = { ...oklch, l: 0.95 }
  const darkest = { ...oklch, l: 0.20 }

  return gradient(
    [lightest, base, darkest].map(c => new Color(c)),
    10,
    { space: 'oklch' }
  )
}

const theme = createThemeScale('#3B82F6')
```

### 场景 2: 检查色彩可访问性

```typescript
function isAccessible(fg: string, bg: string): boolean {
  const fgColor = new Color(fg)
  const bgColor = new Color(bg)

  // Delta E < 5 说明对比度不够
  const deltaE = fgColor.deltaE2000(bgColor)

  // 同时检查 WCAG 对比度
  const contrast = fgColor.contrast(bgColor)

  return deltaE >= 10 && contrast >= 4.5
}

console.log(isAccessible('#000000', '#FFFFFF')) // true
```

### 场景 3: 动画颜色过渡

```typescript
import { ColorInterpolator } from '@ldesign/color'

const interpolator = new ColorInterpolator('#FF0080', '#0080FF', {
  space: 'oklch',
  easing: 'ease-in-out'
})

// 60 帧动画
for (let frame = 0; frame < 60; frame++) {
  const t = frame / 59
  const color = interpolator.at(t)
  element.style.backgroundColor = color.toHex()
  await sleep(16) // ~60fps
}
```

### 场景 4: 色彩聚类

```typescript
function groupSimilarColors(colors: Color[], threshold = 5): Color[][] {
  const groups: Color[][] = []
  const used = new Set<number>()

  colors.forEach((color, i) => {
    if (used.has(i))
      return

    const group = [color]
    used.add(i)

    colors.forEach((other, j) => {
      if (i !== j && !used.has(j)) {
        if (color.deltaE2000(other) < threshold) {
          group.push(other)
          used.add(j)
        }
      }
    })

    groups.push(group)
  })

  return groups
}
```

---

## API 速查

### 新增方法

```typescript
// Color 类
color.toOKLCH() // 转换到 OKLCH
color.toOKLAB() // 转换到 OKLAB
color.toLAB() // 转换到 LAB
color.toLCH() // 转换到 LCH
color.toXYZ() // 转换到 XYZ
color.deltaE2000(other) // Delta E 2000
color.deltaEOKLAB(other) // OKLAB 距离
color.toRGBDirect() // 快速 RGB 元组

// 插值函数
interpolate(start, end, t, options)
gradient(colors, steps, options)
new ColorInterpolator(start, end, options)

// 转换函数
rgbToOKLCH(rgb)
oklchToRGB(oklch)
deltaE2000(rgb1, rgb2)
// ... 更多转换函数
```

### 支持的色彩空间

```typescript
// 插值空间
'rgb' | 'hsl' | 'hsv' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch'

// 推荐使用 'oklch' 获得最佳效果
```

### 缓动函数

```typescript
'linear' // 线性
'ease-in-out' // 缓入缓出
'ease-in-cubic' // 三次缓入
'ease-out-sine' // 正弦缓出
'ease-in-out-expo' // 指数缓入缓出
// ... 30+ 种缓动函数
```

---

## 性能提示

### ✅ 推荐

```typescript
// 1. 使用 toRGBDirect() 在热路径
const [r, g, b] = color.toRGBDirect()

// 2. 复用 ColorInterpolator
const interpolator = new ColorInterpolator(start, end, options)
const colors = interpolator.steps(100)

// 3. 缓存转换结果
const oklch = color.toOKLCH() // 只计算一次
```

### ❌ 避免

```typescript
// 1. 热路径中避免 toRGB()
for (let i = 0; i < 10000; i++) {
  const rgb = color.toRGB() // 创建对象
}

// 2. 避免重复创建插值器
for (let i = 0; i < 100; i++) {
  interpolate(start, end, i / 99) // 每次都创建
}

// 3. 避免在热路径使用 Delta E 2000
// 使用 deltaEOKLAB() 代替
```

---

## 浏览器支持

```
Chrome/Edge: 88+
Firefox: 85+
Safari: 14+
Node.js: 14+
```

---

## 更多资源

- 📖 [高级色彩空间指南](./docs/ADVANCED_COLOR_SPACES.md)
- ⚡ [性能优化指南](./docs/PERFORMANCE.md)
- 🎨 [交互式演示](./examples/advanced-features.html)
- 📝 [完整 API 文档](./README.md)
- 📋 [变更日志](./CHANGELOG.md)

---

## 从 v1.0 升级

好消息：**零破坏性变更！**

只需升级包版本，所有新功能立即可用：

```bash
npm update @ldesign/color
```

所有现有代码继续工作，新功能是纯添加的。

---

## 常见问题

### Q: 为什么 OKLCH 比 RGB 好？

A: OKLCH 是感知均匀的，意味着颜色之间的数值距离对应人眼感知的差异。RGB 不是感知均匀的，导致渐变中出现浑浊的中间色。

### Q: 何时使用 Delta E 2000？

A: 用于精确的色彩匹配、质量控制、可访问性验证。日常比较可以使用更快的 `deltaEOKLAB()`。

### Q: 性能影响如何？

A: OKLCH 转换约 0.015ms，对大多数应用可忽略不计。使用 `toRGBDirect()` 可获得 2-3x 性能提升。

### Q: Bundle 大小增加了多少？

A: 核心 +4KB gzipped (从 8KB 到 12KB)。新功能是 tree-shakeable 的，只导入使用的部分。

---

## 立即尝试

```bash
# 安装
npm install @ldesign/color

# 或升级
npm update @ldesign/color
```

```typescript
// 开始使用
import { Color, interpolate } from '@ldesign/color'

const color = new Color('#FF6B6B')
console.log(color.toOKLCH())

const gradient = interpolate('#FF0080', '#00FF80', 0.5, { space: 'oklch' })
console.log(gradient.toHex())
```

**享受更好的色彩体验！** 🎨✨
