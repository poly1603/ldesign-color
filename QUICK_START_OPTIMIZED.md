# 🚀 @ldesign/color 优化版快速开始

## 1分钟上手

### 安装
```bash
npm install @ldesign/color
```

### 使用优化版本
```typescript
// 导入优化版本
import { Color } from '@ldesign/color/optimized'

// 创建颜色
const blue = new Color('#3498db')
console.log(blue.toRGB())  // { r: 52, g: 152, b: 219 }

// 记得释放！
blue.dispose()
```

## 核心概念

### 1️⃣ 对象释放（重要！）
```typescript
const color = new Color('#ff0000')
// 使用颜色...
color.dispose()  // 必须释放！
```

### 2️⃣ 批量处理
```typescript
import { batchConvert } from '@ldesign/color/optimized'

const colors = ['#ff0000', '#00ff00', '#0000ff']
const hexColors = await batchConvert(colors, 'hex')
```

### 3️⃣ 内存监控
```typescript
import { getMemoryStats } from '@ldesign/color/optimized'

const stats = getMemoryStats()
console.log(`内存使用: ${stats.estimatedMemoryMB}MB`)
```

## 常用示例

### 颜色操作
```typescript
const primary = new Color('#3498db')

// 调整颜色
const lighter = primary.lighten(20)   // 调亮 20%
const darker = primary.darken(20)     // 调暗 20%
const gray = primary.grayscale()      // 转灰度

// 获取补色
const complement = primary.complementary()

// 混合颜色
const purple = primary.mix('#e74c3c', 50)

// 释放所有对象
[primary, lighter, darker, gray, complement, purple]
  .forEach(c => c.dispose())
```

### 颜色分析
```typescript
const color = new Color('#3498db')

console.log(color.isLight())        // true
console.log(color.getLuminance())   // 0.465
console.log(color.contrast('#fff')) // 4.5

color.dispose()
```

### 批量处理
```typescript
import { batchManipulate, batchAnalyze } from '@ldesign/color/optimized'

const brandColors = [
  '#3498db', // Primary
  '#2ecc71', // Success  
  '#e74c3c', // Error
  '#f39c12', // Warning
]

// 批量调亮
const lightPalette = await batchManipulate(brandColors, {
  type: 'lighten',
  value: 30
})

// 批量分析
const analysis = await batchAnalyze(brandColors)
```

## 性能对比

| 操作 | 原版 | 优化版 | 提升 |
|-----|------|--------|------|
| 创建1000个颜色 | 15ms | 10ms | 33% |
| 批量转换100色 | 12ms | 7ms | 42% |
| 内存占用 | 1MB | 0.6MB | 40% |

## 最佳实践

### ✅ 推荐
```typescript
// 使用 try-finally 确保释放
let color: Color | null = null
try {
  color = new Color('#3498db')
  // 使用 color
} finally {
  color?.dispose()
}

// 批量处理多个颜色
const results = await batchConvert(colors, 'hex')
```

### ❌ 避免
```typescript
// 避免循环创建
for (const hex of colors) {
  const c = new Color(hex)  // 每次创建新对象
  console.log(c.toRGB())
  // 忘记 dispose()！
}

// 避免保留引用
const colorCache = []
colorCache.push(new Color('#fff'))  // 内存泄漏！
```

## 迁移清单

从原版迁移到优化版：

- [x] 更改导入路径：`@ldesign/color` → `@ldesign/color/optimized`
- [x] 添加 `dispose()` 调用
- [x] 使用批量函数替代循环
- [x] 设置内存限制（可选）
- [x] 监控内存使用（可选）

## 获取帮助

- 📖 [完整文档](./OPTIMIZATION_GUIDE.md)
- 📊 [性能报告](./OPTIMIZATION_REPORT.md)
- 💡 [示例代码](./examples/optimized-usage.ts)
- ❓ [常见问题](./OPTIMIZATION_SUMMARY.md)

---

🎉 **恭喜！** 你已经掌握了优化版的基本使用。记住最重要的一点：**使用完毕后调用 dispose()**

