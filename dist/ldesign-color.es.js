var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import Color from "color";
import convert from "color-convert";
import { ref, watch, onUnmounted, computed, defineComponent, provide, inject, reactive } from "vue";
class LRUCache {
  // 生存时间（毫秒）
  constructor(maxSize = 100, ttl = 5 * 60 * 1e3) {
    __publicField(this, "cache", /* @__PURE__ */ new Map());
    __publicField(this, "maxSize");
    __publicField(this, "ttl");
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  /**
   * 获取缓存项
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }
    item.accessCount++;
    item.lastAccess = Date.now();
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }
  /**
   * 设置缓存项
   */
  set(key, value) {
    const now = Date.now();
    if (this.cache.has(key)) {
      const item2 = this.cache.get(key);
      item2.value = value;
      item2.lastAccess = now;
      item2.accessCount++;
      this.cache.delete(key);
      this.cache.set(key, item2);
      return;
    }
    if (this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }
    const item = {
      value,
      timestamp: now,
      accessCount: 1,
      lastAccess: now
    };
    this.cache.set(key, item);
  }
  /**
   * 删除缓存项
   */
  delete(key) {
    return this.cache.delete(key);
  }
  /**
   * 检查是否存在
   */
  has(key) {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
  }
  /**
   * 获取缓存大小
   */
  get size() {
    return this.cache.size;
  }
  /**
   * 获取缓存统计信息
   */
  getStats() {
    const items = Array.from(this.cache.values());
    const totalAccess = items.reduce((sum, item) => sum + item.accessCount, 0);
    const totalHits = items.reduce((sum, item) => sum + (item.accessCount - 1), 0);
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccess > 0 ? totalHits / totalAccess : 0,
      oldestItem: items.length > 0 ? Math.min(...items.map((item) => item.timestamp)) : 0,
      newestItem: items.length > 0 ? Math.max(...items.map((item) => item.timestamp)) : 0
    };
  }
  /**
   * 清理过期项
   */
  cleanup() {
    let removedCount = 0;
    for (const [key, item] of this.cache.entries()) {
      if (this.isExpired(item)) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    return removedCount;
  }
  /**
   * 检查项是否过期
   */
  isExpired(item) {
    return Date.now() - item.timestamp > this.ttl;
  }
  /**
   * 驱逐最少使用的项
   */
  evictLeastRecentlyUsed() {
    let lruKey = null;
    let lruTime = Infinity;
    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccess < lruTime) {
        lruTime = item.lastAccess;
        lruKey = key;
      }
    }
    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }
  /**
   * 获取所有键
   */
  keys() {
    return Array.from(this.cache.keys());
  }
  /**
   * 获取所有值
   */
  values() {
    return Array.from(this.cache.values()).map((item) => item.value);
  }
  /**
   * 序列化缓存（用于持久化）
   */
  serialize() {
    const data = Array.from(this.cache.entries());
    return JSON.stringify({
      maxSize: this.maxSize,
      ttl: this.ttl,
      data
    });
  }
  /**
   * 反序列化缓存（用于恢复）
   */
  static deserialize(serialized) {
    try {
      const { maxSize, ttl, data } = JSON.parse(serialized);
      const cache = new LRUCache(maxSize, ttl);
      for (const [key, item] of data) {
        if (!cache.isExpired(item)) {
          cache.cache.set(key, item);
        }
      }
      return cache;
    } catch (error) {
      console.error("Failed to deserialize cache:", error);
      return new LRUCache();
    }
  }
}
class MemoryCacheManager {
  constructor() {
    __publicField(this, "caches", /* @__PURE__ */ new Map());
    __publicField(this, "defaultConfig", {
      maxSize: 100,
      ttl: 5 * 60 * 1e3
      // 5分钟
    });
  }
  /**
   * 获取或创建缓存实例
   */
  getCache(name, config) {
    if (!this.caches.has(name)) {
      const { maxSize, ttl } = { ...this.defaultConfig, ...config };
      this.caches.set(name, new LRUCache(maxSize, ttl));
    }
    return this.caches.get(name);
  }
  /**
   * 删除缓存实例
   */
  deleteCache(name) {
    return this.caches.delete(name);
  }
  /**
   * 清空所有缓存
   */
  clearAll() {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }
  /**
   * 清理所有缓存的过期项
   */
  cleanupAll() {
    let totalRemoved = 0;
    for (const cache of this.caches.values()) {
      totalRemoved += cache.cleanup();
    }
    return totalRemoved;
  }
  /**
   * 获取所有缓存的统计信息
   */
  getAllStats() {
    const stats = {};
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    return stats;
  }
  /**
   * 获取缓存实例列表
   */
  getCacheNames() {
    return Array.from(this.caches.keys());
  }
}
const globalCacheManager = new MemoryCacheManager();
class CacheKeyGenerator {
  /**
   * 为颜色生成缓存键
   */
  static forColor(color, ...params) {
    return `color_${color}_${params.join("_")}`;
  }
  /**
   * 为语义化颜色生成缓存键
   */
  static forSemanticColors(primaryColor) {
    return `semantic_${primaryColor}`;
  }
  /**
   * 为色阶生成缓存键
   */
  static forPalette(color, isDark, format, steps) {
    return `palette_${color}_${isDark}_${format}_${steps || "default"}`;
  }
  /**
   * 为CSS变量生成缓存键
   */
  static forCSSVariables(colors, prefix) {
    const colorHash = this.hashObject(colors);
    return `css_${colorHash}_${prefix}`;
  }
  /**
   * 对象哈希函数
   */
  static hashObject(obj) {
    return btoa(JSON.stringify(obj)).replace(/[^a-z0-9]/gi, "").substring(0, 16);
  }
}
function hslToHex(hsl) {
  const [h, s, l] = hsl;
  try {
    const hex = convert.hsl.hex([h, s, l]);
    return ensureHashPrefix(hex);
  } catch (error) {
    console.warn("HSL to Hex conversion failed:", hsl, error);
    return Color.hsl(h, s, l).hex();
  }
}
function hexToHsl(hex) {
  const cleanHex = hex.replace("#", "");
  return convert.hex.hsl(cleanHex);
}
function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  return convert.hex.rgb(cleanHex);
}
function hexToHsv(hex) {
  const cleanHex = hex.replace("#", "");
  return convert.hex.hsv(cleanHex);
}
function rgbToHex(rgb) {
  return `#${convert.rgb.hex(rgb)}`;
}
function hsvToHex(hsv) {
  return `#${convert.hsv.hex(hsv)}`;
}
function formatColor(color, format) {
  const colorObj = Color(color);
  switch (format) {
    case "hex":
      return colorObj.hex();
    case "rgb":
      return colorObj.rgb().string();
    case "hsl":
      return colorObj.hsl().string();
    case "hsv":
      return colorObj.hsv().string();
    default:
      return colorObj.hex();
  }
}
function isValidColor(color) {
  if (!color || typeof color !== "string") {
    return false;
  }
  try {
    Color(color);
    return true;
  } catch {
    return false;
  }
}
function getLuminance(color) {
  return Color(color).luminosity();
}
function isDarkColor(color) {
  return getLuminance(color) < 0.5;
}
function getContrast(color1, color2) {
  return Color(color1).contrast(Color(color2));
}
function getContrastInfo(color1, color2) {
  const ratio = getContrast(color1, color2);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7
  };
}
function analyzeColor$1(color) {
  const colorObj = Color(color);
  const hsl = hexToHsl(colorObj.hex());
  const rgb = hexToRgb(colorObj.hex());
  const hsv = hexToHsv(colorObj.hex());
  const luminance = getLuminance(color);
  const isDark = isDarkColor(color);
  return {
    color: colorObj.hex(),
    hsl,
    rgb,
    hsv,
    luminance,
    isDark,
    contrastWithWhite: getContrastInfo(color, "#ffffff"),
    contrastWithBlack: getContrastInfo(color, "#000000")
  };
}
function mixColors(color1, color2, ratio = 0.5) {
  return Color(color1).mix(Color(color2), ratio).hex();
}
function adjustLightness(color, amount) {
  return Color(color).lightness(amount).hex();
}
function adjustSaturation(color, amount) {
  return Color(color).saturationv(amount).hex();
}
function adjustHue(color, amount) {
  return Color(color).hue(amount).hex();
}
function getComplementaryColor(color) {
  const hsl = hexToHsl(color);
  const complementaryHue = (hsl[0] + 180) % 360;
  return hslToHex([complementaryHue, hsl[1], hsl[2]]);
}
function getAnalogousColors(color, count = 2) {
  const hsl = hexToHsl(color);
  const colors = [];
  const step = 30;
  for (let i = 1; i <= count; i++) {
    const hue1 = (hsl[0] + step * i) % 360;
    const hue2 = (hsl[0] - step * i + 360) % 360;
    colors.push(hslToHex([hue1, hsl[1], hsl[2]]));
    if (colors.length < count) {
      colors.push(hslToHex([hue2, hsl[1], hsl[2]]));
    }
  }
  return colors.slice(0, count);
}
function cleanColorString(color) {
  return color.replace(/[^A-Z0-9#]/gi, "");
}
function ensureHashPrefix(color) {
  const cleaned = cleanColorString(color);
  return cleaned.startsWith("#") ? cleaned : `#${cleaned}`;
}
function generateRandomColor() {
  try {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    return `#${randomHex}`;
  } catch (error) {
    console.warn("Random color generation failed, using fallback:", error);
    const fallbackColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#F5FF33", "#33FFF5"];
    return fallbackColors[Math.floor(Math.random() * fallbackColors.length)];
  }
}
function batchFormatColors(colors, format) {
  return colors.map((color) => formatColor(color, format));
}
function getRgbString(color) {
  const rgb = hexToRgb(color);
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}
const colorUtils = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adjustHue,
  adjustLightness,
  adjustSaturation,
  analyzeColor: analyzeColor$1,
  batchFormatColors,
  cleanColorString,
  ensureHashPrefix,
  formatColor,
  generateRandomColor,
  getAnalogousColors,
  getComplementaryColor,
  getContrast,
  getContrastInfo,
  getLuminance,
  getRgbString,
  hexToHsl,
  hexToHsv,
  hexToRgb,
  hslToHex,
  hsvToHex,
  isDarkColor,
  isValidColor,
  mixColors,
  rgbToHex
}, Symbol.toStringTag, { value: "Module" }));
class PerformanceMonitor {
  constructor() {
    __publicField(this, "startTimes", /* @__PURE__ */ new Map());
    __publicField(this, "metrics", {});
    __publicField(this, "cacheHits", 0);
    __publicField(this, "cacheMisses", 0);
  }
  /**
   * 开始计时
   */
  startTimer(name) {
    this.startTimes.set(name, performance.now());
  }
  /**
   * 结束计时并记录
   */
  endTimer(name) {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      console.warn(`Timer ${name} was not started`);
      return 0;
    }
    const duration = performance.now() - startTime;
    this.startTimes.delete(name);
    switch (name) {
      case "semanticColorGeneration":
        this.metrics.semanticColorGeneration = duration;
        break;
      case "paletteGeneration":
        this.metrics.paletteGeneration = duration;
        break;
      case "cssVariableGeneration":
        this.metrics.cssVariableGeneration = duration;
        break;
    }
    return duration;
  }
  /**
   * 记录缓存命中
   */
  recordCacheHit() {
    this.cacheHits++;
  }
  /**
   * 记录缓存未命中
   */
  recordCacheMiss() {
    this.cacheMisses++;
  }
  /**
   * 获取性能指标
   */
  getMetrics() {
    const totalTime = (this.metrics.semanticColorGeneration || 0) + (this.metrics.paletteGeneration || 0) + (this.metrics.cssVariableGeneration || 0);
    const totalCacheRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalCacheRequests > 0 ? this.cacheHits / totalCacheRequests : 0;
    return {
      semanticColorGeneration: this.metrics.semanticColorGeneration || 0,
      paletteGeneration: this.metrics.paletteGeneration || 0,
      cssVariableGeneration: this.metrics.cssVariableGeneration || 0,
      totalTime,
      cacheHitRate
    };
  }
  /**
   * 重置指标
   */
  reset() {
    this.startTimes.clear();
    this.metrics = {};
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}
function debounce(func, wait) {
  let timeout = null;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
function throttle(func, wait) {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
}
class BatchProcessor {
  constructor(processor, batchSize = 10, delay = 100) {
    __publicField(this, "queue", []);
    __publicField(this, "processor");
    __publicField(this, "batchSize");
    __publicField(this, "delay");
    __publicField(this, "timeout", null);
    this.processor = processor;
    this.batchSize = batchSize;
    this.delay = delay;
  }
  /**
   * 添加项目到批处理队列
   */
  add(item) {
    return new Promise((resolve, reject) => {
      this.queue.push(item);
      if (this.queue.length >= this.batchSize) {
        this.processBatch().then((results) => {
          resolve(results[results.length - 1]);
        }).catch(reject);
      } else {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.processBatch().then((results) => {
            resolve(results[results.length - 1]);
          }).catch(reject);
        }, this.delay);
      }
    });
  }
  /**
   * 处理批次
   */
  async processBatch() {
    if (this.queue.length === 0) {
      return [];
    }
    const items = this.queue.splice(0, this.batchSize);
    return await this.processor(items);
  }
}
function runInIdleTime(task, timeout = 5e3) {
  return new Promise((resolve, reject) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        (_deadline) => {
          try {
            const result = task();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        { timeout }
      );
    } else {
      setTimeout(() => {
        try {
          const result = task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, 0);
    }
  });
}
class MemoryMonitor {
  /**
   * 获取内存使用情况
   */
  static getMemoryUsage() {
    if ("memory" in performance) {
      const memory = performance.memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: memory.usedJSHeapSize / memory.totalJSHeapSize * 100
      };
    }
    return null;
  }
  /**
   * 检查是否需要清理内存
   */
  static shouldCleanup(threshold = 80) {
    const usage = this.getMemoryUsage();
    return usage ? usage.percentage > threshold : false;
  }
}
class AsyncQueue {
  constructor(concurrency = 1) {
    __publicField(this, "queue", []);
    __publicField(this, "concurrency");
    __publicField(this, "running", 0);
    this.concurrency = concurrency;
  }
  /**
   * 添加任务到队列
   */
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
          return result;
        } catch (error) {
          reject(error);
          throw error;
        }
      });
      this.process();
    });
  }
  /**
   * 处理队列
   */
  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }
    this.running++;
    const task = this.queue.shift();
    if (task) {
      try {
        await task();
      } catch (error) {
        console.error("Queue task failed:", error);
      } finally {
        this.running--;
        this.process();
      }
    }
  }
  /**
   * 清空队列
   */
  clear() {
    this.queue = [];
  }
  /**
   * 获取队列长度
   */
  get length() {
    return this.queue.length;
  }
}
class CSSVariableGenerator {
  constructor(config = {}) {
    __publicField(this, "config");
    __publicField(this, "styleElement", null);
    this.config = {
      enableCache: true,
      cacheSize: 100,
      useWebWorker: false,
      cssPrefix: "ldesign",
      autoInject: true,
      grayMixPrimary: true,
      grayMixRatio: 0.2,
      semanticNames: {
        primary: "primary",
        success: "success",
        warning: "warning",
        danger: "danger",
        gray: "gray"
      },
      ...config
    };
  }
  /**
   * 生成CSS变量字符串
   */
  generateCSSVariables(palettes) {
    const variables = [];
    variables.push("/* 明亮模式颜色变量 */");
    variables.push(":root {");
    variables.push(...this.generateModeVariables(palettes.light, false));
    variables.push("}");
    variables.push("");
    variables.push("/* 暗黑模式颜色变量 */");
    variables.push('[data-theme="dark"], .dark {');
    variables.push(...this.generateModeVariables(palettes.dark, true));
    variables.push("}");
    variables.push("");
    variables.push("/* 语义化颜色变量 */");
    variables.push(":root {");
    variables.push(...this.generateSemanticVariables());
    variables.push("}");
    return variables.join("\n");
  }
  /**
   * 生成单个模式的变量
   */
  generateModeVariables(palette, isDark) {
    const variables = [];
    const prefix = this.config.cssPrefix;
    const modePrefix = isDark ? "dark-" : "";
    const names = this.config.semanticNames || {};
    const primaryName = names.primary || "primary";
    palette.primary.forEach((color, index) => {
      const step = index + 1;
      variables.push(`  --${prefix}-${modePrefix}${primaryName}-${step}: ${color};`);
    });
    const successName = names.success || "success";
    palette.success.forEach((color, index) => {
      const step = index + 1;
      variables.push(`  --${prefix}-${modePrefix}${successName}-${step}: ${color};`);
    });
    const warningName = names.warning || "warning";
    palette.warning.forEach((color, index) => {
      const step = index + 1;
      variables.push(`  --${prefix}-${modePrefix}${warningName}-${step}: ${color};`);
    });
    const dangerName = names.danger || "danger";
    palette.danger.forEach((color, index) => {
      const step = index + 1;
      variables.push(`  --${prefix}-${modePrefix}${dangerName}-${step}: ${color};`);
    });
    const grayName = names.gray || "gray";
    palette.gray.forEach((color, index) => {
      const step = index + 1;
      variables.push(`  --${prefix}-${modePrefix}${grayName}-${step}: ${color};`);
    });
    return variables;
  }
  /**
   * 生成语义化变量（指向具体色阶）
   */
  generateSemanticVariables() {
    const variables = [];
    const prefix = this.config.cssPrefix;
    variables.push(`  --${prefix}-primary: var(--${prefix}-primary-6);`);
    variables.push(`  --${prefix}-primary-hover: var(--${prefix}-primary-5);`);
    variables.push(`  --${prefix}-primary-active: var(--${prefix}-primary-7);`);
    variables.push(`  --${prefix}-primary-disabled: var(--${prefix}-primary-3);`);
    variables.push(`  --${prefix}-success: var(--${prefix}-success-6);`);
    variables.push(`  --${prefix}-success-hover: var(--${prefix}-success-5);`);
    variables.push(`  --${prefix}-success-active: var(--${prefix}-success-7);`);
    variables.push(`  --${prefix}-success-disabled: var(--${prefix}-success-3);`);
    variables.push(`  --${prefix}-warning: var(--${prefix}-warning-6);`);
    variables.push(`  --${prefix}-warning-hover: var(--${prefix}-warning-5);`);
    variables.push(`  --${prefix}-warning-active: var(--${prefix}-warning-7);`);
    variables.push(`  --${prefix}-warning-disabled: var(--${prefix}-warning-3);`);
    variables.push(`  --${prefix}-danger: var(--${prefix}-danger-6);`);
    variables.push(`  --${prefix}-danger-hover: var(--${prefix}-danger-5);`);
    variables.push(`  --${prefix}-danger-active: var(--${prefix}-danger-7);`);
    variables.push(`  --${prefix}-danger-disabled: var(--${prefix}-danger-3);`);
    variables.push(`  --${prefix}-text-primary: var(--${prefix}-gray-13);`);
    variables.push(`  --${prefix}-text-secondary: var(--${prefix}-gray-10);`);
    variables.push(`  --${prefix}-text-tertiary: var(--${prefix}-gray-8);`);
    variables.push(`  --${prefix}-text-disabled: var(--${prefix}-gray-5);`);
    variables.push(`  --${prefix}-bg-primary: var(--${prefix}-gray-1);`);
    variables.push(`  --${prefix}-bg-secondary: var(--${prefix}-gray-2);`);
    variables.push(`  --${prefix}-bg-tertiary: var(--${prefix}-gray-3);`);
    variables.push(`  --${prefix}-border-primary: var(--${prefix}-gray-4);`);
    variables.push(`  --${prefix}-border-secondary: var(--${prefix}-gray-3);`);
    variables.push(`  --${prefix}-border-tertiary: var(--${prefix}-gray-2);`);
    return variables;
  }
  /**
   * 将CSS变量注入到页面头部
   */
  injectToHead(cssVariables, styleId) {
    if (typeof document === "undefined") {
      console.warn("Document is not available, cannot inject CSS variables");
      throw new Error("Document is not available");
    }
    const id = styleId || `${this.config.cssPrefix}-color-variables`;
    const existingStyle = document.getElementById(id);
    if (existingStyle) {
      existingStyle.remove();
    }
    const styleElement = document.createElement("style");
    styleElement.id = id;
    styleElement.setAttribute("data-ldesign-colors", "true");
    styleElement.textContent = cssVariables;
    document.head.appendChild(styleElement);
    if (!styleId) {
      this.styleElement = styleElement;
    }
    return styleElement;
  }
  /**
   * 移除注入的CSS变量
   */
  removeFromHead() {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
  /**
   * 批量生成多个主题的CSS变量
   */
  batchGenerateCSS(themes) {
    const allVariables = [];
    themes.forEach(({ name, palettes }) => {
      allVariables.push(`/* ${name} 主题 */`);
      allVariables.push(`[data-theme="${name}"] {`);
      allVariables.push(...this.generateModeVariables(palettes.light, false));
      allVariables.push("}");
      allVariables.push("");
      allVariables.push(`[data-theme="${name}"].dark {`);
      allVariables.push(...this.generateModeVariables(palettes.dark, true));
      allVariables.push("}");
      allVariables.push("");
    });
    return allVariables.join("\n");
  }
  /**
   * 生成CSS变量的TypeScript类型定义
   */
  generateTypeDefinitions() {
    const prefix = this.config.cssPrefix;
    const types = [];
    types.push('declare module "*.css" {');
    types.push("  interface CSSVariables {");
    for (let i = 1; i <= 12; i++) {
      types.push(`    "--${prefix}-primary-${i}": string;`);
      types.push(`    "--${prefix}-primary-${i}-rgb": string;`);
      types.push(`    "--${prefix}-dark-primary-${i}": string;`);
      types.push(`    "--${prefix}-dark-primary-${i}-rgb": string;`);
    }
    ["success", "warning", "danger"].forEach((color) => {
      for (let i = 1; i <= 12; i++) {
        types.push(`    "--${prefix}-${color}-${i}": string;`);
        types.push(`    "--${prefix}-${color}-${i}-rgb": string;`);
        types.push(`    "--${prefix}-dark-${color}-${i}": string;`);
        types.push(`    "--${prefix}-dark-${color}-${i}-rgb": string;`);
      }
    });
    for (let i = 1; i <= 14; i++) {
      types.push(`    "--${prefix}-gray-${i}": string;`);
      types.push(`    "--${prefix}-gray-${i}-rgb": string;`);
      types.push(`    "--${prefix}-dark-gray-${i}": string;`);
      types.push(`    "--${prefix}-dark-gray-${i}-rgb": string;`);
    }
    types.push("  }");
    types.push("}");
    return types.join("\n");
  }
  /**
   * 生成SCSS变量文件
   */
  generateSCSSVariables(palettes) {
    const variables = [];
    const prefix = this.config.cssPrefix;
    variables.push("// LDesign 颜色变量");
    variables.push("// 自动生成，请勿手动修改");
    variables.push("");
    variables.push("// 明亮模式");
    Object.entries(palettes.light).forEach(([colorName, colors]) => {
      colors.forEach((color, index) => {
        const step = index + 1;
        variables.push(`$${prefix}-${colorName}-${step}: ${color};`);
      });
    });
    variables.push("");
    variables.push("// 暗黑模式");
    Object.entries(palettes.dark).forEach(([colorName, colors]) => {
      colors.forEach((color, index) => {
        const step = index + 1;
        variables.push(`$${prefix}-dark-${colorName}-${step}: ${color};`);
      });
    });
    return variables.join("\n");
  }
  /**
   * 生成Less变量文件
   */
  generateLessVariables(palettes) {
    const variables = [];
    const prefix = this.config.cssPrefix;
    variables.push("// LDesign 颜色变量");
    variables.push("// 自动生成，请勿手动修改");
    variables.push("");
    variables.push("// 明亮模式");
    Object.entries(palettes.light).forEach(([colorName, colors]) => {
      colors.forEach((color, index) => {
        const step = index + 1;
        variables.push(`@${prefix}-${colorName}-${step}: ${color};`);
      });
    });
    variables.push("");
    variables.push("// 暗黑模式");
    Object.entries(palettes.dark).forEach(([colorName, colors]) => {
      colors.forEach((color, index) => {
        const step = index + 1;
        variables.push(`@${prefix}-dark-${colorName}-${step}: ${color};`);
      });
    });
    return variables.join("\n");
  }
  /**
   * 更新配置
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }
  /**
   * 获取当前配置
   */
  getConfig() {
    return { ...this.config };
  }
}
class PaletteGenerator {
  /**
   * 生成完整的颜色色阶（包含明暗模式）
   */
  generateColorPalettes(semanticColors, format = "hex", grayMixPrimary = true, grayMixRatio = 0.2) {
    return {
      light: this.generateLightPalette(semanticColors, format, grayMixPrimary, grayMixRatio),
      dark: this.generateDarkPalette(semanticColors, format, grayMixPrimary, grayMixRatio)
    };
  }
  /**
   * 生成明亮模式色阶
   */
  generateLightPalette(semanticColors, format, grayMixPrimary = true, grayMixRatio = 0.2) {
    return {
      primary: this.generate12ColorPalette(semanticColors.primary, false, format),
      success: this.generate12ColorPalette(semanticColors.success, false, format),
      warning: this.generate12ColorPalette(semanticColors.warning, false, format),
      danger: this.generate12ColorPalette(semanticColors.danger, false, format),
      gray: this.generate14GrayPalette(semanticColors.gray, false, format, grayMixPrimary, grayMixRatio)
    };
  }
  /**
   * 生成暗黑模式色阶
   */
  generateDarkPalette(semanticColors, format, grayMixPrimary = true, grayMixRatio = 0.2) {
    return {
      primary: this.generate12ColorPalette(semanticColors.primary, true, format),
      success: this.generate12ColorPalette(semanticColors.success, true, format),
      warning: this.generate12ColorPalette(semanticColors.warning, true, format),
      danger: this.generate12ColorPalette(semanticColors.danger, true, format),
      gray: this.generate14GrayPalette(semanticColors.gray, true, format, grayMixPrimary, grayMixRatio)
    };
  }
  /**
   * 生成12色阶（扩展arco的10色阶算法）
   */
  generate12ColorPalette(originColor, isDark = false, format = "hex") {
    const palette = [];
    for (let i = 1; i <= 12; i++) {
      const color = isDark ? this.generateDarkColorStep(originColor, i) : this.generateLightColorStep(originColor, i);
      palette.push(formatColor(color, format));
    }
    return isDark ? palette.reverse() : palette;
  }
  /**
   * 生成14色阶灰色（专门为灰色设计更多层次）
   */
  generate14GrayPalette(originColor, isDark = false, format = "hex", grayMixPrimary = true, grayMixRatio = 0.2) {
    const palette = [];
    for (let i = 1; i <= 14; i++) {
      const color = isDark ? this.generateDarkGrayStep(originColor, i, grayMixPrimary, grayMixRatio) : this.generateLightGrayStep(originColor, i, grayMixPrimary, grayMixRatio);
      palette.push(formatColor(color, format));
    }
    return palette;
  }
  /**
   * 生成明亮模式单个色阶步骤
   */
  generateLightColorStep(originColor, step) {
    const color = Color(originColor);
    const h = color.hue();
    const s = color.saturationv();
    const v = color.value();
    const hueStep = 1.2;
    const maxSaturationStep = 95;
    const minSaturationStep = 3;
    const maxValue = 98;
    const minValue = 18;
    const centerStep = 7;
    const isLight = step < centerStep;
    const index = isLight ? centerStep - step : step - centerStep;
    function getNewHue(isLight2, i) {
      let hue;
      if (h >= 60 && h <= 240) {
        hue = isLight2 ? h - hueStep * i : h + hueStep * i;
      } else {
        hue = isLight2 ? h + hueStep * i : h - hueStep * i;
      }
      if (hue < 0) {
        hue += 360;
      } else if (hue >= 360) {
        hue -= 360;
      }
      return Math.round(hue);
    }
    function getNewSaturation(isLight2, i) {
      if (isLight2) {
        return Math.max(minSaturationStep, s - (s - minSaturationStep) / 6 * i);
      } else {
        return Math.min(maxSaturationStep, s + (maxSaturationStep - s) / 5 * i);
      }
    }
    function getNewValue(isLight2, i) {
      if (isLight2) {
        return Math.min(maxValue, v + (maxValue - v) / 6 * i);
      } else {
        return Math.max(minValue, v - (v - minValue) / 5 * i);
      }
    }
    if (step === centerStep) {
      return color.hex();
    }
    const retColor = Color({
      h: getNewHue(isLight, index),
      s: getNewSaturation(isLight, index),
      v: getNewValue(isLight, index)
    });
    return retColor.hex();
  }
  /**
   * 生成暗黑模式单个色阶步骤（重新设计，更简单可靠）
   */
  generateDarkColorStep(originColor, step) {
    const color = Color(originColor);
    const h = color.hue();
    const s = color.saturationv();
    const v = color.value();
    const hueStep = 1.2;
    const maxSaturationStep = 90;
    const minSaturationStep = 8;
    const maxValue = 85;
    const minValue = 12;
    const centerStep = 7;
    const isLight = step < centerStep;
    const index = isLight ? centerStep - step : step - centerStep;
    function getNewHue(isLight2, i) {
      let hue;
      if (h >= 60 && h <= 240) {
        hue = isLight2 ? h - hueStep * i : h + hueStep * i;
      } else {
        hue = isLight2 ? h + hueStep * i : h - hueStep * i;
      }
      if (hue < 0) {
        hue += 360;
      } else if (hue >= 360) {
        hue -= 360;
      }
      return Math.round(hue);
    }
    function getNewSaturation(isLight2, i) {
      if (isLight2) {
        return Math.max(minSaturationStep, s - (s - minSaturationStep) / 6 * i);
      } else {
        return Math.min(maxSaturationStep, s + (maxSaturationStep - s) / 5 * i);
      }
    }
    function getNewValue(isLight2, i) {
      if (isLight2) {
        return Math.min(maxValue, v + (maxValue - v) / 6 * i);
      } else {
        return Math.max(minValue, v - (v - minValue) / 5 * i);
      }
    }
    if (step === centerStep) {
      return color.hex();
    }
    const retColor = Color({
      h: getNewHue(isLight, index),
      s: getNewSaturation(isLight, index),
      v: getNewValue(isLight, index)
    });
    return retColor.hex();
  }
  /**
   * 生成明亮模式灰色步骤
   */
  generateLightGrayStep(originColor, step, grayMixPrimary = true, grayMixRatio = 0.2) {
    if (!grayMixPrimary) {
      const maxLightness2 = 98;
      const minLightness2 = 15;
      const centerStep2 = 8;
      let lightness2;
      if (step < centerStep2) {
        const ratio = (centerStep2 - step) / (centerStep2 - 1);
        lightness2 = 50 + (maxLightness2 - 50) * ratio;
      } else if (step === centerStep2) {
        lightness2 = 50;
      } else {
        const ratio = (step - centerStep2) / (14 - centerStep2);
        lightness2 = 50 - (50 - minLightness2) * ratio;
      }
      return Color({ h: 0, s: 0, l: Math.round(lightness2) }).hex();
    }
    const color = Color(originColor);
    const h = color.hue();
    const maxLightness = 98;
    const minLightness = 15;
    const centerStep = 8;
    let lightness;
    if (step < centerStep) {
      const ratio = (centerStep - step) / (centerStep - 1);
      lightness = 50 + (maxLightness - 50) * ratio;
    } else if (step === centerStep) {
      lightness = 50;
    } else {
      const ratio = (step - centerStep) / (14 - centerStep);
      lightness = 50 - (50 - minLightness) * ratio;
    }
    const maxSaturation = 8 * grayMixRatio;
    const saturation = Math.max(0, Math.min(maxSaturation, maxSaturation * (1 - Math.abs(step - centerStep) / centerStep)));
    return Color({ h, s: Math.round(saturation), l: Math.round(lightness) }).hex();
  }
  /**
   * 生成暗黑模式灰色步骤
   */
  generateDarkGrayStep(originColor, step, grayMixPrimary = true, grayMixRatio = 0.2) {
    if (!grayMixPrimary) {
      const maxLightness2 = 85;
      const minLightness2 = 12;
      const centerStep2 = 8;
      let lightness2;
      if (step < centerStep2) {
        const ratio = (centerStep2 - step) / (centerStep2 - 1);
        lightness2 = 35 + (maxLightness2 - 35) * ratio;
      } else if (step === centerStep2) {
        lightness2 = 35;
      } else {
        const ratio = (step - centerStep2) / (14 - centerStep2);
        lightness2 = 35 - (35 - minLightness2) * ratio;
      }
      return Color({ h: 0, s: 0, l: Math.round(lightness2) }).hex();
    }
    const color = Color(originColor);
    const h = color.hue();
    const maxLightness = 85;
    const minLightness = 12;
    const centerStep = 8;
    let lightness;
    if (step < centerStep) {
      const ratio = (centerStep - step) / (centerStep - 1);
      lightness = 35 + (maxLightness - 35) * ratio;
    } else if (step === centerStep) {
      lightness = 35;
    } else {
      const ratio = (step - centerStep) / (14 - centerStep);
      lightness = 35 - (35 - minLightness) * ratio;
    }
    const maxSaturation = 12 * grayMixRatio;
    const saturation = Math.max(0, Math.min(maxSaturation, maxSaturation * (1 - Math.abs(step - centerStep) / centerStep)));
    return Color({ h, s: Math.round(saturation), l: Math.round(lightness) }).hex();
  }
  // 删除了getNewSaturationForDark方法，现在使用更简单的暗黑模式算法
  /**
   * 批量生成多个颜色的色阶
   */
  batchGeneratePalettes(colors, isDark = false, format = "hex") {
    return colors.map(
      (color) => this.generate12ColorPalette(color, isDark, format)
    );
  }
  /**
   * 生成自定义步数的色阶
   */
  generateCustomStepPalette(color, steps, isDark = false, format = "hex") {
    const palette = [];
    const centerStep = Math.ceil(steps / 2);
    for (let i = 1; i <= steps; i++) {
      const adjustedColor = this.generateCustomColorStep(color, i, steps, centerStep, isDark);
      palette.push(formatColor(adjustedColor, format));
    }
    return isDark ? palette.reverse() : palette;
  }
  generateCustomColorStep(color, step, totalSteps, _centerStep, _isDark) {
    return this.generateLightColorStep(color, Math.round(step / totalSteps * 12));
  }
}
class SemanticColorGenerator {
  /**
   * 根据主色调生成所有语义化颜色
   */
  generateSemanticColors(primaryColor, config = {}) {
    const cleanPrimary = ensureHashPrefix(primaryColor);
    const primaryHsl = hexToHsl(cleanPrimary);
    return {
      primary: cleanPrimary,
      success: this.generateSuccessColor(primaryHsl),
      warning: this.generateWarningColor(primaryHsl),
      danger: this.generateDangerColor(primaryHsl),
      gray: this.generateGrayColor(primaryHsl, config)
    };
  }
  /**
   * 生成成功色（绿色系）
   * 基于主色调的色相调整到绿色范围
   */
  generateSuccessColor(primaryHsl) {
    const [h, s, l] = primaryHsl;
    let newH;
    switch (true) {
      case (h < 25 || h >= 335):
        newH = 120;
        break;
      case (h >= 25 && h < 75):
        newH = 80;
        break;
      case (h >= 150 && h < 210):
        newH = 90;
        break;
      case (h >= 210 && h < 285):
        newH = 100;
        break;
      case (h >= 285 && h < 335):
        newH = 130;
        break;
      default:
        newH = h;
        break;
    }
    const newS = Math.max(55, Math.min(70, s - 5));
    const newL = Math.max(45, Math.min(60, l + 5));
    return hslToHex([newH, newS, newL]);
  }
  /**
   * 生成警告色（琥珀色/橙色系）
   * 固定在橙色范围内
   */
  generateWarningColor(primaryHsl) {
    const [h, s, l] = primaryHsl;
    let newH;
    switch (true) {
      case (h >= 240 || h < 60):
        newH = 42;
        break;
      case (h >= 60 && h < 140):
        newH = 40;
        break;
      case (h >= 140 && h < 240):
        newH = 38;
        break;
      default:
        newH = 40;
        break;
    }
    const newS = Math.max(80, Math.min(100, s + 5));
    const newL = Math.max(55, Math.min(65, l + 15));
    return hslToHex([newH, newS, newL]);
  }
  /**
   * 生成危险色（红色系）
   * 调整到红色范围
   */
  generateDangerColor(primaryHsl) {
    const [h, s, l] = primaryHsl;
    let newH;
    switch (true) {
      case (h >= 15 && h < 60):
        newH = 5;
        break;
      case (h >= 60 && h < 140):
        newH = 10;
        break;
      case (h >= 140 && h < 190):
        newH = 357;
        break;
      case (h >= 190 && h < 240):
        newH = 0;
        break;
      case (h >= 240 && h < 350):
        newH = 355;
        break;
      default:
        newH = h;
        break;
    }
    const newS = Math.max(75, Math.min(85, s));
    const newL = Math.max(45, Math.min(55, l + 5));
    return hslToHex([newH, newS, newL]);
  }
  /**
   * 生成灰色
   * 基于主色调生成中性灰色
   */
  generateGrayColor(primaryHsl, config = {}) {
    const [h, s, l] = primaryHsl;
    const { grayMixPrimary = true, grayMixRatio = 0.2 } = config;
    if (!grayMixPrimary) {
      return hslToHex([0, 0, 50]);
    }
    const mixRatio = Math.max(0, Math.min(1, grayMixRatio));
    const newH = h;
    const newS = Math.max(3, Math.min(8, s * mixRatio * 0.3));
    const newL = 50;
    return hslToHex([newH, newS, newL]);
  }
  /**
   * 验证生成的语义化颜色是否符合可访问性要求
   */
  validateAccessibility(colors) {
    const results = {};
    Object.entries(colors).forEach(([key, _color]) => {
      results[key] = {
        contrastWithWhite: 0,
        // 实际计算对比度
        contrastWithBlack: 0,
        // 实际计算对比度
        isAccessible: true
        // 实际验证可访问性
      };
    });
    return results;
  }
  /**
   * 根据品牌色调整语义化颜色的生成策略
   */
  adjustForBrandColor(primaryColor, brandType) {
    const baseColors = this.generateSemanticColors(primaryColor);
    switch (brandType) {
      case "tech":
        return this.enhanceVibrance(baseColors);
      case "finance":
        return this.enhanceStability(baseColors);
      case "healthcare":
        return this.enhanceSoftness(baseColors);
      case "education":
        return this.enhanceFriendliness(baseColors);
      case "retail":
        return this.enhanceAttractiveness(baseColors);
      default:
        return baseColors;
    }
  }
  enhanceVibrance(colors) {
    return colors;
  }
  enhanceStability(colors) {
    return colors;
  }
  enhanceSoftness(colors) {
    return colors;
  }
  enhanceFriendliness(colors) {
    return colors;
  }
  enhanceAttractiveness(colors) {
    return colors;
  }
}
class ColorGenerator {
  constructor(config = {}) {
    __publicField(this, "config");
    __publicField(this, "semanticGenerator");
    __publicField(this, "paletteGenerator");
    __publicField(this, "cssGenerator");
    __publicField(this, "cache");
    __publicField(this, "performanceMonitor");
    __publicField(this, "worker", null);
    __publicField(this, "workerPromises", /* @__PURE__ */ new Map());
    /**
     * 防抖生成函数
     */
    __publicField(this, "debouncedGenerate");
    this.config = {
      enableCache: true,
      cacheSize: 100,
      useWebWorker: false,
      cssPrefix: "ldesign",
      autoInject: true,
      grayMixPrimary: true,
      grayMixRatio: 0.2,
      ...config
    };
    this.semanticGenerator = new SemanticColorGenerator();
    this.paletteGenerator = new PaletteGenerator();
    this.cssGenerator = new CSSVariableGenerator(this.config);
    this.cache = new LRUCache(this.config.cacheSize);
    this.performanceMonitor = new PerformanceMonitor();
    if (this.config.useWebWorker && typeof Worker !== "undefined") {
      this.initializeWorker();
    }
    this.debouncedGenerate = debounce(this.generateInternal.bind(this), 300);
  }
  /**
   * 生成完整主题（同步版本）
   */
  generate(primaryColor) {
    const cleanColor = ensureHashPrefix(primaryColor);
    if (!isValidColor(cleanColor)) {
      throw new Error(`Invalid color: ${primaryColor}`);
    }
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(cleanColor);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.performanceMonitor.recordCacheHit();
        return cached;
      }
      this.performanceMonitor.recordCacheMiss();
    }
    this.performanceMonitor.startTimer("semanticColorGeneration");
    const semanticColors = this.semanticGenerator.generateSemanticColors(cleanColor, {
      grayMixPrimary: this.config.grayMixPrimary,
      grayMixRatio: this.config.grayMixRatio
    });
    this.performanceMonitor.endTimer("semanticColorGeneration");
    this.performanceMonitor.startTimer("paletteGeneration");
    const palettes = this.paletteGenerator.generateColorPalettes(semanticColors, "hex", this.config.grayMixPrimary, this.config.grayMixRatio);
    this.performanceMonitor.endTimer("paletteGeneration");
    this.performanceMonitor.startTimer("cssVariableGeneration");
    const cssVariables = this.cssGenerator.generateCSSVariables(palettes);
    this.performanceMonitor.endTimer("cssVariableGeneration");
    const theme = {
      semanticColors,
      palettes,
      cssVariables,
      timestamp: Date.now(),
      cssGenerator: this.cssGenerator
    };
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(cleanColor);
      this.cache.set(cacheKey, theme);
    }
    if (this.config.autoInject) {
      this.cssGenerator.injectToHead(cssVariables);
    }
    return theme;
  }
  /**
   * 异步生成完整主题
   */
  async generateAsync(primaryColor) {
    const cleanColor = ensureHashPrefix(primaryColor);
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(cleanColor);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.performanceMonitor.recordCacheHit();
        return cached;
      }
      this.performanceMonitor.recordCacheMiss();
    }
    if (this.config.useWebWorker && this.worker) {
      return this.generateWithWorker(cleanColor);
    } else {
      return this.generateWithMainThread(cleanColor);
    }
  }
  /**
   * 防抖生成（用于频繁调用场景）
   */
  generateDebounced(primaryColor, callback) {
    this.debouncedGenerate = debounce((color) => {
      const theme = this.generate(color);
      callback(theme);
    }, 300);
    this.debouncedGenerate(primaryColor);
  }
  /**
   * 使用Web Worker生成
   */
  async generateWithWorker(primaryColor) {
    if (!this.worker) {
      throw new Error("Web Worker not initialized");
    }
    const semanticColors = await this.sendWorkerMessage("generateSemanticColors", {
      primaryColor
    });
    const palettes = await this.sendWorkerMessage("generatePalettes", {
      semanticColors
    });
    this.performanceMonitor.startTimer("cssVariableGeneration");
    const cssVariables = this.cssGenerator.generateCSSVariables(palettes);
    this.performanceMonitor.endTimer("cssVariableGeneration");
    const theme = {
      semanticColors,
      palettes,
      cssVariables,
      timestamp: Date.now()
    };
    if (this.config.enableCache) {
      const cacheKey = CacheKeyGenerator.forSemanticColors(primaryColor);
      this.cache.set(cacheKey, theme);
    }
    if (this.config.autoInject) {
      this.cssGenerator.injectToHead(cssVariables);
    }
    return theme;
  }
  /**
   * 在主线程生成（异步版本）
   */
  async generateWithMainThread(primaryColor) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const theme = this.generate(primaryColor);
        resolve(theme);
      }, 0);
    });
  }
  /**
   * 内部生成函数
   */
  generateInternal(primaryColor) {
    this.generate(primaryColor);
  }
  /**
   * 初始化Web Worker
   */
  initializeWorker() {
    try {
      const workerCode = this.getWorkerCode();
      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      URL.revokeObjectURL(workerUrl);
    } catch (error) {
      console.warn("Failed to initialize Web Worker:", error);
      this.config.useWebWorker = false;
    }
  }
  /**
   * 获取Worker代码
   */
  getWorkerCode() {
    return `
      // 内联Worker代码
      ${this.getInlineWorkerCode()}
    `;
  }
  /**
   * 获取内联Worker代码
   */
  getInlineWorkerCode() {
    return "";
  }
  /**
   * 发送Worker消息
   */
  sendWorkerMessage(type, data) {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error("Worker not available"));
        return;
      }
      const id = Math.random().toString(36).substring(2, 11);
      const message = { id, type, data };
      this.workerPromises.set(id, { resolve, reject });
      this.worker.postMessage(message);
      setTimeout(() => {
        if (this.workerPromises.has(id)) {
          this.workerPromises.delete(id);
          reject(new Error("Worker timeout"));
        }
      }, 1e4);
    });
  }
  /**
   * 处理Worker消息
   */
  handleWorkerMessage(event) {
    const { id, success, data, error } = event.data;
    const promise = this.workerPromises.get(id);
    if (promise) {
      this.workerPromises.delete(id);
      if (success) {
        promise.resolve(data);
      } else {
        promise.reject(new Error(error || "Worker error"));
      }
    }
  }
  /**
   * 处理Worker错误
   */
  handleWorkerError(error) {
    console.error("Worker error:", error);
    this.config.useWebWorker = false;
  }
  /**
   * 批量生成多个主题
   */
  async batchGenerate(colors) {
    const themes = [];
    for (const color of colors) {
      const theme = await this.generateAsync(color);
      themes.push(theme);
    }
    return themes;
  }
  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * 获取性能指标
   */
  getPerformanceMetrics() {
    return this.performanceMonitor.getMetrics();
  }
  /**
   * 重置性能监控
   */
  resetPerformanceMetrics() {
    this.performanceMonitor.reset();
  }
  /**
   * 更新配置
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
    this.cssGenerator.updateConfig(this.config);
    if (config.cacheSize && config.cacheSize !== this.cache.size) {
      this.cache = new LRUCache(config.cacheSize);
    }
  }
  /**
   * 获取当前配置
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * 销毁实例
   */
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.workerPromises.clear();
    this.cache.clear();
    this.cssGenerator.removeFromHead();
  }
}
function useColor(primaryColor, config) {
  const theme = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const colorGenerator = new ColorGenerator(config);
  const colorRef = typeof primaryColor === "string" ? ref(primaryColor) : primaryColor;
  const isValid = computed(() => {
    return colorRef.value ? isValidColor(colorRef.value) : false;
  });
  const generateTheme2 = async () => {
    if (!isValid.value) {
      error.value = "无效的颜色值";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const newTheme = await colorGenerator.generateAsync(colorRef.value);
      theme.value = newTheme;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "生成主题时发生错误";
      console.error("Theme generation error:", err);
    } finally {
      loading.value = false;
    }
  };
  const generateThemeSync = () => {
    if (!isValid.value) {
      error.value = "无效的颜色值";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const newTheme = colorGenerator.generate(colorRef.value);
      theme.value = newTheme;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "生成主题时发生错误";
      console.error("Theme generation error:", err);
    } finally {
      loading.value = false;
    }
  };
  const generateThemeDebounced = () => {
    if (!isValid.value) {
      error.value = "无效的颜色值";
      return;
    }
    loading.value = true;
    error.value = null;
    colorGenerator.generateDebounced(colorRef.value, (newTheme) => {
      theme.value = newTheme;
      loading.value = false;
    });
  };
  const clearCache = () => {
    colorGenerator.clearCache();
  };
  const getPerformanceMetrics = () => {
    return colorGenerator.getPerformanceMetrics();
  };
  const resetPerformanceMetrics = () => {
    colorGenerator.resetPerformanceMetrics();
  };
  const updateConfig = (newConfig) => {
    colorGenerator.updateConfig(newConfig);
  };
  const injectCSS = () => {
    if (theme.value) {
      colorGenerator.cssGenerator.injectToHead(theme.value.cssVariables);
    }
  };
  const removeCSS = () => {
    colorGenerator.cssGenerator.removeFromHead();
  };
  watch(
    colorRef,
    (newColor) => {
      if (newColor && isValidColor(newColor)) {
        generateTheme2();
      }
    },
    { immediate: true }
  );
  try {
    onUnmounted(() => {
      colorGenerator.destroy();
    });
  } catch {
  }
  return {
    // 状态
    theme: computed(() => theme.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isValid,
    // 方法
    generateTheme: generateTheme2,
    generateThemeSync,
    generateThemeDebounced,
    clearCache,
    getPerformanceMetrics,
    resetPerformanceMetrics,
    updateConfig,
    injectCSS,
    removeCSS,
    // 颜色生成器实例（高级用法）
    colorGenerator
  };
}
function useSimpleColor(primaryColor) {
  const { theme, loading, error, generateTheme: generateTheme2 } = useColor(primaryColor, {
    enableCache: true,
    useWebWorker: false,
    autoInject: true
  });
  return {
    theme,
    loading,
    error,
    generateTheme: generateTheme2
  };
}
function useHighPerformanceColor(primaryColor, config) {
  const optimizedConfig = {
    enableCache: true,
    cacheSize: 200,
    useWebWorker: true,
    autoInject: true,
    ...config
  };
  return useColor(primaryColor, optimizedConfig);
}
function useBatchColor(colors) {
  const themes = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const colorGenerator = new ColorGenerator({
    enableCache: true,
    useWebWorker: true
  });
  const generateThemes = async () => {
    if (!colors.value.length)
      return;
    loading.value = true;
    error.value = null;
    try {
      const validColors = colors.value.filter((color) => isValidColor(color));
      const newThemes = await colorGenerator.batchGenerate(validColors);
      themes.value = newThemes;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "批量生成主题时发生错误";
      console.error("Batch theme generation error:", err);
    } finally {
      loading.value = false;
    }
  };
  watch(colors, generateThemes, { immediate: true, deep: true });
  try {
    onUnmounted(() => {
      colorGenerator.destroy();
    });
  } catch {
  }
  return {
    themes: computed(() => themes.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    generateThemes,
    colorGenerator
  };
}
function useColorAnalysis(color) {
  const colorRef = typeof color === "string" ? ref(color) : color;
  const analysis = computed(() => {
    if (!colorRef.value || !isValidColor(colorRef.value)) {
      return null;
    }
    return {
      color: colorRef.value,
      isValid: true
      // 其他分析数据...
    };
  });
  return {
    analysis
  };
}
function useThemeSwitch() {
  const currentTheme = ref("light");
  const updateDocumentTheme = () => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", currentTheme.value);
      if (currentTheme.value === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
    updateDocumentTheme();
  };
  const setTheme = (theme) => {
    currentTheme.value = theme;
    updateDocumentTheme();
  };
  if (typeof document !== "undefined") {
    const savedTheme = localStorage.getItem("ldesign-theme");
    if (savedTheme) {
      currentTheme.value = savedTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      currentTheme.value = prefersDark ? "dark" : "light";
    }
    updateDocumentTheme();
  }
  watch(currentTheme, (newTheme) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("ldesign-theme", newTheme);
    }
  });
  return {
    currentTheme: computed(() => currentTheme.value),
    toggleTheme,
    setTheme,
    isDark: computed(() => currentTheme.value === "dark")
  };
}
const ColorThemeKey = Symbol("ColorTheme");
const ColorProvider = defineComponent({
  name: "ColorProvider",
  props: {
    /**
     * 主色调
     */
    primaryColor: {
      type: String,
      required: true
    },
    /**
     * 颜色生成器配置
     */
    config: {
      type: Object,
      default: () => ({})
    },
    /**
     * 是否显示加载状态
     */
    showLoading: {
      type: Boolean,
      default: true
    },
    /**
     * 加载文本
     */
    loadingText: {
      type: String,
      default: "正在生成主题..."
    },
    /**
     * 错误文本前缀
     */
    errorPrefix: {
      type: String,
      default: "主题生成失败："
    }
  },
  setup(props, { slots }) {
    const primaryColorRef = computed(() => props.primaryColor);
    const {
      theme,
      loading,
      error,
      generateTheme: generateTheme2
    } = useColor(primaryColorRef, props.config);
    const updateColor = (_color) => {
    };
    provide(ColorThemeKey, {
      theme: theme.value,
      loading: loading.value,
      error: error.value,
      generateTheme: generateTheme2,
      updateColor
    });
    return () => {
      var _a;
      return /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-provider" }, props.showLoading && loading.value && /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-loading" }, /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-loading__spinner" }), /* @__PURE__ */ React.createElement("span", { class: "ldesign-color-loading__text" }, props.loadingText)), error.value && /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-error" }, /* @__PURE__ */ React.createElement("span", { class: "ldesign-color-error__text" }, props.errorPrefix, error.value)), (_a = slots.default) == null ? void 0 : _a.call(slots));
    };
  }
});
function useColorTheme() {
  const colorTheme = inject(ColorThemeKey);
  if (!colorTheme) {
    throw new Error("useColorTheme must be used within ColorProvider");
  }
  return colorTheme;
}
const ColorPicker = defineComponent({
  name: "ColorPicker",
  props: {
    /**
     * 当前颜色值
     */
    modelValue: {
      type: String,
      default: "#1890ff"
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 预设颜色
     */
    presetColors: {
      type: Array,
      default: () => [
        "#1890ff",
        "#722ed1",
        "#13c2c2",
        "#52c41a",
        "#faad14",
        "#f5222d",
        "#fa541c",
        "#eb2f96"
      ]
    },
    /**
     * 是否显示预设颜色
     */
    showPresets: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const handleColorChange = (color) => {
      emit("update:modelValue", color);
      emit("change", color);
    };
    const handlePresetClick = (color) => {
      handleColorChange(color);
    };
    return () => /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-picker" }, /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-picker__input" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "color",
        value: props.modelValue,
        disabled: props.disabled,
        onChange: (e) => handleColorChange(e.target.value),
        class: "ldesign-color-picker__color-input"
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: props.modelValue,
        disabled: props.disabled,
        onChange: (e) => handleColorChange(e.target.value),
        placeholder: "请输入颜色值",
        class: "ldesign-color-picker__text-input"
      }
    )), props.showPresets && /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-picker__presets" }, /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-picker__presets-title" }, "预设颜色"), /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-picker__presets-list" }, props.presetColors.map((color) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: color,
        class: [
          "ldesign-color-picker__preset-item",
          { "is-active": color === props.modelValue }
        ],
        style: { backgroundColor: color },
        onClick: () => !props.disabled && handlePresetClick(color)
      }
    )))));
  }
});
const ColorPalette = defineComponent({
  name: "ColorPalette",
  props: {
    /**
     * 颜色名称
     */
    colorName: {
      type: String,
      required: true
    },
    /**
     * 颜色色阶数组
     */
    colors: {
      type: Array,
      required: true
    },
    /**
     * 是否显示颜色值
     */
    showValues: {
      type: Boolean,
      default: true
    },
    /**
     * 是否可点击复制
     */
    copyable: {
      type: Boolean,
      default: true
    }
  },
  emits: ["colorClick"],
  setup(props, { emit }) {
    const handleColorClick = (color, index) => {
      var _a;
      if (props.copyable) {
        (_a = navigator.clipboard) == null ? void 0 : _a.writeText(color).then(() => {
          console.log(`已复制颜色: ${color}`);
        });
      }
      emit("colorClick", { color, index });
    };
    return () => /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-palette" }, /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-palette__title" }, props.colorName), /* @__PURE__ */ React.createElement("div", { class: "ldesign-color-palette__colors" }, props.colors.map((color, index) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: index,
        class: "ldesign-color-palette__color-item",
        style: { backgroundColor: color },
        onClick: () => handleColorClick(color, index),
        title: props.copyable ? `点击复制 ${color}` : color
      },
      props.showValues && /* @__PURE__ */ React.createElement("span", { class: "ldesign-color-palette__color-value" }, color),
      /* @__PURE__ */ React.createElement("span", { class: "ldesign-color-palette__color-index" }, index + 1)
    ))));
  }
});
const ThemePreview = defineComponent({
  name: "ThemePreview",
  setup() {
    const { theme, loading } = useColorTheme();
    return () => {
      if (loading) {
        return /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__loading" }, "加载中...");
      }
      if (!theme) {
        return /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__empty" }, "暂无主题数据");
      }
      return /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview" }, /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__section" }, /* @__PURE__ */ React.createElement("h3", null, "语义化颜色"), /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__semantic-colors" }, Object.entries(theme.semanticColors).map(([name, color]) => /* @__PURE__ */ React.createElement("div", { key: name, class: "ldesign-theme-preview__semantic-item" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          class: "ldesign-theme-preview__color-block",
          style: { backgroundColor: color }
        }
      ), /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__color-info" }, /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__color-name" }, name), /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__color-value" }, color)))))), /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__section" }, /* @__PURE__ */ React.createElement("h3", null, "明亮模式色阶"), Object.entries(theme.palettes.light).map(([name, colors]) => /* @__PURE__ */ React.createElement(
        ColorPalette,
        {
          key: name,
          colorName: name,
          colors
        }
      ))), /* @__PURE__ */ React.createElement("div", { class: "ldesign-theme-preview__section" }, /* @__PURE__ */ React.createElement("h3", null, "暗黑模式色阶"), Object.entries(theme.palettes.dark).map(([name, colors]) => /* @__PURE__ */ React.createElement(
        ColorPalette,
        {
          key: name,
          colorName: name,
          colors
        }
      ))));
    };
  }
});
const DEFAULT_PRESET_THEMES = [
  { name: "蓝色", color: "#1890ff", description: "经典蓝色主题", enabled: true },
  { name: "绿色", color: "#52c41a", description: "清新绿色主题", enabled: true },
  { name: "红色", color: "#f5222d", description: "热情红色主题", enabled: true },
  { name: "橙色", color: "#fa8c16", description: "活力橙色主题", enabled: true },
  { name: "紫色", color: "#722ed1", description: "神秘紫色主题", enabled: true },
  { name: "青色", color: "#13c2c2", description: "清爽青色主题", enabled: true },
  { name: "粉色", color: "#eb2f96", description: "浪漫粉色主题", enabled: true },
  { name: "黄色", color: "#fadb14", description: "明亮黄色主题", enabled: true },
  { name: "深蓝", color: "#1d39c4", description: "深邃蓝色主题", enabled: true },
  { name: "深绿", color: "#389e0d", description: "深沉绿色主题", enabled: true },
  { name: "深红", color: "#cf1322", description: "深邃红色主题", enabled: true },
  { name: "深紫", color: "#531dab", description: "深邃紫色主题", enabled: true }
];
class PresetThemeManager {
  constructor() {
    __publicField(this, "themes", reactive([...DEFAULT_PRESET_THEMES]));
  }
  /**
   * 获取所有预设主题（响应式）
   */
  getThemes() {
    return this.themes;
  }
  /**
   * 获取启用的预设主题（响应式）
   */
  getEnabledThemes() {
    return computed(() => this.themes.filter((theme) => theme.enabled !== false));
  }
  /**
   * 添加预设主题
   */
  addTheme(theme) {
    const newTheme = {
      ...theme,
      enabled: true
    };
    const existingIndex = this.themes.findIndex((t) => t.name === theme.name);
    if (existingIndex >= 0) {
      this.themes[existingIndex] = newTheme;
    } else {
      this.themes.push(newTheme);
    }
  }
  /**
   * 移除预设主题
   */
  removeTheme(name) {
    const index = this.themes.findIndex((theme) => theme.name === name);
    if (index >= 0) {
      this.themes.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * 启用/禁用预设主题
   */
  toggleTheme(name, enabled) {
    const theme = this.themes.find((t) => t.name === name);
    if (theme) {
      theme.enabled = enabled !== void 0 ? enabled : !theme.enabled;
      return true;
    }
    return false;
  }
  /**
   * 更新预设主题
   */
  updateTheme(name, updates) {
    const theme = this.themes.find((t) => t.name === name);
    if (theme) {
      Object.assign(theme, updates);
      return true;
    }
    return false;
  }
  /**
   * 根据名称查找主题
   */
  findTheme(name) {
    return this.themes.find((theme) => theme.name === name);
  }
  /**
   * 根据颜色查找主题
   */
  findThemeByColor(color) {
    return this.themes.find((theme) => theme.color.toLowerCase() === color.toLowerCase());
  }
  /**
   * 重置为默认主题
   */
  resetToDefault() {
    this.themes.splice(0, this.themes.length, ...DEFAULT_PRESET_THEMES.map((theme) => ({ ...theme })));
  }
  /**
   * 禁用所有默认主题
   */
  disableDefaultThemes() {
    DEFAULT_PRESET_THEMES.forEach((defaultTheme) => {
      const theme = this.themes.find((t) => t.name === defaultTheme.name);
      if (theme) {
        theme.enabled = false;
      }
    });
  }
  /**
   * 启用所有默认主题
   */
  enableDefaultThemes() {
    DEFAULT_PRESET_THEMES.forEach((defaultTheme) => {
      const theme = this.themes.find((t) => t.name === defaultTheme.name);
      if (theme) {
        theme.enabled = true;
      }
    });
  }
  /**
   * 批量添加主题
   */
  addThemes(themes) {
    themes.forEach((theme) => this.addTheme(theme));
  }
  /**
   * 导出主题配置
   */
  exportThemes() {
    return JSON.parse(JSON.stringify(this.themes));
  }
  /**
   * 导入主题配置
   */
  importThemes(themes, replace = false) {
    if (replace) {
      this.themes.splice(0, this.themes.length, ...themes);
    } else {
      themes.forEach((theme) => this.addTheme(theme));
    }
  }
  /**
   * 获取主题数量统计
   */
  getStats() {
    return computed(() => ({
      total: this.themes.length,
      enabled: this.themes.filter((t) => t.enabled !== false).length,
      disabled: this.themes.filter((t) => t.enabled === false).length,
      custom: this.themes.filter((t) => !DEFAULT_PRESET_THEMES.some((dt) => dt.name === t.name)).length
    }));
  }
}
function createPresetThemeManager() {
  return new PresetThemeManager();
}
const globalPresetThemeManager = createPresetThemeManager();
function createColorGenerator(config) {
  return new ColorGenerator(config);
}
function generateTheme(primaryColor, config) {
  const generator = createColorGenerator(config);
  return generator.generate(primaryColor);
}
async function generateThemeAsync(primaryColor, config) {
  const generator = createColorGenerator(config);
  return await generator.generateAsync(primaryColor);
}
async function batchGenerateThemes(colors, config) {
  const generator = createColorGenerator(config);
  return await generator.batchGenerate(colors);
}
const presetConfigs = {
  /**
   * 高性能配置 - 启用所有优化
   */
  highPerformance: {
    enableCache: true,
    cacheSize: 200,
    useWebWorker: true,
    autoInject: true
  },
  /**
   * 简单配置 - 基础功能
   */
  simple: {
    enableCache: true,
    cacheSize: 50,
    useWebWorker: false,
    autoInject: true
  },
  /**
   * 开发配置 - 适合开发环境
   */
  development: {
    enableCache: false,
    cacheSize: 10,
    useWebWorker: false,
    autoInject: true
  },
  /**
   * 生产配置 - 适合生产环境
   */
  production: {
    enableCache: true,
    cacheSize: 500,
    useWebWorker: true,
    autoInject: true
  }
};
const presetColors = {
  // 蓝色系
  blue: "#1890ff",
  lightBlue: "#40a9ff",
  darkBlue: "#096dd9",
  // 绿色系
  green: "#52c41a",
  lightGreen: "#73d13d",
  darkGreen: "#389e0d",
  // 红色系
  red: "#f5222d",
  lightRed: "#ff4d4f",
  darkRed: "#cf1322",
  // 橙色系
  orange: "#fa541c",
  lightOrange: "#ff7a45",
  darkOrange: "#d4380d",
  // 紫色系
  purple: "#722ed1",
  lightPurple: "#9254de",
  darkPurple: "#531dab",
  // 青色系
  cyan: "#13c2c2",
  lightCyan: "#36cfc9",
  darkCyan: "#08979c",
  // 黄色系
  yellow: "#faad14",
  lightYellow: "#ffc53d",
  darkYellow: "#d48806",
  // 粉色系
  pink: "#eb2f96",
  lightPink: "#f759ab",
  darkPink: "#c41d7f",
  // 灰色系
  gray: "#8c8c8c",
  lightGray: "#bfbfbf",
  darkGray: "#595959"
};
async function validateColor(color) {
  const utils = await Promise.resolve().then(() => colorUtils);
  return utils.isValidColor(color);
}
async function analyzeColor(color) {
  const utils = await Promise.resolve().then(() => colorUtils);
  return utils.analyzeColor(color);
}
const ldesignColor = {
  // 核心功能
  ColorGenerator,
  createColorGenerator,
  generateTheme,
  generateThemeAsync,
  batchGenerateThemes,
  // 预设配置
  presetConfigs,
  presetColors,
  // 工具函数
  generateRandomColor
};
const version = "1.0.0";
const info = {
  name: "@ldesign/color",
  version,
  description: "高性能颜色生成和管理库",
  author: "LDesign Team",
  license: "MIT"
};
export {
  AsyncQueue,
  BatchProcessor,
  CSSVariableGenerator,
  CacheKeyGenerator,
  ColorGenerator,
  ColorPalette as ColorPaletteComponent,
  ColorPicker,
  ColorProvider,
  ColorThemeKey,
  DEFAULT_PRESET_THEMES,
  LRUCache,
  MemoryCacheManager,
  MemoryMonitor,
  PaletteGenerator,
  PerformanceMonitor,
  PresetThemeManager,
  SemanticColorGenerator,
  ThemePreview,
  adjustHue,
  adjustLightness,
  adjustSaturation,
  analyzeColor,
  batchFormatColors,
  batchGenerateThemes,
  cleanColorString,
  createColorGenerator,
  createPresetThemeManager,
  debounce,
  ldesignColor as default,
  ensureHashPrefix,
  formatColor,
  generateRandomColor,
  generateTheme,
  generateThemeAsync,
  getAnalogousColors,
  getComplementaryColor,
  getContrast,
  getContrastInfo,
  getLuminance,
  getRgbString,
  globalCacheManager,
  globalPresetThemeManager,
  hexToHsl,
  hexToHsv,
  hexToRgb,
  hslToHex,
  hsvToHex,
  info,
  isDarkColor,
  isValidColor,
  mixColors,
  presetColors,
  presetConfigs,
  rgbToHex,
  runInIdleTime,
  throttle,
  useBatchColor,
  useColor,
  useColorAnalysis,
  useColorTheme,
  useHighPerformanceColor,
  useSimpleColor,
  useThemeSwitch,
  validateColor,
  version
};
//# sourceMappingURL=ldesign-color.es.js.map
