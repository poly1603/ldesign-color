/**
 * ThemeModeSwitcher 组件类型定义
 */

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeModeI18n {
  label: string
}

export interface ThemeModeOption {
  mode: ThemeMode
  /** 标签（简化形式） */
  label?: string
  /** 多语言标签 */
  i18n?: {
    zh: ThemeModeI18n
    en: ThemeModeI18n
  }
}

/**
 * 获取模式选项的标签
 * @param option - 模式选项
 * @param locale - 语言代码 (zh/en)
 * @returns 标签文本
 */
export function getModeLabel(option: ThemeModeOption, locale: string = 'zh'): string {
  // 优先使用 label
  if (option.label) {
    return option.label
  }
  // 使用 i18n
  if (option.i18n) {
    const lang = locale.startsWith('zh') ? 'zh' : 'en'
    return option.i18n[lang]?.label || option.mode
  }
  // 回退到 mode
  return option.mode
}

export interface ThemeModeSwitcherProps {
  /** 当前模式 */
  modelValue?: ThemeMode
  /** 是否禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 是否显示标签 */
  showLabel?: boolean
  /** 是否显示图标 */
  showIcon?: boolean
  /** 翻译函数 */
  translate?: (key: string) => string
  /** 当前语言 */
  locale?: string
}

/** 默认模式选项 (带多语言支持) */
export const defaultModeOptions: ThemeModeOption[] = [
  {
    mode: 'light',
    label: '浅色',
    i18n: {
      zh: { label: '浅色' },
      en: { label: 'Light' },
    },
  },
  {
    mode: 'dark',
    label: '深色',
    i18n: {
      zh: { label: '深色' },
      en: { label: 'Dark' },
    },
  },
  {
    mode: 'auto',
    label: '跟随系统',
    i18n: {
      zh: { label: '跟随系统' },
      en: { label: 'System' },
    },
  },
]
