import{u as wt}from"./vuex-BbOKrtVp.js";import{a as Ft}from"./breadcrumb-BYmEOf4C.js";import{c as O,a as lt,J as W,I as ct,z as J,A as qt}from"./index-BuVmIl8K.js";import{P as vt}from"./Pagination-D-xfdYmn.js";import{F as Pt}from"./FilterIconButton-Bj0WTbms.js";import{h as kt,A as Lt,U as Ut}from"./excel-generator-DMHRo93s.js";import{D as It}from"./DownloadIconButton-CIQp-YG7.js";import{_,b as Tt}from"./element-plus-BeWdvTRa.js";import{q as $,w as A,x as mt,y as Ot}from"./date-format-8-IvfSl3.js";import{P as Z}from"./Pagination-BiobnanQ.js";import{d as dt}from"./pinia-BjOS2_Ao.js";import{m as Q,a as Dt}from"./mapOption-CeGMwmH0.js";import{L as gt}from"./urls-DwU4yR0D.js";import{L as At}from"./urls-CJuEKIR0.js";import{a as xt,d as $t}from"./table-sort-Bpdq_Uwn.js";import{k as N,c as E,r as G,u as o,y as R,p as q,aa as X,q as k,x as p,Y as at,R as U,s as a,aB as h,C as Y,a0 as st,B as L,A as it,T as _t,bd as Rt,bb as Bt,a7 as Ht,L as Nt,F as zt}from"./@vue-BypzYtbH.js";import{a as Ct}from"./vee-validate-C_msoaAA.js";import{c as Et,a as M,b as tt,d as bt}from"./yup-C6P98bvY.js";import"./property-expr-DEi1ZLzV.js";import{E as St}from"./ErrorAlert-CMKGfwAi.js";import{_ as j}from"./AutoComplete.vue_vue_type_script_setup_true_lang-DJ43pGTI.js";import{_ as et}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-CCwjwK39.js";import{e as Mt}from"./lodash-DrHMlsdo.js";import{_ as jt}from"./FileDropZone.vue_vue_type_style_index_0_lang-C5PyimC7.js";import{m as Kt}from"./map-anything-abi6NY2Z.js";import{_ as Gt}from"./nw-img-vue-CR837WER.js";import{_ as ot}from"./AutoComplete.vue_vue_type_style_index_0_lang-DrAAOf71.js";import{_ as yt}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-CJ7rJST9.js";import{F as Yt}from"./file-saver-CwTBvle_.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./useMenuStore-CD5Gmvif.js";import"./PageEnum-DUtfSNQS.js";import"./xlsx-C4maHrMm.js";import"./moment-C5S46NFB.js";import"./nanoclone-BAWie4i9.js";import"./toposort-NSxIV7Fb.js";import"./vue3-dropzone-_NG5IwbJ.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";import"./attr-accept-DLIfoYC7.js";const z="https://digital-bumaau-dev-apm-001.azure-api.net/amadm/api/master_data/equipment_characteristic_value",Jt=`${z}/bulk`,Qt=`${z}/validate_upload`,Xt=`${z}/export`,Wt=`${z}/lookup`,Zt=`${z}/update`,nt={equipment:"",equipmentTo:"",characteristicType:"",characteristicTypeTo:"",characteristicValue:"",characteristicValueTo:"",startDate:"",startDateTo:"",endDate:"",endDateTo:"",ver:"v1",page:1,pageSize:10,order:""},ut=dt({id:"equipmentCharacteristicValueList",state:()=>({stateFilterData:{...nt},stateLastUsedFilterData:{...nt},statePageName:"equipmentCharacteristicValue",stateDisplayData:[],statePagination:new Z,stateLoading:!1,statePaginationLoading:!1,stateEquipmentOption:[],stateCharacteristicTypeOption:[],stateCharacteristicValueOption:[]}),getters:{pageName:t=>t.statePageName,pagination:t=>t.statePagination,displayData:t=>t.stateDisplayData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,paginationLoading:t=>t.statePaginationLoading,equipmentOption:t=>t.stateEquipmentOption,characteristicTypeOption:t=>t.stateCharacteristicTypeOption,characteristicValueOption:t=>t.stateCharacteristicValueOption},actions:{async getData(t=!0){const i={equipment:this.stateFilterData.equipment,equipmentTo:this.stateFilterData.equipmentTo,characteristicType:this.stateFilterData.characteristicType,characteristicTypeTo:this.stateFilterData.characteristicTypeTo,characteristicValue:this.stateFilterData.characteristicValue,characteristicValueTo:this.stateFilterData.characteristicValueTo,startDate:this.stateFilterData.startDate?$(A(new Date(this.stateFilterData.startDate))):"",startDateTo:this.stateFilterData.startDateTo?$(A(new Date(this.stateFilterData.startDateTo))):"",endDate:this.stateFilterData.endDate?$(A(new Date(this.stateFilterData.endDate))):"",endDateTo:this.stateFilterData.endDateTo?$(A(new Date(this.stateFilterData.endDateTo))):"",page:this.stateFilterData.page.toString(),pageSize:this.stateFilterData.pageSize.toString(),order:this.stateFilterData.order,ver:this.stateFilterData.ver};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const e=await O.get(z,"",new URLSearchParams(i).toString());this.stateDisplayData=e.data.result.content,this.setTotalPage(e.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(e){console.log(e)}this.stateLoading=!1},async getLookup(){const t={ver:this.stateFilterData.ver};try{const i=await O.get(Wt,"",new URLSearchParams(t).toString());this.stateEquipmentOption=Q(i.data.result.content.equipment),this.stateCharacteristicTypeOption=Q(i.data.result.content.characteristicType),this.stateCharacteristicValueOption=Q(i.data.result.content.characteristicValue)}catch(i){console.log(i)}},async export(){const t={ver:this.stateFilterData.ver,Gmt:new Date().toTimeString().slice(12,17)};try{return(await O.getBlob(Xt,"",new URLSearchParams(t).toString())).data}catch(i){console.log(i)}},setTotalPage(t){this.pagination.totalPage=t,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(t){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(t),this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:t,order:i}){if(!t&&!i)this.stateFilterData.order="";else{const e=i=="ascending"?"asc":"desc";this.stateFilterData.order=`${t}_${e}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1)},setEquipment(t){this.stateFilterData.equipment=t},setEquipmentTo(t){this.stateFilterData.equipmentTo=t},setCharacteristicType(t){this.stateFilterData.characteristicType=t},setCharacteristicTypeTo(t){this.stateFilterData.characteristicTypeTo=t},setCharacteristicValue(t){this.stateFilterData.characteristicValue=t},setCharacteristicValueTo(t){this.stateFilterData.characteristicValueTo=t},setStartDate(t){this.stateFilterData.startDate=t},setStartDateTo(t){this.stateFilterData.startDateTo=t},setEndDate(t){this.stateFilterData.endDate=t},setEndDateTo(t){this.stateFilterData.endDateTo=t},async resetFilter(){this.stateFilterData.equipment="",this.stateFilterData.equipmentTo="",this.stateFilterData.characteristicType="",this.stateFilterData.characteristicTypeTo="",this.stateFilterData.characteristicType="",this.stateFilterData.characteristicTypeTo="",this.stateFilterData.startDate="",this.stateFilterData.startDateTo="",this.stateFilterData.endDate="",this.stateFilterData.endDateTo="";const t=this.stateLastUsedFilterData.equipment!=="",i=this.stateLastUsedFilterData.equipmentTo!=="",e=this.stateLastUsedFilterData.characteristicType!=="",u=this.stateLastUsedFilterData.characteristicTypeTo!=="",s=this.stateLastUsedFilterData.characteristicValue!=="",l=this.stateLastUsedFilterData.characteristicValueTo!=="",d=this.stateLastUsedFilterData.startDate!=="",r=this.stateLastUsedFilterData.startDateTo!=="",f=this.stateLastUsedFilterData.endDate!=="",v=this.stateLastUsedFilterData.endDateTo!=="";(t||i||e||u||s||l||d||r||f||v)&&await this.getData()},resetState(){this.stateFilterData={...nt},this.stateDisplayData=[],this.statePagination=new Z,this.stateLoading=!1,this.statePaginationLoading=!1}}}),ft={mdEquipmentCharacteristicValueId:0,equipment:"",characteristicType:"",characteristicValue:"",startDate:A(new Date),endDate:A(new Date("12/31/9999"))},rt=dt({id:"equipmentCharacteristicValueForm",state:()=>({stateFormData:{...ft},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1,stateCharacteristicValueOptionLoading:!1,stateEquipmentOption:[],stateCharacteristicTypeOption:[],stateCharacteristicValueOption:[]}),getters:{formData:t=>t.stateFormData,error:t=>t.stateError,errors:t=>t.stateErrors,isError:t=>t.stateIsError,loading:t=>t.stateLoading,equipmentOption:t=>t.stateEquipmentOption,characteristicTypeOption:t=>t.stateCharacteristicTypeOption,characteristicValueOption:t=>t.stateCharacteristicValueOption,characteristicValueOptionLoading:t=>t.stateCharacteristicValueOptionLoading},actions:{async getEquipmentLookup(){const t={ver:"v1"};try{const i=await O.get(At,"",new URLSearchParams(t).toString());this.stateEquipmentOption=Q(i.data.result.content.equipment)}catch(i){console.log(i)}},async getCharacteristicTypeLookup(){const t={ver:"v1"};try{const i=await O.get(gt,"",new URLSearchParams(t).toString());this.stateCharacteristicTypeOption=Dt(i.data.result.content,"characteristicType","characteristicTypeDescription")}catch(i){console.log(i)}},async getCharacteristicValueLookup(){this.stateCharacteristicValueOptionLoading=!0;const t={ver:"v1",characteristicType:this.stateFormData.characteristicType||""};try{const i=await O.get(gt,"",new URLSearchParams(t).toString());this.stateCharacteristicValueOption=Dt(i.data.result.content,"characteristicValue","characteristicValueDescription")}catch(i){console.log(i)}this.stateCharacteristicValueOptionLoading=!1},async insertData(t){try{this.stateLoading=!0;const i={userAccount:t,ver:"v1"},e={mdEquipmentCharacteristicValueId:this.stateFormData.mdEquipmentCharacteristicValueId,equipment:this.stateFormData.equipment,characteristicType:this.stateFormData.characteristicType,characteristicValue:this.stateFormData.characteristicValue,startDate:$(A(new Date(this.stateFormData.startDate))),endDate:$(A(new Date(this.stateFormData.endDate)))},u=await O.post(`${z}?${new URLSearchParams(i).toString()}`,e);u.data.title==="Error"?(this.stateErrors.push(u.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(i){this.stateError=i,this.stateErrors.push(i.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},async updateData(t){try{this.stateLoading=!0;const i={userAccount:t,ver:"v1"},e={mdEquipmentCharacteristicValueId:this.stateFormData.mdEquipmentCharacteristicValueId,equipment:this.stateFormData.equipment,characteristicType:this.stateFormData.characteristicType,characteristicValue:this.stateFormData.characteristicValue,startDate:$(A(new Date(this.stateFormData.startDate))),endDate:$(A(new Date(this.stateFormData.endDate)))},u=await O.post(`${Zt}?${new URLSearchParams(i).toString()}`,e);u.data.title==="Error"?(this.stateErrors.push(u.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(i){this.stateError=i,this.stateErrors.push(i.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},setErrors(t){this.stateErrors=t,this.stateIsError=this.stateErrors.length>0},setFormData(t){this.stateFormData.mdEquipmentCharacteristicValueId=t.mdEquipmentCharacteristicValueId||0,this.stateFormData.equipment=t.equipment||"",this.stateFormData.characteristicType=t.characteristicType||"",this.stateFormData.characteristicValue=t.characteristicValue||"",this.stateFormData.startDate=t.startDate||"",this.stateFormData.endDate=t.endDate||""},resetState(){this.stateFormData={...ft},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1}}}),te={key:0,style:{height:"100px"}},ee={key:0,class:"row justify-content-center"},ae={key:1,class:"row justify-content-center"},se={class:"row justify-content-center"},ie=["onClick"],re=N({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(t,{emit:i}){const e=t,u=ut(),s=rt(),l=i,d=E(()=>(e.page-1)*10+1),r=G(""),f=T=>{r.value=T.order;const C={prop:T.prop,order:T.order};u.setSort(C)},v=(T,C,S)=>xt(T[S],C[S],r.value),b=T=>{s.setFormData(T),l("show-dialog",null)};return(T,C)=>{const S=U("inline-svg"),P=U("el-tooltip"),V=at("loading");return o(u).loading?R((q(),X("div",te,null,512)),[[V,o(u).loading]]):R((q(),k(o(Tt),{key:1,data:e.listData,style:{width:"100%"},onSortChange:f,"empty-text":"No Data"},{default:p(()=>[a(o(_),{label:"No",width:"90",align:"center"},{default:p(n=>[h("span",null,Y(d.value+n.$index),1)]),_:1}),a(o(_),{prop:"equipment",label:"Equipment","min-width":"200",sortable:"","sort-method":(n,D)=>v(n,D,"equipment")},null,8,["sort-method"]),a(o(_),{prop:"characteristicType",label:"Characteristic Type","min-width":"250",sortable:"","sort-method":(n,D)=>v(n,D,"characteristicType")},null,8,["sort-method"]),a(o(_),{prop:"characteristicValue",label:"Characteristic Value","min-width":"250",sortable:"","sort-method":(n,D)=>v(n,D,"characteristicValue")},null,8,["sort-method"]),a(o(_),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""},{default:p(n=>[h("span",null,Y(o(mt)(n.row.startDate)),1)]),_:1}),a(o(_),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""},{default:p(n=>[h("span",null,Y(o(mt)(n.row.endDate)),1)]),_:1}),a(o(_),{prop:"isActive",label:"Is Active",width:"100",sortable:""},{default:p(n=>[n.row.isActive?(q(),X("div",ee,[a(S,{src:"/media/svg/tables/rows/check.svg"})])):(q(),X("div",ae,[a(S,{src:"/media/svg/tables/rows/minus.svg"})]))]),_:1}),a(o(_),{prop:"changedOn",label:"Changed on",align:"center",width:"170",sortable:""},{default:p(n=>[h("span",null,Y(o(Ot)(n.row.changedOn)),1)]),_:1}),a(o(_),{prop:"changedBy",label:"Changed by",sortable:"",width:"300","sort-method":(n,D)=>v(n,D,"changedBy")},null,8,["sort-method"]),a(o(_),{label:"",width:"80"},{default:p(n=>[h("div",se,[a(P,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:p(()=>[h("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:D=>b(n.row)},[a(S,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,ie)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[V,o(u).loading]])}}}),oe={class:"col-md-6 fv-row fv-plugins-icon-container"},ne={class:"col-md-6 fv-row fv-plugins-icon-container"},le={class:"dialog-footer"},ce=N({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:i}){const e=t,u=i,s=rt(),l=lt(),d=st(e,"visibility"),r=E(()=>s.formData),f=E(()=>s.errors),v=E(()=>s.isError),b=E(()=>s.equipmentOption),T=E(()=>s.characteristicTypeOption),C=E(()=>r.value.characteristicType!=""?s.characteristicValueOption:[]),S=Et().shape({equipment:M().required("Equipment is mandatory"),characteristicType:M().required("Characteristic Type is mandatory"),characteristicValue:M().required("Characteristic Value is mandatory"),startDate:tt().required("Start Date is mandatory").typeError("Start Date is mandatory"),endDate:tt().required("End Date is mandatory").min(bt("startDate"),"End date must be later than start date").typeError("End Date is mandatory")}),P=()=>{n(""),D(""),g(""),I(""),m("")},V=(c=!1)=>{y(),P(),s.resetState(),u("handle-close",c)},n=c=>{r.value.equipment=c},D=async c=>{r.value.characteristicType=c,r.value.characteristicValue="",await s.getCharacteristicValueLookup()},g=c=>{r.value.characteristicValue=c},I=c=>{r.value.startDate=c},m=c=>{r.value.endDate=c},w=async()=>{y(),await S.validate(r.value,{abortEarly:!1}).catch(c=>{s.setErrors(c.errors)}),!v.value&&W("Are you sure you want to submit ?").then(async c=>{c.isConfirmed&&s.insertData(l.user.Name).then(()=>{s.isError||ct("Form has been successfully submitted!","Ok").then(()=>{V(!0)})})})},y=()=>{s.setErrors([])};return(c,F)=>{const B=U("el-button"),K=U("el-dialog"),x=at("loading");return R((q(),k(K,{modelValue:d.value,"onUpdate:modelValue":F[0]||(F[0]=H=>d.value=H),title:"New Data",width:"40%",onClose:F[1]||(F[1]=H=>V())},{footer:p(()=>[h("span",le,[a(B,{type:"primary",onClick:w,disabled:o(s).loading},{default:p(()=>[L("Submit")]),_:1},8,["disabled"]),a(B,{type:"secondary",onClick:V,disabled:o(s).loading},{default:p(()=>[L("Close")]),_:1},8,["disabled"])])]),default:p(()=>[a(_t,{name:"fade"},{default:p(()=>[v.value?(q(),k(St,{key:0,errorMessages:f.value,onResetForm:y},null,8,["errorMessages"])):it("",!0)]),_:1}),R((q(),k(o(Ct),{id:"kt_filter_form",class:"row g-9 my-4"},{default:p(()=>[a(j,{value:r.value.equipment,label:"Equipment",name:"Equipment",placeholder:"Add Equipment",options:b.value,onHandleChange:n},null,8,["value","options"]),a(j,{value:r.value.characteristicType,label:"Characteristic Type",name:"CharacteristicType",placeholder:"Add Characteristic Type",options:T.value,onHandleChange:D},null,8,["value","options"]),R(a(j,{value:r.value.characteristicValue,label:"Characteristic Value",name:"CharacteristicValue",placeholder:r.value.characteristicType==""?"Select Characteristic Type first":"Add Characteristic Value","is-disabled":r.value.characteristicType=="",options:C.value,onHandleChange:g},null,8,["value","placeholder","is-disabled","options"]),[[x,o(s).characteristicValueOptionLoading]]),h("div",oe,[a(et,{value:r.value.startDate,placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:I},null,8,["value"])]),h("div",ne,[a(et,{value:r.value.endDate,placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:m},null,8,["value"])])]),_:1})),[[x,o(s).loading]])]),_:1},8,["modelValue"])),[[x,o(s).loading]])}}}),de={class:"col-md-6 fv-row fv-plugins-icon-container"},ue={class:"col-md-6 fv-row fv-plugins-icon-container"},pe={class:"dialog-footer"},he=N({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:i}){const e=t,u=i,s=rt(),l=lt(),d=st(e,"visibility"),r=E(()=>s.formData),f=E(()=>s.errors),v=E(()=>s.isError),b=E(()=>s.equipmentOption),T=E(()=>s.characteristicTypeOption),C=E(()=>s.characteristicValueOption),S=Et().shape({equipment:M().required("Equipment is mandatory"),characteristicType:M().required("Characteristic Type is mandatory"),characteristicValue:M().required("Characteristic Value is mandatory"),startDate:tt().required("Start Date is mandatory").typeError("Start Date is mandatory"),endDate:tt().required("End Date is mandatory").min(bt("startDate"),"End date must be later than start date").typeError("End Date is mandatory")}),P=()=>{r.value.mdEquipmentCharacteristicValueId=0,r.value.equipment="",r.value.characteristicType="",r.value.characteristicValue="",r.value.startDate="",r.value.endDate=""},V=(c=!1)=>{P(),s.resetState(),y(),u("handle-close",c)},n=c=>{r.value.equipment=c},D=async c=>{r.value.characteristicType=c,r.value.characteristicValue="",await s.getCharacteristicValueLookup()},g=c=>{r.value.characteristicValue=c},I=c=>{r.value.startDate=c},m=c=>{r.value.endDate=c},w=async()=>{y(),await S.validate(r.value,{abortEarly:!1}).catch(c=>{s.setErrors(c.errors)}),!v.value&&W("Are you sure you want to submit ?").then(async c=>{c.isConfirmed&&s.updateData(l.user.Name).then(()=>{s.isError||ct("Form has been successfully submitted!","Ok").then(()=>{V(!0)})})})},y=()=>{s.setErrors([])};return(c,F)=>{const B=U("el-button"),K=U("el-dialog"),x=at("loading");return R((q(),k(K,{modelValue:d.value,"onUpdate:modelValue":F[0]||(F[0]=H=>d.value=H),title:"Update Data",width:"40%",onClose:F[1]||(F[1]=H=>V())},{footer:p(()=>[h("span",pe,[a(B,{type:"primary",onClick:w,disabled:o(s).loading},{default:p(()=>[L("Submit")]),_:1},8,["disabled"]),a(B,{type:"secondary",onClick:V,disabled:o(s).loading},{default:p(()=>[L("Close")]),_:1},8,["disabled"])])]),default:p(()=>[a(_t,{name:"fade"},{default:p(()=>[v.value?(q(),k(St,{key:0,errorMessages:f.value,onResetForm:y},null,8,["errorMessages"])):it("",!0)]),_:1}),a(o(Ct),{id:"kt_filter_form",class:"row g-9 my-4"},{default:p(()=>[a(j,{value:r.value.equipment,label:"Equipment",name:"Equipment",placeholder:"Add Equipment",options:b.value,onHandleChange:n},null,8,["value","options"]),a(j,{value:r.value.characteristicType,label:"Characteristic Type",name:"CharacteristicType",placeholder:"Add Characteristic Type",options:T.value,onHandleChange:D},null,8,["value","options"]),R(a(j,{value:r.value.characteristicValue,label:"Characteristic Value",name:"CharacteristicValue",placeholder:r.value.characteristicType==""?"Select Characteristic Type first":"Add Characteristic Value","is-disabled":r.value.characteristicType=="",options:C.value,onHandleChange:g},null,8,["value","placeholder","is-disabled","options"]),[[x,o(s).characteristicValueOptionLoading]]),h("div",de,[a(et,{value:r.value.startDate,placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:I},null,8,["value"])]),h("div",ue,[a(et,{value:r.value.endDate,placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:m},null,8,["value"])])]),_:1})]),_:1},8,["modelValue"])),[[x,o(s).loading]])}}}),pt=dt({id:"EquipmentCharacteristicValueBulk",state:()=>({statePagination:new Z,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkInsert(t){const i={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const e=await O.post(`${Jt}?${new URLSearchParams(i).toString()}`,this.stateBulkData);this.stateError=e.data.result.isError?e.data.result.message:"",this.stateIsError=e.data.result.isError}catch(e){console.log(e)}this.stateLoading=!1},async upload({userAccount:t,excelFile:i}){const e={userAccount:t,ver:"v1"},u=`${Qt}?${new URLSearchParams(e).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const s=await O.postImages(u,i);s.data.statusCode==200?s.data.result.isError?(this.stateIsError=!0,this.stateError=s.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=s.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=Mt.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=s.data.result.isError,this.stateError=s.data.result.message)}catch(s){console.log(s),this.stateIsError=!0,this.stateError=s.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort($t(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new Z,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}}),me={class:"icon"},De=N({__name:"GridBulk",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},setup(t){const i=t,e=pt(),u=E(()=>(i.page-1)*10+1),s=l=>{const d={prop:l.prop,order:l.order};e.setSort(d)};return(l,d)=>{const r=U("inline-svg");return q(),k(o(Tt),{data:i.listData,style:{width:"100%"},onSortChange:s,"empty-text":"No Data"},{default:p(()=>[a(o(_),{label:"No",width:"60",align:"center"},{default:p(f=>[h("span",null,Y(u.value+f.$index),1)]),_:1}),a(o(_),{prop:"equipment",label:"Equipment",width:"300",sortable:""}),a(o(_),{prop:"characteristicType",label:"Characteristic Type",width:"300",sortable:""}),a(o(_),{prop:"characteristicValue",label:"Characteristic Value",width:"300",sortable:""}),a(o(_),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""}),a(o(_),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""}),a(o(_),{prop:"validationReason",label:"Remark",width:"300",sortable:""}),a(o(_),{prop:"isValid",label:"Status",width:"100",sortable:""},{default:p(f=>[h("div",me,[a(r,{src:f.row.isValid?"/media/svg/tables/rows/valid-true.svg":"/media/svg/tables/rows/valid-false.svg"},null,8,["src"])])]),_:1})]),_:1},8,["data"])}}}),ht=t=>(Rt("data-v-7d4b3776"),t=t(),Bt(),t),ge=ht(()=>h("div",{class:"text-center"},null,-1)),ye=ht(()=>h("div",{class:"mb-3"},[h("span",null,[L(" Download template "),h("a",{href:"documents/MasterDataEquipmentCharacteristicValue.xlsx",target:"_blank",id:"link-download"},"here"),L(" before uploading file ")])],-1)),fe=ht(()=>h("div",{class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},[h("div",{class:"d-flex align-items-center position-relative my-0 mb-2"})],-1)),ve={class:"card"},Te={class:"card-body grid-padding"},_e={class:"dialog-footer"},Ce=N({__name:"UploadBulkDialog",props:{visibility:{required:!0,type:Boolean}},emits:["handle-close"],setup(t,{emit:i}){const e=t,u=i,s=lt(),l=pt(),d=st(e,"visibility"),r=()=>{const n=Kt(l.validatedData,D=>{const g=D;return{mdEquipmentCharacteristicValueId:0,equipment:g.equipment,characteristicType:g.characteristicType,characteristicValue:g.characteristicValue,startDate:g.startDate,endDate:g.endDate}});return Object.values(n)},f=()=>{const n=document.getElementById("link-download");n&&n.click()},v=()=>{l.validatedData.length>0?W("Cancel Upload Data?","Confirm").then(D=>{D.isConfirmed&&T()}):T()},b=async n=>{await l.upload({userAccount:s.user.Name,excelFile:n}),l.stateError&&J(l.error)},T=(n=!1)=>{l.resetState(),u("handle-close",n)},C=n=>{l.setIsUploadedState(n)},S=n=>{l.setPage(n)},P=()=>{if(l.validatedData.length<1){f();return}const n=["EQUIPMENT","CHARACTERISTIC TYPE","CHARACTERISTIC VALUE","START DATE","END DATE","REMARK","STATUS"],D=l.validatedData.map(g=>({equipment:g.equipment,characteristicType:g.characteristicType,characteristicValue:g.characteristicValue,startDate:g.startDate,endDate:g.endDate,remark:g.validationReason,status:g.isValid?"OK":"Error"}));kt("Equipment Characteristic Value",n,D)},V=async()=>{if(l.displayData.length<1){J("There is no data to submit");return}if(l.isError){J("There is still invalid row(s)");return}W("Are you sure you want to submit ?").then(async n=>{if(n.isConfirmed){const D=r();if(l.setBulkData(D),await l.bulkInsert(s.user.Name),l.isError){J(l.stateError);return}ct("Form has been successfully submitted!","Ok").then(()=>{T(!0)})}})};return(n,D)=>{const g=U("el-button"),I=U("el-dialog"),m=at("loading");return q(),k(I,{title:"Upload Bulk Data",modelValue:d.value,"onUpdate:modelValue":D[1]||(D[1]=w=>d.value=w),"before-close":v,width:"70%","custom-class":"upload-modal"},{footer:p(()=>[h("div",null,[h("span",_e,[a(g,{type:"success",onClick:P},{default:p(()=>[L("Download")]),_:1}),a(g,{type:"primary",onClick:V},{default:p(()=>[L("Upload")]),_:1}),a(g,{type:"success",onClick:v},{default:p(()=>[L("Cancel")]),_:1})])])]),default:p(()=>[ge,ye,R(a(jt,{isSubmissionUploadSuccess:o(l).isUploaded,onHandleCloseUploadedFile:v,onHandleUpload:b,onHandleSetIsExcelFileUploaded:C},null,8,["isSubmissionUploadSuccess"]),[[m,o(l).uploadLoading]]),fe,h("div",ve,[h("div",Te,[a(De,{"list-data":o(l).displayData,page:o(l).pagination.currentPage},null,8,["list-data","page"])])]),o(l).displayData.length>0?(q(),k(vt,{key:0,onRaisePageChange:D[0]||(D[0]=w=>S(w)),currentPage:o(l).pagination.currentPage,totalPage:o(l).pagination.totalPage,totalPageSize:o(l).pagination.totalPageSize,startPaginationIndex:o(l).pagination.startPaginationIndex,endPaginationIndex:o(l).pagination.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"])):it("",!0)]),_:1},8,["modelValue"])}}}),Ee=Gt(Ce,[["__scopeId","data-v-7d4b3776"]]),be={class:"row g-9 my-4"},Se={class:"dialog-footer"},Ve=N({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:i}){const e=ut(),u=t,s=i,l=st(u,"visibility"),d=E(()=>e.filterData),r=()=>{f(),e.resetFilter()},f=()=>{s("handle-close",!1)},v=m=>{e.setEquipment(m)},b=m=>{e.setEquipmentTo(m)},T=m=>{e.setCharacteristicType(m)},C=m=>{e.setCharacteristicTypeTo(m)},S=m=>{e.setCharacteristicValue(m)},P=m=>{e.setCharacteristicValueTo(m)},V=m=>{e.setStartDate(m)},n=m=>{e.setStartDateTo(m)},D=m=>{e.setEndDate(m)},g=m=>{e.setEndDateTo(m)},I=()=>{const m=e.lastUsedFilterData.equipment!==e.filterData.equipment,w=e.lastUsedFilterData.equipmentTo!==e.filterData.equipmentTo,y=e.lastUsedFilterData.characteristicType!==e.filterData.characteristicType,c=e.lastUsedFilterData.characteristicTypeTo!==e.filterData.characteristicTypeTo,F=e.lastUsedFilterData.characteristicValue!==e.filterData.characteristicValue,B=e.lastUsedFilterData.characteristicValueTo!==e.filterData.characteristicValueTo,K=e.lastUsedFilterData.startDate!==e.filterData.startDate,x=e.lastUsedFilterData.startDateTo!==e.filterData.startDateTo,H=e.lastUsedFilterData.endDate!==e.filterData.endDate,Vt=e.lastUsedFilterData.endDateTo!==e.filterData.endDateTo;s("handle-close",m||w||y||c||F||B||K||x||H||Vt)};return(m,w)=>{const y=U("el-button"),c=U("el-dialog");return q(),k(c,{modelValue:l.value,"onUpdate:modelValue":w[0]||(w[0]=F=>l.value=F),title:"Filter",width:"60%",onClose:w[1]||(w[1]=F=>f())},{footer:p(()=>[h("span",Se,[a(y,{type:"secondary",onClick:r},{default:p(()=>[L("Reset")]),_:1}),a(y,{type:"primary",onClick:I},{default:p(()=>[L("Filter")]),_:1})])]),default:p(()=>[h("div",be,[a(ot,{"value-from":d.value.equipment,"value-to":d.value.equipmentTo,label:"Equipment",name:"Equipment",options:o(e).equipmentOption,onHandleChangeFrom:v,onHandleChangeTo:b},null,8,["value-from","value-to","options"]),a(ot,{"value-from":d.value.characteristicType,"value-to":d.value.characteristicTypeTo,label:"Characteristic Type",name:"CharacteristicType",options:o(e).characteristicTypeOption,onHandleChangeFrom:T,onHandleChangeTo:C},null,8,["value-from","value-to","options"]),a(ot,{"value-from":d.value.characteristicValue,"value-to":d.value.characteristicValueTo,label:"Characteristic Value",name:"CharacteristicValue",options:o(e).characteristicValueOption,onHandleChangeFrom:S,onHandleChangeTo:P},null,8,["value-from","value-to","options"]),a(yt,{"value-from":d.value.startDate?d.value.startDate.toString():"","value-to":d.value.startDateTo?d.value.startDateTo.toString():"",label:"Start Date",name:"StartDate",placeholder:"Pick a date",onHandleChangeFrom:V,onHandleChangeTo:n},null,8,["value-from","value-to"]),a(yt,{"value-from":d.value.endDate?d.value.endDate.toString():"","value-to":d.value.endDateTo?d.value.endDateTo.toString():"",label:"End Date",name:"EndDate",placeholder:"Pick a date",onHandleChangeFrom:D,onHandleChangeTo:g},null,8,["value-from","value-to"])])]),_:1},8,["modelValue"])}}}),we={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},Fe=h("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),qe={class:"d-flex justify-content-between align-items-center"},Pe={class:"card"},ke={class:"card-body grid-padding"},Le={class:"my-5"},Ka=N({__name:"Index",setup(t){const i=wt(),e=ut(),u=rt(),s=pt(),l=G(!1),d=G(!1),r=G(!1),f=G(!1),v=E(()=>e.displayData),b=E(()=>e.pagination),T=y=>{e.setPage(y)};Ht(async()=>{i[qt.ACTIVE_PAGE]("IronLake"),Ft("Equipment Characteristic Value",[{pageName:"Iron Lake",pageRoute:"ironlake"},{pageName:"Equipment",pageRoute:"useequipmentcharacteristicvalue"},{pageName:"Equipment Characteristic Value",pageRoute:"useequipmentcharacteristicvalue"}]),e.setPage(1),await e.getLookup(),await u.getEquipmentLookup(),await u.getCharacteristicTypeLookup(),await u.getCharacteristicValueLookup()}),Nt(async()=>{e.resetState(),u.resetState(),s.resetState()});const C=async()=>{await e.setPage(1),await e.getLookup(),await u.getEquipmentLookup(),await u.getCharacteristicTypeLookup(),await u.getCharacteristicValueLookup()},S=()=>{l.value=!0},P=async y=>{l.value=!1,y&&await C()},V=()=>{d.value=!0},n=async y=>{d.value=!1,y&&await C()},D=()=>{r.value=!0},g=async y=>{r.value=!1,y&&await C()},I=async()=>{const y=await e.export();Yt.saveAs(new Blob([y],{type:"application/octet-stream"}),"useEquipmentCharacteristicValue.xlsx")},m=()=>{f.value=!0},w=async y=>{f.value=!1,y&&await C()};return(y,c)=>(q(),X(zt,null,[h("div",we,[Fe,h("div",qe,[a(Lt,{onShowDialog:S}),a(Pt,{onShowDialog:D}),a(It,{onHandleDownload:I}),a(Ut,{onShowDialog:m})])]),h("div",Pe,[h("div",ke,[a(re,{"list-data":v.value,page:b.value.currentPage,onShowDialog:V},null,8,["list-data","page"])])]),h("div",Le,[o(e).paginationLoading?it("",!0):(q(),k(vt,{key:0,onRaisePageChange:c[0]||(c[0]=F=>T(F)),currentPage:b.value.currentPage,totalPage:b.value.totalPage,totalPageSize:b.value.totalPageSize,startPaginationIndex:b.value.startPaginationIndex,endPaginationIndex:b.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),a(ce,{visibility:l.value,onHandleClose:P},null,8,["visibility"]),a(he,{visibility:d.value,onHandleClose:n},null,8,["visibility"]),a(Ve,{visibility:r.value,onHandleClose:g},null,8,["visibility"]),a(Ee,{visibility:f.value,onHandleClose:w},null,8,["visibility"])],64))}});export{Ka as default};
