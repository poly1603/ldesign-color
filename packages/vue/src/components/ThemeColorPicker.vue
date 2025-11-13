<template>
  <div class="ld-theme-color-picker">
    <!-- 触发按钮 -->
    <button ref="triggerRef" class="picker-trigger"
      :title="translate?.('theme.selectThemeColor') || 'Select theme color'" @click="toggleDropdown">
      <span class="color-preview" :style="{ backgroundColor: currentColor }" />
      <span class="icon">🎨</span>
    </button>

    <!-- 颜色选择弹窗 -->
    <Teleport to="body">
      <div v-if="isOpen" ref="dropdownRef" class="picker-dropdown" :style="dropdownStyle">
        <div class="picker-content">
          <!-- 预设颜色列表 -->
          <div class="preset-colors">
            <div class="section-title">{{ translate?.('theme.presetColors') || '预设颜色' }}</div>
            <div class="color-list">
              <button v-for="preset in presetColors" :key="preset.name" class="color-item"
                :class="{ active: currentColor === preset.color }" @click="selectColor(preset.color)">
                <span class="color-preview" :style="{ backgroundColor: preset.color }" />
                <div class="color-info">
                  <span class="color-name">{{ colorName(preset.name) }}</span>
                  <span class="color-description">{{ colorDescription(preset.name) }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { presetThemes, sortPresets, ThemeManager } from '@ldesign/color-core'
import type { BaseThemeAdapter } from '@ldesign/color-core'
import { COLOR_SYMBOL } from '../constants'

/**
 * 组件 Props
 */
const props = defineProps<{
  /** 翻译函数 */
  translate?: (key: string) => string
  /** 当前语言 */
  locale?: string | { value: string }
}>()

/**
 * 注入 ThemeAdapter 实例（可选）
 * 如果存在，使用其预设列表（包括自定义预设）
 * 否则使用内置预设
 */
const themeAdapter = inject<BaseThemeAdapter>(COLOR_SYMBOL, undefined as any)

/**
 * 获取预设颜色列表
 * 优先使用 ThemeAdapter 的预设（包括自定义预设），否则使用内置预设
 */
const presetColors = computed(() => {
  // 如果有 ThemeAdapter，使用其预设列表（已经合并和排序）
  if (themeAdapter && themeAdapter.getPresets) {
    const presets = themeAdapter.getPresets()
    return presets.map(theme => ({
      name: theme.name,
      color: theme.color,
    }))
  }

  // 降级：使用内置预设并排序
  return sortPresets(presetThemes).map(theme => ({
    name: theme.name,
    color: theme.color,
  }))
})

/**
 * 组件状态
 */
const isOpen = ref(false)
const currentColor = ref('#1890ff')
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

/**
 * 主题管理器实例
 */
const themeManager = new ThemeManager()

/**
 * 获取当前语言
 * 支持 string 和 Ref 类型的 locale
 */
const currentLocale = computed(() => {
  if (props.locale && typeof props.locale === 'object' && 'value' in props.locale) {
    return (props.locale as { value: string }).value
  }
  return props.locale
})

/**
 * 获取所有预设主题（用于查找）
 * 优先使用 ThemeAdapter 的预设，否则使用内置预设
 */
const allPresets = computed(() => {
  if (themeAdapter && themeAdapter.getPresets) {
    return themeAdapter.getPresets()
  }
  return sortPresets(presetThemes)
})

/**
 * 获取颜色名称（支持国际化）
 * @param name - 颜色名称 key
 * @returns 翻译后的颜色名称
 */
const colorName = (name: string): string => {
  // 触发 locale 的响应式依赖
  const _locale = currentLocale.value

  if (_locale && props.translate) {
    return props.translate(`theme.presets.${name}`)
  }

  // 降级到预设主题的 label
  const preset = allPresets.value.find(t => t.name === name)
  return preset?.label || name
}

/**
 * 获取颜色描述（支持国际化）
 * @param name - 颜色名称 key
 * @returns 翻译后的颜色描述
 */
const colorDescription = (name: string): string => {
  // 触发 locale 的响应式依赖
  const _locale = currentLocale.value

  if (_locale && props.translate) {
    const translated = props.translate(`theme.descriptions.${name}`)
    // 如果翻译键不存在，返回空字符串而不是键名
    if (translated && !translated.startsWith('theme.descriptions.')) {
      return translated
    }
  }

  // 降级到预设主题的 description
  const preset = allPresets.value.find(t => t.name === name)
  return preset?.description || ''
}

/**
 * 智能计算弹窗位置
 * 确保弹窗不会超出视口边界
 */
const dropdownStyle = computed(() => {
  if (!triggerRef.value || !isOpen.value) return {}

  const rect = triggerRef.value.getBoundingClientRect()
  const dropdownWidth = 280 // 弹窗宽度（减小以适应更多屏幕）
  const dropdownHeight = 450 // 预估弹窗高度（增加以容纳15个颜色）
  const gap = 8 // 与触发器的间距

  // 获取视口尺寸
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // 计算各个方向的可用空间
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  const spaceRight = viewportWidth - rect.right // 按钮右侧到屏幕右边的距离
  const spaceLeft = rect.left // 按钮左侧到屏幕左边的距离

  let top = 0
  let left = 0

  // 垂直方向：优先向下，空间不足则向上
  if (spaceBelow >= dropdownHeight + gap) {
    // 向下显示
    top = rect.bottom + gap
  }
  else if (spaceAbove >= dropdownHeight + gap) {
    // 向上显示
    top = rect.top - dropdownHeight - gap
  }
  else {
    // 空间都不足，居中显示并允许滚动
    top = Math.max(gap, (viewportHeight - dropdownHeight) / 2)
  }

  // 水平方向：优先右对齐（弹窗右边缘对齐按钮右边缘），超出则左对齐
  if (spaceRight >= dropdownWidth - rect.width) {
    // 右对齐：弹窗右边缘对齐按钮右边缘
    left = rect.right - dropdownWidth
  }
  else if (spaceLeft >= dropdownWidth) {
    // 左对齐：弹窗左边缘对齐按钮左边缘
    left = rect.left
  }
  else {
    // 空间都不足，居中显示
    left = Math.max(gap, (viewportWidth - dropdownWidth) / 2)
  }

  // 确保不超出视口
  top = Math.max(gap, Math.min(top, viewportHeight - dropdownHeight - gap))
  left = Math.max(gap, Math.min(left, viewportWidth - dropdownWidth - gap))

  return {
    position: 'fixed' as const,
    top: `${top}px`,
    left: `${left}px`,
    width: `${dropdownWidth}px`,
    maxHeight: `${dropdownHeight}px`,
    zIndex: 1000,
  }
})

/**
 * 切换下拉框显示状态
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

/**
 * 选择颜色并应用主题
 * @param color - 颜色值
 */
const selectColor = (color: string) => {
  currentColor.value = color
  themeManager.applyTheme(color)
  isOpen.value = false
}

/**
 * 点击外部关闭弹窗
 */
const handleClickOutside = (e: MouseEvent) => {
  if (!triggerRef.value || !dropdownRef.value) return

  const target = e.target as Node
  if (!triggerRef.value.contains(target) && !dropdownRef.value.contains(target)) {
    isOpen.value = false
  }
}

/**
 * 监听 locale 变化，强制更新颜色名称
 */
watch(
  () => currentLocale.value,
  () => {
    // locale 变化时，computed 会自动重新计算
    // 这里只是确保响应式依赖被正确建立
  },
)

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 恢复保存的主题
  const theme = themeManager.getCurrentTheme()
  if (theme) {
    currentColor.value = theme.primaryColor
  }
})

/**
 * 组件卸载时清理资源
 */
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  themeManager.destroy()
})
</script>

<style scoped>
.ld-theme-color-picker {
  position: relative;
  display: inline-block;
}

.picker-trigger {
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
}

.picker-trigger:hover {
  border-color: #3b82f6;
  background: #fafafa;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.picker-trigger:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.picker-trigger:hover .color-preview {
  transform: scale(1.1);
}

.icon {
  font-size: 18px;
  line-height: 1;
}

.picker-dropdown {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.picker-content {
  padding: 20px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preset-colors {
  /* 预设颜色区域 */
}

.color-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: left;
}

.color-item:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
  transform: translateX(4px);
}

.color-item.active {
  background: #eff6ff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.color-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.color-description {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 暗黑模式适配 */
:global(.dark) .picker-trigger {
  background: var(--color-bg-container, #1f1f1f);
  border-color: var(--color-border, #404040);
  color: var(--color-text-primary, #e5e7eb);
}

:global(.dark) .picker-trigger:hover {
  background: var(--color-bg-container-secondary, #2a2a2a);
  border-color: var(--color-primary-default, #3b82f6);
}

:global(.dark) .picker-dropdown {
  background: var(--color-bg-container, #1f1f1f);
  border-color: var(--color-border, #404040);
}

:global(.dark) .section-title {
  color: var(--color-text-secondary, #9ca3af);
}
</style>
