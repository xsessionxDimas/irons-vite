import{a as s,c,G as l}from"./index-BuVmIl8K.js";import{k as u,r,o as d,L as f,p as _,aa as v}from"./@vue-BypzYtbH.js";import{_ as I}from"./nw-img-vue-CR837WER.js";import"./pinia-BjOS2_Ao.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./element-plus-BeWdvTRa.js";import"./dayjs-D0x2Df_K.js";import"./lodash-DrHMlsdo.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";const b={title:"Plant Availability & Utilisation V3 (auto) Downtime Log",class:"maintenance-report-dashboard",src:"https://app.powerbi.com/reportEmbed?reportId=522d93e5-aae8-4724-bd05-e664812ed10a&autoAuth=true&ctid=5771dee4-c97e-4cb7-b713-9a60400c5fde&pageName=ReportSection484844864ee6e9e94303",allowFullScreen:"true"},h=u({__name:"Index",setup(g){const a=s(),t=r(!1),e=r(!1),i=setInterval(()=>{e.value&&(t.value=!0,p())},1*60*1e3),p=async()=>{const o={email:a.user.Email,ver:"v1"};if(t.value){try{await c.get(l,"",new URLSearchParams(o).toString())}catch(n){console.log(n)}t.value=!1}};return d(async()=>{e.value=!0}),f(async()=>{e.value=!1,clearInterval(i)}),(m,o)=>(_(),v("iframe",b))}}),ot=I(h,[["__scopeId","data-v-ea9f2bb7"]]);export{ot as default};
