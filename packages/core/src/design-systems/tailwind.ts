/**
 * @ldesign/color - Tailwind CSS Color System
 *
 * Generate color palettes compatible with Tailwind CSS.
 *
 * @see https://tailwindcss.com/docs/customizing-colors
 * @module design-systems/tailwind
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Tailwind color scale (50-950)
 */
export interface TailwindScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string // Base color
  600: string
  700: string
  800: string
  900: string
  950: string
}

/**
 * Generate Tailwind CSS color scale
 *
 * Creates an 11-shade scale following Tailwind's color generation algorithm.
 * Shade 500 is the base color.
 *
 * @param baseColor - Base color (becomes shade 500)
 * @returns Tailwind color scale
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const scale = generateTailwindScale('#3b82f6');
 * console.log(scale[500]); // Base color '#3b82f6'
 * console.log(scale[50]);  // Lightest tint
 * console.log(scale[950]); // Darkest shade
 * ```
 */
export function generateTailwindScale(baseColor: ColorInput): TailwindScale {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  return {
    50: Color.fromHSL(hsl.h, clamp(hsl.s * 0.33, 10, 100), 97).toHex(),
    100: Color.fromHSL(hsl.h, clamp(hsl.s * 0.44, 10, 100), 94).toHex(),
    200: Color.fromHSL(hsl.h, clamp(hsl.s * 0.60, 10, 100), 86).toHex(),
    300: Color.fromHSL(hsl.h, clamp(hsl.s * 0.77, 10, 100), 77).toHex(),
    400: Color.fromHSL(hsl.h, clamp(hsl.s * 0.92, 10, 100), 63).toHex(),
    500: color.toHex(), // Base color
    600: Color.fromHSL(hsl.h, clamp(hsl.s * 1.08, 10, 100), 42).toHex(),
    700: Color.fromHSL(hsl.h, clamp(hsl.s * 1.15, 10, 100), 33).toHex(),
    800: Color.fromHSL(hsl.h, clamp(hsl.s * 1.23, 10, 100), 27).toHex(),
    900: Color.fromHSL(hsl.h, clamp(hsl.s * 1.30, 10, 100), 22).toHex(),
    950: Color.fromHSL(hsl.h, clamp(hsl.s * 1.38, 10, 100), 13).toHex(),
  }
}

/**
 * Generate complete Tailwind CSS color palette
 *
 * @param colors - Named colors to generate scales for
 * @returns Complete Tailwind color palette
 * @example
 * ```ts
 * const palette = generateTailwindPalette({
 *   primary: '#3b82f6',
 *   secondary: '#8b5cf6'
 * });
 * console.log(palette.primary[500]);
 * ```
 */
export function generateTailwindPalette(
  colors: Record<string, ColorInput>,
): Record<string, TailwindScale> {
  const palette: Record<string, TailwindScale> = {}

  for (const [name, color] of Object.entries(colors)) {
    palette[name] = generateTailwindScale(color)
  }

  return palette
}

/**
 * Generate Tailwind config JavaScript
 *
 * @param colors - Named colors
 * @returns JavaScript object for tailwind.config.js
 * @example
 * ```ts
 * const config = toTailwindConfig({ primary: '#3b82f6' });
 * // Use in tailwind.config.js:
 * // module.exports = { theme: { extend: { colors: config } } }
 * ```
 */
export function toTailwindConfig(
  colors: Record<string, ColorInput>,
): string {
  const palette = generateTailwindPalette(colors)

  return JSON.stringify(palette, null, 2)
}

/**
 * Generate Tailwind CSS variables
 *
 * @param colors - Named colors
 * @returns CSS variables string
 */
export function generateTailwindCSSVars(
  colors: Record<string, ColorInput>,
): string {
  const palette = generateTailwindPalette(colors)
  const vars: string[] = []

  for (const [name, scale] of Object.entries(palette)) {
    for (const [shade, hex] of Object.entries(scale)) {
      vars.push(`  --tw-${name}-${shade}: ${hex};`)
    }
  }

  return `:root {\n${vars.join('\n')}\n}`
}

/**
 * Generate Tailwind semantic color scales
 *
 * @param primaryColor - Primary color
 * @returns Semantic color scales
 */
export function generateTailwindSemanticColors(primaryColor: ColorInput): {
  primary: TailwindScale
  gray: TailwindScale
  red: TailwindScale
  yellow: TailwindScale
  green: TailwindScale
  blue: TailwindScale
  indigo: TailwindScale
  purple: TailwindScale
  pink: TailwindScale
} {
  return {
    primary: generateTailwindScale(primaryColor),
    gray: generateTailwindScale('#6b7280'),
    red: generateTailwindScale('#ef4444'),
    yellow: generateTailwindScale('#eab308'),
    green: generateTailwindScale('#22c55e'),
    blue: generateTailwindScale('#3b82f6'),
    indigo: generateTailwindScale('#6366f1'),
    purple: generateTailwindScale('#a855f7'),
    pink: generateTailwindScale('#ec4899'),
  }
}
