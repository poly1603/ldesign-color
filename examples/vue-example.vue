<template>
  <div class="vue-example">
    <h1>🎨 Vue 3 示例</h1>
    
    <!-- 颜色选择器 -->
    <div class="color-input">
      <label>选择主色调：</label>
      <input 
        type="color" 
        v-model="primaryColor"
        class="color-picker"
      />
      <span class="color-value">{{ primaryColor }}</span>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      正在生成主题...
    </div>
    
    <!-- 错误状态 -->
    <div v-if="error" class="error">
      错误: {{ error }}
    </div>
    
    <!-- 主题展示 -->
    <div v-if="theme && !loading" class="theme-display">
      <h2>生成的主题</h2>
      
      <!-- 语义化颜色 -->
      <div class="semantic-colors">
        <h3>语义化颜色</h3>
        <div class="color-grid">
          <div 
            v-for="(color, name) in theme.semanticColors"
            :key="name"
            class="color-item"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
          >
            <span class="color-name">{{ name }}</span>
            <span class="color-hex">{{ color }}</span>
          </div>
        </div>
      </div>
      
      <!-- 色阶展示 -->
      <div class="palettes">
        <h3>色阶展示</h3>
        <div class="mode-switch">
          <button 
            :class="{ active: currentMode === 'light' }"
            @click="currentMode = 'light'"
          >
            明亮模式
          </button>
          <button 
            :class="{ active: currentMode === 'dark' }"
            @click="currentMode = 'dark'"
          >
            暗黑模式
          </button>
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
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 性能指标 -->
    <div v-if="theme" class="performance">
      <h3>性能指标</h3>
      <div class="metrics">
        <div class="metric">
          <span>总耗时:</span>
          <span>{{ metrics.totalTime.toFixed(2) }}ms</span>
        </div>
        <div class="metric">
          <span>缓存命中率:</span>
          <span>{{ (metrics.cacheHitRate * 100).toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useColor } from '../src/vue/useColor'

// 响应式数据
const primaryColor = ref('#1890ff')
const currentMode = ref<'light' | 'dark'>('light')

// 使用颜色生成Hook
const { 
  theme, 
  loading, 
  error, 
  getPerformanceMetrics 
} = useColor(primaryColor, {
  enableCache: true,
  useWebWorker: false
})

// 当前色阶
const currentPalette = computed(() => {
  if (!theme.value) return {}
  return currentMode.value === 'light' 
    ? theme.value.palettes.light 
    : theme.value.palettes.dark
})

// 性能指标
const metrics = computed(() => {
  return getPerformanceMetrics()
})

// 复制颜色到剪贴板
const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
    console.log(`已复制颜色: ${color}`)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.vue-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.color-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
}

.loading, .error {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.loading {
  background-color: #e6f7ff;
  color: #1890ff;
}

.error {
  background-color: #fff2f0;
  color: #f5222d;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.color-item {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 80px;
  justify-content: center;
}

.color-item:hover {
  transform: translateY(-2px);
}

.color-name {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  text-transform: capitalize;
}

.color-hex {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.mode-switch {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-switch button {
  padding: 0.5rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-switch button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
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
}

.palette-colors {
  display: flex;
  flex: 1;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
}

.palette-color {
  flex: 1;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s;
}

.palette-color:hover {
  transform: scaleY(1.2);
  z-index: 1;
}

.metrics {
  display: flex;
  gap: 2rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric span:first-child {
  font-size: 12px;
  color: #666;
}

.metric span:last-child {
  font-weight: 600;
  color: #1890ff;
}
</style>
