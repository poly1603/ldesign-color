import { createMemo, createSignal, For, Show } from 'solid-js'
import { useTheme, ThemePicker, ThemeModeSwitcher } from '@ldesign/color-solid'
import { Color, generateTailwindPalette } from '@ldesign/color-core'

export default function App() {
  const {
    currentTheme,
    primaryColor,
    themeName,
    isDark,
    isLoading,
    presets,
    applyTheme,
    applyPresetTheme,
  } = useTheme({ prefix: 'demo' })

  const [customColor, setCustomColor] = createSignal('#1890ff')

  // 生成调色板
  const palette = createMemo(() => generateTailwindPalette(primaryColor() || '#1890ff'))

  // 颜色操作
  const color = createMemo(() => new Color(primaryColor() || '#1890ff'))
  const lighterColor = createMemo(() => color().lighten(20))
  const darkerColor = createMemo(() => color().darken(20))
  const saturatedColor = createMemo(() => color().saturate(30))

  // 无障碍检查
  const whiteColor = new Color('#ffffff')
  const contrast = createMemo(() => color().contrast(whiteColor))
  const isAA = createMemo(() => color().isWCAGCompliant('#ffffff', 'AA'))
  const isAAA = createMemo(() => color().isWCAGCompliant('#ffffff', 'AAA'))

  const handleApplyCustom = () => {
    applyTheme(customColor())
  }

  return (
    <div class="app">
      <header>
        <div class="header-content">
          <h1>@ldesign/color-solid 演示</h1>
          <p>Solid.js 框架的主题管理解决方案</p>
        </div>
        <div class="header-controls">
          <ThemePicker showSearch showCustom />
          <ThemeModeSwitcher />
        </div>
      </header>

      <main>
        <Show when={!isLoading()} fallback={<div class="loading">加载中...</div>}>
          <section class="demo-section">
            <h2>当前主题信息</h2>
            <div class="info-panel">
              <div class="info-item">
                <label>主题名称:</label>
                <span>{themeName() || '自定义'}</span>
              </div>
              <div class="info-item">
                <label>主题色:</label>
                <span class="color-box" style={{ 'background-color': primaryColor() }}>
                  {primaryColor()}
                </span>
              </div>
              <div class="info-item">
                <label>模式:</label>
                <span>{isDark() ? '深色模式' : '浅色模式'}</span>
              </div>
            </div>
          </section>

          <section class="demo-section">
            <h2>预设主题</h2>
            <div class="preset-grid">
              <For each={presets}>
                {(preset) => (
                  <button
                    class="preset-button"
                    classList={{ active: themeName() === preset.name }}
                    style={{ 'border-color': preset.color }}
                    onClick={() => applyPresetTheme(preset.name)}
                  >
                    <span class="preset-color" style={{ 'background-color': preset.color }} />
                    <span class="preset-label">{preset.label}</span>
                  </button>
                )}
              </For>
            </div>
          </section>

          <section class="demo-section">
            <h2>自定义颜色</h2>
            <div class="custom-color-input">
              <input
                value={customColor()}
                onInput={(e) => setCustomColor(e.currentTarget.value)}
                type="color"
              />
              <input
                value={customColor()}
                onInput={(e) => setCustomColor(e.currentTarget.value)}
                type="text"
                placeholder="#000000"
              />
              <button onClick={handleApplyCustom}>应用</button>
            </div>
          </section>

          <section class="demo-section">
            <h2>颜色操作</h2>
            <div class="color-operations">
              <div class="operation-item">
                <h3>原始颜色</h3>
                <div class="color-display" style={{ 'background-color': color().toHex() }}>
                  {color().toHex()}
                </div>
              </div>
              <div class="operation-item">
                <h3>变亮 20%</h3>
                <div class="color-display" style={{ 'background-color': lighterColor().toHex() }}>
                  {lighterColor().toHex()}
                </div>
              </div>
              <div class="operation-item">
                <h3>变暗 20%</h3>
                <div class="color-display" style={{ 'background-color': darkerColor().toHex() }}>
                  {darkerColor().toHex()}
                </div>
              </div>
              <div class="operation-item">
                <h3>饱和度 +30%</h3>
                <div class="color-display" style={{ 'background-color': saturatedColor().toHex() }}>
                  {saturatedColor().toHex()}
                </div>
              </div>
            </div>
          </section>

          <section class="demo-section">
            <h2>Tailwind 调色板</h2>
            <div class="palette-grid">
              <For each={Object.entries(palette())}>
                {([shade, colorValue]) => (
                  <div class="palette-item" style={{ 'background-color': colorValue }}>
                    <div class="palette-shade">{shade}</div>
                    <div class="palette-color">{colorValue}</div>
                  </div>
                )}
              </For>
            </div>
          </section>

          <section class="demo-section">
            <h2>无障碍检查</h2>
            <div class="accessibility-check">
              <div class="check-item">
                <label>与白色对比度:</label>
                <span>{contrast().toFixed(2)}</span>
              </div>
              <div class="check-item">
                <label>WCAG AA 合规:</label>
                <span classList={{ pass: isAA(), fail: !isAA() }}>
                  {isAA() ? '✅ 通过' : '❌ 未通过'}
                </span>
              </div>
              <div class="check-item">
                <label>WCAG AAA 合规:</label>
                <span classList={{ pass: isAAA(), fail: !isAAA() }}>
                  {isAAA() ? '✅ 通过' : '❌ 未通过'}
                </span>
              </div>
            </div>
          </section>

          <section class="demo-section">
            <h2>主题状态 (Debug)</h2>
            <pre class="debug-panel">{JSON.stringify(currentTheme(), null, 2)}</pre>
          </section>
        </Show>
      </main>
    </div>
  )
}

