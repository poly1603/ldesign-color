/**
 * 自动优化器
 * 根据使用模式自动调整 Color 包的性能配置
 */

import { setMemoryLimit } from '../utils/memoryManager'
import { poolManager } from '../utils/objectPool'
import { globalColorCache } from '../utils/cache'
import { getPerformanceMetrics, ColorPerformanceMonitor } from './monitor'

export interface OptimizationProfile {
  name: string
  description: string
  config: {
    memoryLimitMB: number
    cacheSize: number
    poolSizes: {
      color: number
      rgb: number
      hsl: number
      hsv: number
    }
    cacheStrategy: 'LRU' | 'LFU' | 'FIFO'
  }
}

// 预定义的优化配置文件
export const OPTIMIZATION_PROFILES: Record<string, OptimizationProfile> = {
  minimal: {
    name: '最小内存',
    description: '最小化内存使用，适合资源受限环境',
    config: {
      memoryLimitMB: 10,
      cacheSize: 20,
      poolSizes: {
        color: 5,
        rgb: 10,
        hsl: 10,
        hsv: 5,
      },
      cacheStrategy: 'FIFO',
    },
  },
  balanced: {
    name: '平衡模式',
    description: '平衡性能和内存使用',
    config: {
      memoryLimitMB: 30,
      cacheSize: 30,
      poolSizes: {
        color: 10,
        rgb: 20,
        hsl: 20,
        hsv: 15,
      },
      cacheStrategy: 'LRU',
    },
  },
  performance: {
    name: '高性能',
    description: '最大化性能，适合计算密集型应用',
    config: {
      memoryLimitMB: 100,
      cacheSize: 100,
      poolSizes: {
        color: 50,
        rgb: 50,
        hsl: 50,
        hsv: 30,
      },
      cacheStrategy: 'LFU',
    },
  },
  realtime: {
    name: '实时处理',
    description: '优化实时响应，适合交互式应用',
    config: {
      memoryLimitMB: 50,
      cacheSize: 50,
      poolSizes: {
        color: 20,
        rgb: 30,
        hsl: 30,
        hsv: 20,
      },
      cacheStrategy: 'LFU',
    },
  },
}

export interface AutoOptimizerOptions {
  // 初始配置文件
  initialProfile?: keyof typeof OPTIMIZATION_PROFILES
  // 是否启用自动调整
  autoAdjust?: boolean
  // 调整间隔（毫秒）
  adjustInterval?: number
  // 性能目标
  targets?: {
    maxMemoryMB?: number
    minCacheHitRate?: number
    maxResponseTime?: number
  }
  // 回调
  onProfileChange?: (profile: string, reason: string) => void
  onOptimization?: (changes: string[]) => void
}

/**
 * 自动优化器
 */
export class ColorAutoOptimizer {
  private currentProfile: string
  private monitor: ColorPerformanceMonitor
  private adjustTimer: number | null = null
  private options: Required<AutoOptimizerOptions>
  private adjustmentHistory: Array<{
    timestamp: number
    profile: string
    reason: string
  }> = []

  constructor(options: AutoOptimizerOptions = {}) {
    this.currentProfile = options.initialProfile || 'balanced'
    this.options = {
      initialProfile: options.initialProfile || 'balanced',
      autoAdjust: options.autoAdjust ?? true,
      adjustInterval: options.adjustInterval ?? 30000, // 30秒
      targets: {
        maxMemoryMB: options.targets?.maxMemoryMB ?? 50,
        minCacheHitRate: options.targets?.minCacheHitRate ?? 0.7,
        maxResponseTime: options.targets?.maxResponseTime ?? 5,
      },
      onProfileChange: options.onProfileChange || ((p, r) => console.log(`📊 切换到${p}模式: ${r}`)),
      onOptimization: options.onOptimization || (() => { }),
    }

    this.monitor = new ColorPerformanceMonitor({
      interval: 5000,
      recordHistory: true,
    })

    // 应用初始配置
    this.applyProfile(this.currentProfile)
  }

  /**
   * 启动自动优化
   */
  start(): void {
    this.monitor.start()

    if (this.options.autoAdjust) {
      this.adjustTimer = (typeof window !== 'undefined' ? window.setInterval : setInterval)(() => {
        this.performAutoAdjustment()
      }, this.options.adjustInterval) as any
    }

    console.log('🤖 自动优化器已启动')
  }

  /**
   * 停止自动优化
   */
  stop(): void {
    this.monitor.stop()

    if (this.adjustTimer !== null) {
      clearInterval(this.adjustTimer)
      this.adjustTimer = null
    }

    console.log('🛑 自动优化器已停止')
  }

  /**
   * 应用配置文件
   */
  applyProfile(profileName: string): void {
    const profile = OPTIMIZATION_PROFILES[profileName]
    if (!profile) {
      console.error(`未知的配置文件: ${profileName}`)
      return
    }

    const changes: string[] = []

    // 设置内存限制
    setMemoryLimit(profile.config.memoryLimitMB)
    changes.push(`内存限制: ${profile.config.memoryLimitMB}MB`)

    // 调整缓存大小
    if ((globalColorCache as any).maxSize !== profile.config.cacheSize) {
      (globalColorCache as any).maxSize = profile.config.cacheSize
      changes.push(`缓存大小: ${profile.config.cacheSize}项`)
    }

    // 注意：缓存策略现在在创建时设置，运行时不支持动态更改
    // 如果需要更改策略，需要重新创建缓存实例
    changes.push(`缓存策略: ${profile.config.cacheStrategy}`)

    // 调整对象池大小
    const pools = poolManager.getAllStats()
    for (const [poolName, targetSize] of Object.entries(profile.config.poolSizes)) {
      const pool = poolManager.get(poolName)
      if (pool && (pool as any).maxSize !== targetSize) {
        (pool as any).maxSize = targetSize
        changes.push(`${poolName}池: ${targetSize}`)
      }
    }

    this.currentProfile = profileName
    this.options.onOptimization(changes)

    // 记录历史
    this.adjustmentHistory.push({
      timestamp: Date.now(),
      profile: profileName,
      reason: '手动应用',
    })
  }

  /**
   * 执行自动调整
   */
  private performAutoAdjustment(): void {
    const metrics = this.monitor.getCurrentMetrics()
    if (!metrics) return

    const summary = this.monitor.getSummary()
    if (!summary) return

    // 分析使用模式
    const pattern = this.analyzeUsagePattern(metrics, summary)

    // 选择最佳配置
    const recommendedProfile = this.selectOptimalProfile(pattern)

    // 如果需要切换配置
    if (recommendedProfile !== this.currentProfile) {
      const reason = this.getChangeReason(pattern)
      this.applyProfile(recommendedProfile)
      this.options.onProfileChange(recommendedProfile, reason)

      this.adjustmentHistory.push({
        timestamp: Date.now(),
        profile: recommendedProfile,
        reason,
      })
    }

    // 微调当前配置
    this.performFineTuning(metrics)
  }

  /**
   * 分析使用模式
   */
  private analyzeUsagePattern(
    metrics: PerformanceMetrics,
    summary: ReturnType<ColorPerformanceMonitor['getSummary']>
  ): {
    memoryPressure: 'low' | 'medium' | 'high'
    operationIntensity: 'low' | 'medium' | 'high'
    cacheEfficiency: 'poor' | 'fair' | 'good'
  } {
    const { targets } = this.options

    // 内存压力
    let memoryPressure: 'low' | 'medium' | 'high'
    if (metrics.memory.estimatedMB < targets.maxMemoryMB * 0.5) {
      memoryPressure = 'low'
    } else if (metrics.memory.estimatedMB < targets.maxMemoryMB * 0.8) {
      memoryPressure = 'medium'
    } else {
      memoryPressure = 'high'
    }

    // 操作强度
    let operationIntensity: 'low' | 'medium' | 'high'
    if (metrics.performance.operationsPerSecond < 10) {
      operationIntensity = 'low'
    } else if (metrics.performance.operationsPerSecond < 100) {
      operationIntensity = 'medium'
    } else {
      operationIntensity = 'high'
    }

    // 缓存效率
    let cacheEfficiency: 'poor' | 'fair' | 'good'
    if (summary!.avgCacheHitRate < 0.5) {
      cacheEfficiency = 'poor'
    } else if (summary!.avgCacheHitRate < 0.8) {
      cacheEfficiency = 'fair'
    } else {
      cacheEfficiency = 'good'
    }

    return {
      memoryPressure,
      operationIntensity,
      cacheEfficiency,
    }
  }

  /**
   * 选择最佳配置文件
   */
  private selectOptimalProfile(pattern: ReturnType<typeof this.analyzeUsagePattern>): string {
    // 高内存压力 -> 最小内存模式
    if (pattern.memoryPressure === 'high') {
      return 'minimal'
    }

    // 高操作强度 + 低内存压力 -> 高性能模式
    if (pattern.operationIntensity === 'high' && pattern.memoryPressure === 'low') {
      return 'performance'
    }

    // 中等操作强度 + 需要快速响应 -> 实时模式
    if (pattern.operationIntensity === 'medium' && pattern.cacheEfficiency !== 'poor') {
      return 'realtime'
    }

    // 低操作强度 -> 最小内存模式
    if (pattern.operationIntensity === 'low') {
      return 'minimal'
    }

    // 默认平衡模式
    return 'balanced'
  }

  /**
   * 获取切换原因
   */
  private getChangeReason(pattern: ReturnType<typeof this.analyzeUsagePattern>): string {
    if (pattern.memoryPressure === 'high') {
      return '内存压力过高'
    }
    if (pattern.operationIntensity === 'high') {
      return '操作强度增加'
    }
    if (pattern.cacheEfficiency === 'poor') {
      return '缓存效率低下'
    }
    return '优化使用模式'
  }

  /**
   * 执行微调
   */
  private performFineTuning(metrics: PerformanceMetrics): void {
    const changes: string[] = []

    // 根据缓存命中率调整缓存大小
    if (metrics.performance.cacheHitRate < 0.5) {
      // 扩大缓存
      const newSize = Math.min((globalColorCache as any).maxSize + 10, 200)
      if (newSize !== (globalColorCache as any).maxSize) {
        (globalColorCache as any).maxSize = newSize
        changes.push(`扩大缓存至 ${newSize}`)
      }
    } else if (metrics.performance.cacheHitRate > 0.9 && (globalColorCache as any).size < 20) {
      // 缩小缓存
      const newSize = Math.max((globalColorCache as any).maxSize - 10, 20)
      if (newSize !== (globalColorCache as any).maxSize) {
        (globalColorCache as any).maxSize = newSize
        changes.push(`缩小缓存至 ${newSize}`)
      }
    }

    // 根据对象池使用率调整池大小
    for (const [poolName, stats] of Object.entries(metrics.pools)) {
      if (stats.hitRate < 0.5 && stats.utilization > 0.8) {
        // 扩大池
        const pool = poolManager.get(poolName)
        if (pool) {
          const newSize = Math.min((pool as any).maxSize + 5, 100)
          if (newSize !== (pool as any).maxSize) {
            (pool as any).maxSize = newSize
            changes.push(`扩大${poolName}池至 ${newSize}`)
          }
        }
      }
    }

    if (changes.length > 0) {
      this.options.onOptimization(changes)
    }
  }

  /**
   * 获取当前配置
   */
  getCurrentProfile(): string {
    return this.currentProfile
  }

  /**
   * 获取调整历史
   */
  getHistory(): typeof this.adjustmentHistory {
    return [...this.adjustmentHistory]
  }

  /**
   * 导出优化报告
   */
  exportReport(): string {
    const summary = this.monitor.getSummary()
    const lastAdjustment = this.adjustmentHistory[this.adjustmentHistory.length - 1]

    return `
==== 自动优化报告 ====
时间: ${new Date().toLocaleString()}

当前配置: ${this.currentProfile}
描述: ${OPTIMIZATION_PROFILES[this.currentProfile].description}

性能摘要:
  平均内存: ${summary?.avgMemoryMB.toFixed(2)}MB
  缓存命中率: ${summary ? (summary.avgCacheHitRate * 100).toFixed(1) : 0}%
  总操作数: ${summary?.totalOperations || 0}

最近调整:
  时间: ${lastAdjustment ? new Date(lastAdjustment.timestamp).toLocaleString() : '无'}
  配置: ${lastAdjustment?.profile || '无'}
  原因: ${lastAdjustment?.reason || '无'}

调整历史: ${this.adjustmentHistory.length} 次
======================`
  }
}

// 全局优化器实例
let globalOptimizer: ColorAutoOptimizer | null = null

/**
 * 启动自动优化
 */
export function startAutoOptimization(options?: AutoOptimizerOptions): ColorAutoOptimizer {
  if (!globalOptimizer) {
    globalOptimizer = new ColorAutoOptimizer(options)
    globalOptimizer.start()
  }
  return globalOptimizer
}

/**
 * 停止自动优化
 */
export function stopAutoOptimization(): void {
  if (globalOptimizer) {
    globalOptimizer.stop()
    globalOptimizer = null
  }
}

/**
 * 应用优化配置文件
 */
export function applyOptimizationProfile(profile: keyof typeof OPTIMIZATION_PROFILES): void {
  if (!globalOptimizer) {
    globalOptimizer = new ColorAutoOptimizer({ autoAdjust: false })
  }
  globalOptimizer.applyProfile(profile)
}
