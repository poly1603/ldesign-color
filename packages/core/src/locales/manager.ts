/**
 * Color 包的多语言管理器
 * 
 * 支持外部 i18n 注入 + 内置 fallback
 * 
 * @module locales/manager
 */

import * as locales from './index'
import type { ColorLocale } from './index'

/**
 * 支持的语言键
 */
export type LocaleKey = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR' | 'de-DE' | 'fr-FR' | 'es-ES' | 'it-IT' | 'pt-BR' | 'ru-RU'

/**
 * 外部 i18n 实例接口
 */
export interface ExternalI18n {
  /** 获取当前语言 */
  getLocale?: () => string
  /** 翻译函数 */
  t: (key: string, ...args: any[]) => string
  /** 检查翻译键是否存在 */
  has?: (key: string) => boolean
}

/**
 * Color 多语言管理器
 * 
 * 设计原则：
 * 1. 优先使用外部 i18n（如果有）
 * 2. 外部 i18n 不存在或翻译失败时，使用内置 locales
 * 3. 支持动态切换语言
 * 
 * @example
 * ```typescript
 * const manager = new ColorLocaleManager()
 * 
 * // 设置外部 i18n
 * manager.setExternalI18n(i18nInstance)
 * 
 * // 设置当前语言
 * manager.setLocale('zh-CN')
 * 
 * // 获取翻译
 * const text = manager.t('theme.blue') // '蓝色'
 * ```
 */
export class ColorLocaleManager {
  /** 内置的语言包 */
  private builtInLocales: Record<string, ColorLocale> = {
    'zh-CN': locales.zhCN,
    'en-US': locales.enUS,
    'ja-JP': locales.jaJP,
    'ko-KR': locales.koKR,
    'de-DE': locales.deDE,
    'fr-FR': locales.frFR,
    'es-ES': locales.esES,
    'it-IT': locales.itIT,
    'pt-BR': locales.ptBR,
    'ru-RU': locales.ruRU,
  }

  /** 外部 i18n 实例 */
  private externalI18n: ExternalI18n | null = null

  /** 当前语言 */
  private currentLocale: LocaleKey = 'zh-CN'

  /** 回退语言 */
  private fallbackLocale: LocaleKey = 'en-US'

  /**
   * 创建多语言管理器
   * @param locale - 初始语言
   * @param fallbackLocale - 回退语言
   */
  constructor(locale: LocaleKey = 'zh-CN', fallbackLocale: LocaleKey = 'en-US') {
    this.currentLocale = locale
    this.fallbackLocale = fallbackLocale
  }

  /**
   * 设置外部 i18n 实例
   * @param i18n - 外部 i18n 实例
   */
  setExternalI18n(i18n: ExternalI18n | null): void {
    this.externalI18n = i18n
  }

  /**
   * 设置当前语言
   * @param locale - 语言代码
   */
  setLocale(locale: string): void {
    // 规范化语言代码
    const normalizedLocale = this.normalizeLocale(locale)
    if (this.builtInLocales[normalizedLocale]) {
      this.currentLocale = normalizedLocale as LocaleKey
    }
  }

  /**
   * 获取当前语言
   * @returns 当前语言代码
   */
  getLocale(): LocaleKey {
    return this.currentLocale
  }

  /**
   * 获取翻译文本
   * 
   * 优先使用外部 i18n，不存在时使用内置
   * 
   * @param key - 翻译键，支持嵌套路径（如 'theme.blue'）
   * @returns 翻译后的文本
   */
  t(key: string): string {
    // 1. 尝试使用外部 i18n
    if (this.externalI18n) {
      try {
        // 为 color 包的翻译键添加命名空间前缀
        const namespacedKey = `color.${key}`

        // 检查外部 i18n 是否有此翻译
        if (this.externalI18n.has && !this.externalI18n.has(namespacedKey)) {
          // 外部 i18n 没有此翻译，使用内置
          return this.getBuiltInTranslation(key)
        }

        const translation = this.externalI18n.t(namespacedKey)

        // 如果翻译结果就是键本身，说明翻译不存在
        if (translation && translation !== namespacedKey) {
          return translation
        }
      } catch (error) {
        console.warn('[ColorLocaleManager] External i18n translation failed:', error)
      }
    }

    // 2. 使用内置 locales
    return this.getBuiltInTranslation(key)
  }

  /**
   * 从内置 locales 获取翻译
   * @param key - 翻译键
   * @returns 翻译后的文本
   */
  private getBuiltInTranslation(key: string): string {
    // 尝试当前语言
    const currentLocaleData = this.builtInLocales[this.currentLocale]
    if (currentLocaleData) {
      const value = this.getNestedValue(currentLocaleData, key)
      if (value) return value
    }

    // 尝试回退语言
    const fallbackLocaleData = this.builtInLocales[this.fallbackLocale]
    if (fallbackLocaleData) {
      const value = this.getNestedValue(fallbackLocaleData, key)
      if (value) return value
    }

    // 都没有，返回键本身
    return key
  }

  /**
   * 获取嵌套对象的值
   * @param obj - 对象
   * @param path - 路径（如 'theme.blue'）
   * @returns 值或 undefined
   */
  private getNestedValue(obj: any, path: string): string | undefined {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return undefined
      }
    }

    return typeof current === 'string' ? current : undefined
  }

  /**
   * 规范化语言代码
   *
   * 将各种格式的语言代码转换为标准格式
   *
   * @param locale - 语言代码（如 'zh-cn', 'zh_CN', 'zhCN'）
   * @returns 规范化的语言代码（如 'zh-CN'）
   */
  private normalizeLocale(locale: string): string {
    // 转换为小写
    const lower = locale.toLowerCase()

    // 映射表
    const mapping: Record<string, string> = {
      'zh-cn': 'zh-CN',
      'zh_cn': 'zh-CN',
      'zhcn': 'zh-CN',
      'zh': 'zh-CN',
      'en-us': 'en-US',
      'en_us': 'en-US',
      'enus': 'en-US',
      'en': 'en-US',
      'ja-jp': 'ja-JP',
      'ja_jp': 'ja-JP',
      'jajp': 'ja-JP',
      'ja': 'ja-JP',
      'ko-kr': 'ko-KR',
      'ko_kr': 'ko-KR',
      'kokr': 'ko-KR',
      'ko': 'ko-KR',
      'de-de': 'de-DE',
      'de_de': 'de-DE',
      'dede': 'de-DE',
      'de': 'de-DE',
      'fr-fr': 'fr-FR',
      'fr_fr': 'fr-FR',
      'frfr': 'fr-FR',
      'fr': 'fr-FR',
      'es-es': 'es-ES',
      'es_es': 'es-ES',
      'eses': 'es-ES',
      'es': 'es-ES',
      'it-it': 'it-IT',
      'it_it': 'it-IT',
      'itit': 'it-IT',
      'it': 'it-IT',
      'pt-br': 'pt-BR',
      'pt_br': 'pt-BR',
      'ptbr': 'pt-BR',
      'pt': 'pt-BR',
      'ru-ru': 'ru-RU',
      'ru_ru': 'ru-RU',
      'ruru': 'ru-RU',
      'ru': 'ru-RU',
    }

    return mapping[lower] || locale
  }

  /**
   * 获取所有支持的语言列表
   * @returns 语言代码数组
   */
  getSupportedLocales(): LocaleKey[] {
    return Object.keys(this.builtInLocales) as LocaleKey[]
  }

  /**
   * 检查是否支持某个语言
   * @param locale - 语言代码
   * @returns 是否支持
   */
  isSupported(locale: string): boolean {
    const normalized = this.normalizeLocale(locale)
    return normalized in this.builtInLocales
  }
}

/**
 * 创建默认的 ColorLocaleManager 实例
 */
export function createColorLocaleManager(
  locale: LocaleKey = 'zh-CN',
  fallbackLocale: LocaleKey = 'en-US'
): ColorLocaleManager {
  return new ColorLocaleManager(locale, fallbackLocale)
}


