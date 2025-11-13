# 自定义预设主题多语言配置指南

## 概述

当你在 `createColorEnginePlugin` 中添加自定义预设主题时，需要在应用的 i18n 配置中添加对应的翻译，以支持多语言显示。

## 配置步骤

### 1. 在插件中定义自定义预设

在 `main.ts` 或插件配置文件中定义自定义预设：

```typescript
import { createColorEnginePlugin } from '@ldesign/color-vue'

createColorEnginePlugin({
  primaryColor: 'brand-primary',
  
  customPresets: [
    {
      name: 'brand-primary',      // ← 这个 name 用于 i18n 键名
      label: '品牌主色',           // ← 降级显示（无翻译时使用）
      color: '#FF6B6B',
      description: '公司品牌主色调', // ← 降级显示（无翻译时使用）
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

### 2. 在中文语言包中添加翻译

编辑 `src/locales/zh-CN.ts`：

```typescript
export default {
  theme: {
    presets: {
      // ... 内置预设 ...
      
      // 自定义预设主题（添加在这里）
      'brand-primary': '品牌主色',
      'brand-secondary': '品牌辅色',
    },
    descriptions: {
      // ... 内置预设描述 ...
      
      // 自定义预设主题描述（添加在这里）
      'brand-primary': '公司品牌主色调',
      'brand-secondary': '公司品牌辅助色',
    },
  },
}
```

### 3. 在英文语言包中添加翻译

编辑 `src/locales/en-US.ts`：

```typescript
export default {
  theme: {
    presets: {
      // ... Built-in presets ...
      
      // Custom preset themes (add here)
      'brand-primary': 'Brand Primary',
      'brand-secondary': 'Brand Secondary',
    },
    descriptions: {
      // ... Built-in preset descriptions ...
      
      // Custom preset theme descriptions (add here)
      'brand-primary': 'Company brand primary color',
      'brand-secondary': 'Company brand secondary color',
    },
  },
}
```

## 翻译键规则

### 颜色名称翻译键

格式：`theme.presets.{name}`

- `{name}` 是自定义预设的 `name` 字段
- 例如：`theme.presets.brand-primary` → `'品牌主色'`

### 颜色描述翻译键

格式：`theme.descriptions.{name}`

- `{name}` 是自定义预设的 `name` 字段
- 例如：`theme.descriptions.brand-primary` → `'公司品牌主色调'`

## 降级机制

如果没有找到对应的翻译，组件会使用预设定义中的 `label` 和 `description` 字段作为降级显示：

```typescript
// 优先级：
// 1. i18n 翻译（如果存在）
// 2. 预设定义中的 label/description 字段
// 3. 预设的 name 字段（最后降级）

customPresets: [
  {
    name: 'brand-primary',
    label: '品牌主色',           // ← 降级显示
    description: '公司品牌主色调', // ← 降级显示
    color: '#FF6B6B',
  },
]
```

## 完整示例

### main.ts

```typescript
import { createColorEnginePlugin } from '@ldesign/color-vue'

createColorEnginePlugin({
  primaryColor: 'brand-primary',
  
  customPresets: [
    {
      name: 'brand-primary',
      label: '品牌主色',
      color: '#667eea',
      description: '渐变紫色，现代感',
      order: 1,
    },
    {
      name: 'brand-secondary',
      label: '品牌辅色',
      color: '#764ba2',
      description: '深紫色，稳重',
      order: 2,
    },
    {
      name: 'brand-accent',
      label: '品牌强调色',
      color: '#f093fb',
      description: '粉紫色，活泼',
      order: 3,
    },
  ],
})
```

### locales/zh-CN.ts

```typescript
export default {
  theme: {
    presets: {
      'brand-primary': '品牌主色',
      'brand-secondary': '品牌辅色',
      'brand-accent': '品牌强调色',
    },
    descriptions: {
      'brand-primary': '渐变紫色，现代感',
      'brand-secondary': '深紫色，稳重',
      'brand-accent': '粉紫色，活泼',
    },
  },
}
```

### locales/en-US.ts

```typescript
export default {
  theme: {
    presets: {
      'brand-primary': 'Brand Primary',
      'brand-secondary': 'Brand Secondary',
      'brand-accent': 'Brand Accent',
    },
    descriptions: {
      'brand-primary': 'Gradient purple, modern',
      'brand-secondary': 'Deep purple, stable',
      'brand-accent': 'Pink purple, lively',
    },
  },
}
```

## 测试多语言

1. 启动应用：`pnpm dev`
2. 打开主题色选择器
3. 切换语言（中文 ↔ English）
4. 观察自定义预设的名称和描述是否正确切换

## 注意事项

1. **键名一致性**：确保 `customPresets` 中的 `name` 与 i18n 配置中的键名完全一致
2. **支持短横线**：预设名称可以使用短横线，如 `'brand-primary'`
3. **降级显示**：即使没有配置 i18n，也会显示 `label` 和 `description` 字段
4. **实时更新**：切换语言时，主题色选择器会立即更新显示

