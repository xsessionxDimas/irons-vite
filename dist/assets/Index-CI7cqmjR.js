import{a as q}from"./breadcrumb-BYmEOf4C.js";import{c as g,s as y,z as M,A as $}from"./index-BuVmIl8K.js";import{u as I}from"./vuex-BbOKrtVp.js";import{a as w}from"./element-plus-BeWdvTRa.js";import{d as R}from"./pinia-BjOS2_Ao.js";import{L as x}from"./urls-DzqKjzQ_.js";import{c as U}from"./urls-B0Rq9QQ3.js";import{L as b}from"./urls-CJuEKIR0.js";import{L as A}from"./urls-DBLs_wGY.js";import{a as P,m as F}from"./mapOption-CeGMwmH0.js";import{u as D}from"./authentication-handler-Pueb_EI7.js";import{k as S,bL as O,p as d,aa as u,aB as p,s as c,u as r,x as C,R as N,B,A as H,$ as V,F as j,C as m,c as K,L as G,a7 as z}from"./@vue-BypzYtbH.js";import{_ as f}from"./AutoComplete.vue_vue_type_script_setup_true_lang-DJ43pGTI.js";import{x as Y}from"./date-format-8-IvfSl3.js";import{_ as E}from"./nw-img-vue-CR837WER.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./dayjs-D0x2Df_K.js";import"./lodash-DrHMlsdo.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./moment-C5S46NFB.js";const J="https://digital-bumaau-dev-apm-001.azure-api.net/amadm/api/master_data/daily_schedule/adm_history",v=R({id:"historicalEformDmaList",state:()=>({statePageName:"historicalEformDma",stateFilterData:{Site:"",Model:"",Equipment:"",PsType:"",ver:"v1"},stateLastUsedFilterData:{Site:"",Model:"",Equipment:"",PsType:"",ver:"v1"},stateDisplayData:[],stateLoading:!1,stateSiteOptions:[],stateModelOptions:[],stateEquipmentOptions:[],statePsTypeOptions:[]}),getters:{pageName:t=>t.statePageName,displayData:t=>t.stateDisplayData,filterData:t=>t.stateFilterData,lastUsedFilterData:t=>t.stateLastUsedFilterData,loading:t=>t.stateLoading,siteOptions:t=>t.stateSiteOptions,modelOptions:t=>t.stateModelOptions,equipmentOptions:t=>t.stateEquipmentOptions,psTypeOptions:t=>t.statePsTypeOptions},actions:{async getData(t=!0){const e={Site:this.stateFilterData.Site,Model:this.stateFilterData.Model,Equipment:this.stateFilterData.Equipment,PsType:this.stateFilterData.PsType,ver:this.stateFilterData.ver};try{t&&(this.stateLoading=!0),t||(this.stateDisplayData=[]);const a=await g.get(J,"",new URLSearchParams(e).toString());this.stateDisplayData=a.data.result.content,this.stateLastUsedFilterData={...this.stateFilterData}}catch(a){D(a),y("IRONS",a),console.log(a)}this.stateLoading=!1},async getLookupSite(){const t={ver:this.stateFilterData.ver};try{const e=await g.get(`${x}?${new URLSearchParams(t).toString()}`);this.stateSiteOptions=P(e.data.result.content,"siteId","siteDescription")}catch(e){D(e),y("IRONS",e),console.log(e)}},async getLookupPsType(){const t={ver:this.stateFilterData.ver};try{const e=await g.get(`${U}?${new URLSearchParams(t).toString()}`);this.statePsTypeOptions=F(e.data.result.content.psType)}catch(e){D(e),y("IRONS",e),console.log(e)}},async getLookupEquipment(){const t={ver:this.stateFilterData.ver};try{const e=await g.get(`${b}?${new URLSearchParams(t).toString()}`);this.stateEquipmentOptions=F(e.data.result.content.equipment)}catch(e){D(e),y("IRONS",e),console.log(e)}},async getLookupModel(){const t={ver:this.stateFilterData.ver};try{const e=await g.get(`${A}?${new URLSearchParams(t).toString()}`);this.stateModelOptions=P(e.data.result.content,"equipmentModel","equipmentModelDescription")}catch(e){D(e),y("IRONS",e),console.log(e)}},setSite(t){this.stateFilterData.Site=t},setModel(t){this.stateFilterData.Model=t},setEquipment(t){this.stateFilterData.Equipment=t},setPsType(t){this.stateFilterData.PsType=t},resetState(){this.stateFilterData.Site="",this.stateFilterData.Model="",this.stateFilterData.Equipment="",this.stateFilterData.PsType="",this.stateDisplayData=[],this.stateLoading=!1}}}),Q={class:"grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center"},W={class:"d-flex justify-content-between align-items-center"},X={class:"me-3"},Z={class:"me-3"},tt={class:"me-3"},et={class:"me-3"},at={class:"d-flex justify-content-between align-items-center"},st=S({__name:"Filter",emits:["handleFetch"],setup(t,{emit:e}){const a=e,s=v(),o=O(()=>s.filterData),h=i=>{s.setSite(i)},l=i=>{s.setModel(i)},_=i=>{s.setEquipment(i)},L=i=>{s.setPsType(i)},n=()=>{o.value.Site||o.value.Equipment||o.value.Model||o.value.PsType?a("handleFetch"):M("Must fill one of the filter")};return(i,k)=>{const T=N("el-button");return d(),u("div",Q,[p("div",W,[p("div",X,[c(f,{value:r(o).Site,label:"Site",name:"",options:r(s).siteOptions,onHandleChange:h},null,8,["value","options"])]),p("div",Z,[c(f,{value:r(o).Model,label:"Model",name:"",options:r(s).modelOptions,onHandleChange:l},null,8,["value","options"])]),p("div",tt,[c(f,{value:r(o).Equipment,label:"Equipment",name:"",options:r(s).equipmentOptions,onHandleChange:_},null,8,["value","options"])]),p("div",et,[c(f,{value:r(o).PsType,label:"PS Type",name:"",options:r(s).psTypeOptions,onHandleChange:L},null,8,["value","options"])])]),p("div",at,[c(T,{type:"primary",onClick:n},{default:C(()=>[B("Generate")]),_:1})])])}}}),ot={key:0,class:"row py-10 px-2 my-10 justify-content-center text-center"},it={key:0,style:{color:"#919EAB"}},rt=["onClick"],nt={class:"col item__desc"},pt={class:"col-3 col-md-2 item__timestamp"},lt=S({__name:"ListItem",props:{listData:{required:!0,type:Array}},emits:["handleClick"],setup(t,{emit:e}){const a=t,s=e,o=v(),h=O(()=>o.loading),l=_=>{s("handleClick",_)};return(_,L)=>a.listData&&a.listData.length<1?(d(),u("div",ot,[r(h)?H("",!0):(d(),u("h5",it,"No Data to Display"))])):(d(!0),u(j,{key:1},V(a.listData,(n,i)=>(d(),u("div",{key:n.dailyScheduleId,class:"row p-3 m-3 bg-light rounded list-item pointer-cursor",onClick:k=>l(n)},[p("div",nt,m(i+1)+". e-form "+m(n.brand)+" "+m(n.equipmentModel)+" Dump Truck "+m(n.psType)+" Hr Service "+m(n.unitNumber),1),p("div",pt,m(r(Y)(n.dateService)),1)],8,rt))),128))}}),ct=E(lt,[["__scopeId","data-v-1386c975"]]),mt={class:"row m-0 p-5 bg-white"},dt=S({__name:"Index",setup(t){const e=I(),a=v(),s=K(()=>a.displayData),o=async()=>{const l=w.service({lock:!0,text:"Fetching List",background:"rgba(0, 0, 0, 0.7)"});await a.getData(),l.close()};G(()=>{a.resetState()}),z(async()=>{e[$.ACTIVE_PAGE]("IronLake"),q("Report DMA",[{pageName:"Iron Lake",pageRoute:"ironlake"},{pageName:"Report",pageRoute:"historicaldmaeform"},{pageName:"Report DMA",pageRoute:"historicaldmaeform"}]),a.getLookupSite(),a.getLookupPsType(),a.getLookupEquipment(),a.getLookupModel()});const h=async l=>{};return(l,_)=>(d(),u("div",mt,[c(st,{onHandleFetch:o}),c(ct,{listData:s.value,onHandleClick:h},null,8,["listData"])]))}}),se=E(dt,[["__scopeId","data-v-716892a9"]]);export{se as default};
