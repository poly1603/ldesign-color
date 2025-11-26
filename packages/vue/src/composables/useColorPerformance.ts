/**
 * @ldesign/color-vue - Performance Monitoring Hook
 * 
 * 性能监控composable,用于追踪和分析Vue组件中的颜色操作性能
 */

import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref, readonly, computed } from 'vue'

/**
 * 性能指标数据
 */
export interface PerformanceMetrics {
  /** 组件渲染次数 */
  renderCount: number
  /** Computed计算次数 */
  computedCount: number
  /** 响应式更新次数 */
  reactiveUpdates: number
  /** 平均计算时间(ms) */
  avgComputeTime: number
  /** 最大计算时间(ms) */
  maxComputeTime: number
  /** 最小计算时间(ms) */
  minComputeTime: number
  /** 总计算时间(ms) */
  totalComputeTime: number
  /** 内存使用估算(bytes) */
  estimatedMemory: number
  /** 性能警告列表 */
  warnings: PerformanceWarning[]
}

/**
 * 性能警告
 */
export interface PerformanceWarning {
  /** 警告类型 */
  type: 'slow-compute' | 'frequent-update' | 'memory-leak' | 'excessive-render'
  /** 警告消息 */
  message: string
  /** 触发时间 */
  timestamp: number
  /** 相关数据 */
  data?: any
}

/**
 * 性能监控选项
 */
export interface UseColorPerformanceOptions {
  /** 是否启用(默认仅开发环境) */
  enabled?: boolean
  /** 慢计算阈值(ms) */
  slowComputeThreshold?: number
  /** 频繁更新阈值(次/秒) */
  frequentUpdateThreshold?: number
  /** 过度渲染阈值(次) */
  excessiveRenderThreshold?: number
  /** 是否在控制台输出警告 */
  consoleWarnings?: boolean
  /** 采样率(0-1,1表示100%采样) */
  sampleRate?: number
}

/**
 * 性能监控返回值
 */
export interface UseColorPerformanceReturn {
  /** 性能指标(只读) */
  metrics: Ref<Readonly<PerformanceMetrics>>
  /** 是否正在监控 */
  isMonitoring: Ref<boolean>
  /** 性能评分(0-100) */
  performanceScore: Ref<number>
  
  /** 开始监控计算 */
  startCompute: (label?: string) => () => void
  /** 记录渲染 */
  recordRender: () => void
  /** 记录响应式更新 */
  recordReactiveUpdate: () => void
  /** 重置统计 */
  reset: () => void
  /** 导出性能报告 */
  exportReport: () => PerformanceReport
  /** 获取性能建议 */
  getSuggestions: () => string[]
}

/**
 * 性能报告
 */
export interface PerformanceReport {
  /** 报告时间 */
  timestamp: number
  /** 监控时长(ms) */
  duration: number
  /** 性能指标 */
  metrics: PerformanceMetrics
  /** 性能评分 */
  score: number
  /** 优化建议 */
  suggestions: string[]
}

const DEFAULT_OPTIONS: Required<UseColorPerformanceOptions> = {
  enabled: process.env.NODE_ENV === 'development',
  slowComputeThreshold: 16, // 一帧时间
  frequentUpdateThreshold: 10, // 10次/秒
  excessiveRenderThreshold: 100,
  consoleWarnings: true,
  sampleRate: 1.0,
}

/**
 * 使用颜色性能监控
 * 
 * 提供详细的性能指标追踪和分析,帮助识别性能瓶颈
 * 
 * @param options - 监控选项
 * @returns 性能监控对象
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useColorPerformance } from '@ldesign/color-vue'
 * 
 * const {
 *   metrics,
 *   performanceScore,
 *   startCompute,
 *   recordRender,
 *   exportReport
 * } = useColorPerformance()
 * 
 * // 监控计算性能
 * const endCompute = startCompute('color-conversion')
 * // ... 执行计算
 * endCompute()
 * 
 * // 记录渲染
 * recordRender()
 * </script>
 * ```
 */
export function useColorPerformance(
  options: UseColorPerformanceOptions = {},
): UseColorPerformanceReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // 如果未启用,返回空实现
  if (!opts.enabled) {
    return createNoOpMonitor()
  }

  // 响应式状态
  const isMonitoring = ref(true)
  const startTime = Date.now()
  
  const metrics = ref<PerformanceMetrics>({
    renderCount: 0,
    computedCount: 0,
    reactiveUpdates: 0,
    avgComputeTime: 0,
    maxComputeTime: 0,
    minComputeTime: Infinity,
    totalComputeTime: 0,
    estimatedMemory: 0,
    warnings: [],
  })

  // 追踪更新频率
  const updateTimestamps: number[] = []
  const computeTimes: number[] = []

  /**
   * 添加性能警告
   */
  function addWarning(
    type: PerformanceWarning['type'],
    message: string,
    data?: any,
  ): void {
    const warning: PerformanceWarning = {
      type,
      message,
      timestamp: Date.now(),
      data,
    }

    metrics.value.warnings.push(warning)

    // 限制警告数量
    if (metrics.value.warnings.length > 50) {
      metrics.value.warnings.shift()
    }

    // 控制台输出
    if (opts.consoleWarnings) {
      console.warn(`[useColorPerformance] ${message}`, data)
    }
  }

  /**
   * 检查是否应该采样
   */
  function shouldSample(): boolean {
    return Math.random() < opts.sampleRate
  }

  /**
   * 开始监控计算
   */
  function startCompute(label?: string): () => void {
    if (!shouldSample()) {
      return () => {}
    }

    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime
      
      metrics.value.computedCount++
      metrics.value.totalComputeTime += duration
      computeTimes.push(duration)

      // 更新统计
      metrics.value.avgComputeTime = 
        metrics.value.totalComputeTime / metrics.value.computedCount
      metrics.value.maxComputeTime = Math.max(
        metrics.value.maxComputeTime,
        duration,
      )
      metrics.value.minComputeTime = Math.min(
        metrics.value.minComputeTime,
        duration,
      )

      // 检查慢计算
      if (duration > opts.slowComputeThreshold) {
        addWarning(
          'slow-compute',
          `Slow computation detected: ${duration.toFixed(2)}ms${label ? ` (${label})` : ''}`,
          { duration, label, threshold: opts.slowComputeThreshold },
        )
      }

      // 限制数组大小
      if (computeTimes.length > 100) {
        computeTimes.shift()
      }
    }
  }

  /**
   * 记录渲染
   */
  function recordRender(): void {
    if (!shouldSample()) return

    metrics.value.renderCount++

    // 检查过度渲染
    if (metrics.value.renderCount > opts.excessiveRenderThreshold) {
      if (metrics.value.renderCount % 50 === 0) {
        addWarning(
          'excessive-render',
          `Excessive render count: ${metrics.value.renderCount}`,
          { count: metrics.value.renderCount, threshold: opts.excessiveRenderThreshold },
        )
      }
    }
  }

  /**
   * 记录响应式更新
   */
  function recordReactiveUpdate(): void {
    if (!shouldSample()) return

    const now = Date.now()
    metrics.value.reactiveUpdates++
    updateTimestamps.push(now)

    // 清理1秒前的时间戳
    const oneSecondAgo = now - 1000
    while (updateTimestamps.length > 0 && updateTimestamps[0] < oneSecondAgo) {
      updateTimestamps.shift()
    }

    // 检查频繁更新
    if (updateTimestamps.length > opts.frequentUpdateThreshold) {
      addWarning(
        'frequent-update',
        `Frequent updates detected: ${updateTimestamps.length} updates/sec`,
        { count: updateTimestamps.length, threshold: opts.frequentUpdateThreshold },
      )
    }

    // 估算内存使用
    metrics.value.estimatedMemory = 
      (metrics.value.renderCount * 1000) + 
      (metrics.value.computedCount * 500) +
      (metrics.value.reactiveUpdates * 200)
  }

  /**
   * 重置统计
   */
  function reset(): void {
    metrics.value = {
      renderCount: 0,
      computedCount: 0,
      reactiveUpdates: 0,
      avgComputeTime: 0,
      maxComputeTime: 0,
      minComputeTime: Infinity,
      totalComputeTime: 0,
      estimatedMemory: 0,
      warnings: [],
    }
    updateTimestamps.length = 0
    computeTimes.length = 0
  }

  /**
   * 计算性能评分 (0-100)
   */
  const performanceScore = computed(() => {
    let score = 100

    // 渲染性能 (30分)
    const renderPenalty = Math.min(
      30,
      (metrics.value.renderCount / opts.excessiveRenderThreshold) * 30,
    )
    score -= renderPenalty

    // 计算性能 (40分)
    const avgComputePenalty = Math.min(
      40,
      (metrics.value.avgComputeTime / opts.slowComputeThreshold) * 20,
    )
    const maxComputePenalty = Math.min(
      20,
      (metrics.value.maxComputeTime / (opts.slowComputeThreshold * 2)) * 20,
    )
    score -= avgComputePenalty + maxComputePenalty

    // 更新频率 (20分)
    const updateRate = updateTimestamps.length
    const updatePenalty = Math.min(
      20,
      (updateRate / opts.frequentUpdateThreshold) * 20,
    )
    score -= updatePenalty

    // 警告 (10分)
    const warningPenalty = Math.min(10, metrics.value.warnings.length * 2)
    score -= warningPenalty

    return Math.max(0, Math.round(score))
  })

  /**
   * 获取性能建议
   */
  function getSuggestions(): string[] {
    const suggestions: string[] = []

    if (metrics.value.avgComputeTime > opts.slowComputeThreshold) {
      suggestions.push(
        '考虑使用 computed 缓存来避免重复计算',
        '使用 shallowRef/shallowReactive 减少深度响应式追踪',
      )
    }

    if (metrics.value.renderCount > opts.excessiveRenderThreshold) {
      suggestions.push(
        '检查是否有不必要的响应式依赖',
        '考虑使用 v-once 或 v-memo 优化静态内容',
        '使用防抖(debounce)来减少频繁更新',
      )
    }

    if (updateTimestamps.length > opts.frequentUpdateThreshold) {
      suggestions.push(
        '使用 throttle 或 debounce 来限制更新频率',
        '批量处理状态更新',
        '检查是否有循环依赖导致的无限更新',
      )
    }

    if (metrics.value.maxComputeTime > opts.slowComputeThreshold * 2) {
      suggestions.push(
        '将耗时计算移到 Web Worker',
        '使用异步计算和分片处理',
        '考虑使用缓存策略',
      )
    }

    if (suggestions.length === 0) {
      suggestions.push('性能表现良好,无需优化')
    }

    return suggestions
  }

  /**
   * 导出性能报告
   */
  function exportReport(): PerformanceReport {
    return {
      timestamp: Date.now(),
      duration: Date.now() - startTime,
      metrics: { ...metrics.value },
      score: performanceScore.value,
      suggestions: getSuggestions(),
    }
  }

  // 组件卸载时输出报告
  onUnmounted(() => {
    if (opts.consoleWarnings && metrics.value.computedCount > 0) {
      const report = exportReport()
      console.log('[useColorPerformance] Performance Report:', report)
    }
  })

  return {
    metrics: metrics as Ref<Readonly<PerformanceMetrics>>,
    isMonitoring: isMonitoring as Ref<boolean>,
    performanceScore: performanceScore as Ref<number>,
    startCompute,
    recordRender,
    recordReactiveUpdate,
    reset,
    exportReport,
    getSuggestions,
  }
}

/**
 * 创建空操作监控器(用于生产环境)
 */
function createNoOpMonitor(): UseColorPerformanceReturn {
  const emptyMetrics = ref<PerformanceMetrics>({
    renderCount: 0,
    computedCount: 0,
    reactiveUpdates: 0,
    avgComputeTime: 0,
    maxComputeTime: 0,
    minComputeTime: 0,
    totalComputeTime: 0,
    estimatedMemory: 0,
    warnings: [],
  })

  return {
    metrics: emptyMetrics as Ref<Readonly<PerformanceMetrics>>,
    isMonitoring: ref(false) as Ref<boolean>,
    performanceScore: ref(100) as Ref<number>,
    startCompute: () => () => {},
    recordRender: () => {},
    recordReactiveUpdate: () => {},
    reset: () => {},
    exportReport: () => ({
      timestamp: Date.now(),
      duration: 0,
      metrics: emptyMetrics.value,
      score: 100,
      suggestions: [],
    }),
    getSuggestions: () => [],
  }
}