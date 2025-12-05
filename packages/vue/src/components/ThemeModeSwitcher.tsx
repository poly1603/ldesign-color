/**
 * ThemeModeSwitcher 组件
 * 主题模式切换器组件 - TSX 版本
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异，禁用类型检查以避免误报
import type { PropType } from 'vue'
import { computed, defineComponent, getCurrentInstance, inject, watch, ref, onMounted, onUnmounted, Transition } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
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
    const { mode, setMode } = useThemeMode()

    // 下拉菜单状态
    const isOpen = ref(false)

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

    /**
     * 所有可用的主题模式
     */
    const modes = ['light', 'dark', 'auto'] as const

    /**
     * 获取模式图标组件
     */
    const getModeIcon = (modeValue: string) => {
      const iconProps = { size: 20, strokeWidth: 2 }
      switch (modeValue) {
        case 'light':
          return <Sun {...iconProps} />
        case 'dark':
          return <Moon {...iconProps} />
        case 'auto':
          return <Monitor {...iconProps} />
        default:
          return <Sun {...iconProps} />
      }
    }

    /**
     * 当前模式图标组件
     */
    const currentModeIcon = computed(() => {
      const iconProps = { size: 18, strokeWidth: 2 }
      switch (mode.value) {
        case 'light':
          return <Sun {...iconProps} />
        case 'dark':
          return <Moon {...iconProps} />
        case 'auto':
          return <Monitor {...iconProps} />
        default:
          return <Sun {...iconProps} />
      }
    })

    /**
     * 获取模式文本
     */
    const getModeText = (modeValue: string) => {
      // 强制依赖 localeRef 以触发重新计算
      const currentLocale = localeRef.value

      if (props.translate) {
        return props.translate(`theme.mode.${modeValue}`)
      }

      // 如果有 i18n 实例，使用它的 t 方法
      if (i18nInstance?.t) {
        return i18nInstance.t(`theme.mode.${modeValue}`)
      }

      // Fallback 到英文
      switch (modeValue) {
        case 'light':
          return 'Light'
        case 'dark':
          return 'Dark'
        case 'auto':
          return 'Auto'
        default:
          return 'Light'
      }
    }

    // 当前模式文本
    const modeText = computed(() => getModeText(mode.value))

    // 模式提示文本（响应式翻译）
    const modeTitle = computed(() => {
      // 强制依赖 localeRef 以触发重新计算
      const currentLocale = localeRef.value

      if (props.translate) {
        return props.translate('theme.selectMode')
      }

      // 如果有 i18n 实例，使用它的 t 方法
      if (i18nInstance?.t) {
        return i18nInstance.t('theme.selectMode')
      }

      return 'Select theme mode'
    })

    /**
     * 切换下拉菜单
     */
    const toggleDropdown = (e: MouseEvent) => {
      e.stopPropagation() // 阻止事件冒泡
      isOpen.value = !isOpen.value
    }

    /**
     * 选择模式
     */
    const selectMode = (modeValue: string) => {
      setMode(modeValue as 'light' | 'dark' | 'auto')
      isOpen.value = false
    }

    /**
     * 点击外部关闭下拉菜单
     */
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.ld-theme-mode-switcher')) {
        isOpen.value = false
      }
    }

    // 生命周期(延迟添加事件监听,避免与按钮点击冲突)
    onMounted(() => {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return () => (
      <div class="ld-theme-mode-switcher">
        <button
          class="mode-button"
          title={modeTitle.value}
          onClick={toggleDropdown}
        >
          {currentModeIcon.value}
        </button>

        <Transition name="dropdown">
          {isOpen.value && (
            <div class="mode-dropdown" onClick={(e: MouseEvent) => e.stopPropagation()}>
              <div class="dropdown-header">
                <span class="dropdown-title">主题模式</span>
              </div>
              <div class="dropdown-content">
                <div class="mode-grid">
                  {modes.map(modeValue => (
                    <div
                      key={modeValue}
                      class={['mode-card', { active: mode.value === modeValue }]}
                      onClick={() => selectMode(modeValue)}
                    >
                      <span class="card-icon">{getModeIcon(modeValue)}</span>
                      <span class="card-name">{getModeText(modeValue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  }
})

export default ThemeModeSwitcher

