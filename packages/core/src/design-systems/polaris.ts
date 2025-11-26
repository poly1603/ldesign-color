/**
 * @ldesign/color - Shopify Polaris Design System
 *
 * Generate color palettes compatible with Shopify's Polaris design system.
 * Based on Polaris color tokens and semantic palette.
 *
 * @see https://polaris.shopify.com/design/colors
 * @module design-systems/polaris
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Polaris color scale (50-900)
 */
export interface PolarisScale {
  50: string // Lightest
  100: string
  200: string
  300: string
  400: string
  500: string // Base
  600: string
  700: string
  800: string
  900: string // Darkest
}

/**
 * Polaris semantic colors
 */
export interface PolarisTheme {
  primary: PolarisScale
  success: PolarisScale
  warning: PolarisScale
  critical: PolarisScale
  info: PolarisScale
  neutral: PolarisScale
}

/**
 * Polaris surface colors
 */
export interface PolarisSurfaces {
  background: string
  surface: string
  surfaceSubdued: string
  surfaceDisabled: string
  surfaceHovered: string
  surfacePressed: string
  surfaceSearchField: string
}

/**
 * Generate Polaris color scale
 *
 * Creates a 10-step color scale following Polaris design principles.
 * Emphasizes accessibility and usability.
 *
 * @param baseColor - Base color (maps to 500)
 * @returns Polaris color scale
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const scale = generatePolarisScale('#008060');
 * console.log(scale[500]); // Base color
 * console.log(scale[50]); // Lightest
 * ```
 */
export function generatePolarisScale(baseColor: ColorInput): PolarisScale {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  // Polaris lightness distribution (accessibility-focused)
  const lightnessMap = {
    50: 96,
    100: 92,
    200: 84,
    300: 72,
    400: 60,
    500: hsl.l, // Base color
    600: Math.max(10, hsl.l * 0.80),
    700: Math.max(8, hsl.l * 0.65),
    800: Math.max(6, hsl.l * 0.50),
    900: Math.max(5, hsl.l * 0.35),
  }

  // Saturation adjustments for color harmony
  const saturationMap = {
    50: hsl.s * 0.20,
    100: hsl.s * 0.35,
    200: hsl.s * 0.55,
    300: hsl.s * 0.75,
    400: hsl.s * 0.90,
    500: hsl.s,
    600: Math.min(100, hsl.s * 1.03),
    700: Math.min(100, hsl.s * 1.06),
    800: Math.min(100, hsl.s * 1.09),
    900: Math.min(100, hsl.s * 1.12),
  }

  const scale: any = {}

  for (const shade of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    const l = clamp(lightnessMap[shade as keyof typeof lightnessMap], 0, 100)
    const s = clamp(saturationMap[shade as keyof typeof saturationMap], 0, 100)
    scale[shade] = Color.fromHSL(hsl.h, s, l).toHex()
  }

  return scale as PolarisScale
}

/**
 * Generate complete Polaris theme
 *
 * Creates all semantic color scales for Polaris.
 *
 * @param primaryColor - Primary brand color
 * @returns Complete Polaris theme
 * @example
 * ```ts
 * const theme = generatePolarisTheme('#008060');
 * console.log(theme.primary[500]);
 * console.log(theme.success[600]);
 * ```
 */
export function generatePolarisTheme(primaryColor: ColorInput): PolarisTheme {
  // Polaris semantic colors (Shopify brand defaults)
  const semanticColors = {
    primary: primaryColor, // Shopify green
    success: '#108043', // Green
    warning: '#916a00', // Yellow/Orange
    critical: '#d82c0d', // Red
    info: '#006fbb', // Blue
    neutral: '#8c9196', // Gray
  }

  return {
    primary: generatePolarisScale(semanticColors.primary),
    success: generatePolarisScale(semanticColors.success),
    warning: generatePolarisScale(semanticColors.warning),
    critical: generatePolarisScale(semanticColors.critical),
    info: generatePolarisScale(semanticColors.info),
    neutral: generatePolarisScale(semanticColors.neutral),
  }
}

/**
 * Generate Polaris surface colors
 *
 * Creates background and surface colors for layouts.
 *
 * @param mode - Light or dark mode
 * @returns Surface colors
 */
export function generatePolarisSurfaces(mode: 'light' | 'dark' = 'light'): PolarisSurfaces {
  if (mode === 'light') {
    return {
      background: '#f6f6f7',
      surface: '#ffffff',
      surfaceSubdued: '#fafbfb',
      surfaceDisabled: '#fafbfb',
      surfaceHovered: '#f6f6f7',
      surfacePressed: '#f1f2f3',
      surfaceSearchField: '#f1f2f3',
    }
  }
  else {
    return {
      background: '#111213',
      surface: '#202123',
      surfaceSubdued: '#1a1c1d',
      surfaceDisabled: '#1a1c1d',
      surfaceHovered: '#2b2d2f',
      surfacePressed: '#32363a',
      surfaceSearchField: '#2b2d2f',
    }
  }
}

/**
 * Generate Polaris interactive states
 *
 * Creates hover, pressed, and disabled states for interactive elements.
 *
 * @param baseColor - Base color
 * @returns Interactive state colors
 */
export function generatePolarisInteractive(baseColor: ColorInput): {
  default: string
  hovered: string
  pressed: string
  disabled: string
  focused: string
} {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  return {
    default: color.toHex(),
    hovered: Color.fromHSL(hsl.h, hsl.s, Math.max(5, hsl.l * 0.85)).toHex(),
    pressed: Color.fromHSL(hsl.h, hsl.s, Math.max(5, hsl.l * 0.70)).toHex(),
    disabled: Color.fromHSL(hsl.h, hsl.s * 0.30, 80).toHex(),
    focused: Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.15), Math.min(95, hsl.l * 1.20)).toHex(),
  }
}

/**
 * Generate Polaris decorative colors
 *
 * Creates additional colors for illustrations and decorative elements.
 *
 * @param primaryColor - Primary color
 * @returns Decorative color palette
 */
export function generatePolarisDecorative(primaryColor: ColorInput): {
  teal: PolarisScale
  purple: PolarisScale
  orange: PolarisScale
  pink: PolarisScale
} {
  const color = new Color(primaryColor)
  const hsl = color.toHSL()

  return {
    teal: generatePolarisScale(Color.fromHSL(180, 60, 45)),
    purple: generatePolarisScale(Color.fromHSL(280, 50, 50)),
    orange: generatePolarisScale(Color.fromHSL(25, 80, 55)),
    pink: generatePolarisScale(Color.fromHSL(330, 70, 60)),
  }
}

/**
 * Convert Polaris scale to CSS variables
 *
 * @param scale - Polaris color scale
 * @param name - Color name
 * @returns CSS variables string
 * @example
 * ```ts
 * const scale = generatePolarisScale('#008060');
 * const css = toPolarisCSSVars(scale, 'primary');
 * ```
 */
export function toPolarisCSSVars(scale: PolarisScale, name: string): string {
  const vars: string[] = []

  for (const shade of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    vars.push(`  --p-${name}-${shade}: ${scale[shade as keyof PolarisScale]};`)
  }

  return vars.join('\n')
}

/**
 * Generate complete Polaris CSS theme
 *
 * @param primaryColor - Primary brand color
 * @param mode - Light or dark mode
 * @returns Complete CSS theme
 */
export function generatePolarisCSSTheme(
  primaryColor: ColorInput,
  mode: 'light' | 'dark' = 'light',
): string {
  const theme = generatePolarisTheme(primaryColor)
  const surfaces = generatePolarisSurfaces(mode)
  const interactive = generatePolarisInteractive(primaryColor)

  const vars: string[] = []

  // Semantic colors
  for (const [name, scale] of Object.entries(theme)) {
    vars.push(toPolarisCSSVars(scale, name))
  }

  // Surface colors
  vars.push('  /* Surface colors */')
  for (const [name, color] of Object.entries(surfaces)) {
    const kebabName = name.replace(/([A-Z])/g, '-$1').toLowerCase()
    vars.push(`  --p-surface-${kebabName}: ${color};`)
  }

  // Interactive states
  vars.push('  /* Interactive states */')
  for (const [state, color] of Object.entries(interactive)) {
    vars.push(`  --p-interactive-${state}: ${color};`)
  }

  // Text colors (based on mode)
  vars.push('  /* Text colors */')
  if (mode === 'light') {
    vars.push('  --p-text: #202223;')
    vars.push('  --p-text-subdued: #6d7175;')
    vars.push('  --p-text-disabled: #8c9196;')
  }
  else {
    vars.push('  --p-text: #e3e5e7;')
    vars.push('  --p-text-subdued: #b5b5b5;')
    vars.push('  --p-text-disabled: #6d7175;')
  }

  // Border colors
  vars.push('  /* Border colors */')
  if (mode === 'light') {
    vars.push('  --p-border: #c9cccf;')
    vars.push('  --p-border-subdued: #e1e3e5;')
  }
  else {
    vars.push('  --p-border: #4a4c4e;')
    vars.push('  --p-border-subdued: #33383e;')
  }

  return `:root {\n${vars.join('\n')}\n}`
}

/**
 * Generate Polaris action colors
 *
 * Creates colors optimized for buttons and actions.
 *
 * @param baseColor - Base action color
 * @returns Action color variants
 */
export function generatePolarisAction(baseColor: ColorInput): {
  primary: string
  primaryHovered: string
  primaryPressed: string
  primaryDepressed: string
  primaryDisabled: string
} {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  return {
    primary: color.toHex(),
    primaryHovered: Color.fromHSL(hsl.h, hsl.s, Math.max(5, hsl.l * 0.90)).toHex(),
    primaryPressed: Color.fromHSL(hsl.h, hsl.s, Math.max(5, hsl.l * 0.80)).toHex(),
    primaryDepressed: Color.fromHSL(hsl.h, hsl.s, Math.max(5, hsl.l * 0.75)).toHex(),
    primaryDisabled: Color.fromHSL(hsl.h, hsl.s * 0.25, 85).toHex(),
  }
}