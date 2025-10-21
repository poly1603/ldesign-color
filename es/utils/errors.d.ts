/**
 * @ldesign/color - Error Handling System
 *
 * Comprehensive error handling with detailed types and recovery suggestions
 */
/**
 * 错误严重级别
 */
export declare enum ErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * 错误类别
 */
export declare enum ErrorCategory {
    INPUT_VALIDATION = "input_validation",
    COLOR_CONVERSION = "color_conversion",
    COLOR_MANIPULATION = "color_manipulation",
    CACHE_OPERATION = "cache_operation",
    THEME_OPERATION = "theme_operation",
    PLUGIN_OPERATION = "plugin_operation",
    SYSTEM = "system"
}
/**
 * 错误恢复建议
 */
export interface RecoverySuggestion {
    action: string;
    description: string;
    code?: string;
}
/**
 * Optimized base color error class with object pooling
 */
export declare class ColorError extends Error {
    severity: ErrorSeverity;
    category: ErrorCategory;
    timestamp: number;
    context?: any;
    suggestions?: RecoverySuggestion[];
    private static pool;
    private static poolSize;
    constructor(message?: string, category?: ErrorCategory, severity?: ErrorSeverity, suggestions?: RecoverySuggestion[], context?: any);
    private init;
    static create(message: string, category?: ErrorCategory, severity?: ErrorSeverity, suggestions?: RecoverySuggestion[], context?: any): ColorError;
    dispose(): void;
    /**
     * 获取格式化的错误信息 - Optimized
     */
    toDetailedString(): string;
}
/**
 * 输入验证错误
 */
export declare class InputValidationError extends ColorError {
    constructor(message: string, inputValue: any, expectedFormat?: string);
}
/**
 * 颜色转换错误
 */
export declare class ColorConversionError extends ColorError {
    constructor(message: string, fromFormat: string, toFormat: string, value: any);
}
/**
 * 颜色操作错误
 */
export declare class ColorManipulationError extends ColorError {
    constructor(message: string, operation: string, parameters: any);
}
/**
 * 主题操作错误
 */
export declare class ThemeOperationError extends ColorError {
    constructor(message: string, operation: string, themeData?: any);
}
/**
 * Optimized error logger with circular buffer
 */
export declare class ErrorLogger {
    private static errors;
    private static maxErrors;
    private static errorIndex;
    private static errorHandlers;
    private static initialized;
    private static init;
    /**
     * Log error using circular buffer
     */
    static log(error: ColorError): void;
    /**
     * 获取错误日志
     */
    static getErrors(filter?: {
        category?: ErrorCategory;
        severity?: ErrorSeverity;
        since?: Date;
    }): ColorError[];
    /**
     * 清除错误日志
     */
    static clear(): void;
    /**
     * 添加错误处理器
     */
    static addHandler(handler: (error: ColorError) => void): () => void;
    /**
     * 生成错误报告
     */
    static generateReport(): string;
}
/**
 * 错误恢复辅助函数
 */
export declare class ErrorRecovery {
    /**
     * 安全执行函数
     */
    static safeExecute<T>(fn: () => T, fallback: T, errorHandler?: (error: Error) => void): T;
    /**
     * 带重试的执行
     */
    static retryExecute<T>(fn: () => T | Promise<T>, maxRetries?: number, delay?: number): Promise<T>;
}
export declare const logError: typeof ErrorLogger.log;
export declare const safeExecute: typeof ErrorRecovery.safeExecute;
export declare const retryExecute: typeof ErrorRecovery.retryExecute;
