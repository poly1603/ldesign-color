# Color Engine Plugin 配置指南

## 概述

`createColorEnginePlugin` 是 `@ldesign/color-vue` 包提供的 LDesign Engine 插件，用于在 Vue 应用中集成颜色主题管理功能。

本指南介绍了插件的所有配置选项，特别是新增的增强功能。

## 新增功能

### 1. primaryColor 参数增强

**支持两种类型**：
- **具体色值**：如 `'#1890ff'`、`'rgb(24, 144, 255)'` 等
- **预设主题色名称**：如 `'blue'`、`'purple'`、`'cyan'` 等

**TypeScript 类型提示**：
使用预设名称时，IDE 会自动提示所有可用的预设主题色名称。

```typescript
import { createColorEnginePlugin } from '@ldesign/color-vue'

// 方式 1: 使用具体色值
createColorEnginePlugin({
  primaryColor: '#1890ff',
})

// 方式 2: 使用预设主题色名称（有 IDE 自动提示）
createColorEnginePlugin({
  primaryColor: 'blue', // IDE 提示: 'blue' | 'purple' | 'cyan' | 'green' | ...
})
```

**可用的预设主题色名称**：
- `'blue'` - 拂晓蓝
- `'purple'` - 酱紫
- `'cyan'` - 明青
- `'green'` - 极光绿
- `'magenta'` - 法式洋红
- `'red'` - 薄暮红
- `'orange'` - 日暮橙
- `'yellow'` - 日出黄
- `'volcano'` - 火山橙
- `'geekblue'` - 极客蓝
- `'lime'` - 青柠绿
- `'gold'` - 金盏花
- `'gray'` - 中性灰
- `'dark-blue'` - 深海蓝
- `'dark-green'` - 森林绿

### 2. customPresets 自定义预设主题

**功能**：允许用户传入自定义预设主题色数组，扩展或覆盖内置预设。

**配置参数**：
```typescript
interface PresetTheme {
  name: string          // 主题色名称（必填）
  label: string         // 显示标签（必填）
  color: string         // 颜色值（必填）
  description?: string  // 描述信息（可选）
  order?: number        // 排序字段（可选，用于控制显示顺序）
  custom?: boolean      // 是否为自定义主题（可选，默认 true）
}
```

**示例**：
```typescript
createColorEnginePlugin({
  primaryColor: 'brand-primary',
  
  customPresets: [
    {
      name: 'brand-primary',
      label: '品牌主色',
      color: '#FF6B6B',
      description: '公司品牌主色调',
      order: 1,
    },
    {
      name: 'brand-secondary',
      label: '品牌辅色',
      color: '#4ECDC4',
      description: '公司品牌辅助色',
      order: 2,
    },
  ],
})
```

### 3. 预设主题排序

**功能**：所有预设主题（内置 + 自定义）会按照 `order` 字段升序排序。

**规则**：
- 有 `order` 字段的排在前面
- 没有 `order` 字段的保持原数组顺序
- `order` 值相同时，保持原数组顺序

**示例**：
```typescript
customPresets: [
  { name: 'color1', order: 10, ... },  // 第二个
  { name: 'color2', order: 1, ... },   // 第一个
  { name: 'color3', ... },             // 第三个（无 order）
]
```

### 4. 预设主题合并策略

**规则**：
- 如果自定义预设的 `name` 与内置预设重复，**自定义预设会覆盖内置预设**
- 最终预设列表 = 内置预设 + 自定义预设（去重并排序）

**覆盖内置预设示例**：
```typescript
createColorEnginePlugin({
  primaryColor: 'blue',
  
  // 覆盖内置的 'blue' 预设
  customPresets: [
    {
      name: 'blue', // 与内置预设同名
      label: '自定义蓝色',
      color: '#0066FF', // 不同的颜色值
      description: '覆盖了内置的拂晓蓝',
      order: 1,
    },
  ],
})
```

## 完整配置示例

```typescript
import { createColorEnginePlugin } from '@ldesign/color-vue'

const colorPlugin = createColorEnginePlugin({
  // ========== 主题色配置 ==========
  primaryColor: 'brand-primary', // 支持预设名称或色值
  mode: 'light',                 // 主题模式
  themeName: 'my-theme',         // 主题名称
  
  // ========== 自定义预设 ==========
  customPresets: [
    {
      name: 'brand-primary',
      label: '品牌主色',
      color: '#667eea',
      description: '渐变紫色',
      order: 1,
    },
  ],
  
  // ========== 持久化配置 ==========
  persistence: {
    enabled: true,
    key: 'my-app-theme',
    storage: 'localStorage',
  },
  
  // ========== 主题管理器配置 ==========
  prefix: 'my-app',
  autoApply: true,
  includeSemantics: true,
  includeGrays: true,
  
  // ========== Vue 插件配置 ==========
  globalProperties: true,
  globalComponents: true,
})
```

## 在主题色选择器中的体现

配置的自定义预设会自动显示在 `ThemeColorPicker` 组件中：

1. **合并显示**：内置预设 + 自定义预设
2. **排序显示**：按 `order` 字段升序排列
3. **国际化支持**：颜色名称和描述支持多语言
4. **覆盖提示**：如果覆盖了内置预设，会显示自定义的颜色和描述

## 类型安全

所有配置选项都有完整的 TypeScript 类型定义，IDE 会提供：
- 参数自动补全
- 类型检查
- 错误提示
- 文档注释

## 注意事项

1. **预设名称唯一性**：自定义预设的 `name` 如果与内置预设重复，会覆盖内置预设
2. **order 字段**：建议为自定义预设设置 `order` 字段，以控制显示顺序
3. **颜色值格式**：支持 HEX、RGB、HSL 等所有标准 CSS 颜色格式
4. **国际化**：如需多语言支持，需在应用的 i18n 配置中添加对应的翻译键

