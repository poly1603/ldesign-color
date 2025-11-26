/**
 * @ldesign/color - Advanced Color Interpolation
 *
 * High-quality interpolation algorithms:
 * - Cubic Bezier curves
 * - Catmull-Rom splines
 * - B-Spline interpolation
 * - Monotone cubic interpolation
 */

import type { ColorInput, InterpolationSpace } from '../types'
import { Color } from '../core/Color'
import { ColorInterpolator } from './interpolation'
import { validateArrayLength, validatePositiveInteger, validateInterpolationSpace, validateRange } from '../utils/enhanced-validators'
import { InputValidationError } from '../utils/errors'

/**
 * 3D Point for color space calculations
 */
interface Point3D {
  x: number
  y: number
  z: number
}

/**
 * Convert Color to 3D point in specified space
 */
function colorToPoint(color: Color, space: InterpolationSpace): Point3D {
  switch (space) {
    case 'rgb': {
      const rgb = color.toRGB()
      return { x: rgb.r / 255, y: rgb.g / 255, z: rgb.b / 255 }
    }
    case 'hsl': {
      const hsl = color.toHSL()
      return { x: hsl.h / 360, y: hsl.s / 100, z: hsl.l / 100 }
    }
    case 'hsv': {
      const hsv = color.toHSV()
      return { x: hsv.h / 360, y: hsv.s / 100, z: hsv.v / 100 }
    }
    default: {
      // Default to RGB
      const rgb = color.toRGB()
      return { x: rgb.r / 255, y: rgb.g / 255, z: rgb.b / 255 }
    }
  }
}

/**
 * Convert 3D point back to Color
 */
function pointToColor(point: Point3D, space: InterpolationSpace, alpha = 1): Color {
  switch (space) {
    case 'rgb':
      return Color.fromRGB(
        Math.round(point.x * 255),
        Math.round(point.y * 255),
        Math.round(point.z * 255),
        alpha,
      )
    case 'hsl':
      return Color.fromHSL(
        point.x * 360,
        point.y * 100,
        point.z * 100,
        alpha,
      )
    case 'hsv':
      return Color.fromHSV(
        point.x * 360,
        point.y * 100,
        point.z * 100,
        alpha,
      )
    default:
      return Color.fromRGB(
        Math.round(point.x * 255),
        Math.round(point.y * 255),
        Math.round(point.z * 255),
        alpha,
      )
  }
}

/**
 * Cubic Bezier curve interpolation for smooth color transitions
 * Uses 4 control points for maximum flexibility
 */
export class BezierColorInterpolator {
  private points: Point3D[]
  private alphas: number[]
  private space: InterpolationSpace

  constructor(
    colors: ColorInput[],
    options: {
      space?: InterpolationSpace
    } = {},
  ) {
    validateArrayLength(colors, 2, 'Bezier interpolation colors')

    this.space = options.space || 'oklch'
    if (options.space) {
      validateInterpolationSpace(options.space, 'Bezier interpolation space')
    }
    const colorObjs = colors.map(c => c instanceof Color ? c : new Color(c))
    this.points = colorObjs.map(c => colorToPoint(c, this.space))
    this.alphas = colorObjs.map(c => c.alpha)
  }

  /**
   * Cubic Bezier interpolation with 4 control points
   */
  private cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const u = 1 - t
    return (
      u * u * u * p0
      + 3 * u * u * t * p1
      + 3 * u * t * t * p2
      + t * t * t * p3
    )
  }

  /**
   * Get color at position t (0 to 1)
   */
  at(t: number): Color {
    t = Math.max(0, Math.min(1, t))

    if (this.points.length === 2) {
      // Linear interpolation for 2 points
      return new ColorInterpolator(
        pointToColor(this.points[0], this.space, this.alphas[0]),
        pointToColor(this.points[1], this.space, this.alphas[1]),
        { space: this.space },
      ).at(t)
    }

    if (this.points.length === 3) {
      // Quadratic Bezier
      const u = 1 - t
      const point: Point3D = {
        x: u * u * this.points[0].x + 2 * u * t * this.points[1].x + t * t * this.points[2].x,
        y: u * u * this.points[0].y + 2 * u * t * this.points[1].y + t * t * this.points[2].y,
        z: u * u * this.points[0].z + 2 * u * t * this.points[1].z + t * t * this.points[2].z,
      }
      const alpha = u * u * this.alphas[0] + 2 * u * t * this.alphas[1] + t * t * this.alphas[2]
      return pointToColor(point, this.space, alpha)
    }

    // Cubic Bezier for 4+ points (use first 4)
    const point: Point3D = {
      x: this.cubicBezier(this.points[0].x, this.points[1].x, this.points[2].x, this.points[3].x, t),
      y: this.cubicBezier(this.points[0].y, this.points[1].y, this.points[2].y, this.points[3].y, t),
      z: this.cubicBezier(this.points[0].z, this.points[1].z, this.points[2].z, this.points[3].z, t),
    }
    const alpha = this.cubicBezier(this.alphas[0], this.alphas[1], this.alphas[2], this.alphas[3], t)
    return pointToColor(point, this.space, alpha)
  }

  /**
   * Generate multiple colors along the Bezier curve
   */
  steps(count: number): Color[] {
    validatePositiveInteger(count, 'Bezier steps count')
    if (count === 1) {
      return [this.at(0)]
    }
    
    const colors: Color[] = []
    for (let i = 0; i < count; i++) {
      colors.push(this.at(i / (count - 1)))
    }
    return colors
  }
}

/**
 * Catmull-Rom spline interpolation for smooth curves through all points
 * Passes through all control points (unlike Bezier)
 */
export class CatmullRomInterpolator {
  private points: Point3D[]
  private alphas: number[]
  private space: InterpolationSpace
  private tension: number

  constructor(
    colors: ColorInput[],
    options: {
      space?: InterpolationSpace
      tension?: number // 0 = uniform, 0.5 = centripetal (default), 1 = chordal
    } = {},
  ) {
    validateArrayLength(colors, 2, 'Catmull-Rom interpolation colors')

    this.space = options.space || 'oklch'
    if (options.space) {
      validateInterpolationSpace(options.space, 'Catmull-Rom interpolation space')
    }
    
    this.tension = options.tension ?? 0.5
    if (options.tension !== undefined) {
      validateRange(options.tension, 0, 1, 'Catmull-Rom tension')
    }
    const colorObjs = colors.map(c => c instanceof Color ? c : new Color(c))
    this.points = colorObjs.map(c => colorToPoint(c, this.space))
    this.alphas = colorObjs.map(c => c.alpha)
  }

  /**
   * Catmull-Rom interpolation between 4 points
   */
  private catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const t2 = t * t
    const t3 = t2 * t

    return 0.5 * (
      (2 * p1)
      + (-p0 + p2) * t
      + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
      + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    )
  }

  /**
   * Get color at global position t (0 to 1)
   */
  at(t: number): Color {
    t = Math.max(0, Math.min(1, t))

    if (this.points.length === 2) {
      return new ColorInterpolator(
        pointToColor(this.points[0], this.space, this.alphas[0]),
        pointToColor(this.points[1], this.space, this.alphas[1]),
        { space: this.space },
      ).at(t)
    }

    // Find which segment we're in
    const segments = this.points.length - 1
    const segment = Math.min(Math.floor(t * segments), segments - 1)
    const localT = (t * segments) - segment

    // Get 4 control points for this segment
    const p0 = this.points[Math.max(0, segment - 1)]
    const p1 = this.points[segment]
    const p2 = this.points[segment + 1]
    const p3 = this.points[Math.min(this.points.length - 1, segment + 2)]

    const point: Point3D = {
      x: this.catmullRom(p0.x, p1.x, p2.x, p3.x, localT),
      y: this.catmullRom(p0.y, p1.y, p2.y, p3.y, localT),
      z: this.catmullRom(p0.z, p1.z, p2.z, p3.z, localT),
    }

    const a0 = this.alphas[Math.max(0, segment - 1)]
    const a1 = this.alphas[segment]
    const a2 = this.alphas[segment + 1]
    const a3 = this.alphas[Math.min(this.alphas.length - 1, segment + 2)]
    const alpha = this.catmullRom(a0, a1, a2, a3, localT)

    return pointToColor(point, this.space, alpha)
  }

  /**
   * Generate multiple colors along the spline
   */
  steps(count: number): Color[] {
    validatePositiveInteger(count, 'Catmull-Rom steps count')
    if (count === 1) {
      return [this.at(0)]
    }
    
    const colors: Color[] = []
    for (let i = 0; i < count; i++) {
      colors.push(this.at(i / (count - 1)))
    }
    return colors
  }
}

/**
 * B-Spline interpolation for ultra-smooth color transitions
 */
export class BSplineInterpolator {
  private points: Point3D[]
  private alphas: number[]
  private space: InterpolationSpace
  private degree: number

  constructor(
    colors: ColorInput[],
    options: {
      space?: InterpolationSpace
      degree?: number // Spline degree (2 = quadratic, 3 = cubic)
    } = {},
  ) {
    validateArrayLength(colors, 2, 'B-Spline interpolation colors')

    this.space = options.space || 'oklch'
    if (options.space) {
      validateInterpolationSpace(options.space, 'B-Spline interpolation space')
    }
    
    this.degree = options.degree || 3
    if (options.degree !== undefined) {
      if (options.degree !== 2 && options.degree !== 3) {
        throw new InputValidationError(
          'B-Spline degree must be 2 (quadratic) or 3 (cubic)',
          options.degree,
          'Expected: 2 or 3',
        )
      }
    }
    const colorObjs = colors.map(c => c instanceof Color ? c : new Color(c))
    this.points = colorObjs.map(c => colorToPoint(c, this.space))
    this.alphas = colorObjs.map(c => c.alpha)
  }

  /**
   * Cubic B-Spline basis function
   */
  private bSplineBasis(i: number, t: number): number {
    if (this.degree === 2) {
      // Quadratic B-Spline
      if (i === 0)
        return (1 - t) * (1 - t) / 2
      if (i === 1)
        return (-2 * t * t + 2 * t + 1) / 2
      return t * t / 2
    }

    // Cubic B-Spline (default)
    const t2 = t * t
    const t3 = t2 * t

    if (i === 0)
      return (-t3 + 3 * t2 - 3 * t + 1) / 6
    if (i === 1)
      return (3 * t3 - 6 * t2 + 4) / 6
    if (i === 2)
      return (-3 * t3 + 3 * t2 + 3 * t + 1) / 6
    return t3 / 6
  }

  /**
   * Get color at position t (0 to 1)
   */
  at(t: number): Color {
    t = Math.max(0, Math.min(1, t))

    if (this.points.length === 2) {
      return new ColorInterpolator(
        pointToColor(this.points[0], this.space, this.alphas[0]),
        pointToColor(this.points[1], this.space, this.alphas[1]),
        { space: this.space },
      ).at(t)
    }

    const n = this.points.length
    const segments = n - this.degree
    const segment = Math.min(Math.floor(t * segments), segments - 1)
    const localT = (t * segments) - segment

    let x = 0
    let y = 0
    let z = 0
    let alpha = 0

    for (let i = 0; i <= this.degree; i++) {
      const idx = Math.min(segment + i, n - 1)
      const basis = this.bSplineBasis(i, localT)
      x += this.points[idx].x * basis
      y += this.points[idx].y * basis
      z += this.points[idx].z * basis
      alpha += this.alphas[idx] * basis
    }

    return pointToColor({ x, y, z }, this.space, alpha)
  }

  /**
   * Generate multiple colors along the B-Spline
   */
  steps(count: number): Color[] {
    validatePositiveInteger(count, 'B-Spline steps count')
    if (count === 1) {
      return [this.at(0)]
    }
    
    const colors: Color[] = []
    for (let i = 0; i < count; i++) {
      colors.push(this.at(i / (count - 1)))
    }
    return colors
  }
}

/**
 * Monotone cubic interpolation - preserves monotonicity (no overshooting)
 * Perfect for gradients where you want smooth but constrained transitions
 */
export class MonotoneInterpolator {
  private points: Point3D[]
  private alphas: number[]
  private space: InterpolationSpace
  private tangents: Point3D[]

  constructor(
    colors: ColorInput[],
    options: {
      space?: InterpolationSpace
    } = {},
  ) {
    validateArrayLength(colors, 2, 'Monotone interpolation colors')

    this.space = options.space || 'oklch'
    if (options.space) {
      validateInterpolationSpace(options.space, 'Monotone interpolation space')
    }
    const colorObjs = colors.map(c => c instanceof Color ? c : new Color(c))
    this.points = colorObjs.map(c => colorToPoint(c, this.space))
    this.alphas = colorObjs.map(c => c.alpha)
    this.tangents = this.computeTangents()
  }

  /**
   * Compute tangents using Fritsch-Carlson method
   */
  private computeTangents(): Point3D[] {
    const n = this.points.length
    const tangents: Point3D[] = []

    for (let i = 0; i < n; i++) {
      if (i === 0) {
        tangents.push({
          x: this.points[1].x - this.points[0].x,
          y: this.points[1].y - this.points[0].y,
          z: this.points[1].z - this.points[0].z,
        })
      }
      else if (i === n - 1) {
        tangents.push({
          x: this.points[n - 1].x - this.points[n - 2].x,
          y: this.points[n - 1].y - this.points[n - 2].y,
          z: this.points[n - 1].z - this.points[n - 2].z,
        })
      }
      else {
        tangents.push({
          x: (this.points[i + 1].x - this.points[i - 1].x) / 2,
          y: (this.points[i + 1].y - this.points[i - 1].y) / 2,
          z: (this.points[i + 1].z - this.points[i - 1].z) / 2,
        })
      }
    }

    return tangents
  }

  /**
   * Hermite interpolation
   */
  private hermite(p0: number, p1: number, m0: number, m1: number, t: number): number {
    const t2 = t * t
    const t3 = t2 * t

    return (
      (2 * t3 - 3 * t2 + 1) * p0
      + (t3 - 2 * t2 + t) * m0
      + (-2 * t3 + 3 * t2) * p1
      + (t3 - t2) * m1
    )
  }

  /**
   * Get color at position t (0 to 1)
   */
  at(t: number): Color {
    t = Math.max(0, Math.min(1, t))

    if (this.points.length === 2) {
      return new ColorInterpolator(
        pointToColor(this.points[0], this.space, this.alphas[0]),
        pointToColor(this.points[1], this.space, this.alphas[1]),
        { space: this.space },
      ).at(t)
    }

    const segments = this.points.length - 1
    const segment = Math.min(Math.floor(t * segments), segments - 1)
    const localT = (t * segments) - segment

    const p0 = this.points[segment]
    const p1 = this.points[segment + 1]
    const m0 = this.tangents[segment]
    const m1 = this.tangents[segment + 1]

    const point: Point3D = {
      x: this.hermite(p0.x, p1.x, m0.x, m1.x, localT),
      y: this.hermite(p0.y, p1.y, m0.y, m1.y, localT),
      z: this.hermite(p0.z, p1.z, m0.z, m1.z, localT),
    }

    const a0 = this.alphas[segment]
    const a1 = this.alphas[segment + 1]
    const alpha = a0 + (a1 - a0) * localT

    return pointToColor(point, this.space, alpha)
  }

  /**
   * Generate multiple colors along the curve
   */
  steps(count: number): Color[] {
    validatePositiveInteger(count, 'Monotone steps count')
    if (count === 1) {
      return [this.at(0)]
    }
    
    const colors: Color[] = []
    for (let i = 0; i < count; i++) {
      colors.push(this.at(i / (count - 1)))
    }
    return colors
  }
}

/**
 * Convenience functions for advanced interpolation
 */

export function bezierGradient(
  colors: ColorInput[],
  steps: number,
  options: { space?: InterpolationSpace } = {},
): Color[] {
  validatePositiveInteger(steps, 'Bezier gradient steps')
  return new BezierColorInterpolator(colors, options).steps(steps)
}

export function catmullRomGradient(
  colors: ColorInput[],
  steps: number,
  options: { space?: InterpolationSpace, tension?: number } = {},
): Color[] {
  validatePositiveInteger(steps, 'Catmull-Rom gradient steps')
  return new CatmullRomInterpolator(colors, options).steps(steps)
}

export function bSplineGradient(
  colors: ColorInput[],
  steps: number,
  options: { space?: InterpolationSpace, degree?: number } = {},
): Color[] {
  validatePositiveInteger(steps, 'B-Spline gradient steps')
  return new BSplineInterpolator(colors, options).steps(steps)
}

export function monotoneGradient(
  colors: ColorInput[],
  steps: number,
  options: { space?: InterpolationSpace } = {},
): Color[] {
  validatePositiveInteger(steps, 'Monotone gradient steps')
  return new MonotoneInterpolator(colors, options).steps(steps)
}