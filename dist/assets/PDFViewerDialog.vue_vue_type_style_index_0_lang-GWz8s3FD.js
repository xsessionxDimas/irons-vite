import{c as U}from"./index-BuVmIl8K.js";import{k as B,r as t,a0 as x,o as $,d as D,p as a,q as V,x as M,R,Y as F,y as L,aa as i,aB as c,C as m,B as P,F as E}from"./@vue-BypzYtbH.js";const q={key:0,style:{height:"100px"}},A={key:0,class:"row text-center my-10"},S={class:"text-danger"},j={key:1,class:"row justify-content-end pt-4 pe-10"},G={class:"div page-controller",style:{"margin-left":"auto"}},I=["disabled"],N=["disabled"],O=B({__name:"PDFViewerDialog",props:{show:{type:Boolean,required:!0},blobUrl:{type:String,required:!0}},emits:["handleCloseModal"],setup(y,{emit:g}){const l=y,h=g,_=t(""),s=t(1),d=t(1),n=t(!0);t(null);const u=t(""),v=t(!1),p=x(l,"show"),f=async()=>{if(v.value=!1,_.value="",s.value=1,d.value=1,l.blobUrl!=""){const r=`ver=v1&fileUrl=${l.blobUrl}`;try{n.value=!0;const e=`https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_attachment/download_by_url?${r}`,b=(await U.getBlob(e)).data,o=new Blob([b]),C=window.URL||window.webkitURL;_.value=C.createObjectURL(o)}catch(e){console.log("error show pdf",e),v.value=!0,l.blobUrl.includes("#")?u.value="PDF not yet attached":u.value=`${e}`}finally{n.value=!1}}};$(async()=>{await f()}),D(p,r=>{r&&f()},{deep:!0});const k=()=>{h("handleCloseModal")};return(r,e)=>{const w=R("el-dialog"),b=F("loading");return a(),V(w,{modelValue:p.value,"onUpdate:modelValue":e[2]||(e[2]=o=>p.value=o),title:"Preview",width:"80%","custom-class":"show-pdf","close-on-click-modal":!1,"close-on-press-escape":!1,onClose:e[3]||(e[3]=o=>k())},{default:M(()=>[n.value?L((a(),i("div",q,null,512)),[[b,n.value]]):(a(),i(E,{key:1},[v.value?(a(),i("div",A,[c("span",S,m(u.value),1)])):(a(),i("div",j,[c("div",G,[c("button",{type:"button",disabled:s.value<=1,onClick:e[0]||(e[0]=o=>s.value--),class:"btn btn-success btn-sm ok-button"},"❮",8,I),P(" "+m(s.value)+" / "+m(d.value)+" ",1),c("button",{type:"button",disabled:s.value>=d.value,onClick:e[1]||(e[1]=o=>s.value++),class:"btn btn-success btn-sm ok-button"},"❯",8,N)])]))],64))]),_:1},8,["modelValue"])}}});export{O as _};
