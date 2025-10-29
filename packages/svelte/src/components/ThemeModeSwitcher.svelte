<script lang="ts">
  /**
   * ThemeModeSwitcher - Svelte component for theme mode switching
   */
  import { onMount } from 'svelte'
  import { writable, derived } from 'svelte/store'

  export type ThemeMode = 'light' | 'dark' | 'system'

  // Props
  export let defaultMode: ThemeMode = 'system'
  export let storageKey = 'ld-theme-mode'

  // Events
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher<{
    change: ThemeMode
  }>()

  // State
  const currentMode = writable<ThemeMode>(defaultMode)
  const systemPreference = writable<'light' | 'dark'>('light')
  let isOpen = false
  let dropdownRef: HTMLDivElement

  // Mode options
  const modes = [
    { value: 'light' as const, label: '浅色', icon: '☀️' },
    { value: 'dark' as const, label: '深色', icon: '🌙' },
    { value: 'system' as const, label: '跟随系统', icon: '💻' },
  ]

  // Derived values
  const effectiveTheme = derived(
    [currentMode, systemPreference],
    ([$mode, $systemPref]) => ($mode === 'system' ? $systemPref : $mode)
  )

  const currentModeConfig = derived(currentMode, $mode => {
    return modes.find(m => m.value === $mode) || modes[2]
  })

  // Apply theme to DOM
  function applyTheme(theme: 'light' | 'dark') {
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

  // Update system preference
  function updateSystemPreference() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPreference.set(mediaQuery.matches ? 'dark' : 'light')
  }

  // Toggle dropdown
  function toggleDropdown() {
    isOpen = !isOpen
  }

  // Change mode
  function changeMode(mode: ThemeMode) {
    currentMode.set(mode)
    localStorage.setItem(storageKey, mode)
    isOpen = false
    dispatch('change', mode)
  }

  // Handle click outside
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false
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
    } else {
      // @ts-ignore - Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Load saved mode from localStorage
    const savedMode = localStorage.getItem(storageKey) as ThemeMode | null
    if (savedMode && modes.some(m => m.value === savedMode)) {
      currentMode.set(savedMode)
    }

    // Add click outside listener
    document.addEventListener('click', handleClickOutside)

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // @ts-ignore - Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
      document.removeEventListener('click', handleClickOutside)
    }
  })

  // Apply theme when it changes
  $: applyTheme($effectiveTheme)
</script>

<div class="theme-mode-switcher" bind:this={dropdownRef}>
  <button class="theme-mode-button" on:click={toggleDropdown} title={$currentModeConfig.label}>
    <span class="theme-icon">{$currentModeConfig.icon}</span>
    <span class="theme-label">{$currentModeConfig.label}</span>
    <svg
      class="arrow"
      class:open={isOpen}
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

  {#if isOpen}
    <div class="theme-dropdown">
      {#each modes as mode}
        {@const isActive = $currentMode === mode.value}
        <button class="theme-option" class:active={isActive} on:click={() => changeMode(mode.value)}>
          <span class="option-icon">{mode.icon}</span>
          <span class="option-label">{mode.label}</span>
          {#if isActive}
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
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .theme-mode-switcher {
    position: relative;
    display: inline-block;
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
  :global([theme-mode='dark']) .theme-mode-button {
    background: var(--color-bg-component, #1f1f1f);
    border-color: var(--color-border, #434343);
    color: var(--color-text-primary, #ffffff);
  }

  :global([theme-mode='dark']) .theme-mode-button:hover {
    background: var(--color-bg-component-hover, #2a2a2a);
  }

  :global([theme-mode='dark']) .theme-dropdown {
    background: var(--color-bg-container, #141414);
    border-color: var(--color-border, #434343);
  }

  :global([theme-mode='dark']) .theme-option {
    color: var(--color-text-primary, #ffffff);
  }

  :global([theme-mode='dark']) .theme-option:hover {
    background: var(--color-bg-component, #1f1f1f);
  }

  :global([theme-mode='dark']) .theme-option.active {
    background: var(--color-primary-light, #002766);
  }
</style>


