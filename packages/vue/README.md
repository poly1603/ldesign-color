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

```vue
<script setup>
import { ThemePicker, VueThemeModeSwitcher } from '@ldesign/color-vue'
import '@ldesign/color-vue/styles.css'
</script>

<template>
  <div>
    <ThemePicker />
    <VueThemeModeSwitcher />
  </div>
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

