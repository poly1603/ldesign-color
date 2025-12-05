/**
 * ThemeColorPicker 组件
 * 主题颜色选择器组件 - TSX 版本
 * 采用卡片网格布局，与其他选择器保持一致
 */
// @ts-nocheck - Vue JSX 类型定义与实际使用存在差异，禁用类型检查以避免误报
import { defineComponent, onMounted, onUnmounted, ref, type PropType, Transition } from 'vue'
import { Palette } from 'lucide-vue-next'
import { ThemeManager } from '@ldesign/color-core'
import './ThemeColorPicker.css'

export interface ThemeColorPickerProps {
  /** 翻译函数 */
  translate?: (key: string) => string
}

/** 预设颜色配置 */
const PRESET_COLORS = [
  { name: 'blue', color: '#1890ff', label: '蓝色', description: '经典蓝，专业稳重' },
  { name: 'purple', color: '#722ed1', label: '紫色', description: '神秘优雅，富有创意' },
  { name: 'cyan', color: '#13c2c2', label: '青色', description: '清新自然，充满活力' },
  { name: 'green', color: '#52c41a', label: '绿色', description: '生机勃勃，健康环保' },
  { name: 'magenta', color: '#eb2f96', label: '品红', description: '热情浪漫，时尚前卫' },
  { name: 'red', color: '#f5222d', label: '红色', description: '热烈奔放，充满激情' },
  { name: 'orange', color: '#fa8c16', label: '橙色', description: '温暖活泼，积极向上' },
  { name: 'gold', color: '#faad14', label: '金色', description: '高贵典雅，富有质感' },
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

    // 主题管理器
    const themeManager = new ThemeManager()

    /**
     * 切换下拉菜单
     */
    const toggleDropdown = (e: MouseEvent) => {
      e.stopPropagation() // 阻止事件冒泡
      isOpen.value = !isOpen.value
    }

    /**
     * 选择颜色
     */
    const selectColor = (color: string) => {
      currentColor.value = color
      themeManager.applyTheme(color)
    }

    /**
     * 点击外部关闭下拉菜单
     */
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.ld-theme-color-picker')) {
        isOpen.value = false
      }
    }

    // 生命周期(延迟添加事件监听,避免与按钮点击冲突)
    onMounted(() => {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)

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
          class="color-button"
          title={props.translate?.('theme.selectThemeColor') || '选择主题色'}
          onClick={toggleDropdown}
          style={{ color: currentColor.value }}
        >
          <Palette size={18} strokeWidth={2} />
        </button>

        <Transition name="dropdown">
          {isOpen.value && (
            <div class="color-dropdown" onClick={(e: MouseEvent) => e.stopPropagation()}>
              <div class="dropdown-header">
                <span class="dropdown-title">主题色</span>
              </div>
              <div class="dropdown-content">
                <div class="color-grid">
                  {PRESET_COLORS.map(preset => (
                    <div
                      key={preset.name}
                      class={['color-card', { active: currentColor.value === preset.color }]}
                      onClick={() => selectColor(preset.color)}
                    >
                      <span class="card-color" style={{ backgroundColor: preset.color }} />
                      <div class="card-info">
                        <span class="card-name">{props.translate?.(`theme.presets.${preset.name}`) || preset.label}</span>
                        <span class="card-description">{preset.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  }
})

export default ThemeColorPicker

