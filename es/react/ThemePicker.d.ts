import type { PresetTheme } from '../themes/presets';
import React from 'react';
import './ThemePicker.css';
export interface ThemePickerProps {
    value?: string;
    onChange?: (value: string, preset?: PresetTheme) => void;
    showArrow?: boolean;
    showSearch?: boolean;
    showCustom?: boolean;
    prefix?: string;
    storageKey?: string;
}
export declare const ThemePicker: React.FC<ThemePickerProps>;
