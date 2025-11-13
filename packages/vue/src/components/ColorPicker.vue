<template>
  <div class="ld-color-picker">
    <!-- 颜色预览和输入 -->
    <div class="ld-color-picker__trigger" @click="togglePicker">
      <div 
        class="ld-color-picker__preview" 
        :style="{ backgroundColor: modelValue }"
      >
        <span v-if="!modelValue" class="ld-color-picker__empty">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="4" y1="20" x2="20" y2="4" stroke-width="2"/>
          </svg>
        </span>
      </div>
      <input
        class="ld-color-picker__input"
        :value="displayValue"
        @input="handleInput"
        @blur="handleBlur"
        placeholder="#000000"
      />
    </div>

    <!-- 弹出式选择器 -->
    <Teleport to="body">
      <Transition name="ld-color-picker-fade">
        <div 
          v-if="showPicker" 
          class="ld-color-picker__dropdown"
          :style="dropdownStyle"
          ref="dropdownRef"
        >
          <!-- 预设颜色 -->
          <div v-if="presets.length > 0" class="ld-color-picker__presets">
            <div class="ld-color-picker__section-title">{{ presetsTitle }}</div>
            <div class="ld-color-picker__preset-list">
              <button
                v-for="color in presets"
                :key="color"
                class="ld-color-picker__preset-item"
                :class="{ active: modelValue === color }"
                :style="{ backgroundColor: color }"
                :title="color"
                @click="selectColor(color)"
              >
                <span v-if="modelValue === color" class="ld-color-picker__check">
                  ✓
                </span>
              </button>
            </div>
          </div>

          <!-- 最近使用 -->
          <div v-if="showRecent && recentColors.length > 0" class="ld-color-picker__recent">
            <div class="ld-color-picker__section-title">{{ recentTitle }}</div>
            <div class="ld-color-picker__preset-list">
              <button
                v-for="color in recentColors"
                :key="color"
                class="ld-color-picker__preset-item"
                :style="{ backgroundColor: color }"
                :title="color"
                @click="selectColor(color)"
              />
            </div>
          </div>

          <!-- 色调选择器 -->
          <div class="ld-color-picker__hue">
            <input
              type="range"
              min="0"
              max="360"
              :value="hue"
              @input="handleHueChange"
              class="ld-color-picker__hue-slider"
            />
          </div>

          <!-- 饱和度和亮度选择器 -->
          <div 
            class="ld-color-picker__saturation"
            :style="{ backgroundColor: `hsl(${hue}, 100%, 50%)` }"
            @mousedown="handleSaturationMouseDown"
            ref="saturationRef"
          >
            <div class="ld-color-picker__saturation-white"></div>
            <div class="ld-color-picker__saturation-black"></div>
            <div 
              class="ld-color-picker__saturation-cursor"
              :style="{ 
                left: `${saturation}%`,
                top: `${100 - lightness}%`
              }"
            />
          </div>

          <!-- 透明度选择器 -->
          <div v-if="showAlpha" class="ld-color-picker__alpha">
            <div class="ld-color-picker__alpha-background"></div>
            <input
              type="range"
              min="0"
              max="100"
              :value="alpha * 100"
              @input="handleAlphaChange"
              class="ld-color-picker__alpha-slider"
            />
          </div>

          <!-- 颜色格式切换 -->
          <div class="ld-color-picker__formats">
            <button
              v-for="format in formats"
              :key="format"
              class="ld-color-picker__format-btn"
              :class="{ active: currentFormat === format }"
              @click="currentFormat = format"
            >
              {{ format.toUpperCase() }}
            </button>
          </div>

          <!-- 确认按钮 -->
          <div class="ld-color-picker__actions">
            <button class="ld-color-picker__btn ld-color-picker__btn--cancel" @click="cancel">
              {{ cancelText }}
            </button>
            <button class="ld-color-picker__btn ld-color-picker__btn--confirm" @click="confirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- 遮罩层 -->
    <Teleport to="body">
      <div 
        v-if="showPicker" 
        class="ld-color-picker__overlay"
        @click="cancel"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Color } from '@ldesign/color-core'

interface ColorPickerProps {
  /** 绑定值 */
  modelValue?: string
  /** 预设颜色 */
  presets?: string[]
  /** 显示最近使用 */
  showRecent?: boolean
  /** 最近使用数量 */
  recentMax?: number
  /** 显示透明度 */
  showAlpha?: boolean
  /** 支持的格式 */
  formats?: ('hex' | 'rgb' | 'hsl')[]
  /** 禁用 */
  disabled?: boolean
  /** 预设标题 */
  presetsTitle?: string
  /** 最近使用标题 */
  recentTitle?: string
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: '#1890ff',
  presets: () => [
    '#1890ff', '#52c41a', '#faad14', '#f5222d',
    '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'
  ],
  showRecent: true,
  recentMax: 8,
  showAlpha: false,
  formats: () => ['hex', 'rgb', 'hsl'],
  disabled: false,
  presetsTitle: '预设颜色',
  recentTitle: '最近使用',
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'confirm': [value: string]
  'cancel': []
}>()

// 状态
const showPicker = ref(false)
const currentColor = ref(props.modelValue)
const currentFormat = ref<'hex' | 'rgb' | 'hsl'>('hex')
const recentColors = ref<string[]>([])
const dropdownRef = ref<HTMLElement>()
const saturationRef = ref<HTMLElement>()
const dropdownStyle = ref({})

// HSL 值
const color = computed(() => new Color(currentColor.value))
const hsl = computed(() => color.value.toHSL())
const hue = computed(() => hsl.value.h)
const saturation = computed(() => hsl.value.s)
const lightness = computed(() => hsl.value.l)
const alpha = ref(1)

// 显示值
const displayValue = computed(() => {
  if (!currentColor.value) return ''
  const c = new Color(currentColor.value)
  switch (currentFormat.value) {
    case 'rgb':
      return c.toRgbString()
    case 'hsl':
      return c.toHslString()
    default:
      return c.toHex()
  }
})

// 方法
const togglePicker = () => {
  if (props.disabled) return
  showPicker.value = !showPicker.value
  if (showPicker.value) {
    updateDropdownPosition()
  }
}

const updateDropdownPosition = () => {
  // 简单定位，实际应该计算最佳位置
  dropdownStyle.value = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999
  }
}

const selectColor = (color: string) => {
  currentColor.value = color
  addToRecent(color)
}

const addToRecent = (color: string) => {
  const index = recentColors.value.indexOf(color)
  if (index > -1) {
    recentColors.value.splice(index, 1)
  }
  recentColors.value.unshift(color)
  if (recentColors.value.length > props.recentMax) {
    recentColors.value.pop()
  }
  // 保存到 localStorage
  localStorage.setItem('ld-color-picker-recent', JSON.stringify(recentColors.value))
}

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  try {
    const c = new Color(value)
    currentColor.value = c.toHex()
  } catch {
    // 无效颜色，忽略
  }
}

const handleBlur = () => {
  // 格式化输入
  try {
    const c = new Color(currentColor.value)
    currentColor.value = c.toHex()
  } catch {
    currentColor.value = props.modelValue
  }
}

const handleHueChange = (e: Event) => {
  const h = parseInt((e.target as HTMLInputElement).value)
  const c = Color.fromHSL(h, saturation.value, lightness.value)
  currentColor.value = c.toHex()
}

const handleAlphaChange = (e: Event) => {
  alpha.value = parseInt((e.target as HTMLInputElement).value) / 100
  // 更新颜色
  const c = new Color(currentColor.value)
  c.alpha = alpha.value
  currentColor.value = c.toRgbaString()
}

const handleSaturationMouseDown = (e: MouseEvent) => {
  const rect = saturationRef.value!.getBoundingClientRect()
  const updatePosition = (e: MouseEvent) => {
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    const s = (x / rect.width) * 100
    const l = 100 - (y / rect.height) * 100
    const c = Color.fromHSL(hue.value, s, l)
    currentColor.value = c.toHex()
  }
  
  updatePosition(e)
  
  const handleMouseMove = (e: MouseEvent) => updatePosition(e)
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const confirm = () => {
  emit('update:modelValue', currentColor.value)
  emit('change', currentColor.value)
  emit('confirm', currentColor.value)
  addToRecent(currentColor.value)
  showPicker.value = false
}

const cancel = () => {
  currentColor.value = props.modelValue
  emit('cancel')
  showPicker.value = false
}

// 生命周期
onMounted(() => {
  // 从 localStorage 加载最近使用
  const stored = localStorage.getItem('ld-color-picker-recent')
  if (stored) {
    try {
      recentColors.value = JSON.parse(stored)
    } catch {
      // 忽略错误
    }
  }
})

// 监听值变化
watch(() => props.modelValue, (val) => {
  currentColor.value = val
})
</script>

<style scoped>
.ld-color-picker {
  display: inline-block;
  position: relative;
}

.ld-color-picker__trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.ld-color-picker__trigger:hover {
  border-color: #1890ff;
}

.ld-color-picker__preview {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  position: relative;
  overflow: hidden;
}

.ld-color-picker__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #d9d9d9;
}

.ld-color-picker__input {
  border: none;
  outline: none;
  width: 80px;
  font-family: monospace;
}

.ld-color-picker__dropdown {
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  padding: 16px;
  width: 280px;
}

.ld-color-picker__section-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.ld-color-picker__preset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.ld-color-picker__preset-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}

.ld-color-picker__preset-item:hover {
  transform: scale(1.1);
}

.ld-color-picker__preset-item.active {
  border-color: #1890ff;
  border-width: 2px;
}

.ld-color-picker__check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

.ld-color-picker__saturation {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 4px;
  margin-bottom: 12px;
  cursor: crosshair;
}

.ld-color-picker__saturation-white {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, white, transparent);
  border-radius: 4px;
}

.ld-color-picker__saturation-black {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, black);
  border-radius: 4px;
}

.ld-color-picker__saturation-cursor {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ld-color-picker__hue {
  margin-bottom: 12px;
}

.ld-color-picker__hue-slider,
.ld-color-picker__alpha-slider {
  width: 100%;
  height: 12px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 6px;
  outline: none;
}

.ld-color-picker__hue-slider {
  background: linear-gradient(to right, 
    #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
}

.ld-color-picker__alpha {
  position: relative;
  margin-bottom: 12px;
}

.ld-color-picker__alpha-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  border-radius: 6px;
  background-image: 
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}

.ld-color-picker__formats {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.ld-color-picker__format-btn {
  flex: 1;
  padding: 4px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.ld-color-picker__format-btn:hover {
  border-color: #1890ff;
}

.ld-color-picker__format-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.ld-color-picker__actions {
  display: flex;
  gap: 8px;
}

.ld-color-picker__btn {
  flex: 1;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.ld-color-picker__btn--confirm {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.ld-color-picker__btn--confirm:hover {
  background: #40a9ff;
}

.ld-color-picker__btn--cancel:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.ld-color-picker__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 9998;
}

/* 过渡动画 */
.ld-color-picker-fade-enter-active,
.ld-color-picker-fade-leave-active {
  transition: opacity 0.3s;
}

.ld-color-picker-fade-enter-from,
.ld-color-picker-fade-leave-to {
  opacity: 0;
}
</style>