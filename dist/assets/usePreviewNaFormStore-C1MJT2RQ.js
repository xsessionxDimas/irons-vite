import{u as o}from"./authentication-handler-Pueb_EI7.js";import{c as r,s as n}from"./index-BuVmIl8K.js";import{d as l}from"./pinia-BjOS2_Ao.js";import{j as f}from"./urls-CPQ2HRXU.js";const h=l({id:"NAPreview",state:()=>({stateLoading:!1,stateViewVisible:!1,stateNAInfo:{}}),getters:{ViewVisible:t=>t.stateViewVisible,Details:t=>t.stateNAInfo},actions:{async getNADetail(t,s){this.stateLoading=!0;const a={ver:"v1"},i={servicesheetDetailId:t,taskId:s};try{const e=await r.post(`${f}?${new URLSearchParams(a).toString()}`,i);this.stateNAInfo=e.data.result.content.detail,console.log(this.stateNAInfo),this.stateLoading=!1,this.toggleIsViewVisible(!0)}catch(e){o(e),console.log(e),this.stateLoading=!1,n("IRONS",e)}},setNAInfo(t){this.stateNAInfo=t},toggleIsViewVisible(t){this.stateViewVisible=t},resetInstance(){this.stateLoading=!1,this.stateNAInfo={},this.stateViewVisible=!1}}});export{h as u};
