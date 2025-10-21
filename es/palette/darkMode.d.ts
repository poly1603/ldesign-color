/**
 * @ldesign/color - Dark Mode Palette Generation
 *
 * Functions for generating dark mode color palettes with proper contrast
 */
/**
 * Generate a dark mode version of a color scale
 * Dark mode inverts the lightness progression while maintaining hue and adjusting saturation
 */
export declare function generateDarkModeScale(lightScale: Record<string, string>): Record<string, string>;
/**
 * Generate a Tailwind-style dark mode palette
 * Uses specific mappings optimized for dark backgrounds
 */
export declare function generateTailwindDarkScale(baseColor: string): Record<string, string>;
/**
 * Generate dark mode gray scale
 * Pure grayscale optimized for dark backgrounds
 */
export declare function generateTailwindDarkGrayScale(): Record<string, string>;
/**
 * Generate semantic colors for dark mode
 */
export declare function generateDarkSemanticColors(primaryHex: string): {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    danger: Record<string, string>;
    info: Record<string, string>;
    gray: Record<string, string>;
};
/**
 * Generate a complete theme with both light and dark mode palettes
 */
export interface ThemePalettes {
    light: {
        primary: Record<string, string>;
        secondary: Record<string, string>;
        success: Record<string, string>;
        warning: Record<string, string>;
        danger: Record<string, string>;
        info: Record<string, string>;
        gray: Record<string, string>;
    };
    dark: {
        primary: Record<string, string>;
        secondary: Record<string, string>;
        success: Record<string, string>;
        warning: Record<string, string>;
        danger: Record<string, string>;
        info: Record<string, string>;
        gray: Record<string, string>;
    };
}
export declare function generateThemePalettes(primaryHex: string, options?: {
    preserveInput?: boolean;
}): ThemePalettes;
