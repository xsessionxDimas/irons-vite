import{u as U}from"./useAttachmentStore-DqM3autD.js";import{f as x}from"./index-BuVmIl8K.js";import{e as B}from"./lodash-DrHMlsdo.js";import{i as D}from"./internet-connection-CnLQPjRt.js";import{k as F,r as o,a0 as V,o as R,d as L,R as M,Y as P,p as l,q as S,x as O,y as $,aa as d,aB as c,C as w,B as j,F as q}from"./@vue-BypzYtbH.js";const E={key:0,style:{height:"100px"}},A={key:0,class:"row text-center my-10"},N={class:"text-danger"},T={key:1,class:"row justify-content-end pt-4 pe-10"},I={class:"div page-controller",style:{"margin-left":"auto"}},Y=["disabled"],z=["disabled"],W=F({__name:"PDFViewerDialog",props:{show:{type:Boolean,required:!0},blobUrl:{type:String,required:!0}},emits:["handleCloseModal"],setup(h,{emit:_}){const a=h,g=_,k=U(),n=o(""),s=o(1),u=o(1),i=o(!0);o(null);const p=o(""),v=o(!1),b=V(a,"show"),y=async()=>{if(v.value=!1,n.value="",s.value=1,u.value=1,a.blobUrl!="")try{i.value=!0;const t=await x.pendingTaskFile.where({filename:a.blobUrl}).first(),e=window.URL||window.webkitURL;if(!t&&!D()){const f=await k.downloadAttachmentPDF(a.blobUrl),m=new Blob([f],{type:"application/pdf"});n.value=e.createObjectURL(m)}else B.isUndefined(t)?n.value="":n.value=e.createObjectURL(t.blob)}catch(t){v.value=!0,a.blobUrl.includes("#")?p.value="PDF not yet attached":p.value=`${t}`}finally{i.value=!1}};R(async()=>{await y()}),L(b,t=>{t&&y()},{deep:!0});const C=()=>{g("handleCloseModal")};return(t,e)=>{const f=M("el-dialog"),m=P("loading");return l(),S(f,{modelValue:b.value,"onUpdate:modelValue":e[2]||(e[2]=r=>b.value=r),title:"Preview",width:"80%","custom-class":"show-pdf","close-on-click-modal":!1,"close-on-press-escape":!1,onClose:e[3]||(e[3]=r=>C())},{default:O(()=>[i.value?$((l(),d("div",E,null,512)),[[m,i.value]]):(l(),d(q,{key:1},[v.value?(l(),d("div",A,[c("span",N,w(p.value),1)])):(l(),d("div",T,[c("div",I,[c("button",{type:"button",disabled:s.value<=1,onClick:e[0]||(e[0]=r=>s.value--),class:"btn btn-success btn-sm ok-button"},"❮",8,Y),j(" "+w(s.value)+" / "+w(u.value)+" ",1),c("button",{type:"button",disabled:s.value>=u.value,onClick:e[1]||(e[1]=r=>s.value++),class:"btn btn-success btn-sm ok-button"},"❯",8,z)])]))],64))]),_:1},8,["modelValue"])}}});export{W as _};
