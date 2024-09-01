/*!
 * Compressor.js v1.2.1
 * https://fengyuanchen.github.io/compressorjs
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2023-02-28T14:09:41.732Z
 */var p={exports:{}};(function(v){typeof window>"u"||function(e){var n=e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype,B=e.Blob&&function(){try{return!!new Blob}catch{return!1}}(),U=B&&e.Uint8Array&&function(){try{return new Blob([new Uint8Array(100)]).size===100}catch{return!1}}(),h=e.BlobBuilder||e.WebKitBlobBuilder||e.MozBlobBuilder||e.MSBlobBuilder,m=/^data:((.*?)(;charset=.*?)?)(;base64)?,/,i=(B||h)&&e.atob&&e.ArrayBuffer&&e.Uint8Array&&function(r){var t,a,o,u,l,f,b,s,c;if(t=r.match(m),!t)throw new Error("invalid data URI");for(a=t[2]?t[1]:"text/plain"+(t[3]||";charset=US-ASCII"),o=!!t[4],u=r.slice(t[0].length),o?l=atob(u):l=decodeURIComponent(u),f=new ArrayBuffer(l.length),b=new Uint8Array(f),s=0;s<l.length;s+=1)b[s]=l.charCodeAt(s);return B?new Blob([U?b:f],{type:a}):(c=new h,c.append(f),c.getBlob(a))};e.HTMLCanvasElement&&!n.toBlob&&(n.mozGetAsFile?n.toBlob=function(r,t,a){var o=this;setTimeout(function(){a&&n.toDataURL&&i?r(i(o.toDataURL(t,a))):r(o.mozGetAsFile("blob",t))})}:n.toDataURL&&i&&(n.msToBlob?n.toBlob=function(r,t,a){var o=this;setTimeout(function(){(t&&t!=="image/png"||a)&&n.toDataURL&&i?r(i(o.toDataURL(t,a))):r(o.msToBlob(t))})}:n.toBlob=function(r,t,a){var o=this;setTimeout(function(){r(i(o.toDataURL(t,a)))})})),v.exports?v.exports=i:e.dataURLtoBlob=i}(window)})(p);
