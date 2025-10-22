# Advanced Color Spaces in @ldesign/color

## Overview

@ldesign/color now supports advanced, perceptually uniform color spaces including **OKLCH**, **OKLAB**, **LAB**, **LCH**, and **XYZ**. These color spaces provide more accurate color manipulation and better gradients compared to traditional RGB/HSL.

## Why Perceptually Uniform Color Spaces?

Traditional color spaces like RGB and HSL have a problem: they don't match how humans perceive color. This leads to:

- **Muddy gradients**: Interpolating between red and cyan in RGB creates ugly brown colors
- **Inconsistent lightness**: Colors with the same L value in HSL can look drastically different in brightness
- **Poor color matching**: Similar ΔE values don't represent equal perceptual differences

Perceptually uniform color spaces solve these problems by organizing colors based on human vision.

## Color Spaces Explained

### OKLCH (Recommended) 🌟

**What it is**: A cylindrical representation of OKLAB, designed by Björn Ottosson for modern displays.

**When to use**:
- Color interpolation and gradients
- UI color generation
- Modern web applications
- Any time you need smooth, natural-looking colors

**Properties**:
- `l` (lightness): 0-1 (0 = black, 1 = white)
- `c` (chroma): 0-0.4 (0 = gray, higher = more saturated)
- `h` (hue): 0-360 degrees

```typescript
import { Color } from '@ldesign/color';

const color = new Color('#FF6B6B');
const oklch = color.toOKLCH();
console.log(oklch); // { l: 0.68, c: 0.20, h: 25 }

// Create from OKLCH
import { oklchToRGB } from '@ldesign/color';
const rgb = oklchToRGB({ l: 0.68, c: 0.20, h: 25 });
```

### OKLAB

**What it is**: A perceptually uniform color space optimized for modern displays.

**When to use**:
- When you need Cartesian coordinates instead of cylindrical
- Color distance calculations
- Advanced color manipulation

**Properties**:
- `l` (lightness): 0-1
- `a` (green-red axis): -0.4 to 0.4
- `b` (blue-yellow axis): -0.4 to 0.4

```typescript
const oklab = color.toOKLAB();
console.log(oklab); // { l: 0.68, a: 0.18, b: 0.09 }
```

### LAB (CIE L*a*b*)

**What it is**: The classic perceptually uniform color space, designed in 1976.

**When to use**:
- Print workflows
- Legacy systems requiring LAB
- When you need compatibility with Adobe products

**Properties**:
- `l` (lightness): 0-100
- `a` (green-red axis): -128 to 127
- `b` (blue-yellow axis): -128 to 127

```typescript
const lab = color.toLAB();
console.log(lab); // { l: 62.5, a: 42.3, b: 25.6 }
```

### LCH (Cylindrical LAB)

**What it is**: LAB in cylindrical coordinates, easier for hue rotation.

**When to use**:
- When working with LAB but need hue control
- Color harmony generation in LAB space

```typescript
const lch = color.toLCH();
console.log(lch); // { l: 62.5, c: 49.5, h: 31.2 }
```

### XYZ (CIE 1931)

**What it is**: The foundation color space based on human color matching experiments.

**When to use**:
- Converting between color spaces
- Scientific color calculations
- Advanced color science applications

```typescript
const xyz = color.toXYZ();
console.log(xyz); // { x: 41.2, y: 21.3, z: 1.9 }
```

## Color Interpolation

### Why OKLCH is Best for Gradients

Compare these two gradients from red (#FF0000) to cyan (#00FFFF):

**RGB Interpolation (Traditional)**:
```
Red → Brown → Gray → Cyan
```

**OKLCH Interpolation (New)**:
```
Red → Orange → Yellow → Green → Cyan
```

The OKLCH gradient maintains vibrant, saturated colors throughout!

### Usage

```typescript
import { interpolate, ColorInterpolator, gradient } from '@ldesign/color';

// Simple interpolation
const midpoint = interpolate('#FF0080', '#00FF80', 0.5, { space: 'oklch' });

// Create interpolator for multiple values
const interpolator = new ColorInterpolator('#FF0080', '#00FF80', {
  space: 'oklch',
  easing: 'ease-in-out'
});

const colors = interpolator.steps(10); // Get 10 colors
const customColor = interpolator.at(0.75); // Get color at 75%

// Multi-color gradient
const rainbow = gradient(
  ['#FF0080', '#FF8000', '#FFFF00', '#00FF80', '#0080FF'],
  50,
  { space: 'oklch' }
);
```

### Available Spaces

- `'oklch'` (default, recommended)
- `'oklab'`
- `'lab'`
- `'lch'`
- `'hsl'`
- `'hsv'`
- `'rgb'`

### Easing Functions

- `'linear'` (default)
- `'ease-in-out'`
- `'ease-in'`
- `'ease-out'`
- `'ease-in-cubic'`
- `'ease-out-cubic'`
- Custom functions: `(t: number) => number`

## Delta E 2000 - Perceptual Color Difference

Delta E is a metric for measuring how different two colors appear to humans.

### Understanding Delta E Values

| Delta E | Perception |
|---------|------------|
| 0 | Identical colors |
| < 1 | Imperceptible to human eyes |
| 1 - 2 | Barely perceptible difference |
| 2 - 10 | Noticeable difference |
| > 10 | Very different colors |

### Usage

```typescript
const color1 = new Color('#FF6B6B');
const color2 = new Color('#FF8C94');

// Delta E 2000 (most accurate, slower)
const deltaE = color1.deltaE2000(color2);
console.log(deltaE); // 8.42

// OKLAB distance (faster, good approximation)
const deltaEOKLAB = color1.deltaEOKLAB(color2);
console.log(deltaEOKLAB); // 0.042

// RGB distance (least accurate, fastest)
const rgbDist = color1.distance(color2);
console.log(rgbDist); // 35.11
```

### When to Use Each

| Method | Accuracy | Speed | Use Case |
|--------|----------|-------|----------|
| `deltaE2000()` | Highest | Slowest | Final validation, accessibility |
| `deltaEOKLAB()` | High | Fast | Real-time comparisons, sorting |
| `distance()` | Low | Fastest | Quick checks, approximations |

## Performance Considerations

### Optimization Tips

1. **Use batch processing** for multiple conversions
2. **Cache converted values** if using repeatedly
3. **Use OKLAB distance** instead of Delta E 2000 for real-time operations
4. **Prefer `toRGBDirect()`** for tuple access without object allocation

```typescript
// ❌ Slow: Creates objects
for (let i = 0; i < 10000; i++) {
  const rgb = color.toRGB();
  doSomething(rgb.r, rgb.g, rgb.b);
}

// ✅ Fast: Direct tuple access
for (let i = 0; i < 10000; i++) {
  const [r, g, b] = color.toRGBDirect();
  doSomething(r, g, b);
}
```

### Benchmarks

On a modern CPU (single operation):

| Operation | Time |
|-----------|------|
| OKLCH conversion | ~0.015 ms |
| OKLAB conversion | ~0.012 ms |
| LAB conversion | ~0.018 ms |
| Delta E 2000 | ~0.045 ms |
| OKLAB distance | ~0.013 ms |
| OKLCH interpolation | ~0.025 ms |

## Migration Guide

### From RGB Gradients

```typescript
// Before
function oldGradient(start, end, steps) {
  const results = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = start.red + (end.red - start.red) * t;
    const g = start.green + (end.green - start.green) * t;
    const b = start.blue + (end.blue - start.blue) * t;
    results.push(new Color({ r, g, b }));
  }
  return results;
}

// After
import { ColorInterpolator } from '@ldesign/color';

function newGradient(start, end, steps) {
  const interpolator = new ColorInterpolator(start, end, { space: 'oklch' });
  return interpolator.steps(steps);
}
```

### From HSL Interpolation

```typescript
// Before: Hue interpolation issues
const hsl1 = color1.toHSL();
const hsl2 = color2.toHSL();
const midHue = (hsl1.h + hsl2.h) / 2; // Wrong: doesn't handle 0°/360° wrap

// After: Proper hue interpolation
const mid = interpolate(color1, color2, 0.5, { space: 'oklch' });
```

## Best Practices

### ✅ Do's

- Use **OKLCH** for UI gradients and color manipulation
- Use **Delta E 2000** for accessibility and quality checks
- Use **OKLAB distance** for real-time color comparisons
- Cache converted values when using the same color repeatedly
- Use perceptual spaces for color harmony generation

### ❌ Don'ts

- Don't interpolate in RGB for gradients (unless you want muddy colors)
- Don't use RGB distance for perceptual comparisons
- Don't convert unnecessarily (each conversion has a cost)
- Don't use LAB unless you specifically need it (OKLAB is better)

## Examples

### Accessible Color Pairs

```typescript
import { Color } from '@ldesign/color';

function findAccessibleVariant(baseColor, backgroundColor) {
  let variant = new Color(baseColor);
  
  while (variant.contrast(backgroundColor) < 4.5) {
    const oklch = variant.toOKLCH();
    oklch.l *= 0.9; // Darken
    variant = oklchToRGB(oklch);
  }
  
  return variant;
}
```

### Smooth Color Scale

```typescript
import { gradient } from '@ldesign/color';

function createColorScale(baseColor, count = 10) {
  const oklch = baseColor.toOKLCH();
  
  // Create lighter and darker versions
  const lightest = oklchToRGB({ ...oklch, l: 0.95 });
  const darkest = oklchToRGB({ ...oklch, l: 0.20 });
  
  return gradient([lightest, baseColor, darkest], count, { space: 'oklch' });
}
```

### Color Similarity Clustering

```typescript
function groupSimilarColors(colors, threshold = 5) {
  const groups = [];
  const used = new Set();
  
  for (let i = 0; i < colors.length; i++) {
    if (used.has(i)) continue;
    
    const group = [colors[i]];
    used.add(i);
    
    for (let j = i + 1; j < colors.length; j++) {
      if (used.has(j)) continue;
      
      if (colors[i].deltaE2000(colors[j]) < threshold) {
        group.push(colors[j]);
        used.add(j);
      }
    }
    
    groups.push(group);
  }
  
  return groups;
}
```

## Further Reading

- [OKLAB by Björn Ottosson](https://bottosson.github.io/posts/oklab/)
- [CIE Color Spaces](https://en.wikipedia.org/wiki/CIELAB_color_space)
- [Delta E 2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)
- [Perceptually Uniform Color Spaces](https://programmingdesignsystems.com/color/perceptually-uniform-color-spaces/)

## API Reference

See the main [README.md](../README.md) for complete API documentation.


