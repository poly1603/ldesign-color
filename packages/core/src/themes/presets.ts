/**
 * 预设主题配置
 */

import type { PresetThemeName } from '../types'

export interface PresetTheme {
  name: string
  label: string
  color: string
  description?: string
  order?: number
  /** 是否为用户自定义主题 */
  custom?: boolean
}

export type { PresetThemeName }

export const presetThemes: PresetTheme[] = [
  // 品牌色
  {
    name: 'blue',
    label: '拂晓蓝',
    color: '#1890ff',
    description: '包容、科技、普惠',
    order: 1,
  },
  {
    name: 'purple',
    label: '酱紫',
    color: '#722ed1',
    description: '优雅、创新、独特',
    order: 2,
  },
  {
    name: 'cyan',
    label: '明青',
    color: '#13c2c2',
    description: '清新、效率、科技',
    order: 3,
  },
  {
    name: 'green',
    label: '极光绿',
    color: '#52c41a',
    description: '生命、健康、希望',
    order: 4,
  },
  {
    name: 'magenta',
    label: '法式洋红',
    color: '#eb2f96',
    description: '活力、激情、创意',
    order: 5,
  },
  {
    name: 'red',
    label: '薄暮红',
    color: '#f5222d',
    description: '热情、力量、决心',
    order: 6,
  },
  {
    name: 'orange',
    label: '日暮橙',
    color: '#fa8c16',
    description: '温暖、活泼、创造',
    order: 7,
  },
  {
    name: 'yellow',
    label: '日出黄',
    color: '#fadb14',
    description: '阳光、希望、活力',
    order: 8,
  },
  {
    name: 'volcano',
    label: '火山橙',
    color: '#fa541c',
    description: '激情、能量、热烈',
    order: 9,
  },
  {
    name: 'geekblue',
    label: '极客蓝',
    color: '#2f54eb',
    description: '专业、科技、创新',
    order: 10,
  },
  {
    name: 'lime',
    label: '青柠绿',
    color: '#a0d911',
    description: '自然、生机、清新',
    order: 11,
  },
  {
    name: 'gold',
    label: '金盏花',
    color: '#faad14',
    description: '贵重、荣耀、财富',
    order: 12,
  },
  // 中性色
  {
    name: 'gray',
    label: '中性灰',
    color: '#8c8c8c',
    description: '稳重、专业、平衡',
    order: 13,
  },
  // 深色主题色
  {
    name: 'dark-blue',
    label: '深海蓝',
    color: '#1e3a8a',
    description: '深邃、神秘、专业',
    order: 14,
  },
  {
    name: 'dark-green',
    label: '森林绿',
    color: '#166534',
    description: '自然、成熟、稳重',
    order: 15,
  },
]

/**
 * 根据名称获取预设主题
 */
export function getPresetTheme(name: string): PresetTheme | undefined {
  return presetThemes.find(theme => theme.name === name)
}

/**
 * 获取预设主题的颜色值
 */
export function getPresetColor(name: string): string | undefined {
  return getPresetTheme(name)?.color
}

/**
 * 获取所有预设主题的名称列表
 */
export function getPresetNames(): string[] {
  return presetThemes.map(theme => theme.name)
}

/**
 * 获取预设主题分组
 */
export function getPresetGroups() {
  const brandColors = presetThemes.slice(0, 12)
  const neutralColors = presetThemes.slice(12, 13)
  const darkColors = presetThemes.slice(13)

  return {
    brand: brandColors,
    neutral: neutralColors,
    dark: darkColors,
  }
}

/**
 * 按 order 字段排序预设主题
 *
 * @param presets - 预设主题数组
 * @returns 排序后的预设主题数组
 *
 * @example
 * ```ts
 * const sorted = sortPresets(presets)
 * // 按 order 升序排列，没有 order 的排在后面
 * ```
 */
export function sortPresets(presets: PresetTheme[]): PresetTheme[] {
  return [...presets].sort((a, b) => {
    // 如果都有 order，按 order 升序排列
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    // 如果只有 a 有 order，a 排在前面
    if (a.order !== undefined) {
      return -1
    }
    // 如果只有 b 有 order，b 排在前面
    if (b.order !== undefined) {
      return 1
    }
    // 都没有 order，保持原始顺序
    return 0
  })
}

/**
 * 合并内置预设和自定义预设
 *
 * 合并规则：
 * 1. 如果自定义预设的 name 与内置预设重复，自定义预设覆盖内置预设
 * 2. 最终预设列表 = 内置预设 + 自定义预设（去重后按 order 排序）
 *
 * @param customPresets - 自定义预设数组
 * @returns 合并并排序后的预设数组
 *
 * @example
 * ```ts
 * const merged = mergePresets([
 *   {
 *     name: 'brand-primary',
 *     label: '品牌主色',
 *     color: '#FF6B6B',
 *     description: '公司品牌主色调',
 *     order: 1,
 *     custom: true,
 *   },
 * ])
 * // 返回：[自定义预设, ...内置预设]（按 order 排序）
 * ```
 */
export function mergePresets(customPresets: PresetTheme[] = []): PresetTheme[] {
  // 创建一个 Map 用于去重，key 为 name
  const presetsMap = new Map<string, PresetTheme>()

  // 1. 先添加内置预设
  for (const preset of presetThemes) {
    presetsMap.set(preset.name, preset)
  }

  // 2. 添加自定义预设（会覆盖同名的内置预设）
  for (const preset of customPresets) {
    presetsMap.set(preset.name, {
      ...preset,
      custom: preset.custom !== undefined ? preset.custom : true, // 默认标记为自定义
    })
  }

  // 3. 转换为数组并排序
  const mergedPresets = Array.from(presetsMap.values())
  return sortPresets(mergedPresets)
}
