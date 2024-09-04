import{u as Q}from"./vuex-BbOKrtVp.js";import{a as W}from"./breadcrumb-BYmEOf4C.js";import{c as x,A as Z}from"./index-BuVmIl8K.js";import{P as ee}from"./Pagination-D-xfdYmn.js";import{F as te}from"./FilterIconButton-Bj0WTbms.js";import{D as ae}from"./DownloadIconButton-CIQp-YG7.js";import{_ as f,b as se}from"./element-plus-BeWdvTRa.js";import{P as I}from"./Pagination-BiobnanQ.js";import{d as oe}from"./pinia-BjOS2_Ao.js";import{m as F}from"./mapOption-CeGMwmH0.js";import{k as K,bL as le,r as z,u as i,y as R,p as d,aa as T,q as D,x as h,Y as ie,s as r,aB as s,C as A,b4 as re,a0 as ne,c as U,R as C,B,$ as G,F as N,a7 as pe,L as de,A as ue}from"./@vue-BypzYtbH.js";import{c as ce,a as me}from"./table-sort-Bpdq_Uwn.js";import{F as he}from"./file-saver-CwTBvle_.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./nw-img-vue-CR837WER.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./lodash-DrHMlsdo.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";const M="https://digital-bumaau-dev-apm-001.azure-api.net/amadm/api/master_data/monitoring_task_key",ke=`${M}`,ge=`${M}/export`,ye=`${M}/lookup`,L={Model:"",TaskDescription:"",TaskKey:"",PsType:"",Check:"",ver:"v1",Page:1,PageSize:10,Order:"",GroupName:"",SubGroupName:"",TaskGroupName:"",Version:""},$=oe({id:"taskKeyMonitoring",state:()=>({stateFilterData:{...L},stateLastUsedFilterData:{...L},statePageName:"company",stateDisplayData:[],statePagination:new I,stateLoading:!1,statePaginationLoading:!1,stateModelOption:[],stateTaskDescriptionOption:[],stateTaskKeyOption:[],statePsTypeOption:[],stateCheckOption:[],stateGroupNameOption:[],stateSubGroupNameOption:[],stateTaskGroupNameOption:[],stateVersionOption:[]}),getters:{pageName:e=>e.statePageName,pagination:e=>e.statePagination,displayData:e=>e.stateDisplayData,filterData:e=>e.stateFilterData,lastUsedFilterData:e=>e.stateLastUsedFilterData,loading:e=>e.stateLoading,paginationLoading:e=>e.statePaginationLoading,ModelOption:e=>e.stateModelOption,TaskDescriptionOption:e=>e.stateTaskDescriptionOption,TaskKeyOption:e=>e.stateTaskKeyOption,PsTypeOption:e=>e.statePsTypeOption,CheckOption:e=>e.stateCheckOption,GroupNameOption:e=>e.stateGroupNameOption,SubGroupNameOption:e=>e.stateSubGroupNameOption,TaskGroupNameOption:e=>e.stateTaskGroupNameOption,VersionOption:e=>e.stateVersionOption},actions:{async getData(e=!0){const l={ver:this.stateFilterData.ver},t={Model:this.stateFilterData.Model,TaskDescription:this.stateFilterData.TaskDescription,TaskKey:this.stateFilterData.TaskKey,PsType:this.stateFilterData.PsType,Check:this.stateFilterData.Check,GroupName:this.stateFilterData.GroupName,SubGroupName:this.stateFilterData.SubGroupName,TaskGroupName:this.stateFilterData.TaskGroupName,Version:this.stateFilterData.Version,Page:this.stateFilterData.Page.toString(),PageSize:this.stateFilterData.PageSize.toString(),Order:this.stateFilterData.Order};try{e&&(this.stateLoading=!0),e||(this.stateDisplayData=[]);const m=await x.post(`${ke}?${new URLSearchParams(l).toString()}`,t);this.stateDisplayData=m.data.result.content,this.setTotalPage(m.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(m){console.log(m)}this.stateLoading=!1},async getLookup(){const e={ver:this.stateFilterData.ver};try{const l=await x.get(ye,"",new URLSearchParams(e).toString());this.stateModelOption=F(l.data.result.content.model),this.stateTaskDescriptionOption=F(l.data.result.content.taskDescription),this.stateTaskKeyOption=F(l.data.result.content.taskKey),this.statePsTypeOption=F(l.data.result.content.psType),this.stateCheckOption=F(l.data.result.content.check),this.stateGroupNameOption=F(l.data.result.content.groupName),this.stateSubGroupNameOption=F(l.data.result.content.subGroupName),this.stateTaskGroupNameOption=F(l.data.result.content.taskGroupName),this.stateVersionOption=F(l.data.result.content.version)}catch(l){console.log(l)}},async export(){const e={ver:this.stateFilterData.ver},l={Model:this.stateFilterData.Model,TaskDescription:this.stateFilterData.TaskDescription,TaskKey:this.stateFilterData.TaskKey,PsType:this.stateFilterData.PsType,Check:this.stateFilterData.Check,GroupName:this.stateFilterData.GroupName,SubGroupName:this.stateFilterData.SubGroupName,TaskGroupName:this.stateFilterData.TaskGroupName,Version:this.stateFilterData.Version,Order:this.stateFilterData.Order};try{return(await x.postBlob(`${ge}?${new URLSearchParams(e).toString()}`,l)).data}catch(t){console.log(t)}},setTotalPage(e){this.pagination.totalPage=e,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(e){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(e),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:e,order:l}){if(!e&&!l)this.stateFilterData.Order="";else{const t=l=="ascending"?"asc":"desc";this.stateFilterData.Order=`${e}_${t}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1)},setModel(e){this.stateFilterData.Model=e},setTaskDescription(e){this.stateFilterData.TaskDescription=e},setTaskKey(e){this.stateFilterData.TaskKey=e},setPsType(e){this.stateFilterData.PsType=e},setCheck(e){this.stateFilterData.Check=e},setGroupName(e){this.stateFilterData.GroupName=e},setSubGroupName(e){this.stateFilterData.SubGroupName=e},setTaskGroupName(e){this.stateFilterData.TaskGroupName=e},setVersion(e){this.stateFilterData.Version=e},async resetFilter(){this.stateFilterData.Model="",this.stateFilterData.TaskDescription="",this.stateFilterData.TaskKey="",this.stateFilterData.PsType="",this.stateFilterData.Check="",this.stateFilterData.GroupName="",this.stateFilterData.SubGroupName="",this.stateFilterData.TaskGroupName="",this.stateFilterData.Version="";const e=this.stateLastUsedFilterData.Model!=="",l=this.stateLastUsedFilterData.TaskDescription!=="",t=this.stateLastUsedFilterData.TaskKey!=="",m=this.stateLastUsedFilterData.PsType!=="",S=this.stateLastUsedFilterData.Check!=="",g=this.stateLastUsedFilterData.GroupName!=="",n=this.stateLastUsedFilterData.SubGroupName!=="",y=this.stateLastUsedFilterData.TaskGroupName!=="",k=this.stateLastUsedFilterData.Version!=="";(e||l||t||m||S||g||n||y||k)&&await this.getData()},resetState(){this.stateFilterData={...L},this.stateDisplayData=[],this.statePagination=new I,this.stateLoading=!1,this.statePaginationLoading=!1}}}),De={key:0,style:{height:"100px"}},be={class:"text-white text-uppercase"},ve=K({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(e,{emit:l}){const t=e,m=$(),S=le(()=>(t.page-1)*10+1),g=z(""),n=k=>{g.value=k.order;let P=k.prop;k.prop&&(P=ce(k.prop));const b={prop:P,order:k.order};m.setSort(b)},y=(k,P,b)=>me(k[b],P[b],g.value);return(k,P)=>{const b=ie("loading");return i(m).loading?R((d(),T("div",De,null,512)),[[b,i(m).loading]]):R((d(),D(i(se),{key:1,data:t.listData,style:{width:"100%"},onSortChange:n,"empty-text":"No Data"},{default:h(()=>[r(i(f),{label:"No",width:"90",align:"center"},{default:h(o=>[s("span",null,A(i(S)+o.$index),1)]),_:1}),r(i(f),{prop:"model",label:"Model",width:"120",sortable:"","sort-method":(o,u)=>y(o,u,"model")},null,8,["sort-method"]),r(i(f),{prop:"version",label:"Version",width:"100",sortable:"","sort-method":(o,u)=>y(o,u,"version")},null,8,["sort-method"]),r(i(f),{prop:"groupName",label:"Group Name",width:"170",sortable:"","sort-method":(o,u)=>y(o,u,"groupName")},null,8,["sort-method"]),r(i(f),{prop:"subGroupName",label:"Sub Group Name",width:"170",sortable:"","sort-method":(o,u)=>y(o,u,"subGroupName")},null,8,["sort-method"]),r(i(f),{prop:"taskGroupName",label:"Task Group Name",width:"160",sortable:"","sort-method":(o,u)=>y(o,u,"taskGroupName")},null,8,["sort-method"]),r(i(f),{prop:"taskDescription",label:"Task Description","min-width":"250",sortable:"","sort-method":(o,u)=>y(o,u,"taskDescription")},null,8,["sort-method"]),r(i(f),{prop:"taskKey",label:"Task Key","min-width":"170",sortable:"","sort-method":(o,u)=>y(o,u,"taskKey")},null,8,["sort-method"]),r(i(f),{prop:"psType",label:"PS Type",width:"120",sortable:"","sort-method":(o,u)=>y(o,u,"psType")},null,8,["sort-method"]),r(i(f),{"class-name":"py-0 full-bg-cell",prop:"Check",label:"Check",align:"center",width:"150",sortable:""},{default:h(o=>[s("div",{class:re(["h-100 d-flex justify-content-center align-items-center",o.row.check=="true"?"bg-row-green":"bg-row-red"])},[s("div",be,A(o.row.check),1)],2)]),_:1})]),_:1},8,["data"])),[[b,i(m).loading]])}}}),_e={class:"row my-4"},Te={class:"col-12 col-md-6 px-0"},fe={class:"row p-0 m-0"},Ne=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Model",-1),Pe={class:"col-12 col-md-6 px-0"},Fe={class:"row p-0 m-0"},Ge=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Version",-1),Se={class:"row my"},we={class:"col-12 col-md-6 px-0"},Ce={class:"row p-0 m-0"},Ve=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Group Name",-1),Oe={class:"col-12 col-md-6 px-0"},xe={class:"row p-0 m-0"},Le=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Sub Group Name",-1),Ue={class:"row my-4"},Ke={class:"col-12 col-md-6 px-0"},Me={class:"row p-0 m-0"},$e=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Task Group Name",-1),Ie={class:"col-12 col-md-6 px-0"},Re={class:"row p-0 m-0"},Ae=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Task Description",-1),Be={class:"row my-4"},ze={class:"col-12 col-md-6 px-0"},Ee={class:"row p-0 m-0"},je=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Task Key",-1),qe={class:"col-12 col-md-6 px-0"},He={class:"row p-0 m-0"},Ye=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"PS Type",-1),Xe={class:"row my-4"},Je={class:"col-12 col-md-6 px-0"},Qe={class:"row p-0 m-0"},We=s("label",{class:"`form-label fs-6 fw-bolder 'text-dark'`"},"Check",-1),Ze={class:"dialog-footer"},et=K({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(e,{emit:l}){const t=$(),m=e,S=l,g=ne(m,"visibility"),n=U(()=>t.filterData),y=()=>{k(),t.resetFilter()},k=()=>{S("handle-close",!1)},P=c=>{t.setModel(c)},b=c=>{t.setTaskDescription(c)},o=c=>{t.setTaskKey(c)},u=c=>{t.setPsType(c)},V=c=>{t.setCheck(c)},E=c=>{t.setVersion(c)},j=c=>{t.setGroupName(c)},q=c=>{t.setSubGroupName(c)},H=c=>{t.setTaskGroupName(c)},Y=()=>{const c=t.lastUsedFilterData.Model!==t.filterData.Model,p=t.lastUsedFilterData.TaskDescription!==t.filterData.TaskDescription,v=t.lastUsedFilterData.TaskKey!==t.filterData.TaskKey,_=t.lastUsedFilterData.PsType!==t.filterData.PsType,w=t.lastUsedFilterData.Check!==t.filterData.Check,O=t.lastUsedFilterData.Version!==t.filterData.Version,a=t.lastUsedFilterData.GroupName!==t.filterData.GroupName,X=t.lastUsedFilterData.SubGroupName!==t.filterData.SubGroupName,J=t.lastUsedFilterData.TaskGroupName!==t.filterData.TaskGroupName;S("handle-close",c||p||v||_||w||O||a||X||J)};return(c,p)=>{const v=C("el-option"),_=C("el-select"),w=C("el-button"),O=C("el-dialog");return d(),D(O,{modelValue:g.value,"onUpdate:modelValue":p[9]||(p[9]=a=>g.value=a),title:"Filter",width:"60%",onClose:p[10]||(p[10]=a=>k())},{footer:h(()=>[s("span",Ze,[r(w,{type:"secondary",onClick:y},{default:h(()=>[B("Reset")]),_:1}),r(w,{type:"primary",onClick:Y},{default:h(()=>[B("Filter")]),_:1})])]),default:h(()=>[s("div",_e,[s("div",Te,[s("div",fe,[Ne,r(_,{modelValue:n.value.Model,"onUpdate:modelValue":p[0]||(p[0]=a=>n.value.Model=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:P},{default:h(()=>[(d(!0),T(N,null,G(i(t).ModelOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),s("div",Pe,[s("div",Fe,[Ge,r(_,{modelValue:n.value.Version,"onUpdate:modelValue":p[1]||(p[1]=a=>n.value.Version=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:E},{default:h(()=>[(d(!0),T(N,null,G(i(t).VersionOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])])]),s("div",Se,[s("div",we,[s("div",Ce,[Ve,r(_,{modelValue:n.value.GroupName,"onUpdate:modelValue":p[2]||(p[2]=a=>n.value.GroupName=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:j},{default:h(()=>[(d(!0),T(N,null,G(i(t).GroupNameOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),s("div",Oe,[s("div",xe,[Le,r(_,{modelValue:n.value.SubGroupName,"onUpdate:modelValue":p[3]||(p[3]=a=>n.value.SubGroupName=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:q},{default:h(()=>[(d(!0),T(N,null,G(i(t).SubGroupNameOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])])]),s("div",Ue,[s("div",Ke,[s("div",Me,[$e,r(_,{modelValue:n.value.TaskGroupName,"onUpdate:modelValue":p[4]||(p[4]=a=>n.value.TaskGroupName=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:H},{default:h(()=>[(d(!0),T(N,null,G(i(t).TaskGroupNameOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),s("div",Ie,[s("div",Re,[Ae,r(_,{modelValue:n.value.TaskDescription,"onUpdate:modelValue":p[5]||(p[5]=a=>n.value.TaskDescription=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:b},{default:h(()=>[(d(!0),T(N,null,G(i(t).TaskDescriptionOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])])]),s("div",Be,[s("div",ze,[s("div",Ee,[je,r(_,{modelValue:n.value.TaskKey,"onUpdate:modelValue":p[6]||(p[6]=a=>n.value.TaskKey=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:o},{default:h(()=>[(d(!0),T(N,null,G(i(t).TaskKeyOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),s("div",qe,[s("div",He,[Ye,r(_,{modelValue:n.value.PsType,"onUpdate:modelValue":p[7]||(p[7]=a=>n.value.PsType=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:u},{default:h(()=>[(d(!0),T(N,null,G(i(t).PsTypeOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])])]),s("div",Xe,[s("div",Je,[s("div",Qe,[We,r(_,{modelValue:n.value.Check,"onUpdate:modelValue":p[8]||(p[8]=a=>n.value.Check=a),placeholder:"Type any..",clearable:"",filterable:"",onChange:V},{default:h(()=>[(d(!0),T(N,null,G(i(t).CheckOption,a=>(d(),D(v,{key:a.value,label:a.label,value:a.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])])])]),_:1},8,["modelValue"])}}}),tt={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},at=s("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),st={class:"d-flex justify-content-between align-items-center"},ot={class:"card"},lt={class:"card-body grid-padding"},it={class:"my-5"},Qt=K({__name:"Index",setup(e){const l=Q(),t=$(),m=z(!1),S=U(()=>t.displayData),g=U(()=>t.pagination),n=o=>{t.setPage(o)};pe(async()=>{l[Z.ACTIVE_PAGE]("IronLake"),W("TaskKey Monitoring",[{pageName:"Iron Lake",pageRoute:"ironlake"},{pageName:"Report",pageRoute:"taskkeymonitoring"},{pageName:"TaskKey Monitoring",pageRoute:"taskkeymonitoring"}]),t.setPage(1),await t.getLookup()}),de(()=>{t.resetState()});const y=async()=>{await t.setPage(1),await t.getLookup()},k=()=>{m.value=!0},P=async o=>{m.value=!1,o&&await y()},b=async()=>{const o=await t.export();he.saveAs(new Blob([o],{type:"application/octet-stream"}),"TaskKey Monitoring.xlsx")};return(o,u)=>(d(),T(N,null,[s("div",tt,[at,s("div",st,[r(te,{onShowDialog:k}),r(ae,{onHandleDownload:b})])]),s("div",ot,[s("div",lt,[r(ve,{"list-data":S.value,page:g.value.currentPage},null,8,["list-data","page"])])]),s("div",it,[i(t).paginationLoading?ue("",!0):(d(),D(ee,{key:0,onRaisePageChange:u[0]||(u[0]=V=>n(V)),currentPage:g.value.currentPage,totalPage:g.value.totalPage,totalPageSize:g.value.totalPageSize,startPaginationIndex:g.value.startPaginationIndex,endPaginationIndex:g.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),r(et,{visibility:m.value,onHandleClose:P},null,8,["visibility"])],64))}});export{Qt as default};
