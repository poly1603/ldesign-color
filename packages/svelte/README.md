# @ldesign/color-svelte

Svelte components and stores for @ldesign/color-core - A powerful color theme management solution for Svelte applications.

## Features

- 🎨 **Theme Management** - Easy-to-use Svelte stores for color theme management
- 🎭 **Dark Mode Support** - Built-in light/dark mode switching
- 🧩 **Ready-to-use Components** - Pre-built ThemePicker and ThemeModeSwitcher components
- 💾 **Persistence** - Automatic theme persistence to localStorage
- 🎯 **Type-safe** - Full TypeScript support
- 🚀 **Lightweight** - Minimal bundle size with tree-shaking support

## Installation

```bash
# pnpm
pnpm add @ldesign/color-svelte @ldesign/color-core

# npm
npm install @ldesign/color-svelte @ldesign/color-core

# yarn
yarn add @ldesign/color-svelte @ldesign/color-core
```

## Quick Start

### Basic Theme Management

```svelte
<script>
  import { useTheme } from '@ldesign/color-svelte'

  const {
    currentTheme,
    primaryColor,
    themeName,
    isDark,
    applyTheme,
    applyPresetTheme,
  } = useTheme()

  function handleThemeChange() {
    applyTheme('#1890ff')
  }

  function handlePresetChange() {
    applyPresetTheme('blue')
  }
</script>

<div>
  <p>Current Color: {$primaryColor}</p>
  <p>Theme Name: {$themeName}</p>
  <p>Dark Mode: {$isDark}</p>

  <button on:click={handleThemeChange}>Apply Custom Color</button>
  <button on:click={handlePresetChange}>Apply Blue Theme</button>
</div>
```

### Using ThemePicker Component

```svelte
<script>
  import { ThemePicker } from '@ldesign/color-svelte'

  function handleChange(event) {
    console.log('Theme changed:', event.detail)
  }
</script>

<ThemePicker
  showArrow={true}
  showSearch={false}
  showCustom={false}
  on:change={handleChange}
/>
```

### Using ThemeModeSwitcher Component

```svelte
<script>
  import { ThemeModeSwitcher } from '@ldesign/color-svelte'

  function handleModeChange(event) {
    console.log('Mode changed:', event.detail)
  }
</script>

<ThemeModeSwitcher
  defaultMode="system"
  storageKey="my-theme-mode"
  on:change={handleModeChange}
/>
```

## API Reference

### useTheme(options?)

Creates a theme management store.

**Options:**
- `prefix?: string` - CSS variable prefix (default: 'ld')
- `storageKey?: string` - localStorage key for persistence (default: 'ldesign-theme')
- `immediate?: boolean` - Auto-restore theme on initialization (default: true)

**Returns:**
- `currentTheme` - Writable store with current theme state
- `presets` - Readable store with available preset themes
- `isLoading` - Writable store indicating loading state
- `primaryColor` - Derived store with primary color
- `themeName` - Derived store with theme name
- `isDark` - Derived store indicating dark mode
- `applyTheme(color, options?)` - Apply a custom color theme
- `applyPresetTheme(name, options?)` - Apply a preset theme
- `restoreTheme()` - Restore theme from storage
- `clearTheme()` - Clear current theme
- `getCurrentTheme()` - Get current theme state
- `destroy()` - Cleanup function

### ThemePicker

A component for selecting and applying color themes.

**Props:**
- `value?: string` - Current color value
- `showArrow?: boolean` - Show dropdown arrow (default: true)
- `showSearch?: boolean` - Show search input (default: false)
- `showCustom?: boolean` - Show custom color input (default: false)
- `prefix?: string` - CSS variable prefix (default: 'ld')
- `storageKey?: string` - localStorage key

**Events:**
- `change: { value: string, preset?: PresetTheme }` - Fired when theme changes

### ThemeModeSwitcher

A component for switching between light, dark, and system theme modes.

**Props:**
- `defaultMode?: 'light' | 'dark' | 'system'` - Default mode (default: 'system')
- `storageKey?: string` - localStorage key (default: 'ld-theme-mode')

**Events:**
- `change: ThemeMode` - Fired when mode changes

## Examples

### Complete Theme System

```svelte
<script>
  import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-svelte'

  const theme = useTheme({
    prefix: 'my-app',
    storageKey: 'my-app-theme',
  })

  const { currentTheme, primaryColor, themeName, isDark } = theme

  function handleThemeChange(event) {
    console.log('New theme:', event.detail)
  }

  function handleModeChange(event) {
    console.log('New mode:', event.detail)
  }
</script>

<div class="app">
  <header>
    <h1>My Svelte App</h1>
    <div class="controls">
      <ThemePicker
        showSearch={true}
        showCustom={true}
        on:change={handleThemeChange}
      />
      <ThemeModeSwitcher
        on:change={handleModeChange}
      />
    </div>
  </header>

  <main>
    <div class="theme-info">
      <p>Primary Color: <span style="color: {$primaryColor}">{$primaryColor}</span></p>
      <p>Theme: {$themeName || 'Custom'}</p>
      <p>Mode: {$isDark ? 'Dark' : 'Light'}</p>
    </div>
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
    background: var(--my-app-bg-color-page);
    color: var(--my-app-text-color-primary);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--my-app-bg-color-container);
  }

  .controls {
    display: flex;
    gap: 1rem;
  }
</style>
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

## License

MIT © ldesign


