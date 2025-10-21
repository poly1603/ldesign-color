/**
 * Color/Theme Picker 内置国际化
 */
export interface ColorLocale {
    theme: {
        title: string;
        selectThemeColor: string;
        customColor: string;
        custom: string;
        apply: string;
        addCustomTheme: string;
        themeName: string;
        add: string;
        remove: string;
        confirmRemove: string;
        searchPlaceholder: string;
        presets: {
            [key: string]: string;
        };
    };
    themeMode: {
        light: string;
        dark: string;
        system: string;
    };
}
export declare const zhCN: ColorLocale;
export declare const enUS: ColorLocale;
export declare const jaJP: ColorLocale;
export declare const koKR: ColorLocale;
export declare const deDE: ColorLocale;
export declare const frFR: ColorLocale;
export declare const esES: ColorLocale;
export declare const itIT: ColorLocale;
export declare const ptBR: ColorLocale;
export declare const ruRU: ColorLocale;
export declare const locales: {
    'zh-CN': ColorLocale;
    'en-US': ColorLocale;
    'ja-JP': ColorLocale;
    'ko-KR': ColorLocale;
    'de-DE': ColorLocale;
    'fr-FR': ColorLocale;
    'es-ES': ColorLocale;
    'it-IT': ColorLocale;
    'pt-BR': ColorLocale;
    'ru-RU': ColorLocale;
    zh: ColorLocale;
    en: ColorLocale;
    ja: ColorLocale;
    ko: ColorLocale;
    de: ColorLocale;
    fr: ColorLocale;
    es: ColorLocale;
    it: ColorLocale;
    pt: ColorLocale;
    ru: ColorLocale;
};
export type LocaleKey = keyof typeof locales;
export declare function getLocale(locale: LocaleKey | string): ColorLocale;
