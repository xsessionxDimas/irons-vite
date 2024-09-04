import{_ as H}from"./logo-whitebg-DE6C9hWQ.js";import{k as b,r as h,c as v,p as i,aa as m,aB as l,b4 as f,A as g,C as $,b6 as S,y as x,a5 as U,z as E,F as N,$ as R,R as B,q as I,s as w,a0 as q,o as P,d as D,u as A,a7 as z,L as F,bd as O,bb as j}from"./@vue-BypzYtbH.js";import{u as G}from"./vue-router-iNp9kJ0K.js";import{u as J}from"./authentication-handler-Pueb_EI7.js";import{c as L,s as K}from"./index-BuVmIl8K.js";import{e as y}from"./lodash-DrHMlsdo.js";import{d as Q}from"./pinia-BjOS2_Ao.js";import{_ as M}from"./nw-img-vue-CR837WER.js";import{V as W}from"./vue-pdf-embed-Dz5iqfb8.js";import{n as X}from"./navigator-D5io2Cca.js";import{a as Y}from"./element-plus-BeWdvTRa.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./vue-BzYgrL08.js";const Z="https://digital-bumaau-dev-apm-001.azure-api.net/ehms/api/version_history/side_menu",C=Q({id:"versionHistory",state:()=>({stateTreeData:{menuName:"IronPortal Version History",icon:"",subMenu:[]},stateListLoading:!1,stateMenuVersionHistory:[],stateSelectedMenu:{},stateSearchString:"",stateDefaultTree:{menuName:"IronPortal Version History",icon:"fa fa-code-merge",subMenu:[]},stateDefaultSelectedMenu:{}}),getters:{selectedMenu:e=>e.stateSelectedMenu,searchString:e=>e.stateSearchString,loading:e=>e.stateListLoading},actions:{async convertResponseToTreeData(e){this.stateTreeData=y.cloneDeep(this.stateDefaultTree),e.forEach((t,s)=>{s==0?t.collapsible=!0:t.collapsible=!1,t.icon="far fa-dot-circle",t.subMenu&&(t.subMenu.forEach(a=>{a.icon="fa fa-circle"}),t.subMenu=t.subMenu.sort((a,o)=>a.sequence-o.sequence)),this.stateTreeData.subMenu&&this.stateTreeData.subMenu.push(t)})},setSelectedMenu(e){this.stateSelectedMenu=e},async getMenuVersionHistory(){this.stateListLoading=!0;const e={ver:"v1"};try{const t=await L.get(Z,"",new URLSearchParams(e).toString());await this.convertResponseToTreeData(t.data.result.content),this.stateMenuVersionHistory=this.stateTreeData.subMenu,this.setInit()}catch(t){J(t),K("IRONS",t),console.log(t)}finally{this.stateListLoading=!1}},setInit(){var e;(e=this.stateMenuVersionHistory[0])!=null&&e.subMenu[0]&&this.setSelectedMenu(this.stateMenuVersionHistory[0].subMenu[0])},setCollapse(e){var t;(t=this.stateTreeData.subMenu)==null||t.forEach(s=>{s.menuName==e&&(s.collapsible=!s.collapsible)})},setSearchMenu(e){this.stateSearchString=e,e==""?this.stateTreeData.subMenu=this.stateMenuVersionHistory:this.stateTreeData.subMenu=y.cloneDeep(this.stateMenuVersionHistory).filter(t=>t.menuName.toLowerCase().includes(e.toLowerCase()))},resetInstance(){this.stateTreeData=y.cloneDeep(this.stateDefaultTree),this.stateListLoading=!1,this.stateMenuVersionHistory=[],this.stateSelectedMenu=this.stateDefaultSelectedMenu,this.stateSearchString=""}}}),ee={class:"left",style:{"white-space":"nowrap",overflow:"hidden","text-overflow":"ellipsis"}},te={class:"d-flex justify-content-center"},se=b({__name:"MenuItem",props:{subMenu:{type:Array,required:!0},data:{type:Object,required:!0},depth:{type:Number,required:!0}},setup(e){G();const t=C(),s=h(!0),a=h(),o=v(()=>t.selectedMenu),d=v({get:()=>t.searchString,set:n=>{t.setSearchMenu(n)}}),p=n=>{if(n.subMenu){t.setCollapse(n.menuName);return}t.setSelectedMenu(n)};return(n,u)=>{const c=B("menu-item",!0);return i(),m("div",{class:f(["menu-item pointer position-relative",{opened:s.value}]),style:S([e.depth==0?"height: calc(100vh - 40px);overflow: auto;":""])},[l("div",{class:f(["label",{link:e.depth==2,active:e.data.menuName==o.value.menuName&&e.data.versionHistoryId==o.value.versionHistoryId}]),onClick:u[0]||(u[0]=r=>p(e.data)),style:S({paddingLeft:e.depth*20+20+"px"})},[l("div",ee,[e.data.icon?(i(),m("em",{key:0,class:f(e.data.icon)},null,2)):g("",!0),l("span",{style:{"white-space":"nowrap",overflow:"hidden","text-overflow":"ellipsis"},class:f({bold:e.depth==0})},$(e.data.menuName),3)])],6),l("div",te,[e.depth==0?x((i(),m("input",{key:0,type:"text",style:{width:"90%",background:"white"},class:"form-control form-control-solid rounded search-placeholder-label",placeholder:"Search","onUpdate:modelValue":u[1]||(u[1]=r=>d.value=r)},null,512)),[[U,d.value]]):g("",!0)]),x(l("div",{class:"items-container",style:{height:"fit-content",overflow:"visible"},ref_key:"container",ref:a},[(i(!0),m(N,null,R(e.subMenu,(r,_)=>(i(),I(c,{key:_,subMenu:r.subMenu||[],data:r,depth:e.depth+1},null,8,["subMenu","data","depth"]))),128))],512),[[E,e.depth==0||e.data.collapsible]])],6)}}}),ae=M(se,[["__scopeId","data-v-87c065b2"]]),oe={class:"menu overflow-auto"},re=b({__name:"Menu",props:{dataMenu:{required:!0,type:Object}},setup(e){return(t,s)=>(i(),m("div",oe,[w(ae,{data:e.dataMenu,subMenu:e.dataMenu.subMenu,depth:0},null,8,["data","subMenu"])]))}}),ne=M(re,[["__scopeId","data-v-c2d27ea6"]]),ie={class:"version-wrapper overflow-auto"},le=b({__name:"Content",props:{blobUrl:{type:String,required:!0}},setup(e){const t=e,s=h(""),a=h(!0),o=q(t,"blobUrl"),d=h(""),p=h(!1),n=c=>{c.preventDefault()},u=async()=>{if(s.value="",a.value=!0,p.value=!1,o.value){const c=`ver=v1&fileUrl=${o.value}`;try{const r=`https://digital-bumaau-dev-apm-001.azure-api.net/utility/api/master_attachment/download_by_url?${c}`,T=(await L.getBlob(r)).data,k=new Blob([T]),V=window.URL||window.webkitURL;s.value=V.createObjectURL(k)}catch(r){console.log("error show pdf",r),p.value=!0,o.value.includes("#")?d.value="PDF not yet attached":d.value=`${r}`}}a.value=!1};return P(async()=>{await u()}),D([o.value],c=>{c&&u()}),D(()=>t.blobUrl,()=>{u()}),(c,r)=>(i(),m("div",ie,[a.value?g("",!0):(i(),I(A(W),{key:0,onClick:n,source:s.value,class:"w-100 h-100",annotationLayer:!0},null,8,["source"]))]))}}),ue=M(le,[["__scopeId","data-v-62dce7e8"]]),ce=e=>(O("data-v-8e72fa54"),e=e(),j(),e),de={class:"full-page d-flex overflow-hidden vh-100"},pe={style:{width:"300px","border-right":"1px solid #ECECEC"}},me=ce(()=>l("img",{style:{cursor:"pointer"},src:H,alt:"",class:"h-40px logo"},null,-1)),he=[me],fe={class:"d-flex flex-fill p-10"},ve=b({__name:"Index",setup(e){const{redirectByName:t}=X(),s=C(),a=v(()=>s.stateTreeData),o=v(()=>s.selectedMenu.fileUrl),d=()=>{t("ironportal")};return z(async()=>{const p=Y.service({lock:!0,text:"Loading the page",background:"rgba(0, 0, 0, 0.7)"});await s.getMenuVersionHistory(),p.close()}),F(()=>{s.resetInstance()}),(p,n)=>(i(),m("div",de,[l("div",pe,[l("div",{class:"logo-wrapper d-flex align-items-center ms-1",onClick:d},he),w(ne,{"data-menu":a.value},null,8,["data-menu"])]),l("div",fe,[w(ue,{"blob-url":o.value},null,8,["blob-url"])])]))}}),st=M(ve,[["__scopeId","data-v-8e72fa54"]]);export{st as default};
