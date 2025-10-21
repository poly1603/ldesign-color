/**
 * @ldesign/color - Tailwind-style Palette Generation
 *
 * Generates color palettes using the exact algorithm from tailwindcss-palette-generator
 * This creates 12-level color scales by adjusting only lightness while preserving hue and saturation
 */
import type { ColorInput } from '../types';
/**
 * Default Tailwind shade configuration with optimized lightness values
 * These values are specifically chosen for optimal visual balance
 * Adjusted to prevent overly dark shades at the end
 */
export declare const TAILWIND_SHADES: {
    name: string;
    lightness: number;
}[];
/**
 * Generate a Tailwind-style color scale from a base color
 * Uses the exact algorithm from tailwindcss-palette-generator
 *
 * @param baseColor - The base color to generate shades from
 * @param preserve - Whether to preserve the original color at its closest shade
 * @returns Object with shade names as keys and hex colors as values
 */
export declare function generateTailwindScale(baseColor: ColorInput, preserve?: boolean): {
    [key: string]: string;
};
/**
 * Generate semantic colors (primary, success, warning, danger, info) with Tailwind scales
 * Colors are generated based on the primary color for better harmony
 */
export declare function generateTailwindSemanticColors(primaryColor: ColorInput): {
    primary: {
        [key: string]: string;
    };
    success: {
        [key: string]: string;
    };
    warning: {
        [key: string]: string;
    };
    danger: {
        [key: string]: string;
    };
    info: {
        [key: string]: string;
    };
};
/**
 * Generate pure gray scale (no tinting)
 * Provides 14 shades for more granular options
 */
export declare function generateTailwindGrayScale(): {
    [key: string]: string;
};
/**
 * Generate a complete Tailwind-style theme
 */
export declare function generateTailwindTheme(primaryColor: ColorInput, options?: {
    includeSemantics?: boolean;
    includeGrays?: boolean;
    preserveInput?: boolean;
}): {
    colors: {
        primary: {
            [key: string]: string;
        };
        success?: {
            [key: string]: string;
        };
        warning?: {
            [key: string]: string;
        };
        danger?: {
            [key: string]: string;
        };
        info?: {
            [key: string]: string;
        };
    };
    grays?: {
        [key: string]: string;
    };
};
/**
 * CSS Variable suffix format options
 */
export type CssVarSuffixFormat = 'tailwind' | 'numeric';
/**
 * Options for CSS variable generation
 */
export interface CssVarOptions {
    /** Prefix for CSS variable names (e.g., 'tw', 'app'). A dash will be automatically added after the prefix. Default is empty */
    prefix?: string;
    /** Suffix format: 'tailwind' for (50, 100, 200...), 'numeric' for (1, 2, 3...) */
    suffixFormat?: CssVarSuffixFormat;
    /** Custom name mappings for colors (e.g., { primary: 'brand', success: 'good' }) */
    nameMap?: {
        [key: string]: string;
    };
}
/**
 * Generate CSS variables from a Tailwind palette
 *
 * @param palette - Tailwind palette object
 * @param name - Color name (e.g., 'primary', 'success')
 * @param options - CSS variable generation options
 * @returns CSS variables as string
 */
export declare function generatePaletteCssVars(palette: {
    [key: string]: string;
}, name: string, options?: CssVarOptions): string;
/**
 * Generate CSS variables for a complete theme
 *
 * @param theme - Complete theme object with colors and grays
 * @param options - CSS variable generation options
 * @returns CSS variables as string
 */
export declare function generateThemeCssVars(theme: {
    colors: {
        [colorName: string]: {
            [shade: string]: string;
        };
    };
    grays?: {
        [shade: string]: string;
    };
}, options?: CssVarOptions): string;
/**
 * Insert CSS variables into document head
 *
 * @param cssVars - CSS variables string
 * @param id - Style element ID for updating existing styles
 */
export declare function insertCssVars(cssVars: string, id?: string): void;
/**
 * Generate and insert theme CSS variables in one step
 *
 * @param theme - Complete theme object
 * @param options - CSS variable generation options
 */
export declare function applyThemeCssVars(theme: {
    colors: {
        [colorName: string]: {
            [shade: string]: string;
        };
    };
    grays?: {
        [shade: string]: string;
    };
}, options?: CssVarOptions & {
    styleId?: string;
}): void;
/**
 * Generate multiple color palettes like tailwindcss-palette-generator
 */
export declare function generateTailwindPalettes(colors: ColorInput | ColorInput[], options?: {
    names?: string[];
    preserve?: boolean;
}): {
    [key: string]: {
        [key: string]: string;
    };
};
