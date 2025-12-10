/**
 * ThemeColorPickerSimple - 简约色块选择器
 */
import { defineComponent, computed } from 'vue'
import { defaultThemeManager } from '@ldesign/color-core'
import type { PresetColor } from './types'
import { defaultPresets } from './types'
import './styles.css'

export const ThemeColorPickerSimple = defineComponent({
  name: 'ThemeColorPickerSimple',
  props: {
    modelValue: { type: String, default: '#1890ff' },
    presets: { type: Array as () => PresetColor[], default: () => defaultPresets },
    disabled: { type: Boolean, default: false },
    size: { type: String as () => 'small' | 'medium' | 'large', default: 'medium' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentColor = computed(() => props.modelValue)

    const containerClass = computed(() => {
      const classes = ['ldesign-color-picker', 'ldesign-color-picker--inline']
      if (props.disabled) classes.push('ldesign-color-picker--disabled')
      return classes.join(' ')
    })

    const selectColor = (color: string) => {
      emit('update:modelValue', color)
      try {
        defaultThemeManager.applyTheme(color)
      } catch (e) {
        console.warn('Failed to apply theme:', e)
      }
    }

    return () => (
      <div class={containerClass.value} style={{ padding: '8px', border: 'none' }}>
        <div class="ldesign-color-picker__grid" style={{ gap: '6px' }}>
          {props.presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              class={[
                'ldesign-color-picker__option',
                currentColor.value === preset.color && 'ldesign-color-picker__option--active',
              ].filter(Boolean).join(' ')}
              style={{ backgroundColor: preset.color, width: '24px', height: '24px' }}
              onClick={() => selectColor(preset.color)}
              title={preset.i18n?.zh?.label || preset.name}
            />
          ))}
        </div>
      </div>
    )
  },
})

export default ThemeColorPickerSimple
