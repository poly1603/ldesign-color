/**
 * 性能监控模块
 * 实时监控 Color 包的性能和内存使用情况
 */

import { getMemoryStats } from '../utils/memoryManager'
import { poolManager } from '../utils/objectPool'
import { globalColorCache as cache } from '../utils/cache'
import { globalColorCache as advancedCache } from '../utils/advancedCache'

export interface PerformanceMetrics {
  // 内存指标
  memory: {
    estimatedMB: number
    colorPoolSize: number
    cacheSize: number
    advancedCacheSize: number
  }
  // 性能指标
  performance: {
    operationsPerSecond: number
    averageOperationTime: number
    cacheHitRate: number
  }
  // 对象池指标
  pools: {
    [poolName: string]: {
      size: number
      maxSize: number
      hitRate: number
      utilization: number
    }
  }
  // 时间戳
  timestamp: number
}

export interface MonitorOptions {
  // 监控间隔（毫秒）
  interval?: number
  // 是否记录历史
  recordHistory?: boolean
  // 历史记录最大条数
  maxHistorySize?: number
  // 性能阈值警告
  thresholds?: {
    maxMemoryMB?: number
    minCacheHitRate?: number
    maxOperationTime?: number
  }
  // 回调函数
  onMetrics?: (metrics: PerformanceMetrics) => void
  onWarning?: (warning: string) => void
}

/**
 * 性能监控器
 */
export class ColorPerformanceMonitor {
  private interval: number | null = null
  private history: PerformanceMetrics[] = []
  private options: Required<MonitorOptions>
  private operationCount = 0
  private operationTime = 0
  private lastCheck = Date.now()

  constructor(options: MonitorOptions = {}) {
    this.options = {
      interval: options.interval ?? 5000,
      recordHistory: options.recordHistory ?? true,
      maxHistorySize: options.maxHistorySize ?? 100,
      thresholds: {
        maxMemoryMB: options.thresholds?.maxMemoryMB ?? 50,
        minCacheHitRate: options.thresholds?.minCacheHitRate ?? 0.5,
        maxOperationTime: options.thresholds?.maxOperationTime ?? 10,
      },
      onMetrics: options.onMetrics ?? (() => { }),
      onWarning: options.onWarning ?? (msg => console.warn(`⚠️ ${msg}`)),
    }
  }

  /**
   * 开始监控
   */
  start(): void {
    if (this.interval !== null) {
      return
    }

    this.interval = (typeof window !== 'undefined' ? window.setInterval : setInterval)(() => {
      const metrics = this.collectMetrics()
      this.processMetrics(metrics)
    }, this.options.interval) as any

    console.log('🔍 性能监控已启动')
  }

  /**
   * 停止监控
   */
  stop(): void {
    if (this.interval !== null) {
      clearInterval(this.interval)
      this.interval = null
      console.log('🛑 性能监控已停止')
    }
  }

  /**
   * 收集指标
   */
  private collectMetrics(): PerformanceMetrics {
    const memStats = getMemoryStats()
    const poolStats = poolManager.getAllStats()
    const cacheStats = cache.getStats()
    const advCacheStats = advancedCache.getStats()

    const now = Date.now()
    const timeDelta = (now - this.lastCheck) / 1000 // 秒
    const opsPerSecond = this.operationCount / timeDelta
    const avgOpTime = this.operationCount > 0 ? this.operationTime / this.operationCount : 0

    // 重置计数器
    this.operationCount = 0
    this.operationTime = 0
    this.lastCheck = now

    return {
      memory: {
        estimatedMB: memStats.estimatedMemoryMB,
        colorPoolSize: memStats.colorPoolSize,
        cacheSize: memStats.colorCacheSize,
        advancedCacheSize: memStats.advancedCacheSize,
      },
      performance: {
        operationsPerSecond: opsPerSecond,
        averageOperationTime: avgOpTime,
        cacheHitRate: (cacheStats.utilization + advCacheStats.hitRate) / 2,
      },
      pools: poolStats,
      timestamp: now,
    }
  }

  /**
   * 处理指标
   */
  private processMetrics(metrics: PerformanceMetrics): void {
    // 记录历史
    if (this.options.recordHistory) {
      this.history.push(metrics)
      if (this.history.length > this.options.maxHistorySize) {
        this.history.shift()
      }
    }

    // 检查阈值
    this.checkThresholds(metrics)

    // 调用回调
    this.options.onMetrics(metrics)
  }

  /**
   * 检查阈值并发出警告
   */
  private checkThresholds(metrics: PerformanceMetrics): void {
    const { thresholds } = this.options

    // 内存警告
    if (metrics.memory.estimatedMB > thresholds.maxMemoryMB) {
      this.options.onWarning(
        `内存使用过高: ${metrics.memory.estimatedMB.toFixed(2)}MB (阈值: ${thresholds.maxMemoryMB}MB)`
      )
    }

    // 缓存命中率警告
    if (metrics.performance.cacheHitRate < thresholds.minCacheHitRate) {
      this.options.onWarning(
        `缓存命中率过低: ${(metrics.performance.cacheHitRate * 100).toFixed(1)}% (阈值: ${thresholds.minCacheHitRate * 100}%)`
      )
    }

    // 操作时间警告
    if (metrics.performance.averageOperationTime > thresholds.maxOperationTime) {
      this.options.onWarning(
        `操作时间过长: ${metrics.performance.averageOperationTime.toFixed(2)}ms (阈值: ${thresholds.maxOperationTime}ms)`
      )
    }
  }

  /**
   * 记录操作（供 Color 类调用）
   */
  recordOperation(timeMs: number): void {
    this.operationCount++
    this.operationTime += timeMs
  }

  /**
   * 获取当前指标
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.collectMetrics()
  }

  /**
   * 获取历史记录
   */
  getHistory(): PerformanceMetrics[] {
    return [...this.history]
  }

  /**
   * 获取统计摘要
   */
  getSummary(): {
    avgMemoryMB: number
    maxMemoryMB: number
    minMemoryMB: number
    avgCacheHitRate: number
    totalOperations: number
  } | null {
    if (this.history.length === 0) {
      return null
    }

    const memories = this.history.map(h => h.memory.estimatedMB)
    const hitRates = this.history.map(h => h.performance.cacheHitRate)
    const operations = this.history.reduce((sum, h) =>
      sum + h.performance.operationsPerSecond * (this.options.interval / 1000), 0
    )

    return {
      avgMemoryMB: memories.reduce((a, b) => a + b, 0) / memories.length,
      maxMemoryMB: Math.max(...memories),
      minMemoryMB: Math.min(...memories),
      avgCacheHitRate: hitRates.reduce((a, b) => a + b, 0) / hitRates.length,
      totalOperations: Math.round(operations),
    }
  }

  /**
   * 清除历史记录
   */
  clearHistory(): void {
    this.history = []
  }

  /**
   * 导出报告
   */
  exportReport(): string {
    const summary = this.getSummary()
    if (!summary) {
      return '无监控数据'
    }

    return `
==== Color 性能监控报告 ====
时间: ${new Date().toLocaleString()}

内存使用:
  平均: ${summary.avgMemoryMB.toFixed(2)}MB
  最大: ${summary.maxMemoryMB.toFixed(2)}MB
  最小: ${summary.minMemoryMB.toFixed(2)}MB

性能指标:
  缓存命中率: ${(summary.avgCacheHitRate * 100).toFixed(1)}%
  总操作数: ${summary.totalOperations}

历史记录: ${this.history.length} 条
监控间隔: ${this.options.interval}ms
============================`
  }
}

// 全局监控实例
let globalMonitor: ColorPerformanceMonitor | null = null

/**
 * 启动全局性能监控
 */
export function startMonitoring(options?: MonitorOptions): ColorPerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new ColorPerformanceMonitor(options)
    globalMonitor.start()
  }
  return globalMonitor
}

/**
 * 停止全局性能监控
 */
export function stopMonitoring(): void {
  if (globalMonitor) {
    globalMonitor.stop()
    globalMonitor = null
  }
}

/**
 * 获取当前性能指标
 */
export function getPerformanceMetrics(): PerformanceMetrics | null {
  if (!globalMonitor) {
    globalMonitor = new ColorPerformanceMonitor()
  }
  return globalMonitor.getCurrentMetrics()
}

/**
 * 实时性能仪表板（用于开发环境）
 */
export class PerformanceDashboard {
  private monitor: ColorPerformanceMonitor
  private element?: HTMLElement

  constructor(options?: MonitorOptions) {
    this.monitor = new ColorPerformanceMonitor({
      ...options,
      onMetrics: (metrics) => {
        this.updateDashboard(metrics)
        options?.onMetrics?.(metrics)
      },
    })
  }

  /**
   * 显示仪表板
   */
  show(): void {
    if (typeof document === 'undefined') {
      console.warn('仪表板仅在浏览器环境中可用')
      return
    }

    // 创建仪表板元素
    this.element = document.createElement('div')
    this.element.id = 'color-performance-dashboard'
    this.element.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 300px;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `

    document.body.appendChild(this.element)
    this.monitor.start()
  }

  /**
   * 隐藏仪表板
   */
  hide(): void {
    if (this.element) {
      this.element.remove()
      this.element = undefined
    }
    this.monitor.stop()
  }

  /**
   * 更新仪表板显示
   */
  private updateDashboard(metrics: PerformanceMetrics): void {
    if (!this.element) return

    const memoryBar = this.createProgressBar(metrics.memory.estimatedMB, 50, '#4CAF50', '#f44336')
    const cacheBar = this.createProgressBar(metrics.performance.cacheHitRate * 100, 100, '#2196F3', '#FFC107')

    this.element.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 14px;">🎨 Color Performance</h3>
      <div style="margin-bottom: 10px;">
        <div>内存: ${metrics.memory.estimatedMB.toFixed(2)}MB / 50MB</div>
        ${memoryBar}
      </div>
      <div style="margin-bottom: 10px;">
        <div>缓存命中: ${(metrics.performance.cacheHitRate * 100).toFixed(1)}%</div>
        ${cacheBar}
      </div>
      <div style="margin-bottom: 5px;">
        <div>操作/秒: ${metrics.performance.operationsPerSecond.toFixed(0)}</div>
      </div>
      <div style="margin-bottom: 5px;">
        <div>对象池: ${metrics.memory.colorPoolSize}</div>
      </div>
      <div style="margin-bottom: 5px;">
        <div>缓存项: ${metrics.memory.cacheSize + metrics.memory.advancedCacheSize}</div>
      </div>
      <div style="text-align: right; margin-top: 10px; opacity: 0.5; font-size: 10px;">
        更新: ${new Date(metrics.timestamp).toLocaleTimeString()}
      </div>
    `
  }

  /**
   * 创建进度条
   */
  private createProgressBar(value: number, max: number, goodColor: string, badColor: string): string {
    const percentage = Math.min(100, (value / max) * 100)
    const color = percentage < 70 ? goodColor : percentage < 90 ? '#FFC107' : badColor

    return `
      <div style="
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin-top: 4px;
        overflow: hidden;
      ">
        <div style="
          width: ${percentage}%;
          height: 100%;
          background: ${color};
          transition: width 0.3s ease;
        "></div>
      </div>
    `
  }
}

// 导出便捷函数
export const dashboard = new PerformanceDashboard()
