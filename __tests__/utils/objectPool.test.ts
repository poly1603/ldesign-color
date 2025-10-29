/**
 * @ldesign/color - 对象池系统测试
 *
 * 测试对象池的所有功能
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  acquireHSL,
  acquireHSV,
  acquireRGB,
  ObjectPool,
  poolManager,
  releaseHSL,
  releaseHSV,
  releaseRGB,
} from '../../packages/core/src/utils/objectPool'

describe('ObjectPool', () => {
  interface TestObject {
    x: number
    y: number
  }

  let pool: ObjectPool<TestObject>

  beforeEach(() => {
    pool = new ObjectPool<TestObject>(
      () => ({ x: 0, y: 0 }),
      (obj) => {
        obj.x = 0
        obj.y = 0
      },
      { maxSize: 10, initialSize: 3 },
    )
  })

  afterEach(() => {
    pool.clear()
  })

  describe('基础操作', () => {
    it('应该创建初始对象', () => {
      const stats = pool.getStats()
      expect(stats.poolSize).toBe(3)
    })

    it('应该从池中获取对象', () => {
      const obj = pool.acquire()
      expect(obj).toBeDefined()
      expect(obj.x).toBe(0)
      expect(obj.y).toBe(0)
    })

    it('应该在池为空时创建新对象', () => {
      // 清空池
      pool.clear()

      const obj = pool.acquire()
      expect(obj).toBeDefined()

      const stats = pool.getStats()
      expect(stats.misses).toBe(1)
      expect(stats.allocated).toBe(1)
    })

    it('应该释放对象回池', () => {
      const initialSize = pool.size

      const obj = pool.acquire()
      expect(pool.size).toBe(initialSize - 1)

      pool.release(obj)
      expect(pool.size).toBe(initialSize)
    })

    it('应该在释放时重置对象', () => {
      const obj = pool.acquire()
      obj.x = 100
      obj.y = 200

      pool.release(obj)

      const obj2 = pool.acquire()
      expect(obj2.x).toBe(0)
      expect(obj2.y).toBe(0)
    })
  })

  describe('容量限制', () => {
    it('应该不超过最大大小', () => {
      const objects: TestObject[] = []
      for (let i = 0; i < 5; i++) {
        objects.push(pool.acquire())
      }

      // 释放 15 个对象（超过 maxSize = 10）
      for (let i = 0; i < 15; i++) {
        pool.release({ x: 0, y: 0 })
      }

      expect(pool.size).toBeLessThanOrEqual(10)
    })
  })

  describe('批量操作', () => {
    it('应该支持批量释放', () => {
      const objects: TestObject[] = []
      for (let i = 0; i < 3; i++) {
        objects.push(pool.acquire())
      }

      const beforeSize = pool.size
      pool.releaseMany(objects)

      expect(pool.size).toBe(beforeSize + 3)
    })
  })

  describe('统计信息', () => {
    it('应该正确计算命中率', () => {
      pool.acquire() // 命中（从池中）
      pool.acquire() // 命中
      pool.acquire() // 命中

      pool.clear()
      pool.acquire() // 未命中（池为空）

      const stats = pool.getStats()
      expect(stats.hits).toBe(3)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBeCloseTo(0.75)
    })

    it('应该计算利用率', () => {
      const stats = pool.getStats()
      expect(stats.utilization).toBeGreaterThan(0)
    })
  })

  describe('优化', () => {
    it('应该根据使用情况优化池大小', () => {
      // 高命中率，低利用率 - 应该增加
      for (let i = 0; i < 20; i++) {
        pool.acquire()
      }

      const beforeMaxSize = pool.getStats().maxSize
      pool.optimize()
      const afterMaxSize = pool.getStats().maxSize

      // 可能增加了 maxSize
      expect(afterMaxSize).toBeGreaterThanOrEqual(beforeMaxSize)
    })
  })

  describe('预热和收缩', () => {
    it('应该预热池', () => {
      pool.clear()
      pool.prewarm(5)

      expect(pool.size).toBe(5)
    })

    it('应该收缩池', () => {
      pool.shrink()
      expect(pool.size).toBe(0) // minSize = 0
    })
  })
})

describe('PoolManager', () => {
  it('应该注册和获取池', () => {
    const testPool = new ObjectPool(() => ({ value: 0 }))
    poolManager.register('test', testPool)

    const retrieved = poolManager.get('test')
    expect(retrieved).toBe(testPool)

    poolManager.unregister('test')
  })

  it('应该优化所有池', () => {
    const testPool = new ObjectPool(() => ({ value: 0 }))
    poolManager.register('test', testPool)

    poolManager.optimizeAll()

    poolManager.unregister('test')
  })

  it('应该清空所有池', () => {
    const testPool = new ObjectPool(() => ({ value: 0 }))
    poolManager.register('test', testPool)

    testPool.acquire()

    poolManager.clearAll()

    const stats = testPool.getStats()
    expect(stats.poolSize).toBe(0)

    poolManager.unregister('test')
  })

  it('应该收缩所有池', () => {
    const testPool = new ObjectPool(() => ({ value: 0 }), undefined, { minSize: 2 })
    poolManager.register('test', testPool)

    testPool.prewarm(10)

    poolManager.shrinkAll()

    expect(testPool.size).toBe(2) // 收缩到 minSize

    poolManager.unregister('test')
  })

  it('应该获取所有统计信息', () => {
    const stats = poolManager.getAllStats()
    expect(stats).toBeDefined()
    expect(typeof stats).toBe('object')
  })
})

describe('专用池', () => {
  afterEach(() => {
    poolManager.clearAll()
  })

  it('RGB 池应该正常工作', () => {
    const rgb = acquireRGB()
    expect(rgb).toBeDefined()
    expect(rgb.r).toBe(0)
    expect(rgb.g).toBe(0)
    expect(rgb.b).toBe(0)

    rgb.r = 255
    releaseRGB(rgb)

    const rgb2 = acquireRGB()
    expect(rgb2.r).toBe(0) // 应该被重置
  })

  it('HSL 池应该正常工作', () => {
    const hsl = acquireHSL()
    expect(hsl).toBeDefined()
    expect(hsl.h).toBe(0)

    releaseHSL(hsl)
  })

  it('HSV 池应该正常工作', () => {
    const hsv = acquireHSV()
    expect(hsv).toBeDefined()
    expect(hsv.h).toBe(0)

    releaseHSV(hsv)
  })
})

