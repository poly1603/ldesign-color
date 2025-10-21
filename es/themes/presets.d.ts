/**
 * 预设主题配置
 */
export interface PresetTheme {
    name: string;
    label: string;
    color: string;
    description?: string;
    order?: number;
    /** 是否为用户自定义主题 */
    custom?: boolean;
}
export declare const presetThemes: PresetTheme[];
/**
 * 根据名称获取预设主题
 */
export declare function getPresetTheme(name: string): PresetTheme | undefined;
/**
 * 获取预设主题的颜色值
 */
export declare function getPresetColor(name: string): string | undefined;
/**
 * 获取所有预设主题的名称列表
 */
export declare function getPresetNames(): string[];
/**
 * 获取预设主题分组
 */
export declare function getPresetGroups(): {
    brand: PresetTheme[];
    neutral: PresetTheme[];
    dark: PresetTheme[];
};
