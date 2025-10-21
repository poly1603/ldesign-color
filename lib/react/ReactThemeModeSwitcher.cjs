"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */var r=require("vue"),n=require("lucide-react"),t=require("react");const l=[{value:"light",label:"\u6D45\u8272",icon:n.Sun},{value:"dark",label:"\u6DF1\u8272",icon:n.Moon},{value:"system",label:"\u8DDF\u968F\u7CFB\u7EDF",icon:n.Monitor}],E=({defaultMode:g="system",storageKey:d="ld-theme-mode",onModeChange:k,className:x=""})=>{const[a,i]=t.useState(!1),[c,u]=t.useState(g),[f,w]=t.useState("light"),s=t.useRef(null),p=c==="system"?f:c,m=l.find(e=>e.value===c)||l[2],N=m.icon,b=t.useCallback(e=>{const o=document.documentElement;e==="dark"?o.setAttribute("theme-mode","dark"):o.removeAttribute("theme-mode"),o.setAttribute("data-theme-mode",e),o.classList.remove("light","dark"),o.classList.add(e)},[]),h=t.useCallback(()=>{const e=window.matchMedia("(prefers-color-scheme: dark)");w(e.matches?"dark":"light")},[]),y=()=>{i(!a)},C=e=>{u(e),localStorage.setItem(d,e),i(!1),k?.(e)};return t.useEffect(()=>{const e=o=>{s.current&&!s.current.contains(o.target)&&i(!1)};if(a)return document.addEventListener("click",e),()=>{document.removeEventListener("click",e)}},[a]),t.useEffect(()=>{h();const e=window.matchMedia("(prefers-color-scheme: dark)"),o=()=>h();return e.addEventListener?(e.addEventListener("change",o),()=>e.removeEventListener("change",o)):(e.addListener(o),()=>e.removeListener(o))},[h]),t.useEffect(()=>{const e=localStorage.getItem(d);e&&l.some(o=>o.value===e)&&u(e)},[d]),t.useEffect(()=>{b(p)},[p,b]),r.createVNode("div",{ref:s,className:`theme-mode-switcher ${x}`},[r.createVNode("button",{className:"theme-mode-button",onClick:y,title:m.label},[r.createVNode(N,{className:"theme-icon"},null),r.createVNode("span",{className:"theme-label"},[m.label]),r.createVNode(n.ChevronDown,{className:`arrow ${a?"open":""}`},null,8,["className"])],8,["onClick","title"]),a&&r.createVNode("div",{className:"theme-dropdown"},[l.map(e=>{const o=e.icon,v=c===e.value;return r.createVNode("button",{key:e.value,className:`theme-option ${v?"active":""}`,onClick:()=>C(e.value)},[r.createVNode(o,{className:"option-icon"},null),r.createVNode("span",{className:"option-label"},[e.label]),v&&r.createVNode(n.Check,{className:"check-icon"},null)],8,["className","onClick"])})]),r.createVNode("style",null,[`
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
      `])],8,["className"])};exports.ReactThemeModeSwitcher=E;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=ReactThemeModeSwitcher.cjs.map
