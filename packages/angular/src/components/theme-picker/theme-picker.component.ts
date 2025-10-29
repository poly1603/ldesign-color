/**
 * ThemePicker - Angular component for theme selection
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import type { PresetTheme } from '@ldesign/color-core/themes/presets'
import { ThemeService } from '../../services/theme.service'

@Component({
  selector: 'ld-theme-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ld-theme-picker">
      <button
        class="ld-theme-picker__trigger"
        (click)="toggleDropdown()"
        [style.backgroundColor]="currentColor()"
        [title]="currentLabel()"
      >
        <span class="ld-theme-picker__color" [style.backgroundColor]="currentColor()"></span>
        @if (showArrow) {
          <svg
            class="ld-theme-picker__arrow"
            [class.is-open]="isOpen()"
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
        }
      </button>

      @if (isOpen()) {
        <div class="ld-theme-picker__dropdown" [style]="dropdownStyle()" (click)="$event.stopPropagation()">
          @if (showSearch) {
            <div class="ld-theme-picker__search">
              <input
                [(ngModel)]="searchQuery"
                type="text"
                placeholder="搜索颜色..."
                class="ld-theme-picker__search-input"
              />
            </div>
          }

          <div class="ld-theme-picker__content">
            @if (showCustom) {
              <div class="ld-theme-picker__custom">
                <label class="ld-theme-picker__label">自定义颜色</label>
                <div class="ld-theme-picker__custom-input">
                  <input [(ngModel)]="customColor" type="color" class="ld-theme-picker__color-input" />
                  <input
                    [(ngModel)]="customColor"
                    type="text"
                    placeholder="#000000"
                    class="ld-theme-picker__hex-input"
                    (keyup.enter)="handleCustomColor()"
                  />
                  <button class="ld-theme-picker__apply-btn" (click)="handleCustomColor()">
                    应用
                  </button>
                </div>
              </div>
            }

            <div class="ld-theme-picker__presets">
              <label class="ld-theme-picker__label">选择主题色</label>
              <div class="ld-theme-picker__grid">
                @for (preset of filteredPresets(); track preset.name + '-' + preset.color) {
                  <div
                    class="ld-theme-picker__preset"
                    [class.is-active]="preset.name === themeService.themeName() || (!themeService.themeName() && preset.custom)"
                    (click)="selectPreset(preset)"
                  >
                    <span
                      class="ld-theme-picker__preset-color"
                      [style.backgroundColor]="preset.color"
                      [title]="preset.label"
                    >
                      @if (preset.name === themeService.themeName() || (!themeService.themeName() && preset.custom)) {
                        <svg class="ld-theme-picker__check" width="16" height="16" viewBox="0 0 16 16">
                          <path d="M3 8L6 11L13 4" stroke="white" stroke-width="2" fill="none" />
                        </svg>
                      }
                    </span>
                    <span class="ld-theme-picker__preset-label">
                      {{ preset.custom ? '自定义' : preset.label }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ld-theme-picker {
      position: relative;
      display: inline-block;
    }

    .ld-theme-picker *, .ld-theme-picker *::before, .ld-theme-picker *::after {
      box-sizing: border-box;
    }

    .ld-theme-picker__trigger {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 14px;
    }

    .ld-theme-picker__trigger:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .ld-theme-picker__color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .ld-theme-picker__arrow {
      transition: transform 0.3s;
      color: white;
    }

    .ld-theme-picker__arrow.is-open {
      transform: rotate(180deg);
    }

    .ld-theme-picker__dropdown {
      position: fixed;
      background: white;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      z-index: 9999;
    }

    .ld-theme-picker__search {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .ld-theme-picker__search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
    }

    .ld-theme-picker__content {
      max-height: 360px;
      overflow-y: auto;
    }

    .ld-theme-picker__custom {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .ld-theme-picker__label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      color: #595959;
      font-weight: 500;
    }

    .ld-theme-picker__custom-input {
      display: flex;
      gap: 8px;
    }

    .ld-theme-picker__color-input {
      width: 40px;
      height: 32px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
    }

    .ld-theme-picker__hex-input {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
    }

    .ld-theme-picker__apply-btn {
      padding: 6px 12px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }

    .ld-theme-picker__apply-btn:hover {
      background: #40a9ff;
    }

    .ld-theme-picker__presets {
      padding: 12px;
    }

    .ld-theme-picker__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .ld-theme-picker__preset {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 6px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }

    .ld-theme-picker__preset:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
    }

    .ld-theme-picker__preset.is-active {
      background: #e6f7ff;
      border-color: #91d5ff;
    }

    .ld-theme-picker__preset-color {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    }

    .ld-theme-picker__preset-label {
      font-size: 11px;
      color: #595959;
      text-align: center;
      width: 100%;
    }
  `],
})
export class ThemePickerComponent implements OnInit, OnDestroy {
  @Input() value?: string
  @Input() showArrow = true
  @Input() showSearch = false
  @Input() showCustom = false
  @Input() prefix = 'ld'
  @Input() storageKey?: string

  @Output() changeEvent = new EventEmitter<{ value: string; preset?: PresetTheme }>()

  themeService = inject(ThemeService)

  // Local state
  isOpen = signal(false)
  searchQuery = ''
  customColor = '#1890ff'
  dropdownStyle = signal('')

  // Current color
  currentColor = computed(() => this.value || this.themeService.primaryColor() || '#1890ff')

  // Current label
  currentLabel = computed(() => {
    const preset = this.themeService.presets().find(p => p.name === this.themeService.themeName())
    return preset?.label || '主题色'
  })

  // Visible presets
  visiblePresets = computed(() => {
    const list: PresetTheme[] = [...this.themeService.presets()]
    const inPresets = list.some(p => p.color.toLowerCase() === (this.currentColor() || '').toLowerCase())
    if (!inPresets) {
      list.unshift({ name: 'custom', label: '自定义', color: this.currentColor(), custom: true })
    }
    return list
  })

  // Filtered presets
  filteredPresets = computed(() => {
    if (!this.searchQuery) return this.visiblePresets()
    const query = this.searchQuery.toLowerCase()
    return this.visiblePresets().filter(preset =>
      preset.label.toLowerCase().includes(query) ||
      preset.name.toLowerCase().includes(query) ||
      preset.color.toLowerCase().includes(query)
    )
  })

  ngOnInit() {
    this.themeService.restoreTheme()
  }

  ngOnDestroy() {
    // Cleanup handled by DestroyRef in service
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen())
  }

  async selectPreset(preset: PresetTheme) {
    await this.themeService.applyPresetTheme(preset.name)
    this.changeEvent.emit({ value: preset.color, preset })
    this.isOpen.set(false)
  }

  async handleCustomColor() {
    if (this.customColor) {
      await this.themeService.applyTheme(this.customColor)
      this.changeEvent.emit({ value: this.customColor })
      this.isOpen.set(false)
    }
  }
}

