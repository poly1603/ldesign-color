/**
 * ThemeModeSwitcher 组件
 * 主题模式切换器组件 - TSX 版本
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异，禁用类型检查以避免误报
import type { PropType } from 'vue'
import { computed, defineComponent, getCurrentInstance, inject, watch, ref } from 'vue'
import { useThemeMode } from '../composables/useThemeMode'
import './ThemeModeSwitcher.css'

// i18n Symbol key (需要与 @ldesign/i18n-vue 保持一致)
const I18N_SYMBOL = Symbol('i18n')

export interface ThemeModeSwitcherProps {
  /** 翻译函数 */
  translate?: (key: string) => string
}

/**
 * 主题模式切换器组件
 *
 * @example
 * ```tsx
 * <ThemeModeSwitcher translate={t} />
 * ```
 */
export const ThemeModeSwitcher = defineComponent({
  name: 'ThemeModeSwitcher',

  props: {
    translate: {
      type: Function as PropType<(key: string) => string>,
      required: false
    }
  },

  setup(props) {
    // 使用主题模式管理
    const { mode, toggleMode } = useThemeMode()

    // 尝试获取 i18n 实例（用于响应式翻译）
    let i18nInstance: any = null
    const localeRef = ref<string>('en-US')

    try {
      // 1. 尝试从 Symbol inject 获取（优先）
      i18nInstance = inject(I18N_SYMBOL, null)

      // 2. 尝试从字符串 key inject 获取
      if (!i18nInstance) {
        i18nInstance = inject('i18n', null)
      }

      // 3. 尝试从 globalProperties 获取
      if (!i18nInstance) {
        const instance = getCurrentInstance()
        const globalProperties = instance?.appContext?.config?.globalProperties
        i18nInstance = globalProperties?.$i18n
      }

      // 如果找到 i18n 实例，监听 locale 变化
      if (i18nInstance) {
        // 初始化 locale
        localeRef.value = i18nInstance.getLocale?.() || i18nInstance.locale || 'en-US'

        // 监听 locale 变化
        if (i18nInstance.on) {
          i18nInstance.on('localeChanged', ({ locale }: any) => {
            localeRef.value = locale
          })
        }
      }
    } catch (e) {
      // 忽略错误，使用 fallback
      console.warn('[ThemeModeSwitcher] Failed to get i18n instance:', e)
    }

    // 模式图标映射
    const modeIcon = computed(() => {
      switch (mode.value) {
        case 'light':
          return '☀️'
        case 'dark':
          return '🌙'
        case 'auto':
          return '💻'
        default:
          return '☀️'
      }
    })

    // 模式文本映射（响应式翻译）
    const modeText = computed(() => {
      // 强制依赖 localeRef 以触发重新计算
      const currentLocale = localeRef.value

      if (props.translate) {
        return props.translate(`theme.mode.${mode.value}`)
      }

      // 如果有 i18n 实例，使用它的 t 方法
      if (i18nInstance?.t) {
        return i18nInstance.t(`theme.mode.${mode.value}`)
      }

      // Fallback 到英文
      switch (mode.value) {
        case 'light':
          return 'Light'
        case 'dark':
          return 'Dark'
        case 'auto':
          return 'Auto'
        default:
          return 'Light'
      }
    })

    // 模式提示文本（响应式翻译）
    const modeTitle = computed(() => {
      // 强制依赖 localeRef 以触发重新计算
      const currentLocale = localeRef.value

      if (props.translate) {
        const modeStr = props.translate(`theme.mode.${mode.value}`)
        return `${props.translate('theme.currentMode')}: ${modeStr}`
      }

      // 如果有 i18n 实例，使用它的 t 方法
      if (i18nInstance?.t) {
        const modeStr = i18nInstance.t(`theme.mode.${mode.value}`)
        return `${i18nInstance.t('theme.currentMode')}: ${modeStr}`
      }

      return `Current mode: ${modeText.value}`
    })

    // 切换模式
    const handleToggle = () => {
      toggleMode()
    }

    return () => (
      <div class="ld-theme-mode-switcher">
        <button
          class="mode-button"
          title={modeTitle.value}
          onClick={handleToggle}
        >
          <span class="mode-icon">{modeIcon.value}</span>
          <span class="mode-text">{modeText.value}</span>
        </button>
      </div>
    )
  }
})

export default ThemeModeSwitcher

