import{e as o}from"./lodash-Cr9vlq0V.js";class d{constructor(){this.getPaginationStartIndex=()=>{this.startPaginationIndex=(this.currentPage-1)*this.totalPageSize},this.getPaginationLastIndex=()=>{const e=this.startPaginationIndex+this.totalPageSize>=this.totalPage?void 0:this.startPaginationIndex+this.totalPageSize;this.endPaginationIndex=e||this.totalPage},this.handleCurrentPageChange=e=>{this.currentPage=e,this.getPaginationStartIndex(),this.getPaginationLastIndex()},this.getPaginationStartIndexFromBE=()=>{this.currentPage>1?this.startPaginationIndex=this.totalPageSize*(this.currentPage-1):this.currentPage==1&&(this.startPaginationIndex=0)},this.getPaginationLastIndexFromBE=()=>{this.currentPage==1&&this.currentPage*this.totalPageSize<=this.totalPage?this.endPaginationIndex=this.totalPageSize:this.currentPage*this.totalPageSize>this.totalPage?this.endPaginationIndex=this.totalPage:this.currentPage>1&&(this.endPaginationIndex=this.currentPage*this.totalPageSize)},this.handleCurrentPageChangeFromBE=e=>{this.currentPage=e,this.getPaginationStartIndexFromBE(),this.getPaginationLastIndexFromBE()},this.currentPage=1,this.totalPageSize=10,this.totalPage=0,this.startPaginationIndex=-1,this.endPaginationIndex=0}}const u=(t,e)=>function(n,i){let g=0;const s=n[t]&&!P(n[t])?n[t].toLowerCase():n[t],r=i[t]&&!P(i[t])?i[t].toLowerCase():i[t];if(e==="ascending"){const h=s>r?1:0;g=s<r?-1:h}else{const h=s<r?1:0;g=s>r?-1:h}return g*1},l=(t,e,a)=>{if(a=="ascending")return o.toInteger(t)>o.toInteger(e)?1:-1;if(a=="descending")return o.toInteger(e)>o.toInteger(t)?-1:1},I=(t,e,a)=>{t||(t=""),e||(e="");const n=String(t).toLowerCase(),i=String(e).toLowerCase();if(a=="ascending")return n>i?1:-1;if(a=="descending")return i>n?-1:1};function P(t){return isNaN(Number(t))?!1:!isNaN(Number(t))}const f=t=>{if(t=="ascending")return 1;if(t=="descending")return-1},x=t=>t.replace(/[\w]([A-Z])/g,function(e){return e[0]+"_"+e[1].toLowerCase()}).toLowerCase();export{d as P,u as a,f as b,x as c,I as d,l as e};
