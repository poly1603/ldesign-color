<template>
  <section id="generator" class="generator-section">
    <div class="section-header">
      <h2 class="section-title">🎨 颜色生成演示</h2>
      <p class="section-description">
        体验智能颜色生成算法，看看如何从一个主色调生成完整的配色方案
      </p>
    </div>

    <div class="demo-container">
      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="color-input-group">
          <label for="primary-color">主色调</label>
          <div class="input-wrapper">
            <input
              id="primary-color"
              type="color"
              v-model="primaryColor"
              class="color-picker"
            />
            <input
              type="text"
              v-model="primaryColor"
              class="color-text"
              placeholder="#1890ff"
              @blur="validateColor"
            />
          </div>
        </div>

        <!-- 预设颜色 -->
        <div class="preset-colors">
          <label>预设颜色</label>
          <div class="preset-grid">
            <button
              v-for="preset in presetColors"
              :key="preset.name"
              class="preset-item"
              :class="{ active: primaryColor === preset.color }"
              :style="{ backgroundColor: preset.color }"
              @click="primaryColor = preset.color"
              :title="preset.name"
            >
              <span class="preset-name">{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- 随机生成 -->
        <div class="random-section">
          <button class="btn btn-secondary" @click="generateRandomColor">
            🎲 随机颜色
          </button>
        </div>
      </div>

      <!-- 结果展示 -->
      <div class="result-panel">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
          <span>正在生成主题...</span>
        </div>

        <!-- 语义化颜色 -->
        <div v-if="theme" class="semantic-section">
          <h3>语义化颜色</h3>
          <div class="semantic-grid">
            <div
              v-for="(color, name) in theme.semanticColors"
              :key="name"
              class="semantic-item"
              @click="copyColor(color)"
            >
              <div
                class="color-preview"
                :style="{ backgroundColor: color }"
              ></div>
              <div class="color-info">
                <div class="color-name">{{ name }}</div>
                <div class="color-value">{{ color }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 色阶展示 -->
        <div v-if="theme" class="palette-section">
          <div class="palette-header">
            <h3>色阶展示</h3>
            <div class="mode-switch">
              <button
                class="mode-btn"
                :class="{ active: currentMode === 'light' }"
                @click="currentMode = 'light'"
              >
                ☀️ 明亮
              </button>
              <button
                class="mode-btn"
                :class="{ active: currentMode === 'dark' }"
                @click="currentMode = 'dark'"
              >
                🌙 暗黑
              </button>
            </div>
          </div>

          <div class="palette-grid">
            <div
              v-for="(colors, name) in currentPalette"
              :key="name"
              class="palette-row"
            >
              <div class="palette-name">{{ name }}</div>
              <div class="palette-colors">
                <div
                  v-for="(color, index) in colors"
                  :key="index"
                  class="palette-color"
                  :style="{ backgroundColor: color }"
                  @click="copyColor(color)"
                  :title="`${name}-${index + 1}: ${color}`"
                >
                  <span class="color-index">{{ index + 1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CSS变量预览 -->
        <div v-if="theme" class="css-section">
          <h3>CSS变量</h3>
          <div class="css-preview">
            <pre><code>{{ cssPreview }}</code></pre>
          </div>
          <button class="btn btn-primary" @click="copyCSSVariables">
            📋 复制CSS变量
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { generateRandomColor, generateTheme } from '@ldesign/color'
import { computed, ref, watch } from 'vue'

// 响应式数据
const primaryColor = ref('#1890ff')
const currentMode = ref<'light' | 'dark'>('light')
const theme = ref(null)
const loading = ref(false)
const error = ref(null)

// 生成主题的函数
const generateColorTheme = async (color: string) => {
  loading.value = true
  error.value = null
  try {
    const newTheme = generateTheme(color)
    theme.value = newTheme

    // 自动注入CSS变量到页面
    injectCSSVariables(newTheme.cssVariables)
  } catch (err) {
    error.value = err.message
    console.error('生成主题失败:', err)
  } finally {
    loading.value = false
  }
}

// 注入CSS变量到页面
const injectCSSVariables = (cssVariables: string) => {
  // 移除之前的样式
  const existingStyle = document.getElementById('ldesign-color-vars')
  if (existingStyle) {
    existingStyle.remove()
  }

  // 创建新的样式标签
  const style = document.createElement('style')
  style.id = 'ldesign-color-vars'
  style.textContent = cssVariables
  document.head.appendChild(style)
}

// 监听颜色变化
watch(primaryColor, (newColor) => {
  generateColorTheme(newColor)
}, { immediate: true })

// 预设颜色
const presetColors = [
  { name: '蓝色', color: '#1890ff' },
  { name: '绿色', color: '#52c41a' },
  { name: '红色', color: '#f5222d' },
  { name: '橙色', color: '#fa541c' },
  { name: '紫色', color: '#722ed1' },
  { name: '青色', color: '#13c2c2' },
  { name: '黄色', color: '#faad14' },
  { name: '粉色', color: '#eb2f96' }
]

// 当前色阶
const currentPalette = computed(() => {
  if (!theme.value) return {}
  return currentMode.value === 'light'
    ? theme.value.palettes.light
    : theme.value.palettes.dark
})

// CSS变量预览（只显示部分）
const cssPreview = computed(() => {
  if (!theme.value) return ''

  const lines = theme.value.cssVariables.split('\n')
  const preview = lines.slice(0, 20).join('\n')
  return preview + (lines.length > 20 ? '\n/* ... 更多变量 */' : '')
})

// 验证颜色格式
const validateColor = () => {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!colorRegex.test(primaryColor.value)) {
    primaryColor.value = '#1890ff'
  }
}

// 生成随机颜色
const generateRandomColorHandler = () => {
  primaryColor.value = generateRandomColor()
}

// 复制颜色
const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
    console.log(`已复制颜色: ${color}`)
    // 这里可以添加提示消息
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 复制CSS变量
const copyCSSVariables = async () => {
  if (!theme.value) return

  try {
    await navigator.clipboard.writeText(theme.value.cssVariables)
    console.log('已复制CSS变量')
    // 这里可以添加提示消息
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.generator-section {
  padding: var(--space-2xl) 0;
  background-color: var(--bg-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-2xl);
  max-width: 1200px;
  margin: 0 auto;
}

.control-panel {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  height: fit-content;
  position: sticky;
  top: 80px;
}

.color-input-group {
  margin-bottom: var(--space-xl);
}

.color-input-group label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.input-wrapper {
  display: flex;
  gap: var(--space-sm);
}

.color-picker {
  width: 60px;
  height: 40px;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.color-text {
  flex: 1;
  height: 40px;
  padding: 0 var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: 'Monaco', 'Menlo', monospace;
}

.preset-colors {
  margin-bottom: var(--space-xl);
}

.preset-colors label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.preset-item {
  height: 60px;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: end;
  padding: var(--space-sm);
  position: relative;
  overflow: hidden;
}

.preset-item:hover {
  transform: scale(1.05);
}

.preset-item.active {
  border-color: var(--color-white);
  box-shadow: 0 0 0 2px var(--ldesign-primary, #1890ff);
}

.preset-name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.result-panel {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  position: relative;
  min-height: 600px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  border-radius: var(--radius-lg);
  z-index: 10;
}

[data-theme="dark"] .loading-overlay {
  background-color: rgba(20, 20, 20, 0.9);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-primary);
  border-top: 3px solid var(--ldesign-primary, #1890ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.semantic-section {
  margin-bottom: var(--space-2xl);
}

.semantic-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.semantic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.semantic-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.semantic-item:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
}

.color-info {
  flex: 1;
}

.color-name {
  font-weight: 500;
  color: var(--text-primary);
  text-transform: capitalize;
  margin-bottom: 2px;
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: var(--text-tertiary);
}

.palette-section {
  margin-bottom: var(--space-2xl);
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.palette-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mode-switch {
  display: flex;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.mode-btn {
  padding: var(--space-sm) var(--space-md);
  border: none;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 12px;
}

.mode-btn.active {
  background-color: var(--ldesign-primary, #1890ff);
  color: white;
}

.palette-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.palette-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.palette-name {
  width: 80px;
  font-weight: 500;
  color: var(--text-primary);
  text-transform: capitalize;
  font-size: 14px;
}

.palette-colors {
  display: flex;
  flex: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-primary);
}

.palette-color {
  flex: 1;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  position: relative;
}

.palette-color:hover {
  transform: scaleY(1.1);
  z-index: 1;
}

.color-index {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.palette-color:hover .color-index {
  opacity: 1;
}

.css-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.css-preview {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  max-height: 300px;
  overflow-y: auto;
}

.css-preview pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .control-panel {
    position: static;
  }

  .semantic-grid {
    grid-template-columns: 1fr;
  }

  .palette-row {
    flex-direction: column;
    align-items: stretch;
  }

  .palette-name {
    width: auto;
    margin-bottom: var(--space-sm);
  }
}
</style>
