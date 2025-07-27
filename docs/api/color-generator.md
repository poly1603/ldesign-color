# ColorGenerator

`ColorGenerator` 是 @ldesign/color 的核心类，负责整合所有颜色生成功能。

## 构造函数

```typescript
new ColorGenerator(config?: ColorGeneratorConfig)
```

### 参数

- `config` - 可选的配置对象

```typescript
interface ColorGeneratorConfig {
  enableCache?: boolean // 启用缓存，默认 true
  cacheSize?: number // 缓存大小，默认 100
  useWebWorker?: boolean // 使用Web Worker，默认 false
  cssPrefix?: string // CSS变量前缀，默认 'ldesign'
  autoInject?: boolean // 自动注入CSS，默认 true
}
```

### 示例

```typescript
import { ColorGenerator } from '@ldesign/color'

// 使用默认配置
const generator = new ColorGenerator()

// 自定义配置
const generator = new ColorGenerator({
  enableCache: true,
  cacheSize: 200,
  useWebWorker: true,
  cssPrefix: 'my-app',
  autoInject: false
})
```

## 实例方法

### generate()

同步生成完整主题。

```typescript
generate(primaryColor: string): GeneratedTheme
```

#### 参数

- `primaryColor` - 主色调，支持十六进制、RGB、HSL等格式

#### 返回值

返回 `GeneratedTheme` 对象：

```typescript
interface GeneratedTheme {
  semanticColors: SemanticColors
  palettes: ColorPalettes
  cssVariables: string
  timestamp: number
}
```

#### 示例

```typescript
const theme = generator.generate('#1890ff')

console.log(theme.semanticColors)
// {
//   primary: '#1890ff',
//   success: '#52c41a',
//   warning: '#faad14',
//   danger: '#f5222d',
//   gray: '#8c8c8c'
// }

console.log(theme.palettes.light.primary)
// ['#e6f7ff', '#bae7ff', '#91d5ff', ...]

console.log(theme.cssVariables)
// CSS变量字符串
```

### generateAsync()

异步生成完整主题，避免阻塞主线程。

```typescript
generateAsync(primaryColor: string): Promise<GeneratedTheme>
```

#### 参数

- `primaryColor` - 主色调

#### 返回值

返回 Promise，resolve 为 `GeneratedTheme` 对象。

#### 示例

```typescript
const theme = await generator.generateAsync('#1890ff')
console.log('异步生成完成:', theme)

// 或使用 .then()
generator.generateAsync('#1890ff').then((theme) => {
  console.log('主题生成完成:', theme)
})
```

### generateDebounced()

防抖生成主题，避免频繁调用。

```typescript
generateDebounced(primaryColor: string, callback: (theme: GeneratedTheme) => void): void
```

#### 参数

- `primaryColor` - 主色调
- `callback` - 生成完成后的回调函数

#### 示例

```typescript
// 频繁调用时只会执行最后一次
generator.generateDebounced('#1890ff', (theme) => {
  console.log('防抖生成完成:', theme)
})

generator.generateDebounced('#52c41a', (theme) => {
  console.log('这个会被执行:', theme)
})
```

### batchGenerate()

批量生成多个主题。

```typescript
batchGenerate(colors: string[]): Promise<GeneratedTheme[]>
```

#### 参数

- `colors` - 颜色数组

#### 返回值

返回 Promise，resolve 为 `GeneratedTheme` 数组。

#### 示例

```typescript
const colors = ['#1890ff', '#52c41a', '#f5222d']
const themes = await generator.batchGenerate(colors)

themes.forEach((theme, index) => {
  console.log(`主题 ${index + 1}:`, theme.semanticColors)
})
```

### updateConfig()

更新生成器配置。

```typescript
updateConfig(config: Partial<ColorGeneratorConfig>): void
```

#### 参数

- `config` - 部分配置对象

#### 示例

```typescript
// 更新配置
generator.updateConfig({
  cssPrefix: 'custom',
  enableCache: false
})

// 获取当前配置
const currentConfig = generator.getConfig()
console.log(currentConfig)
```

### getConfig()

获取当前配置。

```typescript
getConfig(): Required<ColorGeneratorConfig>
```

#### 返回值

返回完整的配置对象。

### clearCache()

清除缓存。

```typescript
clearCache(): void
```

#### 示例

```typescript
// 清除所有缓存
generator.clearCache()

console.log('缓存已清除')
```

### getPerformanceMetrics()

获取性能指标。

```typescript
getPerformanceMetrics(): PerformanceMetrics
```

#### 返回值

```typescript
interface PerformanceMetrics {
  semanticColorGeneration: number // 语义化颜色生成耗时(ms)
  paletteGeneration: number // 色阶生成耗时(ms)
  cssVariableGeneration: number // CSS变量生成耗时(ms)
  totalTime: number // 总耗时(ms)
  cacheHitRate: number // 缓存命中率(0-1)
}
```

#### 示例

```typescript
// 生成主题
generator.generate('#1890ff')

// 获取性能指标
const metrics = generator.getPerformanceMetrics()
console.log({
  语义化颜色生成: `${metrics.semanticColorGeneration.toFixed(2)}ms`,
  色阶生成: `${metrics.paletteGeneration.toFixed(2)}ms`,
  CSS变量生成: `${metrics.cssVariableGeneration.toFixed(2)}ms`,
  总耗时: `${metrics.totalTime.toFixed(2)}ms`,
  缓存命中率: `${(metrics.cacheHitRate * 100).toFixed(1)}%`
})
```

### resetPerformanceMetrics()

重置性能指标。

```typescript
resetPerformanceMetrics(): void
```

### destroy()

销毁生成器实例，清理资源。

```typescript
destroy(): void
```

#### 示例

```typescript
// 销毁实例
generator.destroy()

// 销毁后无法再使用
// generator.generate('#1890ff') // 会抛出错误
```

## 静态方法

### createColorGenerator()

创建颜色生成器实例的便捷方法。

```typescript
import { createColorGenerator } from '@ldesign/color'

const generator = createColorGenerator({
  enableCache: true,
  useWebWorker: true
})
```

## 错误处理

### 常见错误

```typescript
try {
  const theme = generator.generate('invalid-color')
}
 catch (error) {
  console.error('颜色生成失败:', error.message)
  // 错误: Invalid color: invalid-color
}
```

### 异步错误处理

```typescript
try {
  const theme = await generator.generateAsync('#1890ff')
}
 catch (error) {
  console.error('异步生成失败:', error)
}

// 或使用 .catch()
generator.generateAsync('#1890ff')
  .then((theme) => {
    console.log('生成成功:', theme)
  })
  .catch((error) => {
    console.error('生成失败:', error)
  })
```

## 最佳实践

### 1. 单例模式

在应用中使用单例模式：

```typescript
// colorService.ts
class ColorService {
  private static instance: ColorGenerator

  static getInstance(): ColorGenerator {
    if (!this.instance) {
      this.instance = new ColorGenerator({
        enableCache: true,
        cacheSize: 200,
        useWebWorker: true
      })
    }
    return this.instance
  }
}

export const colorGenerator = ColorService.getInstance()
```

### 2. 配置管理

根据环境使用不同配置：

```typescript
const isDev = process.env.NODE_ENV === 'development'

const generator = new ColorGenerator({
  enableCache: !isDev, // 开发环境禁用缓存
  useWebWorker: !isDev, // 开发环境禁用Worker
  autoInject: true
})
```

### 3. 错误边界

```typescript
class ColorGeneratorWrapper {
  private generator: ColorGenerator

  constructor(config?: ColorGeneratorConfig) {
    this.generator = new ColorGenerator(config)
  }

  async safeGenerate(color: string): Promise<GeneratedTheme | null> {
    try {
      return await this.generator.generateAsync(color)
    }
 catch (error) {
      console.error('颜色生成失败:', error)
      return null
    }
  }
}
```

## 相关链接

- [SemanticColorGenerator](./semantic-color-generator) - 语义化颜色生成器
- [PaletteGenerator](./palette-generator) - 色阶生成器
- [CSSVariableGenerator](./css-variable-generator) - CSS变量生成器
- [useColor](./use-color) - Vue组合式API
