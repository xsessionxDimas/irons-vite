import{c as E,g as _}from"./attr-accept-BWI1aNlo.js";var w={exports:{}};(function(A){(function(d,o){A.exports=o()})(E,function(){var d=Object.prototype.toString;function o(f,t){return f==null?!1:Object.prototype.hasOwnProperty.call(f,t)}function P(f){if(!f||s(f)&&f.length===0)return!0;if(typeof f!="string"){for(var t in f)if(o(f,t))return!1;return!0}return!1}function O(f){return d.call(f)}function x(f){return typeof f=="object"&&O(f)==="[object Object]"}var s=Array.isArray||function(f){return d.call(f)==="[object Array]"};function I(f){return typeof f=="boolean"||O(f)==="[object Boolean]"}function g(f){var t=parseInt(f);return t.toString()===f?t:f}function m(f){f=f||{};var t=function(n){return Object.keys(t).reduce(function(r,e){return e==="create"||typeof t[e]=="function"&&(r[e]=t[e].bind(t,n)),r},{})},l;f.includeInheritedProps?l=function(){return!0}:l=function(n,r){return typeof r=="number"&&Array.isArray(n)||o(n,r)};function S(n,r){if(l(n,r))return n[r]}var c;f.includeInheritedProps?c=function(n,r){typeof r!="string"&&typeof r!="number"&&(r=String(r));var e=S(n,r);if(r==="__proto__"||r==="prototype"||r==="constructor"&&typeof e=="function")throw new Error("For security reasons, object's magic properties cannot be set");return e}:c=function(n,r){return S(n,r)};function v(n,r,e,i){if(typeof r=="number"&&(r=[r]),!r||r.length===0)return n;if(typeof r=="string")return v(n,r.split(".").map(g),e,i);var u=r[0],y=c(n,u);return r.length===1?((y===void 0||!i)&&(n[u]=e),y):(y===void 0&&(typeof r[1]=="number"?n[u]=[]:n[u]={}),v(n[u],r.slice(1),e,i))}return t.has=function(n,r){if(typeof r=="number"?r=[r]:typeof r=="string"&&(r=r.split(".")),!r||r.length===0)return!!n;for(var e=0;e<r.length;e++){var i=g(r[e]);if(typeof i=="number"&&s(n)&&i<n.length||(f.includeInheritedProps?i in Object(n):o(n,i)))n=n[i];else return!1}return!0},t.ensureExists=function(n,r,e){return v(n,r,e,!0)},t.set=function(n,r,e,i){return v(n,r,e,i)},t.insert=function(n,r,e,i){var u=t.get(n,r);i=~~i,s(u)||(u=[],t.set(n,r,u)),u.splice(i,0,e)},t.empty=function(n,r){if(!P(r)&&n!=null){var e,i;if(e=t.get(n,r)){if(typeof e=="string")return t.set(n,r,"");if(I(e))return t.set(n,r,!1);if(typeof e=="number")return t.set(n,r,0);if(s(e))e.length=0;else if(x(e))for(i in e)l(e,i)&&delete e[i];else return t.set(n,r,null)}}},t.push=function(n,r){var e=t.get(n,r);s(e)||(e=[],t.set(n,r,e)),e.push.apply(e,Array.prototype.slice.call(arguments,2))},t.coalesce=function(n,r,e){for(var i,u=0,y=r.length;u<y;u++)if((i=t.get(n,r[u]))!==void 0)return i;return e},t.get=function(n,r,e){if(typeof r=="number"&&(r=[r]),!r||r.length===0)return n;if(n==null)return e;if(typeof r=="string")return t.get(n,r.split("."),e);var i=g(r[0]),u=c(n,i);return u===void 0?e:r.length===1?u:t.get(n[i],r.slice(1),e)},t.del=function(r,e){if(typeof e=="number"&&(e=[e]),r==null||P(e))return r;if(typeof e=="string")return t.del(r,e.split("."));var i=g(e[0]);if(c(r,i),!l(r,i))return r;if(e.length===1)s(r)?r.splice(i,1):delete r[i];else return t.del(r[i],e.slice(1));return r},t}var a=m();return a.create=m,a.withInheritedProps=m({includeInheritedProps:!0}),a})})(w);var B=w.exports;const K=_(B);export{K as o};
