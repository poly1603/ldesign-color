/**
 * ThemeModeSwitcher 组件
 * 主题模式切换器组件 - TSX 版本
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异，禁用类型检查以避免误报
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { useThemeMode } from '../composables/useThemeMode'
import './ThemeModeSwitcher.css'

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

    // 模式文本映射
    const modeText = computed(() => {
      if (props.translate) {
        return props.translate(`theme.mode.${mode.value}`)
      }

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

    // 模式提示文本
    const modeTitle = computed(() => {
      if (props.translate) {
        const modeStr = props.translate(`theme.mode.${mode.value}`)
        return `${props.translate('theme.currentMode')}: ${modeStr}`
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

