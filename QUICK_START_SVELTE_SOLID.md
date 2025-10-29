# Svelte 和 Solid.js 快速开始指南

本指南将帮助你快速在 Svelte 或 Solid.js 项目中集成 `@ldesign/color` 主题管理功能。

## 目录

- [Svelte 快速开始](#svelte-快速开始)
- [Solid.js 快速开始](#solidjs-快速开始)
- [常见问题](#常见问题)

---

## Svelte 快速开始

### 1. 安装

```bash
pnpm add @ldesign/color-svelte @ldesign/color-core
# 或
npm install @ldesign/color-svelte @ldesign/color-core
```

### 2. 基础使用

#### 最简单的例子

```svelte
<script>
  import { useTheme } from '@ldesign/color-svelte'

  const { primaryColor, applyTheme } = useTheme()
</script>

<div>
  <p>当前主题色: {$primaryColor}</p>
  <button on:click={() => applyTheme('#1890ff')}>
    改为蓝色
  </button>
</div>
```

#### 使用组件

```svelte
<script>
  import { ThemePicker, ThemeModeSwitcher } from '@ldesign/color-svelte'

  function handleThemeChange(event) {
    console.log('新主题:', event.detail)
  }
</script>

<div class="header">
  <ThemePicker
    showSearch={true}
    showCustom={true}
    on:change={handleThemeChange}
  />
  <ThemeModeSwitcher defaultMode="system" />
</div>

<style>
  .header {
    background: var(--ld-bg-color-container);
    color: var(--ld-text-color-primary);
  }
</style>
```

### 3. 完整示例

查看 `packages/svelte/example.svelte` 获取完整的可运行示例。

### 4. SvelteKit 集成

在 SvelteKit 中使用时，确保在客户端初始化：

```svelte
<!-- +layout.svelte -->
<script>
  import { browser } from '$app/environment'
  import { useTheme } from '@ldesign/color-svelte'

  let theme
  if (browser) {
    theme = useTheme({
      prefix: 'my-app',
      storageKey: 'my-app-theme'
    })
  }
</script>

{#if browser && theme}
  <slot />
{/if}
```

### 5. Svelte Store 使用技巧

```svelte
<script>
  import { useTheme } from '@ldesign/color-svelte'
  import { derived } from 'svelte/store'

  const { currentTheme, primaryColor } = useTheme()

  // 创建自定义派生 store
  const isDarkMode = derived(currentTheme, $theme => $theme?.isDark || false)

  // 响应式声明
  $: console.log('主题色变化:', $primaryColor)
</script>
```

---

## Solid.js 快速开始

### 1. 安装

```bash
pnpm add @ldesign/color-solid @ldesign/color-core
# 或
npm install @ldesign/color-solid @ldesign/color-core
```

### 2. 基础使用

#### 最简单的例子

```tsx
import { useTheme } from '@ldesign/color-solid'

function App() {
  const { primaryColor, applyTheme } = useTheme()

  return (
    <div>
      <p>当前主题色: {primaryColor()}</p>
      <button onClick={() => applyTheme('#1890ff')}>
        改为蓝色
      </button>
    </div>
  )
}
```

#### 使用组件

```tsx
import { ThemePicker, ThemeModeSwitcher } from '@ldesign/color-solid'

function App() {
  const handleThemeChange = (value: string, preset?: any) => {
    console.log('新主题:', value, preset)
  }

  return (
    <div class="header">
      <ThemePicker
        showSearch={true}
        showCustom={true}
        onChange={handleThemeChange}
      />
      <ThemeModeSwitcher defaultMode="system" />
    </div>
  )
}
```

### 3. 完整示例

查看 `packages/solid/example.tsx` 获取完整的可运行示例。

### 4. Solid Start 集成

在 Solid Start 中使用时，确保在客户端初始化：

```tsx
// root.tsx
import { Show } from 'solid-js'
import { isServer } from 'solid-js/web'
import { useTheme } from '@ldesign/color-solid'

export default function Root() {
  const theme = !isServer ? useTheme({
    prefix: 'my-app',
    storageKey: 'my-app-theme'
  }) : null

  return (
    <Show when={!isServer && theme}>
      <div>
        {/* 你的应用内容 */}
      </div>
    </Show>
  )
}
```

### 5. 使用 Context 共享主题

```tsx
import { createContext, useContext, ParentComponent } from 'solid-js'
import { useTheme } from '@ldesign/color-solid'

const ThemeContext = createContext()

export const ThemeProvider: ParentComponent = (props) => {
  const theme = useTheme({
    prefix: 'my-app',
    storageKey: 'my-app-theme',
  })

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider')
  }
  return context
}

// 在 App 中使用
function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  )
}

function MyComponent() {
  const { primaryColor, applyTheme } = useAppTheme()
  return <button onClick={() => applyTheme('#1890ff')}>Color: {primaryColor()}</button>
}
```

### 6. Solid.js Signals 使用技巧

```tsx
import { createMemo, createEffect } from 'solid-js'
import { useTheme } from '@ldesign/color-solid'

function App() {
  const { currentTheme, primaryColor } = useTheme()

  // 创建自定义 memo
  const isDarkMode = createMemo(() => currentTheme()?.isDark || false)

  // 响应式副作用
  createEffect(() => {
    console.log('主题色变化:', primaryColor())
  })

  return <div>Mode: {isDarkMode() ? 'Dark' : 'Light'}</div>
}
```

---

## 常见问题

### Q1: 如何自定义 CSS 变量前缀？

```javascript
// Svelte
const theme = useTheme({ prefix: 'my-app' })

// Solid.js
const theme = useTheme({ prefix: 'my-app' })
```

然后使用：
```css
.button {
  background: var(--my-app-brand-color);
  color: var(--my-app-text-color-primary);
}
```

### Q2: 如何添加自定义预设主题？

两个框架都使用相同的 core 包，你可以在应用级别添加自定义主题：

```javascript
import { presetThemes } from '@ldesign/color-core/themes/presets'

// 添加自定义预设
const customThemes = [
  ...presetThemes,
  { name: 'custom', label: '自定义紫色', color: '#722ed1' }
]
```

### Q3: 主题如何持久化？

默认情况下，主题会自动保存到 localStorage。你可以自定义存储键：

```javascript
const theme = useTheme({ storageKey: 'my-custom-theme-key' })
```

### Q4: 如何实现主题动画？

在 CSS 中添加过渡效果：

```css
* {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}
```

### Q5: 如何获取所有可用的 CSS 变量？

查看生成的 CSS 变量列表：

```javascript
const { currentTheme } = useTheme()

// 在开发者工具中查看
console.log(currentTheme) // Svelte: $currentTheme
console.log(currentTheme()) // Solid.js
```

常用的 CSS 变量包括：
- `--{prefix}-brand-color` - 主题色
- `--{prefix}-brand-color-hover` - 主题色悬停态
- `--{prefix}-brand-color-light` - 主题色浅色版本
- `--{prefix}-bg-color-page` - 页面背景色
- `--{prefix}-bg-color-container` - 容器背景色
- `--{prefix}-text-color-primary` - 主文本颜色
- `--{prefix}-text-color-secondary` - 次要文本颜色
- `--{prefix}-component-border` - 组件边框色

### Q6: 框架之间的 API 有什么区别？

核心 API 完全一致，只是响应式系统的访问方式不同：

| 操作 | Svelte | Solid.js |
|------|--------|----------|
| 读取值 | `$primaryColor` | `primaryColor()` |
| 更新值 | 自动 | 自动 |
| 方法调用 | `applyTheme(color)` | `applyTheme(color)` |

### Q7: 如何调试主题问题？

1. 检查 localStorage：
```javascript
console.log(localStorage.getItem('ldesign-theme'))
```

2. 检查生成的 CSS 变量：
```javascript
console.log(getComputedStyle(document.documentElement).getPropertyValue('--ld-brand-color'))
```

3. 使用浏览器开发者工具检查应用的 CSS 变量

### Q8: 性能优化建议

#### Svelte
- 只订阅需要的 stores
- 使用 `derived` 创建计算值

#### Solid.js
- 只解构需要的 signals
- 使用 `createMemo` 缓存计算结果
- 避免在 JSX 中直接调用 signal，使用 memo 代替

```tsx
// ❌ 不推荐
<div>{expensiveComputation(signal())}</div>

// ✅ 推荐
const computed = createMemo(() => expensiveComputation(signal()))
<div>{computed()}</div>
```

---

## 下一步

- 查看 [Core 文档](./packages/core/README.md) 了解更多颜色操作功能
- 查看 [Svelte README](./packages/svelte/README.md) 获取完整 API 文档
- 查看 [Solid.js README](./packages/solid/README.md) 获取完整 API 文档
- 探索示例文件获取更多灵感

## 获取帮助

如果遇到问题，请：
1. 查看相关包的 README 文档
2. 查看示例文件
3. 提交 Issue 到 GitHub 仓库

祝你使用愉快！🎨


