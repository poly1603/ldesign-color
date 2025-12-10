/**
 * ThemeModeSwitcherToggle - 单按钮循环切换
 */
import { defineComponent, computed } from 'vue'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { setThemeMode } from '@ldesign/color-core'
import type { ThemeMode } from './types'
import './styles.css'

const modeOrder: ThemeMode[] = ['light', 'dark', 'auto']

export const ThemeModeSwitcherToggle = defineComponent({
  name: 'ThemeModeSwitcherToggle',
  props: {
    modelValue: { type: String as () => ThemeMode, default: 'auto' },
    disabled: { type: Boolean, default: false },
    size: { type: String as () => 'small' | 'medium' | 'large', default: 'medium' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentMode = computed(() => props.modelValue)

    const triggerClass = computed(() => {
      const classes = ['ldesign-mode-switcher__trigger']
      if (props.size === 'small') classes.push('ldesign-mode-switcher__trigger--small')
      if (props.size === 'large') classes.push('ldesign-mode-switcher__trigger--large')
      return classes.join(' ')
    })

    const containerClass = computed(() => {
      const classes = ['ldesign-mode-switcher', 'ldesign-mode-switcher--toggle']
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

    const toggleMode = () => {
      const currentIndex = modeOrder.indexOf(currentMode.value)
      const nextIndex = (currentIndex + 1) % modeOrder.length
      const nextMode = modeOrder[nextIndex]
      emit('update:modelValue', nextMode)
      try {
        setThemeMode(nextMode)
      } catch (e) {
        console.warn('Failed to set theme mode:', e)
      }
    }

    const CurrentIcon = computed(() => getIcon(currentMode.value))

    return () => (
      <div class={containerClass.value}>
        <button
          type="button"
          class={triggerClass.value}
          onClick={toggleMode}
          disabled={props.disabled}
        >
          <CurrentIcon.value size={18} />
        </button>
      </div>
    )
  },
})

export default ThemeModeSwitcherToggle
