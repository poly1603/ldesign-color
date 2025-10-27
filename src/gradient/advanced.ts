/**
 * @ldesign/color - Advanced Gradient Utilities
 *
 * Advanced gradient generation with midpoint control, non-linear gradients,
 * and CSS code generation.
 *
 * @module gradient/advanced
 */

import type { ColorInput, EasingFunction, InterpolationSpace } from '../types'
import { ColorInterpolator } from '../animation/interpolation'
import { Color } from '../core/Color'

// ============================================
// Gradient with Midpoint Control
// ============================================

/**
 * Gradient stop with optional midpoint
 */
export interface AdvancedGradientStop {
  color: ColorInput
  position: number // 0-100
  midpoint?: number // 0-1, position of midpoint to next stop
}

/**
 * Generate gradient with midpoint control
 *
 * Allows fine control over color transitions by specifying midpoints
 * between color stops.
 *
 * @param stops - Gradient stops with optional midpoints
 * @param steps - Number of color steps to generate
 * @param space - Color interpolation space
 * @returns Array of interpolated colors
 * @performance O(n * m) where m is number of stops
 * @example
 * ```ts
 * const gradient = generateGradientWithMidpoints([
 *   { color: '#ff0000', position: 0, midpoint: 0.3 },
 *   { color: '#00ff00', position: 50, midpoint: 0.7 },
 *   { color: '#0000ff', position: 100 }
 * ], 100, 'oklch');
 * ```
 */
export function generateGradientWithMidpoints(
  stops: AdvancedGradientStop[],
  steps: number,
  space: InterpolationSpace = 'oklch',
): Color[] {
  if (stops.length === 0)
    return []
  if (stops.length === 1) {
    return Array.from({ length: steps }, () => new Color(stops[0].color))
  }

  // Sort stops by position
  const sortedStops = [...stops].sort((a, b) => a.position - b.position)

  const colors: Color[] = []

  for (let i = 0; i < steps; i++) {
    const t = (i / (steps - 1)) * 100

    // Find surrounding stops
    let prevStop = sortedStops[0]
    let nextStop = sortedStops[sortedStops.length - 1]

    for (let j = 0; j < sortedStops.length - 1; j++) {
      if (t >= sortedStops[j].position && t <= sortedStops[j + 1].position) {
        prevStop = sortedStops[j]
        nextStop = sortedStops[j + 1]
        break
      }
    }

    // Calculate local t (0-1) within the segment
    const segmentRange = nextStop.position - prevStop.position
    let localT = segmentRange > 0 ? (t - prevStop.position) / segmentRange : 0

    // Apply midpoint adjustment
    if (prevStop.midpoint !== undefined) {
      localT = applyMidpoint(localT, prevStop.midpoint)
    }

    // Interpolate
    const interpolator = new ColorInterpolator(prevStop.color, nextStop.color, { space })
    colors.push(interpolator.at(localT))
  }

  return colors
}

/**
 * Apply midpoint curve to interpolation parameter
 *
 * Midpoint value of 0.5 = linear, <0.5 = ease towards start, >0.5 = ease towards end
 */
function applyMidpoint(t: number, midpoint: number): number {
  if (midpoint <= 0 || midpoint >= 1)
    midpoint = 0.5

  // Use power function for midpoint adjustment
  if (t < midpoint) {
    return (t / midpoint) ** (Math.log(0.5) / Math.log(midpoint)) * midpoint
  }
  else {
    return 1 - ((1 - t) / (1 - midpoint)) ** (Math.log(0.5) / Math.log(1 - midpoint)) * (1 - midpoint)
  }
}

// ============================================
// Non-linear Gradients
// ============================================

/**
 * Generate gradient with custom easing
 *
 * @param colors - Array of colors
 * @param steps - Number of steps
 * @param easing - Easing function
 * @param space - Interpolation space
 * @returns Gradient colors
 * @example
 * ```ts
 * const gradient = generateEasedGradient(
 *   ['#ff0000', '#0000ff'],
 *   100,
 *   'ease-in-out',
 *   'oklch'
 * );
 * ```
 */
export function generateEasedGradient(
  colors: ColorInput[],
  steps: number,
  easing: EasingFunction | ((t: number) => number) = 'ease-in-out',
  space: InterpolationSpace = 'oklch',
): Color[] {
  if (colors.length < 2) {
    return Array.from({ length: steps }, () => new Color(colors[0] || '#000'))
  }

  const result: Color[] = []
  const segments = colors.length - 1
  const stepsPerSegment = steps / segments

  for (let segment = 0; segment < segments; segment++) {
    const segmentSteps = Math.round(stepsPerSegment)
    const interpolator = new ColorInterpolator(
      colors[segment],
      colors[segment + 1],
      { space, easing },
    )

    const segmentColors = interpolator.steps(segmentSteps + 1)

    // Add all except last to avoid duplication
    if (segment < segments - 1) {
      result.push(...segmentColors.slice(0, -1))
    }
    else {
      result.push(...segmentColors)
    }
  }

  // Adjust to exact step count
  if (result.length > steps) {
    return result.slice(0, steps)
  }
  else if (result.length < steps) {
    // Pad with last color if needed
    while (result.length < steps) {
      result.push(result[result.length - 1].clone())
    }
  }

  return result
}

// ============================================
// Gradient Reversal
// ============================================

/**
 * Reverse a gradient
 *
 * @param gradient - Array of colors
 * @returns Reversed gradient
 * @example
 * ```ts
 * const original = gradient(['#ff0000', '#0000ff'], 100);
 * const reversed = reverseGradient(original);
 * ```
 */
export function reverseGradient(gradient: Color[]): Color[] {
  return [...gradient].reverse()
}

/**
 * Reverse gradient CSS string
 *
 * @param cssGradient - CSS gradient string
 * @returns Reversed CSS gradient
 * @example
 * ```ts
 * const original = 'linear-gradient(90deg, #ff0000, #0000ff)';
 * const reversed = reverseGradientCSS(original);
 * // Output: 'linear-gradient(90deg, #0000ff, #ff0000)'
 * ```
 */
export function reverseGradientCSS(cssGradient: string): string {
  // Extract colors from CSS gradient
  const colorMatches = cssGradient.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)/g)

  if (!colorMatches)
    return cssGradient

  // Reverse the order
  const reversed = colorMatches.reverse().join(', ')

  // Replace in original string
  return cssGradient.replace(
    /(?:#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))(?:\s+\d+%)?(?:,\s*)?/g,
    (match, index) => {
      const colorIndex = Math.floor(index / match.length)
      return colorIndex < colorMatches.length ? colorMatches[colorMatches.length - 1 - colorIndex] : match
    },
  )
}

// ============================================
// CSS Gradient Code Generation
// ============================================

/**
 * Linear gradient CSS options
 */
export interface LinearGradientCSSOptions {
  angle?: number | string
  repeating?: boolean
  stops?: Array<{ color: ColorInput, position?: number }>
}

/**
 * Generate linear gradient CSS
 *
 * @param colors - Array of colors or custom stops
 * @param options - CSS generation options
 * @returns CSS linear-gradient string
 * @example
 * ```ts
 * const css = generateLinearGradientCSS(['#ff0000', '#0000ff'], {
 *   angle: 45,
 *   repeating: false
 * });
 * // Output: 'linear-gradient(45deg, #ff0000, #0000ff)'
 * ```
 */
export function generateLinearGradientCSS(
  colors: ColorInput[] | Array<{ color: ColorInput, position?: number }>,
  options: LinearGradientCSSOptions = {},
): string {
  const { angle = 90, repeating = false, stops } = options

  const gradientStops = stops || (colors as ColorInput[]).map((c, i, arr) => ({
    color: c,
    position: arr.length > 1 ? (i / (arr.length - 1)) * 100 : 0,
  }))

  const stopsStr = gradientStops.map((stop) => {
    const color = new Color(stop.color)
    const hex = color.toHex()
    color.dispose()

    const pos = stop.position !== undefined ? ` ${stop.position}%` : ''
    return `${hex}${pos}`
  }).join(', ')

  const angleStr = typeof angle === 'number' ? `${angle}deg` : angle
  const prefix = repeating ? 'repeating-linear-gradient' : 'linear-gradient'

  return `${prefix}(${angleStr}, ${stopsStr})`
}

/**
 * Radial gradient CSS options
 */
export interface RadialGradientCSSOptions {
  shape?: 'circle' | 'ellipse'
  size?: 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner' | string
  position?: string
  repeating?: boolean
}

/**
 * Generate radial gradient CSS
 *
 * @param colors - Array of colors
 * @param options - CSS generation options
 * @returns CSS radial-gradient string
 * @example
 * ```ts
 * const css = generateRadialGradientCSS(['#ff0000', '#0000ff'], {
 *   shape: 'circle',
 *   size: 'farthest-corner',
 *   position: 'center center'
 * });
 * ```
 */
export function generateRadialGradientCSS(
  colors: ColorInput[],
  options: RadialGradientCSSOptions = {},
): string {
  const {
    shape = 'circle',
    size = 'farthest-corner',
    position = 'center center',
    repeating = false,
  } = options

  const stopsStr = colors.map((c, i, arr) => {
    const color = new Color(c)
    const hex = color.toHex()
    color.dispose()

    const pos = arr.length > 1 ? ` ${(i / (arr.length - 1)) * 100}%` : ''
    return `${hex}${pos}`
  }).join(', ')

  const prefix = repeating ? 'repeating-radial-gradient' : 'radial-gradient'

  return `${prefix}(${shape} ${size} at ${position}, ${stopsStr})`
}

/**
 * Conic gradient CSS options
 */
export interface ConicGradientCSSOptions {
  angle?: number
  position?: string
  repeating?: boolean
}

/**
 * Generate conic gradient CSS
 *
 * @param colors - Array of colors
 * @param options - CSS generation options
 * @returns CSS conic-gradient string
 * @example
 * ```ts
 * const css = generateConicGradientCSS(['#ff0000', '#00ff00', '#0000ff'], {
 *   angle: 0,
 *   position: 'center'
 * });
 * ```
 */
export function generateConicGradientCSS(
  colors: ColorInput[],
  options: ConicGradientCSSOptions = {},
): string {
  const {
    angle = 0,
    position = 'center center',
    repeating = false,
  } = options

  const stopsStr = colors.map((c, i, arr) => {
    const color = new Color(c)
    const hex = color.toHex()
    color.dispose()

    const pos = arr.length > 1 ? ` ${(i / (arr.length - 1)) * 360}deg` : ''
    return `${hex}${pos}`
  }).join(', ')

  const prefix = repeating ? 'repeating-conic-gradient' : 'conic-gradient'
  const fromAngle = angle !== 0 ? `from ${angle}deg ` : ''

  return `${prefix}(${fromAngle}at ${position}, ${stopsStr})`
}

// ============================================
// Gradient Manipulation
// ============================================

/**
 * Adjust gradient contrast
 *
 * Makes gradients more or less contrasty by adjusting color positions.
 *
 * @param colors - Gradient colors
 * @param amount - Contrast adjustment (-100 to 100)
 * @returns Adjusted gradient
 * @example
 * ```ts
 * const highContrast = adjustGradientContrast(gradient, 50);
 * const lowContrast = adjustGradientContrast(gradient, -50);
 * ```
 */
export function adjustGradientContrast(
  colors: Color[],
  amount: number,
): Color[] {
  if (colors.length < 3)
    return colors

  const factor = 1 + (amount / 100)
  const midIndex = Math.floor(colors.length / 2)

  return colors.map((color, i) => {
    if (i === 0 || i === colors.length - 1)
      return color

    // Adjust distance from midpoint
    const distanceFromMid = Math.abs(i - midIndex) / midIndex
    const adjustedDistance = distanceFromMid ** factor

    // Interpolate based on adjusted distance
    const targetIndex = i < midIndex
      ? midIndex - (adjustedDistance * midIndex)
      : midIndex + (adjustedDistance * midIndex)

    return colors[Math.round(targetIndex)] || color
  })
}

/**
 * Smooth gradient using Gaussian blur
 *
 * @param colors - Input colors
 * @param sigma - Blur sigma (higher = more blur)
 * @returns Smoothed gradient
 */
export function smoothGradient(
  colors: Color[],
  sigma = 1.0,
): Color[] {
  if (colors.length < 3)
    return colors

  const smoothed: Color[] = []
  const kernelSize = Math.ceil(sigma * 3)

  for (let i = 0; i < colors.length; i++) {
    let sumR = 0; let sumG = 0; let sumB = 0; let sumWeight = 0

    for (let j = -kernelSize; j <= kernelSize; j++) {
      const index = Math.max(0, Math.min(colors.length - 1, i + j))
      const weight = gaussianWeight(j, sigma)

      const rgb = colors[index].toRGB()
      sumR += rgb.r * weight
      sumG += rgb.g * weight
      sumB += rgb.b * weight
      sumWeight += weight
      Color.returnRGB(rgb)
    }

    smoothed.push(Color.fromRGB(
      Math.round(sumR / sumWeight),
      Math.round(sumG / sumWeight),
      Math.round(sumB / sumWeight),
    ))
  }

  return smoothed
}

/**
 * Gaussian weight function
 */
function gaussianWeight(x: number, sigma: number): number {
  return Math.exp(-(x * x) / (2 * sigma * sigma))
}

/**
 * Add color stops to existing gradient
 *
 * @param colors - Existing gradient
 * @param newColors - Colors to add
 * @param positions - Positions for new colors (0-1)
 * @param space - Interpolation space
 * @returns Enhanced gradient
 * @example
 * ```ts
 * const original = gradient(['#ff0000', '#0000ff'], 100);
 * const enhanced = addGradientStops(
 *   original,
 *   ['#ffff00'],
 *   [0.5],
 *   'oklch'
 * );
 * ```
 */
export function addGradientStops(
  colors: Color[],
  newColors: ColorInput[],
  positions: number[],
  space: InterpolationSpace = 'oklch',
): Color[] {
  const stops: AdvancedGradientStop[] = colors.map((color, i) => ({
    color,
    position: (i / (colors.length - 1)) * 100,
  }))

  // Add new stops
  newColors.forEach((color, i) => {
    stops.push({
      color,
      position: (positions[i] || 0) * 100,
    })
  })

  // Regenerate gradient
  return generateGradientWithMidpoints(stops, colors.length, space)
}

/**
 * Extract evenly spaced colors from gradient
 *
 * @param colors - Gradient colors
 * @param count - Number of colors to extract
 * @returns Extracted colors
 * @example
 * ```ts
 * const gradient = gradient(['#ff0000', '#0000ff'], 1000);
 * const palette = sampleGradient(gradient, 5);
 * // Returns 5 evenly spaced colors
 * ```
 */
export function sampleGradient(
  colors: Color[],
  count: number,
): Color[] {
  if (count >= colors.length)
    return colors
  if (count <= 0)
    return []

  const sampled: Color[] = []
  const step = (colors.length - 1) / (count - 1)

  for (let i = 0; i < count; i++) {
    const index = Math.round(i * step)
    sampled.push(colors[index].clone())
  }

  return sampled
}

// ============================================
// Gradient Analysis
// ============================================

/**
 * Analyze gradient for issues
 *
 * @param colors - Gradient colors
 * @returns Analysis result
 * @example
 * ```ts
 * const analysis = analyzeGradient(gradient);
 * if (analysis.hasContrast Issues) {
 *   console.warn('Gradient may have contrast issues');
 * }
 * ```
 */
export function analyzeGradient(colors: Color[]): {
  hasContrastIssues: boolean
  hasColorBanding: boolean
  smoothness: number // 0-1
  colorRange: number // Delta E between first and last
  averageStepDistance: number
} {
  if (colors.length < 2) {
    return {
      hasContrastIssues: false,
      hasColorBanding: false,
      smoothness: 1,
      colorRange: 0,
      averageStepDistance: 0,
    }
  }

  // Calculate step distances
  const distances: number[] = []
  for (let i = 0; i < colors.length - 1; i++) {
    const dist = colors[i].deltaEOKLAB(colors[i + 1])
    distances.push(dist)
  }

  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length

  // Calculate variance in step distances
  const variance = distances.reduce((sum, d) => {
    return sum + (d - avgDistance) ** 2
  }, 0) / distances.length

  const smoothness = 1 / (1 + Math.sqrt(variance))

  // Check for color banding (large jumps)
  const hasColorBanding = distances.some(d => d > avgDistance * 3)

  // Calculate total color range
  const colorRange = colors[0].deltaE2000(colors[colors.length - 1])

  // Check contrast issues (very similar consecutive colors)
  const hasContrastIssues = distances.some(d => d < 0.5)

  return {
    hasContrastIssues,
    hasColorBanding,
    smoothness,
    colorRange,
    averageStepDistance: avgDistance,
  }
}
