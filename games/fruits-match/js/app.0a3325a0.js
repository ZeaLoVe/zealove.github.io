import{i as F,a as N,r as p,_ as x,t as c,j as l,V as f,C as H,H as D,T as O,g as L,b as z,E as R,c as I,s as M,d as w,e as _,f as h,h as V,k as W,l as G,m as $,n as U,o as q,R as C,p as Y,q as S,u as K}from"./vendors.597fa6e5.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))t(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}})();var X={title:"水果连连看",score:"得分",combo:"连击",progress:"进度",time:"用时",shuffle:"洗牌",addShuffle:"增加洗牌",leaderboard:"排行榜",restart:"重新开始",victory:"恭喜通关！",win:"太棒了！你成功消除了所有卡片",lose:"游戏结束",finalScore:"最终得分",targetScore:"目标分数",retry:"再来一局",cardsArea:"卡片区",slotArea:"槽位区",slotFull:"槽位已满",shuffleSuccess:"洗牌成功",noMoreShuffle:"没有洗牌次数了",playAgain:"再来一局",soundClick:"点击音效",soundEliminate:"消除音效",soundShuffle:"洗牌音效",soundWin:"胜利音效",soundPlaceholder:"音效仅在小程序中支持"},J={title:"排行榜",empty:"暂无记录",emptyHint:"快开始游戏吧！",rank:"排名",player:"玩家",time:"时间"},Q={victory:"恭喜通关！",victoryHint:"太棒了！你成功消除了所有卡片",lose:"游戏结束",playAgain:"再来一局",finalScore:"最终得分",targetScore:"目标",gameTime:"游戏用时",eliminated:"消除卡片"};const Z={game:X,leaderboard:J,result:Q};var ee={title:"Fruits Match",score:"Score",combo:"Combo",progress:"Progress",time:"Time",shuffle:"Shuffle",addShuffle:"+2 Shuffle",leaderboard:"Ranking",restart:"Restart",victory:"Victory!",win:"Amazing! You cleared all the cards!",lose:"Game Over",finalScore:"Final Score",targetScore:"Target",retry:"Play Again",cardsArea:"Card Area",slotArea:"Slot Area",slotFull:"Slots full",shuffleSuccess:"Shuffled!",noMoreShuffle:"No shuffles left",playAgain:"Play Again",soundClick:"Click sound",soundEliminate:"Eliminate sound",soundShuffle:"Shuffle sound",soundWin:"Win sound",soundPlaceholder:"Sound only available in Mini Program"},te={title:"Leaderboard",empty:"No records yet",emptyHint:"Start playing now!",rank:"Rank",player:"Player",time:"Time"},ae={victory:"Victory!",victoryHint:"Amazing! You cleared all the cards!",lose:"Game Over",playAgain:"Play Again",finalScore:"Final Score",targetScore:"Target",gameTime:"Game Time",eliminated:"Cards Cleared"};const re={game:ee,leaderboard:te,result:ae};var ne={zh:{translation:Z},en:{translation:re}};F.use(N).init({resources:ne,lng:"zh",fallbackLng:"zh",interpolation:{escapeValue:!1}});function oe(){var o=document.createElement("style");o.innerHTML=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* PC 宽屏适配 */
@media (min-width: 769px) {
  html {
    font-size: 15px !important;
  }

  body {
    background-color: #f3f4f6 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: 100vh !important;
  }

  .taro-tabbar__container {
    width: 375px !important;
    max-width: 375px !important;
    height: calc(100vh - 40px) !important;
    max-height: 900px !important;
    background-color: #fff !important;
    transform: translateX(0) !important;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .taro-tabbar__panel {
    height: 100% !important;
    overflow: auto !important;
  }
}
  `,document.head.appendChild(o)}var ie={visible:!1,title:"",bgColor:"#ffffff",textStyle:"black",navStyle:"default",transparent:"none",leftIcon:"none"},le=function(){var e,r,t=(e=L())===null||e===void 0||(e=e.config)===null||e===void 0?void 0:e.tabBar;return new Set((t==null||(r=t.list)===null||r===void 0?void 0:r.map(function(a){return a.pagePath}))||[])},se=function(e,r,t){if(!e)return"none";var a=e==="pages/index/index"||e==="/pages/index/index",n=r.has(e),i=t>1;return n||a?"none":i?"back":"home"},ue=function(){var e=p.useState(ie),r=x(e,2),t=r[0],a=r[1],n=p.useState(0),i=x(n,2),T=i[0],A=i[1],m=p.useCallback(function(){var s=c.getCurrentPages(),u=s[s.length-1],j=(u==null?void 0:u.route)||"",d=(u==null?void 0:u.config)||{},v=le(),y=v.size<=1&&s.length<=1;a({visible:!y,title:d.navigationBarTitleText||"",bgColor:d.navigationBarBackgroundColor||"#ffffff",textStyle:d.navigationBarTextStyle||"black",navStyle:d.navigationStyle||"default",transparent:d.transparentTitle||"none",leftIcon:y?"none":se(j,v,s.length)})},[]);if(c.useDidShow(function(){m()}),c.usePageScroll(function(s){var u=s.scrollTop;t.transparent==="auto"&&A(Math.min(u/100,1))}),p.useEffect(function(){var s=document.querySelector("title")||document.head,u=new MutationObserver(function(){return m()});return u.observe(s,{subtree:!0,childList:!0,characterData:!0}),function(){return u.disconnect()}},[m]),t.navStyle==="custom"||!t.visible)return l.jsx(l.Fragment,{});var b=t.textStyle==="white"?"#fff":"#333",k=t.textStyle==="white"?"text-white":"text-gray-800",P=function(){return t.transparent==="always"?{backgroundColor:"transparent"}:t.transparent==="auto"?{backgroundColor:t.bgColor,opacity:T}:{backgroundColor:t.bgColor}},B=function(){return c.navigateBack()},E=function(){return c.switchTab({url:"/pages/index/index"})};return l.jsxs(f,{className:"fixed top-0 left-0 right-0 h-11 flex items-center justify-center z-1000 ".concat(t.transparent==="none"?"border-b border-gray-200":""),style:P(),children:[t.leftIcon==="back"&&l.jsx(f,{className:"absolute left-2 top-1_f2 -translate-y-1_f2 p-1 flex items-center justify-center",onClick:B,children:l.jsx(H,{size:24,color:b})}),t.leftIcon==="home"&&l.jsx(f,{className:"absolute left-2 top-1_f2 -translate-y-1_f2 p-1 flex items-center justify-center",onClick:E,children:l.jsx(D,{size:22,color:b})}),l.jsx(O,{className:"text-base font-medium max-w-3_f5 truncate ".concat(k),children:t.title})]})},ce=function(e){var r=e.children;return l.jsxs(f,{className:"flex flex-col h-full",children:[l.jsx(ue,{}),l.jsx(f,{className:"h-11 shrink-0"}),r]})};function de(){if(z()===R.WEAPP)try{var o=I(),e=o.miniProgram.envVersion;console.log("[Debug] envVersion:",e),e!=="release"&&M({enableDebug:!0})}catch(r){console.error("[Debug] 开启调试模式失败:",r)}}var fe=function(e){var r=e.children;return c.useLaunch(function(){de(),oe()}),l.jsx(ce,{children:r})},pe=function(e){var r=e.children;return l.jsx(fe,{children:r})},g=w.__taroAppConfig={router:{mode:"hash"},pages:["pages/index/index"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#fff",navigationBarTitleText:"WeChat",navigationBarTextStyle:"black"}};g.routes=[Object.assign({path:"pages/index/index",load:function(){var o=Y(S().m(function r(t,a){var n;return S().w(function(i){for(;;)switch(i.n){case 0:return i.n=1,K(()=>import("./index.bbecc73a.js"),["./index.bbecc73a.js","./vendors.597fa6e5.js","../css/vendors.8886af03.css","../css/index.38736e84.css"],import.meta.url);case 1:return n=i.v,i.a(2,[n,t,a])}},r)}));function e(r,t){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"水果连连看",navigationBarBackgroundColor:"#ffffff",navigationBarTextStyle:"black",enablePullDownRefresh:!1})];Object.assign(_,{findDOMNode:h.findDOMNode,render:h.render,unstable_batchedUpdates:h.unstable_batchedUpdates});V();var ge=W(pe,C,_,g),me=G({window:w});$(g);U(me,ge,g,C);q({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
