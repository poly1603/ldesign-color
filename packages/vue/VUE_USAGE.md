# @ldesign/color-vue 使用指南

## 概述

`@ldesign/color-vue` 是 `@ldesign/color-core` 的 Vue 3 适配层，提供：

- ✅ **Vue Plugin** - 全局插件，一键安装
- ✅ **Composables** - 响应式 Hook (`useColorTheme`)
- ✅ **Components** - 开箱即用的 Vue 组件

## 安装

```bash
pnpm add @ldesign/color-vue @ldesign/color-core
```

## 方式 1: 使用 Vue Plugin

### 1. 安装插件

```typescript
// main.ts
import { createApp } from 'vue'
import { createColorPlugin } from '@ldesign/color-vue'
import App from './App.vue'

const app = createApp(App)

// 安装色彩主题插件
app.use(createColorPlugin({
  primaryColor: '#1890ff',   // 主色调
  initialMode: 'auto',       // 主题模式：'light' | 'dark' | 'auto'
  prefix: 'color',           // CSS 变量前缀
  includeAliases: true,      // 包含语义别名
  persist: true              // 持久化到 localStorage
}))

app.mount('#app')
```

### 2. 在组件中使用

插件安装后，CSS 变量会自动注入到页面，可以直接在样式中使用：

```vue
<template>
  <div class="container">
    <button class="btn-primary">主按钮</button>
    <button class="btn-success">成功按钮</button>
  </div>
</template>

<style scoped>
.container {
  background: var(--color-gray-50);
  padding: 20px;
}

.btn-primary {
  background: var(--color-primary-default);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-success {
  background: var(--color-success-default);
  color: white;
}
</style>
```

## 方式 2: 使用 Composable

### 基础使用

```vue
<script setup>
import { useColorTheme } from '@ldesign/color-vue'

const {
  primaryColor,      // 当前主色调（响应式）
  mode,              // 主题模式（响应式）
  effectiveMode,     // 实际生效的模式（响应式）
  themeColors,       // 生成的主题色彩对象
  cssVariables,      // 生成的 CSS 变量字符串
  setPrimaryColor,   // 设置主色调
  setMode,           // 设置主题模式
  toggleMode,        // 切换主题模式
  regenerate         // 重新生成主题
} = useColorTheme({
  primaryColor: '#1890ff',
  initialMode: 'auto',
  autoInject: true,   // 自动注入 CSS 变量
  persist: true       // 持久化
})
</script>

<template>
  <div>
    <!-- 颜色选择器 -->
    <input 
      v-model="primaryColor" 
      type="color" 
      @change="setPrimaryColor(primaryColor)"
    />
    
    <!-- 主题切换按钮 -->
    <button @click="toggleMode">
      {{ mode === 'dark' ? '🌙 暗色' : '☀️ 亮色' }}
    </button>
    
    <!-- 当前模式 -->
    <p>当前模式: {{ effectiveMode }}</p>
    
    <!-- 手动设置模式 -->
    <button @click="setMode('light')">亮色</button>
    <button @click="setMode('dark')">暗色</button>
    <button @click="setMode('auto')">自动</button>
  </div>
</template>
```

### 高级用法

```vue
<script setup>
import { useColorTheme } from '@ldesign/color-vue'
import { watch } from 'vue'

const theme = useColorTheme({
  primaryColor: '#7c3aed',
  initialMode: 'light',
  autoInject: true,
  persist: true,
  storageKey: 'my-app-theme',  // 自定义存储键
  prefix: 'app',               // CSS 变量前缀
  includeAliases: true,
  preserveInput: true,
  semanticHues: {
    success: 150,
    warning: 45,
    danger: 0
  }
})

// 监听主题变化
watch(() => theme.effectiveMode.value, (newMode) => {
  console.log('主题已切换到:', newMode)
})

// 监听颜色变化
watch(() => theme.primaryColor.value, (newColor) => {
  console.log('主色调已更改为:', newColor)
})

// 访问完整的主题色彩对象
function logColors() {
  const colors = theme.themeColors.value
  if (colors) {
    console.log('Primary 500:', colors.light.primary[500])
    console.log('Success 600:', colors.light.success[600])
  }
}
</script>
```

## 组件（规划中）

未来将提供以下开箱即用的组件：

### ThemeColorPicker（颜色选择器）

```vue
<template>
  <ThemeColorPicker 
    v-model="primaryColor"
    :presets="['#1890ff', '#7c3aed', '#10b981']"
  />
</template>
```

### ThemeModeSwitcher（主题切换器）

```vue
<template>
  <ThemeModeSwitcher 
    v-model="mode"
    show-auto
  />
</template>
```

## CSS 变量参考

### 基础色阶

```css
/* Primary */
--color-primary-50    /* 最浅 */
--color-primary-100
--color-primary-200
--color-primary-300
--color-primary-400
--color-primary-500   /* 标准色 */
--color-primary-600
--color-primary-700
--color-primary-800
--color-primary-900   /* 最深 */

/* Success, Warning, Danger, Gray 同样的命名规则 */
```

### 语义别名

```css
/* 主色状态 */
--color-primary-lighter    /* 浅色 */
--color-primary-light
--color-primary-default    /* 默认 */
--color-primary-hover      /* 悬停 */
--color-primary-active     /* 激活 */
--color-primary-disabled   /* 禁用 */

/* Success, Warning, Danger 同样的命名规则 */
```

## 主题模式

### Auto 模式

`auto` 模式会根据系统偏好自动选择主题：

```typescript
const theme = useColorTheme({
  initialMode: 'auto'
})

// effectiveMode 会根据系统设置自动变化
console.log(theme.effectiveMode.value) // 'light' 或 'dark'
```

### 持久化

启用持久化后，用户的主题偏好会保存到 `localStorage`：

```typescript
const theme = useColorTheme({
  persist: true,
  storageKey: 'my-theme'  // 默认: 'ldesign-color-theme'
})
```

存储内容：
- `{storageKey}-primary`: 主色调
- `{storageKey}-mode`: 主题模式

## 最佳实践

1. **全局使用 Plugin**：在 `main.ts` 中安装插件，整个应用统一管理
2. **局部使用 Composable**：在特定组件需要动态控制时使用
3. **优先使用别名**：使用 `--color-primary-default` 而非 `--color-primary-500`
4. **测试两种模式**：确保在亮色和暗色模式下都有良好的视觉效果
5. **渐进式迁移**：可以先在新组件中使用，逐步替换老代码

## TypeScript 支持

完整的类型定义：

```typescript
import type {
  ThemeMode,
  UseColorThemeOptions,
  UseColorThemeReturn,
  ColorPluginOptions
} from '@ldesign/color-vue'
```
