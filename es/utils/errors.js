/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */var n;(function(o){o.LOW="low",o.MEDIUM="medium",o.HIGH="high",o.CRITICAL="critical"})(n||(n={}));var a;(function(o){o.INPUT_VALIDATION="input_validation",o.COLOR_CONVERSION="color_conversion",o.COLOR_MANIPULATION="color_manipulation",o.CACHE_OPERATION="cache_operation",o.THEME_OPERATION="theme_operation",o.PLUGIN_OPERATION="plugin_operation",o.SYSTEM="system"})(a||(a={}));class i extends Error{constructor(e,t,r,u,s){super(e),e&&this.init(e,t,r,u,s)}init(e,t=a.SYSTEM,r=n.MEDIUM,u,s){this.message=e,this.name="ColorError",this.severity=r,this.category=t,this.timestamp=Date.now(),this.context=s,this.suggestions=u}static create(e,t=a.SYSTEM,r=n.MEDIUM,u,s){let h=this.pool.pop();return h||(h=new i),h.init(e,t,r,u,s),h}dispose(){i.pool.length<i.poolSize&&(this.context=void 0,this.suggestions=void 0,this.stack=void 0,i.pool.push(this))}toDetailedString(){const e=[`[${this.name}] ${this.message}`,`Severity: ${this.severity}`,`Category: ${this.category}`,`Timestamp: ${new Date(this.timestamp).toISOString()}`];if(this.context&&e.push(`Context: ${JSON.stringify(this.context)}`),this.suggestions?.length){e.push("Recovery Suggestions:");for(const t of this.suggestions)e.push(`- ${t.action}: ${t.description}`)}return this.stack&&e.push(`Stack: ${this.stack}`),e.join(`
`)}}i.pool=[],i.poolSize=20;class p extends i{constructor(e,t,r){const u=[{action:"\u68C0\u67E5\u8F93\u5165\u683C\u5F0F",description:r||"\u786E\u4FDD\u8F93\u5165\u503C\u7B26\u5408\u652F\u6301\u7684\u989C\u8272\u683C\u5F0F",code:`// \u652F\u6301\u7684\u683C\u5F0F:
// HEX: "#RGB", "#RRGGBB", "#RRGGBBAA"
// RGB: {r: 0-255, g: 0-255, b: 0-255}
// HSL: {h: 0-360, s: 0-100, l: 0-100}
// \u547D\u540D\u989C\u8272: "red", "blue", etc.`},{action:"\u4F7F\u7528\u9ED8\u8BA4\u503C",description:"\u5F53\u8F93\u5165\u65E0\u6548\u65F6\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u989C\u8272\u503C",code:"const color = new Color(input || '#000000');"}];super(e,a.INPUT_VALIDATION,n.LOW,u,{inputValue:t,expectedFormat:r}),this.name="InputValidationError"}}class F extends i{constructor(e,t,r,u){const s=[{action:"\u68C0\u67E5\u503C\u8303\u56F4",description:`\u786E\u4FDD${t}\u503C\u5728\u6709\u6548\u8303\u56F4\u5185`,code:`// ${t}\u6709\u6548\u8303\u56F4:
${m(t)}`},{action:"\u4F7F\u7528\u5B89\u5168\u8F6C\u6362",description:"\u4F7F\u7528\u5E26\u8303\u56F4\u9650\u5236\u7684\u8F6C\u6362\u65B9\u6CD5",code:"const safeValue = clamp(value, min, max);"}];super(e,a.COLOR_CONVERSION,n.MEDIUM,s,{fromFormat:t,toFormat:r,value:u}),this.name="ColorConversionError"}}class d extends i{constructor(e,t,r){const u=[{action:"\u68C0\u67E5\u53C2\u6570\u8303\u56F4",description:`\u786E\u4FDD${t}\u64CD\u4F5C\u7684\u53C2\u6570\u5728\u6709\u6548\u8303\u56F4\u5185`,code:`// \u5E38\u89C1\u64CD\u4F5C\u53C2\u6570\u8303\u56F4:
// lighten/darken: 0-100
// saturate/desaturate: 0-100
// rotate: -360 to 360
// alpha: 0-1`},{action:"\u4F7F\u7528\u94FE\u5F0F\u64CD\u4F5C",description:"\u5C06\u590D\u6742\u64CD\u4F5C\u5206\u89E3\u4E3A\u591A\u4E2A\u7B80\u5355\u6B65\u9AA4",code:"color.lighten(10).saturate(20).rotate(30)"}];super(e,a.COLOR_MANIPULATION,n.LOW,u,{operation:t,parameters:r}),this.name="ColorManipulationError"}}class C extends i{constructor(e,t,r){const u=[{action:"\u9A8C\u8BC1\u4E3B\u9898\u6570\u636E",description:"\u786E\u4FDD\u4E3B\u9898\u6570\u636E\u7ED3\u6784\u6B63\u786E",code:`// \u4E3B\u9898\u7ED3\u6784\u793A\u4F8B:
{
  primaryColor: '#3498db',
  themeName: 'ocean',
  customColors: {...}
}`},{action:"\u4F7F\u7528\u9ED8\u8BA4\u4E3B\u9898",description:"\u56DE\u9000\u5230\u9ED8\u8BA4\u4E3B\u9898\u914D\u7F6E",code:"themeManager.applyTheme('blue')"}];super(e,a.THEME_OPERATION,n.MEDIUM,u,{operation:t,themeData:r}),this.name="ThemeOperationError"}}class c{static init(){this.initialized||(this.errors=Array.from({length:this.maxErrors}),this.initialized=!0)}static log(e){this.init();const t=this.errors[this.errorIndex];t&&"dispose"in t&&t.dispose(),this.errors[this.errorIndex]=e,this.errorIndex=(this.errorIndex+1)%this.maxErrors;for(const r of this.errorHandlers)r(e)}static getErrors(e){let t=[...this.errors];return e&&(e?.category&&(t=t.filter(r=>r.category===e.category)),e?.severity&&(t=t.filter(r=>r.severity===e.severity)),e.since&&(t=t.filter(r=>{const u=e.since.getTime();return r.timestamp>=u}))),t}static clear(){this.errors=[]}static addHandler(e){return this.errorHandlers.push(e),()=>{const t=this.errorHandlers.indexOf(e);t>-1&&this.errorHandlers.splice(t,1)}}static generateReport(){const e=new Map,t=new Map;return this.errors.forEach(r=>{e.set(r.category,(e.get(r.category)||0)+1),t.set(r.severity,(t.get(r.severity)||0)+1)}),`
Error Report
============
Total Errors: ${this.errors.length}

By Category:
${Array.from(e.entries()).map(([r,u])=>`  ${r}: ${u}`).join(`
`)}

By Severity:
${Array.from(t.entries()).map(([r,u])=>`  ${r}: ${u}`).join(`
`)}

Recent Errors:
${this.errors.slice(-5).map(r=>`  - ${r.message}`).join(`
`)}
    `.trim()}}c.errors=[],c.maxErrors=50,c.errorIndex=0,c.errorHandlers=[],c.initialized=!1;class E{static safeExecute(e,t,r){try{return e()}catch(u){return r&&r(u),t}}static async retryExecute(e,t=3,r=100){let u;for(let s=0;s<t;s++)try{return await e()}catch(h){u=h,s<t-1&&await new Promise(l=>setTimeout(l,r*(s+1)))}throw u}}function m(o){return{RGB:"r: 0-255, g: 0-255, b: 0-255",HSL:"h: 0-360, s: 0-100, l: 0-100",HSV:"h: 0-360, s: 0-100, v: 0-100",HEX:"#000000 - #FFFFFF",LAB:"l: 0-100, a: -128-127, b: -128-127"}[o.toUpperCase()]||"Unknown format"}const g=c.log.bind(c),y=E.safeExecute,D=E.retryExecute;/*! End of @ldesign/color | Powered by @ldesign/builder */export{F as ColorConversionError,i as ColorError,d as ColorManipulationError,a as ErrorCategory,c as ErrorLogger,E as ErrorRecovery,n as ErrorSeverity,p as InputValidationError,C as ThemeOperationError,g as logError,D as retryExecute,y as safeExecute};
//# sourceMappingURL=errors.js.map
