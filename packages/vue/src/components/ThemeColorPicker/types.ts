/**
 * ThemeColorPicker 组件类型定义
 */

export interface PresetColorI18n {
  label: string
  description: string
}

export interface PresetColor {
  name: string
  color: string
  /** 多语言标签和描述 */
  i18n: {
    zh: PresetColorI18n
    en: PresetColorI18n
  }
}

export interface ThemeColorPickerProps {
  /** 当前选中的颜色值 */
  modelValue?: string
  /** 预设颜色列表 */
  presets?: PresetColor[]
  /** 是否禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 翻译函数 */
  translate?: (key: string) => string
  /** 当前语言 */
  locale?: string
  /** 标题 */
  title?: string
}

/** 默认预设颜色 */
export const defaultPresets: PresetColor[] = [
  {
    name: 'blue',
    color: '#1890ff',
    i18n: {
      zh: { label: '拂晓蓝', description: '清新明亮的蓝色，适合科技、商务场景' },
      en: { label: 'Daybreak Blue', description: 'Fresh and bright blue for tech & business' },
    },
  },
  {
    name: 'cyan',
    color: '#13c2c2',
    i18n: {
      zh: { label: '明青', description: '清爽的青色，适合医疗、健康场景' },
      en: { label: 'Cyan', description: 'Refreshing cyan for healthcare & wellness' },
    },
  },
  {
    name: 'green',
    color: '#52c41a',
    i18n: {
      zh: { label: '极光绿', description: '生机勃勃的绿色，适合环保、农业场景' },
      en: { label: 'Aurora Green', description: 'Vibrant green for eco & agriculture' },
    },
  },
  {
    name: 'orange',
    color: '#fa8c16',
    i18n: {
      zh: { label: '日暮', description: '温暖的橙色，适合餐饮、娱乐场景' },
      en: { label: 'Sunset Orange', description: 'Warm orange for food & entertainment' },
    },
  },
  {
    name: 'red',
    color: '#f5222d',
    i18n: {
      zh: { label: '薄暮', description: '热情的红色，适合促销、节日场景' },
      en: { label: 'Dust Red', description: 'Passionate red for promotions & festivals' },
    },
  },
  {
    name: 'purple',
    color: '#722ed1',
    i18n: {
      zh: { label: '酱紫', description: '高贵的紫色，适合奢侈品、艺术场景' },
      en: { label: 'Purple', description: 'Noble purple for luxury & art' },
    },
  },
  {
    name: 'pink',
    color: '#eb2f96',
    i18n: {
      zh: { label: '法式洋红', description: '浪漫的粉色，适合美妆、时尚场景' },
      en: { label: 'Magenta', description: 'Romantic pink for beauty & fashion' },
    },
  },
  {
    name: 'gold',
    color: '#faad14',
    i18n: {
      zh: { label: '金盏花', description: '典雅的金色，适合金融、高端场景' },
      en: { label: 'Gold', description: 'Elegant gold for finance & premium' },
    },
  },
  {
    name: 'volcano',
    color: '#fa541c',
    i18n: {
      zh: { label: '火山', description: '炽热的橙红色，充满活力' },
      en: { label: 'Volcano', description: 'Hot orange-red full of energy' },
    },
  },
  {
    name: 'geekblue',
    color: '#2f54eb',
    i18n: {
      zh: { label: '极客蓝', description: '深邃的蓝色，适合极客、开发者场景' },
      en: { label: 'Geek Blue', description: 'Deep blue for developers & geeks' },
    },
  },
]
