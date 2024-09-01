function n(r){return r.toString(16).padStart(2,"0")}const e=r=>{const t=new Uint8Array((r+1)/2);return window.crypto.getRandomValues(t),Array.from(t,n).join("")};export{e as g};
