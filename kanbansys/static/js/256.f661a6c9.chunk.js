"use strict";(self.webpackChunkkanban_frontend=self.webpackChunkkanban_frontend||[]).push([[256],{8191:(e,t,n)=>{n.d(t,{A:()=>d});n(9950);var r=n(4857),a=n(6589),i=n(6491),o=n(2053),l=n(8378),s=n(4414);const d=e=>{let{title:t,subtitle:n}=e;const d=(0,r.A)(),h=(0,l.LU)(d.palette.mode),c=(0,a.A)(d.breakpoints.down("md"));return(0,s.jsx)(i.A,{mb:"5px",children:c?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(o.A,{variant:"h3",color:h.grey[100],fontWeight:"bold",sx:{m:"0 0 5px 0"},textAlign:"center",children:t}),(0,s.jsx)(o.A,{variant:"h6",color:h.greenAccent[400],textAlign:"center",children:n})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(o.A,{variant:"h1",color:h.grey[100],fontWeight:"bold",sx:{m:"0 0 5px 0"},textAlign:"center",children:t}),(0,s.jsx)(o.A,{variant:"h5",color:h.greenAccent[400],textAlign:"center",children:n})]})})}},256:(e,t,n)=>{n.r(t),n.d(t,{default:()=>g});var r=n(9950),a=n(2053),i=n(6491),o=n(8191),l=(n(8378),n(2819)),s=n(4414);var d=n(1778),h=n(2960),c=n(2917);const g=e=>{let{props:t}=e;const[n,g]=(0,r.useState)([]),u=(0,d.n)({mutationFn:e=>(0,l.PD)(e),onError:e=>{},onSuccess:e=>{console.log(e),g((e=>{const t={},n=[];e.forEach((e=>{const{group_name:n,group_sequence:r,record:a}=e;t[n]||(t[n]={rowSpan:0,records:[]}),t[n].rowSpan+=a.length,t[n].records.push(...a)}));for(const r in t){const e=t[r];e.records.sort(((e,t)=>e.category_sequence-t.category_sequence)),e.records.forEach(((t,a)=>{const i=t.hourly?t.hourly.reduce(((e,t)=>(e[t.hour]=t.qty,e)),{}):{},o={key:`${r}-${t.category_sequence}-${a}`,group_name:r,category_name:t.category_name,wip:t.wip,...i,total:Object.values(i).reduce(((e,t)=>e+t),0),rowSpan:0===a?e.rowSpan:0};n.push(o)}))}return n})(e.body))}});(0,r.useEffect)((()=>{console.log(t),u.mutate(t.mapping_key)}),[t.mapping_key]);const m=[{fixed:"left",dataIndex:"group_name",key:"group_name",width:50,onCell:(e,t)=>({rowSpan:n[t].rowSpan,style:{backgroundColor:"lightgray"}}),render:e=>(0,s.jsx)(a.A,{fontSize:10,fontWeight:700,style:{textOrientation:"sideways",writingMode:"vertical-lr"},children:e})},{title:"Summary",fixed:"left",onHeaderCell:()=>({style:{backgroundColor:"lightgreen",textAlign:"center"}}),children:[{title:(0,s.jsx)(a.A,{textAlign:"center",fontSize:12,children:"Position"}),dataIndex:"category_name",key:"category_name",width:100,fixed:"left",render:e=>(0,s.jsx)(a.A,{textAlign:"center",fontWeight:700,children:e})},{title:(0,s.jsx)(a.A,{textAlign:"center",fontSize:12,children:"Current"}),dataIndex:"wip",key:"wip",width:60,render:e=>-1==e?null:(0,s.jsx)(a.A,{textAlign:"center",children:e})}]},{title:"Hourly QTY",onHeaderCell:()=>({style:{backgroundColor:"lightgreen",textAlign:"center"}}),children:[0,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((e=>({title:(0,s.jsx)(a.A,{textAlign:"center",children:e}),dataIndex:`${e<10?"0":""}${e}`,key:`${e<10?"0":""}${e}`,width:55,render:e=>(0,s.jsx)(a.A,{textAlign:"center",fontSize:20,fontWeight:600,children:e})})))},{title:"Total",dataIndex:"total",onHeaderCell:()=>({style:{backgroundColor:"lightgreen",textAlign:"center"}}),key:"total",width:80,fixed:"right"}];return(0,s.jsxs)(i.A,{children:[(0,s.jsxs)(i.A,{m:"20px",children:[(0,s.jsx)(o.A,{title:t.kanban_name}),(0,s.jsx)(c.A,{variant:"rectangular",sx:{my:2},height:40}),(0,s.jsx)(c.A,{variant:"rectangular",sx:{my:2},height:40}),n?(0,s.jsx)(h.A,{columns:m,dataSource:n,scroll:{x:"max-content"},pagination:!1,bordered:!0,size:"small"}):null]}),(0,s.jsx)(i.A,{height:"50vh",width:"60vw",ml:10})]})}},2917:(e,t,n)=>{n.d(t,{A:()=>_});var r=n(8587),a=n(8168),i=n(9950),o=n(2004),l=n(8283),s=n(8465);function d(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||""}function h(e){return parseFloat(e)}var c=n(7497),g=n(9254),u=n(8463),m=n(1763),p=n(423);function x(e){return(0,p.Ay)("MuiSkeleton",e)}(0,m.A)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var A=n(4414);const f=["animation","className","component","height","style","variant","width"];let w,y,b,v,k=e=>e;const C=(0,l.i7)(w||(w=k`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),S=(0,l.i7)(y||(y=k`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),j=(0,g.Ay)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],!1!==n.animation&&t[n.animation],n.hasChildren&&t.withChildren,n.hasChildren&&!n.width&&t.fitContent,n.hasChildren&&!n.height&&t.heightAuto]}})((e=>{let{theme:t,ownerState:n}=e;const r=d(t.shape.borderRadius)||"px",i=h(t.shape.borderRadius);return(0,a.A)({display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:(0,c.X4)(t.palette.text.primary,"light"===t.palette.mode?.11:.13),height:"1.2em"},"text"===n.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${i}${r}/${Math.round(i/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===n.variant&&{borderRadius:"50%"},"rounded"===n.variant&&{borderRadius:(t.vars||t).shape.borderRadius},n.hasChildren&&{"& > *":{visibility:"hidden"}},n.hasChildren&&!n.width&&{maxWidth:"fit-content"},n.hasChildren&&!n.height&&{height:"auto"})}),(e=>{let{ownerState:t}=e;return"pulse"===t.animation&&(0,l.AH)(b||(b=k`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),C)}),(e=>{let{ownerState:t,theme:n}=e;return"wave"===t.animation&&(0,l.AH)(v||(v=k`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),S,(n.vars||n).palette.action.hover)})),_=i.forwardRef((function(e,t){const n=(0,u.b)({props:e,name:"MuiSkeleton"}),{animation:i="pulse",className:l,component:d="span",height:h,style:c,variant:g="text",width:m}=n,p=(0,r.A)(n,f),w=(0,a.A)({},n,{animation:i,component:d,variant:g,hasChildren:Boolean(p.children)}),y=(e=>{const{classes:t,variant:n,animation:r,hasChildren:a,width:i,height:o}=e,l={root:["root",n,r,a&&"withChildren",a&&!i&&"fitContent",a&&!o&&"heightAuto"]};return(0,s.A)(l,x,t)})(w);return(0,A.jsx)(j,(0,a.A)({as:d,ref:t,className:(0,o.A)(y.root,l),ownerState:w},p,{style:(0,a.A)({width:m,height:h},c)}))}))}}]);