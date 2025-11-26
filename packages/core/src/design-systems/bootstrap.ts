/**
 * @ldesign/color - Bootstrap Design System
 *
 * Generate color palettes compatible with Bootstrap 5.
 * Based on Bootstrap's color system with theme colors and tints/shades.
 *
 * @see https://getbootstrap.com/docs/5.3/customize/color/
 * @module design-systems/bootstrap
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Bootstrap color palette with tints and shades
 */
export interface BootstrapPalette {
  base: string
  'tint-10': string
  'tint-20': string
  'tint-30': string
  'tint-40': string
  'tint-50': string
  'tint-60': string
  'tint-70': string
  'tint-80': string
  'tint-90': string
  'shade-10': string
  'shade-20': string
  'shade-30': string
  'shade-40': string
  'shade-50': string
  'shade-60': string
  'shade-70': string
  'shade-80': string
  'shade-90': string
}

/**
 * Bootstrap theme colors
 */
export interface BootstrapTheme {
  primary: BootstrapPalette
  secondary: BootstrapPalette
  success: BootstrapPalette
  danger: BootstrapPalette
  warning: BootstrapPalette
  info: BootstrapPalette
  light: BootstrapPalette
  dark: BootstrapPalette
}

/**
 * Generate Bootstrap color palette
 *
 * Creates tints (lighter) and shades (darker) for a base color,
 * following Bootstrap's color generation algorithm.
 *
 * @param baseColor - Base color
 * @returns Bootstrap palette with tints and shades
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const palette = generateBootstrapPalette('#0d6efd');
 * console.log(palette.base); // '#0d6efd'
 * console.log(palette['tint-20']); // Lighter variant
 * console.log(palette['shade-20']); // Darker variant
 * ```
 */
export function generateBootstrapPalette(baseColor: ColorInput): BootstrapPalette {
  const color = new Color(baseColor)
  const rgb = color.toRGB()

  /**
   * Bootstrap tint function: mix with white
   * tint = color + (white - color) * weight
   */
  function tint(weight: number): string {
    const w = weight / 100
    const r = Math.round(rgb.r + (255 - rgb.r) * w)
    const g = Math.round(rgb.g + (255 - rgb.g) * w)
    const b = Math.round(rgb.b + (255 - rgb.b) * w)
    return Color.fromRGB(r, g, b).toHex()
  }

  /**
   * Bootstrap shade function: mix with black
   * shade = color * (1 - weight)
   */
  function shade(weight: number): string {
    const w = weight / 100
    const r = Math.round(rgb.r * (1 - w))
    const g = Math.round(rgb.g * (1 - w))
    const b = Math.round(rgb.b * (1 - w))
    return Color.fromRGB(r, g, b).toHex()
  }

  return {
    base: color.toHex(),
    'tint-10': tint(10),
    'tint-20': tint(20),
    'tint-30': tint(30),
    'tint-40': tint(40),
    'tint-50': tint(50),
    'tint-60': tint(60),
    'tint-70': tint(70),
    'tint-80': tint(80),
    'tint-90': tint(90),
    'shade-10': shade(10),
    'shade-20': shade(20),
    'shade-30': shade(30),
    'shade-40': shade(40),
    'shade-50': shade(50),
    'shade-60': shade(60),
    'shade-70': shade(70),
    'shade-80': shade(80),
    'shade-90': shade(90),
  }
}

/**
 * Generate complete Bootstrap theme
 *
 * Creates all semantic colors with their tints and shades.
 *
 * @param primaryColor - Primary brand color
 * @returns Complete Bootstrap theme
 * @example
 * ```ts
 * const theme = generateBootstrapTheme('#0d6efd');
 * console.log(theme.primary.base);
 * console.log(theme.success['tint-20']);
 * ```
 */
export function generateBootstrapTheme(primaryColor: ColorInput): BootstrapTheme {
  // Bootstrap default semantic colors
  const semanticColors = {
    primary: primaryColor,
    secondary: '#6c757d', // Gray
    success: '#198754', // Green
    danger: '#dc3545', // Red
    warning: '#ffc107', // Yellow
    info: '#0dcaf0', // Cyan
    light: '#f8f9fa', // Light gray
    dark: '#212529', // Dark gray
  }

  return {
    primary: generateBootstrapPalette(semanticColors.primary),
    secondary: generateBootstrapPalette(semanticColors.secondary),
    success: generateBootstrapPalette(semanticColors.success),
    danger: generateBootstrapPalette(semanticColors.danger),
    warning: generateBootstrapPalette(semanticColors.warning),
    info: generateBootstrapPalette(semanticColors.info),
    light: generateBootstrapPalette(semanticColors.light),
    dark: generateBootstrapPalette(semanticColors.dark),
  }
}

/**
 * Generate Bootstrap gray scale
 *
 * Creates the standard Bootstrap gray palette (100-900).
 *
 * @returns Bootstrap gray palette
 */
export function generateBootstrapGrays(): Record<number, string> {
  const grays: Record<number, string> = {}

  // Bootstrap gray lightness values
  const grayValues = {
    100: 98,
    200: 93,
    300: 87,
    400: 74,
    500: 68,
    600: 53,
    700: 38,
    800: 25,
    900: 13,
  }

  for (const [shade, lightness] of Object.entries(grayValues)) {
    grays[Number(shade)] = Color.fromHSL(0, 0, lightness).toHex()
  }

  return grays
}

/**
 * Convert Bootstrap palette to CSS variables
 *
 * @param palette - Bootstrap palette
 * @param name - Color name
 * @returns CSS variables string
 * @example
 * ```ts
 * const palette = generateBootstrapPalette('#0d6efd');
 * const css = toBootstrapCSSVars(palette, 'primary');
 * ```
 */
export function toBootstrapCSSVars(palette: BootstrapPalette, name: string): string {
  const vars: string[] = []

  // Base color
  vars.push(`  --bs-${name}: ${palette.base};`)

  // RGB components (Bootstrap uses RGB for opacity)
  const rgb = new Color(palette.base).toRGB()
  vars.push(`  --bs-${name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`)

  // Tints
  for (let i = 10; i <= 90; i += 10) {
    const key = `tint-${i}` as keyof BootstrapPalette
    vars.push(`  --bs-${name}-${key}: ${palette[key]};`)
  }

  // Shades
  for (let i = 10; i <= 90; i += 10) {
    const key = `shade-${i}` as keyof BootstrapPalette
    vars.push(`  --bs-${name}-${key}: ${palette[key]};`)
  }

  return vars.join('\n')
}

/**
 * Generate complete Bootstrap CSS theme
 *
 * @param primaryColor - Primary brand color
 * @returns Complete CSS theme
 */
export function generateBootstrapCSSTheme(primaryColor: ColorInput): string {
  const theme = generateBootstrapTheme(primaryColor)
  const grays = generateBootstrapGrays()

  const vars: string[] = []

  // Theme colors
  for (const [name, palette] of Object.entries(theme)) {
    vars.push(toBootstrapCSSVars(palette, name))
  }

  // Gray scale
  for (const [shade, color] of Object.entries(grays)) {
    vars.push(`  --bs-gray-${shade}: ${color};`)
  }

  return `:root {\n${vars.join('\n')}\n}`
}