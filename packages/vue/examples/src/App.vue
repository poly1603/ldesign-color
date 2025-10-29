<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-vue'
import { Color, generateTailwindPalette } from '@ldesign/color-core'

const {
  currentTheme,
  primaryColor,
  themeName,
  isDark,
  isLoading,
  presets,
  applyTheme,
  applyPresetTheme,
} = useTheme({ prefix: 'demo' })

const customColor = ref('#1890ff')

// 生成调色板
const palette = computed(() => generateTailwindPalette(primaryColor.value || '#1890ff'))

// 颜色操作
const color = computed(() => new Color(primaryColor.value || '#1890ff'))
const lighterColor = computed(() => color.value.lighten(20))
const darkerColor = computed(() => color.value.darken(20))
const saturatedColor = computed(() => color.value.saturate(30))

// 无障碍检查
const whiteColor = new Color('#ffffff')
const contrast = computed(() => color.value.contrast(whiteColor))
const isAA = computed(() => color.value.isWCAGCompliant('#ffffff', 'AA'))
const isAAA = computed(() => color.value.isWCAGCompliant('#ffffff', 'AAA'))

function handleApplyCustom() {
  applyTheme(customColor.value)
}
</script>

<template>
  <div class="app">
    <header>
      <div class="header-content">
        <h1>@ldesign/color-vue 演示</h1>
        <p>Vue 3 框架的主题管理解决方案</p>
      </div>
      <div class="header-controls">
        <ThemePicker :show-search="true" :show-custom="true" />
        <ThemeModeSwitcher default-mode="system" />
      </div>
    </header>

    <main>
      <div v-if="isLoading" class="loading">加载中...</div>

      <section class="demo-section">
        <h2>当前主题信息</h2>
        <div class="info-panel">
          <div class="info-item">
            <label>主题名称:</label>
            <span>{{ themeName || '自定义' }}</span>
          </div>
          <div class="info-item">
            <label>主题色:</label>
            <span class="color-box" :style="{ backgroundColor: primaryColor }">
              {{ primaryColor }}
            </span>
          </div>
          <div class="info-item">
            <label>模式:</label>
            <span>{{ isDark ? '深色模式' : '浅色模式' }}</span>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>预设主题</h2>
        <div class="preset-grid">
          <button
            v-for="preset in presets"
            :key="preset.name"
            class="preset-button"
            :class="{ active: themeName === preset.name }"
            :style="{ borderColor: preset.color }"
            @click="applyPresetTheme(preset.name)"
          >
            <span class="preset-color" :style="{ backgroundColor: preset.color }" />
            <span class="preset-label">{{ preset.label }}</span>
          </button>
        </div>
      </section>

      <section class="demo-section">
        <h2>自定义颜色</h2>
        <div class="custom-color-input">
          <input v-model="customColor" type="color" />
          <input v-model="customColor" type="text" placeholder="#000000" />
          <button @click="handleApplyCustom">应用</button>
        </div>
      </section>

      <section class="demo-section">
        <h2>颜色操作</h2>
        <div class="color-operations">
          <div class="operation-item">
            <h3>原始颜色</h3>
            <div class="color-display" :style="{ backgroundColor: color.toHex() }">
              {{ color.toHex() }}
            </div>
          </div>
          <div class="operation-item">
            <h3>变亮 20%</h3>
            <div class="color-display" :style="{ backgroundColor: lighterColor.toHex() }">
              {{ lighterColor.toHex() }}
            </div>
          </div>
          <div class="operation-item">
            <h3>变暗 20%</h3>
            <div class="color-display" :style="{ backgroundColor: darkerColor.toHex() }">
              {{ darkerColor.toHex() }}
            </div>
          </div>
          <div class="operation-item">
            <h3>饱和度 +30%</h3>
            <div class="color-display" :style="{ backgroundColor: saturatedColor.toHex() }">
              {{ saturatedColor.toHex() }}
            </div>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>Tailwind 调色板</h2>
        <div class="palette-grid">
          <div
            v-for="(colorValue, shade) in palette"
            :key="shade"
            class="palette-item"
            :style="{ backgroundColor: colorValue }"
          >
            <div class="palette-shade">{{ shade }}</div>
            <div class="palette-color">{{ colorValue }}</div>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>无障碍检查</h2>
        <div class="accessibility-check">
          <div class="check-item">
            <label>与白色对比度:</label>
            <span>{{ contrast.toFixed(2) }}</span>
          </div>
          <div class="check-item">
            <label>WCAG AA 合规:</label>
            <span :class="isAA ? 'pass' : 'fail'">
              {{ isAA ? '✅ 通过' : '❌ 未通过' }}
            </span>
          </div>
          <div class="check-item">
            <label>WCAG AAA 合规:</label>
            <span :class="isAAA ? 'pass' : 'fail'">
              {{ isAAA ? '✅ 通过' : '❌ 未通过' }}
            </span>
          </div>
        </div>
      </section>

      <section class="demo-section">
        <h2>主题状态 (Debug)</h2>
        <pre class="debug-panel">{{ JSON.stringify(currentTheme, null, 2) }}</pre>
      </section>
    </main>
  </div>
</template>

