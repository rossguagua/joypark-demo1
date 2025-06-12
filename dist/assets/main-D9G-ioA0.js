const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/supabase-BQMwcYa0.js","assets/preload-helper-CS1eXPs2.js"])))=>i.map(i=>d[i]);
import{_ as g}from"./preload-helper-CS1eXPs2.js";let d=[{id:"1",name:"聊天破冰盲盒",category_tag:"drinking-topics",description:"打破沉默，开启话题",features:["破冰利器","话题丰富","氛围轻松"],players:"2-8人",duration:"15-30分钟",is_active:!0,created_at:new Date().toISOString()},{id:"2",name:"心理测试游戏",category_tag:"party-psychology",description:"趣味心理测试",features:["心理测试","趣味互动"],players:"2-6人",duration:"20-40分钟",is_active:!0,created_at:new Date().toISOString()},{id:"3",name:"德州扑克",category_tag:"poker",description:"经典扑克游戏",features:["策略游戏","经典玩法"],players:"3-8人",duration:"30-60分钟",is_active:!0,created_at:new Date().toISOString()}],c;(async function(){try{c=(await g(()=>import("./supabase-BQMwcYa0.js"),__vite__mapDeps([0,1]))).getGames,console.log("✅ Supabase模块加载成功"),console.log("🔄 尝试从数据库加载数据..."),u()}catch(n){console.warn("⚠️ Supabase模块加载失败，使用fallback数据:",n),c=null,document.getElementById("loadingState").innerHTML=`
                    <div class="text-center py-2 mb-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mx-6">
                        <p class="text-yellow-400 text-sm">⚠️ 数据库模块未加载，使用本地数据</p>
                    </div>
                `,document.getElementById("loadingState").style.display="block",m()}})();let s=null;function p(e){if(e==="drinking-topics")return null;const a={"battle-royale":"battle-royale.png","party-psychology":"party-psychology.png",poker:"poker.png","love-battle":"love-battle.png","moon-night":"moon-night.png","man-di-piao-ling":"man-di-piao-ling.png","kiss-marks":"kiss-marks.png",wisdom:"wisdom.png"}[e];return a?`images/covers/${a}`:(console.warn(`Cover image for ${e} not found in mapping.`),null)}async function u(){try{console.log("Loading games from database...");const e=performance.now(),n=new Promise((r,o)=>{setTimeout(()=>o(new Error("Database connection timeout")),5e3)}),a=await Promise.race([c(),n]),i=performance.now()-e;console.log(`Games loaded in ${i.toFixed(2)}ms:`,a),a&&a.length>0?(d=a,m(),document.getElementById("loadingState").style.display="none",console.log("✅ 数据库数据加载成功，已替换fallback数据")):(console.log("⚠️ 数据库返回空数据，继续使用fallback数据"),document.getElementById("loadingState").innerHTML=`
                        <div class="text-center py-2 mb-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mx-6">
                            <p class="text-yellow-400 text-sm">⚠️ 数据库数据为空，正在使用测试数据</p>
                        </div>
                    `)}catch(e){console.error("Error loading games:",e),console.log("数据库连接失败，继续使用fallback数据..."),document.getElementById("loadingState").innerHTML=`
                    <div class="text-center py-4 mb-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mx-6">
                        <p class="text-yellow-400 text-sm mb-2">⚠️ 数据库连接失败，正在使用测试数据</p>
                        <p class="text-gray-400 text-xs">请检查Supabase配置后刷新页面</p>
                        <button onclick="location.reload()" class="bg-yellow-500 text-black px-3 py-1 rounded text-xs mt-2">重试连接</button>
                    </div>
                `,document.getElementById("loadingState").style.display="block",m()}}function m(){const e=document.getElementById("loadingState"),n=document.getElementById("mainGameSection"),a=document.getElementById("gameGrid");e.innerHTML.includes("数据库连接失败")||(e.style.display="none");const i=d.find(o=>o.category_tag==="drinking-topics");i&&(n.innerHTML=`
                    <div class="game-card" onclick="showGamePreview('${i.category_tag}')">
                        <div class="main-game-card main-game-fallback">
                            <div class="main-game-title">${i.name}</div>
                            <div class="main-game-subtitle">${i.description||""}</div>
                        </div>
                    </div>
                `,n.style.display="block");const r=d.filter(o=>o.category_tag!=="drinking-topics");a.innerHTML=r.map(o=>{const t=p(o.category_tag),l=o.category_tag!=="drinking-topics";return t?`
                    <div class="game-card ${l?"coming-soon":""}" onclick="showGamePreview('${o.category_tag}')">
                        <div class="game-card-content" 
                             style="background-image: url('${t}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                            <!-- 隐藏的img标签用于检测加载失败 -->
                            <img src="${t}" 
                                 style="display: none;" 
                                 onload="console.log('Image loaded:', '${t}')"
                                 onerror="console.error('Image failed to load:', '${t}'); 
                                         this.parentElement.style.backgroundImage='none'; 
                                         this.parentElement.classList.add('main-game-fallback'); 
                                         this.parentElement.innerHTML='<div style=\\'padding: 16px; text-align: center;\\'><div style=\\'font-size: 16px; font-weight: bold; margin-bottom: 4px;\\'>${o.name||""}</div><div style=\\'font-size: 12px; opacity: 0.8;\\'>${o.description||""}</div></div>';">
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
                    `}).join(""),a.style.display="grid"}window.showGamePreview=function(e){console.log("Showing preview for game:",e),s=e;const n=d.find(t=>t.category_tag===e);if(!n){console.error("Game not found:",e),alert("游戏信息未找到，请刷新页面重试");return}document.getElementById("modalTitle").textContent=n.name||"未知游戏",document.getElementById("modalDescription").textContent=n.description||"暂无描述",document.getElementById("modalPlayers").textContent=n.players||"未知",document.getElementById("modalDuration").textContent=n.duration||"未知";const a=document.getElementById("modalFeatures");if(a.innerHTML="",n.features&&Array.isArray(n.features)&&n.features.length>0)n.features.forEach(t=>{if(t&&t.trim()){const l=document.createElement("span");l.className="feature-tag",l.textContent=t.trim(),a.appendChild(l)}});else{const t=document.createElement("span");t.className="feature-tag",t.textContent="休闲娱乐",t.style.opacity="0.6",a.appendChild(t)}const i=document.getElementById("startGameBtn");if(e==="drinking-topics"){i.textContent="开始游戏",i.disabled=!1,i.className="btn-start";const t=document.getElementById("modalTitle").querySelector(".coming-soon-badge");t&&t.remove()}else{i.textContent="即将推出",i.disabled=!0,i.className="btn-start opacity-50 cursor-not-allowed";const t=document.getElementById("modalTitle");if(!t.querySelector(".coming-soon-badge")){const l=document.createElement("span");l.className="coming-soon-badge bg-yellow-500 text-black text-xs px-2 py-1 rounded ml-2",l.textContent="即将推出",t.appendChild(l)}}document.getElementById("gameModal").classList.add("active"),document.body.style.overflow="hidden"};window.closeModal=function(){document.getElementById("gameModal").classList.remove("active"),s=null,document.body.style.overflow=""};window.startSelectedGame=function(){if(console.log("Starting game:",s),!s){console.error("No game selected");return}s==="drinking-topics"?(console.log("Navigating to drinking-game.html"),closeModal(),window.location.href="drinking-game.html"):console.log("Game is coming soon, not navigating")};document.getElementById("gameModal").addEventListener("click",function(e){e.target===this&&closeModal()});document.addEventListener("keydown",function(e){e.key==="Escape"&&closeModal()});document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(".game-card").forEach(n=>{n.addEventListener("touchstart",function(){this.style.transform="translateY(-2px) scale(0.98)"}),n.addEventListener("touchend",function(){this.style.transform=""})})});console.log("🚀 正在初始化应用...");
