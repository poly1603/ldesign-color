<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ColorPalette as ColorPaletteComponent,
  ColorPicker,
  ColorProvider,
  ThemePreview,
  presetColors as defaultPresets,
  useColor,
} from '@ldesign/color'

// ColorPicker 演示
const pickerColor = ref('#1890ff')
const presetColors = Object.values(defaultPresets).slice(0, 8)

// ColorPalette 演示
const showValues = ref(true)
const samplePalette = [
  '#e6f7ff',
'#bae7ff',
'#91d5ff',
'#69c0ff',
  '#40a9ff',
'#1890ff',
'#096dd9',
'#0050b3',
]

// ColorProvider 演示
const providerColor = ref('#52c41a')

// useColor API 演示
const apiColor = ref('#722ed1')
const showMetrics = ref(false)

const {
  theme: apiTheme,
  loading: apiLoading,
  error: apiError,
  isValid: apiIsValid,
  clearCache: clearApiCache,
  getPerformanceMetrics,
} = useColor(apiColor, {
  enableCache: true,
  useWebWorker: false,
})

const apiMetrics = computed(() => {
  return getPerformanceMetrics()
})

// 事件处理
function handlePickerChange(color: string) {
  console.log('颜色选择器变化:', color)
}

function handlePaletteClick({ color, index }: { color: string, index: number }) {
  copyColor(color)
  console.log(`点击了第${index + 1}个颜色: ${color}`)
}

async function copyColor(color: string) {
  try {
    await navigator.clipboard.writeText(color)
    console.log(`已复制颜色: ${color}`)
  }
 catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<template>
  <section id="components" class="components-section">
    <div class="section-header">
      <h2 class="section-title">
        🔧 组件演示
      </h2>
      <p class="section-description">
        体验 @ldesign/color 提供的Vue组件，包括颜色选择器、色阶展示等
      </p>
    </div>

    <div class="demo-grid">
      <!-- ColorPicker 演示 -->
      <div class="demo-card">
        <h3 class="demo-title">
          ColorPicker 颜色选择器
        </h3>
        <p class="demo-description">
          支持预设颜色、自定义输入的颜色选择器组件
        </p>

        <div class="demo-content">
          <ColorPicker
            v-model="pickerColor"
            :preset-colors="presetColors"
            :show-presets="true"
            @change="handlePickerChange"
          />

          <div class="result-display">
            <div class="selected-color">
              <div
                class="color-block"
                :style="{ backgroundColor: pickerColor }"
              />
              <span class="color-text">{{ pickerColor }}</span>
            </div>
          </div>
        </div>

        <div class="code-example">
          <details>
            <summary>查看代码</summary>
            <pre><code>&lt;ColorPicker
  v-model="color"
  :preset-colors="presetColors"
  :show-presets="true"
  @change="handleChange"
/&gt;</code></pre>
          </details>
        </div>
      </div>

      <!-- ColorPalette 演示 -->
      <div class="demo-card">
        <h3 class="demo-title">
          ColorPalette 色阶展示
        </h3>
        <p class="demo-description">
          展示颜色色阶的组件，支持点击复制
        </p>

        <div class="demo-content">
          <ColorPaletteComponent
            color-name="primary"
            :colors="samplePalette"
            :show-values="showValues"
            :copyable="true"
            @color-click="handlePaletteClick"
          />

          <div class="palette-controls">
            <label>
              <input v-model="showValues" type="checkbox">
              显示颜色值
            </label>
          </div>
        </div>

        <div class="code-example">
          <details>
            <summary>查看代码</summary>
            <pre><code>&lt;ColorPalette
  color-name="primary"
  :colors="colors"
  :show-values="true"
  :copyable="true"
  @color-click="handleClick"
/&gt;</code></pre>
          </details>
        </div>
      </div>

      <!-- ColorProvider 演示 -->
      <div class="demo-card full-width">
        <h3 class="demo-title">
          ColorProvider 上下文提供者
        </h3>
        <p class="demo-description">
          为子组件提供颜色主题上下文的容器组件
        </p>

        <div class="demo-content">
          <ColorProvider
            :primary-color="providerColor"
            :show-loading="true"
            loading-text="正在生成主题..."
          >
            <div class="provider-demo">
              <div class="color-input">
                <label>主色调：</label>
                <input
                  v-model="providerColor"
                  type="color"
                  class="color-picker"
                >
                <span class="color-value">{{ providerColor }}</span>
              </div>

              <ThemePreview />
            </div>
          </ColorProvider>
        </div>

        <div class="code-example">
          <details>
            <summary>查看代码</summary>
            <pre><code>&lt;ColorProvider primary-color="#1890ff"&gt;
  &lt;ThemePreview /&gt;
  &lt;!-- 其他子组件 --&gt;
&lt;/ColorProvider&gt;</code></pre>
          </details>
        </div>
      </div>

      <!-- 组合式API演示 -->
      <div class="demo-card full-width">
        <h3 class="demo-title">
          useColor 组合式API
        </h3>
        <p class="demo-description">
          Vue 3 组合式API，提供响应式的颜色管理
        </p>

        <div class="demo-content">
          <div class="api-demo">
            <div class="controls">
              <div class="control-group">
                <label>颜色：</label>
                <input
                  v-model="apiColor"
                  type="color"
                  class="color-picker"
                >
                <input
                  v-model="apiColor"
                  type="text"
                  class="color-input"
                >
              </div>

              <div class="control-group">
                <button
                  class="btn btn-secondary"
                  @click="clearApiCache"
                >
                  清除缓存
                </button>
                <button
                  class="btn btn-secondary"
                  @click="showMetrics = !showMetrics"
                >
                  {{ showMetrics ? '隐藏' : '显示' }}性能指标
                </button>
              </div>
            </div>

            <div class="api-status">
              <div class="status-item">
                <span class="label">状态：</span>
                <span class="value" :class="{ loading: apiLoading, error: apiError }">
                  {{ apiLoading ? '生成中...' : apiError ? '错误' : '完成' }}
                </span>
              </div>
              <div class="status-item">
                <span class="label">有效性：</span>
                <span class="value" :class="{ valid: apiIsValid, invalid: !apiIsValid }">
                  {{ apiIsValid ? '有效' : '无效' }}
                </span>
              </div>
            </div>

            <div v-if="showMetrics && apiMetrics" class="metrics-display">
              <h4>性能指标</h4>
              <div class="metrics-grid">
                <div class="metric">
                  <span class="metric-label">语义化颜色生成：</span>
                  <span class="metric-value">{{ apiMetrics.semanticColorGeneration.toFixed(2) }}ms</span>
                </div>
                <div class="metric">
                  <span class="metric-label">色阶生成：</span>
                  <span class="metric-value">{{ apiMetrics.paletteGeneration.toFixed(2) }}ms</span>
                </div>
                <div class="metric">
                  <span class="metric-label">CSS变量生成：</span>
                  <span class="metric-value">{{ apiMetrics.cssVariableGeneration.toFixed(2) }}ms</span>
                </div>
                <div class="metric">
                  <span class="metric-label">总耗时：</span>
                  <span class="metric-value">{{ apiMetrics.totalTime.toFixed(2) }}ms</span>
                </div>
              </div>
            </div>

            <div v-if="apiTheme" class="theme-result">
              <h4>生成的语义化颜色</h4>
              <div class="semantic-colors">
                <div
                  v-for="(color, name) in apiTheme.semanticColors"
                  :key="name"
                  class="semantic-item"
                  :style="{ backgroundColor: color }"
                  @click="copyColor(color)"
                >
                  <span class="color-name">{{ name }}</span>
                  <span class="color-value">{{ color }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="code-example">
          <details>
            <summary>查看代码</summary>
            <pre><code>import { ref } from 'vue'
import { useColor } from '@ldesign/color'

const primaryColor = ref('#1890ff')

const {
  theme,
  loading,
  error,
  isValid,
  clearCache,
  getPerformanceMetrics
} = useColor(primaryColor)</code></pre>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.components-section {
  padding: var(--space-2xl) 0;
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

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

.demo-card.full-width {
  grid-column: 1 / -1;
}

.demo-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.demo-description {
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.demo-content {
  margin-bottom: var(--space-lg);
}

.result-display {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.selected-color {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.color-block {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
}

.color-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  color: var(--text-primary);
}

.palette-controls {
  margin-top: var(--space-md);
}

.palette-controls label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
}

.provider-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.color-input {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.color-input label {
  font-weight: 500;
  color: var(--text-primary);
}

.color-picker {
  width: 50px;
  height: 32px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: var(--text-secondary);
}

.api-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.control-group label {
  font-weight: 500;
  color: var(--text-primary);
}

.color-input {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: 'Monaco', 'Menlo', monospace;
  width: 120px;
}

.api-status {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.status-item {
  display: flex;
  gap: var(--space-sm);
}

.status-item .label {
  font-weight: 500;
  color: var(--text-secondary);
}

.status-item .value {
  font-weight: 500;
}

.value.loading {
  color: var(--ldesign-warning, #faad14);
}

.value.error {
  color: var(--ldesign-danger, #f5222d);
}

.value.valid {
  color: var(--ldesign-success, #52c41a);
}

.value.invalid {
  color: var(--ldesign-danger, #f5222d);
}

.metrics-display {
  padding: var(--space-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.metrics-display h4 {
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-sm);
}

.metric {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm);
  background-color: var(--bg-primary);
  border-radius: var(--radius-sm);
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.metric-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--ldesign-primary, #1890ff);
}

.theme-result h4 {
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.semantic-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
}

.semantic-item {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  min-height: 80px;
  justify-content: center;
}

.semantic-item:hover {
  transform: translateY(-2px);
}

.color-name {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  text-transform: capitalize;
  font-size: 12px;
}

.semantic-item .color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.code-example {
  border-top: 1px solid var(--border-primary);
  padding-top: var(--space-md);
}

.code-example details {
  cursor: pointer;
}

.code-example summary {
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.code-example pre {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin: 0;
  overflow-x: auto;
}

.code-example code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: 1fr;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .control-group {
    justify-content: space-between;
  }

  .api-status {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .semantic-colors {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
