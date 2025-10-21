/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */import{ref as p,computed as i,onMounted as P,onUnmounted as w}from"vue";import{presetThemes as M}from"../themes/presets.js";import{ThemeManager as y}from"../themes/themeManager.js";function k(o={}){const e=new y(o),t=p(null),u=p(M),l=p(!1),f=i(()=>t.value?.primaryColor||""),h=i(()=>t.value?.themeName||""),c=i(()=>t.value?.isDark||!1),v=async(r,s)=>{l.value=!0;try{const a=e.applyTheme(r,s);return t.value=a,a}finally{l.value=!1}},T=async(r,s)=>{l.value=!0;try{const a=e.applyPresetTheme(r,s);return t.value=a,a}finally{l.value=!1}},d=()=>{const r=e.restore();return r&&(t.value=r),r},g=()=>{e.clear(),t.value=null},C=()=>{const r=e.getCurrentTheme();return t.value=r,r};let m=null;return P(()=>{if(o.immediate!==!1){const r=e.getCurrentTheme()||e.restore();r&&(t.value=r)}m=e.onChange(r=>{t.value=r})}),w(()=>{m&&m(),e&&typeof e.destroy=="function"&&e.destroy()}),{currentTheme:t,presets:u,isLoading:l,primaryColor:f,themeName:h,isDark:c,applyTheme:v,applyPresetTheme:T,restoreTheme:d,clearTheme:g,getCurrentTheme:C}}let n=null;function x(o={}){return n||(n=new y(o)),{install(e){e.provide("themeManager",n),e.config.globalProperties.$theme=n,e.unmount=new Proxy(e.unmount,{apply(t,u,l){return n&&typeof n.destroy=="function"&&(n.destroy(),n=null),Reflect.apply(t,u,l)}})}}}/*! End of @ldesign/color | Powered by @ldesign/builder */export{x as createThemeProvider,k as useTheme};
//# sourceMappingURL=useTheme.js.map
