/**
 * @ldesign/color - Named Colors
 *
 * CSS named color definitions
 */
export declare const namedColorsMap: Map<string, string>;
export declare const namedColors: {
    [k: string]: string;
};
export type NamedColor = keyof typeof namedColors;
/**
 * Get a color by name - Use Map for O(1) lookup
 */
export declare function getNamedColor(name: string): string | undefined;
/**
 * Check if a string is a valid named color
 */
export declare function isNamedColor(name: unknown): name is NamedColor;
/**
 * Get all named color names - Return array from Map keys
 */
export declare function getNamedColorNames(): string[];
/**
 * Get the name of a color from its hex value - Use reverse map for O(1) lookup
 */
export declare function getColorName(hex: string): string | undefined;
