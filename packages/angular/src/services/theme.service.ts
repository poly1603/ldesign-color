/**
 * Angular 主题管理服务
 *
 * 基于 BaseThemeAdapter 的 Angular 包装。
 *
 * @module services/theme
 */

import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core'
import type { Signal } from '@angular/core'
import type { ThemeAdapterOptions } from '@ldesign/color-core/themes/BaseThemeAdapter'
import type { ThemeOptions, ThemeState } from '@ldesign/color-core/themes/themeManager'
import { BaseThemeAdapter } from '@ldesign/color-core/themes/BaseThemeAdapter'

/**
 * Angular 主题服务选项
 */
export interface UseThemeOptions extends ThemeAdapterOptions { }

/**
 * 主题管理服务
 *
 * 在 Angular 应用中提供主题管理功能。
 *
 * @example
 * ```typescript
 * import { Component, inject } from '@angular/core'
 * import { ThemeService } from '@ldesign/color-angular'
 *
 * @Component({ ... })
 * export class AppComponent {
 *   private themeService = inject(ThemeService)
 *
 *   applyTheme(color: string) {
 *     this.themeService.applyTheme(color)
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private destroyRef = inject(DestroyRef)
  private adapter: BaseThemeAdapter
  private unsubscribe?: () => void

  // Signals
  readonly currentTheme = signal<ThemeState | null>(null)
  readonly isLoading = signal(false)

  // 计算 Signals
  readonly primaryColor = computed(() => this.currentTheme()?.primaryColor || '')
  readonly themeName = computed(() => this.currentTheme()?.themeName || '')
  readonly isDark = computed(() => this.currentTheme()?.isDark || false)
  readonly presets: Signal<any[]> = signal(this.adapter?.getState().presets || [])

  constructor() {
    // 创建适配器实例
    this.adapter = new BaseThemeAdapter({
      immediate: true,
    })

    // 初始化状态
    const initialState = this.adapter.getState()
    this.currentTheme.set(initialState.currentTheme)
    this.presets = signal(initialState.presets)

    // 订阅适配器变更
    this.unsubscribe = this.adapter.onChange((theme) => {
      this.currentTheme.set(theme)
    })

    // 清理：在服务销毁时
    this.destroyRef.onDestroy(() => {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      this.adapter.destroy()
    })
  }

  /**
   * 应用主题
   *
   * @param colorOrName - 颜色值或预设主题名
   * @param options - 主题选项
   * @returns 主题状态
   */
  async applyTheme(colorOrName: string, options?: ThemeOptions): Promise<ThemeState> {
    this.isLoading.set(true)
    try {
      const theme = await this.adapter.applyTheme(colorOrName, options)
      this.currentTheme.set(theme)
      return theme
    }
    finally {
      this.isLoading.set(false)
    }
  }

  /**
   * 应用预设主题
   *
   * @param name - 预设主题名
   * @param options - 主题选项
   * @returns 主题状态
   */
  async applyPresetTheme(name: string, options?: ThemeOptions): Promise<ThemeState> {
    this.isLoading.set(true)
    try {
      const theme = await this.adapter.applyPresetTheme(name, options)
      this.currentTheme.set(theme)
      return theme
    }
    finally {
      this.isLoading.set(false)
    }
  }

  /**
   * 恢复主题
   *
   * @returns 主题状态
   */
  restoreTheme(): ThemeState | null {
    const theme = this.adapter.restoreTheme()
    this.currentTheme.set(theme)
    return theme
  }

  /**
   * 清除主题
   */
  clearTheme(): void {
    this.adapter.clearTheme()
    this.currentTheme.set(null)
  }

  /**
   * 获取当前主题
   *
   * @returns 当前主题状态
   */
  getCurrentTheme(): ThemeState | null {
    const theme = this.adapter.getCurrentTheme()
    this.currentTheme.set(theme)
    return theme
  }
}

