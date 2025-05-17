import{r as n,j as e,L as l}from"./index-BNCg_xeG.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),j=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(s,r,a)=>a?a.toUpperCase():r.toLowerCase()),x=t=>{const s=j(t);return s.charAt(0).toUpperCase()+s.slice(1)},m=(...t)=>t.filter((s,r,a)=>!!s&&s.trim()!==""&&a.indexOf(s)===r).join(" ").trim(),b=t=>{for(const s in t)if(s.startsWith("aria-")||s==="role"||s==="title")return!0};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var w={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=n.forwardRef(({color:t="currentColor",size:s=24,strokeWidth:r=2,absoluteStrokeWidth:a,className:c="",children:o,iconNode:d,...i},h)=>n.createElement("svg",{ref:h,...w,width:s,height:s,stroke:t,strokeWidth:a?Number(r)*24/Number(s):r,className:m("lucide",c),...!o&&!b(i)&&{"aria-hidden":"true"},...i},[...d.map(([u,p])=>n.createElement(u,p)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=(t,s)=>{const r=n.forwardRef(({className:a,...c},o)=>n.createElement(g,{ref:o,iconNode:s,className:m(`lucide-${f(x(t))}`,`lucide-${t}`,a),...c}));return r.displayName=x(t),r},N=()=>e.jsx("nav",{className:"bg-blue-700 p-4",children:e.jsxs("div",{className:"container mx-auto flex justify-between",children:[e.jsx("div",{className:"text-white text-lg font-bold",children:e.jsx(l,{to:"/",children:"Rush Hour Solver"})}),e.jsxs("div",{className:"space-x-4",children:[e.jsx(l,{to:"/",className:"text-white hover:text-blue-200",children:"Home"}),e.jsx(l,{to:"/about",className:"text-white hover:text-blue-200",children:"About"})]})]})}),v=()=>e.jsx("footer",{className:"bg-gray-800 text-white shadow-inner",children:e.jsx("div",{className:"container mx-auto px-4 py-6",children:e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0",children:[e.jsxs("div",{className:"flex flex-col items-center md:items-start",children:[e.jsxs("p",{className:"text-sm md:text-base font-medium",children:["© ",new Date().getFullYear()," Rush Hour Game Solver"]}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:"Created for Strategi dan Algoritma Tucil 3 ITB"}),e.jsxs("div",{className:"flex space-x-2 mt-2",children:[e.jsx("span",{className:"text-xs text-gray-300",children:"13523008"}),e.jsx("span",{className:"text-xs text-gray-300",children:"13523036"})]})]}),e.jsxs("div",{className:"flex space-x-4",children:[e.jsx(l,{to:"/about",className:"text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base",children:"About Us"}),e.jsx("a",{href:"https://github.com/yonatan-nyo/Tucil3_13523008_13523036",target:"_blank",rel:"noopener noreferrer",className:"text-gray-400 hover:text-white transition-colors duration-300 text-sm md:text-base",children:"GitHub"})]})]})})}),A=({children:t})=>e.jsxs("div",{className:"flex flex-col min-h-screen",children:[e.jsx(N,{}),e.jsx("main",{className:"flex-grow",children:t}),e.jsx(v,{})]});export{A as L,C as c};
