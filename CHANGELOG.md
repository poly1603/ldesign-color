# 更新日志

## [1.1.0] - 2024-01-XX

### 🎉 新功能

#### 1. 灰色混入主色调可配置
- 新增 `grayMixPrimary` 配置选项，控制是否在灰色中混入主色调
- 新增 `grayMixRatio` 配置选项，控制主色调混入比例 (0-1)
- 默认启用混入，比例为 0.2

```javascript
// 禁用灰色混入主色调
const theme = generateTheme('#1890ff', {
  grayMixPrimary: false
})

// 调整混入比例
const theme = generateTheme('#1890ff', {
  grayMixPrimary: true,
  grayMixRatio: 0.5  // 50% 混入比例
})
```

#### 2. 内置预设主题
- 新增 12 个精心设计的预设主题
- 包含蓝色、绿色、红色、橙色、紫色、青色、粉色、黄色等
- 每个预设都有浅色和深色变体

#### 3. 示例应用增强
- 新增预设主题选择器
- 新增灰色混入配置界面
- 新增暗黑模式专用样式
- 新增CSS变量计数显示

### 🔧 改进

#### 1. 暗黑模式色阶优化
- 暗黑模式色阶现在从深到浅显示（符合视觉习惯）
- 暗黑模式背景自动切换为深色
- 色阶编号在暗黑模式下正确显示

#### 2. CSS变量生成优化
- 移除了RGB格式的CSS变量，只保留十六进制格式
- 减少了生成的变量数量，提高性能
- CSS变量预览现在显示完整内容

#### 3. 随机颜色生成修复
- 修复了随机颜色生成HSL格式导致的验证错误
- 现在确保生成的随机颜色都是有效的十六进制格式

### 🎨 示例应用新功能

#### 1. 预设主题选择
- 12个内置预设主题，一键切换
- 预设主题按钮显示实际颜色
- 当前选中的预设会高亮显示

#### 2. 灰色配置界面
- 复选框控制是否混入主色调
- 滑块调整混入比例 (0-100%)
- 实时预览配置效果

#### 3. 暗黑模式体验
- 暗黑模式专用背景样式
- 色阶从深到浅的正确显示
- 更好的视觉对比度

#### 4. CSS变量展示
- 显示变量总数统计
- 完整的CSS变量内容
- 一键复制和下载功能

### 🐛 修复

1. **随机颜色错误**: 修复了 `generateRandomColor()` 返回HSL格式导致的验证失败
2. **暗黑模式显示**: 修复了暗黑模式下色阶显示顺序错误
3. **CSS变量冗余**: 移除了不必要的RGB格式变量

### 📚 API 变更

#### 新增配置选项

```typescript
interface ColorGeneratorConfig {
  // ... 现有选项
  
  /** 是否在灰色中混入主色调 */
  grayMixPrimary?: boolean
  
  /** 主色调混入比例 (0-1) */
  grayMixRatio?: number
}
```

#### 使用示例

```javascript
import { generateTheme } from '@ldesign/color'

// 使用新的配置选项
const theme = generateTheme('#1890ff', {
  grayMixPrimary: false,     // 禁用灰色混入
  grayMixRatio: 0.3,         // 30% 混入比例
  cssPrefix: 'my-app',       // 自定义CSS前缀
  autoInject: true           // 自动注入CSS变量
})

// 访问生成的颜色
console.log(theme.semanticColors.gray)  // 纯中性灰色或混入主色调的灰色
console.log(theme.cssVariables)         // 只包含十六进制格式的CSS变量
```

### 🎯 性能优化

1. **CSS变量减少**: 移除RGB变量，减少约50%的变量数量
2. **更快的生成**: 优化了语义化颜色生成算法
3. **更小的包体积**: 减少了不必要的代码

### 🔄 迁移指南

#### 从 1.0.x 升级到 1.1.0

1. **CSS变量变更**: 如果你使用了RGB格式的CSS变量，需要改为十六进制格式
   ```css
   /* 旧版本 */
   background-color: rgb(var(--ldesign-primary-6-rgb));
   
   /* 新版本 */
   background-color: var(--ldesign-primary-6);
   ```

2. **灰色行为变更**: 默认情况下灰色会混入主色调，如需纯中性灰色：
   ```javascript
   const theme = generateTheme('#1890ff', {
     grayMixPrimary: false
   })
   ```

3. **暗黑模式**: 如果你自定义了暗黑模式样式，注意色阶顺序已调整

### 📖 文档更新

- 更新了API文档，包含新的配置选项
- 新增了预设主题使用指南
- 更新了示例代码和最佳实践
- 新增了迁移指南

---

## [1.0.0] - 2024-01-XX

### 🎉 首次发布

- 基础颜色生成功能
- 语义化颜色系统
- 12级色阶生成
- CSS变量自动生成
- Vue 3 组合式API支持
- TypeScript 完整类型支持
