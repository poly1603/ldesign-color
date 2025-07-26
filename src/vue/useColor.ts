import { type Ref, computed, onUnmounted, ref, watch } from 'vue'
import { ColorGenerator } from '../core/ColorGenerator'
import type { ColorGeneratorConfig, GeneratedTheme, PerformanceMetrics } from '../types'
import { isValidColor } from '../utils/colorUtils'

/**
 * Vue组合式API - 颜色主题管理
 */
export function useColor(
  primaryColor: Ref<string> | string,
  config?: ColorGeneratorConfig,
) {
  // 响应式状态
  const theme = ref<GeneratedTheme | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 颜色生成器实例
  const colorGenerator = new ColorGenerator(config)

  // 将输入转换为响应式引用
  const colorRef = typeof primaryColor === 'string'
    ? ref(primaryColor)
    : primaryColor

  /**
   * 验证颜色是否有效
   */
  const isValid = computed(() => {
    return colorRef.value ? isValidColor(colorRef.value) : false
  })

  /**
   * 生成主题
   */
  const generateTheme = async () => {
    if (!isValid.value) {
      error.value = '无效的颜色值'
      return
    }

    loading.value = true
    error.value = null

    try {
      const newTheme = await colorGenerator.generateAsync(colorRef.value)
      theme.value = newTheme
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '生成主题时发生错误'
      console.error('Theme generation error:', err)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 同步生成主题（不推荐用于大量计算）
   */
  const generateThemeSync = () => {
    if (!isValid.value) {
      error.value = '无效的颜色值'
      return
    }

    loading.value = true
    error.value = null

    try {
      const newTheme = colorGenerator.generate(colorRef.value)
      theme.value = newTheme
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '生成主题时发生错误'
      console.error('Theme generation error:', err)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 防抖生成主题
   */
  const generateThemeDebounced = () => {
    if (!isValid.value) {
      error.value = '无效的颜色值'
      return
    }

    loading.value = true
    error.value = null

    colorGenerator.generateDebounced(colorRef.value, (newTheme) => {
      theme.value = newTheme
      loading.value = false
    })
  }

  /**
   * 清除缓存
   */
  const clearCache = () => {
    colorGenerator.clearCache()
  }

  /**
   * 获取性能指标
   */
  const getPerformanceMetrics = (): PerformanceMetrics => {
    return colorGenerator.getPerformanceMetrics()
  }

  /**
   * 重置性能指标
   */
  const resetPerformanceMetrics = () => {
    colorGenerator.resetPerformanceMetrics()
  }

  /**
   * 更新配置
   */
  const updateConfig = (newConfig: Partial<ColorGeneratorConfig>) => {
    colorGenerator.updateConfig(newConfig)
  }

  /**
   * 手动注入CSS变量
   */
  const injectCSS = () => {
    if (theme.value) {
      colorGenerator.cssGenerator.injectToHead(theme.value.cssVariables)
    }
  }

  /**
   * 移除CSS变量
   */
  const removeCSS = () => {
    colorGenerator.cssGenerator.removeFromHead()
  }

  // 监听颜色变化，自动生成主题
  watch(
    colorRef,
    (newColor) => {
      if (newColor && isValidColor(newColor)) {
        generateTheme()
      }
    },
    { immediate: true },
  )

  // 组件卸载时清理（只在组件上下文中执行）
  try {
    onUnmounted(() => {
      colorGenerator.destroy()
    })
  }
  catch {
    // 在测试环境或非组件上下文中忽略
  }

  return {
    // 状态
    theme: computed(() => theme.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isValid,

    // 方法
    generateTheme,
    generateThemeSync,
    generateThemeDebounced,
    clearCache,
    getPerformanceMetrics,
    resetPerformanceMetrics,
    updateConfig,
    injectCSS,
    removeCSS,

    // 颜色生成器实例（高级用法）
    colorGenerator,
  }
}

/**
 * 简化版本的颜色Hook - 只关注基本功能
 */
export function useSimpleColor(primaryColor: Ref<string> | string) {
  const { theme, loading, error, generateTheme } = useColor(primaryColor, {
    enableCache: true,
    useWebWorker: false,
    autoInject: true,
  })

  return {
    theme,
    loading,
    error,
    generateTheme,
  }
}

/**
 * 高性能版本的颜色Hook - 启用所有优化
 */
export function useHighPerformanceColor(
  primaryColor: Ref<string> | string,
  config?: Partial<ColorGeneratorConfig>,
) {
  const optimizedConfig: ColorGeneratorConfig = {
    enableCache: true,
    cacheSize: 200,
    useWebWorker: true,
    autoInject: true,
    ...config,
  }

  return useColor(primaryColor, optimizedConfig)
}

/**
 * 批量颜色处理Hook
 */
export function useBatchColor(colors: Ref<string[]>) {
  const themes = ref<GeneratedTheme[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const colorGenerator = new ColorGenerator({
    enableCache: true,
    useWebWorker: true,
  })

  const generateThemes = async () => {
    if (!colors.value.length)
      return

    loading.value = true
    error.value = null

    try {
      const validColors = colors.value.filter(color => isValidColor(color))
      const newThemes = await colorGenerator.batchGenerate(validColors)
      themes.value = newThemes
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : '批量生成主题时发生错误'
      console.error('Batch theme generation error:', err)
    }
    finally {
      loading.value = false
    }
  }

  watch(colors, generateThemes, { immediate: true, deep: true })

  try {
    onUnmounted(() => {
      colorGenerator.destroy()
    })
  }
  catch {
    // 在测试环境或非组件上下文中忽略
  }

  return {
    themes: computed(() => themes.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    generateThemes,
    colorGenerator,
  }
}

/**
 * 颜色分析Hook
 */
export function useColorAnalysis(color: Ref<string> | string) {
  const colorRef = typeof color === 'string' ? ref(color) : color

  const analysis = computed(() => {
    if (!colorRef.value || !isValidColor(colorRef.value)) {
      return null
    }

    // 这里可以添加颜色分析逻辑
    return {
      color: colorRef.value,
      isValid: true,
      // 其他分析数据...
    }
  })

  return {
    analysis,
  }
}

/**
 * 主题切换Hook
 */
export function useThemeSwitch() {
  const currentTheme = ref<'light' | 'dark'>('light')

  const updateDocumentTheme = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme.value)
      if (currentTheme.value === 'dark') {
        document.documentElement.classList.add('dark')
      }
      else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    updateDocumentTheme()
  }

  const setTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme
    updateDocumentTheme()
  }

  // 初始化主题
  if (typeof document !== 'undefined') {
    const savedTheme = localStorage.getItem('ldesign-theme') as 'light' | 'dark'
    if (savedTheme) {
      currentTheme.value = savedTheme
    }
    else {
      // 检测系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
    }
    updateDocumentTheme()
  }

  // 监听主题变化，保存到localStorage
  watch(currentTheme, (newTheme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ldesign-theme', newTheme)
    }
  })

  return {
    currentTheme: computed(() => currentTheme.value),
    toggleTheme,
    setTheme,
    isDark: computed(() => currentTheme.value === 'dark'),
  }
}
