/**
 * Vue 3 Composable for theme management
 */
import type { PresetTheme } from '../themes/presets';
import type { ThemeOptions, ThemeState } from '../themes/themeManager';
export interface UseThemeOptions extends ThemeOptions {
    immediate?: boolean;
}
export declare function useTheme(options?: UseThemeOptions): {
    currentTheme: import("vue").Ref<{
        primaryColor: string;
        themeName?: string | undefined;
        isDark?: boolean | undefined;
        prefix?: string | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        customColors?: Record<string, string> | undefined;
        parent?: string | undefined;
        version?: string | undefined;
        author?: string | undefined;
        description?: string | undefined;
    } | null, ThemeState | {
        primaryColor: string;
        themeName?: string | undefined;
        isDark?: boolean | undefined;
        prefix?: string | undefined;
        createdAt?: number | undefined;
        updatedAt?: number | undefined;
        customColors?: Record<string, string> | undefined;
        parent?: string | undefined;
        version?: string | undefined;
        author?: string | undefined;
        description?: string | undefined;
    } | null>;
    presets: import("vue").Ref<{
        name: string;
        label: string;
        color: string;
        description?: string | undefined;
        order?: number | undefined;
        custom?: boolean | undefined;
    }[], PresetTheme[] | {
        name: string;
        label: string;
        color: string;
        description?: string | undefined;
        order?: number | undefined;
        custom?: boolean | undefined;
    }[]>;
    isLoading: import("vue").Ref<boolean, boolean>;
    primaryColor: import("vue").ComputedRef<string>;
    themeName: import("vue").ComputedRef<string>;
    isDark: import("vue").ComputedRef<boolean>;
    applyTheme: (colorOrName: string, themeOptions?: ThemeOptions) => Promise<ThemeState>;
    applyPresetTheme: (name: string, themeOptions?: ThemeOptions) => Promise<ThemeState>;
    restoreTheme: () => ThemeState | null;
    clearTheme: () => void;
    getCurrentTheme: () => ThemeState | null;
};
export declare function createThemeProvider(options?: UseThemeOptions): {
    install(app: any): void;
};
