import{k as x,c as y,p as l,q as a,x as o,R as i,aB as t,P as f,B as g,A as C,C as b}from"./@vue-BypzYtbH.js";const h=t("div",{class:"icon mb-4",style:{"text-align":"center"}},null,-1),B={class:"caption",style:{"text-align":"center !important"}},k={class:"dialog-footer",style:{display:"block","text-align":"right"}},V=x({__name:"ErrorBox",props:{visibility:{required:!0,type:Boolean},caption:{required:!0,type:String},isCloseButtonShow:{default:!0,type:Boolean}},emits:["onClose"],setup(e,{emit:c}){const r=e,d=c,s=y(()=>r.visibility),p=()=>{d("onClose")};return(v,n)=>{const u=i("el-button"),m=i("el-dialog");return l(),a(m,{modelValue:s.value,"onUpdate:modelValue":n[0]||(n[0]=_=>s.value=_),center:"",top:"30vh","close-on-click-modal":!1,"show-close":!1,"custom-class":"confirmation","append-to-body":""},{footer:o(()=>[t("span",k,[e.isCloseButtonShow?(l(),a(u,{key:0,onClick:f(p,["prevent"]),style:{"box-shadow":"0px 24px 48px rgba(145, 158, 171, 0.2)","background-color":"#18AF4A",color:"white"}},{default:o(()=>[g("Close")]),_:1})):C("",!0)])]),default:o(()=>[h,t("span",B,b(e.caption),1)]),_:1},8,["modelValue"])}}});export{V as _};
