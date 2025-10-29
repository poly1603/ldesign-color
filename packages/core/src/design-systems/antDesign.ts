/**
 * @ldesign/color - Ant Design Color System
 *
 * Generate color palettes compatible with Ant Design specification.
 * Based on Ant Design's color generation algorithm.
 *
 * @see https://ant.design/docs/spec/colors
 * @module design-systems/antDesign
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Ant Design color palette with 10 shades
 */
export interface AntDesignPalette {
  1: string // Lightest
  2: string
  3: string
  4: string
  5: string
  6: string // Base color
  7: string
  8: string
  9: string
  10: string // Darkest
}

/**
 * Generate Ant Design color palette
 *
 * Creates a 10-shade palette following Ant Design's color generation algorithm.
 * The input color becomes shade 6 (primary), with 5 lighter and 4 darker shades.
 *
 * @param baseColor - Base color (becomes shade 6)
 * @param options - Generation options
 * @returns Ant Design palette object with shades 1-10
 * @performance O(1) - Generates all shades in constant time
 * @example
 * ```ts
 * const palette = generateAntDesignPalette('#1890ff');
 * console.log(palette[6]); // '#1890ff' (base color)
 * console.log(palette[1]); // Lightest shade
 * console.log(palette[10]); // Darkest shade
 * ```
 */
export function generateAntDesignPalette(
  baseColor: ColorInput,
  _options: {
    darkMode?: boolean
    backgroundColor?: string
  } = {},
): AntDesignPalette {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  const palette: any = {}

  // Ant Design lightness values for each shade
  const lightnessMap = {
    1: 95, // Lightest background
    2: 85,
    3: 73,
    4: 63,
    5: 53,
    6: hsl.l, // Base color
    7: hsl.l * 0.85,
    8: hsl.l * 0.70,
    9: hsl.l * 0.55,
    10: hsl.l * 0.40, // Darkest
  }

  // Saturation adjustments for lighter shades
  const saturationMap = {
    1: hsl.s * 0.12,
    2: hsl.s * 0.30,
    3: hsl.s * 0.50,
    4: hsl.s * 0.70,
    5: hsl.s * 0.85,
    6: hsl.s,
    7: Math.min(100, hsl.s * 1.05),
    8: Math.min(100, hsl.s * 1.10),
    9: Math.min(100, hsl.s * 1.15),
    10: Math.min(100, hsl.s * 1.20),
  }

  // Generate each shade
  for (let i = 1; i <= 10; i++) {
    const l = clamp(lightnessMap[i as keyof typeof lightnessMap], 0, 100)
    const s = clamp(saturationMap[i as keyof typeof saturationMap], 0, 100)

    palette[i] = Color.fromHSL(hsl.h, s, l).toHex()
  }

  return palette as AntDesignPalette
}

/**
 * Generate complete Ant Design color system
 *
 * Creates a full set of semantic colors (primary, success, warning, error, info)
 * each with their 10-shade palette.
 *
 * @param primaryColor - Primary brand color
 * @returns Complete Ant Design color system
 * @example
 * ```ts
 * const colorSystem = generateAntDesignColorSystem('#1890ff');
 * console.log(colorSystem.primary[6]); // Primary color
 * console.log(colorSystem.success[6]); // Success color
 * ```
 */
export function generateAntDesignColorSystem(primaryColor: ColorInput): {
  primary: AntDesignPalette
  success: AntDesignPalette
  warning: AntDesignPalette
  error: AntDesignPalette
  info: AntDesignPalette
} {
  // Ant Design default semantic colors
  const semanticColors = {
    primary: primaryColor,
    success: '#52c41a', // Green
    warning: '#faad14', // Gold/Orange
    error: '#f5222d', // Red
    info: '#1890ff', // Blue
  }

  return {
    primary: generateAntDesignPalette(semanticColors.primary),
    success: generateAntDesignPalette(semanticColors.success),
    warning: generateAntDesignPalette(semanticColors.warning),
    error: generateAntDesignPalette(semanticColors.error),
    info: generateAntDesignPalette(semanticColors.info),
  }
}

/**
 * Generate Ant Design neutral colors (grays)
 *
 * Creates a 13-shade neutral color palette.
 *
 * @returns Ant Design neutral palette
 */
export function generateAntDesignNeutral(): Record<number, string> {
  const neutral: Record<number, string> = {}

  const lightnessValues = [98, 96, 94, 90, 85, 75, 65, 45, 35, 25, 20, 15, 8]

  for (let i = 0; i < lightnessValues.length; i++) {
    neutral[i + 1] = Color.fromHSL(0, 0, lightnessValues[i]).toHex()
  }

  return neutral
}

/**
 * Convert color to Ant Design format (CSS variables)
 *
 * @param palette - Ant Design palette
 * @param name - Color name (e.g., 'primary', 'success')
 * @returns CSS variables string
 * @example
 * ```ts
 * const palette = generateAntDesignPalette('#1890ff');
 * const css = toAntDesignCSSVars(palette, 'primary');
 * // Outputs: --ant-primary-1: #e6f7ff; --ant-primary-2: #bae7ff; ...
 * ```
 */
export function toAntDesignCSSVars(
  palette: AntDesignPalette,
  name: string,
): string {
  const vars: string[] = []

  for (let i = 1; i <= 10; i++) {
    vars.push(`  --ant-${name}-${i}: ${palette[i as keyof AntDesignPalette]};`)
  }

  return vars.join('\n')
}

/**
 * Generate complete Ant Design CSS variables
 *
 * @param primaryColor - Primary brand color
 * @returns Complete CSS variables for Ant Design theme
 */
export function generateAntDesignTheme(primaryColor: ColorInput): string {
  const system = generateAntDesignColorSystem(primaryColor)
  const neutral = generateAntDesignNeutral()

  const vars: string[] = []

  // Add color palettes
  vars.push(toAntDesignCSSVars(system.primary, 'primary'))
  vars.push(toAntDesignCSSVars(system.success, 'success'))
  vars.push(toAntDesignCSSVars(system.warning, 'warning'))
  vars.push(toAntDesignCSSVars(system.error, 'error'))
  vars.push(toAntDesignCSSVars(system.info, 'info'))

  // Add neutral colors
  for (const [shade, color] of Object.entries(neutral)) {
    vars.push(`  --ant-gray-${shade}: ${color};`)
  }

  return `:root {\n${vars.join('\n')}\n}`
}
