/**
 * 优化的批量处理模块
 * 提供高性能的批量颜色操作，减少内存占用
 */

import type { ColorInput } from '../types'
import { Color } from '../core/Color'

/**
 * 批量处理选项
 */
export interface OptimizedBatchOptions {
  chunkSize?: number // 分块大小
  parallel?: boolean // 是否并行处理
  onProgress?: (progress: number) => void
}

/**
 * 优化的批量颜色处理器
 * 使用更高效的内存管理和处理策略
 */
export class OptimizedBatchProcessor {
  private readonly DEFAULT_CHUNK_SIZE = 50 // 减小默认块大小

  /**
   * 批量处理颜色 - 优化版本
   */
  async batchProcess<T>(
    colors: ColorInput[],
    processor: (color: Color, index: number) => T,
    options: OptimizedBatchOptions = {},
  ): Promise<T[]> {
    const { chunkSize = this.DEFAULT_CHUNK_SIZE, onProgress } = options
    const results: T[] = new Array(colors.length)
    const totalChunks = Math.ceil(colors.length / chunkSize)

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, colors.length)

      // 处理当前块
      for (let j = start; j < end; j++) {
        const color = new Color(colors[j])
        try {
          results[j] = processor(color, j)
        } finally {
          color.dispose() // 确保释放
        }
      }

      // 报告进度
      if (onProgress) {
        onProgress((end / colors.length) * 100)
      }

      // 让出控制权，防止阻塞
      if (i % 5 === 0) { // 每5个块让出一次
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    return results
  }

  /**
   * 批量转换颜色格式 - 优化版本
   */
  async batchConvert(
    colors: ColorInput[],
    format: 'hex' | 'rgb' | 'hsl',
    options: OptimizedBatchOptions = {},
  ): Promise<string[]> {
    return this.batchProcess(
      colors,
      (color) => {
        switch (format) {
          case 'hex': return color.toHex()
          case 'rgb': return color.toRGBString()
          case 'hsl': return color.toHSLString()
          default: return color.toHex()
        }
      },
      options,
    )
  }

  /**
   * 批量颜色操作 - 优化版本
   */
  async batchManipulate(
    colors: ColorInput[],
    operation: {
      type: 'lighten' | 'darken' | 'saturate' | 'desaturate' | 'rotate'
      value: number
    },
    options: OptimizedBatchOptions = {},
  ): Promise<string[]> {
    return this.batchProcess(
      colors,
      (color) => {
        let result: Color
        switch (operation.type) {
          case 'lighten':
            result = color.lighten(operation.value)
            break
          case 'darken':
            result = color.darken(operation.value)
            break
          case 'saturate':
            result = color.saturate(operation.value)
            break
          case 'desaturate':
            result = color.desaturate(operation.value)
            break
          case 'rotate':
            result = color.rotate(operation.value)
            break
          default:
            result = color
        }
        const hex = result.toHex()
        if (result !== color) {
          result.dispose()
        }
        return hex
      },
      options,
    )
  }

  /**
   * 批量分析颜色 - 优化版本
   */
  async batchAnalyze(
    colors: ColorInput[],
    options: OptimizedBatchOptions = {},
  ): Promise<Array<{
    hex: string
    luminance: number
    isLight: boolean
  }>> {
    return this.batchProcess(
      colors,
      (color) => ({
        hex: color.toHex(),
        luminance: color.getLuminance(),
        isLight: color.isLight(),
      }),
      options,
    )
  }

  /**
   * 查找相似颜色 - 优化版本
   */
  async findSimilar(
    target: ColorInput,
    colors: ColorInput[],
    threshold = 10,
    options: OptimizedBatchOptions = {},
  ): Promise<Array<{ color: string, distance: number }>> {
    const targetColor = new Color(target)

    try {
      const results = await this.batchProcess(
        colors,
        (color) => {
          const distance = color.distance(targetColor)
          return distance <= threshold
            ? { color: color.toHex(), distance }
            : null
        },
        options,
      )

      return results.filter(r => r !== null) as Array<{ color: string, distance: number }>
    } finally {
      targetColor.dispose()
    }
  }

  /**
   * 生成颜色统计 - 优化版本
   */
  async generateStats(
    colors: ColorInput[],
    options: OptimizedBatchOptions = {},
  ): Promise<{
    averageLuminance: number
    lightColors: number
    darkColors: number
    mostCommon: string | null
  }> {
    let totalLuminance = 0
    let lightCount = 0
    let darkCount = 0
    const colorCounts = new Map<string, number>()

    await this.batchProcess(
      colors,
      (color) => {
        const luminance = color.getLuminance()
        totalLuminance += luminance

        if (color.isLight()) {
          lightCount++
        } else {
          darkCount++
        }

        const hex = color.toHex()
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1)
      },
      options,
    )

    // 找出最常见的颜色
    let mostCommon: string | null = null
    let maxCount = 0
    for (const [color, count] of colorCounts) {
      if (count > maxCount) {
        maxCount = count
        mostCommon = color
      }
    }

    return {
      averageLuminance: colors.length > 0 ? totalLuminance / colors.length : 0,
      lightColors: lightCount,
      darkColors: darkCount,
      mostCommon,
    }
  }
}

// 导出便捷函数
const processor = new OptimizedBatchProcessor()

export const batchProcess = processor.batchProcess.bind(processor)
export const batchConvert = processor.batchConvert.bind(processor)
export const batchManipulate = processor.batchManipulate.bind(processor)
export const batchAnalyze = processor.batchAnalyze.bind(processor)
export const findSimilarColors = processor.findSimilar.bind(processor)
export const generateColorStats = processor.generateStats.bind(processor)

