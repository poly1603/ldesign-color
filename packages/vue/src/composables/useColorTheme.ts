/**
 * @ldesign/color-vue - useColorTheme Composable
 * 
 * Vue 3 响应式色彩主题管理
 */

import { ref, computed, watch, onMounted, type Ref } from 'vue'
import {
  generateThemeColors,
  generateCSSVariables,
  type ThemeColors,
  type ColorGeneratorOptions,
  type CSSVariablesOptions,
  type ColorInput,
} from '@ldesign/color-core'

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * useColorTheme 选项
 */
export interface UseColorThemeOptions extends ColorGeneratorOptions, CSSVariablesOptions {
  /** 初始主色调 */
  primaryColor?: ColorInput
  /** 初始主题模式 */
  initialMode?: ThemeMode
  /** 是否自动注入 CSS 变量到页面 */
  autoInject?: boolean
  /** 是否持久化到 localStorage */
  persist?: boolean
  /** localStorage 存储键名 */
  storageKey?: string
}

/**
 * useColorTheme 返回值
 */
export interface UseColorThemeReturn {
  /** 当前主色调 */
  primaryColor: Ref<string>
  /** 当前主题模式 */
  mode: Ref<ThemeMode>
  /** 实际生效的主题模式（处理 auto 的情况） */
  effectiveMode: Ref<'light' | 'dark'>
  /** 生成的主题色彩 */
  themeColors: Ref<ThemeColors | null>
  /** 生成的 CSS 变量字符串 */
  cssVariables: Ref<string>
  /** 设置主色调 */
  setPrimaryColor: (color: ColorInput) => void
  /** 设置主题模式 */
  setMode: (mode: ThemeMode) => void
  /** 切换主题模式（light ↔ dark） */
  toggleMode: () => void
  /** 重新生成主题色彩 */
  regenerate: () => void
}

/**
 * 从 localStorage 读取值
 */
function getStorageValue(key: string, defaultValue: string): string {
  if (typeof localStorage === 'undefined') return defaultValue
  
  try {
    const value = localStorage.getItem(key)
    return value ?? defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 保存值到 localStorage
 */
function setStorageValue(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return
  
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    console.warn('无法保存到 localStorage:', e)
  }
}

/**
 * 检测系统主题偏好
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Vue 3 响应式色彩主题管理
 * 
 * @param options - 配置选项
 * @returns 主题管理对象
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useColorTheme } from '@ldesign/color-vue'
 * 
 * const {
 *   primaryColor,
 *   mode,
 *   setPrimaryColor,
 *   toggleMode
 * } = useColorTheme({
 *   primaryColor: '#1890ff',
 *   initialMode: 'auto',
 *   autoInject: true
 * })
 * </script>
 * 
 * <template>
 *   <div>
 *     <input v-model="primaryColor" type="color" />
 *     <button @click="toggleMode">切换主题</button>
 *   </div>
 * </template>
 * ```
 */
export function useColorTheme(options: UseColorThemeOptions = {}): UseColorThemeReturn {
  const {
    primaryColor: initialPrimaryColor = '#1890ff',
    initialMode = 'light',
    autoInject = true,
    persist = true,
    storageKey = 'ldesign-color-theme',
    preserveInput,
    semanticHues,
    prefix,
    includeAliases,
  } = options
  
  // 从 localStorage 恢复状态
  const storedColor = persist
    ? getStorageValue(`${storageKey}-primary`, initialPrimaryColor.toString())
    : initialPrimaryColor.toString()
  const storedMode = persist
    ? getStorageValue(`${storageKey}-mode`, initialMode) as ThemeMode
    : initialMode
  
  // 响应式状态
  const primaryColor = ref<string>(storedColor)
  const mode = ref<ThemeMode>(storedMode)
  const themeColors = ref<ThemeColors | null>(null)
  
  // 计算实际生效的主题模式
  const effectiveMode = computed<'light' | 'dark'>(() => {
    if (mode.value === 'auto') {
      return getSystemTheme()
    }
    return mode.value
  })
  
  // 计算 CSS 变量字符串
  const cssVariables = computed(() => {
    if (!themeColors.value) return ''
    
    return generateCSSVariables(themeColors.value, {
      prefix,
      includeAliases,
    })
  })
  
  // 生成主题色彩
  function regenerate() {
    try {
      themeColors.value = generateThemeColors(primaryColor.value, {
        preserveInput,
        semanticHues,
      })
    } catch (error) {
      console.error('生成主题色彩失败:', error)
      themeColors.value = null
    }
  }
  
  // 设置主色调
  function setPrimaryColor(color: ColorInput) {
    primaryColor.value = color.toString()
    
    if (persist) {
      setStorageValue(`${storageKey}-primary`, primaryColor.value)
    }
  }
  
  // 设置主题模式
  function setMode(newMode: ThemeMode) {
    mode.value = newMode
    
    if (persist) {
      setStorageValue(`${storageKey}-mode`, newMode)
    }
  }
  
  // 切换主题模式
  function toggleMode() {
    if (mode.value === 'light') {
      setMode('dark')
    } else {
      setMode('light')
    }
  }
  
  // 监听主色调变化，自动重新生成
  watch(primaryColor, () => {
    regenerate()
  }, { immediate: true })
  
  // 自动注入 CSS 变量
  if (autoInject) {
    watch([themeColors, effectiveMode], () => {
      if (!themeColors.value) return
      
      if (typeof document === 'undefined') return
      
      // 更新 data-theme 属性
      document.documentElement.setAttribute('data-theme', effectiveMode.value)
      
      // 注入 CSS 变量
      let styleElement = document.getElementById('ldesign-theme-colors')
      
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = 'ldesign-theme-colors'
        document.head.appendChild(styleElement)
      }
      
      styleElement.textContent = cssVariables.value
    }, { immediate: true })
    
    // 监听系统主题变化（仅在 auto 模式下）
    onMounted(() => {
      if (typeof window === 'undefined') return
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        if (mode.value === 'auto') {
          // 强制触发 effectiveMode 的更新
          mode.value = 'auto'
        }
      }
      
      mediaQuery.addEventListener('change', handler)
      
      // 清理
      return () => {
        mediaQuery.removeEventListener('change', handler)
      }
    })
  }
  
  return {
    primaryColor,
    mode,
    effectiveMode,
    themeColors,
    cssVariables,
    setPrimaryColor,
    setMode,
    toggleMode,
    regenerate,
  }
}
