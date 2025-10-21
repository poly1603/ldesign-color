/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */import{createVNode as r}from"vue";import{Sun as E,Moon as M,Monitor as D,ChevronDown as F,Check as S}from"lucide-react";import{useState as p,useRef as z,useCallback as g,useEffect as n}from"react";const l=[{value:"light",label:"\u6D45\u8272",icon:E},{value:"dark",label:"\u6DF1\u8272",icon:M},{value:"system",label:"\u8DDF\u968F\u7CFB\u7EDF",icon:D}],A=({defaultMode:k="system",storageKey:c="ld-theme-mode",onModeChange:x,className:f=""})=>{const[t,d]=p(!1),[a,h]=p(k),[w,y]=p("light"),i=z(null),u=a==="system"?w:a,m=l.find(o=>o.value===a)||l[2],N=m.icon,b=g(o=>{const e=document.documentElement;o==="dark"?e.setAttribute("theme-mode","dark"):e.removeAttribute("theme-mode"),e.setAttribute("data-theme-mode",o),e.classList.remove("light","dark"),e.classList.add(o)},[]),s=g(()=>{const o=window.matchMedia("(prefers-color-scheme: dark)");y(o.matches?"dark":"light")},[]),C=()=>{d(!t)},L=o=>{h(o),localStorage.setItem(c,o),d(!1),x?.(o)};return n(()=>{const o=e=>{i.current&&!i.current.contains(e.target)&&d(!1)};if(t)return document.addEventListener("click",o),()=>{document.removeEventListener("click",o)}},[t]),n(()=>{s();const o=window.matchMedia("(prefers-color-scheme: dark)"),e=()=>s();return o.addEventListener?(o.addEventListener("change",e),()=>o.removeEventListener("change",e)):(o.addListener(e),()=>o.removeListener(e))},[s]),n(()=>{const o=localStorage.getItem(c);o&&l.some(e=>e.value===o)&&h(o)},[c]),n(()=>{b(u)},[u,b]),r("div",{ref:i,className:`theme-mode-switcher ${f}`},[r("button",{className:"theme-mode-button",onClick:C,title:m.label},[r(N,{className:"theme-icon"},null),r("span",{className:"theme-label"},[m.label]),r(F,{className:`arrow ${t?"open":""}`},null,8,["className"])],8,["onClick","title"]),t&&r("div",{className:"theme-dropdown"},[l.map(o=>{const e=o.icon,v=a===o.value;return r("button",{key:o.value,className:`theme-option ${v?"active":""}`,onClick:()=>L(o.value)},[r(e,{className:"option-icon"},null),r("span",{className:"option-label"},[o.label]),v&&r(S,{className:"check-icon"},null)],8,["className","onClick"])})]),r("style",null,[`
        .theme-mode-switcher {
          position: relative;
        }

        .theme-mode-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--ld-bg-color-component, var(--color-background-secondary));
          border: 1px solid var(--ld-component-border, var(--color-border));
          border-radius: 8px;
          color: var(--ld-text-color-primary, var(--color-text-primary));
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .theme-mode-button:hover {
          background: var(--ld-bg-color-component-hover, var(--color-primary-100));
          border-color: var(--ld-brand-color-light, var(--color-primary-200));
        }

        .theme-icon {
          width: 18px;
          height: 18px;
        }

        .theme-label {
          white-space: nowrap;
        }

        .arrow {
          width: 16px;
          height: 16px;
          transition: transform 0.3s;
        }

        .arrow.open {
          transform: rotate(180deg);
        }

        .theme-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--ld-bg-color-container, var(--color-background));
          border: 1px solid var(--ld-component-border, var(--color-border));
          border-radius: 8px;
          box-shadow: var(--ld-shadow-2, 0 4px 12px rgba(0, 0, 0, 0.1));
          overflow: hidden;
          z-index: 1000;
          min-width: 160px;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
          background: none;
          border: none;
          color: var(--ld-text-color-primary, var(--color-text-primary));
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }

        .theme-option:hover {
          background: var(--ld-bg-color-component, var(--color-background-secondary));
        }

        .theme-option.active {
          background: var(--ld-brand-color-light, var(--color-primary-100));
          color: var(--ld-brand-color, var(--color-primary-default));
          font-weight: 600;
        }

        .option-icon {
          width: 18px;
          height: 18px;
        }

        .option-label {
          flex: 1;
        }

        .check-icon {
          width: 16px;
          height: 16px;
          color: var(--ld-brand-color, var(--color-primary-default));
        }

        /* Dark mode specific styles */
        :root[theme-mode="dark"] .theme-mode-button {
          background: var(--ld-bg-color-component);
          border-color: var(--ld-component-border);
        }

        :root[theme-mode="dark"] .theme-mode-button:hover {
          background: var(--ld-bg-color-component-hover);
          border-color: var(--ld-brand-color-light);
        }

        :root[theme-mode="dark"] .theme-dropdown {
          background: var(--ld-bg-color-container);
          border-color: var(--ld-component-border);
        }

        :root[theme-mode="dark"] .theme-option:hover {
          background: var(--ld-bg-color-component);
        }

        :root[theme-mode="dark"] .theme-option.active {
          background: var(--ld-brand-color-light);
        }
      `])],8,["className"])};/*! End of @ldesign/color | Powered by @ldesign/builder */export{A as ReactThemeModeSwitcher};
//# sourceMappingURL=ReactThemeModeSwitcher.js.map
