/**
 * @ldesign/color - Optimized Core Color Class
 *
 * Memory-efficient Color implementation with reduced footprint
 */

import type { BlendMode, ColorFormat, ColorInput, HarmonyType, HSL, HSV, RGB, TextSize, WCAGLevel } from '../types'
import { ColorCache } from '../utils/cache'
import { clamp } from '../utils/math'
import { ObjectPool, poolManager } from '../utils/objectPool'
import { parseColorInput } from '../utils/validators'
import { getContrast, getLuminance, isWCAGCompliant } from './analysis'
import { hslToRgb, hsvToRgb, rgbToHsl, rgbToHsv } from './conversions'
import { blend } from './manipulations'

/**
 * Optimized Color class with minimal memory footprint
 * - Uses 32-bit integer for RGB storage
 * - Removed redundant methods and caching
 * - Optimized for common use cases
 */
export class Color {
  // Store RGB as single 32-bit integer (0xRRGGBB)
  private _value: number
  private _alpha: number

  // Shared static resources
  private static cache = new ColorCache(30)
  private static colorPool = new ObjectPool<Color>(
    () => new Color(),
    (color) => {
      color._value = 0
      color._alpha = 1
    },
    { maxSize: 10, initialSize: 3 },
  )

  // Register with pool manager
  static {
    poolManager.register('color', Color.colorPool)
  }

  constructor(input: ColorInput = '#000000') {
    const parsed = parseColorInput(input)
    this._value = (parsed.rgb.r << 16) | (parsed.rgb.g << 8) | parsed.rgb.b
    this._alpha = parsed.alpha ?? 1
  }

  // ============================================
  // Static Factory Methods - Optimized
  // ============================================

  static fromRGB(r: number, g: number, b: number, a = 1): Color {
    const color = this.colorPool.acquire()
    // Use bitwise operations for clamping
    color._value = ((clamp(r | 0, 0, 255) << 16) |
      (clamp(g | 0, 0, 255) << 8) |
      clamp(b | 0, 0, 255))
    color._alpha = clamp(a, 0, 1)
    return color
  }

  static fromHSL(h: number, s: number, l: number, a = 1): Color {
    const rgb = hslToRgb({ h, s, l })
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, a)
  }

  static fromHSV(h: number, s: number, v: number, a = 1): Color {
    const rgb = hsvToRgb({ h, s, v })
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, a)
  }

  static random(): Color {
    return Color.fromRGB(
      (Math.random() * 256) | 0,
      (Math.random() * 256) | 0,
      (Math.random() * 256) | 0,
    )
  }

  // ============================================
  // Fast Getters - Direct bit extraction
  // ============================================

  get red(): number { return (this._value >> 16) & 0xFF }
  get green(): number { return (this._value >> 8) & 0xFF }
  get blue(): number { return this._value & 0xFF }
  get alpha(): number { return this._alpha }

  // ============================================
  // Optimized Conversion Methods
  // ============================================

  toHex(includeAlpha = false): string {
    const hex = `#${(`000000${this._value.toString(16)}`).slice(-6).toUpperCase()}`

    if (includeAlpha && this._alpha < 1) {
      return hex + (`0${((this._alpha * 255) | 0).toString(16)}`).slice(-2).toUpperCase()
    }
    return hex
  }

  toRGB(): RGB {
    const rgb: RGB = {
      r: (this._value >> 16) & 0xFF,
      g: (this._value >> 8) & 0xFF,
      b: this._value & 0xFF,
    }
    if (this._alpha < 1) rgb.a = this._alpha
    return rgb
  }

  toRGBString(): string {
    const r = (this._value >> 16) & 0xFF
    const g = (this._value >> 8) & 0xFF
    const b = this._value & 0xFF

    return this._alpha < 1
      ? `rgba(${r}, ${g}, ${b}, ${this._alpha})`
      : `rgb(${r}, ${g}, ${b})`
  }

  toHSL(): HSL {
    const rgb = this.toRGB()
    const hsl = rgbToHsl(rgb)
    if (this._alpha < 1) hsl.a = this._alpha
    return hsl
  }

  toHSLString(): string {
    const { h, s, l } = this.toHSL()
    return this._alpha < 1
      ? `hsla(${h}, ${s}%, ${l}%, ${this._alpha})`
      : `hsl(${h}, ${s}%, ${l}%)`
  }

  toHSV(): HSV {
    const rgb = this.toRGB()
    const hsv = rgbToHsv(rgb)
    if (this._alpha < 1) hsv.a = this._alpha
    return hsv
  }

  toString(format: ColorFormat = 'hex'): string {
    switch (format) {
      case 'hex': return this.toHex()
      case 'rgb':
      case 'rgba': return this.toRGBString()
      case 'hsl':
      case 'hsla': return this.toHSLString()
      default: return this.toHex()
    }
  }

  // ============================================
  // Optimized Manipulation Methods
  // ============================================

  lighten(amount: number): Color {
    const hsl = this.toHSL()
    hsl.l = clamp(hsl.l + amount, 0, 100)
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this._alpha)
  }

  darken(amount: number): Color {
    return this.lighten(-amount)
  }

  saturate(amount: number): Color {
    const hsl = this.toHSL()
    hsl.s = clamp(hsl.s + amount, 0, 100)
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this._alpha)
  }

  desaturate(amount: number): Color {
    return this.saturate(-amount)
  }

  rotate(degrees: number): Color {
    const hsl = this.toHSL()
    hsl.h = ((hsl.h + degrees) % 360 + 360) % 360
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this._alpha)
  }

  grayscale(): Color {
    return this.desaturate(100)
  }

  invert(): Color {
    return Color.fromRGB(
      255 - ((this._value >> 16) & 0xFF),
      255 - ((this._value >> 8) & 0xFF),
      255 - (this._value & 0xFF),
      this._alpha
    )
  }

  setAlpha(value: number): Color {
    const color = this.clone()
    color._alpha = clamp(value, 0, 1)
    return color
  }

  fade(amount: number): Color {
    return this.setAlpha(clamp(this._alpha - amount / 100, 0, 1))
  }

  // ============================================
  // Optimized Mixing & Analysis
  // ============================================

  mix(color: ColorInput, amount = 50): Color {
    const other = color instanceof Color ? color : new Color(color)
    const ratio = amount / 100
    const invRatio = 1 - ratio

    const r1 = (this._value >> 16) & 0xFF
    const g1 = (this._value >> 8) & 0xFF
    const b1 = this._value & 0xFF

    const r2 = (other._value >> 16) & 0xFF
    const g2 = (other._value >> 8) & 0xFF
    const b2 = other._value & 0xFF

    return Color.fromRGB(
      (r1 * invRatio + r2 * ratio) | 0,
      (g1 * invRatio + g2 * ratio) | 0,
      (b1 * invRatio + b2 * ratio) | 0,
      this._alpha * invRatio + other._alpha * ratio
    )
  }

  blend(color: ColorInput, mode: BlendMode = 'normal'): Color {
    const other = color instanceof Color ? color : new Color(color)
    const rgb = blend(this.toRGB(), other.toRGB(), mode)
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, this._alpha)
  }

  getLuminance(): number {
    return getLuminance(this.toRGB())
  }

  contrast(color: ColorInput): number {
    const other = color instanceof Color ? color : new Color(color)
    return getContrast(this.toRGB(), other.toRGB())
  }

  isLight(): boolean {
    return this.getLuminance() > 0.5
  }

  isDark(): boolean {
    return !this.isLight()
  }

  isWCAGCompliant(
    background: ColorInput,
    level: WCAGLevel = 'AA',
    size: TextSize = 'normal',
  ): boolean {
    const bg = background instanceof Color ? background : new Color(background)
    return isWCAGCompliant(this.toRGB(), bg.toRGB(), level, size)
  }

  // ============================================
  // Simple Harmony Methods
  // ============================================

  complementary(): Color {
    return this.rotate(180)
  }

  // ============================================
  // Utility Methods
  // ============================================

  clone(): Color {
    const color = Color.colorPool.acquire()
    color._value = this._value
    color._alpha = this._alpha
    return color
  }

  release(): void {
    Color.colorPool.release(this)
  }

  dispose(): void {
    this.release()
  }

  equals(color: ColorInput): boolean {
    const other = color instanceof Color ? color : new Color(color)
    return this._value === other._value && this._alpha === other._alpha
  }

  distance(color: ColorInput): number {
    const other = color instanceof Color ? color : new Color(color)
    const dr = ((this._value >> 16) & 0xFF) - ((other._value >> 16) & 0xFF)
    const dg = ((this._value >> 8) & 0xFF) - ((other._value >> 8) & 0xFF)
    const db = (this._value & 0xFF) - (other._value & 0xFF)
    return Math.sqrt(dr * dr + dg * dg + db * db)
  }

  isValid(): boolean {
    return this._value >= 0 && this._value <= 0xFFFFFF &&
      this._alpha >= 0 && this._alpha <= 1
  }

  // ============================================
  // Static cleanup
  // ============================================

  static cleanup(): void {
    this.cache.clear()
    this.colorPool.clear()
  }
}

// Export common color constants
export const Colors = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0000FF',
  YELLOW: '#FFFF00',
  CYAN: '#00FFFF',
  MAGENTA: '#FF00FF',
  TRANSPARENT: 'rgba(0,0,0,0)'
}

