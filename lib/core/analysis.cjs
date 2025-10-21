"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */function a(r){const n=[r.r/255,r.g/255,r.b/255].map(e=>e<=.03928?e/12.92:((e+.055)/1.055)**2.4);return .2126*n[0]+.7152*n[1]+.0722*n[2]}function u(r,n){const e=a(r),t=a(n),o=Math.max(e,t),i=Math.min(e,t);return(o+.05)/(i+.05)}function l(r,n,e="AA",t="normal"){const o=u(r,n),i={AA:{normal:4.5,large:3},AAA:{normal:7,large:4.5}}[e]?.[t]??4.5;return o>=i}function m(r,n){return r==="AA"?n==="large"?3:4.5:r==="AAA"?n==="large"?4.5:7:4.5}function s(r){return Math.sqrt(.299*r.r*r.r+.587*r.g*r.g+.114*r.b*r.b)}function g(r){return s(r)>127.5}function C(r){return!g(r)}function f(r){return g(r)?{r:0,g:0,b:0}:{r:255,g:255,b:255}}function c(r,n){const e=r.r-n.r,t=r.g-n.g,o=r.b-n.b;return Math.sqrt(e*e+t*t+o*o)}function h(r,n,e=30){return c(r,n)<e}function b(r){const n=Math.max(r.r,r.g,r.b),e=Math.min(r.r,r.g,r.b);return n-e<30?"neutral":r.r===n?"red":r.g===n?"green":"blue"}function A(r){const n=Math.max(r.r,r.g,r.b),e=Math.min(r.r,r.g,r.b);return(n-e)/255}function M(r){const n=(r.r-r.b)/255;return n>.2?"warm":n<-.2?"cool":"neutral"}function x(r){const n=Math.max(r.r,r.g,r.b)/255,e=Math.min(r.r,r.g,r.b)/255;return n===0?0:(n-e)/n}exports.areColorsSimilar=h,exports.getBestTextColor=f,exports.getColorDifference=c,exports.getColorIntensity=A,exports.getColorPurity=x,exports.getColorTemperature=M,exports.getContrast=u,exports.getDominantChannel=b,exports.getLuminance=a,exports.getPerceivedBrightness=s,exports.getRequiredContrast=m,exports.isDark=C,exports.isLight=g,exports.isWCAGCompliant=l;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=analysis.cjs.map
