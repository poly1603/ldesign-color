<template>
  <div class="ld-theme-color-picker">
    <button
      ref="triggerRef"
      class="picker-trigger"
      :title="translate?.('theme.selectThemeColor') || 'Select theme color'"
      @click="toggleDropdown"
    >
      <span class="color-preview" :style="{ backgroundColor: currentColor }" />
      <span class="icon">🎨</span>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="picker-dropdown"
        :style="dropdownStyle"
      >
        <div class="picker-content">
          <!-- 预设颜色 -->
          <div class="preset-colors">
            <div class="section-title">{{ translate?.('theme.presetColors') || 'Preset Colors' }}</div>
            <div class="color-grid">
              <button
                v-for="preset in presetColors"
                :key="preset.name"
                class="color-item"
                :class="{ active: currentColor === preset.color }"
                :title="translate?.(`theme.presets.${preset.name}`) || preset.name"
                :style="{ backgroundColor: preset.color }"
                @click="selectColor(preset.color)"
              />
            </div>
          </div>

          <!-- 自定义颜色 -->
          <div class="custom-color">
            <div class="section-title">{{ translate?.('theme.customColor') || 'Custom Color' }}</div>
            <div class="color-input-group">
              <input
                type="color"
                :value="currentColor"
                @input="handleColorInput"
              >
              <input
                type="text"
                :value="currentColor"
                placeholder="#1890ff"
                @input="handleHexInput"
              >
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ThemeManager } from '@ldesign/color-core'

// Props
defineProps<{
  translate?: (key: string) => string
}>()

// 预设颜色
const presetColors = [
  { name: 'blue', color: '#1890ff' },
  { name: 'purple', color: '#722ed1' },
  { name: 'cyan', color: '#13c2c2' },
  { name: 'green', color: '#52c41a' },
  { name: 'magenta', color: '#eb2f96' },
  { name: 'red', color: '#f5222d' },
  { name: 'orange', color: '#fa8c16' },
  { name: 'gold', color: '#faad14' },
]

// 状态
const isOpen = ref(false)
const currentColor = ref('#1890ff')
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

// 主题管理器
const themeManager = new ThemeManager()

// 下拉框位置
const dropdownStyle = computed(() => {
  if (!triggerRef.value) return {}
  
  const rect = triggerRef.value.getBoundingClientRect()
  const dropdownWidth = 320
  const gap = 8
  
  return {
    position: 'fixed',
    top: `${rect.bottom + gap}px`,
    left: `${rect.left}px`,
    minWidth: `${dropdownWidth}px`,
    zIndex: 1000,
  }
})

// 切换下拉框
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 选择颜色
const selectColor = (color: string) => {
  currentColor.value = color
  themeManager.applyTheme(color)
  isOpen.value = false
}

// 处理颜色输入
const handleColorInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  selectColor(target.value)
}

// 处理 HEX 输入
const handleHexInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value.trim()
  
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    selectColor(value)
  }
}

// 点击外部关闭
const handleClickOutside = (e: MouseEvent) => {
  if (!triggerRef.value || !dropdownRef.value) return
  
  const target = e.target as Node
  if (!triggerRef.value.contains(target) && !dropdownRef.value.contains(target)) {
    isOpen.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // 恢复保存的主题
  const theme = themeManager.getCurrentTheme()
  if (theme) {
    currentColor.value = theme.primaryColor
  }
})

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
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 6px;
  background: var(--color-bg-container, #ffffff);
  cursor: pointer;
  transition: all 0.2s;
}

.picker-trigger:hover {
  border-color: var(--color-primary-hover, #40a9ff);
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 16px;
  line-height: 1;
}

.picker-dropdown {
  background: var(--color-bg-container, #ffffff);
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.picker-content {
  padding: 16px;
}

.section-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary, #666);
  margin-bottom: 12px;
}

.preset-colors {
  margin-bottom: 16px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-item:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.color-item.active {
  border-color: var(--color-primary, #1890ff);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.custom-color {
  padding-top: 16px;
  border-top: 1px solid var(--color-border, #f0f0f0);
}

.color-input-group {
  display: flex;
  gap: 8px;
}

.color-input-group input[type="color"] {
  width: 40px;
  height: 32px;
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 6px;
  cursor: pointer;
}

.color-input-group input[type="text"] {
  flex: 1;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--color-border, #d9d9d9);
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.color-input-group input[type="text"]:focus {
  outline: none;
  border-color: var(--color-primary, #1890ff);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}
</style>
