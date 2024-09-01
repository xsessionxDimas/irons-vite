import{c as q,g as F}from"./attr-accept-BWI1aNlo.js";import{r as G}from"./vue-PpIDhVd-.js";var V={exports:{}};(function(k,z){(function(u,h){k.exports=h(G)})(q,function(u){/*! *****************************************************************************
	    Copyright (c) Microsoft Corporation.

	    Permission to use, copy, modify, and/or distribute this software for any
	    purpose with or without fee is hereby granted.

	    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	    PERFORMANCE OF THIS SOFTWARE.
	    ***************************************************************************** */function h(o,f,r,i){function a(e){return e instanceof r?e:new r(function(c){c(e)})}return new(r||(r=Promise))(function(e,c){function v(l){try{t(i.next(l))}catch(p){c(p)}}function m(l){try{t(i.throw(l))}catch(p){c(p)}}function t(l){l.done?e(l.value):a(l.value).then(v,m)}t((i=i.apply(o,[])).next())})}function w(o,f){var r={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},i,a,e,c;return c={next:v(0),throw:v(1),return:v(2)},typeof Symbol=="function"&&(c[Symbol.iterator]=function(){return this}),c;function v(t){return function(l){return m([t,l])}}function m(t){if(i)throw new TypeError("Generator is already executing.");for(;r;)try{if(i=1,a&&(e=t[0]&2?a.return:t[0]?a.throw||((e=a.return)&&e.call(a),0):a.next)&&!(e=e.call(a,t[1])).done)return e;switch(a=0,e&&(t=[t[0]&2,e.value]),t[0]){case 0:case 1:e=t;break;case 4:return r.label++,{value:t[1],done:!1};case 5:r.label++,a=t[1],t=[0];continue;case 7:t=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!(e=e.length>0&&e[e.length-1])&&(t[0]===6||t[0]===2)){r=0;continue}if(t[0]===3&&(!e||t[1]>e[0]&&t[1]<e[3])){r.label=t[1];break}if(t[0]===6&&r.label<e[1]){r.label=e[1],e=t;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(t);break}e[2]&&r.ops.pop(),r.trys.pop();continue}t=f.call(o,r)}catch(l){t=[6,l],a=0}finally{i=e=0}if(t[0]&5)throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}var y=u.defineComponent({name:"Camera",components:{},emits:["loading","started","stopped","paused","resumed","camera-change","snapshot","error"],props:{resolution:{type:Object,default:function(){return{width:1920,height:1080}}},facingMode:{type:String,default:"environment"},autoplay:{type:Boolean,default:!0},playsinline:{type:Boolean,default:!0},constraints:{type:Object,required:!1}},setup:function(o,f){var r=this,i=f.emit;u.onMounted(function(){if(!navigator.mediaDevices)throw new Error("Media devices not available");var n=document.getElementById("video");o.playsinline&&n&&n.setAttribute("playsinline",""),o.autoplay&&l()}),u.onUnmounted(function(){return _()});var a=u.ref(),e=u.ref(),c=u.ref(),v=o.constraints||{video:{width:o.resolution.width,height:o.resolution.height,facingMode:o.facingMode,deviceId:{}},audio:!1},m=function(n){return n===void 0&&(n=["audioinput","videoinput"]),h(r,void 0,void 0,function(){var s;return w(this,function(d){switch(d.label){case 0:return[4,navigator.mediaDevices.enumerateDevices()];case 1:return s=d.sent(),[2,s.filter(function(g){return n.includes(g.kind)})]}})})},t=function(){if(c.value){var n=c.value.getVideoTracks().map(function(s){return s.getSettings().deviceId});if(n.length>0)return n[0]}},l=function(){return h(r,void 0,void 0,function(){var n,s;return w(this,function(d){switch(d.label){case 0:i("loading"),d.label=1;case 1:return d.trys.push([1,3,,4]),n=c,[4,navigator.mediaDevices.getUserMedia(v)];case 2:if(n.value=d.sent(),!a.value)throw new Error("Video ref is null");return a.value.srcObject=c.value,i("started"),[3,4];case 3:return s=d.sent(),i("error",s),[3,4];case 4:return[2]}})})},p=function(n,s,d){var g;if(n===void 0&&(n=o.resolution),s===void 0&&(s="image/png"),!a.value)throw new Error("Video ref is null");if(!e.value)throw new Error("Canvas ref is null");var x=n.width,C=n.height;return e.value.width=x,e.value.height=C,(g=e.value.getContext("2d"))===null||g===void 0||g.drawImage(a.value,0,0,x,C),new Promise(function(O){var b;(b=e.value)===null||b===void 0||b.toBlob(function(E){i("snapshot",E),O(E)},s,d)})},N=function(n){return h(r,void 0,void 0,function(){return w(this,function(s){switch(s.label){case 0:return _(),v.video.deviceId.exact=n,[4,l()];case 1:return s.sent(),i("camera-change",n),[2]}})})},T=function(){var n;(n=a.value)===null||n===void 0||n.play(),i("resumed")},A=function(){var n;(n=a.value)===null||n===void 0||n.pause(),i("paused")},_=function(){var n;(n=c.value)===null||n===void 0||n.getTracks().forEach(function(s){return s.stop()}),i("stopped")};return{start:l,stop:_,video:a,snapshot:p,canvas:e,devices:m,currentDeviceID:t,pause:A,resume:T,changeCamera:N,stream:c}}});const B={id:"camera-container"},D={autoplay:"",ref:"video",id:"video"},I={id:"slot-container"},S={ref:"canvas",id:"canvas"};function $(o,f,r,i,a,e){return u.openBlock(),u.createElementBlock(u.Fragment,null,[u.createElementVNode("div",B,[u.createElementVNode("video",D,null,512),u.createElementVNode("div",I,[u.renderSlot(o.$slots,"default")])]),u.createElementVNode("canvas",S,null,512)],64)}function j(o,f){f===void 0&&(f={});var r=f.insertAt;if(!(typeof document>"u")){var i=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",r==="top"&&i.firstChild?i.insertBefore(a,i.firstChild):i.appendChild(a),a.styleSheet?a.styleSheet.cssText=o:a.appendChild(document.createTextNode(o))}}var M=`
#camera-container[data-v-74104ed5] {
    position: relative;
    width: 100%;
    height: 100%;
}
#slot-container[data-v-74104ed5] {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}
#video[data-v-74104ed5] {
    width: 100%;
    height: 100%;
}
#canvas[data-v-74104ed5] {
    display: none;
}
`;return j(M),y.render=$,y.__scopeId="data-v-74104ed5",y.__file="src/components/Camera.vue",y})})(V);var U=V.exports;const K=F(U);export{K as C};
