import"./index-BCnwA6yE.js";import"./lodash-Cr9vlq0V.js";import{b as m}from"./webp-converter-browser-C3MD88Lp.js";import"./sweetalert2-DK0FVkv3.js";import"./crypto-js-BZehCumu.js";import"./compressorjs-Cmz8Y9J9.js";import{F as b}from"./file-saver-DhbZvGod.js";const u=e=>{const r=["jpg","jpeg","png","webp"],t=["pdf"];return r.includes(e.toLowerCase())?"Image":t.includes(e.toLowerCase())?"Document":null},h=e=>{const r=["jpg","jpeg","png","webp"],t=["pdf"];return r.includes(e.toLowerCase())?"Image":t.includes(e.toLowerCase())?"Application":null},T=(e,r=!1)=>{const t=e.toLowerCase(),n=r?h(t):u(t);return n?`${n} / ${t.toUpperCase()}`:e.toUpperCase()},d=e=>{const r=e.split("/");return r.length===2?r[1]:e},k=(e,r)=>{const t=e.findIndex(r);return t!==-1&&e.splice(t,1),e};async function F(e,r,t,n=1e3){return new Promise(s=>{setTimeout(async()=>{await b.saveAs(new Blob([e],{type:r}),t),s(null)},n)})}const O=e=>{var s,a;const r=((a=(s=e.path)==null?void 0:s.split(".").pop())==null?void 0:a.toLowerCase())||"",t=d(e.type);return t===r?t:r};function y(e){return e.replace(/[^\d]/g,"")}const w=e=>{const{name:t,type:n,lastModified:s}=e,a=t.split(".").pop()||"";let o=t.replace(`.${a}`,"");o.length>100&&(o=o.substring(0,100)),o||(o=`${Date.now()}`);let i=a;n.startsWith("image/")?i="webp":n==="application/pdf"&&(i="pdf");const c=`${o}.${i}`;return new File([e],c,{type:n,lastModified:s})},A={SUBMITTED:"Failed to update data, service sheet status is Submited",CLOSE:"Failed to update data, service sheet status is Close",TASK_UPDATED_BY_OTHER:"Task already updated by other mechanic!",CHANGE_NOT_APPLICABLE_WITHOUT_REASON:"You cannot change Not Applicable without a reason, please retry!",MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL:"You cannot modify the defect once already approved or declined by Supervisor"},l={NO_NETWORK:"Error: Network Error",NO_NETWORK_VIEW:"You cannot perform approval when the connection is lost. Make sure your network is online before performing it."},C=(e,r)=>{let t;switch(e.operatorMin){case"=":t=Number(r)==e.minValue;break;case"<":t=Number(r)<e.minValue;break;case">":t=Number(r)>e.minValue;break;case"<>":t=Number(r)>=e.minValue;break;case">=":t=Number(r)>=e.minValue;break;case"<=":t=Number(r)<=e.minValue;break}return t},L=(e,r)=>{let t;switch(e.operatorMax){case"=":t=Number(r)==e.maxValue;break;case"<":t=Number(r)<e.maxValue;break;case">":t=Number(r)>e.maxValue;break;case"<>":t=Number(r)<=e.maxValue;break;case">=":t=Number(r)>=e.maxValue;break;case"<=":t=Number(r)<=e.maxValue;break}return t},P=(e,r,t)=>{let n="";const s=t.operatorMin,a=t.operatorMax,o=s=="<>",i=s==">"&&a=="<=",c=s==">="&&a=="<",p=s==">"&&a=="<";return o||i||c||p?e&&r&&(n=t.cbmRating):(e||r)&&(n=t.cbmRating),n},_=(e,r)=>{let t;switch(e.operatorMin){case"=":t=Number(r)==e.minValue;break;case"<":t=Number(r)<e.minValue;break;case">":t=Number(r)>e.minValue;break;case"<>":t=Number(r)>=e.minValue;break;case">=":t=Number(r)>=e.minValue;break;case"<=":t=Number(r)<=e.minValue;break}return t},D=(e,r)=>{let t;switch(e.operatorMax){case"=":t=Number(r)==e.maxValue;break;case"<":t=Number(r)<e.maxValue;break;case">":t=Number(r)>e.maxValue;break;case"<>":t=Number(r)<=e.maxValue;break;case">=":t=Number(r)>=e.maxValue;break;case"<=":t=Number(r)<=e.maxValue;break}return t},R=(e,r,t)=>{let n="";const s=t.operatorMin,a=t.operatorMax,o=s=="<>",i=s==">"&&a=="<=",c=s==">="&&a=="<",p=s==">"&&a=="<";return o||i||c||p?e&&r&&(n=t.cbmRating):(e||r)&&(n=t.cbmRating),n},I=(e="")=>{let r;return e?(e&&e.toLowerCase()=="buma"?r="green":r="red",`<span class='ownership ${r}'>${e}</span>`):""},S=e=>{if(!e)return"";if(e.description&&e.description!=""&&e.description.includes(";")){const r=[];if(e.description.includes("|"))return e.description.split("|").forEach(t=>{r.push(t.split("")[2])}),r.join(", ");if(e.description!="")return e.description}return e.items?e.items.length<5?e.items[1].value:e.items[2].value:""},W=e=>{const r=e;if(r){try{Array.from(r.getElementsByClassName("show-pdf")).forEach(n=>{n.onclick=s=>{s.preventDefault()}})}catch(t){console.log(t)}try{Array.from(r.getElementsByClassName("spv-print-pdf")).forEach(n=>{n.onclick=s=>{s.preventDefault()}})}catch(t){console.log(t)}}},B=e=>{let r="";const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=t.length;for(let s=0;s<e;s++)r+=t.charAt(Math.floor(Math.random()*n));return r},$=e=>["a","e","i","o","u"].includes(e.toLowerCase());async function j(e,r=1){let t=.1;try{const n=await createImageBitmap(e);let s=await m(e,{quality:r,height:n.height,width:n.width}),a=s.size/(1024*1024);for(;a>2;)r<=t&&(t/=10),r=Math.max(t,r-t),s=await m(e,{quality:r,height:n.height,width:n.width}),a=s.size/(1024*1024);const o=e instanceof File?w(e).name:`${Date.now()}.webp`;return{file:new File([s],o,{type:"image/webp"})}}catch{throw new Error("Error converting to WebP")}}const U=e=>e==l.NO_NETWORK?l.NO_NETWORK_VIEW:e;export{A as S,O as a,j as b,T as c,B as d,C as e,L as f,u as g,P as h,$ as i,U as j,S as k,_ as l,D as m,R as n,I as o,W as p,k as r,F as s,w as t,y as v};
