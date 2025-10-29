/**
 * @ldesign/color - Color Harmony
 *
 * Advanced color harmony algorithms with scoring and suggestions.
 * Provides mathematical color theory implementation for generating
 * harmonious color combinations.
 *
 * @module harmony
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'

// ============================================
// Harmony Types
// ============================================

/**
 * Extended harmony types
 */
export type HarmonyType
  = | 'monochromatic' // Single hue with varying lightness/saturation
  | 'analogous' // Adjacent hues (±30°)
  | 'complementary' // Opposite hues (180°)
  | 'split-complementary' // Base + two adjacent to complement
  | 'triadic' // Three equidistant hues (120°)
  | 'tetradic' // Two complementary pairs (rectangle)
  | 'square' // Four equidistant hues (90°)
  | 'double-complementary' // Two sets of complements
  | 'clash' // Intentional tension
  | 'custom' // User-defined angles

/**
 * Harmony configuration
 */
export interface HarmonyConfig {
  type: HarmonyType
  angles?: number[] // Custom angles for 'custom' type
  count?: number // Number of colors to generate
  variation?: number // Lightness/saturation variation (0-100)
  preserveBase?: boolean // Keep base color properties
}

/**
 * Harmony result with scoring
 */
export interface HarmonyResult {
  type: HarmonyType
  baseColor: Color
  colors: Color[]
  score: number // Overall harmony score (0-100)
  metrics: HarmonyMetrics
  suggestions?: string[] // Improvement suggestions
}

/**
 * Harmony evaluation metrics
 */
export interface HarmonyMetrics {
  colorBalance: number // Color distribution balance (0-100)
  contrastRange: number // Range of contrasts (0-100)
  saturationHarmony: number // Saturation consistency (0-100)
  lightnessHarmony: number // Lightness consistency (0-100)
  hueRelation: number // Hue relationship score (0-100)
}

// ============================================
// Harmony Generation
// ============================================

/**
 * Generate color harmony
 *
 * Creates harmonious color combinations based on color theory.
 *
 * @param baseColor - Base color for harmony
 * @param config - Harmony configuration
 * @returns Harmony result with colors and evaluation
 * @performance O(n²) for evaluation where n is number of colors
 * @example
 * ```ts
 * const harmony = generateHarmony('#3498db', {
 *   type: 'triadic',
 *   variation: 15
 * });
 * console.log(harmony.score); // 85
 * console.log(harmony.colors); // [base, color2, color3]
 * ```
 */
export function generateHarmony(
  baseColor: ColorInput,
  config: HarmonyConfig,
): HarmonyResult {
  const base = new Color(baseColor)
  const colors = generateHarmonyColors(base, config)
  const metrics = evaluateHarmonyMetrics(colors, base)
  const score = calculateHarmonyScore(metrics)
  const suggestions = generateImprovementSuggestions(metrics, config.type)

  return {
    type: config.type,
    baseColor: base,
    colors,
    score,
    metrics,
    suggestions,
  }
}

/**
 * Generate harmony colors based on type
 */
function generateHarmonyColors(
  base: Color,
  config: HarmonyConfig,
): Color[] {
  const hsl = base.toHSL()
  const variation = config.variation || 0

  let angles: number[]

  switch (config.type) {
    case 'monochromatic':
      return generateMonochromaticColors(base, config.count || 5, variation)

    case 'analogous':
      angles = [-30, 0, 30]
      break

    case 'complementary':
      angles = [0, 180]
      break

    case 'split-complementary':
      angles = [0, 150, 210]
      break

    case 'triadic':
      angles = [0, 120, 240]
      break

    case 'tetradic':
      angles = [0, 60, 180, 240]
      break

    case 'square':
      angles = [0, 90, 180, 270]
      break

    case 'double-complementary':
      angles = [0, 30, 180, 210]
      break

    case 'clash':
      // Intentionally create tension with non-traditional angles
      angles = [0, 77, 154, 308]
      break

    case 'custom':
      angles = config.angles || [0]
      break

    default:
      angles = [0]
  }

  // Generate colors at specified angles
  const colors: Color[] = []

  for (const angle of angles) {
    const newHsl = { ...hsl }
    newHsl.h = (hsl.h + angle) % 360

    // Apply variation if specified
    if (variation > 0) {
      const varFactor = (Math.random() - 0.5) * (variation / 100)
      newHsl.l = Math.max(0, Math.min(100, newHsl.l * (1 + varFactor)))
      newHsl.s = Math.max(0, Math.min(100, newHsl.s * (1 + varFactor * 0.5)))
    }

    colors.push(Color.fromHSL(newHsl.h, newHsl.s, newHsl.l))
  }

  return colors
}

/**
 * Generate monochromatic colors
 */
function generateMonochromaticColors(
  _base: Color,
  count: number,
  variation: number,
): Color[] {
  const base = _base
  const hsl = base.toHSL()
  const colors: Color[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)

    // Vary lightness and saturation
    const lightness = hsl.l + (t - 0.5) * variation
    const saturation = hsl.s * (1 - Math.abs(t - 0.5) * 0.3)

    colors.push(Color.fromHSL(
      hsl.h,
      Math.max(0, Math.min(100, saturation)),
      Math.max(0, Math.min(100, lightness)),
    ))
  }

  return colors
}

// ============================================
// Harmony Evaluation
// ============================================

/**
 * Evaluate harmony metrics for a set of colors
 */
function evaluateHarmonyMetrics(
  colors: Color[],
  base: Color,
): HarmonyMetrics {
  if (colors.length < 2) {
    return {
      colorBalance: 100,
      contrastRange: 100,
      saturationHarmony: 100,
      lightnessHarmony: 100,
      hueRelation: 100,
    }
  }

  // Extract HSL values
  const hslValues = colors.map(c => c.toHSL())

  // Evaluate color balance (how evenly distributed are hues)
  const colorBalance = evaluateColorBalance(hslValues)

  // Evaluate contrast range
  const contrasts = evaluateContrastRange(colors)

  // Evaluate saturation harmony
  const saturationHarmony = evaluateSaturationHarmony(hslValues)

  // Evaluate lightness harmony
  const lightnessHarmony = evaluateLightnessHarmony(hslValues)

  // Evaluate hue relationships
  const hueRelation = evaluateHueRelation(hslValues)

  return {
    colorBalance,
    contrastRange: contrasts,
    saturationHarmony,
    lightnessHarmony,
    hueRelation,
  }
}

/**
 * Evaluate color balance (hue distribution)
 */
function evaluateColorBalance(hslValues: any[]): number {
  if (hslValues.length < 3)
    return 100

  // Calculate hue differences
  const hues = hslValues.map(hsl => hsl.h).sort((a, b) => a - b)
  const diffs: number[] = []

  for (let i = 0; i < hues.length; i++) {
    const next = (i + 1) % hues.length
    const diff = next === 0
      ? 360 - hues[i] + hues[0]
      : hues[next] - hues[i]
    diffs.push(diff)
  }

  // Calculate variance from ideal equal spacing
  const idealSpacing = 360 / hues.length
  const variance = diffs.reduce((sum, diff) => {
    return sum + (diff - idealSpacing) ** 2
  }, 0) / diffs.length

  // Convert to 0-100 score (lower variance = higher score)
  const maxVariance = idealSpacing * idealSpacing
  const score = Math.max(0, 100 - (Math.sqrt(variance) / Math.sqrt(maxVariance)) * 100)
  return score
}

/**
 * Evaluate contrast range
 */
function evaluateContrastRange(colors: Color[]): number {
  let minContrast = 21
  let maxContrast = 1

  for (let i = 0; i < colors.length - 1; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const contrast = colors[i].contrast(colors[j])
      minContrast = Math.min(minContrast, contrast)
      maxContrast = Math.max(maxContrast, contrast)
    }
  }

  // Ideal range is 3-15 for good usability
  const range = maxContrast - minContrast
  const idealMin = 3
  const idealMax = 15

  if (minContrast >= idealMin && maxContrast <= idealMax) {
    return 100
  }

  // Penalize if outside ideal range
  const penalty = Math.abs(minContrast - idealMin) + Math.abs(maxContrast - idealMax)
  return Math.max(0, 100 - penalty * 5)
}

/**
 * Evaluate saturation harmony
 */
function evaluateSaturationHarmony(hslValues: any[]): number {
  const saturations = hslValues.map(hsl => hsl.s)
  const avgSat = saturations.reduce((sum, s) => sum + s, 0) / saturations.length

  // Calculate variance
  const variance = saturations.reduce((sum, s) => {
    return sum + (s - avgSat) ** 2
  }, 0) / saturations.length

  // Good harmony has moderate variance (not all same, not too different)
  const idealVariance = 400 // ~20% standard deviation
  const score = 100 - Math.abs(Math.sqrt(variance) - Math.sqrt(idealVariance)) * 2

  return Math.max(0, Math.min(100, score))
}

/**
 * Evaluate lightness harmony
 */
function evaluateLightnessHarmony(hslValues: any[]): number {
  const lightnesses = hslValues.map(hsl => hsl.l)
  const avgLight = lightnesses.reduce((sum, l) => sum + l, 0) / lightnesses.length

  // Calculate variance
  const variance = lightnesses.reduce((sum, l) => {
    return sum + (l - avgLight) ** 2
  }, 0) / lightnesses.length

  // Good harmony has moderate variance
  const idealVariance = 300 // ~17% standard deviation
  const score = 100 - Math.abs(Math.sqrt(variance) - Math.sqrt(idealVariance)) * 2

  return Math.max(0, Math.min(100, score))
}

/**
 * Evaluate hue relationships
 */
function evaluateHueRelation(hslValues: any[]): number {
  if (hslValues.length < 2)
    return 100

  const hues = hslValues.map(hsl => hsl.h)
  let score = 100

  // Check for ideal harmonic intervals
  const harmonicIntervals = [30, 60, 90, 120, 150, 180]

  for (let i = 0; i < hues.length - 1; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = Math.abs(hues[i] - hues[j])
      const minDiff = Math.min(diff, 360 - diff)

      // Check if close to a harmonic interval
      const closestInterval = harmonicIntervals.reduce((prev, curr) =>
        Math.abs(curr - minDiff) < Math.abs(prev - minDiff) ? curr : prev,
      )

      const deviation = Math.abs(closestInterval - minDiff)

      // Penalize if far from harmonic intervals
      score -= deviation * 0.5
    }
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * Calculate overall harmony score
 */
function calculateHarmonyScore(metrics: HarmonyMetrics): number {
  // Weighted average of all metrics
  const weights = {
    colorBalance: 0.25,
    contrastRange: 0.20,
    saturationHarmony: 0.20,
    lightnessHarmony: 0.20,
    hueRelation: 0.15,
  }

  return Math.round(
    metrics.colorBalance * weights.colorBalance
    + metrics.contrastRange * weights.contrastRange
    + metrics.saturationHarmony * weights.saturationHarmony
    + metrics.lightnessHarmony * weights.lightnessHarmony
    + metrics.hueRelation * weights.hueRelation,
  )
}

/**
 * Generate improvement suggestions based on metrics
 */
function generateImprovementSuggestions(
  metrics: HarmonyMetrics,
  type: HarmonyType,
): string[] {
  const suggestions: string[] = []

  if (metrics.colorBalance < 60) {
    suggestions.push('Consider adjusting hue angles for better color distribution')
  }

  if (metrics.contrastRange < 60) {
    suggestions.push('Increase lightness variation for better contrast range')
  }

  if (metrics.saturationHarmony < 60) {
    suggestions.push('Harmonize saturation levels across colors')
  }

  if (metrics.lightnessHarmony < 60) {
    suggestions.push('Balance lightness values for better visual harmony')
  }

  if (metrics.hueRelation < 60 && type !== 'custom') {
    suggestions.push('Fine-tune hue angles to match harmonic intervals')
  }

  return suggestions
}

// ============================================
// Advanced Harmony Algorithms
// ============================================

/**
 * Generate accented monochromatic harmony
 *
 * Monochromatic scheme with a contrasting accent color.
 *
 * @param baseColor - Base color
 * @param accentHueShift - Hue shift for accent (default: 180° - complementary)
 * @returns Harmony result
 * @example
 * ```ts
 * const harmony = generateAccentedMonochromatic('#3498db', 180);
 * ```
 */
export function generateAccentedMonochromatic(
  baseColor: ColorInput,
  accentHueShift = 180,
): HarmonyResult {
  const base = new Color(baseColor)
  const hsl = base.toHSL()

  // Generate monochromatic variations
  const monoColors = [
    Color.fromHSL(hsl.h, hsl.s * 0.6, hsl.l + 20),
    Color.fromHSL(hsl.h, hsl.s * 0.8, hsl.l + 10),
    base,
    Color.fromHSL(hsl.h, hsl.s * 1.1, hsl.l - 10),
    Color.fromHSL(hsl.h, hsl.s * 1.2, hsl.l - 20),
  ]

  // Add accent color
  const accentColor = Color.fromHSL(
    (hsl.h + accentHueShift) % 360,
    Math.min(100, hsl.s * 1.2),
    hsl.l,
  )

  const colors = [...monoColors, accentColor]
  const metrics = evaluateHarmonyMetrics(colors, base)

  return {
    type: 'monochromatic',
    baseColor: base,
    colors,
    score: calculateHarmonyScore(metrics),
    metrics,
    suggestions: generateImprovementSuggestions(metrics, 'monochromatic'),
  }
}

/**
 * Generate nature-inspired harmony
 *
 * Creates color combinations inspired by natural color relationships.
 *
 * @param baseColor - Base color
 * @param theme - Nature theme
 * @returns Harmony result
 * @example
 * ```ts
 * const forest = generateNatureHarmony('#2ecc71', 'forest');
 * const ocean = generateNatureHarmony('#3498db', 'ocean');
 * ```
 */
export function generateNatureHarmony(
  baseColor: ColorInput,
  theme: 'forest' | 'ocean' | 'sunset' | 'earth' | 'sky',
): HarmonyResult {
  const base = new Color(baseColor)
  const hsl = base.toHSL()

  let hueOffsets: number[]
  let saturationFactors: number[]
  let lightnessOffsets: number[]

  switch (theme) {
    case 'forest':
      hueOffsets = [0, 15, -15, 30, 45] // Green variations
      saturationFactors = [1, 0.8, 1.2, 0.7, 0.9]
      lightnessOffsets = [0, 10, -10, 15, -5]
      break

    case 'ocean':
      hueOffsets = [0, -20, 20, -40, 10] // Blue-cyan range
      saturationFactors = [1, 0.7, 1.1, 0.6, 0.9]
      lightnessOffsets = [0, 15, -10, 20, 5]
      break

    case 'sunset':
      hueOffsets = [0, -30, 30, -60, 15] // Orange-red-purple
      saturationFactors = [1, 1.2, 1.1, 0.8, 1.15]
      lightnessOffsets = [0, -10, 10, 15, -5]
      break

    case 'earth':
      hueOffsets = [0, 10, -10, 20, -5] // Brown-orange tones
      saturationFactors = [1, 0.6, 0.7, 0.5, 0.8]
      lightnessOffsets = [0, -15, 10, -20, 5]
      break

    case 'sky':
      hueOffsets = [0, 30, -15, 45, 15] // Blue-cyan-violet
      saturationFactors = [1, 0.7, 0.8, 0.6, 0.75]
      lightnessOffsets = [0, 20, 10, 25, 15]
      break
  }

  const colors = hueOffsets.map((hueOffset, i) => {
    return Color.fromHSL(
      (hsl.h + hueOffset + 360) % 360,
      Math.max(0, Math.min(100, hsl.s * saturationFactors[i])),
      Math.max(0, Math.min(100, hsl.l + lightnessOffsets[i])),
    )
  })

  const metrics = evaluateHarmonyMetrics(colors, base)

  return {
    type: 'custom',
    baseColor: base,
    colors,
    score: calculateHarmonyScore(metrics),
    metrics,
    suggestions: [],
  }
}

/**
 * Optimize harmony by adjusting colors
 *
 * Attempts to improve harmony score by making small adjustments to colors.
 *
 * @param colors - Input colors
 * @param baseColor - Base color (preserved)
 * @param targetScore - Target harmony score
 * @returns Optimized colors
 * @example
 * ```ts
 * const optimized = optimizeHarmony(colors, base, 85);
 * ```
 */
export function optimizeHarmony(
  colors: Color[],
  baseColor: Color,
  targetScore = 85,
): Color[] {
  let currentColors = [...colors]
  let currentMetrics = evaluateHarmonyMetrics(currentColors, baseColor)
  let currentScore = calculateHarmonyScore(currentMetrics)

  const maxIterations = 10
  let iteration = 0

  while (currentScore < targetScore && iteration < maxIterations) {
    // Try small adjustments
    const adjusted = currentColors.map((color, i) => {
      if (i === 0)
        return color // Preserve base color

      const hsl = color.toHSL()

      // Small random adjustments
      const hueAdjust = (Math.random() - 0.5) * 10
      const satAdjust = (Math.random() - 0.5) * 10
      const lightAdjust = (Math.random() - 0.5) * 10

      return Color.fromHSL(
        (hsl.h + hueAdjust + 360) % 360,
        Math.max(0, Math.min(100, hsl.s + satAdjust)),
        Math.max(0, Math.min(100, hsl.l + lightAdjust)),
      )
    })

    const newMetrics = evaluateHarmonyMetrics(adjusted, baseColor)
    const newScore = calculateHarmonyScore(newMetrics)

    if (newScore > currentScore) {
      currentColors = adjusted
      currentMetrics = newMetrics
      currentScore = newScore
    }

    iteration++
  }

  return currentColors
}

/**
 * Find best harmony type for a color
 *
 * Evaluates all harmony types and returns the one with highest score.
 *
 * @param baseColor - Base color
 * @returns Best harmony result
 * @example
 * ```ts
 * const best = findBestHarmony('#3498db');
 * console.log(best.type); // 'triadic'
 * console.log(best.score); // 92
 * ```
 */
export function findBestHarmony(baseColor: ColorInput): HarmonyResult {
  const types: HarmonyType[] = [
    'monochromatic',
    'analogous',
    'complementary',
    'split-complementary',
    'triadic',
    'tetradic',
    'square',
  ]

  const results = types.map(type =>
    generateHarmony(baseColor, { type }),
  )

  // Sort by score and return best
  results.sort((a, b) => b.score - a.score)

  return results[0]
}
