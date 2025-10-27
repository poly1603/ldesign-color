/**
 * @ldesign/color - Optimized Entry Point
 * 
 * 精简的导出，减少包体积和内存占用
 */

// 核心类和类型
export { Color, Colors } from './core/Color-optimized'
export type {
  ColorInput,
  ColorFormat,
  RGB,
  HSL,
  HSV,
  HarmonyType,
} from './types'

// 核心转换函数
export {
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
} from './core/conversions'

// 批量处理（优化版）
export {
  batchConvert,
  batchManipulate,
  batchAnalyze,
  findSimilarColors,
  generateColorStats,
} from './performance/batch-optimized'

// 实用工具
export { parseColorInput } from './utils/validators'
export { clamp, round } from './utils/math'

// 内存管理工具
export {
  cleanupMemory,
  getMemoryStats,
  setMemoryLimit,
} from './utils/memoryManager'

// 性能监控工具
export {
  ColorPerformanceMonitor,
  PerformanceDashboard,
  startMonitoring,
  stopMonitoring,
  getPerformanceMetrics,
  dashboard,
} from './performance/monitor'

// 自动优化工具
export {
  ColorAutoOptimizer,
  OPTIMIZATION_PROFILES,
  startAutoOptimization,
  stopAutoOptimization,
  applyOptimizationProfile,
} from './performance/auto-optimizer'

// 颜色方案生成（按需导入）
export const generatePalette = async (baseColor: ColorInput, count = 5) => {
  const { generateMonochromatic } = await import('./core/palette')
  return generateMonochromatic(baseColor, count)
}

// 高级功能（按需导入）
export const advancedFeatures = {
  async gradient(...args: any[]) {
    const { createGradient } = await import('./gradient')
    return createGradient(...args)
  },

  async accessibility(color: ColorInput) {
    const { checkAccessibility } = await import('./accessibility')
    return checkAccessibility(color)
  },

  async designSystem(color: ColorInput, system: string) {
    const { generateDesignSystemPalette } = await import('./design-systems/generator')
    return generateDesignSystemPalette(color, system as any)
  },
}

// 版本信息
export const VERSION = '1.0.0-optimized'

