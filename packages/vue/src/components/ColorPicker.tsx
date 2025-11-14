/**
 * ColorPicker 组件
 * 颜色选择器组件 - TSX 版本
 */
import { computed, defineComponent, onMounted, ref, Teleport, Transition, watch, type PropType } from 'vue'
import { Color } from '@ldesign/color-core'
import './ColorPicker.css'

export interface ColorPickerProps {
  /** 绑定值 */
  modelValue?: string
  /** 预设颜色 */
  presets?: string[]
  /** 显示最近使用 */
  showRecent?: boolean
  /** 最近使用数量 */
  recentMax?: number
  /** 显示透明度 */
  showAlpha?: boolean
  /** 支持的格式 */
  formats?: ('hex' | 'rgb' | 'hsl')[]
  /** 禁用 */
  disabled?: boolean
  /** 预设标题 */
  presetsTitle?: string
  /** 最近使用标题 */
  recentTitle?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
}

/**
 * 颜色选择器组件
 * 
 * @example
 * ```tsx
 * <ColorPicker modelValue="#1890ff" />
 * ```
 */
export const ColorPicker = defineComponent({
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: '#1890ff'
    },
    presets: {
      type: Array as PropType<string[]>,
      default: () => [
        '#1890ff', '#52c41a', '#faad14', '#f5222d',
        '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'
      ]
    },
    showRecent: {
      type: Boolean,
      default: true
    },
    recentMax: {
      type: Number,
      default: 8
    },
    showAlpha: {
      type: Boolean,
      default: false
    },
    formats: {
      type: Array as PropType<('hex' | 'rgb' | 'hsl')[]>,
      default: () => ['hex', 'rgb', 'hsl']
    },
    disabled: {
      type: Boolean,
      default: false
    },
    presetsTitle: {
      type: String,
      default: '预设颜色'
    },
    recentTitle: {
      type: String,
      default: '最近使用'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },

  emits: {
    'update:modelValue': (value: string) => true,
    'change': (value: string) => true,
    'confirm': (value: string) => true,
    'cancel': () => true
  },

  setup(props, { emit }) {
    // 状态
    const showPicker = ref(false)
    const currentColor = ref(props.modelValue)
    const currentFormat = ref<'hex' | 'rgb' | 'hsl'>('hex')
    const recentColors = ref<string[]>([])
    const dropdownRef = ref<HTMLElement>()
    const saturationRef = ref<HTMLElement>()
    const dropdownStyle = ref({})

    // HSL 值
    const color = computed(() => new Color(currentColor.value))
    const hsl = computed(() => color.value.toHSL())
    const hue = computed(() => hsl.value.h)
    const saturation = computed(() => hsl.value.s)
    const lightness = computed(() => hsl.value.l)
    const alpha = ref(1)

    // 显示值
    const displayValue = computed(() => {
      if (!currentColor.value) return ''
      const c = new Color(currentColor.value)
      switch (currentFormat.value) {
        case 'rgb':
          return c.toRgbString()
        case 'hsl':
          return c.toHslString()
        default:
          return c.toHex()
      }
    })

    // 方法
    const togglePicker = () => {
      if (props.disabled) return
      showPicker.value = !showPicker.value
      if (showPicker.value) {
        updateDropdownPosition()
      }
    }

    const updateDropdownPosition = () => {
      // 简单定位,实际应该计算最佳位置
      dropdownStyle.value = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      }
    }

    const selectColor = (color: string) => {
      currentColor.value = color
      addToRecent(color)
    }

    const addToRecent = (color: string) => {
      const index = recentColors.value.indexOf(color)
      if (index > -1) {
        recentColors.value.splice(index, 1)
      }
      recentColors.value.unshift(color)
      if (recentColors.value.length > props.recentMax) {
        recentColors.value.pop()
      }
      // 保存到 localStorage
      localStorage.setItem('ld-color-picker-recent', JSON.stringify(recentColors.value))
    }

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      try {
        const c = new Color(value)
        currentColor.value = c.toHex()
      }
      catch {
        // 无效颜色,忽略
      }
    }

    const handleBlur = () => {
      // 格式化输入
      try {
        const c = new Color(currentColor.value)
        currentColor.value = c.toHex()
      }
      catch {
        currentColor.value = props.modelValue
      }
    }

    const handleHueChange = (e: Event) => {
      const h = parseInt((e.target as HTMLInputElement).value)
      const c = Color.fromHSL(h, saturation.value, lightness.value)
      currentColor.value = c.toHex()
    }

    const handleAlphaChange = (e: Event) => {
      alpha.value = parseInt((e.target as HTMLInputElement).value) / 100
      // 更新颜色
      const c = new Color(currentColor.value)
      c.alpha = alpha.value
      currentColor.value = c.toRgbaString()
    }

    const handleSaturationMouseDown = (e: MouseEvent) => {
      const rect = saturationRef.value!.getBoundingClientRect()
      const updatePosition = (e: MouseEvent) => {
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
        const s = (x / rect.width) * 100
        const l = 100 - (y / rect.height) * 100
        const c = Color.fromHSL(hue.value, s, l)
        currentColor.value = c.toHex()
      }

      updatePosition(e)

      const handleMouseMove = (e: MouseEvent) => updatePosition(e)
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const confirm = () => {
      emit('update:modelValue', currentColor.value)
      emit('change', currentColor.value)
      emit('confirm', currentColor.value)
      addToRecent(currentColor.value)
      showPicker.value = false
    }

    const cancel = () => {
      currentColor.value = props.modelValue
      emit('cancel')
      showPicker.value = false
    }

    // 生命周期
    onMounted(() => {
      // 从 localStorage 加载最近使用
      const stored = localStorage.getItem('ld-color-picker-recent')
      if (stored) {
        try {
          recentColors.value = JSON.parse(stored)
        }
        catch {
          // 忽略错误
        }
      }
    })

    // 监听值变化
    watch(() => props.modelValue, (val) => {
      currentColor.value = val
    })

    return () => (
      <div class="ld-color-picker">
        {/* 颜色预览和输入 */}
        <div class="ld-color-picker__trigger" onClick={togglePicker}>
          <div
            class="ld-color-picker__preview"
            style={{ backgroundColor: props.modelValue }}
          >
            {!props.modelValue && (
              <span class="ld-color-picker__empty">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="4" y1="20" x2="20" y2="4" stroke-width="2" />
                </svg>
              </span>
            )}
          </div>
          <input
            class="ld-color-picker__input"
            value={displayValue.value}
            onInput={handleInput}
            onBlur={handleBlur}
            placeholder="#000000"
          />
        </div>

        {/* 弹出式选择器 */}
        <Teleport to="body">
          <Transition name="ld-color-picker-fade">
            {showPicker.value && (
              <div
                ref={dropdownRef}
                class="ld-color-picker__dropdown"
                style={dropdownStyle.value}
              >
                {/* 预设颜色 */}
                {props.presets.length > 0 && (
                  <div class="ld-color-picker__presets">
                    <div class="ld-color-picker__section-title">{props.presetsTitle}</div>
                    <div class="ld-color-picker__preset-list">
                      {props.presets.map(color => (
                        <button
                          key={color}
                          class={['ld-color-picker__preset-item', { active: props.modelValue === color }]}
                          style={{ backgroundColor: color }}
                          title={color}
                          onClick={() => selectColor(color)}
                        >
                          {props.modelValue === color && (
                            <span class="ld-color-picker__check">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 最近使用 */}
                {props.showRecent && recentColors.value.length > 0 && (
                  <div class="ld-color-picker__recent">
                    <div class="ld-color-picker__section-title">{props.recentTitle}</div>
                    <div class="ld-color-picker__preset-list">
                      {recentColors.value.map(color => (
                        <button
                          key={color}
                          class="ld-color-picker__preset-item"
                          style={{ backgroundColor: color }}
                          title={color}
                          onClick={() => selectColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 色调选择器 */}
                <div class="ld-color-picker__hue">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue.value}
                    onInput={handleHueChange}
                    class="ld-color-picker__hue-slider"
                  />
                </div>

                {/* 饱和度和亮度选择器 */}
                <div
                  ref={saturationRef}
                  class="ld-color-picker__saturation"
                  style={{ backgroundColor: `hsl(${hue.value}, 100%, 50%)` }}
                  onMousedown={handleSaturationMouseDown}
                >
                  <div class="ld-color-picker__saturation-white"></div>
                  <div class="ld-color-picker__saturation-black"></div>
                  <div
                    class="ld-color-picker__saturation-cursor"
                    style={{
                      left: `${saturation.value}%`,
                      top: `${100 - lightness.value}%`
                    }}
                  />
                </div>

                {/* 透明度选择器 */}
                {props.showAlpha && (
                  <div class="ld-color-picker__alpha">
                    <div class="ld-color-picker__alpha-background"></div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={alpha.value * 100}
                      onInput={handleAlphaChange}
                      class="ld-color-picker__alpha-slider"
                    />
                  </div>
                )}

                {/* 颜色格式切换 */}
                <div class="ld-color-picker__formats">
                  {props.formats.map(format => (
                    <button
                      key={format}
                      class={['ld-color-picker__format-btn', { active: currentFormat.value === format }]}
                      onClick={() => currentFormat.value = format}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* 确认按钮 */}
                <div class="ld-color-picker__actions">
                  <button class="ld-color-picker__btn ld-color-picker__btn--cancel" onClick={cancel}>
                    {props.cancelText}
                  </button>
                  <button class="ld-color-picker__btn ld-color-picker__btn--confirm" onClick={confirm}>
                    {props.confirmText}
                  </button>
                </div>
              </div>
            )}
          </Transition>
        </Teleport>

        {/* 遮罩层 */}
        <Teleport to="body">
          {showPicker.value && (
            <div
              class="ld-color-picker__overlay"
              onClick={cancel}
            />
          )}
        </Teleport>
      </div>
    )
  }
})

export default ColorPicker


