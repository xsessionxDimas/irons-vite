import{a as w}from"./get-user-info-DjfNX8-X.js";import{u as T}from"./useCameraStore-BwXVJhPe.js";import{a as I}from"./index-BuVmIl8K.js";import{u as d}from"./useSyncStore-DsLBNjEA.js";import{u as _}from"./@vueuse-DFoNmIyu.js";import{u as C}from"./useComponentInterventionHeaderStore-CbC-c2Z5.js";import{O as R}from"./OfflineCameras-Dy0B8KWw.js";import{d as p}from"./cron-De-pTz2b.js";import{i as n,r as f}from"./internet-connection-CnLQPjRt.js";import{u as j}from"./useMsal-BbsBYoof.js";import{k as h,c as a,d as S,o as A,a7 as D,L as M,p as O,aa as F,s as y,F as B,R as L}from"./@vue-BypzYtbH.js";import"./useBodyStore-L-idhAYV.js";import"./pinia-BjOS2_Ao.js";import"./useMasterStore-CzSO06fn.js";import"./string-to-imageinfo-converter-Cdr1iOkP.js";import"./lodash-DrHMlsdo.js";import"./@popperjs-BaMZbQYT.js";import"./object-path-DPahbflh.js";import"./deepmerge-oeePEK50.js";import"./nw-img-vue-CR837WER.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./element-plus-BeWdvTRa.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./luxon-C_T8jI2d.js";import"./date-format-8-IvfSl3.js";import"./moment-C5S46NFB.js";import"./urls-RITu66bD.js";import"./urls-CvqtYZA-.js";import"./number-format-BdMuQVyW.js";import"./urls-hWHEBXep.js";import"./useGlobalConnectionStore-DV9B81de.js";import"./authentication-handler-Pueb_EI7.js";import"./useOfflineCameraStore-BBsMm6DV.js";import"./useAttachmentStore-CPMOf2aR.js";import"./simple-vue-camera-D9MGhAeE.js";import"./vue-BzYgrL08.js";import"./UploadImageFailureDialog.vue_vue_type_style_index_0_lang-DVBJv3c1.js";import"./helpers-wUOLw-dU.js";import"./webp-converter-browser-C3MD88Lp.js";import"./compressorjs-Cmz8Y9J9.js";import"./file-saver-CwTBvle_.js";import"./vue3-dropzone-_NG5IwbJ.js";import"./file-selector-CuD-TRe-.js";import"./tslib-DTLQ5SHO.js";import"./attr-accept-DLIfoYC7.js";import"./PhotoDescription.vue_vue_type_style_index_0_lang-1F5CAfuD.js";import"./Textarea.vue_vue_type_style_index_0_lang-v94SEJmi.js";import"./vue-drawing-canvas-CzCJUKem.js";const tt=h({__name:"DMAFormLayout",setup(x){const b=_(),{instance:s}=j(),g=T(),k=I(),r=C(),t=d(),v=a(()=>k.loggedIn),e=a(()=>t.jobRenewToken),i=a(()=>t.jobSyncTask),m=a(()=>t.jobSyncTaskImage);S(v,o=>{o||f(s)});const c=()=>{if(!(e.value&&e.value.running))if(e.value)e.value.start();else{const o=new p.CronJob("*/10 * * * *",async function(){f(s)},null,!0);t.setJobRenewTokenRunning(o)}},u=()=>{if(!(i.value&&i.value.running))if(i.value)r.SyncData(),i.value.start();else{r.SyncData();const o=new p.CronJob("*/3 * * * * *",function(){r.SyncData()},null,!0);t.setJobSyncTaskRunning(o)}},l=()=>{if(!(m.value&&m.value.running))if(m.value)n()||r.SyncImage(),m.value.start();else{n()||r.SyncImage();const o=new p.CronJob("*/3 * * * * *",function(){n()||r.SyncImage()},null,!0);t.setJobSyncTaskImageRunning(o)}};return S(b,o=>{o?(c(),u(),l()):t.stopAllJob()}),A(()=>{n()?t.stopAllJob():(c(),u(),l())}),D(async()=>{await w(!n(),s)}),M(()=>{g.reset()}),(o,E)=>{const J=L("router-view");return O(),F(B,null,[y(R),y(J)],64)}}});export{tt as default};
