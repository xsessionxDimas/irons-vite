import{u as S}from"./useMasterStore-CzSO06fn.js";import{_ as x}from"./Textarea.vue_vue_type_style_index_0_lang-v94SEJmi.js";import{d as A}from"./manipulate-html-string-DqTEGh-F.js";import{d as O}from"./pinia-BjOS2_Ao.js";import{p as T}from"./helpers-wUOLw-dU.js";import{k as B,r as F,c as s,p as l,q as _,x as c,R as d,aB as a,u as f,s as v,aa as h,$ as H,F as L,A as M,bd as q,bb as U}from"./@vue-BypzYtbH.js";import{_ as $}from"./nw-img-vue-CR837WER.js";const ae="/media/logos/bumaau/ok.png",j=O({id:"NAReasonView",state:()=>({stateReason:"",stateTitle:"",stateVisible:!1}),getters:{reason:e=>e.stateReason,title:e=>e.stateTitle,visible:e=>e.stateVisible},actions:{setReason(e){this.stateReason=e},setTitle(e){this.stateTitle=e},setVisible(e){this.stateVisible=e},resetInstance(){this.stateReason="",this.stateTitle="",this.stateVisible=!1}}}),oe="/media/icons/bumaau/icon-edit.png",V=e=>(q("data-v-c12def6a"),e=e(),U(),e),E=V(()=>a("span",{class:"el-dialog__title"},"Change Status from Not Applicable",-1)),W=["innerHTML"],z={class:"mt-1 p-2"},G={class:"d-flex flex-column"},J=V(()=>a("h4",{class:"title ps-3"},"Changes Reason",-1)),K={key:0,class:"mt-1 p-2"},P=B({__name:"ViewOnlyNAReasonDialog",props:{isIntervention:{required:!1,type:Boolean,default:!1}},setup(e){const b=S(),o=j(),u=F(null),p=s(()=>o.visible),g=s(()=>o.title),i=s(()=>o.reason),m=s(()=>i.value.split(":")[0]),R=s(()=>i.value.split(":")[0].includes("Other")),k=s(()=>{const r=i.value.split(":");return r.length>2?r.slice(1).join(":"):""}),C=s(()=>g.value),y=async()=>{o.resetInstance()},N=()=>{T(u.value)};return(r,n)=>{const w=d("el-option"),D=d("el-select"),I=d("el-dialog");return l(),_(I,{modelValue:p.value,"onUpdate:modelValue":n[1]||(n[1]=t=>p.value=t),width:"90%",center:"",onOpened:N,onClosed:y,"destroy-on-close":!0,"custom-class":"el-defect-crack-form-custom"},{title:c(()=>[E,a("span",{class:"el-dialog__title task-title",innerHTML:f(A)(C.value,e.isIntervention),ref_key:"defectDetailRef",ref:u},null,8,W)]),default:c(()=>[a("div",z,[a("div",G,[J,v(D,{modelValue:m.value,"onUpdate:modelValue":n[0]||(n[0]=t=>m.value=t),disabled:!0,class:"w-100"},{default:c(()=>[(l(!0),h(L,null,H(f(b).NAConditions,t=>(l(),_(w,{key:t.id,label:t.reviseNaCondition,value:t.naCondition},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),R.value?(l(),h("div",K,[v(x,{value:k.value,label:"Description <span class='red'>*</span>",name:"Description",placeholder:"Write Reason",disabled:!0},null,8,["value"])])):M("",!0)]),_:1},8,["modelValue"])}}}),ne=$(P,[["__scopeId","data-v-c12def6a"]]);export{ne as V,ae as _,oe as a,j as u};
