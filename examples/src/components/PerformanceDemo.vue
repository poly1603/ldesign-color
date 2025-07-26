<template>
  <section id="performance" class="performance-section">
    <div class="section-header">
      <h2 class="section-title">⚡ 性能演示</h2>
      <p class="section-description">
        体验 @ldesign/color 的高性能特性：缓存、Web Worker、防抖等优化
      </p>
    </div>
    
    <div class="demo-container">
      <!-- 缓存演示 -->
      <div class="demo-card">
        <h3 class="demo-title">🚀 智能缓存</h3>
        <p class="demo-description">
          LRU缓存策略，避免重复计算，提升性能
        </p>
        
        <div class="cache-demo">
          <div class="controls">
            <button class="btn btn-primary" @click="testCache">
              测试缓存性能
            </button>
            <button class="btn btn-secondary" @click="clearAllCache">
              清除缓存
            </button>
          </div>
          
          <div v-if="cacheResults.length" class="results">
            <h4>测试结果</h4>
            <div class="result-list">
              <div 
                v-for="(result, index) in cacheResults"
                :key="index"
                class="result-item"
                :class="{ cached: result.fromCache }"
              >
                <span class="color-preview" :style="{ backgroundColor: result.color }"></span>
                <span class="color-value">{{ result.color }}</span>
                <span class="time">{{ result.time.toFixed(2) }}ms</span>
                <span class="cache-status">{{ result.fromCache ? '缓存' : '计算' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 防抖演示 -->
      <div class="demo-card">
        <h3 class="demo-title">🎯 防抖优化</h3>
        <p class="demo-description">
          防抖处理，避免频繁的颜色生成操作
        </p>
        
        <div class="debounce-demo">
          <div class="input-group">
            <label>快速输入颜色值：</label>
            <input 
              type="text" 
              v-model="debounceInput"
              placeholder="#1890ff"
              class="debounce-input"
            />
          </div>
          
          <div class="debounce-status">
            <div class="status-item">
              <span class="label">输入次数：</span>
              <span class="value">{{ inputCount }}</span>
            </div>
            <div class="status-item">
              <span class="label">生成次数：</span>
              <span class="value">{{ generateCount }}</span>
            </div>
            <div class="status-item">
              <span class="label">节省比例：</span>
              <span class="value">{{ savingPercentage }}%</span>
            </div>
          </div>
          
          <div v-if="debounceTheme" class="debounce-result">
            <div class="generated-colors">
              <div 
                v-for="(color, name) in debounceTheme.semanticColors"
                :key="name"
                class="color-item"
                :style="{ backgroundColor: color }"
              >
                <span class="color-name">{{ name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 批量处理演示 -->
      <div class="demo-card full-width">
        <h3 class="demo-title">📊 批量处理</h3>
        <p class="demo-description">
          批量生成多个主题，展示并发处理能力
        </p>
        
        <div class="batch-demo">
          <div class="batch-controls">
            <div class="color-inputs">
              <div 
                v-for="(color, index) in batchColors"
                :key="index"
                class="color-input-item"
              >
                <input 
                  type="color" 
                  v-model="batchColors[index]"
                  class="color-picker"
                />
                <input 
                  type="text" 
                  v-model="batchColors[index]"
                  class="color-text"
                />
                <button 
                  class="btn-remove"
                  @click="removeBatchColor(index)"
                  v-if="batchColors.length > 1"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div class="batch-actions">
              <button class="btn btn-secondary" @click="addBatchColor">
                + 添加颜色
              </button>
              <button 
                class="btn btn-primary" 
                @click="processBatch"
                :disabled="batchLoading"
              >
                {{ batchLoading ? '处理中...' : '批量生成' }}
              </button>
            </div>
          </div>
          
          <div v-if="batchLoading" class="batch-loading">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${batchProgress}%` }"
              ></div>
            </div>
            <span class="progress-text">{{ batchProgress }}% 完成</span>
          </div>
          
          <div v-if="batchResults.length" class="batch-results">
            <h4>批量生成结果 ({{ batchTime }}ms)</h4>
            <div class="batch-grid">
              <div 
                v-for="(result, index) in batchResults"
                :key="index"
                class="batch-item"
              >
                <div class="batch-header">
                  <span class="batch-index">#{{ index + 1 }}</span>
                  <span class="batch-color">{{ result.inputColor }}</span>
                </div>
                <div class="batch-colors">
                  <div 
                    v-for="(color, name) in result.theme.semanticColors"
                    :key="name"
                    class="batch-color-item"
                    :style="{ backgroundColor: color }"
                    :title="`${name}: ${color}`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 性能对比 -->
      <div class="demo-card full-width">
        <h3 class="demo-title">📈 性能对比</h3>
        <p class="demo-description">
          对比不同配置下的性能表现
        </p>
        
        <div class="benchmark-demo">
          <div class="benchmark-controls">
            <button 
              class="btn btn-primary" 
              @click="runBenchmark"
              :disabled="benchmarkRunning"
            >
              {{ benchmarkRunning ? '测试中...' : '运行性能测试' }}
            </button>
          </div>
          
          <div v-if="benchmarkRunning" class="benchmark-progress">
            <div class="spinner"></div>
            <span>正在运行性能测试...</span>
          </div>
          
          <div v-if="benchmarkResults.length" class="benchmark-results">
            <div class="benchmark-chart">
              <div 
                v-for="result in benchmarkResults"
                :key="result.name"
                class="benchmark-bar"
              >
                <div class="bar-label">{{ result.name }}</div>
                <div class="bar-container">
                  <div 
                    class="bar-fill"
                    :style="{ 
                      width: `${(result.time / maxBenchmarkTime) * 100}%`,
                      backgroundColor: result.color 
                    }"
                  ></div>
                  <span class="bar-time">{{ result.time.toFixed(2) }}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { 
  ColorGenerator, 
  useBatchColor, 
  generateRandomColor,
  presetColors 
} from '@ldesign/color'

// 缓存演示
const cacheResults = ref<Array<{
  color: string
  time: number
  fromCache: boolean
}>>([])

// 防抖演示
const debounceInput = ref('#1890ff')
const inputCount = ref(0)
const generateCount = ref(0)
const debounceTheme = ref(null)

// 批量处理演示
const batchColors = ref(['#1890ff', '#52c41a', '#f5222d'])
const batchLoading = ref(false)
const batchProgress = ref(0)
const batchResults = ref([])
const batchTime = ref(0)

// 性能测试
const benchmarkRunning = ref(false)
const benchmarkResults = ref([])

// 计算属性
const savingPercentage = computed(() => {
  if (inputCount.value === 0) return 0
  return Math.round(((inputCount.value - generateCount.value) / inputCount.value) * 100)
})

const maxBenchmarkTime = computed(() => {
  return Math.max(...benchmarkResults.value.map(r => r.time))
})

// 缓存测试
const testCache = async () => {
  const generator = new ColorGenerator({ enableCache: true })
  const testColors = Object.values(presetColors).slice(0, 5)
  cacheResults.value = []
  
  // 第一轮：计算
  for (const color of testColors) {
    const start = performance.now()
    generator.generate(color)
    const time = performance.now() - start
    
    cacheResults.value.push({
      color,
      time,
      fromCache: false
    })
  }
  
  // 第二轮：缓存
  for (const color of testColors) {
    const start = performance.now()
    generator.generate(color)
    const time = performance.now() - start
    
    cacheResults.value.push({
      color,
      time,
      fromCache: true
    })
  }
}

const clearAllCache = () => {
  // 清除所有缓存
  cacheResults.value = []
}

// 防抖演示
let debounceTimer: number
const debounceGenerator = new ColorGenerator({ enableCache: true })

watch(debounceInput, () => {
  inputCount.value++
  
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (debounceInput.value && /^#[0-9a-fA-F]{6}$/.test(debounceInput.value)) {
      generateCount.value++
      try {
        debounceTheme.value = debounceGenerator.generate(debounceInput.value)
      } catch (error) {
        console.error('生成失败:', error)
      }
    }
  }, 300)
})

// 批量处理
const addBatchColor = () => {
  batchColors.value.push(generateRandomColor())
}

const removeBatchColor = (index: number) => {
  batchColors.value.splice(index, 1)
}

const processBatch = async () => {
  batchLoading.value = true
  batchProgress.value = 0
  batchResults.value = []
  
  const start = performance.now()
  const generator = new ColorGenerator({ enableCache: true })
  
  try {
    const validColors = batchColors.value.filter(color => 
      /^#[0-9a-fA-F]{6}$/.test(color)
    )
    
    for (let i = 0; i < validColors.length; i++) {
      const color = validColors[i]
      const theme = generator.generate(color)
      
      batchResults.value.push({
        inputColor: color,
        theme
      })
      
      batchProgress.value = Math.round(((i + 1) / validColors.length) * 100)
      
      // 模拟异步处理
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    batchTime.value = Math.round(performance.now() - start)
  } catch (error) {
    console.error('批量处理失败:', error)
  } finally {
    batchLoading.value = false
  }
}

// 性能测试
const runBenchmark = async () => {
  benchmarkRunning.value = true
  benchmarkResults.value = []
  
  const testColor = '#1890ff'
  const iterations = 10
  
  // 测试不同配置
  const configs = [
    { name: '无优化', config: { enableCache: false, useWebWorker: false } },
    { name: '启用缓存', config: { enableCache: true, useWebWorker: false } },
    { name: '完整优化', config: { enableCache: true, useWebWorker: false } }
  ]
  
  for (const { name, config } of configs) {
    const generator = new ColorGenerator(config)
    const times = []
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      generator.generate(testColor)
      times.push(performance.now() - start)
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    
    benchmarkResults.value.push({
      name,
      time: avgTime,
      color: testColor
    })
    
    // 模拟测试延迟
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  benchmarkRunning.value = false
}
</script>

<style scoped>
.performance-section {
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

/* 缓存演示样式 */
.cache-demo .controls {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.result-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
}

.result-item.cached {
  background-color: rgba(82, 196, 26, 0.1);
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-primary);
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  min-width: 80px;
}

.time {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: var(--ldesign-primary, #1890ff);
  min-width: 60px;
}

.cache-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
}

/* 防抖演示样式 */
.input-group {
  margin-bottom: var(--space-lg);
}

.input-group label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.debounce-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: 'Monaco', 'Menlo', monospace;
}

.debounce-status {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.status-item .label {
  font-size: 12px;
  color: var(--text-secondary);
}

.status-item .value {
  font-weight: 600;
  color: var(--ldesign-primary, #1890ff);
}

.generated-colors {
  display: flex;
  gap: var(--space-sm);
}

.color-item {
  flex: 1;
  height: 60px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.color-name {
  font-size: 12px;
  text-transform: capitalize;
}

/* 批量处理样式 */
.batch-controls {
  margin-bottom: var(--space-lg);
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.color-input-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.color-picker {
  width: 40px;
  height: 32px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.color-text {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: 'Monaco', 'Menlo', monospace;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background-color: var(--ldesign-danger, #f5222d);
  color: white;
}

.batch-actions {
  display: flex;
  gap: var(--space-md);
}

.batch-loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--ldesign-primary, #1890ff);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.batch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.batch-item {
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.batch-index {
  font-weight: 600;
  color: var(--text-secondary);
}

.batch-color {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: var(--text-primary);
}

.batch-colors {
  display: flex;
  height: 40px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.batch-color-item {
  flex: 1;
}

/* 性能测试样式 */
.benchmark-progress {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-primary);
  border-top: 2px solid var(--ldesign-primary, #1890ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.benchmark-chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.benchmark-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.bar-label {
  width: 100px;
  font-weight: 500;
  color: var(--text-primary);
}

.bar-container {
  flex: 1;
  height: 32px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  position: relative;
  display: flex;
  align-items: center;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-md);
  transition: width 0.5s ease;
}

.bar-time {
  position: absolute;
  right: var(--space-sm);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    grid-template-columns: 1fr;
  }
  
  .cache-demo .controls {
    flex-direction: column;
  }
  
  .debounce-status {
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .batch-actions {
    flex-direction: column;
  }
  
  .benchmark-bar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-sm);
  }
  
  .bar-label {
    width: auto;
  }
}
</style>
