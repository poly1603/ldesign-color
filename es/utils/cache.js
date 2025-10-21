/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */class d{constructor(e=100){this.cache=new Map,this.maxSize=e}get(e){const t=this.cache.get(e);if(t!==void 0)return this.cache.delete(e),this.cache.set(e,t),t}set(e,t){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxSize){const i=this.cache.keys().next().value;i!==void 0&&this.cache.delete(i)}this.cache.set(e,t)}has(e){return this.cache.has(e)}delete(e){return this.cache.delete(e)}clear(){this.cache.clear()}get size(){return this.cache.size}getStats(){const e=this.cache.size;return{size:e,maxSize:this.maxSize,utilization:Math.round(e/this.maxSize*100)}}}const c=new d(200);typeof window<"u"&&(window.addEventListener("beforeunload",()=>{c.clear()},{once:!0}),document.addEventListener("visibilitychange",()=>{if(document.hidden&&c.size>50){const s=c.size-50,e=Array.from(c.cache.keys());for(let t=0;t<s;t++)e[t]!==void 0&&c.delete(e[t])}}));const u=new WeakMap;function f(s,e,t=20){let i=u.get(s);i||(i=new Map,u.set(s,i));const a=(...n)=>{const h=e?e(...n):n.length===1?String(n[0]):JSON.stringify(n),o=i.get(h);if(o!==void 0)return o;if(i.size>=t){const l=i.keys().next().value;l!==void 0&&i.delete(l)}const r=s(...n);return i.set(h,r),r};return a.clear=()=>{i?.clear()},a}function z(...s){return s.map(e=>e===null?"null":e===void 0?"undefined":typeof e=="object"?JSON.stringify(e):String(e)).join("-")}/*! End of @ldesign/color | Powered by @ldesign/builder */export{d as ColorCache,z as createCacheKey,c as globalColorCache,f as memoize};
//# sourceMappingURL=cache.js.map
