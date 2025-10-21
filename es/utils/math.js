/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */function l(n,t,e){return Math.min(Math.max(n,t),e)}function s(n,t=0){const e=10**t;return Math.round(n*e)/e}function d(n){return n*(Math.PI/180)}function g(n){return n*(180/Math.PI)}function M(n,t,e){return n+(t-n)*e}function m(n,t){return(n%t+t)%t}function p(n,t,e=.001){return Math.abs(n-t)<e}function b(n,t,e,a){const r=e-n,u=a-t;return Math.sqrt(r*r+u*u)}function q(n,t,e,a,r,u){const i=a-n,c=r-t,f=u-e;return Math.sqrt(i*i+c*c+f*f)}function D(n,t,e,a,r){return(n-t)*(r-a)/(e-t)+a}function o(n){return n.length===0?0:n.reduce((t,e)=>t+e,0)/n.length}function v(n,t){if(n.length!==t.length||n.length===0)return 0;let e=0,a=0;for(let r=0;r<n.length;r++)e+=n[r]*t[r],a+=t[r];return a===0?0:e/a}function x(n,t){return Math.random()*(t-n)+n}function I(n,t){return Math.floor(Math.random()*(t-n+1))+n}function N(n,t,e){return e===t?0:(n-t)/(e-t)}function R(n){if(n.length===0)return 0;const t=o(n),e=n.map(r=>(r-t)**2),a=o(e);return Math.sqrt(a)}function P(n){if(n<0)return Number.NaN;if(n===0||n===1)return 1;let t=1;for(let e=2;e<=n;e++)t*=e;return t}function h(n,t){for(n=Math.abs(n),t=Math.abs(t);t!==0;){const e=t;t=n%t,n=e}return n}function T(n,t){return Math.abs(n*t)/h(n,t)}/*! End of @ldesign/color | Powered by @ldesign/builder */export{p as approximatelyEqual,o as average,l as clamp,d as degreesToRadians,q as distance3D,b as euclideanDistance,P as factorial,h as gcd,T as lcm,M as lerp,D as mapRange,m as mod,N as normalize,g as radiansToDegrees,I as randomInt,x as randomRange,s as round,R as standardDeviation,v as weightedAverage};
//# sourceMappingURL=math.js.map
