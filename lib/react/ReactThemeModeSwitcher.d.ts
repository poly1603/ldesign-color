import React from 'react';
export type ThemeMode = 'light' | 'dark' | 'system';
export interface ReactThemeModeSwitcherProps {
    defaultMode?: ThemeMode;
    storageKey?: string;
    onModeChange?: (mode: ThemeMode) => void;
    className?: string;
}
export declare const ReactThemeModeSwitcher: React.FC<ReactThemeModeSwitcherProps>;
