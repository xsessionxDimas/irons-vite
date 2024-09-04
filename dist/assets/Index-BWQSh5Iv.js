import{u as gt}from"./vuex-BbOKrtVp.js";import{a as yt}from"./breadcrumb-BYmEOf4C.js";import{c as B,a as tt,J as M,I as et,z as q,A as ft}from"./index-BuVmIl8K.js";import{P as lt}from"./Pagination-D-xfdYmn.js";import{F as vt}from"./FilterIconButton-Bj0WTbms.js";import{h as St,A as Tt,U as _t}from"./excel-generator-DMHRo93s.js";import{D as Et}from"./DownloadIconButton-CIQp-YG7.js";import{_ as C,b as dt}from"./element-plus-BeWdvTRa.js";import{q as k,w as $,x as rt,y as Ct}from"./date-format-8-IvfSl3.js";import{P as j}from"./Pagination-BiobnanQ.js";import{C as pt,L as bt,E as wt,U as Ft,B as Pt,a as kt}from"./urls-BUeydZtD.js";import{d as at}from"./pinia-BjOS2_Ao.js";import{a as It}from"./mapOption-CeGMwmH0.js";import{k as V,bL as Lt,r as R,u as n,y as O,p as b,aa as z,q as I,x as m,Y as J,R as U,s as o,aB as c,C as N,a0 as X,c as x,B as L,A as Q,T as ct,bd as Ut,bb as xt,a7 as At,L as $t,F as Bt}from"./@vue-BypzYtbH.js";import{a as Vt,d as Ot}from"./table-sort-Bpdq_Uwn.js";import{_ as G}from"./TextInput.vue_vue_type_script_setup_true_lang-oAh_qqu1.js";import{a as mt}from"./vee-validate-C_msoaAA.js";import{c as ut,a as Z,b as K,d as Dt}from"./yup-C6P98bvY.js";import"./property-expr-DEi1ZLzV.js";import{E as ht}from"./ErrorAlert-CMKGfwAi.js";import{_ as Y}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-CCwjwK39.js";import{e as Rt}from"./lodash-DrHMlsdo.js";import{_ as Nt}from"./FileDropZone.vue_vue_type_style_index_0_lang-C5PyimC7.js";import{m as Ht}from"./map-anything-abi6NY2Z.js";import{_ as qt}from"./nw-img-vue-CR837WER.js";import{_ as zt}from"./AutoComplete.vue_vue_type_style_index_0_lang-DrAAOf71.js";import{_ as it}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-CJ7rJST9.js";import{F as Mt}from"./file-saver-CwTBvle_.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./useMenuStore-CD5Gmvif.js";import"./PageEnum-DUtfSNQS.js";import"./xlsx-C4maHrMm.js";import"./moment-C5S46NFB.js";import"./nanoclone-BAWie4i9.js";import"./toposort-NSxIV7Fb.js";import"./vue3-dropzone-_NG5IwbJ.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";import"./attr-accept-DLIfoYC7.js";const ot=at({id:"componentTypeList",state:()=>({stateFilterData:{ComponentType:"",StartDate:"",EndDate:"",ComponentTypeTo:"",StartDateTo:"",EndDateTo:"",ver:"v1",Page:1,PageSize:10,Order:""},stateLastUsedFilterData:{ComponentType:"",StartDate:"",EndDate:"",ComponentTypeTo:"",StartDateTo:"",EndDateTo:"",ver:"v1",Page:1,PageSize:10,Order:""},statePageName:"componentType",stateDisplayData:[],statePagination:new j,stateLoading:!1,statePaginationLoading:!1,stateComponentTypeOption:[]}),getters:{pageName:t=>t.statePageName,pagination:t=>t.statePagination,displayData:t=>t.stateDisplayData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,paginationLoading:t=>t.statePaginationLoading,componentTypeOption:t=>t.stateComponentTypeOption},actions:{async getData(t=!0){const i={ComponentType:this.stateFilterData.ComponentType,StartDate:this.stateFilterData.StartDate?k(this.stateFilterData.StartDate.toLocaleString()):"",EndDate:this.stateFilterData.EndDate?k(this.stateFilterData.EndDate.toLocaleString()):"",ComponentTypeTo:this.stateFilterData.ComponentTypeTo,StartDateTo:this.stateFilterData.StartDateTo?k(this.stateFilterData.StartDateTo.toLocaleString()):"",EndDateTo:this.stateFilterData.EndDateTo?k(this.stateFilterData.EndDateTo.toLocaleString()):"",Page:this.stateFilterData.Page.toString(),PageSize:this.stateFilterData.PageSize.toString(),Order:this.stateFilterData.Order,ver:this.stateFilterData.ver};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const e=await B.get(pt,"",new URLSearchParams(i).toString());this.stateDisplayData=e.data.result.content,this.setTotalPage(e.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(e){console.log(e)}this.stateLoading=!1},async getLookup(){const t={ver:this.stateFilterData.ver};try{const i=await B.get(bt,"",new URLSearchParams(t).toString());this.stateComponentTypeOption=It(i.data.result.content,"componentType","componentTypeDescription")}catch(i){console.log(i)}},async export(){const t={ver:this.stateFilterData.ver,Gmt:new Date().toTimeString().slice(12,17),ComponentType:this.stateFilterData.ComponentType,StartDate:this.stateFilterData.StartDate?k(this.stateFilterData.StartDate.toLocaleString()):"",EndDate:this.stateFilterData.EndDate?k(this.stateFilterData.EndDate.toLocaleString()):"",ComponentTypeTo:this.stateFilterData.ComponentTypeTo,StartDateTo:this.stateFilterData.StartDateTo?k(this.stateFilterData.StartDateTo.toLocaleString()):"",EndDateTo:this.stateFilterData.EndDateTo?k(this.stateFilterData.EndDateTo.toLocaleString()):"",Order:this.stateFilterData.Order};try{return(await B.getBlob(wt,"",new URLSearchParams(t).toString())).data}catch(i){console.log(i)}},setTotalPage(t){this.pagination.totalPage=t,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(t){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(t),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:t,order:i}){if(!t&&!i)this.stateFilterData.Order="";else{const e=i=="ascending"?"asc":"desc";this.stateFilterData.Order=`${t}_${e}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1)},setComponentType(t){this.stateFilterData.ComponentType=t},setStartDate(t){this.stateFilterData.StartDate=t},setEndDate(t){this.stateFilterData.EndDate=t},setComponentTypeTo(t){this.stateFilterData.ComponentTypeTo=t},setStartDateTo(t){this.stateFilterData.StartDateTo=t},setEndDateTo(t){this.stateFilterData.EndDateTo=t},async resetFilter(){this.stateFilterData.ComponentType="",this.stateFilterData.StartDate="",this.stateFilterData.EndDate="",this.stateFilterData.ComponentTypeTo="",this.stateFilterData.StartDateTo="",this.stateFilterData.EndDateTo="";const t=this.stateLastUsedFilterData.ComponentType!=="",i=this.stateLastUsedFilterData.StartDate!=="",e=this.stateLastUsedFilterData.EndDate!=="",h=this.stateLastUsedFilterData.ComponentTypeTo!=="",s=this.stateLastUsedFilterData.StartDateTo!=="",r=this.stateLastUsedFilterData.EndDateTo!=="";(t||i||e||h||s||r)&&await this.getData()},resetState(){this.stateFilterData={ComponentType:"",StartDate:"",EndDate:"",ComponentTypeTo:"",StartDateTo:"",EndDateTo:"",ver:"v1",Page:1,PageSize:10,Order:""},this.stateDisplayData=[],this.statePagination=new j,this.stateLoading=!1,this.statePaginationLoading=!1}}}),W=at({id:"componentTypeForm",state:()=>({stateFormData:{ComponentTypeId:0,ComponentType:"",ComponentTypeDescription:"",IsActive:!0,StartDate:$(new Date),EndDate:$(new Date("12/31/9999"))},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1}),getters:{formData:t=>t.stateFormData,error:t=>t.stateError,errors:t=>t.stateErrors,isError:t=>t.stateIsError,loading:t=>t.stateLoading},actions:{async insertData(t){this.stateFormData.StartDate=k($(new Date(this.stateFormData.StartDate))),this.stateFormData.EndDate=k($(new Date(this.stateFormData.EndDate)));try{this.stateLoading=!0;const i={userAccount:t,ver:"v1"},e=await B.post(`${pt}?${new URLSearchParams(i).toString()}`,this.stateFormData);e.data.title==="Error"?(this.stateErrors.push(e.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(i){this.stateError=i,this.stateErrors.push(i.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},async updateData(t){this.stateFormData.StartDate=k($(new Date(this.stateFormData.StartDate))),this.stateFormData.EndDate=k($(new Date(this.stateFormData.EndDate)));try{this.stateLoading=!0;const i={userAccount:t,ver:"v1"},e=await B.post(`${Ft}?${new URLSearchParams(i).toString()}`,this.stateFormData);e.data.title==="Error"?(this.stateErrors.push(e.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(i){this.stateError=i,this.stateErrors.push(i.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},setErrors(t){this.stateErrors=t,this.stateIsError=this.stateErrors.length>0},setFormData(t){this.stateFormData.ComponentTypeId=t.componentTypeId||0,this.stateFormData.ComponentType=t.componentType||"",this.stateFormData.ComponentTypeDescription=t.componentTypeDescription||"",this.stateFormData.StartDate=t.startDate||"",this.stateFormData.EndDate=t.endDate||"",this.stateFormData.IsActive=t.isActive||!1},resetState(){this.stateFormData={ComponentTypeId:0,ComponentType:"",ComponentTypeDescription:"",IsActive:!0,StartDate:$(new Date),EndDate:$(new Date("12/31/9999"))},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1}}}),jt={key:0,style:{height:"100px"}},Gt={key:0,class:"row justify-content-center"},Kt={key:1,class:"row justify-content-center"},Yt={class:"row justify-content-center"},Jt=["onClick"],Xt=V({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(t,{emit:i}){const e=t,h=ot(),s=W(),r=i,u=Lt(()=>(e.page-1)*10+1),l=R(""),f=g=>{l.value=g.order;const y={prop:g.prop,order:g.order};h.setSort(y)},v=(g,y,S)=>Vt(g[S],y[S],l.value),_=g=>{s.setFormData(g),r("show-dialog",null)};return(g,y)=>{const S=U("inline-svg"),F=U("el-tooltip"),w=J("loading");return n(h).loading?O((b(),z("div",jt,null,512)),[[w,n(h).loading]]):O((b(),I(n(dt),{key:1,data:e.listData,style:{width:"100%"},onSortChange:f,"empty-text":"No Data"},{default:m(()=>[o(n(C),{label:"No",width:"90",align:"center"},{default:m(a=>[c("span",null,N(n(u)+a.$index),1)]),_:1}),o(n(C),{prop:"componentType",label:"Component Type",width:"170",sortable:"","sort-method":(a,p)=>v(a,p,"componentType")},null,8,["sort-method"]),o(n(C),{prop:"componentTypeDescription",label:"Component Type Desc","min-width":"200",sortable:"","sort-method":(a,p)=>v(a,p,"componentTypeDescription")},null,8,["sort-method"]),o(n(C),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""},{default:m(a=>[c("span",null,N(n(rt)(a.row.startDate)),1)]),_:1}),o(n(C),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""},{default:m(a=>[c("span",null,N(n(rt)(a.row.endDate)),1)]),_:1}),o(n(C),{prop:"isActive",label:"Is Active",width:"100",sortable:""},{default:m(a=>[a.row.isActive?(b(),z("div",Gt,[o(S,{src:"/media/svg/tables/rows/check.svg"})])):(b(),z("div",Kt,[o(S,{src:"/media/svg/tables/rows/minus.svg"})]))]),_:1}),o(n(C),{prop:"changedOn",label:"Changed on",align:"center",width:"170",sortable:""},{default:m(a=>[c("span",null,N(n(Ct)(a.row.changedOn)),1)]),_:1}),o(n(C),{prop:"changedBy",label:"Changed by",sortable:"",width:"300","sort-method":(a,p)=>v(a,p,"changedBy")},null,8,["sort-method"]),o(n(C),{label:"",width:"80"},{default:m(a=>[c("div",Yt,[o(F,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:m(()=>[c("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:p=>_(a.row)},[o(S,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,Jt)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[w,n(h).loading]])}}}),Qt={class:"col-md-6 fv-row fv-plugins-icon-container"},Wt={class:"col-md-6 fv-row fv-plugins-icon-container"},Zt={class:"dialog-footer"},te=V({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:i}){const e=t,h=i,s=W(),r=tt(),u=X(e,"visibility"),l=x(()=>s.formData),f=x(()=>s.errors),v=x(()=>s.isError),_=ut().shape({ComponentType:Z().required("Component Type is mandatory"),ComponentTypeDescription:Z().required("Component Type Desc is mandatory"),StartDate:K().required("Start Date is mandatory").typeError("Start Date is mandatory"),EndDate:K().required("End Date is mandatory").min(Dt("StartDate"),"End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory")}),g=()=>{S(""),F(""),w(""),a("")},y=(D=!1)=>{d(),g(),s.resetState(),h("handle-close",D)},S=D=>{l.value.ComponentType=D},F=D=>{l.value.ComponentTypeDescription=D},w=D=>{l.value.StartDate=D},a=D=>{l.value.EndDate=D},p=async()=>{d(),await _.validate(l.value,{abortEarly:!1}).catch(D=>{s.setErrors(D.errors)}),!v.value&&M("Are you sure you want to submit ?").then(async D=>{D.isConfirmed&&s.insertData(r.user.Name).then(()=>{s.isError||et("Form has been successfully submitted!","Ok").then(()=>{y(!0)})})})},d=()=>{s.setErrors([])};return(D,E)=>{const P=U("el-button"),T=U("el-dialog"),A=J("loading");return O((b(),I(T,{modelValue:u.value,"onUpdate:modelValue":E[0]||(E[0]=H=>u.value=H),title:"New Data",width:"40%",onClose:E[1]||(E[1]=H=>y())},{footer:m(()=>[c("span",Zt,[o(P,{type:"primary",onClick:p,disabled:n(s).loading},{default:m(()=>[L("Submit")]),_:1},8,["disabled"]),o(P,{type:"secondary",onClick:y,disabled:n(s).loading},{default:m(()=>[L("Close")]),_:1},8,["disabled"])])]),default:m(()=>[o(ct,{name:"fade"},{default:m(()=>[v.value?(b(),I(ht,{key:0,errorMessages:f.value,onResetForm:d},null,8,["errorMessages"])):Q("",!0)]),_:1}),O((b(),I(n(mt),{id:"kt_filter_form",class:"row g-4 my-4"},{default:m(()=>[o(G,{value:l.value.ComponentType,margin:!1,placeholder:"Add Component Type",label:"Component Type",name:"ComponentType",max:20,onHandleChange:S},null,8,["value"]),o(G,{value:l.value.ComponentTypeDescription,placeholder:"Add Component Type Desc",label:"Component Type Desc",name:"ComponentTypeDescription",max:40,onHandleChange:F},null,8,["value"]),c("div",Qt,[o(Y,{value:l.value.StartDate?l.value.StartDate.toString():"",placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:w},null,8,["value"])]),c("div",Wt,[o(Y,{value:l.value.EndDate?l.value.EndDate.toString():"",placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:a},null,8,["value"])])]),_:1})),[[A,n(s).loading]])]),_:1},8,["modelValue"])),[[A,n(s).loading]])}}}),ee={class:"col-md-6 fv-row fv-plugins-icon-container"},ae={class:"col-md-6 fv-row fv-plugins-icon-container"},oe={class:"dialog-footer"},se=V({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:i}){const e=t,h=i,s=W(),r=tt(),u=X(e,"visibility"),l=x(()=>s.formData),f=x(()=>s.errors),v=x(()=>s.isError),_=ut().shape({ComponentTypeDescription:Z().required("Component Type Desc is mandatory"),StartDate:K().required("Start Date is mandatory").typeError("Start Date is mandatory"),EndDate:K().required("End Date is mandatory").min(Dt("StartDate"),"End date must be later than start date").typeError("End date must be later than start date").typeError("End Date is mandatory")}),g=()=>{l.value.ComponentTypeId=0,l.value.ComponentType="",l.value.ComponentTypeDescription="",l.value.IsActive=!0,F(""),w("")},y=(d=!1)=>{g(),p(),s.resetState(),h("handle-close",d)},S=d=>{l.value.ComponentTypeDescription=d},F=d=>{l.value.StartDate=d},w=d=>{l.value.EndDate=d},a=async()=>{p(),await _.validate(l.value,{abortEarly:!1}).catch(d=>{s.setErrors(d.errors)}),!v.value&&M("Are you sure you want to submit ?").then(async d=>{d.isConfirmed&&s.updateData(r.user.Name).then(()=>{s.isError||et("Form has been successfully submitted!","Ok").then(()=>{g(),p(),h("handle-close",!0)})})})},p=()=>{s.setErrors([])};return(d,D)=>{const E=U("el-button"),P=U("el-dialog"),T=J("loading");return O((b(),I(P,{modelValue:u.value,"onUpdate:modelValue":D[0]||(D[0]=A=>u.value=A),title:"Update Data",width:"40%",onClose:D[1]||(D[1]=A=>y())},{footer:m(()=>[c("span",oe,[o(E,{type:"primary",onClick:a,disabled:n(s).loading},{default:m(()=>[L("Submit")]),_:1},8,["disabled"]),o(E,{type:"secondary",onClick:y,disabled:n(s).loading},{default:m(()=>[L("Close")]),_:1},8,["disabled"])])]),default:m(()=>[o(ct,{name:"fade"},{default:m(()=>[v.value?(b(),I(ht,{key:0,errorMessages:f.value,onResetForm:p},null,8,["errorMessages"])):Q("",!0)]),_:1}),o(n(mt),{id:"kt_filter_form",class:"row g-9 my-4"},{default:m(()=>[o(G,{value:l.value.ComponentType,margin:!1,placeholder:"Add Component Type",label:"Component Type",name:"Component Type",disabled:!0},null,8,["value"]),o(G,{value:l.value.ComponentTypeDescription,margin:!1,placeholder:"Add Component Type Desc",label:"Component Type Desc",name:"ComponentTypeDescription",max:40,onHandleChange:S},null,8,["value"]),c("div",ee,[o(Y,{value:l.value.StartDate?l.value.StartDate.toString():"",placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:F},null,8,["value"])]),c("div",ae,[o(Y,{value:l.value.EndDate?l.value.EndDate.toString():"",placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:w},null,8,["value"])])]),_:1})]),_:1},8,["modelValue"])),[[T,n(s).loading]])}}}),st=at({id:"componentTypeBulk",state:()=>({statePagination:new j,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkInsert(t){const i={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const e=await B.post(`${Pt}?${new URLSearchParams(i).toString()}`,this.stateBulkData);this.stateError=e.data.result.isError?e.data.result.message:"",this.stateIsError=e.data.result.isError}catch(e){console.log(e)}this.stateLoading=!1},async upload({userAccount:t,excelFile:i}){const e={userAccount:t,ver:"v1"},h=`${kt}?${new URLSearchParams(e).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const s=await B.postImages(h,i);s.data.statusCode==200?s.data.result.isError?(this.stateIsError=!0,this.stateError=s.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=s.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=Rt.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=s.data.result.isError,this.stateError=s.data.result.message)}catch(s){console.log(s),this.stateIsError=!0,this.stateError=s.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort(Ot(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new j,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}}),ne={class:"icon"},re=V({__name:"GridBulk",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},setup(t){const i=t,e=st(),h=x(()=>(i.page-1)*10+1),s=r=>{const u={prop:r.prop,order:r.order};e.setSort(u)};return(r,u)=>{const l=U("inline-svg");return b(),I(n(dt),{data:i.listData,style:{width:"100%"},onSortChange:s,"empty-text":"No Data"},{default:m(()=>[o(n(C),{label:"No",width:"60",align:"center"},{default:m(f=>[c("span",null,N(h.value+f.$index),1)]),_:1}),o(n(C),{prop:"componentType",label:"Component Type",width:"170",sortable:""}),o(n(C),{prop:"componentTypeDescription",label:"Component Type Desc","min-width":"200",sortable:""}),o(n(C),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""}),o(n(C),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""}),o(n(C),{prop:"validationReason",label:"Remark","min-width":"300",sortable:""}),o(n(C),{prop:"isValid",label:"Status",width:"100",sortable:""},{default:m(f=>[c("div",ne,[o(l,{src:f.row.isValid?"/media/svg/tables/rows/valid-true.svg":"/media/svg/tables/rows/valid-false.svg"},null,8,["src"])])]),_:1})]),_:1},8,["data"])}}}),nt=t=>(Ut("data-v-8f2f6f20"),t=t(),xt(),t),ie=nt(()=>c("div",{class:"text-center"},null,-1)),le=nt(()=>c("div",{class:"mb-3"},[c("span",null,[L(" Download template "),c("a",{href:"documents/MasterData-ComponentType.xlsx",target:"_blank",id:"link-download"},"here"),L(" before uploading file ")])],-1)),de=nt(()=>c("div",{class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},[c("div",{class:"d-flex align-items-center position-relative my-0 mb-2"})],-1)),pe={class:"card"},ce={class:"card-body grid-padding"},me={class:"dialog-footer"},ue=V({__name:"UploadBulkDialog",props:{visibility:{required:!0,type:Boolean}},emits:["handle-close"],setup(t,{emit:i}){const e=t,h=i,s=tt(),r=st(),u=X(e,"visibility"),l=()=>{const a=Ht(r.validatedData,p=>{const d=p;return{componentTypeId:0,componentType:d.componentType,componentTypeDescription:d.componentTypeDescription,startDate:d.startDate,endDate:d.endDate,isActive:!0}});return Object.values(a)},f=()=>{const a=document.getElementById("link-download");a&&a.click()},v=()=>{r.validatedData.length>0?M("Cancel Upload Data?","Confirm").then(p=>{p.isConfirmed&&g()}):g()},_=async a=>{await r.upload({userAccount:s.user.Name,excelFile:a}),r.stateError&&q(r.error)},g=(a=!1)=>{r.resetState(),h("handle-close",a)},y=a=>{r.setIsUploadedState(a)},S=a=>{r.setPage(a)},F=()=>{if(r.validatedData.length<1){f();return}const a=["COMPONENT TYPE","COMPONENT TYPE DESC","START DATE","END DATE","REMARK","STATUS"],p=r.validatedData.map(d=>({componentType:d.componentType,componentTypeDescription:d.componentTypeDescription,startDate:d.startDate,endDate:d.endDate,remark:d.validationReason,status:d.isValid?"OK":"Error"}));St("ComponentType",a,p)},w=async()=>{if(r.displayData.length<1){q("There is no data to submit");return}if(r.isError){q("There is still invalid row(s)");return}M("Are you sure you want to submit ?").then(async a=>{if(a.isConfirmed){const p=l();if(r.setBulkData(p),await r.bulkInsert(s.user.Name),r.isError){q(r.stateError);return}et("Form has been successfully submitted!","Ok").then(()=>{g(!0)})}})};return(a,p)=>{const d=U("el-button"),D=U("el-dialog"),E=J("loading");return b(),I(D,{title:"Upload Bulk Data",modelValue:u.value,"onUpdate:modelValue":p[1]||(p[1]=P=>u.value=P),"before-close":v,width:"70%","custom-class":"upload-modal"},{footer:m(()=>[c("div",null,[c("span",me,[o(d,{type:"success",onClick:F},{default:m(()=>[L("Download")]),_:1}),o(d,{type:"primary",onClick:w},{default:m(()=>[L("Upload")]),_:1}),o(d,{type:"success",onClick:v},{default:m(()=>[L("Cancel")]),_:1})])])]),default:m(()=>[ie,le,O(o(Nt,{isSubmissionUploadSuccess:n(r).isUploaded,onHandleCloseUploadedFile:v,onHandleUpload:_,onHandleSetIsExcelFileUploaded:y},null,8,["isSubmissionUploadSuccess"]),[[E,n(r).uploadLoading]]),de,c("div",pe,[c("div",ce,[o(re,{"list-data":n(r).displayData,page:n(r).pagination.currentPage},null,8,["list-data","page"])])]),n(r).displayData.length>0?(b(),I(lt,{key:0,onRaisePageChange:p[0]||(p[0]=P=>S(P)),currentPage:n(r).pagination.currentPage,totalPage:n(r).pagination.totalPage,totalPageSize:n(r).pagination.totalPageSize,startPaginationIndex:n(r).pagination.startPaginationIndex,endPaginationIndex:n(r).pagination.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"])):Q("",!0)]),_:1},8,["modelValue"])}}}),De=qt(ue,[["__scopeId","data-v-8f2f6f20"]]),he={class:"row g-9 my-4"},ge={class:"w-100 fv-row fv-plugins-icon-container"},ye={class:"w-100 fv-row fv-plugins-icon-container"},fe={class:"w-100 fv-row fv-plugins-icon-container"},ve={class:"dialog-footer"},Se=V({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:i}){const e=ot(),h=t,s=i,r=X(h,"visibility"),u=x(()=>e.filterData),l=()=>{f(),e.resetFilter()},f=()=>{s("handle-close",!1)},v=a=>{e.setComponentType(a)},_=a=>{e.setStartDate(a)},g=a=>{e.setEndDate(a)},y=a=>{e.setComponentTypeTo(a)},S=a=>{e.setStartDateTo(a)},F=a=>{e.setEndDateTo(a)},w=()=>{const a=e.lastUsedFilterData.ComponentType!==e.filterData.ComponentType,p=e.lastUsedFilterData.StartDate!==e.filterData.StartDate,d=e.lastUsedFilterData.EndDate!==e.filterData.EndDate,D=e.lastUsedFilterData.ComponentTypeTo!==e.filterData.ComponentTypeTo,E=e.lastUsedFilterData.StartDateTo!==e.filterData.StartDateTo,P=e.lastUsedFilterData.EndDateTo!==e.filterData.EndDateTo;s("handle-close",a||p||d||D||E||P)};return(a,p)=>{const d=U("el-button"),D=U("el-dialog");return b(),I(D,{modelValue:r.value,"onUpdate:modelValue":p[0]||(p[0]=E=>r.value=E),title:"Filter",width:"60%",onClose:p[1]||(p[1]=E=>f())},{footer:m(()=>[c("span",ve,[o(d,{type:"secondary",onClick:l},{default:m(()=>[L("Reset")]),_:1}),o(d,{type:"primary",onClick:w},{default:m(()=>[L("Filter")]),_:1})])]),default:m(()=>[c("div",he,[c("div",ge,[o(zt,{"value-from":u.value.ComponentType,"value-to":u.value.ComponentTypeTo,label:"Component Type",name:"ComponentType",options:n(e).componentTypeOption,onHandleChangeFrom:v,onHandleChangeTo:y},null,8,["value-from","value-to","options"])]),c("div",ye,[o(it,{"value-from":u.value.StartDate?u.value.StartDate.toString():"","value-to":u.value.StartDateTo?u.value.StartDateTo.toString():"",placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChangeFrom:_,onHandleChangeTo:S},null,8,["value-from","value-to"])]),c("div",fe,[o(it,{"value-from":u.value.EndDate?u.value.EndDate.toString():"","value-to":u.value.EndDateTo?u.value.EndDateTo.toString():"",placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChangeFrom:g,onHandleChangeTo:F},null,8,["value-from","value-to"])])])]),_:1},8,["modelValue"])}}}),Te={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},_e=c("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),Ee={class:"d-flex justify-content-between align-items-center"},Ce={class:"card"},be={class:"card-body grid-padding"},we={class:"my-5"},Oa=V({__name:"Index",setup(t){const i=gt(),e=ot(),h=W(),s=st(),r=R(!1),u=R(!1),l=R(!1),f=R(!1),v=x(()=>e.displayData),_=x(()=>e.pagination),g=T=>{e.setPage(T)};At(async()=>{i[ft.ACTIVE_PAGE]("IronLake"),yt("Component Type",[{pageName:"Iron Lake",pageRoute:"ironlake"},{pageName:"Equipment",pageRoute:"componenttype"},{pageName:"Component Type",pageRoute:"componenttype"}]),e.setPage(1),await e.getLookup()}),$t(async()=>{e.resetState(),h.resetState(),s.resetState()});const y=async()=>{await e.setPage(1),await e.getLookup()},S=()=>{r.value=!0},F=async T=>{r.value=!1,T&&await y()},w=()=>{u.value=!0},a=async T=>{u.value=!1,T&&await y()},p=()=>{l.value=!0},d=async T=>{l.value=!1,T&&await y()},D=async()=>{const T=await e.export();Mt.saveAs(new Blob([T],{type:"application/octet-stream"}),"Component Type.xlsx")},E=()=>{f.value=!0},P=async T=>{f.value=!1,T&&await y()};return(T,A)=>(b(),z(Bt,null,[c("div",Te,[_e,c("div",Ee,[o(Tt,{onShowDialog:S}),o(vt,{onShowDialog:p}),o(Et,{onHandleDownload:D}),o(_t,{onShowDialog:E})])]),c("div",Ce,[c("div",be,[o(Xt,{"list-data":v.value,page:_.value.currentPage,onShowDialog:w},null,8,["list-data","page"])])]),c("div",we,[n(e).paginationLoading?Q("",!0):(b(),I(lt,{key:0,onRaisePageChange:A[0]||(A[0]=H=>g(H)),currentPage:_.value.currentPage,totalPage:_.value.totalPage,totalPageSize:_.value.totalPageSize,startPaginationIndex:_.value.startPaginationIndex,endPaginationIndex:_.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),o(te,{visibility:r.value,onHandleClose:F},null,8,["visibility"]),o(se,{visibility:u.value,onHandleClose:a},null,8,["visibility"]),o(Se,{visibility:l.value,onHandleClose:d},null,8,["visibility"]),o(De,{visibility:f.value,onHandleClose:P},null,8,["visibility"])],64))}});export{Oa as default};
