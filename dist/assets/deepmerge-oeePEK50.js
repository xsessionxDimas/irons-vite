import{g as b}from"./@popperjs-BaMZbQYT.js";var o=function(r){return s(r)&&!y(r)};function s(e){return!!e&&typeof e=="object"}function y(e){var r=Object.prototype.toString.call(e);return r==="[object RegExp]"||r==="[object Date]"||g(e)}var m=typeof Symbol=="function"&&Symbol.for,O=m?Symbol.for("react.element"):60103;function g(e){return e.$$typeof===O}function j(e){return Array.isArray(e)?[]:{}}function u(e,r){return r.clone!==!1&&r.isMergeableObject(e)?a(j(e),e,r):e}function M(e,r,n){return e.concat(r).map(function(c){return u(c,n)})}function A(e,r){if(!r.customMerge)return a;var n=r.customMerge(e);return typeof n=="function"?n:a}function E(e){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter(function(r){return Object.propertyIsEnumerable.call(e,r)}):[]}function f(e){return Object.keys(e).concat(E(e))}function l(e,r){try{return r in e}catch{return!1}}function p(e,r){return l(e,r)&&!(Object.hasOwnProperty.call(e,r)&&Object.propertyIsEnumerable.call(e,r))}function S(e,r,n){var c={};return n.isMergeableObject(e)&&f(e).forEach(function(t){c[t]=u(e[t],n)}),f(r).forEach(function(t){p(e,t)||(l(e,t)&&n.isMergeableObject(r[t])?c[t]=A(t,n)(e[t],r[t],n):c[t]=u(r[t],n))}),c}function a(e,r,n){n=n||{},n.arrayMerge=n.arrayMerge||M,n.isMergeableObject=n.isMergeableObject||o,n.cloneUnlessOtherwiseSpecified=u;var c=Array.isArray(r),t=Array.isArray(e),i=c===t;return i?c?n.arrayMerge(e,r,n):S(e,r,n):u(r,n)}a.all=function(r,n){if(!Array.isArray(r))throw new Error("first argument should be an array");return r.reduce(function(c,t){return a(c,t,n)},{})};var d=a,h=d;const I=b(h);export{I as m};
