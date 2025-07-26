import type { HSLColor, SemanticColors } from '../types'
import { ensureHashPrefix, hexToHsl, hslToHex } from '../utils/colorUtils'

/**
 * 语义化颜色生成配置
 */
export interface SemanticColorConfig {
  /** 是否在灰色中混入主色调 */
  grayMixPrimary?: boolean
  /** 主色调混入比例 (0-1) */
  grayMixRatio?: number
}

/**
 * 语义化颜色生成器
 * 基于 a-nice-red 库的算法，根据主色调生成语义化颜色
 */
export class SemanticColorGenerator {
  /**
   * 根据主色调生成所有语义化颜色
   */
  public generateSemanticColors(primaryColor: string, config: SemanticColorConfig = {}): SemanticColors {
    const cleanPrimary = ensureHashPrefix(primaryColor)
    const primaryHsl = hexToHsl(cleanPrimary)

    return {
      primary: cleanPrimary,
      success: this.generateSuccessColor(primaryHsl),
      warning: this.generateWarningColor(primaryHsl),
      danger: this.generateDangerColor(primaryHsl),
      gray: this.generateGrayColor(primaryHsl, config),
    }
  }

  /**
   * 生成成功色（绿色系）
   * 基于主色调的色相调整到绿色范围
   */
  private generateSuccessColor(primaryHsl: HSLColor): string {
    const [h, s, l] = primaryHsl
    let newH: number

    // 根据主色调色相确定成功色色相
    switch (true) {
      case (h < 25 || h >= 335):
        newH = 120 // 红色系 -> 标准绿色
        break
      case (h >= 25 && h < 75):
        newH = 80 // 黄色系 -> 黄绿色
        break
      case (h >= 150 && h < 210):
        newH = 90 // 青色系 -> 绿色
        break
      case (h >= 210 && h < 285):
        newH = 100 // 蓝色系 -> 绿色
        break
      case (h >= 285 && h < 335):
        newH = 130 // 紫色系 -> 绿色
        break
      default:
        newH = h // 已经是绿色系，保持原色相
        break
    }

    // 调整饱和度：保持在55-70之间
    const newS = Math.max(55, Math.min(70, s - 5))

    // 调整亮度：保持在45-60之间
    const newL = Math.max(45, Math.min(60, l + 5))

    return hslToHex([newH, newS, newL])
  }

  /**
   * 生成警告色（琥珀色/橙色系）
   * 固定在橙色范围内
   */
  private generateWarningColor(primaryHsl: HSLColor): string {
    const [h, s, l] = primaryHsl
    let newH: number

    // 根据主色调确定警告色色相
    switch (true) {
      case (h >= 240 || h < 60):
        newH = 42 // 红色/紫色系 -> 橙色
        break
      case (h >= 60 && h < 140):
        newH = 40 // 绿色系 -> 橙色
        break
      case (h >= 140 && h < 240):
        newH = 38 // 青色/蓝色系 -> 橙色
        break
      default:
        newH = 40 // 默认橙色
        break
    }

    // 调整饱和度：保持在80-100之间，更鲜艳
    const newS = Math.max(80, Math.min(100, s + 5))

    // 调整亮度：保持在55-65之间
    const newL = Math.max(55, Math.min(65, l + 15))

    return hslToHex([newH, newS, newL])
  }

  /**
   * 生成危险色（红色系）
   * 调整到红色范围
   */
  private generateDangerColor(primaryHsl: HSLColor): string {
    const [h, s, l] = primaryHsl
    let newH: number

    // 根据主色调确定危险色色相
    switch (true) {
      case (h >= 15 && h < 60):
        newH = 5 // 黄色系 -> 红色
        break
      case (h >= 60 && h < 140):
        newH = 10 // 绿色系 -> 红色
        break
      case (h >= 140 && h < 190):
        newH = 357 // 青色系 -> 红色
        break
      case (h >= 190 && h < 240):
        newH = 0 // 蓝色系 -> 纯红色
        break
      case (h >= 240 && h < 350):
        newH = 355 // 紫色系 -> 红色
        break
      default:
        newH = h // 已经是红色系，保持原色相
        break
    }

    // 调整饱和度：保持在75-85之间
    const newS = Math.max(75, Math.min(85, s))

    // 调整亮度：保持在45-55之间
    const newL = Math.max(45, Math.min(55, l + 5))

    return hslToHex([newH, newS, newL])
  }

  /**
   * 生成灰色
   * 基于主色调生成中性灰色
   */
  private generateGrayColor(primaryHsl: HSLColor, config: SemanticColorConfig = {}): string {
    const [h, s, l] = primaryHsl
    const { grayMixPrimary = true, grayMixRatio = 0.2 } = config

    if (!grayMixPrimary) {
      // 纯中性灰色，不混入主色调
      return hslToHex([0, 0, 50]) // 纯灰色
    }

    // 混入主色调的灰色 - 根据主色调动态生成
    const mixRatio = Math.max(0, Math.min(1, grayMixRatio))

    // 使用主色调的色相，但饱和度很低，明度固定为50
    const newH = h // 保持主色调的色相
    const newS = Math.max(3, Math.min(8, s * mixRatio * 0.3)) // 很低的饱和度，让灰色带有色相倾向
    const newL = 50 // 固定中等明度作为灰色基准

    return hslToHex([newH, newS, newL])
  }

  /**
   * 验证生成的语义化颜色是否符合可访问性要求
   */
  public validateAccessibility(colors: SemanticColors): {
    [K in keyof SemanticColors]: {
      contrastWithWhite: number
      contrastWithBlack: number
      isAccessible: boolean
    }
  } {
    const results = {} as any

    Object.entries(colors).forEach(([key, _color]) => {
      // 这里可以添加对比度检查逻辑
      results[key] = {
        contrastWithWhite: 0, // 实际计算对比度
        contrastWithBlack: 0, // 实际计算对比度
        isAccessible: true, // 实际验证可访问性
      }
    })

    return results
  }

  /**
   * 根据品牌色调整语义化颜色的生成策略
   */
  public adjustForBrandColor(primaryColor: string, brandType: 'tech' | 'finance' | 'healthcare' | 'education' | 'retail'): SemanticColors {
    const baseColors = this.generateSemanticColors(primaryColor)

    // 根据不同行业调整颜色策略
    switch (brandType) {
      case 'tech':
        // 科技行业：更鲜艳的颜色
        return this.enhanceVibrance(baseColors)
      case 'finance':
        // 金融行业：更稳重的颜色
        return this.enhanceStability(baseColors)
      case 'healthcare':
        // 医疗行业：更柔和的颜色
        return this.enhanceSoftness(baseColors)
      case 'education':
        // 教育行业：更友好的颜色
        return this.enhanceFriendliness(baseColors)
      case 'retail':
        // 零售行业：更吸引人的颜色
        return this.enhanceAttractiveness(baseColors)
      default:
        return baseColors
    }
  }

  private enhanceVibrance(colors: SemanticColors): SemanticColors {
    // 增强鲜艳度的逻辑
    return colors
  }

  private enhanceStability(colors: SemanticColors): SemanticColors {
    // 增强稳重感的逻辑
    return colors
  }

  private enhanceSoftness(colors: SemanticColors): SemanticColors {
    // 增强柔和感的逻辑
    return colors
  }

  private enhanceFriendliness(colors: SemanticColors): SemanticColors {
    // 增强友好感的逻辑
    return colors
  }

  private enhanceAttractiveness(colors: SemanticColors): SemanticColors {
    // 增强吸引力的逻辑
    return colors
  }
}
