/**
 * ThemeModeSwitcherSegmented - 分段选择器
 */
import { defineComponent, computed } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { setThemeMode } from '@ldesign/color-core'
import type { ThemeMode } from './types'
import { defaultModeOptions, getModeLabel } from './types'
import './styles.css'

export const ThemeModeSwitcherSegmented = defineComponent({
  name: 'ThemeModeSwitcherSegmented',
  props: {
    modelValue: { type: String as () => ThemeMode, default: 'auto' },
    disabled: { type: Boolean, default: false },
    showLabel: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentMode = computed(() => props.modelValue)

    const containerClass = computed(() => {
      const classes = ['ldesign-mode-switcher--segmented']
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
          return (
            <button
              key={option.mode}
              type="button"
              class={[
                'ldesign-mode-switcher__segment',
                currentMode.value === option.mode && 'ldesign-mode-switcher__segment--active',
              ].filter(Boolean).join(' ')}
              onClick={() => selectMode(option.mode)}
              disabled={props.disabled}
            >
              <Icon size={16} />
              {props.showLabel && <span>{getModeLabel(option)}</span>}
            </button>
          )
        })}
      </div>
    )
  },
})

export default ThemeModeSwitcherSegmented
