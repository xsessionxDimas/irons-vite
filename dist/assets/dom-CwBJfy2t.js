import{o as r}from"./object-path-DPahbflh.js";import{m as A,A as t,n as D}from"./index-BuVmIl8K.js";import{u as C}from"./useBodyStore-L-idhAYV.js";import{c as o,k as p,o as b,p as d,aa as c,aB as s,s as S,R as T}from"./@vue-BypzYtbH.js";import{_ as f}from"./nw-img-vue-CR837WER.js";import{u as B}from"./vuex-BbOKrtVp.js";import"./bootstrap-47JNjt8K.js";const e=A(),l=o(()=>e.layoutConfig);o(()=>e.layoutConfig("sidebar.display",""));o(()=>e.layoutConfig("footer.width","")==="fluid");const G=o(()=>e.layoutConfig("header.width","")==="fluid"),J=o(()=>e.layoutConfig("header.left","")),Q=o(()=>e.layoutConfig("aside.display","")===!0),X=o(()=>e.layoutConfig("toolbar.width","")==="fluid");o(()=>e.layoutConfig("toolbar.display",""));const Z=o(()=>e.layoutConfig("loader.display","")),oo=o(()=>e.layoutConfig("content.width","")==="fluid"),eo=o(()=>"/"+e.layoutConfig("loader.logo","")),to=o(()=>!!e.layoutConfig("aside.display","")),ao=o(()=>e.layoutConfig("aside.theme","")),so=o(()=>e.layoutConfig("toolbar.display",""));o(()=>e.layoutConfig("aside.menuIcon",""));const no=o(()=>e.layoutConfig("main.logo.light","")),io=o(()=>e.layoutConfig("main.logo.dark",""));o(()=>e.layoutConfig("header.menuIcon",""));const ro=o(()=>localStorage.getItem("ThemeConfig")),a=C();class i{static init(){i.initLayout(),i.initHeader(),i.initToolbar(),i.initAside(),i.initFooter()}static initLayout(){a[t.ADD_BODY_ATTRIBUTE]({qulifiedName:"id",value:"kt_body"}),r.get(l.value,"loader.display")&&(a[t.ADD_BODY_CLASSNAME]("page-loading-enabled"),a[t.ADD_BODY_CLASSNAME]("page-loading"))}static initHeader(){a[t.ADD_BODY_CLASSNAME]("header-fixed"),a[t.ADD_BODY_CLASSNAME]("header-tablet-and-mobile-fixed")}static initToolbar(){a[t.ADD_BODY_CLASSNAME]("toolbar-enabled"),a[t.ADD_BODY_CLASSNAME]("toolbar-fixed"),a[t.ADD_BODY_CLASSNAME]("toolbar-tablet-and-mobile-fixed")}static initAside(){a[t.ADD_BODY_CLASSNAME]("aside-enabled"),r.get(l.value,"aside.minimized")&&r.get(l.value,"aside.toggle")&&a[t.ADD_BODY_ATTRIBUTE]({qulifiedName:"data-kt-aside-minimize",value:"on"}),a[t.ADD_BODY_CLASSNAME]("aside-fixed"),r.get(l.value,"aside.minimized")&&a[t.ADD_BODY_ATTRIBUTE]({qulifiedName:"data-kt-aside-minimize",value:"on"})}static initFooter(){r.get(l.value,"footer.width")==="fixed"&&a[t.ADD_BODY_CLASSNAME]("footer-fixed")}}const lo=i,L=p({name:"KTScrollTop",components:{},setup(){b(()=>{D.reinitialization()})}}),k={id:"kt_scrolltop",ref:"kt_scrolltop",class:"scrolltop","data-kt-scrolltop":"true"},x={class:"svg-icon"};function v(n,u,m,g,_,h){const y=T("inline-svg");return d(),c("div",k,[s("span",x,[S(y,{src:"/media/icons/duotune/arrows/arr066.svg"})])],512)}const co=f(L,[["render",v]]),E=p({name:"Loader",props:{logo:String},setup(){const n=B();return{loaderType:o(()=>n.getters.layoutConfig("loader.type"))}}}),N={key:0,class:"page-loader flex-column"},O=s("span",{class:"spinner-border text-primary",role:"status"},null,-1),Y=s("span",{class:"text-muted fs-6 fw-bold mt-5"},"Loading...",-1),$=[O,Y],M={key:1,class:"page-loader flex-column"},w=["src"],I=s("div",{class:"d-flex align-items-center mt-5"},[s("span",{class:"spinner-border text-primary",role:"status"}),s("span",{class:"text-muted fs-6 fw-bold ms-5"},"Loading...")],-1),q={key:2,class:"page-loader"},z=s("span",{class:"spinner-border text-primary",role:"status"},[s("span",{class:"visually-hidden"},"Loading...")],-1),F=[z];function H(n,u,m,g,_,h){return n.loaderType==="spinner-message"?(d(),c("div",N,$)):n.loaderType==="spinner-logo"?(d(),c("div",M,[s("img",{alt:"Logo",class:"max-h-75px",src:n.logo},null,8,w),I])):(d(),c("div",q,F))}const uo=f(E,[["render",H]]),po=()=>{document.querySelectorAll(".modal-backdrop.fade.show").length&&document.querySelectorAll(".modal-backdrop.fade.show").forEach(n=>{n.remove()})};export{lo as H,co as K,uo as a,to as b,eo as c,io as d,oo as e,X as f,ao as g,ro as h,G as i,J as j,Q as k,Z as l,po as r,so as s,no as t};
