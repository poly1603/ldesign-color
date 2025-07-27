# 更新日志

## v2.1.0 (2024-01-25)

🎉 **重大更新和修复**

### 🔧 修复

#### 随机颜色生成报错修复
- ✅ 修复随机颜色生成时返回HSL格式导致的报错问题
- ✅ 现在 `generateRandomColor()` 返回正确的十六进制格式
- ✅ 添加了更可靠的备选方案，确保在任何情况下都能生成有效颜色

```typescript
// 修复前：返回 'hsl(216, 52%, 57%)' 导致报错
// 修复后：返回 '#3B82F6' 正确的十六进制格式
const randomColor = generateRandomColor()
console.log(randomColor) // '#3B82F6'
```

#### 灰色色阶偏红问题修复
- ✅ 修复取消混入主色调后，灰色色阶仍然偏红的问题
- ✅ 新增 `grayMixPrimary` 参数控制是否混入主色调
- ✅ 支持生成纯中性灰色（饱和度为0）

```typescript
// 纯中性灰色
const theme1 = generateTheme('#1890ff', { grayMixPrimary: false })
console.log(theme1.palettes.light.gray[0]) // '#F2F2F2' 纯中性灰

// 混入主色调的灰色
const theme2 = generateTheme('#1890ff', { grayMixPrimary: true })
console.log(theme2.palettes.light.gray[0]) // '#F2F2F3' 带蓝色色相
```

#### 灰色深度优化
- ✅ 明亮模式最深灰色从30%调整到25%亮度，提供更好的对比度
- ✅ 暗黑模式最深灰色从15%调整到10%亮度，更深更实用
- ✅ 14个灰色色阶提供更丰富的层次

```typescript
const theme = generateTheme('#1890ff', { grayMixPrimary: false })

// 明亮模式灰色色阶
console.log(theme.palettes.light.gray[13]) // '#404040' (25% lightness)

// 暗黑模式灰色色阶
console.log(theme.palettes.dark.gray[13]) // '#1A1A1A' (10% lightness)
```

### 🚀 新功能

#### CSS变量定制
- 🎨 支持自定义CSS变量前缀
- 🏷️ 支持自定义语义化颜色名称
- 💉 自动生成并注入CSS变量到页面

```typescript
const theme = generateTheme('#1890ff', {
  cssPrefix: 'my-app', // 自定义前缀
  semanticNames: { // 自定义名称
    primary: 'brand',
    success: 'positive',
    warning: 'caution',
    danger: 'negative',
    gray: 'neutral'
  }
})

// 生成的CSS变量：
// --my-app-brand-1: #E6F3FA;
// --my-app-positive-1: #E8F5E8;
// --my-app-caution-1: #FFF7E6;
```

#### 预设主题管理器
- 🎭 内置12个精美预设主题
- 📱 支持响应式数据管理
- 🔧 提供完整的CRUD操作（增删改查）
- ⚡ 支持启用/禁用主题

```typescript
import { createPresetThemeManager } from '@ldesign/color'

const presetManager = createPresetThemeManager()

// 添加自定义主题
presetManager.addTheme({
  name: '企业蓝',
  color: '#0066cc',
  description: '企业级蓝色主题'
})

// 获取启用的主题（响应式）
const enabledThemes = presetManager.getEnabledThemes()

// 启用/禁用主题
presetManager.toggleTheme('企业蓝', false)

// 获取统计信息
const stats = presetManager.getStats()
console.log(stats.value) // { total: 13, enabled: 12, disabled: 1, custom: 1 }
```

#### 样式注入功能
- 💉 支持手动注入CSS变量到页面head中
- 🔄 自动移除旧样式，避免重复
- 🎯 支持自定义样式ID

```typescript
const theme = generateTheme('#1890ff')

// 方法1: 通过主题对象注入
theme.cssGenerator.injectToHead(theme.cssVariables)

// 方法2: 自定义样式ID
theme.cssGenerator.injectToHead(theme.cssVariables, 'my-custom-styles')
```

### 📈 改进

- 🔧 更可靠的随机颜色生成算法
- 🎨 更深的灰色色阶，提供更好的对比度
- 📱 示例应用新增配置选项和预设主题管理
- 💪 完善的TypeScript类型定义
- 📚 更详细的文档和使用示例

### 🐛 Bug修复

- 修复Color库使用方式导致的HSL格式问题
- 修复灰色色阶生成时的色相偏移问题
- 修复CSS变量生成器的访问权限问题
- 优化错误处理和备选方案

## v2.0.0

### 🚀 主要功能
- 智能颜色生成
- 明暗模式支持
- 12/14色阶生成
- Vue 3 组合式API
- TypeScript支持
- 高性能优化

---

## 迁移指南

### 从 v2.0.x 升级到 v2.1.0

#### 新增配置选项

```typescript
// v2.0.x
const theme = generateTheme('#1890ff')

// v2.1.0 - 新增配置选项
const theme = generateTheme('#1890ff', {
  grayMixPrimary: false, // 新增：控制灰色混入
  cssPrefix: 'my-app', // 新增：自定义前缀
  semanticNames: { // 新增：自定义名称
    primary: 'brand'
  }
})
```

#### 预设主题管理

```typescript
// v2.1.0 新增功能
import { createPresetThemeManager } from '@ldesign/color'

const presetManager = createPresetThemeManager()
// 使用预设主题管理器...
```

#### 样式注入

```typescript
// v2.1.0 新增功能
theme.cssGenerator.injectToHead(theme.cssVariables)
```

所有现有API保持向后兼容，可以安全升级。
