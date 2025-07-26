import type { PerformanceMetrics } from '../types'

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private startTimes: Map<string, number> = new Map()
  private metrics: Partial<PerformanceMetrics> = {}
  private cacheHits = 0
  private cacheMisses = 0

  /**
   * 开始计时
   */
  public startTimer(name: string): void {
    this.startTimes.set(name, performance.now())
  }

  /**
   * 结束计时并记录
   */
  public endTimer(name: string): number {
    const startTime = this.startTimes.get(name)
    if (!startTime) {
      console.warn(`Timer ${name} was not started`)
      return 0
    }

    const duration = performance.now() - startTime
    this.startTimes.delete(name)

    // 记录到指标中
    switch (name) {
      case 'semanticColorGeneration':
        this.metrics.semanticColorGeneration = duration
        break
      case 'paletteGeneration':
        this.metrics.paletteGeneration = duration
        break
      case 'cssVariableGeneration':
        this.metrics.cssVariableGeneration = duration
        break
    }

    return duration
  }

  /**
   * 记录缓存命中
   */
  public recordCacheHit(): void {
    this.cacheHits++
  }

  /**
   * 记录缓存未命中
   */
  public recordCacheMiss(): void {
    this.cacheMisses++
  }

  /**
   * 获取性能指标
   */
  public getMetrics(): PerformanceMetrics {
    const totalTime = (this.metrics.semanticColorGeneration || 0)
      + (this.metrics.paletteGeneration || 0)
      + (this.metrics.cssVariableGeneration || 0)

    const totalCacheRequests = this.cacheHits + this.cacheMisses
    const cacheHitRate = totalCacheRequests > 0 ? this.cacheHits / totalCacheRequests : 0

    return {
      semanticColorGeneration: this.metrics.semanticColorGeneration || 0,
      paletteGeneration: this.metrics.paletteGeneration || 0,
      cssVariableGeneration: this.metrics.cssVariableGeneration || 0,
      totalTime,
      cacheHitRate,
    }
  }

  /**
   * 重置指标
   */
  public reset(): void {
    this.startTimes.clear()
    this.metrics = {}
    this.cacheHits = 0
    this.cacheMisses = 0
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

/**
 * 批处理函数
 */
export class BatchProcessor<T, R> {
  private queue: T[] = []
  private processor: (items: T[]) => Promise<R[]>
  private batchSize: number
  private delay: number
  private timeout: NodeJS.Timeout | null = null

  constructor(
    processor: (items: T[]) => Promise<R[]>,
    batchSize: number = 10,
    delay: number = 100,
  ) {
    this.processor = processor
    this.batchSize = batchSize
    this.delay = delay
  }

  /**
   * 添加项目到批处理队列
   */
  public add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push(item)

      // 如果队列达到批处理大小，立即处理
      if (this.queue.length >= this.batchSize) {
        this.processBatch().then((results) => {
          resolve(results[results.length - 1])
        }).catch(reject)
      }
 else {
        // 否则设置延迟处理
        if (this.timeout) {
          clearTimeout(this.timeout)
        }

        this.timeout = setTimeout(() => {
          this.processBatch().then((results) => {
            resolve(results[results.length - 1])
          }).catch(reject)
        }, this.delay)
      }
    })
  }

  /**
   * 处理批次
   */
  private async processBatch(): Promise<R[]> {
    if (this.queue.length === 0) {
      return []
    }

    const items = this.queue.splice(0, this.batchSize)
    return await this.processor(items)
  }
}

/**
 * 使用 requestIdleCallback 进行空闲时间处理
 */
export function runInIdleTime<T>(
  task: () => T,
  timeout: number = 5000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        (_deadline) => {
          try {
            const result = task()
            resolve(result)
          }
 catch (error) {
            reject(error)
          }
        },
        { timeout },
      )
    }
 else {
      // 降级到 setTimeout
      setTimeout(() => {
        try {
          const result = task()
          resolve(result)
        }
 catch (error) {
          reject(error)
        }
      }, 0)
    }
  })
}

/**
 * 内存使用监控
 */
export class MemoryMonitor {
  /**
   * 获取内存使用情况
   */
  public static getMemoryUsage(): {
    used: number
    total: number
    percentage: number
  } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      }
    }
    return null
  }

  /**
   * 检查是否需要清理内存
   */
  public static shouldCleanup(threshold: number = 80): boolean {
    const usage = this.getMemoryUsage()
    return usage ? usage.percentage > threshold : false
  }
}

/**
 * 异步队列处理器
 */
export class AsyncQueue<T> {
  private queue: (() => Promise<T>)[] = []
  private concurrency: number
  private running = 0

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency
  }

  /**
   * 添加任务到队列
   */
  public add<R>(task: () => Promise<R>): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result as any)
          return result as any
        }
 catch (error) {
          reject(error)
          throw error
        }
      })

      this.process()
    })
  }

  /**
   * 处理队列
   */
  private async process(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return
    }

    this.running++
    const task = this.queue.shift()

    if (task) {
      try {
        await task()
      }
 catch (error) {
        console.error('Queue task failed:', error)
      }
 finally {
        this.running--
        this.process() // 处理下一个任务
      }
    }
  }

  /**
   * 清空队列
   */
  public clear(): void {
    this.queue = []
  }

  /**
   * 获取队列长度
   */
  public get length(): number {
    return this.queue.length
  }
}

/**
 * 创建性能监控装饰器
 */
export function performanceMonitor(name: string) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const monitor = new PerformanceMonitor()
      monitor.startTimer(name)

      try {
        const result = await originalMethod.apply(this, args)
        return result
      }
 finally {
        const duration = monitor.endTimer(name)
        console.log(`${name} took ${duration.toFixed(2)}ms`)
      }
    }

    return descriptor
  }
}
