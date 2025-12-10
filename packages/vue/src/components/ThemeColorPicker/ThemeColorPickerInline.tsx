/**
 * ThemeColorPickerInline - 内联网格颜色选择器
 */
import { defineComponent, computed } from 'vue'
import { defaultThemeManager } from '@ldesign/color-core'
import type { PresetColor } from './types'
import { defaultPresets } from './types'
import './styles.css'

export const ThemeColorPickerInline = defineComponent({
  name: 'ThemeColorPickerInline',
  props: {
    modelValue: { type: String, default: '#1890ff' },
    presets: { type: Array as () => PresetColor[], default: () => defaultPresets },
    disabled: { type: Boolean, default: false },
    title: { type: String, default: '' },
    columns: { type: Number, default: 5 },
    showLabel: { type: Boolean, default: false },
    translate: { type: Function as unknown as () => (key: string) => string, default: (key: string) => key },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentColor = computed(() => props.modelValue)

    const containerClass = computed(() => {
      const classes = ['ldesign-color-picker', 'ldesign-color-picker--inline']
      if (props.disabled) classes.push('ldesign-color-picker--disabled')
      return classes.join(' ')
    })

    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
    }))

    const selectColor = (color: string) => {
      emit('update:modelValue', color)
      try {
        defaultThemeManager.applyTheme(color)
      } catch (e) {
        console.warn('Failed to apply theme:', e)
      }
    }

    const t = (key: string) => props.translate(key)

    return () => (
      <div class={containerClass.value}>
        {props.title && (
          <div class="ldesign-color-picker__header">
            <h4 class="ldesign-color-picker__title">{props.title}</h4>
          </div>
        )}
        <div class="ldesign-color-picker__content">
          {props.showLabel ? (
            <div class="ldesign-color-picker__grid" style={gridStyle.value}>
              {props.presets.map((preset) => (
                <div
                  key={preset.name}
                  class={[
                    'ldesign-color-picker__card',
                    currentColor.value === preset.color && 'ldesign-color-picker__card--active',
                  ].filter(Boolean).join(' ')}
                  onClick={() => selectColor(preset.color)}
                >
                  <span
                    class="ldesign-color-picker__card-swatch"
                    style={{ backgroundColor: preset.color }}
                  />
                  <div class="ldesign-color-picker__card-info">
                    <p class="ldesign-color-picker__card-label">{preset.i18n?.zh?.label || preset.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="ldesign-color-picker__grid" style={gridStyle.value}>
              {props.presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  class={[
                    'ldesign-color-picker__option',
                    currentColor.value === preset.color && 'ldesign-color-picker__option--active',
                  ].filter(Boolean).join(' ')}
                  style={{ backgroundColor: preset.color }}
                  onClick={() => selectColor(preset.color)}
                  title={preset.i18n?.zh?.label || preset.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
})

export default ThemeColorPickerInline
