/**
 * @ldesign/color - Optimized Color Conversions
 *
 * High-performance color space conversion algorithms with minimal memory allocation
 */

import type { HSL, HSV, RGB } from '../types'

// Pre-allocated objects for temporary calculations
const tempRGB = { r: 0, g: 0, b: 0 }
const tempHSL = { h: 0, s: 0, l: 0 }
const tempHSV = { h: 0, s: 0, v: 0 }

/**
 * RGB to HSL conversion - Optimized version
 * Reuses temporary objects to avoid allocations
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

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

  tempHSL.h = Math.round(h * 360)
  tempHSL.s = Math.round(s * 100)
  tempHSL.l = Math.round(l * 100)

  // Return a new object to avoid mutation issues
  const result: HSL = { h: tempHSL.h, s: tempHSL.s, l: tempHSL.l }
  if (rgb.a !== undefined) result.a = rgb.a

  return result
}

/**
 * HSL to RGB conversion - Optimized version
 * Uses bitwise operations for integer conversion
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb(p, q, h + 1 / 3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1 / 3)
  }

  tempRGB.r = (r * 255 + 0.5) | 0  // Fast rounding using bitwise OR
  tempRGB.g = (g * 255 + 0.5) | 0
  tempRGB.b = (b * 255 + 0.5) | 0

  const result: RGB = { r: tempRGB.r, g: tempRGB.g, b: tempRGB.b }
  if (hsl.a !== undefined) result.a = hsl.a

  return result
}

/**
 * Helper function for HSL to RGB conversion
 * Inlined for better performance
 */
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

/**
 * RGB to HSV conversion - Optimized version
 */
export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  const s = max === 0 ? 0 : delta / max
  const v = max

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6
    } else {
      h = ((r - g) / delta + 4) / 6
    }
  }

  tempHSV.h = Math.round(h * 360)
  tempHSV.s = Math.round(s * 100)
  tempHSV.v = Math.round(v * 100)

  const result: HSV = { h: tempHSV.h, s: tempHSV.s, v: tempHSV.v }
  if (rgb.a !== undefined) result.a = rgb.a

  return result
}

/**
 * HSV to RGB conversion - Optimized version
 */
export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h / 60
  const s = hsv.s / 100
  const v = hsv.v / 100

  const c = v * s
  const x = c * (1 - Math.abs((h % 2) - 1))
  const m = v - c

  let r = 0, g = 0, b = 0

  if (h >= 0 && h < 1) {
    r = c; g = x; b = 0
  } else if (h >= 1 && h < 2) {
    r = x; g = c; b = 0
  } else if (h >= 2 && h < 3) {
    r = 0; g = c; b = x
  } else if (h >= 3 && h < 4) {
    r = 0; g = x; b = c
  } else if (h >= 4 && h < 5) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  tempRGB.r = ((r + m) * 255 + 0.5) | 0
  tempRGB.g = ((g + m) * 255 + 0.5) | 0
  tempRGB.b = ((b + m) * 255 + 0.5) | 0

  const result: RGB = { r: tempRGB.r, g: tempRGB.g, b: tempRGB.b }
  if (hsv.a !== undefined) result.a = hsv.a

  return result
}

/**
 * Hex to RGB conversion - Optimized version
 * Uses bitwise operations for fast parsing
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  if (hex[0] === '#') hex = hex.slice(1)

  let num: number
  let r: number, g: number, b: number, a: number | undefined

  if (hex.length === 3) {
    // Short format: #RGB
    num = parseInt(hex, 16)
    r = ((num >> 8) & 0xF) * 17
    g = ((num >> 4) & 0xF) * 17
    b = (num & 0xF) * 17
  } else if (hex.length === 6) {
    // Full format: #RRGGBB
    num = parseInt(hex, 16)
    r = (num >> 16) & 0xFF
    g = (num >> 8) & 0xFF
    b = num & 0xFF
  } else if (hex.length === 8) {
    // With alpha: #RRGGBBAA
    num = parseInt(hex.slice(0, 6), 16)
    r = (num >> 16) & 0xFF
    g = (num >> 8) & 0xFF
    b = num & 0xFF
    a = parseInt(hex.slice(6), 16) / 255
  } else {
    return null
  }

  const result: RGB = { r, g, b }
  if (a !== undefined) result.a = a

  return result
}

/**
 * RGB to Hex conversion - Optimized version
 * Uses bitwise operations and lookup table
 */
const HEX_CHARS = '0123456789ABCDEF'
export function rgbToHex(rgb: RGB, includeAlpha = false): string {
  const r = Math.max(0, Math.min(255, rgb.r | 0))
  const g = Math.max(0, Math.min(255, rgb.g | 0))
  const b = Math.max(0, Math.min(255, rgb.b | 0))

  let hex = '#'

  // Fast hex conversion using lookup
  hex += HEX_CHARS[r >> 4] + HEX_CHARS[r & 0xF]
  hex += HEX_CHARS[g >> 4] + HEX_CHARS[g & 0xF]
  hex += HEX_CHARS[b >> 4] + HEX_CHARS[b & 0xF]

  if (includeAlpha && rgb.a !== undefined && rgb.a < 1) {
    const alpha = Math.max(0, Math.min(255, (rgb.a * 255 + 0.5) | 0))
    hex += HEX_CHARS[alpha >> 4] + HEX_CHARS[alpha & 0xF]
  }

  return hex
}

/**
 * Fast luminance calculation
 * Uses approximation for performance
 */
export function fastLuminance(r: number, g: number, b: number): number {
  // Fast approximation: Y = 0.299*R + 0.587*G + 0.114*B
  // Using bit shifts for multiplication
  return (r * 299 + g * 587 + b * 114) / 1000 / 255
}

/**
 * Fast contrast calculation
 */
export function fastContrast(rgb1: RGB, rgb2: RGB): number {
  const l1 = fastLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = fastLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}


