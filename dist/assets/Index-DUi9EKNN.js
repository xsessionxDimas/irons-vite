import{P as d}from"./PBI-DEszMZsW.js";import{u,b,G as f}from"./index-BCnwA6yE.js";import{k as h,r as p,o as v,L as g,p as P,q as _,R as S}from"./@vue-BypzYtbH.js";import{_ as I}from"./nw-img-vue-CR837WER.js";import"./vuex-BbOKrtVp.js";import"./breadcrumb-D-Q4Tk9w.js";import"./generate-id-loKj70ts.js";import"./ErrorHandleEnum-CyFTj_P_.js";import"./PageEnum-BoOqFyRq.js";import"./PbiReport.vue_vue_type_script_setup_true_lang-BjJCMeuG.js";import"./PbiEmbeddedEnums-BaTTPSF0.js";import"./powerbi-client-BGzjSA60.js";import"./attr-accept-BWI1aNlo.js";import"./date-format-BASVuupi.js";import"./moment-C5S46NFB.js";import"./vue-router-iNp9kJ0K.js";import"./utils-CryoXyYA.js";import"./urls-Cljsxeb-.js";import"./pinia-BjOS2_Ao.js";import"./vue-i18n-CE6bnohq.js";import"./@intlify-CjZh8qSI.js";import"./index-CLJyswLZ.js";import"./object-path-BACu75q6.js";import"./crypto-js-BZehCumu.js";import"./cron-Ci8nYs3o.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./element-plus-C5R56mia.js";import"./dayjs-C7SXsQPH.js";import"./lodash-Cr9vlq0V.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-xcxZ5rdH.js";import"./mitt-C1xD_ZTF.js";import"./@popperjs-WhmJkuoZ.js";import"./async-validator-DK9uouaC.js";import"./axios-N3crNZ6y.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-DK0FVkv3.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";const N=h({name:"pbi-embedded-index",components:{PBI:d},setup(){const e="ASH-SILO",i={currentPageBreadCrumb:"Ash Silo Dashboard",activePage:"Ash Silo Dashboard",breadCrumbList:[{pageName:"Ash Silo Dashboard",pageRoute:"/ash-silo"}]},s="Ash Silo Dashboard",m="ash_silo_dashboard",o=p(!1),r=p(!1),a=u(),n=async()=>{const l={email:a.user.Email,ver:"v1"};if(o.value){try{await b.get(f,"",new URLSearchParams(l).toString())}catch(c){console.log(c)}o.value=!1}};return v(()=>{let t=60;t=t*60*1e3,r.value=!0,setInterval(()=>{r.value&&(o.value=!0,n())},t)}),g(()=>{r.value=!1}),{reportName:e,breadCrumb:i,analyticPage:s,eventName:m}}});function C(e,i,s,m,o,r){const a=S("PBI");return P(),_(a,{reportName:e.reportName,breadCrumb:e.breadCrumb,analyticPage:e.analyticPage,eventName:e.eventName,visibletab:!1,showFilter:!1,isPublic:!1,isTransparent:!1,class:"ash-silo-dashboard"},null,8,["reportName","breadCrumb","analyticPage","eventName"])}const fe=I(N,[["render",C],["__scopeId","data-v-23cd8716"]]);export{fe as default};
