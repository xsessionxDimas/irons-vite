import{k as g,c as o,p as l,aa as s,aB as d,b4 as i,A as u,y as x,a5 as p,C as y,F as h}from"./@vue-BypzYtbH.js";const v=["innerHTML"],C=["name","placeholder","disabled"],q={key:0,class:"mt-2"},S={class:"error-label"},F=g({__name:"Textarea",props:{labelClass:{type:String,default:"dma--textarea-label"},textClass:{type:String,default:"dma--textarea-input h-100px"},gridClass:{required:!1,type:String,default:""},max:{type:Number,default:524288},index:{type:Number},value:{required:!0,type:String},errorMessage:{required:!1,type:String,default:""},isValid:{required:!1,type:Boolean},name:{required:!0,type:String},label:{required:!1,type:String},placeholder:{required:!1,type:String,default:""},disabled:{default:!1},isLoading:{required:!1,type:Boolean,default:!1},disableFloating:{required:!1,type:Boolean,default:!1}},emits:["handleChange"],setup(e,{emit:m}){const c=m,t=e,r=o({get:()=>t.value,set:n=>{const a={};t.index!=null&&(a.index=t.index),a.value=n,c("handleChange",a)}}),f=o(()=>t.disableFloating?"dma--textarea-input-disable":"");return(n,a)=>(l(),s(h,null,[d("div",{class:i(`dma--textarea-wrapper ${e.disabled&&"disabled"} form-control avoid prevent-split`)},[e.disableFloating?u("",!0):(l(),s("label",{key:0,class:i(e.labelClass),innerHTML:e.label},null,10,v)),x(d("textarea",{ref:"dmaTextarea",name:e.name,class:i([e.textClass,f.value]),placeholder:e.placeholder,"onUpdate:modelValue":a[0]||(a[0]=b=>r.value=b),disabled:e.disabled},null,10,C),[[p,r.value]])],2),!e.isValid&&!e.disabled?(l(),s("div",q,[d("label",S,y(e.errorMessage),1)])):u("",!0)],64))}});export{F as _};
