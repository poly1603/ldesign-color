<template>
  <div class="ld-palette-display">
    <!-- 标题和控制 -->
    <div class="ld-palette-display__header">
      <h3 class="ld-palette-display__title">{{ title }}</h3>
      <div class="ld-palette-display__controls">
        <button 
          v-if="showModeSwitch"
          @click="toggleMode"
          class="ld-palette-display__mode-btn"
        >
          {{ currentMode === 'light' ? '🌞' : '🌙' }} {{ currentMode === 'light' ? '亮色' : '暗色' }}
        </button>
        <button 
          v-if="showExport"
          @click="exportPalette"
          class="ld-palette-display__export-btn"
        >
          导出
        </button>
      </div>
    </div>

    <!-- 主色调输入 -->
    <div class="ld-palette-display__primary">
      <label class="ld-palette-display__label">主色调</label>
      <div class="ld-palette-display__input-group">
        <input
          type="color"
          :value="primaryColor"
          @input="handlePrimaryChange"
          class="ld-palette-display__color-input"
        />
        <input
          type="text"
          :value="primaryColor"
          @input="handlePrimaryTextChange"
          @blur="handlePrimaryBlur"
          class="ld-palette-display__text-input"
          placeholder="#1890ff"
        />
      </div>
    </div>

    <!-- 调色板展示 -->
    <div class="ld-palette-display__palettes">
      <div 
        v-for="(palette, name) in currentPalette"
        :key="name"
        class="ld-palette-display__palette"
      >
        <h4 class="ld-palette-display__palette-title">
          {{ getPaletteTitle(name) }}
        </h4>
        <div class="ld-palette-display__shades">
          <div
            v-for="(color, shade) in palette"
            :key="shade"
            class="ld-palette-display__shade"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
            :title="`点击复制: ${color}`"
          >
            <span class="ld-palette-display__shade-label">{{ shade }}</span>
            <span class="ld-palette-display__shade-value">{{ color }}</span>
            <Transition name="fade">
              <span 
                v-if="copiedColor === color"
                class="ld-palette-display__copied"
              >
                已复制!
              </span>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- 色彩和谐展示 -->
    <div v-if="showHarmony" class="ld-palette-display__harmony">
      <h4 class="ld-palette-display__section-title">色彩和谐</h4>
      
      <!-- 互补色 -->
      <div class="ld-palette-display__harmony-group">
        <span class="ld-palette-display__harmony-label">互补色</span>
        <div class="ld-palette-display__harmony-colors">
          <div
            class="ld-palette-display__harmony-color"
            :style="{ backgroundColor: primaryColor }"
            @click="copyColor(primaryColor)"
            :title="primaryColor"
          />
          <div
            class="ld-palette-display__harmony-color"
            :style="{ backgroundColor: complementaryColor }"
            @click="copyColor(complementaryColor)"
            :title="complementaryColor"
          />
        </div>
      </div>

      <!-- 类似色 -->
      <div class="ld-palette-display__harmony-group">
        <span class="ld-palette-display__harmony-label">类似色</span>
        <div class="ld-palette-display__harmony-colors">
          <div
            v-for="color in analogousColors"
            :key="color"
            class="ld-palette-display__harmony-color"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
            :title="color"
          />
        </div>
      </div>

      <!-- 三色调和 -->
      <div class="ld-palette-display__harmony-group">
        <span class="ld-palette-display__harmony-label">三色调和</span>
        <div class="ld-palette-display__harmony-colors">
          <div
            v-for="color in triadicColors"
            :key="color"
            class="ld-palette-display__harmony-color"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
            :title="color"
          />
        </div>
      </div>

      <!-- 四色调和 -->
      <div class="ld-palette-display__harmony-group">
        <span class="ld-palette-display__harmony-label">四色调和</span>
        <div class="ld-palette-display__harmony-colors">
          <div
            v-for="color in tetradicColors"
            :key="color"
            class="ld-palette-display__harmony-color"
            :style="{ backgroundColor: color }"
            @click="copyColor(color)"
            :title="color"
          />
        </div>
      </div>
    </div>

    <!-- CSS 变量预览 -->
    <div v-if="showCssPreview" class="ld-palette-display__css">
      <h4 class="ld-palette-display__section-title">CSS 变量</h4>
      <pre class="ld-palette-display__css-code">{{ cssVariables }}</pre>
      <button 
        @click="copyCssVariables"
        class="ld-palette-display__copy-css-btn"
      >
        复制 CSS
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import { Color } from '@ldesign/color-core'

interface PaletteDisplayProps {
  /** 初始主色调 */
  primaryColor?: string
  /** 标题 */
  title?: string
  /** 显示模式切换 */
  showModeSwitch?: boolean
  /** 显示导出按钮 */
  showExport?: boolean
  /** 显示色彩和谐 */
  showHarmony?: boolean
  /** 显示 CSS 预览 */
  showCssPreview?: boolean
  /** CSS 变量前缀 */
  cssPrefix?: string
}

const props = withDefaults(defineProps<PaletteDisplayProps>(), {
  primaryColor: '#1890ff',
  title: '主题调色板',
  showModeSwitch: true,
  showExport: true,
  showHarmony: true,
  showCssPreview: false,
  cssPrefix: 'color'
})

const emit = defineEmits<{
  'update:primaryColor': [value: string]
  'change': [value: string]
  'export': [data: any]
}>()

// 使用调色板 Hook
const {
  primaryColor: internalColor,
  lightPalette,
  darkPalette,
  setPrimaryColor,
  toCSSVariables,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getTetradicColors
} = useColorPalette(props.primaryColor)

// 状态
const currentMode = ref<'light' | 'dark'>('light')
const copiedColor = ref<string | null>(null)
const primaryInputValue = ref(props.primaryColor)

// 计算属性
const currentPalette = computed(() => 
  currentMode.value === 'light' ? lightPalette.value : darkPalette.value
)

const complementaryColor = computed(() => getComplementaryColor())
const analogousColors = computed(() => getAnalogousColors(2))
const triadicColors = computed(() => getTriadicColors())
const tetradicColors = computed(() => getTetradicColors())

const cssVariables = computed(() => 
  toCSSVariables({ prefix: props.cssPrefix, includeAliases: true })
)

// 方法
const getPaletteTitle = (name: string): string => {
  const titles: Record<string, string> = {
    primary: '主色',
    success: '成功',
    warning: '警告',
    danger: '危险',
    gray: '灰色'
  }
  return titles[name] || name
}

const toggleMode = () => {
  currentMode.value = currentMode.value === 'light' ? 'dark' : 'light'
}

const handlePrimaryChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  primaryInputValue.value = value
  setPrimaryColor(value)
  emit('update:primaryColor', value)
  emit('change', value)
}

const handlePrimaryTextChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  primaryInputValue.value = value
}

const handlePrimaryBlur = () => {
  try {
    const color = new Color(primaryInputValue.value)
    const hex = color.toHex()
    primaryInputValue.value = hex
    setPrimaryColor(hex)
    emit('update:primaryColor', hex)
    emit('change', hex)
  } catch {
    // 无效颜色，恢复原值
    primaryInputValue.value = internalColor.value
  }
}

const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
    copiedColor.value = color
    setTimeout(() => {
      copiedColor.value = null
    }, 2000)
  } catch (error) {
    console.error('Failed to copy color:', error)
  }
}

const copyCssVariables = async () => {
  try {
    await navigator.clipboard.writeText(cssVariables.value)
    // 可以添加提示
  } catch (error) {
    console.error('Failed to copy CSS:', error)
  }
}

const exportPalette = () => {
  const data = {
    primaryColor: internalColor.value,
    mode: currentMode.value,
    palette: currentPalette.value,
    harmony: {
      complementary: complementaryColor.value,
      analogous: analogousColors.value,
      triadic: triadicColors.value,
      tetradic: tetradicColors.value
    }
  }
  emit('export', data)
  
  // 下载 JSON 文件
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `palette-${internalColor.value.replace('#', '')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 监听外部主色调变化
watch(() => props.primaryColor, (val) => {
  primaryInputValue.value = val
  setPrimaryColor(val)
})
</script>

<style scoped>
.ld-palette-display {
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ld-palette-display__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.ld-palette-display__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.ld-palette-display__controls {
  display: flex;
  gap: 8px;
}

.ld-palette-display__mode-btn,
.ld-palette-display__export-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.ld-palette-display__mode-btn:hover,
.ld-palette-display__export-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.ld-palette-display__primary {
  margin-bottom: 24px;
}

.ld-palette-display__label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.ld-palette-display__input-group {
  display: flex;
  gap: 8px;
}

.ld-palette-display__color-input {
  width: 48px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.ld-palette-display__text-input {
  flex: 1;
  max-width: 200px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}

.ld-palette-display__palettes {
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
}

.ld-palette-display__palette-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.ld-palette-display__shades {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.ld-palette-display__shade {
  position: relative;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  font-size: 11px;
}

.ld-palette-display__shade:hover {
  transform: scale(1.05);
}

.ld-palette-display__shade-label {
  font-weight: 600;
}

.ld-palette-display__shade-value {
  opacity: 0.8;
  font-family: monospace;
}

.ld-palette-display__copied {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
}

.ld-palette-display__harmony {
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.ld-palette-display__section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.ld-palette-display__harmony-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.ld-palette-display__harmony-label {
  width: 80px;
  font-size: 14px;
  color: #666;
}

.ld-palette-display__harmony-colors {
  display: flex;
  gap: 8px;
}

.ld-palette-display__harmony-color {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: transform 0.2s;
}

.ld-palette-display__harmony-color:hover {
  transform: scale(1.1);
}

.ld-palette-display__css {
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.ld-palette-display__css-code {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.ld-palette-display__copy-css-btn {
  width: 100%;
  padding: 8px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.ld-palette-display__copy-css-btn:hover {
  background: #40a9ff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>