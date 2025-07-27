# @ldesign/color 示例演示

这是一个完整的 @ldesign/color 功能演示应用，展示了库的所有核心功能。

## 🎨 功能特性

### 1. 智能颜色生成
- **主色调输入**: 支持颜色选择器和手动输入十六进制颜色值
- **随机颜色**: 一键生成随机的美观颜色
- **实时预览**: 颜色变化时立即生成新的主题

### 2. 语义化颜色系统
当你选择一个主色调后，系统会自动生成：
- **Primary**: 主色调（你选择的颜色）
- **Success**: 成功状态颜色（绿色系）
- **Warning**: 警告状态颜色（橙色系）
- **Danger**: 危险状态颜色（红色系）
- **Gray**: 中性灰色

✨ **重要**: 这些语义化颜色会根据你的主色调智能调整，确保整体配色和谐！

### 3. 完整色阶展示
- **明亮模式**: 12级色阶，从最浅到最深
- **暗黑模式**: 12级色阶，适配暗色主题
- **双模式切换**: 点击按钮即可切换查看不同模式的色阶
- **色阶编号**: 每个颜色都有对应的编号（1-12）

### 4. CSS变量自动生成
- **完整变量**: 生成所有颜色的CSS变量
- **实时注入**: 变量自动注入到页面，立即生效
- **一键复制**: 复制所有CSS变量到剪贴板
- **文件下载**: 下载为CSS文件，直接在项目中使用

## 🚀 如何使用

### 1. 选择主色调
- 使用颜色选择器选择你喜欢的颜色
- 或者在文本框中输入十六进制颜色值（如 #1890ff）
- 点击"🎲 随机颜色"按钮尝试不同的颜色

### 2. 查看生成结果
- **语义化颜色区域**: 查看基于主色调生成的语义化颜色
- **色阶区域**: 查看完整的12级色阶
- **模式切换**: 在明亮/暗黑模式间切换

### 3. 使用生成的颜色
- **点击任意颜色**: 自动复制颜色值到剪贴板
- **复制CSS变量**: 获取完整的CSS变量代码
- **下载CSS文件**: 保存为文件在项目中使用

## 💡 实际应用

### 在项目中使用生成的颜色

1. **复制CSS变量**，粘贴到你的CSS文件中：
```css
:root {
  --primary-1: #e6f7ff;
  --primary-2: #bae7ff;
  --primary-3: #91d5ff;
  /* ... 更多变量 */
}
```

2. **在样式中使用**：
```css
.button-primary {
  background-color: var(--primary-6);
  color: white;
}

.button-primary:hover {
  background-color: var(--primary-7);
}

.success-message {
  color: var(--success-6);
  background-color: var(--success-1);
}
```

### 在JavaScript中使用

```javascript
import { generateTheme } from '@ldesign/color'

// 生成主题
const theme = generateTheme('#1890ff')

// 获取语义化颜色
console.log(theme.semanticColors.primary) // #1890ff
console.log(theme.semanticColors.success) // #52c41a

// 获取色阶
console.log(theme.palettes.light.primary) // ['#e6f7ff', '#bae7ff', ...]
console.log(theme.palettes.dark.primary) // ['#111b26', '#112a3a', ...]

// 获取CSS变量
console.log(theme.cssVariables) // 完整的CSS变量字符串
```

## 🎯 设计理念

### 为什么语义化颜色会变化？
传统的设计系统中，success总是绿色，danger总是红色。但在 @ldesign/color 中，我们采用了更智能的方法：

- **色彩和谐**: 所有颜色都基于你的主色调进行调整，确保整体配色和谐
- **品牌一致性**: 语义化颜色会带有你品牌色的特征，保持视觉一致性
- **智能算法**: 基于色彩理论，自动计算最佳的语义化颜色

### 色阶设计原则
- **视觉层次**: 12级色阶提供丰富的视觉层次
- **可访问性**: 确保足够的对比度，满足无障碍设计要求
- **双模式**: 明亮和暗黑模式都有完整的色阶支持

## 🛠️ 开发说明

### 启动开发服务器
```bash
cd examples
pnpm install
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 项目结构
```
examples/
├── src/
│   ├── SimpleColorDemo.vue    # 主演示组件
│   ├── main.ts               # 应用入口
│   └── styles/               # 样式文件
├── dist/                     # 构建输出
└── package.json
```

## 📚 相关链接

- [主包文档](../README.md)
- [API文档](../docs/)
- [GitHub仓库](https://github.com/ldesign/color)
- [NPM包](https://www.npmjs.com/package/@ldesign/color)

---

🎨 **享受创造美丽颜色的过程！**
