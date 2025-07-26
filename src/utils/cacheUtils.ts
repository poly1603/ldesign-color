import type { CacheItem } from '../types'

/**
 * LRU (Least Recently Used) 缓存实现
 */
export class LRUCache<T = any> {
  private cache: Map<string, CacheItem<T>> = new Map()
  private maxSize: number
  private ttl: number // 生存时间（毫秒）

  constructor(maxSize: number = 100, ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.maxSize = maxSize
    this.ttl = ttl
  }

  /**
   * 获取缓存项
   */
  public get(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // 检查是否过期
    if (this.isExpired(item)) {
      this.cache.delete(key)
      return null
    }

    // 更新访问信息
    item.accessCount++
    item.lastAccess = Date.now()

    // 移到最后（LRU策略）
    this.cache.delete(key)
    this.cache.set(key, item)

    return item.value
  }

  /**
   * 设置缓存项
   */
  public set(key: string, value: T): void {
    const now = Date.now()

    // 如果已存在，更新值
    if (this.cache.has(key)) {
      const item = this.cache.get(key)!
      item.value = value
      item.lastAccess = now
      item.accessCount++

      // 移到最后
      this.cache.delete(key)
      this.cache.set(key, item)
      return
    }

    // 检查缓存大小限制
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed()
    }

    // 添加新项
    const item: CacheItem<T> = {
      value,
      timestamp: now,
      accessCount: 1,
      lastAccess: now,
    }

    this.cache.set(key, item)
  }

  /**
   * 删除缓存项
   */
  public delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 检查是否存在
   */
  public has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }

    if (this.isExpired(item)) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * 清空缓存
   */
  public clear(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   */
  public get size(): number {
    return this.cache.size
  }

  /**
   * 获取缓存统计信息
   */
  public getStats(): {
    size: number
    maxSize: number
    hitRate: number
    oldestItem: number
    newestItem: number
  } {
    const items = Array.from(this.cache.values())
    const totalAccess = items.reduce((sum, item) => sum + item.accessCount, 0)
    const totalHits = items.reduce((sum, item) => sum + (item.accessCount - 1), 0)

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccess > 0 ? totalHits / totalAccess : 0,
      oldestItem: items.length > 0 ? Math.min(...items.map(item => item.timestamp)) : 0,
      newestItem: items.length > 0 ? Math.max(...items.map(item => item.timestamp)) : 0,
    }
  }

  /**
   * 清理过期项
   */
  public cleanup(): number {
    let removedCount = 0

    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key)
        removedCount++
      }
    }

    return removedCount
  }

  /**
   * 检查项是否过期
   */
  private isExpired(item: CacheItem<T>): boolean {
    return Date.now() - item.timestamp > this.ttl
  }

  /**
   * 驱逐最少使用的项
   */
  private evictLeastRecentlyUsed(): void {
    let lruKey: string | null = null
    let lruTime = Infinity

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < lruTime) {
        lruTime = item.lastAccess
        lruKey = key
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
    }
  }

  /**
   * 获取所有键
   */
  public keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取所有值
   */
  public values(): T[] {
    return Array.from(this.cache.values()).map(item => item.value)
  }

  /**
   * 序列化缓存（用于持久化）
   */
  public serialize(): string {
    const data = Array.from(this.cache.entries())
    return JSON.stringify({
      maxSize: this.maxSize,
      ttl: this.ttl,
      data,
    })
  }

  /**
   * 反序列化缓存（用于恢复）
   */
  public static deserialize<T>(serialized: string): LRUCache<T> {
    try {
      const { maxSize, ttl, data } = JSON.parse(serialized)
      const cache = new LRUCache<T>(maxSize, ttl)

      for (const [key, item] of data) {
        // 只恢复未过期的项
        if (!cache.isExpired(item)) {
          cache.cache.set(key, item)
        }
      }

      return cache
    }
 catch (error) {
      console.error('Failed to deserialize cache:', error)
      return new LRUCache<T>()
    }
  }
}

/**
 * 内存缓存管理器
 */
export class MemoryCacheManager {
  private caches: Map<string, LRUCache> = new Map()
  private defaultConfig = {
    maxSize: 100,
    ttl: 5 * 60 * 1000, // 5分钟
  }

  /**
   * 获取或创建缓存实例
   */
  public getCache<T>(
    name: string,
    config?: { maxSize?: number, ttl?: number },
  ): LRUCache<T> {
    if (!this.caches.has(name)) {
      const { maxSize, ttl } = { ...this.defaultConfig, ...config }
      this.caches.set(name, new LRUCache<T>(maxSize, ttl))
    }
    return this.caches.get(name) as LRUCache<T>
  }

  /**
   * 删除缓存实例
   */
  public deleteCache(name: string): boolean {
    return this.caches.delete(name)
  }

  /**
   * 清空所有缓存
   */
  public clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear()
    }
  }

  /**
   * 清理所有缓存的过期项
   */
  public cleanupAll(): number {
    let totalRemoved = 0
    for (const cache of this.caches.values()) {
      totalRemoved += cache.cleanup()
    }
    return totalRemoved
  }

  /**
   * 获取所有缓存的统计信息
   */
  public getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats()
    }
    return stats
  }

  /**
   * 获取缓存实例列表
   */
  public getCacheNames(): string[] {
    return Array.from(this.caches.keys())
  }
}

/**
 * 全局缓存管理器实例
 */
export const globalCacheManager = new MemoryCacheManager()

/**
 * 缓存装饰器
 */
export function cached(
  cacheName: string = 'default',
  keyGenerator?: (...args: any[]) => string,
  ttl?: number,
) {
  return function (_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const cache = globalCacheManager.getCache(cacheName, { ttl })

    descriptor.value = function (...args: any[]) {
      // 生成缓存键
      const key = keyGenerator
        ? keyGenerator(...args)
        : `${propertyKey}_${JSON.stringify(args)}`

      // 尝试从缓存获取
      const cached = cache.get(key)
      if (cached !== null) {
        return cached
      }

      // 执行原方法并缓存结果
      const result = originalMethod.apply(this, args)

      // 如果是Promise，缓存resolved值
      if (result instanceof Promise) {
        return result.then((value) => {
          cache.set(key, value)
          return value
        })
      }

      // 直接缓存结果
      cache.set(key, result)
      return result
    }

    return descriptor
  }
}

/**
 * 生成缓存键的工具函数
 */
export class CacheKeyGenerator {
  /**
   * 为颜色生成缓存键
   */
  public static forColor(color: string, ...params: any[]): string {
    return `color_${color}_${params.join('_')}`
  }

  /**
   * 为语义化颜色生成缓存键
   */
  public static forSemanticColors(primaryColor: string): string {
    return `semantic_${primaryColor}`
  }

  /**
   * 为色阶生成缓存键
   */
  public static forPalette(
    color: string,
    isDark: boolean,
    format: string,
    steps?: number,
  ): string {
    return `palette_${color}_${isDark}_${format}_${steps || 'default'}`
  }

  /**
   * 为CSS变量生成缓存键
   */
  public static forCSSVariables(
    colors: Record<string, any>,
    prefix: string,
  ): string {
    const colorHash = this.hashObject(colors)
    return `css_${colorHash}_${prefix}`
  }

  /**
   * 对象哈希函数
   */
  private static hashObject(obj: any): string {
    return btoa(JSON.stringify(obj)).replace(/[^a-z0-9]/gi, '').substring(0, 16)
  }
}
