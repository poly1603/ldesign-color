# 安装

## 环境要求

在开始之前，请确保你的开发环境满足以下要求：

- **Node.js**: >= 16.0.0
- **Vue**: >= 3.3.0 (如果使用Vue功能)
- **TypeScript**: >= 4.5.0 (推荐)

## 包管理器安装

### pnpm (推荐)

```bash
pnpm add @ldesign/color
```

### npm

```bash
npm install @ldesign/color
```

### yarn

```bash
yarn add @ldesign/color
```

## CDN 引入

如果你不使用构建工具，可以通过CDN直接引入：

```html
<!-- 引入库文件 -->
<script src="https://unpkg.com/@ldesign/color@latest/dist/ldesign-color.umd.js"></script>

<!-- 引入样式文件 -->
<link rel="stylesheet" href="https://unpkg.com/@ldesign/color@latest/dist/style.css">

<script>
  // 全局变量 LDesignColor 可用
  const { generateTheme } = LDesignColor
  const theme = generateTheme('#1890ff')
  console.log(theme)
</script>
```

## Vue 项目集成

### Vite 项目

如果你使用 Vite，推荐的配置如下：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@ldesign/color']
  }
})
```

### Vue CLI 项目

对于 Vue CLI 项目，在 `vue.config.js` 中添加：

```javascript
// vue.config.js
module.exports = {
  transpileDependencies: ['@ldesign/color']
}
```

### Nuxt 3 项目

在 Nuxt 3 中使用：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    // 其他模块
  ],
  css: [
    '@ldesign/color/dist/style.css'
  ],
  build: {
    transpile: ['@ldesign/color']
  }
})
```

## TypeScript 配置

如果你使用 TypeScript，确保在 `tsconfig.json` 中包含正确的配置：

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["@ldesign/color"]
  }
}
```

## 样式引入

### 全局引入样式

在你的主入口文件中引入样式：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// 引入样式
import '@ldesign/color/dist/style.css'

const app = createApp(App)
app.mount('#app')
```

### 按需引入样式

如果你只使用部分功能，可以按需引入：

```typescript
// 只引入核心样式
import '@ldesign/color/dist/core.css'

// 只引入组件样式
import '@ldesign/color/dist/components.css'
```

## 验证安装

创建一个简单的测试文件来验证安装是否成功：

```typescript
// test-installation.ts
import { generateTheme, isValidColor } from '@ldesign/color'

// 测试基础功能
const theme = generateTheme('#1890ff')
console.log('✅ 主题生成成功:', theme.semanticColors)

// 测试工具函数
const isValid = isValidColor('#1890ff')
console.log('✅ 颜色验证成功:', isValid)

console.log('🎉 @ldesign/color 安装成功！')
```

运行测试：

```bash
npx tsx test-installation.ts
```

## 常见问题

### Q: 安装后提示找不到模块？

**A**: 确保你的 Node.js 版本 >= 16.0.0，并且使用的是最新版本的包管理器。

### Q: TypeScript 类型提示不工作？

**A**: 检查 `tsconfig.json` 配置，确保包含了正确的类型声明。如果问题仍然存在，尝试重启 TypeScript 服务。

### Q: 在 Vite 中出现构建错误？

**A**: 在 `vite.config.ts` 中添加 `optimizeDeps.include: ['@ldesign/color']`。

### Q: 样式没有生效？

**A**: 确保正确引入了样式文件，并且没有被其他CSS覆盖。

### Q: Vue 组件无法使用？

**A**: 确保你的 Vue 版本 >= 3.3.0，并且正确导入了组件。

## 升级指南

### 从 0.x 升级到 1.x

如果你之前使用的是测试版本，请注意以下破坏性变更：

1. **API 重命名**：
   ```typescript
   // 旧版本
   import { ColorThemeGenerator } from '@ldesign/color'
   
   // 新版本
   import { ColorGenerator } from '@ldesign/color'
   ```

2. **配置选项变更**：
   ```typescript
   // 旧版本
   const generator = new ColorGenerator({ cache: true })
   
   // 新版本
   const generator = new ColorGenerator({ enableCache: true })
   ```

3. **Vue 组件重命名**：
   ```vue
   <!-- 旧版本 -->
   <ColorThemeProvider>
   
   <!-- 新版本 -->
   <ColorProvider>
   ```

### 自动升级工具

我们提供了自动升级工具来帮助你迁移：

```bash
npx @ldesign/color-migrate
```

## 下一步

安装完成后，你可以：

- 📖 阅读 [快速开始](./getting-started) 学习基础用法
- 🎨 查看 [基础概念](./concepts) 了解核心原理
- 🔧 探索 [Vue集成](./vue-composables) 学习Vue用法
- 📊 查看 [示例](../examples/) 获取更多灵感
