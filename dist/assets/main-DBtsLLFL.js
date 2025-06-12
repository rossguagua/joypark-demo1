const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/supabase-BR-AoxQ-.js","assets/preload-helper-CS1eXPs2.js"])))=>i.map(i=>d[i]);
import{_ as g}from"./preload-helper-CS1eXPs2.js";let d=[{id:"1",name:"聊天破冰盲盒",category_tag:"drinking-topics",description:"打破沉默，开启话题",features:["破冰利器","话题丰富","氛围轻松"],players:"2-8人",duration:"15-30分钟",is_active:!0,created_at:new Date().toISOString()},{id:"2",name:"心理测试游戏",category_tag:"party-psychology",description:"趣味心理测试",features:["心理测试","趣味互动"],players:"2-6人",duration:"20-40分钟",is_active:!0,created_at:new Date().toISOString()},{id:"3",name:"德州扑克",category_tag:"poker",description:"经典扑克游戏",features:["策略游戏","经典玩法"],players:"3-8人",duration:"30-60分钟",is_active:!0,created_at:new Date().toISOString()}],c;(async function(){try{c=(await g(()=>import("./supabase-BR-AoxQ-.js"),__vite__mapDeps([0,1]))).getGames,console.log("✅ Supabase模块加载成功"),console.log("🔄 尝试从数据库加载数据..."),y()}catch(t){console.warn("⚠️ Supabase模块加载失败，使用fallback数据:",t),c=null,document.getElementById("loadingState").innerHTML=`
                    <div class="text-center py-2 mb-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mx-6">
                        <p class="text-yellow-400 text-sm">⚠️ 数据库模块未加载，使用本地数据</p>
                    </div>
                `,document.getElementById("loadingState").style.display="block"}})();let s=null;function p(e){return e==="drinking-topics"?null:`images/covers/${{"ice-breaker-box":"battle-royale.png","party-psychology":"party-psychology.png",poker:"poker.png","love-battle":"love-battle.png","moon-night":"moon-night.png","man-di-piao-ling":"man-di-piao-ling.png","kiss-marks":"kiss-marks.png",wisdom:"wisdom.png"}[e]||`${e}.png`}`}async function y(){try{console.log("Loading games from database...");const e=performance.now(),t=new Promise((r,o)=>{setTimeout(()=>o(new Error("Database connection timeout")),5e3)}),i=await Promise.race([c(),t]),a=performance.now()-e;console.log(`Games loaded in ${a.toFixed(2)}ms:`,i),i&&i.length>0?(d=i,m(),document.getElementById("loadingState").style.display="none",console.log("✅ 数据库数据加载成功，已替换fallback数据")):(console.log("⚠️ 数据库返回空数据，继续使用fallback数据"),document.getElementById("loadingState").innerHTML=`
                        <div class="text-center py-2 mb-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mx-6">
                            <p class="text-yellow-400 text-sm">⚠️ 数据库数据为空，正在使用测试数据</p>
                        </div>
                    `)}catch(e){console.error("Error loading games:",e),console.log("数据库连接失败，继续使用fallback数据..."),document.getElementById("loadingState").innerHTML=`
                    <div class="text-center py-4 mb-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mx-6">
                        <p class="text-yellow-400 text-sm mb-2">⚠️ 数据库连接失败，正在使用测试数据</p>
                        <p class="text-gray-400 text-xs">请检查Supabase配置后刷新页面</p>
                        <button onclick="location.reload()" class="bg-yellow-500 text-black px-3 py-1 rounded text-xs mt-2">重试连接</button>
                    </div>
                `,document.getElementById("loadingState").style.display="block"}}function m(){const e=document.getElementById("loadingState"),t=document.getElementById("mainGameSection"),i=document.getElementById("gameGrid");e.innerHTML.includes("数据库连接失败")||(e.style.display="none");const a=d.find(o=>o.category_tag==="drinking-topics");a&&(t.innerHTML=`
                    <div class="game-card" onclick="showGamePreview('${a.category_tag}')">
                        <div class="main-game-card main-game-fallback">
                            <div class="main-game-title">${a.name}</div>
                            <div class="main-game-subtitle">${a.description||""}</div>
                        </div>
                    </div>
                `,t.style.display="block");const r=d.filter(o=>o.category_tag!=="drinking-topics");i.innerHTML=r.map(o=>{const n=p(o.category_tag),l=o.category_tag!=="drinking-topics";return n?`
                    <div class="game-card ${l?"coming-soon":""}" onclick="showGamePreview('${o.category_tag}')">
                        <div class="game-card-content" 
                             style="background-image: url('${n}');">
                            <!-- 添加图片加载错误处理 -->
                            <img src="${n}" 
                                 style="display: none;" 
                                 onerror="this.parentElement.style.backgroundImage='none'; this.parentElement.classList.add('main-game-fallback'); this.parentElement.innerHTML='<div style=\\'padding: 16px; text-align: center;\\'><div style=\\'font-size: 16px; font-weight: bold; margin-bottom: 4px;\\'>${o.name||""}</div><div style=\\'font-size: 12px; opacity: 0.8;\\'>${o.description||""}</div></div>';">
                        </div>
                    </div>
                `:`
                        <div class="game-card ${l?"coming-soon":""}" onclick="showGamePreview('${o.category_tag}')">
                            <div class="game-card-content main-game-fallback" style="height: 240px;">
                                <div style="padding: 16px; text-align: center;">
                                    <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${o.name||""}</div>
                                    <div style="font-size: 12px; opacity: 0.8;">${o.description||""}</div>
                                </div>
                            </div>
                        </div>
                    `}).join(""),i.style.display="grid"}window.showGamePreview=function(e){console.log("Showing preview for game:",e),s=e;const t=d.find(n=>n.category_tag===e);if(!t){console.error("Game not found:",e),alert("游戏信息未找到，请刷新页面重试");return}document.getElementById("modalTitle").textContent=t.name||"未知游戏",document.getElementById("modalDescription").textContent=t.description||"暂无描述",document.getElementById("modalPlayers").textContent=t.players||"未知",document.getElementById("modalDuration").textContent=t.duration||"未知";const i=document.getElementById("modalFeatures");if(i.innerHTML="",t.features&&Array.isArray(t.features)&&t.features.length>0)t.features.forEach(n=>{if(n&&n.trim()){const l=document.createElement("span");l.className="feature-tag",l.textContent=n.trim(),i.appendChild(l)}});else{const n=document.createElement("span");n.className="feature-tag",n.textContent="休闲娱乐",n.style.opacity="0.6",i.appendChild(n)}const a=document.getElementById("startGameBtn");if(e==="drinking-topics"){a.textContent="开始游戏",a.disabled=!1,a.className="btn-start";const n=document.getElementById("modalTitle").querySelector(".coming-soon-badge");n&&n.remove()}else{a.textContent="即将推出",a.disabled=!0,a.className="btn-start opacity-50 cursor-not-allowed";const n=document.getElementById("modalTitle");if(!n.querySelector(".coming-soon-badge")){const l=document.createElement("span");l.className="coming-soon-badge bg-yellow-500 text-black text-xs px-2 py-1 rounded ml-2",l.textContent="即将推出",n.appendChild(l)}}document.getElementById("gameModal").classList.add("active"),document.body.style.overflow="hidden"};window.closeModal=function(){document.getElementById("gameModal").classList.remove("active"),s=null,document.body.style.overflow=""};window.startSelectedGame=function(){if(console.log("Starting game:",s),!s){console.error("No game selected");return}s==="drinking-topics"?(console.log("Navigating to drinking-game.html"),closeModal(),window.location.href="drinking-game.html"):console.log("Game is coming soon, not navigating")};document.getElementById("gameModal").addEventListener("click",function(e){e.target===this&&closeModal()});document.addEventListener("keydown",function(e){e.key==="Escape"&&closeModal()});document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(".game-card").forEach(t=>{t.addEventListener("touchstart",function(){this.style.transform="translateY(-2px) scale(0.98)"}),t.addEventListener("touchend",function(){this.style.transform=""})})});console.log("🚀 正在初始化应用...");m();
