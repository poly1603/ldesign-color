# 🎨 在线演示

<script setup>
import { ref, computed, watch } from 'vue'
import { useColor, generateRandomColor, createPresetThemeManager } from '@ldesign/color'

// 响应式数据
const primaryColor = ref('#1890ff')
const currentMode = ref('light')
const grayMixPrimary = ref(true)
const grayMixRatio = ref(0.3)
const showAdvanced = ref(false)
const copyMessage = ref('')

// 预设主题管理器
const presetManager = createPresetThemeManager()
const presetThemes = presetManager.getEnabledThemes()

// 使用颜色生成Hook
const { theme, loading, error, updateConfig } = useColor(primaryColor, {
  enableCache: true,
  useWebWorker: false,
  autoInject: false,
  grayMixPrimary: grayMixPrimary.value,
  grayMixRatio: grayMixRatio.value
})

// 监听配置变化
watch([grayMixPrimary, grayMixRatio], () => {
  updateConfig({
    grayMixPrimary: grayMixPrimary.value,
    grayMixRatio: grayMixRatio.value
  })
})

// 当前色阶
const currentPalette = computed(() => {
  if (!theme.value) return {}
  return currentMode.value === 'light'
    ? theme.value.palettes.light
    : theme.value.palettes.dark
})

// 生成随机颜色
const generateRandom = () => {
  primaryColor.value = generateRandomColor()
}

// 选择预设主题
const selectPreset = (color) => {
  primaryColor.value = color
}

// 复制颜色
const copyColor = async (color) => {
  try {
    await navigator.clipboard.writeText(color)
    copyMessage.value = `已复制 ${color}`
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    copyMessage.value = '复制失败'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  }
}

// 获取对比色文字颜色
const getTextColor = (bgColor) => {
  // 简单的亮度计算
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}
</script>

<div class="demo-container">
  <div class="demo-header">
    <h1>🎨 颜色生成演示</h1>
    <p>体验 @ldesign/color 的强大功能，实时生成专业级配色方案</p>
    <div v-if="copyMessage" class="copy-message">{{ copyMessage }}</div>
  </div>

  <!-- 预设主题选择 -->
  <div class="preset-section">
    <h3>🎭 预设主题</h3>
    <div class="preset-grid">
      <div
        v-for="preset in presetThemes.value"
        :key="preset.name"
        class="preset-item"
        :class="{ active: primaryColor === preset.color }"
        @click="selectPreset(preset.color)"
        :title="preset.description"
      >
        <div class="preset-color" :style="{ backgroundColor: preset.color }"></div>
        <div class="preset-name">{{ preset.name }}</div>
      </div>
    </div>
  </div>

  <div class="demo-controls">
    <div class="color-input-group">
      <label>主色调：</label>
      <input type="color" v-model="primaryColor" class="color-picker" />
      <input type="text" v-model="primaryColor" class="color-text" placeholder="#1890ff" />
      <button @click="generateRandom" class="btn-random">🎲 随机</button>
    </div>

    <div class="mode-switch">
      <button
        :class="{ active: currentMode === 'light' }"
        @click="currentMode = 'light'"
        class="mode-btn"
      >
        ☀️ 明亮
      </button>
      <button
        :class="{ active: currentMode === 'dark' }"
        @click="currentMode = 'dark'"
        class="mode-btn"
      >
        🌙 暗黑
      </button>
    </div>
  </div>

  <!-- 高级配置 -->
  <div class="advanced-section">
    <button
      @click="showAdvanced = !showAdvanced"
      class="advanced-toggle"
    >
      ⚙️ {{ showAdvanced ? '隐藏' : '显示' }}高级配置
    </button>

    <div v-if="showAdvanced" class="advanced-controls">
      <div class="control-group">
        <label class="control-label">
          <input type="checkbox" v-model="grayMixPrimary" />
          混入主色调到灰色
        </label>
        <span class="control-desc">让灰色带有主色调的色相倾向</span>
      </div>

      <div v-if="grayMixPrimary" class="control-group">
        <label class="control-label">
          混入比例: {{ grayMixRatio.toFixed(1) }}
        </label>
        <input
          type="range"
          v-model.number="grayMixRatio"
          min="0.1"
          max="1.0"
          step="0.1"
          class="range-input"
        />
        <span class="control-desc">控制主色调在灰色中的混入程度</span>
      </div>
    </div>
  </div>

  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <span>正在生成主题...</span>
  </div>

  <div v-if="theme && !loading" class="demo-results">
    <!-- 语义化颜色 -->
    <div class="semantic-section">
      <h3>语义化颜色</h3>
      <div class="semantic-grid">
        <div
          v-for="(color, name) in theme.semanticColors"
          :key="name"
          class="semantic-item"
          @click="copyColor(color)"
          :title="`点击复制 ${color}`"
        >
          <div class="color-preview" :style="{ backgroundColor: color }"></div>
          <div class="color-info">
            <div class="color-name">{{ name }}</div>
            <div class="color-value">{{ color }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 色阶展示 -->
    <div class="palette-section">
      <h3>{{ currentMode === 'light' ? '☀️ 明亮模式' : '🌙 暗黑模式' }}色阶</h3>
      <div class="palette-info">
        <p>{{ currentMode === 'light' ? '明亮模式从浅到深，适合浅色背景' : '暗黑模式从深到浅，适合深色背景' }}</p>
        <p>主色调和语义色各有12个色阶，灰色有14个色阶。点击任意颜色可复制色值。</p>
      </div>

      <div class="palette-grid">
        <div
          v-for="(colors, name) in currentPalette"
          :key="name"
          class="palette-row"
        >
          <div class="palette-header">
            <div class="palette-name">{{ name }}</div>
            <div class="palette-count">{{ colors.length }}色阶</div>
          </div>
          <div class="palette-colors">
            <div
              v-for="(color, index) in colors"
              :key="index"
              class="palette-color"
              :style="{
                backgroundColor: color,
                color: getTextColor(color)
              }"
              @click="copyColor(color)"
              :title="`${name}-${index + 1}: ${color} (点击复制)`"
            >
              <span class="color-index">{{ index + 1 }}</span>
              <span class="color-value">{{ color }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 特性说明 -->
    <div class="features-section">
      <h3>✨ 最新优化特性</h3>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">🎨</div>
          <div class="feature-content">
            <h4>主色调保持特征</h4>
            <p>最深色阶不再过深，每种语义色都保持各自的色彩特征</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🌫️</div>
          <div class="feature-content">
            <h4>动态灰色生成</h4>
            <p>语义化灰色根据主色调动态生成，不再是固定的#808080</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📈</div>
          <div class="feature-content">
            <h4>平滑色阶过渡</h4>
            <p>基于Arco Design算法，告别突兀跳跃，实现真正平滑渐变</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🌙</div>
          <div class="feature-content">
            <h4>暗黑模式优化</h4>
            <p>修复暗黑模式色阶顺序和平滑度问题，完美支持深色主题</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.demo-header p {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.copy-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--vp-c-brand);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 预设主题样式 */
.preset-section {
  margin-bottom: 2rem;
}

.preset-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.preset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--vp-c-bg);
}

.preset-item:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.preset-item.active {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.preset-color {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
}

.preset-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-align: center;
}

/* 高级配置样式 */
.advanced-section {
  margin-bottom: 2rem;
}

.advanced-toggle {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  width: 100%;
}

.advanced-toggle:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.advanced-controls {
  margin-top: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.control-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  display: block;
  margin-top: 0.25rem;
}

.range-input {
  width: 100%;
  margin: 0.5rem 0;
}

.demo-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.color-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-input-group label {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
}

.color-text {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  width: 120px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.btn-random {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-brand);
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-random:hover {
  background: var(--vp-c-brand-dark);
}

.mode-switch {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.mode-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.mode-btn.active {
  background: var(--vp-c-brand);
  color: white;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--vp-c-divider);
  border-top: 2px solid var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.semantic-section {
  margin-bottom: 3rem;
}

.semantic-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.semantic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.semantic-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--vp-c-bg);
}

.semantic-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.color-info {
  flex: 1;
}

.color-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-transform: capitalize;
  margin-bottom: 4px;
}

.color-value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.palette-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.palette-info {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.palette-info p {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.palette-info p:last-child {
  margin-bottom: 0;
}

.palette-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.palette-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.palette-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.palette-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: capitalize;
  font-size: 16px;
}

.palette-count {
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.palette-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.palette-color {
  height: 80px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  position: relative;
  gap: 0.25rem;
}

.palette-color:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-index {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.8;
}

.color-value {
  font-size: 9px;
  font-family: 'Monaco', 'Menlo', monospace;
  opacity: 0;
  transition: opacity 0.3s;
  text-align: center;
}

.palette-color:hover .color-value {
  opacity: 0.9;
}

/* 特性说明样式 */
.features-section {
  margin-top: 3rem;
}

.features-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  transition: all 0.3s;
}

.feature-item:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  line-height: 1;
}

.feature-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: var(--vp-c-text-1);
}

.feature-content p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    padding: 1rem;
  }

  .demo-header h1 {
    font-size: 2rem;
  }

  .preset-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .preset-item {
    padding: 0.75rem;
  }

  .preset-color {
    width: 30px;
    height: 30px;
  }

  .demo-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .color-input-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .semantic-grid {
    grid-template-columns: 1fr;
  }

  .palette-colors {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }

  .palette-color {
    height: 60px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    padding: 1rem;
  }

  .copy-message {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
  }
}
</style>
