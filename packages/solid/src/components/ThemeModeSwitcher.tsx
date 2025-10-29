/**
 * ThemeModeSwitcher - Solid.js component for theme mode switching
 */

import type { Component } from 'solid-js'
import { createEffect, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { For, Show } from 'solid-js'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeModeSwitcherProps {
  defaultMode?: ThemeMode
  storageKey?: string
  onModeChange?: (mode: ThemeMode) => void
  class?: string
}

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

export const ThemeModeSwitcher: Component<ThemeModeSwitcherProps> = (props) => {
  const storageKey = () => props.storageKey || 'ld-theme-mode'

  // State
  const [isOpen, setIsOpen] = createSignal(false)
  const [currentMode, setCurrentMode] = createSignal<ThemeMode>(props.defaultMode || 'system')
  const [systemPreference, setSystemPreference] = createSignal<'light' | 'dark'>('light')
  let dropdownRef: HTMLDivElement | undefined

  // Derived values
  const effectiveTheme = createMemo(() =>
    currentMode() === 'system' ? systemPreference() : currentMode()
  )

  const currentModeConfig = createMemo(() => {
    return modes.find(m => m.value === currentMode()) || modes[2]
  })

  // Apply theme to DOM
  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.setAttribute('theme-mode', 'dark')
    }
    else {
      root.removeAttribute('theme-mode')
    }

    root.setAttribute('data-theme-mode', theme)
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }

  // Update system preference
  const updateSystemPreference = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light')
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen())
  }

  // Change mode
  const changeMode = (mode: ThemeMode) => {
    setCurrentMode(mode)
    localStorage.setItem(storageKey(), mode)
    setIsOpen(false)
    props.onModeChange?.(mode)
  }

  // Handle click outside
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  onMount(() => {
    // Initialize system preference
    updateSystemPreference()

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => updateSystemPreference()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    }
    else {
      // @ts-ignore - Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Load saved mode from localStorage
    const savedMode = localStorage.getItem(storageKey()) as ThemeMode | null
    if (savedMode && modes.some(m => m.value === savedMode)) {
      setCurrentMode(savedMode)
    }

    // Add click outside listener
    if (isOpen()) {
      document.addEventListener('click', handleClickOutside)
    }

    onCleanup(() => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      }
      else {
        // @ts-ignore - Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
      document.removeEventListener('click', handleClickOutside)
    })
  })

  // Apply theme when it changes
  createEffect(() => {
    applyTheme(effectiveTheme())
  })

  // Watch isOpen to add/remove event listener
  createEffect(() => {
    if (isOpen()) {
      document.addEventListener('click', handleClickOutside)
    }
    else {
      document.removeEventListener('click', handleClickOutside)
    }
  })

  return (
    <div ref={dropdownRef} class={`theme-mode-switcher ${props.class || ''}`}>
      <button class="theme-mode-button" onClick={toggleDropdown} title={currentModeConfig().label}>
        <span class="theme-icon">{currentModeConfig().icon}</span>
        <span class="theme-label">{currentModeConfig().label}</span>
        <svg
          class="arrow"
          classList={{ open: isOpen() }}
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

      <Show when={isOpen()}>
        <div class="theme-dropdown">
          <For each={modes}>
            {(mode) => {
              const isActive = () => currentMode() === mode.value

              return (
                <button
                  class="theme-option"
                  classList={{ active: isActive() }}
                  onClick={() => changeMode(mode.value)}
                >
                  <span class="option-icon">{mode.icon}</span>
                  <span class="option-label">{mode.label}</span>
                  <Show when={isActive()}>
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
                  </Show>
                </button>
              )
            }}
          </For>
        </div>
      </Show>

      <style>{`
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

        /* Dark mode styles */
        [theme-mode='dark'] .theme-mode-button {
          background: var(--color-bg-component, #1f1f1f);
          border-color: var(--color-border, #434343);
          color: var(--color-text-primary, #ffffff);
        }

        [theme-mode='dark'] .theme-mode-button:hover {
          background: var(--color-bg-component-hover, #2a2a2a);
        }

        [theme-mode='dark'] .theme-dropdown {
          background: var(--color-bg-container, #141414);
          border-color: var(--color-border, #434343);
        }

        [theme-mode='dark'] .theme-option {
          color: var(--color-text-primary, #ffffff);
        }

        [theme-mode='dark'] .theme-option:hover {
          background: var(--color-bg-component, #1f1f1f);
        }

        [theme-mode='dark'] .theme-option.active {
          background: var(--color-primary-light, #002766);
        }
      `}</style>
    </div>
  )
}


