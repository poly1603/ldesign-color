/**
 * ThemeProvider 组件
 * 主题提供者组件 - TSX 版本
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异，禁用类型检查以避免误报
import { defineComponent, onMounted, onUnmounted, provide, watch, type PropType } from 'vue'
import {
  generateThemeColors,
  injectCSSVariables,
  type ColorGeneratorOptions,
  type ColorInput,
  type ThemeColors,
} from '@ldesign/color-core'
import './ThemeProvider.css'

export interface ThemeProviderProps {
  /** 主色调 */
  primaryColor?: ColorInput
  /** 主题生成选项 */
  options?: ColorGeneratorOptions
  /** CSS 变量前缀 */
  cssPrefix?: string
  /** 是否包含语义别名 */
  includeAliases?: boolean
  /** 是否自动注入 CSS 变量 */
  autoInject?: boolean
  /** 主题模式 */
  mode?: 'light' | 'dark' | 'auto'
}

/** 注入键 */
const THEME_PROVIDER_KEY = Symbol('ld-theme-provider')

/**
 * 主题提供者组件
 * 
 * @example
 * ```tsx
 * <ThemeProvider primaryColor="#1890ff" mode="auto">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',

  props: {
    primaryColor: {
      type: String as PropType<ColorInput>,
      default: '#1890ff'
    },
    options: {
      type: Object as PropType<ColorGeneratorOptions>,
      required: false
    },
    cssPrefix: {
      type: String,
      default: 'color'
    },
    includeAliases: {
      type: Boolean,
      default: true
    },
    autoInject: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String as PropType<'light' | 'dark' | 'auto'>,
      default: 'auto'
    }
  },

  emits: {
    'theme-change': (theme: ThemeColors) => true
  },

  setup(props, { emit, slots }) {
    // 系统主题监听器
    let mediaQuery: MediaQueryList | null = null
    let mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null

    // 生成主题
    const generateTheme = () => {
      const theme = generateThemeColors(props.primaryColor!, props.options)

      // 自动注入 CSS 变量
      if (props.autoInject && typeof document !== 'undefined') {
        injectCSSVariables(theme, {
          prefix: props.cssPrefix,
          includeAliases: props.includeAliases
        })
      }

      // 触发事件
      emit('theme-change', theme)

      return theme
    }

    // 设置主题模式
    const setThemeMode = (mode: 'light' | 'dark' | 'auto') => {
      if (typeof document === 'undefined') return

      const root = document.documentElement

      if (mode === 'auto') {
        // 检测系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
      }
      else {
        root.setAttribute('data-theme', mode)
      }
    }

    // 初始化
    onMounted(() => {
      // 生成并应用主题
      const theme = generateTheme()

      // 提供主题上下文
      provide(THEME_PROVIDER_KEY, {
        theme,
        primaryColor: props.primaryColor,
        cssPrefix: props.cssPrefix,
        regenerate: generateTheme
      })

      // 设置主题模式
      setThemeMode(props.mode!)

      // 监听系统主题变化
      if (props.mode === 'auto' && typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQueryHandler = (e: MediaQueryListEvent) => {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
        }
        mediaQuery.addEventListener('change', mediaQueryHandler)
      }
    })

    // 清理
    onUnmounted(() => {
      if (mediaQuery && mediaQueryHandler) {
        mediaQuery.removeEventListener('change', mediaQueryHandler)
      }
    })

    // 监听属性变化
    watch(() => props.primaryColor, () => {
      generateTheme()
    })

    watch(() => props.mode, (mode) => {
      setThemeMode(mode!)

      // 清理旧的监听器
      if (mediaQuery && mediaQueryHandler) {
        mediaQuery.removeEventListener('change', mediaQueryHandler)
        mediaQuery = null
        mediaQueryHandler = null
      }

      // 设置新的监听器
      if (mode === 'auto' && typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQueryHandler = (e: MediaQueryListEvent) => {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
        }
        mediaQuery.addEventListener('change', mediaQueryHandler)
      }
    })

    return () => (
      <div class="ld-theme-provider">
        {slots.default?.()}
      </div>
    )
  }
})

export default ThemeProvider

