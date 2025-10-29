# 多框架 API 对比指南

本文档展示了 `@ldesign/color` 在四个主流前端框架中的使用对比，帮助开发者理解统一的 API 设计。

## 目录

- [安装](#安装)
- [基础使用](#基础使用)
- [组件使用](#组件使用)
- [响应式系统对比](#响应式系统对比)
- [高级用法](#高级用法)
- [性能对比](#性能对比)

---

## 安装

### React

```bash
pnpm add @ldesign/color-react @ldesign/color-core
```

### Vue

```bash
pnpm add @ldesign/color-vue @ldesign/color-core
```

### Svelte

```bash
pnpm add @ldesign/color-svelte @ldesign/color-core
```

### Solid.js

```bash
pnpm add @ldesign/color-solid @ldesign/color-core
```

---

## 基础使用

### 初始化主题管理

<table>
<tr>
<th>React</th>
<th>Vue</th>
</tr>
<tr>
<td>

```tsx
import { useTheme } from '@ldesign/color-react'

function App() {
  const {
    currentTheme,
    primaryColor,
    themeName,
    isDark,
    applyTheme
  } = useTheme()

  return (
    <div>
      <p>Color: {primaryColor}</p>
      <button onClick={() => applyTheme('#1890ff')}>
        Apply
      </button>
    </div>
  )
}
```

</td>
<td>

```vue
<script setup>
import { useTheme } from '@ldesign/color-vue'

const {
  currentTheme,
  primaryColor,
  themeName,
  isDark,
  applyTheme
} = useTheme()
</script>

<template>
  <div>
    <p>Color: {{ primaryColor }}</p>
    <button @click="applyTheme('#1890ff')">
      Apply
    </button>
  </div>
</template>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Svelte</th>
<th>Solid.js</th>
</tr>
<tr>
<td>

```svelte
<script>
import { useTheme } from '@ldesign/color-svelte'

const {
  currentTheme,
  primaryColor,
  themeName,
  isDark,
  applyTheme
} = useTheme()
</script>

<div>
  <p>Color: {$primaryColor}</p>
  <button on:click={() => applyTheme('#1890ff')}>
    Apply
  </button>
</div>
```

</td>
<td>

```tsx
import { useTheme } from '@ldesign/color-solid'

function App() {
  const {
    currentTheme,
    primaryColor,
    themeName,
    isDark,
    applyTheme
  } = useTheme()

  return (
    <div>
      <p>Color: {primaryColor()}</p>
      <button onClick={() => applyTheme('#1890ff')}>
        Apply
      </button>
    </div>
  )
}
```

</td>
</tr>
</table>

---

## 组件使用

### ThemePicker 组件

<table>
<tr>
<th>React</th>
<th>Vue</th>
</tr>
<tr>
<td>

```tsx
import { ThemePicker } from '@ldesign/color-react'

function App() {
  return (
    <ThemePicker
      showSearch={true}
      showCustom={true}
      onChange={(value, preset) => {
        console.log('Changed:', value)
      }}
    />
  )
}
```

</td>
<td>

```vue
<script setup>
import { ThemePicker } from '@ldesign/color-vue'

function handleChange({ value, preset }) {
  console.log('Changed:', value)
}
</script>

<template>
  <ThemePicker
    :show-search="true"
    :show-custom="true"
    @change="handleChange"
  />
</template>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Svelte</th>
<th>Solid.js</th>
</tr>
<tr>
<td>

```svelte
<script>
import { ThemePicker } from '@ldesign/color-svelte'

function handleChange(event) {
  console.log('Changed:', event.detail)
}
</script>

<ThemePicker
  showSearch={true}
  showCustom={true}
  on:change={handleChange}
/>
```

</td>
<td>

```tsx
import { ThemePicker } from '@ldesign/color-solid'

function App() {
  return (
    <ThemePicker
      showSearch={true}
      showCustom={true}
      onChange={(value, preset) => {
        console.log('Changed:', value)
      }}
    />
  )
}
```

</td>
</tr>
</table>

### ThemeModeSwitcher 组件

<table>
<tr>
<th>React</th>
<th>Vue</th>
</tr>
<tr>
<td>

```tsx
import { ThemeModeSwitcher } from '@ldesign/color-react'

function App() {
  return (
    <ThemeModeSwitcher
      defaultMode="system"
      onModeChange={(mode) => {
        console.log('Mode:', mode)
      }}
    />
  )
}
```

</td>
<td>

```vue
<script setup>
import { ThemeModeSwitcher } from '@ldesign/color-vue'

function handleModeChange(mode) {
  console.log('Mode:', mode)
}
</script>

<template>
  <ThemeModeSwitcher
    default-mode="system"
    @change="handleModeChange"
  />
</template>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Svelte</th>
<th>Solid.js</th>
</tr>
<tr>
<td>

```svelte
<script>
import { ThemeModeSwitcher } from '@ldesign/color-svelte'

function handleModeChange(event) {
  console.log('Mode:', event.detail)
}
</script>

<ThemeModeSwitcher
  defaultMode="system"
  on:change={handleModeChange}
/>
```

</td>
<td>

```tsx
import { ThemeModeSwitcher } from '@ldesign/color-solid'

function App() {
  return (
    <ThemeModeSwitcher
      defaultMode="system"
      onModeChange={(mode) => {
        console.log('Mode:', mode)
      }}
    />
  )
}
```

</td>
</tr>
</table>

---

## 响应式系统对比

### 访问响应式值

| 框架 | 声明 | 读取 | 特点 |
|------|------|------|------|
| **React** | `const { primaryColor } = useTheme()` | `primaryColor` | 直接访问，自动触发重渲染 |
| **Vue** | `const { primaryColor } = useTheme()` | `primaryColor.value` | 通过 `.value` 访问 ref |
| **Svelte** | `const { primaryColor } = useTheme()` | `$primaryColor` | 通过 `$` 前缀自动订阅 store |
| **Solid.js** | `const { primaryColor } = useTheme()` | `primaryColor()` | 调用函数获取值 |

### 创建派生值

<table>
<tr>
<th>React</th>
<th>Vue</th>
</tr>
<tr>
<td>

```tsx
import { useMemo } from 'react'

const isDarkMode = useMemo(() => {
  return currentTheme?.isDark || false
}, [currentTheme])
```

</td>
<td>

```vue
<script setup>
import { computed } from 'vue'

const isDarkMode = computed(() => {
  return currentTheme.value?.isDark || false
})
</script>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Svelte</th>
<th>Solid.js</th>
</tr>
<tr>
<td>

```svelte
<script>
import { derived } from 'svelte/store'

const isDarkMode = derived(
  currentTheme,
  $theme => $theme?.isDark || false
)
</script>
```

</td>
<td>

```tsx
import { createMemo } from 'solid-js'

const isDarkMode = createMemo(() => {
  return currentTheme()?.isDark || false
})
```

</td>
</tr>
</table>

### 响应式副作用

<table>
<tr>
<th>React</th>
<th>Vue</th>
</tr>
<tr>
<td>

```tsx
import { useEffect } from 'react'

useEffect(() => {
  console.log('Color changed:', primaryColor)
}, [primaryColor])
```

</td>
<td>

```vue
<script setup>
import { watch } from 'vue'

watch(primaryColor, (newColor) => {
  console.log('Color changed:', newColor)
})
</script>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Svelte</th>
<th>Solid.js</th>
</tr>
<tr>
<td>

```svelte
<script>
$: console.log('Color changed:', $primaryColor)

// 或使用 onMount
import { onMount } from 'svelte'

onMount(() => {
  const unsubscribe = primaryColor.subscribe(
    color => console.log('Color:', color)
  )
  return unsubscribe
})
</script>
```

</td>
<td>

```tsx
import { createEffect } from 'solid-js'

createEffect(() => {
  console.log('Color changed:', primaryColor())
})
```

</td>
</tr>
</table>

---

## 高级用法

### 全局状态共享

<table>
<tr>
<th>React</th>
<th>Vue</th>
</tr>
<tr>
<td>

```tsx
import { ThemeProvider, useThemeContext } 
  from '@ldesign/color-react'

// App.tsx
function App() {
  return (
    <ThemeProvider options={{ prefix: 'app' }}>
      <MyComponent />
    </ThemeProvider>
  )
}

// MyComponent.tsx
function MyComponent() {
  const { primaryColor } = useThemeContext()
  return <div>{primaryColor}</div>
}
```

</td>
<td>

```vue
<!-- App.vue -->
<script setup>
import { createThemeProvider } from '@ldesign/color-vue'
const colorPlugin = createThemeProvider({ 
  prefix: 'app' 
})
</script>

<!-- main.ts -->
import ColorPlugin from '@ldesign/color-vue'
app.use(ColorPlugin, { prefix: 'app' })

<!-- MyComponent.vue -->
<script setup>
import { useTheme } from '@ldesign/color-vue'
const { primaryColor } = useTheme()
</script>
```

</td>
</tr>
</table>

<table>
<tr>
<th>Svelte</th>
<th>Solid.js</th>
</tr>
<tr>
<td>

```svelte
<!-- App.svelte -->
<script context="module">
import { useTheme } from '@ldesign/color-svelte'
export const theme = useTheme({ prefix: 'app' })
</script>

<!-- MyComponent.svelte -->
<script>
import { theme } from './App.svelte'
const { primaryColor } = theme
</script>

<div>{$primaryColor}</div>
```

</td>
<td>

```tsx
import { createContext, useContext } from 'solid-js'
import { useTheme } from '@ldesign/color-solid'

const ThemeContext = createContext()

// App.tsx
function App() {
  const theme = useTheme({ prefix: 'app' })
  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

// MyComponent.tsx
function MyComponent() {
  const { primaryColor } = useContext(ThemeContext)
  return <div>{primaryColor()}</div>
}
```

</td>
</tr>
</table>

---

## 性能对比

### 包大小（Minified + Gzipped）

| 包名 | 大小 | 说明 |
|------|------|------|
| @ldesign/color-core | ~25KB | 核心功能 |
| @ldesign/color-react | ~18KB | React 适配 |
| @ldesign/color-vue | ~16KB | Vue 适配 |
| @ldesign/color-svelte | ~15KB | Svelte 适配 |
| @ldesign/color-solid | ~12KB | Solid.js 适配（最小） |

### 运行时性能特点

| 框架 | 响应式粒度 | 重渲染范围 | 性能特点 |
|------|-----------|-----------|---------|
| **React** | 组件级 | 整个组件 | 依赖 Virtual DOM，需要优化 |
| **Vue** | 属性级 | 精确到使用处 | Proxy 响应式，性能优秀 |
| **Svelte** | 变量级 | 编译时优化 | 编译时生成最优代码 |
| **Solid.js** | Signal 级 | 细粒度更新 | 最细粒度，性能最佳 |

### 最佳实践

#### React
- 使用 `useMemo` 和 `useCallback` 优化
- 合理拆分组件避免过度渲染
- 考虑使用 `React.memo`

#### Vue
- 响应式系统自动优化
- 避免在计算属性中进行复杂操作
- 合理使用 `v-once` 和 `v-memo`

#### Svelte
- 编译器自动优化
- 避免过度使用响应式声明
- 合理使用 `{#key}` 块

#### Solid.js
- 最细粒度的响应式
- 避免在 JSX 中直接调用计算
- 使用 `createMemo` 缓存结果

---

## API 一致性总结

### ✅ 完全一致的部分

所有框架都提供相同的：

1. **API 方法**
   - `applyTheme(color, options?)`
   - `applyPresetTheme(name, options?)`
   - `restoreTheme()`
   - `clearTheme()`
   - `getCurrentTheme()`

2. **状态属性**
   - `currentTheme`
   - `primaryColor`
   - `themeName`
   - `isDark`
   - `isLoading`
   - `presets`

3. **组件 Props**
   - ThemePicker: `value`, `showArrow`, `showSearch`, `showCustom`, `prefix`, `storageKey`
   - ThemeModeSwitcher: `defaultMode`, `storageKey`

4. **CSS 变量**
   - 所有框架生成相同的 CSS 变量
   - 使用相同的命名约定

### 🎯 框架特定的差异

只在以下方面有差异：

1. **响应式访问方式**
   - React: 直接访问
   - Vue: `.value`
   - Svelte: `$`前缀
   - Solid.js: 函数调用

2. **事件处理语法**
   - React: `onChange`
   - Vue: `@change`
   - Svelte: `on:change`
   - Solid.js: `onChange`

3. **全局状态管理**
   - 每个框架使用其推荐的状态管理方式

---

## 选择建议

### 何时选择 React
- 大型企业应用
- 需要丰富的生态系统
- 团队熟悉 React

### 何时选择 Vue
- 渐进式应用开发
- 需要平衡的性能和 DX
- 偏好模板语法

### 何时选择 Svelte
- 注重包大小
- 喜欢编译时优化
- 简单直观的语法

### 何时选择 Solid.js
- 极致性能要求
- 细粒度响应式控制
- 喜欢 JSX 但不想要 Virtual DOM

---

## 结论

`@ldesign/color` 提供了真正的**多框架统一 API**：

✅ 学习一次，到处使用  
✅ 相同的功能和体验  
✅ 框架间迁移成本极低  
✅ 保持各框架的最佳实践  

无论你选择哪个框架，都能享受一致的主题管理体验！🎨


