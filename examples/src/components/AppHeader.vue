<script setup lang="ts">
interface NavItem {
  id: string
  label: string
  href: string
}

interface Props {
  currentTheme: 'light' | 'dark'
}

defineProps<Props>()
defineEmits<{
  'toggle-theme': []
}>()

// 导航菜单项
const navItems: NavItem[] = [
  { id: 'welcome', label: '介绍', href: '#welcome' },
  { id: 'generator', label: '颜色生成', href: '#generator' },
  { id: 'components', label: '组件', href: '#components' },
  { id: 'performance', label: '性能', href: '#performance' },
  { id: 'api', label: 'API', href: '#api' },
]

// 平滑滚动到指定区域
function scrollToSection(id: string, event: Event) {
  event.preventDefault()
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <!-- Logo和标题 -->
        <div class="brand">
          <div class="logo">
            🎨
          </div>
          <div class="brand-text">
            <h1 class="title">
              @ldesign/color
            </h1>
            <p class="subtitle">
              高性能颜色生成库演示
            </p>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="nav">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.href"
            class="nav-link"
            @click="scrollToSection(item.id, $event)"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- 操作按钮 -->
        <div class="actions">
          <!-- 主题切换按钮 -->
          <button
            class="theme-toggle"
            :title="currentTheme === 'dark' ? '切换到明亮模式' : '切换到暗黑模式'"
            @click="$emit('toggle-theme')"
          >
            <span class="theme-icon">
              {{ currentTheme === 'dark' ? '☀️' : '🌙' }}
            </span>
          </button>

          <!-- GitHub链接 -->
          <a
            href="https://github.com/ldesign/color"
            target="_blank"
            class="github-link"
            title="查看源码"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.9);
}

[data-theme="dark"] .header {
  background-color: rgba(20, 20, 20, 0.9);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.logo {
  font-size: 32px;
  line-height: 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.subtitle {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1;
  margin-top: 2px;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: var(--space-sm) 0;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--ldesign-primary, #1890ff);
  border-bottom-color: var(--ldesign-primary, #1890ff);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  border-color: var(--ldesign-primary, #1890ff);
  background-color: var(--ldesign-primary, #1890ff);
}

.theme-toggle:hover .theme-icon {
  transform: scale(1.1);
}

.theme-icon {
  font-size: 18px;
  transition: transform var(--transition-fast);
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.github-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-md);
  }

  .header-content {
    height: 56px;
  }

  .nav {
    display: none;
  }

  .brand-text {
    display: none;
  }

  .logo {
    font-size: 28px;
  }

  .actions {
    gap: var(--space-sm);
  }

  .theme-toggle,
  .github-link {
    width: 36px;
    height: 36px;
  }

  .theme-icon {
    font-size: 16px;
  }
}
</style>
