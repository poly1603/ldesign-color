/**
 * @ldesign/color - Core Color Class
 *
 * The main Color class for basic color operations
 */

import type { BlendMode, ColorFormat, ColorInput, HarmonyType, HSL, HSV, LAB, LCH, OKLAB, OKLCH, RGB, TextSize, WCAGLevel, XYZ } from '../types'
import { ColorCache } from '../utils/cache'
import { clamp, round } from '../utils/math'
import { acquireHSL, acquireRGB, ObjectPool, poolManager, releaseHSL, releaseRGB } from '../utils/objectPool'
import { parseColorInput } from '../utils/validators'
// Tree-shakeable import - only included if advanced color spaces are used
import { deltaE2000, deltaEOKLAB, rgbToLAB, rgbToLCH, rgbToOKLAB, rgbToOKLCH, rgbToXYZ } from './advancedColorSpaces'
import { getContrast, getLuminance, isWCAGCompliant } from './analysis'
import { hslToRgb, hsvToRgb, rgbToHsl, rgbToHsv } from './conversions'
import { blend } from './manipulations'

/**
 * Optimized Color class with reduced memory footprint
 * Uses 32-bit integer for RGB storage instead of object
 */
export class Color {
  // Store RGB as single 32-bit integer (0xRRGGBB)
  private _value: number
  private _alpha: number
  // Lazy computed values - only cache hex string to save memory
  private _hex?: string
  // Remove HSL/HSV cache to save memory (40 bytes each)

  // Shared cache - reduced size
  private static cache = new ColorCache(50)

  // Color object pool using centralized pool manager
  private static colorPool = new ObjectPool<Color>(
    () => new Color(),
    (color) => {
      color._hex = undefined
      color._value = 0
      color._alpha = 1
    },
    { maxSize: 15, initialSize: 5 },
  )

  // Register Color pool with global manager
  static {
    poolManager.register('color', Color.colorPool)
  }

  constructor(input: ColorInput = '#000000') {
    const parsed = parseColorInput(input)
    // Pack RGB into single integer
    this._value = (parsed.rgb.r << 16) | (parsed.rgb.g << 8) | parsed.rgb.b
    this._alpha = parsed.alpha ?? 1
  }

  // ============================================
  // Static Factory Methods
  // ============================================

  /**
   * Create a Color from RGB values
   *
   * Uses object pooling for optimal performance. Objects are reused
   * from pool when available.
   *
   * @param r - Red channel (0-255)
   * @param g - Green channel (0-255)
   * @param b - Blue channel (0-255)
   * @param a - Alpha channel (0-1), optional
   * @returns New Color instance
   * @performance O(1) - Uses object pool for fast allocation
   * @example
   * ```ts
   * const color = Color.fromRGB(59, 130, 246);
   * const transparent = Color.fromRGB(255, 0, 0, 0.5);
   * ```
   */
  static fromRGB(r: number, g: number, b: number, a?: number): Color {
    // Clamp and pack RGB using bitwise operations
    r = clamp(r | 0, 0, 255)
    g = clamp(g | 0, 0, 255)
    b = clamp(b | 0, 0, 255)

    // Try to reuse from pool
    const color = this.colorPool.acquire()

    color._value = (r << 16) | (g << 8) | b
    color._alpha = a !== undefined ? clamp(a, 0, 1) : 1
    color._hex = undefined
    return color
  }

  /**
   * Create a Color from HSL values
   */
  static fromHSL(h: number, s: number, l: number, a?: number): Color {
    const rgb = hslToRgb({ h, s, l })
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, a)
  }

  /**
   * Create a Color from HSV values
   */
  static fromHSV(h: number, s: number, v: number, a?: number): Color {
    const rgb = hsvToRgb({ h, s, v })
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, a)
  }

  /**
   * Create a random color
   */
  static random(): Color {
    return Color.fromRGB(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    )
  }

  // ============================================
  // Getters
  // ============================================

  get red(): number {
    return (this._value >> 16) & 0xFF
  }

  get green(): number {
    return (this._value >> 8) & 0xFF
  }

  get blue(): number {
    return this._value & 0xFF
  }

  get alpha(): number {
    return this._alpha
  }

  get hue(): number {
    return this.toHSL().h
  }

  get saturation(): number {
    return this.toHSL().s
  }

  get lightness(): number {
    return this.toHSL().l
  }

  get brightness(): number {
    return this.toHSV().v
  }

  // ============================================
  // Conversion Methods
  // ============================================

  /**
   * Convert to hex string - Cached and optimized
   */
  toHex(includeAlpha = false): string {
    if (!includeAlpha && this._hex) {
      return this._hex
    }

    // Fast hex conversion using bit operations
    const hex = `#${(`000000${this._value.toString(16)}`).slice(-6).toUpperCase()}`

    if (!includeAlpha) {
      this._hex = hex
      return hex
    }

    if (this._alpha < 1) {
      const alpha = (`0${((this._alpha * 255) | 0).toString(16)}`).slice(-2)
      return hex + alpha
    }
    return hex
  }

  /**
   * Convert to RGB object
   *
   * Returns an RGB object from the pool. Remember to release it
   * back to the pool when done using Color.returnRGB(rgb).
   *
   * @returns RGB color object
   * @performance O(1) - Uses object pool
   * @example
   * ```ts
   * const rgb = color.toRGB();
   * console.log(rgb); // { r: 59, g: 130, b: 246 }
   * // Remember to release when done:
   * // Color.returnRGB(rgb);
   * ```
   */
  toRGB(): RGB {
    const rgb = acquireRGB()

    rgb.r = (this._value >> 16) & 0xFF
    rgb.g = (this._value >> 8) & 0xFF
    rgb.b = this._value & 0xFF

    if (this._alpha < 1) {
      rgb.a = this._alpha
    }
    else {
      delete rgb.a
    }
    return rgb
  }

  /**
   * Get RGB values directly as tuple - Zero allocations
   *
   * Use this for performance-critical paths where you need RGB values
   * but don't want any object allocations.
   *
   * @returns Tuple [r, g, b, alpha]
   * @performance O(1) - No allocations
   * @example
   * ```ts
   * const [r, g, b, a] = color.toRGBDirect();
   * ```
   */
  toRGBDirect(): [number, number, number, number] {
    return [
      (this._value >> 16) & 0xFF,
      (this._value >> 8) & 0xFF,
      this._value & 0xFF,
      this._alpha,
    ]
  }

  /**
   * Return RGB object to pool
   *
   * Call this when you're done with an RGB object obtained from toRGB()
   * to return it to the pool for reuse.
   *
   * @param rgb - RGB object to return to pool
   */
  static returnRGB(rgb: RGB): void {
    releaseRGB(rgb)
  }

  /**
   * Convert to RGB string - Direct from packed value
   */
  toRGBString(): string {
    const r = (this._value >> 16) & 0xFF
    const g = (this._value >> 8) & 0xFF
    const b = this._value & 0xFF

    return this._alpha < 1
      ? `rgba(${r}, ${g}, ${b}, ${this._alpha})`
      : `rgb(${r}, ${g}, ${b})`
  }

  /**
   * Convert to HSL object - No caching to save memory
   */
  toHSL(): HSL {
    const rgb = this.toRGB()
    const hsl = rgbToHsl(rgb)
    Color.returnRGB(rgb) // Return RGB to pool
    if (this._alpha < 1)
      hsl.a = this._alpha
    return hsl
  }

  /**
   * Convert to HSL string
   */
  toHSLString(): string {
    const { h, s, l } = this.toHSL()
    if (this._alpha < 1) {
      return `hsla(${round(h)}, ${round(s)}%, ${round(l)}%, ${this._alpha})`
    }
    return `hsl(${round(h)}, ${round(s)}%, ${round(l)}%)`
  }

  /**
   * Convert to HSV object - No caching to save memory
   */
  toHSV(): HSV {
    const rgb = this.toRGB()
    const hsv = rgbToHsv(rgb)
    Color.returnRGB(rgb) // Return RGB to pool
    if (this._alpha < 1)
      hsv.a = this._alpha
    return hsv
  }

  /**
   * Convert to OKLCH color space (perceptually uniform)
   *
   * OKLCH is a perceptually uniform color space that provides
   * smooth interpolation and consistent brightness.
   *
   * @returns OKLCH color object
   * @performance O(1) - Uses optimized matrix transformations
   * @example
   * ```ts
   * const color = new Color('#3498db');
   * const oklch = color.toOKLCH();
   * console.log(oklch); // { l: 0.67, c: 0.13, h: 258 }
   * ```
   */
  toOKLCH(): OKLCH {
    return rgbToOKLCH(this.toRGB())
  }

  /**
   * Convert to OKLAB color space (perceptually uniform)
   *
   * OKLAB is Björn Ottosson's perceptually uniform color space.
   *
   * @returns OKLAB color object
   * @performance O(1) - Optimized cube root calculations
   * @example
   * ```ts
   * const color = new Color('#e74c3c');
   * const oklab = color.toOKLAB();
   * ```
   */
  toOKLAB(): OKLAB {
    return rgbToOKLAB(this.toRGB())
  }

  /**
   * Convert to CIE LAB color space
   *
   * LAB is a device-independent color space that approximates human vision.
   *
   * @returns LAB color object
   * @performance O(1) - Uses XYZ intermediate conversion
   * @example
   * ```ts
   * const color = new Color('#2ecc71');
   * const lab = color.toLAB();
   * ```
   */
  toLAB(): LAB {
    return rgbToLAB(this.toRGB())
  }

  /**
   * Convert to CIE LCH color space
   *
   * LCH is cylindrical representation of LAB (Lightness, Chroma, Hue).
   *
   * @returns LCH color object
   * @performance O(1) - Cylindrical transformation
   * @example
   * ```ts
   * const color = new Color('#9b59b6');
   * const lch = color.toLCH();
   * ```
   */
  toLCH(): LCH {
    return rgbToLCH(this.toRGB())
  }

  /**
   * Convert to CIE XYZ color space
   *
   * XYZ is a linear color space based on CIE color matching functions.
   *
   * @returns XYZ color object
   * @performance O(1) - Matrix multiplication
   * @example
   * ```ts
   * const color = new Color('#f39c12');
   * const xyz = color.toXYZ();
   * ```
   */
  toXYZ(): XYZ {
    return rgbToXYZ(this.toRGB())
  }

  /**
   * Convert to string based on format
   */
  toString(format: ColorFormat = 'hex'): string {
    switch (format) {
      case 'hex':
        return this.toHex()
      case 'rgb':
      case 'rgba':
        return this.toRGBString()
      case 'hsl':
      case 'hsla':
        return this.toHSLString()
      default:
        return this.toHex()
    }
  }

  // ============================================
  // Manipulation Methods
  // ============================================

  /**
   * Lighten the color
   */
  lighten(amount: number): Color {
    const hsl = this.toHSL()
    hsl.l = clamp(hsl.l + amount, 0, 100)
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this._alpha)
  }

  /**
   * Darken the color
   */
  darken(amount: number): Color {
    return this.lighten(-amount)
  }

  /**
   * Saturate the color
   */
  saturate(amount: number): Color {
    const hsl = this.toHSL()
    hsl.s = clamp(hsl.s + amount, 0, 100)
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this._alpha)
  }

  /**
   * Desaturate the color
   */
  desaturate(amount: number): Color {
    return this.saturate(-amount)
  }

  /**
   * Rotate the hue
   */
  rotate(degrees: number): Color {
    const hsl = this.toHSL()
    hsl.h = (hsl.h + degrees) % 360
    if (hsl.h < 0)
      hsl.h += 360
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this._alpha)
  }

  /**
   * Convert to grayscale
   */
  grayscale(): Color {
    return this.desaturate(100)
  }

  /**
   * Invert the color
   */
  invert(): Color {
    const r = 255 - ((this._value >> 16) & 0xFF)
    const g = 255 - ((this._value >> 8) & 0xFF)
    const b = 255 - (this._value & 0xFF)
    return Color.fromRGB(r, g, b, this._alpha)
  }

  /**
   * Return this Color object to pool for reuse
   *
   * Call this method when you're done with a Color object
   * to return it to the pool for reuse. This helps reduce
   * garbage collection pressure.
   *
   * @example
   * ```ts
   * const color = Color.fromRGB(255, 0, 0);
   * // ... use color ...
   * color.release();
   * ```
   */
  release(): void {
    Color.colorPool.release(this)
  }

  /**
   * Cleanup static resources
   *
   * Clears all caches and pools. Useful for testing or
   * when you want to free memory.
   */
  static cleanup(): void {
    this.cache.clear()
    this.colorPool.clear()
    // Clear RGB/HSL pools from objectPool module
    rgbPool.clear()
    hslPool.clear()
    hsvPool.clear()
  }

  /**
   * 获取对象池统计信息
   *
   * 返回颜色对象池的详细统计信息,包括池大小、命中率、利用率等。
   * 仅在开发模式下返回完整信息,生产模式下返回简化信息以减少开销。
   *
   * @returns 对象池统计信息
   * @example
   * ```ts
   * const stats = Color.getPoolStats()
   * console.log(`池大小: ${stats.poolSize}/${stats.maxSize}`)
   * console.log(`命中率: ${(stats.hitRate * 100).toFixed(2)}%`)
   * console.log(`利用率: ${stats.utilization.toFixed(2)}%`)
   * ```
   */
  static getPoolStats() {
    return this.colorPool.getStats()
  }

  /**
   * 检查对象池健康状态
   *
   * 在开发模式下检查对象池的健康状态,如果发现潜在问题会输出警告。
   * 检查项包括:
   * - 池利用率过高(>90%)
   * - 命中率过低(<50%)
   * - 已分配对象数量异常
   *
   * 生产模式下此方法不执行任何操作,避免性能开销。
   *
   * @example
   * ```ts
   * // 在开发环境中定期检查
   * if (import.meta.env.DEV) {
   *   setInterval(() => {
   *     Color.checkPoolHealth()
   *   }, 60000) // 每分钟检查一次
   * }
   * ```
   */
  static checkPoolHealth(): void {
    // 仅在开发模式下执行检查
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      const stats = this.getPoolStats()

      // 检查池利用率
      if (stats.utilization > 90) {
        console.warn(
          `[Color] 对象池利用率过高: ${stats.utilization.toFixed(2)}% (${stats.poolSize}/${stats.maxSize})`,
          '\n建议: 考虑增加 maxSize 或检查是否有对象未正确释放',
        )
      }

      // 检查命中率
      if (stats.hits + stats.misses > 100 && stats.hitRate < 0.5) {
        console.warn(
          `[Color] 对象池命中率较低: ${(stats.hitRate * 100).toFixed(2)}%`,
          '\n建议: 考虑增加池大小以提高复用率',
        )
      }

      // 检查已分配对象数量
      if (stats.allocated > stats.maxSize * 2) {
        console.warn(
          `[Color] 已分配对象数量异常: ${stats.allocated} (池大小: ${stats.maxSize})`,
          '\n建议: 检查是否有对象未调用 release() 方法',
        )
      }
    }
  }

  /**
   * Set alpha value
   */
  setAlpha(value: number): Color {
    const color = this.clone()
    color._alpha = clamp(value, 0, 1)
    return color
  }

  /**
   * Fade the color (reduce alpha)
   */
  fade(amount: number): Color {
    return this.setAlpha(clamp(this._alpha - amount / 100, 0, 1))
  }

  // ============================================
  // Mixing & Blending
  // ============================================

  /**
   * Mix with another color - Optimized
   */
  mix(color: ColorInput, amount = 50): Color {
    const other = color instanceof Color ? color : new Color(color)
    const ratio = amount / 100
    const invRatio = 1 - ratio

    // Direct bit manipulation
    const r1 = (this._value >> 16) & 0xFF
    const g1 = (this._value >> 8) & 0xFF
    const b1 = this._value & 0xFF

    const r2 = (other._value >> 16) & 0xFF
    const g2 = (other._value >> 8) & 0xFF
    const b2 = other._value & 0xFF

    const r = (r1 * invRatio + r2 * ratio) | 0
    const g = (g1 * invRatio + g2 * ratio) | 0
    const b = (b1 * invRatio + b2 * ratio) | 0
    const alpha = this._alpha * invRatio + other._alpha * ratio

    return Color.fromRGB(r, g, b, alpha)
  }

  /**
   * Blend with another color using a blend mode
   */
  blend(color: ColorInput, mode: BlendMode = 'normal'): Color {
    const other = color instanceof Color ? color : new Color(color)
    const rgb = blend(this.toRGB(), other.toRGB(), mode)
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, this._alpha)
  }

  // ============================================
  // Analysis Methods
  // ============================================

  /**
   * Get the luminance of the color
   */
  getLuminance(): number {
    return getLuminance(this.toRGB())
  }

  /**
   * Get contrast ratio with another color
   */
  contrast(color: ColorInput): number {
    const other = color instanceof Color ? color : new Color(color)
    return getContrast(this.toRGB(), other.toRGB())
  }

  /**
   * Check if the color is light
   */
  isLight(): boolean {
    return this.getLuminance() > 0.5
  }

  /**
   * Check if the color is dark
   */
  isDark(): boolean {
    return !this.isLight()
  }

  /**
   * Check WCAG compliance with another color
   */
  isWCAGCompliant(
    background: ColorInput,
    level: WCAGLevel = 'AA',
    size: TextSize = 'normal',
  ): boolean {
    const bg = background instanceof Color ? background : new Color(background)
    return isWCAGCompliant(this.toRGB(), bg.toRGB(), level, size)
  }

  // ============================================
  // Harmony Methods
  // ============================================

  /**
   * Get complementary color
   */
  complementary(): Color {
    return this.rotate(180)
  }

  /**
   * Get analogous colors
   */
  analogous(angle = 30): [Color, Color] {
    return [this.rotate(-angle), this.rotate(angle)]
  }

  /**
   * Get triadic colors
   */
  triadic(): [Color, Color] {
    return [this.rotate(120), this.rotate(240)]
  }

  /**
   * Get tetradic colors
   */
  tetradic(): [Color, Color, Color] {
    return [this.rotate(90), this.rotate(180), this.rotate(270)]
  }

  /**
   * Get split complementary colors
   */
  splitComplementary(angle = 30): [Color, Color] {
    const complement = this.rotate(180)
    return [complement.rotate(-angle), complement.rotate(angle)]
  }

  /**
   * Generate a harmony based on type
   */
  harmony(type: HarmonyType): Color[] {
    switch (type) {
      case 'complementary':
        return [this, this.complementary()]
      case 'analogous':
        return [this, ...this.analogous()]
      case 'triadic':
        return [this, ...this.triadic()]
      case 'tetradic':
        return [this, ...this.tetradic()]
      case 'split-complementary':
        return [this, ...this.splitComplementary()]
      case 'monochromatic':
        return [
          this,
          this.lighten(15),
          this.lighten(30),
          this.darken(15),
          this.darken(30),
        ]
      default:
        return [this]
    }
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Clone the color
   *
   * Creates a new Color instance with the same values.
   * Uses object pooling for performance.
   *
   * @returns Cloned Color instance
   * @performance O(1) - Uses object pool
   * @example
   * ```ts
   * const color1 = new Color('#3498db');
   * const color2 = color1.clone();
   * ```
   */
  clone(): Color {
    const color = Color.colorPool.acquire()
    color._value = this._value
    color._alpha = this._alpha
    color._hex = undefined // Don't copy cached values
    return color
  }

  /**
   * Dispose and return color to pool for reuse
   *
   * Alias for release(). Returns this Color object to the pool.
   *
   * @example
   * ```ts
   * const color = Color.fromRGB(255, 0, 0);
   * color.dispose();
   * ```
   */
  dispose(): void {
    this.release()
  }

  /**
   * Check equality with another color - Fast comparison
   */
  equals(color: ColorInput): boolean {
    const other = color instanceof Color ? color : new Color(color)
    return this._value === other._value && this._alpha === other._alpha
  }

  /**
   * Get distance to another color - Optimized (Euclidean distance in RGB)
   */
  distance(color: ColorInput): number {
    const other = color instanceof Color ? color : new Color(color)
    const dr = ((this._value >> 16) & 0xFF) - ((other._value >> 16) & 0xFF)
    const dg = ((this._value >> 8) & 0xFF) - ((other._value >> 8) & 0xFF)
    const db = (this._value & 0xFF) - (other._value & 0xFF)
    // Avoid sqrt for performance when possible
    return Math.sqrt(dr * dr + dg * dg + db * db)
  }

  /**
   * Get perceptual color difference using Delta E 2000
   *
   * Returns a value where:
   * - 0 = identical colors
   * - <1 = imperceptible difference
   * - 1-2 = barely perceptible
   * - 2-10 = perceptible at a glance
   * - >10 = colors are significantly different
   *
   * @param color - Color to compare with
   * @returns Delta E 2000 value
   * @performance O(1) - Complex but optimized calculation
   * @example
   * ```ts
   * const red = new Color('#ff0000');
   * const pink = new Color('#ff6b6b');
   * const diff = red.deltaE2000(pink);
   * console.log(diff); // ~30 (perceptible difference)
   * ```
   */
  deltaE2000(color: ColorInput): number {
    const other = color instanceof Color ? color : new Color(color)
    return deltaE2000(this.toRGB(), other.toRGB())
  }

  /**
   * Get perceptual color difference using OKLAB (faster than Delta E 2000)
   *
   * Provides a faster approximation of perceptual difference using
   * Euclidean distance in OKLAB color space.
   *
   * @param color - Color to compare with
   * @returns OKLAB distance
   * @performance O(1) - Faster than Delta E 2000
   * @example
   * ```ts
   * const blue = new Color('#0000ff');
   * const cyan = new Color('#00ffff');
   * const diff = blue.deltaEOKLAB(cyan);
   * ```
   */
  deltaEOKLAB(color: ColorInput): number {
    const other = color instanceof Color ? color : new Color(color)
    return deltaEOKLAB(this.toRGB(), other.toRGB())
  }

  /**
   * Check if color is valid - Simple check
   */
  isValid(): boolean {
    return this._value >= 0 && this._value <= 0xFFFFFF
      && this._alpha >= 0 && this._alpha <= 1
  }


  /**
   * 获取最佳文本颜色(黑色或白色)
   *
   * 根据背景色的亮度自动选择对比度最高的文本颜色
   *
   * @returns 黑色或白色 Color 实例
   * @example
   * ```ts
   * const bg = new Color('#3B82F6')
   * const textColor = bg.getBestTextColor()
   * console.log(textColor.toHex()) // '#FFFFFF' (白色)
   * ```
   */
  getBestTextColor(): Color {
    return this.isDark() ? Colors.white() : Colors.black()
  }

  /**
   * 批量生成色阶
   *
   * 生成从当前颜色到目标颜色的渐变色阶
   *
   * @param targetColor - 目标颜色
   * @param steps - 色阶数量(包含起始和结束颜色)
   * @returns 颜色数组
   * @example
   * ```ts
   * const blue = new Color('#0000FF')
   * const white = new Color('#FFFFFF')
   * const scale = blue.generateScale(white, 5)
   * // 返回 5 个颜色: [蓝色, 浅蓝, 更浅蓝, 很浅蓝, 白色]
   * ```
   */
  generateScale(targetColor: ColorInput, steps: number): Color[] {
    if (steps < 2) {
      throw new Error('步数必须至少为 2')
    }

    const target = targetColor instanceof Color ? targetColor : new Color(targetColor)
    const colors: Color[] = []

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1)
      colors.push(this.mix(target, ratio))
    }

    return colors
  }

  /**
   * 获取颜色信息摘要
   *
   * @returns 颜色信息对象
   * @example
   * ```ts
   * const color = new Color('#3B82F6')
   * const info = color.getInfo()
   * console.log(info)
   * // {
   * //   hex: '#3B82F6',
   * //   rgb: { r: 59, g: 130, b: 246 },
   * //   hsl: { h: 217, s: 91, l: 60 },
   * //   luminance: 0.35,
   * //   isDark: true,
   * //   isLight: false
   * // }
   * ```
   */
  getInfo(): {
    hex: string
    rgb: RGB
    hsl: HSL
    luminance: number
    isDark: boolean
    isLight: boolean
  } {
    return {
      hex: this.toHex(true),
      rgb: this.toRGB(),
      hsl: this.toHSL(),
      luminance: this.getLuminance(),
      isDark: this.isDark(),
      isLight: this.isLight(),
    }
  }

  /**
   * Export as JSON
   */
  toJSON(): object {
    return {
      rgb: this.toRGB(),
      hsl: this.toHSL(),
      hsv: this.toHSV(),
      hex: this.toHex(true),
      alpha: this._alpha,
      luminance: this.getLuminance(),
    }
  }

  /**
   * 获取调试信息
   *
   * 返回详细的颜色调试信息,包括所有颜色空间的值
   *
   * @returns 调试信息对象
   *
   * @example
   * ```ts
   * const color = new Color('#3B82F6')
   * console.log(color.debug())
   * // {
   * //   hex: '#3B82F6',
   * //   rgb: { r: 59, g: 130, b: 246 },
   * //   hsl: { h: 217, s: 91, l: 60 },
   * //   hsv: { h: 217, s: 76, v: 96 },
   * //   luminance: 0.35,
   * //   isDark: true,
   * //   isLight: false,
   * //   alpha: 1,
   * //   isValid: true
   * // }
   * ```
   */
  debug(): {
    hex: string
    rgb: RGB
    hsl: HSL
    hsv: HSV
    luminance: number
    isDark: boolean
    isLight: boolean
    alpha: number
    isValid: boolean
  } {
    return {
      hex: this.toHex(true),
      rgb: this.toRGB(),
      hsl: this.toHSL(),
      hsv: this.toHSV(),
      luminance: this.getLuminance(),
      isDark: this.isDark(),
      isLight: this.isLight(),
      alpha: this._alpha,
      isValid: this.isValid(),
    }
  }

}

// Export singleton instance for common colors - cached for reuse
const BLACK = new Color('#000000')
const WHITE = new Color('#FFFFFF')
const RED = new Color('#FF0000')
const GREEN = new Color('#00FF00')
const BLUE = new Color('#0000FF')
const YELLOW = new Color('#FFFF00')
const CYAN = new Color('#00FFFF')
const MAGENTA = new Color('#FF00FF')
const TRANSPARENT = new Color('rgba(0,0,0,0)')

export const Colors = {
  black: () => BLACK.clone(),
  white: () => WHITE.clone(),
  red: () => RED.clone(),
  green: () => GREEN.clone(),
  blue: () => BLUE.clone(),
  yellow: () => YELLOW.clone(),
  cyan: () => CYAN.clone(),
  magenta: () => MAGENTA.clone(),
  transparent: () => TRANSPARENT.clone(),
}
