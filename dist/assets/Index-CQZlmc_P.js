import{u as de}from"./useMenuStore-CD5Gmvif.js";import{a as ue}from"./breadcrumb-BYmEOf4C.js";import{c as k,a as X,J as M,I as J,z as A,A as pe}from"./index-BuVmIl8K.js";import{P as ee}from"./Pagination-D-xfdYmn.js";import{F as me}from"./FilterIconButton-Bj0WTbms.js";import{h as ce,A as ge,U as he}from"./excel-generator-DMHRo93s.js";import{D as ye}from"./DownloadIconButton-CIQp-YG7.js";import{_ as U,b as te}from"./element-plus-BeWdvTRa.js";import{y as fe}from"./date-format-8-IvfSl3.js";import{P as T}from"./Pagination-BiobnanQ.js";import{d as Q}from"./pinia-BjOS2_Ao.js";import{k as L,bL as _e,r as B,u as o,y as O,p as P,aa as ae,q as N,x as p,Y as H,R as $,s as r,aB as l,C as Y,a0 as q,c as C,B as G,A as j,T as se,bd as De,bb as ve,a7 as be,L as Ee,F as Ie}from"./@vue-BypzYtbH.js";import{a as Se,d as Ue}from"./table-sort-Bpdq_Uwn.js";import{a as oe}from"./vee-validate-C_msoaAA.js";import{c as re,a as z}from"./yup-C6P98bvY.js";import"./property-expr-DEi1ZLzV.js";import{E as ie}from"./ErrorAlert-CMKGfwAi.js";import{_ as R}from"./AutoComplete.vue_vue_type_script_setup_true_lang-DJ43pGTI.js";import{_ as Pe}from"./SwitchInput.vue_vue_type_script_setup_true_lang-BosisL7w.js";import{e as we}from"./lodash-DrHMlsdo.js";import{_ as Ne}from"./FileDropZone.vue_vue_type_style_index_0_lang-C5PyimC7.js";import{m as Ge}from"./map-anything-abi6NY2Z.js";import{_ as $e}from"./nw-img-vue-CR837WER.js";import{F as Ce}from"./file-saver-CwTBvle_.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./PageEnum-DUtfSNQS.js";import"./xlsx-C4maHrMm.js";import"./moment-C5S46NFB.js";import"./nanoclone-BAWie4i9.js";import"./toposort-NSxIV7Fb.js";import"./vue3-dropzone-_NG5IwbJ.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";import"./attr-accept-DLIfoYC7.js";const ke="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_member/data",ne="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_member/usergroupmember",Fe="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_member/export",Le="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group/lookup",xe="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_employee/lookup",Oe="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_member/export_template",Re="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_member/bulk",Be="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_member/validate_upload",Ve=`${ne}/update`,V=Q({id:"userGroupMemberList",state:()=>({stateFilterData:{userGroupName:"",employeeName:"",page:1,pageSize:10,order:"",ver:"v1"},stateLastUsedFilterData:{userGroupName:"",employeeName:"",page:1,pageSize:10,order:"",ver:"v1"},statePageName:"usergroupmember",stateDisplayData:[],statePagination:new T,stateLoading:!1,statePaginationLoading:!1,stateUserGroupIdOption:[],stateEmployeeIDOption:[],stateEmployeeIDFormOption:[],stateUserGroupOption:[]}),getters:{pageName:e=>e.statePageName,pagination:e=>e.statePagination,displayData:e=>e.stateDisplayData,filterData:e=>e.stateFilterData,lastUsedFilterData:e=>e.stateLastUsedFilterData,loading:e=>e.stateLoading,paginationLoading:e=>e.statePaginationLoading,userGroupIdOption:e=>e.stateUserGroupIdOption,employeeIDOption:e=>e.stateEmployeeIDOption,userGroupOption:e=>e.stateUserGroupOption},actions:{async getData(e=!0){const a={userGroupName:this.stateFilterData.userGroupName,employeeName:this.stateFilterData.employeeName,Page:this.stateFilterData.page.toString(),PageSize:this.stateFilterData.pageSize.toString(),Order:this.stateFilterData.order},t={ver:this.stateFilterData.ver};try{e&&(this.stateLoading=!0),e||(this.stateDisplayData=[]);const d=await k.post(`${ke}?${new URLSearchParams(t).toString()}`,a);this.stateDisplayData=d.data.result.content,this.setTotalPage(d.data.result.total||d.data.result.totalData),this.stateLastUsedFilterData={...this.stateFilterData}}catch(d){console.log(d)}this.stateLoading=!1},async getUserGroupLookup(){const e={ver:this.stateFilterData.ver};try{const a=await k.get(`${Le}?${new URLSearchParams(e).toString()}`);a.data.result.content.groupDescription&&a.data.result.content.groupName&&(this.stateUserGroupIdOption=a.data.result.content.groupName.map((t,d)=>({label:`${t} | ${a.data.result.content.groupDescription[d]}`,value:t})))}catch(a){console.log(a)}},async getEmployeeLookup(){const e={ver:this.stateFilterData.ver};try{const a=await k.get(`${xe}?${new URLSearchParams(e).toString()}`);a.data.result.content.emmployeeId&&a.data.result.content.employeeName&&(this.stateEmployeeIDOption=a.data.result.content.emmployeeId.map((t,d)=>({label:`${t} | ${a.data.result.content.employeeName[d]}`,value:a.data.result.content.employeeName[d]})),this.stateEmployeeIDFormOption=a.data.result.content.emmployeeId.map((t,d)=>({label:`${t} | ${a.data.result.content.employeeName[d]}`,value:`${t}`})))}catch(a){console.log(a)}},async export(){const e={userGroupName:this.stateFilterData.userGroupName,employeeName:this.stateFilterData.employeeName,ver:this.stateFilterData.ver,Gmt:new Date().toTimeString().slice(12,17)};try{return(await k.postBlob(`${Fe}?${new URLSearchParams(e).toString()}`,{})).data}catch(a){console.log(a)}},setTotalPage(e){this.pagination.totalPage=e,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(e){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(e),this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:e,order:a}){if(!e&&!a)this.stateFilterData.order="";else{const t=a=="ascending"?"asc":"desc";this.stateFilterData.order=`${e}_${t}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.page=this.statePagination.currentPage,await this.getData(!1)},setUserGroupId(e){this.stateFilterData.userGroupName=e},setEmployeeID(e){this.stateFilterData.employeeName=e},async resetFilter(){this.stateFilterData.userGroupName="",this.stateFilterData.employeeName="";const e=this.stateLastUsedFilterData.userGroupName!=="",a=this.stateLastUsedFilterData.employeeName!=="";(e||a)&&await this.getData()},resetState(){this.stateFilterData={userGroupName:"",employeeName:"",page:1,pageSize:10,order:"",ver:"v1"},this.stateDisplayData=[],this.statePagination=new T,this.stateLoading=!1,this.statePaginationLoading=!1}}}),K=Q({id:"userGroupMemberForm",state:()=>({stateFormData:{mdId:0,isDeleted:!1},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1,stateStrategyCategoryOption:[],stateStrategyPackageOption:[],stateBudgetLifeOption:[],stateUomOption:[]}),getters:{formData:e=>e.stateFormData,error:e=>e.stateError,errors:e=>e.stateErrors,isError:e=>e.stateIsError,loading:e=>e.stateLoading,strategyCategoryCodeOption:e=>e.stateStrategyCategoryOption,strategyPackageOption:e=>e.stateStrategyPackageOption,budgetLifeOption:e=>e.stateBudgetLifeOption,uomOption:e=>e.stateUomOption},actions:{async insertData(e){try{this.stateLoading=!0;const a={userAccount:e,ver:"v1"},t=await k.post(`${ne}?${new URLSearchParams(a).toString()}`,this.stateFormData);t.data.title==="Error"?(this.stateErrors.push(t.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(a){this.stateErrors.push(a.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},async updateData(e){try{this.stateLoading=!0;const a={userAccount:e,ver:"v1"},t=await k.post(`${Ve}?${new URLSearchParams(a).toString()}`,this.stateFormData);t.data.title==="Error"?(this.stateErrors.push(t.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(a){this.stateErrors.push(a.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},setErrors(e){this.stateErrors=e,this.stateIsError=this.stateErrors.length>0},resetState(){this.stateFormData={mdId:0,isDeleted:!1},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1},setFormData(e){this.stateFormData.mdId=e.UserGroupMemberId||0,this.stateFormData.employeeId=e.EmployeeId||"",this.stateFormData.userGroupName=e.UserGroupName||""}}}),Ae={key:0,style:{height:"100px"}},Me={class:"row justify-content-center"},Te=["onClick"],ze=L({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(e,{emit:a}){const t=e,d=V(),s=K(),i=a,D=_e(()=>(t.page-1)*10+1),b=B(""),c=g=>{b.value=g.order;const v={prop:g.prop,order:g.order};d.setSort(v)},y=(g,v,h)=>Se(g[h],v[h],b.value),S=g=>{s.setFormData(g),i("show-dialog",null)};return(g,v)=>{const h=$("inline-svg"),E=$("el-tooltip"),I=H("loading");return o(d).loading?O((P(),ae("div",Ae,null,512)),[[I,o(d).loading]]):O((P(),N(o(te),{key:1,data:t.listData,style:{width:"100%"},onSortChange:c,"empty-text":"No Data"},{default:p(()=>[r(o(U),{label:"No",width:"90",align:"center"},{default:p(n=>[l("span",null,Y(o(D)+n.$index),1)]),_:1}),r(o(U),{prop:"UserGroupName",label:"User Group Name",width:"170",sortable:"","sort-method":(n,u)=>y(n,u,"UserGroupName")},null,8,["sort-method"]),r(o(U),{prop:"UserGroupDesc",label:"Group Description","min-width":"170",sortable:"","sort-method":(n,u)=>y(n,u,"UserGroupDesc")},null,8,["sort-method"]),r(o(U),{prop:"EmployeeId",label:"Employee ID",width:"170",sortable:"","sort-method":(n,u)=>y(n,u,"EmployeeId")},null,8,["sort-method"]),r(o(U),{prop:"EmployeeName",label:"Name",width:"170",sortable:"","sort-method":(n,u)=>y(n,u,"EmployeeName")},null,8,["sort-method"]),r(o(U),{prop:"ChangedOn",label:"Changed on",align:"center",width:"170",sortable:""},{default:p(n=>[l("span",null,Y(o(fe)(n.row.ChangedOn)),1)]),_:1}),r(o(U),{prop:"ChangedBy",label:"Changed by",sortable:"",width:"300","sort-method":(n,u)=>y(n,u,"ChangedBy")},null,8,["sort-method"]),r(o(U),{label:"",width:"80"},{default:p(n=>[l("div",Me,[r(E,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:p(()=>[l("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:u=>S(n.row)},[r(h,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,Te)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[I,o(d).loading]])}}}),He={class:"row g-4 my-4"},qe={class:"col-md-6 fv-row fv-plugins-icon-container"},je={class:"col-md-6 fv-row fv-plugins-icon-container"},Ke={class:"dialog-footer"},Ye=L({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(e,{emit:a}){const t=e,d=a,s=K(),i=X(),D=V(),b=q(t,"visibility"),c=C(()=>s.formData),y=C(()=>s.errors),S=C(()=>s.isError),g=re().shape({userGroupName:z().required("User Group Name | User Group Description is mandatory"),employeeId:z().required("Employee ID | Employee Name is mandatory")}),v=()=>{E(""),I("")},h=(m=!1)=>{u(),v(),s.resetState(),d("handle-close",m)},E=m=>{c.value.employeeId=m},I=m=>{c.value.userGroupName=m},n=async()=>{u(),await g.validate(c.value,{abortEarly:!1}).catch(m=>{s.setErrors(m.errors)}),!S.value&&M("Are you sure you want to submit ?").then(async m=>{m.isConfirmed&&s.insertData(i.user.Name).then(()=>{s.isError||J("Form has been successfully submitted!","Ok").then(()=>{h(!0)})})})},u=()=>{s.setErrors([])};return(m,f)=>{const w=$("el-button"),_=$("el-dialog"),F=H("loading");return O((P(),N(_,{modelValue:b.value,"onUpdate:modelValue":f[0]||(f[0]=x=>b.value=x),title:"New Data",width:"60%",onClose:f[1]||(f[1]=x=>h())},{footer:p(()=>[l("span",Ke,[r(w,{type:"primary",onClick:n,disabled:o(s).loading},{default:p(()=>[G("Submit")]),_:1},8,["disabled"]),r(w,{type:"secondary",onClick:h,disabled:o(s).loading},{default:p(()=>[G("Close")]),_:1},8,["disabled"])])]),default:p(()=>[r(se,{name:"fade"},{default:p(()=>[S.value?(P(),N(ie,{key:0,errorMessages:y.value,onResetForm:u},null,8,["errorMessages"])):j("",!0)]),_:1}),O((P(),N(o(oe),{id:"kt_filter_form",class:"row g-4 my-4"},{default:p(()=>[l("div",He,[l("div",qe,[r(R,{value:c.value.userGroupName,placeholder:"Select User Group Name | User Group Description",label:"User Group Name",name:"userGroupName",options:o(D).userGroupIdOption,onHandleChange:I},null,8,["value","options"])]),l("div",je,[r(R,{value:c.value.employeeId,placeholder:"Select Employee ID | Employee Name",label:"Employee Name",name:"employeeId",options:o(D).stateEmployeeIDFormOption,onHandleChange:E},null,8,["value","options"])])])]),_:1})),[[F,o(s).loading]])]),_:1},8,["modelValue"])),[[F,o(s).loading]])}}}),Xe={class:"row g-4 my-4"},Je={class:"col-md-6 fv-row fv-plugins-icon-container"},Qe={class:"col-md-6 fv-row fv-plugins-icon-container"},We={class:"dialog-footer"},Ze=L({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(e,{emit:a}){const t=e,d=a,s=K(),i=V(),D=X(),b=q(t,"visibility"),c=C(()=>s.formData),y=C(()=>s.errors),S=C(()=>s.isError),g=re().shape({userGroupName:z().required("User Group Name | User Group Description is mandatory"),employeeId:z().required("Employee ID | Employee Name is mandatory")}),v=()=>{E(""),I(""),n(!1)},h=(f=!1)=>{v(),s.resetState(),m(),d("handle-close",f)},E=f=>{c.value.employeeId=f},I=f=>{c.value.userGroupName=f},n=f=>{c.value.isDeleted=f},u=async()=>{m(),await g.validate(c.value,{abortEarly:!1}).catch(f=>{s.setErrors(f.errors)}),!S.value&&M("Are you sure you want to submit ?").then(async f=>{f.isConfirmed&&s.updateData(D.user.Name).then(()=>{s.isError||J("Form has been successfully submitted!","Ok").then(()=>{h(!0)})})})},m=()=>{s.setErrors([])};return(f,w)=>{const _=$("el-button"),F=$("el-dialog"),x=H("loading");return O((P(),N(F,{modelValue:b.value,"onUpdate:modelValue":w[0]||(w[0]=Z=>b.value=Z),title:"Update Data",width:"40%",onClose:w[1]||(w[1]=Z=>h())},{footer:p(()=>[l("span",We,[r(_,{type:"primary",onClick:u,disabled:o(s).loading},{default:p(()=>[G("Submit")]),_:1},8,["disabled"]),r(_,{type:"secondary",onClick:h,disabled:o(s).loading},{default:p(()=>[G("Close")]),_:1},8,["disabled"])])]),default:p(()=>[r(se,{name:"fade"},{default:p(()=>[S.value?(P(),N(ie,{key:0,errorMessages:y.value,onResetForm:m},null,8,["errorMessages"])):j("",!0)]),_:1}),r(o(oe),{id:"kt_filter_form",class:"row g-9 my-4"},{default:p(()=>[l("div",Xe,[l("div",Je,[r(R,{value:c.value.userGroupName,placeholder:"Select User Group Name | User Group Description",label:"User Group Name",name:"userGroupName",options:o(i).userGroupIdOption,onHandleChange:I},null,8,["value","options"])]),l("div",Qe,[r(R,{value:c.value.employeeId,placeholder:"Select Employee ID | Employee Name",label:"Employee Name",name:"employeeId",options:o(i).stateEmployeeIDFormOption,onHandleChange:E},null,8,["value","options"])])]),r(Pe,{value:c.value.isDeleted,label:"Is Delete",name:"isDeleted",onHandleChange:n},null,8,["value"])]),_:1})]),_:1},8,["modelValue"])),[[x,o(s).loading]])}}}),et={class:"row g-4 my-4"},tt={class:"col-md-6 fv-row fv-plugins-icon-container"},at={class:"col-md-6 fv-row fv-plugins-icon-container"},st={class:"dialog-footer"},ot=L({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(e,{emit:a}){const t=V(),d=e,s=a,i=q(d,"visibility"),D=C(()=>t.filterData),b=()=>{c(),t.resetFilter()},c=()=>{s("handle-close",!1)},y=v=>{t.setUserGroupId(v)},S=v=>{t.setEmployeeID(v)},g=()=>{const v=t.lastUsedFilterData.userGroupName!==t.filterData.userGroupName,h=t.lastUsedFilterData.employeeName!==t.filterData.employeeName;s("handle-close",v||h)};return(v,h)=>{const E=$("el-button"),I=$("el-dialog");return P(),N(I,{modelValue:i.value,"onUpdate:modelValue":h[0]||(h[0]=n=>i.value=n),title:"Filter",width:"60%",onClose:h[1]||(h[1]=n=>c())},{footer:p(()=>[l("span",st,[r(E,{type:"secondary",onClick:b},{default:p(()=>[G("Reset")]),_:1}),r(E,{type:"primary",onClick:g},{default:p(()=>[G("Filter")]),_:1})])]),default:p(()=>[l("div",et,[l("div",tt,[r(R,{value:D.value.userGroupName,placeholder:"Select User Group Name | User Group Description",label:"User Group Name",name:"userGroupName",options:o(t).userGroupIdOption,onHandleChange:y},null,8,["value","options"])]),l("div",at,[r(R,{value:D.value.employeeName,placeholder:"Select Employee ID | Employee Name",label:"Employee Name",name:"employeeName",options:o(t).employeeIDOption,onHandleChange:S},null,8,["value","options"])])])]),_:1},8,["modelValue"])}}}),le=Q({id:"UserGroupMemberBulk",state:()=>({statePagination:new T,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:e=>e.stateValidatedData,displayData:e=>e.stateDisplayData,pagination:e=>e.statePagination,bulkData:e=>e.stateBulkData,error:e=>e.stateError,isError:e=>e.stateIsError,loading:e=>e.stateLoading,uploadLoading:e=>e.stateUploadLoading,isUploaded:e=>e.stateIsUploaded},actions:{async bulkInsert(e){const a={userAccount:e,ver:"v1"};try{this.stateLoading=!0;const t=await k.post(`${Re}?${new URLSearchParams(a).toString()}`,this.stateBulkData);this.stateError=t.data.result.isError?t.data.result.message:"",this.stateIsError=t.data.result.isError}catch(t){console.log(t)}this.stateLoading=!1},async upload({userAccount:e,excelFile:a}){const t={userAccount:e,ver:"v1"},d=`${Be}?${new URLSearchParams(t).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const s=await k.postImages(d,a);s.data.statusCode==200?s.data.result.isError?(this.stateIsError=!0,this.stateError=s.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=s.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=we.some(this.stateValidatedData,{IsValid:!1}),this.setPage(1)):(this.stateIsError=s.data.result.isError,this.stateError=s.data.result.message)}catch(s){console.log(s),this.stateIsError=!0,this.stateError=s.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(e){this.pagination.totalPage=e},setDisplayData(){let e=[...this.stateValidatedData];this.stateIsSort&&(e=e.sort(Ue(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=e.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(e){this.statePagination.handleCurrentPageChange(e),this.setDisplayData()},setSort(e){this.stateIsSort=e.prop!==null,this.stateSortBy=e.prop,this.stateSortOrder=e.order,this.setPage(1)},setBulkData(e){this.stateBulkData=e},setIsUploadedState(e){this.stateIsUploaded=e},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new T,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null},async exportTemplate(){const e={ver:"v1"};try{return(await k.getBlob(`${Oe}`,"",new URLSearchParams(e).toString())).data}catch(a){console.log(a)}}}}),rt={class:"icon"},it=L({__name:"GridBulk",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},setup(e){const a=e,t=le(),d=C(()=>(a.page-1)*10+1),s=i=>{const D={prop:i.prop,order:i.order};t.setSort(D)};return(i,D)=>{const b=$("inline-svg");return P(),N(o(te),{data:a.listData,style:{width:"100%"},onSortChange:s,"empty-text":"No Data"},{default:p(()=>[r(o(U),{label:"No",width:"60",align:"center"},{default:p(c=>[l("span",null,Y(d.value+c.$index),1)]),_:1}),r(o(U),{prop:"UserGroupName",label:"User Group Name",width:"170",sortable:""}),r(o(U),{prop:"EmployeeId",label:"Employee id",width:"170",sortable:""}),r(o(U),{prop:"ValidationReason",label:"Remark","min-width":"300",sortable:""}),r(o(U),{prop:"IsValid",label:"Status",width:"100",sortable:""},{default:p(c=>[l("div",rt,[r(b,{src:c.row.IsValid?"/media/svg/tables/rows/valid-true.svg":"/media/svg/tables/rows/valid-false.svg"},null,8,["src"])])]),_:1})]),_:1},8,["data"])}}}),W=e=>(De("data-v-ec246774"),e=e(),ve(),e),nt=W(()=>l("div",{class:"text-center"},null,-1)),lt=W(()=>l("div",{class:"mb-3"},[l("span",null,[G(" Download template "),l("a",{href:"documents/MasterUserGroupMember.xlsx",target:"_blank",id:"link-download"},"here"),G(" before uploading file ")])],-1)),dt=W(()=>l("div",{class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},[l("div",{class:"d-flex align-items-center position-relative my-0 mb-2"})],-1)),ut={class:"card"},pt={class:"card-body grid-padding"},mt={class:"dialog-footer"},ct=L({__name:"UploadBulkDialog",props:{visibility:{required:!0,type:Boolean}},emits:["handle-close"],setup(e,{emit:a}){const t=e,d=a,s=X(),i=le(),D=q(t,"visibility"),b=()=>{const n=Ge(i.validatedData,u=>{const m=u;return{mdId:0,userGroupName:m.UserGroupName,employeeId:m.EmployeeId}});return Object.values(n)},c=()=>{const n=document.getElementById("link-download");n&&n.click()},y=()=>{i.validatedData.length>0?M("Cancel Upload Data?","Confirm").then(u=>{u.isConfirmed&&g()}):g()},S=async n=>{await i.upload({userAccount:s.user.Name,excelFile:n}),i.stateError&&A(i.error)},g=(n=!1)=>{i.resetState(),d("handle-close",n)},v=n=>{i.setIsUploadedState(n)},h=n=>{i.setPage(n)},E=()=>{if(i.validatedData.length<1){c();return}const n=["USER GROUP NAME","EMPLOYEE NAME","REMARK","STATUS"],u=i.validatedData.map(m=>({UserGroupName:m.UserGroupName,EmployeeId:m.EmployeeId,remark:m.ValidationReason,status:m.IsValid?"OK":"Error"}));ce("Master User Group Member",n,u)},I=async()=>{if(i.displayData.length<1){A("There is no data to submit");return}if(i.isError){A("There is still invalid row(s)");return}M("Are you sure you want to submit ?").then(async n=>{if(n.isConfirmed){const u=b();if(i.setBulkData(u),await i.bulkInsert(s.user.Name),i.isError){A(i.stateError);return}J("Form has been successfully submitted!","Ok").then(()=>{g(!0)})}})};return(n,u)=>{const m=$("el-button"),f=$("el-dialog"),w=H("loading");return P(),N(f,{title:"Upload Bulk Data",modelValue:D.value,"onUpdate:modelValue":u[1]||(u[1]=_=>D.value=_),"before-close":y,width:"70%","custom-class":"upload-modal"},{footer:p(()=>[l("div",null,[l("span",mt,[r(m,{type:"success",onClick:E},{default:p(()=>[G("Download")]),_:1}),r(m,{type:"primary",onClick:I},{default:p(()=>[G("Upload")]),_:1}),r(m,{type:"success",onClick:y},{default:p(()=>[G("Cancel")]),_:1})])])]),default:p(()=>[nt,lt,O(r(Ne,{isSubmissionUploadSuccess:o(i).isUploaded,onHandleCloseUploadedFile:y,onHandleUpload:S,onHandleSetIsExcelFileUploaded:v},null,8,["isSubmissionUploadSuccess"]),[[w,o(i).uploadLoading]]),dt,l("div",ut,[l("div",pt,[r(it,{"list-data":o(i).displayData,page:o(i).pagination.currentPage},null,8,["list-data","page"])])]),o(i).displayData.length>0?(P(),N(ee,{key:0,onRaisePageChange:u[0]||(u[0]=_=>h(_)),currentPage:o(i).pagination.currentPage,totalPage:o(i).pagination.totalPage,totalPageSize:o(i).pagination.totalPageSize,startPaginationIndex:o(i).pagination.startPaginationIndex,endPaginationIndex:o(i).pagination.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"])):j("",!0)]),_:1},8,["modelValue"])}}}),gt=$e(ct,[["__scopeId","data-v-ec246774"]]),ht={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},yt=l("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),ft={class:"d-flex justify-content-between align-items-center"},_t={class:"card"},Dt={class:"card-body grid-padding"},vt={class:"my-5"},Na=L({__name:"Index",setup(e){const a=de(),t=V(),d=K(),s=B(!1),i=B(!1),D=B(!1),b=B(!1),c=C(()=>t.displayData),y=C(()=>t.pagination),S=_=>{t.setPage(_)};be(async()=>{a[pe.ACTIVE_PAGE]("IronLake"),ue("User Group Member",[{pageName:"Ironlake",pageRoute:"ironlake"},{pageName:"Role Management",pageRoute:"ironlake-rolemanagement-usergroupmember"},{pageName:"User Group Member",pageRoute:"ironlake-rolemanagement-usergroupmember"}]),t.setPage(1),t.getEmployeeLookup(),t.getUserGroupLookup()}),Ee(async()=>{t.resetState(),d.resetState()});const g=async()=>{await t.setPage(1),t.getEmployeeLookup(),t.getUserGroupLookup()},v=()=>{s.value=!0},h=async _=>{s.value=!1,_&&await g()},E=()=>{i.value=!0},I=()=>{D.value=!0},n=async _=>{D.value=!1,_&&await g()},u=async _=>{i.value=!1,_&&await g()},m=async()=>{const _=await t.export();Ce.saveAs(new Blob([_],{type:"application/octet-stream"}),"Master Data User Group Member.xlsx")},f=()=>{b.value=!0},w=async _=>{b.value=!1,_&&await g()};return(_,F)=>(P(),ae(Ie,null,[l("div",ht,[yt,l("div",ft,[r(ge,{onShowDialog:v}),r(me,{onShowDialog:I}),r(ye,{onHandleDownload:m}),r(he,{onShowDialog:f})])]),l("div",_t,[l("div",Dt,[r(ze,{"list-data":c.value,page:y.value.currentPage,onShowDialog:E},null,8,["list-data","page"])])]),l("div",vt,[o(t).paginationLoading?j("",!0):(P(),N(ee,{key:0,onRaisePageChange:F[0]||(F[0]=x=>S(x)),currentPage:y.value.currentPage,totalPage:y.value.totalPage,totalPageSize:y.value.totalPageSize,startPaginationIndex:y.value.startPaginationIndex,endPaginationIndex:y.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),r(Ye,{visibility:s.value,onHandleClose:h},null,8,["visibility"]),r(Ze,{visibility:i.value,onHandleClose:u},null,8,["visibility"]),r(ot,{visibility:D.value,onHandleClose:n},null,8,["visibility"]),r(gt,{visibility:b.value,onHandleClose:w},null,8,["visibility"])],64))}});export{Na as default};
