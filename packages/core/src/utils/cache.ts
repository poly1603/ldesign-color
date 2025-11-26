/**
 * @ldesign/color - 高性能缓存工具
 *
 * 提供基于双向链表的 LRU 缓存实现，支持多种淘汰策略和内存管理。
 *
 * @module utils/cache
 */

/**
 * 缓存淘汰策略
 */
export type EvictionStrategy = 'lru' | 'lfu' | 'fifo'

/**
 * 双向链表节点
 *
 * @template T - 缓存值类型
 */
interface CacheNode<T = any> {
  /** 缓存键 */
  key: string
  /** 缓存值 */
  value: T
  /** 前一个节点 */
  prev: CacheNode<T> | null
  /** 后一个节点 */
  next: CacheNode<T> | null
  /** 创建时间戳 */
  createdAt: number
  /** 最后访问时间戳 */
  lastAccessed: number
  /** 访问次数 */
  accessCount: number
  /** 过期时间戳（可选） */
  expires?: number
  /** 估算的内存大小（字节） */
  size: number
}

/**
 * 缓存配置选项
 */
export interface ColorCacheConfig {
  /** 最大缓存项数量 */
  maxSize?: number
  /** 最大内存占用（字节） */
  maxMemory?: number
  /** 默认过期时间（毫秒），0 表示永不过期 */
  defaultTTL?: number
  /** 淘汰策略 */
  strategy?: EvictionStrategy
  /** 自动清理间隔（毫秒），0 表示禁用 */
  cleanupInterval?: number
  /** 缓存大小警告阈值 */
  warnOnLargeCacheSize?: number
}

/**
 * 缓存统计信息
 */
export interface ColorCacheStats {
  /** 当前缓存项数量 */
  size: number
  /** 最大缓存项数量 */
  maxSize: number
  /** 缓存命中次数 */
  hits: number
  /** 缓存未命中次数 */
  misses: number
  /** 缓存命中率（0-1） */
  hitRate: number
  /** 淘汰次数 */
  evictions: number
  /** 当前内存占用（字节） */
  memoryUsage: number
  /** 利用率（百分比） */
  utilization: number
}

/**
 * 估算值的内存大小（字节）
 *
 * @param value - 要估算的值
 * @returns 估算的字节数
 * @performance O(n)，n 为对象或数组的大小
 */
function estimateSize(value: any): number {
  if (value === null || value === undefined) {
    return 0
  }

  const type = typeof value

  switch (type) {
    case 'boolean':
      return 4
    case 'number':
      return 8
    case 'string':
      return value.length * 2 // UTF-16 编码
    case 'object':
      if (Array.isArray(value)) {
        return value.reduce((sum, item) => sum + estimateSize(item), 40)
      }
      // 对象：估算键和值的大小
      return Object.entries(value).reduce(
        (sum, [k, v]) => sum + k.length * 2 + estimateSize(v),
        40, // 对象本身的开销
      )
    default:
      return 40 // 默认估算
  }
}

/**
 * 高性能 LRU 缓存类
 *
 * 使用双向链表 + Map 实现真正的 O(1) 时间复杂度访问。
 * 支持内存限制、自动过期、多种淘汰策略。
 *
 * @template T - 缓存值类型
 *
 * @example
 * ```typescript
 * // 创建缓存实例
 * const cache = new ColorCache<string>({
 *   maxSize: 100,
 *   maxMemory: 1024 * 1024, // 1MB
 *   strategy: 'lru',
 *   defaultTTL: 300000 // 5分钟
 * })
 *
 * // 设置缓存
 * cache.set('key1', 'value1', 60000) // 1分钟后过期
 *
 * // 获取缓存
 * const value = cache.get('key1')
 *
 * // 获取统计信息
 * const stats = cache.getStats()
 * console.log(`命中率: ${stats.hitRate * 100}%`)
 * ```
 */
export class ColorCache<T = any> {
  private cache = new Map<string, CacheNode<T>>()
  private config: Required<ColorCacheConfig>
  private cleanupTimer?: ReturnType<typeof setInterval>

  // LRU 双向链表
  private head: CacheNode<T> | null = null
  private tail: CacheNode<T> | null = null

  // 内存使用统计
  private memoryUsage = 0

  // 统计信息
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  }

  /**
   * 创建缓存实例
   *
   * @param config - 缓存配置选项
   *
   * @example
   * ```typescript
   * const cache = new ColorCache({
   *   maxSize: 50,
   *   defaultTTL: 300000
   * })
   * ```
   */
  constructor(config: ColorCacheConfig = {}) {
    this.config = {
      maxSize: config.maxSize ?? 100,
      maxMemory: config.maxMemory,
      defaultTTL: config.defaultTTL ?? 0,
      strategy: config.strategy ?? 'lru',
      cleanupInterval: config.cleanupInterval ?? 60000,
      warnOnLargeCacheSize: config.warnOnLargeCacheSize ?? 500,
    }

    // 启动定期清理
    if (this.config.cleanupInterval > 0) {
      this.startCleanup()
    }
  }

  /**
   * 设置缓存
   *
   * @param key - 缓存键
   * @param value - 缓存值
   * @param ttl - 过期时间（毫秒），0 表示永不过期
   * @throws 如果 key 为空字符串
   *
   * @performance O(1) - 双向链表操作
   *
   * @example
   * ```typescript
   * // 设置永久缓存
   * cache.set('config', configData)
   *
   * // 设置 5 分钟过期
   * cache.set('user', userData, 300000)
   * ```
   */
  set(key: string, value: T, ttl?: number): void {
    if (!key || key.trim().length === 0) {
      throw new Error('缓存键不能为空')
    }

    const now = Date.now()
    const effectiveTTL = ttl ?? this.config.defaultTTL
    const valueSize = estimateSize(value)

    // 检查内存限制
    if (this.config.maxMemory) {
      const newMemoryUsage = this.memoryUsage + valueSize
      if (newMemoryUsage > this.config.maxMemory) {
        // 先清理过期项
        this.cleanup()

        // 如果还超限，驱逐项
        while (
          this.memoryUsage + valueSize > this.config.maxMemory
          && this.cache.size > 0
        ) {
          this.evict()
        }
      }
    }

    // 检查容量限制
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evict()
    }

    // 如果 key 已存在，先删除旧节点
    if (this.cache.has(key)) {
      const oldNode = this.cache.get(key)!
      this.memoryUsage -= oldNode.size
      this.removeNode(oldNode)
    }

    // 创建新节点并添加到链表头部
    const node: CacheNode<T> = {
      key,
      value,
      prev: null,
      next: null,
      createdAt: now,
      lastAccessed: now,
      accessCount: 0,
      expires: effectiveTTL > 0 ? now + effectiveTTL : undefined,
      size: valueSize,
    }

    this.addToHead(node)
    this.cache.set(key, node)
    this.memoryUsage += valueSize

    this.checkCacheSize()
  }

  /**
   * 获取缓存
   *
   * @param key - 缓存键
   * @returns 缓存值，如果不存在或已过期则返回 undefined
   *
   * @performance O(1) - 双向链表操作
   *
   * @example
   * ```typescript
   * const user = cache.get<User>('user:123')
   * if (user) {
   *   console.log('缓存命中')
   * }
   * ```
   */
  get(key: string): T | undefined {
    const node = this.cache.get(key)

    if (!node) {
      this.stats.misses++
      return undefined
    }

    // 检查是否过期
    if (node.expires && Date.now() > node.expires) {
      this.delete(key)
      this.stats.misses++
      return undefined
    }

    // 更新访问信息
    node.accessCount++
    node.lastAccessed = Date.now()

    // LRU 策略：移到链表头部
    if (this.config.strategy === 'lru') {
      this.moveToHead(node)
    }

    this.stats.hits++
    return node.value
  }

  /**
   * 检查缓存是否存在且未过期
   *
   * @param key - 缓存键
   * @returns 是否存在
   *
   * @performance O(1)
   */
  has(key: string): boolean {
    const node = this.cache.get(key)
    if (!node)
      return false

    // 检查是否过期
    if (node.expires && Date.now() > node.expires) {
      this.delete(key)
      return false
    }

    return true
  }

  /**
   * 删除缓存
   *
   * @param key - 缓存键
   * @returns 是否删除成功
   *
   * @performance O(1)
   */
  delete(key: string): boolean {
    const node = this.cache.get(key)
    if (!node)
      return false

    this.memoryUsage -= node.size
    this.removeNode(node)
    this.cache.delete(key)

    return true
  }

  /**
   * 清空所有缓存
   *
   * @performance O(1)
   */
  clear(): void {
    this.cache.clear()
    this.head = null
    this.tail = null
    this.memoryUsage = 0
  }

  /**
   * 获取缓存大小
   *
   * @returns 缓存项数量
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * 获取所有缓存键
   *
   * @returns 缓存键数组
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 批量设置缓存
   *
   * @param entries - 键值对数组
   * @param ttl - 过期时间（毫秒）
   *
   * @example
   * ```typescript
   * cache.setMany([
   *   ['key1', 'value1'],
   *   ['key2', 'value2']
   * ], 60000)
   * ```
   */
  setMany(entries: Array<[string, T]>, ttl?: number): void {
    for (const [key, value] of entries) {
      this.set(key, value, ttl)
    }
  }

  /**
   * 批量获取缓存
   *
   * @param keys - 缓存键数组
   * @returns 值数组（不存在的键返回 undefined）
   */
  getMany(keys: string[]): Array<T | undefined> {
    return keys.map(key => this.get(key))
  }

  /**
   * 批量删除缓存
   *
   * @param keys - 缓存键数组
   */
  deleteMany(keys: string[]): void {
    for (const key of keys) {
      this.delete(key)
    }
  }

  /**
   * 获取缓存统计信息
   *
   * @returns 统计信息对象
   *
   * @example
   * ```typescript
   * const stats = cache.getStats()
   * console.log(`命中率: ${(stats.hitRate * 100).toFixed(2)}%`)
   * console.log(`内存占用: ${(stats.memoryUsage / 1024).toFixed(2)} KB`)
   * ```
   */
  getStats(): ColorCacheStats {
    const total = this.stats.hits + this.stats.misses
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      evictions: this.stats.evictions,
      memoryUsage: this.memoryUsage,
      utilization: Math.round((this.cache.size / this.config.maxSize) * 100),
    }
  }

  /**
   * 清理过期缓存
   *
   * 遍历所有缓存项，删除已过期的项。
   *
   * @returns 清理的项数
   */
  cleanup(): number {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((node, key) => {
      if (node.expires && now > node.expires) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.delete(key))
    return keysToDelete.length
  }

  /**
   * 销毁缓存实例
   *
   * 停止定时器并清空所有缓存。
   */
  destroy(): void {
    this.stopCleanup()
    this.clear()
  }

  /**
   * 驱逐缓存项
   *
   * 根据配置的策略驱逐一个缓存项。
   *
   * @private
   */
  private evict(): void {
    if (this.cache.size === 0)
      return

    let keyToEvict: string | undefined

    switch (this.config.strategy) {
      case 'lru':
        // LRU: 删除链表尾部（最少最近使用）
        if (this.tail) {
          keyToEvict = this.tail.key
        }
        break

      case 'lfu':
        // LFU: 删除访问次数最少的
        let minAccessCount = Infinity
        this.cache.forEach((node, key) => {
          if (node.accessCount < minAccessCount) {
            minAccessCount = node.accessCount
            keyToEvict = key
          }
        })
        break

      case 'fifo':
        // FIFO: 删除创建时间最早的
        let oldestTime = Infinity
        this.cache.forEach((node, key) => {
          if (node.createdAt < oldestTime) {
            oldestTime = node.createdAt
            keyToEvict = key
          }
        })
        break
    }

    if (keyToEvict) {
      this.delete(keyToEvict)
      this.stats.evictions++
    }
  }

  /**
   * 添加节点到链表头部
   *
   * @private
   */
  private addToHead(node: CacheNode<T>): void {
    node.prev = null
    node.next = this.head

    if (this.head) {
      this.head.prev = node
    }

    this.head = node

    if (!this.tail) {
      this.tail = node
    }
  }

  /**
   * 从链表中移除节点
   *
   * @private
   */
  private removeNode(node: CacheNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next
    }
    else {
      this.head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    }
    else {
      this.tail = node.prev
    }
  }

  /**
   * 将节点移到链表头部
   *
   * @private
   */
  private moveToHead(node: CacheNode<T>): void {
    if (node === this.head)
      return

    this.removeNode(node)
    this.addToHead(node)
  }

  /**
   * 检查缓存大小并警告
   *
   * @private
   */
  private checkCacheSize(): void {
    if (
      this.config.warnOnLargeCacheSize
      && this.cache.size >= this.config.warnOnLargeCacheSize
    ) {
      console.warn(
        `缓存大小 (${this.cache.size}) 超过警告阈值 (${this.config.warnOnLargeCacheSize})。`
        + `建议增加 maxSize 或减少缓存使用。`,
      )
    }
  }

  /**
   * 启动定期清理
   *
   * @private
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)

    // 防止定时器阻止进程退出
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref()
    }
  }

  /**
   * 停止定期清理
   *
   * @private
   */
  private stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }
  }
}

/**
 * 全局缓存实例
 *
 * 用于共享的颜色缓存，减少内存占用。
 *
 * @example
 * ```typescript
 * // 使用全局缓存
 * globalColorCache.set('primary', '#667eea')
 * const color = globalColorCache.get('primary')
 * ```
 */
export const globalColorCache = new ColorCache({
  maxSize: 30, // 减少缓存大小以节省内存
  maxMemory: 512 * 1024, // 512KB 内存限制
  defaultTTL: 0, // 永不过期
  cleanupInterval: 120000, // 2分钟清理一次
})

// 页面卸载时清理缓存
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalColorCache.destroy()
  }, { once: true })

  // 页面隐藏时减少缓存占用
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      globalColorCache.cleanup()
    }
  })
}

/**
 * 函数记忆化装饰器
 *
 * 使用 WeakMap 实现自动内存清理的记忆化功能。
 *
 * @template T - 函数类型
 * @param fn - 需要记忆化的函数
 * @param getKey - 自定义键生成函数
 * @param maxSize - 最大缓存项数量
 * @returns 记忆化后的函数
 *
 * @example
 * ```typescript
 * const expensiveCalc = memoize((n: number) => {
 *   return n * n
 * })
 *
 * expensiveCalc(5) // 计算
 * expensiveCalc(5) // 从缓存返回
 * ```
 */
const memoCache = new WeakMap<Function, ColorCache<any>>()

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string,
  maxSize = 20,
): T {
  // 使用 WeakMap 允许垃圾回收
  let cache = memoCache.get(fn)
  if (!cache) {
    cache = new ColorCache<ReturnType<T>>({
      maxSize,
      cleanupInterval: 0, // 禁用自动清理
    })
    memoCache.set(fn, cache)
  }

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey
      ? getKey(...args)
      : args.length === 1
        ? String(args[0])
        : JSON.stringify(args)

    const cached = cache!.get(key)
    if (cached !== undefined) {
      return cached
    }

    const result = fn(...args)
    cache!.set(key, result)
    return result
  }) as T

  // 添加清理方法
  (memoized as any).clear = () => {
    cache?.clear()
  }

  return memoized
}

/**
 * 创建缓存键
 *
 * 从多个值生成缓存键字符串。
 *
 * @param values - 要组合的值
 * @returns 缓存键字符串
 *
 * @example
 * ```typescript
 * const key = createCacheKey('user', 123, { active: true })
 * // 返回: 'user-123-{"active":true}'
 * ```
 */
export function createCacheKey(...values: any[]): string {
  return values.map((v) => {
    if (v === null)
      return 'null'
    if (v === undefined)
      return 'undefined'
    if (typeof v === 'object')
      return JSON.stringify(v)
    return String(v)
  }).join('-')
}

/**
 * 自适应缓存配置
 */
export interface AdaptiveCacheConfig extends ColorCacheConfig {
  /** 最小缓存大小 */
  minSize?: number
  /** 调整检查间隔（毫秒） */
  adjustInterval?: number
  /** 命中率低阈值 */
  hitRateLowThreshold?: number
  /** 命中率高阈值 */
  hitRateHighThreshold?: number
  /** 每次调整的步长 */
  adjustStep?: number
}

/**
 * 内部使用的完整配置类型
 */
interface InternalAdaptiveConfig {
  minSize: number
  maxSize: number
  adjustInterval: number
  hitRateLowThreshold: number
  hitRateHighThreshold: number
  adjustStep: number
  defaultTTL: number
  strategy: EvictionStrategy
  cleanupInterval: number
  warnOnLargeCacheSize: number
  maxMemory?: number
}

/**
 * 自适应缓存类
 *
 * 根据缓存命中率自动调整缓存大小,优化内存使用和性能。
 *
 * - 命中率低 < 40%: 减小缓存(节省内存)
 * - 命中率高 > 80%: 增大缓存(提升性能)
 * - 命中率中等: 保持不变
 *
 * @template T - 缓存值类型
 *
 * @example
 * ```typescript
 * const cache = new AdaptiveColorCache<string>({
 *   minSize: 50,
 *   maxSize: 200,
 *   hitRateLowThreshold: 0.4,
 *   hitRateHighThreshold: 0.8,
 *   adjustInterval: 30000 // 30秒检查一次
 * })
 *
 * // 缓存会自动根据使用情况调整大小
 * cache.set('key1', 'value1')
 * const stats = cache.getAdaptiveStats()
 * console.log(`当前大小: ${stats.currentMaxSize}`)
 * ```
 */
export class AdaptiveColorCache<T = any> extends ColorCache<T> {
  private adjustConfig: InternalAdaptiveConfig
  private adjustTimer?: ReturnType<typeof setInterval>
  private lastAdjustment = Date.now()
  private adjustmentHistory: Array<{
    timestamp: number
    oldSize: number
    newSize: number
    hitRate: number
  }> = []

  /**
   * 创建自适应缓存实例
   *
   * @param config - 自适应缓存配置
   */
  constructor(config: AdaptiveCacheConfig = {}) {
    super(config)
    
    this.adjustConfig = {
      minSize: config.minSize ?? 30,
      maxSize: config.maxSize ?? 200,
      adjustInterval: config.adjustInterval ?? 30000, // 30秒
      hitRateLowThreshold: config.hitRateLowThreshold ?? 0.4,
      hitRateHighThreshold: config.hitRateHighThreshold ?? 0.8,
      adjustStep: config.adjustStep ?? 20,
      defaultTTL: config.defaultTTL ?? 0,
      strategy: config.strategy ?? 'lru',
      cleanupInterval: config.cleanupInterval ?? 60000,
      warnOnLargeCacheSize: config.warnOnLargeCacheSize ?? 500,
      maxMemory: config.maxMemory,
    }

    // 验证配置
    if (this.adjustConfig.minSize > this.adjustConfig.maxSize) {
      throw new Error('minSize 不能大于 maxSize')
    }

    // 启动自适应调整
    if (this.adjustConfig.adjustInterval > 0) {
      this.startAdaptiveAdjustment()
    }
  }

  /**
   * 获取自适应统计信息
   *
   * @returns 包含调整历史的统计信息
   */
  getAdaptiveStats() {
    const baseStats = this.getStats()
    return {
      ...baseStats,
      currentMaxSize: this.adjustConfig.maxSize,
      minSize: this.adjustConfig.minSize,
      adjustmentCount: this.adjustmentHistory.length,
      lastAdjustment: this.lastAdjustment,
      recentAdjustments: this.adjustmentHistory.slice(-5),
    }
  }

  /**
   * 手动触发缓存大小调整
   *
   * @returns 调整后的大小,如果未调整则返回 null
   */
  adjustSize(): number | null {
    const stats = this.getStats()
    const { hitRate } = stats
    const currentMaxSize = this.adjustConfig.maxSize
    let newMaxSize = currentMaxSize

    // 命中率太低,减小缓存
    if (hitRate < this.adjustConfig.hitRateLowThreshold && stats.hits + stats.misses > 50) {
      newMaxSize = Math.max(
        this.adjustConfig.minSize,
        currentMaxSize - this.adjustConfig.adjustStep,
      )
    }
    // 命中率很高且接近满载,增大缓存
    else if (
      hitRate > this.adjustConfig.hitRateHighThreshold
      && stats.utilization > 80
      && stats.hits + stats.misses > 50
    ) {
      newMaxSize = Math.min(
        this.adjustConfig.maxSize,
        currentMaxSize + this.adjustConfig.adjustStep,
      )
    }

    // 如果大小有变化,应用调整
    if (newMaxSize !== currentMaxSize) {
      this.adjustmentHistory.push({
        timestamp: Date.now(),
        oldSize: currentMaxSize,
        newSize: newMaxSize,
        hitRate,
      })

      // 保留最近20条记录
      if (this.adjustmentHistory.length > 20) {
        this.adjustmentHistory.shift()
      }

      this.adjustConfig.maxSize = newMaxSize
      this.lastAdjustment = Date.now()

      // 如果缩小了缓存,清理多余项
      if (newMaxSize < currentMaxSize) {
        this.trimToSize(newMaxSize)
      }

      return newMaxSize
    }

    return null
  }

  /**
   * 销毁缓存实例
   */
  override destroy(): void {
    this.stopAdaptiveAdjustment()
    super.destroy()
  }

  /**
   * 裁剪缓存到指定大小
   *
   * @private
   */
  private trimToSize(targetSize: number): void {
    while (this.size > targetSize) {
      // 使用父类的驱逐逻辑
      this['evict']()
    }
  }

  /**
   * 启动自适应调整
   *
   * @private
   */
  private startAdaptiveAdjustment(): void {
    this.adjustTimer = setInterval(() => {
      this.adjustSize()
    }, this.adjustConfig.adjustInterval)

    // 防止定时器阻止进程退出
    if (this.adjustTimer.unref) {
      this.adjustTimer.unref()
    }
  }

  /**
   * 停止自适应调整
   *
   * @private
   */
  private stopAdaptiveAdjustment(): void {
    if (this.adjustTimer) {
      clearInterval(this.adjustTimer)
      this.adjustTimer = undefined
    }
  }
}

/**
 * 全局自适应缓存实例
 *
 * 推荐用于生产环境,自动优化缓存大小。
 *
 * @example
 * ```typescript
 * // 使用全局自适应缓存
 * globalAdaptiveCache.set('theme-color', '#667eea')
 * const color = globalAdaptiveCache.get('theme-color')
 *
 * // 查看自适应统计
 * const stats = globalAdaptiveCache.getAdaptiveStats()
 * console.log(`当前缓存大小: ${stats.currentMaxSize}`)
 * ```
 */
export const globalAdaptiveCache = new AdaptiveColorCache({
  minSize: 30,
  maxSize: 150,
  hitRateLowThreshold: 0.4,
  hitRateHighThreshold: 0.8,
  adjustInterval: 30000,
  adjustStep: 15,
  defaultTTL: 0,
  cleanupInterval: 120000,
})

// 页面卸载时清理
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalAdaptiveCache.destroy()
  }, { once: true })
}
