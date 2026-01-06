/**
 * @ldesign/color - Enhanced Validators
 *
 * 增强型验证工具，提供详细的错误信息和类型守卫
 *
 * @module utils/enhanced-validators
 * @example
 * ```ts
 * import { validateRGBSafe, validateColorInput, isFiniteNumber } from '@ldesign/color-core'
 *
 * // 安全验证 RGB
 * validateRGBSafe({ r: 255, g: 128, b: 0 })
 *
 * // 检查有效颜色输入
 * validateColorInput('#FF0000', '主色')
 * ```
 */

import type { BlendMode, ColorFormat, ColorInput, HSL, HSV, HWB, InterpolationSpace, RGB } from '../types'
import { ColorManipulationError, InputValidationError } from './errors'
import { isColorInput, validateHSL, validateHSV, validateHWB, validateRGB } from './validators'

// ============================================
// 通用验证工具
// ============================================

/**
 * 检查值是否为有限数字
 *
 * @param value - 要检查的值
 * @returns 是否为有限数字
 *
 * @example
 * ```ts
 * isFiniteNumber(42)      // true
 * isFiniteNumber(NaN)     // false
 * isFiniteNumber(Infinity) // false
 * isFiniteNumber('42')    // false
 * ```
 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * 检查值是否为安全数字（非 NaN、非 Infinity）
 *
 * @param value - 要检查的值
 * @param context - 错误信息上下文
 * @throws 如果不是有效数字则抛出错误
 *
 * @example
 * ```ts
 * assertFiniteNumber(42, 'alpha')      // ok
 * assertFiniteNumber(NaN, 'alpha')     // throws
 * assertFiniteNumber(Infinity, 'alpha') // throws
 * ```
 */
export function assertFiniteNumber(value: unknown, context: string): asserts value is number {
  if (!isFiniteNumber(value)) {
    const valueDesc = typeof value === 'number'
      ? (Number.isNaN(value) ? 'NaN' : 'Infinity')
      : `${typeof value}(${String(value)})`

    throw new InputValidationError(
      `${context}：必须是有限数字，得到 ${valueDesc}`,
      value,
      '期望：有效的有限数字',
    )
  }
}

/**
 * 检查对象是否有循环引用
 *
 * @param obj - 要检查的对象
 * @param seen - 已访问对象的集合（内部使用）
 * @returns 是否存在循环引用
 *
 * @example
 * ```ts
 * const a = { b: null }
 * const b = { a: null }
 * a.b = b
 * b.a = a
 * hasCircularReference(a) // true
 *
 * hasCircularReference({ x: 1, y: 2 }) // false
 * ```
 */
export function hasCircularReference(obj: unknown, seen = new WeakSet<object>()): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  if (seen.has(obj)) {
    return true
  }

  seen.add(obj)

  for (const value of Object.values(obj)) {
    if (hasCircularReference(value, seen)) {
      return true
    }
  }

  return false
}

/**
 * 断言对象没有循环引用
 *
 * @param obj - 要检查的对象
 * @param context - 错误信息上下文
 * @throws 如果存在循环引用则抛出错误
 */
export function assertNoCircularReference(obj: unknown, context: string): void {
  if (hasCircularReference(obj)) {
    throw new InputValidationError(
      `${context}：检测到循环引用，无法处理`,
      obj,
      '期望：不包含循环引用的对象',
    )
  }
}

/**
 * 安全解析数字，处理 NaN 和 Infinity
 *
 * @param value - 要解析的值
 * @param defaultValue - 默认值，当解析失败时返回
 * @returns 解析后的数字或默认值
 *
 * @example
 * ```ts
 * safeParseNumber('42', 0)      // 42
 * safeParseNumber('abc', 0)     // 0
 * safeParseNumber(NaN, 0)       // 0
 * safeParseNumber(Infinity, 0)  // 0
 * ```
 */
export function safeParseNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : defaultValue
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : defaultValue
  }

  return defaultValue
}

/**
 * 将数字约束在指定范围内，处理边界情况
 *
 * @param value - 要约束的值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 约束后的值
 *
 * @example
 * ```ts
 * clampSafe(50, 0, 100)       // 50
 * clampSafe(150, 0, 100)      // 100
 * clampSafe(NaN, 0, 100)      // 0
 * clampSafe(Infinity, 0, 100) // 100
 * ```
 */
export function clampSafe(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return value > 0 ? max : min
  }
  return Math.max(min, Math.min(max, value))
}

// ============================================
// 颜色类型验证
// ============================================

/**
 * Enhanced RGB validation with detailed error messages
 */
export function validateRGBSafe(rgb: RGB, context?: string): void {
  const prefix = context ? `${context}: ` : ''
  
  if (typeof rgb !== 'object' || rgb === null) {
    throw new InputValidationError(
      `${prefix}RGB must be an object`,
      rgb,
      'Expected: { r: 0-255, g: 0-255, b: 0-255, a?: 0-1 }',
    )
  }

  if (typeof rgb.r !== 'number' || !Number.isFinite(rgb.r)) {
    throw new InputValidationError(
      `${prefix}Red channel must be a finite number`,
      rgb.r,
      'Expected: number between 0 and 255',
    )
  }

  if (rgb.r < 0 || rgb.r > 255) {
    throw new InputValidationError(
      `${prefix}Red channel out of range: ${rgb.r}`,
      rgb.r,
      'Expected: 0 <= r <= 255',
    )
  }

  if (typeof rgb.g !== 'number' || !Number.isFinite(rgb.g)) {
    throw new InputValidationError(
      `${prefix}Green channel must be a finite number`,
      rgb.g,
      'Expected: number between 0 and 255',
    )
  }

  if (rgb.g < 0 || rgb.g > 255) {
    throw new InputValidationError(
      `${prefix}Green channel out of range: ${rgb.g}`,
      rgb.g,
      'Expected: 0 <= g <= 255',
    )
  }

  if (typeof rgb.b !== 'number' || !Number.isFinite(rgb.b)) {
    throw new InputValidationError(
      `${prefix}Blue channel must be a finite number`,
      rgb.b,
      'Expected: number between 0 and 255',
    )
  }

  if (rgb.b < 0 || rgb.b > 255) {
    throw new InputValidationError(
      `${prefix}Blue channel out of range: ${rgb.b}`,
      rgb.b,
      'Expected: 0 <= b <= 255',
    )
  }

  if (rgb.a !== undefined) {
    if (typeof rgb.a !== 'number' || !Number.isFinite(rgb.a)) {
      throw new InputValidationError(
        `${prefix}Alpha channel must be a finite number`,
        rgb.a,
        'Expected: number between 0 and 1',
      )
    }

    if (rgb.a < 0 || rgb.a > 1) {
      throw new InputValidationError(
        `${prefix}Alpha channel out of range: ${rgb.a}`,
        rgb.a,
        'Expected: 0 <= a <= 1',
      )
    }
  }
}

/**
 * Enhanced HSL validation with detailed error messages
 */
export function validateHSLSafe(hsl: HSL, context?: string): void {
  const prefix = context ? `${context}: ` : ''

  if (typeof hsl !== 'object' || hsl === null) {
    throw new InputValidationError(
      `${prefix}HSL must be an object`,
      hsl,
      'Expected: { h: 0-360, s: 0-100, l: 0-100, a?: 0-1 }',
    )
  }

  if (typeof hsl.h !== 'number' || !Number.isFinite(hsl.h)) {
    throw new InputValidationError(
      `${prefix}Hue must be a finite number`,
      hsl.h,
      'Expected: number between 0 and 360',
    )
  }

  if (hsl.h < 0 || hsl.h > 360) {
    throw new InputValidationError(
      `${prefix}Hue out of range: ${hsl.h}`,
      hsl.h,
      'Expected: 0 <= h <= 360',
    )
  }

  if (typeof hsl.s !== 'number' || !Number.isFinite(hsl.s)) {
    throw new InputValidationError(
      `${prefix}Saturation must be a finite number`,
      hsl.s,
      'Expected: number between 0 and 100',
    )
  }

  if (hsl.s < 0 || hsl.s > 100) {
    throw new InputValidationError(
      `${prefix}Saturation out of range: ${hsl.s}`,
      hsl.s,
      'Expected: 0 <= s <= 100',
    )
  }

  if (typeof hsl.l !== 'number' || !Number.isFinite(hsl.l)) {
    throw new InputValidationError(
      `${prefix}Lightness must be a finite number`,
      hsl.l,
      'Expected: number between 0 and 100',
    )
  }

  if (hsl.l < 0 || hsl.l > 100) {
    throw new InputValidationError(
      `${prefix}Lightness out of range: ${hsl.l}`,
      hsl.l,
      'Expected: 0 <= l <= 100',
    )
  }

  if (hsl.a !== undefined) {
    if (typeof hsl.a !== 'number' || !Number.isFinite(hsl.a)) {
      throw new InputValidationError(
        `${prefix}Alpha must be a finite number`,
        hsl.a,
        'Expected: number between 0 and 1',
      )
    }

    if (hsl.a < 0 || hsl.a > 1) {
      throw new InputValidationError(
        `${prefix}Alpha out of range: ${hsl.a}`,
        hsl.a,
        'Expected: 0 <= a <= 1',
      )
    }
  }
}

/**
 * Validate manipulation amount parameter
 */
export function validateAmount(amount: number, operation: string, min = -100, max = 100): void {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new ColorManipulationError(
      `${operation}: amount must be a finite number`,
      operation,
      { amount, min, max },
    )
  }

  if (amount < min || amount > max) {
    throw new ColorManipulationError(
      `${operation}: amount ${amount} is out of valid range [${min}, ${max}]`,
      operation,
      { amount, min, max },
    )
  }
}

/**
 * Validate alpha value
 */
export function validateAlpha(alpha: number, context = 'Alpha'): void {
  if (typeof alpha !== 'number' || !Number.isFinite(alpha)) {
    throw new InputValidationError(
      `${context} must be a finite number`,
      alpha,
      'Expected: number between 0 and 1',
    )
  }

  if (alpha < 0 || alpha > 1) {
    throw new InputValidationError(
      `${context} out of range: ${alpha}`,
      alpha,
      'Expected: 0 <= alpha <= 1',
    )
  }
}

/**
 * Validate hue rotation degrees
 */
export function validateRotation(degrees: number, context = 'Rotation'): void {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) {
    throw new ColorManipulationError(
      `${context} degrees must be a finite number`,
      'rotate',
      { degrees },
    )
  }

  // Allow any rotation value, but warn if excessive
  if (Math.abs(degrees) > 720 && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.warn(
      `[Color] Large rotation value detected: ${degrees}°. ` +
      `This will be normalized to 0-360° range.`,
    )
  }
}

/**
 * Validate array length
 */
export function validateArrayLength(
  array: any[],
  minLength: number,
  context: string,
): void {
  if (!Array.isArray(array)) {
    throw new InputValidationError(
      `${context} must be an array`,
      array,
      `Expected: array with at least ${minLength} elements`,
    )
  }

  if (array.length < minLength) {
    throw new InputValidationError(
      `${context} requires at least ${minLength} elements, got ${array.length}`,
      array,
      `Expected: array with at least ${minLength} elements`,
    )
  }
}

/**
 * Validate positive integer
 */
export function validatePositiveInteger(value: number, context: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InputValidationError(
      `${context} must be a finite number`,
      value,
      'Expected: positive integer',
    )
  }

  if (!Number.isInteger(value)) {
    throw new InputValidationError(
      `${context} must be an integer, got ${value}`,
      value,
      'Expected: positive integer',
    )
  }

  if (value < 1) {
    throw new InputValidationError(
      `${context} must be positive, got ${value}`,
      value,
      'Expected: positive integer (>= 1)',
    )
  }
}

/**
 * Validate interpolation space
 */
export function validateInterpolationSpace(space: string, context = 'Interpolation space'): asserts space is InterpolationSpace {
  const validSpaces: InterpolationSpace[] = ['rgb', 'hsl', 'hsv', 'hwb', 'lab', 'lch', 'oklab', 'oklch']
  
  if (!validSpaces.includes(space as InterpolationSpace)) {
    throw new InputValidationError(
      `${context}: invalid interpolation space "${space}"`,
      space,
      `Expected one of: ${validSpaces.join(', ')}`,
    )
  }
}

/**
 * Validate color format
 */
export function validateColorFormat(format: string, context = 'Color format'): asserts format is ColorFormat {
  const validFormats: ColorFormat[] = [
    'hex', 'rgb', 'rgba', 'hsl', 'hsla', 'hsv', 'hwb',
    'lab', 'lch', 'xyz', 'oklab', 'oklch', 'cmyk', 'name',
  ]

  if (!validFormats.includes(format as ColorFormat)) {
    throw new InputValidationError(
      `${context}: invalid format "${format}"`,
      format,
      `Expected one of: ${validFormats.join(', ')}`,
    )
  }
}

/**
 * Validate blend mode
 */
export function validateBlendMode(mode: string, context = 'Blend mode'): asserts mode is BlendMode {
  const validModes: BlendMode[] = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light',
    'difference', 'exclusion', 'linear-burn', 'linear-dodge',
    'vivid-light', 'pin-light', 'hard-mix', 'hue', 'saturation',
    'color', 'luminosity',
  ]

  if (!validModes.includes(mode as BlendMode)) {
    throw new InputValidationError(
      `${context}: invalid blend mode "${mode}"`,
      mode,
      `Expected one of: ${validModes.join(', ')}`,
    )
  }
}

/**
 * Type guard for RGB
 */
export function isRGB(value: any): value is RGB {
  return (
    typeof value === 'object'
    && value !== null
    && 'r' in value
    && 'g' in value
    && 'b' in value
    && validateRGB(value)
  )
}

/**
 * Type guard for HSL
 */
export function isHSL(value: any): value is HSL {
  return (
    typeof value === 'object'
    && value !== null
    && 'h' in value
    && 's' in value
    && 'l' in value
    && validateHSL(value)
  )
}

/**
 * Type guard for HSV
 */
export function isHSV(value: any): value is HSV {
  return (
    typeof value === 'object'
    && value !== null
    && 'h' in value
    && 's' in value
    && 'v' in value
    && validateHSV(value)
  )
}

/**
 * Type guard for HWB
 */
export function isHWB(value: any): value is HWB {
  return (
    typeof value === 'object'
    && value !== null
    && 'h' in value
    && 'w' in value
    && 'b' in value
    && validateHWB(value)
  )
}

/**
 * Safe color input validation with detailed errors
 */
export function validateColorInput(input: any, context = 'Color input'): asserts input is ColorInput {
  if (!isColorInput(input)) {
    let inputType = typeof input
    let inputDesc = String(input)

    if (inputType === 'object' && input !== null) {
      inputDesc = JSON.stringify(input)
    }

    throw new InputValidationError(
      `${context}: invalid color input`,
      input,
      `Received ${inputType}: ${inputDesc}\n\n` +
      `Valid formats:\n` +
      `- HEX string: "#RGB", "#RRGGBB", "#RRGGBBAA"\n` +
      `- CSS color: "rgb(r,g,b)", "hsl(h,s,l)", etc.\n` +
      `- RGB object: { r: 0-255, g: 0-255, b: 0-255 }\n` +
      `- HSL object: { h: 0-360, s: 0-100, l: 0-100 }\n` +
      `- HSV object: { h: 0-360, s: 0-100, v: 0-100 }\n` +
      `- Named color: "red", "blue", "green", etc.\n` +
      `- Array: [r, g, b] or [r, g, b, a]`,
    )
  }
}

/**
 * Validate percentage (0-100)
 */
export function validatePercentage(value: number, context: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InputValidationError(
      `${context} must be a finite number`,
      value,
      'Expected: number between 0 and 100',
    )
  }

  if (value < 0 || value > 100) {
    throw new InputValidationError(
      `${context} out of range: ${value}`,
      value,
      'Expected: 0 <= value <= 100',
    )
  }
}

/**
 * Validate range with custom min/max
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  context: string,
): void {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InputValidationError(
      `${context} must be a finite number`,
      value,
      `Expected: number between ${min} and ${max}`,
    )
  }

  if (value < min || value > max) {
    throw new InputValidationError(
      `${context} out of range: ${value}`,
      value,
      `Expected: ${min} <= value <= ${max}`,
    )
  }
}

// ============================================
// 批量验证工具
// ============================================

/**
 * 验证颜色数组
 *
 * @param colors - 颜色数组
 * @param context - 错误信息上下文
 * @param minLength - 最小长度（默认 1）
 * @throws 如果不是有效数组或长度不足则抛出错误
 *
 * @example
 * ```ts
 * validateColorArray(['#FF0000', '#00FF00'], '调色板')
 * validateColorArray([], '调色板', 2) // throws: 至少需要 2 个颜色
 * ```
 */
export function validateColorArray(
  colors: unknown,
  context: string,
  minLength = 1,
): asserts colors is ColorInput[] {
  if (!Array.isArray(colors)) {
    throw new InputValidationError(
      `${context}：必须是数组`,
      colors,
      `期望：包含至少 ${minLength} 个颜色的数组`,
    )
  }

  if (colors.length < minLength) {
    throw new InputValidationError(
      `${context}：至少需要 ${minLength} 个颜色，得到 ${colors.length} 个`,
      colors,
      `期望：包含至少 ${minLength} 个颜色的数组`,
    )
  }

  for (let i = 0; i < colors.length; i++) {
    if (!isColorInput(colors[i])) {
      throw new InputValidationError(
        `${context}[索引 ${i}]：无效的颜色值`,
        colors[i],
        '期望：有效的颜色输入（十六进制、RGB、HSL 等）',
      )
    }
  }
}

/**
 * 验证渐变停止点数组
 *
 * @param stops - 渐变停止点数组
 * @param context - 错误信息上下文
 * @throws 如果格式无效则抛出错误
 *
 * @example
 * ```ts
 * validateGradientStops([
 *   { color: '#FF0000', offset: 0 },
 *   { color: '#0000FF', offset: 1 }
 * ], '渐变')
 * ```
 */
export function validateGradientStops(
  stops: unknown,
  context: string,
): asserts stops is Array<{ color: ColorInput, offset: number }> {
  if (!Array.isArray(stops)) {
    throw new InputValidationError(
      `${context}：停止点必须是数组`,
      stops,
      '期望：[{ color: ColorInput, offset: 0-1 }, ...]',
    )
  }

  if (stops.length < 2) {
    throw new InputValidationError(
      `${context}：至少需要 2 个停止点`,
      stops,
      '期望：至少 2 个停止点来定义渐变',
    )
  }

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]

    if (typeof stop !== 'object' || stop === null) {
      throw new InputValidationError(
        `${context}[索引 ${i}]：停止点必须是对象`,
        stop,
        '期望：{ color: ColorInput, offset: 0-1 }',
      )
    }

    if (!('color' in stop) || !('offset' in stop)) {
      throw new InputValidationError(
        `${context}[索引 ${i}]：缺少必需属性`,
        stop,
        '期望：{ color: ColorInput, offset: 0-1 }',
      )
    }

    if (!isColorInput((stop as any).color)) {
      throw new InputValidationError(
        `${context}[索引 ${i}].color：无效的颜色`,
        (stop as any).color,
        '期望：有效的颜色输入',
      )
    }

    const offset = (stop as any).offset
    if (!isFiniteNumber(offset) || offset < 0 || offset > 1) {
      throw new InputValidationError(
        `${context}[索引 ${i}].offset：无效的偏移值`,
        offset,
        '期望：0 到 1 之间的数字',
      )
    }
  }
}

// ============================================
// 快捷验证函数
// ============================================

/**
 * 快速验证 RGB 通道值
 *
 * @param value - 通道值
 * @returns 是否有效
 */
export function isValidRGBChannel(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 255
}

/**
 * 快速验证色相值
 *
 * @param value - 色相值
 * @returns 是否有效
 */
export function isValidHue(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 360
}

/**
 * 快速验证百分比值
 *
 * @param value - 百分比值
 * @returns 是否有效
 */
export function isValidPercentage(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 100
}

/**
 * 快速验证 Alpha 值
 *
 * @param value - Alpha 值
 * @returns 是否有效
 */
export function isValidAlpha(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 1
}
