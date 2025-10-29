# @ldesign/color-solid

Solid.js components and primitives for @ldesign/color-core - A powerful color theme management solution for Solid.js applications.

## Features

- 🎨 **Theme Management** - Easy-to-use Solid.js primitives for color theme management
- 🎭 **Dark Mode Support** - Built-in light/dark mode switching
- 🧩 **Ready-to-use Components** - Pre-built ThemePicker and ThemeModeSwitcher components
- 💾 **Persistence** - Automatic theme persistence to localStorage
- 🎯 **Type-safe** - Full TypeScript support
- 🚀 **Lightweight** - Minimal bundle size with tree-shaking support
- ⚡ **Fine-grained Reactivity** - Leverages Solid.js signals for optimal performance

## Installation

```bash
# pnpm
pnpm add @ldesign/color-solid @ldesign/color-core

# npm
npm install @ldesign/color-solid @ldesign/color-core

# yarn
yarn add @ldesign/color-solid @ldesign/color-core
```

## Quick Start

### Basic Theme Management

```tsx
import { useTheme } from '@ldesign/color-solid'

function App() {
  const {
    currentTheme,
    primaryColor,
    themeName,
    isDark,
    applyTheme,
    applyPresetTheme,
  } = useTheme()

  const handleThemeChange = () => {
    applyTheme('#1890ff')
  }

  const handlePresetChange = () => {
    applyPresetTheme('blue')
  }

  return (
    <div>
      <p>Current Color: {primaryColor()}</p>
      <p>Theme Name: {themeName()}</p>
      <p>Dark Mode: {isDark() ? 'Yes' : 'No'}</p>

      <button onClick={handleThemeChange}>Apply Custom Color</button>
      <button onClick={handlePresetChange}>Apply Blue Theme</button>
    </div>
  )
}
```

### Using ThemePicker Component

```tsx
import { ThemePicker } from '@ldesign/color-solid'

function App() {
  const handleChange = (value: string, preset?: any) => {
    console.log('Theme changed:', value, preset)
  }

  return (
    <ThemePicker
      showArrow={true}
      showSearch={false}
      showCustom={false}
      onChange={handleChange}
    />
  )
}
```

### Using ThemeModeSwitcher Component

```tsx
import { ThemeModeSwitcher } from '@ldesign/color-solid'

function App() {
  const handleModeChange = (mode: 'light' | 'dark' | 'system') => {
    console.log('Mode changed:', mode)
  }

  return (
    <ThemeModeSwitcher
      defaultMode="system"
      storageKey="my-theme-mode"
      onModeChange={handleModeChange}
    />
  )
}
```

## API Reference

### useTheme(options?)

Creates a theme management primitive with reactive signals.

**Options:**
- `prefix?: string` - CSS variable prefix (default: 'ld')
- `storageKey?: string` - localStorage key for persistence (default: 'ldesign-theme')
- `immediate?: boolean` - Auto-restore theme on initialization (default: true)

**Returns:**
- `currentTheme: Accessor<ThemeState | null>` - Signal with current theme state
- `presets: PresetTheme[]` - Array of available preset themes
- `isLoading: Accessor<boolean>` - Signal indicating loading state
- `primaryColor: Accessor<string>` - Memo with primary color
- `themeName: Accessor<string>` - Memo with theme name
- `isDark: Accessor<boolean>` - Memo indicating dark mode
- `applyTheme(color, options?)` - Apply a custom color theme
- `applyPresetTheme(name, options?)` - Apply a preset theme
- `restoreTheme()` - Restore theme from storage
- `clearTheme()` - Clear current theme
- `getCurrentTheme()` - Get current theme state

### ThemePicker

A component for selecting and applying color themes.

**Props:**
- `value?: string` - Current color value
- `onChange?: (value: string, preset?: PresetTheme) => void` - Change callback
- `showArrow?: boolean` - Show dropdown arrow (default: true)
- `showSearch?: boolean` - Show search input (default: false)
- `showCustom?: boolean` - Show custom color input (default: false)
- `prefix?: string` - CSS variable prefix (default: 'ld')
- `storageKey?: string` - localStorage key

### ThemeModeSwitcher

A component for switching between light, dark, and system theme modes.

**Props:**
- `defaultMode?: 'light' | 'dark' | 'system'` - Default mode (default: 'system')
- `storageKey?: string` - localStorage key (default: 'ld-theme-mode')
- `onModeChange?: (mode: ThemeMode) => void` - Mode change callback
- `class?: string` - Additional CSS class

## Examples

### Complete Theme System

```tsx
import { createSignal } from 'solid-js'
import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-solid'

function App() {
  const theme = useTheme({
    prefix: 'my-app',
    storageKey: 'my-app-theme',
  })

  const { currentTheme, primaryColor, themeName, isDark } = theme

  const handleThemeChange = (value: string, preset?: any) => {
    console.log('New theme:', value, preset)
  }

  const handleModeChange = (mode: 'light' | 'dark' | 'system') => {
    console.log('New mode:', mode)
  }

  return (
    <div class="app">
      <header>
        <h1>My Solid App</h1>
        <div class="controls">
          <ThemePicker
            showSearch={true}
            showCustom={true}
            onChange={handleThemeChange}
          />
          <ThemeModeSwitcher
            onModeChange={handleModeChange}
          />
        </div>
      </header>

      <main>
        <div class="theme-info">
          <p>Primary Color: <span style={{ color: primaryColor() }}>{primaryColor()}</span></p>
          <p>Theme: {themeName() || 'Custom'}</p>
          <p>Mode: {isDark() ? 'Dark' : 'Light'}</p>
        </div>
      </main>
    </div>
  )
}

export default App
```

### With Context for Global State

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

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}

// Usage in App
function App() {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  )
}

function MyComponent() {
  const { primaryColor, applyTheme } = useThemeContext()

  return (
    <div>
      <p>Color: {primaryColor()}</p>
      <button onClick={() => applyTheme('#1890ff')}>Change Theme</button>
    </div>
  )
}
```

## CSS Variables

The package generates CSS variables based on your theme:

```css
/* Light mode */
--{prefix}-brand-color: #1890ff;
--{prefix}-brand-color-hover: #40a9ff;
--{prefix}-brand-color-light: #e6f7ff;
/* ... and many more */

/* Dark mode (when [theme-mode="dark"]) */
--{prefix}-brand-color: #177ddc;
--{prefix}-bg-color-page: #000000;
/* ... and many more */
```

## Performance Tips

Solid.js provides fine-grained reactivity. To maximize performance:

1. **Use memos for derived values** - Already done in `useTheme`
2. **Destructure only what you need** - Only destructure the signals you actually use
3. **Avoid unnecessary re-renders** - Use `Show` and `For` components appropriately

```tsx
// Good - Only subscribes to primaryColor
const { primaryColor } = useTheme()
return <div style={{ color: primaryColor() }}>Text</div>

// Less optimal - Subscribes to entire theme object
const theme = useTheme()
return <div style={{ color: theme.primaryColor() }}>Text</div>
```

## License

MIT © ldesign


