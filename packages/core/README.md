# @ldesign/color-core

Framework-agnostic core color manipulation library with powerful utilities and design system integration.

## Features

- 🎨 **Comprehensive Color Support** - RGB, HSL, HSV, HWB, LAB, LCH, OKLAB, OKLCH, CMYK
- 🔄 **Color Conversions** - Seamless conversion between all color spaces
- 🎯 **Color Manipulation** - Lighten, darken, saturate, desaturate, mix, blend
- 📊 **Color Analysis** - Contrast, luminance, temperature, accessibility
- 🌈 **Palette Generation** - Material Design, Tailwind, Ant Design, custom palettes
- ♿ **Accessibility** - WCAG compliance, color blindness simulation
- 🎭 **Design Systems** - Pre-built integrations for popular design systems
- 🚀 **High Performance** - Optimized algorithms, caching, memory management
- 📦 **Tree-shakeable** - Import only what you need
- 💪 **TypeScript** - Full type safety and IntelliSense support

## Installation

```bash
# pnpm
pnpm add @ldesign/color-core

# npm
npm install @ldesign/color-core

# yarn
yarn add @ldesign/color-core
```

## Quick Start

```typescript
import { Color } from '@ldesign/color-core'

// Create a color
const color = new Color('#3b82f6')

// Manipulate colors
const lighter = color.lighten(20)
const darker = color.darken(20)
const saturated = color.saturate(30)

// Convert between formats
color.toHex()    // '#3b82f6'
color.toRgb()    // { r: 59, g: 130, b: 246 }
color.toHsl()    // { h: 217, s: 91, l: 60 }

// Check accessibility
color.contrast('#ffffff')     // 3.28
color.isWCAGCompliant('#fff') // false (AA level requires 4.5:1)

// Generate palettes
import { generateTailwindPalette } from '@ldesign/color-core'

const palette = generateTailwindPalette('#3b82f6')
// { 50: '#eff6ff', 100: '#dbeafe', ..., 900: '#1e3a8a' }
```

## Documentation

For detailed documentation, visit [ldesign documentation](https://ldesign.dev/color).

## License

MIT © ldesign

