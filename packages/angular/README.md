# @ldesign/color-angular

Angular services and components for @ldesign/color-core - A powerful color theme management solution for Angular applications.

## Features

- 🎨 **Theme Management** - Injectable Angular service for color theme management
- 🎭 **Dark Mode Support** - Built-in light/dark mode switching
- 🧩 **Standalone Components** - Fully standalone components, no NgModule needed
- 💾 **Persistence** - Automatic theme persistence to localStorage
- 🎯 **Type-safe** - Full TypeScript support
- 🚀 **Signals** - Uses Angular signals for reactive state management
- ⚡ **Modern Angular** - Built for Angular 17+

## Installation

```bash
# pnpm
pnpm add @ldesign/color-angular @ldesign/color-core

# npm
npm install @ldesign/color-angular @ldesign/color-core

# yarn
yarn add @ldesign/color-angular @ldesign/color-core
```

## Quick Start

### Basic Theme Management

```typescript
import { Component, inject } from '@angular/core'
import { ThemeService } from '@ldesign/color-angular'

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <p>Current Color: {{ themeService.primaryColor() }}</p>
      <p>Theme Name: {{ themeService.themeName() }}</p>
      <p>Dark Mode: {{ themeService.isDark() }}</p>

      <button (click)="handleThemeChange()">Apply Custom Color</button>
      <button (click)="handlePresetChange()">Apply Blue Theme</button>
    </div>
  `,
})
export class AppComponent {
  themeService = inject(ThemeService)

  handleThemeChange() {
    this.themeService.applyTheme('#1890ff')
  }

  handlePresetChange() {
    this.themeService.applyPresetTheme('blue')
  }
}
```

### Using ThemePicker Component

```typescript
import { Component } from '@angular/core'
import { ThemePickerComponent } from '@ldesign/color-angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThemePickerComponent],
  template: `
    <ld-theme-picker
      [showArrow]="true"
      [showSearch]="false"
      [showCustom]="false"
      (changeEvent)="handleChange($event)"
    />
  `,
})
export class AppComponent {
  handleChange(event: { value: string, preset?: any }) {
    console.log('Theme changed:', event)
  }
}
```

### Using ThemeModeSwitcher Component

```typescript
import { Component } from '@angular/core'
import { ThemeModeSwitcherComponent } from '@ldesign/color-angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThemeModeSwitcherComponent],
  template: `
    <ld-theme-mode-switcher
      [defaultMode]="'system'"
      [storageKey]="'my-theme-mode'"
      (modeChange)="handleModeChange($event)"
    />
  `,
})
export class AppComponent {
  handleModeChange(mode: 'light' | 'dark' | 'system') {
    console.log('Mode changed:', mode)
  }
}
```

## API Reference

### ThemeService

Injectable service for theme management.

**Signals:**
- `currentTheme: Signal<ThemeState | null>` - Current theme state
- `isLoading: Signal<boolean>` - Loading state
- `primaryColor: Signal<string>` - Primary color (computed)
- `themeName: Signal<string>` - Theme name (computed)
- `isDark: Signal<boolean>` - Dark mode indicator (computed)
- `presets: Signal<PresetTheme[]>` - Available preset themes

**Methods:**
- `applyTheme(color, options?)` - Apply a custom color theme
- `applyPresetTheme(name, options?)` - Apply a preset theme
- `restoreTheme()` - Restore theme from storage
- `clearTheme()` - Clear current theme
- `getCurrentTheme()` - Get current theme state

### ThemePickerComponent

A standalone component for selecting and applying color themes.

**Inputs:**
- `value?: string` - Current color value
- `showArrow?: boolean` - Show dropdown arrow (default: true)
- `showSearch?: boolean` - Show search input (default: false)
- `showCustom?: boolean` - Show custom color input (default: false)
- `prefix?: string` - CSS variable prefix (default: 'ld')
- `storageKey?: string` - localStorage key

**Outputs:**
- `changeEvent: EventEmitter<{ value: string, preset?: PresetTheme }>` - Fired when theme changes

### ThemeModeSwitcherComponent

A standalone component for switching between light, dark, and system theme modes.

**Inputs:**
- `defaultMode?: 'light' | 'dark' | 'system'` - Default mode (default: 'system')
- `storageKey?: string` - localStorage key (default: 'ld-theme-mode')

**Outputs:**
- `modeChange: EventEmitter<ThemeMode>` - Fired when mode changes

## Examples

### Complete Theme System

```typescript
import { Component, inject } from '@angular/core'
import { ThemeService, ThemePickerComponent, ThemeModeSwitcherComponent } from '@ldesign/color-angular'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ThemePickerComponent, ThemeModeSwitcherComponent],
  template: `
    <div class="app">
      <header>
        <h1>My Angular App</h1>
        <div class="controls">
          <ld-theme-picker [showSearch]="true" [showCustom]="true" />
          <ld-theme-mode-switcher />
        </div>
      </header>

      <main>
        <div class="theme-info">
          <p>Primary Color: <span [style.color]="themeService.primaryColor()">{{ themeService.primaryColor() }}</span></p>
          <p>Theme: {{ themeService.themeName() || 'Custom' }}</p>
          <p>Mode: {{ themeService.isDark() ? 'Dark' : 'Light' }}</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background: var(--ld-bg-color-page);
      color: var(--ld-text-color-primary);
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: var(--ld-bg-color-container);
    }

    .controls {
      display: flex;
      gap: 1rem;
    }
  `],
})
export class AppComponent {
  themeService = inject(ThemeService)
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

## Angular Signals

This package uses Angular's new Signals API for reactive state management, providing:

- ✅ Fine-grained reactivity
- ✅ Automatic dependency tracking
- ✅ Better performance
- ✅ Type-safe
- ✅ Compatible with Angular 17+

## License

MIT © ldesign

