import{j as u,a as i}from"./app-BpMrd8A8.js";function d({links:a,filters:s={},preserveScroll:l=!0}){if(!a||a.length<=3)return null;const c=(e,t)=>{if(e.preventDefault(),!t.url||t.active)return;const r=new URL(t.url,window.location.origin).searchParams.get("page"),n={...s};r&&(n.page=r),i.get(window.location.pathname,n,{preserveScroll:l,preserveState:!0})};return u.jsx("div",{className:"flex items-end justify-end gap-1 mt-6",children:a.map((e,t)=>{const o=e.label.replace("&laquo;","«").replace("&raquo;","»");return u.jsx("button",{onClick:r=>c(r,e),disabled:!e.url||e.active,className:`
                            px-4 py-2 text-sm font-medium rounded-lg
                            transition-colors duration-200
                            ${e.active?"bg-blue-600 text-white":e.url?"bg-white text-gray-700 hover:bg-gray-100 border border-gray-300":"bg-gray-100 text-gray-400 cursor-not-allowed"}
                        `,dangerouslySetInnerHTML:{__html:o}},t)})})}export{d as P};
