<script lang="ts">
  /**
   * ThemePicker - Svelte component for theme selection
   */
  import type { PresetTheme } from '@ldesign/color-core/themes/presets'
  import { onMount, onDestroy } from 'svelte'
  import { useTheme } from '../stores/useTheme'

  // Props
  export let value: string | undefined = undefined
  export let showArrow = true
  export let showSearch = false
  export let showCustom = false
  export let prefix = 'ld'
  export let storageKey: string | undefined = undefined

  // Events
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher<{
    change: { value: string; preset?: PresetTheme }
  }>()

  // Theme management
  const theme = useTheme({ prefix, storageKey })
  const { currentTheme, presets, primaryColor, themeName, applyTheme, applyPresetTheme, restoreTheme } = theme

  // Local state
  let isOpen = false
  let searchQuery = ''
  let customColor = '#1890ff'
  let pickerRef: HTMLDivElement
  let dropdownStyle = ''

  // Current color
  $: currentColor = value || $primaryColor || '#1890ff'

  // Current label
  $: currentLabel = (() => {
    const preset = $presets.find(p => p.name === $themeName)
    return preset?.label || '主题色'
  })()

  // Visible presets
  $: visiblePresets = (() => {
    const list: PresetTheme[] = [...$presets]
    const inPresets = list.some(p => p.color.toLowerCase() === (currentColor || '').toLowerCase())
    if (!inPresets) {
      list.unshift({ name: 'custom', label: '自定义', color: currentColor, custom: true })
    }
    return list
  })()

  // Filtered presets
  $: filteredPresets = (() => {
    if (!searchQuery) return visiblePresets
    const query = searchQuery.toLowerCase()
    return visiblePresets.filter(preset =>
      preset.label.toLowerCase().includes(query) ||
      preset.name.toLowerCase().includes(query) ||
      preset.color.toLowerCase().includes(query)
    )
  })()

  // Update dropdown position
  function updateDropdownPosition() {
    if (!pickerRef) return

    const rect = pickerRef.getBoundingClientRect()
    const dropdownHeight = 400
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const desiredWidth = Math.min(320, Math.max(240, viewportWidth - 16))

    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    let top = rect.bottom + 4
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      top = rect.top - dropdownHeight - 4
    }
    top = Math.max(8, Math.min(top, viewportHeight - 8 - dropdownHeight))

    let left = rect.left
    const maxLeft = viewportWidth - 8 - desiredWidth
    left = Math.max(8, Math.min(left, Math.max(8, maxLeft)))

    dropdownStyle = `position: fixed; top: ${top}px; left: ${left}px; width: ${desiredWidth}px; z-index: 9999;`
  }

  // Toggle dropdown
  function toggleDropdown() {
    isOpen = !isOpen
    if (isOpen) {
      setTimeout(() => updateDropdownPosition(), 0)
    }
  }

  // Select preset
  async function selectPreset(preset: PresetTheme) {
    await applyPresetTheme(preset.name)
    dispatch('change', { value: preset.color, preset })
    isOpen = false
  }

  // Handle custom color
  async function handleCustomColor() {
    if (customColor) {
      await applyTheme(customColor)
      dispatch('change', { value: customColor })
      isOpen = false
    }
  }

  // Handle click outside
  function handleClickOutside(event: MouseEvent) {
    if (pickerRef && !pickerRef.contains(event.target as Node)) {
      isOpen = false
    }
  }

  // Handle resize
  function handleResize() {
    if (isOpen) {
      updateDropdownPosition()
    }
  }

  onMount(() => {
    restoreTheme()
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
  })

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleResize)
    theme.destroy()
  })

  // Watch value changes
  $: if (value && value !== $primaryColor) {
    applyTheme(value)
  }
</script>

<div class="ld-theme-picker" bind:this={pickerRef}>
  <button
    class="ld-theme-picker__trigger"
    on:click={toggleDropdown}
    style="background-color: {currentColor}"
    title={currentLabel}
  >
    <span class="ld-theme-picker__color" style="background-color: {currentColor}" />
    {#if showArrow}
      <svg
        class="ld-theme-picker__arrow"
        class:is-open={isOpen}
        width="12"
        height="12"
        viewBox="0 0 12 12"
      >
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" fill="none" />
      </svg>
    {/if}
  </button>

  {#if isOpen}
    <div class="ld-theme-picker__dropdown" style={dropdownStyle} on:click|stopPropagation>
      {#if showSearch}
        <div class="ld-theme-picker__search">
          <input
            bind:value={searchQuery}
            type="text"
            placeholder="搜索颜色..."
            class="ld-theme-picker__search-input"
          />
        </div>
      {/if}

      <div class="ld-theme-picker__content">
        {#if showCustom}
          <div class="ld-theme-picker__custom">
            <label class="ld-theme-picker__label">自定义颜色</label>
            <div class="ld-theme-picker__custom-input">
              <input bind:value={customColor} type="color" class="ld-theme-picker__color-input" />
              <input
                bind:value={customColor}
                type="text"
                placeholder="#000000"
                class="ld-theme-picker__hex-input"
                on:keyup={(e) => e.key === 'Enter' && handleCustomColor()}
              />
              <button class="ld-theme-picker__apply-btn" on:click={handleCustomColor}>应用</button>
            </div>
          </div>
        {/if}

        <div class="ld-theme-picker__presets">
          <label class="ld-theme-picker__label">选择主题色</label>
          <div class="ld-theme-picker__grid">
            {#each filteredPresets as preset (preset.name + '-' + preset.color)}
              <div
                class="ld-theme-picker__preset"
                class:is-active={preset.name === $themeName || (!$themeName && preset.custom)}
                on:click={() => selectPreset(preset)}
              >
                <span
                  class="ld-theme-picker__preset-color"
                  style="background-color: {preset.color}"
                  title={preset.label}
                >
                  {#if preset.name === $themeName || (!$themeName && preset.custom)}
                    <svg class="ld-theme-picker__check" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M3 8L6 11L13 4" stroke="white" stroke-width="2" fill="none" />
                    </svg>
                  {/if}
                </span>
                <span class="ld-theme-picker__preset-label">
                  {preset.custom ? '自定义' : preset.label}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .ld-theme-picker {
    position: relative;
    display: inline-block;
  }

  .ld-theme-picker *,
  .ld-theme-picker *::before,
  .ld-theme-picker *::after {
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
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
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
    transition: border-color 0.3s;
  }

  .ld-theme-picker__search-input:focus {
    border-color: #40a9ff;
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

  .ld-theme-picker__hex-input:focus {
    border-color: #40a9ff;
  }

  .ld-theme-picker__apply-btn {
    padding: 6px 12px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
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
    transition: all 0.2s;
  }

  .ld-theme-picker__preset:hover .ld-theme-picker__preset-color {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }

  .ld-theme-picker__preset.is-active .ld-theme-picker__preset-color {
    border: 2px solid #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);
  }

  .ld-theme-picker__check {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  .ld-theme-picker__preset-label {
    font-size: 11px;
    color: #595959;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  @media (max-width: 360px) {
    .ld-theme-picker__grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>


