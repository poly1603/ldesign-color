/**
 * @ldesign/color - Advanced Cache Utilities
 *
 * Advanced caching with LRU/LFU strategies, persistence and prewarming.
 * Provides intelligent caching with automatic optimization and persistence.
 *
 * @module utils/advancedCache
 * @performance Reduces repeated calculations by up to 90%
 */

/**
 * Cache eviction strategy types
 * - LRU: Least Recently Used
 * - LFU: Least Frequently Used
 * - FIFO: First In First Out
 */
export type CacheStrategy = 'LRU' | 'LFU' | 'FIFO'

/**
 * Cache item with metadata for tracking usage
 */
interface CacheItem<T> {
  value: T
  frequency: number
  lastAccess: number
  createdAt: number
}

/**
 * Cache statistics for monitoring performance
 */
export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  size: number
  maxSize: number
  utilization: number
}

/**
 * Advanced Cache implementation with multiple strategies
 */
export class AdvancedColorCache<T = any> {
  private cache: Map<string, CacheItem<T>>
  private maxSize: number
  private strategy: CacheStrategy
  private stats: { hits: number, misses: number }
  private persistKey?: string
  private persistTimer: number | null = null
  private isDirty = false
  private persistDelay = 5000 // 5 second delay for persistence (debouncing)
  // private prewarmed: boolean = false; // Kept for future use

  constructor(maxSize = 100, strategy: CacheStrategy = 'LRU', persistKey?: string) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.strategy = strategy
    this.stats = { hits: 0, misses: 0 }
    this.persistKey = persistKey

    // Try to restore cache from persistent storage
    if (persistKey) {
      this.restore()
    }
  }

  /**
   * Get a value from the cache
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key)
    if (item) {
      this.stats.hits++
      item.frequency++
      item.lastAccess = Date.now()

      // LRU: 移动到末尾
      if (this.strategy === 'LRU') {
        this.cache.delete(key)
        this.cache.set(key, item)
      }

      return item.value
    }
    this.stats.misses++
    return undefined
  }

  /**
   * Set a value in the cache
   */
  set(key: string, value: T): void {
    const now = Date.now()

    // If cache is full, evict items based on strategy
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evict()
    }

    const existing = this.cache.get(key)
    const item: CacheItem<T> = {
      value,
      frequency: existing ? existing.frequency + 1 : 1,
      lastAccess: now,
      createdAt: existing ? existing.createdAt : now,
    }

    this.cache.set(key, item)

    // Mark as dirty and schedule debounced persistence
    if (this.persistKey) {
      this.isDirty = true
      this.schedulePersist()
    }
  }

  /**
   * Schedule debounced persistence to avoid frequent writes
   */
  private schedulePersist(): void {
    if (this.persistTimer !== null) {
      clearTimeout(this.persistTimer)
    }

    // Use global setTimeout, avoiding direct window.setTimeout
    this.persistTimer = (typeof window !== 'undefined' ? window.setTimeout : setTimeout)(() => {
      if (this.isDirty) {
        // Use requestIdleCallback when available, with error handling
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            try {
              this.persist()
            }
            catch (error) {
              console.warn('Cache persist failed:', error)
            }
          }, { timeout: 1000 }) // Add timeout limit
        }
        else {
          try {
            this.persist()
          }
          catch (error) {
            console.warn('Cache persist failed:', error)
          }
        }
        this.isDirty = false
      }
      this.persistTimer = null
    }, this.persistDelay) as any
  }

  /**
   * Evict cache items based on configured strategy
   */
  private evict(): void {
    let keyToRemove: string | undefined

    switch (this.strategy) {
      case 'LFU': { // Least Frequently Used
        let minFreq = Infinity
        let oldestTime = Infinity

        for (const [key, item] of this.cache.entries()) {
          if (item.frequency < minFreq
            || (item.frequency === minFreq && item.lastAccess < oldestTime)) {
            minFreq = item.frequency
            oldestTime = item.lastAccess
            keyToRemove = key
          }
        }
        break
      }

      case 'FIFO': { // First In First Out
        let oldestCreate = Infinity

        for (const [key, item] of this.cache.entries()) {
          if (item.createdAt < oldestCreate) {
            oldestCreate = item.createdAt
            keyToRemove = key
          }
        }
        break
      }

      case 'LRU': // Least Recently Used
      default:
        // Map maintains insertion order, first entry is oldest
        keyToRemove = this.cache.keys().next().value
        break
    }

    if (keyToRemove) {
      this.cache.delete(keyToRemove)
    }
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0 }
  }

  /**
   * Get the current size of the cache
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100,
    }
  }

  /**
   * Prewarm cache with initial data
   *
   * Useful for loading frequently used values at startup.
   *
   * @param data - Array of key-value pairs to preload
   */
  prewarm(data: Array<{ key: string, value: T }>): void {
    for (const { key, value } of data) {
      this.set(key, value)
    }
    // this.prewarmed = true;
  }

  /**
   * Persist cache to localStorage
   *
   * Saves most frequently used items to localStorage for restoration
   * on next page load.
   */
  persist(): void {
    if (!this.persistKey || typeof window === 'undefined')
      return

    try {
      // Limit persistence size - save only top 20 most frequent items
      const topItems = this.getMostFrequent(20) // Reduced from 50 to 20
      const data = topItems.map(({ key }) => {
        const item = this.cache.get(key)!
        return {
          key,
          value: item.value,
          frequency: item.frequency,
          lastAccess: item.lastAccess,
          createdAt: item.createdAt,
        }
      })

      const serialized = JSON.stringify({
        data,
        stats: this.stats,
        strategy: this.strategy,
        timestamp: Date.now(),
      })

      // Check data size to avoid exceeding localStorage limit
      if (serialized.length > 512 * 1024) { // 512KB limit (reduced from 1MB)
        console.warn('Cache data too large, skipping persist')
        return
      }

      localStorage.setItem(this.persistKey, serialized)
    }
    catch (error) {
      // Silently handle errors to avoid disrupting main flow
      // eslint-disable-next-line node/prefer-global/process
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn('Failed to persist cache:', error)
      }
    }
  }

  /**
   * Restore cache from localStorage
   *
   * Loads previously persisted cache data from localStorage.
   * Cached data expires after 2 hours.
   */
  restore(): void {
    if (!this.persistKey || typeof window === 'undefined')
      return

    try {
      const stored = localStorage.getItem(this.persistKey)
      if (!stored)
        return

      const { data, stats, timestamp } = JSON.parse(stored)

      // Check if cache has expired (2 hours) - reduced from 24 hours
      if (Date.now() - timestamp > 2 * 60 * 60 * 1000) {
        localStorage.removeItem(this.persistKey)
        return
      }

      // Restore cache data
      this.cache.clear()
      for (const { key, value, frequency, lastAccess, createdAt } of data) {
        this.cache.set(key, {
          value,
          frequency,
          lastAccess,
          createdAt,
        })
      }

      this.stats = stats
      // this.prewarmed = true;
    }
    catch (error) {
      console.error('Failed to restore cache:', error)
    }
  }

  /**
   * Get most frequently used cache items
   *
   * Returns the N most frequently accessed items sorted by frequency.
   *
   * @param count - Number of items to return (default: 10)
   * @returns Array of most frequent items with their keys and values
   */
  getMostFrequent(count = 10): Array<{ key: string, value: T, frequency: number }> {
    return Array.from(this.cache.entries())
      .sort((a, b) => b[1].frequency - a[1].frequency)
      .slice(0, count)
      .map(([key, item]) => ({
        key,
        value: item.value,
        frequency: item.frequency,
      }))
  }

  /**
   * Optimize cache size by removing low-frequency items
   *
   * Removes items with frequency below 50% of average frequency.
   * Useful for cleaning up rarely used items.
   */
  optimize(): void {
    // Remove items with frequency below 50% of average
    const frequencies = Array.from(this.cache.values()).map(item => item.frequency)
    const avgFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length
    const threshold = avgFrequency * 0.5

    for (const [key, item] of this.cache.entries()) {
      if (item.frequency < threshold) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Set cache eviction strategy
   *
   * @param strategy - Cache strategy to use (LRU, LFU, or FIFO)
   */
  setStrategy(strategy: CacheStrategy): void {
    this.strategy = strategy
  }

  /**
   * Get cache snapshot
   *
   * Returns all cache entries as an array.
   *
   * @returns Array of key-value pairs
   */
  snapshot(): Array<{ key: string, value: T }> {
    return Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      value: item.value,
    }))
  }

  /**
   * Clean up all resources and prevent memory leaks
   *
   * Clears persistence timer, performs final persistence if needed,
   * and clears all cache data.
   */
  destroy(): void {
    // Clear persistence timer
    if (this.persistTimer !== null) {
      clearTimeout(this.persistTimer)
      this.persistTimer = null
    }

    // Final persistence before cleanup
    if (this.isDirty && this.persistKey) {
      this.persist()
      this.isDirty = false
    }

    // Clear cache
    this.clear()
  }
}

/**
 * Global cache instance with LFU strategy for shared caching
 *
 * Size reduced to 100 to avoid high memory usage while maintaining
 * good performance for common operations.
 */
export const globalColorCache = new AdvancedColorCache(100, 'LFU', 'ldesign-color-cache') // Reduced from 500 to 100

// Add global cleanup handlers
if (typeof window !== 'undefined') {
  // Clean up cache on page unload
  window.addEventListener('beforeunload', () => {
    globalColorCache.destroy()
  }, { once: true })

  // Optimize cache when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      globalColorCache.optimize()
    }
  })
}

/**
 * Cache decorator for memoizing function results with advanced caching
 */
// Use WeakMap to store function caches, allowing automatic garbage collection
const functionCaches = new WeakMap<Function, AdvancedColorCache<any>>()

/**
 * Memoize function results with advanced caching
 *
 * Creates a memoized version of a function that caches results based on arguments.
 * Uses WeakMap for automatic memory management.
 *
 * @param fn - Function to memoize
 * @param options - Memoization options
 * @returns Memoized function with clearCache() and destroyCache() methods
 * @performance Can reduce function execution time by 90%+ for expensive operations
 * @example
 * ```ts
 * const expensiveFn = memoize((x: number) => {
 *   // ... expensive calculation ...
 *   return result;
 * }, { maxSize: 50, strategy: 'LRU' });
 *
 * // Later, clear cache if needed:
 * expensiveFn.clearCache();
 * ```
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    maxSize?: number
    strategy?: CacheStrategy
    getKey?: (...args: Parameters<T>) => string
  },
): T {
  // Reuse existing cache if available
  let cache = functionCaches.get(fn) as AdvancedColorCache<ReturnType<T>>
  if (!cache) {
    cache = new AdvancedColorCache<ReturnType<T>>(
      options?.maxSize || 20, // Further reduced default size from 50 to 20
      options?.strategy || 'LRU',
    )
    functionCaches.set(fn, cache)
  }

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = options?.getKey ? options.getKey(...args) : JSON.stringify(args)

    const cached = cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T;

  // Add cleanup methods
  (memoized as any).clearCache = () => {
    cache.clear()
  };

  (memoized as any).destroyCache = () => {
    cache.destroy()
    functionCaches.delete(fn)
  }

  return memoized
}

/**
 * Create a cache key from multiple values
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
