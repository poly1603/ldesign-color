# 基础概念

了解 @ldesign/color 的核心概念将帮助你更好地使用这个库。

## 颜色系统架构

@ldesign/color 采用分层的颜色系统架构：

```
主色调 (Primary Color)
    ↓
语义化颜色 (Semantic Colors)
    ↓
色阶系统 (Color Palettes)
    ↓
CSS变量 (CSS Variables)
```

### 主色调 (Primary Color)

主色调是整个颜色系统的基础，通常代表品牌色或主要的视觉元素颜色。

```typescript
// 主色调示例
const primaryColor = '#1890ff' // 蓝色
const primaryColor2 = '#52c41a' // 绿色
const primaryColor3 = '#722ed1' // 紫色
```

### 语义化颜色 (Semantic Colors)

基于主色调，系统会自动生成四种语义化颜色：

- **Primary**: 主色调（与输入相同）
- **Success**: 成功状态色（通常为绿色系）
- **Warning**: 警告状态色（通常为橙色系）
- **Danger**: 危险状态色（通常为红色系）
- **Gray**: 中性色（基于主色调的灰色）

```typescript
const theme = generateTheme('#1890ff')
console.log(theme.semanticColors)
// {
//   primary: '#1890ff',
//   success: '#52c41a',  // 自动生成的绿色
//   warning: '#faad14',  // 自动生成的橙色
//   danger: '#f5222d',   // 自动生成的红色
//   gray: '#8c8c8c'      // 自动生成的灰色
// }
```

## 色阶系统

### 12色阶设计

对于主色调和语义色（primary、success、warning、danger），系统生成12个色阶：

```
色阶1 ←→ 色阶12
浅色     深色
```

- **色阶1-3**: 非常浅的颜色，适用于背景
- **色阶4-5**: 浅色，适用于悬停状态
- **色阶6**: 标准色（与语义化颜色相同）
- **色阶7-8**: 深色，适用于激活状态
- **色阶9-12**: 非常深的颜色，适用于文本

### 14色阶灰色

灰色系统使用14个色阶，提供更丰富的层次：

```typescript
const grayPalette = theme.palettes.light.gray
// ['#ffffff', '#fafafa', '#f5f5f5', ..., '#000000'] // 14个色阶
```

### 明暗模式

每种颜色都有对应的明暗模式版本：

```typescript
// 明亮模式
const lightPalette = theme.palettes.light.primary
// ['#e6f7ff', '#bae7ff', '#91d5ff', ...]

// 暗黑模式
const darkPalette = theme.palettes.dark.primary
// ['#111d2c', '#112a3a', '#15395b', ...]
```

## 颜色生成算法

### 语义化颜色算法

系统使用基于色彩理论的算法来生成语义化颜色：

1. **色相调整**: 根据主色调的色相，计算最佳的语义色色相
2. **饱和度优化**: 调整饱和度以确保颜色的和谐性
3. **亮度平衡**: 保持适当的亮度对比

```typescript
// 成功色生成示例
function generateSuccessColor(primaryHsl: [number, number, number]): string {
  const [h, s, l] = primaryHsl

  // 根据主色调确定成功色色相
  let newH: number
  if (h < 25 || h >= 335)
newH = 120 // 红色系 -> 绿色
  else if (h >= 25 && h < 75)
newH = 80 // 黄色系 -> 黄绿色
  // ... 更多逻辑

  const newS = Math.max(55, Math.min(70, s - 5))
  const newL = Math.max(45, Math.min(60, l + 5))

  return hslToHex([newH, newS, newL])
}
```

### 色阶生成算法

色阶生成基于扩展的 Arco Design 算法：

1. **中心点确定**: 第6个色阶为标准色
2. **渐变计算**: 向两端生成渐变色阶
3. **暗黑模式适配**: 调整饱和度和亮度以适应暗黑环境

## CSS变量系统

### 命名规范

生成的CSS变量遵循统一的命名规范：

```css
/* 基础色阶变量 */
--ldesign-{color}-{step}: {value};
--ldesign-{color}-{step}-rgb: {r}, {g}, {b};

/* 暗黑模式变量 */
--ldesign-dark-{color}-{step}: {value};

/* 语义化变量 */
--ldesign-{color}: var(--ldesign-{color}-6);
--ldesign-{color}-hover: var(--ldesign-{color}-5);
--ldesign-{color}-active: var(--ldesign-{color}-7);
```

### 实际示例

```css
:root {
  /* 主色调色阶 */
  --ldesign-primary-1: #e6f7ff;
  --ldesign-primary-2: #bae7ff;
  --ldesign-primary-6: #1890ff;
  --ldesign-primary-12: #003a8c;

  /* RGB格式（用于透明度） */
  --ldesign-primary-6-rgb: 24, 144, 255;

  /* 语义化变量 */
  --ldesign-primary: var(--ldesign-primary-6);
  --ldesign-primary-hover: var(--ldesign-primary-5);
  --ldesign-primary-active: var(--ldesign-primary-7);
}

/* 暗黑模式 */
[data-theme="dark"] {
  --ldesign-dark-primary-1: #111d2c;
  --ldesign-dark-primary-6: #177ddc;
  --ldesign-dark-primary-12: #68b2ff;
}
```

## 性能优化策略

### 缓存机制

系统使用LRU（Least Recently Used）缓存策略：

```typescript
// 缓存配置
const generator = new ColorGenerator({
  enableCache: true,
  cacheSize: 100 // 缓存100个主题
})

// 缓存键生成
const cacheKey = `semantic_${primaryColor}`
```

### Web Worker

对于复杂的颜色计算，系统可以使用Web Worker：

```typescript
// 启用Web Worker
const generator = new ColorGenerator({
  useWebWorker: true
})

// 异步生成
const theme = await generator.generateAsync('#1890ff')
```

### 防抖处理

避免频繁的颜色生成操作：

```typescript
// 防抖生成
generator.generateDebounced('#1890ff', (theme) => {
  console.log('主题生成完成:', theme)
})
```

## 类型系统

### 核心类型

```typescript
// 语义化颜色类型
interface SemanticColors {
  primary: string
  success: string
  warning: string
  danger: string
  gray: string
}

// 色阶类型
interface ColorPalette {
  primary: string[] // 12色阶
  success: string[] // 12色阶
  warning: string[] // 12色阶
  danger: string[] // 12色阶
  gray: string[] // 14色阶
}

// 完整主题类型
interface GeneratedTheme {
  semanticColors: SemanticColors
  palettes: {
    light: ColorPalette
    dark: ColorPalette
  }
  cssVariables: string
  timestamp: number
}
```

### 配置类型

```typescript
interface ColorGeneratorConfig {
  enableCache?: boolean // 启用缓存
  cacheSize?: number // 缓存大小
  useWebWorker?: boolean // 使用Web Worker
  cssPrefix?: string // CSS变量前缀
  autoInject?: boolean // 自动注入CSS
}
```

## 最佳实践

### 1. 选择合适的主色调

```typescript
// ✅ 推荐：饱和度适中的颜色
const goodColors = [
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#722ed1', // 紫色
  '#fa541c' // 橙色
]

// ❌ 避免：过于极端的颜色
const badColors = [
  '#000000', // 纯黑
  '#ffffff', // 纯白
  '#ff0000' // 纯红
]
```

### 2. 合理使用缓存

```typescript
// 开发环境：禁用缓存，便于调试
const devConfig = {
  enableCache: false,
  useWebWorker: false
}

// 生产环境：启用所有优化
const prodConfig = {
  enableCache: true,
  cacheSize: 500,
  useWebWorker: true
}
```

### 3. 响应式设计

```typescript
// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', (e) => {
  setTheme(e.matches ? 'dark' : 'light')
})
```

## 下一步

- 🎨 学习 [颜色生成](./color-generation) 的详细算法
- 🌓 了解 [明暗模式](./dark-mode) 的实现原理
- 🔧 探索 [Vue集成](./vue-composables) 的使用方法
- ⚡ 查看 [性能优化](./performance) 的最佳实践
