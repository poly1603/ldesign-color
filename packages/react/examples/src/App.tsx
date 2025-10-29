import { useState } from 'react'
import { ThemeProvider, ThemePicker, ThemeModeSwitcher, useTheme } from '@ldesign/color-react'
import { Color, generateTailwindPalette } from '@ldesign/color-core'

function DemoContent() {
  const {
    currentTheme,
    primaryColor,
    themeName,
    isDark,
    isLoading,
    presets,
    applyTheme,
    applyPresetTheme,
  } = useTheme()

  const [customColor, setCustomColor] = useState('#1890ff')

  // 生成调色板
  const palette = generateTailwindPalette(primaryColor || '#1890ff')

  // 颜色操作
  const color = new Color(primaryColor || '#1890ff')
  const lighterColor = color.lighten(20)
  const darkerColor = color.darken(20)
  const saturatedColor = color.saturate(30)

  // 无障碍检查
  const whiteColor = new Color('#ffffff')
  const contrast = color.contrast(whiteColor)
  const isAA = color.isWCAGCompliant('#ffffff', 'AA')
  const isAAA = color.isWCAGCompliant('#ffffff', 'AAA')

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>@ldesign/color-react 演示</h1>
          <p>React 框架的主题管理解决方案</p>
        </div>
        <div className="header-controls">
          <ThemePicker showSearch showCustom />
          <ThemeModeSwitcher />
        </div>
      </header>

      <main>
        {isLoading && <div className="loading">加载中...</div>}

        <section className="demo-section">
          <h2>当前主题信息</h2>
          <div className="info-panel">
            <div className="info-item">
              <label>主题名称:</label>
              <span>{themeName || '自定义'}</span>
            </div>
            <div className="info-item">
              <label>主题色:</label>
              <span className="color-box" style={{ backgroundColor: primaryColor }}>
                {primaryColor}
              </span>
            </div>
            <div className="info-item">
              <label>模式:</label>
              <span>{isDark ? '深色模式' : '浅色模式'}</span>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>预设主题</h2>
          <div className="preset-grid">
            {presets.map((preset) => (
              <button
                key={preset.name}
                className={`preset-button ${themeName === preset.name ? 'active' : ''}`}
                onClick={() => applyPresetTheme(preset.name)}
                style={{ borderColor: preset.color }}
              >
                <span
                  className="preset-color"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="preset-label">{preset.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="demo-section">
          <h2>自定义颜色</h2>
          <div className="custom-color-input">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder="#000000"
            />
            <button onClick={() => applyTheme(customColor)}>应用</button>
          </div>
        </section>

        <section className="demo-section">
          <h2>颜色操作</h2>
          <div className="color-operations">
            <div className="operation-item">
              <h3>原始颜色</h3>
              <div
                className="color-display"
                style={{ backgroundColor: color.toHex() }}
              >
                {color.toHex()}
              </div>
            </div>
            <div className="operation-item">
              <h3>变亮 20%</h3>
              <div
                className="color-display"
                style={{ backgroundColor: lighterColor.toHex() }}
              >
                {lighterColor.toHex()}
              </div>
            </div>
            <div className="operation-item">
              <h3>变暗 20%</h3>
              <div
                className="color-display"
                style={{ backgroundColor: darkerColor.toHex() }}
              >
                {darkerColor.toHex()}
              </div>
            </div>
            <div className="operation-item">
              <h3>饱和度 +30%</h3>
              <div
                className="color-display"
                style={{ backgroundColor: saturatedColor.toHex() }}
              >
                {saturatedColor.toHex()}
              </div>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>Tailwind 调色板</h2>
          <div className="palette-grid">
            {Object.entries(palette).map(([shade, colorValue]) => (
              <div
                key={shade}
                className="palette-item"
                style={{ backgroundColor: colorValue }}
              >
                <div className="palette-shade">{shade}</div>
                <div className="palette-color">{colorValue}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="demo-section">
          <h2>无障碍检查</h2>
          <div className="accessibility-check">
            <div className="check-item">
              <label>与白色对比度:</label>
              <span>{contrast.toFixed(2)}</span>
            </div>
            <div className="check-item">
              <label>WCAG AA 合规:</label>
              <span className={isAA ? 'pass' : 'fail'}>
                {isAA ? '✅ 通过' : '❌ 未通过'}
              </span>
            </div>
            <div className="check-item">
              <label>WCAG AAA 合规:</label>
              <span className={isAAA ? 'pass' : 'fail'}>
                {isAAA ? '✅ 通过' : '❌ 未通过'}
              </span>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>主题状态 (Debug)</h2>
          <pre className="debug-panel">
            {JSON.stringify(currentTheme, null, 2)}
          </pre>
        </section>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider options={{ prefix: 'demo' }}>
      <DemoContent />
    </ThemeProvider>
  )
}

