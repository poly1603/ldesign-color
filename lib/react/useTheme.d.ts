/**
 * React Hook for theme management
 */
/**
 * Create a theme provider context
 */
import type { ReactNode } from 'react';
import type { PresetTheme } from '../themes/presets';
import type { ThemeOptions, ThemeState } from '../themes/themeManager';
export interface UseThemeOptions extends ThemeOptions {
    immediate?: boolean;
}
export declare function useTheme(options?: UseThemeOptions): {
    currentTheme: ThemeState | null;
    presets: PresetTheme[];
    isLoading: boolean;
    primaryColor: string;
    themeName: string;
    isDark: boolean;
    applyTheme: (colorOrName: string, themeOptions?: ThemeOptions) => Promise<ThemeState>;
    applyPresetTheme: (name: string, themeOptions?: ThemeOptions) => Promise<ThemeState>;
    restoreTheme: () => ThemeState | null;
    clearTheme: () => void;
    getCurrentTheme: () => ThemeState | null;
};
interface ThemeContextValue {
    currentTheme: ThemeState | null;
    presets: PresetTheme[];
    isLoading: boolean;
    primaryColor: string;
    themeName: string;
    isDark: boolean;
    applyTheme: (colorOrName: string, options?: ThemeOptions) => Promise<ThemeState>;
    applyPresetTheme: (name: string, options?: ThemeOptions) => Promise<ThemeState>;
    restoreTheme: () => ThemeState | null;
    clearTheme: () => void;
    getCurrentTheme: () => ThemeState | null;
}
export interface ThemeProviderProps {
    children: ReactNode;
    options?: UseThemeOptions;
}
export declare function ThemeProvider({ children, options }: ThemeProviderProps): import("vue/jsx-runtime").JSX.Element;
export declare function useThemeContext(): ThemeContextValue;
export {};
