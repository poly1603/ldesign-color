/**
 * @ldesign/color - 内存管理工具
 *
 * 集中式内存管理，防止内存泄漏并优化内存使用。
 *
 * @module utils/memoryManager
 */

import { poolManager } from './objectPool'
import { globalColorCache } from './cache'

/**
 * 内存使用统计信息
 */
export interface MemoryStats {
  /** 对象池总大小 */
  totalPoolSize: number
  /** 缓存大小 */
  cacheSize: number
  /** 总缓存项数 */
  totalItems: number
  /** 估算的内存占用（MB） */
  estimatedMemoryMB: number
  /** 内存压力级别 */
  pressureLevel: 'normal' | 'moderate' | 'high' | 'critical'
}

/**
 * 内存管理器配置选项
 */
export interface MemoryManagerConfig {
  /** 最大内存占用（MB） */
  maxMemory?: number
  /** 自动清理间隔（毫秒） */
  cleanupInterval?: number
  /** 内存警告阈值（MB） */
  warnThreshold?: number
  /** 启用自动清理 */
  enableAutoCleanup?: boolean
}

/**
 * 颜色库内存管理器
 *
 * 提供集中式内存管理，防止内存泄漏和优化内存使用。
 *
 * @example
 * ```typescript
 * const manager = MemoryManager.getInstance()
 * const stats = manager.getMemoryStats()
 * console.log(`内存占用: ${stats.estimatedMemoryMB.toFixed(2)} MB`)
 * ```
 */
export class MemoryManager {
  private static instance: MemoryManager
  private cleanupTimer?: ReturnType<typeof setInterval>
  private memoryCheckTimer?: ReturnType<typeof setInterval>
  private config: Required<MemoryManagerConfig>
  private lastCleanupTime = 0
  private cleanupCount = 0

  /**
   * 创建内存管理器实例（私有）
   *
   * @param config - 配置选项
   */
  private constructor(config: MemoryManagerConfig = {}) {
    this.config = {
      maxMemory: config.maxMemory ?? 50, // 50 MB
      cleanupInterval: config.cleanupInterval ?? 60000, // 1 分钟
      warnThreshold: config.warnThreshold ?? 40, // 40 MB
      enableAutoCleanup: config.enableAutoCleanup ?? true,
    }

    // 初始化自动清理
    if (this.config.enableAutoCleanup) {
      this.startAutoCleanup()
    }

    // 监控页面可见性
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    }

    // 页面卸载时清理
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.destroy.bind(this), { once: true })
    }
  }

  /**
   * 获取单例实例
   *
   * @param config - 可选配置（仅首次创建时有效）
   * @returns 内存管理器实例
   */
  static getInstance(config?: MemoryManagerConfig): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager(config)
    }
    return MemoryManager.instance
  }

  /**
   * 处理页面可见性变化
   *
   * @private
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // 页面隐藏，减少内存使用
      this.reduceMemoryUsage()
    }
  }

  /**
   * 启动自动清理定时器
   *
   * @private
   */
  private startAutoCleanup(): void {
    if (this.cleanupTimer !== undefined)
      return

    this.cleanupTimer = setInterval(() => {
      this.performAutoCleanup()
    }, this.config.cleanupInterval)

    // 防止定时器阻止进程退出
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref()
    }
  }

  /**
   * 停止自动清理定时器
   *
   * @private
   */
  private stopAutoCleanup(): void {
    if (this.cleanupTimer !== undefined) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }
  }

  /**
   * 执行自动清理
   *
   * @private
   */
  private performAutoCleanup(): void {
    const stats = this.getMemoryStats()

    // 记录清理时间
    this.lastCleanupTime = Date.now()
    this.cleanupCount++

    // 根据内存压力级别执行不同强度的清理
    switch (stats.pressureLevel) {
      case 'critical':
        this.aggressiveCleanup()
        console.warn(`[内存管理] 严重内存压力，执行激进清理 (${stats.estimatedMemoryMB.toFixed(2)} MB)`)
        break

      case 'high':
        this.moderateCleanup()
        console.warn(`[内存管理] 高内存压力，执行适度清理 (${stats.estimatedMemoryMB.toFixed(2)} MB)`)
        break

      case 'moderate':
        this.lightCleanup()
        console.info(`[内存管理] 中等内存压力，执行轻度清理 (${stats.estimatedMemoryMB.toFixed(2)} MB)`)
        break

      default:
        // 正常状态，仅清理过期项
        globalColorCache.cleanup()
        break
    }

    // 警告阈值检查
    if (stats.estimatedMemoryMB > this.config.warnThreshold) {
      console.warn(
        `[内存管理] 内存占用 (${stats.estimatedMemoryMB.toFixed(2)} MB) `
        + `超过警告阈值 (${this.config.warnThreshold} MB)`,
      )
    }
  }

  /**
   * 获取当前内存统计信息
   *
   * @returns 内存统计对象
   *
   * @example
   * ```typescript
   * const stats = manager.getMemoryStats()
   * console.log(`内存占用: ${stats.estimatedMemoryMB.toFixed(2)} MB`)
   * console.log(`压力级别: ${stats.pressureLevel}`)
   * ```
   */
  getMemoryStats(): MemoryStats {
    // 获取所有池的统计信息
    const poolStats = poolManager.getAllStats()
    const totalPoolSize = Object.values(poolStats).reduce(
      (sum, stat) => sum + stat.poolSize,
      0,
    )

    // 获取缓存统计
    const cacheStats = globalColorCache.getStats()
    const cacheSize = cacheStats.size
    const totalItems = totalPoolSize + cacheSize

    // 估算内存使用（粗略估计）
    // 每个池对象 ~100 字节，每个缓存项使用实际测量的大小
    const poolMemoryBytes = totalPoolSize * 100
    const cacheMemoryBytes = cacheStats.memoryUsage
    const estimatedMemoryBytes = poolMemoryBytes + cacheMemoryBytes
    const estimatedMemoryMB = estimatedMemoryBytes / (1024 * 1024)

    // 确定内存压力级别
    let pressureLevel: MemoryStats['pressureLevel']
    const maxMemory = this.config.maxMemory
    const ratio = estimatedMemoryMB / maxMemory

    if (ratio > 0.95) {
      pressureLevel = 'critical'
    }
    else if (ratio > 0.8) {
      pressureLevel = 'high'
    }
    else if (ratio > 0.6) {
      pressureLevel = 'moderate'
    }
    else {
      pressureLevel = 'normal'
    }

    return {
      totalPoolSize,
      cacheSize,
      totalItems,
      estimatedMemoryMB,
      pressureLevel,
    }
  }

  /**
   * 减少内存使用（页面隐藏时）
   *
   * @private
   */
  private reduceMemoryUsage(): void {
    // 收缩所有对象池
    poolManager.shrinkAll()

    // 清理缓存过期项
    globalColorCache.cleanup()
  }

  /**
   * 轻度清理
   *
   * @private
   */
  private lightCleanup(): void {
    // 清理过期缓存项
    globalColorCache.cleanup()
  }

  /**
   * 适度清理
   *
   * @private
   */
  private moderateCleanup(): void {
    // 清理缓存
    globalColorCache.cleanup()

    // 收缩对象池
    poolManager.shrinkAll()
  }

  /**
   * 激进清理
   *
   * @private
   */
  private aggressiveCleanup(): void {
    // 清空大部分缓存
    globalColorCache.clear()

    // 清空所有对象池
    poolManager.clearAll()
  }

  /**
   * 手动清理内存
   *
   * 执行一次性清理，释放部分内存。
   *
   * @example
   * ```typescript
   * manager.cleanup()
   * ```
   */
  cleanup(): void {
    // 清理缓存
    globalColorCache.cleanup()

    // 优化对象池
    poolManager.optimizeAll()
  }

  /**
   * 销毁内存管理器
   *
   * 停止所有定时器并释放所有资源。
   *
   * @example
   * ```typescript
   * manager.destroy()
   * ```
   */
  destroy(): void {
    // 停止自动清理
    this.stopAutoCleanup()

    // 停止内存检查
    if (this.memoryCheckTimer !== undefined) {
      clearInterval(this.memoryCheckTimer)
      this.memoryCheckTimer = undefined
    }

    // 清空所有缓存
    globalColorCache.destroy()

    // 销毁所有对象池
    poolManager.destroy()

    // 移除事件监听
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    }
  }

  /**
   * 重置所有缓存和池
   *
   * 清空所有数据但保持管理器运行。
   *
   * @example
   * ```typescript
   * manager.reset()
   * ```
   */
  reset(): void {
    // 清空缓存
    globalColorCache.clear()

    // 清空所有对象池
    poolManager.clearAll()
  }

  /**
   * 设置最大内存限制
   *
   * @param limitMB - 内存限制（MB）
   *
   * @example
   * ```typescript
   * manager.setMemoryLimit(100) // 设置为 100MB
   * ```
   */
  setMemoryLimit(limitMB: number): void {
    this.config.maxMemory = Math.max(10, limitMB)
  }

  /**
   * 启用/禁用自动清理
   *
   * @param enabled - 是否启用
   *
   * @example
   * ```typescript
   * manager.setAutoCleanup(false) // 禁用自动清理
   * ```
   */
  setAutoCleanup(enabled: boolean): void {
    this.config.enableAutoCleanup = enabled
    if (enabled) {
      this.startAutoCleanup()
    }
    else {
      this.stopAutoCleanup()
    }
  }

  /**
   * 获取管理器配置
   *
   * @returns 当前配置
   */
  getConfig(): Readonly<Required<MemoryManagerConfig>> {
    return { ...this.config }
  }

  /**
   * 获取清理统计
   *
   * @returns 清理统计信息
   */
  getCleanupStats(): {
    lastCleanupTime: number
    cleanupCount: number
    timeSinceLastCleanup: number
  } {
    return {
      lastCleanupTime: this.lastCleanupTime,
      cleanupCount: this.cleanupCount,
      timeSinceLastCleanup: this.lastCleanupTime > 0 ? Date.now() - this.lastCleanupTime : 0,
    }
  }

  /**
   * 请求垃圾回收（如果可用）
   *
   * 注意：这只是一个提示，不保证执行，取决于浏览器。
   */
  requestGarbageCollection(): void {
    if (typeof window !== 'undefined' && (window as any).gc) {
      try {
        (window as any).gc()
      }
      catch {
        // GC 不可用或失败
      }
    }
  }
}

/**
 * 全局内存管理器实例
 *
 * @example
 * ```typescript
 * import { memoryManager } from '@ldesign/color-core/utils/memoryManager'
 *
 * const stats = memoryManager.getMemoryStats()
 * ```
 */
export const memoryManager = MemoryManager.getInstance()

/**
 * 清理内存（便利函数）
 *
 * @example
 * ```typescript
 * import { cleanupMemory } from '@ldesign/color-core/utils/memoryManager'
 * cleanupMemory()
 * ```
 */
export function cleanupMemory(): void {
  memoryManager.cleanup()
}

/**
 * 重置内存（便利函数）
 *
 * @example
 * ```typescript
 * import { resetMemory } from '@ldesign/color-core/utils/memoryManager'
 * resetMemory()
 * ```
 */
export function resetMemory(): void {
  memoryManager.reset()
}

/**
 * 获取内存统计信息（便利函数）
 *
 * @returns 内存统计对象
 *
 * @example
 * ```typescript
 * import { getMemoryStats } from '@ldesign/color-core/utils/memoryManager'
 * const stats = getMemoryStats()
 * console.log(`内存占用: ${stats.estimatedMemoryMB.toFixed(2)} MB`)
 * ```
 */
export function getMemoryStats(): MemoryStats {
  return memoryManager.getMemoryStats()
}

/**
 * 设置内存限制（便利函数）
 *
 * @param limitMB - 内存限制（MB）
 *
 * @example
 * ```typescript
 * import { setMemoryLimit } from '@ldesign/color-core/utils/memoryManager'
 * setMemoryLimit(100) // 设置为 100MB
 * ```
 */
export function setMemoryLimit(limitMB: number): void {
  memoryManager.setMemoryLimit(limitMB)
}

/**
 * 启用/禁用自动清理（便利函数）
 *
 * @param enabled - 是否启用
 *
 * @example
 * ```typescript
 * import { setAutoCleanup } from '@ldesign/color-core/utils/memoryManager'
 * setAutoCleanup(false) // 禁用自动清理
 * ```
 */
export function setAutoCleanup(enabled: boolean): void {
  memoryManager.setAutoCleanup(enabled)
}
