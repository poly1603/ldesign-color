/**
 * @ldesign/color - Advanced Color Spaces
 * 
 * Implementation of OKLAB, OKLCH, LAB, LCH, and XYZ color spaces
 * Based on Björn Ottosson's OKLAB: https://bottosson.github.io/posts/oklab/
 */

import type { LAB, LCH, OKLAB, OKLCH, RGB, XYZ } from '../types';
import { clamp, round } from '../utils/math';

// ============================================
// Constants
// ============================================

// sRGB to Linear RGB conversion
const SRGB_TO_LINEAR_THRESHOLD = 0.04045;
const SRGB_TO_LINEAR_FACTOR = 1 / 12.92;
const SRGB_TO_LINEAR_OFFSET = 0.055;
const SRGB_TO_LINEAR_GAMMA = 2.4;

// Linear RGB to sRGB conversion
const LINEAR_TO_SRGB_THRESHOLD = 0.0031308;
const LINEAR_TO_SRGB_SLOPE = 12.92;
const LINEAR_TO_SRGB_A = 1.055;
const LINEAR_TO_SRGB_GAMMA = 1 / 2.4;

// D65 white point for XYZ
const D65_X = 95.047;
const D65_Y = 100.0;
const D65_Z = 108.883;

// LAB constants
const LAB_EPSILON = 216 / 24389;
const LAB_KAPPA = 24389 / 27;
const LAB_DELTA = 6 / 29;

// ============================================
// RGB <-> Linear RGB
// ============================================

/**
 * Convert sRGB channel to linear RGB - Optimized
 */
function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= SRGB_TO_LINEAR_THRESHOLD
    ? c * SRGB_TO_LINEAR_FACTOR
    : Math.pow((c + SRGB_TO_LINEAR_OFFSET) / 1.055, SRGB_TO_LINEAR_GAMMA);
}

/**
 * Convert linear RGB to sRGB channel - Optimized
 */
function linearToSrgb(channel: number): number {
  const c = channel <= LINEAR_TO_SRGB_THRESHOLD
    ? channel * LINEAR_TO_SRGB_SLOPE
    : LINEAR_TO_SRGB_A * Math.pow(channel, LINEAR_TO_SRGB_GAMMA) - SRGB_TO_LINEAR_OFFSET;
  return Math.round(clamp(c * 255, 0, 255));
}

// ============================================
// RGB <-> XYZ
// ============================================

/**
 * Convert RGB to XYZ color space (D65 illuminant)
 */
export function rgbToXYZ(rgb: RGB): XYZ {
  // Convert to linear RGB
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  // Apply sRGB to XYZ transformation matrix (D65)
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  return {
    x: x * 100,
    y: y * 100,
    z: z * 100,
    ...(rgb.a !== undefined && { alpha: rgb.a })
  };
}

/**
 * Convert XYZ to RGB color space
 */
export function xyzToRGB(xyz: XYZ): RGB {
  // Normalize XYZ values
  const x = xyz.x / 100;
  const y = xyz.y / 100;
  const z = xyz.z / 100;

  // Apply XYZ to sRGB transformation matrix (D65)
  const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560;
  const b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
    ...(xyz.alpha !== undefined && { a: xyz.alpha })
  };
}

// ============================================
// XYZ <-> LAB
// ============================================

/**
 * LAB f function
 */
function labF(t: number): number {
  return t > LAB_EPSILON
    ? Math.cbrt(t)
    : (LAB_KAPPA * t + 16) / 116;
}

/**
 * LAB f inverse function
 */
function labFInv(t: number): number {
  const t3 = t * t * t;
  return t3 > LAB_EPSILON
    ? t3
    : (116 * t - 16) / LAB_KAPPA;
}

/**
 * Convert XYZ to LAB color space (CIE L*a*b*)
 */
export function xyzToLAB(xyz: XYZ): LAB {
  // Normalize to D65 white point
  const x = labF(xyz.x / D65_X);
  const y = labF(xyz.y / D65_Y);
  const z = labF(xyz.z / D65_Z);

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return {
    l: clamp(l, 0, 100),
    a: clamp(a, -128, 127),
    b: clamp(b, -128, 127),
    ...(xyz.alpha !== undefined && { alpha: xyz.alpha })
  };
}

/**
 * Convert LAB to XYZ color space
 */
export function labToXYZ(lab: LAB): XYZ {
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const x = labFInv(fx) * D65_X;
  const y = labFInv(fy) * D65_Y;
  const z = labFInv(fz) * D65_Z;

  return {
    x,
    y,
    z,
    ...(lab.alpha !== undefined && { alpha: lab.alpha })
  };
}

/**
 * Convert RGB to LAB color space
 */
export function rgbToLAB(rgb: RGB): LAB {
  return xyzToLAB(rgbToXYZ(rgb));
}

/**
 * Convert LAB to RGB color space
 */
export function labToRGB(lab: LAB): RGB {
  return xyzToRGB(labToXYZ(lab));
}

// ============================================
// LAB <-> LCH
// ============================================

/**
 * Convert LAB to LCH (cylindrical representation)
 */
export function labToLCH(lab: LAB): LCH {
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = Math.atan2(lab.b, lab.a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return {
    l: lab.l,
    c,
    h,
    ...(lab.alpha !== undefined && { alpha: lab.alpha })
  };
}

/**
 * Convert LCH to LAB
 */
export function lchToLAB(lch: LCH): LAB {
  const hRad = lch.h * (Math.PI / 180);
  const a = lch.c * Math.cos(hRad);
  const b = lch.c * Math.sin(hRad);

  return {
    l: lch.l,
    a,
    b,
    ...(lch.alpha !== undefined && { alpha: lch.alpha })
  };
}

/**
 * Convert RGB to LCH color space
 */
export function rgbToLCH(rgb: RGB): LCH {
  return labToLCH(rgbToLAB(rgb));
}

/**
 * Convert LCH to RGB color space
 */
export function lchToRGB(lch: LCH): RGB {
  return labToRGB(lchToLAB(lch));
}

// ============================================
// RGB <-> OKLAB (Björn Ottosson's perceptually uniform color space)
// ============================================

/**
 * Convert RGB to OKLAB color space
 * OKLAB is a perceptually uniform color space by Björn Ottosson
 */
export function rgbToOKLAB(rgb: RGB): OKLAB {
  // Convert to linear RGB
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  // Transform to LMS cone space (approximate)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // Apply cube root (non-linearity)
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // Transform to OKLAB
  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    ...(rgb.a !== undefined && { alpha: rgb.a })
  };
}

/**
 * Convert OKLAB to RGB color space
 */
export function oklabToRGB(oklab: OKLAB): RGB {
  // Transform from OKLAB to LMS cone space
  const l_ = oklab.l + 0.3963377774 * oklab.a + 0.2158037573 * oklab.b;
  const m_ = oklab.l - 0.1055613458 * oklab.a - 0.0638541728 * oklab.b;
  const s_ = oklab.l - 0.0894841775 * oklab.a - 1.2914855480 * oklab.b;

  // Apply cube (inverse of cube root)
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // Transform to linear RGB
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
    ...(oklab.alpha !== undefined && { a: oklab.alpha })
  };
}

// ============================================
// OKLAB <-> OKLCH
// ============================================

/**
 * Convert OKLAB to OKLCH (cylindrical representation)
 */
export function oklabToOKLCH(oklab: OKLAB): OKLCH {
  const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
  let h = Math.atan2(oklab.b, oklab.a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return {
    l: oklab.l,
    c,
    h,
    ...(oklab.alpha !== undefined && { alpha: oklab.alpha })
  };
}

/**
 * Convert OKLCH to OKLAB
 */
export function oklchToOKLAB(oklch: OKLCH): OKLAB {
  const hRad = oklch.h * (Math.PI / 180);
  const a = oklch.c * Math.cos(hRad);
  const b = oklch.c * Math.sin(hRad);

  return {
    l: oklch.l,
    a,
    b,
    ...(oklch.alpha !== undefined && { alpha: oklch.alpha })
  };
}

/**
 * Convert RGB to OKLCH color space
 */
export function rgbToOKLCH(rgb: RGB): OKLCH {
  return oklabToOKLCH(rgbToOKLAB(rgb));
}

/**
 * Convert OKLCH to RGB color space
 */
export function oklchToRGB(oklch: OKLCH): RGB {
  return oklabToRGB(oklchToOKLAB(oklch));
}

// ============================================
// Delta E (Color Difference)
// ============================================

/**
 * Calculate Delta E 2000 - perceptual color difference
 * Returns a value where 0 = identical, <1 = imperceptible, 1-2 = barely perceptible
 */
export function deltaE2000(rgb1: RGB, rgb2: RGB): number {
  const lab1 = rgbToLAB(rgb1);
  const lab2 = rgbToLAB(rgb2);

  // Calculate C (chroma) for both colors
  const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const cAvg = (c1 + c2) / 2;

  // Calculate a' (adjusted a)
  const g = 0.5 * (1 - Math.sqrt(Math.pow(cAvg, 7) / (Math.pow(cAvg, 7) + Math.pow(25, 7))));
  const a1Prime = lab1.a * (1 + g);
  const a2Prime = lab2.a * (1 + g);

  // Calculate C' and h'
  const c1Prime = Math.sqrt(a1Prime * a1Prime + lab1.b * lab1.b);
  const c2Prime = Math.sqrt(a2Prime * a2Prime + lab2.b * lab2.b);

  let h1Prime = Math.atan2(lab1.b, a1Prime) * (180 / Math.PI);
  if (h1Prime < 0) h1Prime += 360;

  let h2Prime = Math.atan2(lab2.b, a2Prime) * (180 / Math.PI);
  if (h2Prime < 0) h2Prime += 360;

  // Calculate differences
  const deltaLPrime = lab2.l - lab1.l;
  const deltaCPrime = c2Prime - c1Prime;

  let deltaHPrime = h2Prime - h1Prime;
  if (c1Prime * c2Prime === 0) {
    deltaHPrime = 0;
  } else if (Math.abs(deltaHPrime) <= 180) {
    // Already correct
  } else if (deltaHPrime > 180) {
    deltaHPrime -= 360;
  } else {
    deltaHPrime += 360;
  }

  const deltaHPrimeRad = (2 * Math.sqrt(c1Prime * c2Prime) * Math.sin((deltaHPrime / 2) * Math.PI / 180));

  // Calculate averages
  const lPrimeAvg = (lab1.l + lab2.l) / 2;
  const cPrimeAvg = (c1Prime + c2Prime) / 2;

  let hPrimeAvg = (h1Prime + h2Prime) / 2;
  if (c1Prime * c2Prime === 0) {
    hPrimeAvg = h1Prime + h2Prime;
  } else if (Math.abs(h1Prime - h2Prime) <= 180) {
    hPrimeAvg = (h1Prime + h2Prime) / 2;
  } else if (h1Prime + h2Prime < 360) {
    hPrimeAvg = (h1Prime + h2Prime + 360) / 2;
  } else {
    hPrimeAvg = (h1Prime + h2Prime - 360) / 2;
  }

  // Calculate T
  const t = 1 - 0.17 * Math.cos((hPrimeAvg - 30) * Math.PI / 180)
    + 0.24 * Math.cos(2 * hPrimeAvg * Math.PI / 180)
    + 0.32 * Math.cos((3 * hPrimeAvg + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * hPrimeAvg - 63) * Math.PI / 180);

  // Calculate SL, SC, SH
  const sL = 1 + (0.015 * Math.pow(lPrimeAvg - 50, 2)) / Math.sqrt(20 + Math.pow(lPrimeAvg - 50, 2));
  const sC = 1 + 0.045 * cPrimeAvg;
  const sH = 1 + 0.015 * cPrimeAvg * t;

  // Calculate RT
  const deltaTheta = 30 * Math.exp(-Math.pow((hPrimeAvg - 275) / 25, 2));
  const rC = 2 * Math.sqrt(Math.pow(cPrimeAvg, 7) / (Math.pow(cPrimeAvg, 7) + Math.pow(25, 7)));
  const rT = -rC * Math.sin(2 * deltaTheta * Math.PI / 180);

  // Calculate final Delta E 2000
  const deltaE = Math.sqrt(
    Math.pow(deltaLPrime / sL, 2) +
    Math.pow(deltaCPrime / sC, 2) +
    Math.pow(deltaHPrimeRad / sH, 2) +
    rT * (deltaCPrime / sC) * (deltaHPrimeRad / sH)
  );

  return round(deltaE, 2);
}

/**
 * Calculate simple Euclidean distance in OKLAB space
 * Faster alternative to Delta E 2000 for approximate comparisons
 */
export function deltaEOKLAB(rgb1: RGB, rgb2: RGB): number {
  const oklab1 = rgbToOKLAB(rgb1);
  const oklab2 = rgbToOKLAB(rgb2);

  const dl = oklab1.l - oklab2.l;
  const da = oklab1.a - oklab2.a;
  const db = oklab1.b - oklab2.b;

  return Math.sqrt(dl * dl + da * da + db * db);
}


