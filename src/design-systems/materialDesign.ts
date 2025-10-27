/**
 * @ldesign/color - Material Design Color System
 *
 * Generate color palettes compatible with Material Design 3.
 * Based on Material Design color system specification.
 *
 * @see https://m3.material.io/styles/color/the-color-system/key-colors-tones
 * @module design-systems/materialDesign
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Material Design color palette with standard shades
 */
export interface MaterialDesignPalette {
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
  A100?: string // Accent colors (optional)
  A200?: string
  A400?: string
  A700?: string
}

/**
 * Material Design 3 tonal palette
 */
export interface MaterialDesign3Tonal {
  0: string // Pure black
  10: string
  20: string
  30: string
  40: string
  50: string
  60: string
  70: string
  80: string
  90: string
  95: string
  99: string
  100: string // Pure white
}

/**
 * Generate Material Design color palette (Material 2)
 *
 * @param baseColor - Base color (becomes shade 500)
 * @param options - Generation options
 * @returns Material Design palette
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const palette = generateMaterialDesignPalette('#2196f3');
 * console.log(palette[500]); // Base color
 * console.log(palette.A200); // Accent color
 * ```
 */
export function generateMaterialDesignPalette(
  baseColor: ColorInput,
  options: {
    generateAccents?: boolean
  } = {},
): MaterialDesignPalette {
  const { generateAccents = true } = options
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  const palette: any = {
    50: Color.fromHSL(hsl.h, hsl.s * 0.12, 97).toHex(),
    100: Color.fromHSL(hsl.h, hsl.s * 0.30, 93).toHex(),
    200: Color.fromHSL(hsl.h, hsl.s * 0.50, 82).toHex(),
    300: Color.fromHSL(hsl.h, hsl.s * 0.70, 68).toHex(),
    400: Color.fromHSL(hsl.h, hsl.s * 0.85, 58).toHex(),
    500: color.toHex(), // Base color
    600: Color.fromHSL(hsl.h, clamp(hsl.s * 1.05, 0, 100), 45).toHex(),
    700: Color.fromHSL(hsl.h, clamp(hsl.s * 1.10, 0, 100), 36).toHex(),
    800: Color.fromHSL(hsl.h, clamp(hsl.s * 1.15, 0, 100), 28).toHex(),
    900: Color.fromHSL(hsl.h, clamp(hsl.s * 1.20, 0, 100), 18).toHex(),
  }

  // Add accent colors for vibrant colors
  if (generateAccents && hsl.s > 50) {
    palette.A100 = Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.2), 80).toHex()
    palette.A200 = Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.3), 65).toHex()
    palette.A400 = Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.4), 55).toHex()
    palette.A700 = Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.5), 45).toHex()
  }

  return palette as MaterialDesignPalette
}

/**
 * Generate Material Design 3 tonal palette
 *
 * Material Design 3 uses a tonal palette system with 13 tones.
 *
 * @param baseColor - Base color
 * @returns Tonal palette with 13 tones
 * @example
 * ```ts
 * const tonal = generateMaterialDesign3Tonal('#6750A4');
 * console.log(tonal[40]); // Primary color tone
 * ```
 */
export function generateMaterialDesign3Tonal(baseColor: ColorInput): MaterialDesign3Tonal {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  // Material Design 3 tonal values (based on lightness)
  const tones = {
    0: Color.fromHSL(hsl.h, 0, 0).toHex(), // Pure black
    10: Color.fromHSL(hsl.h, hsl.s * 0.8, 10).toHex(),
    20: Color.fromHSL(hsl.h, hsl.s * 0.9, 20).toHex(),
    30: Color.fromHSL(hsl.h, hsl.s * 0.95, 30).toHex(),
    40: Color.fromHSL(hsl.h, hsl.s, 40).toHex(),
    50: Color.fromHSL(hsl.h, hsl.s, 50).toHex(),
    60: Color.fromHSL(hsl.h, hsl.s, 60).toHex(),
    70: Color.fromHSL(hsl.h, hsl.s * 0.95, 70).toHex(),
    80: Color.fromHSL(hsl.h, hsl.s * 0.85, 80).toHex(),
    90: Color.fromHSL(hsl.h, hsl.s * 0.60, 90).toHex(),
    95: Color.fromHSL(hsl.h, hsl.s * 0.40, 95).toHex(),
    99: Color.fromHSL(hsl.h, hsl.s * 0.15, 99).toHex(),
    100: Color.fromHSL(hsl.h, 0, 100).toHex(), // Pure white
  }

  return tones as MaterialDesign3Tonal
}

/**
 * Material Design 3 color scheme
 */
export interface MaterialDesign3Scheme {
  primary: MaterialDesign3Tonal
  secondary: MaterialDesign3Tonal
  tertiary: MaterialDesign3Tonal
  error: MaterialDesign3Tonal
  neutral: MaterialDesign3Tonal
  neutralVariant: MaterialDesign3Tonal
}

/**
 * Generate complete Material Design 3 color scheme
 *
 * @param primaryColor - Primary color
 * @param options - Generation options
 * @returns Complete MD3 color scheme
 * @example
 * ```ts
 * const scheme = generateMaterialDesign3Scheme('#6750A4');
 * console.log(scheme.primary[40]); // Primary color
 * console.log(scheme.secondary[40]); // Secondary color
 * ```
 */
export function generateMaterialDesign3Scheme(
  primaryColor: ColorInput,
  options: {
    secondaryColor?: ColorInput
    tertiaryColor?: ColorInput
  } = {},
): MaterialDesign3Scheme {
  const primary = new Color(primaryColor)
  const primaryHsl = primary.toHSL()

  // Generate secondary color (analogous, +30° hue)
  const secondary = options.secondaryColor
    ? new Color(options.secondaryColor)
    : Color.fromHSL((primaryHsl.h + 30) % 360, primaryHsl.s * 0.8, primaryHsl.l)

  // Generate tertiary color (complementary split, +60° hue)
  const tertiary = options.tertiaryColor
    ? new Color(options.tertiaryColor)
    : Color.fromHSL((primaryHsl.h + 60) % 360, primaryHsl.s * 0.9, primaryHsl.l)

  // Error is typically red
  const error = new Color('#B3261E')

  // Neutral colors
  const neutral = Color.fromHSL(0, 0, 50)
  const neutralVariant = Color.fromHSL(primaryHsl.h, 10, 50)

  return {
    primary: generateMaterialDesign3Tonal(primary),
    secondary: generateMaterialDesign3Tonal(secondary),
    tertiary: generateMaterialDesign3Tonal(tertiary),
    error: generateMaterialDesign3Tonal(error),
    neutral: generateMaterialDesign3Tonal(neutral),
    neutralVariant: generateMaterialDesign3Tonal(neutralVariant),
  }
}

/**
 * Convert Material Design palette to CSS variables
 *
 * @param palette - Material Design palette
 * @param name - Color name
 * @param version - MD version (2 or 3)
 * @returns CSS variables string
 */
export function toMaterialDesignCSSVars(
  palette: MaterialDesignPalette | MaterialDesign3Tonal,
  name: string,
  version: 2 | 3 = 2,
): string {
  const vars: string[] = []
  const prefix = version === 3 ? 'md3' : 'md'

  for (const [shade, color] of Object.entries(palette)) {
    vars.push(`  --${prefix}-${name}-${shade}: ${color};`)
  }

  return vars.join('\n')
}

/**
 * Generate complete Material Design theme CSS
 *
 * @param primaryColor - Primary color
 * @param version - Material Design version (2 or 3)
 * @returns Complete CSS theme
 */
export function generateMaterialDesignTheme(
  primaryColor: ColorInput,
  version: 2 | 3 = 3,
): string {
  const vars: string[] = []

  if (version === 3) {
    const scheme = generateMaterialDesign3Scheme(primaryColor)

    vars.push(toMaterialDesignCSSVars(scheme.primary, 'primary', 3))
    vars.push(toMaterialDesignCSSVars(scheme.secondary, 'secondary', 3))
    vars.push(toMaterialDesignCSSVars(scheme.tertiary, 'tertiary', 3))
    vars.push(toMaterialDesignCSSVars(scheme.error, 'error', 3))
    vars.push(toMaterialDesignCSSVars(scheme.neutral, 'neutral', 3))
    vars.push(toMaterialDesignCSSVars(scheme.neutralVariant, 'neutral-variant', 3))
  }
  else {
    const palette = generateMaterialDesignPalette(primaryColor)
    vars.push(toMaterialDesignCSSVars(palette, 'primary', 2))
  }

  return `:root {\n${vars.join('\n')}\n}`
}
