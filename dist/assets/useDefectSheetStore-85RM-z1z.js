import{d as S}from"./pinia-BjOS2_Ao.js";import{a as u,c as i,s as p}from"./index-BuVmIl8K.js";import{u as c}from"./authentication-handler-Pueb_EI7.js";import{e as l}from"./lodash-DrHMlsdo.js";import{m as d}from"./helpers-wUOLw-dU.js";const h="https://digital-bumaau-dev-apm-001.azure-api.net/dinspect/api/service_sheet_header/get_defect_service_sheet",n="https://digital-bumaau-dev-apm-001.azure-api.net/dinspect/api/service_sheet_header/update?ver=v1",g=S({id:"useDefectSheetStore",state:()=>({stateDefectSheets:[],stateSelectedDefectSheet:{},stateSelectedWorkOrder:"",stateIsError:!1,stateError:{},stateErrorMessage:"",stateOption:[],stateSheetAlreadyApproved:!1,stateSelectedFitter:{}}),getters:{DefectSheets:e=>e.stateDefectSheets,SelectedDefectSheet:e=>e.stateSelectedDefectSheet,SelectedWorkOrder:e=>e.stateSelectedWorkOrder,DefectOptions:e=>e.stateOption,IsError:e=>e.stateIsError,Error:e=>e.stateErrorMessage,authStore:()=>u(),SelectedFitter:e=>e.stateSelectedFitter},actions:{async getDefectLists(e){const s={ver:"v1",supervisor:e,userGroup:"supervisor"};try{this.stateIsError=!1;const t=await i.get(`${h}?${new URLSearchParams(s).toString()}`);this.stateDefectSheets=t.data.result.content,this.stateOption=this.stateDefectSheets.map(a=>({label:`${a.unitNumber} - ${a.brand} ${a.equipmentModel} - ${a.psType} Hour Service - ${a.workOrder}`,value:`${a.unitNumber} - ${a.equipmentModel} - ${a.psType} Hour Service - ${a.workOrder}`}))}catch(t){c(t),this.stateIsError=!0,this.stateError=t,p("IRONS",t)}},async getDefectListsPlanner(){const e={ver:"v1",supervisor:this.authStore.user.EmployeeId,userGroup:"planner"};try{this.stateIsError=!1;const s=await i.get(`${h}?${new URLSearchParams(e).toString()}`);this.stateDefectSheets=s.data.result.content,this.stateOption=this.stateDefectSheets.map(t=>({label:`${t.unitNumber} - ${t.brand} ${t.equipmentModel} - ${t.psType} Hour Service - ${t.workOrder}`,value:`${t.unitNumber} - ${t.equipmentModel} - ${t.psType} Hour Service - ${t.workOrder}`}))}catch(s){c(s),console.log(s),this.stateIsError=!0,this.stateError=s,p("IRONS",s)}},setSelectedDefect(e){const s=this.DefectSheets.find(t=>t.dailyScheduleId===e);s&&(this.stateSelectedDefectSheet=s,this.stateSelectedWorkOrder=s.workOrder)},setSelectedDefectFromOtherPage(e){this.stateSelectedDefectSheet=e,this.stateSelectedWorkOrder=e.workOrder},async approveDefectSheetBySupervisor(){var t,a,o;const e=u(),s={id:this.SelectedDefectSheet.eFormId,updateParams:[{keyValue:"GENERAL",propertyParams:[{propertyName:"status",propertyValue:"Close"},{propertyName:"defectStatus",propertyValue:"Approved (SPV)"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:"<<ServerDateTime>>"}]}],employee:{id:e.user.EmployeeId,name:e.user.Name},localStatus:this.SelectedDefectSheet.eFormStatus};try{this.stateIsError=!1,this.stateError={};const r=await i.post(`${n}`,s);if(r.data.result.IsError=="You cannot approve this digital service sheet because another user already approved.")return this.stateSheetAlreadyApproved=!0,!1;r.data.result.isError&&(this.stateIsError=!0,this.stateErrorMessage=d(r.data.result.message))}catch(r){c(r),this.stateIsError=!0,this.stateErrorMessage=d(((o=(a=(t=r==null?void 0:r.response)==null?void 0:t.data)==null?void 0:a.result)==null?void 0:o.message)??`${r}`),p("IRONS",r)}},async approveDefectSheetByPlanner(){var t,a,o;const e=u(),s={id:this.SelectedDefectSheet.eFormId,updateParams:[{keyValue:"GENERAL",propertyParams:[{propertyName:"defectStatus",propertyValue:"Completed"},{propertyName:"updatedBy",propertyValue:JSON.stringify({id:e.user.EmployeeId,name:e.user.Name})},{propertyName:"updatedDate",propertyValue:"<<ServerDateTime>>"}]}],employee:{id:e.user.EmployeeId,name:e.user.Name},localStatus:this.SelectedDefectSheet.eFormStatus};try{this.stateIsError=!1,this.stateError={};const r=await i.post(`${n}`,s);if(r.data.result.message=="You cannot approve this digital service sheet because another user already approved.")return this.stateSheetAlreadyApproved=!0,!1;r.data.result.isError&&(this.stateIsError=!0,this.stateErrorMessage=d(r.data.result.message))}catch(r){return c(r),console.log(r),this.stateIsError=!0,this.stateErrorMessage=d(((o=(a=(t=r==null?void 0:r.response)==null?void 0:t.data)==null?void 0:a.result)==null?void 0:o.message)??`${r}`),p("IRONS",r),r}},reset(){this.stateIsError=!1,this.stateError={},this.stateErrorMessage=""},updateSelectedWO(e,s,t,a){try{this.stateSelectedWorkOrder=e,this.stateSelectedDefectSheet.workOrder=e,this.stateSelectedDefectSheet.unitNumber=t,this.stateSelectedDefectSheet.psType=a,this.stateSelectedDefectSheet.brand=s.split(" ")[0],this.stateSelectedDefectSheet.equipmentModel=`${s.split(" ")[1]}${l.isUndefined(s.split(" ")[2])?"":" "+s.split(" ")[2]}`}catch(o){console.log("error render",o)}},updateSelectedFitter(e){this.stateSelectedFitter=e}}});export{h as D,g as u};
