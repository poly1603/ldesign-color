/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */function a(r){const n=[r.r/255,r.g/255,r.b/255].map(e=>e<=.03928?e/12.92:((e+.055)/1.055)**2.4);return .2126*n[0]+.7152*n[1]+.0722*n[2]}function g(r,n){const e=a(r),o=a(n),t=Math.max(e,o),u=Math.min(e,o);return(t+.05)/(u+.05)}function s(r,n,e="AA",o="normal"){const t=g(r,n),u={AA:{normal:4.5,large:3},AAA:{normal:7,large:4.5}}[e]?.[o]??4.5;return t>=u}function m(r,n){return r==="AA"?n==="large"?3:4.5:r==="AAA"?n==="large"?4.5:7:4.5}function c(r){return Math.sqrt(.299*r.r*r.r+.587*r.g*r.g+.114*r.b*r.b)}function i(r){return c(r)>127.5}function f(r){return!i(r)}function b(r){return i(r)?{r:0,g:0,b:0}:{r:255,g:255,b:255}}function l(r,n){const e=r.r-n.r,o=r.g-n.g,t=r.b-n.b;return Math.sqrt(e*e+o*o+t*t)}function h(r,n,e=30){return l(r,n)<e}function A(r){const n=Math.max(r.r,r.g,r.b),e=Math.min(r.r,r.g,r.b);return n-e<30?"neutral":r.r===n?"red":r.g===n?"green":"blue"}function C(r){const n=Math.max(r.r,r.g,r.b),e=Math.min(r.r,r.g,r.b);return(n-e)/255}function M(r){const n=(r.r-r.b)/255;return n>.2?"warm":n<-.2?"cool":"neutral"}function x(r){const n=Math.max(r.r,r.g,r.b)/255,e=Math.min(r.r,r.g,r.b)/255;return n===0?0:(n-e)/n}/*! End of @ldesign/color | Powered by @ldesign/builder */export{h as areColorsSimilar,b as getBestTextColor,l as getColorDifference,C as getColorIntensity,x as getColorPurity,M as getColorTemperature,g as getContrast,A as getDominantChannel,a as getLuminance,c as getPerceivedBrightness,m as getRequiredContrast,f as isDark,i as isLight,s as isWCAGCompliant};
//# sourceMappingURL=analysis.js.map
