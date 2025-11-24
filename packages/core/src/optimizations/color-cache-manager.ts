/**
 * Color 缓存管理器
 * 优化颜色转换和计算的性能
 */

/**
 * 颜色缓存键生成器
 */
class ColorCacheKeyGenerator {
  private static instance: ColorCacheKeyGenerator;

  private constructor() { }

  static getInstance(): ColorCacheKeyGenerator {
    if (!ColorCacheKeyGenerator.instance) {
      ColorCacheKeyGenerator.instance = new ColorCacheKeyGenerator();
    }
    return ColorCacheKeyGenerator.instance;
  }

  /**
   * 生成 RGB 缓存键
   */
  generateRgbKey(r: number, g: number, b: number, a: number = 1): string {
    return `rgb:${r}:${g}:${b}:${a}`;
  }

  /**
   * 生成 HEX 缓存键
   */
  generateHexKey(hex: string): string {
    return `hex:${hex.toLowerCase()}`;
  }

  /**
   * 生成 HSL 缓存键
   */
  generateHslKey(h: number, s: number, l: number, a: number = 1): string {
    return `hsl:${h}:${s}:${l}:${a}`;
  }

  /**
   * 生成转换缓存键
   */
  generateConversionKey(fromSpace: string, toSpace: string, ...values: number[]): string {
    return `conv:${fromSpace}:${toSpace}:${values.join(':')}`;
  }
}

/**
 * 颜色对象池
 */
export class ColorObjectPool {
  private pool: any[] = [];
  private maxSize: number;
  private created: number = 0;
  private reused: number = 0;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  /**
   * 获取颜色对象
   */
  acquire(r: number, g: number, b: number, a: number = 1): any {
    let obj = this.pool.pop();

    if (!obj) {
      this.created++;
      obj = { r, g, b, a, _pooled: true };
    } else {
      this.reused++;
      obj.r = r;
      obj.g = g;
      obj.b = b;
      obj.a = a;
    }

    return obj;
  }

  /**
   * 释放颜色对象
   */
  release(obj: any): void {
    if (this.pool.length < this.maxSize && obj._pooled) {
      this.pool.push(obj);
    }
  }

  /**
   * 获取统计信息
   */
  getStats(): { created: number; reused: number; poolSize: number; reuseRate: number } {
    const total = this.created + this.reused;
    return {
      created: this.created,
      reused: this.reused,
      poolSize: this.pool.length,
      reuseRate: total > 0 ? this.reused / total : 0
    };
  }

  /**
   * 清空对象池
   */
  clear(): void {
    this.pool = [];
  }
}

/**
 * 颜色转换缓存
 */
export class ColorConversionCache {
  private cache = new Map<string, any>();
  private maxSize: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * 获取缓存值
   */
  get(key: string): any | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.hits++;
    } else {
      this.misses++;
    }
    return value;
  }

  /**
   * 设置缓存值
   */
  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      // LRU: 删除最早的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  /**
   * 获取缓存统计
   */
  getStats(): { hits: number; misses: number; size: number; hitRate: number } {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.hits / total : 0
    };
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

/**
 * 颜色缓存管理器
 */
export class ColorCacheManager {
  private static instance: ColorCacheManager;

  private conversionCache: ColorConversionCache;
  private objectPool: ColorObjectPool;
  private keyGenerator: ColorCacheKeyGenerator;

  private constructor() {
    this.conversionCache = new ColorConversionCache(1000);
    this.objectPool = new ColorObjectPool(100);
    this.keyGenerator = ColorCacheKeyGenerator.getInstance();
  }

  static getInstance(): ColorCacheManager {
    if (!ColorCacheManager.instance) {
      ColorCacheManager.instance = new ColorCacheManager();
    }
    return ColorCacheManager.instance;
  }

  /**
   * 获取或计算转换结果
   */
  getOrCompute<T>(
    cacheKey: string,
    computer: () => T
  ): T {
    const cached = this.conversionCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const result = computer();
    this.conversionCache.set(cacheKey, result);
    return result;
  }

  /**
   * 从对象池获取颜色对象
   */
  acquireColorObject(r: number, g: number, b: number, a: number = 1): any {
    return this.objectPool.acquire(r, g, b, a);
  }

  /**
   * 释放颜色对象到池中
   */
  releaseColorObject(obj: any): void {
    this.objectPool.release(obj);
  }

  /**
   * 生成缓存键
   */
  generateKey(type: string, ...values: any[]): string {
    switch (type) {
      case 'rgb':
        return this.keyGenerator.generateRgbKey(...values as [number, number, number, number?]);
      case 'hex':
        return this.keyGenerator.generateHexKey(values[0]);
      case 'hsl':
        return this.keyGenerator.generateHslKey(...values as [number, number, number, number?]);
      case 'conversion':
        return this.keyGenerator.generateConversionKey(...values as [string, string, ...number[]]);
      default:
        return values.join(':');
    }
  }

  /**
   * 获取综合统计
   */
  getStats(): {
    conversion: ReturnType<ColorConversionCache['getStats']>;
    pool: ReturnType<ColorObjectPool['getStats']>;
  } {
    return {
      conversion: this.conversionCache.getStats(),
      pool: this.objectPool.getStats()
    };
  }

  /**
   * 清空所有缓存
   */
  clearAll(): void {
    this.conversionCache.clear();
    this.objectPool.clear();
  }
}

/**
 * 快速颜色混合（使用位运算）
 */
export class FastColorBlender {
  /**
   * 快速混合两个 32 位颜色值
   */
  static blend32(color1: number, color2: number, ratio: number): number {
    // ratio 在 0-1 之间
    const ratio256 = Math.round(ratio * 256);
    const invRatio256 = 256 - ratio256;

    // 提取各通道
    const r1 = (color1 >> 16) & 0xFF;
    const g1 = (color1 >> 8) & 0xFF;
    const b1 = color1 & 0xFF;

    const r2 = (color2 >> 16) & 0xFF;
    const g2 = (color2 >> 8) & 0xFF;
    const b2 = color2 & 0xFF;

    // 快速混合
    const r = ((r1 * invRatio256 + r2 * ratio256) >> 8) & 0xFF;
    const g = ((g1 * invRatio256 + g2 * ratio256) >> 8) & 0xFF;
    const b = ((b1 * invRatio256 + b2 * ratio256) >> 8) & 0xFF;

    // 组合结果
    return (r << 16) | (g << 8) | b;
  }

  /**
   * 批量混合颜色（SIMD 模拟）
   */
  static blendBatch(
    colors1: number[],
    colors2: number[],
    ratios: number[]
  ): number[] {
    const length = Math.min(colors1.length, colors2.length, ratios.length);
    const results = new Array(length);

    for (let i = 0; i < length; i++) {
      results[i] = this.blend32(colors1[i], colors2[i], ratios[i]);
    }

    return results;
  }
}

/**
 * 颜色查找表（LUT）优化
 */
export class ColorLookupTable {
  private lut: Map<number, number> = new Map();

  /**
   * 预计算常用颜色转换
   */
  precompute(converter: (value: number) => number, start: number, end: number, step: number = 1): void {
    for (let i = start; i <= end; i += step) {
      this.lut.set(i, converter(i));
    }
  }

  /**
   * 查找或计算
   */
  lookup(value: number, converter: (value: number) => number): number {
    const cached = this.lut.get(value);
    if (cached !== undefined) {
      return cached;
    }

    const result = converter(value);
    this.lut.set(value, result);
    return result;
  }

  /**
   * 清空查找表
   */
  clear(): void {
    this.lut.clear();
  }

  /**
   * 获取大小
   */
  size(): number {
    return this.lut.size;
  }
}

/**
 * 获取全局颜色缓存管理器
 */
export function getColorCacheManager(): ColorCacheManager {
  return ColorCacheManager.getInstance();
}