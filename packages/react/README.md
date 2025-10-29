# @ldesign/color-react

React components and hooks for color theme management, built on top of @ldesign/color-core.

## Features

- 🎨 **Theme Management** - Easy theme switching with React hooks
- 🌓 **Dark Mode Support** - Built-in light/dark mode toggle
- 🎯 **Hooks API** - Modern React hooks for theme management
- 🧩 **Components** - Ready-to-use theme picker and mode switcher components
- 🔌 **Context Provider** - Global theme state management
- 💪 **TypeScript** - Full type safety

## Installation

```bash
# pnpm
pnpm add @ldesign/color-react @ldesign/color-core

# npm
npm install @ldesign/color-react @ldesign/color-core

# yarn
yarn add @ldesign/color-react @ldesign/color-core
```

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from '@ldesign/color-react'
import App from './App'

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}
```

### 2. Use the useTheme hook

```tsx
import { useTheme } from '@ldesign/color-react'

function MyComponent() {
  const { currentTheme, setTheme, mode, setMode, availableThemes } = useTheme()

  return (
    <div>
      <p>Current Theme: {currentTheme}</p>
      <p>Mode: {mode}</p>
      <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        Toggle Mode
      </button>
    </div>
  )
}
```

### 3. Use Components

```tsx
import { ThemePicker, ReactThemeModeSwitcher } from '@ldesign/color-react'
import '@ldesign/color-react/styles.css'

function Header() {
  return (
    <div>
      <ThemePicker />
      <ReactThemeModeSwitcher />
    </div>
  )
}
```

## API

### `useTheme()`

```typescript
const {
  currentTheme,      // string - Current theme name
  setTheme,          // (theme: string) => void - Set theme
  mode,              // 'light' | 'dark' - Current mode
  setMode,           // (mode: 'light' | 'dark') => void - Set mode
  availableThemes    // string[] - Available theme names
} = useTheme()
```

## Documentation

For detailed documentation, visit [ldesign documentation](https://ldesign.dev/color).

## License

MIT © ldesign

