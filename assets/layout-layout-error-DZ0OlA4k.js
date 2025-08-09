import{r as c,j as e,S as u,T as n,u as d,a as h,C as x,B as g,d as i}from"./vendor-BcDla1Uu.js";class y extends c.Component{constructor(r){super(r),this.state={hasError:!1,error:null}}static getDerivedStateFromError(r){return{hasError:!0,error:r}}componentDidCatch(r,t){console.error("ErrorBoundary caught an error",r,t)}render(){var r,t,o,s;return this.state.hasError?e.jsx(l,{children:e.jsxs(u,{sx:{default:{gap:"12px",flexDirection:"column",justifyContent:"center",alignItems:"center"}},children:[e.jsxs(n,{sx:{default:{variant:"h6",align:"center",weight:700,color:"black60"}},children:["An unknown error occurred.",e.jsx("br",{}),"Please try again later."]}),((t=(r=this==null?void 0:this.state)==null?void 0:r.error)==null?void 0:t.message)&&e.jsx(n,{sx:{default:{variant:"h8",align:"center",weight:700,color:"black100"}},children:(s=(o=this==null?void 0:this.state)==null?void 0:o.error)==null?void 0:s.message})]})}):this.props.children}}function j(){const a=d(),{t:r}=h("translation",{keyPrefix:"boundary"});return e.jsx(x,{getResetKey:()=>"reset",onCatch:t=>console.error(t),children:e.jsx(l,{children:e.jsxs(p,{children:[e.jsxs(n,{sx:{default:{variant:"h6",align:"center",weight:700,color:"black60"}},children:[r("title-1"),e.jsx("br",{}),r("title-2")]}),e.jsx(g,{genre:"gray",size:"small",onClick:()=>a.invalidate(),children:r("title-button")})]})})})}const l=i.div`
  background-color: white;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  gap: 16px;
`,p=i.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;export{j as L,y as a};
