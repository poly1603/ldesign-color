/**
 * AI 智能配色系统
 * 集成 DeepSeek API 提供智能配色建议
 */
import type { ColorScheme } from '../schemes';
import { Color } from '../core/Color';
/**
 * AI 配色请求选项
 */
export interface AIColorOptions {
    apiKey?: string;
    apiUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    language?: 'zh' | 'en';
}
/**
 * AI 配色建议结果
 */
export interface AIColorSuggestion {
    colors: Color[];
    scheme: ColorScheme;
    description: string;
    reasoning: string;
    tags: string[];
    confidence: number;
}
/**
 * 配色上下文
 */
export interface ColorContext {
    industry?: string;
    mood?: string[];
    target?: string;
    season?: string;
    style?: string;
    preferences?: {
        warm?: boolean;
        vibrant?: boolean;
        minimal?: boolean;
    };
}
/**
 * DeepSeek AI 配色助手
 */
export declare class ColorAI {
    private apiKey;
    private apiUrl;
    private model;
    private defaultOptions;
    constructor(options?: AIColorOptions);
    /**
     * 获取 AI 配色建议
     */
    getSuggestions(context: ColorContext, count?: number): Promise<AIColorSuggestion[]>;
    /**
     * 分析现有配色
     */
    analyzeColorScheme(colors: Color[], context?: ColorContext): Promise<{
        analysis: string;
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
        score: number;
    }>;
    /**
     * 获取配色灵感
     */
    getInspiration(keyword: string, style?: string): Promise<{
        palette: Color[];
        description: string;
        keywords: string[];
    }>;
    /**
     * 调用 DeepSeek API
     */
    private callAPI;
    /**
     * 构建提示词
     */
    private buildPrompt;
    /**
     * 构建分析提示词
     */
    private buildAnalysisPrompt;
    /**
     * 构建灵感提示词
     */
    private buildInspirationPrompt;
    /**
     * 解析响应
     */
    private parseResponse;
    /**
     * 解析分析响应
     */
    private parseAnalysisResponse;
    /**
     * 解析灵感响应
     */
    private parseInspirationResponse;
    /**
     * 回退建议（当 API 不可用时）
     */
    private getFallbackSuggestions;
    /**
     * 本地分析
     */
    private getLocalAnalysis;
    /**
     * 预设灵感
     */
    private getPresetInspiration;
}
/**
 * 创建 AI 配色助手实例
 */
export declare function createColorAI(options?: AIColorOptions): ColorAI;
export declare const colorAI: ColorAI;
