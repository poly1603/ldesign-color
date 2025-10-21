"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */var n=require("vue"),C=require("../themes/presets.cjs"),p=require("../themes/themeManager.cjs");function P(o={}){const e=new p.ThemeManager(o),t=n.ref(null),s=n.ref(C.presetThemes),u=n.ref(!1),h=n.computed(()=>t.value?.primaryColor||""),c=n.computed(()=>t.value?.themeName||""),v=n.computed(()=>t.value?.isDark||!1),y=async(r,i)=>{u.value=!0;try{const l=e.applyTheme(r,i);return t.value=l,l}finally{u.value=!1}},f=async(r,i)=>{u.value=!0;try{const l=e.applyPresetTheme(r,i);return t.value=l,l}finally{u.value=!1}},T=()=>{const r=e.restore();return r&&(t.value=r),r},d=()=>{e.clear(),t.value=null},g=()=>{const r=e.getCurrentTheme();return t.value=r,r};let m=null;return n.onMounted(()=>{if(o.immediate!==!1){const r=e.getCurrentTheme()||e.restore();r&&(t.value=r)}m=e.onChange(r=>{t.value=r})}),n.onUnmounted(()=>{m&&m(),e&&typeof e.destroy=="function"&&e.destroy()}),{currentTheme:t,presets:s,isLoading:u,primaryColor:h,themeName:c,isDark:v,applyTheme:y,applyPresetTheme:f,restoreTheme:T,clearTheme:d,getCurrentTheme:g}}let a=null;function M(o={}){return a||(a=new p.ThemeManager(o)),{install(e){e.provide("themeManager",a),e.config.globalProperties.$theme=a,e.unmount=new Proxy(e.unmount,{apply(t,s,u){return a&&typeof a.destroy=="function"&&(a.destroy(),a=null),Reflect.apply(t,s,u)}})}}}exports.createThemeProvider=M,exports.useTheme=P;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=useTheme.cjs.map
