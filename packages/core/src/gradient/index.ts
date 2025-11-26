/**
 * @ldesign/color - Gradient Generator
 *
 * Comprehensive gradient generation supporting:
 * - Linear, radial, and conic gradients
 * - Mesh gradients
 * - Smooth interpolation
 * - Animated gradients
 * - CSS code generation
 *
 * @module gradient
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'

// ============================================
// Type Definitions
// ============================================

/**
 * Gradient color stop
 */
export interface GradientStop {
  color: Color
  position?: number // 0-100
}

/**
 * Gradient generation options
 */
export interface GradientOptions {
  stops?: GradientStop[]
  smoothing?: boolean // Enable smooth transitions
  colorSpace?: 'rgb' | 'hsl' | 'lab' // Interpolation color space
}

/**
 * Linear gradient options
 */
export interface LinearGradientOptions extends GradientOptions {
  angle?: number // Angle in degrees
  repeating?: boolean // Create repeating gradient
}

/**
 * Radial gradient options
 */
export interface RadialGradientOptions extends GradientOptions {
  shape?: 'circle' | 'ellipse'
  size?: 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner'
  position?: { x: string | number, y: string | number }
}

/**
 * Conic gradient options
 */
export interface ConicGradientOptions extends GradientOptions {
  startAngle?: number // Starting angle in degrees
  position?: { x: string | number, y: string | number }
}

/**
 * Mesh gradient options
 */
export interface MeshGradientOptions {
  colors: Color[][]
  smoothness?: number // 0-1
  resolution?: number // Grid resolution
}

// ============================================
// Gradient Generator Class
// ============================================

/**
 * Gradient generation utility class
 */
export class GradientGenerator {
  /**
   * Generate linear gradient CSS
   *
   * @param colors - Array of colors for gradient
   * @param options - Linear gradient options
   * @returns CSS linear-gradient string
   * @example
   * ```ts
   * const css = GradientGenerator.linear(
   *   ['#ff0000', '#0000ff'],
   *   { angle: 90 }
   * );
   * ```
   */
  static linear(colors: ColorInput[], options: LinearGradientOptions = {}): string {
    const {
      angle = 90,
      repeating = false,
      stops: customStops,
    } = options

    // Optimize: use temporary color objects and process immediately
    const stops = customStops || this.generateEvenStopsOptimized(colors)

    const prefix = repeating ? 'repeating-linear-gradient' : 'linear-gradient'
    const gradientStops = stops.map((stop) => {
      const position = stop.position !== undefined ? ` ${stop.position}%` : ''
      return `${stop.color.toRGBString()}${position}`
    }).join(', ')

    return `${prefix}(${angle}deg, ${gradientStops})`
  }

  /**
   * Generate radial gradient CSS
   *
   * @param colors - Array of colors
   * @param options - Radial gradient options
   * @returns CSS radial-gradient string
   */
  static radial(colors: ColorInput[], options: RadialGradientOptions = {}): string {
    const {
      shape = 'circle',
      size = 'farthest-corner',
      position = { x: 'center', y: 'center' },
      stops: customStops,
    } = options

    // Optimize: avoid creating unnecessary Color objects
    const stops = customStops || this.generateEvenStopsOptimized(colors)

    const posStr = `${position.x} ${position.y}`
    const gradientStops = stops.map((stop) => {
      const pos = stop.position !== undefined ? ` ${stop.position}%` : ''
      return `${stop.color.toRGBString()}${pos}`
    }).join(', ')

    return `radial-gradient(${shape} ${size} at ${posStr}, ${gradientStops})`
  }

  /**
   * Generate conic gradient CSS
   *
   * @param colors - Array of colors
   * @param options - Conic gradient options
   * @returns CSS conic-gradient string
   */
  static conic(colors: ColorInput[], options: ConicGradientOptions = {}): string {
    const {
      startAngle = 0,
      position = { x: 'center', y: 'center' },
      stops: customStops,
    } = options

    // Optimize: avoid creating unnecessary Color objects
    const stops = customStops || this.generateEvenStopsOptimized(colors, true)

    const posStr = `${position.x} ${position.y}`
    const gradientStops = stops.map((stop) => {
      const pos = stop.position !== undefined ? ` ${stop.position}deg` : ''
      return `${stop.color.toRGBString()}${pos}`
    }).join(', ')

    const fromAngle = startAngle ? `from ${startAngle}deg ` : ''
    return `conic-gradient(${fromAngle}at ${posStr}, ${gradientStops})`
  }

  /**
   * Generate mesh gradient
   *
   * Creates a complex mesh gradient using bilinear interpolation.
   *
   * @param colors - 2D array of colors
   * @param options - Mesh gradient options
   * @returns Mesh gradient with CSS fallback and canvas renderer
   */
  static mesh(colors: Color[][], options: Partial<MeshGradientOptions> = {}): {
    css: string
    canvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  } {
    const {
      smoothness = 0.5,
    } = options

    // CSS fallback - use multiple linear gradients
    const cssGradients: string[] = []
    for (let i = 0; i < colors.length - 1; i++) {
      const row = colors[i]
      const nextRow = colors[i + 1]
      for (let j = 0; j < row.length - 1; j++) {
        const tl = row[j]
        const br = nextRow[j + 1]

        // Create diagonal gradient
        const gradient = `linear-gradient(135deg, ${tl.toRGBString()} 0%, ${br.toRGBString()} 100%)`
        cssGradients.push(gradient)
      }
    }

    // Canvas render function
    const canvasRender = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const cellWidth = width / (colors[0].length - 1)
      const cellHeight = height / (colors.length - 1)

      for (let i = 0; i < colors.length - 1; i++) {
        for (let j = 0; j < colors[i].length - 1; j++) {
          const x = j * cellWidth
          const y = i * cellHeight

          // Use bilinear interpolation
          GradientGenerator.drawBilinearGradient(
            ctx,
            x,
            y,
            cellWidth,
            cellHeight,
            colors[i][j],
            colors[i][j + 1],
            colors[i + 1][j],
            colors[i + 1][j + 1],
            smoothness,
          )
        }
      }
    }

    return {
      css: cssGradients.join(', '),
      canvas: canvasRender,
    }
  }

  /**
   * Generate smooth gradient using Bezier curve interpolation
   *
   * @param colors - Array of colors
   * @param steps - Number of gradient steps
   * @returns Array of interpolated colors
   */
  static smooth(colors: ColorInput[], steps = 10): Color[] {
    if (colors.length < 2) {
      return colors.map(c => new Color(c))
    }

    const colorObjs = colors.map(c => new Color(c))
    const result: Color[] = []

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      const color = this.bezierInterpolation(colorObjs, t)
      result.push(color)
    }

    return result
  }

  /**
   * Generate animated gradient configuration
   *
   * @param colors - Array of colors to animate
   * @param duration - Animation duration in ms
   * @param type - Gradient type
   * @returns CSS and keyframes for animated gradient
   */
  static animated(
    colors: ColorInput[],
    duration = 3000,
    type: 'linear' | 'radial' | 'conic' = 'linear',
  ): {
    css: string
    keyframes: string
  } {
    // Optimize: use unique but shorter animation names
    const animationName = `ga${Math.random().toString(36).substr(2, 9)}`

    // Generate keyframes - optimize memory usage
    const keyframeSteps: string[] = []

    for (let index = 0; index < colors.length; index++) {
      const color = new Color(colors[index])
      const percent = (index / (colors.length - 1)) * 100
      const nextColor = new Color(colors[(index + 1) % colors.length])

      let gradient = ''
      const hex1 = color.toHex()
      const hex2 = nextColor.toHex()

      switch (type) {
        case 'linear':
          gradient = `linear-gradient(90deg, ${hex1}, ${hex2})`
          break
        case 'radial':
          gradient = `radial-gradient(circle farthest-corner at center center, ${hex1}, ${hex2})`
          break
        case 'conic':
          gradient = `conic-gradient(at center center, ${hex1}, ${hex2})`
          break
      }

      keyframeSteps.push(`${percent}% { background: ${gradient}; }`)

      // Immediately dispose Color objects
      if (typeof color.dispose === 'function')
        color.dispose()
      if (typeof nextColor.dispose === 'function')
        nextColor.dispose()
    }

    const keyframes = `
      @keyframes ${animationName} {
        ${keyframeSteps.join('\n')}
      }
    `

    // Generate CSS
    const css = `
      animation: ${animationName} ${duration}ms ease-in-out infinite;
      background-size: 200% 200%;
    `

    return { css, keyframes }
  }

  /**
   * Generate CSS variables for gradient
   *
   * @param gradientName - Name for the gradient
   * @param colors - Array of colors
   * @param prefix - CSS variable prefix
   * @returns Object with CSS variables
   */
  static toCSSVariables(
    gradientName: string,
    colors: ColorInput[],
    prefix = 'gradient',
  ): Record<string, string> {
    const variables: Record<string, string> = {}
    const hexColors: string[] = []

    // Optimize: process colors one by one to avoid holding all Color objects
    for (let index = 0; index < colors.length; index++) {
      const color = new Color(colors[index])
      const hex = color.toHex()
      hexColors.push(hex)
      variables[`--${prefix}-${gradientName}-color-${index + 1}`] = hex

      // Immediately dispose Color object
      if (typeof color.dispose === 'function') {
        color.dispose()
      }
    }

    // Gradient variables - use optimized methods
    variables[`--${prefix}-${gradientName}-linear`] = GradientGenerator.linear(hexColors)
    variables[`--${prefix}-${gradientName}-radial`] = GradientGenerator.radial(hexColors)
    variables[`--${prefix}-${gradientName}-conic`] = GradientGenerator.conic(hexColors)

    return variables
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  /**
   * Generate evenly distributed stops - optimized to delay Color object creation
   */
  private static generateEvenStopsOptimized(colors: ColorInput[], isDegrees = false): GradientStop[] {
    if (colors.length === 0)
      return []

    const maxValue = isDegrees ? 360 : 100
    const stops: GradientStop[] = []

    for (let index = 0; index < colors.length; index++) {
      const color = new Color(colors[index])
      stops.push({
        color,
        position: colors.length === 1 ? 0 : (index / (colors.length - 1)) * maxValue,
      })

      // Mark for disposal if Color has dispose method
      if (typeof color.dispose === 'function') {
        (color as any)._pendingDispose = true
      }
    }

    return stops
  }

  /**
   * Draw bilinear gradient (for mesh gradients)
   */
  private static drawBilinearGradient(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    tl: Color, // top-left
    tr: Color, // top-right
    bl: Color, // bottom-left
    br: Color, // bottom-right
    smoothness: number,
  ) {
    const steps = Math.max(2, Math.floor(smoothness * 20))
    const stepWidth = width / steps
    const stepHeight = height / steps

    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const u = i / steps
        const v = j / steps

        // Bilinear interpolation
        const top = tl.mix(tr, u * 100)
        const bottom = bl.mix(br, u * 100)
        const color = top.mix(bottom, v * 100)

        ctx.fillStyle = color.toRGBString()
        ctx.fillRect(
          x + i * stepWidth,
          y + j * stepHeight,
          stepWidth + 1, // +1 to avoid gaps
          stepHeight + 1,
        )
      }
    }
  }

  /**
   * Bezier curve color interpolation - optimized to use iteration instead of recursion
   */
  private static bezierInterpolation(colors: Color[], t: number): Color {
    if (colors.length === 1)
      return colors[0]

    // Use iteration instead of recursion to avoid stack overflow and memory usage
    let workingColors = colors

    while (workingColors.length > 1) {
      const newColors: Color[] = []
      for (let i = 0; i < workingColors.length - 1; i++) {
        const mixed = workingColors[i].mix(workingColors[i + 1], t * 100)
        newColors.push(mixed)
      }

      // Clean up intermediate Color objects
      if (workingColors !== colors) {
        for (const color of workingColors) {
          if (typeof color.dispose === 'function' && (color as any)._intermediate) {
            color.dispose()
          }
        }
      }

      // Mark intermediate objects
      newColors.forEach(c => (c as any)._intermediate = true)
      workingColors = newColors
    }

    return workingColors[0]
  }
}

// ============================================
// Convenience Functions
// ============================================

export const linearGradient = GradientGenerator.linear
export const radialGradient = GradientGenerator.radial
export const conicGradient = GradientGenerator.conic
export const meshGradient = GradientGenerator.mesh
export const smoothGradient = GradientGenerator.smooth
export const animatedGradient = GradientGenerator.animated

// ============================================
// Advanced Gradient Features
// ============================================

// Re-export gradient effects utilities
export {
  addGradientStops,
  adjustGradientContrast,
  analyzeGradient,
  generateConicGradientCSS,
  generateEasedGradient,
  generateGradientWithMidpoints,
  generateLinearGradientCSS,
  generateRadialGradientCSS,
  reverseGradient,
  reverseGradientCSS,
  sampleGradient,
  smoothGradient as smoothGradientAdvanced,
} from './effects'

export type {
  AdvancedGradientStop,
  ConicGradientCSSOptions,
  LinearGradientCSSOptions,
  RadialGradientCSSOptions,
} from './effects'
