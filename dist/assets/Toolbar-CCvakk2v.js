import{f as p}from"./dom-BWyoH50f.js";import{n as b}from"./navigator-D5io2Cca.js";import{t as _}from"./language-BriOOvyN.js";import{u as h}from"./vue-i18n-CE6bnohq.js";import{k as u,p as s,aa as r,aB as e,C as i,F as l,$ as f,P as v}from"./@vue-BypzYtbH.js";import{_ as g}from"./nw-img-vue-CR837WER.js";const k=u({name:"KToolbar",props:{breadcrumbs:Array,title:String},components:{},setup(){const{t,te:a}=h(),{redirectByName:n}=b();return{toolbarWidthFluid:p,handleRedirect:c=>{n(c)},translate:_,t,te:a}}}),y={class:"my-5",id:"kt_toolbar"},$={id:"kt_toolbar_container",class:"container-fluid d-flex flex-stack"},B={class:"mb-5 mb-lg-0 lh-1"},C={class:"row mb-1"},R={class:"col-12"},w={class:"page-title my-3",style:{"margin-right":"2rem"}},N={class:"row"},F={class:"col-12"},K={class:"breadcrumb text-muted fs-6 fw-bold"},T={class:"breadcrumb-item pe-3 text-muted"},E={key:0,class:"breadcrumb-item pe-3 breacrumb-active"},I={key:1,class:"breadcrumb-item pe-3 text-muted"},M=["onClick"];function S(t,a,n,m,c,x){return s(),r("div",y,[e("div",$,[e("div",B,[e("div",C,[e("div",R,[e("h1",w,i(t.title),1)])]),e("div",N,[e("div",F,[e("ol",K,[e("li",T,[e("a",{href:"#",onClick:a[0]||(a[0]=o=>t.handleRedirect("mydashboard")),class:"breacrumb-inactive text-hover-primary"},i(t.translate("HOME",t.t,t.te)),1)]),(s(!0),r(l,null,f(t.breadcrumbs,(o,d)=>(s(),r(l,{key:d},[d===t.breadcrumbs.length-1?(s(),r("li",E,i(o.pageName),1)):(s(),r("li",I,[e("a",{href:"#",onClick:v(A=>t.handleRedirect(o.pageRoute),["prevent"]),class:"breacrumb-inactive text-hover-primary"},i(o.pageName),9,M)]))],64))),128))])])])])])])}const W=g(k,[["render",S],["__scopeId","data-v-111cfe57"]]);export{W as K};
