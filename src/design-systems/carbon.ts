/**
 * @ldesign/color - Carbon Design System
 *
 * Generate color palettes compatible with IBM Carbon Design System.
 *
 * @see https://carbondesignsystem.com/guidelines/color/overview
 * @module design-systems/carbon
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'

/**
 * Carbon color scale (10-100)
 */
export interface CarbonColorScale {
  10: string
  20: string
  30: string
  40: string
  50: string
  60: string
  70: string
  80: string
  90: string
  100: string
}

/**
 * Generate Carbon Design System color scale
 *
 * Creates a 10-shade scale following Carbon's color generation algorithm.
 *
 * @param baseColor - Base color
 * @returns Carbon color scale
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const scale = generateCarbonScale('#0f62fe');
 * console.log(scale[50]); // Mid-tone
 * console.log(scale[10]); // Lightest
 * console.log(scale[100]); // Darkest
 * ```
 */
export function generateCarbonScale(baseColor: ColorInput): CarbonColorScale {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  // Carbon uses specific lightness values
  return {
    10: Color.fromHSL(hsl.h, hsl.s * 0.20, 98).toHex(),
    20: Color.fromHSL(hsl.h, hsl.s * 0.35, 94).toHex(),
    30: Color.fromHSL(hsl.h, hsl.s * 0.50, 86).toHex(),
    40: Color.fromHSL(hsl.h, hsl.s * 0.70, 72).toHex(),
    50: Color.fromHSL(hsl.h, hsl.s * 0.85, 58).toHex(),
    60: Color.fromHSL(hsl.h, hsl.s, 48).toHex(),
    70: Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.10), 38).toHex(),
    80: Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.20), 28).toHex(),
    90: Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.30), 20).toHex(),
    100: Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.40), 12).toHex(),
  }
}

/**
 * Generate Carbon Design System theme
 *
 * @param primaryColor - Primary color
 * @returns Complete Carbon color theme
 */
export function generateCarbonTheme(primaryColor: ColorInput): {
  blue: CarbonColorScale
  gray: CarbonColorScale
  red: CarbonColorScale
  magenta: CarbonColorScale
  purple: CarbonColorScale
  cyan: CarbonColorScale
  teal: CarbonColorScale
  green: CarbonColorScale
} {
  return {
    blue: generateCarbonScale(primaryColor),
    gray: generateCarbonScale('#6f6f6f'),
    red: generateCarbonScale('#da1e28'),
    magenta: generateCarbonScale('#d02670'),
    purple: generateCarbonScale('#8a3ffc'),
    cyan: generateCarbonScale('#1192e8'),
    teal: generateCarbonScale('#009d9a'),
    green: generateCarbonScale('#24a148'),
  }
}

/**
 * Generate Carbon CSS variables
 *
 * @param primaryColor - Primary color
 * @returns CSS variables string
 */
export function generateCarbonCSSVars(primaryColor: ColorInput): string {
  const theme = generateCarbonTheme(primaryColor)
  const vars: string[] = []

  for (const [name, scale] of Object.entries(theme)) {
    for (const [shade, hex] of Object.entries(scale)) {
      vars.push(`  --carbon-${name}-${shade}: ${hex};`)
    }
  }

  return `:root {\n${vars.join('\n')}\n}`
}
