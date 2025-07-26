import Color from 'color'
import type { ColorFormat, ColorPalette, ColorPalettes, SemanticColors } from '../types'
import { formatColor } from '../utils/colorUtils'

/**
 * 色阶生成器
 * 基于 arco-design/color 库的算法，扩展支持12色阶和14色阶
 */
export class PaletteGenerator {
  /**
   * 生成完整的颜色色阶（包含明暗模式）
   */
  public generateColorPalettes(
    semanticColors: SemanticColors,
    format: ColorFormat = 'hex',
    grayMixPrimary: boolean = true,
    grayMixRatio: number = 0.2,
  ): ColorPalettes {
    return {
      light: this.generateLightPalette(semanticColors, format, grayMixPrimary, grayMixRatio),
      dark: this.generateDarkPalette(semanticColors, format, grayMixPrimary, grayMixRatio),
    }
  }

  /**
   * 生成明亮模式色阶
   */
  private generateLightPalette(
    semanticColors: SemanticColors,
    format: ColorFormat,
    grayMixPrimary: boolean = true,
    grayMixRatio: number = 0.2,
  ): ColorPalette {
    return {
      primary: this.generate12ColorPalette(semanticColors.primary, false, format),
      success: this.generate12ColorPalette(semanticColors.success, false, format),
      warning: this.generate12ColorPalette(semanticColors.warning, false, format),
      danger: this.generate12ColorPalette(semanticColors.danger, false, format),
      gray: this.generate14GrayPalette(semanticColors.gray, false, format, grayMixPrimary, grayMixRatio),
    }
  }

  /**
   * 生成暗黑模式色阶
   */
  private generateDarkPalette(
    semanticColors: SemanticColors,
    format: ColorFormat,
    grayMixPrimary: boolean = true,
    grayMixRatio: number = 0.2,
  ): ColorPalette {
    return {
      primary: this.generate12ColorPalette(semanticColors.primary, true, format),
      success: this.generate12ColorPalette(semanticColors.success, true, format),
      warning: this.generate12ColorPalette(semanticColors.warning, true, format),
      danger: this.generate12ColorPalette(semanticColors.danger, true, format),
      gray: this.generate14GrayPalette(semanticColors.gray, true, format, grayMixPrimary, grayMixRatio),
    }
  }

  /**
   * 生成12色阶（扩展arco的10色阶算法）
   */
  private generate12ColorPalette(
    originColor: string,
    isDark: boolean = false,
    format: ColorFormat = 'hex',
  ): string[] {
    const palette: string[] = []

    for (let i = 1; i <= 12; i++) {
      const color = isDark
        ? this.generateDarkColorStep(originColor, i)
        : this.generateLightColorStep(originColor, i)
      palette.push(formatColor(color, format))
    }

    // 暗黑模式需要反转顺序（从深到浅）
    return isDark ? palette.reverse() : palette
  }

  /**
   * 生成14色阶灰色（专门为灰色设计更多层次）
   */
  private generate14GrayPalette(
    originColor: string,
    isDark: boolean = false,
    format: ColorFormat = 'hex',
    grayMixPrimary: boolean = true,
    grayMixRatio: number = 0.2,
  ): string[] {
    const palette: string[] = []

    for (let i = 1; i <= 14; i++) {
      const color = isDark
        ? this.generateDarkGrayStep(originColor, i, grayMixPrimary, grayMixRatio)
        : this.generateLightGrayStep(originColor, i, grayMixPrimary, grayMixRatio)
      palette.push(formatColor(color, format))
    }

    // 灰色色阶不需要反转，因为generateDarkGrayStep已经处理了正确的顺序
    return palette
  }

  /**
   * 生成明亮模式单个色阶步骤
   */
  private generateLightColorStep(originColor: string, step: number): string {
    const color = Color(originColor)
    const h = color.hue()
    const s = color.saturationv()
    const v = color.value()

    // 优化的12步参数 - 让色阶更平滑，保持色彩特征
    const hueStep = 1.2 // 更小的色相步长，让过渡更平滑
    const maxSaturationStep = 95
    const minSaturationStep = 3 // 更低的最小饱和度，让最浅的更浅
    const maxValue = 98 // 更高的最大明度，让最浅的更浅
    const minValue = 18  // 调整最深明度，保持色彩特征，避免过深

    // 中心点在第7步（原来是第6步）
    const centerStep = 7
    const isLight = step < centerStep
    const index = isLight ? centerStep - step : step - centerStep

    function getNewHue(isLight: boolean, i: number): number {
      let hue: number
      if (h >= 60 && h <= 240) {
        hue = isLight ? h - hueStep * i : h + hueStep * i
      }
      else {
        hue = isLight ? h + hueStep * i : h - hueStep * i
      }

      if (hue < 0) {
        hue += 360
      }
      else if (hue >= 360) {
        hue -= 360
      }
      return Math.round(hue)
    }

    function getNewSaturation(isLight: boolean, i: number): number {
      if (isLight) {
        // 浅色时，饱和度平滑降低，确保最浅的接近无色
        return Math.max(minSaturationStep, s - ((s - minSaturationStep) / 6) * i)
      }
      else {
        // 深色时，饱和度平滑增加，但不超过最大值
        return Math.min(maxSaturationStep, s + ((maxSaturationStep - s) / 5) * i)
      }
    }

    function getNewValue(isLight: boolean, i: number): number {
      if (isLight) {
        // 浅色时，明度平滑增加到接近白色
        return Math.min(maxValue, v + ((maxValue - v) / 6) * i)
      }
      else {
        // 深色时，明度平滑降低到接近黑色
        return Math.max(minValue, v - ((v - minValue) / 5) * i)
      }
    }

    if (step === centerStep) {
      return color.hex()
    }

    const retColor = Color({
      h: getNewHue(isLight, index),
      s: getNewSaturation(isLight, index),
      v: getNewValue(isLight, index),
    })

    return retColor.hex()
  }

  /**
   * 生成暗黑模式单个色阶步骤（重新设计，更简单可靠）
   */
  private generateDarkColorStep(originColor: string, step: number): string {
    const color = Color(originColor)
    const h = color.hue()
    const s = color.saturationv()
    const v = color.value()

    // 暗黑模式参数 - 与明亮模式对应但调整范围
    const hueStep = 1.2
    const maxSaturationStep = 90  // 暗黑模式饱和度稍低
    const minSaturationStep = 8   // 暗黑模式最小饱和度稍高
    const maxValue = 85           // 暗黑模式最亮不能太亮
    const minValue = 12           // 暗黑模式最深不要太深

    // 中心点在第7步
    const centerStep = 7
    const isLight = step < centerStep
    const index = isLight ? centerStep - step : step - centerStep

    function getNewHue(isLight: boolean, i: number): number {
      let hue: number
      if (h >= 60 && h <= 240) {
        hue = isLight ? h - hueStep * i : h + hueStep * i
      }
      else {
        hue = isLight ? h + hueStep * i : h - hueStep * i
      }

      if (hue < 0) {
        hue += 360
      }
      else if (hue >= 360) {
        hue -= 360
      }
      return Math.round(hue)
    }

    function getNewSaturation(isLight: boolean, i: number): number {
      if (isLight) {
        // 浅色时，饱和度平滑降低
        return Math.max(minSaturationStep, s - ((s - minSaturationStep) / 6) * i)
      }
      else {
        // 深色时，饱和度平滑增加
        return Math.min(maxSaturationStep, s + ((maxSaturationStep - s) / 5) * i)
      }
    }

    function getNewValue(isLight: boolean, i: number): number {
      if (isLight) {
        // 浅色时，明度平滑增加
        return Math.min(maxValue, v + ((maxValue - v) / 6) * i)
      }
      else {
        // 深色时，明度平滑降低
        return Math.max(minValue, v - ((v - minValue) / 5) * i)
      }
    }

    // 如果是中心点，返回原色
    if (step === centerStep) {
      return color.hex()
    }

    const retColor = Color({
      h: getNewHue(isLight, index),
      s: getNewSaturation(isLight, index),
      v: getNewValue(isLight, index),
    })

    return retColor.hex()
  }

  /**
   * 生成明亮模式灰色步骤
   */
  private generateLightGrayStep(originColor: string, step: number, grayMixPrimary: boolean = true, grayMixRatio: number = 0.2): string {
    if (!grayMixPrimary) {
      // 纯中性灰色，使用平滑的明度曲线
      const maxLightness = 98  // 最浅接近白色
      const minLightness = 15  // 最深不要太黑，保持可读性
      const centerStep = 8     // 14步的中心点

      let lightness: number
      if (step < centerStep) {
        // 浅色部分：从最浅到中等
        const ratio = (centerStep - step) / (centerStep - 1)
        lightness = 50 + (maxLightness - 50) * ratio
      } else if (step === centerStep) {
        // 中心点
        lightness = 50
      } else {
        // 深色部分：从中等到最深
        const ratio = (step - centerStep) / (14 - centerStep)
        lightness = 50 - (50 - minLightness) * ratio
      }

      return Color({ h: 0, s: 0, l: Math.round(lightness) }).hex()
    }

    // 混入主色调的灰色
    const color = Color(originColor)
    const h = color.hue()

    // 使用与纯中性灰色相同的明度曲线
    const maxLightness = 98
    const minLightness = 15  // 最深不要太黑，保持可读性
    const centerStep = 8

    let lightness: number
    if (step < centerStep) {
      const ratio = (centerStep - step) / (centerStep - 1)
      lightness = 50 + (maxLightness - 50) * ratio
    } else if (step === centerStep) {
      lightness = 50
    } else {
      const ratio = (step - centerStep) / (14 - centerStep)
      lightness = 50 - (50 - minLightness) * ratio
    }

    // 饱和度根据混入比例和位置计算
    const maxSaturation = 8 * grayMixRatio
    const saturation = Math.max(0, Math.min(maxSaturation, maxSaturation * (1 - Math.abs(step - centerStep) / centerStep)))

    return Color({ h, s: Math.round(saturation), l: Math.round(lightness) }).hex()
  }

  /**
   * 生成暗黑模式灰色步骤
   */
  private generateDarkGrayStep(originColor: string, step: number, grayMixPrimary: boolean = true, grayMixRatio: number = 0.2): string {
    if (!grayMixPrimary) {
      // 纯中性灰色，使用平滑的明度曲线（暗黑模式）
      const maxLightness = 85  // 暗黑模式最浅不能太亮
      const minLightness = 12  // 最深不要太黑，保持可读性
      const centerStep = 8     // 14步的中心点

      let lightness: number
      if (step < centerStep) {
        // 浅色部分：从最浅到中等
        const ratio = (centerStep - step) / (centerStep - 1)
        lightness = 35 + (maxLightness - 35) * ratio
      } else if (step === centerStep) {
        // 中心点
        lightness = 35
      } else {
        // 深色部分：从中等到最深
        const ratio = (step - centerStep) / (14 - centerStep)
        lightness = 35 - (35 - minLightness) * ratio
      }

      return Color({ h: 0, s: 0, l: Math.round(lightness) }).hex()
    }

    // 混入主色调的灰色
    const color = Color(originColor)
    const h = color.hue()

    // 使用与纯中性灰色相同的明度曲线
    const maxLightness = 85
    const minLightness = 12  // 最深不要太黑，保持可读性
    const centerStep = 8

    let lightness: number
    if (step < centerStep) {
      const ratio = (centerStep - step) / (centerStep - 1)
      lightness = 35 + (maxLightness - 35) * ratio
    } else if (step === centerStep) {
      lightness = 35
    } else {
      const ratio = (step - centerStep) / (14 - centerStep)
      lightness = 35 - (35 - minLightness) * ratio
    }

    // 饱和度根据混入比例和位置计算
    const maxSaturation = 12 * grayMixRatio  // 暗黑模式饱和度稍高
    const saturation = Math.max(0, Math.min(maxSaturation, maxSaturation * (1 - Math.abs(step - centerStep) / centerStep)))

    return Color({ h, s: Math.round(saturation), l: Math.round(lightness) }).hex()
  }

  // 删除了getNewSaturationForDark方法，现在使用更简单的暗黑模式算法

  /**
   * 批量生成多个颜色的色阶
   */
  public batchGeneratePalettes(
    colors: string[],
    isDark: boolean = false,
    format: ColorFormat = 'hex',
  ): string[][] {
    return colors.map(color =>
      this.generate12ColorPalette(color, isDark, format),
    )
  }

  /**
   * 生成自定义步数的色阶
   */
  public generateCustomStepPalette(
    color: string,
    steps: number,
    isDark: boolean = false,
    format: ColorFormat = 'hex',
  ): string[] {
    const palette: string[] = []
    const centerStep = Math.ceil(steps / 2)

    for (let i = 1; i <= steps; i++) {
      // 根据步数调整算法参数
      const adjustedColor = this.generateCustomColorStep(color, i, steps, centerStep, isDark)
      palette.push(formatColor(adjustedColor, format))
    }

    return isDark ? palette.reverse() : palette
  }

  private generateCustomColorStep(
    color: string,
    step: number,
    totalSteps: number,
    _centerStep: number,
    _isDark: boolean,
  ): string {
    // 自定义步数的色阶生成逻辑
    // 这里可以根据总步数动态调整参数
    return this.generateLightColorStep(color, Math.round((step / totalSteps) * 12))
  }
}
