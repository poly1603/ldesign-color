/**
 * @ldesign/color - Design System Generator
 *
 * Unified interface for generating palettes for different design systems.
 *
 * @module design-systems/generator
 */

import type { ColorInput } from '../types'
import { generateAntDesignColorSystem, generateAntDesignPalette } from './antDesign'
import { generateCarbonScale, generateCarbonTheme } from './carbon'
import { generateChakraUIColors, generateChakraUIScale } from './chakraUI'
import { generateFluentUIRamp, generateFluentUITheme } from './fluent'
import { generateMaterialDesign3Scheme, generateMaterialDesignPalette } from './materialDesign'
import { generateTailwindScale, generateTailwindSemanticColors } from './tailwind'

/**
 * Supported design systems
 */
export type DesignSystem
  = | 'ant-design'
    | 'chakra-ui'
    | 'material-design'
    | 'material-design-3'
    | 'carbon'
    | 'fluent'
    | 'tailwind'

/**
 * Generate color palette for specified design system
 *
 * Unified function to generate palettes compatible with different design systems.
 *
 * @param baseColor - Base color
 * @param system - Target design system
 * @param options - Generation options
 * @returns Color palette for the specified design system
 * @performance O(1) - Constant time for all design systems
 * @example
 * ```ts
 * // Generate Ant Design palette
 * const antPalette = generateDesignSystemPalette('#1890ff', 'ant-design');
 *
 * // Generate Material Design 3 palette
 * const md3Palette = generateDesignSystemPalette('#6750A4', 'material-design-3');
 *
 * // Generate Tailwind palette
 * const twPalette = generateDesignSystemPalette('#3b82f6', 'tailwind');
 * ```
 */
export function generateDesignSystemPalette(
  baseColor: ColorInput,
  system: DesignSystem,
  options?: any,
): any {
  switch (system) {
    case 'ant-design':
      return generateAntDesignPalette(baseColor, options)

    case 'chakra-ui':
      return generateChakraUIScale(baseColor)

    case 'material-design':
      return generateMaterialDesignPalette(baseColor, options)

    case 'material-design-3':
      return generateMaterialDesign3Scheme(baseColor, options)

    case 'carbon':
      return generateCarbonScale(baseColor)

    case 'fluent':
      return generateFluentUIRamp(baseColor)

    case 'tailwind':
      return generateTailwindScale(baseColor)

    default:
      throw new Error(`Unknown design system: ${system}`)
  }
}

/**
 * Generate complete color system for design framework
 *
 * Generates full semantic color sets (primary, success, error, etc.)
 * for the specified design system.
 *
 * @param primaryColor - Primary brand color
 * @param system - Target design system
 * @returns Complete color system
 * @example
 * ```ts
 * const system = generateCompleteColorSystem('#1890ff', 'ant-design');
 * console.log(system.primary);
 * console.log(system.success);
 * console.log(system.error);
 * ```
 */
export function generateCompleteColorSystem(
  primaryColor: ColorInput,
  system: DesignSystem,
): any {
  switch (system) {
    case 'ant-design':
      return generateAntDesignColorSystem(primaryColor)

    case 'chakra-ui':
      return generateChakraUIColors(primaryColor)

    case 'carbon':
      return generateCarbonTheme(primaryColor)

    case 'fluent':
      return generateFluentUITheme(primaryColor)

    case 'tailwind':
      return generateTailwindSemanticColors(primaryColor)

    case 'material-design':
    case 'material-design-3':
      // Material Design doesn't have a standard full system generator
      return {
        primary: generateDesignSystemPalette(primaryColor, system),
      }

    default:
      throw new Error(`Unknown design system: ${system}`)
  }
}

/**
 * Convert design system palette to CSS variables
 *
 * @param baseColor - Base color
 * @param system - Design system
 * @param options - CSS generation options
 * @returns CSS variables string
 * @example
 * ```ts
 * const css = toDesignSystemCSS('#3b82f6', 'tailwind', {
 *   prefix: 'tw',
 *   selector: ':root'
 * });
 * ```
 */
export function toDesignSystemCSS(
  baseColor: ColorInput,
  system: DesignSystem,
  options: {
    prefix?: string
    selector?: string
    name?: string
  } = {},
): string {
  const palette = generateDesignSystemPalette(baseColor, system)
  const { selector = ':root', name = 'primary' } = options

  const prefix = options.prefix || getDefaultPrefix(system)
  const vars: string[] = []

  for (const [shade, color] of Object.entries(palette)) {
    vars.push(`  --${prefix}-${name}-${shade}: ${color};`)
  }

  return `${selector} {\n${vars.join('\n')}\n}`
}

/**
 * Get default CSS variable prefix for design system
 */
function getDefaultPrefix(system: DesignSystem): string {
  switch (system) {
    case 'ant-design': return 'ant'
    case 'chakra-ui': return 'chakra'
    case 'material-design': return 'md'
    case 'material-design-3': return 'md3'
    case 'carbon': return 'carbon'
    case 'fluent': return 'fluent'
    case 'tailwind': return 'tw'
    default: return 'ds'
  }
}

/**
 * Compare design systems side by side
 *
 * Generates the same color in different design system formats for comparison.
 *
 * @param baseColor - Base color
 * @returns Palettes for all design systems
 * @example
 * ```ts
 * const comparison = compareDesignSystems('#3b82f6');
 * console.log(comparison.antDesign);
 * console.log(comparison.chakraUI);
 * console.log(comparison.tailwind);
 * ```
 */
export function compareDesignSystems(baseColor: ColorInput): {
  antDesign: any
  chakraUI: any
  materialDesign: any
  carbon: any
  fluent: any
  tailwind: any
} {
  return {
    antDesign: generateDesignSystemPalette(baseColor, 'ant-design'),
    chakraUI: generateDesignSystemPalette(baseColor, 'chakra-ui'),
    materialDesign: generateDesignSystemPalette(baseColor, 'material-design'),
    carbon: generateDesignSystemPalette(baseColor, 'carbon'),
    fluent: generateDesignSystemPalette(baseColor, 'fluent'),
    tailwind: generateDesignSystemPalette(baseColor, 'tailwind'),
  }
}
