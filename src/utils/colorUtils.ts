import Color from 'color'
import convert from 'color-convert'
import type {
  ColorAnalysis,
  ColorContrast,
  ColorFormat,
  HSLColor,
  HSVColor,
  RGBColor,
} from '../types'

/**
 * 将HSL颜色转换为十六进制
 */
export function hslToHex(hsl: HSLColor): string {
  const [h, s, l] = hsl
  try {
    const hex = convert.hsl.hex([h, s, l])
    return ensureHashPrefix(hex)
  }
 catch (error) {
    console.warn('HSL to Hex conversion failed:', hsl, error)
    // 使用Color库作为备选方案
    return Color.hsl(h, s, l).hex()
  }
}

/**
 * 将十六进制颜色转换为HSL
 */
export function hexToHsl(hex: string): HSLColor {
  const cleanHex = hex.replace('#', '')
  return convert.hex.hsl(cleanHex) as HSLColor
}

/**
 * 将十六进制颜色转换为RGB
 */
export function hexToRgb(hex: string): RGBColor {
  const cleanHex = hex.replace('#', '')
  return convert.hex.rgb(cleanHex) as RGBColor
}

/**
 * 将十六进制颜色转换为HSV
 */
export function hexToHsv(hex: string): HSVColor {
  const cleanHex = hex.replace('#', '')
  return convert.hex.hsv(cleanHex) as HSVColor
}

/**
 * 将RGB颜色转换为十六进制
 */
export function rgbToHex(rgb: RGBColor): string {
  return `#${convert.rgb.hex(rgb)}`
}

/**
 * 将HSV颜色转换为十六进制
 */
export function hsvToHex(hsv: HSVColor): string {
  return `#${convert.hsv.hex(hsv)}`
}

/**
 * 格式化颜色输出
 */
export function formatColor(color: string, format: ColorFormat): string {
  const colorObj = Color(color)

  switch (format) {
    case 'hex':
      return colorObj.hex()
    case 'rgb':
      return colorObj.rgb().string()
    case 'hsl':
      return colorObj.hsl().string()
    case 'hsv':
      return colorObj.hsv().string()
    default:
      return colorObj.hex()
  }
}

/**
 * 验证颜色字符串是否有效
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false
  }

  try {
    Color(color)
    return true
  }
  catch {
    return false
  }
}

/**
 * 计算颜色亮度
 */
export function getLuminance(color: string): number {
  return Color(color).luminosity()
}

/**
 * 判断颜色是否为深色
 */
export function isDarkColor(color: string): boolean {
  return getLuminance(color) < 0.5
}

/**
 * 计算两个颜色的对比度
 */
export function getContrast(color1: string, color2: string): number {
  return Color(color1).contrast(Color(color2))
}

/**
 * 获取颜色对比度信息
 */
export function getContrastInfo(color1: string, color2: string): ColorContrast {
  const ratio = getContrast(color1, color2)
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
  }
}

/**
 * 分析颜色信息
 */
export function analyzeColor(color: string): ColorAnalysis {
  const colorObj = Color(color)
  const hsl = hexToHsl(colorObj.hex())
  const rgb = hexToRgb(colorObj.hex())
  const hsv = hexToHsv(colorObj.hex())
  const luminance = getLuminance(color)
  const isDark = isDarkColor(color)

  return {
    color: colorObj.hex(),
    hsl,
    rgb,
    hsv,
    luminance,
    isDark,
    contrastWithWhite: getContrastInfo(color, '#ffffff'),
    contrastWithBlack: getContrastInfo(color, '#000000'),
  }
}

/**
 * 混合两个颜色
 */
export function mixColors(color1: string, color2: string, ratio: number = 0.5): string {
  return Color(color1).mix(Color(color2), ratio).hex()
}

/**
 * 调整颜色亮度
 */
export function adjustLightness(color: string, amount: number): string {
  return Color(color).lightness(amount).hex()
}

/**
 * 调整颜色饱和度
 */
export function adjustSaturation(color: string, amount: number): string {
  return Color(color).saturationv(amount).hex()
}

/**
 * 调整颜色色相
 */
export function adjustHue(color: string, amount: number): string {
  return Color(color).hue(amount).hex()
}

/**
 * 生成颜色的补色
 */
export function getComplementaryColor(color: string): string {
  const hsl = hexToHsl(color)
  const complementaryHue = (hsl[0] + 180) % 360
  return hslToHex([complementaryHue, hsl[1], hsl[2]])
}

/**
 * 生成颜色的类似色
 */
export function getAnalogousColors(color: string, count: number = 2): string[] {
  const hsl = hexToHsl(color)
  const colors: string[] = []
  const step = 30 // 30度间隔

  for (let i = 1; i <= count; i++) {
    const hue1 = (hsl[0] + step * i) % 360
    const hue2 = (hsl[0] - step * i + 360) % 360
    colors.push(hslToHex([hue1, hsl[1], hsl[2]]))
    if (colors.length < count) {
      colors.push(hslToHex([hue2, hsl[1], hsl[2]]))
    }
  }

  return colors.slice(0, count)
}

/**
 * 清理颜色字符串
 */
export function cleanColorString(color: string): string {
  return color.replace(/[^A-Z0-9#]/gi, '')
}

/**
 * 确保颜色字符串以#开头
 */
export function ensureHashPrefix(color: string): string {
  const cleaned = cleanColorString(color)
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`
}

/**
 * 生成随机颜色
 */
export function generateRandomColor(): string {
  try {
    // 直接生成随机十六进制颜色，更简单可靠
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    return `#${randomHex}`
  }
 catch (error) {
    console.warn('Random color generation failed, using fallback:', error)
    // 备选方案：生成固定的随机颜色
    const fallbackColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5']
    return fallbackColors[Math.floor(Math.random() * fallbackColors.length)]
  }
}

/**
 * 批量转换颜色格式
 */
export function batchFormatColors(colors: string[], format: ColorFormat): string[] {
  return colors.map(color => formatColor(color, format))
}

/**
 * 获取颜色的RGB字符串（用于CSS变量）
 */
export function getRgbString(color: string): string {
  const rgb = hexToRgb(color)
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`
}
