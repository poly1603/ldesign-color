"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */class s{constructor(){this.metrics=new Map,this.enabled=!1}enable(){this.enabled=!0}disable(){this.enabled=!1}start(t){if(!this.enabled)return;const e=this.metrics.get(t);e?(e.count++,e.startTime=performance.now()):this.metrics.set(t,{name:t,startTime:performance.now(),count:1})}end(t){if(!this.enabled)return;const e=this.metrics.get(t);if(!e){console.warn(`[PerformanceMonitor] No metric found for: ${t}`);return}return e.endTime=performance.now(),e.duration=e.endTime-e.startTime,e.duration}measure(t,e){if(!this.enabled)return e();this.start(t);const r=e();return this.end(t),r}async measureAsync(t,e){if(!this.enabled)return e();this.start(t);const r=await e();return this.end(t),r}getMetric(t){return this.metrics.get(t)}getAllMetrics(){return Array.from(this.metrics.values())}getStats(t){const e=this.metrics.get(t);if(!(!e||!e.duration))return{count:e.count,avgDuration:e.duration/e.count,lastDuration:e.duration}}report(){if(!this.enabled){console.log("[PerformanceMonitor] Disabled");return}console.log(`
=== Performance Report ===
`);const t=this.getAllMetrics().filter(e=>e.duration!==void 0).sort((e,r)=>(r.duration||0)-(e.duration||0));for(const e of t){const r=(e.duration||0)/e.count;console.log(`${e.name}:`),console.log(`  Count: ${e.count}`),console.log(`  Total: ${e.duration?.toFixed(2)}ms`),console.log(`  Average: ${r.toFixed(2)}ms`),console.log("")}}clear(){this.metrics.clear()}reset(t){this.metrics.delete(t)}}const o=new s;function a(n,t,e){const r=e.value;return e.value=function(...i){return o.measure(`${n.constructor.name}.${t}`,()=>r.apply(this,i))},e}function c(n,t){return o.measure(n,t)}async function u(n,t){return o.measureAsync(n,t)}typeof process<"u"&&process.env?.NODE_ENV==="development"&&o.enable(),exports.PerformanceMonitor=s,exports.measure=c,exports.measureAsync=u,exports.measurePerformance=a,exports.performanceMonitor=o;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=performanceMonitor.cjs.map
