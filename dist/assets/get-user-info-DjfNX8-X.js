import{c as f,o as p,p as l,q as S,s as h,a as y,b as I,A as c,r as n,D as m,S as E,t as M,f as D}from"./index-BuVmIl8K.js";import{u as A}from"./useBodyStore-L-idhAYV.js";import{d as w}from"./pinia-BjOS2_Ao.js";import{u as O}from"./useMasterStore-CzSO06fn.js";import{i as b}from"./internet-connection-CnLQPjRt.js";const L=t=>{const r={};return t.forEach(a=>{r[a.Code]=a.Lang}),r},N=w({id:"language",state:()=>({stateDictionary:null,stateIsDictionarySet:!1}),getters:{dictionary:t=>t.stateDictionary,isDictionarySet:t=>t.stateIsDictionarySet},actions:{async downloadLanguage(t){const r={lang:t,ver:"v1"};try{const a=await f.get(p,"",new URLSearchParams(r).toString()),o=L(a.data.result.content);t=="ID"?(o.routerName=l.routerName,o.sidebarMenu=l.sidebarMenu):(o.routerName=S.routerName,o.sidebarMenu=S.sidebarMenu),this.stateDictionary=o,this.stateIsDictionarySet=!0}catch(a){h("IRONS",a),console.log(a)}}}}),i=A(),e=y(),s=I(),k=O(),d=N(),U=async()=>{d.isDictionarySet||await d.downloadLanguage("EN")},j=async t=>{if(!localStorage.getItem("account-info-cache")||localStorage.getItem("account-info-cache")=="undefined"){i[c.REMOVE_BODY_CLASSNAME]("page-loading"),n.push({name:"signin"});return}const r=localStorage.getItem("account-info-cache"),a=JSON.parse(r),o=localStorage.getItem("login-tracked")==="true";try{Object.keys(e.user).length===0&&e.user.constructor===Object&&await e.getUserProfile(a.username,t),o||(await e.logUserLogin(e.user.EmployeeId),localStorage.setItem("login-tracked","true")),s.isMenuSet||await s.getMenu(e.user.EmployeeId.toString()),await U(),m.bootstrap(),E.bootstrap(),m.updateAll(),i[c.REMOVE_BODY_CLASSNAME]("page-loading")}catch{i[c.REMOVE_BODY_CLASSNAME]("page-loading"),e.reset(),localStorage.clear(),n.push({name:"signin"})}},B=async(t,r)=>{if(!t)try{await e.setUserProfileFromDump(),await s.setMenuDMAFromDump();return}catch(g){console.log(g)}if(!localStorage.getItem("account-info-cache")||localStorage.getItem("account-info-cache")=="undefined"){n.push({name:"signin"});return}const a=localStorage.getItem("account-info-cache"),o=JSON.parse(a),u=localStorage.getItem("login-tracked")==="true";try{Object.keys(e.user).length===0&&e.user.constructor===Object&&(await e.getUserProfile(o.username,r),await k.getMasterDataFitterFromServer()),u||(await e.logUserLogin(e.user.EmployeeId),localStorage.setItem("login-tracked","true")),s.isMenuDMASet||b()||await s.getMenuDMA(e.user.EmployeeId.toString())}catch{e.reset(),localStorage.clear(),n.push({name:"signin"})}},F=async()=>(await M(D,"userInfo")).length>0;export{B as a,F as b,j as c,U as d,N as u};
