/**
 * PaletteDisplay 组件
 * 调色板展示组件 - TSX 版本
 */
import { computed, defineComponent, ref, Transition, watch, type PropType } from 'vue'
import { Color } from '@ldesign/color-core'
import { useColorPalette } from '../composables/useColorPalette'
import './PaletteDisplay.css'

export interface PaletteDisplayProps {
  /** 初始主色调 */
  primaryColor?: string
  /** 标题 */
  title?: string
  /** 显示模式切换 */
  showModeSwitch?: boolean
  /** 显示导出按钮 */
  showExport?: boolean
  /** 显示色彩和谐 */
  showHarmony?: boolean
  /** 显示 CSS 预览 */
  showCssPreview?: boolean
  /** CSS 变量前缀 */
  cssPrefix?: string
}

/**
 * 调色板展示组件
 * 
 * @example
 * ```tsx
 * <PaletteDisplay primaryColor="#1890ff" title="主题调色板" />
 * ```
 */
export const PaletteDisplay = defineComponent({
  name: 'PaletteDisplay',

  props: {
    primaryColor: {
      type: String,
      default: '#1890ff'
    },
    title: {
      type: String,
      default: '主题调色板'
    },
    showModeSwitch: {
      type: Boolean,
      default: true
    },
    showExport: {
      type: Boolean,
      default: true
    },
    showHarmony: {
      type: Boolean,
      default: true
    },
    showCssPreview: {
      type: Boolean,
      default: false
    },
    cssPrefix: {
      type: String,
      default: 'color'
    }
  },

  emits: {
    'update:primaryColor': (value: string) => true,
    'change': (value: string) => true,
    'export': (data: any) => true
  },

  setup(props, { emit }) {
    // 使用调色板 Hook
    const {
      primaryColor: internalColor,
      lightPalette,
      darkPalette,
      setPrimaryColor,
      toCSSVariables,
      getComplementaryColor,
      getAnalogousColors,
      getTriadicColors,
      getTetradicColors
    } = useColorPalette(props.primaryColor)

    // 状态
    const currentMode = ref<'light' | 'dark'>('light')
    const copiedColor = ref<string | null>(null)
    const primaryInputValue = ref(props.primaryColor)

    // 计算属性
    const currentPalette = computed(() =>
      currentMode.value === 'light' ? lightPalette.value : darkPalette.value
    )

    const complementaryColor = computed(() => getComplementaryColor())
    const analogousColors = computed(() => getAnalogousColors(2))
    const triadicColors = computed(() => getTriadicColors())
    const tetradicColors = computed(() => getTetradicColors())

    const cssVariables = computed(() =>
      toCSSVariables({ prefix: props.cssPrefix, includeAliases: true })
    )

    // 方法
    const getPaletteTitle = (name: string): string => {
      const titles: Record<string, string> = {
        primary: '主色',
        success: '成功',
        warning: '警告',
        danger: '危险',
        gray: '灰色'
      }
      return titles[name] || name
    }

    const toggleMode = () => {
      currentMode.value = currentMode.value === 'light' ? 'dark' : 'light'
    }

    const handlePrimaryChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      primaryInputValue.value = value
      setPrimaryColor(value)
      emit('update:primaryColor', value)
      emit('change', value)
    }

    const handlePrimaryTextChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value
      primaryInputValue.value = value
    }

    const handlePrimaryBlur = () => {
      try {
        const color = new Color(primaryInputValue.value)
        const hex = color.toHex()
        primaryInputValue.value = hex
        setPrimaryColor(hex)
        emit('update:primaryColor', hex)
        emit('change', hex)
      }
      catch {
        // 无效颜色,恢复原值
        primaryInputValue.value = internalColor.value
      }
    }

    const copyColor = async (color: string) => {
      try {
        await navigator.clipboard.writeText(color)
        copiedColor.value = color
        setTimeout(() => {
          copiedColor.value = null
        }, 2000)
      }
      catch (error) {
        console.error('Failed to copy color:', error)
      }
    }

    const copyCssVariables = async () => {
      try {
        await navigator.clipboard.writeText(cssVariables.value)
        // 可以添加提示
      }
      catch (error) {
        console.error('Failed to copy CSS:', error)
      }
    }

    const exportPalette = () => {
      const data = {
        primaryColor: internalColor.value,
        mode: currentMode.value,
        palette: currentPalette.value,
        harmony: {
          complementary: complementaryColor.value,
          analogous: analogousColors.value,
          triadic: triadicColors.value,
          tetradic: tetradicColors.value
        }
      }
      emit('export', data)

      // 下载 JSON 文件
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `palette-${internalColor.value.replace('#', '')}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    // 监听外部主色调变化
    watch(() => props.primaryColor, (val) => {
      primaryInputValue.value = val
      setPrimaryColor(val)
    })

    return () => (
      <div class="ld-palette-display">
        {/* 标题和控制 */}
        <div class="ld-palette-display__header">
          <h3 class="ld-palette-display__title">{props.title}</h3>
          <div class="ld-palette-display__controls">
            {props.showModeSwitch && (
              <button
                onClick={toggleMode}
                class="ld-palette-display__mode-btn"
              >
                {currentMode.value === 'light' ? '🌞' : '🌙'} {currentMode.value === 'light' ? '亮色' : '暗色'}
              </button>
            )}
            {props.showExport && (
              <button
                onClick={exportPalette}
                class="ld-palette-display__export-btn"
              >
                导出
              </button>
            )}
          </div>
        </div>

        {/* 主色调输入 */}
        <div class="ld-palette-display__primary">
          <label class="ld-palette-display__label">主色调</label>
          <div class="ld-palette-display__input-group">
            <input
              type="color"
              value={props.primaryColor}
              onInput={handlePrimaryChange}
              class="ld-palette-display__color-input"
            />
            <input
              type="text"
              value={props.primaryColor}
              onInput={handlePrimaryTextChange}
              onBlur={handlePrimaryBlur}
              class="ld-palette-display__text-input"
              placeholder="#1890ff"
            />
          </div>
        </div>

        {/* 调色板展示 */}
        <div class="ld-palette-display__palettes">
          {Object.entries(currentPalette.value).map(([name, palette]) => (
            <div key={name} class="ld-palette-display__palette">
              <h4 class="ld-palette-display__palette-title">
                {getPaletteTitle(name)}
              </h4>
              <div class="ld-palette-display__shades">
                {Object.entries(palette as Record<string, string>).map(([shade, color]) => (
                  <div
                    key={shade}
                    class="ld-palette-display__shade"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={`点击复制: ${color}`}
                  >
                    <span class="ld-palette-display__shade-label">{shade}</span>
                    <span class="ld-palette-display__shade-value">{color}</span>
                    <Transition name="fade">
                      {copiedColor.value === color && (
                        <span class="ld-palette-display__copied">
                          已复制!
                        </span>
                      )}
                    </Transition>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 色彩和谐展示 */}
        {props.showHarmony && (
          <div class="ld-palette-display__harmony">
            <h4 class="ld-palette-display__section-title">色彩和谐</h4>

            {/* 互补色 */}
            <div class="ld-palette-display__harmony-group">
              <span class="ld-palette-display__harmony-label">互补色</span>
              <div class="ld-palette-display__harmony-colors">
                <div
                  class="ld-palette-display__harmony-color"
                  style={{ backgroundColor: props.primaryColor }}
                  onClick={() => copyColor(props.primaryColor!)}
                  title={props.primaryColor}
                />
                <div
                  class="ld-palette-display__harmony-color"
                  style={{ backgroundColor: complementaryColor.value }}
                  onClick={() => copyColor(complementaryColor.value)}
                  title={complementaryColor.value}
                />
              </div>
            </div>

            {/* 类似色 */}
            <div class="ld-palette-display__harmony-group">
              <span class="ld-palette-display__harmony-label">类似色</span>
              <div class="ld-palette-display__harmony-colors">
                {analogousColors.value.map(color => (
                  <div
                    key={color}
                    class="ld-palette-display__harmony-color"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* 三色调和 */}
            <div class="ld-palette-display__harmony-group">
              <span class="ld-palette-display__harmony-label">三色调和</span>
              <div class="ld-palette-display__harmony-colors">
                {triadicColors.value.map(color => (
                  <div
                    key={color}
                    class="ld-palette-display__harmony-color"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* 四色调和 */}
            <div class="ld-palette-display__harmony-group">
              <span class="ld-palette-display__harmony-label">四色调和</span>
              <div class="ld-palette-display__harmony-colors">
                {tetradicColors.value.map(color => (
                  <div
                    key={color}
                    class="ld-palette-display__harmony-color"
                    style={{ backgroundColor: color }}
                    onClick={() => copyColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CSS 变量预览 */}
        {props.showCssPreview && (
          <div class="ld-palette-display__css">
            <h4 class="ld-palette-display__section-title">CSS 变量</h4>
            <pre class="ld-palette-display__css-code">{cssVariables.value}</pre>
            <button
              onClick={copyCssVariables}
              class="ld-palette-display__copy-css-btn"
            >
              复制 CSS
            </button>
          </div>
        )}
      </div>
    )
  }
})

export default PaletteDisplay


