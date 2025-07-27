<script setup lang="ts">
import { ref } from 'vue'

// 监听颜色变化
import { watch } from 'vue'

// 简单的颜色状态
const color = ref('#1890ff')
const loading = ref(false)
const theme = ref(null)

// 模拟主题生成
function generateTheme(inputColor: string) {
  loading.value = true

  setTimeout(() => {
    theme.value = {
      semanticColors: {
        primary: inputColor,
        success: '#52c41a',
        warning: '#faad14',
        danger: '#f5222d',
        gray: '#8c8c8c',
      },
    }
    loading.value = false
  }, 500)
}
watch(color, (newColor) => {
  generateTheme(newColor)
}, { immediate: true })
</script>

<template>
  <div class="simple-app">
    <h1>🎨 @ldesign/color 简单示例</h1>

    <div class="color-input">
      <label>选择颜色：</label>
      <input v-model="color" type="color">
      <span>{{ color }}</span>
    </div>

    <div v-if="loading">
      加载中...
    </div>

    <div v-if="theme && !loading" class="result">
      <h2>生成的语义化颜色</h2>
      <div class="colors">
        <div
          v-for="(colorValue, name) in theme.semanticColors"
          :key="name"
          class="color-item"
          :style="{ backgroundColor: colorValue }"
        >
          <span>{{ name }}</span>
          <span>{{ colorValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.simple-app {
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

.color-input input[type="color"] {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.color-item {
  padding: 1rem;
  border-radius: 8px;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 80px;
  justify-content: center;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.color-item span:first-child {
  text-transform: capitalize;
}

.color-item span:last-child {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  opacity: 0.8;
}
</style>
