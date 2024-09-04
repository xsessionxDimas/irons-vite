import{c as i}from"./index-BuVmIl8K.js";import{d as n}from"./pinia-BjOS2_Ao.js";import{P as o}from"./Pagination-BiobnanQ.js";import{e as d}from"./lodash-DrHMlsdo.js";import{d as h}from"./table-sort-Bpdq_Uwn.js";const e="https://digital-bumaau-dev-apm-001.azure-api.net/amadm/api/master_data/cbm_parameter",I=`${e}/update`,E=`${e}/export`,U=`${e}/lookup`,u=`${e}/bulk`,p=`${e}/validate_upload`,S=n({id:"CbmParameterBulk",state:()=>({statePagination:new o,stateValidatedData:[],stateDisplayData:[],stateBulkData:[],stateIsError:!1,stateError:"",stateLoading:!1,stateUploadLoading:!1,stateIsUploaded:!1,stateIsSort:!1,stateSortBy:null,stateSortOrder:null}),getters:{validatedData:t=>t.stateValidatedData,displayData:t=>t.stateDisplayData,pagination:t=>t.statePagination,bulkData:t=>t.stateBulkData,error:t=>t.stateError,isError:t=>t.stateIsError,loading:t=>t.stateLoading,uploadLoading:t=>t.stateUploadLoading,isUploaded:t=>t.stateIsUploaded},actions:{async bulkInsert(t){const r={userAccount:t,ver:"v1"};try{this.stateLoading=!0;const s=await i.post(`${u}?${new URLSearchParams(r).toString()}`,this.stateBulkData);this.stateError=s.data.result.isError?s.data.result.message:"",this.stateIsError=s.data.result.isError}catch(s){console.log(s)}this.stateLoading=!1},async upload({userAccount:t,excelFile:r}){const s={userAccount:t,ver:"v1"},l=`${p}?${new URLSearchParams(s).toString()}`;try{this.stateIsError=!1,this.stateError="",this.stateValidatedData=[],this.stateDisplayData=[],this.stateUploadLoading=!0;const a=await i.postImages(l,r);a.data.statusCode==200?a.data.result.isError?(this.stateIsError=!0,this.stateError=a.data.result.message):(this.setIsUploadedState(!0),this.stateValidatedData=a.data.result.content,this.setTotalPage(this.stateValidatedData.length),this.stateIsError=d.some(this.stateValidatedData,{isValid:!1}),this.setPage(1)):(this.stateIsError=a.data.result.isError,this.stateError=a.data.result.message)}catch(a){this.stateIsError=!0,this.stateError=a.response.data.result.message}this.stateUploadLoading=!1},setTotalPage(t){this.pagination.totalPage=t},setDisplayData(){let t=[...this.stateValidatedData];this.stateIsSort&&(t=t.sort(h(this.stateSortBy,this.stateSortOrder))),this.stateDisplayData=t.slice(this.statePagination.startPaginationIndex,this.statePagination.endPaginationIndex)},setPage(t){this.statePagination.handleCurrentPageChange(t),this.setDisplayData()},setSort(t){this.stateIsSort=t.prop!==null,this.stateSortBy=t.prop,this.stateSortOrder=t.order,this.setPage(1)},setBulkData(t){this.stateBulkData=t},setIsUploadedState(t){this.stateIsUploaded=t},resetState(){this.stateValidatedData=[],this.stateDisplayData=[],this.stateBulkData=[],this.statePagination=new o,this.stateIsError=!1,this.stateError="",this.stateLoading=!1,this.stateUploadLoading=!1,this.stateIsSort=!1,this.stateSortBy=null,this.stateSortOrder=null}}});export{e as C,E,U as L,I as U,S as u};
