import{h as r}from"./moment-C5S46NFB.js";const m=t=>t?r(t).format("DD-MMM-YY"):"",D=t=>t?r(t).format("DD.MM.YYYY"):"",u=(t="")=>t?r(t).format("YYYY-MM-DD"):r(new Date).format("YYYY-MM-DD"),f=t=>t?r(t).format("DD/MM/YYYY"):"",Y=t=>t?r.utc(t).local().format("DD.MM.YYYY HH:mm:ss"):"",l=(t=null)=>t?r.utc(t).local().format("DD/MM/YYYY"):r.utc().local().format("DD/MM/YYYY"),o=()=>`${r.utc().utcOffset(10).format("DD/MM/YY HH:mm:ss")}`,M=()=>`${o()} (AEST)`,d=t=>`${r.utc(t).utcOffset(10).format("DD/MM/YY HH:mm:ss")} (AEST)`,i=()=>r.utc().utcOffset(10).unix(),H=t=>r().utc().utcOffset(t).hours()<=18?"Day Shift":"Night Shift",T=t=>t?r.utc(t).local().format("DD.MM.YYYY"):"",h=t=>t?r.utc(t).format("DD.MM.YYYY"):"",g=t=>Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds()),S=t=>t?`${r(t).local().format("YYYY-MM-DD")}T00:00:00`:"",C=t=>{const e=t.getDate().toString().padStart(2,"0"),a=(t.getMonth()+1).toString().padStart(2,"0"),s=t.getFullYear();return`${a}/${e}/${s}`},U=t=>{const e=t.replaceAll(".","/");return r(e,"DD/MM/YYYY HH:mm:ss").toDate()},A=t=>`${Number(t.split(":")[0])+12}:${t.split(":")[1]}:${t.split(":")[2]}`,O=t=>r().utc().utcOffset(t).format("HH:mm:ss"),y=t=>r().utcOffset(t).format("DD/MM/YYYY HH:mm:ss"),b=(t,e,a)=>t?r(t,e).format(a):"",F=(t,e,a)=>r(t,e).format(a),p=(t,e)=>r(t).subtract(r.duration(e)),$=(t,e,a,s)=>r(t,e).add(a,s),E=(t,e)=>r(t).diff(r(e)),v=(t,e)=>r.unix(t).format(e),j=(t,e)=>r(t).format(e),x=(t,e,a)=>r().subtract(t,e).format(a),B=(t,e,a)=>r().add(t,e).format(a),w=t=>r().format(t),I=()=>r().subtract(1,"months").startOf("month"),L=t=>r(t).endOf("month"),N=(t,e,a,s)=>r(t,e).subtract(a,s),k=(t,e,a,s)=>r(t,e).add(a,s),z=t=>r(t),P=t=>t.replace(/\(AEST\)/g,"").trim(),W=(t,e)=>{const a=r(),s=typeof e=="string"?r(e):e||r();return a.isBefore(s)},q=(t=void 0,e,a,s=void 0)=>r(t,s).add(e,a);export{o as A,D as B,I as C,L as D,N as E,k as F,O as G,A as H,p as I,i as J,b as K,d as L,$ as a,B as b,j as c,F as d,h as e,w as f,y as g,U as h,M as i,f as j,g as k,E as l,v as m,l as n,u as o,H as p,S as q,P as r,x as s,W as t,q as u,m as v,C as w,T as x,Y as y,z};
