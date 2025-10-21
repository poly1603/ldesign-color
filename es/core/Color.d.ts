/**
 * @ldesign/color - Core Color Class
 *
 * The main Color class for basic color operations
 */
import type { BlendMode, ColorFormat, ColorInput, HarmonyType, HSL, HSV, RGB, TextSize, WCAGLevel } from '../types';
/**
 * Optimized Color class with reduced memory footprint
 * Uses 32-bit integer for RGB storage instead of object
 */
export declare class Color {
    private _value;
    private _alpha;
    private _hex?;
    private static cache;
    private static pool;
    private static poolSize;
    private static rgbPool;
    private static rgbPoolSize;
    constructor(input?: ColorInput);
    /**
     * Create a Color from RGB values - Optimized with object pool
     */
    static fromRGB(r: number, g: number, b: number, a?: number): Color;
    /**
     * Create a Color from HSL values
     */
    static fromHSL(h: number, s: number, l: number, a?: number): Color;
    /**
     * Create a Color from HSV values
     */
    static fromHSV(h: number, s: number, v: number, a?: number): Color;
    /**
     * Create a random color
     */
    static random(): Color;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    get hue(): number;
    get saturation(): number;
    get lightness(): number;
    get brightness(): number;
    /**
     * Convert to hex string - Cached and optimized
     */
    toHex(includeAlpha?: boolean): string;
    /**
     * Convert to RGB object - Use object pool to reduce allocations
     */
    toRGB(): RGB;
    /**
     * Return RGB object to pool
     */
    static returnRGB(rgb: RGB): void;
    /**
     * Convert to RGB string - Direct from packed value
     */
    toRGBString(): string;
    /**
     * Convert to HSL object - No caching to save memory
     */
    toHSL(): HSL;
    /**
     * Convert to HSL string
     */
    toHSLString(): string;
    /**
     * Convert to HSV object - No caching to save memory
     */
    toHSV(): HSV;
    /**
     * Convert to string based on format
     */
    toString(format?: ColorFormat): string;
    /**
     * Lighten the color
     */
    lighten(amount: number): Color;
    /**
     * Darken the color
     */
    darken(amount: number): Color;
    /**
     * Saturate the color
     */
    saturate(amount: number): Color;
    /**
     * Desaturate the color
     */
    desaturate(amount: number): Color;
    /**
     * Rotate the hue
     */
    rotate(degrees: number): Color;
    /**
     * Convert to grayscale
     */
    grayscale(): Color;
    /**
     * Invert the color
     */
    invert(): Color;
    /**
     * Return object to pool for reuse
     */
    release(): void;
    /**
     * Cleanup static resources
     */
    static cleanup(): void;
    /**
     * Set alpha value
     */
    setAlpha(value: number): Color;
    /**
     * Fade the color (reduce alpha)
     */
    fade(amount: number): Color;
    /**
     * Mix with another color - Optimized
     */
    mix(color: ColorInput, amount?: number): Color;
    /**
     * Blend with another color using a blend mode
     */
    blend(color: ColorInput, mode?: BlendMode): Color;
    /**
     * Get the luminance of the color
     */
    getLuminance(): number;
    /**
     * Get contrast ratio with another color
     */
    contrast(color: ColorInput): number;
    /**
     * Check if the color is light
     */
    isLight(): boolean;
    /**
     * Check if the color is dark
     */
    isDark(): boolean;
    /**
     * Check WCAG compliance with another color
     */
    isWCAGCompliant(background: ColorInput, level?: WCAGLevel, size?: TextSize): boolean;
    /**
     * Get complementary color
     */
    complementary(): Color;
    /**
     * Get analogous colors
     */
    analogous(angle?: number): [Color, Color];
    /**
     * Get triadic colors
     */
    triadic(): [Color, Color];
    /**
     * Get tetradic colors
     */
    tetradic(): [Color, Color, Color];
    /**
     * Get split complementary colors
     */
    splitComplementary(angle?: number): [Color, Color];
    /**
     * Generate a harmony based on type
     */
    harmony(type: HarmonyType): Color[];
    /**
     * Clone the color - Optimized
     */
    clone(): Color;
    /**
     * Return color to pool for reuse
     */
    dispose(): void;
    /**
     * Check equality with another color - Fast comparison
     */
    equals(color: ColorInput): boolean;
    /**
     * Get distance to another color - Optimized
     */
    distance(color: ColorInput): number;
    /**
     * Check if color is valid - Simple check
     */
    isValid(): boolean;
    /**
     * Export as JSON
     */
    toJSON(): object;
}
export declare const Colors: {
    black: () => Color;
    white: () => Color;
    red: () => Color;
    green: () => Color;
    blue: () => Color;
    yellow: () => Color;
    cyan: () => Color;
    magenta: () => Color;
    transparent: () => Color;
};
