<template>
  <div class="color-demo">
    <h1>🎨 @ldesign/color 完整演示</h1>

    <!-- 颜色输入区域 -->
    <div class="input-section">
      <div class="color-input-group">
        <label>选择主色调：</label>
        <input
          type="color"
          v-model="primaryColor"
          class="color-picker"
        />
        <input
          type="text"
          v-model="primaryColor"
          class="color-text"
          placeholder="#1890ff"
        />
        <button @click="generateRandom" class="btn-random">🎲 随机颜色</button>
      </div>

      <!-- 预设主题 -->
      <div class="preset-themes">
        <label>预设主题：</label>
        <div class="preset-grid">
          <button
            v-for="preset in presetThemes"
            :key="preset.name"
            @click="applyPreset(preset)"
            class="preset-btn"
            :class="{ active: primaryColor === preset.color }"
            :style="{ backgroundColor: preset.color }"
            :title="preset.name"
          >
            <span class="preset-name">{{ preset.name }}</span>
          </button>
        </div>
      </div>

      <div class="controls-row">
        <div class="mode-switch">
          <button
            :class="{ active: currentMode === 'light' }"
            @click="currentMode = 'light'"
            class="mode-btn"
          >
            ☀️ 明亮模式
          </button>
          <button
            :class="{ active: currentMode === 'dark' }"
            @click="currentMode = 'dark'"
            class="mode-btn"
          >
            🌙 暗黑模式
          </button>
        </div>

        <div class="gray-config">
          <label class="config-label">
            <input
              type="checkbox"
              v-model="grayMixPrimary"
              @change="regenerateTheme"
            />
            灰色混入主色调
          </label>
          <div v-if="grayMixPrimary" class="mix-ratio">
            <label>混入比例：</label>
            <input
              type="range"
              v-model="grayMixRatio"
              @input="regenerateTheme"
              min="0"
              max="1"
              step="0.1"
              class="ratio-slider"
            />
            <span class="ratio-value">{{ Math.round(grayMixRatio * 100) }}%</span>
          </div>
        </div>

        <div class="css-config">
          <div class="config-item">
            <label>CSS前缀：</label>
            <input
              type="text"
              v-model="cssPrefix"
              @input="regenerateTheme"
              class="text-input"
              placeholder="ldesign"
            />
          </div>
          <button @click="addCustomTheme" class="btn-add-theme">
            ➕ 添加预设
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>正在生成主题...</span>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error">
      错误: {{ error }}
    </div>

    <!-- 主题展示 -->
    <div v-if="theme && !loading" class="theme-display">
      <!-- 语义化颜色 -->
      <section class="semantic-section">
        <h2>语义化颜色</h2>
        <div class="semantic-grid">
          <div
            v-for="(color, name) in theme.semanticColors"
            :key="name"
            class="semantic-item"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
            :title="`点击复制 ${color}`"
          >
            <span class="color-name">{{ name }}</span>
            <span class="color-value">{{ color }}</span>
          </div>
        </div>
      </section>

      <!-- 色阶展示 -->
      <section class="palette-section" :class="{ 'dark-mode': currentMode === 'dark' }">
        <h2>{{ currentMode === 'light' ? '明亮模式' : '暗黑模式' }}色阶</h2>
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
                :title="`${name}-${currentMode === 'dark' ? (12 - index) : (index + 1)}: ${color}`"
              >
                <span class="color-index">{{ currentMode === 'dark' ? (12 - index) : (index + 1) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CSS变量展示 -->
      <section class="css-section">
        <h2>生成的CSS变量 <span class="css-count">({{ cssPreview.split('\n').filter(line => line.includes(':')).length }} 个变量)</span></h2>
        <div class="css-preview">
          <pre><code>{{ cssPreview }}</code></pre>
        </div>
        <div class="css-actions">
          <button @click="copyCSSVariables" class="btn-copy">📋 复制CSS变量</button>
          <button @click="downloadCSS" class="btn-download">💾 下载CSS文件</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createPresetThemeManager, generateRandomColor, generateTheme } from '@ldesign/color'
import { computed, ref, watch } from 'vue'

// 响应式数据
const primaryColor = ref('#1890ff')
const currentMode = ref<'light' | 'dark'>('light')
const theme = ref(null)
const loading = ref(false)
const error = ref(null)
const grayMixPrimary = ref(true)
const grayMixRatio = ref(0.2)

// 预设主题管理器
const presetManager = createPresetThemeManager()
const presetThemes = presetManager.getEnabledThemes()

// CSS变量配置
const cssPrefix = ref('ldesign')
const semanticNames = ref({
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  gray: 'gray',
})

// 当前色阶
const currentPalette = computed(() => {
  if (!theme.value) return {}
  const palette = currentMode.value === 'light'
    ? theme.value.palettes.light
    : theme.value.palettes.dark

  // 暗黑模式需要反转色阶顺序（从深到浅）
  if (currentMode.value === 'dark') {
    const reversedPalette = {}
    Object.keys(palette).forEach(key => {
      reversedPalette[key] = [...palette[key]].reverse()
    })
    return reversedPalette
  }

  return palette
})

// CSS变量预览（显示完整内容）
const cssPreview = computed(() => {
  if (!theme.value) return ''
  return theme.value.cssVariables
})

// 生成主题的函数
const generateColorTheme = async (color: string) => {
  loading.value = true
  error.value = null
  try {
    const newTheme = generateTheme(color, {
      grayMixPrimary: grayMixPrimary.value,
      grayMixRatio: grayMixRatio.value,
      cssPrefix: cssPrefix.value,
      semanticNames: semanticNames.value,
      autoInject: true,
    })
    theme.value = newTheme

    // 自动注入CSS变量到页面
    if (newTheme.cssVariables) {
      newTheme.cssGenerator.injectToHead(newTheme.cssVariables)
    }
  } catch (err) {
    error.value = err.message || '生成主题失败'
    console.error('生成主题失败:', err)
  } finally {
    loading.value = false
  }
}

// 添加自定义预设主题
const addCustomTheme = () => {
  const name = prompt('请输入主题名称:')
  if (!name) return

  const color = prompt('请输入主题颜色 (如: #1890ff):')
  if (!color) return

  presetManager.addTheme({
    name,
    color,
    description: `自定义${name}主题`,
  })
}

// 生成随机颜色
const generateRandom = () => {
  primaryColor.value = generateRandomColor()
}

// 应用预设主题
const applyPreset = (preset) => {
  primaryColor.value = preset.color
}

// 重新生成主题（当配置改变时）
const regenerateTheme = () => {
  generateColorTheme(primaryColor.value)
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

// 下载CSS文件
const downloadCSS = () => {
  if (!theme.value) return

  const blob = new Blob([theme.value.cssVariables], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ldesign-color-${primaryColor.value.replace('#', '')}.css`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 监听颜色变化
watch(primaryColor, (newColor) => {
  generateColorTheme(newColor)
}, { immediate: true })
</script>

<style scoped>
.color-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.input-section {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.color-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.color-input-group label {
  font-weight: 500;
  color: #333;
}

.color-picker {
  width: 60px;
  height: 40px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
}

.color-text {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  width: 120px;
}

.btn-random {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 8px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-random:hover {
  background: #0056b3;
}

.preset-themes {
  margin-bottom: 1.5rem;
}

.preset-themes label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
}

.preset-btn {
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.preset-btn.active {
  border-color: #333;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.preset-name {
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.controls-row {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.mode-switch {
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.mode-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.mode-btn.active {
  background: #007bff;
  color: white;
}

.gray-config {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.config-label input[type="checkbox"] {
  margin: 0;
}

.mix-ratio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 12px;
  color: #666;
}

.ratio-slider {
  width: 100px;
}

.ratio-value {
  font-weight: 600;
  color: #333;
  min-width: 35px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.theme-display {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.semantic-section h2,
.palette-section h2,
.css-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.css-count {
  font-size: 0.875rem;
  color: #666;
  font-weight: normal;
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* 暗黑模式样式 */
.palette-section.dark-mode {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
}

.palette-section.dark-mode h2 {
  color: #fff;
}

.palette-section.dark-mode .palette-name {
  color: #ccc;
}

.semantic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.semantic-item {
  padding: 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 100px;
  justify-content: center;
}

.semantic-item:hover {
  transform: translateY(-2px);
}

.color-name {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  text-transform: capitalize;
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.palette-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.palette-name {
  width: 80px;
  font-weight: 500;
  text-transform: capitalize;
  font-size: 14px;
}

.palette-colors {
  display: flex;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

.palette-color {
  flex: 1;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
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
  transition: opacity 0.2s;
}

.palette-color:hover .color-index {
  opacity: 1;
}

.css-preview {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.css-preview pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #333;
}

.css-actions {
  display: flex;
  gap: 1rem;
}

.btn-copy,
.btn-download {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 8px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-copy:hover,
.btn-download:hover {
  background: #007bff;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .color-demo {
    padding: 1rem;
  }

  .color-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .semantic-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .palette-row {
    flex-direction: column;
    align-items: stretch;
  }

  .palette-name {
    width: auto;
    margin-bottom: 0.5rem;
  }

  .css-actions {
    flex-direction: column;
  }
}

/* 新增CSS配置样式 */
.css-config {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
}

.text-input {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
}

.btn-add-theme {
  padding: 4px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-add-theme:hover {
  background: #40a9ff;
}
</style>
