import{b as _}from"./index-BuVmIl8K.js";import{e as f}from"./lodash-DrHMlsdo.js";import{c as M,a as g}from"./get-user-info-DjfNX8-X.js";import{u as x}from"./@vueuse-DFoNmIyu.js";import{u as h}from"./useMsal-BbsBYoof.js";import{k as b,c as k,a7 as w,p as N,aa as S,s as o,x as e,R as r,B as I}from"./@vue-BypzYtbH.js";import{_ as P}from"./nw-img-vue-CR837WER.js";import"./pinia-BjOS2_Ao.js";import"./object-path-DPahbflh.js";import"./@popperjs-BaMZbQYT.js";import"./deepmerge-oeePEK50.js";import"./vue-router-iNp9kJ0K.js";import"./crypto-js-BeOoaXQg.js";import"./cron-De-pTz2b.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./vuex-BbOKrtVp.js";import"./element-plus-BeWdvTRa.js";import"./dayjs-D0x2Df_K.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-D6ofg2JO.js";import"./mitt-C1xD_ZTF.js";import"./async-validator-DK9uouaC.js";import"./axios-CU9oF0EU.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-CppYEwAE.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./btech-analytics-wrapper-DOvMtwpJ.js";import"./posthog-js-CbYOvutT.js";import"./vue-i18n-CbVMwo04.js";import"./@intlify-YGwFW6EB.js";import"./prismjs-BrsEfPfk.js";import"./useBodyStore-L-idhAYV.js";import"./useMasterStore-CzSO06fn.js";import"./internet-connection-CnLQPjRt.js";const v={class:"d-flex flex-column justify-content-center align-items-center flex-wrap h-100"},A=b({__name:"Landing",setup(B){const s=x(),n=_(),{instance:m}=h(),p=["CBM Compliance Report"],c=k(()=>{if(f.isFunction(n.menu.getAllProductMenu)){const a=n.menu.getAllProductMenu("IronPortal").find(t=>t.MenuName.includes("/ironportal-dashboard"));if(a)return n.menu.getAllFeatureMenu(a.MenuId).filter(i=>p.indexOf(i.PageName)<0)}return[{MenuName:"/ironportal-dashboard"}]});return w(async()=>{await M(m),await g(s.value,m)}),(u,a)=>{const t=r("el-button"),i=r("router-link"),l=r("el-col"),d=r("el-row");return N(),S("div",v,[o(d,null,{default:e(()=>[o(l,null,{default:e(()=>[o(i,{to:c.value[0].MenuName},{default:e(()=>[o(t,{class:"start-button text-large",type:"success",size:"large"},{default:e(()=>[I(" Start IronPortal ")]),_:1})]),_:1},8,["to"])]),_:1})]),_:1})])}}}),Mt=P(A,[["__scopeId","data-v-075b905f"]]);export{Mt as default};
