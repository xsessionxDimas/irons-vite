import{D as B}from"./cbm-helper-BxJZ9NTc.js";import{D as O,a as k,b as g,C as N,c as R,N as D}from"./DefectPanelGeneric-BYVMPBe-.js";import{C as q}from"./CommentPanel-D0ptrEBp.js";import{u as I}from"./useDefectsStore-7BpSnT1n.js";import{_ as U}from"./PDFViewerDialog.vue_vue_type_style_index_0_lang-GWz8s3FD.js";import{_ as H}from"./InformationPopUp.vue_vue_type_style_index_0_lang-O2xYF9Pq.js";import{u as J}from"./useDefectsFormStore-41UTMhiG.js";import{u as M}from"./usePreviewFormStore-q8XX1uYG.js";import{k as E,r as d,c as F,o as x,p as V,aa as _,aB as $,s as e,u as t,F as j}from"./@vue-BypzYtbH.js";const Z=E({__name:"Index",props:{data:{type:Object,required:!1,default(){return null}},isClose:{required:!1,type:Boolean,default:!1},comments:{type:[],required:!1,default:null}},setup(s){const m=I(),r=J(),c=M(),p=d(null),w=d(""),u=d(!1),v=d(!1),i=s,f=F(()=>i.data?i.data:m.ApprovalData),P=F(()=>i.comments?i.comments.slice().sort(y):m.Comments.slice().sort(y)),y=(o,l)=>{const n=parseInt(o.taskDesc.split(";;")[0]),a=parseInt(l.taskDesc.split(";;")[0]);return n-a},C=o=>{v.value=o},h=(o,l)=>{var n;try{const a=Array.from((n=p.value)==null?void 0:n.getElementsByClassName(o));if(!a)return;a.forEach(b=>{b.onclick=A=>{A.preventDefault(),u.value=!0,w.value=b.href,l&&C(!0)}})}catch(a){console.error(a)}};x(()=>{console.log("employee",c,r),h("show-pdf",!1),h("spv-print-pdf",!0)});const S=()=>{u.value=!1};return(o,l)=>(V(),_(j,null,[$("div",{ref_key:"defectDetailRef",ref:p},[e(B),e(O,{"view-only":!0}),e(k,{"view-only":!0,supervisor:!0,"fitter-id":JSON.stringify(t(r).employee),"view-is-download":s.isClose,title:"Repairs Completed"},null,8,["fitter-id","view-is-download"]),e(k,{"view-only":!0,supervisor:!0,"fitter-id":JSON.stringify(t(r).employee),"view-is-download":s.isClose,title:"Further Action Required"},null,8,["fitter-id","view-is-download"]),e(g,{"view-only":!0,supervisor:!0,"fitter-id":JSON.stringify(t(r).employee),"asset-number":t(r).stateUnitNumber,form:t(r).generalForm.modelId,workorder:t(r).generalForm.workOrder,"disable-add-generic":!0,"view-is-download":s.isClose,title:"Repairs Completed"},null,8,["fitter-id","asset-number","form","workorder","view-is-download"]),e(g,{"view-only":!0,supervisor:!0,"fitter-id":JSON.stringify(t(r).employee),"asset-number":t(r).stateUnitNumber,form:t(r).generalForm.modelId,workorder:t(r).generalForm.workOrder,"disable-add-generic":!0,"view-is-download":s.isClose,title:"Further Action Required"},null,8,["fitter-id","asset-number","form","workorder","view-is-download"]),e(N,{"view-only":!0,supervisor:!0,"fitter-id":JSON.stringify(t(r).employee),"view-is-download":s.isClose,title:"Repairs Completed"},null,8,["fitter-id","view-is-download"]),e(N,{"view-only":!0,supervisor:!0,"fitter-id":JSON.stringify(t(r).employee),"view-is-download":s.isClose,title:"Further Action Required"},null,8,["fitter-id","view-is-download"]),e(R,{headers:f.value.CBMHeaders,"is-disabled":!0,"defect-status":t(c).generalForm.defectStatus},null,8,["headers","defect-status"]),e(D,{"is-disabled":!0,title:"Not Applicable Item Check",headers:f.value.DefectNAHeaders,"is-defect":!0},null,8,["headers"]),e(D,{"is-disabled":!0,title:"Not Applicable Crack Check",headers:f.value.CrackNAHeaders,"is-defect":!1},null,8,["headers"]),e(q,{headers:P.value},null,8,["headers"])],512),e(U,{show:u.value,onHandleCloseModal:S,"blob-url":w.value},null,8,["show","blob-url"]),e(H,{show:v.value,onClose:C,"title-pop-up":"if required, see your supervisor to print this"},null,8,["show"])],64))}});export{Z as _};
