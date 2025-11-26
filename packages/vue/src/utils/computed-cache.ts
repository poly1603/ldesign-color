/**
 * @ldesign/color-vue - Computed Cache Utilities
 * 
 * 为 computed 属性添加缓存层,减少重复计算
 */

import { computed, customRef, type ComputedRef, type Ref } from 'vue'

/**
 * 缓存条目
 */
interface CacheEntry<T> {
  value: T
  timestamp: number
  hitCount: number
}

/**
 * 缓存选项
 */
export interface CachedComputedOptions {
  /** 缓存过期时间(ms),0 表示永不过期 */
  ttl?: number
  /** 最大缓存条目数 */
  maxSize?: number
  /** 是否启用统计信息 */
  enableStats?: boolean
}

/**
 * 缓存统计信息
 */
export interface CacheStats {
  hits: number
  misses: number
  size: number
  hitRate: number
}

/**
 * 创建带缓存的 computed 属性
 * 
 * @param getter - 计算函数
 * @param keyFn - 缓存键函数
 * @param options - 缓存选项
 * @returns 带缓存的 computed
 * 
 * @example
 * ```ts
 * const color = ref('#ff0000')
 * 
 * // 缓存颜色转换结果
 * const rgbColor = cachedComputed(
 *   () => hexToRgb(color.value),
 *   () => color.value, // 使用颜色值作为缓存键
 *   { ttl: 5000 }
 * )
 * ```
 */
export function cachedComputed<T>(
  getter: () => T,
  keyFn: () => string | number,
  options: CachedComputedOptions = {},
): ComputedRef<T> & { getStats: () => CacheStats; clearCache: () => void } {
  const { ttl = 0, maxSize = 100, enableStats = false } = options

  const cache = new Map<string | number, CacheEntry<T>>()
  let hits = 0
  let misses = 0

  const computedValue = computed(() => {
    const key = keyFn()
    const now = Date.now()

    // 检查缓存
    const cached = cache.get(key)
    if (cached) {
      // 检查是否过期
      if (ttl === 0 || now - cached.timestamp < ttl) {
        cached.hitCount++
        if (enableStats) hits++
        return cached.value
      }
      // 过期,删除缓存
      cache.delete(key)
    }

    // 计算新值
    if (enableStats) misses++
    const value = getter()

    // 添加到缓存
    cache.set(key, {
      value,
      timestamp: now,
      hitCount: 0,
    })

    // 限制缓存大小(LRU)
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    return value
  })

  // 添加统计和清理方法
  const result = computedValue as any
  
  result.getStats = (): CacheStats => ({
    hits,
    misses,
    size: cache.size,
    hitRate: hits + misses > 0 ? hits / (hits + misses) : 0,
  })

  result.clearCache = () => {
    cache.clear()
    hits = 0
    misses = 0
  }

  return result
}

/**
 * 创建带防抖的 computed 属性
 * 
 * @param getter - 计算函数
 * @param delay - 防抖延迟(ms)
 * @returns 防抖 computed
 * 
 * @example
 * ```ts
 * const searchQuery = ref('')
 * 
 * // 防抖搜索,避免频繁计算
 * const searchResults = debouncedComputed(
 *   () => expensiveSearch(searchQuery.value),
 *   300
 * )
 * ```
 */
export function debouncedComputed<T>(
  getter: () => T,
  delay: number,
): ComputedRef<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let currentValue: T = getter()

  const trigger = customRef<T>((track, triggerUpdate) => {
    return {
      get() {
        track()
        return currentValue
      },
      set(newValue: T) {
        currentValue = newValue
        triggerUpdate()
      },
    }
  })

  const computedValue = computed(() => {
    const value = getter()

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      trigger.value = value
      timeout = null
    }, delay)

    return trigger.value
  })

  return computedValue
}

/**
 * 创建带节流的 computed 属性
 * 
 * @param getter - 计算函数
 * @param delay - 节流延迟(ms)
 * @returns 节流 computed
 * 
 * @example
 * ```ts
 * const scrollY = ref(0)
 * 
 * // 节流计算,限制更新频率
 * const scrollProgress = throttledComputed(
 *   () => calculateProgress(scrollY.value),
 *   100
 * )
 * ```
 */
export function throttledComputed<T>(
  getter: () => T,
  delay: number,
): ComputedRef<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0
  let currentValue: T = getter()

  const trigger = customRef<T>((track, triggerUpdate) => {
    return {
      get() {
        track()
        return currentValue
      },
      set(newValue: T) {
        currentValue = newValue
        triggerUpdate()
      },
    }
  })

  const computedValue = computed(() => {
    const value = getter()
    const now = Date.now()
    const remaining = delay - (now - previous)

    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      trigger.value = value
    }
    else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        trigger.value = value
      }, remaining)
    }

    return trigger.value
  })

  return computedValue
}

/**
 * 创建带记忆化的 computed 属性
 * 支持多参数缓存
 * 
 * @param getter - 计算函数
 * @param deps - 依赖项数组
 * @param options - 缓存选项
 * @returns 记忆化 computed
 * 
 * @example
 * ```ts
 * const color1 = ref('#ff0000')
 * const color2 = ref('#00ff00')
 * 
 * // 记忆化混合计算
 * const mixedColor = memoizedComputed(
 *   () => mixColors(color1.value, color2.value),
 *   [color1, color2],
 *   { maxSize: 50 }
 * )
 * ```
 */
export function memoizedComputed<T>(
  getter: () => T,
  deps: Ref<any>[],
  options: CachedComputedOptions = {},
): ComputedRef<T> & { getStats: () => CacheStats; clearCache: () => void } {
  return cachedComputed(
    getter,
    () => deps.map(dep => JSON.stringify(dep.value)).join('|'),
    options,
  )
}

/**
 * 创建懒加载 computed 属性
 * 只在首次访问时计算
 * 
 * @param getter - 计算函数
 * @returns 懒加载 computed
 * 
 * @example
 * ```ts
 * // 昂贵的计算,只在需要时执行
 * const expensiveResult = lazyComputed(() => {
 *   return heavyComputation()
 * })
 * 
 * // 只有在访问时才会计算
 * console.log(expensiveResult.value)
 * ```
 */
export function lazyComputed<T>(getter: () => T): ComputedRef<T> {
  let isComputed = false
  let value: T

  return computed(() => {
    if (!isComputed) {
      value = getter()
      isComputed = true
    }
    return value
  }) as ComputedRef<T>
}

/**
 * 批量缓存管理器
 * 用于统一管理多个缓存
 */
export class CacheManager {
  private caches = new Map<string, any>()

  /**
   * 注册缓存
   */
  register(name: string, cache: any): void {
    this.caches.set(name, cache)
  }

  /**
   * 获取所有统计信息
   */
  getAllStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {}
    
    for (const [name, cache] of this.caches) {
      if (typeof cache.getStats === 'function') {
        stats[name] = cache.getStats()
      }
    }
    
    return stats
  }

  /**
   * 清除所有缓存
   */
  clearAll(): void {
    for (const cache of this.caches.values()) {
      if (typeof cache.clearCache === 'function') {
        cache.clearCache()
      }
    }
  }

  /**
   * 清除指定缓存
   */
  clear(name: string): void {
    const cache = this.caches.get(name)
    if (cache && typeof cache.clearCache === 'function') {
      cache.clearCache()
    }
  }

  /**
   * 移除缓存
   */
  unregister(name: string): void {
    this.caches.delete(name)
  }
}

/**
 * 全局缓存管理器实例
 */
export const globalCacheManager = new CacheManager()