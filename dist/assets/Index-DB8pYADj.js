import{u as vt}from"./vuex-BbOKrtVp.js";import{a as _t}from"./breadcrumb-D-Q4Tk9w.js";import{b as $,u as at,i as z,h as et,j as N,A as St}from"./index-BCnwA6yE.js";import{P as dt}from"./Pagination-CVDIvnOM.js";import{F as yt}from"./FilterIconButton-Bj0WTbms.js";import{h as bt,A as Et,U as It}from"./excel-generator-CRLIz6fw.js";import{D as Lt}from"./DownloadIconButton-CIQp-YG7.js";import{_ as b,b as ct}from"./element-plus-C5R56mia.js";import{f as x,n as V,a as M,b as wt}from"./date-format-BASVuupi.js";import{P as j,d as Pt,a as Ft}from"./table-sort-VnBD5Hfa.js";import{C as ut,L as kt,E as Ct,U as Tt,B as Ut,a as xt}from"./urls-BdLRR7uc.js";import{d as ot}from"./pinia-BjOS2_Ao.js";import{m as At}from"./mapOption-sP4IrA4W.js";import{k as B,bL as $t,r as H,u as i,y as O,p as I,aa as q,q as k,x as c,Y,R as T,s as o,aB as u,C as A,a0 as J,c as U,B as C,A as Q,T as pt,bd as Bt,bb as Vt,a7 as Ot,L as Rt,F as Ht}from"./@vue-BypzYtbH.js";import{_ as G}from"./TextInput.vue_vue_type_script_setup_true_lang-oAh_qqu1.js";import{_ as K}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-DQfguttb.js";import{a as Dt}from"./vee-validate-C_msoaAA.js";import{c as mt,a as tt,b as X,d as ht}from"./yup-BRaPd8dh.js";import"./property-expr-DEi1ZLzV.js";import{E as gt}from"./ErrorAlert-CMKGfwAi.js";import{e as Nt}from"./lodash-Cr9vlq0V.js";import{_ as qt}from"./FileDropZone.vue_vue_type_style_index_0_lang-Ct77XTnP.js";import{m as zt}from"./map-anything-abi6NY2Z.js";import{_ as Mt}from"./nw-img-vue-CR837WER.js";import{_ as jt}from"./AutoComplete.vue_vue_type_style_index_0_lang-CRR6Z--K.js";import{_ as rt}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-DO0pIl2P.js";import{F as Gt}from"./file-saver-DhbZvGod.js";import"./vue-router-iNp9kJ0K.js";import"./object-path-BACu75q6.js";import"./attr-accept-BWI1aNlo.js";import"./crypto-js-BZehCumu.js";import"./cron-Ci8nYs3o.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-N3crNZ6y.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-DK0FVkv3.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./dayjs-C7SXsQPH.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-xcxZ5rdH.js";import"./mitt-C1xD_ZTF.js";import"./@popperjs-WhmJkuoZ.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./vue-i18n-CE6bnohq.js";import"./@intlify-CjZh8qSI.js";import"./PageEnum-BoOqFyRq.js";import"./xlsx-CpbwoZfi.js";import"./moment-C5S46NFB.js";import"./nanoclone-BAWie4i9.js";import"./toposort-CalJriC0.js";import"./vue3-dropzone-DPWU9yJt.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";const Z={LocationId:"",LocationIdTo:"",StartDate:"",StartDateTo:"",EndDate:"",EndDateTo:"",ver:"v1",Page:1,PageSize:10,Order:""},st=ot({id:"locationCrack",state:()=>({stateFilterData:{...Z},stateLastUsedFilterData:{...Z},statePageName:"locationCrack",stateDisplayData:[],statePagination:new j,stateLoading:!1,statePaginationLoading:!1,stateLocationOption:[]}),getters:{pageName:t=>t.statePageName,pagination:t=>t.statePagination,displayData:t=>t.stateDisplayData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,paginationLoading:t=>t.statePaginationLoading,locationOption:t=>t.stateLocationOption},actions:{async getData(t=!0){const l={LocationId:this.stateFilterData.LocationId,LocationIdTo:this.stateFilterData.LocationIdTo,StartDate:this.stateFilterData.StartDate?x(this.stateFilterData.StartDate):"",StartDateTo:this.stateFilterData.StartDateTo?x(this.stateFilterData.StartDateTo):"",EndDate:this.stateFilterData.EndDate?x(this.stateFilterData.EndDate):"",EndDateTo:this.stateFilterData.EndDateTo?x(this.stateFilterData.EndDateTo):"",Page:this.stateFilterData.Page.toString(),PageSize:this.stateFilterData.PageSize.toString(),Order:this.stateFilterData.Order,ver:this.stateFilterData.ver};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const a=await $.get(ut,"",new URLSearchParams(l).toString());this.stateDisplayData=a.data.result.content,this.setTotalPage(a.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(a){console.log(a)}this.stateLoading=!1},async getLookup(){const t={ver:this.stateFilterData.ver};try{const l=await $.get(kt,"",new URLSearchParams(t).toString());this.stateLocationOption=At(l.data.result.content,"locationId","locationDescription")}catch(l){console.log(l)}},async export(){const t={ver:this.stateFilterData.ver,Gmt:new Date().toTimeString().slice(12,17)};try{return(await $.getBlob(Ct,"",new URLSearchParams(t).toString())).data}catch(l){console.log(l)}},setTotalPage(t){this.pagination.totalPage=t,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(t){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(t),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:t,order:l}){if(!t&&!l)this.stateFilterData.Order="";else{const a=l=="ascending"?"asc":"desc";this.stateFilterData.Order=`${t}_${a}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1)},setLocationId(t){this.stateFilterData.LocationId=t},setLocationIdTo(t){this.stateFilterData.LocationIdTo=t},setStartDate(t){this.stateFilterData.StartDate=t},setStartDateTo(t){this.stateFilterData.StartDateTo=t},setEndDate(t){this.stateFilterData.EndDate=t},setEndDateTo(t){this.stateFilterData.EndDateTo=t},async resetFilter(){this.stateFilterData.LocationId="",this.stateFilterData.LocationIdTo="",this.stateFilterData.StartDate="",this.stateFilterData.StartDateTo="",this.stateFilterData.EndDate="",this.stateFilterData.EndDateTo="";const t=this.stateLastUsedFilterData.LocationId!=="",l=this.stateLastUsedFilterData.LocationIdTo!=="",a=this.stateLastUsedFilterData.StartDate!=="",m=this.stateLastUsedFilterData.StartDateTo!=="",s=this.stateLastUsedFilterData.EndDate!=="",r=this.stateLastUsedFilterData.EndDateTo!=="";(t||l||a||m||s||r)&&await this.getData()},resetState(){this.stateFilterData={...Z},this.stateDisplayData=[],this.statePagination=new j,this.stateLoading=!1,this.statePaginationLoading=!1}}}),lt={LocationCrackId:0,locationId:"",locationDescription:"",startDate:V(new Date),endDate:V(new Date("12/31/9999"))},W=ot({id:"locationCrackForm",state:()=>({stateFormData:{...lt},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1}),getters:{formData:t=>t.stateFormData,error:t=>t.stateError,errors:t=>t.stateErrors,isError:t=>t.stateIsError,loading:t=>t.stateLoading},actions:{async insertData(t){try{this.stateLoading=!0;const l={userAccount:t,ver:"v1"},a={LocationCrackId:this.stateFormData.LocationCrackId,locationId:this.stateFormData.locationId,locationDescription:this.stateFormData.locationDescription,startDate:x(V(new Date(this.stateFormData.startDate))),endDate:x(V(new Date(this.stateFormData.endDate)))},m=await $.post(`${ut}?${new URLSearchParams(l).toString()}`,a);m.data.title==="Error"?(this.stateErrors.push(m.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(l){this.stateError=l,this.stateErrors.push(l.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},async updateData(t){try{this.stateLoading=!0;const l={userAccount:t,ver:"v1"},a={LocationCrackId:this.stateFormData.LocationCrackId,locationId:this.stateFormData.locationId,locationDescription:this.stateFormData.locationDescription,startDate:x(V(new Date(this.stateFormData.startDate))),endDate:x(V(new Date(this.stateFormData.endDate)))},m=await $.post(`${Tt}?${new URLSearchParams(l).toString()}`,a);m.data.title==="Error"?(this.stateErrors.push(m.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(l){this.stateError=l,this.stateErrors.push(l.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},setErrors(t){this.stateErrors=t,this.stateIsError=this.stateErrors.length>0},setFormData(t){this.stateFormData.LocationCrackId=t.locationCrackId||0,this.stateFormData.locationId=t.locationId||"",this.stateFormData.locationDescription=t.locationDescription||"",this.stateFormData.startDate=t.startDate||"",this.stateFormData.endDate=t.endDate||""},resetState(){this.stateFormData={...lt},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1}}}),Kt={key:0,style:{height:"100px"}},Xt={key:0,class:"row justify-content-center"},Yt={key:1,class:"row justify-content-center"},Jt={class:"row justify-content-center"},Qt=["onClick"],Wt=B({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(t,{emit:l}){const a=t,m=st(),s=W(),r=l,D=$t(()=>(a.page-1)*10+1),p=H(""),g=h=>{p.value=h.order;const _={prop:h.prop,order:h.order};m.setSort(_)},v=(h,_,y)=>Pt(h[y],_[y],p.value),S=h=>{s.setFormData(h),r("show-dialog",null)};return(h,_)=>{const y=T("inline-svg"),P=T("el-tooltip"),w=Y("loading");return i(m).loading?O((I(),q("div",Kt,null,512)),[[w,i(m).loading]]):O((I(),k(i(ct),{key:1,data:a.listData,style:{width:"100%"},onSortChange:g,"empty-text":"No Data"},{default:c(()=>[o(i(b),{label:"No",width:"90",align:"center"},{default:c(e=>[u("span",null,A(i(D)+e.$index),1)]),_:1}),o(i(b),{prop:"locationId",label:"Location ID",width:"200",sortable:"","sort-method":(e,n)=>v(e,n,"locationId")},null,8,["sort-method"]),o(i(b),{prop:"locationDescription",label:"Location Description","min-width":"200",sortable:"","sort-method":(e,n)=>v(e,n,"locationDescription")},null,8,["sort-method"]),o(i(b),{prop:"startDate",label:"Start Date",align:"center",width:"170",sortable:""},{default:c(e=>[u("span",null,A(i(M)(e.row.startDate)),1)]),_:1}),o(i(b),{prop:"endDate",label:"End Date",align:"center",width:"170",sortable:""},{default:c(e=>[u("span",null,A(i(M)(e.row.endDate)),1)]),_:1}),o(i(b),{prop:"isActive",label:"Is Active",width:"100",sortable:""},{default:c(e=>[e.row.isActive?(I(),q("div",Xt,[o(y,{src:"/media/svg/tables/rows/check.svg"})])):(I(),q("div",Yt,[o(y,{src:"/media/svg/tables/rows/minus.svg"})]))]),_:1}),o(i(b),{prop:"changedOn",label:"Changed on",align:"center",width:"150",sortable:""},{default:c(e=>[u("span",null,A(i(wt)(e.row.changedOn)),1)]),_:1}),o(i(b),{prop:"changedBy",label:"Changed by",sortable:"",width:"300","sort-method":(e,n)=>v(e,n,"changedBy")},null,8,["sort-method"]),o(i(b),{label:"",width:"80"},{default:c(e=>[u("div",Jt,[o(P,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:c(()=>[u("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:n=>S(e.row)},[o(y,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,Qt)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[w,i(m).loading]])}}}),Zt={class:"col-md-6 fv-row fv-plugins-icon-container"},ta={class:"col-md-6 fv-row fv-plugins-icon-container"},aa={class:"dialog-footer"},ea=B({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:l}){const a=t,m=l,s=W(),r=at(),D=J(a,"visibility"),p=U(()=>s.formData),g=U(()=>s.errors),v=U(()=>s.isError),S=mt().shape({locationId:tt().required("Location Id is mandatory"),locationDescription:tt().required("Location Description is mandatory"),startDate:X().required("Start Date is mandatory").typeError("Start Date is mandatory"),endDate:X().required("End Date is mandatory").min(ht("startDate"),"End date must be later than start date").typeError("End Date is mandatory")}),h=(d=!1)=>{n(),s.resetState(),m("handle-close",d)},_=d=>{p.value.locationId=d},y=d=>{p.value.locationDescription=d},P=d=>{p.value.startDate=d},w=d=>{p.value.endDate=d},e=async()=>{n(),await S.validate(p.value,{abortEarly:!1}).catch(d=>{s.setErrors(d.errors)}),!v.value&&z("Are you sure you want to submit ?").then(async d=>{d.isConfirmed&&s.insertData(r.user.Name).then(()=>{s.isError||et("Form has been successfully submitted!","Ok").then(()=>{h(!0)})})})},n=()=>{s.setErrors([])};return(d,E)=>{const L=T("el-button"),F=T("el-dialog"),f=Y("loading");return O((I(),k(F,{modelValue:D.value,"onUpdate:modelValue":E[0]||(E[0]=R=>D.value=R),title:"New Data",width:"40%",onClose:E[1]||(E[1]=R=>h())},{footer:c(()=>[u("span",aa,[o(L,{type:"primary",onClick:e,disabled:i(s).loading},{default:c(()=>[C("Submit")]),_:1},8,["disabled"]),o(L,{type:"secondary",onClick:h,disabled:i(s).loading},{default:c(()=>[C("Close")]),_:1},8,["disabled"])])]),default:c(()=>[o(pt,{name:"fade"},{default:c(()=>[v.value?(I(),k(gt,{key:0,errorMessages:g.value,onResetForm:n},null,8,["errorMessages"])):Q("",!0)]),_:1}),O((I(),k(i(Dt),{id:"kt_filter_form",class:"row g-9 my-4"},{default:c(()=>[o(G,{value:p.value.locationId,margin:!1,placeholder:"Add Location Id",label:"LocationId",name:"LocationId",max:10,onHandleChange:_},null,8,["value"]),o(G,{value:p.value.locationDescription,margin:!1,placeholder:"Add Location Description",label:"Location Description",name:"LocationDescription",max:250,onHandleChange:y},null,8,["value"]),u("div",Zt,[o(K,{value:p.value.startDate,placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:P},null,8,["value"])]),u("div",ta,[o(K,{value:p.value.endDate,placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:w},null,8,["value"])])]),_:1})),[[f,i(s).loading]])]),_:1},8,["modelValue"])),[[f,i(s).loading]])}}}),oa={class:"col-md-6 fv-row fv-plugins-icon-container"},sa={class:"col-md-6 fv-row fv-plugins-icon-container"},ia={class:"dialog-footer"},na=B({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:l}){const a=t,m=l,s=W(),r=at(),D=J(a,"visibility"),p=U(()=>s.formData),g=U(()=>s.errors),v=U(()=>s.isError),S=mt().shape({locationDescription:tt().required("Location Description is mandatory"),startDate:X().required("Start Date is mandatory").typeError("Start Date is mandatory"),endDate:X().required("End Date is mandatory").min(ht("startDate"),"End date must be later than start date").typeError("End Date is mandatory")}),h=(n=!1)=>{s.resetState(),e(),m("handle-close",n)},_=n=>{p.value.locationDescription=n},y=n=>{p.value.startDate=n},P=n=>{p.value.endDate=n},w=async()=>{e(),await S.validate(p.value,{abortEarly:!1}).catch(n=>{s.setErrors(n.errors)}),!v.value&&z("Are you sure you want to submit ?").then(async n=>{n.isConfirmed&&s.updateData(r.user.Name).then(()=>{s.isError||et("Form has been successfully submitted!","Ok").then(()=>{h(!0)})})})},e=()=>{s.setErrors([])};return(n,d)=>{const E=T("el-button"),L=T("el-dialog"),F=Y("loading");return O((I(),k(L,{modelValue:D.value,"onUpdate:modelValue":d[0]||(d[0]=f=>D.value=f),title:"Update Data",width:"40%",onClose:d[1]||(d[1]=f=>h())},{footer:c(()=>[u("span",ia,[o(E,{type:"primary",onClick:w,disabled:i(s).loading},{default:c(()=>[C("Submit")]),_:1},8,["disabled"]),o(E,{type:"secondary",onClick:h,disabled:i(s).loading},{default:c(()=>[C("Close")]),_:1},8,["disabled"])])]),default:c(()=>[o(pt,{name:"fade"},{default:c(()=>[v.value?(I(),k(gt,{key:0,errorMessages:g.value,onResetForm:e},null,8,["errorMessages"])):Q("",!0)]),_:1}),o(i(Dt),{id:"kt_filter_form",class:"row g-9 my-4"},{default:c(()=>[o(G,{value:p.value.locationId,margin:!1,placeholder:"Add Location Id",label:"Location Id",name:"LocationId",max:10,disabled:!0},null,8,["value"]),o(G,{value:p.value.locationDescription,margin:!1,placeholder:"Add Location Description",label:"Location Description",name:"LocationDescription",max:250,onHandleChange:_},null,8,["value"]),u("div",oa,[o(K,{value:p.value.startDate,placeholder:"Add Start Date",label:"Start Date",name:"StartDate",onHandleChange:y},null,8,["value"])]),u("div",sa,[o(K,{value:p.value.endDate,placeholder:"Add End Date",label:"End Date",name:"EndDate",onHandleChange:P},null,8,["value"])])]),_:1})]),_:1},8,["modelValue"])),[[F,i(s).loading]])}}}),it=ot({id:"LocationCrackBulk",state:()=>({statePagination:new j,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkInsert(t){const l={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const a=await $.post(`${Ut}?${new URLSearchParams(l).toString()}`,this.stateBulkData);this.stateError=a.data.result.isError?a.data.result.message:"",this.stateIsError=a.data.result.isError}catch(a){console.log(a)}this.stateLoading=!1},async upload({userAccount:t,excelFile:l}){const a={userAccount:t,ver:"v1"},m=`${xt}?${new URLSearchParams(a).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const s=await $.postImages(m,l);s.data.statusCode==200?s.data.result.isError?(this.stateIsError=!0,this.stateError=s.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=s.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=Nt.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=s.data.result.isError,this.stateError=s.data.result.message)}catch(s){console.log(s),this.stateIsError=!0,this.stateError=s.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort(Ft(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new j,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}}),ra={class:"icon"},la=B({__name:"GridBulk",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},setup(t){const l=t,a=it(),m=U(()=>(l.page-1)*10+1),s=r=>{const D={prop:r.prop,order:r.order};a.setSort(D)};return(r,D)=>{const p=T("inline-svg");return I(),k(i(ct),{data:l.listData,style:{width:"100%"},onSortChange:s,"empty-text":"No Data"},{default:c(()=>[o(i(b),{label:"No",width:"60",align:"center"},{default:c(g=>[u("span",null,A(m.value+g.$index),1)]),_:1}),o(i(b),{prop:"locationId",label:"locationId",width:"200",sortable:""}),o(i(b),{prop:"locationDescription",label:"locationDescription",width:"200",sortable:""}),o(i(b),{prop:"startDate",label:"Start Date",width:"120",sortable:""},{default:c(g=>[u("span",null,A(i(M)(g.row.startDate)),1)]),_:1}),o(i(b),{prop:"endDate",label:"End Date",width:"100",sortable:""},{default:c(g=>[u("span",null,A(i(M)(g.row.startDate)),1)]),_:1}),o(i(b),{prop:"validationReason",label:"Remark",width:"200",sortable:""}),o(i(b),{prop:"isValid",label:"Status","min-width":"100",align:"center",sortable:""},{default:c(g=>[u("div",ra,[o(p,{src:g.row.isValid?"/media/svg/tables/rows/valid-true.svg":"/media/svg/tables/rows/valid-false.svg"},null,8,["src"])])]),_:1})]),_:1},8,["data"])}}}),nt=t=>(Bt("data-v-046a7db4"),t=t(),Vt(),t),da=nt(()=>u("div",{class:"text-center"},null,-1)),ca=nt(()=>u("div",{class:"mb-3"},[u("span",null,[C(" Download template "),u("a",{href:"documents/MasterDataLocationCrack.xlsx",target:"_blank",id:"link-download"},"here"),C(" before uploading file ")])],-1)),ua=nt(()=>u("div",{class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},[u("div",{class:"d-flex align-items-center position-relative my-0 mb-2"})],-1)),pa={class:"card"},Da={class:"card-body grid-padding"},ma={class:"dialog-footer"},ha=B({__name:"UploadBulkDialog",props:{visibility:{required:!0,type:Boolean}},emits:["handle-close"],setup(t,{emit:l}){const a=t,m=l,s=at(),r=it(),D=J(a,"visibility"),p=()=>{const e=zt(r.validatedData,n=>{console.log(n);const d=n;return{LocationCrackId:0,locationId:d.locationId,locationDescription:d.locationDescription,startDate:d.startDate,endDate:d.endDate}});return Object.values(e)},g=()=>{const e=document.getElementById("link-download");e&&e.click()},v=()=>{r.validatedData.length>0?z("Cancel Upload Data?","Confirm").then(n=>{n.isConfirmed&&h()}):h()},S=async e=>{await r.upload({userAccount:s.user.Name,excelFile:e}),r.stateError&&N(r.error)},h=(e=!1)=>{r.resetState(),m("handle-close",e)},_=e=>{r.setIsUploadedState(e)},y=e=>{r.setPage(e)},P=()=>{if(r.validatedData.length<1){g();return}const e=["LOCATION ID","LOCATION DESCRIPTION","START DATE","END DATE","REMARK","STATUS"],n=r.validatedData.map(d=>({locationId:d.locationId,locationDescription:d.locationDescription,startDate:d.startDate,endDate:d.endDate,remark:d.validationReason,status:d.isValid?"OK":"Error"}));bt("LocationCrack",e,n)},w=async()=>{if(r.displayData.length<1){N("There is no data to submit");return}if(r.isError){N("There is still invalid row(s)");return}z("Are you sure you want to submit ?").then(async e=>{if(e.isConfirmed){const n=p();if(r.setBulkData(n),await r.bulkInsert(s.user.Name),r.isError){N(r.stateError);return}et("Form has been successfully submitted!","Ok").then(()=>{h(!0)})}})};return(e,n)=>{const d=T("el-button"),E=T("el-dialog"),L=Y("loading");return I(),k(E,{title:"Upload Bulk Data",modelValue:D.value,"onUpdate:modelValue":n[1]||(n[1]=F=>D.value=F),"before-close":v,width:"70%","custom-class":"upload-modal"},{footer:c(()=>[u("div",null,[u("span",ma,[o(d,{type:"success",onClick:P},{default:c(()=>[C("Download")]),_:1}),o(d,{type:"primary",onClick:w},{default:c(()=>[C("Upload")]),_:1}),o(d,{type:"success",onClick:v},{default:c(()=>[C("Cancel")]),_:1})])])]),default:c(()=>[da,ca,O(o(qt,{isSubmissionUploadSuccess:i(r).isUploaded,onHandleCloseUploadedFile:v,onHandleUpload:S,onHandleSetIsExcelFileUploaded:_},null,8,["isSubmissionUploadSuccess"]),[[L,i(r).uploadLoading]]),ua,u("div",pa,[u("div",Da,[o(la,{"list-data":i(r).displayData,page:i(r).pagination.currentPage},null,8,["list-data","page"])])]),i(r).displayData.length>0?(I(),k(dt,{key:0,onRaisePageChange:n[0]||(n[0]=F=>y(F)),currentPage:i(r).pagination.currentPage,totalPage:i(r).pagination.totalPage,totalPageSize:i(r).pagination.totalPageSize,startPaginationIndex:i(r).pagination.startPaginationIndex,endPaginationIndex:i(r).pagination.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"])):Q("",!0)]),_:1},8,["modelValue"])}}}),ga=Mt(ha,[["__scopeId","data-v-046a7db4"]]),fa={class:"row g-9 my-4"},va={class:"dialog-footer"},_a=B({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:l}){const a=st(),m=t,s=l,r=J(m,"visibility"),D=U(()=>a.filterData),p=()=>{g(),a.resetFilter()},g=()=>{s("handle-close",!1)},v=e=>{a.setLocationId(e)},S=e=>{a.setLocationIdTo(e)},h=e=>{a.setStartDate(e)},_=e=>{a.setStartDateTo(e)},y=e=>{a.setEndDate(e)},P=e=>{a.setEndDateTo(e)},w=()=>{const e=a.lastUsedFilterData.LocationId!==a.filterData.LocationId,n=a.lastUsedFilterData.LocationId!==a.filterData.LocationIdTo,d=a.lastUsedFilterData.StartDate!==a.filterData.StartDate,E=a.lastUsedFilterData.StartDate!==a.filterData.StartDateTo,L=a.lastUsedFilterData.EndDate!==a.filterData.EndDate,F=a.lastUsedFilterData.EndDate!==a.filterData.EndDateTo;s("handle-close",e||n||d||E||L||F)};return(e,n)=>{const d=T("el-button"),E=T("el-dialog");return I(),k(E,{modelValue:r.value,"onUpdate:modelValue":n[0]||(n[0]=L=>r.value=L),title:"Filter",width:"60%",onClose:n[1]||(n[1]=L=>g())},{footer:c(()=>[u("span",va,[o(d,{type:"secondary",onClick:p},{default:c(()=>[C("Reset")]),_:1}),o(d,{type:"primary",onClick:w},{default:c(()=>[C("Filter")]),_:1})])]),default:c(()=>[u("div",fa,[o(jt,{"value-from":D.value.LocationId,"value-to":D.value.LocationIdTo,label:"Location",name:"Location",options:i(a).locationOption,onHandleChangeFrom:v,onHandleChangeTo:S},null,8,["value-from","value-to","options"]),o(rt,{"value-from":D.value.StartDate?D.value.StartDate.toString():"","value-to":D.value.StartDateTo?D.value.StartDateTo.toString():"",label:"Start Date",name:"StartDate",placeholder:"Pick a date",onHandleChangeFrom:h,onHandleChangeTo:_},null,8,["value-from","value-to"]),o(rt,{"value-from":D.value.EndDate?D.value.EndDate.toString():"","value-to":D.value.EndDateTo?D.value.EndDateTo.toString():"",label:"End Date",name:"EndDate",placeholder:"Pick a date",onHandleChangeFrom:y,onHandleChangeTo:P},null,8,["value-from","value-to"])])]),_:1},8,["modelValue"])}}}),Sa={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},ya=u("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),ba={class:"d-flex justify-content-between align-items-center"},Ea={class:"card"},Ia={class:"card-body grid-padding"},La={class:"my-5"},Te=B({__name:"Index",setup(t){const l=vt(),a=st(),m=W(),s=it(),r=H(!1),D=H(!1),p=H(!1),g=H(!1),v=U(()=>a.displayData),S=U(()=>a.pagination),h=f=>{a.setPage(f)};Ot(async()=>{l.dispatch(St.ACTIVE_PAGE,"IronLake"),_t("Location Crack",[{pageName:"Iron Lake",pageRoute:"ironlake"},{pageName:"Crack Assignment",pageRoute:"locationcrack"},{pageName:"Location Crack",pageRoute:"locationcrack"}]),a.setPage(1),await a.getLookup()}),Rt(()=>{a.resetState(),m.resetState(),s.resetState()});const _=async()=>{await a.setPage(1),await a.getLookup()},y=()=>{r.value=!0},P=async f=>{r.value=!1,f&&await _()},w=()=>{D.value=!0},e=async f=>{D.value=!1,f&&await _()},n=()=>{p.value=!0},d=async f=>{p.value=!1,f&&await _()},E=async()=>{const f=await a.export();Gt.saveAs(new Blob([f],{type:"application/octet-stream"}),"Location Crack.xlsx")},L=()=>{g.value=!0},F=async f=>{g.value=!1,f&&await _()};return(f,R)=>(I(),q(Ht,null,[u("div",Sa,[ya,u("div",ba,[o(Et,{onShowDialog:y}),o(yt,{onShowDialog:n}),o(Lt,{onHandleDownload:E}),o(It,{onShowDialog:L})])]),u("div",Ea,[u("div",Ia,[o(Wt,{"list-data":v.value,page:S.value.currentPage,onShowDialog:w},null,8,["list-data","page"])])]),u("div",La,[i(a).paginationLoading?Q("",!0):(I(),k(dt,{key:0,onRaisePageChange:R[0]||(R[0]=ft=>h(ft)),currentPage:S.value.currentPage,totalPage:S.value.totalPage,totalPageSize:S.value.totalPageSize,startPaginationIndex:S.value.startPaginationIndex,endPaginationIndex:S.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),o(ea,{visibility:r.value,onHandleClose:P},null,8,["visibility"]),o(na,{visibility:D.value,onHandleClose:e},null,8,["visibility"]),o(_a,{visibility:p.value,onHandleClose:d},null,8,["visibility"]),o(ga,{visibility:g.value,onHandleClose:F},null,8,["visibility"])],64))}});export{Te as default};
