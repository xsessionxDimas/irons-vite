import{a as c}from"./index-BuVmIl8K.js";import{i as u,r as n}from"./internet-connection-CnLQPjRt.js";import{u as l}from"./useMsal-BbsBYoof.js";import{u as f}from"./useSyncStore-DsLBNjEA.js";import{d as _}from"./cron-De-pTz2b.js";import{k as d,c as i,d as b,o as w,p as v,aa as k,s as S,R as g}from"./@vue-BypzYtbH.js";import{_ as h}from"./nw-img-vue-CR837WER.js";import"./pinia-BjOS2_Ao.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./element-plus-BeWdvTRa.js";import"./dayjs-D0x2Df_K.js";import"./lodash-DrHMlsdo.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./luxon-C_T8jI2d.js";import"./@vueuse-DFoNmIyu.js";const y={class:"m-0 p-8 bg-white full-screen"},C=d({__name:"NoSidebarLayout",setup(J){const s=c(),{instance:e}=l(),r=f(),m=i(()=>s.loggedIn);b(m,t=>{t||n(e)});const o=i(()=>r.jobRenewToken),p=()=>{if(!(o.value&&o.value.running))if(o.value)o.value.start();else{const t=new _.CronJob("*/10 * * * *",async function(){n(e)},null,!0);r.setJobRenewTokenRunning(t)}};return w(()=>{u()?r.stopAllJob():p()}),(t,R)=>{const a=g("router-view");return v(),k("div",y,[S(a)])}}}),uo=h(C,[["__scopeId","data-v-d844b316"]]);export{uo as default};
