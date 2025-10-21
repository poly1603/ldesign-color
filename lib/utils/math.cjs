"use strict";/*!
 * ***********************************
 * @ldesign/color v1.0.0           *
 * Built with rollup               *
 * Build time: 2024-10-21 14:32:31 *
 * Build mode: production          *
 * Minified: No                    *
 * ***********************************
 */function l(n,e,t){return Math.min(Math.max(n,e),t)}function s(n,e=0){const t=10**e;return Math.round(n*t)/t}function h(n){return n*(Math.PI/180)}function g(n){return n*(180/Math.PI)}function m(n,e,t){return n+(e-n)*t}function M(n,e){return(n%e+e)%e}function p(n,e,t=.001){return Math.abs(n-e)<t}function D(n,e,t,r){const a=t-n,o=r-e;return Math.sqrt(a*a+o*o)}function v(n,e,t,r,a,o){const i=r-n,c=a-e,d=o-t;return Math.sqrt(i*i+c*c+d*d)}function R(n,e,t,r,a){return(n-e)*(a-r)/(t-e)+r}function u(n){return n.length===0?0:n.reduce((e,t)=>e+t,0)/n.length}function b(n,e){if(n.length!==e.length||n.length===0)return 0;let t=0,r=0;for(let a=0;a<n.length;a++)t+=n[a]*e[a],r+=e[a];return r===0?0:t/r}function q(n,e){return Math.random()*(e-n)+n}function I(n,e){return Math.floor(Math.random()*(e-n+1))+n}function T(n,e,t){return t===e?0:(n-e)/(t-e)}function x(n){if(n.length===0)return 0;const e=u(n),t=n.map(a=>(a-e)**2),r=u(t);return Math.sqrt(r)}function N(n){if(n<0)return Number.NaN;if(n===0||n===1)return 1;let e=1;for(let t=2;t<=n;t++)e*=t;return e}function f(n,e){for(n=Math.abs(n),e=Math.abs(e);e!==0;){const t=e;e=n%e,n=t}return n}function w(n,e){return Math.abs(n*e)/f(n,e)}exports.approximatelyEqual=p,exports.average=u,exports.clamp=l,exports.degreesToRadians=h,exports.distance3D=v,exports.euclideanDistance=D,exports.factorial=N,exports.gcd=f,exports.lcm=w,exports.lerp=m,exports.mapRange=R,exports.mod=M,exports.normalize=T,exports.radiansToDegrees=g,exports.randomInt=I,exports.randomRange=q,exports.round=s,exports.standardDeviation=x,exports.weightedAverage=b;/*! End of @ldesign/color | Powered by @ldesign/builder */
//# sourceMappingURL=math.cjs.map
