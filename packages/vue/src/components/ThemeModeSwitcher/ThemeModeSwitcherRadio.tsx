/**
 * ThemeModeSwitcherRadio - 单选按钮组
 */
import { defineComponent, computed } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { setThemeMode } from '@ldesign/color-core'
import type { ThemeMode } from './types'
import { defaultModeOptions } from './types'
import './styles.css'

export const ThemeModeSwitcherRadio = defineComponent({
  name: 'ThemeModeSwitcherRadio',
  props: {
    modelValue: { type: String as () => ThemeMode, default: 'auto' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentMode = computed(() => props.modelValue)

    const containerClass = computed(() => {
      const classes = ['ldesign-mode-switcher--radio']
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

    const selectMode = (mode: ThemeMode) => {
      emit('update:modelValue', mode)
      try {
        setThemeMode(mode)
      } catch (e) {
        console.warn('Failed to set theme mode:', e)
      }
    }

    return () => (
      <div class={containerClass.value}>
        {defaultModeOptions.map((option) => {
          const Icon = getIcon(option.mode)
          const isActive = currentMode.value === option.mode
          return (
            <div
              key={option.mode}
              class={[
                'ldesign-mode-switcher__radio',
                isActive && 'ldesign-mode-switcher__radio--active',
              ].filter(Boolean).join(' ')}
              onClick={() => selectMode(option.mode)}
            >
              <span class="ldesign-mode-switcher__radio-dot" />
              <span class="ldesign-mode-switcher__radio-icon">
                <Icon size={18} />
              </span>
              <span class="ldesign-mode-switcher__radio-label">{option.label}</span>
            </div>
          )
        })}
      </div>
    )
  },
})

export default ThemeModeSwitcherRadio
