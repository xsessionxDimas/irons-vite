import{k as T,bL as t,p as v,q as B,x as l,u as a,K as C,R as d,aB as s,b4 as c,C as i,s as S,B as q}from"./@vue-BypzYtbH.js";const R={class:"row text-center pt-5"},U=T({__name:"GeneralDialog",props:{show:{type:Boolean,required:!0},modalType:{type:String,required:!0},type:{type:String,required:!1,default:"SMU"},message:{type:String,required:!1},wordBreaker:{type:Boolean,required:!1,default:!1}},emits:["close"],setup(u,{emit:p}){const e=u,m=p,r=t(()=>e.show),y=t(()=>e.message||"Form is not available yet"),f=()=>{m("close")},b=t(()=>{switch(e.modalType){case"alreadyClose":return"Failed to update data, service sheet status is Close";case"alreadySubmitted":return"Sorry, form is already submitted by other fitter";case"notReady":return y.value;case"alreadyFilled":return`${e.type} has already been filled by other Service Labour Personnel`;case"notMapped":return"SMU Tolerance has not been mapped yet, please insert mapping on Iron Lake web first";case"alreadyUpdated":return"Task already updated by other service person or fitter";case"taskError":return e.message;case"errorSync":return e.message;default:return""}}),o=t(()=>{if(e.modalType=="notReady")return!1}),g=t(()=>e.modalType=="notReady"?"Go To Home":"Ok"),h=t(()=>{if(["notMapped","alreadyUpdated","taskError"].includes(e.modalType))return"modal-title"}),_=t(()=>{if(e.modalType=="notReady")return"text-message";if(e.wordBreaker)return"word-breaker"});return(V,n)=>{const k=d("el-button"),w=d("el-dialog");return v(),B(w,{modelValue:a(r),"onUpdate:modelValue":n[0]||(n[0]=x=>C(r)?r.value=x:null),width:"40%","show-close":!1,"custom-class":"oil-not-in-range__header",top:"30vh",center:!0,"close-on-click-modal":a(o),"close-on-press-escape":a(o)},{default:l(()=>[s("div",{class:c(["row text-center pt-3 pb-3 text-dark",a(h)])},[s("h3",{class:c(a(_))},i(a(b)),3)],2),s("div",R,[S(k,{type:"success",class:"ok-button",onClick:f},{default:l(()=>[q(i(a(g)),1)]),_:1})])]),_:1},8,["modelValue","close-on-click-modal","close-on-press-escape"])}}});export{U as _};
