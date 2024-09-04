import{u as Z}from"./useMenuStore-CD5Gmvif.js";import{k as E,r as S,a0 as K,c as P,y as L,p as F,q as k,x as h,R as I,Y as J,aB as f,s as i,B as U,u as d,A as x,T as ee,aa as R,C as $,bL as te,a7 as ae,L as se,F as re}from"./@vue-BypzYtbH.js";import{c as G,N as oe,a as ne,J as ie,I as le,A as ue}from"./index-BuVmIl8K.js";import{d as X}from"./pinia-BjOS2_Ao.js";import{a as de}from"./vee-validate-C_msoaAA.js";import{E as ce}from"./ErrorAlert-CMKGfwAi.js";import{d as pe,_ as w,b as me}from"./element-plus-BeWdvTRa.js";import{a as he}from"./breadcrumb-BYmEOf4C.js";import{P as ge}from"./Pagination-D-xfdYmn.js";import{F as fe}from"./FilterIconButton-Bj0WTbms.js";import{D as _e}from"./DownloadIconButton-CIQp-YG7.js";import{y as ye}from"./date-format-8-IvfSl3.js";import{P as q}from"./Pagination-BiobnanQ.js";import{a as De}from"./mapOption-CeGMwmH0.js";import{a as ve}from"./table-sort-Bpdq_Uwn.js";import{_ as Pe}from"./AutoComplete.vue_vue_type_style_index_0_lang-DrAAOf71.js";import{F as Fe}from"./file-saver-CwTBvle_.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./nw-img-vue-CR837WER.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./lodash-DrHMlsdo.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./language-BriOOvyN.js";import"./moment-C5S46NFB.js";const N="https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_user_group_menu",be=`${N}/user_group_menu`,Ge=`${N}/data`,Y=`${N}/usergroupmenu`,we=`${Y}/update`,Ie=`${N}/export`,Ne=`${N}/lookup`,ke=`${N}/get_menu`,j={userGroupMenuId:0,userGroupName:"",userGroupDescription:"",menu:[]},O=X({id:"userGroupMenuForm",state:()=>({stateFormData:{...j},stateInitialMenuTree:[],stateCheckedMenuIdArray:[],allMenuRaw:[],stateIsError:!1,stateError:"",stateErrors:[],stateLoading:!1,allLeafMenu:[]}),getters:{formData:e=>e.stateFormData,checkedMenuIdArray:e=>e.stateCheckedMenuIdArray,error:e=>e.stateError,errors:e=>e.stateErrors,isError:e=>e.stateIsError,loading:e=>e.stateLoading},actions:{async getCheckedMenuByGroup(e){const a={userGroupId:e,ver:"v1"};try{return(await G.get(Ge,"",new URLSearchParams(a).toString())).data.result.content[0]}catch(t){console.log(t)}},buildUserGroupMenuTree(e){const a=new Map,t=[];e.forEach(r=>{const s={menuId:r.MenuId,menuName:r.PageName,isCheck:!1,level:r.Level,subMenu:[]};if(a.set(r.MenuId,s),r.Level===0)t.push(s);else{const o=a.get(r.ParentId);o&&o.subMenu.push(s)}});const n=[];return e.forEach(r=>{a.get(r.MenuId).subMenu.length===0&&r.Level>0&&n.push(r.MenuId)}),this.allLeafMenu=n,t},async getMenu(){const e={ver:"v1"},a=await G.get(ke,"",new URLSearchParams(e).toString());this.allMenuRaw=a.data.result.content;const t=new oe(a.data.result.content);this.stateInitialMenuTree=this.buildUserGroupMenuTree(t.getAllMenu()),this.stateFormData.menu=[...this.stateInitialMenuTree]},async insertData(e){try{this.stateLoading=!0;const a={userAccount:e,ver:"v1"},t=await G.post(`${Y}?${new URLSearchParams(a).toString()}`,this.stateFormData);t.data.title==="Error"?(this.stateErrors.push(t.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(a){this.stateError=a,this.stateIsError=!0}this.stateLoading=!1},setErrors(e){this.stateErrors=e,this.stateIsError=this.stateErrors.length>0},async setFormData(e){this.stateLoading=!0;const a=await this.getCheckedMenuByGroup(e.UserGroupId);this.stateFormData.userGroupMenuId=a.userGroupId||"",this.stateFormData.userGroupName=a.userGroupName||"",this.stateFormData.userGroupDescription=a.userGroupDescription||"";const t=a.menu.filter(n=>{if(n.isCheck&&this.allLeafMenu.findIndex(s=>s==n.menuId)>=0)return n});this.stateCheckedMenuIdArray=this.extractMenuId(t),this.stateLoading=!1},extractMenuId(e){return e.map(a=>a.menuId)},resetState(){this.stateFormData={...j},this.stateFormData.menu=[...this.stateInitialMenuTree],this.stateCheckedMenuIdArray=[],this.stateIsError=!1,this.stateError="",this.stateErrors=[],this.stateLoading=!1},seperate(e,a){return e.filter(t=>{if(!a.find(r=>r==t))return t})},getNewIsCheck(e,a,t,n){return n.find(l=>l==e)||a.find(l=>l==e)?!0:(t.find(l=>l==e),!1)},buildCheckedPayload(e,a,t,n){const r=[];return e.forEach(s=>{const o=this.getNewIsCheck(s.menuId,a,t,n);s.subMenu.length>0&&this.buildCheckedPayload(s.subMenu,a,t,n),r.push({menuId:s.menuId,menuName:s.menuName,isCheck:o===!0?!0:s.isCheck,subMenu:s.subMenu.length>0?this.buildCheckedPayload(s.subMenu,a,t,n):[]})}),r},async updateData(e,a){const t=this.extractMenuId(a),n=this.seperate(t,this.stateCheckedMenuIdArray),r=this.seperate(this.stateCheckedMenuIdArray,t);try{this.stateLoading=!0;const s={userAccount:e,ver:"v1"};this.stateFormData.menu=this.buildCheckedPayload(this.stateFormData.menu,n,r,t);const o=await G.post(`${we}?${new URLSearchParams(s).toString()}`,this.stateFormData);o.data.title==="Error"?(this.stateErrors.push(o.data.result.message),this.stateIsError=!0):(this.stateError="",this.stateIsError=!1)}catch(s){this.stateErrors.push(s.response.data.result.message),this.stateIsError=!0}this.stateLoading=!1}}}),Ce={key:0},Me={class:"dialog-footer"},Se=E({__name:"FormEditDialog",props:{visibility:{type:Boolean,default:!1},roleName:{type:String,required:!1,default:"Menu"}},emits:["handle-close"],setup(e,{emit:a}){const t=e,n=a,r={label:"menuName",children:"subMenu"},s=S(),o=O(),l=ne(),D=K(t,"visibility"),y=P(()=>o.errors),b=P(()=>o.isError),g=P(()=>o.formData.menu),p=P(()=>o.checkedMenuIdArray),c=P(()=>o.loading),v=P(()=>o.formData.userGroupName),m=()=>{o.stateCheckedMenuIdArray=[]},u=()=>s.value.getCheckedNodes(!1,!0),_=(C=!1)=>{m(),o.resetState(),T(),s.value.setCheckedKeys([],!1),n("handle-close",C)},Q=async()=>{T(),ie("Are you sure you want to submit ?").then(async C=>{C.isConfirmed&&o.updateData(l.user.Name,u()).then(()=>{o.isError||le("Form has been successfully submitted!","Ok").then(()=>{_(!0)})})})},T=()=>{o.setErrors([])};return(C,M)=>{const V=I("el-button"),W=I("el-dialog"),z=J("loading");return L((F(),k(W,{modelValue:D.value,"onUpdate:modelValue":M[0]||(M[0]=H=>D.value=H),title:"Update Data",width:"40%",onClose:M[1]||(M[1]=H=>_())},{footer:h(()=>[f("span",Me,[i(V,{type:"primary",onClick:Q,disabled:d(o).loading},{default:h(()=>[U("Submit")]),_:1},8,["disabled"]),i(V,{type:"secondary",onClick:_,disabled:d(o).loading},{default:h(()=>[U("Close")]),_:1},8,["disabled"])])]),default:h(()=>[i(ee,{name:"fade"},{default:h(()=>[b.value?(F(),k(ce,{key:0,errorMessages:y.value,onResetForm:T},null,8,["errorMessages"])):x("",!0)]),_:1}),c.value?x("",!0):(F(),R("h3",Ce,$(`${v.value} Authorization`),1)),i(d(de),{id:"kt_filter_form",class:"row g-9 my-4"},{default:h(()=>[L(i(d(pe),{ref_key:"treeRef",ref:s,data:g.value,"show-checkbox":"","highlight-current":"","check-strictly":!1,indent:20,"node-key":"menuId","default-expand-all":!1,"default-checked-keys":p.value,props:r},null,8,["data","default-checked-keys"]),[[z,c.value]])]),_:1})]),_:1},8,["modelValue"])),[[z,c.value]])}}}),A={userGroupName:"",userGroupNameTo:"",ver:"v1",Page:1,PageSize:10,Order:""},B=X({id:"UserGroupMenuList",state:()=>({stateFilterData:{...A},stateLastUsedFilterData:{...A},statePageName:"usergroupmenu",stateDisplayData:[],statePagination:new q,stateLoading:!1,statePaginationLoading:!1,stateUserGroupOption:[]}),getters:{pageName:e=>e.statePageName,pagination:e=>e.statePagination,paginationLoading:e=>e.statePaginationLoading,displayData:e=>e.stateDisplayData,filterData:e=>e.stateFilterData,lastUsedFilterData:e=>e.stateLastUsedFilterData,loading:e=>e.stateLoading,userGroupOption:e=>e.stateUserGroupOption},actions:{async getData(e=!0){const a={userGroupName:this.stateFilterData.userGroupName.toString(),userGroupNameTo:this.stateFilterData.userGroupNameTo.toString(),Page:this.stateFilterData.Page.toString(),PageSize:this.stateFilterData.PageSize.toString(),Order:this.stateFilterData.Order,ver:this.stateFilterData.ver};try{e&&(this.stateLoading=!0),e||(this.stateDisplayData=[]);const t=await G.get(be,"",new URLSearchParams(a).toString());this.stateDisplayData=t.data.result.content,this.setTotalPage(t.data.result.total),this.stateLastUsedFilterData={...this.stateFilterData}}catch(t){console.log(t)}this.stateLoading=!1},async getLookup(){const e={userGroupId:"",menuId:"",order:""};try{const a=await G.post(`${Ne}?ver=v1`,e);this.stateUserGroupOption=De(a.data.result.content,"userGroupName","userGroupDesc")}catch(a){console.log(a)}},async export(){const e={userGroupName:this.stateFilterData.userGroupName.toString(),userGroupNameTo:this.stateFilterData.userGroupNameTo.toString(),Gmt:new Date().toTimeString().slice(12,17),ver:this.stateFilterData.ver};try{return(await G.postBlob(`${Ie}?ver=v1`,e)).data}catch(a){console.log(a)}},setTotalPage(e){this.pagination.totalPage=e,this.pagination.getPaginationStartIndex(),this.pagination.getPaginationLastIndex()},async setPage(e){this.statePaginationLoading=!0,this.statePagination.handleCurrentPageChange(e),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1),setTimeout(()=>{this.statePaginationLoading=!1},200)},async setSort({prop:e,order:a}){if(!e&&!a)this.stateFilterData.Order="";else{const t=a=="ascending"?"asc":"desc";this.stateFilterData.Order=`${e}_${t}`}this.statePagination.handleCurrentPageChange(1),this.stateFilterData.Page=this.statePagination.currentPage,await this.getData(!1)},setUserGroupName(e){this.stateFilterData.userGroupName=e},setUserGroupNameTo(e){this.stateFilterData.userGroupNameTo=e},async resetFilter(){this.stateFilterData.userGroupName="",this.stateFilterData.userGroupNameTo="";const e=this.stateLastUsedFilterData.userGroupName!=="",a=this.stateLastUsedFilterData.userGroupNameTo!=="";(e||a)&&await this.getData()},resetState(){this.stateFilterData={...A},this.stateDisplayData=[],this.statePagination=new q,this.stateLoading=!1,this.statePaginationLoading=!1}}}),Le={key:0,style:{height:"100px"}},Ue={class:"row justify-content-center"},Ee=["onClick"],Te=E({__name:"Grid",props:{listData:{required:!0,type:Array},page:{required:!0,type:Number,default:1}},emits:["show-dialog"],setup(e,{emit:a}){const t=e,n=B(),r=O(),s=a,o=te(()=>(t.page-1)*10+1),l=S(""),D=g=>{l.value=g.order;const p={prop:g.prop,order:g.order};n.setSort(p)},y=(g,p,c)=>ve(g[c],p[c],l.value),b=async g=>{s("show-dialog",null),await r.setFormData(g)};return(g,p)=>{const c=I("inline-svg"),v=I("el-tooltip"),m=J("loading");return d(n).loading?L((F(),R("div",Le,null,512)),[[m,d(n).loading]]):L((F(),k(d(me),{key:1,data:t.listData,style:{width:"100%"},onSortChange:D,"empty-text":"No Data"},{default:h(()=>[i(d(w),{label:"No",width:"90",align:"center"},{default:h(u=>[f("span",null,$(d(o)+u.$index),1)]),_:1}),i(d(w),{prop:"UserGroupName",label:"User Group Name",width:"300",sortable:"","sort-method":(u,_)=>y(u,_,"UserGroupName")},null,8,["sort-method"]),i(d(w),{prop:"UserGroupDesc",label:"Group Description","min-width":"170",sortable:"","sort-method":(u,_)=>y(u,_,"UserGroupDesc")},null,8,["sort-method"]),i(d(w),{prop:"ChangedOn",label:"Changed on",align:"center",width:"150",sortable:""},{default:h(u=>[f("span",null,$(d(ye)(u.row.ChangedOn)),1)]),_:1}),i(d(w),{prop:"ChangedBy",label:"Changed by",sortable:"",width:"300","sort-method":(u,_)=>y(u,_,"ChangedBy")},null,8,["sort-method"]),i(d(w),{label:"Menu Authorization",width:"200"},{default:h(u=>[f("div",Ue,[i(v,{class:"box-item",effect:"dark",content:"Show Menu",placement:"top"},{default:h(()=>[f("button",{class:"btn btn-sm btn-icon btn-bg-light me-1",onClick:_=>b(u.row)},[i(c,{src:"/media/svg/tables/rows/pencil-edit-blue.svg",width:"12",height:"12"})],8,Ee)]),_:2},1024)])]),_:1})]),_:1},8,["data"])),[[m,d(n).loading]])}}}),Ae={class:"row g-9 my-4"},xe={class:"dialog-footer"},$e=E({__name:"FilterDialog",props:{visibility:{type:Boolean,default:!1}},emits:["handle-close"],setup(e,{emit:a}){const t=B(),n=e,r=a,s=K(n,"visibility"),o=P(()=>t.filterData),l=()=>{D(),t.resetFilter()},D=()=>{r("handle-close",!1)},y=p=>{t.setUserGroupName(p)},b=p=>{t.setUserGroupNameTo(p)},g=()=>{const p=t.lastUsedFilterData.userGroupName!==t.filterData.userGroupName,c=t.lastUsedFilterData.userGroupNameTo!==t.filterData.userGroupNameTo;r("handle-close",p||c)};return(p,c)=>{const v=I("el-button"),m=I("el-dialog");return F(),k(m,{modelValue:s.value,"onUpdate:modelValue":c[0]||(c[0]=u=>s.value=u),title:"Filter",width:"60%",onClose:c[1]||(c[1]=u=>D())},{footer:h(()=>[f("span",xe,[i(v,{type:"secondary",onClick:l},{default:h(()=>[U("Reset")]),_:1}),i(v,{type:"primary",onClick:g},{default:h(()=>[U("Filter")]),_:1})])]),default:h(()=>[f("div",Ae,[i(Pe,{"value-from":o.value.userGroupName,"value-to":o.value.userGroupNameTo,label:"User Group Name",name:"userGroupName",options:d(t).userGroupOption,onHandleChangeFrom:y,onHandleChangeTo:b},null,8,["value-from","value-to","options"])])]),_:1},8,["modelValue"])}}}),Re={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},Oe=f("div",{class:"d-flex align-items-center position-relative my-0"},null,-1),Be={class:"d-flex justify-content-between align-items-center"},Ve={class:"card"},ze={class:"card-body grid-padding"},He={class:"my-5"},Rt=E({__name:"Index",setup(e){const a=Z(),t=B(),n=O(),r=S(!1),s=S(!1),o=P(()=>t.displayData),l=P(()=>t.pagination),D=m=>{t.setPage(m)};ae(async()=>{a[ue.ACTIVE_PAGE]("IronLake"),he("User Group Menu",[{pageName:"Ironlake",pageRoute:"ironlake"},{pageName:"Role Management",pageRoute:"ironlake-rolemanagement-usergroupmenu"},{pageName:"User Group Menu",pageRoute:"ironlake-rolemanagement-usergroupmenu"}]),t.setPage(1),await t.getLookup(),await n.getMenu()}),se(async()=>{t.resetState(),n.resetState()});const y=async()=>{await t.setPage(1),await t.getLookup()},b=()=>{r.value=!0},g=()=>{s.value=!0},p=async m=>{s.value=!1,m&&await y()},c=async m=>{r.value=!1,m&&await y()},v=async()=>{const m=await t.export();Fe.saveAs(new Blob([m],{type:"application/octet-stream"}),"UserGroupMenu.xlsx")};return(m,u)=>(F(),R(re,null,[f("div",Re,[Oe,f("div",Be,[i(fe,{onShowDialog:b}),i(_e,{onHandleDownload:v})])]),f("div",Ve,[f("div",ze,[i(Te,{"list-data":o.value,page:l.value.currentPage,onShowDialog:g},null,8,["list-data","page"])])]),f("div",He,[d(t).paginationLoading?x("",!0):(F(),k(ge,{key:0,onRaisePageChange:u[0]||(u[0]=_=>D(_)),currentPage:l.value.currentPage,totalPage:l.value.totalPage,totalPageSize:l.value.totalPageSize,startPaginationIndex:l.value.startPaginationIndex,endPaginationIndex:l.value.endPaginationIndex},null,8,["currentPage","totalPage","totalPageSize","startPaginationIndex","endPaginationIndex"]))]),i(Se,{visibility:s.value,onHandleClose:p},null,8,["visibility"]),i($e,{visibility:r.value,onHandleClose:c},null,8,["visibility"])],64))}});export{Rt as default};
