/**
 * @ldesign/color - Fluent UI Color System
 *
 * Generate color palettes compatible with Microsoft Fluent UI 2.
 *
 * @see https://fluent2.microsoft.design/color
 * @module design-systems/fluent
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Fluent UI color ramp (8-160)
 */
export interface FluentUIRamp {
  8: string
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
  110: string
  120: string
  130: string
  140: string
  150: string
  160: string
}

/**
 * Generate Fluent UI color ramp
 *
 * Creates a 17-shade ramp following Fluent Design System specification.
 *
 * @param baseColor - Base color
 * @returns Fluent UI color ramp
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const ramp = generateFluentUIRamp('#0078d4');
 * console.log(ramp[80]); // Mid-tone
 * console.log(ramp[8]);  // Lightest
 * console.log(ramp[160]); // Darkest
 * ```
 */
export function generateFluentUIRamp(baseColor: ColorInput): FluentUIRamp {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  // Fluent UI uses specific lightness values for each shade
  const lightnessMap: Record<number, number> = {
    8: 99,
    10: 98,
    20: 96,
    30: 92,
    40: 84,
    50: 76,
    60: 68,
    70: 60,
    80: 52, // Typically close to base
    90: 44,
    100: 36,
    110: 30,
    120: 24,
    130: 20,
    140: 16,
    150: 12,
    160: 8,
  }

  const ramp: any = {}

  for (const [shade, lightness] of Object.entries(lightnessMap)) {
    const shadeNum = Number(shade)

    // Adjust saturation for lighter and darker shades
    let saturation = hsl.s
    if (shadeNum < 80) {
      // Lighter shades - reduce saturation
      const factor = shadeNum / 80
      saturation = hsl.s * (0.3 + 0.7 * factor)
    }
    else if (shadeNum > 80) {
      // Darker shades - slightly increase saturation
      const factor = (shadeNum - 80) / 80
      saturation = Math.min(100, hsl.s * (1 + 0.2 * factor))
    }

    ramp[shade] = Color.fromHSL(hsl.h, clamp(saturation, 0, 100), lightness).toHex()
  }

  return ramp as FluentUIRamp
}

/**
 * Generate Fluent UI semantic colors
 *
 * @param primaryColor - Primary brand color
 * @returns Fluent UI semantic color ramps
 */
export function generateFluentUITheme(primaryColor: ColorInput): {
  themePrimary: FluentUIRamp
  themeSecondary: FluentUIRamp
  themeTertiary: FluentUIRamp
  themeDanger: FluentUIRamp
  themeSuccess: FluentUIRamp
  themeWarning: FluentUIRamp
  neutralGray: FluentUIRamp
} {
  const primary = new Color(primaryColor)
  const primaryHsl = primary.toHSL()

  return {
    themePrimary: generateFluentUIRamp(primary),
    themeSecondary: generateFluentUIRamp(
      Color.fromHSL((primaryHsl.h + 30) % 360, primaryHsl.s * 0.8, primaryHsl.l),
    ),
    themeTertiary: generateFluentUIRamp(
      Color.fromHSL((primaryHsl.h + 60) % 360, primaryHsl.s * 0.9, primaryHsl.l),
    ),
    themeDanger: generateFluentUIRamp('#d13438'),
    themeSuccess: generateFluentUIRamp('#107c10'),
    themeWarning: generateFluentUIRamp('#ff8c00'),
    neutralGray: generateFluentUIRamp('#8a8886'),
  }
}

/**
 * Generate Fluent UI CSS variables
 *
 * @param primaryColor - Primary color
 * @returns CSS variables string
 */
export function generateFluentUICSSVars(primaryColor: ColorInput): string {
  const theme = generateFluentUITheme(primaryColor)
  const vars: string[] = []

  for (const [name, ramp] of Object.entries(theme)) {
    for (const [shade, hex] of Object.entries(ramp)) {
      vars.push(`  --fluent-${name}-${shade}: ${hex};`)
    }
  }

  return `:root {\n${vars.join('\n')}\n}`
}

/**
 * Fluent UI tokens for common UI elements
 */
export interface FluentUITokens {
  colorBrandForeground1: string
  colorBrandForeground2: string
  colorBrandBackground: string
  colorBrandBackgroundHover: string
  colorBrandBackgroundPressed: string
  colorBrandBackgroundSelected: string
  colorNeutralForeground1: string
  colorNeutralForeground2: string
  colorNeutralBackground1: string
  colorNeutralBackground2: string
}

/**
 * Generate Fluent UI semantic tokens
 *
 * @param primaryColor - Primary color
 * @param mode - Theme mode (light or dark)
 * @returns Fluent UI semantic tokens
 * @example
 * ```ts
 * const tokens = generateFluentUITokens('#0078d4', 'light');
 * console.log(tokens.colorBrandForeground1);
 * ```
 */
export function generateFluentUITokens(
  primaryColor: ColorInput,
  mode: 'light' | 'dark' = 'light',
): FluentUITokens {
  const theme = generateFluentUITheme(primaryColor)

  if (mode === 'light') {
    return {
      colorBrandForeground1: theme.themePrimary[80],
      colorBrandForeground2: theme.themePrimary[70],
      colorBrandBackground: theme.themePrimary[80],
      colorBrandBackgroundHover: theme.themePrimary[70],
      colorBrandBackgroundPressed: theme.themePrimary[60],
      colorBrandBackgroundSelected: theme.themePrimary[90],
      colorNeutralForeground1: theme.neutralGray[140],
      colorNeutralForeground2: theme.neutralGray[120],
      colorNeutralBackground1: theme.neutralGray[10],
      colorNeutralBackground2: theme.neutralGray[20],
    }
  }
  else {
    return {
      colorBrandForeground1: theme.themePrimary[100],
      colorBrandForeground2: theme.themePrimary[110],
      colorBrandBackground: theme.themePrimary[70],
      colorBrandBackgroundHover: theme.themePrimary[80],
      colorBrandBackgroundPressed: theme.themePrimary[90],
      colorBrandBackgroundSelected: theme.themePrimary[60],
      colorNeutralForeground1: theme.neutralGray[10],
      colorNeutralForeground2: theme.neutralGray[20],
      colorNeutralBackground1: theme.neutralGray[150],
      colorNeutralBackground2: theme.neutralGray[140],
    }
  }
}
