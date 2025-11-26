/**
 * @ldesign/color - GitHub Primer Design System
 *
 * Generate color palettes compatible with GitHub's Primer design system.
 * Based on Primer's color scales and semantic tokens.
 *
 * @see https://primer.style/foundations/color
 * @module design-systems/primer
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'
import { clamp } from '../utils/math'

/**
 * Primer color scale (0-11)
 */
export interface PrimerScale {
  0: string // Lightest
  1: string
  2: string
  3: string
  4: string
  5: string // Mid-tone
  6: string
  7: string
  8: string
  9: string
  10: string
  11: string // Darkest
}

/**
 * Primer semantic colors
 */
export interface PrimerTheme {
  accent: PrimerScale
  success: PrimerScale
  attention: PrimerScale
  severe: PrimerScale
  danger: PrimerScale
  done: PrimerScale
  sponsors: PrimerScale
  gray: PrimerScale
}

/**
 * Generate Primer color scale
 *
 * Creates a 12-step color scale following Primer's algorithm.
 * Uses perceptually uniform lightness distribution.
 *
 * @param baseColor - Base color (typically maps to scale 5)
 * @returns Primer color scale (0-11)
 * @performance O(1) - Constant time generation
 * @example
 * ```ts
 * const scale = generatePrimerScale('#0969da');
 * console.log(scale[5]); // Base color
 * console.log(scale[0]); // Lightest
 * console.log(scale[11]); // Darkest
 * ```
 */
export function generatePrimerScale(baseColor: ColorInput): PrimerScale {
  const color = new Color(baseColor)
  const hsl = color.toHSL()

  // Primer lightness distribution (perceptually uniform)
  const lightnessMap = {
    0: 98, // Very light background
    1: 95,
    2: 90,
    3: 82,
    4: 70,
    5: hsl.l, // Base color
    6: Math.max(10, hsl.l * 0.85),
    7: Math.max(8, hsl.l * 0.70),
    8: Math.max(6, hsl.l * 0.55),
    9: Math.max(5, hsl.l * 0.45),
    10: Math.max(4, hsl.l * 0.35),
    11: Math.max(3, hsl.l * 0.25), // Very dark
  }

  // Saturation adjustments for better color perception
  const saturationMap = {
    0: hsl.s * 0.15,
    1: hsl.s * 0.30,
    2: hsl.s * 0.50,
    3: hsl.s * 0.70,
    4: hsl.s * 0.85,
    5: hsl.s,
    6: Math.min(100, hsl.s * 1.02),
    7: Math.min(100, hsl.s * 1.05),
    8: Math.min(100, hsl.s * 1.08),
    9: Math.min(100, hsl.s * 1.10),
    10: Math.min(100, hsl.s * 1.12),
    11: Math.min(100, hsl.s * 1.15),
  }

  const scale: any = {}

  for (let i = 0; i <= 11; i++) {
    const l = clamp(lightnessMap[i as keyof typeof lightnessMap], 0, 100)
    const s = clamp(saturationMap[i as keyof typeof saturationMap], 0, 100)
    scale[i] = Color.fromHSL(hsl.h, s, l).toHex()
  }

  return scale as PrimerScale
}

/**
 * Generate complete Primer theme
 *
 * Creates all semantic color scales following GitHub Primer specification.
 *
 * @param accentColor - Accent/brand color
 * @returns Complete Primer theme
 * @example
 * ```ts
 * const theme = generatePrimerTheme('#0969da');
 * console.log(theme.accent[5]); // Accent color
 * console.log(theme.success[5]); // Success color
 * ```
 */
export function generatePrimerTheme(accentColor: ColorInput): PrimerTheme {
  // Primer default semantic colors
  const semanticColors = {
    accent: accentColor, // Blue
    success: '#1a7f37', // Green
    attention: '#9a6700', // Yellow
    severe: '#bc4c00', // Orange
    danger: '#cf222e', // Red
    done: '#8250df', // Purple
    sponsors: '#bf3989', // Pink
    gray: '#6e7781', // Gray
  }

  return {
    accent: generatePrimerScale(semanticColors.accent),
    success: generatePrimerScale(semanticColors.success),
    attention: generatePrimerScale(semanticColors.attention),
    severe: generatePrimerScale(semanticColors.severe),
    danger: generatePrimerScale(semanticColors.danger),
    done: generatePrimerScale(semanticColors.done),
    sponsors: generatePrimerScale(semanticColors.sponsors),
    gray: generatePrimerScale(semanticColors.gray),
  }
}

/**
 * Generate Primer neutral colors
 *
 * Creates grayscale with subtle blue tint (GitHub style).
 *
 * @returns Primer neutral scale
 */
export function generatePrimerNeutral(): PrimerScale {
  const scale: any = {}

  // Primer uses slightly blue-tinted grays
  const lightnessValues = [98, 95, 90, 82, 70, 58, 46, 36, 28, 20, 15, 10]

  for (let i = 0; i <= 11; i++) {
    // Slight blue tint (220° hue, very low saturation)
    scale[i] = Color.fromHSL(220, 8, lightnessValues[i]).toHex()
  }

  return scale as PrimerScale
}

/**
 * Generate Primer alpha colors
 *
 * Semi-transparent variants for overlays and effects.
 *
 * @param baseColor - Base color
 * @returns Object with alpha variants
 */
export function generatePrimerAlpha(baseColor: ColorInput): {
  emphasis: string // 10% opacity
  muted: string // 20% opacity
  subtle: string // 40% opacity
} {
  const color = new Color(baseColor)
  const rgb = color.toRGB()

  return {
    emphasis: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
    muted: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
    subtle: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
  }
}

/**
 * Convert Primer scale to CSS variables
 *
 * @param scale - Primer color scale
 * @param name - Color name
 * @returns CSS variables string
 * @example
 * ```ts
 * const scale = generatePrimerScale('#0969da');
 * const css = toPrimerCSSVars(scale, 'accent');
 * ```
 */
export function toPrimerCSSVars(scale: PrimerScale, name: string): string {
  const vars: string[] = []

  for (let i = 0; i <= 11; i++) {
    vars.push(`  --primer-${name}-${i}: ${scale[i as keyof PrimerScale]};`)
  }

  return vars.join('\n')
}

/**
 * Generate complete Primer CSS theme
 *
 * @param accentColor - Accent/brand color
 * @param mode - Light or dark mode
 * @returns Complete CSS theme
 */
export function generatePrimerCSSTheme(
  accentColor: ColorInput,
  mode: 'light' | 'dark' = 'light',
): string {
  const theme = generatePrimerTheme(accentColor)
  const neutral = generatePrimerNeutral()

  const vars: string[] = []

  // Semantic colors
  for (const [name, scale] of Object.entries(theme)) {
    vars.push(toPrimerCSSVars(scale, name))
  }

  // Neutral colors
  vars.push(toPrimerCSSVars(neutral, 'neutral'))

  // Functional tokens (mapped from scales based on mode)
  if (mode === 'light') {
    vars.push('  /* Functional tokens (light mode) */')
    vars.push(`  --primer-fg-default: ${neutral[11]};`)
    vars.push(`  --primer-fg-muted: ${neutral[8]};`)
    vars.push(`  --primer-fg-subtle: ${neutral[6]};`)
    vars.push(`  --primer-bg-default: ${neutral[0]};`)
    vars.push(`  --primer-bg-subtle: ${neutral[1]};`)
    vars.push(`  --primer-bg-inset: ${neutral[2]};`)
    vars.push(`  --primer-border-default: ${neutral[3]};`)
    vars.push(`  --primer-border-muted: ${neutral[2]};`)
  }
  else {
    vars.push('  /* Functional tokens (dark mode) */')
    vars.push(`  --primer-fg-default: ${neutral[1]};`)
    vars.push(`  --primer-fg-muted: ${neutral[3]};`)
    vars.push(`  --primer-fg-subtle: ${neutral[5]};`)
    vars.push(`  --primer-bg-default: ${neutral[11]};`)
    vars.push(`  --primer-bg-subtle: ${neutral[10]};`)
    vars.push(`  --primer-bg-inset: ${neutral[9]};`)
    vars.push(`  --primer-border-default: ${neutral[8]};`)
    vars.push(`  --primer-border-muted: ${neutral[9]};`)
  }

  return `:root {\n${vars.join('\n')}\n}`
}

/**
 * Generate Primer focus ring color
 *
 * Creates an accessible focus ring color based on accent color.
 *
 * @param accentColor - Accent color
 * @returns Focus ring color with proper contrast
 */
export function generatePrimerFocusRing(accentColor: ColorInput): string {
  const color = new Color(accentColor)
  const hsl = color.toHSL()

  // Focus ring should be bright and saturated
  return Color.fromHSL(hsl.h, Math.min(100, hsl.s * 1.2), 65).toHex()
}