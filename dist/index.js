var C=function(e){if(e==null)return K;if(typeof e=="function")return F(e);if(typeof e=="object")return Array.isArray(e)?_(e):$(e);if(typeof e=="string")return z(e);throw new Error("Expected function, string, or object as test")};function _(e){let t=[],i=-1;for(;++i<e.length;)t[i]=C(e[i]);return F(r);function r(...s){let a=-1;for(;++a<t.length;)if(t[a].apply(this,s))return!0;return!1}}function $(e){let t=e;return F(i);function i(r){let s=r,a;for(a in e)if(s[a]!==t[a])return!1;return!0}}function z(e){return F(t);function t(i){return i&&i.type===e}}function F(e){return t;function t(i,r,s){return!!(U(i)&&e.call(this,i,typeof r=="number"?r:void 0,s||void 0))}}function K(){return!0}function U(e){return e!==null&&typeof e=="object"&&"type"in e}var B=[],T=!0,V=!1,E="skip";function k(e,t,i,r){let s;typeof t=="function"&&typeof i!="function"?(r=i,i=t):s=t;let a=C(s),o=r?-1:1;u(e,void 0,[])();function u(n,c,p){let d=n&&typeof n=="object"?n:{};if(typeof d.type=="string"){let l=typeof d.tagName=="string"?d.tagName:typeof d.name=="string"?d.name:void 0;Object.defineProperty(O,"name",{value:"node ("+(n.type+(l?"<"+l+">":""))+")"})}return O;function O(){let l=B,b,f,h;if((!t||a(n,c,p[p.length-1]||void 0))&&(l=X(i(n,p)),l[0]===V))return l;if("children"in n&&n.children){let x=n;if(x.children&&l[0]!==E)for(f=(r?x.children.length:-1)+o,h=p.concat(x);f>-1&&f<x.children.length;){let y=x.children[f];if(b=u(y,f,h)(),b[0]===V)return b;f=typeof b[1]=="number"?b[1]:f+o}}return l}}}function X(e){return Array.isArray(e)?e:typeof e=="number"?[T,e]:e==null?B:[e]}function N(e,t,i,r){let s,a,o;typeof t=="function"&&typeof i!="function"?(a=void 0,o=t,s=i):(a=t,o=i,s=r),k(e,a,u,s);function u(n,c){let p=c[c.length-1],d=p?p.children.indexOf(n):void 0;return o(n,d,p)}}var P=e=>e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\/]+/g,"-").replace(/_+/g,"_").replace(/^_+|_+$/g,""),R=(e,t)=>P(t==="md"?e.replace(/\.md$/,""):e);function H(e){for(var t=0,i,r=0,s=e.length;s>=4;++r,s-=4)i=e.charCodeAt(r)&255|(e.charCodeAt(++r)&255)<<8|(e.charCodeAt(++r)&255)<<16|(e.charCodeAt(++r)&255)<<24,i=(i&65535)*1540483477+((i>>>16)*59797<<16),i^=i>>>24,t=(i&65535)*1540483477+((i>>>16)*59797<<16)^(t&65535)*1540483477+((t>>>16)*59797<<16);switch(s){case 3:t^=(e.charCodeAt(r+2)&255)<<16;case 2:t^=(e.charCodeAt(r+1)&255)<<8;case 1:t^=e.charCodeAt(r)&255,t=(t&65535)*1540483477+((t>>>16)*59797<<16)}return t^=t>>>13,t=(t&65535)*1540483477+((t>>>16)*59797<<16),((t^t>>>15)>>>0).toString(36)}var S=/!?\[\[[^\]]+\]\]/g,q=/!?\[\[([^\|\]]+)(?:\s*\|\s*([^\|\]]+))?\]\]/,Y=({basePath:e,classNames:t,filePathPrefix:i,getFileMetaForLabel:r,slugify:s})=>{let{linkClassName:a,imageClassName:o,errorClassName:u,embeddedMdClassName:n}=t;return(c,p,d)=>{if(!c.value||typeof c.value!="string"||!d||p===void 0||!c.value?.match(S)?.length)return;let O=[...c.value.matchAll(S)],l=[],b=0;for(let f of O){b!==f.index&&l.push({type:"text",value:c.value.slice(b,f.index)});let h=f[0].match(q);if(!h){l.push({type:"text",value:f[0]}),b=f.index+f[0].length;continue}let x=h[1].indexOf("#"),y=x!==-1?h[1].slice(x+1):"",W=y.startsWith("^"),g=r(s(x!==-1?h[1].slice(0,x):h[1])),v=W?`${g?.label} > ${y.slice(1)}`:h[1];if(!g)console.error(g),l.push({type:"text",value:`"${h[1]}" could not be found`,data:{hName:"span",hProperties:{className:u}}});else if(h[0].startsWith("!")){let w=g.filepath;g.extension==="md"?d.data={...d.data,hName:"div",hProperties:{className:n,options:h[2]??void 0,"data-file-id":g.id,"data-hash-params":s(y)}}:l.push({type:"image",url:w,alt:v,data:{hProperties:{className:o,options:h[2]??void 0,src:i+w,"data-ext":g.extension,"data-hash-params":s(y),"data-label":g.label}}})}else l.push({type:"link",url:e+R(g.filepath,g.extension)+y,title:v,data:{hProperties:{className:a,options:h[2]??void 0,src:i+g.filepath,"data-ext":g.extension,"data-hash-params":s(y),"data-label":g.label}},children:[{type:"text",value:v}]});b=f.index+f[0].length}b<c.value.length&&l.push({type:"text",value:c.value.slice(b)}),typeof p=="number"&&d.children?d.children.splice(p,1,...l):d.children=l}},L=Y;var D=/^\[\!\s*([\w-]+)\s*\]([-+]?)/,G=({classNames:e})=>{let{calloutClassName:t,calloutIsFoldableClassName:i,calloutTitleClassName:r}=e;return s=>{if(!Array.isArray(s.children)||s.children.length===0)return;let a=s.children.find(l=>l.type==="paragraph");if(!a||a.children.length===0)return;let o=a.children.find(l=>l.type==="text");if(!o||typeof o.value!="string"||o.value.trim()==="")return;let u=D.exec(o.value);if(!u)return;let n=u[1].toLowerCase(),c=u[2]||"",p=c!=="",d=c==="-";o.value=o.value.replace(D,"").trim();let O=o.value||n;s.data??={},s.data.hProperties={...s.data.hProperties,"data-callout":n,"data-initial-folded":String(d),"data-title":O,className:[t,p?i:""]},a.data??={},a.data.hProperties||(a.data.hProperties={}),a.data.hProperties={...a.data.hProperties,className:[r],"data-callout":n,"data-title":O}}},j=G;var J=/==([^=]+)==/gm,Q=({classNames:e})=>{let{hilightClassName:t}=e;return(i,r,s)=>{if(!i.value||typeof i.value!="string"||!s||r===void 0)return;let a=[...i.value.matchAll(J)];if(a.length===0)return;let o=[],u=0;for(let n of a)u!==n.index&&o.push({type:"text",value:i.value.slice(u,n.index)}),o.push({type:"text",value:n[1],data:{hName:"span",hProperties:{className:t}}}),u=n.index+n[0].length;u<i.value.length&&o.push({type:"text",value:i.value.slice(u)}),s.children&&s.children.splice(r,1,...o)}},M=Q;var Z={basePath:"/",classNames:{calloutClassName:"callout",calloutIsFoldableClassName:"foldable",calloutTitleClassName:"callout-title",errorClassName:"obsidian-md-error",hilightClassName:"obsidian-hilight",imageClassName:"obsidian-img",linkClassName:"obsidian-link",embeddedMdClassName:"obsidian-md-embed "},filePathPrefix:"/vault/",slugify:P,getFileMetaForLabel:e=>null},ee=e=>{let t={...Z,...e},i=L({...t}),r=j({...t}),s=M({...t});return a=>{N(a,"blockquote",r),N(a,"text",s),N(a,"text",i)}},te=ee;var ie=["avif","bmp","gif","jpeg","jpg","png","svg","webp"],m=null,se=e=>(m||(m=e),A),I=e=>m&&m.files[e]||null,re=e=>m?I(m.idsByWebPath[e]):null,ae=e=>m?I(m.idsByLabelSlug[e]):null,ne=()=>m?m.imageIds.map(I).filter(e=>e!==null):[],oe=()=>m?m.fileTree:[],le=e=>(m?m.idsByExtension[e]||[]:[]).map(I).filter(i=>i!==null),A={files:{},fileTree:[],idsByExtension:{},idsByLabelSlug:{},idsByWebPath:{},imageIds:[],stats:{},initialize:se,getAllImageFiles:ne,getFileForId:I,getFileForLabelSlug:ae,getFileForWebPathSlug:re,getFilesByExtension:le,getFileTree:oe,...m||{}};export{A as ObsidiousVault,ie as ObsidiousVaultImageFiletypes,te as RemarkObsidious,H as hash,P as slugify,R as slugifyFilepath};
//# sourceMappingURL=index.js.map
