/**
 * ThemeColorPickerPopover - 悬浮面板颜色选择器
 */
import { defineComponent, ref, computed } from 'vue'
import { defaultThemeManager } from '@ldesign/color-core'
import type { PresetColor } from './types'
import { defaultPresets } from './types'
import './styles.css'

export const ThemeColorPickerPopover = defineComponent({
  name: 'ThemeColorPickerPopover',
  props: {
    modelValue: { type: String, default: '#1890ff' },
    presets: { type: Array as () => PresetColor[], default: () => defaultPresets },
    disabled: { type: Boolean, default: false },
    trigger: { type: String as () => 'hover' | 'click', default: 'hover' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false)
    const currentColor = computed(() => props.modelValue)

    const containerClass = computed(() => {
      const classes = ['ldesign-color-picker']
      if (props.disabled) classes.push('ldesign-color-picker--disabled')
      return classes.join(' ')
    })

    const selectColor = (color: string) => {
      emit('update:modelValue', color)
      isOpen.value = false
      try {
        defaultThemeManager.applyTheme(color)
      } catch (e) {
        console.warn('Failed to apply theme:', e)
      }
    }

    const handleMouseEnter = () => {
      if (props.trigger === 'hover') isOpen.value = true
    }

    const handleMouseLeave = () => {
      if (props.trigger === 'hover') isOpen.value = false
    }

    const handleClick = () => {
      if (props.trigger === 'click') isOpen.value = !isOpen.value
    }

    return () => (
      <div
        class={containerClass.value}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
      >
        <button
          type="button"
          class="ldesign-color-picker__trigger"
          onClick={handleClick}
          disabled={props.disabled}
        >
          <span
            class="ldesign-color-picker__swatch"
            style={{ backgroundColor: currentColor.value }}
          />
        </button>

        {isOpen.value && (
          <div class="ldesign-color-picker__dropdown">
            <div class="ldesign-color-picker__content">
              <div class="ldesign-color-picker__grid">
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
            </div>
          </div>
        )}
      </div>
    )
  },
})

export default ThemeColorPickerPopover
