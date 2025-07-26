<template>
  <div class="app">
    <!-- 头部导航 -->
    <AppHeader
      :current-theme="currentTheme"
      @toggle-theme="toggleTheme"
    />

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="container">
        <!-- 欢迎区域 -->
        <WelcomeSection />

        <!-- 颜色生成演示 -->
        <ColorGeneratorDemo />

        <!-- 组件演示 -->
        <ComponentDemo />

        <!-- 性能演示 -->
        <PerformanceDemo />

        <APIDemo />
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 导入组件
import APIDemo from './components/APIDemo.vue'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import ColorGeneratorDemo from './components/ColorGeneratorDemo.vue'
import ComponentDemo from './components/ComponentDemo.vue'
import PerformanceDemo from './components/PerformanceDemo.vue'
import WelcomeSection from './components/WelcomeSection.vue'

// 主题切换 - 简化版本，不依赖库
const currentTheme = 'light'
const toggleTheme = () => {
  console.log('主题切换功能')
}

// 组件挂载时的初始化
onMounted(() => {
  console.log('🎨 @ldesign/color 演示应用已加载')
  console.log('当前主题:', currentTheme)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--space-xl) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-md);
  }

  .main-content {
    padding: var(--space-lg) 0;
  }
}
</style>
