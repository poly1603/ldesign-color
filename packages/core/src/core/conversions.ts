/**
 * @ldesign/color - Color Conversions
 *
 * High-performance color format conversion functions with optimized algorithms.
 * All functions use bit operations, lookup tables, and precomputed constants
 * for maximum performance.
 *
 * @module core/conversions
 * @performance All conversion functions are O(1) with minimal allocations
 */

import type { HSL, HSV, HWB, RGB } from '../types'
import { clamp, round } from '../utils/math'
import {
  acquireHSL,
  acquireHSV,
  acquireRGB,
  releaseHSL,
  releaseHSV,
  releaseRGB,
} from '../utils/objectPool'

// ============================================
// Precomputed Constants
// ============================================

/** 1/255 precomputed for RGB normalization */
const INV_255 = 1 / 255

/** 1/360 precomputed for hue conversion */
const INV_360 = 1 / 360

/** 1/100 precomputed for percentage conversion */
const INV_100 = 0.01

/** 1/3 precomputed for hue calculations */
const ONE_THIRD = 1 / 3

/** 2/3 precomputed for hue calculations */
const TWO_THIRDS = 2 / 3

/** 1/6 precomputed for hue calculations */
const ONE_SIXTH = 1 / 6

/**
 * Convert RGB to Hex string - Optimized with lookup table
 */
const HEX_CHARS = '0123456789ABCDEF'
const HEX_LOOKUP = Array.from({ length: 256 })
// Pre-compute hex values
for (let i = 0; i < 256; i++) {
  HEX_LOOKUP[i] = HEX_CHARS[i >> 4] + HEX_CHARS[i & 0x0F]
}

export function rgbToHex(rgb: RGB): string {
  const r = clamp(rgb.r | 0, 0, 255)
  const g = clamp(rgb.g | 0, 0, 255)
  const b = clamp(rgb.b | 0, 0, 255)
  return `#${HEX_LOOKUP[r]}${HEX_LOOKUP[g]}${HEX_LOOKUP[b]}`
}

/**
 * Convert Hex string to RGB - Optimized
 */
export function hexToRgb(hex: string): RGB {
  // Fast path for common formats
  if (hex[0] === '#')
    hex = hex.slice(1)

  let r: number, g: number, b: number, a: number | undefined

  if (hex.length === 3) {
    // 3-char hex
    r = Number.parseInt(hex[0] + hex[0], 16)
    g = Number.parseInt(hex[1] + hex[1], 16)
    b = Number.parseInt(hex[2] + hex[2], 16)
  }
  else if (hex.length === 4) {
    // 4-char hex with alpha
    r = Number.parseInt(hex[0] + hex[0], 16)
    g = Number.parseInt(hex[1] + hex[1], 16)
    b = Number.parseInt(hex[2] + hex[2], 16)
    a = Number.parseInt(hex[3] + hex[3], 16) / 255
  }
  else if (hex.length === 6) {
    // 6-char hex - most common
    const value = Number.parseInt(hex, 16)
    r = (value >> 16) & 0xFF
    g = (value >> 8) & 0xFF
    b = value & 0xFF
  }
  else if (hex.length === 8) {
    // 8-char hex with alpha
    const value = Number.parseInt(hex.slice(0, 6), 16)
    r = (value >> 16) & 0xFF
    g = (value >> 8) & 0xFF
    b = value & 0xFF
    a = Number.parseInt(hex.slice(6), 16) / 255
  }
  else {
    return { r: 0, g: 0, b: 0 }
  }

  const rgb: RGB = { r, g, b }
  if (a !== undefined)
    rgb.a = a
  return rgb
}

// ============================================
// Object Pool Re-exports (for backward compatibility)
// ============================================

/**
 * Return HSL object to pool
 * @deprecated Use releaseHSL from '../utils/objectPool' instead
 */
export const returnHSLToPool = releaseHSL

/**
 * Return HSV object to pool
 * @deprecated Use releaseHSV from '../utils/objectPool' instead
 */
export const returnHSVToPool = releaseHSV

/**
 * Convert RGB to HSL
 *
 * Converts RGB color to HSL (Hue, Saturation, Lightness) color space.
 * Uses object pooling for performance.
 *
 * @param rgb - RGB color object (r, g, b: 0-255)
 * @returns HSL color object (h: 0-360, s: 0-100, l: 0-100)
 * @performance O(1) - Optimized with object pooling and precomputed constants
 * @example
 * ```ts
 * const hsl = rgbToHsl({ r: 59, g: 130, b: 246 });
 * console.log(hsl); // { h: 220, s: 90, l: 60 }
 * ```
 */
export function rgbToHsl(rgb: RGB): HSL {
  // Normalize RGB to [0,1] range using precomputed constant
  const r = rgb.r * INV_255
  const g = rgb.g * INV_255
  const b = rgb.b * INV_255

  // Find min/max for lightness and chroma calculations
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const l = (max + min) * 0.5 // Lightness

  const hsl = acquireHSL()

  // Achromatic (gray)
  if (delta === 0) {
    hsl.h = 0
    hsl.s = 0
  }
  else {
    // Calculate saturation
    const s = delta / (l > 0.5 ? 2 - max - min : max + min)

    // Calculate hue (0-360 degrees)
    let h: number
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
    }
    else if (max === g) {
      h = ((b - r) / delta + 2) * 60
    }
    else {
      h = ((r - g) / delta + 4) * 60
    }

    hsl.h = Math.round(h)
    hsl.s = Math.round(s * 100)
  }

  hsl.l = Math.round(l * 100)

  if (rgb.a !== undefined)
    hsl.a = rgb.a
  return hsl
}

/**
 * Return RGB object to pool
 * @deprecated Use releaseRGB from '../utils/objectPool' instead
 */
export const returnRGBToPool = releaseRGB

/**
 * Convert HSL to RGB
 *
 * Converts HSL (Hue, Saturation, Lightness) to RGB color space.
 * Uses optimized inline hue calculations and object pooling.
 *
 * @param hsl - HSL color object (h: 0-360, s: 0-100, l: 0-100)
 * @returns RGB color object (r, g, b: 0-255)
 * @performance O(1) - Fully inlined with precomputed constants
 * @example
 * ```ts
 * const rgb = hslToRgb({ h: 220, s: 90, l: 60 });
 * console.log(rgb); // { r: 59, g: 130, b: 246 }
 * ```
 */
export function hslToRgb(hsl: HSL): RGB {
  // Normalize inputs using precomputed constants
  const h = hsl.h * INV_360
  const s = hsl.s * INV_100
  const l = hsl.l * INV_100

  const rgb = acquireRGB()

  // Gray color (no saturation)
  if (s === 0) {
    rgb.r = rgb.g = rgb.b = Math.round(l * 255)
  }
  else {
    // Calculate intermediate values
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    // Inline hue-to-rgb calculations using precomputed constants
    // Red channel
    let t = h + ONE_THIRD
    if (t < 0)
      t += 1
    if (t > 1)
      t -= 1
    rgb.r = Math.round((
      t < ONE_SIXTH
        ? p + (q - p) * 6 * t
        : t < 0.5
          ? q
          : t < TWO_THIRDS ? p + (q - p) * (TWO_THIRDS - t) * 6 : p
    ) * 255)

    // Green channel
    t = h
    rgb.g = Math.round((
      t < ONE_SIXTH
        ? p + (q - p) * 6 * t
        : t < 0.5
          ? q
          : t < TWO_THIRDS ? p + (q - p) * (TWO_THIRDS - t) * 6 : p
    ) * 255)

    // Blue channel
    t = h - ONE_THIRD
    if (t < 0)
      t += 1
    rgb.b = Math.round((
      t < ONE_SIXTH
        ? p + (q - p) * 6 * t
        : t < 0.5
          ? q
          : t < TWO_THIRDS ? p + (q - p) * (TWO_THIRDS - t) * 6 : p
    ) * 255)
  }

  if (hsl.a !== undefined)
    rgb.a = hsl.a
  return rgb
}

/**
 * Convert RGB to HSV
 *
 * Converts RGB color to HSV (Hue, Saturation, Value) color space.
 * Uses object pooling and precomputed constants for performance.
 *
 * @param rgb - RGB color object (r, g, b: 0-255)
 * @returns HSV color object (h: 0-360, s: 0-100, v: 0-100)
 * @performance O(1) - Optimized with object pooling and precomputed constants
 * @example
 * ```ts
 * const hsv = rgbToHsv({ r: 59, g: 130, b: 246 });
 * console.log(hsv); // { h: 220, s: 76, v: 96 }
 * ```
 */
export function rgbToHsv(rgb: RGB): HSV {
  // Normalize RGB to [0,1] range using precomputed constant
  const r = rgb.r * INV_255
  const g = rgb.g * INV_255
  const b = rgb.b * INV_255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  const hsv = acquireHSV()

  // Calculate saturation and value
  hsv.s = max === 0 ? 0 : round((delta / max) * 100)
  hsv.v = round(max * 100)

  // Calculate hue
  if (delta === 0) {
    hsv.h = 0
  }
  else {
    let h = 0
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / delta + 2) / 6
        break
      case b:
        h = ((r - g) / delta + 4) / 6
        break
    }
    hsv.h = round(h * 360)
  }

  if (rgb.a !== undefined)
    hsv.a = rgb.a

  return hsv
}

/**
 * Convert HSV to RGB
 *
 * Converts HSV (Hue, Saturation, Value) to RGB color space.
 * Uses object pooling and precomputed constants for performance.
 *
 * @param hsv - HSV color object (h: 0-360, s: 0-100, v: 0-100)
 * @returns RGB color object (r, g, b: 0-255)
 * @performance O(1) - Optimized with object pooling and precomputed constants
 * @example
 * ```ts
 * const rgb = hsvToRgb({ h: 220, s: 76, v: 96 });
 * console.log(rgb); // { r: 59, g: 130, b: 246 }
 * ```
 */
export function hsvToRgb(hsv: HSV): RGB {
  // Normalize inputs using precomputed constants
  const h = hsv.h * INV_360
  const s = hsv.s * INV_100
  const v = hsv.v * INV_100

  const rgb = acquireRGB()

  // Gray color (no saturation)
  if (s === 0) {
    rgb.r = rgb.g = rgb.b = round(v * 255)
  }
  else {
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    let r: number, g: number, b: number

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break
      case 1: r = q; g = v; b = p; break
      case 2: r = p; g = v; b = t; break
      case 3: r = p; g = q; b = v; break
      case 4: r = t; g = p; b = v; break
      case 5: r = v; g = p; b = q; break
      default: r = 0; g = 0; b = 0
    }

    rgb.r = round(r * 255)
    rgb.g = round(g * 255)
    rgb.b = round(b * 255)
  }

  if (hsv.a !== undefined)
    rgb.a = hsv.a

  return rgb
}

/**
 * Convert RGB to HWB
 */
export function rgbToHwb(rgb: RGB): HWB {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0

  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / delta + 2) / 6
        break
      case b:
        h = ((r - g) / delta + 4) / 6
        break
    }
  }

  return {
    h: round(h * 360),
    w: round(min * 100),
    b: round((1 - max) * 100),
    ...(rgb.a !== undefined && { a: rgb.a }),
  }
}

/**
 * Convert HWB to RGB
 */
export function hwbToRgb(hwb: HWB): RGB {
  const h = hwb.h / 360
  const w = hwb.w / 100
  const b = hwb.b / 100

  const ratio = w + b
  let f: number

  // If w + b >= 1, it's a shade of gray
  if (ratio >= 1) {
    f = w / ratio
    return {
      r: round(f * 255),
      g: round(f * 255),
      b: round(f * 255),
      ...(hwb.a !== undefined && { a: hwb.a }),
    }
  }

  const v = 1 - b
  const s = 1 - w / v

  // Convert to HSV and then to RGB
  const hsv: HSV = { h: h * 360, s: s * 100, v: v * 100 }
  return hsvToRgb(hsv)
}

/**
 * Convert HSL to HSV
 */
export function hslToHsv(hsl: HSL): HSV {
  const h = hsl.h
  const s = hsl.s / 100
  const l = hsl.l / 100

  const v = l + s * Math.min(l, 1 - l)
  const sNew = v === 0 ? 0 : 2 * (1 - l / v)

  return {
    h,
    s: round(sNew * 100),
    v: round(v * 100),
    ...(hsl.a !== undefined && { a: hsl.a }),
  }
}

/**
 * Convert HSV to HSL
 */
export function hsvToHsl(hsv: HSV): HSL {
  const h = hsv.h
  const s = hsv.s / 100
  const v = hsv.v / 100

  const l = v * (1 - s / 2)
  const sNew = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)

  return {
    h,
    s: round(sNew * 100),
    l: round(l * 100),
    ...(hsv.a !== undefined && { a: hsv.a }),
  }
}

/**
 * Parse CSS color string
 */
export function parseColorString(input: string): RGB | null {
  // Remove spaces
  input = input.trim().toLowerCase()

  // Hex color
  if (input.startsWith('#')) {
    return hexToRgb(input)
  }

  // RGB/RGBA
  const rgbMatch = input.match(/^rgba?\(([^)]+)\)/)
  if (rgbMatch) {
    const values = rgbMatch[1].split(/,\s*/).map(v => Number.parseFloat(v))
    if (values.length >= 3) {
      return {
        r: clamp(values[0], 0, 255),
        g: clamp(values[1], 0, 255),
        b: clamp(values[2], 0, 255),
        ...(values[3] !== undefined && { a: clamp(values[3], 0, 1) }),
      }
    }
  }

  // HSL/HSLA
  const hslMatch = input.match(/^hsla?\(([^)]+)\)/)
  if (hslMatch) {
    const values = hslMatch[1].split(/,\s*/).map(v => Number.parseFloat(v))
    if (values.length >= 3) {
      return hslToRgb({
        h: values[0],
        s: values[1],
        l: values[2],
        ...(values[3] !== undefined && { a: clamp(values[3], 0, 1) }),
      })
    }
  }

  return null
}
