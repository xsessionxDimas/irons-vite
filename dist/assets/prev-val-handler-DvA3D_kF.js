import{g as A}from"./index-BuVmIl8K.js";const l={BRAKE_TYPE_DROPDOWN:"BRAKE_TYPE_DROPDOWN",BRAKE_TYPE_DROPDOWN_DISABLED:"BRAKE_TYPE_DROPDOWN_DISABLED"},i={BRAKE_TYPE_CALIPER:"BRAKE_TYPE_CALIPER",BRAKE_TYPE_OIL_COOLED:"BRAKE_TYPE_OIL_COOLED"},I={CBM:"CBM"},O={OIL_COOLED:"OIL_COOLED",CALIPER:"CALIPER",AUTOMATIC_PREVIOUS_GROUP:"AUTOMATIC_PREVIOUS_GROUP",MANUAL_CLEANED:"MANUAL_CLEANED"},c={PISTON_INPUT_A:"pistonMovementA",PISTON_INPUT_B:"pistonMovementB",PISTON_INPUT_RESULT:"pistonMovementResult",PISTON_INPUT_RATING:"pistonMovementRating",TARGET_RATING:"targetRating",TERGET_TOOL:"targetTool",PREVIOUS_VALUE_PISTON_A:"previousValuePistonA",PREVIOUS_VALUE_PISTON_B:"previousValuePistonB",PREVIOUS_VALUE_PISTON_RESULT:"previousValuePistonResult",PREVIOUS_VALUE_UOM:"previousValueUom",PREVIOUS_VALUE_PISTON_PERCENTAGE:"previousValuePistonPercentage",PREVIOUS_VALUE_PISTON_RATING:"previousValuePistonRating",BRAKE_TYPE_DROPDOWN:"brakeTypeDropdown",PREVIOUS_PARAM_RATING:"previousParamRating",PREVIOUS_TARGET_RATING:"previousTargetRating",DROPDOWN_TOOL:"dropdownTool"},m={SMALL_CAMERA:"smallCamera",DROPDOWN:"dropDown",INPUT:"input"},p={OIL_COOLED:"Oil Cooled",CALIPER:"Caliper"},L={VALUE:"value",TASK_VALUE:"taskValue",UPDATED_BY:"updatedBy",UPDATED_DATE:"updatedDate",RATING:"rating"},V={CBM_TAKE_PHOTO_ALL_RATING:"cbmTakePhotoAllRating"},C={COMMENT:"comment"},N=(t,r)=>{A.trackEvent({name:t,properties:r}),A.flush()},_="v1",U={ver:_},D=t=>{const r=(s,a)=>{const o=[];return a[0].taskGroup.forEach(e=>{const n=e.task.filter(T=>T.groupTaskId===s);o.push(...n)}),o},E=s=>{const a=[];return s[0].taskGroup.forEach(e=>{const n=e.task.filter(T=>T.groupTaskId);a.push(...n)}),a.filter(e=>e.rating==="AUTOMATIC_REPLACEMENT"||e.rating==="AUTOMATIC_REPLACEMENT_GAP")};return{activeGroup:t,getTaskReplacement:r,getCameraItem:(s,a)=>r(s,a).find(e=>e.rating==="CAB_SIDE"),getTaskReplacementInSubGroup:E,getReplacementTool:(s,a)=>{const o=E(a).filter(n=>n.groupTaskId===s);let e="";switch(o[0].SectionData){case"HV Alternator":e="alternator";break;case"Retarder Grid Box 1":case"Retarder Grid Box 2":e="blower motor";break}return e}}},S=t=>{const r=t.lastValue||t.lastValue=="",E=t.previousValue||t.previousValue=="";return r?t.lastValue:E?t.previousValue:t.previousTandem};export{p as B,c as C,m as I,L as J,i as S,O as T,C as V,D as a,I as b,S as c,l as d,V as e,N as s,U as u};
