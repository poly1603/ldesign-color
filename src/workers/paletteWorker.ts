/**
 * Web Worker for color palette generation
 * 在独立线程中处理颜色生成，避免阻塞主线程
 */

import type { ColorPalettes, SemanticColors, WorkerMessage, WorkerResponse } from '../types'

// 由于Web Worker中无法直接导入模块，这里需要内联必要的函数

/**
 * 颜色转换工具函数（内联版本）
 */
const colorUtils = {
  hexToHsl(hex: string): [number, number, number] {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  },

  hslToHex(hsl: [number, number, number]): string {
    const [h, s, l] = [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100]

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0)
        t += 1
      if (t > 1)
        t -= 1
      if (t < 1 / 6)
        return p + (q - p) * 6 * t
      if (t < 1 / 2)
        return q
      if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b
    if (s === 0) {
      r = g = b = l
    }
    else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? `0${hex}` : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  },
}

/**
 * 语义化颜色生成（内联版本）
 */
const semanticColorGenerator = {
  generateSemanticColors(primaryColor: string): SemanticColors {
    const primaryHsl = colorUtils.hexToHsl(primaryColor)

    return {
      primary: primaryColor,
      success: this.generateSuccessColor(primaryHsl),
      warning: this.generateWarningColor(primaryHsl),
      danger: this.generateDangerColor(primaryHsl),
      gray: this.generateGrayColor(primaryHsl),
    }
  },

  generateSuccessColor(primaryHsl: [number, number, number]): string {
    const [h, s, l] = primaryHsl
    let newH: number

    switch (true) {
      case (h < 25 || h >= 335):
        newH = 120
        break
      case (h >= 25 && h < 75):
        newH = 80
        break
      case (h >= 150 && h < 210):
        newH = 90
        break
      case (h >= 210 && h < 285):
        newH = 100
        break
      case (h >= 285 && h < 335):
        newH = 130
        break
      default:
        newH = h
        break
    }

    const newS = Math.max(55, Math.min(70, s - 5))
    const newL = Math.max(45, Math.min(60, l + 5))

    return colorUtils.hslToHex([newH, newS, newL])
  },

  generateWarningColor(primaryHsl: [number, number, number]): string {
    const [h, s, l] = primaryHsl
    let newH: number

    switch (true) {
      case (h >= 240 || h < 60):
        newH = 42
        break
      case (h >= 60 && h < 140):
        newH = 40
        break
      case (h >= 140 && h < 240):
        newH = 38
        break
      default:
        newH = 40
        break
    }

    const newS = Math.max(80, Math.min(100, s + 5))
    const newL = Math.max(55, Math.min(65, l + 15))

    return colorUtils.hslToHex([newH, newS, newL])
  },

  generateDangerColor(primaryHsl: [number, number, number]): string {
    const [h, s, l] = primaryHsl
    let newH: number

    switch (true) {
      case (h >= 15 && h < 60):
        newH = 5
        break
      case (h >= 60 && h < 140):
        newH = 10
        break
      case (h >= 140 && h < 190):
        newH = 357
        break
      case (h >= 190 && h < 240):
        newH = 0
        break
      case (h >= 240 && h < 350):
        newH = 355
        break
      default:
        newH = h
        break
    }

    const newS = Math.max(75, Math.min(85, s))
    const newL = Math.max(45, Math.min(55, l + 5))

    return colorUtils.hslToHex([newH, newS, newL])
  },

  generateGrayColor(primaryHsl: [number, number, number]): string {
    const [h, s, l] = primaryHsl
    const newH = h
    const newS = Math.max(5, Math.min(15, s * 0.2))
    const newL = Math.max(40, Math.min(60, l * 0.8))

    return colorUtils.hslToHex([newH, newS, newL])
  },
}

/**
 * 色阶生成器（内联版本）
 */
const paletteGenerator = {
  generateColorPalettes(semanticColors: SemanticColors): ColorPalettes {
    return {
      light: {
        primary: this.generate12ColorPalette(semanticColors.primary, false),
        success: this.generate12ColorPalette(semanticColors.success, false),
        warning: this.generate12ColorPalette(semanticColors.warning, false),
        danger: this.generate12ColorPalette(semanticColors.danger, false),
        gray: this.generate14GrayPalette(semanticColors.gray, false),
      },
      dark: {
        primary: this.generate12ColorPalette(semanticColors.primary, true),
        success: this.generate12ColorPalette(semanticColors.success, true),
        warning: this.generate12ColorPalette(semanticColors.warning, true),
        danger: this.generate12ColorPalette(semanticColors.danger, true),
        gray: this.generate14GrayPalette(semanticColors.gray, true),
      },
    }
  },

  generate12ColorPalette(originColor: string, isDark: boolean = false): string[] {
    const palette: string[] = []

    for (let i = 1; i <= 12; i++) {
      const color = isDark
        ? this.generateDarkColorStep(originColor, i)
        : this.generateLightColorStep(originColor, i)
      palette.push(color)
    }

    return isDark ? palette.reverse() : palette
  },

  generate14GrayPalette(originColor: string, isDark: boolean = false): string[] {
    const palette: string[] = []

    for (let i = 1; i <= 14; i++) {
      const color = isDark
        ? this.generateDarkGrayStep(originColor, i)
        : this.generateLightGrayStep(originColor, i)
      palette.push(color)
    }

    return isDark ? palette.reverse() : palette
  },

  generateLightColorStep(originColor: string, step: number): string {
    const hsl = colorUtils.hexToHsl(originColor)
    const [h, s, v] = hsl

    const hueStep = 1.5
    const maxSaturationStep = 100
    const minSaturationStep = 8
    const maxValue = 98
    const minValue = 25

    const centerStep = 7
    const isLight = step < centerStep
    const index = isLight ? centerStep - step : step - centerStep

    if (step === centerStep) {
      return originColor
    }

    const getNewHue = (isLight: boolean, i: number): number => {
      let hue: number
      if (h >= 60 && h <= 240) {
        hue = isLight ? h - hueStep * i : h + hueStep * i
      }
      else {
        hue = isLight ? h + hueStep * i : h - hueStep * i
      }

      if (hue < 0)
        hue += 360
      else if (hue >= 360)
        hue -= 360
      return Math.round(hue)
    }

    const getNewSaturation = (isLight: boolean, i: number): number => {
      if (isLight) {
        return s <= minSaturationStep ? s : s - ((s - minSaturationStep) / 6) * i
      }
      else {
        return s + ((maxSaturationStep - s) / 5) * i
      }
    }

    const getNewValue = (isLight: boolean, i: number): number => {
      return isLight
        ? v + ((maxValue - v) / 6) * i
        : (v <= minValue ? v : v - ((v - minValue) / 5) * i)
    }

    const newHsl: [number, number, number] = [
      getNewHue(isLight, index),
      getNewSaturation(isLight, index),
      getNewValue(isLight, index),
    ]

    return colorUtils.hslToHex(newHsl)
  },

  generateDarkColorStep(originColor: string, step: number): string {
    // 简化的暗黑模式生成
    const lightColor = this.generateLightColorStep(originColor, 12 - step + 1)
    const hsl = colorUtils.hexToHsl(lightColor)

    // 调整暗黑模式的饱和度和亮度
    const [h, s, l] = hsl
    const newS = Math.max(10, Math.min(80, s * 0.8))
    const newL = Math.max(10, Math.min(90, l * 0.7))

    return colorUtils.hslToHex([h, newS, newL])
  },

  generateLightGrayStep(originColor: string, step: number): string {
    const hsl = colorUtils.hexToHsl(originColor)
    const [h] = hsl

    const saturationValues = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28]
    const lightnessValues = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30]

    const s = saturationValues[step - 1]
    const l = lightnessValues[step - 1]

    return colorUtils.hslToHex([h, s, l])
  },

  generateDarkGrayStep(originColor: string, step: number): string {
    const hsl = colorUtils.hexToHsl(originColor)
    const [h] = hsl

    const saturationValues = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34]
    const lightnessValues = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]

    const s = saturationValues[step - 1]
    const l = lightnessValues[step - 1]

    return colorUtils.hslToHex([h, s, l])
  },
}

/**
 * Worker消息处理
 */
globalThis.onmessage = function (e: MessageEvent<WorkerMessage>) {
  const { id, type, data } = e.data

  try {
    let result: any

    switch (type) {
      case 'generateSemanticColors':
        result = semanticColorGenerator.generateSemanticColors(data.primaryColor)
        break

      case 'generatePalettes':
        result = paletteGenerator.generateColorPalettes(data.semanticColors)
        break

      default:
        throw new Error(`Unknown message type: ${type}`)
    }

    const response: WorkerResponse = {
      id,
      success: true,
      data: result,
    }

    globalThis.postMessage(response)
  }
  catch (error) {
    const response: WorkerResponse = {
      id,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }

    globalThis.postMessage(response)
  }
}
