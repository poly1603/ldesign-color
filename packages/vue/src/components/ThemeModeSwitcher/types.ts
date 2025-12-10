/**
 * ThemeModeSwitcher 组件类型定义
 */

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeModeI18n {
  label: string
}

export interface ThemeModeOption {
  mode: ThemeMode
  /** 多语言标签 */
  i18n: {
    zh: ThemeModeI18n
    en: ThemeModeI18n
  }
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
    i18n: {
      zh: { label: '浅色' },
      en: { label: 'Light' },
    },
  },
  {
    mode: 'dark',
    i18n: {
      zh: { label: '深色' },
      en: { label: 'Dark' },
    },
  },
  {
    mode: 'auto',
    i18n: {
      zh: { label: '跟随系统' },
      en: { label: 'System' },
    },
  },
]
