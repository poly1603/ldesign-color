/**
 * @ldesign/color - 缓存系统测试
 *
 * 测试双向链表 LRU 缓存的所有功能
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ColorCache, createCacheKey, globalColorCache, memoize } from '../../packages/core/src/utils/cache'

describe('ColorCache', () => {
  let cache: ColorCache<string>

  beforeEach(() => {
    cache = new ColorCache<string>({
      maxSize: 5,
      strategy: 'lru',
    })
  })

  afterEach(() => {
    cache.destroy()
  })

  describe('基础操作', () => {
    it('应该正确设置和获取缓存', () => {
      cache.set('key1', 'value1')
      expect(cache.get('key1')).toBe('value1')
    })

    it('应该在缓存不存在时返回 undefined', () => {
      expect(cache.get('nonexistent')).toBeUndefined()
    })

    it('应该正确检查缓存是否存在', () => {
      cache.set('key1', 'value1')
      expect(cache.has('key1')).toBe(true)
      expect(cache.has('nonexistent')).toBe(false)
    })

    it('应该正确删除缓存', () => {
      cache.set('key1', 'value1')
      expect(cache.delete('key1')).toBe(true)
      expect(cache.has('key1')).toBe(false)
      expect(cache.delete('nonexistent')).toBe(false)
    })

    it('应该正确清空所有缓存', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.clear()
      expect(cache.size).toBe(0)
    })

    it('应该正确返回缓存大小', () => {
      expect(cache.size).toBe(0)
      cache.set('key1', 'value1')
      expect(cache.size).toBe(1)
      cache.set('key2', 'value2')
      expect(cache.size).toBe(2)
    })

    it('应该正确返回所有缓存键', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      const keys = cache.keys()
      expect(keys).toContain('key1')
      expect(keys).toContain('key2')
      expect(keys.length).toBe(2)
    })
  })

  describe('LRU 淘汰策略', () => {
    it('应该在超过容量时驱逐最少使用的项', () => {
      // 填满缓存
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      cache.set('key4', 'value4')
      cache.set('key5', 'value5')

      // 添加第 6 项应该驱逐 key1
      cache.set('key6', 'value6')

      expect(cache.has('key1')).toBe(false)
      expect(cache.has('key6')).toBe(true)
      expect(cache.size).toBe(5)
    })

    it('访问应该更新 LRU 顺序', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')
      cache.set('key4', 'value4')
      cache.set('key5', 'value5')

      // 访问 key1，使其成为最新
      cache.get('key1')

      // 添加 key6 应该驱逐 key2（现在是最旧的）
      cache.set('key6', 'value6')

      expect(cache.has('key1')).toBe(true)
      expect(cache.has('key2')).toBe(false)
    })
  })

  describe('LFU 淘汰策略', () => {
    it('应该驱逐访问次数最少的项', () => {
      const lfuCache = new ColorCache<string>({
        maxSize: 3,
        strategy: 'lfu',
      })

      lfuCache.set('key1', 'value1')
      lfuCache.set('key2', 'value2')
      lfuCache.set('key3', 'value3')

      // 访问 key1 和 key3 多次
      lfuCache.get('key1')
      lfuCache.get('key1')
      lfuCache.get('key3')

      // key2 访问次数最少，应该被驱逐
      lfuCache.set('key4', 'value4')

      expect(lfuCache.has('key2')).toBe(false)
      expect(lfuCache.has('key1')).toBe(true)
      expect(lfuCache.has('key3')).toBe(true)

      lfuCache.destroy()
    })
  })

  describe('FIFO 淘汰策略', () => {
    it('应该驱逐最早创建的项', () => {
      const fifoCache = new ColorCache<string>({
        maxSize: 3,
        strategy: 'fifo',
      })

      fifoCache.set('key1', 'value1')
      fifoCache.set('key2', 'value2')
      fifoCache.set('key3', 'value3')

      // 访问 key1（FIFO 不受访问影响）
      fifoCache.get('key1')

      // 应该驱逐 key1（最早创建）
      fifoCache.set('key4', 'value4')

      expect(fifoCache.has('key1')).toBe(false)
      expect(fifoCache.has('key2')).toBe(true)

      fifoCache.destroy()
    })
  })

  describe('过期机制', () => {
    it('应该在过期后返回 undefined', async () => {
      cache.set('key1', 'value1', 100) // 100ms 过期

      expect(cache.get('key1')).toBe('value1')

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(cache.get('key1')).toBeUndefined()
    })

    it('清理应该删除所有过期项', async () => {
      cache.set('key1', 'value1', 100)
      cache.set('key2', 'value2', 200)
      cache.set('key3', 'value3', 0) // 永不过期

      await new Promise(resolve => setTimeout(resolve, 150))

      const cleaned = cache.cleanup()
      expect(cleaned).toBe(1) // key1 已过期
      expect(cache.has('key1')).toBe(false)
      expect(cache.has('key2')).toBe(true)
      expect(cache.has('key3')).toBe(true)
    })
  })

  describe('内存管理', () => {
    it('应该在超过内存限制时驱逐项', () => {
      const memCache = new ColorCache<string>({
        maxSize: 100,
        maxMemory: 500, // 500 字节
      })

      // 添加大字符串（每个约 200 字节）
      memCache.set('key1', 'x'.repeat(100))
      memCache.set('key2', 'x'.repeat(100))

      // 第三个应该触发驱逐
      memCache.set('key3', 'x'.repeat(100))

      // 应该驱逐了一些项以保持在内存限制内
      expect(memCache.size).toBeLessThan(3)

      memCache.destroy()
    })

    it('应该正确估算内存使用', () => {
      cache.set('key1', 'short')
      cache.set('key2', 'x'.repeat(100))

      const stats = cache.getStats()
      expect(stats.memoryUsage).toBeGreaterThan(0)
    })
  })

  describe('批量操作', () => {
    it('应该支持批量设置', () => {
      cache.setMany([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3'],
      ])

      expect(cache.size).toBe(3)
      expect(cache.get('key1')).toBe('value1')
      expect(cache.get('key3')).toBe('value3')
    })

    it('应该支持批量获取', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')

      const values = cache.getMany(['key1', 'key2', 'nonexistent'])
      expect(values).toEqual(['value1', 'value2', undefined])
    })

    it('应该支持批量删除', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')
      cache.set('key3', 'value3')

      cache.deleteMany(['key1', 'key3'])

      expect(cache.has('key1')).toBe(false)
      expect(cache.has('key2')).toBe(true)
      expect(cache.has('key3')).toBe(false)
    })
  })

  describe('统计信息', () => {
    it('应该正确计算命中率', () => {
      cache.set('key1', 'value1')

      cache.get('key1') // 命中
      cache.get('key1') // 命中
      cache.get('nonexistent') // 未命中

      const stats = cache.getStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBeCloseTo(2 / 3)
    })

    it('应该统计驱逐次数', () => {
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`)
      }

      const stats = cache.getStats()
      expect(stats.evictions).toBe(5) // 驱逐了 5 个（maxSize = 5）
    })

    it('应该计算利用率', () => {
      cache.set('key1', 'value1')
      cache.set('key2', 'value2')

      const stats = cache.getStats()
      expect(stats.utilization).toBe(40) // 2/5 = 40%
    })
  })

  describe('边界情况', () => {
    it('应该拒绝空键', () => {
      expect(() => cache.set('', 'value')).toThrow()
      expect(() => cache.set('   ', 'value')).toThrow()
    })

    it('应该处理 null 和 undefined 值', () => {
      cache.set('key1', null as any)
      cache.set('key2', undefined as any)

      expect(cache.get('key1')).toBeNull()
      expect(cache.get('key2')).toBeUndefined()
    })

    it('应该处理大对象', () => {
      const largeObject = {
        data: new Array(1000).fill('test'),
      }

      cache.set('large', largeObject as any)
      expect(cache.get('large')).toBe(largeObject)
    })
  })

  describe('销毁', () => {
    it('应该在销毁后停止定时器并清空缓存', () => {
      cache.set('key1', 'value1')
      cache.destroy()

      expect(cache.size).toBe(0)
    })
  })
})

describe('createCacheKey', () => {
  it('应该从多个值创建缓存键', () => {
    const key = createCacheKey('user', 123, true)
    expect(key).toBe('user-123-true')
  })

  it('应该处理 null 和 undefined', () => {
    const key = createCacheKey('test', null, undefined)
    expect(key).toBe('test-null-undefined')
  })

  it('应该序列化对象', () => {
    const key = createCacheKey('test', { id: 1 })
    expect(key).toContain('{"id":1}')
  })
})

describe('memoize', () => {
  it('应该缓存函数结果', () => {
    const fn = vi.fn((n: number) => n * 2)
    const memoized = memoize(fn)

    expect(memoized(5)).toBe(10)
    expect(memoized(5)).toBe(10)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该支持自定义键生成', () => {
    const fn = vi.fn((obj: { id: number }) => obj.id * 2)
    const memoized = memoize(fn, (obj) => String(obj.id))

    expect(memoized({ id: 5 })).toBe(10)
    expect(memoized({ id: 5 })).toBe(10)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('应该支持清理', () => {
    const fn = vi.fn((n: number) => n * 2)
    const memoized = memoize(fn);

    (memoized as any).clear()

    memoized(5)
    memoized(5)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('globalColorCache', () => {
  afterEach(() => {
    globalColorCache.clear()
  })

  it('应该是单例实例', () => {
    expect(globalColorCache).toBeDefined()
    expect(globalColorCache.size).toBeGreaterThanOrEqual(0)
  })

  it('应该正常工作', () => {
    globalColorCache.set('test', 'value')
    expect(globalColorCache.get('test')).toBe('value')
  })
})

