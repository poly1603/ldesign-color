<template>
  <div class="ld-theme-mode-switcher">
    <button class="mode-button" :title="modeTitle" @click="handleToggle">
      <span class="mode-icon">{{ modeIcon }}</span>
      <span class="mode-text">{{ modeText }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeMode } from '../composables/useThemeMode'

// Props
const props = defineProps<{
  translate?: (key: string) => string
  locale?: string | { value: string }
}>()

// 使用主题模式管理
const { mode, effectiveTheme, toggleMode } = useThemeMode()

// 模式图标映射
const modeIcon = computed(() => {
  switch (mode.value) {
    case 'light':
      return '☀️'
    case 'dark':
      return '🌙'
    case 'auto':
      return '💻'
    default:
      return '☀️'
  }
})

// 模式文本映射
/**
 * 计算当前模式的显示文本
 * 支持国际化翻译
 */
const modeText = computed(() => {
  // 关键修复：正确处理 Ref 类型的 locale prop
  // 如果 props.locale 是 Ref，必须在 computed 内部访问 .value 来建立响应式依赖
  let currentLocale: string | undefined

  // 检查是否有 value 属性（Ref 或类 Ref 对象）
  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    // 直接访问 .value，建立响应式依赖
    currentLocale = (props.locale as { value: string }).value
  }
  else if (typeof props.locale === 'string') {
    // 普通字符串
    currentLocale = props.locale
  }

  const currentMode = mode.value // 确保追踪 mode 的变化

  // 添加 locale 依赖，确保语言切换时重新计算
  if (currentLocale && props.translate) {
    // locale 或 mode 变化时，这个 computed 会重新计算
    return props.translate(`theme.mode.${currentMode}`)
  }

  if (props.translate) {
    return props.translate(`theme.mode.${currentMode}`)
  }

  switch (currentMode) {
    case 'light':
      return 'Light'
    case 'dark':
      return 'Dark'
    case 'auto':
      return 'Auto'
    default:
      return 'Light'
  }
})

/**
 * 模式提示文本
 * 支持国际化翻译
 */
const modeTitle = computed(() => {
  // 正确处理 Ref 类型的 locale prop
  let currentLocale: string | undefined

  // 检查是否有 value 属性（Ref 或类 Ref 对象）
  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    // 直接访问 .value，建立响应式依赖
    currentLocale = (props.locale as { value: string }).value
  }
  else if (typeof props.locale === 'string') {
    // 普通字符串
    currentLocale = props.locale
  }

  const currentMode = mode.value // 确保追踪 mode 的变化

  // 添加 locale 依赖，确保语言切换时重新计算
  if (currentLocale && props.translate) {
    const modeStr = props.translate(`theme.mode.${currentMode}`)
    return `${props.translate('theme.currentMode')}: ${modeStr}`
  }

  if (props.translate) {
    const modeStr = props.translate(`theme.mode.${currentMode}`)
    return `${props.translate('theme.currentMode')}: ${modeStr}`
  }

  return `Current mode: ${modeText.value}`
})

// 切换模式
const handleToggle = () => {
  toggleMode()
}
</script>

<style scoped>
.ld-theme-mode-switcher {
  display: inline-block;
}

.mode-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.mode-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.mode-button:hover {
  border-color: #3b82f6;
  background: #fafafa;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.mode-button:hover::before {
  opacity: 1;
}

.mode-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mode-icon {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.3s;
  position: relative;
  z-index: 1;
}

.mode-button:hover .mode-icon {
  transform: rotate(20deg) scale(1.1);
}

.mode-text {
  font-size: 14px;
  line-height: 1;
  position: relative;
  z-index: 1;
  min-width: 50px;
  text-align: left;
}

/* 暗黑模式适配 */
:global(.dark) .mode-button {
  background: var(--color-bg-container, #1f1f1f);
  border-color: var(--color-border, #404040);
  color: var(--color-text-primary, #e5e7eb);
}

:global(.dark) .mode-button:hover {
  background: var(--color-bg-container-secondary, #2a2a2a);
  border-color: var(--color-primary-default, #3b82f6);
}

:global(.dark) .mode-button::before {
  background: linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.15) 100%);
}
</style>
