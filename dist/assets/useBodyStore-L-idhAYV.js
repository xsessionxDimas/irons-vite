import{d as a}from"./pinia-BjOS2_Ao.js";import{A as e,w as i}from"./index-BuVmIl8K.js";const d=a("body",{state:()=>({classes:{}}),actions:{[e.ADD_BODY_CLASSNAME](s){document.body.classList.add(s)},[e.REMOVE_BODY_CLASSNAME](s){document.body.classList.remove(s)},[e.ADD_BODY_ATTRIBUTE](s){const{qulifiedName:t,value:o}=s;document.body.setAttribute(t,o)},[e.REMOVE_BODY_ATTRIBUTE](s){const{qulifiedName:t}=s;document.body.removeAttribute(t)},[e.ADD_CLASSNAME](s){this[i.SET_CLASSNAME_BY_POSITION](s)},[i.SET_CLASSNAME_BY_POSITION](s){const{position:t,className:o}=s;this.classes[t]||(this.classes[t]=[]),this.classes[t].push(o)}}});export{d as u};
