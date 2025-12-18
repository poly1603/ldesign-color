/**
 * ThemeModeSwitcher - 下拉选择模式切换器
 */
import { defineComponent, ref, computed, onMounted, onUnmounted, Transition, isRef, unref, inject, watch } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { setThemeMode } from '@ldesign/color-core'
import { COLOR_CONFIG_SYMBOL, COLOR_SYMBOL } from '../../constants'
import type { ThemeMode, ThemeModeOption } from './types'
import { defaultModeOptions } from './types'
import './styles.css'

// 从 localStorage 读取初始模式
const getStoredMode = (): ThemeMode | null => {
  try {
    const data = localStorage.getItem('ldesign-theme')
    if (data) {
      const parsed = JSON.parse(data)
      return parsed.mode as ThemeMode
    }
  } catch { /* ignore */ }
  return null
}

export const ThemeModeSwitcher = defineComponent({
  name: 'ThemeModeSwitcher',
  props: {
    modelValue: { type: String as () => ThemeMode, default: undefined },
    disabled: { type: Boolean, default: false },
    size: { type: String as () => 'small' | 'medium' | 'large', default: 'medium' },
    showLabel: { type: Boolean, default: false },
    translate: { type: Function as unknown as () => (key: string) => string, default: (key: string) => key },
    locale: { type: [String, Object], default: undefined },
    variant: { type: String as () => 'light' | 'primary', default: 'light' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    const containerRef = ref<HTMLElement | null>(null)

    // 注入插件配置
    const pluginConfig = inject(COLOR_CONFIG_SYMBOL, null) as any
    const themeAdapter = inject(COLOR_SYMBOL, null) as any

    // 内部模式状态 - 从 Storage 获取初始值
    const storedModeValue = getStoredMode()
    const internalMode = ref<ThemeMode>(
      props.modelValue || storedModeValue || 'auto'
    )

    // 当前模式 - 优先使用 props
    const currentMode = computed(() => (props.modelValue ?? internalMode.value) as ThemeMode)

    // 监听 props 变化
    watch(() => props.modelValue, (newVal) => {
      if (newVal) internalMode.value = newVal
    })

    // 获取当前语言
    const currentLang = computed(() => {
      let localeValue = props.locale
      if (isRef(localeValue)) {
        localeValue = unref(localeValue)
      }
      const lang = (localeValue || 'zh').toString().toLowerCase()
      if (lang.startsWith('zh') || lang.includes('cn') || lang.includes('hans')) {
        return 'zh'
      }
      return 'en'
    })

    // 根据插件配置过滤可用的模式
    const availableModes = computed(() => {
      const configModes = pluginConfig?.modeSwitcher?.modes as ThemeMode[] | undefined
      if (configModes && configModes.length > 0) {
        return defaultModeOptions.filter((opt) => configModes.includes(opt.mode))
      }
      return defaultModeOptions
    })

    const triggerClass = computed(() => {
      const classes = ['ldesign-mode-switcher__trigger']
      if (props.size === 'small') classes.push('ldesign-mode-switcher__trigger--small')
      if (props.size === 'large') classes.push('ldesign-mode-switcher__trigger--large')
      return classes.join(' ')
    })

    // Inline fallback style based on variant
    const triggerStyle = computed(() => {
      if (props.variant === 'primary') {
        return {
          background: 'rgba(255, 255, 255, 0.12)',
          borderColor: 'rgba(255, 255, 255, 0.18)',
          color: 'var(--color-text-inverse, #ffffff)'
        }
      }
      return {
        background: 'var(--color-bg-hover, #f3f4f6)',
        borderColor: 'var(--color-border, #e5e7eb)',
        color: '#4b5563'
      }
    })

    const containerClass = computed(() => {
      const classes = ['ldesign-mode-switcher']
      if (props.disabled) classes.push('ldesign-mode-switcher--disabled')
      return classes.join(' ')
    })

    const getIcon = (mode: ThemeMode) => {
      switch (mode) {
        case 'light': return Sun
        case 'dark': return Moon
        case 'auto': return Monitor
      }
    }

    // 获取选项的多语言文本
    const getOptionLabel = (option: ThemeModeOption) => {
      const lang = currentLang.value as 'zh' | 'en'
      return option.i18n[lang]?.label || option.i18n.zh.label
    }

    const currentOption = computed(() =>
      availableModes.value.find((o) => o.mode === currentMode.value) || availableModes.value[0]
    )

    const selectMode = (mode: ThemeMode) => {
      internalMode.value = mode
      emit('update:modelValue', mode)
      isOpen.value = false

      // 先保存到 localStorage
      try {
        const stored = localStorage.getItem('ldesign-theme')
        const data = stored ? JSON.parse(stored) : {}
        data.mode = mode
        localStorage.setItem('ldesign-theme', JSON.stringify(data))
      } catch { /* ignore */ }

      // 再应用模式
      try {
        setThemeMode(mode)
      } catch { /* ignore */ }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      // 应用存储的模式
      const storedMode = getStoredMode()
      if (storedMode && storedMode !== 'auto') {
        setThemeMode(storedMode)
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const t = (key: string) => props.translate(key)
    const CurrentIcon = computed(() => getIcon(currentMode.value))

    return () => (
      <div ref={containerRef} class={containerClass.value} data-variant={props.variant || 'light'}>
        <button
          type="button"
          class={triggerClass.value}
          style={triggerStyle.value}
          onClick={() => (isOpen.value = !isOpen.value)}
          disabled={props.disabled}
          title={currentLang.value === 'zh' ? '主题模式' : 'Theme Mode'}
        >
          <CurrentIcon.value size={18} />
          {props.showLabel && (
            <span class="ldesign-mode-switcher__label">{getOptionLabel(currentOption.value)}</span>
          )}
        </button>

        <Transition name="ldesign-dropdown">
          {isOpen.value && (
            <div class="ldesign-mode-switcher__dropdown">
              <div class="ldesign-mode-switcher__arrow" />
              {availableModes.value.map((option) => {
                const Icon = getIcon(option.mode)
                return (
                  <div
                    key={option.mode}
                    class={[
                      'ldesign-mode-switcher__option',
                      currentMode.value === option.mode && 'ldesign-mode-switcher__option--active',
                    ].filter(Boolean).join(' ')}
                    onClick={() => selectMode(option.mode)}
                  >
                    <span class="ldesign-mode-switcher__option-icon">
                      <Icon size={18} />
                    </span>
                    <span class="ldesign-mode-switcher__option-label">{getOptionLabel(option)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </Transition>
      </div>
    )
  },
})

export default ThemeModeSwitcher
