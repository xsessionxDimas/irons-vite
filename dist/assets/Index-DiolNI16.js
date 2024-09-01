import{u as vt}from"./vuex-BbOKrtVp.js";import{a as _t}from"./breadcrumb-D-Q4Tk9w.js";import{b as $,u as J,e as at,i as G,h as st,j,A as St}from"./index-BCnwA6yE.js";import{P as pt}from"./Pagination-CVDIvnOM.js";import{F as bt}from"./FilterIconButton-Bj0WTbms.js";import{h as yt,A as Et,U as It}from"./excel-generator-CRLIz6fw.js";import{D as wt}from"./DownloadIconButton-CIQp-YG7.js";import{_ as E,b as Dt}from"./element-plus-C5R56mia.js";import{f as O,n as A,a as z}from"./date-format-BASVuupi.js";import{P as K,d as Ft,a as Ct}from"./table-sort-VnBD5Hfa.js";import{G as kt,b as Ut,c as Lt,E as xt,C as At,U as $t,B as Ot,d as Vt}from"./urls-C50Irf23.js";import{d as ot}from"./pinia-BjOS2_Ao.js";import{a as ct}from"./mapOption-sP4IrA4W.js";import{u as Bt}from"./authentication-handler-B3K6P3Fb.js";import{k as R,bL as Rt,r as q,u as o,y as N,p as I,aa as H,q as k,x as d,Y as Q,R as L,s as e,aB as c,C as B,a0 as W,c as x,B as U,A as Z,T as mt,bd as Tt,bb as Ht,a7 as Nt,L as Mt,F as qt}from"./@vue-BypzYtbH.js";import{_ as X}from"./TextInput.vue_vue_type_script_setup_true_lang-oAh_qqu1.js";import{_ as M}from"./DatePickerInput.vue_vue_type_script_setup_true_lang-DQfguttb.js";import{_ as it}from"./SwitchInput.vue_vue_type_script_setup_true_lang-BosisL7w.js";import{a as ht}from"./vee-validate-C_msoaAA.js";import{c as gt,a as et,b as Y,d as ft}from"./yup-BRaPd8dh.js";import"./property-expr-DEi1ZLzV.js";import{E as Pt}from"./ErrorAlert-CMKGfwAi.js";import{e as zt}from"./lodash-Cr9vlq0V.js";import{_ as jt}from"./FileDropZone.vue_vue_type_style_index_0_lang-Ct77XTnP.js";import{m as Gt}from"./map-anything-abi6NY2Z.js";import{_ as Kt}from"./nw-img-vue-CR837WER.js";import{_ as ut}from"./AutoComplete.vue_vue_type_script_setup_true_lang-D4CTLiQF.js";import{F as Xt}from"./file-saver-DhbZvGod.js";import"./vue-router-iNp9kJ0K.js";import"./object-path-BACu75q6.js";import"./attr-accept-BWI1aNlo.js";import"./crypto-js-BZehCumu.js";import"./cron-Ci8nYs3o.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-N3crNZ6y.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-DK0FVkv3.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./dayjs-C7SXsQPH.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-xcxZ5rdH.js";import"./mitt-C1xD_ZTF.js";import"./@popperjs-WhmJkuoZ.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./vue-i18n-CE6bnohq.js";import"./@intlify-CjZh8qSI.js";import"./PageEnum-BoOqFyRq.js";import"./xlsx-CpbwoZfi.js";import"./moment-C5S46NFB.js";import"./nanoclone-BAWie4i9.js";import"./toposort-CalJriC0.js";import"./vue3-dropzone-DPWU9yJt.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";const nt=ot({id:"positionList",state:()=>({stateFilterData:{Position:"",PositionDescription:"",StartDate:"",EndDate:"",IsDma:null,ver:"v1",Page:1,PageSize:10,Order:""},stateLastUsedFilterData:{Position:"",PositionDescription:"",StartDate:"",EndDate:"",IsDma:null,ver:"v1",Page:1,PageSize:10,Order:""},statePageName:"position",stateDisplayData:[],statePagination:new K,stateLoading:!1,statePaginationLoading:!1,statePositionOption:[],statePositionDescOption:[]}),getters:{pageName:t=>t.statePageName,pagination:t=>t.statePagination,displayData:t=>t.stateDisplayData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,paginationLoading:t=>t.statePaginationLoading,positionOption:t=>t.statePositionOption,positionDescOption:t=>t.statePositionDescOption},actions:{async getData(t=!0){const n={Position:this.stateFilterData.Position,PositionDescription:this.stateFilterData.PositionDescription,Page:this.stateFilterData.Page.toString(),StartDate:this.stateFilterData.StartDate?O(this.stateFilterData.StartDate):"",EndDate:this.stateFilterData.EndDate?O(this.stateFilterData.EndDate):"",IsDma:this.stateFilterData.IsDma,PageSize:this.stateFilterData.PageSize.toString(),Order:this.stateFilterData.Order,ver:this.stateFilterData.ver};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const a=await $.post(`${kt}?ver=v1`,n);this.stateDisplayData=a.data.result.content,this.setTotalPage(a.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(a){console.log(a)}this.stateLoading=!1},async getLookup(){const t={ver:"v1"};try{const n=await $.post(`${Ut}?${new URLSearchParams(t).toString()}`,{});this.statePositionOption=ct(n.data.result.content.position),this.statePositionDescOption=ct(n.data.result.content.positionDescription)}catch(n){n.response.data.statusCode==401&&J().setLoggedIn(!1)}},async getPositionDMA(){const t={Position:"",PositionDescription:""};try{const a=(await $.post(`${Lt}?ver=v1`,t)).data.result.content.position.map(g=>({value:g,label:g}));await at.position.clear(),await at.position.bulkAdd(a),this.statePositionOption=a}catch(n){Bt(n)}},async setPositionDMALocal(){this.statePositionOption=await at.position.toArray()},async export(){const t={Gmt:new Date().toTimeString().slice(12,17),Position:this.stateFilterData.Position,PositionDescription:this.stateFilterData.PositionDescription,StartDate:this.stateFilterData.StartDate?O(this.stateFilterData.StartDate):"",EndDate:this.stateFilterData.EndDate?O(this.stateFilterData.EndDate):"",IsDma:this.stateFilterData.IsDma,Order:this.stateFilterData.Order};try{return(await $.postBlob(`${xt}?ver=v1`,t)).data}catch(n){console.log(n)}},setTotalPage(t){this.pagination.totalPage=t,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(t){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(t),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:t,order:n}){if(!t&&!n)this.stateFilterData.Order="";else{const a=n=="ascending"?"asc":"desc";this.stateFilterData.Order=`${t}_${a}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1)},setPosition(t){this.stateFilterData.Position=t},setPositionDescription(t){this.stateFilterData.PositionDescription=t},setStartDate(t){this.stateFilterData.StartDate=t},setEndDate(t){this.stateFilterData.EndDate=t},setIsDma(t){this.stateFilterData.IsDma=t},async resetFilter(){this.stateFilterData.Position="",this.stateFilterData.PositionDescription="",this.stateFilterData.StartDate=null,this.stateFilterData.EndDate=null,this.stateFilterData.IsDma=null;const t=this.stateLastUsedFilterData.Position!=="",n=this.stateLastUsedFilterData.PositionDescription!=="",a=this.stateLastUsedFilterData.StartDate!==null,g=this.stateLastUsedFilterData.EndDate!==null,i=this.stateLastUsedFilterData.IsDma!==null;(t||n||a||g||i)&&await this.getData()},resetState(){this.stateFilterData={Position:"",PositionDescription:"",StartDate:null,EndDate:null,IsDma:null,Page:1,PageSize:10,Order:""},this.stateDisplayData=[],this.statePagination=new K,this.stateLoading=!1,this.statePaginationLoading=!1}}}),tt=ot({id:"positionForm",state:()=>({stateFormData:{PositionId:0,StartDate:A(new Date),EndDate:A(new Date("12/31/9999")),IsDma:!1},stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1}),getters:{formData:t=>t.stateFormData,error:t=>t.stateError,errors:t=>t.stateErrors,isError:t=>t.stateIsError,loading:t=>t.stateLoading},actions:{async insertData(t){this.stateFormData.StartDate=O(A(new Date(this.stateFormData.StartDate))),this.stateFormData.EndDate=O(A(new Date(this.stateFormData.EndDate)));try{this.stateLoading=!0;const n={userAccount:t,ver:"v1"},a=await $.post(`${At}?${new URLSearchParams(n).toString()}`,this.stateFormData);a.data.title==="Error"?(this.stateErrors.push(a.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(n){this.stateErrors.push(n.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},async updateData(t){this.stateFormData.StartDate=O(A(new Date(this.stateFormData.StartDate))),this.stateFormData.EndDate=O(A(new Date(this.stateFormData.EndDate)));try{this.stateLoading=!0;const n={userAccount:t,ver:"v1"},a=await $.post(`${$t}?${new URLSearchParams(n).toString()}`,this.stateFormData);a.data.title==="Error"?(this.stateErrors.push(a.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(n){this.stateErrors.push(n.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1},setErrors(t){this.stateErrors=t,this.stateIsError=this.stateErrors.length>0},setFormData(t){this.stateFormData.PositionId=t.PositionId||0,this.stateFormData.Position=t.Position||"",this.stateFormData.PositionDescription=t.PositionDescription||"",this.stateFormData.StartDate=t.StartDate||"",this.stateFormData.EndDate=t.EndDate||"",this.stateFormData.IsDma=t.IsDma||!1},resetState(){this.stateFormData={PositionId:0,StartDate:A(new Date),EndDate:A(new Date("12/31/9999"))},this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1}}}),Yt={key:0,style:{height:"100px"}},Jt={key:0,class:"row justify-content-center"},Qt={key:1,class:"row justify-content-center"},Wt={class:"row justify-content-center"},Zt=["onClick"],ta=R({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(t,{emit:n}){const a=t,g=nt(),i=tt(),r=n,f=Rt(()=>(a.page-1)*10+1),l=q(""),h=_=>{l.value=_.order;const v={prop:_.prop,order:_.order};g.setSort(v)},S=(_,v,b)=>Ft(_[b],v[b],l.value),w=_=>{i.setFormData(_),r("show-dialog",null)};return(_,v)=>{const b=L("inline-svg"),C=L("el-tooltip"),P=Q("loading");return o(g).loading?N((I(),H("div",Yt,null,512)),[[P,o(g).loading]]):N((I(),k(o(Dt),{key:1,data:a.listData,style:{width:"100%"},onSortChange:h,"empty-text":"No Data"},{default:d(()=>[e(o(E),{label:"No",width:"90",align:"center"},{default:d(s=>[c("span",null,B(o(f)+s.$index),1)]),_:1}),e(o(E),{prop:"Position",label:"Position","min-width":"170",sortable:"","sort-method":(s,u)=>S(s,u,"Position")},null,8,["sort-method"]),e(o(E),{prop:"PositionDescription",label:"Position Desc.","min-width":"200",sortable:"","sort-method":(s,u)=>S(s,u,"PositionDescription")},null,8,["sort-method"]),e(o(E),{prop:"StartDate",label:"Start Date",width:"170",sortable:""},{default:d(s=>[c("span",null,B(o(z)(s.row.StartDate)),1)]),_:1}),e(o(E),{prop:"EndDate",label:"End Date",width:"170",sortable:""},{default:d(s=>[c("span",null,B(o(z)(s.row.EndDate)),1)]),_:1}),e(o(E),{prop:"IsDma",label:"Is DMA",width:"100",sortable:""},{default:d(s=>[s.row.IsDma?(I(),H("div",Jt,[e(b,{src:"/media/svg/tables/rows/check.svg"})])):(I(),H("div",Qt,[e(b,{src:"/media/svg/tables/rows/minus.svg"})]))]),_:1}),e(o(E),{prop:"ChangedOn",label:"Changed on",align:"center",width:"125",sortable:""},{default:d(s=>[c("span",null,B(o(z)(s.row.ChangedOn)),1)]),_:1}),e(o(E),{prop:"ChangedBy",label:"Changed by",sortable:"",width:"300","sort-method":(s,u)=>S(s,u,"ChangedBy")},null,8,["sort-method"]),e(o(E),{label:"",width:"80"},{default:d(s=>[c("div",Wt,[e(C,{class:"box-item",effect:"dark",content:"Edit",placement:"top"},{default:d(()=>[c("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:u=>w(s.row)},[e(b,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,Zt)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[P,o(g).loading]])}}}),aa={class:"dialog-footer"},ea=R({__name:"FormAddDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:n}){const a=t,g=n,i=tt(),r=J(),f=W(a,"visibility"),l=x(()=>i.formData),h=x(()=>i.errors),S=x(()=>i.isError),w=gt().shape({Position:et().required("Position is mandatory"),PositionDescription:et().required("Position Description is mandatory"),StartDate:Y().required("Start Date is mandatory").typeError("Start Date is mandatory").max(ft("EndDate"),()=>"Start Date must be less or equal than End Date").nullable().default(void 0),EndDate:Y().required("End Date is mandatory").nullable().default(void 0)}),_=()=>{b(""),C(""),s(null),u(null)},v=(m=!1)=>{D(),_(),i.resetState(),g("handle-close",m)},b=m=>{l.value.Position=m},C=m=>{l.value.PositionDescription=m},P=m=>{l.value.IsDma=m},s=m=>{l.value.StartDate=m},u=m=>{l.value.EndDate=m},p=async()=>{D(),await w.validate(l.value,{abortEarly:!1}).catch(m=>{i.setErrors(m.errors)}),!S.value&&G("Are you sure you want to submit ?").then(async m=>{m.isConfirmed&&i.insertData(r.user.Name).then(()=>{i.isError||st("Form has been successfully submitted!","Ok").then(()=>{v(!0)})})})},D=()=>{i.setErrors([])};return(m,F)=>{const y=L("el-button"),T=L("el-dialog"),V=Q("loading");return N((I(),k(T,{modelValue:f.value,"onUpdate:modelValue":F[0]||(F[0]=dt=>f.value=dt),title:"New Data",width:"40%",onClose:F[1]||(F[1]=dt=>v())},{footer:d(()=>[c("span",aa,[e(y,{type:"primary",onClick:p,disabled:o(i).loading},{default:d(()=>[U("Submit")]),_:1},8,["disabled"]),e(y,{type:"secondary",onClick:v,disabled:o(i).loading},{default:d(()=>[U("Close")]),_:1},8,["disabled"])])]),default:d(()=>[e(mt,{name:"fade"},{default:d(()=>[S.value?(I(),k(Pt,{key:0,errorMessages:h.value,onResetForm:D},null,8,["errorMessages"])):Z("",!0)]),_:1}),N((I(),k(o(ht),{id:"kt_filter_form",class:"row g-9 my-4"},{default:d(()=>[e(X,{value:l.value.Position,margin:!1,placeholder:"Add Position",label:"Position",name:"Position",max:40,onHandleChange:b},null,8,["value"]),e(X,{value:l.value.PositionDescription,placeholder:"Add Position Description",label:"Position Desc.",name:"PositionDescription",max:40,onHandleChange:C},null,8,["value"]),e(M,{value:l.value.StartDate,placeholder:"Select Start Date","grid-class":"col-md-6",label:"Start Date",name:"StartDate",onHandleChange:s},null,8,["value"]),e(M,{value:l.value.EndDate,placeholder:"Select End Date","grid-class":"col-md-6",label:"End Date",name:"EndDate",onHandleChange:u},null,8,["value"]),e(it,{value:l.value.IsDma,label:"Is DMA",name:"IsDma",onHandleChange:P},null,8,["value"])]),_:1})),[[V,o(i).loading]])]),_:1},8,["modelValue"])),[[V,o(i).loading]])}}}),sa={class:"dialog-footer"},oa=R({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:n}){const a=t,g=n,i=tt(),r=J(),f=W(a,"visibility"),l=x(()=>i.formData),h=x(()=>i.errors),S=x(()=>i.isError),w=gt().shape({PositionDescription:et().required("Position Description is mandatory"),StartDate:Y().required("Start Date is mandatory").typeError("Start Date is mandatory").max(ft("EndDate"),()=>"Start Date must be less or equal than End Date").nullable().default(void 0),EndDate:Y().required("End Date is mandatory").nullable().default(void 0)}),_=()=>{l.value.PositionId=0,l.value.Position="",l.value.PositionDescription="",l.value.StartDate=null,l.value.EndDate=null},v=(D=!1)=>{_(),i.resetState(),p(),g("handle-close",D)},b=D=>{l.value.PositionDescription=D},C=D=>{l.value.IsDma=D},P=D=>{l.value.StartDate=D},s=D=>{l.value.EndDate=D},u=async()=>{p(),await w.validate(l.value,{abortEarly:!1}).catch(D=>{i.setErrors(D.errors)}),!S.value&&G("Are you sure you want to submit ?").then(async D=>{D.isConfirmed&&i.updateData(r.user.Name).then(()=>{i.isError||st("Form has been successfully submitted!","Ok").then(()=>{v(!0)})})})},p=()=>{i.setErrors([])};return(D,m)=>{const F=L("el-button"),y=L("el-dialog"),T=Q("loading");return N((I(),k(y,{modelValue:f.value,"onUpdate:modelValue":m[0]||(m[0]=V=>f.value=V),title:"Update Data",width:"40%",onClose:m[1]||(m[1]=V=>v())},{footer:d(()=>[c("span",sa,[e(F,{type:"primary",onClick:u,disabled:o(i).loading},{default:d(()=>[U("Submit")]),_:1},8,["disabled"]),e(F,{type:"secondary",onClick:v,disabled:o(i).loading},{default:d(()=>[U("Close")]),_:1},8,["disabled"])])]),default:d(()=>[e(mt,{name:"fade"},{default:d(()=>[S.value?(I(),k(Pt,{key:0,errorMessages:h.value,onResetForm:p},null,8,["errorMessages"])):Z("",!0)]),_:1}),e(o(ht),{id:"kt_filter_form",class:"row g-9 my-4"},{default:d(()=>[e(X,{value:l.value.Position,margin:!1,placeholder:"Add Position",label:"Position",name:"Position",max:25,disabled:!0},null,8,["value"]),e(X,{value:l.value.PositionDescription,margin:!1,placeholder:"Add Position Description",label:"Position Desc.",name:"PositionDescription",max:40,onHandleChange:b},null,8,["value"]),e(M,{value:l.value.StartDate,placeholder:"Select Start Date","grid-class":"col-md-6",label:"Start Date",name:"StartDate",onHandleChange:P},null,8,["value"]),e(M,{value:l.value.EndDate,placeholder:"Select End Date","grid-class":"col-md-6",label:"End Date",name:"EndDate",onHandleChange:s},null,8,["value"]),e(it,{value:l.value.IsDma,label:"Is DMA",name:"IsDma",onHandleChange:C},null,8,["value"])]),_:1})]),_:1},8,["modelValue"])),[[T,o(i).loading]])}}}),rt=ot({id:"positionBulk",state:()=>({statePagination:new K,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkInsert(t){const n={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const a=await $.post(`${Ot}?${new URLSearchParams(n).toString()}`,this.stateBulkData);this.stateError=a.data.result.isError?a.data.result.message:"",this.stateIsError=a.data.result.isError}catch(a){console.log(a)}this.stateLoading=!1},async upload({userAccount:t,excelFile:n}){const a={userAccount:t,ver:"v1"},g=`${Vt}?${new URLSearchParams(a).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const i=await $.postImages(g,n);i.data.statusCode==200?i.data.result.isError?(this.stateIsError=!0,this.stateError=i.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=i.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=zt.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=i.data.result.isError,this.stateError=i.data.result.message)}catch(i){console.log(i),this.stateIsError=!0,this.stateError=i.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort(Ct(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new K,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}}),ia={key:0,class:"row justify-content-center"},na={key:1,class:"row justify-content-center"},ra={class:"icon"},la=R({__name:"GridBulk",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},setup(t){const n=t,a=rt(),g=x(()=>(n.page-1)*10+1),i=r=>{const f={prop:r.prop,order:r.order};a.setSort(f)};return(r,f)=>{const l=L("inline-svg");return I(),k(o(Dt),{data:n.listData,style:{width:"100%"},onSortChange:i,"empty-text":"No Data"},{default:d(()=>[e(o(E),{label:"No",width:"60",align:"center"},{default:d(h=>[c("span",null,B(g.value+h.$index),1)]),_:1}),e(o(E),{prop:"Position",label:"Position",sortable:""}),e(o(E),{prop:"PositionDescription",label:"Position Desc.",sortable:""}),e(o(E),{prop:"StartDate",label:"Start Date",width:"110",sortable:""},{default:d(h=>[c("span",null,B(o(z)(h.row.StartDate)),1)]),_:1}),e(o(E),{prop:"EndDate",label:"End Date",width:"110",sortable:""},{default:d(h=>[c("span",null,B(o(z)(h.row.EndDate)),1)]),_:1}),e(o(E),{prop:"IsDma",label:"Is DMA",width:"100",sortable:""},{default:d(h=>[h.row.IsDma?(I(),H("div",ia,[e(l,{src:"/media/svg/tables/rows/check.svg"})])):(I(),H("div",na,[e(l,{src:"/media/svg/tables/rows/minus.svg"})]))]),_:1}),e(o(E),{prop:"ValidationReason",label:"Remark","min-width":"300",sortable:""}),e(o(E),{prop:"IsValid",label:"Status",width:"100",sortable:""},{default:d(h=>[c("div",ra,[e(l,{src:h.row.IsValid?"/media/svg/tables/rows/valid-true.svg":"/media/svg/tables/rows/valid-false.svg"},null,8,["src"])])]),_:1})]),_:1},8,["data"])}}}),lt=t=>(Tt("data-v-33018fd1"),t=t(),Ht(),t),da=lt(()=>c("div",{class:"text-center"},null,-1)),ca=lt(()=>c("div",{class:"mb-3"},[c("span",null,[U(" Download template "),c("a",{href:"documents/MasterDataPosition.xlsx",target:"_blank",id:"link-download"},"here"),U(" before uploading file ")])],-1)),ua=lt(()=>c("div",{class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},[c("div",{class:"d-flex align-items-center position-relative my-0 mb-2"})],-1)),pa={class:"card"},Da={class:"card-body grid-padding"},ma={class:"dialog-footer"},ha=R({__name:"UploadBulkDialog",props:{visibility:{required:!0,type:Boolean}},emits:["handle-close"],setup(t,{emit:n}){const a=t,g=n,i=J(),r=rt(),f=W(a,"visibility"),l=()=>{const s=Gt(r.validatedData,u=>{const p=u;return{PositionId:0,Position:p.Position,PositionDescription:p.PositionDescription,StartDate:p.StartDate,EndDate:p.EndDate,IsDma:p.IsDma}});return Object.values(s)},h=()=>{const s=document.getElementById("link-download");s&&s.click()},S=()=>{r.validatedData.length>0?G("Cancel Upload Data?","Confirm").then(u=>{u.isConfirmed&&_()}):_()},w=async s=>{await r.upload({userAccount:i.user.Name,excelFile:s}),r.stateError&&j(r.error)},_=(s=!1)=>{r.resetState(),g("handle-close",s)},v=s=>{r.setIsUploadedState(s)},b=s=>{r.setPage(s)},C=()=>{if(r.validatedData.length<1){h();return}const s=["POSITION","POSITION DESC","START DATE","END DATE","IS DMA","REMARK","STATUS"],u=r.validatedData.map(p=>({position:p.Position,positionDescription:p.PositionDescription,startDate:p.StartDate,endDate:p.EndDate,IsDma:String(p.IsDma),remark:p.ValidationReason,status:p.IsValid?"OK":"Error"}));yt("Position",s,u)},P=async()=>{if(r.displayData.length<1){j("There is no data to submit");return}if(r.isError){j("There is still invalid row(s)");return}G("Are you sure you want to submit ?").then(async s=>{if(s.isConfirmed){const u=l();if(r.setBulkData(u),await r.bulkInsert(i.user.Name),r.isError){j(r.stateError);return}st("Form has been successfully submitted!","Ok").then(()=>{_(!0)})}})};return(s,u)=>{const p=L("el-button"),D=L("el-dialog"),m=Q("loading");return I(),k(D,{title:"Upload Bulk Data",modelValue:f.value,"onUpdate:modelValue":u[1]||(u[1]=F=>f.value=F),"before-close":S,width:"70%","custom-class":"upload-modal"},{footer:d(()=>[c("div",null,[c("span",ma,[e(p,{type:"success",onClick:C},{default:d(()=>[U("Download")]),_:1}),e(p,{type:"primary",onClick:P},{default:d(()=>[U("Upload")]),_:1}),e(p,{type:"success",onClick:S},{default:d(()=>[U("Cancel")]),_:1})])])]),default:d(()=>[da,ca,N(e(jt,{isSubmissionUploadSuccess:o(r).isUploaded,onHandleCloseUploadedFile:S,onHandleUpload:w,onHandleSetIsExcelFileUploaded:v},null,8,["isSubmissionUploadSuccess"]),[[m,o(r).uploadLoading]]),ua,c("div",pa,[c("div",Da,[e(la,{"list-data":o(r).displayData,page:o(r).pagination.currentPage},null,8,["list-data","page"])])]),o(r).displayData.length>0?(I(),k(pt,{key:0,onRaisePageChange:u[0]||(u[0]=F=>b(F)),currentPage:o(r).pagination.currentPage,totalPage:o(r).pagination.totalPage,totalPageSize:o(r).pagination.totalPageSize,startPaginationIndex:o(r).pagination.startPaginationIndex,endPaginationIndex:o(r).pagination.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"])):Z("",!0)]),_:1},8,["modelValue"])}}}),ga=Kt(ha,[["__scopeId","data-v-33018fd1"]]),fa={class:"row g-9 my-4"},Pa={class:"col-md-6 fv-row fv-plugins-icon-container"},va={class:"col-md-6 fv-row fv-plugins-icon-container"},_a={class:"dialog-footer"},Sa=R({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(t,{emit:n}){const a=nt(),g=t,i=n,r=W(g,"visibility"),f=x(()=>a.filterData),l=()=>{h(),a.resetFilter()},h=()=>{i("handle-close",!1)},S=P=>{a.setPosition(P)},w=P=>{a.setPositionDescription(P)},_=P=>{a.setStartDate(P)},v=P=>{a.setEndDate(P)},b=P=>{a.setIsDma(P)},C=()=>{const P=a.lastUsedFilterData.Position!==a.filterData.Position,s=a.lastUsedFilterData.PositionDescription!==a.filterData.PositionDescription,u=a.lastUsedFilterData.StartDate!==a.filterData.StartDate,p=a.lastUsedFilterData.EndDate!==a.filterData.EndDate,D=a.lastUsedFilterData.IsDma!==a.filterData.IsDma;i("handle-close",P||s||u||p||D)};return(P,s)=>{const u=L("el-button"),p=L("el-dialog");return I(),k(p,{modelValue:r.value,"onUpdate:modelValue":s[0]||(s[0]=D=>r.value=D),title:"Filter",width:"60%",onClose:s[1]||(s[1]=D=>h())},{footer:d(()=>[c("span",_a,[e(u,{type:"secondary",onClick:l},{default:d(()=>[U("Reset")]),_:1}),e(u,{type:"primary",onClick:C},{default:d(()=>[U("Filter")]),_:1})])]),default:d(()=>[c("div",fa,[c("div",Pa,[e(ut,{value:f.value.Position,label:"Position",name:"Position",options:o(a).positionOption,onHandleChange:S},null,8,["value","options"])]),c("div",va,[e(ut,{value:f.value.PositionDescription,label:"Position Description",name:"PositionDescription",options:o(a).positionDescOption,onHandleChange:w},null,8,["value","options"])]),e(M,{value:f.value.StartDate,placeholder:"Select Start Date","grid-class":"col-md-6",label:"Start Date",name:"StartDate",onHandleChange:_},null,8,["value"]),e(M,{value:f.value.EndDate,placeholder:"Select End Date","grid-class":"col-md-6",label:"End Date",name:"EndDate",onHandleChange:v},null,8,["value"]),e(it,{value:f.value.IsDma,label:"Is DMA",name:"IsDma",onHandleChange:b},null,8,["value"])])]),_:1},8,["modelValue"])}}}),ba={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},ya=c("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),Ea={class:"d-flex justify-content-between align-items-center"},Ia={class:"card"},wa={class:"card-body grid-padding"},Fa={class:"my-5"},$e=R({__name:"Index",setup(t){const n=vt(),a=nt(),g=tt(),i=rt(),r=q(!1),f=q(!1),l=q(!1),h=q(!1),S=x(()=>a.displayData),w=x(()=>a.pagination),_=y=>{a.setPage(y)};Nt(async()=>{n.dispatch(St.ACTIVE_PAGE,"IronLake"),_t("Position",[{pageName:"Ironlake",pageRoute:"ironlake"},{pageName:"Organization Unit",pageRoute:"ironlake-organization-unit-position"},{pageName:"Position",pageRoute:"ironlake-organization-unit-position"}]),a.setPage(1),await a.getLookup()}),Mt(async()=>{a.resetState(),g.resetState(),i.resetState()});const v=async()=>{await a.setPage(1),await a.getLookup()},b=()=>{r.value=!0},C=async y=>{r.value=!1,y&&await v()},P=()=>{f.value=!0},s=async y=>{f.value=!1,y&&await v()},u=()=>{l.value=!0},p=async y=>{l.value=!1,y&&await v()},D=async()=>{const y=await a.export();Xt.saveAs(new Blob([y],{type:"application/octet-stream"}),"Position.xlsx")},m=()=>{h.value=!0},F=async y=>{h.value=!1,y&&await v()};return(y,T)=>(I(),H(qt,null,[c("div",ba,[ya,c("div",Ea,[e(Et,{onShowDialog:b}),e(bt,{onShowDialog:u}),e(wt,{onHandleDownload:D}),e(It,{onShowDialog:m})])]),c("div",Ia,[c("div",wa,[e(ta,{"list-data":S.value,page:w.value.currentPage,onShowDialog:P},null,8,["list-data","page"])])]),c("div",Fa,[o(a).paginationLoading?Z("",!0):(I(),k(pt,{key:0,onRaisePageChange:T[0]||(T[0]=V=>_(V)),currentPage:w.value.currentPage,totalPage:w.value.totalPage,totalPageSize:w.value.totalPageSize,startPaginationIndex:w.value.startPaginationIndex,endPaginationIndex:w.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),e(ea,{visibility:r.value,onHandleClose:C},null,8,["visibility"]),e(oa,{visibility:f.value,onHandleClose:s},null,8,["visibility"]),e(Sa,{visibility:l.value,onHandleClose:p},null,8,["visibility"]),e(ga,{visibility:h.value,onHandleClose:F},null,8,["visibility"])],64))}});export{$e as default};
