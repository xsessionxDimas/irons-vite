import{d as r}from"./pinia-BjOS2_Ao.js";import{c as i,s as a}from"./index-BuVmIl8K.js";import{b as c,c as d}from"./urls-CvqtYZA-.js";import{u as l}from"./authentication-handler-Pueb_EI7.js";const h=r({id:"dailySchedule",state:()=>({stateDailySchedules:[],stateDailySchedulesInterim:[],stateDailyScheduleOptions:[],stateDailyScheduleInterimOptions:[],stateSelectedDailySchedule:{},stateSelectedDailyScheduleInterim:{}}),getters:{DailySchedules:e=>e.stateDailySchedules,DailyScheduleOptions:e=>e.stateDailyScheduleOptions,DailyScheduleInterimOptions:e=>e.stateDailyScheduleInterimOptions,SelectedDailySchedule:e=>e.stateSelectedDailySchedule,SelectedDailyScheduleInterim:e=>e.stateSelectedDailyScheduleInterim},actions:{async getDailySchedules(e){try{const t={ver:"v1",siteId:e},s=await i.get(c,"",new URLSearchParams(t).toString());this.stateDailySchedules=s.data.result.content,this.formatDailyScheduleOptions()}catch(t){l(t),a("IRONS",t),console.log(t)}},async getDailySchedulesInterim(e){try{const t={ver:"v1",siteId:e},s=await i.get(d,"",new URLSearchParams(t).toString());this.stateDailySchedulesInterim=s.data.result.content,this.formatDailyScheduleInterimOptions()}catch(t){l(t),a("IRONS",t),console.log(t)}},formatDailyScheduleOptions(){this.stateDailyScheduleOptions=this.stateDailySchedules.map(e=>({label:`${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,value:e.id,status:e.status,progress:e.progress}))},formatDailyScheduleInterimOptions(){this.stateDailyScheduleInterimOptions=this.stateDailySchedulesInterim.map(e=>({label:`${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,value:e.id,status:e.status,progress:e.progress}))},setSelectedDailySchedule(e){const t=this.DailySchedules.find(s=>s.id===e);t&&(this.stateSelectedDailySchedule=t)},setSelectedDailyScheduleInterim(e){const t=this.stateDailySchedulesInterim.find(s=>s.id===e);t&&(this.stateSelectedDailyScheduleInterim=t)}}});export{h as u};
