import{u as _}from"./useMenuStore-CD5Gmvif.js";import{M as w}from"./PageEnum-DUtfSNQS.js";import{t as k}from"./language-BriOOvyN.js";import{u as y}from"./vue-i18n-CbVMwo04.js";import{k as h,p as c,q as f,x as b,R as u,aa as d,aB as m,s as g,b4 as $}from"./@vue-BypzYtbH.js";import{_ as v}from"./nw-img-vue-CR837WER.js";import{X as p}from"./xlsx-C4maHrMm.js";import{F as x}from"./file-saver-CwTBvle_.js";const B=h({props:{routeName:String,isDisabled:Boolean,isHide:Boolean,isDialog:Boolean},emits:["show-dialog"],setup(o,{emit:e}){const n=_(),{t:s,te:t}=y();return{changePage:()=>{n[w.SET_PAGE](o.routeName)},handleModalToggle:()=>{e("show-dialog",null)},translate:k,t:s,te:t,showDialog:()=>{e("show-dialog")}}}}),D={class:"svg-icon svg-icon-1x"},M=["disabled"],T={class:"svg-icon svg-icon-1x"},C={key:1,class:"svg-icon svg-icon-1x"};function A(o,e,n,s,t,a){const l=u("inline-svg"),i=u("el-tooltip");return c(),f(i,{class:"box-item",effect:"dark",content:o.translate("ADDNEW",o.t,o.te),placement:"top"},{default:b(()=>[o.isDialog?(c(),d("div",{key:0,class:"btn btn-small btn-icon duotune-icon px-2 my-5",onClick:e[0]||(e[0]=(...r)=>o.handleModalToggle&&o.handleModalToggle(...r))},[m("span",D,[g(l,{src:"/media/icons/duotune/arrows/arr075.svg"})])])):(c(),d("div",{key:1,class:$(["btn btn-small btn-icon duotune-icon px-2 my-5",{disabled:o.isDisabled,hideBtn:o.isHide}]),onClick:e[2]||(e[2]=(...r)=>o.showDialog&&o.showDialog(...r))},[o.routeName?(c(),d("a",{key:0,href:"javascript:void(0)",onClick:e[1]||(e[1]=(...r)=>o.changePage&&o.changePage(...r)),disabled:o.isDisabled,class:"d-flex align-items-center"},[m("span",T,[g(l,{src:"/media/icons/duotune/arrows/arr075.svg"})])],8,M)):(c(),d("span",C,[g(l,{src:"/media/icons/duotune/arrows/arr075.svg"})]))],2))]),_:1},8,["content"])}const z=v(B,[["render",A],["__scopeId","data-v-127f4082"]]),E=h({setup(o,{emit:e}){return{handleModalToggle:()=>{e("show-dialog",null)}}}}),N={class:"svg-icon svg-icon-2x"};function P(o,e,n,s,t,a){const l=u("inline-svg"),i=u("el-tooltip");return c(),f(i,{class:"box-item",effect:"dark",content:"Upload Excel",placement:"top"},{default:b(()=>[m("div",{class:"btn btn-small btn-icon duotune-icon px-2 my-5",onClick:e[0]||(e[0]=r=>o.handleModalToggle())},[m("span",N,[g(l,{src:"/media/svg/buttons/Uploaded-file.svg"})])])]),_:1})}const G=v(E,[["render",P]]),U=o=>{const e=new ArrayBuffer(o.length),n=new Uint8Array(e);for(let s=0;s<o.length;++s)n[s]=o.charCodeAt(s)&255;return e},H=(o,e)=>{const n=p.utils.aoa_to_sheet(o);n["!cols"]=R(o),n["!rows"]=S(o.length);const s=`${e}.xlsx`,t=p.utils.book_new();p.utils.book_append_sheet(t,n,e);const a=p.write(t,{bookType:"xlsx",type:"binary"});x.saveAs(new Blob([U(a)],{type:"application/octet-stream"}),s)},O=(o,e,n)=>{let s=[];s.push(e);let t=[];t=n.map(a=>{const l=[];for(const i in a)l.push(a[i]);return l}),s=[...s,...t],H(s,o)},R=o=>{const e=[],n=o[0].length;for(let s=0;s<n;s++){const t=[];for(const a of o)t.push(a[s]!=null?a[s].length:0);e.push({wch:Math.max(...t)+3})}return e},S=o=>{const e=[];for(let n=0;n<o;n++)e.push({hpt:20});return e};export{z as A,G as U,O as h};
