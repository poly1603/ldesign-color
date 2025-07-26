import { type InjectionKey, type PropType, type VNode, computed, defineComponent, inject, provide } from 'vue'
import type { ColorGeneratorConfig, GeneratedTheme } from '../types'
import { useColor } from './useColor'

// 为了支持JSX，我们需要声明全局的JSX命名空间
declare global {
  namespace JSX {
    interface Element extends VNode { }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

/**
 * 颜色主题注入键
 */
export const ColorThemeKey: InjectionKey<{
  theme: GeneratedTheme | null
  loading: boolean
  error: string | null
  generateTheme: () => Promise<void>
  updateColor: (color: string) => void
}> = Symbol('ColorTheme')

/**
 * 颜色提供者组件
 * 为子组件提供颜色主题上下文
 */
export const ColorProvider = defineComponent({
  name: 'ColorProvider',
  props: {
    /**
     * 主色调
     */
    primaryColor: {
      type: String,
      required: true,
    },
    /**
     * 颜色生成器配置
     */
    config: {
      type: Object as PropType<ColorGeneratorConfig>,
      default: () => ({}),
    },
    /**
     * 是否显示加载状态
     */
    showLoading: {
      type: Boolean,
      default: true,
    },
    /**
     * 加载文本
     */
    loadingText: {
      type: String,
      default: '正在生成主题...',
    },
    /**
     * 错误文本前缀
     */
    errorPrefix: {
      type: String,
      default: '主题生成失败：',
    },
  },
  setup(props, { slots }) {
    const primaryColorRef = computed(() => props.primaryColor)

    const {
      theme,
      loading,
      error,
      generateTheme,
    } = useColor(primaryColorRef, props.config)

    /**
     * 更新颜色
     */
    const updateColor = (_color: string) => {
      // 这里可以通过直接调用生成器来更新颜色
      // 或者通过emit事件让父组件更新primaryColor prop
    }

    // 提供主题上下文
    provide(ColorThemeKey, {
      theme: theme.value,
      loading: loading.value,
      error: error.value,
      generateTheme,
      updateColor,
    })

    return () => (
      <div class="ldesign-color-provider">
        {/* 加载状态 */}
        {props.showLoading && loading.value && (
          <div class="ldesign-color-loading">
            <div class="ldesign-color-loading__spinner"></div>
            <span class="ldesign-color-loading__text">{props.loadingText}</span>
          </div>
        )}

        {/* 错误状态 */}
        {error.value && (
          <div class="ldesign-color-error">
            <span class="ldesign-color-error__text">
              {props.errorPrefix}
              {error.value}
            </span>
          </div>
        )}

        {/* 子组件 */}
        {slots.default?.()}
      </div>
    )
  },
})

/**
 * 使用颜色主题Hook
 */
export function useColorTheme() {
  const colorTheme = inject(ColorThemeKey)

  if (!colorTheme) {
    throw new Error('useColorTheme must be used within ColorProvider')
  }

  return colorTheme
}

/**
 * 颜色选择器组件
 */
export const ColorPicker = defineComponent({
  name: 'ColorPicker',
  props: {
    /**
     * 当前颜色值
     */
    modelValue: {
      type: String,
      default: '#1890ff',
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 预设颜色
     */
    presetColors: {
      type: Array as PropType<string[]>,
      default: () => [
        '#1890ff',
        '#722ed1',
        '#13c2c2',
        '#52c41a',
        '#faad14',
        '#f5222d',
        '#fa541c',
        '#eb2f96',
      ],
    },
    /**
     * 是否显示预设颜色
     */
    showPresets: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const handleColorChange = (color: string) => {
      emit('update:modelValue', color)
      emit('change', color)
    }

    const handlePresetClick = (color: string) => {
      handleColorChange(color)
    }

    return () => (
      <div class="ldesign-color-picker">
        {/* 颜色输入框 */}
        <div class="ldesign-color-picker__input">
          <input
            type="color"
            value={props.modelValue}
            disabled={props.disabled}
            onChange={e => handleColorChange((e.target as HTMLInputElement).value)}
            class="ldesign-color-picker__color-input"
          />
          <input
            type="text"
            value={props.modelValue}
            disabled={props.disabled}
            onChange={e => handleColorChange((e.target as HTMLInputElement).value)}
            placeholder="请输入颜色值"
            class="ldesign-color-picker__text-input"
          />
        </div>

        {/* 预设颜色 */}
        {props.showPresets && (
          <div class="ldesign-color-picker__presets">
            <div class="ldesign-color-picker__presets-title">预设颜色</div>
            <div class="ldesign-color-picker__presets-list">
              {props.presetColors.map(color => (
                <div
                  key={color}
                  class={[
                    'ldesign-color-picker__preset-item',
                    { 'is-active': color === props.modelValue },
                  ]}
                  style={{ backgroundColor: color }}
                  onClick={() => !props.disabled && handlePresetClick(color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  },
})

/**
 * 颜色色阶展示组件
 */
export const ColorPalette = defineComponent({
  name: 'ColorPalette',
  props: {
    /**
     * 颜色名称
     */
    colorName: {
      type: String,
      required: true,
    },
    /**
     * 颜色色阶数组
     */
    colors: {
      type: Array as PropType<string[]>,
      required: true,
    },
    /**
     * 是否显示颜色值
     */
    showValues: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否可点击复制
     */
    copyable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['colorClick'],
  setup(props, { emit }) {
    const handleColorClick = (color: string, index: number) => {
      if (props.copyable) {
        // 复制到剪贴板
        navigator.clipboard?.writeText(color).then(() => {
          console.log(`已复制颜色: ${color}`)
        })
      }
      emit('colorClick', { color, index })
    }

    return () => (
      <div class="ldesign-color-palette">
        <div class="ldesign-color-palette__title">{props.colorName}</div>
        <div class="ldesign-color-palette__colors">
          {props.colors.map((color, index) => (
            <div
              key={index}
              class="ldesign-color-palette__color-item"
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color, index)}
              title={props.copyable ? `点击复制 ${color}` : color}
            >
              {props.showValues && (
                <span class="ldesign-color-palette__color-value">
                  {color}
                </span>
              )}
              <span class="ldesign-color-palette__color-index">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  },
})

/**
 * 主题预览组件
 */
export const ThemePreview = defineComponent({
  name: 'ThemePreview',
  setup() {
    const { theme, loading } = useColorTheme()

    return () => {
      if (loading) {
        return <div class="ldesign-theme-preview__loading">加载中...</div>
      }

      if (!theme) {
        return <div class="ldesign-theme-preview__empty">暂无主题数据</div>
      }

      return (
        <div class="ldesign-theme-preview">
          <div class="ldesign-theme-preview__section">
            <h3>语义化颜色</h3>
            <div class="ldesign-theme-preview__semantic-colors">
              {Object.entries(theme.semanticColors).map(([name, color]) => (
                <div key={name} class="ldesign-theme-preview__semantic-item">
                  <div
                    class="ldesign-theme-preview__color-block"
                    style={{ backgroundColor: color as string }}
                  />
                  <div class="ldesign-theme-preview__color-info">
                    <div class="ldesign-theme-preview__color-name">{name}</div>
                    <div class="ldesign-theme-preview__color-value">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="ldesign-theme-preview__section">
            <h3>明亮模式色阶</h3>
            {Object.entries(theme.palettes.light).map(([name, colors]) => (
              <ColorPalette
                key={name}
                colorName={name}
                colors={colors as string[]}
              />
            ))}
          </div>

          <div class="ldesign-theme-preview__section">
            <h3>暗黑模式色阶</h3>
            {Object.entries(theme.palettes.dark).map(([name, colors]) => (
              <ColorPalette
                key={name}
                colorName={name}
                colors={colors as string[]}
              />
            ))}
          </div>
        </div>
      )
    }
  },
})
