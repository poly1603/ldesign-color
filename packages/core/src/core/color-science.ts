/**
 * 颜色科学模块 - 提供高级颜色分析和比较功能
 * 
 * @module color-science
 * @description
 * 本模块提供基于颜色科学的高级功能，包括:
 * - 精确的色差计算(Delta E系列算法)
 * - 颜色相似度分析
 * - 调色板多样性评估
 * - 颜色可区分性判断
 */

import type { Color } from './Color';
import { rgbToLAB } from './colorSpaces';

/**
 * Delta E 计算选项
 */
export interface DeltaEOptions {
  /** 使用的算法: '76' | '94' | '2000' | 'CMC' */
  algorithm?: '76' | '94' | '2000' | 'CMC';
  /** CIE94 的应用类型: 'graphic-arts' | 'textiles' */
  application?: 'graphic-arts' | 'textiles';
  /** CMC 的 l:c 比例 (lightness:chroma) */
  lightness?: number;
  chroma?: number;
}

/**
 * 颜色相似度结果
 */
export interface ColorSimilarity {
  /** 相似度分数 (0-1, 1表示完全相同) */
  similarity: number;
  /** 色差值 (Delta E) */
  deltaE: number;
  /** 使用的算法 */
  algorithm: string;
  /** 是否可感知差异 */
  perceptible: boolean;
}

/**
 * 调色板多样性分析结果
 */
export interface PaletteDiversityAnalysis {
  /** 整体多样性分数 (0-1) */
  diversityScore: number;
  /** 平均色差 */
  averageDeltaE: number;
  /** 最小色差 */
  minDeltaE: number;
  /** 最大色差 */
  maxDeltaE: number;
  /** 色差标准差 */
  standardDeviation: number;
  /** 可区分颜色对的百分比 */
  distinguishablePercentage: number;
  /** 颜色聚类数量 */
  clusterCount: number;
}

/**
 * CIE76 色差计算 (最简单但不够准确)
 * 
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @returns 色差值 (0表示相同)
 * 
 * @remarks
 * - DeltaE < 1: 人眼几乎无法察觉
 * - DeltaE 1-2: 细微差异，需仔细观察
 * - DeltaE 2-10: 可感知差异
 * - DeltaE > 10: 明显不同的颜色
 */
export function deltaE76(color1: Color, color2: Color): number {
  const lab1 = rgbToLAB(color1.toRGB());
  const lab2 = rgbToLAB(color2.toRGB());

  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;

  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * CIE94 色差计算 (改进版，考虑了人眼感知)
 * 
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @param application - 应用类型 ('graphic-arts' 或 'textiles')
 * @returns 色差值
 */
export function deltaE94(
  color1: Color,
  color2: Color,
  application: 'graphic-arts' | 'textiles' = 'graphic-arts'
): number {
  const lab1 = rgbToLAB(color1.toRGB());
  const lab2 = rgbToLAB(color2.toRGB());

  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;

  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const dC = C1 - C2;

  const dH = Math.sqrt(Math.max(0, da * da + db * db - dC * dC));

  // 权重因子
  const kL = 1;
  const K1 = application === 'textiles' ? 0.048 : 0.045;
  const K2 = application === 'textiles' ? 0.014 : 0.015;
  const kC = 1;
  const kH = 1;

  const SL = 1;
  const SC = 1 + K1 * C1;
  const SH = 1 + K2 * C1;

  const dLTerm = dL / (kL * SL);
  const dCTerm = dC / (kC * SC);
  const dHTerm = dH / (kH * SH);

  return Math.sqrt(dLTerm * dLTerm + dCTerm * dCTerm + dHTerm * dHTerm);
}

/**
 * CIEDE2000 色差计算 (最精确的工业标准算法)
 * 
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @returns 色差值
 * 
 * @remarks
 * CIEDE2000 是目前最准确的色差公式，被广泛应用于工业和科研领域
 */
export function deltaE2000(color1: Color, color2: Color): number {
  const lab1 = rgbToLAB(color1.toRGB());
  const lab2 = rgbToLAB(color2.toRGB());

  // 计算C和h
  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const Cab = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cab, 7) / (Math.pow(Cab, 7) + Math.pow(25, 7))));

  const a1p = lab1.a * (1 + G);
  const a2p = lab2.a * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + lab1.b * lab1.b);
  const C2p = Math.sqrt(a2p * a2p + lab2.b * lab2.b);

  const h1p = (Math.atan2(lab1.b, a1p) * 180) / Math.PI;
  const h2p = (Math.atan2(lab2.b, a2p) * 180) / Math.PI;

  const h1pNorm = h1p >= 0 ? h1p : h1p + 360;
  const h2pNorm = h2p >= 0 ? h2p : h2p + 360;

  // 计算差值
  const dLp = lab2.l - lab1.l;
  const dCp = C2p - C1p;

  let dhp: number;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2pNorm - h1pNorm) <= 180) {
    dhp = h2pNorm - h1pNorm;
  } else if (h2pNorm - h1pNorm > 180) {
    dhp = h2pNorm - h1pNorm - 360;
  } else {
    dhp = h2pNorm - h1pNorm + 360;
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  // 计算平均值
  const Lp = (lab1.l + lab2.l) / 2;
  const Cp = (C1p + C2p) / 2;

  let hp: number;
  if (C1p * C2p === 0) {
    hp = h1pNorm + h2pNorm;
  } else if (Math.abs(h1pNorm - h2pNorm) <= 180) {
    hp = (h1pNorm + h2pNorm) / 2;
  } else if (h1pNorm + h2pNorm < 360) {
    hp = (h1pNorm + h2pNorm + 360) / 2;
  } else {
    hp = (h1pNorm + h2pNorm - 360) / 2;
  }

  // 计算权重因子
  const T =
    1 -
    0.17 * Math.cos(((hp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hp - 63) * Math.PI) / 180);

  const dTheta = 30 * Math.exp(-Math.pow((hp - 275) / 25, 2));

  const RC = 2 * Math.sqrt(Math.pow(Cp, 7) / (Math.pow(Cp, 7) + Math.pow(25, 7)));

  const SL = 1 + (0.015 * Math.pow(Lp - 50, 2)) / Math.sqrt(20 + Math.pow(Lp - 50, 2));
  const SC = 1 + 0.045 * Cp;
  const SH = 1 + 0.015 * Cp * T;

  const RT = -Math.sin((2 * dTheta * Math.PI) / 180) * RC;

  // 最终计算
  const kL = 1;
  const kC = 1;
  const kH = 1;

  const term1 = dLp / (kL * SL);
  const term2 = dCp / (kC * SC);
  const term3 = dHp / (kH * SH);
  const term4 = RT * term2 * term3;

  return Math.sqrt(term1 * term1 + term2 * term2 + term3 * term3 + term4);
}

/**
 * CMC l:c 色差计算 (纺织工业标准)
 * 
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @param l - lightness 权重 (默认2)
 * @param c - chroma 权重 (默认1)
 * @returns 色差值
 */
export function deltaECMC(color1: Color, color2: Color, l: number = 2, c: number = 1): number {
  const lab1 = rgbToLAB(color1.toRGB());
  const lab2 = rgbToLAB(color2.toRGB());

  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);

  const dL = lab1.l - lab2.l;
  const dC = C1 - C2;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  const dH = Math.sqrt(Math.max(0, da * da + db * db - dC * dC));

  const H1 = (Math.atan2(lab1.b, lab1.a) * 180) / Math.PI;
  const H1Norm = H1 >= 0 ? H1 : H1 + 360;

  const F = Math.sqrt(Math.pow(C1, 4) / (Math.pow(C1, 4) + 1900));

  const T =
    H1Norm >= 164 && H1Norm <= 345
      ? 0.56 + Math.abs(0.2 * Math.cos(((H1Norm + 168) * Math.PI) / 180))
      : 0.36 + Math.abs(0.4 * Math.cos(((H1Norm + 35) * Math.PI) / 180));

  const SL = lab1.l < 16 ? 0.511 : (0.040975 * lab1.l) / (1 + 0.01765 * lab1.l);
  const SC = (0.0638 * C1) / (1 + 0.0131 * C1) + 0.638;
  const SH = SC * (F * T + 1 - F);

  const term1 = dL / (l * SL);
  const term2 = dC / (c * SC);
  const term3 = dH / SH;

  return Math.sqrt(term1 * term1 + term2 * term2 + term3 * term3);
}

/**
 * 计算颜色相似度 (返回0-1的分数，1表示完全相同)
 * 
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @param options - 计算选项
 * @returns 相似度分析结果
 */
export function colorSimilarity(
  color1: Color,
  color2: Color,
  options: DeltaEOptions = {}
): ColorSimilarity {
  const algorithm = options.algorithm || '2000';
  let deltaE: number;

  switch (algorithm) {
    case '76':
      deltaE = deltaE76(color1, color2);
      break;
    case '94':
      deltaE = deltaE94(color1, color2, options.application);
      break;
    case 'CMC':
      deltaE = deltaECMC(color1, color2, options.lightness, options.chroma);
      break;
    case '2000':
    default:
      deltaE = deltaE2000(color1, color2);
      break;
  }

  // 将 Delta E 转换为相似度分数 (0-1)
  // 使用指数衰减函数: similarity = exp(-deltaE / k)
  // k = 10 时，deltaE = 10 时 similarity ≈ 0.37
  const k = 10;
  const similarity = Math.exp(-deltaE / k);

  // JND (Just Noticeable Difference) 阈值
  const jndThreshold = algorithm === '2000' ? 2.3 : algorithm === '94' ? 2.5 : 2.3;
  const perceptible = deltaE > jndThreshold;

  return {
    similarity,
    deltaE,
    algorithm,
    perceptible,
  };
}

/**
 * 在颜色数组中查找与目标颜色最接近的颜色
 * 
 * @param targetColor - 目标颜色
 * @param colors - 候选颜色数组
 * @param options - 计算选项
 * @returns 最接近的颜色及其索引
 */
export function findNearestColor(
  targetColor: Color,
  colors: Color[],
  options: DeltaEOptions = {}
): { color: Color; index: number; deltaE: number } {
  const algorithm = options.algorithm || '2000';
  let minDeltaE = Infinity;
  let nearestIndex = -1;

  colors.forEach((color, index) => {
    let deltaE: number;

    switch (algorithm) {
      case '76':
        deltaE = deltaE76(targetColor, color);
        break;
      case '94':
        deltaE = deltaE94(targetColor, color, options.application);
        break;
      case 'CMC':
        deltaE = deltaECMC(targetColor, color, options.lightness, options.chroma);
        break;
      case '2000':
      default:
        deltaE = deltaE2000(targetColor, color);
        break;
    }

    if (deltaE < minDeltaE) {
      minDeltaE = deltaE;
      nearestIndex = index;
    }
  });

  return {
    color: colors[nearestIndex],
    index: nearestIndex,
    deltaE: minDeltaE,
  };
}

/**
 * 查找多个最接近的颜色
 * 
 * @param targetColor - 目标颜色
 * @param colors - 候选颜色数组
 * @param count - 返回的颜色数量
 * @param options - 计算选项
 * @returns 按相似度排序的颜色数组
 */
export function findNearestColors(
  targetColor: Color,
  colors: Color[],
  count: number = 5,
  options: DeltaEOptions = {}
): Array<{ color: Color; index: number; deltaE: number }> {
  const algorithm = options.algorithm || '2000';
  const results: Array<{ color: Color; index: number; deltaE: number }> = [];

  colors.forEach((color, index) => {
    let deltaE: number;

    switch (algorithm) {
      case '76':
        deltaE = deltaE76(targetColor, color);
        break;
      case '94':
        deltaE = deltaE94(targetColor, color, options.application);
        break;
      case 'CMC':
        deltaE = deltaECMC(targetColor, color, options.lightness, options.chroma);
        break;
      case '2000':
      default:
        deltaE = deltaE2000(targetColor, color);
        break;
    }

    results.push({ color, index, deltaE });
  });

  // 按 deltaE 升序排序
  results.sort((a, b) => a.deltaE - b.deltaE);

  // 返回前 count 个结果
  return results.slice(0, Math.min(count, results.length));
}

/**
 * 判断两个颜色在视觉上是否可区分
 * 
 * @param color1 - 第一个颜色
 * @param color2 - 第二个颜色
 * @param threshold - JND阈值 (默认2.3，适用于CIEDE2000)
 * @param options - 计算选项
 * @returns 是否可区分
 */
export function areColorsDistinguishable(
  color1: Color,
  color2: Color,
  threshold: number = 2.3,
  options: DeltaEOptions = {}
): boolean {
  const algorithm = options.algorithm || '2000';
  let deltaE: number;

  switch (algorithm) {
    case '76':
      deltaE = deltaE76(color1, color2);
      break;
    case '94':
      deltaE = deltaE94(color1, color2, options.application);
      break;
    case 'CMC':
      deltaE = deltaECMC(color1, color2, options.lightness, options.chroma);
      break;
    case '2000':
    default:
      deltaE = deltaE2000(color1, color2);
      break;
  }

  return deltaE > threshold;
}

/**
 * 计算颜色数组之间的距离矩阵
 * 
 * @param colors - 颜色数组
 * @param options - 计算选项
 * @returns 距离矩阵 (二维数组)
 */
export function colorDistanceMatrix(
  colors: Color[],
  options: DeltaEOptions = {}
): number[][] {
  const n = colors.length;
  const matrix: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  const algorithm = options.algorithm || '2000';

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let deltaE: number;

      switch (algorithm) {
        case '76':
          deltaE = deltaE76(colors[i], colors[j]);
          break;
        case '94':
          deltaE = deltaE94(colors[i], colors[j], options.application);
          break;
        case 'CMC':
          deltaE = deltaECMC(colors[i], colors[j], options.lightness, options.chroma);
          break;
        case '2000':
        default:
          deltaE = deltaE2000(colors[i], colors[j]);
          break;
      }

      matrix[i][j] = deltaE;
      matrix[j][i] = deltaE; // 对称矩阵
    }
  }

  return matrix;
}

/**
 * 分析调色板的多样性
 * 
 * @param colors - 颜色数组
 * @param options - 计算选项
 * @returns 多样性分析结果
 */
export function analyzePaletteDiversity(
  colors: Color[],
  options: DeltaEOptions = {}
): PaletteDiversityAnalysis {
  if (colors.length < 2) {
    return {
      diversityScore: 0,
      averageDeltaE: 0,
      minDeltaE: 0,
      maxDeltaE: 0,
      standardDeviation: 0,
      distinguishablePercentage: 0,
      clusterCount: 1,
    };
  }

  // 计算距离矩阵
  const matrix = colorDistanceMatrix(colors, options);
  const n = colors.length;

  // 提取上三角矩阵的所有距离值
  const distances: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      distances.push(matrix[i][j]);
    }
  }

  // 计算统计值
  const minDeltaE = Math.min(...distances);
  const maxDeltaE = Math.max(...distances);
  const averageDeltaE = distances.reduce((sum, d) => sum + d, 0) / distances.length;

  // 计算标准差
  const variance =
    distances.reduce((sum, d) => sum + Math.pow(d - averageDeltaE, 2), 0) / distances.length;
  const standardDeviation = Math.sqrt(variance);

  // 计算可区分颜色对的百分比
  const jndThreshold = options.algorithm === '2000' ? 2.3 : 2.5;
  const distinguishableCount = distances.filter((d) => d > jndThreshold).length;
  const distinguishablePercentage = (distinguishableCount / distances.length) * 100;

  // 简单聚类分析 (基于阈值)
  const clusterThreshold = jndThreshold * 1.5;
  const visited = new Set<number>();
  let clusterCount = 0;

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      clusterCount++;
      const queue = [i];
      visited.add(i);

      while (queue.length > 0) {
        const current = queue.shift()!;
        for (let j = 0; j < n; j++) {
          if (!visited.has(j) && matrix[current][j] < clusterThreshold) {
            visited.add(j);
            queue.push(j);
          }
        }
      }
    }
  }

  // 计算多样性分数 (0-1)
  // 考虑平均距离、标准差和可区分性
  const normalizedAverage = Math.min(averageDeltaE / 50, 1); // 50是一个合理的最大值
  const normalizedStd = Math.min(standardDeviation / 30, 1);
  const diversityScore = (
    normalizedAverage * 0.4 +
    normalizedStd * 0.3 +
    (distinguishablePercentage / 100) * 0.3
  );

  return {
    diversityScore: Math.min(diversityScore, 1),
    averageDeltaE,
    minDeltaE,
    maxDeltaE,
    standardDeviation,
    distinguishablePercentage,
    clusterCount,
  };
}