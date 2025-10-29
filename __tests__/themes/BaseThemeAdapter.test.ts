/**
 * @ldesign/color - BaseThemeAdapter 测试
 *
 * 测试框架无关的主题适配器基类
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BaseThemeAdapter } from '../../packages/core/src/themes/BaseThemeAdapter'

describe('BaseThemeAdapter', () => {
  let adapter: BaseThemeAdapter

  beforeEach(() => {
    adapter = new BaseThemeAdapter({
      immediate: false,
    })
  })

  afterEach(() => {
    adapter.destroy()
  })

  describe('初始化', () => {
    it('应该正确创建适配器', () => {
      expect(adapter).toBeDefined()
      expect(adapter.isDestroyed()).toBe(false)
    })

    it('应该获取初始状态', () => {
      const state = adapter.getState()

      expect(state).toBeDefined()
      expect(state.currentTheme).toBeNull()
      expect(state.presets).toBeDefined()
      expect(state.isLoading).toBe(false)
      expect(state.primaryColor).toBe('')
      expect(state.themeName).toBe('')
      expect(state.isDark).toBe(false)
    })
  })

  describe('主题应用', () => {
    it('应该应用颜色主题', async () => {
      const theme = await adapter.applyTheme('#667eea')

      expect(theme).toBeDefined()
      expect(theme.primaryColor).toBe('#667eea')

      const state = adapter.getState()
      expect(state.currentTheme).toBe(theme)
    })

    it('应该应用预设主题', async () => {
      const theme = await adapter.applyPresetTheme('blue')

      expect(theme).toBeDefined()
      expect(theme.themeName).toBe('蓝色')
    })

    it('应该更新状态', async () => {
      await adapter.applyTheme('#667eea')

      const state = adapter.getState()
      expect(state.primaryColor).toBe('#667eea')
    })
  })

  describe('主题恢复', () => {
    it('应该恢复保存的主题', async () => {
      await adapter.applyTheme('#667eea')

      const restoredTheme = adapter.restoreTheme()
      expect(restoredTheme).toBeDefined()
      expect(restoredTheme?.primaryColor).toBe('#667eea')
    })
  })

  describe('主题清除', () => {
    it('应该清除当前主题', async () => {
      await adapter.applyTheme('#667eea')
      adapter.clearTheme()

      const state = adapter.getState()
      expect(state.currentTheme).toBeNull()
    })
  })

  describe('主题获取', () => {
    it('应该获取当前主题', async () => {
      await adapter.applyTheme('#667eea')

      const theme = adapter.getCurrentTheme()
      expect(theme).toBeDefined()
      expect(theme?.primaryColor).toBe('#667eea')
    })
  })

  describe('主题监听', () => {
    it('应该订阅主题变更', async () => {
      const callback = vi.fn()
      const unsubscribe = adapter.onChange(callback)

      await adapter.applyTheme('#667eea')

      expect(callback).toHaveBeenCalled()

      unsubscribe()
    })

    it('应该取消订阅', async () => {
      const callback = vi.fn()
      const unsubscribe = adapter.onChange(callback)

      unsubscribe()

      await adapter.applyTheme('#667eea')

      // 不应该被调用（已取消订阅）
      expect(callback).not.toHaveBeenCalled()
    })

    it('应该支持多个监听器', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      adapter.onChange(callback1)
      adapter.onChange(callback2)

      await adapter.applyTheme('#667eea')

      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })

  describe('错误处理', () => {
    it('销毁后应该抛出错误', async () => {
      adapter.destroy()

      await expect(adapter.applyTheme('#667eea')).rejects.toThrow()
      await expect(adapter.applyPresetTheme('blue')).rejects.toThrow()
      expect(() => adapter.restoreTheme()).toThrow()
      expect(() => adapter.clearTheme()).toThrow()
      expect(() => adapter.getCurrentTheme()).toThrow()
    })

    it('应该处理监听器错误', async () => {
      const errorCallback = vi.fn(() => {
        throw new Error('测试错误')
      })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

      adapter.onChange(errorCallback)
      await adapter.applyTheme('#667eea')

      // 不应该影响其他监听器
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('销毁', () => {
    it('应该正确销毁', () => {
      adapter.destroy()

      expect(adapter.isDestroyed()).toBe(true)
    })

    it('重复销毁应该安全', () => {
      adapter.destroy()
      expect(() => adapter.destroy()).not.toThrow()
    })
  })
})

