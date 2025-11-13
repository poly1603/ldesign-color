<template>
  <div class="ld-theme-mode-switcher">
    <button
      class="mode-button"
      :title="modeTitle"
      @click="handleToggle"
    >
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
const modeText = computed(() => {
  if (props.translate) {
    return props.translate(`theme.mode.${mode.value}`)
  }
  
  switch (mode.value) {
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

// 模式提示文本
const modeTitle = computed(() => {
  if (props.translate) {
    const modeStr = props.translate(`theme.mode.${mode.value}`)
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
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 6px;
  background: var(--color-bg-container, #ffffff);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: var(--color-text-primary, #333);
}

.mode-button:hover {
  border-color: var(--color-primary-hover, #40a9ff);
  background: var(--color-bg-component-hover, #f5f5f5);
}

.mode-icon {
  font-size: 16px;
  line-height: 1;
}

.mode-text {
  font-size: 14px;
  line-height: 1;
}
</style>
