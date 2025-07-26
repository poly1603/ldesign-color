import type {
  ColorGeneratorConfig,
  GeneratedTheme,
  PerformanceMetrics,
  WorkerMessage,
  WorkerResponse,
} from '../types'
import { CacheKeyGenerator, LRUCache } from '../utils/cacheUtils'
import { ensureHashPrefix, isValidColor } from '../utils/colorUtils'
import { PerformanceMonitor, debounce } from '../utils/performanceUtils'
import { CSSVariableGenerator } from './CSSVariableGenerator'
import { PaletteGenerator } from './PaletteGenerator'
import { SemanticColorGenerator } from './SemanticColorGenerator'

/**
 * 主要的颜色生成器类
 * 整合所有功能，提供高性能的颜色生成服务
 */
export class ColorGenerator {
  private config: Required<ColorGeneratorConfig>
  private semanticGenerator: SemanticColorGenerator
  private paletteGenerator: PaletteGenerator
  private cssGenerator: CSSVariableGenerator
  private cache: LRUCache<any>
  private performanceMonitor: PerformanceMonitor
  private worker: Worker | null = null
  private workerPromises: Map<string, { resolve: Function, reject: Function }> = new Map()

  constructor(config: ColorGeneratorConfig = {}) {
    this.config = {
      enableCache: true,
      cacheSize: 100,
      useWebWorker: false,
      cssPrefix: 'ldesign',
      autoInject: true,
      grayMixPrimary: true,
      grayMixRatio: 0.2,
      ...config,
    }

    this.semanticGenerator = new SemanticColorGenerator()
    this.paletteGenerator = new PaletteGenerator()
    this.cssGenerator = new CSSVariableGenerator(this.config)
    this.cache = new LRUCache(this.config.cacheSize)
    this.performanceMonitor = new PerformanceMonitor()

    // 初始化Web Worker
    if (this.config.useWebWorker && typeof Worker !== 'undefined') {
      this.initializeWorker()
    }

    // 防抖的生成函数
    this.debouncedGenerate = debounce(this.generateInternal.bind(this), 300)
  }

  /**
   * 生成完整主题（同步版本）
   */
  public generate(primaryColor: string): GeneratedTheme {
    const cleanColor = ensureHashPrefix(primaryColor)

    // 验证颜色
    if (!isValidColor(cleanColor)) {
      throw new Error(`Invalid color: ${primaryColor}`)
    }

    // 检查缓存
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(cleanColor)
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.performanceMonitor.recordCacheHit()
        return cached
      }
      this.performanceMonitor.recordCacheMiss()
    }

    this.performanceMonitor.startTimer('semanticColorGeneration')
    const semanticColors = this.semanticGenerator.generateSemanticColors(cleanColor, {
      grayMixPrimary: this.config.grayMixPrimary,
      grayMixRatio: this.config.grayMixRatio,
    })
    this.performanceMonitor.endTimer('semanticColorGeneration')

    this.performanceMonitor.startTimer('paletteGeneration')
    const palettes = this.paletteGenerator.generateColorPalettes(semanticColors, 'hex', this.config.grayMixPrimary, this.config.grayMixRatio)
    this.performanceMonitor.endTimer('paletteGeneration')

    this.performanceMonitor.startTimer('cssVariableGeneration')
    const cssVariables = this.cssGenerator.generateCSSVariables(palettes)
    this.performanceMonitor.endTimer('cssVariableGeneration')

    const theme: GeneratedTheme = {
      semanticColors,
      palettes,
      cssVariables,
      timestamp: Date.now(),
      cssGenerator: this.cssGenerator,
    }

    // 缓存结果
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(cleanColor)
      this.cache.set(cacheKey, theme)
    }

    // 自动注入CSS
    if (this.config.autoInject) {
      this.cssGenerator.injectToHead(cssVariables)
    }

    return theme
  }

  /**
   * 异步生成完整主题
   */
  public async generateAsync(primaryColor: string): Promise<GeneratedTheme> {
    const cleanColor = ensureHashPrefix(primaryColor)

    // 检查缓存
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(cleanColor)
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.performanceMonitor.recordCacheHit()
        return cached
      }
      this.performanceMonitor.recordCacheMiss()
    }

    // 使用Web Worker或降级到主线程
    if (this.config.useWebWorker && this.worker) {
      return this.generateWithWorker(cleanColor)
    }
    else {
      return this.generateWithMainThread(cleanColor)
    }
  }

  /**
   * 防抖生成函数
   */
  private debouncedGenerate: (primaryColor: string) => void

  /**
   * 防抖生成（用于频繁调用场景）
   */
  public generateDebounced(primaryColor: string, callback: (theme: GeneratedTheme) => void): void {
    this.debouncedGenerate = debounce((color: string) => {
      const theme = this.generate(color)
      callback(theme)
    }, 300)

    this.debouncedGenerate(primaryColor)
  }

  /**
   * 使用Web Worker生成
   */
  private async generateWithWorker(primaryColor: string): Promise<GeneratedTheme> {
    if (!this.worker) {
      throw new Error('Web Worker not initialized')
    }

    // 生成语义化颜色
    const semanticColors = await this.sendWorkerMessage('generateSemanticColors', {
      primaryColor,
    })

    // 生成色阶
    const palettes = await this.sendWorkerMessage('generatePalettes', {
      semanticColors,
    })

    // CSS变量生成在主线程进行（需要DOM操作）
    this.performanceMonitor.startTimer('cssVariableGeneration')
    const cssVariables = this.cssGenerator.generateCSSVariables(palettes)
    this.performanceMonitor.endTimer('cssVariableGeneration')

    const theme: GeneratedTheme = {
      semanticColors,
      palettes,
      cssVariables,
      timestamp: Date.now(),
    }

    // 缓存结果
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(primaryColor)
      this.cache.set(cacheKey, theme)
    }

    // 自动注入CSS
    if (this.config.autoInject) {
      this.cssGenerator.injectToHead(cssVariables)
    }

    return theme
  }

  /**
   * 在主线程生成（异步版本）
   */
  private async generateWithMainThread(primaryColor: string): Promise<GeneratedTheme> {
    return new Promise((resolve) => {
      // 使用 setTimeout 避免阻塞
      setTimeout(() => {
        const theme = this.generate(primaryColor)
        resolve(theme)
      }, 0)
    })
  }

  /**
   * 内部生成函数
   */
  private generateInternal(primaryColor: string): void {
    this.generate(primaryColor)
  }

  /**
   * 初始化Web Worker
   */
  private initializeWorker(): void {
    try {
      // 创建Worker的Blob URL
      const workerCode = this.getWorkerCode()
      const blob = new Blob([workerCode], { type: 'application/javascript' })
      const workerUrl = URL.createObjectURL(blob)

      this.worker = new Worker(workerUrl)
      this.worker.onmessage = this.handleWorkerMessage.bind(this)
      this.worker.onerror = this.handleWorkerError.bind(this)

      // 清理URL
      URL.revokeObjectURL(workerUrl)
    }
    catch (error) {
      console.warn('Failed to initialize Web Worker:', error)
      this.config.useWebWorker = false
    }
  }

  /**
   * 获取Worker代码
   */
  private getWorkerCode(): string {
    // 返回内联的Worker代码，避免外部文件依赖
    return `
      // 内联Worker代码
      ${this.getInlineWorkerCode()}
    `
  }

  /**
   * 获取内联Worker代码
   */
  private getInlineWorkerCode(): string {
    // 这里可以返回paletteWorker.ts的内容
    // 在实际构建中，这部分会被构建工具处理
    return ''
  }

  /**
   * 发送Worker消息
   */
  private sendWorkerMessage(type: 'generateSemanticColors' | 'generatePalettes', data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not available'))
        return
      }

      const id = Math.random().toString(36).substring(2, 11)
      const message: WorkerMessage = { id, type, data }

      this.workerPromises.set(id, { resolve, reject })
      this.worker.postMessage(message)

      // 设置超时
      setTimeout(() => {
        if (this.workerPromises.has(id)) {
          this.workerPromises.delete(id)
          reject(new Error('Worker timeout'))
        }
      }, 10000) // 10秒超时
    })
  }

  /**
   * 处理Worker消息
   */
  private handleWorkerMessage(event: MessageEvent<WorkerResponse>): void {
    const { id, success, data, error } = event.data
    const promise = this.workerPromises.get(id)

    if (promise) {
      this.workerPromises.delete(id)
      if (success) {
        promise.resolve(data)
      }
      else {
        promise.reject(new Error(error || 'Worker error'))
      }
    }
  }

  /**
   * 处理Worker错误
   */
  private handleWorkerError(error: ErrorEvent): void {
    console.error('Worker error:', error)
    // 降级到主线程
    this.config.useWebWorker = false
  }

  /**
   * 批量生成多个主题
   */
  public async batchGenerate(colors: string[]): Promise<GeneratedTheme[]> {
    const themes: GeneratedTheme[] = []

    for (const color of colors) {
      const theme = await this.generateAsync(color)
      themes.push(theme)
    }

    return themes
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear()
  }

  /**
   * 获取性能指标
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics()
  }

  /**
   * 重置性能监控
   */
  public resetPerformanceMetrics(): void {
    this.performanceMonitor.reset()
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<ColorGeneratorConfig>): void {
    this.config = { ...this.config, ...config }
    this.cssGenerator.updateConfig(this.config)

    // 重新初始化缓存如果大小改变
    if (config.cacheSize && config.cacheSize !== this.cache.size) {
      this.cache = new LRUCache(config.cacheSize)
    }
  }

  /**
   * 获取当前配置
   */
  public getConfig(): Required<ColorGeneratorConfig> {
    return { ...this.config }
  }

  /**
   * 销毁实例
   */
  public destroy(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.workerPromises.clear()
    this.cache.clear()
    this.cssGenerator.removeFromHead()
  }
}
