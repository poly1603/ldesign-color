import { Component, inject, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ThemeService, ThemePickerComponent, ThemeModeSwitcherComponent } from '@ldesign/color-angular'
import { Color, generateTailwindPalette } from '@ldesign/color-core'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemePickerComponent, ThemeModeSwitcherComponent],
  template: `
    <div class="app">
      <header>
        <div class="header-content">
          <h1>@ldesign/color-angular 演示</h1>
          <p>Angular 框架的主题管理解决方案</p>
        </div>
        <div class="header-controls">
          <ld-theme-picker [showSearch]="true" [showCustom]="true" />
          <ld-theme-mode-switcher [defaultMode]="'system'" />
        </div>
      </header>

      <main>
        @if (themeService.isLoading()) {
          <div class="loading">加载中...</div>
        }

        <section class="demo-section">
          <h2>当前主题信息</h2>
          <div class="info-panel">
            <div class="info-item">
              <label>主题名称:</label>
              <span>{{ themeService.themeName() || '自定义' }}</span>
            </div>
            <div class="info-item">
              <label>主题色:</label>
              <span class="color-box" [style.backgroundColor]="themeService.primaryColor()">
                {{ themeService.primaryColor() }}
              </span>
            </div>
            <div class="info-item">
              <label>模式:</label>
              <span>{{ themeService.isDark() ? '深色模式' : '浅色模式' }}</span>
            </div>
          </div>
        </section>

        <section class="demo-section">
          <h2>预设主题</h2>
          <div class="preset-grid">
            @for (preset of themeService.presets(); track preset.name) {
              <button
                class="preset-button"
                [class.active]="themeService.themeName() === preset.name"
                [style.borderColor]="preset.color"
                (click)="handlePresetTheme(preset.name)"
              >
                <span class="preset-color" [style.backgroundColor]="preset.color"></span>
                <span class="preset-label">{{ preset.label }}</span>
              </button>
            }
          </div>
        </section>

        <section class="demo-section">
          <h2>自定义颜色</h2>
          <div class="custom-color-input">
            <input [(ngModel)]="customColor" type="color" />
            <input [(ngModel)]="customColor" type="text" placeholder="#000000" />
            <button (click)="handleApplyCustom()">应用</button>
          </div>
        </section>

        <section class="demo-section">
          <h2>颜色操作</h2>
          <div class="color-operations">
            <div class="operation-item">
              <h3>原始颜色</h3>
              <div class="color-display" [style.backgroundColor]="color().toHex()">
                {{ color().toHex() }}
              </div>
            </div>
            <div class="operation-item">
              <h3>变亮 20%</h3>
              <div class="color-display" [style.backgroundColor]="lighterColor().toHex()">
                {{ lighterColor().toHex() }}
              </div>
            </div>
            <div class="operation-item">
              <h3>变暗 20%</h3>
              <div class="color-display" [style.backgroundColor]="darkerColor().toHex()">
                {{ darkerColor().toHex() }}
              </div>
            </div>
            <div class="operation-item">
              <h3>饱和度 +30%</h3>
              <div class="color-display" [style.backgroundColor]="saturatedColor().toHex()">
                {{ saturatedColor().toHex() }}
              </div>
            </div>
          </div>
        </section>

        <section class="demo-section">
          <h2>Tailwind 调色板</h2>
          <div class="palette-grid">
            @for (item of paletteArray(); track item.shade) {
              <div class="palette-item" [style.backgroundColor]="item.color">
                <div class="palette-shade">{{ item.shade }}</div>
                <div class="palette-color">{{ item.color }}</div>
              </div>
            }
          </div>
        </section>

        <section class="demo-section">
          <h2>无障碍检查</h2>
          <div class="accessibility-check">
            <div class="check-item">
              <label>与白色对比度:</label>
              <span>{{ contrast().toFixed(2) }}</span>
            </div>
            <div class="check-item">
              <label>WCAG AA 合规:</label>
              <span [class.pass]="isAA()" [class.fail]="!isAA()">
                {{ isAA() ? '✅ 通过' : '❌ 未通过' }}
              </span>
            </div>
            <div class="check-item">
              <label>WCAG AAA 合规:</label>
              <span [class.pass]="isAAA()" [class.fail]="!isAAA()">
                {{ isAAA() ? '✅ 通过' : '❌ 未通过' }}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  themeService = inject(ThemeService)

  customColor = '#1890ff'

  // Computed values
  palette = computed(() => generateTailwindPalette(this.themeService.primaryColor() || '#1890ff'))

  paletteArray = computed(() => {
    const p = this.palette()
    return Object.entries(p).map(([shade, color]) => ({ shade, color }))
  })

  color = computed(() => new Color(this.themeService.primaryColor() || '#1890ff'))
  lighterColor = computed(() => this.color().lighten(20))
  darkerColor = computed(() => this.color().darken(20))
  saturatedColor = computed(() => this.color().saturate(30))

  whiteColor = new Color('#ffffff')
  contrast = computed(() => this.color().contrast(this.whiteColor))
  isAA = computed(() => this.color().isWCAGCompliant('#ffffff', 'AA'))
  isAAA = computed(() => this.color().isWCAGCompliant('#ffffff', 'AAA'))

  handleApplyCustom() {
    this.themeService.applyTheme(this.customColor)
  }

  handlePresetTheme(presetName: string) {
    this.themeService.applyPresetTheme(presetName)
  }
}

