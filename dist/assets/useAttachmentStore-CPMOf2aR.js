import{u as o}from"./authentication-handler-Pueb_EI7.js";import{c as s,s as c,i as d,f as i}from"./index-BuVmIl8K.js";import{d as p}from"./pinia-BjOS2_Ao.js";import{u as S}from"./useGlobalConnectionStore-DV9B81de.js";import{A as g}from"./date-format-8-IvfSl3.js";const h="https://digital-bumaau-dev-apm-001.azure-api.net/dinspect/api/attachment/upload",l="https://digital-bumaau-dev-apm-001.azure-api.net/dinspect/api/attachment/download_by_url",b=p({id:"offlineAttachment",state:()=>({stateLoading:!1}),getters:{globalConnectionStore:()=>S()},actions:{async uploadAttachment(a,e,t){const u={ver:"v1",userAccount:e};let n="Not Sync";try{const r=await s.post(`${h}?${new URLSearchParams(u).toString()}`,a);return n="Sync",r.data.result.content}catch(r){o(r),n="Failed";const m=this.globalConnectionStore.checkIsErrorNoNetwork(r);return c("IRONS",r),!!m}finally{t.syncStatus=n,t.syncDate=g(),await d(i,"pendingTaskFile",t)}},async downloadAttachment(a){const e={ver:"v1",fileUrl:a};try{return(await s.get(l,"",new URLSearchParams(e).toString())).data}catch(t){o(t),c("IRONS",t),console.log(t)}return""},async getImageFromLocal(a){const e=await i.pendingTaskFile.where({filename:a}).first();if(e)return e.blob},async downloadAttachmentPDF(a){const e={ver:"v1",fileUrl:a};try{return(await s.getBlob(l,"",new URLSearchParams(e).toString())).data}catch(t){o(t),c("IRONS",t),console.log(t)}return""}}});export{b as u};
