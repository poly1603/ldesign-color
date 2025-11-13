/**
 * @ldesign/color-vue - useColorPalette
 * 
 * 响应式的色彩调色板生成和管理
 */

import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
import { 
  generateThemeColors, 
  Color,
  type ThemeColors,
  type ColorShade,
  type ColorInput,
  type ColorGeneratorOptions,
  type SemanticColors
} from '@ldesign/color-core'

export interface UseColorPaletteOptions extends ColorGeneratorOptions {
  /** 是否实时更新 */
  reactive?: boolean
  /** 防抖延迟（毫秒） */
  debounce?: number
}

export interface UseColorPaletteReturn {
  /** 主色调 */
  primaryColor: Ref<string>
  /** 完整主题色彩 */
  themeColors: ComputedRef<ThemeColors>
  /** 亮色模式调色板 */
  lightPalette: ComputedRef<SemanticColors>
  /** 暗色模式调色板 */
  darkPalette: ComputedRef<SemanticColors>
  /** 获取特定色调和色阶 */
  getColor: (type: keyof SemanticColors, shade: ColorShade, mode?: 'light' | 'dark') => string
  /** 更新主色调 */
  setPrimaryColor: (color: ColorInput) => void
  /** 导出为 CSS 变量 */
  toCSSVariables: (options?: { prefix?: string; includeAliases?: boolean }) => string
  /** 导出为 JSON */
  toJSON: () => string
  /** 从 JSON 导入 */
  fromJSON: (json: string) => void
  /** 获取对比色 */
  getContrastColor: (backgroundColor: ColorInput) => 'white' | 'black'
  /** 生成互补色 */
  getComplementaryColor: () => string
  /** 生成类似色 */
  getAnalogousColors: (count?: number) => string[]
  /** 生成三色调和 */
  getTriadicColors: () => [string, string, string]
  /** 生成四色调和 */
  getTetradicColors: () => [string, string, string, string]
}

/**
 * 色彩调色板 Hook
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useColorPalette } from '@ldesign/color-vue'
 * 
 * const { 
 *   primaryColor,
 *   lightPalette, 
 *   darkPalette,
 *   setPrimaryColor,
 *   getColor
 * } = useColorPalette('#1890ff')
 * 
 * // 获取特定颜色
 * const successColor = getColor('success', 500)
 * 
 * // 更新主色调
 * setPrimaryColor('#52c41a')
 * </script>
 * ```
 */
export function useColorPalette(
  initialColor: ColorInput = '#1890ff',
  options: UseColorPaletteOptions = {}
): UseColorPaletteReturn {
  const {
    reactive = true,
    debounce = 300,
    ...generatorOptions
  } = options

  // 主色调状态
  const primaryColor = ref(new Color(initialColor).toHex())
  
  // 防抖定时器
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // 生成主题色彩
  const themeColors = computed(() => {
    if (!reactive && debounceTimer) {
      return generateThemeColors(primaryColor.value, generatorOptions)
    }
    return generateThemeColors(primaryColor.value, generatorOptions)
  })

  // 亮色和暗色模式调色板
  const lightPalette = computed(() => themeColors.value.light)
  const darkPalette = computed(() => themeColors.value.dark)

  // 获取特定色调和色阶
  const getColor = (
    type: keyof SemanticColors, 
    shade: ColorShade, 
    mode: 'light' | 'dark' = 'light'
  ): string => {
    const palette = mode === 'light' ? lightPalette.value : darkPalette.value
    return palette[type][shade]
  }

  // 更新主色调
  const setPrimaryColor = (color: ColorInput) => {
    if (debounce > 0 && reactive) {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      debounceTimer = setTimeout(() => {
        primaryColor.value = new Color(color).toHex()
        debounceTimer = null
      }, debounce)
    } else {
      primaryColor.value = new Color(color).toHex()
    }
  }

  // 导出为 CSS 变量
  const toCSSVariables = (options?: { prefix?: string; includeAliases?: boolean }) => {
    const { generateCSSVariables } = require('@ldesign/color-core')
    return generateCSSVariables(themeColors.value, options)
  }

  // 导出为 JSON
  const toJSON = () => {
    return JSON.stringify({
      primaryColor: primaryColor.value,
      themeColors: themeColors.value,
      options: generatorOptions
    }, null, 2)
  }

  // 从 JSON 导入
  const fromJSON = (json: string) => {
    try {
      const data = JSON.parse(json)
      if (data.primaryColor) {
        primaryColor.value = data.primaryColor
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error)
    }
  }

  // 获取对比色
  const getContrastColor = (backgroundColor: ColorInput): 'white' | 'black' => {
    const color = new Color(backgroundColor)
    return color.isDark() ? 'white' : 'black'
  }

  // 生成互补色
  const getComplementaryColor = (): string => {
    const color = new Color(primaryColor.value)
    const hsl = color.toHSL()
    const complementary = new Color({
      h: (hsl.h + 180) % 360,
      s: hsl.s,
      l: hsl.l
    })
    return complementary.toHex()
  }

  // 生成类似色
  const getAnalogousColors = (count: number = 2): string[] => {
    const color = new Color(primaryColor.value)
    const hsl = color.toHSL()
    const colors: string[] = []
    const step = 30 // 30度步进

    for (let i = 1; i <= count; i++) {
      // 顺时针
      colors.push(new Color({
        h: (hsl.h + step * i) % 360,
        s: hsl.s,
        l: hsl.l
      }).toHex())
      
      // 逆时针
      colors.push(new Color({
        h: (hsl.h - step * i + 360) % 360,
        s: hsl.s,
        l: hsl.l
      }).toHex())
    }

    return colors.slice(0, count)
  }

  // 生成三色调和
  const getTriadicColors = (): [string, string, string] => {
    const color = new Color(primaryColor.value)
    const hsl = color.toHSL()
    
    return [
      primaryColor.value,
      new Color({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }).toHex(),
      new Color({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }).toHex()
    ]
  }

  // 生成四色调和
  const getTetradicColors = (): [string, string, string, string] => {
    const color = new Color(primaryColor.value)
    const hsl = color.toHSL()
    
    return [
      primaryColor.value,
      new Color({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }).toHex(),
      new Color({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }).toHex(),
      new Color({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l }).toHex()
    ]
  }

  // 清理定时器
  watch(() => primaryColor.value, () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  })

  return {
    primaryColor,
    themeColors,
    lightPalette,
    darkPalette,
    getColor,
    setPrimaryColor,
    toCSSVariables,
    toJSON,
    fromJSON,
    getContrastColor,
    getComplementaryColor,
    getAnalogousColors,
    getTriadicColors,
    getTetradicColors
  }
}