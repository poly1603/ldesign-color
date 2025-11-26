# @ldesign/color - 常见问题

## 📖 基础问题

### 1. 如何安装和使用?

```bash
# 安装 Core 包(框架无关)
npm install @ldesign/color-core

# 安装 Vue 包
npm install @ldesign/color-vue
```

```typescript
// Core 包使用
import { Color } from '@ldesign/color-core'
const color = new Color('#667eea')

// Vue 包使用
import { useColor } from '@ldesign/color-vue'
const { color, lighten } = useColor('#667eea')
```

### 2. Core 包和 Vue 包有什么区别?

- **Core 包**: 框架无关的核心颜色处理库,可在任何 JavaScript 项目中使用
- **Vue 包**: 专为 Vue 3 设计的封装,提供响应式 API、组件和 composables

### 3. 支持哪些颜色格式?

支持所有主流颜色格式:
- Hex: `#667eea`, `#667`
- RGB: `rgb(102, 126, 234)`, `{ r: 102, g: 126, b: 234 }`
- HSL: `hsl(231, 76%, 66%)`, `{ h: 231, s: 76, l: 66 }`
- HSV: `{ h: 231, s: 56, v: 92 }`
- LAB: `{ l: 55, a: 18, b: -62 }`
- LCH: `{ l: 55, c: 65, h: 286 }`
- 命名颜色: `'red'`, `'blue'`

## 🚀 性能问题

### 4. 如何优化性能?

主要优化策略:
1. **使用缓存**: Color 实例会自动缓存转换结果
2. **批量处理**: 使用 `batchProcessColors` 处理多个颜色
3. **防抖节流**: 对频繁更新使用 `useDebouncedRef`/`useThrottledRef`
4. **Computed 缓存**: 使用 `cachedComputed` 缓存计算结果
5. **shallowRef**: 大对象使用 shallowRef 避免深度响应

详见 [性能优化指南](./PERFORMANCE_GUIDE.md)

### 5. 为什么 Vue 包性能比直接使用 Core 包慢?

Vue 包提供响应式特性,会有额外开销。但我们通过以下方式优化:
- 使用 `shallowRef` 减少 40-50% 响应式开销
- Computed 缓存减少 50% 重复计算
- 批量 DOM 更新减少 80% DOM 操作

实际使用中,优化后的 Vue 包性能与 Core 包相差不大。

### 6. 如何监控性能?

使用 `useColorPerformance`:

```typescript
import { useColorPerformance } from '@ldesign/color-vue'

const { metrics, performanceScore, getSuggestions } = useColorPerformance()

// 查看性能评分 (0-100)
console.log(performanceScore.value)

// 获取优化建议
console.log(getSuggestions())
```

## 🎨 功能问题

### 7. 如何创建颜色调色板?

```typescript
import { Color } from '@ldesign/color-core'

const primary = new Color('#667eea')

// 方法 1: 使用内置方法
const palette = primary.palette({
  shades: 10,
  lightness: { min: 10, max: 90 }
})

// 方法 2: 使用 Tailwind 风格
const tailwind = primary.generateTailwindPalette()
// { 50: '#f5f7ff', 100: '#ebf0ff', ..., 900: '#1a2038' }

// 方法 3: 使用 Material Design
import { generateMaterialColors } from '@ldesign/color-core'
const material = generateMaterialColors('#667eea')
```

### 8. 如何创建主题?

```typescript
// Core 包
import { ThemeManager } from '@ldesign/color-core'

const manager = new ThemeManager()
manager.registerTheme({
  name: 'my-theme',
  colors: {
    primary: '#667eea',
    secondary: '#f093fb'
  }
})

// Vue 包
import { useColorTheme } from '@ldesign/color-vue'

const { themeColors, applyTheme } = useColorTheme({
  primary: '#667eea'
})
```

### 9. 如何实现暗黑模式?

```vue
<template>
  <ThemeModeSwitcher />
</template>

<script setup>
import { useThemeMode } from '@ldesign/color-vue'

const { mode, setMode, toggleMode } = useThemeMode()

// 切换模式
toggleMode()

// 设置特定模式
setMode('dark')
</script>
```

### 10. 支持哪些颜色和谐方案?

```typescript
import { Color } from '@ldesign/color-core'

const color = new Color('#667eea')

// 互补色
const complementary = color.complementary()

// 类似色
const analogous = color.analogous()

// 三角色
const triadic = color.triadic()

// 分裂互补色
const splitComplementary = color.splitComplementary()

// 四角色
const tetradic = color.tetradic()

// 方形
const square = color.square()
```

### 11. 如何计算颜色对比度?

```typescript
import { Color } from '@ldesign/color-core'

const bg = new Color('#ffffff')
const text = new Color('#333333')

// WCAG 对比度
const ratio = bg.contrast(text)  // 12.63

// 检查可访问性
const accessible = ratio >= 4.5  // AA 标准
const highlyAccessible = ratio >= 7  // AAA 标准

// 或使用便捷方法
const isReadable = bg.isReadable(text, 'AA')  // true
```

## 🔧 高级问题

### 12. 如何进行颜色插值?

```typescript
import { Color, interpolate } from '@ldesign/color-core'

const from = new Color('#667eea')
const to = new Color('#f093fb')

// 线性插值
const mid = interpolate(from, to, 0.5, 'rgb')

// Bezier 插值(平滑过渡)
import { bezierInterpolation } from '@ldesign/color-core'
const smooth = bezierInterpolation(
  [from, to],
  0.5,
  'rgb',
  [0.42, 0, 0.58, 1]  // ease-in-out
)

// B-spline 插值(多点平滑)
import { bSplineInterpolation } from '@ldesign/color-core'
const colors = [color1, color2, color3, color4]
const result = bSplineInterpolation(colors, 0.5, 'lab')
```

### 13. 如何计算色差?

```typescript
import { calculateDeltaE, calculateDeltaE2000 } from '@ldesign/color-core'

const color1 = new Color('#667eea')
const color2 = new Color('#7c92ff')

// CIE76 色差 (基础)
const deltaE = calculateDeltaE(color1, color2)

// CIEDE2000 色差 (推荐,更准确)
const deltaE2000 = calculateDeltaE2000(color1, color2)

// 判断颜色是否可区分
const isDistinct = deltaE2000 > 2.3  // JND (Just Noticeable Difference)
```

### 14. 如何进行色域映射?

```typescript
import { gamutMapping } from '@ldesign/color-core'

const color = new Color('lab(120, 50, -80)')  // 超出 sRGB 色域

// 映射到 sRGB 色域
const mapped = gamutMapping(color, 'srgb', {
  method: 'clip-chroma',  // 'clip-chroma' | 'project' | 'adaptive'
  iterations: 100
})
```

### 15. 如何使用设计系统?

```typescript
import { 
  generateMaterialColors,
  generateAntDesignColors,
  generateTailwindColors,
  generateBootstrapColors
} from '@ldesign/color-core'

// Material Design 3
const material = generateMaterialColors('#667eea')

// Ant Design
const antd = generateAntDesignColors('#667eea')

// Tailwind CSS
const tailwind = generateTailwindColors('#667eea')

// Bootstrap 5
const bootstrap = generateBootstrapColors('#667eea')
```

## 🐛 问题排查

### 16. Color 实例为什么不是响应式的?

在 Vue 中,Color 实例是类实例,不是响应式对象。应该使用 Vue 包的 composables:

```typescript
// ❌ 错误
const color = ref(new Color('#667eea'))

// ✅ 正确
import { useColor } from '@ldesign/color-vue'
const { color, lighten, darken } = useColor('#667eea')
```

### 17. 为什么主题切换有闪烁?

在 SSR 应用中,需要内联初始样式:

```typescript
// server.ts
import { createSSRPlugin } from '@ldesign/color-vue'

app.use(createSSRPlugin({
  enabled: true,
  inlineStyles: true  // ✅ 启用内联样式
}))
```

### 18. 为什么性能监控不工作?

确保在开发环境启用:

```typescript
import { useColorPerformance } from '@ldesign/color-vue'

const perf = useColorPerformance({
  enabled: import.meta.env.DEV,  // ✅ 仅开发环境
})
```

生产环境会自动禁用以避免性能开销。

### 19. 如何处理大量颜色数据?

使用批量处理和对象池:

```typescript
import { batchProcessColors, ObjectPool } from '@ldesign/color-core'

// 批量处理
const results = batchProcessColors(
  colors,
  (c) => c.lighten(0.2),
  { concurrency: 4 }  // 并发处理
)

// 使用对象池
const pool = new ObjectPool(() => new Color('#000000'))
const color = pool.acquire()
// 使用颜色...
pool.release(color)  // 回收
```

### 20. TypeScript 类型报错怎么办?

确保安装了类型定义:

```bash
npm install --save-dev @types/node
```

在 `tsconfig.json` 中配置:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vite/client", "node"]
  }
}
```

## 📦 集成问题

### 21. 如何在 Nuxt 3 中使用?

```typescript
// plugins/color.ts
import { createColorPlugin } from '@ldesign/color-vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createColorPlugin({
    defaultColor: '#667eea'
  }))
})
```

### 22. 如何在 Vite 中配置?

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@ldesign/color-core', '@ldesign/color-vue']
  }
})
```

### 23. 如何在 React 中使用?

只能使用 Core 包(框架无关):

```typescript
import { Color } from '@ldesign/color-core'
import { useState } from 'react'

function ColorPicker() {
  const [color, setColor] = useState(new Color('#667eea'))
  
  const lighter = color.lighten(0.2)
  
  return <div style={{ background: lighter.toHex() }} />
}
```

### 24. 如何在 Node.js 中使用?

Core 包可在 Node.js 中使用:

```typescript
import { Color } from '@ldesign/color-core'

const color = new Color('#667eea')
console.log(color.toRGB())
```

## 🤝 贡献问题

### 25. 如何报告 Bug?

在 GitHub 上提 Issue,包含:
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息(Node、Vue 版本等)
- 最小复现代码

### 26. 如何贡献代码?

1. Fork 仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### 27. 如何运行测试?

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行性能测试
npm run benchmark

# 运行覆盖率测试
npm run test:coverage
```

## 📚 更多资源

- [完整文档](./README.md)
- [Vue 使用指南](./packages/vue/VUE_USAGE.md)
- [主题使用指南](./packages/core/THEME_USAGE.md)
- [性能优化指南](./PERFORMANCE_GUIDE.md)
- [API 参考](https://ldesign.github.io/color)

## 💬 获取帮助

如果问题未在此列出:
- 查看 [GitHub Issues](https://github.com/ldesign/color/issues)
- 加入 Discord 社区
- 发送邮件至 support@ldesign.dev