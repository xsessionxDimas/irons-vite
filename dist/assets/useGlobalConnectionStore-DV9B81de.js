import{d as e}from"./pinia-BjOS2_Ao.js";const s=e({id:"globalConnection",state:()=>({stateIsConnectionError:!1,stateSubmitConnectionError:!1,stateConnectionStatus:!0}),getters:{isConnectionError:t=>t.stateIsConnectionError},actions:{setIsConnectionErrorState(t){this.stateIsConnectionError=t},checkIsErrorNoNetwork(t){let o=!1;try{o=t.message.includes("Network Error"),o=`${t}`.includes("Network Error")}catch(r){return console.log("catch on error checkIsErrorNoNetwork - useGlobalConnectionStore",r),o}return o},setSubmitConnectionError(t){this.stateSubmitConnectionError=t},setConnectionStatus(t){this.stateConnectionStatus=t}}});export{s as u};
