/**
 * @ldesign/color - Plugin System
 *
 * Color theme plugin for Vue 3 applications
 */
import type { App, ComputedRef, Ref } from 'vue';
import type { ColorLocale } from '../locales';
import { type PresetTheme } from '../themes/presets';
import { ThemeManager, type ThemeOptions, type ThemeState } from '../themes/themeManager';
/**
 * Color plugin configuration options
 */
export interface ColorPluginOptions {
    /**
     * 语言设置 - 支持 string �?Ref<string>
     * 如果传入 Ref，将直接使用（共享模式）
     * 如果传入 string 或不传，将创建新�?Ref（独立模式）
     */
    locale?: string | Ref<string>;
    /**
     * CSS variable prefix
     * @default 'ld'
     */
    prefix?: string;
    /**
     * Storage key for theme persistence
     * @default 'ldesign-theme'
     */
    storageKey?: string;
    /**
     * Enable theme persistence
     * @default true
     */
    persistence?: boolean;
    /**
     * Storage type
     * @default 'localStorage'
     */
    storageType?: 'localStorage' | 'sessionStorage' | 'custom';
    /**
     * Custom storage adapter
     */
    storage?: {
        getItem: (key: string) => string | null | Promise<string | null>;
        setItem: (key: string, value: string) => void | Promise<void>;
        removeItem: (key: string) => void | Promise<void>;
    };
    /**
     * Preset themes
     * Pass an array to customize available themes
     * Pass 'all' to use all built-in themes
     * @default 'all'
     */
    presets?: PresetTheme[] | 'all';
    /**
     * Disabled preset theme names
     * Only works when presets is 'all'
     */
    disabledPresets?: string[];
    /**
     * Custom themes to add
     */
    customThemes?: PresetTheme[];
    /**
     * Auto-apply theme on initialization
     * @default true
     */
    autoApply?: boolean;
    /**
     * Default theme to apply
     * Can be a theme name or color hex
     */
    defaultTheme?: string;
    /**
     * Include semantic color variables
     * @default true
     */
    includeSemantics?: boolean;
    /**
     * Include gray scale
     * @default true
     */
    includeGrays?: boolean;
    /**
     * Hooks
     */
    hooks?: {
        /**
         * Called before theme change
         * Return false to cancel the change
         */
        beforeChange?: (newTheme: ThemeState, oldTheme: ThemeState | null) => boolean | Promise<boolean>;
        /**
         * Called after theme change
         */
        afterChange?: (theme: ThemeState) => void | Promise<void>;
        /**
         * Called when theme is loaded from storage
         */
        onLoad?: (theme: ThemeState) => void | Promise<void>;
        /**
         * Called when theme is saved to storage
         */
        onSave?: (theme: ThemeState) => void | Promise<void>;
        /**
         * Called on error
         */
        onError?: (error: Error) => void;
    };
    /**
     * Custom color name mappings
     */
    nameMap?: Record<string, string>;
}
/**
 * Color plugin instance
 */
export interface ColorPlugin {
    /**
     * Theme manager instance
     */
    manager: ThemeManager;
    /**
     * Available preset themes
     */
    presets: PresetTheme[];
    /**
     * Plugin options
     */
    options: Required<Omit<ColorPluginOptions, 'storage' | 'hooks' | 'nameMap'>> & {
        storage?: ColorPluginOptions['storage'];
        hooks?: ColorPluginOptions['hooks'];
        nameMap?: ColorPluginOptions['nameMap'];
    };
    /**
     * Current locale (reactive)
     */
    currentLocale: Ref<string>;
    /**
     * Current locale messages (computed)
     */
    localeMessages: ComputedRef<ColorLocale>;
    /**
     * Apply a theme
     */
    applyTheme: (colorOrName: string, options?: ThemeOptions) => Promise<ThemeState>;
    /**
     * Apply a preset theme
     */
    applyPresetTheme: (name: string, options?: ThemeOptions) => Promise<ThemeState>;
    /**
     * Get current theme
     */
    getCurrentTheme: () => ThemeState | null;
    /**
     * Listen to theme changes
     */
    onChange: (listener: (theme: ThemeState) => void) => () => void;
    /**
     * Add a custom theme
     */
    addCustomTheme: (theme: PresetTheme) => void;
    /**
     * Remove a custom theme
     */
    removeCustomTheme: (name: string) => void;
    /**
     * Get sorted presets (by order field)
     */
    getSortedPresets: () => PresetTheme[];
    /**
     * Cleanup resources
     */
    destroy?: () => void;
    /**
     * Install the plugin
     */
    install: (app: App) => void;
}
/**
 * Symbol for plugin injection
 */
export declare const ColorPluginSymbol: unique symbol;
/**
 * Create color plugin
 */
export declare function createColorPlugin(options?: ColorPluginOptions): ColorPlugin;
/**
 * Default export
 */
export default createColorPlugin;
