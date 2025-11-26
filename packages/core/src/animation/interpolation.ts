/**
 * @ldesign/color - Color Interpolation
 *
 * Advanced color interpolation in perceptually uniform color spaces
 */

import type { ColorInput, EasingFunction, InterpolationSpace } from '../types'
import { labToRGB, oklabToRGB, oklchToOKLAB, rgbToLAB, rgbToOKLAB, rgbToOKLCH } from '../core/colorSpaces'
import { Color } from '../core/Color'
import { lerp } from '../utils/math'

/**
 * Easing functions for smooth interpolation
 */
const EASING_FUNCTIONS: Record<string, (t: number) => number> = {
  'linear': (t: number) => t,
  'ease': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  'ease-in': (t: number) => t * t,
  'ease-out': (t: number) => t * (2 - t),
  'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  'ease-in-quad': (t: number) => t * t,
  'ease-out-quad': (t: number) => t * (2 - t),
  'ease-in-out-quad': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  'ease-in-cubic': (t: number) => t * t * t,
  'ease-out-cubic': (t: number) => (--t) * t * t + 1,
  'ease-in-out-cubic': (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  'ease-in-quart': (t: number) => t * t * t * t,
  'ease-out-quart': (t: number) => 1 - (--t) * t * t * t,
  'ease-in-out-quart': (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  'ease-in-sine': (t: number) => 1 - Math.cos(t * Math.PI / 2),
  'ease-out-sine': (t: number) => Math.sin(t * Math.PI / 2),
  'ease-in-out-sine': (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  'ease-in-expo': (t: number) => t === 0 ? 0 : 2 ** (10 * t - 10),
  'ease-out-expo': (t: number) => t === 1 ? 1 : 1 - 2 ** (-10 * t),
  'ease-in-out-expo': (t: number) => {
    if (t === 0)
      return 0
    if (t === 1)
      return 1
    return t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2
  },
}

/**
 * Apply easing function to a value
 */
function applyEasing(t: number, easing: EasingFunction | ((t: number) => number)): number {
  if (typeof easing === 'function') {
    return easing(t)
  }
  const easingFn = EASING_FUNCTIONS[easing]
  return easingFn ? easingFn(t) : t
}

/**
 * Interpolate hue angle (handles wrapping around 360°)
 */
function interpolateHue(h1: number, h2: number, t: number, shortest = true): number {
  if (!shortest) {
    return lerp(h1, h2, t)
  }

  // Find the shortest path around the color wheel
  let diff = h2 - h1

  if (diff > 180) {
    diff -= 360
  }
  else if (diff < -180) {
    diff += 360
  }

  let result = h1 + diff * t
  if (result < 0)
    result += 360
  if (result >= 360)
    result -= 360

  return result
}

/**
 * Color Interpolator - Provides smooth color transitions
 */
export class ColorInterpolator {
  private startColor: Color
  private endColor: Color
  private space: InterpolationSpace
  private easing: EasingFunction | ((t: number) => number)

  constructor(
    start: ColorInput,
    end: ColorInput,
    options: {
      space?: InterpolationSpace
      easing?: EasingFunction | ((t: number) => number)
    } = {},
  ) {
    this.startColor = start instanceof Color ? start : new Color(start)
    this.endColor = end instanceof Color ? end : new Color(end)
    this.space = options.space || 'oklch'
    this.easing = options.easing || 'linear'
  }

  /**
   * Get interpolated color at position t (0 to 1)
   */
  at(t: number): Color {
    // Clamp t to [0, 1]
    t = Math.max(0, Math.min(1, t))

    // Apply easing
    const easedT = applyEasing(t, this.easing)

    // Interpolate in specified color space
    return this.interpolateInSpace(easedT)
  }

  /**
   * Generate multiple colors along the interpolation
   */
  steps(count: number): Color[] {
    const colors: Color[] = []
    const step = 1 / (count - 1)

    for (let i = 0; i < count; i++) {
      colors.push(this.at(i * step))
    }

    return colors
  }

  /**
   * Interpolate in the specified color space
   */
  private interpolateInSpace(t: number): Color {
    switch (this.space) {
      case 'rgb':
        return this.interpolateRGB(t)
      case 'hsl':
        return this.interpolateHSL(t)
      case 'hsv':
        return this.interpolateHSV(t)
      case 'lab':
        return this.interpolateLAB(t)
      case 'oklab':
        return this.interpolateOKLAB(t)
      case 'oklch':
      default:
        return this.interpolateOKLCH(t)
    }
  }

  /**
   * Interpolate in RGB space (may produce muddy colors)
   */
  private interpolateRGB(t: number): Color {
    const rgb1 = this.startColor.toRGB()
    const rgb2 = this.endColor.toRGB()

    return Color.fromRGB(
      Math.round(lerp(rgb1.r, rgb2.r, t)),
      Math.round(lerp(rgb1.g, rgb2.g, t)),
      Math.round(lerp(rgb1.b, rgb2.b, t)),
      lerp(this.startColor.alpha, this.endColor.alpha, t),
    )
  }

  /**
   * Interpolate in HSL space
   */
  private interpolateHSL(t: number): Color {
    const hsl1 = this.startColor.toHSL()
    const hsl2 = this.endColor.toHSL()

    const h = interpolateHue(hsl1.h, hsl2.h, t)
    const s = lerp(hsl1.s, hsl2.s, t)
    const l = lerp(hsl1.l, hsl2.l, t)
    const alpha = lerp(this.startColor.alpha, this.endColor.alpha, t)

    return Color.fromHSL(h, s, l, alpha)
  }

  /**
   * Interpolate in HSV space
   */
  private interpolateHSV(t: number): Color {
    const hsv1 = this.startColor.toHSV()
    const hsv2 = this.endColor.toHSV()

    const h = interpolateHue(hsv1.h, hsv2.h, t)
    const s = lerp(hsv1.s, hsv2.s, t)
    const v = lerp(hsv1.v, hsv2.v, t)
    const alpha = lerp(this.startColor.alpha, this.endColor.alpha, t)

    return Color.fromHSV(h, s, v, alpha)
  }

  /**
   * Interpolate in LAB space (perceptually uniform)
   */
  private interpolateLAB(t: number): Color {
    const lab1 = rgbToLAB(this.startColor.toRGB())
    const lab2 = rgbToLAB(this.endColor.toRGB())

    const l = lerp(lab1.l, lab2.l, t)
    const a = lerp(lab1.a, lab2.a, t)
    const b = lerp(lab1.b, lab2.b, t)
    const alpha = lerp(this.startColor.alpha, this.endColor.alpha, t)

    const rgb = labToRGB({ l, a, b })
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, alpha)
  }

  /**
   * Interpolate in OKLAB space (modern perceptually uniform)
   */
  private interpolateOKLAB(t: number): Color {
    const oklab1 = rgbToOKLAB(this.startColor.toRGB())
    const oklab2 = rgbToOKLAB(this.endColor.toRGB())

    const l = lerp(oklab1.l, oklab2.l, t)
    const a = lerp(oklab1.a, oklab2.a, t)
    const b = lerp(oklab1.b, oklab2.b, t)
    const alpha = lerp(this.startColor.alpha, this.endColor.alpha, t)

    const rgb = oklabToRGB({ l, a, b })
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, alpha)
  }

  /**
   * Interpolate in OKLCH space (best for most use cases)
   * Handles hue interpolation properly
   */
  private interpolateOKLCH(t: number): Color {
    const oklch1 = rgbToOKLCH(this.startColor.toRGB())
    const oklch2 = rgbToOKLCH(this.endColor.toRGB())

    const l = lerp(oklch1.l, oklch2.l, t)
    const c = lerp(oklch1.c, oklch2.c, t)
    const h = interpolateHue(oklch1.h, oklch2.h, t)
    const alpha = lerp(this.startColor.alpha, this.endColor.alpha, t)

    const oklab = oklchToOKLAB({ l, c, h })
    const rgb = oklabToRGB(oklab)
    return Color.fromRGB(rgb.r, rgb.g, rgb.b, alpha)
  }
}

/**
 * Convenience function for color interpolation
 */
export function interpolate(
  start: ColorInput,
  end: ColorInput,
  t: number,
  options: {
    space?: InterpolationSpace
    easing?: EasingFunction | ((t: number) => number)
  } = {},
): Color {
  const interpolator = new ColorInterpolator(start, end, options)
  return interpolator.at(t)
}

/**
 * Generate a smooth gradient between multiple colors
 */
export function gradient(
  colors: ColorInput[],
  steps: number,
  options: {
    space?: InterpolationSpace
    easing?: EasingFunction | ((t: number) => number)
  } = {},
): Color[] {
  if (colors.length < 2) {
    throw new Error('At least 2 colors required for gradient')
  }

  if (colors.length === 2) {
    const interpolator = new ColorInterpolator(colors[0], colors[1], options)
    return interpolator.steps(steps)
  }

  // Multiple colors: divide steps proportionally
  const result: Color[] = []
  const segments = colors.length - 1
  const stepsPerSegment = Math.floor((steps - 1) / segments)
  const remainder = (steps - 1) % segments

  for (let i = 0; i < segments; i++) {
    const segmentSteps = stepsPerSegment + (i < remainder ? 1 : 0)
    const interpolator = new ColorInterpolator(colors[i], colors[i + 1], options)
    const segmentColors = interpolator.steps(segmentSteps + 1)

    // Add all colors except the last one (to avoid duplication)
    if (i < segments - 1) {
      result.push(...segmentColors.slice(0, -1))
    }
    else {
      result.push(...segmentColors)
    }
  }

  return result
}

/**
 * Mix two colors with specified ratio in a perceptually uniform space
 */
export function mix(
  color1: ColorInput,
  color2: ColorInput,
  ratio = 0.5,
  space: InterpolationSpace = 'oklch',
): Color {
  const interpolator = new ColorInterpolator(color1, color2, { space })
  return interpolator.at(ratio)
}
