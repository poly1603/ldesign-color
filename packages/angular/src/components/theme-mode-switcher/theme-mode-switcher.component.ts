/**
 * ThemeModeSwitcher - Angular component for theme mode switching
 */

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeModeOption {
  value: ThemeMode
  label: string
  icon: string
}

const modes: ThemeModeOption[] = [
  { value: 'light', label: '浅色', icon: '☀️' },
  { value: 'dark', label: '深色', icon: '🌙' },
  { value: 'system', label: '跟随系统', icon: '💻' },
]

@Component({
  selector: 'ld-theme-mode-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-mode-switcher">
      <button
        class="theme-mode-button"
        (click)="toggleDropdown()"
        [title]="currentModeConfig().label"
      >
        <span class="theme-icon">{{ currentModeConfig().icon }}</span>
        <span class="theme-label">{{ currentModeConfig().label }}</span>
        <svg
          class="arrow"
          [class.open]="isOpen()"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      @if (isOpen()) {
        <div class="theme-dropdown">
          @for (mode of modes; track mode.value) {
            <button
              class="theme-option"
              [class.active]="currentMode() === mode.value"
              (click)="changeMode(mode.value)"
            >
              <span class="option-icon">{{ mode.icon }}</span>
              <span class="option-label">{{ mode.label }}</span>
              @if (currentMode() === mode.value) {
                <svg
                  class="check-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .theme-mode-switcher {
      position: relative;
    }

    .theme-mode-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--color-bg-container, #ffffff);
      border: 1px solid var(--color-border-light, #e8e8e8);
      border-radius: 8px;
      color: var(--color-text-primary, #000000);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .theme-mode-button:hover {
      background: var(--color-bg-component-hover, #f5f5f5);
      border-color: var(--color-border, #d9d9d9);
    }

    .theme-icon {
      font-size: 18px;
      line-height: 1;
    }

    .theme-label {
      white-space: nowrap;
    }

    .arrow {
      transition: transform 0.2s ease;
      color: #666;
    }

    .arrow.open {
      transform: rotate(180deg);
    }

    .theme-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: var(--color-bg-container, #ffffff);
      border: 1px solid var(--color-border-lighter, #e8e8e8);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      z-index: 1000;
      min-width: 160px;
      padding: 4px;
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 16px;
      background: none;
      border: none;
      border-radius: 6px;
      color: var(--color-text-primary, #000000);
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
      text-align: left;
    }

    .theme-option:hover {
      background: var(--color-bg-component-hover, #f5f5f5);
    }

    .theme-option.active {
      background: var(--color-primary-lighter, #e6f7ff);
      color: var(--color-primary-default, #1890ff);
      font-weight: 600;
    }

    .option-icon {
      font-size: 18px;
      line-height: 1;
    }

    .option-label {
      flex: 1;
    }

    .check-icon {
      color: var(--color-primary-default, #1890ff);
    }
  `],
})
export class ThemeModeSwitcherComponent implements OnInit, OnDestroy {
  @Input() defaultMode: ThemeMode = 'system'
  @Input() storageKey = 'ld-theme-mode'
  @Output() modeChange = new EventEmitter<ThemeMode>()

  // State
  currentMode = signal<ThemeMode>('system')
  systemPreference = signal<'light' | 'dark'>('light')
  isOpen = signal(false)

  modes = modes

  // Computed
  effectiveTheme = computed(() =>
    this.currentMode() === 'system' ? this.systemPreference() : this.currentMode()
  )

  currentModeConfig = computed(() => {
    return modes.find(m => m.value === this.currentMode()) || modes[2]
  })

  private mediaQuery?: MediaQueryList

  ngOnInit() {
    // Initialize system preference
    this.updateSystemPreference()

    // Listen to system theme changes
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => this.updateSystemPreference()

    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', handleChange)
    }

    // Load saved mode
    const savedMode = localStorage.getItem(this.storageKey) as ThemeMode | null
    if (savedMode && modes.some(m => m.value === savedMode)) {
      this.currentMode.set(savedMode)
    } else if (this.defaultMode) {
      this.currentMode.set(this.defaultMode)
    }

    // Apply initial theme
    this.applyTheme(this.effectiveTheme())

    // Watch for changes
    this.watchEffectiveTheme()
  }

  ngOnDestroy() {
    if (this.mediaQuery && this.mediaQuery.removeEventListener) {
      this.mediaQuery.removeEventListener('change', () => this.updateSystemPreference())
    }
  }

  private watchEffectiveTheme() {
    // Use effect to watch effectiveTheme changes
    let previousTheme = this.effectiveTheme()
    setInterval(() => {
      const currentTheme = this.effectiveTheme()
      if (currentTheme !== previousTheme) {
        this.applyTheme(currentTheme)
        previousTheme = currentTheme
      }
    }, 100)
  }

  private updateSystemPreference() {
    if (this.mediaQuery) {
      this.systemPreference.set(this.mediaQuery.matches ? 'dark' : 'light')
    }
  }

  private applyTheme(theme: 'light' | 'dark') {
    const root = document.documentElement

    if (theme === 'dark') {
      root.setAttribute('theme-mode', 'dark')
    } else {
      root.removeAttribute('theme-mode')
    }

    root.setAttribute('data-theme-mode', theme)
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen())
  }

  changeMode(mode: ThemeMode) {
    this.currentMode.set(mode)
    localStorage.setItem(this.storageKey, mode)
    this.isOpen.set(false)
    this.modeChange.emit(mode)
  }
}

