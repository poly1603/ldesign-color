# @ldesign/color-vue

Vue 3 components and composables for color theme management, built on top of @ldesign/color-core.

## Features

- 🎨 **Theme Management** - Easy theme switching with reactive state
- 🌓 **Dark Mode Support** - Built-in light/dark mode toggle
- 🎯 **Composable API** - Vue 3 Composition API support
- 🧩 **Components** - Ready-to-use theme picker and mode switcher components
- 🔌 **Plugin System** - Global installation via Vue plugin
- 💪 **TypeScript** - Full type safety

## Installation

```bash
# pnpm
pnpm add @ldesign/color-vue @ldesign/color-core

# npm
npm install @ldesign/color-vue @ldesign/color-core

# yarn
yarn add @ldesign/color-vue @ldesign/color-core
```

## Quick Start

### 1. Install Plugin

```typescript
import { createApp } from 'vue'
import ColorPlugin from '@ldesign/color-vue'
import App from './App.vue'

const app = createApp(App)
app.use(ColorPlugin)
app.mount('#app')
```

### 2. Use Composables

```vue
<script setup>
import { useTheme } from '@ldesign/color-vue'

const { currentTheme, setTheme, mode, setMode, availableThemes } = useTheme()
</script>

<template>
  <div>
    <p>Current Theme: {{ currentTheme }}</p>
    <p>Mode: {{ mode }}</p>
    <button @click="setMode(mode === 'light' ? 'dark' : 'light')">
      Toggle Mode
    </button>
  </div>
</template>
```

### 3. Use Components

#### 主题颜色选择器 ThemeColorPicker

提供多种形式的主题色选择器：

```vue
<script setup>
import { 
  ThemeColorPicker,           // 下拉面板选择器（默认）
  ThemeColorPickerInline,     // 内联网格选择器
  ThemeColorPickerPopover,    // 悬浮卡片选择器
  ThemeColorPickerSimple,     // 简约色块选择器
} from '@ldesign/color-vue'
</script>

<template>
  <!-- 默认下拉面板 -->
  <ThemeColorPicker v-model="color" :show-custom-input="true" />
  
  <!-- 内联网格（适合设置页面） -->
  <ThemeColorPickerInline v-model="color" title="主题色" :columns="5" />
  
  <!-- 简约色块（适合工具栏） -->
  <ThemeColorPickerSimple v-model="color" size="small" />
  
  <!-- 悬浮选择（hover 触发） -->
  <ThemeColorPickerPopover v-model="color" trigger="hover" />
</template>
```

#### 主题模式切换器 ThemeModeSwitcher

提供多种形式的模式切换器：

```vue
<script setup>
import { 
  ThemeModeSwitcher,          // 下拉选择器（默认）
  ThemeModeSwitcherToggle,    // 单按钮循环切换
  ThemeModeSwitcherSegmented, // 分段选择器
  ThemeModeSwitcherRadio,     // 单选按钮组
} from '@ldesign/color-vue'
</script>

<template>
  <!-- 默认下拉选择 -->
  <ThemeModeSwitcher v-model="mode" :show-label="true" />
  
  <!-- 单按钮循环切换（适合工具栏） -->
  <ThemeModeSwitcherToggle v-model="mode" size="small" />
  
  <!-- 分段选择器 -->
  <ThemeModeSwitcherSegmented v-model="mode" />
  
  <!-- 单选按钮组（适合设置页面） -->
  <ThemeModeSwitcherRadio v-model="mode" />
</template>
```

## API

### `useTheme()`

```typescript
const {
  currentTheme,      // Ref<string> - Current theme name
  setTheme,          // (theme: string) => void - Set theme
  mode,              // Ref<'light' | 'dark'> - Current mode
  setMode,           // (mode: 'light' | 'dark') => void - Set mode
  availableThemes    // Ref<string[]> - Available theme names
} = useTheme()
```

## Documentation

For detailed documentation, visit [ldesign documentation](https://ldesign.dev/color).

## License

MIT © ldesign

