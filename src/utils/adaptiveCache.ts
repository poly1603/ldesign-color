/**
 * @ldesign/color - Adaptive Cache System
 *
 * Intelligent caching system with automatic size adjustment based on usage patterns.
 * Features L1/L2 tiered caching, smart prewarming, and adaptive eviction strategies.
 *
 * @module utils/adaptiveCache
 * @performance Automatically optimizes cache size based on hit rate and usage patterns
 */

import { AdvancedColorCache } from './advancedCache'

/**
 * Cache tier levels
 */
export type CacheTier = 'L1' | 'L2'

/**
 * Adaptive cache configuration
 */
export interface AdaptiveCacheConfig {
  /** Initial L1 cache size */
  l1Size?: number
  /** Initial L2 cache size */
  l2Size?: number
  /** Minimum cache size */
  minSize?: number
  /** Maximum cache size */
  maxSize?: number
  /** Target hit rate (0-1) */
  targetHitRate?: number
  /** Adjustment interval in ms */
  adjustInterval?: number
  /** Enable auto-prewarming */
  autoPrewarm?: boolean
  /** Persistence key */
  persistKey?: string
}

/**
 * Adaptive cache statistics
 */
export interface AdaptiveCacheStats {
  l1Stats: {
    size: number
    hits: number
    misses: number
    hitRate: number
  }
  l2Stats: {
    size: number
    hits: number
    misses: number
    hitRate: number
  }
  totalHits: number
  totalMisses: number
  overallHitRate: number
  lastAdjustment: number
  adjustmentCount: number
}

/**
 * Adaptive cache with L1/L2 tiers and automatic size adjustment
 *
 * L1: Fast, small cache for hot items
 * L2: Larger cache for warm items
 *
 * @example
 * ```ts
 * const cache = new AdaptiveCache({
 *   l1Size: 50,
 *   l2Size: 200,
 *   targetHitRate: 0.85
 * });
 *
 * cache.set('key', value);
 * const value = cache.get('key');
 *
 * // Auto-adjusts size based on usage
 * ```
 */
export class AdaptiveCache<T = any> {
  private l1Cache: AdvancedColorCache<T>
  private l2Cache: AdvancedColorCache<T>

  private config: Required<AdaptiveCacheConfig>
  private adjustmentTimer: number | null = null
  private lastAdjustmentTime = 0
  private adjustmentCount = 0

  constructor(config: AdaptiveCacheConfig = {}) {
    this.config = {
      l1Size: config.l1Size ?? 50,
      l2Size: config.l2Size ?? 200,
      minSize: config.minSize ?? 20,
      maxSize: config.maxSize ?? 500,
      targetHitRate: config.targetHitRate ?? 0.85,
      adjustInterval: config.adjustInterval ?? 60000, // 1 minute
      autoPrewarm: config.autoPrewarm ?? true,
      persistKey: config.persistKey ?? 'ldesign-adaptive-cache',
    }

    // Create L1 cache (LRU for recency)
    this.l1Cache = new AdvancedColorCache<T>(
      this.config.l1Size,
      'LRU',
      config.persistKey ? `${config.persistKey}-l1` : undefined,
    )

    // Create L2 cache (LFU for frequency)
    this.l2Cache = new AdvancedColorCache<T>(
      this.config.l2Size,
      'LFU',
      config.persistKey ? `${config.persistKey}-l2` : undefined,
    )

    // Start automatic adjustment
    this.startAutoAdjustment()

    // Prewarm if enabled
    if (this.config.autoPrewarm) {
      this.prewarmFromL2()
    }
  }

  /**
   * Get value from cache (checks L1 then L2)
   *
   * @param key - Cache key
   * @returns Cached value or undefined
   */
  get(key: string): T | undefined {
    // Check L1 first (fast)
    let value = this.l1Cache.get(key)
    if (value !== undefined) {
      return value
    }

    // Check L2 (slower but larger)
    value = this.l2Cache.get(key)
    if (value !== undefined) {
      // Promote to L1 if accessed
      this.promoteToL1(key, value)
      return value
    }

    return undefined
  }

  /**
   * Set value in cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   */
  set(key: string, value: T): void {
    // Always set in L1 for recent access
    this.l1Cache.set(key, value)

    // Also set in L2 for persistence
    this.l2Cache.set(key, value)
  }

  /**
   * Promote item from L2 to L1
   */
  private promoteToL1(key: string, value: T): void {
    this.l1Cache.set(key, value)
  }

  /**
   * Check if key exists in either cache
   */
  has(key: string): boolean {
    return this.l1Cache.has(key) || this.l2Cache.has(key)
  }

  /**
   * Delete key from both caches
   */
  delete(key: string): boolean {
    const l1Deleted = this.l1Cache.delete(key)
    const l2Deleted = this.l2Cache.delete(key)
    return l1Deleted || l2Deleted
  }

  /**
   * Clear both caches
   */
  clear(): void {
    this.l1Cache.clear()
    this.l2Cache.clear()
  }

  /**
   * Get adaptive cache statistics
   */
  getStats(): AdaptiveCacheStats {
    const l1Stats = this.l1Cache.getStats()
    const l2Stats = this.l2Cache.getStats()

    const totalHits = l1Stats.hits + l2Stats.hits
    const totalMisses = l1Stats.misses + l2Stats.misses
    const total = totalHits + totalMisses

    return {
      l1Stats: {
        size: l1Stats.size,
        hits: l1Stats.hits,
        misses: l1Stats.misses,
        hitRate: l1Stats.hitRate,
      },
      l2Stats: {
        size: l2Stats.size,
        hits: l2Stats.hits,
        misses: l2Stats.misses,
        hitRate: l2Stats.hitRate,
      },
      totalHits,
      totalMisses,
      overallHitRate: total > 0 ? totalHits / total : 0,
      lastAdjustment: this.lastAdjustmentTime,
      adjustmentCount: this.adjustmentCount,
    }
  }

  /**
   * Start automatic size adjustment
   */
  private startAutoAdjustment(): void {
    if (this.adjustmentTimer !== null)
      return

    this.adjustmentTimer = (typeof window !== 'undefined' ? window.setInterval : setInterval)(() => {
      this.adjustCacheSizes()
    }, this.config.adjustInterval) as any
  }

  /**
   * Stop automatic size adjustment
   */
  private stopAutoAdjustment(): void {
    if (this.adjustmentTimer !== null) {
      clearInterval(this.adjustmentTimer)
      this.adjustmentTimer = null
    }
  }

  /**
   * Automatically adjust cache sizes based on hit rate
   */
  private adjustCacheSizes(): void {
    const stats = this.getStats()
    const hitRate = stats.overallHitRate
    const targetRate = this.config.targetHitRate

    // If hit rate is below target, increase cache size
    if (hitRate < targetRate - 0.05) {
      this.increaseCacheSize()
    }
    // If hit rate is above target and utilization is low, decrease size
    else if (hitRate > targetRate + 0.05 && stats.l1Stats.size < this.config.l1Size * 0.5) {
      this.decreaseCacheSize()
    }

    this.lastAdjustmentTime = Date.now()
    this.adjustmentCount++
  }

  /**
   * Increase cache sizes
   */
  private increaseCacheSize(): void {
    const currentL1 = this.config.l1Size
    const currentL2 = this.config.l2Size

    // Increase by 20%, but not beyond max
    const newL1 = Math.min(
      Math.floor(currentL1 * 1.2),
      this.config.maxSize * 0.2, // L1 is 20% of max
    )
    const newL2 = Math.min(
      Math.floor(currentL2 * 1.2),
      this.config.maxSize,
    )

    if (newL1 !== currentL1 || newL2 !== currentL2) {
      this.resizeCaches(newL1, newL2)
    }
  }

  /**
   * Decrease cache sizes
   */
  private decreaseCacheSize(): void {
    const currentL1 = this.config.l1Size
    const currentL2 = this.config.l2Size

    // Decrease by 20%, but not below min
    const newL1 = Math.max(
      Math.floor(currentL1 * 0.8),
      this.config.minSize,
    )
    const newL2 = Math.max(
      Math.floor(currentL2 * 0.8),
      this.config.minSize * 2,
    )

    if (newL1 !== currentL1 || newL2 !== currentL2) {
      this.resizeCaches(newL1, newL2)
    }
  }

  /**
   * Resize both caches
   */
  private resizeCaches(newL1Size: number, newL2Size: number): void {
    // Store most frequent items before resizing
    const l1Top = this.l1Cache.getMostFrequent(newL1Size)
    const l2Top = this.l2Cache.getMostFrequent(newL2Size)

    // Update config
    this.config.l1Size = newL1Size
    this.config.l2Size = newL2Size

    // Recreate caches
    this.l1Cache = new AdvancedColorCache<T>(newL1Size, 'LRU')
    this.l2Cache = new AdvancedColorCache<T>(newL2Size, 'LFU')

    // Restore top items
    l1Top.forEach(({ key, value }) => this.l1Cache.set(key, value))
    l2Top.forEach(({ key, value }) => this.l2Cache.set(key, value))
  }

  /**
   * Prewarm L1 cache from L2's most frequent items
   */
  private prewarmFromL2(): void {
    const topItems = this.l2Cache.getMostFrequent(
      Math.floor(this.config.l1Size * 0.5),
    )

    this.l1Cache.prewarm(topItems.map(item => ({
      key: item.key,
      value: item.value,
    })))
  }

  /**
   * Manually prewarm cache with data
   *
   * @param data - Data to prewarm with
   * @param tier - Which tier to prewarm
   */
  prewarm(data: Array<{ key: string, value: T }>, tier: CacheTier = 'L1'): void {
    if (tier === 'L1') {
      this.l1Cache.prewarm(data)
    }
    else {
      this.l2Cache.prewarm(data)
    }
  }

  /**
   * Optimize both caches
   */
  optimize(): void {
    this.l1Cache.optimize()
    this.l2Cache.optimize()

    // Promote frequent L2 items to L1
    const topL2 = this.l2Cache.getMostFrequent(10)
    topL2.forEach(({ key, value }) => {
      if (!this.l1Cache.has(key)) {
        this.l1Cache.set(key, value)
      }
    })
  }

  /**
   * Set target hit rate
   *
   * @param rate - Target hit rate (0-1)
   */
  setTargetHitRate(rate: number): void {
    this.config.targetHitRate = Math.max(0, Math.min(1, rate))
  }

  /**
   * Get cache size recommendations based on usage
   */
  getRecommendedSizes(): { l1: number, l2: number } {
    const stats = this.getStats()
    const hitRate = stats.overallHitRate
    const targetRate = this.config.targetHitRate

    let l1Multiplier = 1
    let l2Multiplier = 1

    if (hitRate < targetRate - 0.1) {
      // Much below target - increase significantly
      l1Multiplier = 1.5
      l2Multiplier = 1.5
    }
    else if (hitRate < targetRate - 0.05) {
      // Slightly below target - increase moderately
      l1Multiplier = 1.2
      l2Multiplier = 1.2
    }
    else if (hitRate > targetRate + 0.1) {
      // Much above target - decrease if utilization is low
      const l1Util = stats.l1Stats.size / this.config.l1Size
      const l2Util = stats.l2Stats.size / this.config.l2Size

      if (l1Util < 0.5)
        l1Multiplier = 0.8
      if (l2Util < 0.5)
        l2Multiplier = 0.8
    }

    return {
      l1: Math.max(
        this.config.minSize,
        Math.min(
          Math.floor(this.config.l1Size * l1Multiplier),
          this.config.maxSize * 0.2,
        ),
      ),
      l2: Math.max(
        this.config.minSize * 2,
        Math.min(
          Math.floor(this.config.l2Size * l2Multiplier),
          this.config.maxSize,
        ),
      ),
    }
  }

  /**
   * Apply recommended sizes
   */
  applyRecommendedSizes(): void {
    const recommended = this.getRecommendedSizes()
    this.resizeCaches(recommended.l1, recommended.l2)
  }

  /**
   * Persist both caches
   */
  persist(): void {
    this.l1Cache.persist()
    this.l2Cache.persist()
  }

  /**
   * Destroy cache and cleanup
   */
  destroy(): void {
    this.stopAutoAdjustment()
    this.l1Cache.destroy()
    this.l2Cache.destroy()
  }
}

/**
 * Global adaptive cache instance
 */
export const globalAdaptiveCache = new AdaptiveCache({
  l1Size: 50,
  l2Size: 200,
  targetHitRate: 0.85,
  autoPrewarm: true,
  persistKey: 'ldesign-adaptive-cache',
})

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalAdaptiveCache.destroy()
  }, { once: true })
}

/**
 * Create adaptive cache with custom configuration
 *
 * @param config - Cache configuration
 * @returns New adaptive cache instance
 * @example
 * ```ts
 * const cache = createAdaptiveCache({
 *   l1Size: 30,
 *   l2Size: 150,
 *   targetHitRate: 0.90
 * });
 * ```
 */
export function createAdaptiveCache<T>(config?: AdaptiveCacheConfig): AdaptiveCache<T> {
  return new AdaptiveCache<T>(config)
}
