/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */import{Color as F}from"../core/Color.js";var a;class b{constructor(){this.workerReady=!1,this.pendingTasks=new Map,this.metrics={operationCount:0,totalTime:0,averageTime:0,cacheHitRate:0},typeof Worker<"u"&&this.initWorker()}initWorker(){const e=`
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
    `,r=new Blob([e],{type:"application/javascript"}),t=URL.createObjectURL(r);this.worker=new Worker(t),this.worker.onmessage=o=>{const{id:n,result:h,error:i}=o.data,c=this.pendingTasks.get(n);c&&(i?(console.error("Worker error:",i),c(null)):c(h),this.pendingTasks.delete(n))},this.workerReady=!0,URL.revokeObjectURL(t)}async batchProcess(e,r,t={}){const o=performance.now(),{parallel:n=!0,chunkSize:h=100,useWorker:i=!1,onProgress:c}=t,p=e.map(u=>new F(u)),m=[];if(n&&!i){const u=this.chunkArray(p,h);let l=0;for(const d of u){const C=await Promise.all(d.map(async w=>r(w)));m.push(...C),l+=d.length,c&&c(l/e.length*100)}}else if(i&&this.workerReady){const u=this.generateTaskId();return new Promise(l=>{this.pendingTasks.set(u,d=>{l(d)}),this.worker.postMessage({id:u,type:"batch",data:{colors:e,operation:"process",params:{}}})})}else for(let u=0;u<p.length;u++)m.push(r(p[u])),c&&u%10===0&&c(u/e.length*100);const k=performance.now();return this.updateMetrics(e.length,k-o),m}async batchConvert(e,r,t={}){return this.batchProcess(e,o=>{switch(r){case"hex":return o.toHex();case"rgb":return o.toRGBString();case"hsl":return o.toHSLString();default:return o.toString(r)}},t)}async batchManipulate(e,r,t,o={}){return this.batchProcess(e,n=>{switch(r){case"lighten":return n.lighten(t);case"darken":return n.darken(t);case"saturate":return n.saturate(t);case"desaturate":return n.desaturate(t);case"rotate":return n.rotate(t);default:return n}},o)}async batchAnalyze(e,r={}){return this.batchProcess(e,t=>({luminance:t.getLuminance(),isLight:t.isLight(),hsl:t.toHSL()}),r)}chunkArray(e,r){const t=[];for(let o=0;o<e.length;o+=r)t.push(e.slice(o,o+r));return t}generateTaskId(){return`task_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}updateMetrics(e,r){this.metrics.operationCount+=e,this.metrics.totalTime+=r,this.metrics.averageTime=this.metrics.totalTime/this.metrics.operationCount}getMetrics(){return{...this.metrics}}resetMetrics(){this.metrics={operationCount:0,totalTime:0,averageTime:0,cacheHitRate:0}}destroy(){this.worker&&(this.worker.terminate(),this.worker=void 0,this.workerReady=!1)}}class y{constructor(){this.loadedModules=new Set,this.loadingPromises=new Map}async loadModule(e){if(this.loadedModules.has(e))return!0;if(this.loadingPromises.has(e))return this.loadingPromises.get(e);const r=this.dynamicImport(e);this.loadingPromises.set(e,r);try{const t=await r;return this.loadedModules.add(e),this.loadingPromises.delete(e),t}catch(t){throw this.loadingPromises.delete(e),t}}async dynamicImport(e){switch(e){case"gradient":return import("../gradient/index.js");case"analyzer":return import("../analyzer/index.js");case"brand":return import("../brand/index.js");case"ai":return import("../ai/colorAI.js");case"accessibility":return import("../accessibility/index.js");case"schemes":return import("../schemes/index.js");default:throw new Error(`Unknown module: ${e}`)}}async preloadCriticalModules(){const e=["gradient","schemes","accessibility"];await Promise.all(e.map(r=>this.loadModule(r)))}isModuleLoaded(e){return this.loadedModules.has(e)}getLoadedModules(){return Array.from(this.loadedModules)}}class s{static getOptimizationSuggestions(){const e=this.batchProcessor.getMetrics(),r=[];return e.averageTime>10&&r.push("\u8003\u8651\u4F7F\u7528Web Worker\u8FDB\u884C\u6279\u91CF\u5904\u7406"),e.operationCount>1e3&&r.push("\u5EFA\u8BAE\u589E\u52A0\u7F13\u5B58\u5927\u5C0F\u4EE5\u63D0\u9AD8\u6027\u80FD"),e.cacheHitRate<.5&&r.push("\u7F13\u5B58\u547D\u4E2D\u7387\u8F83\u4F4E\uFF0C\u8003\u8651\u9884\u70ED\u5E38\u7528\u989C\u8272"),r}}a=s,s.batchProcessor=new b,s.lazyLoader=new y,s.batch={process:a.batchProcessor.batchProcess.bind(a.batchProcessor),convert:a.batchProcessor.batchConvert.bind(a.batchProcessor),manipulate:a.batchProcessor.batchManipulate.bind(a.batchProcessor),analyze:a.batchProcessor.batchAnalyze.bind(a.batchProcessor)},s.lazy={load:a.lazyLoader.loadModule.bind(a.lazyLoader),preload:a.lazyLoader.preloadCriticalModules.bind(a.lazyLoader),isLoaded:a.lazyLoader.isModuleLoaded.bind(a.lazyLoader),getLoaded:a.lazyLoader.getLoadedModules.bind(a.lazyLoader)},s.monitor={getMetrics:()=>a.batchProcessor.getMetrics(),resetMetrics:()=>a.batchProcessor.resetMetrics()};const M=s.batch.process,f=s.batch.convert,P=s.batch.manipulate,L=s.batch.analyze,B=s.lazy.load,z=s.lazy.preload;/*! End of @ldesign/color | Powered by @ldesign/builder */export{b as BatchColorProcessor,s as ColorPerformance,y as LazyColorLoader,L as batchAnalyze,f as batchConvert,P as batchManipulate,M as batchProcess,B as lazyLoad,z as preloadModules};
//# sourceMappingURL=index.js.map
