/**
 * @ldesign/color - CSS Variables Generation with Theme Support
 *
 * Functions for generating CSS custom properties with light/dark mode support
 */
import type { ThemePalettes } from './darkMode';
export type { ThemePalettes } from './darkMode';
/**
 * Generate complete CSS with both light and dark mode variables
 */
export declare function generateThemedCssVariables(palettes: ThemePalettes): string;
/**
 * Generate CSS variables with semantic color aliases
 */
export declare function generateSemanticCssVariables(palettes: ThemePalettes): string;
/**
 * Inject CSS variables into the document head
 */
export declare function injectThemedCssVariables(palettes: ThemePalettes, includeSemantics?: boolean): void;
/**
 * Toggle theme mode on the root element
 */
export declare function setThemeMode(mode: 'light' | 'dark'): void;
/**
 * Get current theme mode
 */
export declare function getThemeMode(): 'light' | 'dark';
/**
 * Toggle between light and dark mode
 */
export declare function toggleThemeMode(): 'light' | 'dark';
/**
 * Initialize theme mode based on system preference
 */
export declare function initThemeMode(): void;
/**
 * Save theme mode preference
 */
export declare function saveThemeMode(mode: 'light' | 'dark'): void;
