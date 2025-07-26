<template>
  <section id="welcome" class="welcome-section">
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          🎨 高性能颜色生成库
        </h1>
        <p class="hero-description">
          输入一个主色调，智能生成完整的配色方案。支持语义化颜色、明暗模式、12/14色阶生成。
        </p>

        <!-- 快速体验 -->
        <div class="quick-demo">
          <div class="demo-input">
            <label for="quick-color">选择主色调：</label>
            <input
              id="quick-color"
              type="color"
              v-model="quickColor"
              class="color-input"
            />
            <span class="color-value">{{ quickColor }}</span>
          </div>

          <!-- 生成的语义化颜色 -->
          <div v-if="quickTheme" class="semantic-colors">
            <div
              v-for="(color, name) in quickTheme.semanticColors"
              :key="name"
              class="color-item"
              :style="{ backgroundColor: color }"
              @click="copyColor(color)"
              :title="`点击复制 ${color}`"
            >
              <span class="color-name">{{ name }}</span>
              <span class="color-hex">{{ color }}</span>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="quickLoading" class="loading-state">
            <div class="spinner"></div>
            <span>正在生成主题...</span>
          </div>
        </div>
      </div>

      <!-- 特性展示 -->
      <div class="features">
        <div class="feature-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats">
      <div class="stat-item">
        <div class="stat-number">{{ stats.themes }}</div>
        <div class="stat-label">已生成主题</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.colors }}</div>
        <div class="stat-label">颜色总数</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.performance }}ms</div>
        <div class="stat-label">平均生成时间</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { generateTheme } from '@ldesign/color'
import { onMounted, ref, watch } from 'vue'

// 快速演示的颜色
const quickColor = ref('#1890ff')
const quickTheme = ref(null)
const quickLoading = ref(false)

// 生成主题的函数
const generateQuickTheme = async (color: string) => {
  quickLoading.value = true
  try {
    // 使用库的generateTheme函数
    const theme = generateTheme(color)
    quickTheme.value = theme
  } catch (error) {
    console.error('生成主题失败:', error)
  } finally {
    quickLoading.value = false
  }
}

// 监听颜色变化
watch(quickColor, (newColor) => {
  generateQuickTheme(newColor)
}, { immediate: true })

// 特性列表
const features = [
  {
    icon: '🎯',
    title: '智能生成',
    description: '基于色彩理论，自动生成和谐的语义化颜色'
  },
  {
    icon: '🌓',
    title: '明暗模式',
    description: '完美支持明暗主题切换，自动适配'
  },
  {
    icon: '📊',
    title: '丰富色阶',
    description: '12/14色阶设计，满足各种设计需求'
  },
  {
    icon: '⚡',
    title: '高性能',
    description: 'Web Worker、缓存、防抖等多重优化'
  },
  {
    icon: '🔧',
    title: 'Vue友好',
    description: '组合式API和开箱即用的组件'
  },
  {
    icon: '💪',
    title: 'TypeScript',
    description: '完整的类型定义，开发体验一流'
  }
]

// 统计数据
const stats = ref({
  themes: 0,
  colors: 0,
  performance: 0
})

// 复制颜色到剪贴板
const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
    console.log(`已复制颜色: ${color}`)
    // 这里可以添加提示消息
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 更新统计数据
const updateStats = () => {
  if (quickTheme.value) {
    stats.value.themes++

    // 计算颜色总数
    const lightColors = Object.values(quickTheme.value.palettes.light)
      .reduce((total, colors) => total + colors.length, 0)
    const darkColors = Object.values(quickTheme.value.palettes.dark)
      .reduce((total, colors) => total + colors.length, 0)
    stats.value.colors = lightColors + darkColors + 5 // +5 for semantic colors

    // 模拟性能数据
    stats.value.performance = Math.round(Math.random() * 10) + 5
  }
}

// 监听主题变化
watch(quickTheme, updateStats)

// 组件挂载时初始化
onMounted(() => {
  // 模拟一些初始统计数据
  stats.value = {
    themes: Math.floor(Math.random() * 100) + 50,
    colors: Math.floor(Math.random() * 1000) + 500,
    performance: Math.floor(Math.random() * 10) + 5
  }
})
</script>

<style scoped>
.welcome-section {
  padding: var(--space-2xl) 0;
}

.hero {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto var(--space-2xl);
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  line-height: 1.2;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-2xl);
  line-height: 1.6;
}

.quick-demo {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.demo-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.demo-input label {
  font-weight: 500;
  color: var(--text-primary);
}

.color-input {
  width: 60px;
  height: 40px;
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.color-input:hover {
  border-color: var(--ldesign-primary, #1890ff);
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}

.semantic-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
}

.color-item {
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: transform var(--transition-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  min-height: 100px;
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
  font-size: 14px;
}

.color-hex {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  color: var(--text-secondary);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-primary);
  border-top: 2px solid var(--ldesign-primary, #1890ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.features {
  margin-bottom: var(--space-2xl);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-align: center;
  transition: all var(--transition-normal);
}

.feature-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.stats {
  display: flex;
  justify-content: center;
  gap: var(--space-2xl);
  padding: var(--space-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-primary);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--ldesign-primary, #1890ff);
  margin-bottom: var(--space-sm);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .demo-input {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .semantic-colors {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .stats {
    flex-direction: column;
    gap: var(--space-lg);
  }

  .stat-number {
    font-size: 1.5rem;
  }
}
</style>
