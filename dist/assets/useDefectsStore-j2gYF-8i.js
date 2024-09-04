import{d as G}from"./pinia-BjOS2_Ao.js";import{b as A,G as $,d as M,e as q,f as j,g as K,h as x,i as W,U as w,j as h,k as O,l as B}from"./useEFormStore-DtkLPope.js";import{c as l,f as d,s as m,a as D}from"./index-BuVmIl8K.js";import{D as P,C as Y}from"./CrackNoClass-0DSU7BAn.js";import{D as b}from"./urls-CvqtYZA-.js";import{C as R}from"./CrackYesClass-COntz77m.js";import{u as H}from"./useOfflineCameraStore-BBsMm6DV.js";import{u as z}from"./useAttachmentStore-CPMOf2aR.js";import{u as y}from"./authentication-handler-Pueb_EI7.js";import{e as k}from"./lodash-DrHMlsdo.js";import{i as p,A as J}from"./date-format-8-IvfSl3.js";import{g as Q,h as X,a as Z}from"./reference-file-C1vLEEpf.js";import{u as ee}from"./@vueuse-DFoNmIyu.js";import{k as te,l as _}from"./urls-CPQ2HRXU.js";import{s as V}from"./prev-val-handler-DvA3D_kF.js";import{i as F}from"./internet-connection-CnLQPjRt.js";import{d as E,a as L,b as ae}from"./methods-bliey5hF.js";const Ne=G({id:"offlineDefects",state:()=>({stateLoading:!1,stateData:new P,stateDefectFormData:new b,stateCrackFormData:new R,stateCrackSimpleFormData:new Y,stateDefectSMU:{},stateIsError:!1,stateHeaderId:"",stateDetailId:"",stateHeaderStatus:"",stateDefectGeneralStatus:"",stateDefectFetched:!1,stateCurrentUserGroup:"",stateLoadDefectImages:!1,stateApproveBy:void 0,stateApproveDate:void 0,stateErrorByNetwork:!1,stateDefectPictures:{},stateDefectKey:1,stateDefectDetails:[],stateDefectHeaders:[],stateDefectHeaderHistory:[],stateSelectedHeaderHistory:[],stateDefectDetailHistory:[],stateSelectedDetailHistory:[],stateSelectedDetailVersion:{},stateCompleteStatus:!0,stateComments:[],stateReferencePhoto:{title:"",blob:"",id:""},stateDefectDetailDownload:{},stateApprovalDefectDownload:{approvedBy:{},approvedDate:""},stateViewDefectVisible:!1,stateViewCrackVisible:!1}),getters:{Loading:e=>e.stateLoading,CompleteStatus:e=>e.stateCompleteStatus,GeneralStatus:e=>e.stateDefectGeneralStatus,ApprovalData:e=>e.stateData,DefectKey:e=>e.stateDefectKey,DefectHeaderHistory:e=>e.stateDefectHeaderHistory,DefectDetailHistory:e=>e.stateDefectDetailHistory,DefectFormData:e=>e.stateDefectFormData,CrackFormData:e=>e.stateCrackFormData,ImagesDefect:()=>H().ImageObjects.find(t=>t.Id==="defect"),ImagesCrack:()=>H().ImageObjects.find(t=>t.Id==="crack"),IsError:e=>e.stateIsError,HeaderId:e=>e.stateHeaderId,DetailId:e=>e.stateDetailId,DataFetched:e=>e.stateDefectFetched,HeaderStatus:e=>e.stateHeaderStatus,DefectPictures:e=>e.stateDefectPictures,LoadDefectImages:e=>e.stateLoadDefectImages,referencePhoto:e=>e.stateReferencePhoto,onlineStatus:()=>ee(),eformStore:()=>A(),Comments:e=>e.stateComments,ApproveBy:e=>e.stateApproveBy,ApproveDate:e=>e.stateApproveDate,DefectSMUHeader:e=>e.stateData.DefectHeaders.find(t=>t.defectType=="machineSMU")??{},DefectSMUDetail:e=>e.stateDefectSMU,DefectSMUDetailDetail:e=>e.stateData.SMUDefectDetails.find(t=>t.defectHeaderId==e.stateDetailId),SelectedDefectHeaderHistory:e=>e.stateSelectedHeaderHistory,SelectedDefectDetailVersion:e=>e.stateSelectedDetailVersion,VersionDate:e=>e.stateSelectedHeaderHistory.map(a=>a.createdDate),ViewDefectVisible:e=>e.stateViewDefectVisible,ViewCrackVisible:e=>e.stateViewCrackVisible},actions:{setCompleteStatus(e){this.stateErrorByNetwork=e},toggleErrorByNetwork(e){this.stateErrorByNetwork=e},setCurrentUserGroup(e){this.stateCurrentUserGroup=e},setViewDefectVisible(e){this.stateViewDefectVisible=e},setViewCrackVisible(e){this.stateViewCrackVisible=e},setHeaderId(e){this.stateHeaderId=e},setDefectFetched(e){this.stateDefectFetched=e},setDetailId(e){this.stateDetailId=e},createRequestBody(e){return{workorder:e}},getCompleteStatus(e){const t=this.ApprovalData.DefectDetails.find(a=>a.defectHeaderId==e);return t?(this.stateCompleteStatus=t.detail.isComplete??!0,t.detail.isComplete??!0):!0},getGenericCompleteStatus(e){const t=this.ApprovalData.DefectGenericDetails.find(a=>a.defectHeaderId==e);return t?t.detail.isComplete??!0:!0},getCrackCompleteStatus(e){const t=this.ApprovalData.CrackDetails.find(a=>a.defectHeaderId==e);return t?t.detail.isComplete??!0:!0},async getDefectsDataHeader(e){const t=this.createRequestBody(e),a=await l.post(`${$}`,t);this.stateData.setHeaders(a.data.result.content),this.stateDefectHeaders=a.data.result.content},async getDefectsDataDetail(e){const t=this.createRequestBody(e),a=await l.post(`${M}`,t);this.stateDefectDetails=k.cloneDeep(a.data.result.content),this.stateData.setDetails(a.data.result.content)},async saveDefectServiceFormToLocalDB(e){q(e),j(this.stateDefectHeaders,this.stateDefectDetails),this.stateComments.forEach(t=>{t.workOrder=e}),K(this.stateComments,e)},async getCommentFromServiceSheet(e){await x(e);const t=await d.serviceSheetDetail.where({id:e}).first();if(!t)return;const a=t.serviceSheet;for(const s in a)if(Object.prototype.hasOwnProperty.call(a,s)){const r=a[s];for(const o in r.subGroup)if(Object.prototype.hasOwnProperty.call(r.subGroup,o)){const n=r.subGroup[o];for(const S in n.taskGroup)if(Object.prototype.hasOwnProperty.call(n.taskGroup,S)){const I=n.taskGroup[S];for(const N in I.task)if(Object.prototype.hasOwnProperty.call(I.task,N)){const i=I.task[N];if(i!=null&&i.taskValue){if(i!=null&&i.adjustment){const u=i.adjustment;if(u.commentValue){const c=await d.serviceSheetDefect.where({workorder:e,taskId:i.key,isActive:"true"}).first();if(c){const f=!c.commentValue,C=c.commentValue!=u.commentValue;(f||C)&&(c.commentValue=u.commentValue),await d.serviceSheetDefect.update(Number(c.id),c)}else{const f=await d.serviceFormComment.where({workOrder:e,taskKey:i.key}).first();f?(f.taskComment=u.commentValue,await d.serviceFormComment.update(Number(i.key),f)):await d.serviceFormComment.add({taskKey:i.key,taskDesc:i.description,taskComment:u.commentValue,workOrder:e,createdBy:i.updatedBy,createdDate:(i==null?void 0:i.updatedDate)||"",updatedBy:i.updatedBy,updatedDate:(i==null?void 0:i.updatedDate)||""})}}else{const c=await d.serviceSheetDefect.where({workorder:e,taskId:i.key,isActive:"true"}).first();c&&(c!=null&&c.commentValue&&(c.commentValue=""),await d.serviceSheetDefect.update(Number(c.id),c))}}else if(i!=null&&i.replacement){const u=i.replacement;if(u.commentValue){const c=await d.serviceSheetDefect.where({workorder:e,taskId:i.key,isActive:"true"}).first();if(c){const f=!c.commentValue,C=c.commentValue!=u.commentValue;(f||C)&&(c.commentValue=u.commentValue),await d.serviceSheetDefect.update(Number(c.id),c)}else{const f=await d.serviceFormComment.where({workOrder:e,taskKey:i.key}).first();f?(f.taskComment=u.commentValue,await d.serviceFormComment.update(Number(i.key),f)):await d.serviceFormComment.add({taskKey:i.key,taskDesc:i.description,taskComment:u.commentValue,workOrder:e,createdBy:i.updatedBy,createdDate:(i==null?void 0:i.updatedDate)||"",updatedBy:i.updatedBy,updatedDate:(i==null?void 0:i.updatedDate)||""})}}else{const c=await d.serviceSheetDefect.where({workorder:e,taskId:i.key,isActive:"true"}).first();c&&(c!=null&&c.commentValue&&(c.commentValue=""),await d.serviceSheetDefect.update(Number(c.id),c))}}else if(i.commentId){const u=this.eformStore.getFieldValueByKey(i.commentId,"value");if(u){const c=await d.serviceSheetDefect.where({workorder:e,taskId:i.key,isActive:"true"}).first();if(c){const f=!c.commentValue,C=c.commentValue!=u;(f||C)&&(c.commentValue=u),await d.serviceSheetDefect.update(Number(c.id),c)}else{const f=await d.serviceFormComment.where({workOrder:e,taskKey:i.key}).first();f?(f.taskComment=u,await d.serviceFormComment.update(Number(i.key),f)):await d.serviceFormComment.add({taskKey:i.key,taskDesc:i.description,taskComment:u,workOrder:e,createdBy:i.updatedBy,createdDate:(i==null?void 0:i.updatedDate)||"",updatedBy:i.updatedBy,updatedDate:(i==null?void 0:i.updatedDate)||""})}}}else for(const u in i.items)if(Object.prototype.hasOwnProperty.call(i.items,u)){const c=i.items[u],f=c.itemType=="input",C=c.value,T=(c==null?void 0:c.valueItemType)=="comment";if(f&&C&&T){const v=await d.serviceSheetDefect.where({workorder:e,taskId:i.key,isActive:"true"}).first();if(v){const g=v.commentValue=="undefined",U=v.commentValue!=c.value;(g||U)&&(v.commentValue=c.value,await d.serviceSheetDefect.update(Number(v.id),v))}else{const g=await d.serviceFormComment.where({workOrder:e,taskKey:i.key}).first();g?(g==null?void 0:g.taskComment)!=c.value&&(g.taskComment=c.value,await d.serviceFormComment.update(Number(i.key),g)):await d.serviceFormComment.add({taskKey:i.key,taskDesc:i.description,taskComment:c.value,workOrder:e,createdBy:i.updatedBy,createdDate:(i==null?void 0:i.updatedDate)||"",updatedBy:i.updatedBy,updatedDate:(i==null?void 0:i.updatedDate)||""})}}}}}}}}},async getDefectsDataAll(e){var a,s,r,o,n,S,I,N,i;const t={workOrder:e,ver:"v1"};if(!F()){const u=await l.get(`${te}`,"",new URLSearchParams(t).toString());this.stateData.setHeaders(((a=u.data.result.content)==null?void 0:a.content.defectHeader)||[]),this.stateData.setDetails(((s=u.data.result.content)==null?void 0:s.content.defectDetail)||[]),this.stateDefectDetails=((r=u.data.result.content)==null?void 0:r.content.defectDetail)||[],this.stateDefectHeaders=((o=u.data.result.content)==null?void 0:o.content.defectHeader)||[],this.stateComments=((n=u.data.result.content)==null?void 0:n.content.comment)||[],this.stateDefectHeaderHistory=((S=u.data.result.content)==null?void 0:S.content.defectHeaderHistory)||[],this.stateDefectDetailHistory=((I=u.data.result.content)==null?void 0:I.content.defectDetailHistory)||[],this.stateApproveBy=((N=u.data.result.content)==null?void 0:N.content.approveBy)||void 0,this.stateApproveDate=((i=u.data.result.content)==null?void 0:i.content.approveDate)||""}},setSelectedDefectHeaderHistory(e){return this.stateDefectHeaderHistory&&this.stateDefectHeaderHistory.length>0&&(this.stateSelectedHeaderHistory=this.stateDefectHeaderHistory.filter(t=>t.defectHeaderId==e)),[]},setDetailVersion(e){const t=this.stateSelectedDetailHistory.find(a=>a.createdDate.substring(0,15)==e.substring(0,15));return t?(this.stateSelectedDetailVersion=t,!0):!1},resetDetailVersion(){this.stateSelectedDetailVersion=this.stateSelectedDetailHistory[0]??{}},setSelectedDefectDetailHistory(e){return this.stateDefectDetailHistory&&this.stateDefectDetailHistory.length>0&&(this.stateSelectedDetailHistory=this.stateDefectDetailHistory.filter(t=>t.defectHeaderId==e)),[]},async getDefectsData(e){this.stateLoading=!0;try{this.setDefectFetched(!1),await this.getDefectsDataAll(e),this.setDefectFetched(!0)}catch(t){y(t),console.error(t)}this.stateLoading=!1},async getDefectFromLocalDB(e){await this.getCommentFromServiceSheet(e);const t=await d.serviceSheetDefect.where({workorder:e,isActive:"true"}).toArray(),a=[],s=[];for(const o in t){const n=t[o],S=n;if(S.id=n.defectHeaderId,a.push(S),n.defectData){let I=n.defectData;typeof I=="string"&&(I=JSON.parse(n.defectData));const N={id:n!=null&&n.defectDetailId?n==null?void 0:n.defectDetailId:"",key:n!=null&&n.defectDetailKey?n==null?void 0:n.defectDetailKey:"",defectHeaderId:n!=null&&n.defectHeaderId?n==null?void 0:n.defectHeaderId:"",detail:I,createdBy:I.createdBy,createdDate:I.createdDate,updatedBy:I.updatedBy,updatedDate:I.updatedDate};n.otherFitterUpdatedBy&&(typeof n.otherFitterUpdatedBy=="string"&&(n.otherFitterUpdatedBy=JSON.parse(n.otherFitterUpdatedBy)),N.otherFitterUpdatedBy=n.otherFitterUpdatedBy,N.updatedDate=n.updatedDate),s.push(N)}}this.stateData.setHeaders(a),this.stateData.setDetails(s);const r=await d.serviceFormComment.where({workOrder:e}).toArray();r&&(this.stateComments=r)},async setDefectImages(e){const t=await E(e,void 0);this.ImagesDefect.ImageInfos=t.ImageInfos,this.ImagesDefect.ImageBlobs=t.ImageBlobs},async setCrackImages(e){const t=await E(e,void 0);this.ImagesCrack.ImageInfos=t.ImageInfos,this.ImagesCrack.ImageBlobs=t.ImageBlobs},async setDefectGeneralStatus(e){const t=this.ApprovalData.DefectHeaders.find(a=>a.id===e);this.stateDefectGeneralStatus=(t==null?void 0:t.generalStatus)??""},async setGenericDefectGeneralStatus(e){const t=this.ApprovalData.DefectGenericHeaders.find(a=>a.id===e);this.stateDefectGeneralStatus=(t==null?void 0:t.generalStatus)??""},async setCrackGeneralStatus(e){const t=this.ApprovalData.CrackHeaders.find(a=>a.id===e);this.stateDefectGeneralStatus=(t==null?void 0:t.generalStatus)??""},async setDefectData(e){const t=this.ApprovalData.DefectHeaders.find(s=>s.id===e),a=this.ApprovalData.DefectDetails.find(s=>s.defectHeaderId==e);if(a){H().setCurrent("defect"),this.setHeaderId(e),this.setDetailId(a.id),this.setSelectedDefectHeaderHistory(e),this.setSelectedDefectDetailHistory(e);const[r]=L(a.detail);this.stateDefectFormData=r,this.stateDefectFormData.setTitle((t==null?void 0:t.taskDesc)||""),this.stateDefectFormData.setType(a.detail.type),this.stateHeaderStatus=t==null?void 0:t.status;const o=await E(a.detail.images,void 0);return this.ImagesDefect.ImageInfos=o.ImageInfos,this.ImagesDefect.ImageBlobs=o.ImageBlobs,a.detail.type}},async setDefectGenericData(e){const t=this.ApprovalData.DefectGenericHeaders.find(s=>s.id===e),a=this.ApprovalData.DefectGenericDetails.find(s=>s.defectHeaderId==e);if(a){this.setHeaderId(e),this.setDetailId(a.id),this.setSelectedDefectHeaderHistory(e),this.setSelectedDefectDetailHistory(e);const[s]=L(a.detail);this.stateDefectFormData=s,this.stateDefectFormData.setTitle((t==null?void 0:t.taskDesc)||""),this.stateHeaderStatus=t==null?void 0:t.status;const r=await E(a.detail.images,void 0);return this.ImagesDefect.ImageInfos=r.ImageInfos,this.ImagesDefect.ImageBlobs=r.ImageBlobs,a.detail.type}},setSMUDefectData(e){let t=!1;const a=z(),s=this.ApprovalData.SMUDefectHeaders.find(o=>o.id===e),r=this.ApprovalData.SMUDefectDetails.find(o=>o.defectHeaderId==e);if(r){t=!0,this.setHeaderId(e),this.setDetailId(r.id),this.stateHeaderStatus=s==null?void 0:s.status,this.stateDefectSMU=r.detail;const o=[];this.ImagesDefect.ImageInfos.forEach(n=>{let S="";typeof n=="string"?S=n:S=n.filename,o.push(a.downloadAttachment(S))}),Promise.all(o).then(n=>{n.forEach(S=>{const I=new Blob([S],{type:"image/png"});this.ImagesDefect.ImageBlobs.push(I)})})}return t},async getDefectImages(e,t,a){const s={id:e,keyValue:t,propertyName:a},r={ver:"v1"};let o=[];try{const n=await l.post(`${W}?${new URLSearchParams(r).toString()}`,s);k.isUndefined(n.data.result.content)||(o=n.data.result.content)}catch(n){V("fe_event_error_service_form_get_defect_images",{errorMessage:n}),m("IRONS",n)}return o},setLoadingImages(e){this.stateLoadDefectImages=e},setNewDefectKey(){this.stateDefectKey+=1},async getDefectPictures(e){const t=this.ApprovalData.DefectDetails.find(a=>a.defectHeaderId==e);t&&(this.stateDefectPictures[e]=JSON.parse(t.detail.images))},getCrackPictures(e){const t=this.ApprovalData.CrackDetails.find(a=>a.defectHeaderId==e);t&&(this.stateDefectPictures[e]=JSON.parse(t.detail.images))},setDefectNewData(e=!0){var s;const t=this.ApprovalData.DefectDetails.find(r=>r.id===this.stateDetailId);t&&(t.detail.description=this.DefectFormData.Description.value,t.detail.plannedDuration=this.DefectFormData.PlannedDuration.value,t.detail.instruction=this.DefectFormData.Instruction.value,t.detail.priority=this.DefectFormData.Priority,t.detail.parts=JSON.stringify(this.DefectFormData.Parts),t.detail.labours=JSON.stringify(this.DefectFormData.Labours),t.detail.resources=JSON.stringify(this.DefectFormData.Resources.map(r=>r.value)),t.detail.symptoms=JSON.stringify(this.DefectFormData.Symptoms.map(r=>r.value)),t.detail.causes=JSON.stringify(this.DefectFormData.Causes.map(r=>r.value)),t.detail.images=JSON.stringify(((s=this.ImagesDefect)==null?void 0:s.ImageInfos)??[]));const a=this.ApprovalData.DefectHeaders.find(r=>r.id===this.stateHeaderId);a&&e&&(a.status="Acknowledge")},createDefectDetail(){var s;const e=((s=this.ImagesDefect)==null?void 0:s.ImageInfos)??[],t=this.DefectFormData.Parts.map(r=>{const o=r.qty?String(parseFloat(r.qty)):r.qty;return{...r,qty:o}}),a=this.DefectFormData.Labours.map(r=>{const o=r.qty?String(parseFloat(r.qty)):r.qty,n=r.hireEach?String(parseFloat(r.hireEach)):r.hireEach;return{...r,qty:o,hireEach:n}});return{type:this.DefectFormData.Type,assetNumber:this.DefectFormData.AssetNumber,description:this.DefectFormData.Description.value,title:this.DefectFormData.Title,raisedBy:this.DefectFormData.RaisedBy,date:this.DefectFormData.Date,plannedDuration:String(parseFloat(this.DefectFormData.PlannedDuration.value)),instruction:this.DefectFormData.Instruction.value,priority:this.DefectFormData.Priority,parts:JSON.stringify(t),labours:JSON.stringify(a),resources:JSON.stringify(this.DefectFormData.Resources.map(r=>r.value)),symptoms:JSON.stringify(this.DefectFormData.Symptoms.map(r=>r.value)),causes:JSON.stringify(this.DefectFormData.Causes.map(r=>r.value)),images:JSON.stringify(e),referencePhoto:this.stateReferencePhoto.id,referenceSection:this.stateReferencePhoto.title,isComplete:this.DefectFormData.IsComplete,requirement:this.DefectFormData.DefectRequirement}},async updateDefectDetail(){const e=D(),t=this.ApprovalData.DefectDetails.find(r=>r.id===this.stateDetailId),a=this.createDefectDetail(),s={id:this.DetailId,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"detail",propertyValue:JSON.stringify(a)},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:e.user.EmployeeId,name:e.user.Name}};try{this.stateIsError=!1;const r=await l.post(`${w}`,s);return r.data.statusError==400?(this.stateIsError=!0,r.data.result.message):""}catch(r){V("fe_event_error_update_defect_detail",{errorMessage:r}),y(r),console.log(r),this.stateIsError=!0,A().toggleTaskAlreadyUpdatedStatus(!0);const n=r.response.data.result.message;return m("IRONS",r),n}},async updateDefectAcknowledge(){const e=D(),t=this.ApprovalData.DefectHeaders.find(s=>s.id===this.stateHeaderId),a={id:t.id,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"status",propertyValue:"Acknowledge"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:e.user.EmployeeId,name:e.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,a),t.status="Acknowledge"}catch(s){y(s),m("IRONS",s),console.log(s),this.stateIsError=!0}},async updateDefectDecline(e){const t=D(),a=this.ApprovalData.DefectHeaders.find(r=>r.id===this.stateHeaderId),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"status",propertyValue:"Decline"},{propertyName:"declineReason",propertyValue:e},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()},{propertyName:"declineBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"declineDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.status="Decline",a.declineReason=e,a.declineBy={id:t.user.EmployeeId,name:t.user.Name},a.declineDate=p(),this.stateHeaderStatus="Decline"}catch(r){y(r),m("IRONS",r),console.log(r),this.stateIsError=!0}this.stateData.setDetails(this.stateDefectDetails)},async updatePlannerDefectDecline(e){const t=D(),a=this.ApprovalData.DefectHeaders.find(r=>r.id===this.stateHeaderId),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"plannerStatus",propertyValue:"Decline"},{propertyName:"declineReason",propertyValue:e},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()},{propertyName:"declineBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"declineDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.plannerStatus="Decline",a.declineReason=e,a.declineBy={id:t.user.EmployeeId,name:t.user.Name},a.declineDate=p(),this.stateHeaderStatus="Decline"}catch(r){y(r),m("IRONS",r),console.log(r),this.stateIsError=!0}this.stateData.setDetails(this.stateDefectDetails)},async updateCrackDecline(e){const t=D(),a=this.ApprovalData.CrackHeaders.find(r=>r.id===this.stateHeaderId),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"status",propertyValue:"Decline"},{propertyName:"declineReason",propertyValue:e},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()},{propertyName:"declineBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"declineDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.status="Decline",a.declineReason=e,a.declineBy={id:t.user.EmployeeId,name:t.user.Name},a.declineDate=p(),this.stateHeaderStatus="Decline"}catch(r){y(r),m("IRONS",r),console.log(r),this.stateIsError=!0}this.stateData.setDetails(this.stateDefectDetails)},async updatePlannerCrackDecline(e){const t=D(),a=this.ApprovalData.CrackHeaders.find(r=>r.id===this.stateHeaderId),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"plannerStatus",propertyValue:"Decline"},{propertyName:"declineReason",propertyValue:e},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()},{propertyName:"declineBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"declineDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.plannerStatus="Decline",a.declineReason=e,a.declineBy={id:t.user.EmployeeId,name:t.user.Name},a.declineDate=p(),this.stateHeaderStatus="Decline"}catch(r){y(r),m("IRONS",r),console.log(r),this.stateIsError=!0}this.stateData.setDetails(this.stateDefectDetails)},async updatePlannerDefectAcknowledge(){const e=D(),t=this.ApprovalData.DefectHeaders.find(s=>s.id===this.stateHeaderId),a={id:t.id,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"plannerStatus",propertyValue:"Acknowledge"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:e.user.EmployeeId,name:e.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,a),t.plannerStatus="Acknowledge"}catch(s){y(s),m("IRONS",s),console.log(s),this.stateIsError=!0}},async updateDefectOnly(e){const t=this.ApprovalData.DefectDetails.find(r=>r.id===this.stateDetailId),a=this.createDefectDetail(),s={id:this.DetailId,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"detail",propertyValue:JSON.stringify(a)},{propertyName:"updatedBy",propertyValue:e},{propertyName:"updatedDate",propertyValue:p()}]}],employee:JSON.parse(e)};try{this.stateIsError=!1,await l.post(`${w}`,s)}catch(r){V("fe_event_error_service_form_update_defect_data",{errorMessage:r}),y(r),console.log(r),this.stateIsError=!0,A().toggleTaskAlreadyUpdatedStatus(!0),m("IRONS",r)}},async updateDefectFitter(e,t=!1){let a;t?a=this.ApprovalData.DefectGenericDetails.find(o=>o.id===this.stateDetailId):a=this.ApprovalData.DefectDetails.find(o=>o.id===this.stateDetailId);const s=this.createDefectDetail(),r={id:this.DetailId,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"detail",propertyValue:JSON.stringify(s)},{propertyName:"updatedBy",propertyValue:e},{propertyName:"updatedDate",propertyValue:p()},{propertyName:"otherFitterUpdatedBy",propertyValue:e}]}],employee:JSON.parse(e)};try{return this.stateIsError=!1,F()?(this.updateDefectFitterToLocalDB(a,r,s),"try offline"):(await l.post(`${_}`,r)).data.result.message}catch(o){V("fe_event_error_service_form_update_defect_fitter",{errorMessage:o}),y(o),this.stateIsError=!0,m("IRONS",o)}},async updateOtherFitterValueToLocalDB(e){let t={},a="";e.updateParams[0].propertyParams.forEach(r=>{r.propertyName=="otherFitterUpdatedBy"?t=r.propertyValue:r.propertyName=="updatedDate"&&(a=r.propertyValue)});const s=await d.serviceSheetDefect.where({defectDetailId:this.stateDetailId}).first();s&&(s.otherFitterUpdatedBy=t,s.updatedDate=a,await d.serviceSheetDefect.update(Number(s.id),s))},async updateDefectFitterToLocalDB(e,t,a){if(await this.updateOtherFitterValueToLocalDB(t),await O(this.stateDetailId,a),await B(this.stateDetailId))await d.pendingTask.add({module:"serviceForm",section:"E-Form",type:"FitterUpdateDefect",workorder:this.eformStore.generalForm.workOrder,key:e.key,bindingKey:e.key,payload:JSON.stringify(t),syncDate:J(),syncStatus:"Pending"});else{const r=await d.serviceSheetDefect.where({defectDetailId:this.stateDetailId}).first();if(!r)return;(r==null?void 0:r.defectType)=="Generic"?await this.updateLocalDefectDetailOnTask(a,"GenericDefect"):await this.updateLocalDefectDetailOnTask(a,"MultipleDefect")}},async updateDefectMO(e,t){const a=D(),s=this.ApprovalData.DefectHeaders.find(o=>o.id===e),r={id:s.id,updateParams:[{keyValue:s.key,propertyParams:[{propertyName:"defectWorkorder",propertyValue:t},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:a.user.EmployeeId,name:a.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:a.user.EmployeeId,name:a.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,r),s.defectWorkorder=t}catch(o){y(o),console.log(o),this.stateIsError=!0,m("IRONS",o)}},async updateRepairedStatus(e){const t=D(),a=this.ApprovalData.DefectHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"repairedStatus",propertyValue:"Repaired"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.repairedStatus="Repaired"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async updateDefectConfirmedStatus(e){const t=D(),a=this.ApprovalData.DefectNAHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"cbmNAStatus",propertyValue:"Confirmed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.cbmNAStatus="Confirmed"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async updatePlannerDefectConfirmedStatus(e){const t=D(),a=this.ApprovalData.DefectNAHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"plannerCbmNAStatus",propertyValue:"Confirmed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.plannerCbmNAStatus="Confirmed"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async updateCrackConfirmedStatus(e){const t=D(),a=this.ApprovalData.CrackNAHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"cbmNAStatus",propertyValue:"Confirmed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.cbmNAStatus="Confirmed"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async updatePlannerCrackConfirmedStatus(e){const t=D(),a=this.ApprovalData.CrackNAHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"plannerCbmNAStatus",propertyValue:"Confirmed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.plannerCbmNAStatus="Confirmed"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async updateCBMConfirmedStatus(e){const t=D(),a=this.ApprovalData.CBMHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"cbmNAStatus",propertyValue:"Confirmed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.cbmNAStatus="Confirmed"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async updatePlannerCBMConfirmedStatus(e){const t=D(),a=this.ApprovalData.CBMHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"plannerCbmNAStatus",propertyValue:"Confirmed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.plannerCbmNAStatus="Confirmed"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},async setCrackData(e){const t=this.ApprovalData.CrackHeaders.find(s=>s.id===e),a=this.ApprovalData.CrackDetails.find(s=>s.defectHeaderId==e);if(a){H().setCurrent("crack"),this.setHeaderId(e),this.setDetailId(a.id),this.setSelectedDefectHeaderHistory(e),this.setSelectedDefectDetailHistory(e),this.stateHeaderStatus=t==null?void 0:t.status;const[r]=ae(a.detail);this.stateCrackFormData=r,this.stateCrackFormData.setType(a.detail.type),await this.setReferencePhoto(a.detail.referenceSection,a.detail.referencePhoto);const o=await E(a.detail.images,void 0);return this.ImagesCrack.ImageInfos=o.ImageInfos,this.ImagesCrack.ImageBlobs=o.ImageBlobs,a.detail.type}},setCrackNewData(){var t;const e=this.ApprovalData.CrackDetails.find(a=>a.id===this.stateDetailId);e&&(e.detail.description=this.CrackFormData.Description.value,e.detail.plannedDuration=this.CrackFormData.PlannedDuration.value,e.detail.instruction=this.CrackFormData.Instruction.value,e.detail.priority=this.CrackFormData.Priority,e.detail.parts=JSON.stringify(this.CrackFormData.Parts),e.detail.labours=JSON.stringify(this.CrackFormData.Labours),e.detail.resources=JSON.stringify(this.CrackFormData.Resources.map(a=>a.value)),e.detail.symptoms=JSON.stringify(this.CrackFormData.Symptoms.map(a=>a.value)),e.detail.causes=JSON.stringify(this.CrackFormData.Causes.map(a=>a.value)),e.detail.previousCracks=JSON.stringify(this.CrackFormData.CrackLength),e.detail.images=JSON.stringify(((t=this.ImagesCrack)==null?void 0:t.ImageInfos)??[]))},createCrackDetail(){var r;const e=((r=this.ImagesCrack)==null?void 0:r.ImageInfos)??[],t=this.CrackFormData.Parts.map(o=>{const n=o.qty?String(parseFloat(o.qty)):o.qty;return{...o,qty:n}}),a=this.CrackFormData.Labours.map(o=>{const n=o.qty?String(parseFloat(o.qty)):o.qty,S=o.hireEach?String(parseFloat(o.hireEach)):o.hireEach;return{...o,qty:n,hireEach:S}}),s=this.CrackFormData.CrackLength.map(o=>{const n=o.currentCrack?String(parseFloat(o.currentCrack)):o.currentCrack;return{...o,currentCrack:n}});return{type:"YES",assetNumber:this.CrackFormData.AssetNumber,description:this.CrackFormData.Description.value,title:this.CrackFormData.Title,raisedBy:this.CrackFormData.RaisedBy,date:this.CrackFormData.Date,plannedDuration:String(parseFloat(this.CrackFormData.PlannedDuration.value)),instruction:this.CrackFormData.Instruction.value,priority:this.CrackFormData.Priority,parts:JSON.stringify(t),labours:JSON.stringify(a),resources:JSON.stringify(this.CrackFormData.Resources.map(o=>o.value)),symptoms:JSON.stringify(this.CrackFormData.Symptoms.map(o=>o.value)),causes:JSON.stringify(this.CrackFormData.Causes.map(o=>o.value)),images:JSON.stringify(e),previousCracks:JSON.stringify(s),referencePhoto:this.stateReferencePhoto.id,referenceSection:this.stateReferencePhoto.title,isComplete:this.CrackFormData.IsComplete,requirement:this.CrackFormData.DefectRequirement}},async updateCrackDetail(){const e=D(),t=this.ApprovalData.CrackDetails.find(r=>r.id===this.stateDetailId),a=this.createCrackDetail(),s={id:this.DetailId,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"detail",propertyValue:JSON.stringify(a)},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:e.user.EmployeeId,name:e.user.Name}};try{this.stateIsError=!1;const r=await l.post(`${w}`,s);return r.data.statusError==400?(this.stateIsError=!0,r.data.result.message):""}catch(r){V("fe_event_error_service_form_update_crack",{errorMessage:r}),y(r),console.log(r),this.stateIsError=!0;const o=r.response.data.result.message;return m("IRONS",r),o}},async updateCrackOnly(e){const t=this.ApprovalData.CrackDetails.find(r=>r.id===this.stateDetailId),a=this.createCrackDetail(),s={id:this.DetailId,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"detail",propertyValue:JSON.stringify(a)},{propertyName:"updatedBy",propertyValue:e},{propertyName:"updatedDate",propertyValue:p()}]}],employee:JSON.parse(e)};try{this.stateIsError=!1,await l.post(`${w}`,s)}catch(r){V("fe_event_error_service_form_update_crack",{errorMessage:r}),y(r),m("IRONS",r),console.log(r),this.stateIsError=!0}},async updateCrackFitter(e){const t=this.ApprovalData.CrackDetails.find(r=>r.id===this.stateDetailId),a=this.createCrackDetail(),s={id:this.DetailId,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"detail",propertyValue:JSON.stringify(a)},{propertyName:"updatedBy",propertyValue:e},{propertyName:"updatedDate",propertyValue:p()},{propertyName:"otherFitterUpdatedBy",propertyValue:e}]}],employee:JSON.parse(e)};try{return this.stateIsError=!1,F()?(this.updateCrackFitterToLocalDB(k.cloneDeep(t),k.cloneDeep(s),k.cloneDeep(a)),"try offline"):(await l.post(`${_}`,s)).data.result.message}catch(r){V("fe_event_error_service_form_update_crack_fitter",{errorMessage:r}),y(r),this.stateIsError=!0;const o=r.response.data.result.message;return m("IRONS",r),o}},async updateLocalDefectDetailOnTask(e,t){const a=await d.serviceSheetDefect.where({defectHeaderId:this.stateHeaderId}).first();if(a){let s={};t=="GenericDefect"?s=await d.pendingTask.where({key:a==null?void 0:a.defectHeaderId,workorder:a==null?void 0:a.workorder,type:t}).toArray():s=await d.pendingTask.where({key:a==null?void 0:a.taskId,workorder:a==null?void 0:a.workorder,type:t}).toArray(),s.forEach(async r=>{const o=k.cloneDeep(JSON.parse(r.payload));o.defectHeader.defectHeaderId==this.stateHeaderId&&(o.defectDetail=e,r.payload=JSON.stringify(o),await d.pendingTask.update(Number(r.id),r))})}},async updateCrackFitterToLocalDB(e,t,a){await this.updateOtherFitterValueToLocalDB(t),await O(this.stateDetailId,a),await B(this.stateDetailId)?await d.pendingTask.add({module:"serviceForm",section:"E-Form",type:"FitterUpdateDefect",workorder:this.eformStore.generalForm.workOrder,key:e.key,bindingKey:e.key,payload:JSON.stringify(t),syncDate:J(),syncStatus:"Pending"}):await this.updateLocalDefectDetailOnTask(a,"Defect")},async updateCrackAcknowledge(){const e=D(),t=this.ApprovalData.CrackHeaders.find(s=>s.id===this.stateHeaderId),a={id:t.id,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"status",propertyValue:"Acknowledge"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:e.user.EmployeeId,name:e.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,a),t.status="Acknowledge"}catch(s){y(s),console.log(s),this.stateIsError=!0,m("IRONS",s)}},async updatePlannerCrackAcknowledge(){const e=D(),t=this.ApprovalData.CrackHeaders.find(s=>s.id===this.stateHeaderId),a={id:t.id,updateParams:[{keyValue:t.key,propertyParams:[{propertyName:"plannerStatus",propertyValue:"Acknowledge"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:e.user.EmployeeId,name:e.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,a),t.plannerStatus="Acknowledge"}catch(s){y(s),console.log(s),this.stateIsError=!0,m("IRONS",s)}},async updateCrackMO(e,t){const a=D(),s=this.ApprovalData.CrackHeaders.find(o=>o.id===e),r={id:s.id,updateParams:[{keyValue:s.key,propertyParams:[{propertyName:"defectWorkorder",propertyValue:t},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:a.user.EmployeeId,name:a.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:a.user.EmployeeId,name:a.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,r),s.defectWorkorder=t}catch(o){y(o),console.log(o),this.stateIsError=!0,m("IRONS",o)}},async updateCrackRepairedStatus(e){const t=D(),a=this.ApprovalData.CrackHeaders.find(r=>r.id===e),s={id:a.id,updateParams:[{keyValue:a.key,propertyParams:[{propertyName:"repairedStatus",propertyValue:"Repaired"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:t.user.EmployeeId,name:t.user.Name})},{propertyName:"updatedDate",propertyValue:p()}]}],employee:{id:t.user.EmployeeId,name:t.user.Name}};try{this.stateIsError=!1,await l.post(`${h}`,s),a.repairedStatus="Repaired"}catch(r){y(r),console.log(r),this.stateIsError=!0,m("IRONS",r)}},reset(){this.stateLoading=!1,this.stateData=new P,this.stateDefectFormData=new b,this.stateCrackFormData=new R,this.stateIsError=!1,this.stateHeaderId="",this.stateDetailId="",this.stateDefectFetched=!1,this.stateHeaderStatus="",this.stateLoadDefectImages=!1,this.stateDefectKey=1},updateHeaderDefect(e){const t=this.ApprovalData.DefectHeaders.find(a=>a.id===e);this.stateHeaderStatus=k.isUndefined(t.plannerStatus)?"":t.plannerStatus},updateHeaderCrack(e){const t=this.ApprovalData.CrackHeaders.find(a=>a.id===e);this.stateHeaderStatus=k.isUndefined(t.plannerStatus)?"":t.plannerStatus},async getReferencePhoto(e){let t="";try{const a=window.URL||window.webkitURL;if(F())t=await Z(e);else{const s=await Q(e);t=a.createObjectURL(s),X(e,this.eformStore.stateGeneralForm.workOrder,s)}return t}catch(a){return console.log(a),""}},async setReferencePhoto(e,t){this.stateReferencePhoto.title=e,this.stateReferencePhoto.blob=await this.getReferencePhoto(t),this.stateReferencePhoto.id=t},getDefectDetail(e){return this.ApprovalData.DefectDetails.find(a=>a.defectHeaderId==e)},getDefectHeader(e){return this.ApprovalData.DefectHeaders.find(a=>a.id==e)},getDefectGenericDetail(e){return this.ApprovalData.DefectGenericDetails.find(a=>a.defectHeaderId==e)},getCrackDetail(e){return this.ApprovalData.CrackDetails.find(a=>a.defectHeaderId==e)},setDefectDetailDownload(e){this.stateDefectDetailDownload=e},setApprovalDefectDownload(e,t){this.stateApprovalDefectDownload.approvedBy=e,this.stateApprovalDefectDownload.approvedDate=t}}});export{Ne as u};
