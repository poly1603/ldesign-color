/**
 * @ldesign/color - 内存管理器测试
 *
 * 测试内存管理器的所有功能
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanupMemory,
  getMemoryStats,
  memoryManager,
  MemoryManager,
  resetMemory,
  setAutoCleanup,
  setMemoryLimit,
} from '../../packages/core/src/utils/memoryManager'

describe('MemoryManager', () => {
  afterEach(() => {
    memoryManager.reset()
  })

  describe('单例模式', () => {
    it('应该返回同一个实例', () => {
      const instance1 = MemoryManager.getInstance()
      const instance2 = MemoryManager.getInstance()

      expect(instance1).toBe(instance2)
    })
  })

  describe('内存统计', () => {
    it('应该获取内存统计信息', () => {
      const stats = memoryManager.getMemoryStats()

      expect(stats).toBeDefined()
      expect(stats.totalPoolSize).toBeGreaterThanOrEqual(0)
      expect(stats.cacheSize).toBeGreaterThanOrEqual(0)
      expect(stats.estimatedMemoryMB).toBeGreaterThanOrEqual(0)
      expect(['normal', 'moderate', 'high', 'critical']).toContain(stats.pressureLevel)
    })

    it('应该计算压力级别', () => {
      const stats = memoryManager.getMemoryStats()
      expect(stats.pressureLevel).toBeDefined()
    })
  })

  describe('清理操作', () => {
    it('应该执行清理', () => {
      memoryManager.cleanup()
      // 不应抛出错误
      expect(true).toBe(true)
    })

    it('应该重置内存', () => {
      memoryManager.reset()

      const stats = memoryManager.getMemoryStats()
      expect(stats.cacheSize).toBe(0)
      expect(stats.totalPoolSize).toBe(0)
    })
  })

  describe('配置管理', () => {
    it('应该获取配置', () => {
      const config = memoryManager.getConfig()

      expect(config).toBeDefined()
      expect(config.maxMemory).toBeGreaterThan(0)
      expect(config.cleanupInterval).toBeGreaterThan(0)
    })

    it('应该设置内存限制', () => {
      memoryManager.setMemoryLimit(100)

      const config = memoryManager.getConfig()
      expect(config.maxMemory).toBe(100)
    })

    it('应该设置自动清理', () => {
      memoryManager.setAutoCleanup(false)
      expect(memoryManager.getConfig().enableAutoCleanup).toBe(false)

      memoryManager.setAutoCleanup(true)
      expect(memoryManager.getConfig().enableAutoCleanup).toBe(true)
    })
  })

  describe('清理统计', () => {
    it('应该获取清理统计', () => {
      const stats = memoryManager.getCleanupStats()

      expect(stats).toBeDefined()
      expect(stats.cleanupCount).toBeGreaterThanOrEqual(0)
      expect(stats.timeSinceLastCleanup).toBeGreaterThanOrEqual(0)
    })
  })

  describe('垃圾回收', () => {
    it('应该尝试请求垃圾回收', () => {
      // 不应抛出错误
      expect(() => memoryManager.requestGarbageCollection()).not.toThrow()
    })
  })
})

describe('便利函数', () => {
  afterEach(() => {
    resetMemory()
  })

  it('cleanupMemory 应该正常工作', () => {
    expect(() => cleanupMemory()).not.toThrow()
  })

  it('resetMemory 应该正常工作', () => {
    expect(() => resetMemory()).not.toThrow()
  })

  it('getMemoryStats 应该返回统计信息', () => {
    const stats = getMemoryStats()
    expect(stats).toBeDefined()
  })

  it('setMemoryLimit 应该设置限制', () => {
    setMemoryLimit(100)
    const config = memoryManager.getConfig()
    expect(config.maxMemory).toBe(100)
  })

  it('setAutoCleanup 应该设置自动清理', () => {
    setAutoCleanup(false)
    expect(memoryManager.getConfig().enableAutoCleanup).toBe(false)
  })
})

