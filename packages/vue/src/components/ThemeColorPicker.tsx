/**
 * ThemeColorPicker 组件
 * 主题颜色选择器组件 - TSX 版本
 */
import { computed, defineComponent, onMounted, onUnmounted, ref, Teleport, type PropType } from 'vue'
import { ThemeManager } from '@ldesign/color-core'
import './ThemeColorPicker.css'

export interface ThemeColorPickerProps {
  /** 翻译函数 */
  translate?: (key: string) => string
}

/** 预设颜色配置 */
const PRESET_COLORS = [
  { name: 'blue', color: '#1890ff' },
  { name: 'purple', color: '#722ed1' },
  { name: 'cyan', color: '#13c2c2' },
  { name: 'green', color: '#52c41a' },
  { name: 'magenta', color: '#eb2f96' },
  { name: 'red', color: '#f5222d' },
  { name: 'orange', color: '#fa8c16' },
  { name: 'gold', color: '#faad14' },
]

/**
 * 主题颜色选择器组件
 * 
 * @example
 * ```tsx
 * <ThemeColorPicker translate={t} />
 * ```
 */
export const ThemeColorPicker = defineComponent({
  name: 'ThemeColorPicker',

  props: {
    translate: {
      type: Function as PropType<(key: string) => string>,
      required: false
    }
  },

  setup(props) {
    // 状态
    const isOpen = ref(false)
    const currentColor = ref('#1890ff')
    const triggerRef = ref<HTMLElement>()
    const dropdownRef = ref<HTMLElement>()

    // 主题管理器
    const themeManager = new ThemeManager()

    // 下拉框位置
    const dropdownStyle = computed(() => {
      if (!triggerRef.value) return {}

      const rect = triggerRef.value.getBoundingClientRect()
      const dropdownWidth = 320
      const gap = 8

      return {
        position: 'fixed',
        top: `${rect.bottom + gap}px`,
        left: `${rect.left}px`,
        minWidth: `${dropdownWidth}px`,
        zIndex: 1000,
      }
    })

    // 切换下拉框
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    // 选择颜色
    const selectColor = (color: string) => {
      currentColor.value = color
      themeManager.applyTheme(color)
      isOpen.value = false
    }

    // 处理颜色输入
    const handleColorInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      selectColor(target.value)
    }

    // 处理 HEX 输入
    const handleHexInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const value = target.value.trim()

      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        selectColor(value)
      }
    }

    // 点击外部关闭
    const handleClickOutside = (e: MouseEvent) => {
      if (!triggerRef.value || !dropdownRef.value) return

      const target = e.target as Node
      if (!triggerRef.value.contains(target) && !dropdownRef.value.contains(target)) {
        isOpen.value = false
      }
    }

    // 生命周期
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)

      // 恢复保存的主题
      const theme = themeManager.getCurrentTheme()
      if (theme) {
        currentColor.value = theme.primaryColor
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      themeManager.destroy()
    })

    return () => (
      <div class="ld-theme-color-picker">
        <button
          ref={triggerRef}
          class="picker-trigger"
          title={props.translate?.('theme.selectThemeColor') || 'Select theme color'}
          onClick={toggleDropdown}
        >
          <span class="color-preview" style={{ backgroundColor: currentColor.value }} />
          <span class="icon">🎨</span>
        </button>

        <Teleport to="body">
          {isOpen.value && (
            <div
              ref={dropdownRef}
              class="picker-dropdown"
              style={dropdownStyle.value}
            >
              <div class="picker-content">
                {/* 预设颜色 */}
                <div class="preset-colors">
                  <div class="section-title">
                    {props.translate?.('theme.presetColors') || 'Preset Colors'}
                  </div>
                  <div class="color-grid">
                    {PRESET_COLORS.map(preset => (
                      <button
                        key={preset.name}
                        class={['color-item', { active: currentColor.value === preset.color }]}
                        title={props.translate?.(`theme.presets.${preset.name}`) || preset.name}
                        style={{ backgroundColor: preset.color }}
                        onClick={() => selectColor(preset.color)}
                      />
                    ))}
                  </div>
                </div>

                {/* 自定义颜色 */}
                <div class="custom-color">
                  <div class="section-title">
                    {props.translate?.('theme.customColor') || 'Custom Color'}
                  </div>
                  <div class="color-input-group">
                    <input
                      type="color"
                      value={currentColor.value}
                      onInput={handleColorInput}
                    />
                    <input
                      type="text"
                      value={currentColor.value}
                      placeholder="#1890ff"
                      onInput={handleHexInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Teleport>
      </div>
    )
  }
})

export default ThemeColorPicker

