<script setup lang="ts">
/**
 * VueThemeModeSwitcher - 基于无头逻辑层重构
 * 使用 @ldesign/shared 的协议和逻辑层
 */
import { computed, inject, onMounted, ref, watch } from 'vue'
import type { SelectorConfig, SelectorOption } from '@ldesign/shared/protocols'
import { useHeadlessSelector, useResponsivePopup } from '@ldesign/shared/composables'
import { renderIcon } from '@ldesign/shared/icons'
import { getLocale } from '../locales'

export type ThemeMode = 'light' | 'dark' | 'system'

const props = defineProps<{
  defaultMode?: ThemeMode
  storageKey?: string
}>()

const emit = defineEmits<{
  'update:mode': [mode: ThemeMode]
  'change': [mode: ThemeMode]
}>()

const STORAGE_KEY = props.storageKey || 'ld-theme-mode'
const currentMode = ref<ThemeMode>('system')
const systemPreference = ref<'light' | 'dark'>('light')

// 国际化
const appLocale = inject<any>('locale', null)
const currentLocale = computed(() => {
  if (appLocale && appLocale.value) {
    return appLocale.value
  }
  return 'zh-CN'
})

const locale = computed(() => getLocale(currentLocale.value))

// 选择器配置（遵循协议）
const config: SelectorConfig = {
  icon: 'Monitor',
  popupMode: 'auto',
  listStyle: 'simple',
  searchable: false,
  breakpoint: 768
}

// 模式选项
const modes = computed<SelectorOption[]>(() => [
  {
    value: 'light',
    label: locale.value.themeMode.light,
    icon: '☀️',
    metadata: { icon: 'Sun' }
  },
  {
    value: 'dark',
    label: locale.value.themeMode.dark,
    icon: '🌙',
    metadata: { icon: 'Moon' }
  },
  {
    value: 'system',
    label: locale.value.themeMode.system,
    icon: '💻',
    metadata: { icon: 'Monitor' }
  }
])

const currentModeLabel = computed(() => {
  const mode = modes.value.find(m => m.value === currentMode.value)
  return mode?.label || '主题'
})

const currentModeIcon = computed(() => {
  const mode = modes.value.find(m => m.value === currentMode.value)
  return mode?.icon || '💻'
})

const effectiveTheme = computed(() => {
  if (currentMode.value === 'system') {
    return systemPreference.value
  }
  return currentMode.value
})

// 监听系统主题变化
const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

const updateSystemPreference = () => {
  if (mediaQuery) {
    systemPreference.value = mediaQuery.matches ? 'dark' : 'light'
  }
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  if (theme === 'dark') {
    root.setAttribute('theme-mode', 'dark')
  } else {
    root.removeAttribute('theme-mode')
  }

  root.setAttribute('data-theme-mode', theme)
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

const handleModeChange = (value: ThemeMode) => {
  currentMode.value = value
  localStorage.setItem(STORAGE_KEY, value)

  emit('update:mode', value)
  emit('change', value)
}

// 使用无头选择器
const { state, actions, triggerRef, panelRef, activeIndexRef } = useHeadlessSelector({
  options: modes,
  modelValue: currentMode,
  searchable: config.searchable,
  onSelect: (value: ThemeMode) => handleModeChange(value)
})

// 使用响应式弹出
const { currentMode: popupMode, popupStyle } = useResponsivePopup({
  mode: config.popupMode,
  triggerRef,
  panelRef,
  placement: 'bottom-start',
  breakpoint: config.breakpoint,
  isOpen: computed(() => state.value.isOpen)
})

// 监听主题变化
watch(effectiveTheme, (newTheme) => {
  applyTheme(newTheme)
})

// 监听系统主题变化
watch(systemPreference, () => {
  if (currentMode.value === 'system') {
    applyTheme(systemPreference.value)
  }
})

onMounted(() => {
  // 初始化系统主题偏好
  updateSystemPreference()
  if (mediaQuery) {
    mediaQuery.addEventListener('change', updateSystemPreference)
  }

  // 从 localStorage 读取保存的主题模式
  const savedMode = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (savedMode && modes.value.some(m => m.value === savedMode)) {
    currentMode.value = savedMode
  } else if (props.defaultMode) {
    currentMode.value = props.defaultMode
  }

  // 应用初始主题
  applyTheme(effectiveTheme.value)
})
</script>

<template>
  <div class="theme-mode-switcher">
    <button ref="triggerRef" class="theme-mode-button" :title="currentModeLabel" :aria-expanded="state.isOpen"
      @click="actions.toggle">
      <span class="theme-icon">{{ currentModeIcon }}</span>
      <span class="theme-label">{{ currentModeLabel }}</span>
      <svg class="arrow" :class="{ open: state.isOpen }" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <Teleport to="body">
      <transition name="selector-panel">
        <div v-if="state.isOpen" ref="panelRef" class="theme-dropdown"
          :class="{ 'theme-dropdown-dialog': popupMode === 'dialog' }" :style="popupStyle" @click.stop>
          <button v-for="(option, index) in state.filteredOptions" :key="option.value" class="theme-option" :class="{
            'active': state.selectedValue === option.value,
            'hover': state.activeIndex === index
          }" @click="actions.select(option.value)" @mouseenter="activeIndexRef = index">
            <span class="option-icon">{{ option.icon }}</span>
            <span class="option-label">{{ option.label }}</span>
            <svg v-if="state.selectedValue === option.value" class="check-icon" xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
.theme-mode-switcher {
  position: relative;
  display: inline-block;
}

.theme-mode-button {
  display: flex;
  align-items: center;
  gap: var(--size-spacing-md);
  padding: var(--size-spacing-md) var(--size-spacing-lg);
  background: var(--color-bg-container);
  border: var(--size-border-width-thin) solid var(--color-border-light);
  border-radius: var(--size-radius-lg);
  color: var(--color-text-primary);
  font-size: var(--size-font-base);
  font-weight: var(--size-font-weight-medium);
  cursor: pointer;
  transition: all var(--size-duration-fast) var(--size-ease-out);
}

.theme-mode-button:hover {
  background: var(--color-bg-component-hover);
  border-color: var(--color-border);
}

.theme-mode-button[aria-expanded="true"] {
  border-color: var(--color-primary-default);
  box-shadow: 0 0 0 2px var(--color-primary-lighter);
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
}

.theme-label {
  white-space: nowrap;
}

.arrow {
  transition: transform 0.2s ease;
  color: #666;
}

.arrow.open {
  transform: rotate(180deg);
}

/* 弹窗面板 - 使用 CSS 变量统一样式 */
.theme-dropdown {
  min-width: 180px;
  background: var(--color-bg-container);
  border: var(--size-border-width-thin) solid var(--color-border-lighter);
  border-radius: var(--size-radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  padding: var(--size-spacing-xs);
}

.theme-dropdown-dialog {
  max-width: 90vw;
  max-height: 80vh;
}

/* 选项样式 - 使用 CSS 变量统一样式 */
.theme-option {
  display: flex;
  align-items: center;
  gap: var(--size-spacing-lg);
  width: 100%;
  padding: var(--size-spacing-lg) var(--size-spacing-xl);
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--size-font-base);
  cursor: pointer;
  transition: background var(--size-duration-fast) var(--size-ease-out);
  text-align: left;
  border-radius: var(--size-radius-md);
}

.theme-option:hover,
.theme-option.hover {
  background: var(--color-bg-component-hover);
}

.theme-option.active {
  background: color-mix(in srgb, var(--color-primary-default) 8%, transparent);
  color: var(--color-primary-default);
  font-weight: var(--size-font-weight-semibold);
}

.option-icon {
  font-size: 18px;
  line-height: 1;
}

.option-label {
  flex: 1;
}

.check-icon {
  color: #667eea;
}

/* Dropdown animation - 统一标准 */
.selector-panel-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.selector-panel-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.selector-panel-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.selector-panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 深色模式会自动通过 CSS 变量切换,无需额外定义 */
/* CSS 变量在 :root[data-theme-mode='dark'] 下会自动更新 */
</style>
