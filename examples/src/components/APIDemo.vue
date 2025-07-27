<script setup lang="ts">
import { ref } from 'vue'
import {
  ColorGenerator,
  LRUCache,
  PerformanceMonitor,
  analyzeColor,
  generateTheme,
  hexToHsl,
  isValidColor,
  useColor,
  useThemeSwitch,
} from '@ldesign/color'

// 核心API演示
const generatorResult = ref(null)
const convenienceResult = ref(null)

// Vue API演示
const vueApiColor = ref('#1890ff')
const {
  theme: vueApiTheme,
  loading: vueApiLoading,
  error: vueApiError,
} = useColor(vueApiColor)

// 主题切换演示
const {
  currentTheme: demoCurrentTheme,
  toggleTheme: toggleDemoTheme,
  isDark: demoDarkMode,
} = useThemeSwitch()

// 工具函数演示
const utilsTestColor = ref('#1890ff')
const utilsResult = ref(null)

// 性能工具演示
const performanceResult = ref(null)

// 演示函数
function demoColorGenerator() {
  const generator = new ColorGenerator({
    enableCache: true,
    cacheSize: 100,
    useWebWorker: false,
  })

  const theme = generator.generate('#1890ff')
  generatorResult.value = {
    semanticColors: theme.semanticColors,
    timestamp: theme.timestamp,
  }
}

async function demoConvenienceFunctions() {
  const theme = generateTheme('#52c41a')
  convenienceResult.value = theme
}

function testColorUtils() {
  const color = utilsTestColor.value

  try {
    const valid = isValidColor(color)
    if (valid) {
      const hsl = hexToHsl(color)
      const rgb = hexToRgb(color)
      const analysis = analyzeColor(color)

      utilsResult.value = {
        isValid: valid,
        hsl,
        rgb,
        luminance: analysis.luminance,
        isDark: analysis.isDark,
      }
    }
 else {
      utilsResult.value = {
        isValid: false,
        hsl: null,
        rgb: null,
        luminance: null,
        isDark: null,
      }
    }
  }
 catch (error) {
    utilsResult.value = {
      isValid: false,
      error: error.message,
    }
  }
}

function demoPerformanceTools() {
  const monitor = new PerformanceMonitor()
  const cache = new LRUCache(10)

  // 模拟操作
  monitor.start('demo-operation')

  // 添加一些缓存项
  for (let i = 0; i < 5; i++) {
    cache.set(`key-${i}`, `value-${i}`)
  }

  const operationTime = monitor.end('demo-operation')

  performanceResult.value = {
    operationTime: operationTime.toFixed(2),
    cacheSize: cache.size,
    memoryUsage: (performance.memory?.usedJSHeapSize / 1024 / 1024 || 0).toFixed(2),
  }
}

// 辅助函数
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
? [
    Number.parseInt(result[1], 16),
    Number.parseInt(result[2], 16),
    Number.parseInt(result[3], 16),
  ]
: [0, 0, 0]
}
</script>

<template>
  <section id="api" class="api-section">
    <div class="section-header">
      <h2 class="section-title">
        🔌 API演示
      </h2>
      <p class="section-description">
        探索 @ldesign/color 的完整API，包括核心类、工具函数和Vue集成
      </p>
    </div>

    <div class="api-container">
      <!-- 核心API -->
      <div class="api-group">
        <h3 class="group-title">
          核心API
        </h3>

        <div class="api-demo-card">
          <h4>ColorGenerator</h4>
          <p>主要的颜色生成器类</p>

          <div class="code-demo">
            <pre><code>import { ColorGenerator } from '@ldesign/color'

const generator = new ColorGenerator({
  enableCache: true,
  cacheSize: 100,
  useWebWorker: false
})

const theme = generator.generate('#1890ff')</code></pre>
          </div>

          <button class="btn btn-primary" @click="demoColorGenerator">
            运行示例
          </button>

          <div v-if="generatorResult" class="result">
            <h5>结果：</h5>
            <pre><code>{{ JSON.stringify(generatorResult, null, 2) }}</code></pre>
          </div>
        </div>

        <div class="api-demo-card">
          <h4>便捷函数</h4>
          <p>快速生成主题的函数</p>

          <div class="code-demo">
            <pre><code>import { generateTheme, generateThemeAsync } from '@ldesign/color'

// 同步生成
const theme = generateTheme('#1890ff')

// 异步生成
const asyncTheme = await generateThemeAsync('#1890ff')</code></pre>
          </div>

          <button class="btn btn-primary" @click="demoConvenienceFunctions">
            运行示例
          </button>

          <div v-if="convenienceResult" class="result">
            <h5>结果：</h5>
            <div class="semantic-colors">
              <div
                v-for="(color, name) in convenienceResult.semanticColors"
                :key="name"
                class="color-item"
                :style="{ backgroundColor: color }"
              >
                <span>{{ name }}</span>
                <span>{{ color }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vue API -->
      <div class="api-group">
        <h3 class="group-title">
          Vue API
        </h3>

        <div class="api-demo-card">
          <h4>useColor</h4>
          <p>Vue 3 组合式API</p>

          <div class="code-demo">
            <pre><code>import { ref } from 'vue'
import { useColor } from '@ldesign/color'

const primaryColor = ref('#1890ff')
const { theme, loading, error } = useColor(primaryColor)</code></pre>
          </div>

          <div class="interactive-demo">
            <div class="input-group">
              <label>主色调：</label>
              <input v-model="vueApiColor" type="color">
              <span>{{ vueApiColor }}</span>
            </div>

            <div class="status">
              <span>状态：{{ vueApiLoading ? '加载中' : '完成' }}</span>
              <span>错误：{{ vueApiError || '无' }}</span>
            </div>

            <div v-if="vueApiTheme" class="theme-result">
              <div class="semantic-grid">
                <div
                  v-for="(color, name) in vueApiTheme.semanticColors"
                  :key="name"
                  class="semantic-item"
                  :style="{ backgroundColor: color }"
                >
                  {{ name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="api-demo-card">
          <h4>useThemeSwitch</h4>
          <p>主题切换管理</p>

          <div class="code-demo">
            <pre><code>import { useThemeSwitch } from '@ldesign/color'

const { currentTheme, toggleTheme, isDark } = useThemeSwitch()</code></pre>
          </div>

          <div class="interactive-demo">
            <div class="theme-controls">
              <button class="btn btn-secondary" @click="toggleDemoTheme">
                切换主题 (当前: {{ demoCurrentTheme }})
              </button>
              <span>是否暗黑模式：{{ demoDarkMode ? '是' : '否' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具函数 -->
      <div class="api-group">
        <h3 class="group-title">
          工具函数
        </h3>

        <div class="api-demo-card">
          <h4>颜色工具</h4>
          <p>颜色格式转换和分析</p>

          <div class="code-demo">
            <pre><code>import {
  hexToHsl,
  hslToHex,
  isValidColor,
  analyzeColor
} from '@ldesign/color'

const hsl = hexToHsl('#1890ff')
const hex = hslToHex([210, 100, 55])
const valid = isValidColor('#1890ff')
const analysis = analyzeColor('#1890ff')</code></pre>
          </div>

          <div class="interactive-demo">
            <div class="input-group">
              <label>测试颜色：</label>
              <input
                v-model="utilsTestColor"
                type="text"
                placeholder="#1890ff"
                class="color-input"
              >
              <button class="btn btn-secondary" @click="testColorUtils">
                分析
              </button>
            </div>

            <div v-if="utilsResult" class="utils-result">
              <div class="result-grid">
                <div class="result-item">
                  <span class="label">有效性：</span>
                  <span class="value" :class="{ valid: utilsResult.isValid, invalid: !utilsResult.isValid }">
                    {{ utilsResult.isValid ? '有效' : '无效' }}
                  </span>
                </div>
                <div class="result-item">
                  <span class="label">HSL：</span>
                  <span class="value">{{ utilsResult.hsl?.join(', ') }}</span>
                </div>
                <div class="result-item">
                  <span class="label">RGB：</span>
                  <span class="value">{{ utilsResult.rgb?.join(', ') }}</span>
                </div>
                <div class="result-item">
                  <span class="label">亮度：</span>
                  <span class="value">{{ utilsResult.luminance?.toFixed(3) }}</span>
                </div>
                <div class="result-item">
                  <span class="label">是否深色：</span>
                  <span class="value">{{ utilsResult.isDark ? '是' : '否' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="api-demo-card">
          <h4>性能工具</h4>
          <p>缓存和性能监控</p>

          <div class="code-demo">
            <pre><code>import { PerformanceMonitor, LRUCache } from '@ldesign/color'

const monitor = new PerformanceMonitor()
const cache = new LRUCache(100)

monitor.start('operation')
// ... 执行操作
const time = monitor.end('operation')</code></pre>
          </div>

          <div class="interactive-demo">
            <button class="btn btn-secondary" @click="demoPerformanceTools">
              演示性能工具
            </button>

            <div v-if="performanceResult" class="performance-result">
              <div class="metric-grid">
                <div class="metric-item">
                  <span class="metric-label">操作耗时：</span>
                  <span class="metric-value">{{ performanceResult.operationTime }}ms</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">缓存大小：</span>
                  <span class="metric-value">{{ performanceResult.cacheSize }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">内存使用：</span>
                  <span class="metric-value">{{ performanceResult.memoryUsage }}MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.api-section {
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

.api-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.api-group {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.group-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-primary);
  padding-bottom: var(--space-sm);
}

.api-demo-card {
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
}

.api-demo-card:last-child {
  margin-bottom: 0;
}

.api-demo-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.api-demo-card p {
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.code-demo {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.code-demo pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-secondary);
  overflow-x: auto;
}

.interactive-demo {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
}

.input-group {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
}

.input-group label {
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

.status {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
  font-size: 14px;
  color: var(--text-secondary);
}

.theme-result {
  margin-top: var(--space-md);
}

.semantic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--space-sm);
}

.semantic-item {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  color: white;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-size: 12px;
  text-transform: capitalize;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.color-item span:first-child {
  font-weight: 500;
  text-transform: capitalize;
}

.color-item span:last-child {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 10px;
  opacity: 0.8;
}

.theme-controls {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.utils-result {
  margin-top: var(--space-md);
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-sm);
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
}

.result-item .label {
  font-weight: 500;
  color: var(--text-secondary);
}

.result-item .value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: var(--text-primary);
}

.value.valid {
  color: var(--ldesign-success, #52c41a);
}

.value.invalid {
  color: var(--ldesign-danger, #f5222d);
}

.performance-result {
  margin-top: var(--space-md);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-sm);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  text-align: center;
}

.metric-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.metric-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
  color: var(--ldesign-primary, #1890ff);
}

.result {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
}

.result h5 {
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.result pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-secondary);
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .theme-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .result-grid,
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .semantic-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
