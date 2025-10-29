/**
 * @ldesign/color - Chakra UI Color System
 *
 * Generate color palettes compatible with Chakra UI.
 *
 * @see https://chakra-ui.com/docs/theming/theme#colors
 * @module design-systems/chakraUI
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Chakra UI color scale (50-900)
 */
export interface ChakraUIScale {
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
}

/**
 * Generate Chakra UI color scale
 *
 * Creates a 10-shade scale following Chakra UI's color generation pattern.
 * Shade 500 is the base color.
 *
 * @param baseColor - Base color (becomes shade 500)
 * @returns Chakra UI color scale object
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const scale = generateChakraUIScale('#3182ce');
 * console.log(scale[500]); // '#3182ce' (base)
 * console.log(scale[50]);  // Lightest
 * console.log(scale[900]); // Darkest
 * ```
 */
export function generateChakraUIScale(baseColor: ColorInput): ChakraUIScale {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  // Chakra UI uses specific lightness values for each shade
  return {
    50: Color.fromHSL(hsl.h, clamp(hsl.s * 0.40, 10, 100), 95).toHex(),
    100: Color.fromHSL(hsl.h, clamp(hsl.s * 0.52, 10, 100), 90).toHex(),
    200: Color.fromHSL(hsl.h, clamp(hsl.s * 0.67, 15, 100), 80).toHex(),
    300: Color.fromHSL(hsl.h, clamp(hsl.s * 0.83, 20, 100), 70).toHex(),
    400: Color.fromHSL(hsl.h, clamp(hsl.s * 0.95, 25, 100), 60).toHex(),
    500: color.toHex(), // Base color
    600: Color.fromHSL(hsl.h, clamp(hsl.s * 1.08, 30, 100), 45).toHex(),
    700: Color.fromHSL(hsl.h, clamp(hsl.s * 1.15, 35, 100), 38).toHex(),
    800: Color.fromHSL(hsl.h, clamp(hsl.s * 1.23, 40, 100), 30).toHex(),
    900: Color.fromHSL(hsl.h, clamp(hsl.s * 1.30, 45, 100), 22).toHex(),
  }
}

/**
 * Generate Chakra UI semantic colors
 *
 * @param primaryColor - Primary brand color
 * @returns Chakra UI semantic color scales
 */
export function generateChakraUIColors(primaryColor: ColorInput): {
  gray: ChakraUIScale
  red: ChakraUIScale
  orange: ChakraUIScale
  yellow: ChakraUIScale
  green: ChakraUIScale
  teal: ChakraUIScale
  blue: ChakraUIScale
  cyan: ChakraUIScale
  purple: ChakraUIScale
  pink: ChakraUIScale
  [key: string]: ChakraUIScale
} {
  // Generate primary brand color
  const brand = generateChakraUIScale(primaryColor)

  // Chakra UI default semantic colors
  return {
    gray: generateChakraUIScale('#718096'),
    red: generateChakraUIScale('#E53E3E'),
    orange: generateChakraUIScale('#DD6B20'),
    yellow: generateChakraUIScale('#D69E2E'),
    green: generateChakraUIScale('#38A169'),
    teal: generateChakraUIScale('#319795'),
    blue: generateChakraUIScale('#3182CE'),
    cyan: generateChakraUIScale('#00B5D8'),
    purple: generateChakraUIScale('#805AD5'),
    pink: generateChakraUIScale('#D53F8C'),
    brand, // Custom brand color
  }
}

/**
 * Convert to Chakra UI theme object
 *
 * @param primaryColor - Primary brand color
 * @returns Chakra UI theme configuration
 * @example
 * ```ts
 * const theme = toChakraUITheme('#3182ce');
 * // Use in Chakra UI:
 * // extendTheme({ colors: theme })
 * ```
 */
export function toChakraUITheme(primaryColor: ColorInput): Record<string, ChakraUIScale> {
  return generateChakraUIColors(primaryColor)
}

/**
 * Generate Chakra UI CSS variables
 *
 * @param primaryColor - Primary brand color
 * @param options - Generation options
 * @returns CSS variables string
 */
export function generateChakraUICSSVars(
  primaryColor: ColorInput,
  options: {
    prefix?: string
    selector?: string
  } = {},
): string {
  const { prefix = 'chakra', selector = ':root' } = options
  const colors = generateChakraUIColors(primaryColor)

  const vars: string[] = []

  for (const [name, scale] of Object.entries(colors)) {
    for (const [shade, hex] of Object.entries(scale)) {
      vars.push(`  --${prefix}-colors-${name}-${shade}: ${hex};`)
    }
  }

  return `${selector} {\n${vars.join('\n')}\n}`
}
