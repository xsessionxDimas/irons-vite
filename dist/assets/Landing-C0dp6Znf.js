import{u as b}from"./vuex-BbOKrtVp.js";import{u as L,A as v,a as I}from"./index-BCnwA6yE.js";import{s as O}from"./breadcrumb-D-Q4Tk9w.js";import{n as S}from"./navigator-D5io2Cca.js";import{t as g}from"./language-BriOOvyN.js";import{u as T}from"./vue-i18n-CE6bnohq.js";import{M as D}from"./MenuCard-B1gcDRUw.js";import{M as H}from"./MenuCardEm-DZRs28uv.js";import{k as E,c as B,a7 as F,o as N,p as s,aa as c,aB as i,C as d,u as e,F as _,$ as R,R as w,s as m,x as p,A as x}from"./@vue-BypzYtbH.js";import{_ as $}from"./nw-img-vue-CR837WER.js";import"./vue-router-iNp9kJ0K.js";import"./object-path-BACu75q6.js";import"./attr-accept-BWI1aNlo.js";import"./pinia-BjOS2_Ao.js";import"./crypto-js-BZehCumu.js";import"./cron-Ci8nYs3o.js";import"./luxon-C_T8jI2d.js";import"./dexie-CWyjz2Lo.js";import"./element-plus-C5R56mia.js";import"./dayjs-C7SXsQPH.js";import"./lodash-Cr9vlq0V.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./normalize-wheel-xcxZ5rdH.js";import"./mitt-C1xD_ZTF.js";import"./@popperjs-WhmJkuoZ.js";import"./async-validator-DK9uouaC.js";import"./axios-N3crNZ6y.js";import"./vue-axios-BaogFJPH.js";import"./sweetalert2-DK0FVkv3.js";import"./@azure-DwL0pga8.js";import"./uuid-SoommWqA.js";import"./vue-inline-svg-Bgl3eqMC.js";import"./vee-validate-C_msoaAA.js";import"./@microsoft-C248spM2.js";import"./@nevware21-CKApUIxW.js";import"./@intlify-CjZh8qSI.js";const q={class:"d-flex flex-column",style:{"margin-left":"10px"}},G={class:"d-flex align-items-center text-blue m-3 mt-5 page-title-dashboard",style:{"line-height":"36px"}},U={class:"page-subtitle m-3 mt-4"},V={class:"row gy-5 g-xl-8 m-2 h-250px"},j={key:0,class:"col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2"},z=["onClick"],K={key:1,class:"col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2"},W=["onClick"],J={key:2,class:"col-6 col-md-4 col-lg-3 col-xl-20-percent col-xxl-3 px-2"},Q=["onClick"],X=E({__name:"Landing",setup(Y){const k=b(),C=L(),{t:l,te:u}=T();k.dispatch(v.ACTIVE_PAGE,"IronLake");const{redirectByName:M,redirectByLink:y}=S(),P=[{cardHeader:"Company Assignment",cardDesc:"Make sure the company assign with the right site",icon:"icon-company-assignment.png",path:"companyassignment"},{cardHeader:"Customer Assignment",cardDesc:"Assign your Plant with the customer here",icon:"icon-customer-assignment.png",path:"customerassignment"},{cardHeader:"Equipment Assignment",cardDesc:"Feature that contains master mapping and configuration data for equipment.",icon:"icon-equipment-assignment.png",path:"equipmentassignment"},{cardHeader:"Outstanding Service",cardDesc:"Feature for uploading weekly service schedule into IronForms",icon:"icon-outstanding-service.png",path:"dailyschedule"},{cardHeader:"History Outstanding Service",cardDesc:"The desc of History Outstanding Service",icon:"icon-outstanding-service-history.png",path:"historydailyschedule"},{cardHeader:"Report Iron Forms",cardDesc:"The desc of Report Iron Forms",icon:"icon-report-iron forms.png",path:"historicaldmaeform"},{cardHeader:"Parameter",cardDesc:"Feature that contains master mapping and configuration data for component conditions parameter.",icon:"icon-parameter.png",path:"parameterehms"},{cardHeader:"Employee",cardDesc:"Feature that contains master mapping and configuration data for employee",icon:"icon-employee.png",path:"employee"},{cardHeader:"Shift",path:""},{cardHeader:"Language",path:""}],h=I(),A=B(()=>{var o,f;if((f=(o=h.menu)==null?void 0:o.getAllProductMenu)!=null&&f.call(o,"IronLake")){const r=h.menu.getAllProductMenu("IronLake");if(r&&r.length>0){let t=[];return r.forEach(a=>{const n=h.menu.getAllFeatureMenu(a.MenuId);n&&n.length>0&&(t=t.concat(n))}),P.filter(a=>{if(t.find(n=>n.PageName==a.cardHeader))return!0})}}return[]});return F(()=>{const o={title:"Iron Lake",pageBreadcrumbPath:["Home"]};k.dispatch(v.SET_BREADCRUMB_ACTION,o)}),N(()=>{O("Iron Lake")}),(o,f)=>{const r=w("router-link");return s(),c(_,null,[i("div",q,[i("div",G,d(e(g)("WELCOME",e(l),e(u)))+" "+d(e(C).user.Name)+"! ",1),i("p",U,d(e(g)("PICKUP",e(l),e(u))),1)]),i("div",V,[(s(!0),c(_,null,R(A.value,t=>(s(),c(_,{key:t.cardHeader},[t.cardHeader!=="Shift"&&t.cardHeader!=="Language"?(s(),c("div",j,[m(D,{cardHeader:t.cardHeader,cardText:t.cardDesc,iconPath:`/media/logos/bumaau/ironlake/${t.icon}`},{default:p(()=>[m(r,{to:{name:t.path}},{default:p(()=>[i("a",{href:"javascript:void(0)",onClick:a=>e(M)(t.path),class:"btn btn-sm btn-go-to-apps"},d(e(g)("GOTOAPP",e(l),e(u))),9,z)]),_:2},1032,["to"])]),_:2},1032,["cardHeader","cardText","iconPath"])])):x("",!0),t.cardHeader==="Shift"?(s(),c("div",K,[m(H,{cardHeader:"Organization Unit",cardText:"Configuration menu related to Organization Unit",iconPath:"fas fa-sitemap fs-3x"},{default:p(()=>[m(r,{to:{name:"ironlake-organization-unit-shift"}},{default:p(({href:a})=>[i("a",{href:"javascript:void(0)",onClick:n=>e(y)(a),class:"btn btn-sm btn-go-to-apps"},d(e(g)("GOTOAPP",e(l),e(u))),9,W)]),_:1})]),_:1})])):x("",!0),t.cardHeader==="Language"?(s(),c("div",J,[m(H,{cardHeader:"Role Management",cardText:"Configuration menu related to Role Management",iconPath:"fas fa-users fs-3x"},{default:p(()=>[m(r,{to:{name:"ironlake-rolemanagement-language"}},{default:p(({href:a})=>[i("a",{href:"javascript:void(0)",onClick:n=>e(y)(a),class:"btn btn-sm btn-go-to-apps"},d(e(g)("GOTOAPP",e(l),e(u))),9,Q)]),_:1})]),_:1})])):x("",!0)],64))),128))])],64)}}}),Be=$(X,[["__scopeId","data-v-b8575f5d"]]);export{Be as default};
