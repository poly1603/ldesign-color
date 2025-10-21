/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */function i(r,o){return`--color-${r}-${o}`}function g(r,o){return Object.entries(o).map(([a,u])=>`  ${i(r,a)}: ${u};`).join(`
`)}function e(r){const o=[];return Object.entries(r).forEach(([a,u])=>{o.push(`  /* ${a.charAt(0).toUpperCase()+a.slice(1)} */`),o.push(g(a,u))}),o.join(`
`)}function l(r){const o=e(r.light),a=e(r.dark);return`/* Light Mode (Default) */
:root {
${o}
}

/* Dark Mode */
:root[data-theme-mode='dark'] {
${a}
}`}function t(r){return`/* Light Mode (Default) */
:root {
${e(r.light)}

  /* ========== Background Colors ========== */
  /* Page & Container Backgrounds */
  --color-bg-page: var(--color-gray-50);                      /* \u9875\u9762\u80CC\u666F */
  --color-bg-container: #ffffff;                              /* \u4E3B\u5BB9\u5668\u80CC\u666F */
  --color-bg-container-secondary: var(--color-gray-50);       /* \u6B21\u7EA7\u5BB9\u5668\u80CC\u666F */
  --color-bg-container-tertiary: var(--color-gray-100);       /* \u4E09\u7EA7\u5BB9\u5668\u80CC\u666F */
  
  /* Component Backgrounds */
  --color-bg-component: var(--color-gray-100);                /* \u7EC4\u4EF6\u80CC\u666F */
  --color-bg-component-hover: var(--color-gray-150);          /* \u7EC4\u4EF6\u60AC\u505C\u80CC\u666F */
  --color-bg-component-active: var(--color-gray-200);         /* \u7EC4\u4EF6\u6FC0\u6D3B\u80CC\u666F */
  --color-bg-component-disabled: var(--color-gray-50);        /* \u7EC4\u4EF6\u7981\u7528\u80CC\u666F */
  
  /* Special Backgrounds */
  --color-bg-overlay: rgba(0, 0, 0, 0.45);                    /* \u906E\u7F69\u5C42\u80CC\u666F */
  --color-bg-mask: rgba(0, 0, 0, 0.6);                        /* \u6A21\u6001\u906E\u7F69\u80CC\u666F */
  --color-bg-tooltip: var(--color-gray-900);                  /* \u63D0\u793A\u6846\u80CC\u666F */
  --color-bg-popover: #ffffff;                                /* \u5F39\u51FA\u6846\u80CC\u666F */
  
  /* Status Backgrounds */
  --color-bg-success: var(--color-success-50);                /* \u6210\u529F\u80CC\u666F */
  --color-bg-warning: var(--color-warning-50);                /* \u8B66\u544A\u80CC\u666F */
  --color-bg-error: var(--color-danger-50);                   /* \u9519\u8BEF\u80CC\u666F */
  --color-bg-info: var(--color-info-50);                      /* \u4FE1\u606F\u80CC\u666F */
  
  /* ========== Text Colors ========== */
  /* Primary Text Hierarchy */
  --color-text-primary: var(--color-gray-900);                /* \u4E3B\u8981\u6587\u5B57 */
  --color-text-secondary: var(--color-gray-700);              /* \u6B21\u8981\u6587\u5B57 */
  --color-text-tertiary: var(--color-gray-500);               /* \u8F85\u52A9\u6587\u5B57 */
  --color-text-quaternary: var(--color-gray-400);             /* \u56DB\u7EA7\u6587\u5B57 */
  --color-text-disabled: var(--color-gray-400);               /* \u7981\u7528\u6587\u5B57 */
  --color-text-placeholder: var(--color-gray-400);            /* \u5360\u4F4D\u7B26\u6587\u5B57 */
  
  /* Special Text Colors */
  --color-text-inverse: #ffffff;                              /* \u53CD\u8272\u6587\u5B57 */
  --color-text-inverse-secondary: rgba(255, 255, 255, 0.85);  /* \u53CD\u8272\u6B21\u8981\u6587\u5B57 */
  --color-text-link: var(--color-primary-500);                /* \u94FE\u63A5\u6587\u5B57 */
  --color-text-link-hover: var(--color-primary-600);          /* \u94FE\u63A5\u60AC\u505C\u6587\u5B57 */
  --color-text-link-active: var(--color-primary-700);         /* \u94FE\u63A5\u6FC0\u6D3B\u6587\u5B57 */
  --color-text-link-visited: var(--color-primary-700);        /* \u5DF2\u8BBF\u95EE\u94FE\u63A5\u6587\u5B57 */
  
  /* Status Text Colors */
  --color-text-success: var(--color-success-600);             /* \u6210\u529F\u6587\u5B57 */
  --color-text-warning: var(--color-warning-600);             /* \u8B66\u544A\u6587\u5B57 */
  --color-text-error: var(--color-danger-600);                /* \u9519\u8BEF\u6587\u5B57 */
  --color-text-info: var(--color-info-600);                   /* \u4FE1\u606F\u6587\u5B57 */
  
  /* ========== Border Colors ========== */
  /* Default Borders */
  --color-border: var(--color-gray-300);                      /* \u9ED8\u8BA4\u8FB9\u6846 */
  --color-border-light: var(--color-gray-200);                /* \u6D45\u8272\u8FB9\u6846 */
  --color-border-lighter: var(--color-gray-100);              /* \u66F4\u6D45\u8FB9\u6846 */
  --color-border-dark: var(--color-gray-400);                 /* \u6DF1\u8272\u8FB9\u6846 */
  --color-border-darker: var(--color-gray-500);               /* \u66F4\u6DF1\u8FB9\u6846 */
  
  /* Component Borders */
  --color-border-input: var(--color-gray-300);                /* \u8F93\u5165\u6846\u8FB9\u6846 */
  --color-border-input-hover: var(--color-gray-400);          /* \u8F93\u5165\u6846\u60AC\u505C\u8FB9\u6846 */
  --color-border-input-focus: var(--color-primary-500);       /* \u8F93\u5165\u6846\u805A\u7126\u8FB9\u6846 */
  --color-border-input-error: var(--color-danger-500);        /* \u8F93\u5165\u6846\u9519\u8BEF\u8FB9\u6846 */
  --color-border-input-disabled: var(--color-gray-200);       /* \u8F93\u5165\u6846\u7981\u7528\u8FB9\u6846 */
  
  /* ========== Primary Color States ========== */
  --color-primary-lighter: var(--color-primary-100);
  --color-primary-light: var(--color-primary-200);
  --color-primary-default: var(--color-primary-500);
  --color-primary-hover: var(--color-primary-600);
  --color-primary-active: var(--color-primary-700);
  --color-primary-darker: var(--color-primary-800);
  --color-primary-disabled: var(--color-primary-300);
  
  /* ========== Success Color States ========== */
  --color-success-lighter: var(--color-success-100);
  --color-success-light: var(--color-success-200);
  --color-success-default: var(--color-success-500);
  --color-success-hover: var(--color-success-600);
  --color-success-active: var(--color-success-700);
  --color-success-darker: var(--color-success-800);
  --color-success-disabled: var(--color-success-300);
  
  /* ========== Warning Color States ========== */
  --color-warning-lighter: var(--color-warning-100);
  --color-warning-light: var(--color-warning-200);
  --color-warning-default: var(--color-warning-500);
  --color-warning-hover: var(--color-warning-600);
  --color-warning-active: var(--color-warning-700);
  --color-warning-darker: var(--color-warning-800);
  --color-warning-disabled: var(--color-warning-300);
  
  /* ========== Danger/Error Color States ========== */
  --color-danger-lighter: var(--color-danger-100);
  --color-danger-light: var(--color-danger-200);
  --color-danger-default: var(--color-danger-500);
  --color-danger-hover: var(--color-danger-600);
  --color-danger-active: var(--color-danger-700);
  --color-danger-darker: var(--color-danger-800);
  --color-danger-disabled: var(--color-danger-300);
  
  /* ========== Info Color States ========== */
  --color-info-lighter: var(--color-info-100);
  --color-info-light: var(--color-info-200);
  --color-info-default: var(--color-info-500);
  --color-info-hover: var(--color-info-600);
  --color-info-active: var(--color-info-700);
  --color-info-darker: var(--color-info-800);
  --color-info-disabled: var(--color-info-300);
  
  /* ========== Shadows ========== */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-outline: 0 0 0 3px rgba(66, 153, 225, 0.5);
  
  /* ========== Opacity ========== */
  --opacity-0: 0;
  --opacity-5: 0.05;
  --opacity-10: 0.1;
  --opacity-20: 0.2;
  --opacity-25: 0.25;
  --opacity-30: 0.3;
  --opacity-40: 0.4;
  --opacity-50: 0.5;
  --opacity-60: 0.6;
  --opacity-70: 0.7;
  --opacity-75: 0.75;
  --opacity-80: 0.8;
  --opacity-90: 0.9;
  --opacity-95: 0.95;
  --opacity-100: 1;
  
  /* ========== Z-Index ========== */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
  --z-index-notification: 1080;
  
  /* ========== Legacy Aliases (for backward compatibility) ========== */
  --color-background: var(--color-bg-container);
  --color-background-secondary: var(--color-bg-container-secondary);
  --color-background-tertiary: var(--color-bg-container-tertiary);
}

/* Dark Mode */
:root[data-theme-mode='dark'] {
${e(r.dark)}

  /* ========== Background Colors (Dark Mode) ========== */
  /* Page & Container Backgrounds */
  --color-bg-page: var(--color-gray-1000);                    /* \u9875\u9762\u80CC\u666F - darkest */
  --color-bg-container: var(--color-gray-900);                /* \u4E3B\u5BB9\u5668\u80CC\u666F - elevated from page */
  --color-bg-container-secondary: var(--color-gray-850);      /* \u6B21\u7EA7\u5BB9\u5668\u80CC\u666F */
  --color-bg-container-tertiary: var(--color-gray-800);       /* \u4E09\u7EA7\u5BB9\u5668\u80CC\u666F */
  
  /* Component Backgrounds */
  --color-bg-component: var(--color-gray-800);                /* \u7EC4\u4EF6\u80CC\u666F */
  --color-bg-component-hover: var(--color-gray-700);          /* \u7EC4\u4EF6\u60AC\u505C\u80CC\u666F */
  --color-bg-component-active: var(--color-gray-600);         /* \u7EC4\u4EF6\u6FC0\u6D3B\u80CC\u666F */
  --color-bg-component-disabled: var(--color-gray-850);       /* \u7EC4\u4EF6\u7981\u7528\u80CC\u666F */
  
  /* Special Backgrounds */
  --color-bg-overlay: rgba(0, 0, 0, 0.7);                     /* \u906E\u7F69\u5C42\u80CC\u666F */
  --color-bg-mask: rgba(0, 0, 0, 0.8);                        /* \u6A21\u6001\u906E\u7F69\u80CC\u666F */
  --color-bg-tooltip: var(--color-gray-800);                  /* \u63D0\u793A\u6846\u80CC\u666F - dark elevated */
  --color-bg-popover: var(--color-gray-850);                  /* \u5F39\u51FA\u6846\u80CC\u666F */
  
  /* Status Backgrounds */
  --color-bg-success: var(--color-success-900);               /* \u6210\u529F\u80CC\u666F - very dark */
  --color-bg-warning: var(--color-warning-900);               /* \u8B66\u544A\u80CC\u666F - very dark */
  --color-bg-error: var(--color-danger-900);                  /* \u9519\u8BEF\u80CC\u666F - very dark */
  --color-bg-info: var(--color-info-900);                     /* \u4FE1\u606F\u80CC\u666F - very dark */
  
  /* ========== Text Colors (Dark Mode) ========== */
  /* Primary Text Hierarchy */
  --color-text-primary: var(--color-gray-50);                 /* \u4E3B\u8981\u6587\u5B57 */
  --color-text-secondary: var(--color-gray-200);              /* \u6B21\u8981\u6587\u5B57 */
  --color-text-tertiary: var(--color-gray-400);               /* \u8F85\u52A9\u6587\u5B57 */
  --color-text-quaternary: var(--color-gray-500);             /* \u56DB\u7EA7\u6587\u5B57 */
  --color-text-disabled: var(--color-gray-600);               /* \u7981\u7528\u6587\u5B57 */
  --color-text-placeholder: var(--color-gray-600);            /* \u5360\u4F4D\u7B26\u6587\u5B57 */
  
  /* Special Text Colors */
  --color-text-inverse: var(--color-gray-900);                /* \u53CD\u8272\u6587\u5B57 */
  --color-text-inverse-secondary: var(--color-gray-800);      /* \u53CD\u8272\u6B21\u8981\u6587\u5B57 */
  --color-text-link: var(--color-primary-400);                /* \u94FE\u63A5\u6587\u5B57 */
  --color-text-link-hover: var(--color-primary-300);          /* \u94FE\u63A5\u60AC\u505C\u6587\u5B57 */
  --color-text-link-active: var(--color-primary-200);         /* \u94FE\u63A5\u6FC0\u6D3B\u6587\u5B57 */
  --color-text-link-visited: var(--color-primary-500);        /* \u5DF2\u8BBF\u95EE\u94FE\u63A5\u6587\u5B57 */
  
  /* Status Text Colors */
  --color-text-success: var(--color-success-400);             /* \u6210\u529F\u6587\u5B57 */
  --color-text-warning: var(--color-warning-400);             /* \u8B66\u544A\u6587\u5B57 */
  --color-text-error: var(--color-danger-400);                /* \u9519\u8BEF\u6587\u5B57 */
  --color-text-info: var(--color-info-400);                   /* \u4FE1\u606F\u6587\u5B57 */
  
  /* ========== Border Colors (Dark Mode) ========== */
  /* Default Borders */
  --color-border: var(--color-gray-700);                      /* \u9ED8\u8BA4\u8FB9\u6846 */
  --color-border-light: var(--color-gray-750);                /* \u6D45\u8272\u8FB9\u6846 */
  --color-border-lighter: var(--color-gray-800);              /* \u66F4\u6D45\u8FB9\u6846 */
  --color-border-dark: var(--color-gray-600);                 /* \u6DF1\u8272\u8FB9\u6846 */
  --color-border-darker: var(--color-gray-500);               /* \u66F4\u6DF1\u8FB9\u6846 */
  
  /* Component Borders */
  --color-border-input: var(--color-gray-700);                /* \u8F93\u5165\u6846\u8FB9\u6846 */
  --color-border-input-hover: var(--color-gray-600);          /* \u8F93\u5165\u6846\u60AC\u505C\u8FB9\u6846 */
  --color-border-input-focus: var(--color-primary-400);       /* \u8F93\u5165\u6846\u805A\u7126\u8FB9\u6846 */
  --color-border-input-error: var(--color-danger-400);        /* \u8F93\u5165\u6846\u9519\u8BEF\u8FB9\u6846 */
  --color-border-input-disabled: var(--color-gray-750);       /* \u8F93\u5165\u6846\u7981\u7528\u8FB9\u6846 */
  
  /* ========== Primary Color States (Dark Mode) ========== */
  --color-primary-lighter: var(--color-primary-100);          /* Light tints for dark mode */
  --color-primary-light: var(--color-primary-200);
  --color-primary-default: var(--color-primary-400);          /* Brighter for visibility */
  --color-primary-hover: var(--color-primary-300);
  --color-primary-active: var(--color-primary-500);
  --color-primary-darker: var(--color-primary-600);
  --color-primary-disabled: var(--color-primary-800);         /* Darker for disabled state */
  
  /* ========== Success Color States (Dark Mode) ========== */
  --color-success-lighter: var(--color-success-100);
  --color-success-light: var(--color-success-200);
  --color-success-default: var(--color-success-400);
  --color-success-hover: var(--color-success-300);
  --color-success-active: var(--color-success-500);
  --color-success-darker: var(--color-success-600);
  --color-success-disabled: var(--color-success-800);
  
  /* ========== Warning Color States (Dark Mode) ========== */
  --color-warning-lighter: var(--color-warning-100);
  --color-warning-light: var(--color-warning-200);
  --color-warning-default: var(--color-warning-400);
  --color-warning-hover: var(--color-warning-300);
  --color-warning-active: var(--color-warning-500);
  --color-warning-darker: var(--color-warning-600);
  --color-warning-disabled: var(--color-warning-800);
  
  /* ========== Danger/Error Color States (Dark Mode) ========== */
  --color-danger-lighter: var(--color-danger-100);
  --color-danger-light: var(--color-danger-200);
  --color-danger-default: var(--color-danger-400);
  --color-danger-hover: var(--color-danger-300);
  --color-danger-active: var(--color-danger-500);
  --color-danger-darker: var(--color-danger-600);
  --color-danger-disabled: var(--color-danger-800);
  
  /* ========== Info Color States (Dark Mode) ========== */
  --color-info-lighter: var(--color-info-100);
  --color-info-light: var(--color-info-200);
  --color-info-default: var(--color-info-400);
  --color-info-hover: var(--color-info-300);
  --color-info-active: var(--color-info-500);
  --color-info-darker: var(--color-info-600);
  --color-info-disabled: var(--color-info-800);
  
  /* ========== Shadows (Dark Mode) ========== */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.15);
  --shadow-outline: 0 0 0 3px rgba(66, 153, 225, 0.4);
  
  /* ========== Legacy Aliases (for backward compatibility) ========== */
  --color-background: var(--color-bg-container);
  --color-background-secondary: var(--color-bg-container-secondary);
  --color-background-tertiary: var(--color-bg-container-tertiary);
}`}function d(r,o=!0){const a=o?t(r):l(r);let u=document.getElementById("ldesign-color-theme");u||(u=document.createElement("style"),u.id="ldesign-color-theme",document.head.appendChild(u)),u.textContent=a}function c(r){document.documentElement.setAttribute("data-theme-mode",r)}function n(){return document.documentElement.getAttribute("data-theme-mode")==="dark"?"dark":"light"}function s(){const r=n()==="light"?"dark":"light";return c(r),r}function v(){const r=localStorage.getItem("theme-mode");if(r==="dark"||r==="light")c(r);else{const o=window.matchMedia("(prefers-color-scheme: dark)").matches;c(o?"dark":"light")}window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",o=>{localStorage.getItem("theme-mode")||c(o.matches?"dark":"light")})}function p(r){localStorage.setItem("theme-mode",r),c(r)}/*! End of @ldesign/color | Powered by @ldesign/builder */export{t as generateSemanticCssVariables,l as generateThemedCssVariables,n as getThemeMode,v as initThemeMode,d as injectThemedCssVariables,p as saveThemeMode,c as setThemeMode,s as toggleThemeMode};
//# sourceMappingURL=cssVariables.js.map
