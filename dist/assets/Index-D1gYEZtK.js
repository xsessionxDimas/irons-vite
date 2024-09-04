import{u as vt}from"./vuex-BbOKrtVp.js";import{a as _t}from"./breadcrumb-BYmEOf4C.js";import{c as R,a as et,J as M,I as st,z as q,A as yt}from"./index-BuVmIl8K.js";import{P as dt}from"./Pagination-D-xfdYmn.js";import{F as Vt}from"./FilterIconButton-Bj0WTbms.js";import{h as bt,A as St,U as Ct}from"./excel-generator-DMHRo93s.js";import{D as Et}from"./DownloadIconButton-CIQp-YG7.js";import{_ as C,b as ut}from"./element-plus-BeWdvTRa.js";import{q as x,w as L,x as j,y as wt}from"./date-format-8-IvfSl3.js";import{P as G}from"./Pagination-BiobnanQ.js";import{C as ht,L as Ft,E as Pt,U as It,B as kt,a as Tt}from"./urls-DTUjp4BB.js";import{d as rt}from"./pinia-BjOS2_Ao.js";import{a as Ut}from"./mapOption-CeGMwmH0.js";import{a as Lt,d as xt}from"./table-sort-Bpdq_Uwn.js";import{k as H,c as I,r as N,u as i,y as O,p as E,aa as z,q as k,x as d,Y as Q,R as U,s,aB as u,C as B,a0 as W,B as T,A as Z,T as pt,bd as At,bb as $t,a7 as Bt,L as Rt,F as Ht}from"./@vue-BypzYtbH.js";import{a as Dt}from"./vee-validate-C_msoaAA.js";import{c as mt,a as K,b as J,d as gt}from"./yup-C6P98bvY.js";import"./property-expr-DEi1ZLzV.js";import{E as ft}from"./ErrorAlert-CMKGfwAi.js";import{_ as X}from"./TextInput.vue_vue_type_script_setup_true_lang-oAh_qqu1.js";import{_ as Y}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-CCwjwK39.js";import{e as Ot}from"./lodash-DrHMlsdo.js";import{_ as Nt}from"./FileDropZone.vue_vue_type_style_index_0_lang-C5PyimC7.js";import{m as qt}from"./map-anything-abi6NY2Z.js";import{_ as zt}from"./nw-img-vue-CR837WER.js";import{_ as Mt}from"./AutoComplete.vue_vue_type_style_index_0_lang-DrAAOf71.js";import{_ as lt}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-CJ7rJST9.js";import{F as jt}from"./file-saver-CwTBvle_.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./useMenuStore-CD5Gmvif.js";import"./PageEnum-DUtfSNQS.js";import"./xlsx-C4maHrMm.js";import"./moment-C5S46NFB.js";import"./nanoclone-BAWie4i9.js";import"./toposort-NSxIV7Fb.js";import"./vue3-dropzone-_NG5IwbJ.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";import"./attr-accept-DLIfoYC7.js";const at={characteristicValue:"",characteristicValueTo:"",startDate:"",startDateTo:"",endDate:"",endDateTo:"",ver:"v1",page:1,pageSize:10,order:""},it=rt({id:"characteristicValueList",state:()=>({stateFilterData:{...at},stateLastUsedFilterData:{...at},statePageName:"characteristicValue",stateDisplayData:[],statePagination:new G,stateLoading:!1,statePaginationLoading:!1,stateCharacteristicValueOption:[]}),getters:{pageName:t=>t.statePageName,pagination:t=>t.statePagination,displayData:t=>t.stateDisplayData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,paginationLoading:t=>t.statePaginationLoading,characteristicValueOption:t=>t.stateCharacteristicValueOption},actions:{async getData(t=!0){const n={characteristicValue:this.stateFilterData.characteristicValue,characteristicValueTo:this.stateFilterData.characteristicValueTo,startDate:this.stateFilterData.startDate?x(L(new Date(this.stateFilterData.startDate))):"",startDateTo:this.stateFilterData.startDateTo?x(L(new Date(this.stateFilterData.startDateTo))):"",endDate:this.stateFilterData.endDate?x(L(new Date(this.stateFilterData.endDate))):"",endDateTo:this.stateFilterData.endDateTo?x(L(new Date(this.stateFilterData.endDateTo))):"",page:this.stateFilterData.page.toString(),pageSize:this.stateFilterData.pageSize.toString(),order:this.stateFilterData.order,ver:this.stateFilterData.ver};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const a=await R.get(ht,"",new URLSearchParams(n).toString());this.stateDisplayData=a.data.result.content,this.setTotalPage(a.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(a){console.log(a)}this.stateLoading=!1},async getLookup(){const t={ver:this.stateFilterData.ver};try{const n=await R.get(Ft,"",new URLSearchParams(t).toString());this.stateCharacteristicValueOption=Ut(n.data.result.content,"characteristicValue","characteristicValueDescription")}catch(n){console.log(n)}},async export(){const t={ver:this.stateFilterData.ver,Gmt:new Date().toTimeString().slice(12,17)};try{return(await R.getBlob(Pt,"",new URLSearchParams(t).toString())).data}catch(n){console.log(n)}},setTotalPage(t){this.pagination.totalPage=t,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(t){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(t),this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:t,order:n}){if(!t&&!n)this.stateFilterData.order="";else{const a=n=="ascending"?"asc":"desc";this.stateFilterData.order=`${t}_${a}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1)},setCharacteristicValue(t){this.stateFilterData.characteristicValue=t},setCharacteristicValueTo(t){this.stateFilterData.characteristicValueTo=t},setStartDate(t){this.stateFilterData.startDate=t},setStartDateTo(t){this.stateFilterData.startDateTo=t},setEndDate(t){this.stateFilterData.endDate=t},setEndDateTo(t){this.stateFilterData.endDateTo=t},async resetFilter(){this.stateFilterData.characteristicValue="",this.stateFilterData.characteristicValueTo="",this.stateFilterData.startDate="",this.stateFilterData.startDateTo="",this.stateFilterData.endDate="",this.stateFilterData.endDateTo="";const t=this.stateLastUsedFilterData.characteristicValue!=="",n=this.stateLastUsedFilterData.characteristicValueTo!=="",a=this.stateLastUsedFilterData.startDate!=="",m=this.stateLastUsedFilterData.startDateTo!=="",r=this.stateLastUsedFilterData.endDate!=="",o=this.stateLastUsedFilterData.endDateTo!=="";(t||n||a||m||r||o)&&await this.getData()},resetState(){this.stateFilterData={...at},this.stateDisplayData=[],this.statePagination=new G,this.stateLoading=!1,this.statePaginationLoading=!1}}}),ct={characteristicValueId:0,characteristicValue:"",characteristicValueDescription:"",startDate:L(new Date),endDate:L(new Date("12/31/9999"))},tt=rt({id:"characteristicValueForm",state:()=>({stateFormData:{...ct},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1}),getters:{formData:t=>t.stateFormData,error:t=>t.stateError,errors:t=>t.stateErrors,isError:t=>t.stateIsError,loading:t=>t.stateLoading},actions:{async insertData(t){try{this.stateLoading=!0;const n={userAccount:t,ver:"v1"},a={characteristicValueId:this.stateFormData.characteristicValueId,characteristicValue:this.stateFormData.characteristicValue,characteristicValueDescription:this.stateFormData.characteristicValueDescription,startDate:x(L(new Date(this.stateFormData.startDate))),endDate:x(L(new Date(this.stateFormData.endDate)))},m=await R.post(`${ht}?${new URLSearchParams(n).toString()}`,a);m.data.title==="Error"?(this.stateErrors.push(m.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(n){this.stateError=n,this.stateErrors.push(n.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},async updateData(t){try{this.stateLoading=!0;const n={userAccount:t,ver:"v1"},a={characteristicValueId:this.stateFormData.characteristicValueId,characteristicValue:this.stateFormData.characteristicValue,characteristicValueDescription:this.stateFormData.characteristicValueDescription,startDate:x(L(new Date(this.stateFormData.startDate))),endDate:x(L(new Date(this.stateFormData.endDate)))},m=await R.post(`${It}?${new URLSearchParams(n).toString()}`,a);m.data.title==="Error"?(this.stateErrors.push(m.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(n){this.stateError=n,this.stateErrors.push(n.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},setErrors(t){this.stateErrors=t,this.stateIsError=this.stateErrors.length>0},setFormData(t){this.stateFormData.characteristicValueId=t.characteristicValueId||0,this.stateFormData.characteristicValue=t.characteristicValue||"",this.stateFormData.characteristicValueDescription=t.characteristicValueDescription||"",this.stateFormData.startDate=t.startDate||"",this.stateFormData.endDate=t.endDate||""},resetState(){this.stateFormData={...ct},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1}}}),Gt={key:0,style:{height:"100px"}},Kt={key:0,class:"row justify-content-center"},Jt={key:1,class:"row justify-content-center"},Xt={class:"row justify-content-center"},Yt=["onClick"],Qt=H({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(t,{emit:n}){const a=t,m=it(),r=tt(),o=n,D=I(()=>(a.page-1)*10+1),l=N(""),g=v=>{l.value=v.order;const f={prop:v.prop,order:v.order};m.setSort(f)},y=(v,f,V)=>Lt(v[V],f[V],l.value),S=v=>{r.setFormData(v),o("show-dialog",null)};return(v,f)=>{const V=U("inline-svg"),P=U("el-tooltip"),w=Q("loading");return i(m).loading?O((E(),z("div",Gt,null,512)),[[w,i(m).loading]]):O((E(),k(i(ut),{key:1,data:a.listData,style:{width:"100%"},onSortChange:g,"empty-text":"No Data"},{default:d(()=>[s(i(C),{label:"No",width:"90",align:"center"},{default:d(e=>[u("span",null,B(D.value+e.$index),1)]),_:1}),s(i(C),{prop:"characteristicValue",label:"Characteristic Value","min-width":"200",sortable:"","sort-method":(e,h)=>y(e,h,"characteristicValue")},null,8,["sort-method"]),s(i(C),{prop:"characteristicValueDescription",label:"Characteristic Value Description","min-width":"300",sortable:"","sort-method":(e,h)=>y(e,h,"characteristicValueDescription")},null,8,["sort-method"]),s(i(C),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""},{default:d(e=>[u("span",null,B(i(j)(e.row.startDate)),1)]),_:1}),s(i(C),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""},{default:d(e=>[u("span",null,B(i(j)(e.row.endDate)),1)]),_:1}),s(i(C),{prop:"isActive",label:"Is Active",width:"100",sortable:""},{default:d(e=>[e.row.isActive?(E(),z("div",Kt,[s(V,{src:"/media/svg/tables/rows/check.svg"})])):(E(),z("div",Jt,[s(V,{src:"/media/svg/tables/rows/minus.svg"})]))]),_:1}),s(i(C),{prop:"changedOn",label:"Changed on",align:"center",width:"170",sortable:""},{default:d(e=>[u("span",null,B(i(wt)(e.row.changedOn)),1)]),_:1}),s(i(C),{prop:"changedBy",label:"Changed by",sortable:"",width:"300","sort-method":(e,h)=>y(e,h,"changedBy")},null,8,["sort-method"]),s(i(C),{label:"",width:"80"},{default:d(e=>[u("div",Xt,[s(P,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:d(()=>[u("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:h=>S(e.row)},[s(V,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,Yt)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[w,i(m).loading]])}}}),Wt={class:"col-md-6 fv-row fv-plugins-icon-container"},Zt={class:"col-md-6 fv-row fv-plugins-icon-container"},ta={class:"dialog-footer"},aa=H({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:n}){const a=t,m=n,r=tt(),o=et(),D=W(a,"visibility"),l=I(()=>r.formData),g=I(()=>r.errors),y=I(()=>r.isError),S=mt().shape({characteristicValue:K().required("Characteristic Value is mandatory"),characteristicValueDescription:K().required("Characteristic Value Description is mandatory"),startDate:J().required("Start Date is mandatory").typeError("Start Date is mandatory"),endDate:J().required("End Date is mandatory").min(gt("startDate"),"End date must be later than start date").typeError("End Date is mandatory")}),v=()=>{V(""),P(""),w(""),e("")},f=(c=!1)=>{p(),v(),r.resetState(),m("handle-close",c)},V=c=>{l.value.characteristicValue=c},P=c=>{l.value.characteristicValueDescription=c},w=c=>{l.value.startDate=c},e=c=>{l.value.endDate=c},h=async()=>{p(),await S.validate(l.value,{abortEarly:!1}).catch(c=>{r.setErrors(c.errors)}),!y.value&&M("Are you sure you want to submit ?").then(async c=>{c.isConfirmed&&r.insertData(o.user.Name).then(()=>{r.isError||st("Form has been successfully submitted!","Ok").then(()=>{f(!0)})})})},p=()=>{r.setErrors([])};return(c,_)=>{const F=U("el-button"),b=U("el-dialog"),A=Q("loading");return O((E(),k(b,{modelValue:D.value,"onUpdate:modelValue":_[0]||(_[0]=$=>D.value=$),title:"New Data",width:"40%",onClose:_[1]||(_[1]=$=>f())},{footer:d(()=>[u("span",ta,[s(F,{type:"primary",onClick:h,disabled:i(r).loading},{default:d(()=>[T("Submit")]),_:1},8,["disabled"]),s(F,{type:"secondary",onClick:f,disabled:i(r).loading},{default:d(()=>[T("Close")]),_:1},8,["disabled"])])]),default:d(()=>[s(pt,{name:"fade"},{default:d(()=>[y.value?(E(),k(ft,{key:0,errorMessages:g.value,onResetForm:p},null,8,["errorMessages"])):Z("",!0)]),_:1}),O((E(),k(i(Dt),{id:"kt_filter_form",class:"row g-9 my-4"},{default:d(()=>[s(X,{value:l.value.characteristicValue,margin:!1,placeholder:"Add Characteristic Value",label:"Characteristic Value",name:"CharacteristicValue",max:40,onHandleChange:V},null,8,["value"]),s(X,{value:l.value.characteristicValueDescription,margin:!1,placeholder:"Add Characteristic Value Description",label:"Characteristic Value Description",name:"CharacteristicValueDescription",max:255,onHandleChange:P},null,8,["value"]),u("div",Wt,[s(Y,{value:l.value.startDate,placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:w},null,8,["value"])]),u("div",Zt,[s(Y,{value:l.value.endDate,placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:e},null,8,["value"])])]),_:1})),[[A,i(r).loading]])]),_:1},8,["modelValue"])),[[A,i(r).loading]])}}}),ea={class:"col-md-6 fv-row fv-plugins-icon-container"},sa={class:"col-md-6 fv-row fv-plugins-icon-container"},ra={class:"dialog-footer"},ia=H({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:n}){const a=t,m=n,r=tt(),o=et(),D=W(a,"visibility"),l=I(()=>r.formData),g=I(()=>r.errors),y=I(()=>r.isError),S=mt().shape({characteristicValue:K().required("Characteristic Value is mandatory"),characteristicValueDescription:K().required("Characteristic Value Description is mandatory"),startDate:J().required("Start Date is mandatory").typeError("Start Date is mandatory"),endDate:J().required("End Date is mandatory").min(gt("startDate"),"End date must be later than start date").typeError("End Date is mandatory")}),v=()=>{l.value.characteristicValueId=0,l.value.characteristicValue="",l.value.characteristicValueDescription="",l.value.startDate="",l.value.endDate=""},f=(c=!1)=>{v(),r.resetState(),p(),m("handle-close",c)},V=c=>{l.value.characteristicValue=c},P=c=>{l.value.characteristicValueDescription=c},w=c=>{l.value.startDate=c},e=c=>{l.value.endDate=c},h=async()=>{p(),await S.validate(l.value,{abortEarly:!1}).catch(c=>{r.setErrors(c.errors)}),!y.value&&M("Are you sure you want to submit ?").then(async c=>{c.isConfirmed&&r.updateData(o.user.Name).then(()=>{r.isError||st("Form has been successfully submitted!","Ok").then(()=>{f(!0)})})})},p=()=>{r.setErrors([])};return(c,_)=>{const F=U("el-button"),b=U("el-dialog"),A=Q("loading");return O((E(),k(b,{modelValue:D.value,"onUpdate:modelValue":_[0]||(_[0]=$=>D.value=$),title:"Update Data",width:"40%",onClose:_[1]||(_[1]=$=>f())},{footer:d(()=>[u("span",ra,[s(F,{type:"primary",onClick:h,disabled:i(r).loading},{default:d(()=>[T("Submit")]),_:1},8,["disabled"]),s(F,{type:"secondary",onClick:f,disabled:i(r).loading},{default:d(()=>[T("Close")]),_:1},8,["disabled"])])]),default:d(()=>[s(pt,{name:"fade"},{default:d(()=>[y.value?(E(),k(ft,{key:0,errorMessages:g.value,onResetForm:p},null,8,["errorMessages"])):Z("",!0)]),_:1}),s(i(Dt),{id:"kt_filter_form",class:"row g-9 my-4"},{default:d(()=>[s(X,{value:l.value.characteristicValue,margin:!1,placeholder:"Add Characteristic Value",label:"Characteristic Value",name:"CharacteristicValue",max:40,onHandleChange:V},null,8,["value"]),s(X,{value:l.value.characteristicValueDescription,margin:!1,placeholder:"Add Characteristic Value Description",label:"Characteristic Value Description",name:"CharacteristicValueDescription",max:255,onHandleChange:P},null,8,["value"]),u("div",ea,[s(Y,{value:l.value.startDate,placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:w},null,8,["value"])]),u("div",sa,[s(Y,{value:l.value.endDate,placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:e},null,8,["value"])])]),_:1})]),_:1},8,["modelValue"])),[[A,i(r).loading]])}}}),ot=rt({id:"characteristicValueBulk",state:()=>({statePagination:new G,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkInsert(t){const n={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const a=await R.post(`${kt}?${new URLSearchParams(n).toString()}`,this.stateBulkData);this.stateError=a.data.result.isError?a.data.result.message:"",this.stateIsError=a.data.result.isError}catch(a){console.log(a)}this.stateLoading=!1},async upload({userAccount:t,excelFile:n}){const a={userAccount:t,ver:"v1"},m=`${Tt}?${new URLSearchParams(a).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const r=await R.postImages(m,n);r.data.statusCode==200?r.data.result.isError?(this.stateIsError=!0,this.stateError=r.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=r.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=Ot.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=r.data.result.isError,this.stateError=r.data.result.message)}catch(r){console.log(r),this.stateIsError=!0,this.stateError=r.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort(xt(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new G,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}}),oa={class:"icon"},na=H({__name:"GridBulk",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},setup(t){const n=t,a=ot(),m=I(()=>(n.page-1)*10+1),r=o=>{const D={prop:o.prop,order:o.order};a.setSort(D)};return(o,D)=>{const l=U("inline-svg");return E(),k(i(ut),{data:n.listData,style:{width:"100%"},onSortChange:r,"empty-text":"No Data"},{default:d(()=>[s(i(C),{label:"No",width:"60",align:"center"},{default:d(g=>[u("span",null,B(m.value+g.$index),1)]),_:1}),s(i(C),{prop:"characteristicValue",label:"Characteristic Value",width:"300",sortable:""}),s(i(C),{prop:"characteristicValueDescription",label:"Characteristic Value Description",width:"300",sortable:""}),s(i(C),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""},{default:d(g=>[u("span",null,B(i(j)(g.row.startDate)),1)]),_:1}),s(i(C),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""},{default:d(g=>[u("span",null,B(i(j)(g.row.endDate)),1)]),_:1}),s(i(C),{prop:"validationReason",label:"Remark","min-width":"300",sortable:""}),s(i(C),{prop:"isValid",label:"Status",width:"100",sortable:""},{default:d(g=>[u("div",oa,[s(l,{src:g.row.isValid?"/media/svg/tables/rows/valid-true.svg":"/media/svg/tables/rows/valid-false.svg"},null,8,["src"])])]),_:1})]),_:1},8,["data"])}}}),nt=t=>(At("data-v-61e30685"),t=t(),$t(),t),la=nt(()=>u("div",{class:"text-center"},null,-1)),ca=nt(()=>u("div",{class:"mb-3"},[u("span",null,[T(" Download template "),u("a",{href:"documents/MasterDataCharacteristicValue.xlsx",target:"_blank",id:"link-download"},"here"),T(" before uploading file ")])],-1)),da=nt(()=>u("div",{class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},[u("div",{class:"d-flex align-items-center position-relative my-0 mb-2"})],-1)),ua={class:"card"},ha={class:"card-body grid-padding"},pa={class:"dialog-footer"},Da=H({__name:"UploadBulkDialog",props:{visibility:{required:!0,type:Boolean}},emits:["handle-close"],setup(t,{emit:n}){const a=t,m=n,r=et(),o=ot(),D=W(a,"visibility"),l=()=>{const e=qt(o.validatedData,h=>{const p=h;return{characteristicValue:p.characteristicValue,characteristicValueDescription:p.characteristicValueDescription,startDate:p.startDate,endDate:p.endDate}});return Object.values(e)},g=()=>{const e=document.getElementById("link-download");e&&e.click()},y=()=>{o.validatedData.length>0?M("Cancel Upload Data?","Confirm").then(h=>{h.isConfirmed&&v()}):v()},S=async e=>{await o.upload({userAccount:r.user.Name,excelFile:e}),o.stateError&&q(o.error)},v=(e=!1)=>{o.resetState(),m("handle-close",e)},f=e=>{o.setIsUploadedState(e)},V=e=>{o.setPage(e)},P=()=>{if(o.validatedData.length<1){g();return}const e=["CHARACTERISTIC VALUE","CHARACTERISTIC VALUE DESCRIPTION","START DATE","END DATE","REMARK","STATUS"],h=o.validatedData.map(p=>({characteristicValue:p.characteristicValue,characteristicValueDescription:p.characteristicValueDescription,startDate:p.startDate,endDate:p.endDate,remark:p.validationReason,status:p.isValid?"OK":"Error"}));bt("Characteristic Value",e,h)},w=async()=>{if(o.displayData.length<1){q("There is no data to submit");return}if(o.isError){q("There is still invalid row(s)");return}M("Are you sure you want to submit ?").then(async e=>{if(e.isConfirmed){const h=l();if(o.setBulkData(h),await o.bulkInsert(r.user.Name),o.isError){q(o.stateError);return}st("Form has been successfully submitted!","Ok").then(()=>{v(!0)})}})};return(e,h)=>{const p=U("el-button"),c=U("el-dialog"),_=Q("loading");return E(),k(c,{title:"Upload Bulk Data",modelValue:D.value,"onUpdate:modelValue":h[1]||(h[1]=F=>D.value=F),"before-close":y,width:"70%","custom-class":"upload-modal"},{footer:d(()=>[u("div",null,[u("span",pa,[s(p,{type:"success",onClick:P},{default:d(()=>[T("Download")]),_:1}),s(p,{type:"primary",onClick:w},{default:d(()=>[T("Upload")]),_:1}),s(p,{type:"success",onClick:y},{default:d(()=>[T("Cancel")]),_:1})])])]),default:d(()=>[la,ca,O(s(Nt,{isSubmissionUploadSuccess:i(o).isUploaded,onHandleCloseUploadedFile:y,onHandleUpload:S,onHandleSetIsExcelFileUploaded:f},null,8,["isSubmissionUploadSuccess"]),[[_,i(o).uploadLoading]]),da,u("div",ua,[u("div",ha,[s(na,{"list-data":i(o).displayData,page:i(o).pagination.currentPage},null,8,["list-data","page"])])]),i(o).displayData.length>0?(E(),k(dt,{key:0,onRaisePageChange:h[0]||(h[0]=F=>V(F)),currentPage:i(o).pagination.currentPage,totalPage:i(o).pagination.totalPage,totalPageSize:i(o).pagination.totalPageSize,startPaginationIndex:i(o).pagination.startPaginationIndex,endPaginationIndex:i(o).pagination.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"])):Z("",!0)]),_:1},8,["modelValue"])}}}),ma=zt(Da,[["__scopeId","data-v-61e30685"]]),ga={class:"row g-9 my-4"},fa={class:"dialog-footer"},va=H({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:n}){const a=it(),m=t,r=n,o=W(m,"visibility"),D=I(()=>a.filterData),l=()=>{g(),a.resetFilter()},g=()=>{r("handle-close",!1)},y=e=>{a.setCharacteristicValue(e)},S=e=>{a.setCharacteristicValueTo(e)},v=e=>{a.setStartDate(e)},f=e=>{a.setStartDateTo(e)},V=e=>{a.setEndDate(e)},P=e=>{a.setEndDateTo(e)},w=()=>{const e=a.lastUsedFilterData.characteristicValue!==a.filterData.characteristicValue,h=a.lastUsedFilterData.characteristicValueTo!==a.filterData.characteristicValueTo,p=a.lastUsedFilterData.startDate!==a.filterData.startDate,c=a.lastUsedFilterData.startDateTo!==a.filterData.startDateTo,_=a.lastUsedFilterData.endDate!==a.filterData.endDate,F=a.lastUsedFilterData.endDateTo!==a.filterData.endDateTo;r("handle-close",e||h||p||c||_||F)};return(e,h)=>{const p=U("el-button"),c=U("el-dialog");return E(),k(c,{modelValue:o.value,"onUpdate:modelValue":h[0]||(h[0]=_=>o.value=_),title:"Filter",width:"60%",onClose:h[1]||(h[1]=_=>g())},{footer:d(()=>[u("span",fa,[s(p,{type:"secondary",onClick:l},{default:d(()=>[T("Reset")]),_:1}),s(p,{type:"primary",onClick:w},{default:d(()=>[T("Filter")]),_:1})])]),default:d(()=>[u("div",ga,[s(Mt,{"value-from":D.value.characteristicValue,"value-to":D.value.characteristicValueTo,label:"Characteristic Value",name:"CharacteristicValue",options:i(a).characteristicValueOption,onHandleChangeFrom:y,onHandleChangeTo:S},null,8,["value-from","value-to","options"]),s(lt,{"value-from":D.value.startDate?D.value.startDate.toString():"","value-to":D.value.startDateTo?D.value.startDateTo.toString():"",label:"Start Date",name:"StartDate",placeholder:"Pick a date",onHandleChangeFrom:v,onHandleChangeTo:f},null,8,["value-from","value-to"]),s(lt,{"value-from":D.value.endDate?D.value.endDate.toString():"","value-to":D.value.endDateTo?D.value.endDateTo.toString():"",label:"End Date",name:"EndDate",placeholder:"Pick a date",onHandleChangeFrom:V,onHandleChangeTo:P},null,8,["value-from","value-to"])])]),_:1},8,["modelValue"])}}}),_a={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},ya=u("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),Va={class:"d-flex justify-content-between align-items-center"},ba={class:"card"},Sa={class:"card-body grid-padding"},Ca={class:"my-5"},$e=H({__name:"Index",setup(t){const n=vt(),a=it(),m=tt(),r=ot(),o=N(!1),D=N(!1),l=N(!1),g=N(!1),y=I(()=>a.displayData),S=I(()=>a.pagination),v=b=>{a.setPage(b)};Bt(async()=>{n[yt.ACTIVE_PAGE]("IronLake"),_t("Characteristic Value",[{pageName:"Iron Lake",pageRoute:"ironlake"},{pageName:"Equipment",pageRoute:"characteristicvalue"},{pageName:"Characteristic Value",pageRoute:"characteristicvalue"}]),a.setPage(1),await a.getLookup()}),Rt(async()=>{a.resetState(),m.resetState(),r.resetState()});const f=async()=>{await a.setPage(1),await a.getLookup()},V=()=>{o.value=!0},P=async b=>{o.value=!1,b&&await f()},w=()=>{D.value=!0},e=async b=>{D.value=!1,b&&await f()},h=()=>{l.value=!0},p=async b=>{l.value=!1,b&&await f()},c=async()=>{const b=await a.export();jt.saveAs(new Blob([b],{type:"application/octet-stream"}),"CharacteristicValue.xlsx")},_=()=>{g.value=!0},F=async b=>{g.value=!1,b&&await f()};return(b,A)=>(E(),z(Ht,null,[u("div",_a,[ya,u("div",Va,[s(St,{onShowDialog:V}),s(Vt,{onShowDialog:h}),s(Et,{onHandleDownload:c}),s(Ct,{onShowDialog:_})])]),u("div",ba,[u("div",Sa,[s(Qt,{"list-data":y.value,page:S.value.currentPage,onShowDialog:w},null,8,["list-data","page"])])]),u("div",Ca,[i(a).paginationLoading?Z("",!0):(E(),k(dt,{key:0,onRaisePageChange:A[0]||(A[0]=$=>v($)),currentPage:S.value.currentPage,totalPage:S.value.totalPage,totalPageSize:S.value.totalPageSize,startPaginationIndex:S.value.startPaginationIndex,endPaginationIndex:S.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),s(aa,{visibility:o.value,onHandleClose:P},null,8,["visibility"]),s(ia,{visibility:D.value,onHandleClose:e},null,8,["visibility"]),s(va,{visibility:l.value,onHandleClose:p},null,8,["visibility"]),s(ma,{visibility:g.value,onHandleClose:F},null,8,["visibility"])],64))}});export{$e as default};
