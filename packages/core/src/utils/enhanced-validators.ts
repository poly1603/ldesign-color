/**
 * @ldesign/color - Enhanced Validators
 *
 * Enhanced validation with detailed error messages and type guards
 */

import type { ColorInput, HSL, HSV, HWB, RGB, InterpolationSpace, ColorFormat, BlendMode } from '../types'
import { InputValidationError, ColorManipulationError } from './errors'
import { validateRGB, validateHSL, validateHSV, validateHWB, isColorInput } from './validators'

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