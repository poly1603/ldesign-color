/**
 * ThemeColorPicker - 下拉面板颜色选择器
 */
import { defineComponent, ref, computed, onMounted, onUnmounted, Transition, isRef, unref, inject, watch } from 'vue'
import { Check } from 'lucide-vue-next'
import { defaultThemeManager } from '@ldesign/color-core'
import { COLOR_CONFIG_SYMBOL, COLOR_SYMBOL } from '../../constants'
import type { PresetColor } from './types'
import { defaultPresets } from './types'
import './styles.css'

// 从 localStorage 读取初始颜色
const getStoredColor = (): string | null => {
  try {
    const data = localStorage.getItem('ldesign-theme')
    if (data) {
      const parsed = JSON.parse(data)
      return parsed.color
    }
  } catch { /* ignore */ }
  return null
}

export const ThemeColorPicker = defineComponent({
  name: 'ThemeColorPicker',
  props: {
    modelValue: { type: String, default: undefined },
    presets: { type: Array as () => PresetColor[], default: undefined },
    disabled: { type: Boolean, default: false },
    size: { type: String as () => 'small' | 'medium' | 'large', default: 'medium' },
    translate: { type: Function as unknown as () => (key: string) => string, default: (key: string) => key },
    locale: { type: [String, Object], default: undefined },
    title: { type: String, default: '' },
    variant: { type: String as () => 'light' | 'primary', default: 'light' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    const containerRef = ref<HTMLElement | null>(null)

    // 注入插件配置和适配器
    const pluginConfig = inject(COLOR_CONFIG_SYMBOL, null) as any
    const themeAdapter = inject(COLOR_SYMBOL, null) as any

    // 内部颜色状态 - 优先从 localStorage 获取
    const internalColor = ref(
      props.modelValue || getStoredColor() || themeAdapter?.getCurrentTheme?.()?.primaryColor || '#1890ff'
    )

    // 当前颜色 - 优先使用 props，否则使用内部状态
    const currentColor = computed(() => props.modelValue ?? internalColor.value)

    // 监听 props 变化同步内部状态
    watch(() => props.modelValue, (newVal) => {
      if (newVal) internalColor.value = newVal
    })

    // 获取当前语言，支持 zh-CN, zh_cn, en-US, en_us 等格式
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

    // 根据插件配置计算最终的预设列表
    const finalPresets = computed(() => {
      const config = pluginConfig?.colorPicker

      // 如果 props 传了 presets，优先使用
      if (props.presets) {
        return props.presets
      }

      // 获取禁用列表
      const disabledNames = config?.disabledPresets || []

      // 获取自定义预设
      const customPresets: PresetColor[] = (config?.customPresets || []).map((p: any) => ({
        name: p.name,
        color: p.color,
        i18n: p.i18n,
      }))

      // 是否只使用自定义预设
      if (config?.useOnlyCustom && customPresets.length > 0) {
        return customPresets
      }

      // 过滤禁用的内置预设
      const filteredBuiltin = defaultPresets.filter(
        (preset) => !disabledNames.includes(preset.name)
      )

      // 合并：内置 + 自定义
      return [...filteredBuiltin, ...customPresets]
    })

    const triggerClass = computed(() => {
      const classes = ['ldesign-color-picker__trigger']
      if (props.size === 'small') classes.push('ldesign-color-picker__trigger--small')
      if (props.size === 'large') classes.push('ldesign-color-picker__trigger--large')
      return classes.join(' ')
    })

    // Inline fallback style based on variant to avoid stylesheet patch dependency
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
        borderColor: 'var(--color-border, #e5e7eb)'
      }
    })

    const containerClass = computed(() => {
      const classes = ['ldesign-color-picker']
      if (props.disabled) classes.push('ldesign-color-picker--disabled')
      return classes.join(' ')
    })

    const selectColor = (color: string) => {
      internalColor.value = color
      emit('update:modelValue', color)
      isOpen.value = false

      // 先保存到 localStorage
      try {
        const stored = localStorage.getItem('ldesign-theme')
        const data = stored ? JSON.parse(stored) : {}
        data.color = color
        localStorage.setItem('ldesign-theme', JSON.stringify(data))
      } catch { /* ignore */ }

      // 再应用主题
      try {
        if (themeAdapter?.applyTheme) {
          themeAdapter.applyTheme(color)
        } else {
          defaultThemeManager.applyTheme(color)
        }
      } catch { /* ignore */ }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      // 应用存储的颜色
      const storedColor = getStoredColor()
      if (storedColor) {
        if (themeAdapter?.applyTheme) {
          themeAdapter.applyTheme(storedColor)
        } else {
          defaultThemeManager.applyTheme(storedColor)
        }
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const t = (key: string) => props.translate(key)

    // 获取预设的多语言文本
    const getPresetText = (preset: PresetColor) => {
      const lang = currentLang.value as 'zh' | 'en'
      return preset.i18n[lang] || preset.i18n.zh
    }

    return () => (
      <div ref={containerRef} class={containerClass.value} data-variant={props.variant || 'light'}>
        <button
          type="button"
          class={triggerClass.value}
          style={triggerStyle.value}
          onClick={() => (isOpen.value = !isOpen.value)}
          disabled={props.disabled}
          title={currentLang.value === 'zh' ? '选择主题色' : 'Theme Color'}
        >
          <span
            class="ldesign-color-picker__swatch"
            style={{ backgroundColor: currentColor.value }}
          />
        </button>

        <Transition name="ldesign-dropdown">
          {isOpen.value && (
            <div class="ldesign-color-picker__dropdown">
              <div class="ldesign-color-picker__arrow" />
              <div class="ldesign-color-picker__header">
                <h4 class="ldesign-color-picker__title">
                  {props.title || (currentLang.value === 'zh' ? '选择主题色' : 'Theme Color')}
                </h4>
              </div>
              <div class="ldesign-color-picker__list">
                {finalPresets.value.map((preset) => {
                  const text = getPresetText(preset)
                  const isActive = currentColor.value === preset.color
                  return (
                    <div
                      key={preset.name}
                      class={[
                        'ldesign-color-picker__item',
                        isActive && 'ldesign-color-picker__item--active',
                      ].filter(Boolean).join(' ')}
                      onClick={() => selectColor(preset.color)}
                    >
                      <span
                        class="ldesign-color-picker__item-color"
                        style={{ backgroundColor: preset.color }}
                      >
                        {isActive && <Check size={14} color="#fff" strokeWidth={3} />}
                      </span>
                      <div class="ldesign-color-picker__item-info">
                        <span class="ldesign-color-picker__item-label">{text.label}</span>
                        <span class="ldesign-color-picker__item-desc">{text.description}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  },
})

export default ThemeColorPicker
