import{k as _,bL as f,p as h,q as w,x as l,u as b,K as k,R as a,aB as e,C as n,s as y,B as g}from"./@vue-BypzYtbH.js";const v={class:"row pt-3 pb-3 text-dark modal-title",style:{"word-break":"break-word"}},x={class:"row pt-5 justify-content-end"},B={class:"col-md-3 col-2"},C={class:"row px-0 justify-content-end"},U=_({__name:"InformationPopUpSideButton",props:{show:{type:Boolean,required:!0},titlePopUp:{type:String,default:""},confirmLabel:{type:String,default:"OK"}},emits:["close"],setup(o,{emit:c}){const i=o,r=c,t=f(()=>i.show),d=()=>{r("close",!1)};return(V,s)=>{const p=a("el-button"),u=a("el-dialog");return h(),w(u,{modelValue:b(t),"onUpdate:modelValue":s[0]||(s[0]=m=>k(t)?t.value=m:null),width:"60%","close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1,"custom-class":"oil-not-in-range__header",top:"30vh",center:!0},{default:l(()=>[e("div",v,[e("h3",null,n(o.titlePopUp),1)]),e("div",x,[e("div",B,[e("div",C,[y(p,{type:"success",class:"ok-button",onClick:d},{default:l(()=>[g(n(o.confirmLabel),1)]),_:1})])])])]),_:1},8,["modelValue"])}}});export{U as _};
