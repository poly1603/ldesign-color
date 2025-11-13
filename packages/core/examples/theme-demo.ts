/**
 * @ldesign/color-core 主题生成演示
 * 
 * 这个示例展示如何使用新的 API 生成主题色彩
 */

import {
  generateThemeColors,
  generateCSSVariables,
  injectCSSVariables,
  type ThemeColors,
} from '../src/theme'

// ==================== 示例 1: 基础使用 ====================
console.log('========== 示例 1: 基础使用 ==========')

// 使用主色调生成完整主题
const theme: ThemeColors = generateThemeColors('#1890ff')

console.log('亮色模式 - Primary 500:', theme.light.primary[500])
console.log('亮色模式 - Success 600:', theme.light.success[600])
console.log('暗色模式 - Primary 500:', theme.dark.primary[500])
console.log('暗色模式 - Danger 700:', theme.dark.danger[700])

// ==================== 示例 2: 自定义选项 ====================
console.log('\n========== 示例 2: 自定义选项 ==========')

const customTheme = generateThemeColors('#7c3aed', {
  preserveInput: true,
  semanticHues: {
    success: 150, // 自定义成功色的色相
    warning: 45,  // 自定义警告色的色相
    danger: 0,    // 自定义危险色的色相（纯红）
  },
})

console.log('自定义主题 - Warning 500:', customTheme.light.warning[500])

// ==================== 示例 3: 生成 CSS 变量 ====================
console.log('\n========== 示例 3: 生成 CSS 变量 ==========')

const cssVars = generateCSSVariables(theme, {
  prefix: 'app',
  includeAliases: true,
})

console.log('生成的 CSS 变量（前100个字符）:')
console.log(cssVars.substring(0, 200) + '...')

// ==================== 示例 4: 在浏览器中注入 ====================
console.log('\n========== 示例 4: 浏览器注入 ==========')
console.log('在浏览器环境中，使用以下代码注入 CSS 变量：')
console.log('injectCSSVariables(theme, { prefix: "app", includeAliases: true })')
console.log('然后在 CSS 中使用: background: var(--app-primary-500);')

// ==================== 示例 5: 完整色阶展示 ====================
console.log('\n========== 示例 5: 完整色阶展示 ==========')

console.log('Primary 色阶（亮色模式）:')
console.log('  50:', theme.light.primary[50])
console.log(' 100:', theme.light.primary[100])
console.log(' 200:', theme.light.primary[200])
console.log(' 300:', theme.light.primary[300])
console.log(' 400:', theme.light.primary[400])
console.log(' 500:', theme.light.primary[500])
console.log(' 600:', theme.light.primary[600])
console.log(' 700:', theme.light.primary[700])
console.log(' 800:', theme.light.primary[800])
console.log(' 900:', theme.light.primary[900])

console.log('\nGray 色阶（暗色模式）:')
console.log('  50:', theme.dark.gray[50])
console.log(' 100:', theme.dark.gray[100])
console.log(' 200:', theme.dark.gray[200])
console.log(' 300:', theme.dark.gray[300])
console.log(' 400:', theme.dark.gray[400])
console.log(' 500:', theme.dark.gray[500])
console.log(' 600:', theme.dark.gray[600])
console.log(' 700:', theme.dark.gray[700])
console.log(' 800:', theme.dark.gray[800])
console.log(' 900:', theme.dark.gray[900])

// ==================== 示例 6: 多主题切换 ====================
console.log('\n========== 示例 6: 多主题切换 ==========')

const themes = {
  blue: generateThemeColors('#1890ff'),
  purple: generateThemeColors('#7c3aed'),
  green: generateThemeColors('#10b981'),
  red: generateThemeColors('#ef4444'),
}

console.log('蓝色主题 Primary 500:', themes.blue.light.primary[500])
console.log('紫色主题 Primary 500:', themes.purple.light.primary[500])
console.log('绿色主题 Primary 500:', themes.green.light.primary[500])
console.log('红色主题 Primary 500:', themes.red.light.primary[500])

export { theme, customTheme, themes }
