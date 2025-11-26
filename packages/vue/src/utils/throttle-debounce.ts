/**
 * @ldesign/color-vue - Throttle & Debounce Utilities
 * 
 * 防抖和节流工具函数,用于优化Vue响应式性能
 */

import type { Ref, WatchSource, WatchCallback, WatchOptions } from 'vue'
import { ref, watch, customRef } from 'vue'

/**
 * 防抖函数
 * 
 * @param func - 要防抖的函数
 * @param wait - 等待时间(ms)
 * @param immediate - 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): T & { cancel: () => void; flush: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: any[] | null = null
  let lastThis: any = null

  function debounced(this: any, ...args: any[]) {
    lastArgs = args
    lastThis = this

    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(lastThis, lastArgs!)
        lastArgs = null
        lastThis = null
      }
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(this, args)
    }
  }

  // 取消防抖
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
      lastArgs = null
      lastThis = null
    }
  }

  // 立即执行
  debounced.flush = () => {
    if (timeout && lastArgs) {
      func.apply(lastThis, lastArgs)
      debounced.cancel()
    }
  }

  return debounced as T & { cancel: () => void; flush: () => void }
}

/**
 * 节流函数
 * 
 * @param func - 要节流的函数
 * @param wait - 等待时间(ms)
 * @param options - 节流选项
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {},
): T & { cancel: () => void; flush: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0
  let lastArgs: any[] | null = null
  let lastThis: any = null

  const { leading = true, trailing = true } = options

  function throttled(this: any, ...args: any[]) {
    const now = Date.now()
    
    if (!previous && !leading) {
      previous = now
    }

    const remaining = wait - (now - previous)
    lastArgs = args
    lastThis = this

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
      lastArgs = null
      lastThis = null
    }
    else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0
        timeout = null
        func.apply(lastThis, lastArgs!)
        lastArgs = null
        lastThis = null
      }, remaining)
    }
  }

  // 取消节流
  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    previous = 0
    lastArgs = null
    lastThis = null
  }

  // 立即执行
  throttled.flush = () => {
    if (timeout && lastArgs) {
      func.apply(lastThis, lastArgs)
      throttled.cancel()
    }
  }

  return throttled as T & { cancel: () => void; flush: () => void }
}

/**
 * 创建防抖ref
 * 
 * @param value - 初始值
 * @param delay - 防抖延迟(ms)
 * @returns 防抖ref
 * 
 * @example
 * ```ts
 * const debouncedColor = useDebouncedRef('#ff0000', 300)
 * 
 * // 快速变更只会在300ms后触发一次更新
 * debouncedColor.value = '#00ff00'
 * debouncedColor.value = '#0000ff'
 * ```
 */
export function useDebouncedRef<T>(value: T, delay: number): Ref<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        if (timeout) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
          value = newValue
          trigger()
          timeout = null
        }, delay)
      },
    }
  })
}

/**
 * 创建节流ref
 * 
 * @param value - 初始值
 * @param delay - 节流延迟(ms)
 * @returns 节流ref
 * 
 * @example
 * ```ts
 * const throttledColor = useThrottledRef('#ff0000', 100)
 * 
 * // 在100ms内只会触发一次更新
 * throttledColor.value = '#00ff00'
 * throttledColor.value = '#0000ff'
 * ```
 */
export function useThrottledRef<T>(value: T, delay: number): Ref<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  return customRef<T>((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        const now = Date.now()
        const remaining = delay - (now - previous)

        if (remaining <= 0 || remaining > delay) {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }
          previous = now
          value = newValue
          trigger()
        }
        else if (!timeout) {
          timeout = setTimeout(() => {
            previous = Date.now()
            timeout = null
            value = newValue
            trigger()
          }, remaining)
        }
      },
    }
  })
}

/**
 * 防抖watch
 * 
 * @param source - watch源
 * @param callback - 回调函数
 * @param options - watch选项和防抖延迟
 * @returns 停止函数
 * 
 * @example
 * ```ts
 * const color = ref('#ff0000')
 * 
 * debouncedWatch(
 *   color,
 *   (newColor) => {
 *     console.log('Color changed:', newColor)
 *   },
 *   { delay: 300 }
 * )
 * ```
 */
export function debouncedWatch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options: WatchOptions & { delay: number } = { delay: 300 },
): () => void {
  const { delay, ...watchOptions } = options
  
  const debouncedCallback = debounce(callback as any, delay)

  const stop = watch(source, debouncedCallback as any, watchOptions)

  // 返回一个组合的停止函数
  return () => {
    debouncedCallback.cancel()
    stop()
  }
}

/**
 * 节流watch
 * 
 * @param source - watch源
 * @param callback - 回调函数
 * @param options - watch选项和节流延迟
 * @returns 停止函数
 * 
 * @example
 * ```ts
 * const color = ref('#ff0000')
 * 
 * throttledWatch(
 *   color,
 *   (newColor) => {
 *     console.log('Color changed:', newColor)
 *   },
 *   { delay: 100 }
 * )
 * ```
 */
export function throttledWatch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options: WatchOptions & { delay: number; leading?: boolean; trailing?: boolean } = { delay: 100 },
): () => void {
  const { delay, leading, trailing, ...watchOptions } = options
  
  const throttledCallback = throttle(callback as any, delay, { leading, trailing })

  const stop = watch(source, throttledCallback as any, watchOptions)

  // 返回一个组合的停止函数
  return () => {
    throttledCallback.cancel()
    stop()
  }
}

/**
 * 批量执行函数
 * 使用requestAnimationFrame确保在下一帧执行
 * 
 * @param func - 要批量执行的函数
 * @returns 批量执行函数
 * 
 * @example
 * ```ts
 * const batchUpdate = batchRAF(() => {
 *   // 批量更新DOM
 *   updateCSS()
 * })
 * 
 * // 多次调用只会在下一帧执行一次
 * batchUpdate()
 * batchUpdate()
 * batchUpdate()
 * ```
 */
export function batchRAF<T extends (...args: any[]) => any>(
  func: T,
): T & { cancel: () => void } {
  let rafId: number | null = null
  let pending = false

  function batched(this: any, ...args: any[]) {
    if (pending) {
      return
    }

    pending = true

    rafId = requestAnimationFrame(() => {
      pending = false
      rafId = null
      func.apply(this, args)
    })
  }

  batched.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
      pending = false
    }
  }

  return batched as T & { cancel: () => void }
}

/**
 * 使用防抖ref并自动同步到目标ref
 * 
 * @param target - 目标ref
 * @param delay - 防抖延迟
 * @returns 防抖ref
 * 
 * @example
 * ```ts
 * const color = ref('#ff0000')
 * const debouncedColor = useDebouncedRefSync(color, 300)
 * 
 * // 更新防抖ref会在300ms后同步到color
 * debouncedColor.value = '#0000ff'
 * ```
 */
export function useDebouncedRefSync<T>(target: Ref<T>, delay: number): Ref<T> {
  const debounced = useDebouncedRef(target.value, delay)

  watch(debounced, (newValue) => {
    target.value = newValue
  })

  return debounced
}

/**
 * 使用节流ref并自动同步到目标ref
 * 
 * @param target - 目标ref
 * @param delay - 节流延迟
 * @returns 节流ref
 * 
 * @example
 * ```ts
 * const color = ref('#ff0000')
 * const throttledColor = useThrottledRefSync(color, 100)
 * 
 * // 更新节流ref会在100ms内最多触发一次同步
 * throttledColor.value = '#0000ff'
 * ```
 */
export function useThrottledRefSync<T>(target: Ref<T>, delay: number): Ref<T> {
  const throttled = useThrottledRef(target.value, delay)

  watch(throttled, (newValue) => {
    target.value = newValue
  })

  return throttled
}