import { computed, reactive } from 'vue'
import type { PresetTheme } from '../types'

/**
 * 默认预设主题
 */
export const DEFAULT_PRESET_THEMES: PresetTheme[] = [
  { name: '蓝色', color: '#1890ff', description: '经典蓝色主题', enabled: true },
  { name: '绿色', color: '#52c41a', description: '清新绿色主题', enabled: true },
  { name: '红色', color: '#f5222d', description: '热情红色主题', enabled: true },
  { name: '橙色', color: '#fa8c16', description: '活力橙色主题', enabled: true },
  { name: '紫色', color: '#722ed1', description: '神秘紫色主题', enabled: true },
  { name: '青色', color: '#13c2c2', description: '清爽青色主题', enabled: true },
  { name: '粉色', color: '#eb2f96', description: '浪漫粉色主题', enabled: true },
  { name: '黄色', color: '#fadb14', description: '明亮黄色主题', enabled: true },
  { name: '深蓝', color: '#1d39c4', description: '深邃蓝色主题', enabled: true },
  { name: '深绿', color: '#389e0d', description: '深沉绿色主题', enabled: true },
  { name: '深红', color: '#cf1322', description: '深邃红色主题', enabled: true },
  { name: '深紫', color: '#531dab', description: '深邃紫色主题', enabled: true },
]

/**
 * 预设主题管理器
 */
export class PresetThemeManager {
  private themes = reactive<PresetTheme[]>([...DEFAULT_PRESET_THEMES])

  /**
   * 获取所有预设主题（响应式）
   */
  public getThemes() {
    return this.themes
  }

  /**
   * 获取启用的预设主题（响应式）
   */
  public getEnabledThemes() {
    return computed(() => this.themes.filter(theme => theme.enabled !== false))
  }

  /**
   * 添加预设主题
   */
  public addTheme(theme: Omit<PresetTheme, 'enabled'>): void {
    const newTheme: PresetTheme = {
      ...theme,
      enabled: true,
    }

    // 检查是否已存在相同名称的主题
    const existingIndex = this.themes.findIndex(t => t.name === theme.name)
    if (existingIndex >= 0) {
      // 更新现有主题
      this.themes[existingIndex] = newTheme
    }
 else {
      // 添加新主题
      this.themes.push(newTheme)
    }
  }

  /**
   * 移除预设主题
   */
  public removeTheme(name: string): boolean {
    const index = this.themes.findIndex(theme => theme.name === name)
    if (index >= 0) {
      this.themes.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * 启用/禁用预设主题
   */
  public toggleTheme(name: string, enabled?: boolean): boolean {
    const theme = this.themes.find(t => t.name === name)
    if (theme) {
      theme.enabled = enabled !== undefined ? enabled : !theme.enabled
      return true
    }
    return false
  }

  /**
   * 更新预设主题
   */
  public updateTheme(name: string, updates: Partial<PresetTheme>): boolean {
    const theme = this.themes.find(t => t.name === name)
    if (theme) {
      Object.assign(theme, updates)
      return true
    }
    return false
  }

  /**
   * 根据名称查找主题
   */
  public findTheme(name: string): PresetTheme | undefined {
    return this.themes.find(theme => theme.name === name)
  }

  /**
   * 根据颜色查找主题
   */
  public findThemeByColor(color: string): PresetTheme | undefined {
    return this.themes.find(theme => theme.color.toLowerCase() === color.toLowerCase())
  }

  /**
   * 重置为默认主题
   */
  public resetToDefault(): void {
    this.themes.splice(0, this.themes.length, ...DEFAULT_PRESET_THEMES.map(theme => ({ ...theme })))
  }

  /**
   * 禁用所有默认主题
   */
  public disableDefaultThemes(): void {
    DEFAULT_PRESET_THEMES.forEach((defaultTheme) => {
      const theme = this.themes.find(t => t.name === defaultTheme.name)
      if (theme) {
        theme.enabled = false
      }
    })
  }

  /**
   * 启用所有默认主题
   */
  public enableDefaultThemes(): void {
    DEFAULT_PRESET_THEMES.forEach((defaultTheme) => {
      const theme = this.themes.find(t => t.name === defaultTheme.name)
      if (theme) {
        theme.enabled = true
      }
    })
  }

  /**
   * 批量添加主题
   */
  public addThemes(themes: Omit<PresetTheme, 'enabled'>[]): void {
    themes.forEach(theme => this.addTheme(theme))
  }

  /**
   * 导出主题配置
   */
  public exportThemes(): PresetTheme[] {
    return JSON.parse(JSON.stringify(this.themes))
  }

  /**
   * 导入主题配置
   */
  public importThemes(themes: PresetTheme[], replace: boolean = false): void {
    if (replace) {
      this.themes.splice(0, this.themes.length, ...themes)
    }
 else {
      themes.forEach(theme => this.addTheme(theme))
    }
  }

  /**
   * 获取主题数量统计
   */
  public getStats() {
    return computed(() => ({
      total: this.themes.length,
      enabled: this.themes.filter(t => t.enabled !== false).length,
      disabled: this.themes.filter(t => t.enabled === false).length,
      custom: this.themes.filter(t => !DEFAULT_PRESET_THEMES.some(dt => dt.name === t.name)).length,
    }))
  }
}

/**
 * 创建预设主题管理器实例
 */
export function createPresetThemeManager(): PresetThemeManager {
  return new PresetThemeManager()
}

/**
 * 全局预设主题管理器实例
 */
export const globalPresetThemeManager = createPresetThemeManager()
