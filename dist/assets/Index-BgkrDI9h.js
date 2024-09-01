import{u as Vt}from"./vuex-BbOKrtVp.js";import{a as At}from"./breadcrumb-D-Q4Tk9w.js";import{b as z,i as yt,h as St,k as dt,m as ct,A as Ut,g as Nt}from"./index-BCnwA6yE.js";import{P as Rt}from"./Pagination-CVDIvnOM.js";import{P as et,d as Bt,a as zt}from"./table-sort-VnBD5Hfa.js";import{I as H,B as Mt,U as qt}from"./urls-DzqKjzQ_.js";import{d as ut}from"./pinia-BjOS2_Ao.js";import{k as O,r as U,u as b,y as Y,p as w,aa as N,q as B,x as l,R as g,Y as mt,s,aB as a,C as K,bL as Ot,B as R,A as J,F as pt,a0 as st,c as P,T as ht,bd as X,bb as Z,b4 as Tt,$ as jt,a7 as Ht,L as Gt}from"./@vue-BypzYtbH.js";import{_ as T}from"./nw-img-vue-CR837WER.js";import{_ as W,b as Kt}from"./element-plus-C5R56mia.js";import{e as Yt}from"./lodash-Cr9vlq0V.js";import{c as gt,a as q}from"./yup-BRaPd8dh.js";import"./property-expr-DEi1ZLzV.js";import{E as ft}from"./ErrorAlert-CMKGfwAi.js";import{F as Dt}from"./file-saver-DhbZvGod.js";import{_ as at}from"./Icon.vue_vue_type_script_setup_true_lang-DE-yo5DI.js";import{A as Jt}from"./MetronicAlert-CahvwpSR.js";import{_ as Qt}from"./TextInput.vue_vue_type_script_setup_true_lang-oAh_qqu1.js";import{_ as Wt}from"./SelectInput.vue_vue_type_script_setup_true_lang-CILKiK7F.js";import"./vue-router-iNp9kJ0K.js";import"./object-path-BACu75q6.js";import"./attr-accept-BWI1aNlo.js";import"./crypto-js-BZehCumu.js";import"./cron-Ci8nYs3o.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-N3crNZ6y.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-DK0FVkv3.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./dayjs-C7SXsQPH.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-xcxZ5rdH.js";import"./mitt-C1xD_ZTF.js";import"./@popperjs-WhmJkuoZ.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./vue-i18n-CE6bnohq.js";import"./@intlify-CjZh8qSI.js";import"./nanoclone-BAWie4i9.js";import"./toposort-CalJriC0.js";const nt={site:"",status:"true",page:1,pageSize:20},ot=ut({id:"siteList",state:()=>({stateFilterData:{site:"",status:"",page:1,pageSize:20},stateLastUsedFilterData:{...nt},statePageName:"site",stateDisplayData:[],stateDraftData:[],statePagination:new et,stateLoading:!1,statePaginationLoading:!1,stateSiteOption:[],stateSearchValue:""}),getters:{pageName:t=>t.statePageName,pagination:t=>t.statePagination,displayData:t=>t.stateSearchValue?t.stateDisplayData.filter(r=>{var o,i,e,p;return((o=r.siteId)==null?void 0:o.toLowerCase().includes(t.stateSearchValue.toLocaleLowerCase()))||((i=r.siteName)==null?void 0:i.toLowerCase().includes(t.stateSearchValue.toLocaleLowerCase()))||((e=r.siteCode)==null?void 0:e.toLowerCase().includes(t.stateSearchValue.toLocaleLowerCase()))||((p=r.modifiedBy)==null?void 0:p.toLowerCase().includes(t.stateSearchValue.toLocaleLowerCase()))}):t.stateDisplayData,draftData:t=>t.stateDraftData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,paginationLoading:t=>t.statePaginationLoading,siteOption:t=>t.stateSiteOption},actions:{async getData(t=!0){this.stateLoading=!0,this.stateLastUsedFilterData={...this.stateFilterData};const r={ver:"v1"},o={site:this.stateFilterData.site,status:this.stateFilterData.status===""?null:this.stateFilterData.status==="true",page:this.stateFilterData.page,pageSize:this.stateFilterData.pageSize};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const i=await z.post(`${H}?${new URLSearchParams(r).toString()}`,o);this.stateDisplayData=i.data.result.content.siteList,this.stateDraftData=i.data.result.content.siteDraftList,this.setTotalPage(i.data.result.content.totalData)}catch(i){console.log(i)}this.stateLoading=!1},async template(){try{const t={};return(await z.postBlob(`${H}/export/true?ver=v1`,t)).data}catch(t){console.log(t)}},async export(){const t={site:this.stateFilterData.site,status:this.stateFilterData.status===""?null:this.stateFilterData.status==="true"};try{return(await z.postBlob(`${H}/export/false?ver=v1`,t)).data}catch(r){console.log(r)}},setTotalPage(t){this.pagination.totalPage=t,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPageSize(t){this.statePaginationLoading=!0,this.stateFilterData.pageSize=t,this.statePagination.totalPageSize=this.stateFilterData.pageSize,this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!0),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setPage(t){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(t),this.statePagination.totalPageSize=this.stateFilterData.pageSize,this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setFilterData(t){this.stateLoading=!0,this.stateFilterData=t,await this.getData(!1)},setLastActiveFilter(t){this.stateFilterData=t},async resetFilter(){this.stateFilterData=nt,this.stateFilterData.page=1,this.stateFilterData.pageSize=20;const t=this.stateLastUsedFilterData.page!==0,r=this.stateLastUsedFilterData.pageSize!==0;(t||r)&&await this.getData()},setSearchValue(t){this.stateSearchValue=t},resetState(){this.stateFilterData={...nt},this.stateDisplayData=[],this.statePagination=new et,this.stateLoading=!1,this.statePaginationLoading=!1}}}),Q=ut({id:"siteForm",state:()=>({stateFormData:{isActive:!0},stateFormDraft:{},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1,stateLoadingMessage:""}),getters:{formData:t=>t.stateFormData,formDraftData:t=>t.stateFormDraft,error:t=>t.stateError,errors:t=>t.stateErrors,isError:t=>t.stateIsError,loading:t=>t.stateLoading},actions:{async upsertData(){var t,r;try{this.stateLoading=!0;const o={ver:"v1"},i=[this.stateFormData],e=await z.post(`${H}/upsert?${new URLSearchParams(o).toString()}`,i);e.data.title!=="Error"?e.data.result.isError?(this.stateErrors.push((r=(t=e.data.result.content)==null?void 0:t.siteList[0])==null?void 0:r.validationReason),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1):(this.stateErrors.push(e.data.result.message),this.stateIsError=!0)}catch(o){this.stateErrors.push(o.response.data.result.message),this.stateIsError=!0}finally{this.stateLoading=!1}},async updateDraft(){var t,r;try{this.stateLoading=!0;const o={ver:"v1"},i=[this.stateFormDraft],e=await z.post(`${H}/upsert?${new URLSearchParams(o).toString()}`,i);e.data.title!=="Error"?e.data.result.isError?(this.stateErrors.push((r=(t=e.data.result.content)==null?void 0:t.siteList[0])==null?void 0:r.validationReason),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1):(this.stateErrors.push(e.data.result.message),this.stateIsError=!0)}catch(o){this.stateErrors.push(o.response.data.result.message),this.stateIsError=!0}finally{this.stateLoading=!1}},async deleteDraft(t){try{this.stateLoading=!0;const r=[{siteDraftId:t}],o=await z.post(`${H}/delete_draft?ver=v1`,r);o.data.title!=="Error"?o.data.result.isError?(this.stateErrors.push("Failed to delete draft"),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1):(this.stateErrors.push(o.data.result.message),this.stateIsError=!0)}catch(r){this.stateErrors.push(r&&r.response.data.result.message),this.stateIsError=!0,this.stateLoading=!1}finally{this.stateLoading=!1}},async deleteBulkDraft(t){const r=new URLSearchParams({ver:"v1"}).toString();this.stateLoading=!0,this.stateLoadingMessage="Removing Data";try{return(await z.post(`${H}/delete_draft?${r}`,t)).data}catch(o){console.log(o)}finally{this.stateLoading=!1,this.stateLoadingMessage=""}},setErrors(t){this.stateErrors=t,this.stateIsError=this.stateErrors.length>0},setFormData(t){this.stateFormData.siteKeyId=t.siteKeyId||0,this.stateFormData.siteId=t.siteId||"",this.stateFormData.siteCode=t.siteCode||"",this.stateFormData.siteName=t.siteName||"",this.stateFormData.isActive=t.isActive||!1},setFormDraftData(t){this.stateFormDraft.siteDraftId=t.siteDraftId||0,this.stateFormDraft.siteId=t.siteId||"",this.stateFormDraft.siteCode=t.siteCode||"",this.stateFormDraft.siteName=t.siteName||"",this.stateFormDraft.isActive=!0},resetState(){this.stateFormData={isActive:!0},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1}}}),Xt={key:0,style:{height:"100px"}},Zt={class:"text-name"},te={class:"text-sitename"},ee={key:0,class:"d-flex justify-content-center"},ae={class:"badge badge-circle badge-success mx-auto rounded-badge-success"},se={key:1,class:"d-flex justify-content-center"},oe={class:"badge badge-circle badge-success mx-auto rounded-badge-error"},ie={class:"row"},le={class:"d-flex justify-content-end"},re=["onClick"],ne=O({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(t,{emit:r}){const o=t,i=ot(),e=Q(),p=r,y=U(""),n=S=>{y.value=S.order},v=(S,C,u)=>Bt(S[u].toString()||"",C[u].toString()||"",y.value),E=S=>{e.setFormData(S),p("show-dialog",null)};return(S,C)=>{const u=g("el-table-column"),k=g("inline-svg"),m=g("el-tooltip"),D=g("el-table"),F=mt("loading");return b(i).loading?Y((w(),N("div",Xt,null,512)),[[F,b(i).loading]]):Y((w(),B(D,{key:1,data:o.listData,style:{width:"100%"},onSortChange:n,"sort-orders":["ascending","descending"],"default-sort":{prop:"siteId",order:"ascending"},"header-cell-class-name":"ironlake-table-cell-header","cell-class-name":"ironlake-table-cell","empty-text":"No Data"},{default:l(()=>[s(u,{prop:"siteId",label:"Site ID",width:"200",sortable:"","sort-orders":["ascending","descending"],"sort-method":(h,_)=>v(h,_,"siteId"),align:"left"},{default:l(h=>[a("div",Zt,K(h.row.siteId),1)]),_:1},8,["sort-method"]),s(u,{width:"200",prop:"siteCode",label:"Site Code",sortable:"","sort-orders":["ascending","descending"],"sort-method":(h,_)=>v(h,_,"siteCode")},null,8,["sort-method"]),s(u,{width:"200",prop:"siteName",label:"Site Name",sortable:"","sort-orders":["ascending","descending"],"sort-method":(h,_)=>v(h,_,"siteName")},{default:l(h=>[a("div",te,K(h.row.siteName),1)]),_:1},8,["sort-method"]),s(u,{width:"200",prop:"isActive",label:"Status",align:"center",sortable:"","sort-orders":["ascending","descending"],"sort-method":(h,_)=>v(h,_,"isActive")},{default:l(h=>[h.row.isActive?(w(),N("div",ee,[a("div",ae,[s(k,{src:"/media/svg/tables/rows/check-light.svg"})])])):(w(),N("div",se,[a("div",oe,[s(k,{src:"/media/svg/tables/rows/valid-false-light.svg"})])]))]),_:1},8,["sort-method"]),s(u,{label:"Action","min-width":"80",align:"right",fixed:"right"},{default:l(h=>[a("div",ie,[a("div",le,[s(m,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:l(()=>[a("span",{onClick:_=>E(h.row),class:"svg-icon svg-icon-btech-secondary-500 d-flex justify-content-end cursor-pointer"},[s(k,{src:"/media/svg/tables/rows/mode-edit-round.svg",style:{width:"1.25rem",height:"1.25rem"}})],8,re)]),_:2},1024)])])]),_:1})]),_:1},8,["data"])),[[F,b(i).loading]])}}}),de=T(ne,[["__scopeId","data-v-df5c497e"]]),tt=ut({id:"siteBulk",state:()=>({stateBulkPayload:{},stateAlert:{show:!1,variant:"",desc:""},statePagination:new et,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{alertVariant:t=>t.stateAlert.variant,alertDesc:t=>t.stateAlert.desc,validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkUpload(){this.stateLoading=!0;const t=new FormData;t.append("fileUpload",this.stateBulkPayload.fileUpload);try{const r=await z.post(`${H}/bulk?ver=v1`,t);if(r.data.statusCode==200)if(r.data.result.isError)this.stateIsError=!0,this.stateError=r.data.result.message;else{const o=r.data.result.content,i=o.totalData,p=o.siteList.filter(n=>n.isValid===!1).length,y=i>1?"records":"record";p===0&&i===0?this.stateAlert={show:!0,variant:"info",desc:"No record has been submitted, please check your file"}:p===0&&i>0?this.stateAlert={show:!0,variant:"success",desc:`${i} of ${i} ${y} submitted successfully`}:p>0&&i>0&&(this.stateAlert={show:!0,variant:"warning",desc:`${p} of ${i} ${y} failed to submit`})}else this.stateAlert={show:!0,variant:"warning",desc:r.data.result.message},this.stateIsError=r.data.result.isError,this.stateError=r.data.result.message;this.stateLoading=!1}catch(r){console.log(r),this.stateLoading=!1,this.stateError=r,this.stateIsError=!0}},async bulkInsert(t){const r={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const o=await z.post(`${Mt}?${new URLSearchParams(r).toString()}`,this.stateBulkData);this.stateError=o.data.result.isError?o.data.result.message:"",this.stateIsError=o.data.result.isError}catch(o){console.log(o)}this.stateLoading=!1},async upload({userAccount:t,excelFile:r}){const o={userAccount:t,ver:"v1"},i=`${qt}?${new URLSearchParams(o).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const e=await z.postImages(i,r);e.data.statusCode==200?e.data.result.isError?(this.stateIsError=!0,this.stateError=e.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=e.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=Yt.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=e.data.result.isError,this.stateError=e.data.result.message)}catch(e){console.log(e),this.stateIsError=!0,this.stateError=e.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort(zt(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new et,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}}),ce={key:0,class:"d-flex justify-content-end"},ue={class:"svg-icon svg-icon-btech-danger-500 d-inline-block mr-2"},me={key:1,style:{height:"100px"}},pe={class:"d-flex gap-4"},he=["onClick"],ge={class:"text-name"},fe={class:"d-flex justify-content-end gap-6"},ve=["onClick"],_e=["onClick"],be=O({__name:"DraftGrid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog","show-errors","delete-draft"],setup(t,{emit:r}){const o=t,i=ot(),e=Q();tt();const p=r;Ot(()=>(o.page-1)*20+1);const y=U(""),n=m=>{y.value=m.order;const D={prop:m.prop,order:m.order};i.setSort(D)},v=m=>{e.setFormDraftData(m),p("show-dialog",null)},E=m=>{const D={name:m.siteName,errors:m.validationReason};p("show-errors",D)},S=m=>{p("delete-draft",m)},C=U([]),u=m=>{C.value=m.map(D=>({siteDraftId:D.siteDraftId}))},k=()=>{yt("Remove all selected records from Need Review?","Remove").then(async m=>{m.isConfirmed&&await e.deleteBulkDraft(C.value).then(()=>{i.setPage(1),St("Records have been successfully deleted!","Ok"),C.value=[]})})};return(m,D)=>{const F=g("inline-svg"),h=g("el-button"),_=g("el-tooltip"),c=mt("loading");return w(),N(pt,null,[C.value.length>0?(w(),N("section",ce,[s(h,{class:"btn btn-outline btn-outline-btech-danger btn-active-light-btech-danger btech-md mb-4",onClick:k},{default:l(()=>[a("span",ue,[s(F,{src:"/media/icons/bumaau/delete.svg",style:{width:"1.25rem",height:"1.25rem"}})]),R(" Delete ("+K(C.value.length)+") ",1)]),_:1})])):J("",!0),b(i).loading?Y((w(),N("div",me,null,512)),[[c,b(i).loading]]):Y((w(),B(b(Kt),{key:2,data:o.listData,style:{width:"100%"},"max-height":400,onSortChange:n,"empty-text":"No Data","header-cell-class-name":"ironlake-table-cell-header","cell-class-name":"ironlake-table-cell",onSelect:u,onSelectAll:u},{default:l(()=>[s(b(W),{label:"Site ID",width:"200",align:"left",prop:"validationReason"},{default:l(d=>[a("div",pe,[s(_,{class:"box-item",effect:"dark",content:"Click to see errors.",placement:"top"},{default:l(()=>[a("span",{class:"svg-icon svg-icon-btech-danger-500 me-1",style:{cursor:"pointer"},onClick:L=>E(d.row)},[s(F,{src:"/media/icons/bumaau/info.svg",style:{width:"1.25rem",height:"1.25rem"}})],8,he)]),_:2},1024),a("div",ge,K(d.row.siteId),1)])]),_:1}),s(b(W),{width:"200",prop:"siteCode",label:"Site Code"}),s(b(W),{"min-width":"200",prop:"siteName",label:"Site Name"}),s(b(W),{label:"Action",width:"80",align:"center",fixed:"right"},{default:l(d=>[a("div",fe,[s(_,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:l(()=>[a("span",{onClick:L=>v(d.row),class:"svg-icon svg-icon-btech-secondary-500 d-inline-block m-0 cursor-pointer"},[s(F,{src:"/media/svg/tables/rows/mode-edit-round.svg",style:{width:"1.25rem",height:"1.25rem"}})],8,ve)]),_:2},1024),s(_,{class:"box-item",effect:"dark",content:"Delete",placement:"top"},{default:l(()=>[a("span",{onClick:L=>S(d.row),class:"svg-icon svg-icon-btech-danger-500 d-inline-block m-0 cursor-pointer"},[s(F,{src:"/media/icons/bumaau/delete.svg",style:{width:"1.25rem",height:"1.25rem"}})],8,_e)]),_:2},1024)])]),_:1}),s(b(W),{type:"selection",fixed:"right",width:"40",align:"center","header-align":"center"})]),_:1},8,["data"])),[[c,b(i).loading]])],64)}}}),De=T(be,[["__scopeId","data-v-c45fa329"]]),vt=t=>(X("data-v-f46cdeb1"),t=t(),Z(),t),ye={class:"col-md-12 fv-row fv-plugins-icon-container"},Se=vt(()=>a("span",{class:"required"},"Site ID",-1)),we={class:"col-md-12 fv-row fv-plugins-icon-container"},Ce=vt(()=>a("span",{class:"required"},"Site Code",-1)),Ie={class:"col-md-12 fv-row fv-plugins-icon-container"},Ee=vt(()=>a("span",{class:"required"},"Site Name",-1)),ke={class:"dialog-footer"},$e=O({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:r}){const o=t,i=r,e=Q(),p=tt(),y=st(o,"visibility"),n=P(()=>e.formData),v=P(()=>e.errors),E=P(()=>e.isError),S=gt().shape({siteId:q().required("Site is mandatory"),siteCode:q().required("Site Code is mandatory"),siteName:q().required("Site Name is mandatory")}),C=()=>{k(""),D(""),m(""),F(!0)},u=(c=!1)=>{_(),C(),e.resetState(),i("handle-close",c)},k=c=>{n.value.siteId=c},m=c=>{n.value.siteName=c},D=c=>{n.value.siteCode=c},F=c=>{n.value.isActive=c},h=async()=>{_(),p.stateAlert.show=!1,e.stateLoadingMessage="Submitting Data",await S.validate(n.value,{abortEarly:!1}).catch(c=>{e.setErrors(c.errors)}),!E.value&&e.upsertData().then(()=>{e.isError?ct("Failed to Submit","","Ok"):dt("Record has been submitted successfully","","Ok").then(()=>{u(!0)})})},_=()=>{e.setErrors([])};return(c,d)=>{const L=g("el-input"),V=g("el-form-item"),G=g("el-form"),M=g("el-button"),j=g("el-dialog");return w(),B(j,{modelValue:y.value,"onUpdate:modelValue":d[4]||(d[4]=I=>y.value=I),title:"Add New Site",width:500,"close-on-click-modal":!1,"show-close":!1,onClose:d[5]||(d[5]=I=>u())},{footer:l(()=>[a("span",ke,[s(M,{type:"secondary",onClick:d[3]||(d[3]=I=>u()),disabled:b(e).loading},{default:l(()=>[R("Close")]),_:1},8,["disabled"]),s(M,{type:"primary",onClick:h,disabled:b(e).loading},{default:l(()=>[R("Submit")]),_:1},8,["disabled"])])]),default:l(()=>[s(ht,{name:"fade"},{default:l(()=>[E.value?(w(),B(ft,{key:0,errorMessages:v.value,onResetForm:_},null,8,["errorMessages"])):J("",!0)]),_:1}),s(G,{class:"row g-4 my-4","label-position":"top"},{default:l(()=>[a("div",ye,[s(V,{class:"m-0"},{label:l(()=>[Se]),default:l(()=>[s(L,{maxlength:"4",modelValue:n.value.siteId,"onUpdate:modelValue":d[0]||(d[0]=I=>n.value.siteId=I),placeholder:"Add Site ID",onInput:k},null,8,["modelValue"])]),_:1})]),a("div",we,[s(V,{class:"m-0"},{label:l(()=>[Ce]),default:l(()=>[s(L,{maxlength:"4",modelValue:n.value.siteCode,"onUpdate:modelValue":d[1]||(d[1]=I=>n.value.siteCode=I),placeholder:"Add Site Code",onInput:D},null,8,["modelValue"])]),_:1})]),a("div",Ie,[s(V,{class:"m-0"},{label:l(()=>[Ee]),default:l(()=>[s(L,{"max-length":"3",modelValue:n.value.siteName,"onUpdate:modelValue":d[2]||(d[2]=I=>n.value.siteName=I),placeholder:"Add Site Name",onInput:m},null,8,["modelValue"])]),_:1})])]),_:1})]),_:1},8,["modelValue"])}}}),Fe=T($e,[["__scopeId","data-v-f46cdeb1"]]),it=t=>(X("data-v-1260c43b"),t=t(),Z(),t),Le={class:"col-md-12 fv-row fv-plugins-icon-container"},xe=it(()=>a("span",{class:"required"},"Site ID",-1)),Pe={class:"col-md-12 fv-row fv-plugins-icon-container"},Ve=it(()=>a("span",{class:"required"},"Site Code",-1)),Ae={class:"col-md-12 fv-row fv-plugins-icon-container"},Ue=it(()=>a("span",{class:"required"},"Site Name",-1)),Ne={class:"col-md-12 fv-row fv-plugins-icon-container"},Re={class:"align-items-center fv-row"},Be=it(()=>a("label",{class:Tt("form-label fs-6 fw-bolder")},[R("Status "),a("span",{class:"text-danger"},"*")],-1)),ze={class:"d-flex align-items-center justify-content-between form-control form-control-lg"},Me={class:"dialog-footer"},qe=O({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:r}){const o=t,i=r,e=Q(),p=tt(),y=st(o,"visibility"),n=P(()=>e.formData),v=P(()=>e.errors),E=P(()=>e.isError),S=gt().shape({siteId:q().required("Site is mandatory"),siteCode:q().required("Site Code is mandatory"),siteName:q().required("Site Name is mandatory")}),C=()=>{e.stateFormData.siteKeyId=0,k(""),D(""),m(""),F(!1)},u=(c=!1)=>{C(),_(),e.resetState(),i("handle-close",c)},k=c=>{n.value.siteId=c},m=c=>{n.value.siteName=c},D=c=>{n.value.siteCode=c},F=c=>{n.value.isActive=c},h=async()=>{_(),p.stateAlert.show=!1,e.stateLoadingMessage="Submitting Data",await S.validate(n.value,{abortEarly:!1}).catch(c=>{e.setErrors(c.errors)}),!E.value&&e.upsertData().then(()=>{e.isError?ct("Failed to Update","","Ok"):dt("Record has been submitted successfully","","Ok").then(()=>{u(!0)})})},_=()=>{e.setErrors([])};return(c,d)=>{const L=g("el-input"),V=g("el-form-item"),G=g("el-switch"),M=g("el-form"),j=g("el-button"),I=g("el-dialog");return w(),B(I,{modelValue:y.value,"onUpdate:modelValue":d[5]||(d[5]=A=>y.value=A),title:"Edit Site",width:500,"close-on-click-modal":!1,"show-close":!1,onClose:d[6]||(d[6]=A=>u())},{footer:l(()=>[a("span",Me,[s(j,{type:"secondary",onClick:d[4]||(d[4]=A=>u()),disabled:b(e).loading},{default:l(()=>[R("Close")]),_:1},8,["disabled"]),s(j,{type:"primary",onClick:h,disabled:b(e).loading},{default:l(()=>[R("Submit")]),_:1},8,["disabled"])])]),default:l(()=>[s(ht,{name:"fade"},{default:l(()=>[E.value?(w(),B(ft,{key:0,errorMessages:v.value,onResetForm:_},null,8,["errorMessages"])):J("",!0)]),_:1}),s(M,{class:"row g-4 my-4","label-position":"top"},{default:l(()=>[a("div",Le,[s(V,{class:"m-0"},{label:l(()=>[xe]),default:l(()=>[s(L,{maxlength:"4",modelValue:n.value.siteId,"onUpdate:modelValue":d[0]||(d[0]=A=>n.value.siteId=A),placeholder:"Add Site ID",onInput:k},null,8,["modelValue"])]),_:1})]),a("div",Pe,[s(V,{class:"m-0"},{label:l(()=>[Ve]),default:l(()=>[s(L,{maxlength:"4",modelValue:n.value.siteCode,"onUpdate:modelValue":d[1]||(d[1]=A=>n.value.siteCode=A),placeholder:"Add Site Code",onInput:D},null,8,["modelValue"])]),_:1})]),a("div",Ae,[s(V,{class:"m-0"},{label:l(()=>[Ue]),default:l(()=>[s(L,{"max-length":"3",modelValue:n.value.siteName,"onUpdate:modelValue":d[2]||(d[2]=A=>n.value.siteName=A),placeholder:"Add Site Name",onInput:m},null,8,["modelValue"])]),_:1})]),a("div",Ne,[a("div",Re,[Be,a("div",ze,[s(G,{modelValue:n.value.isActive,"onUpdate:modelValue":d[3]||(d[3]=A=>n.value.isActive=A),name:"Status",onHandleChange:F},null,8,["modelValue"]),a("span",null,K(n.value.isActive?"Active":"Inactive"),1)])])])]),_:1})]),_:1},8,["modelValue"])}}}),Oe=T(qe,[["__scopeId","data-v-1260c43b"]]),Te=O({__name:"DownloadButton",emits:["handleDownload"],setup(t,{emit:r}){const o=r,i=()=>{o("handleDownload")};return(e,p)=>(w(),N("button",{class:"d-flex gap-2 align-items-center btn btn-btech-outline px-4 py-2",onClick:i},[s(at,{name:"download",size:"24"}),R(" Export ")]))}}),je=T(Te,[["__scopeId","data-v-0c70acd8"]]),He={key:0},Ge={class:"m-0",style:{"word-break":"normal"}},Ke={key:1},Ye=O({__name:"DraftErrorModal",props:{visibility:{type:Boolean,default:!1},errorData:{type:Object,default:null}},emits:["handle-close"],setup(t,{emit:r}){const o=t,i=P(()=>{var v,E;return(E=(v=o.errorData)==null?void 0:v.errors)==null?void 0:E.split(",")}),e=st(o,"visibility"),p=r,y=(n=!1)=>{p("handle-close",n)};return(n,v)=>{var S;const E=g("el-dialog");return w(),B(E,{modelValue:e.value,"onUpdate:modelValue":v[0]||(v[0]=C=>e.value=C),title:`Errors for ${(S=o.errorData)==null?void 0:S.name}`,width:"500px",onClose:v[1]||(v[1]=C=>y()),"align-center":""},{default:l(()=>[i.value?(w(),N("ul",He,[(w(!0),N(pt,null,jt(i.value,(C,u)=>(w(),N("li",{key:u},[a("p",Ge,K(C),1)]))),128))])):(w(),N("p",Ke,"Undefined"))]),_:1},8,["modelValue","title"])}}}),Je=T(Ye,[["__scopeId","data-v-ab75fb3d"]]),_t=t=>(X("data-v-108865cd"),t=t(),Z(),t),Qe={class:"col-md-12 fv-row fv-plugins-icon-container"},We=_t(()=>a("span",{class:"required"},"Site ID",-1)),Xe={class:"col-md-12 fv-row fv-plugins-icon-container"},Ze=_t(()=>a("span",{class:"required"},"Site Code",-1)),ta={class:"col-md-12 fv-row fv-plugins-icon-container"},ea=_t(()=>a("span",{class:"required"},"Site Name",-1)),aa={class:"dialog-footer"},sa=O({__name:"FormEditDraftDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:r}){const o=t,i=r,e=Q(),p=tt(),y=st(o,"visibility"),n=P(()=>e.formDraftData),v=P(()=>e.errors),E=P(()=>e.isError),S=gt().shape({siteId:q().required("Site is mandatory"),siteCode:q().required("Site Code is mandatory"),siteName:q().required("Site Name is mandatory")}),C=()=>{e.stateFormData.siteKeyId=0,k(""),D(""),m(""),F(!1)},u=(c=!1)=>{C(),_(),e.resetState(),i("handle-close",c)},k=c=>{n.value.siteId=c},m=c=>{n.value.siteName=c},D=c=>{n.value.siteCode=c},F=c=>{n.value.isActive=c},h=async()=>{_(),p.stateAlert.show=!1,e.stateLoadingMessage="Submitting Data",await S.validate(n.value,{abortEarly:!1}).catch(c=>{e.setErrors(c.errors)}),!E.value&&e.updateDraft().then(()=>{e.isError?ct("Failed to Submit","","Ok"):dt("Record has been submitted successfully","","Ok").then(()=>{u(!0)})})},_=()=>{e.setErrors([])};return(c,d)=>{const L=g("el-input"),V=g("el-form-item"),G=g("el-form"),M=g("el-button"),j=g("el-dialog");return w(),B(j,{modelValue:y.value,"onUpdate:modelValue":d[4]||(d[4]=I=>y.value=I),title:"Edit Site",width:500,"close-on-click-modal":!1,"show-close":!1,onClose:d[5]||(d[5]=I=>u())},{footer:l(()=>[a("span",aa,[s(M,{type:"secondary",onClick:d[3]||(d[3]=I=>u()),disabled:b(e).loading},{default:l(()=>[R("Close")]),_:1},8,["disabled"]),s(M,{type:"primary",onClick:h,disabled:b(e).loading},{default:l(()=>[R("Submit")]),_:1},8,["disabled"])])]),default:l(()=>[s(ht,{name:"fade"},{default:l(()=>[E.value?(w(),B(ft,{key:0,errorMessages:v.value,onResetForm:_},null,8,["errorMessages"])):J("",!0)]),_:1}),s(G,{class:"row g-4 my-4","label-position":"top"},{default:l(()=>[a("div",Qe,[s(V,{class:"m-0"},{label:l(()=>[We]),default:l(()=>[s(L,{maxlength:"4",modelValue:n.value.siteId,"onUpdate:modelValue":d[0]||(d[0]=I=>n.value.siteId=I),placeholder:"Add Site ID",onInput:k},null,8,["modelValue"])]),_:1})]),a("div",Xe,[s(V,{class:"m-0"},{label:l(()=>[Ze]),default:l(()=>[s(L,{maxlength:"4",modelValue:n.value.siteCode,"onUpdate:modelValue":d[1]||(d[1]=I=>n.value.siteCode=I),placeholder:"Add Site Code",onInput:D},null,8,["modelValue"])]),_:1})]),a("div",ta,[s(V,{class:"m-0"},{label:l(()=>[ea]),default:l(()=>[s(L,{"max-length":"3",modelValue:n.value.siteName,"onUpdate:modelValue":d[2]||(d[2]=I=>n.value.siteName=I),placeholder:"Add Site Name",onInput:m},null,8,["modelValue"])]),_:1})])]),_:1})]),_:1},8,["modelValue"])}}}),oa=T(sa,[["__scopeId","data-v-108865cd"]]),ia=t=>(X("data-v-88d259a0"),t=t(),Z(),t),la={class:"employee-filter-container"},ra=ia(()=>a("div",{class:"employee-filter-header"},[a("p",{class:"m-0 fw-700 text-large"},"Filters")],-1)),na={class:"row employee-filter-body"},da={class:"col-12"},ca={class:"col-12"},ua=O({__name:"FilterButton",emits:["applyFilter"],setup(t,{emit:r}){const o=ot(),i=U({site:"",status:"",ver:"v1",page:1,pageSize:20}),e=U([{value:"",label:"All"},{value:"true",label:"Active"},{value:"false",label:"Inactive"}]),p=U(!1),y=r,n=()=>{y("applyFilter",i)},v=()=>{i.value.site=o.stateLastUsedFilterData.site,i.value.status=o.stateLastUsedFilterData.status,p.value=!p.value},E=()=>{i.value.site=o.stateLastUsedFilterData.site,i.value.status=o.stateLastUsedFilterData.status,p.value=!1},S=()=>{i.value.site="",i.value.status=""};return(C,u)=>{const k=g("el-popover");return w(),B(k,{placement:"bottom",width:480,trigger:"click",visible:p.value},{reference:l(()=>[a("button",{class:"d-flex gap-2 align-items-center btn btn-btech-outline px-4 py-2",onClick:v},[s(at,{name:"filter",size:"24"}),R(" Filter ")])]),default:l(()=>[a("div",la,[ra,a("div",na,[a("div",da,[s(Qt,{value:i.value.site,margin:!1,placeholder:"Search Site ID, Site Code or Site name",label:"Site",name:"Site",onHandleChange:u[0]||(u[0]=m=>i.value.site=m),max:255},null,8,["value"])]),a("div",ca,[s(Wt,{class:"m-0",margin:!1,options:e.value,value:i.value.status,name:"Status",label:"Status",placeholder:"Select status",onHandleChange:u[1]||(u[1]=m=>i.value.status=m)},null,8,["options","value"])])]),a("div",{class:"employee-filter-footer"},[a("div",null,[a("button",{class:"btn btn-btech-outline",onClick:S}," Reset ")]),a("div",{class:"d-flex gap-4 align-items-center"},[a("button",{class:"btn btn-btech-outline",onClick:E}," Close "),a("button",{class:"btn btn-btech",onClick:n},"Apply")])])])]),_:1},8,["visible"])}}}),ma=T(ua,[["__scopeId","data-v-88d259a0"]]),lt=t=>(X("data-v-ea41cd6f"),t=t(),Z(),t),pa={"element-loading-text":"Uploading File","element-loading-background":"rgba(0, 0, 0, 0.5)"},ha=["element-loading-text"],ga={class:"px-3 py-8"},fa={class:"d-flex justify-content-between align-items-center"},va=lt(()=>a("div",{class:""},[a("div",{class:"flex-grow-1"},[a("h5",{class:"mb-2 header-title"},"Site")])],-1)),_a={class:"align-self-start d-flex gap-2"},ba=lt(()=>a("i",{class:"fas fa-plus fs-4 pe-2"},null,-1)),Da={key:0,class:"card mb-6"},ya={class:"m-0"},Sa={class:"text-btech-danger-500"},wa=lt(()=>a("section",{class:"mb-6"},null,-1)),Ca={class:"card mb-10"},Ia={class:"card-body p-3"},Ea={class:"d-flex justify-content-between my-4 align-items-center"},ka=lt(()=>a("p",{class:"m-0 card-table-title"},"Site List",-1)),$a={class:"d-flex justify-content-between gap-2"},Fa={class:"my-5"},La=O({__name:"Index",setup(t){const r=Vt(),o=ot(),i=Q(),e=tt(),p=U(!1),y=U(!1),n=U(!1),v=U(!1),E=U({}),S=U(null),C=U(["draftPanel"]),u=P(()=>o.displayData),k=P(()=>o.draftData),m=P(()=>e.stateBulkPayload),D=P(()=>o.pagination),F=f=>{o.setPage(f)};Ht(async()=>{r.dispatch(Ut.ACTIVE_PAGE,"IronLake"),At("Site",[{pageName:"Site",pageRoute:"site"}]),await o.setPage(1)}),Gt(()=>{o.resetState(),i.resetState(),e.resetState()});const h=async()=>{await o.setPage(1)},_=()=>{p.value=!0},c=async f=>{p.value=!1,f&&await h()},d=()=>{y.value=!0},L=async f=>{y.value=!1,f&&await h()},V=async()=>{const f=await o.export();Dt.saveAs(new Blob([f],{type:"application/octet-stream"}),"Site.xlsx")},G=f=>{o.setPageSize(f)},M=f=>{E.value=f,v.value=!0},j=()=>{v.value=!1},I=()=>{n.value=!0},A=async f=>{n.value=!1,f&&await h()},wt=()=>{var f;(f=S.value)==null||f.click()},Ct=async()=>{const f=await o.template();Dt.saveAs(new Blob([f],{type:"application/octet-stream"}),"MasterSite.xlsx")},It=f=>{m.value.fileUpload=f},Et=async f=>{const $=f.target.files[0];It($),kt(),S.value&&(S.value.value="")},kt=()=>{e.bulkUpload().then(()=>{h()})},$t=async f=>{i.stateLoadingMessage="Removing Data",yt("Remove this record from Need Review ?").then(async $=>{$.isConfirmed&&i.deleteDraft(f.siteDraftId).then(()=>{i.isError?Nt(`Failed to delete : ${i.stateErrors[0].toString}`,"Close").then(()=>{h()}):St("Record has been removed successfuly!","Close").then(()=>{h()})})})},Ft=f=>{o.setFilterData(f),o.setLastActiveFilter(f)};return(f,$)=>{const rt=g("el-button"),Lt=g("el-tooltip"),xt=g("el-collapse-item"),Pt=g("el-collapse"),bt=mt("loading");return w(),N(pt,null,[a("template",null,[Y(a("div",pa,null,512),[[bt,b(e).loading,void 0,{fullscreen:!0,lock:!0}]]),Y(a("div",{"element-loading-text":b(i).stateLoadingMessage,"element-loading-background":"rgba(0, 0, 0, 0.5)"},null,8,ha),[[bt,b(i).loading,void 0,{fullscreen:!0,lock:!0}]])]),a("section",ga,[a("div",fa,[va,a("div",_a,[s(Lt,{class:"box-item",effect:"dark",content:"Download Site Template",placement:"top"},{default:l(()=>[s(rt,{class:"btn btn-icon btn-btech-outline btech-lg m-0",onClick:Ct},{default:l(()=>[s(at,{name:"excel-icon",size:"20"})]),_:1})]),_:1}),s(rt,{class:"btn btn-btech-outline btech-lg m-0",onClick:wt},{default:l(()=>[s(at,{name:"upload",size:"20"}),R(" Upload ")]),_:1}),a("input",{ref_key:"bulkFile",ref:S,type:"file",accept:".xlsx",hidden:"",onChange:Et},null,544),s(rt,{class:"btn btn-btech-secondary btech-lg m-0",onClick:$[0]||($[0]=x=>_())},{default:l(()=>[ba,R(" Add New ")]),_:1})])])]),s(Jt,{"show-alert":b(e).stateAlert.show,"onUpdate:showAlert":$[1]||($[1]=x=>b(e).stateAlert.show=x),variant:b(e).alertVariant,desc:b(e).alertDesc},null,8,["show-alert","variant","desc"]),k.value.length>0?(w(),N("section",Da,[s(Pt,{modelValue:C.value,"onUpdate:modelValue":$[4]||($[4]=x=>C.value=x),class:"card-body p-3 ironlake-draft-collapse"},{default:l(()=>[s(xt,{name:"draftPanel"},{title:l(()=>[a("p",ya,[R(" Need Review "),a("span",Sa," ("+K(k.value.length)+") ",1)])]),default:l(()=>[wa,s(De,{"list-data":k.value,page:D.value.currentPage,onShowDialog:I,onShowErrors:$[2]||($[2]=x=>M(x)),onDeleteDraft:$[3]||($[3]=x=>$t(x))},null,8,["list-data","page"])]),_:1})]),_:1},8,["modelValue"])])):J("",!0),a("section",Ca,[a("div",Ia,[a("div",Ea,[ka,a("div",$a,[s(ma,{onApplyFilter:$[5]||($[5]=x=>Ft(x))}),s(je,{onHandleDownload:V})])]),s(de,{"list-data":u.value,page:D.value.currentPage,onShowDialog:d},null,8,["list-data","page"]),a("div",Fa,[b(o).paginationLoading?J("",!0):(w(),B(Rt,{key:0,onRaisePageChange:$[6]||($[6]=x=>F(x)),onRaiseSizeChange:$[7]||($[7]=x=>G(x)),currentPage:D.value.currentPage,totalPage:D.value.totalPage,totalPageSize:D.value.totalPageSize,startPaginationIndex:D.value.startPaginationIndex,endPaginationIndex:D.value.endPaginationIndex,isPageSizeChange:!0,pageSizes:[50,20,10]},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),s(Fe,{visibility:p.value,onHandleClose:c},null,8,["visibility"]),s(Oe,{visibility:y.value,onHandleClose:L},null,8,["visibility"]),s(oa,{visibility:n.value,onHandleClose:A},null,8,["visibility"]),s(Je,{visibility:v.value,onHandleClose:j,"error-data":E.value},null,8,["visibility","error-data"])])])],64)}}}),ws=T(La,[["__scopeId","data-v-ea41cd6f"]]);export{ws as default};
