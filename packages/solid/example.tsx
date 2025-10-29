/**
 * @ldesign/color-solid 使用示例
 * 
 * 这个示例展示了如何在 Solid.js 应用中使用颜色主题管理
 */

import { For, Show } from 'solid-js'
import { useTheme, ThemePicker, ThemeModeSwitcher } from './src/index'
import type { Component } from 'solid-js'

const App: Component = () => {
  // 初始化主题管理
  const {
    currentTheme,
    presets,
    isLoading,
    primaryColor,
    themeName,
    isDark,
    applyTheme,
    applyPresetTheme,
  } = useTheme({
    prefix: 'my-app',
    storageKey: 'my-app-theme',
    immediate: true,
  })

  // 应用自定义颜色
  const handleCustomColor = () => {
    applyTheme('#1890ff')
  }

  // 应用预设主题
  const handlePresetTheme = (presetName: string) => {
    applyPresetTheme(presetName)
  }

  // 主题变更回调
  const handleThemeChange = (value: string, preset?: any) => {
    console.log('主题已更改:', value, preset)
  }

  // 模式变更回调
  const handleModeChange = (mode: 'light' | 'dark' | 'system') => {
    console.log('模式已更改:', mode)
  }

  return (
    <div class="app">
      <header>
        <h1>Solid.js 主题管理示例</h1>
        <div class="controls">
          <ThemePicker
            showSearch={true}
            showCustom={true}
            showArrow={true}
            onChange={handleThemeChange}
          />
          <ThemeModeSwitcher
            defaultMode="system"
            onModeChange={handleModeChange}
          />
        </div>
      </header>

      <main>
        <section class="info-panel">
          <h2>当前主题信息</h2>

          <Show when={!isLoading()} fallback={<p class="loading">加载中...</p>}>
            <div class="theme-info">
              <div class="info-item">
                <label>主题名称:</label>
                <span class="value">{themeName() || '自定义'}</span>
              </div>

              <div class="info-item">
                <label>主题色:</label>
                <span
                  class="color-preview"
                  style={{ 'background-color': primaryColor() }}
                >
                  {primaryColor()}
                </span>
              </div>

              <div class="info-item">
                <label>模式:</label>
                <span class="value">{isDark() ? '深色模式' : '浅色模式'}</span>
              </div>
            </div>
          </Show>
        </section>

        <section class="preset-panel">
          <h2>预设主题</h2>
          <div class="preset-grid">
            <For each={presets}>
              {(preset) => (
                <button
                  class="preset-button"
                  classList={{ active: themeName() === preset.name }}
                  onClick={() => handlePresetTheme(preset.name)}
                  style={{ 'border-color': preset.color }}
                >
                  <span
                    class="preset-color"
                    style={{ 'background-color': preset.color }}
                  />
                  <span class="preset-label">{preset.label}</span>
                </button>
              )}
            </For>
          </div>
        </section>

        <section class="demo-panel">
          <h2>主题效果演示</h2>
          <div class="demo-content">
            <button class="primary-button">主要按钮</button>
            <button class="secondary-button">次要按钮</button>
            <input type="text" placeholder="输入框" class="demo-input" />
            <div class="demo-card">
              <h3>卡片标题</h3>
              <p>这是一个使用主题色的卡片组件。</p>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .app {
          min-height: 100vh;
          background: var(--my-app-bg-color-page, #f5f5f5);
          color: var(--my-app-text-color-primary, #000000);
          transition: background 0.3s, color 0.3s;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: var(--my-app-bg-color-container, #ffffff);
          border-bottom: 1px solid var(--my-app-component-border, #e8e8e8);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--my-app-text-color-primary, #000000);
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        main {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--my-app-bg-color-container, #ffffff);
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        h2 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--my-app-text-color-primary, #000000);
        }

        .loading {
          color: var(--my-app-text-color-secondary, #666666);
          font-style: italic;
        }

        .theme-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .info-item label {
          font-weight: 500;
          color: var(--my-app-text-color-secondary, #666666);
          min-width: 100px;
        }

        .info-item .value {
          color: var(--my-app-text-color-primary, #000000);
        }

        .color-preview {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          color: white;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        }

        .preset-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--my-app-bg-color-component, #fafafa);
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-button:hover {
          background: var(--my-app-bg-color-component-hover, #f0f0f0);
          transform: translateY(-2px);
        }

        .preset-button.active {
          border-color: currentColor;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .preset-color {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .preset-label {
          font-size: 0.875rem;
          color: var(--my-app-text-color-primary, #000000);
        }

        .demo-content {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-start;
        }

        .primary-button {
          padding: 0.75rem 1.5rem;
          background: var(--my-app-brand-color, #1890ff);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s;
        }

        .primary-button:hover {
          background: var(--my-app-brand-color-hover, #40a9ff);
        }

        .secondary-button {
          padding: 0.75rem 1.5rem;
          background: var(--my-app-bg-color-component, #fafafa);
          color: var(--my-app-text-color-primary, #000000);
          border: 1px solid var(--my-app-component-border, #d9d9d9);
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .secondary-button:hover {
          border-color: var(--my-app-brand-color, #1890ff);
          color: var(--my-app-brand-color, #1890ff);
        }

        .demo-input {
          padding: 0.75rem 1rem;
          background: var(--my-app-bg-color-component, #ffffff);
          border: 1px solid var(--my-app-component-border, #d9d9d9);
          border-radius: 4px;
          font-size: 1rem;
          color: var(--my-app-text-color-primary, #000000);
          transition: border-color 0.3s;
        }

        .demo-input:focus {
          outline: none;
          border-color: var(--my-app-brand-color, #1890ff);
          box-shadow: 0 0 0 2px var(--my-app-brand-color-light, rgba(24, 144, 255, 0.2));
        }

        .demo-card {
          flex: 1;
          min-width: 250px;
          padding: 1.5rem;
          background: var(--my-app-bg-color-component, #fafafa);
          border: 1px solid var(--my-app-component-border, #e8e8e8);
          border-radius: 8px;
        }

        .demo-card h3 {
          margin: 0 0 0.5rem 0;
          color: var(--my-app-brand-color, #1890ff);
          font-size: 1.125rem;
        }

        .demo-card p {
          margin: 0;
          color: var(--my-app-text-color-secondary, #666666);
          line-height: 1.6;
        }

        /* 深色模式适配 */
        [theme-mode='dark'] .app {
          background: var(--my-app-bg-color-page, #000000);
        }
      `}</style>
    </div>
  )
}

export default App


