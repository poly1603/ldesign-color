import { Color, ThemeManager, generateTailwindPalette } from '@ldesign/color-core'
import './style.css'

// 初始化主题管理器
const themeManager = new ThemeManager({
  prefix: 'demo',
  storageKey: 'core-demo-theme',
})

// 当前颜色
let currentColor = new Color('#1890ff')

// 更新 UI
function updateUI() {
  const theme = themeManager.getCurrentTheme()

  // 更新主题信息
  const colorBox = document.getElementById('current-color')!
  const themeName = document.getElementById('theme-name')!
  const themeMode = document.getElementById('theme-mode')!

  if (theme) {
    colorBox.style.backgroundColor = theme.primaryColor
    colorBox.textContent = theme.primaryColor
    themeName.textContent = theme.themeName || '自定义'
    themeMode.textContent = theme.isDark ? '深色模式' : '浅色模式'

    currentColor = new Color(theme.primaryColor)
  }

  // 更新颜色操作
  updateColorOperations()

  // 更新调色板
  updatePalette()

  // 更新无障碍信息
  updateAccessibility()
}

// 更新颜色操作
function updateColorOperations() {
  const original = document.getElementById('original-color')!
  const lighter = document.getElementById('lighter-color')!
  const darker = document.getElementById('darker-color')!
  const saturated = document.getElementById('saturated-color')!

  const lighterColor = currentColor.lighten(20)
  const darkerColor = currentColor.darken(20)
  const saturatedColor = currentColor.saturate(30)

  original.style.backgroundColor = currentColor.toHex()
  original.textContent = currentColor.toHex()

  lighter.style.backgroundColor = lighterColor.toHex()
  lighter.textContent = lighterColor.toHex()

  darker.style.backgroundColor = darkerColor.toHex()
  darker.textContent = darkerColor.toHex()

  saturated.style.backgroundColor = saturatedColor.toHex()
  saturated.textContent = saturatedColor.toHex()
}

// 更新调色板
function updatePalette() {
  const paletteEl = document.getElementById('palette')!
  const palette = generateTailwindPalette(currentColor.toHex())

  paletteEl.innerHTML = ''

  Object.entries(palette).forEach(([shade, color]) => {
    const item = document.createElement('div')
    item.className = 'palette-item'
    item.style.backgroundColor = color
    item.innerHTML = `
      <div class="palette-shade">${shade}</div>
      <div class="palette-color">${color}</div>
    `
    paletteEl.appendChild(item)
  })
}

// 更新无障碍信息
function updateAccessibility() {
  const contrastWhite = document.getElementById('contrast-white')!
  const wcagAA = document.getElementById('wcag-aa')!
  const wcagAAA = document.getElementById('wcag-aaa')!

  const whiteColor = new Color('#ffffff')
  const contrast = currentColor.contrast(whiteColor)

  contrastWhite.textContent = contrast.toFixed(2)

  const isAA = currentColor.isWCAGCompliant('#ffffff', 'AA')
  const isAAA = currentColor.isWCAGCompliant('#ffffff', 'AAA')

  wcagAA.textContent = isAA ? '✅ 通过' : '❌ 未通过'
  wcagAA.className = isAA ? 'pass' : 'fail'

  wcagAAA.textContent = isAAA ? '✅ 通过' : '❌ 未通过'
  wcagAAA.className = isAAA ? 'pass' : 'fail'
}

// 事件监听
document.getElementById('apply-blue')!.addEventListener('click', () => {
  themeManager.applyPresetTheme('blue')
  updateUI()
})

document.getElementById('apply-green')!.addEventListener('click', () => {
  themeManager.applyPresetTheme('green')
  updateUI()
})

document.getElementById('apply-purple')!.addEventListener('click', () => {
  themeManager.applyPresetTheme('purple')
  updateUI()
})

document.getElementById('toggle-mode')!.addEventListener('click', () => {
  const root = document.documentElement
  const isDark = root.hasAttribute('theme-mode')

  if (isDark) {
    root.removeAttribute('theme-mode')
  } else {
    root.setAttribute('theme-mode', 'dark')
  }

  updateUI()
})

// 订阅主题变化
themeManager.onChange(() => {
  updateUI()
})

// 初始化
themeManager.restore() || themeManager.applyPresetTheme('blue')
updateUI()

