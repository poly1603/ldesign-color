"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */var f=require("../core/Color.cjs"),o;class g{constructor(){this.workerReady=!1,this.pendingTasks=new Map,this.metrics={operationCount:0,totalTime:0,averageTime:0,cacheHitRate:0},typeof Worker<"u"&&this.initWorker()}initWorker(){const e=`
      // Worker\u5185\u7684\u989C\u8272\u5904\u7406\u903B\u8F91
      function processColor(operation, color, params) {
        // \u7B80\u5316\u7684\u989C\u8272\u5904\u7406\uFF08\u5B9E\u9645\u5E94\u8BE5\u5BFC\u5165\u5B8C\u6574\u7684Color\u7C7B\uFF09
        switch(operation) {
          case 'lighten':
            return lightenColor(color, params.amount);
          case 'darken':
            return darkenColor(color, params.amount);
          case 'saturate':
            return saturateColor(color, params.amount);
          case 'rotate':
            return rotateHue(color, params.degrees);
          default:
            return color;
        }
      }
      
      function lightenColor(color, amount) {
        // \u7B80\u5316\u5B9E\uFFFD?
        return color;
      }
      
      function darkenColor(color, amount) {
        // \u7B80\u5316\u5B9E\uFFFD?
        return color;
      }
      
      function saturateColor(color, amount) {
        // \u7B80\u5316\u5B9E\uFFFD?
        return color;
      }
      
      function rotateHue(color, degrees) {
        // \u7B80\u5316\u5B9E\uFFFD?
        return color;
      }
      
      // \u5904\u7406\u6279\u91CF\u64CD\u4F5C
      function processBatch(colors, operation, params) {
        return colors.map(color => processColor(operation, color, params));
      }
      
      // \u76D1\u542C\u6D88\u606F
      self.addEventListener('message', (e) => {
        const { id, type, data } = e.data;
        
        try {
          let result;
          
          switch(type) {
            case 'process':
              result = processColor(data.operation, data.color, data.params);
              break;
            case 'batch':
              result = processBatch(data.colors, data.operation, data.params);
              break;
            default:
              throw new Error('Unknown operation type');
          }
          
          self.postMessage({ id, result });
        } catch (error) {
          self.postMessage({ id, error: error.message });
        }
      });
    `,r=new Blob([e],{type:"application/javascript"}),t=URL.createObjectURL(r);this.worker=new Worker(t),this.worker.onmessage=a=>{const{id:u,result:d,error:i}=a.data,c=this.pendingTasks.get(u);c&&(i?(console.error("Worker error:",i),c(null)):c(d),this.pendingTasks.delete(u))},this.workerReady=!0,URL.revokeObjectURL(t)}async batchProcess(e,r,t={}){const a=performance.now(),{parallel:u=!0,chunkSize:d=100,useWorker:i=!1,onProgress:c}=t,p=e.map(n=>new f.Color(n)),m=[];if(u&&!i){const n=this.chunkArray(p,d);let l=0;for(const h of n){const P=await Promise.all(h.map(async k=>r(k)));m.push(...P),l+=h.length,c&&c(l/e.length*100)}}else if(i&&this.workerReady){const n=this.generateTaskId();return new Promise(l=>{this.pendingTasks.set(n,h=>{l(h)}),this.worker.postMessage({id:n,type:"batch",data:{colors:e,operation:"process",params:{}}})})}else for(let n=0;n<p.length;n++)m.push(r(p[n])),c&&n%10===0&&c(n/e.length*100);const C=performance.now();return this.updateMetrics(e.length,C-a),m}async batchConvert(e,r,t={}){return this.batchProcess(e,a=>{switch(r){case"hex":return a.toHex();case"rgb":return a.toRGBString();case"hsl":return a.toHSLString();default:return a.toString(r)}},t)}async batchManipulate(e,r,t,a={}){return this.batchProcess(e,u=>{switch(r){case"lighten":return u.lighten(t);case"darken":return u.darken(t);case"saturate":return u.saturate(t);case"desaturate":return u.desaturate(t);case"rotate":return u.rotate(t);default:return u}},a)}async batchAnalyze(e,r={}){return this.batchProcess(e,t=>({luminance:t.getLuminance(),isLight:t.isLight(),hsl:t.toHSL()}),r)}chunkArray(e,r){const t=[];for(let a=0;a<e.length;a+=r)t.push(e.slice(a,a+r));return t}generateTaskId(){return`task_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}updateMetrics(e,r){this.metrics.operationCount+=e,this.metrics.totalTime+=r,this.metrics.averageTime=this.metrics.totalTime/this.metrics.operationCount}getMetrics(){return{...this.metrics}}resetMetrics(){this.metrics={operationCount:0,totalTime:0,averageTime:0,cacheHitRate:0}}destroy(){this.worker&&(this.worker.terminate(),this.worker=void 0,this.workerReady=!1)}}class y{constructor(){this.loadedModules=new Set,this.loadingPromises=new Map}async loadModule(e){if(this.loadedModules.has(e))return!0;if(this.loadingPromises.has(e))return this.loadingPromises.get(e);const r=this.dynamicImport(e);this.loadingPromises.set(e,r);try{const t=await r;return this.loadedModules.add(e),this.loadingPromises.delete(e),t}catch(t){throw this.loadingPromises.delete(e),t}}async dynamicImport(e){switch(e){case"gradient":return Promise.resolve().then(function(){return require("../gradient/index.cjs")});case"analyzer":return Promise.resolve().then(function(){return require("../analyzer/index.cjs")});case"brand":return Promise.resolve().then(function(){return require("../brand/index.cjs")});case"ai":return Promise.resolve().then(function(){return require("../ai/colorAI.cjs")});case"accessibility":return Promise.resolve().then(function(){return require("../accessibility/index.cjs")});case"schemes":return Promise.resolve().then(function(){return require("../schemes/index.cjs")});default:throw new Error(`Unknown module: ${e}`)}}async preloadCriticalModules(){const e=["gradient","schemes","accessibility"];await Promise.all(e.map(r=>this.loadModule(r)))}isModuleLoaded(e){return this.loadedModules.has(e)}getLoadedModules(){return Array.from(this.loadedModules)}}class s{static getOptimizationSuggestions(){const e=this.batchProcessor.getMetrics(),r=[];return e.averageTime>10&&r.push("\u8003\u8651\u4F7F\u7528Web Worker\u8FDB\u884C\u6279\u91CF\u5904\u7406"),e.operationCount>1e3&&r.push("\u5EFA\u8BAE\u589E\u52A0\u7F13\u5B58\u5927\u5C0F\u4EE5\u63D0\u9AD8\u6027\u80FD"),e.cacheHitRate<.5&&r.push("\u7F13\u5B58\u547D\u4E2D\u7387\u8F83\u4F4E\uFF0C\u8003\u8651\u9884\u70ED\u5E38\u7528\u989C\u8272"),r}}o=s,s.batchProcessor=new g,s.lazyLoader=new y,s.batch={process:o.batchProcessor.batchProcess.bind(o.batchProcessor),convert:o.batchProcessor.batchConvert.bind(o.batchProcessor),manipulate:o.batchProcessor.batchManipulate.bind(o.batchProcessor),analyze:o.batchProcessor.batchAnalyze.bind(o.batchProcessor)},s.lazy={load:o.lazyLoader.loadModule.bind(o.lazyLoader),preload:o.lazyLoader.preloadCriticalModules.bind(o.lazyLoader),isLoaded:o.lazyLoader.isModuleLoaded.bind(o.lazyLoader),getLoaded:o.lazyLoader.getLoadedModules.bind(o.lazyLoader)},s.monitor={getMetrics:()=>o.batchProcessor.getMetrics(),resetMetrics:()=>o.batchProcessor.resetMetrics()};const w=s.batch.process,M=s.batch.convert,F=s.batch.manipulate,L=s.batch.analyze,z=s.lazy.load,B=s.lazy.preload;exports.BatchColorProcessor=g,exports.ColorPerformance=s,exports.LazyColorLoader=y,exports.batchAnalyze=L,exports.batchConvert=M,exports.batchManipulate=F,exports.batchProcess=w,exports.lazyLoad=z,exports.preloadModules=B;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=index.cjs.map
