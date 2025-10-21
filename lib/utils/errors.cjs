"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */exports.ErrorSeverity=void 0,(function(u){u.LOW="low",u.MEDIUM="medium",u.HIGH="high",u.CRITICAL="critical"})(exports.ErrorSeverity||(exports.ErrorSeverity={})),exports.ErrorCategory=void 0,(function(u){u.INPUT_VALIDATION="input_validation",u.COLOR_CONVERSION="color_conversion",u.COLOR_MANIPULATION="color_manipulation",u.CACHE_OPERATION="cache_operation",u.THEME_OPERATION="theme_operation",u.PLUGIN_OPERATION="plugin_operation",u.SYSTEM="system"})(exports.ErrorCategory||(exports.ErrorCategory={}));class i extends Error{constructor(e,r,t,o,s){super(e),e&&this.init(e,r,t,o,s)}init(e,r=exports.ErrorCategory.SYSTEM,t=exports.ErrorSeverity.MEDIUM,o,s){this.message=e,this.name="ColorError",this.severity=t,this.category=r,this.timestamp=Date.now(),this.context=s,this.suggestions=o}static create(e,r=exports.ErrorCategory.SYSTEM,t=exports.ErrorSeverity.MEDIUM,o,s){let a=this.pool.pop();return a||(a=new i),a.init(e,r,t,o,s),a}dispose(){i.pool.length<i.poolSize&&(this.context=void 0,this.suggestions=void 0,this.stack=void 0,i.pool.push(this))}toDetailedString(){const e=[`[${this.name}] ${this.message}`,`Severity: ${this.severity}`,`Category: ${this.category}`,`Timestamp: ${new Date(this.timestamp).toISOString()}`];if(this.context&&e.push(`Context: ${JSON.stringify(this.context)}`),this.suggestions?.length){e.push("Recovery Suggestions:");for(const r of this.suggestions)e.push(`- ${r.action}: ${r.description}`)}return this.stack&&e.push(`Stack: ${this.stack}`),e.join(`
`)}}i.pool=[],i.poolSize=20;class h extends i{constructor(e,r,t){const o=[{action:"\u68C0\u67E5\u8F93\u5165\u683C\u5F0F",description:t||"\u786E\u4FDD\u8F93\u5165\u503C\u7B26\u5408\u652F\u6301\u7684\u989C\u8272\u683C\u5F0F",code:`// \u652F\u6301\u7684\u683C\u5F0F:
// HEX: "#RGB", "#RRGGBB", "#RRGGBBAA"
// RGB: {r: 0-255, g: 0-255, b: 0-255}
// HSL: {h: 0-360, s: 0-100, l: 0-100}
// \u547D\u540D\u989C\u8272: "red", "blue", etc.`},{action:"\u4F7F\u7528\u9ED8\u8BA4\u503C",description:"\u5F53\u8F93\u5165\u65E0\u6548\u65F6\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u989C\u8272\u503C",code:"const color = new Color(input || '#000000');"}];super(e,exports.ErrorCategory.INPUT_VALIDATION,exports.ErrorSeverity.LOW,o,{inputValue:r,expectedFormat:t}),this.name="InputValidationError"}}class l extends i{constructor(e,r,t,o){const s=[{action:"\u68C0\u67E5\u503C\u8303\u56F4",description:`\u786E\u4FDD${r}\u503C\u5728\u6709\u6548\u8303\u56F4\u5185`,code:`// ${r}\u6709\u6548\u8303\u56F4:
${d(r)}`},{action:"\u4F7F\u7528\u5B89\u5168\u8F6C\u6362",description:"\u4F7F\u7528\u5E26\u8303\u56F4\u9650\u5236\u7684\u8F6C\u6362\u65B9\u6CD5",code:"const safeValue = clamp(value, min, max);"}];super(e,exports.ErrorCategory.COLOR_CONVERSION,exports.ErrorSeverity.MEDIUM,s,{fromFormat:r,toFormat:t,value:o}),this.name="ColorConversionError"}}class p extends i{constructor(e,r,t){const o=[{action:"\u68C0\u67E5\u53C2\u6570\u8303\u56F4",description:`\u786E\u4FDD${r}\u64CD\u4F5C\u7684\u53C2\u6570\u5728\u6709\u6548\u8303\u56F4\u5185`,code:`// \u5E38\u89C1\u64CD\u4F5C\u53C2\u6570\u8303\u56F4:
// lighten/darken: 0-100
// saturate/desaturate: 0-100
// rotate: -360 to 360
// alpha: 0-1`},{action:"\u4F7F\u7528\u94FE\u5F0F\u64CD\u4F5C",description:"\u5C06\u590D\u6742\u64CD\u4F5C\u5206\u89E3\u4E3A\u591A\u4E2A\u7B80\u5355\u6B65\u9AA4",code:"color.lighten(10).saturate(20).rotate(30)"}];super(e,exports.ErrorCategory.COLOR_MANIPULATION,exports.ErrorSeverity.LOW,o,{operation:r,parameters:t}),this.name="ColorManipulationError"}}class C extends i{constructor(e,r,t){const o=[{action:"\u9A8C\u8BC1\u4E3B\u9898\u6570\u636E",description:"\u786E\u4FDD\u4E3B\u9898\u6570\u636E\u7ED3\u6784\u6B63\u786E",code:`// \u4E3B\u9898\u7ED3\u6784\u793A\u4F8B:
{
  primaryColor: '#3498db',
  themeName: 'ocean',
  customColors: {...}
}`},{action:"\u4F7F\u7528\u9ED8\u8BA4\u4E3B\u9898",description:"\u56DE\u9000\u5230\u9ED8\u8BA4\u4E3B\u9898\u914D\u7F6E",code:"themeManager.applyTheme('blue')"}];super(e,exports.ErrorCategory.THEME_OPERATION,exports.ErrorSeverity.MEDIUM,o,{operation:r,themeData:t}),this.name="ThemeOperationError"}}class n{static init(){this.initialized||(this.errors=Array.from({length:this.maxErrors}),this.initialized=!0)}static log(e){this.init();const r=this.errors[this.errorIndex];r&&"dispose"in r&&r.dispose(),this.errors[this.errorIndex]=e,this.errorIndex=(this.errorIndex+1)%this.maxErrors;for(const t of this.errorHandlers)t(e)}static getErrors(e){let r=[...this.errors];return e&&(e?.category&&(r=r.filter(t=>t.category===e.category)),e?.severity&&(r=r.filter(t=>t.severity===e.severity)),e.since&&(r=r.filter(t=>{const o=e.since.getTime();return t.timestamp>=o}))),r}static clear(){this.errors=[]}static addHandler(e){return this.errorHandlers.push(e),()=>{const r=this.errorHandlers.indexOf(e);r>-1&&this.errorHandlers.splice(r,1)}}static generateReport(){const e=new Map,r=new Map;return this.errors.forEach(t=>{e.set(t.category,(e.get(t.category)||0)+1),r.set(t.severity,(r.get(t.severity)||0)+1)}),`
Error Report
============
Total Errors: ${this.errors.length}

By Category:
${Array.from(e.entries()).map(([t,o])=>`  ${t}: ${o}`).join(`
`)}

By Severity:
${Array.from(r.entries()).map(([t,o])=>`  ${t}: ${o}`).join(`
`)}

Recent Errors:
${this.errors.slice(-5).map(t=>`  - ${t.message}`).join(`
`)}
    `.trim()}}n.errors=[],n.maxErrors=50,n.errorIndex=0,n.errorHandlers=[],n.initialized=!1;class c{static safeExecute(e,r,t){try{return e()}catch(o){return t&&t(o),r}}static async retryExecute(e,r=3,t=100){let o;for(let s=0;s<r;s++)try{return await e()}catch(a){o=a,s<r-1&&await new Promise(E=>setTimeout(E,t*(s+1)))}throw o}}function d(u){return{RGB:"r: 0-255, g: 0-255, b: 0-255",HSL:"h: 0-360, s: 0-100, l: 0-100",HSV:"h: 0-360, s: 0-100, v: 0-100",HEX:"#000000 - #FFFFFF",LAB:"l: 0-100, a: -128-127, b: -128-127"}[u.toUpperCase()]||"Unknown format"}const g=n.log.bind(n),F=c.safeExecute,y=c.retryExecute;exports.ColorConversionError=l,exports.ColorError=i,exports.ColorManipulationError=p,exports.ErrorLogger=n,exports.ErrorRecovery=c,exports.InputValidationError=h,exports.ThemeOperationError=C,exports.logError=g,exports.retryExecute=y,exports.safeExecute=F;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=errors.cjs.map
