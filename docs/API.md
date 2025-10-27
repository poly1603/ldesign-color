# @ldesign/color API 文档

## 目录

1. [核心 API](#核心-api)
2. [设计系统集成](#设计系统集成)
3. [批量处理](#批量处理)
4. [色彩调和](#色彩调和)
5. [高级工具](#高级工具)
6. [渐变功能](#渐变功能)
7. [性能优化](#性能优化)

---

## 核心 API

### Color 类

```typescript
class Color {
  // 构造
  constructor(input: ColorInput)
  static fromRGB(r, g, b, a?): Color
  static fromHSL(h, s, l, a?): Color
  static fromHSV(h, s, v, a?): Color
  static random(): Color

  // 属性
  red: number // 0-255
  green: number // 0-255
  blue: number // 0-255
  alpha: number // 0-1
  hue: number // 0-360
  saturation: number // 0-100
  lightness: number // 0-100
  brightness: number // 0-100

  // 转换
  toHex(includeAlpha?): string
  toRGB(): RGB
  toRGBDirect(): [r, g, b, a]
  toRGBString(): string
  toHSL(): HSL
  toHSLString(): string
  toHSV(): HSV
  toOKLCH(): OKLCH
  toOKLAB(): OKLAB
  toLAB(): LAB
  toLCH(): LCH
  toXYZ(): XYZ
  toString(format): string

  // 操作
  lighten(amount): Color
  darken(amount): Color
  saturate(amount): Color
  desaturate(amount): Color
  rotate(degrees): Color
  grayscale(): Color
  invert(): Color
  setAlpha(value): Color
  fade(amount): Color
  mix(color, amount): Color
  blend(color, mode): Color

  // 分析
  getLuminance(): number
  contrast(color): number
  isLight(): boolean
  isDark(): boolean
  isWCAGCompliant(bg, level, size): boolean
  distance(color): number
  deltaE2000(color): number
  deltaEOKLAB(color): number

  // 调和
  complementary(): Color
  analogous(angle): [Color, Color]
  triadic(): [Color, Color]
  tetradic(): [Color, Color, Color]
  splitComplementary(angle): [Color, Color]
  harmony(type): Color[]

  // 工具
  clone(): Color
  equals(color): boolean
  isValid(): boolean
  toJSON(): object
  dispose(): void
  release(): void
}
```

---

## 设计系统集成

### Ant Design

```typescript
import {
  generateAntDesignColorSystem,
  generateAntDesignNeutral,
  generateAntDesignPalette,
  generateAntDesignTheme,
  toAntDesignCSSVars
} from '@ldesign/color'

// 生成 10 级调色板
const palette: AntDesignPalette = generateAntDesignPalette('#1890ff')
// { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }

// 生成完整色彩系统
const system = generateAntDesignColorSystem('#1890ff')
// { primary, success, warning, error, info }

// 生成中性色
const neutral = generateAntDesignNeutral()
// { 1-13: gray shades }

// 转为 CSS 变量
const cssVars = toAntDesignCSSVars(palette, 'primary')

// 生成完整主题
const theme = generateAntDesignTheme('#1890ff')
```

### Chakra UI

```typescript
import {
  generateChakraUIColors,
  generateChakraUICSSVars,
  generateChakraUIScale,
  toChakraUITheme
} from '@ldesign/color'

// 生成色阶 (50-900)
const scale: ChakraUIScale = generateChakraUIScale('#3182ce')

// 生成完整主题
const colors = generateChakraUIColors('#3182ce')

// 转为 Chakra 主题
const theme = toChakraUITheme('#3182ce')

// CSS 变量
const css = generateChakraUICSSVars('#3182ce')
```

### Material Design

```typescript
import {
  generateMaterialDesign3Scheme,
  generateMaterialDesign3Tonal,
  generateMaterialDesignPalette,
  generateMaterialDesignTheme,
  toMaterialDesignCSSVars
} from '@ldesign/color'

// MD2 调色板
const md2: MaterialDesignPalette = generateMaterialDesignPalette('#2196f3')
// { 50, 100, ..., 900, A100, A200, A400, A700 }

// MD3 Tonal
const tonal: MaterialDesign3Tonal = generateMaterialDesign3Tonal('#6750A4')
// { 0, 10, 20, ..., 95, 99, 100 }

// MD3 完整方案
const scheme: MaterialDesign3Scheme = generateMaterialDesign3Scheme('#6750A4')
// { primary, secondary, tertiary, error, neutral, neutralVariant }
```

### 其他设计系统

```typescript
// Carbon Design
import { generateCarbonScale, generateCarbonTheme } from '@ldesign/color'

// Fluent UI
import { generateFluentUIRamp, generateFluentUITokens } from '@ldesign/color'

// Tailwind CSS
import { generateTailwindScale, generateTailwindSemanticColors } from '@ldesign/color'

// 统一接口
import { generateCompleteColorSystem, generateDesignSystemPalette } from '@ldesign/color'

const palette = generateDesignSystemPalette('#3b82f6', 'tailwind')
const system = generateCompleteColorSystem('#3b82f6', 'ant-design')
```

---

## 批量处理

### 批量转换

```typescript
import { batchConvert } from '@ldesign/color'

const hexColors = await batchConvert(
  colors,
  'hex',
  {
    chunkSize: 100,
    onProgress: (done, total) => {
      console.log(`${done}/${total}`)
    }
  }
)
```

### 批量操作

```typescript
import { batchManipulate } from '@ldesign/color'

const results = await batchManipulate(
  colors,
  [
    { type: 'lighten', amount: 20 },
    { type: 'saturate', amount: 10 },
    { type: 'rotate', degrees: 30 }
  ],
  { chunkSize: 100 }
)
```

**支持的操作:**

- `{ type: 'lighten', amount: number }`
- `{ type: 'darken', amount: number }`
- `{ type: 'saturate', amount: number }`
- `{ type: 'desaturate', amount: number }`
- `{ type: 'rotate', degrees: number }`
- `{ type: 'setAlpha', value: number }`
- `{ type: 'grayscale' }`
- `{ type: 'invert' }`

### 流式处理

```typescript
import { ColorStreamProcessor } from '@ldesign/color'

const processor = new ColorStreamProcessor()
const stream = processor.process(
  colorIterator,
  color => color.lighten(20).toHex(),
  {
    chunkSize: 100,
    onError: (error, input) => console.error(error)
  }
)

for await (const hex of stream) {
  // 逐个处理
}

// 获取统计
const stats = processor.getStats()
console.log(stats.processed, stats.errors)
```

---

## 色彩调和

### 生成调和

```typescript
import { generateHarmony } from '@ldesign/color'

const harmony = generateHarmony('#3498db', {
  type: 'triadic',
  count: 5,
  variation: 15,
  preserveBase: true
})

console.log(harmony.score) // 0-100
console.log(harmony.metrics)
// {
//   colorBalance: number,
//   contrastRange: number,
//   saturationHarmony: number,
//   lightnessHarmony: number,
//   hueRelation: number
// }
console.log(harmony.suggestions) // 改进建议
```

**调和类型:**

- `monochromatic` - 单色系
- `analogous` - 类似色
- `complementary` - 互补色
- `split-complementary` - 分裂互补
- `triadic` - 三角色
- `tetradic` - 四角色
- `square` - 正方形
- `double-complementary` - 双互补
- `clash` - 冲突色
- `custom` - 自定义

### 自然主题

```typescript
import { generateNatureHarmony } from '@ldesign/color'

const forest = generateNatureHarmony('#2ecc71', 'forest')
const ocean = generateNatureHarmony('#3498db', 'ocean')
const sunset = generateNatureHarmony('#e74c3c', 'sunset')
const earth = generateNatureHarmony('#8b7355', 'earth')
const sky = generateNatureHarmony('#87ceeb', 'sky')
```

### 自动优化

```typescript
import { findBestHarmony, optimizeHarmony } from '@ldesign/color'

// 优化到目标分数
const optimized = optimizeHarmony(colors, base, 85)

// 自动找最佳
const best = findBestHarmony('#3498db')
console.log(best.type, best.score)
```

---

## 高级工具

### 颜色排序

```typescript
import { sortColors } from '@ldesign/color'

const sorted = sortColors(colors, 'hue') // 按色相
const sorted = sortColors(colors, 'saturation') // 按饱和度
const sorted = sortColors(colors, 'lightness') // 按明度
const sorted = sortColors(colors, 'luminance') // 按亮度
const sorted = sortColors(colors, 'temperature') // 按色温
const sorted = sortColors(colors, 'red') // 按红色通道
// 还支持: green, blue, brightness, chroma
```

### 查找最近颜色

```typescript
import { findNearestColor, findNearestColors } from '@ldesign/color'

// 找最接近的一个
const nearest = findNearestColor(
  target,
  palette,
  'deltaEOKLAB' // 距离度量
)

// 找最接近的 N 个
const top5 = findNearestColors(target, palette, 5, 'deltaE2000')
```

**距离度量:**

- `euclidean` - RGB 欧氏距离（最快）
- `deltaEOKLAB` - OKLAB 距离（快+准）
- `deltaE2000` - Delta E 2000（最准）
- `hsl` - HSL 空间距离
- `hsv` - HSV 空间距离

### 颜色聚类

```typescript
import { clusterColors, findOptimalClusters } from '@ldesign/color'

// K-means 聚类
const result = clusterColors(colors, 5)
console.log(result.centers) // 聚类中心
console.log(result.assignments) // 分配
console.log(result.inertia) // 质量指标

// 自动找最佳 K
const k = findOptimalClusters(colors, 10)
const clusters = clusterColors(colors, k)
```

### 颜色量化

```typescript
import { quantizeColors } from '@ldesign/color'

// K-means 量化
const reduced = quantizeColors(imageColors, 16, 'kmeans')

// Median-cut 量化
const reduced = quantizeColors(imageColors, 16, 'median-cut')
```

### 过滤和去重

```typescript
import { deduplicateColors, filterColors } from '@ldesign/color'

// 过滤
const vibrant = filterColors(colors, {
  minSaturation: 50,
  minLightness: 30,
  maxLightness: 70
})

// 去重
const unique = deduplicateColors(colors, 2, 'deltaEOKLAB')
```

### 统计分析

```typescript
import { getColorStatistics } from '@ldesign/color'

const stats = getColorStatistics(palette)
// {
//   count: number,
//   averageHue: number,
//   averageSaturation: number,
//   averageLightness: number,
//   averageLuminance: number,
//   hueDiversity: number,
//   saturationRange: [min, max],
//   lightnessRange: [min, max]
// }
```

---

## 渐变功能

### 基础渐变

```typescript
import {
  animatedGradient,
  conicGradient,
  linearGradient,
  meshGradient,
  radialGradient,
  smoothGradient
} from '@ldesign/color'

// 线性渐变
const css = linearGradient(['#ff0000', '#0000ff'], { angle: 90 })

// 径向渐变
const css = radialGradient(colors, { shape: 'circle' })

// 锥形渐变
const css = conicGradient(colors, { startAngle: 0 })
```

### 高级渐变

```typescript
import {
  adjustGradientContrast,
  analyzeGradient,
  generateEasedGradient,
  generateGradientWithMidpoints,
  generateLinearGradientCSS,
  reverseGradient,
  smoothGradient
} from '@ldesign/color'

// 中点控制
const gradient = generateGradientWithMidpoints([
  { color: '#ff0000', position: 0, midpoint: 0.3 },
  { color: '#00ff00', position: 50, midpoint: 0.7 },
  { color: '#0000ff', position: 100 }
], 100, 'oklch')

// 缓动渐变
const eased = generateEasedGradient(
  ['#ff0000', '#0000ff'],
  100,
  'ease-in-out'
)

// 生成 CSS
const css = generateLinearGradientCSS(colors, { angle: 45 })

// 反转
const reversed = reverseGradient(gradient)

// 调整对比度
const highContrast = adjustGradientContrast(gradient, 50)

// 平滑处理
const smoothed = smoothGradient(gradient, 2.0)

// 分析
const analysis = analyzeGradient(gradient)
```

---

## 性能优化

### 对象池

```typescript
import { ObjectPool, poolManager } from '@ldesign/color'

// 查看统计
const stats = poolManager.getAllStats()

// 优化所有池
poolManager.optimizeAll()

// 收缩池
poolManager.shrinkAll()

// 创建自定义池
const myPool = new ObjectPool(
  () => createObject(),
  obj => resetObject(obj),
  { maxSize: 20 }
)
```

### 缓存管理

```typescript
import { globalColorCache } from '@ldesign/color'

// 查看统计
const stats = globalColorCache.getStats()

// 优化缓存
globalColorCache.optimize()

// 清空缓存
globalColorCache.clear()
```

### 内存管理

```typescript
import { cleanupMemory, getMemoryStats, memoryManager } from '@ldesign/color'

// 获取内存统计
const stats = getMemoryStats()

// 手动清理
cleanupMemory()

// 设置内存限制
setMemoryLimit(100) // MB
```

---

## 类型定义

```typescript
// 颜色输入
type ColorInput
  = | string
    | RGB | HSL | HSV | HWB
    | LAB | LCH | XYZ | OKLAB | OKLCH
    | number[]
    | Color

// 颜色格式
type ColorFormat
  = | 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv'
    | 'hwb' | 'lab' | 'lch' | 'xyz' | 'oklab' | 'oklch'

// 混合模式
type BlendMode
  = | 'normal' | 'multiply' | 'screen' | 'overlay'
    | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
    | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'

// 插值空间
type InterpolationSpace
  = | 'rgb' | 'hsl' | 'hsv' | 'hwb'
    | 'lab' | 'lch' | 'oklab' | 'oklch'

// WCAG 等级
type WCAGLevel = 'AA' | 'AAA'

// 色盲类型
type ColorBlindnessType
  = | 'protanopia' | 'protanomaly' // 红色盲/弱
    | 'deuteranopia' | 'deuteranomaly' // 绿色盲/弱
    | 'tritanopia' | 'tritanomaly' // 蓝色盲/弱
    | 'achromatopsia' | 'achromatomaly' // 全色盲
```

---

## 性能指标

### 基准测试结果

```
核心操作:
  Color.fromRGB()      ~2,500,000 ops/sec
  Color.toHex()        ~5,000,000 ops/sec
  Color.toRGB()        ~3,000,000 ops/sec
  Color.toHSL()        ~1,200,000 ops/sec
  Color.lighten()        ~800,000 ops/sec
  Color.mix()            ~600,000 ops/sec

高级操作:
  Color.toOKLCH()        ~200,000 ops/sec
  Color.deltaE2000()      ~50,000 ops/sec
  Color.deltaEOKLAB()    ~150,000 ops/sec

设计系统:
  generateAntDesignPalette()     ~50,000 ops/sec
  generateTailwindScale()        ~60,000 ops/sec

工具函数:
  sortColors(100)                ~10,000 ops/sec
  clusterColors(100, k=5)           ~100 ops/sec
  findNearestColor(palette=100)  ~50,000 ops/sec
```

### 内存使用

```
Color 实例:          ~24 bytes
RGB 对象:            ~32 bytes
HSL 对象:            ~32 bytes
缓存条目:            ~200 bytes

典型应用:
  1000 个 Color 对象:  ~0.15 MB
  带缓存:              ~0.20 MB
  使用对象池后:        ~0.05 MB
```

---

## 示例代码

### 完整的主题生成

```typescript
import {
  Color,
  generateDesignSystemPalette,
  generateHarmony
} from '@ldesign/color'

// 1. 选择基础颜色
const baseColor = '#3498db'

// 2. 生成设计系统调色板
const palette = generateDesignSystemPalette(baseColor, 'tailwind')

// 3. 生成调和配色
const harmony = generateHarmony(baseColor, {
  type: 'triadic',
  variation: 15
})

// 4. 检查调和质量
if (harmony.score < 80) {
  console.log('改进建议:')
  harmony.suggestions.forEach(s => console.log(`  ${s}`))
}

// 5. 应用主题
document.documentElement.style.setProperty('--primary', baseColor)
harmony.colors.forEach((color, i) => {
  document.documentElement.style.setProperty(
    `--harmony-${i}`,
    color.toHex()
  )
})
```

### 图像颜色提取

```typescript
import {
  clusterColors,
  deduplicateColors,
  findOptimalClusters,
  sortColors
} from '@ldesign/color'

// 1. 从图像提取颜色（假设已提取）
const imageColors = extractColorsFromImageData(imageData)

// 2. 找最佳聚类数
const k = findOptimalClusters(imageColors, 10)

// 3. 聚类
const { centers } = clusterColors(imageColors, k)

// 4. 去重
const unique = deduplicateColors(centers, 5)

// 5. 排序
const sorted = sortColors(unique, 'luminance')

// 6. 生成调色板
const palette = generateDesignSystemPalette(sorted[0], 'ant-design')
```

---

## 最佳实践总结

### ✅ 性能最佳实践

1. **使用对象池**

   ```typescript
   const color = Color.fromRGB(255, 0, 0)
   // ... use ...
   color.dispose()
   ```

2. **批量操作**

   ```typescript
   await batchManipulate(colors, operations)
   ```

3. **使用直接方法**

   ```typescript
   const [r, g, b, a] = color.toRGBDirect() // 零分配
   ```

4. **合适的插值空间**

   ```typescript
   interpolate(c1, c2, 0.5, { space: 'oklch' }) // 感知一致
   ```

5. **释放对象**
   ```typescript
   const rgb = color.toRGB()
   // ... use ...
   Color.returnRGB(rgb)
   ```

### ✅ API 使用最佳实践

1. **使用统一接口**

   ```typescript
   generateDesignSystemPalette(color, system)
   ```

2. **使用感知距离**

   ```typescript
   findNearestColor(target, palette, 'deltaEOKLAB')
   ```

3. **检查调和质量**

   ```typescript
   if (harmony.score < 80) {
     // 优化或使用建议
   }
   ```

4. **分析渐变**
   ```typescript
   const analysis = analyzeGradient(gradient)
   if (analysis.hasColorBanding) {
     // 平滑处理
   }
   ```

---

**版本:** 1.1.0
**更新日期:** 2025-10-25
**维护者:** LDesign Color Team
