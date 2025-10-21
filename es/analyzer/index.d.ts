/**
 * 棰滆壊鏁版嵁鍒嗘瀽鍣?
 * 鏀寔鍥剧墖棰滆壊鎻愬彇銆佷富鑹茶皟鍒嗘瀽銆侀鑹插垎甯冪粺璁?
 */
import { Color } from '../core/Color';
/**
 * 棰滆壊缁熻淇℃伅
 */
export interface ColorStatistics {
    color: Color;
    count: number;
    percentage: number;
    prominence: number;
}
/**
 * 棰滆壊鍒嗗竷淇℃伅
 */
export interface ColorDistribution {
    hueDistribution: number[];
    saturationDistribution: number[];
    lightnessDistribution: number[];
    dominantHues: number[];
    averageSaturation: number;
    averageLightness: number;
}
/**
 * 鍒嗘瀽閫夐」
 */
export interface AnalyzerOptions {
    sampleSize?: number;
    quality?: number;
    ignoreWhite?: boolean;
    ignoreBlack?: boolean;
    threshold?: number;
}
/**
 * 颜色数据分析器
 */
export declare class ColorAnalyzer {
    /**
     * 浠庡浘鐗囨彁鍙栬皟鑹叉澘
     */
    static extractPalette(input: File | Blob | HTMLImageElement | string, count?: number, _options?: AnalyzerOptions): Promise<Color[]>;
    /**
     * 查找主色调
     */
    static findDominantColors(input: File | Blob | HTMLImageElement | string, count?: number, _options?: AnalyzerOptions): Promise<ColorStatistics[]>;
    /**
     * 鍒嗘瀽棰滆壊鍒嗗竷
     */
    static analyzeColorDistribution(input: File | Blob | HTMLImageElement | string, _options?: AnalyzerOptions): Promise<ColorDistribution>;
    /**
     * 鑾峰彇鍥剧墖鍍忕礌鏁版嵁
     */
    private static getImagePixels;
    /**
     * 鍔犺浇鍥剧墖
     */
    private static loadImage;
    /**
     * K-means聚类算法
     */
    private static kMeansClustering;
    /**
     * 初始化聚类中心（K-means++）
     */
    private static initializeCenters;
    /**
     * 计算质心
     */
    private static calculateCentroid;
    /**
     * 璁＄畻棰滆壊璺濈
     */
    private static colorDistance;
    /**
     * 鑾峰彇棰滆壊閿紙鐢ㄤ簬鍒嗙粍鐩镐技棰滆壊锛?
     */
    private static getColorKey;
    /**
     * 璁＄畻棰滆壊鏄捐憲搴?
     */
    private static calculateProminence;
    /**
     * 鏌ユ壘宄板€?
     */
    private static findPeaks;
    /**
     * 鐢熸垚棰滆壊鎶ュ憡
     */
    static generateColorReport(input: File | Blob | HTMLImageElement | string, _options?: AnalyzerOptions): Promise<{
        palette: Color[];
        dominant: ColorStatistics[];
        distribution: ColorDistribution;
        mood: string;
        temperature: 'warm' | 'cool' | 'neutral';
    }>;
    /**
     * 鍒嗘瀽鑹插僵鎯呯华
     */
    private static analyzeMood;
    /**
     * 鍒嗘瀽鑹叉俯
     */
    private static analyzeTemperature;
}
export declare const extractPalette: typeof ColorAnalyzer.extractPalette;
export declare const findDominantColors: typeof ColorAnalyzer.findDominantColors;
export declare const analyzeColorDistribution: typeof ColorAnalyzer.analyzeColorDistribution;
export declare const generateColorReport: typeof ColorAnalyzer.generateColorReport;
