const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const NIL=document.createElement("input"),$=(s,r=document)=>r.querySelector(s)||NIL,$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ic=(n,c="")=>`<svg class="i ${c}"><use href="#i-${n}"/></svg>`;
/* EDIT HERE: ["Title",year,"m:ss","download link","audio link"] */
const songs=[["Mount Zion",2026,"","",""]].map((a,i)=>({id:"s"+i,t:a[0],y:a[1],d:a[2],u:a[3],a:a[4]}));
/* EDIT HERE: ["Event","Sun 15 Nov","Place"] */
const events=[];
let latest=songs[0];
/* EDIT HERE: booking email and social links */
const CONTACT="regiegospel4102@gmail.com",LINKS={YouTube:"",Instagram:"",TikTok:"",Facebook:""};
const COVER="assets/cover.jpg";
let saved=new Set(),cur=null,playing=false,prog=0,filt="all";
try{saved=new Set(JSON.parse(localStorage.getItem("rg-saved")||"[]"))}catch(e){}
const persist=()=>{try{localStorage.setItem("rg-saved",JSON.stringify([...saved]))}catch(e){}};
const songRow=(s,i)=>`<div class="row-i glass" data-id="${s.id}"><img class="th" src="${COVER}" alt=""><div class="meta"><b>${s.t}</b><small>${s.a?"Single":"Upcoming single"}${s.y?", "+s.y:""}</small></div><span class="dur">${s.d||"Soon"}</span><button class="ib" data-act="play" aria-label="Play ${s.t}">${ic("play","f")}</button><button class="ib ${saved.has(s.id)?"on":""}" data-act="save" aria-label="Save ${s.t}">${ic("mark")}</button><button class="ib" data-act="dl" aria-label="Download ${s.t}">${ic("dl")}</button></div>`;
const evRow=e=>`<div class="row-i glass"><span class="num dt">${e[1]}</span><div class="meta"><b>${e[0]}</b><small>${e[2]}</small></div><button class="ib" data-act="notify" aria-label="Remind me about ${e[0]}">${ic("cal")}</button></div>`;
const empty=t=>`<div class="glass empty">${t}</div>`;
function renderSaved(){const l=songs.filter(s=>saved.has(s.id));$("#saved").innerHTML=l.length?l.map(songRow).join(""):empty("Nothing saved yet. Tap the bookmark on any song.");sync()}
function renderSearch(){const q=$("#q").value.trim().toLowerCase();let h="";
if(filt!=="events")h+=songs.filter(s=>s.t.toLowerCase().includes(q)).map(songRow).join("");
if(filt!=="songs")h+=events.filter(e=>(e[0]+e[2]).toLowerCase().includes(q)).map(evRow).join("");
$("#results").innerHTML=h||empty("No matches. Try another word.");sync()}
function renderAll(){$("#songs").innerHTML=songs.map(songRow).join("");$("#events").innerHTML=events.length?events.map(evRow).join(""):empty("No events announced yet. Check back soon.");renderSaved();renderSearch()}
const secs=d=>{const p=d.split(":");return +p[0]*60+ +p[1]};
function sync(){
$$(".row-i[data-id]").forEach(r=>{const on=cur&&r.dataset.id===cur.id;r.classList.toggle("cur",!!on);$("[data-act=play] use",r).setAttribute("href",on&&playing?"#i-pause":"#i-play")});
$("#mini").classList.toggle("on",!!cur);document.body.classList.toggle("playing",playing);
if(cur){$("#mt").innerHTML=cur.t;$("#ms").textContent=cur.a?"Now playing":"Audio link coming soon";$("#mi use").setAttribute("href",playing?"#i-pause":"#i-play")}}
let au=new Audio();
function load(x){au.pause();au=new Audio(x.a||"");au.onended=next;cur=x;prog=0}
function next(){load(songs[(songs.indexOf(cur)+1)%songs.length]);if(cur.a&&playing)au.play().catch(()=>{});sync()}
function play(id){const t=songs.find(x=>x.id===id);if(t&&!t.a){toast(t.t+" is coming soon");return}if(cur&&cur.id===id)playing=!playing;else{load(songs.find(x=>x.id===id));playing=true}
if(cur.a){playing?au.play().catch(()=>{playing=false;sync()}):au.pause()}sync()}
setInterval(()=>{if(!playing||!cur)return;let d=secs(cur.d);if(cur.a){prog=au.currentTime;d=au.duration||d}else{prog+=.25;if(prog>=d){next();return}}$("#mb").style.width=Math.min(100,prog/d*100)+"%"},250);
let tt;function toast(m){const t=$("#toast");t.innerHTML=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2400)}
function theme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem("rg-theme",t)}catch(e){}}
try{const t0=localStorage.getItem("rg-theme");if(t0)theme(t0)}catch(e){}
document.addEventListener("click",e=>{
const f=e.target.closest("[data-f]");if(f){filt=f.dataset.f;$$("[data-f]").forEach(x=>x.classList.toggle("pri",x===f));renderSearch();return}
const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act,r=b.closest("[data-id]"),id=r&&r.dataset.id;
if(a==="play")play(id);
else if(a==="toggle"&&cur)play(cur.id);
else if(a==="playlatest")play(latest.id);
else if(a==="save"){saved.has(id)?saved.delete(id):saved.add(id);persist();$$(`[data-id="${id}"] [data-act=save]`).forEach(x=>x.classList.toggle("on",saved.has(id)));renderSaved();toast(saved.has(id)?"Saved to your list":"Removed from your list")}
else if(a==="dl"){const x=songs.find(y=>y.id===id);x&&x.u?window.open(x.u,"_blank","noopener"):toast("Download link coming soon")}
else if(a==="notify")toast("Reminders are coming soon");
else if(a==="send"){const v=$$("#contact .inp").map(x=>x.value.trim());if(!CONTACT)toast("Contact is not connected yet");else if(!v[2])toast("Write a message first");else location.href=`mailto:${CONTACT}?subject=${encodeURIComponent("Message from "+(v[0]||"the website"))}&body=${encodeURIComponent(v[2]+"\n\n"+v[0]+" "+v[1])}`}
else if(a==="soc"){const u=LINKS[b.textContent];u?window.open(u,"_blank","noopener"):toast("Link coming soon")}
else if(a==="theme")theme(document.documentElement.dataset.theme==="dark"?"light":"dark")});
document.addEventListener("pointerdown",e=>{const el=e.target.closest(".btn,.ib,.row-i,.tabs a");if(!el)return;
const r=el.getBoundingClientRect(),d=Math.max(r.width,r.height)*2.2,s=document.createElement("span");s.className="rip";
s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;el.appendChild(s);setTimeout(()=>s.remove(),850)});
$("#q").addEventListener("input",renderSearch);
const views=["home","music","events","search","saved"];
function route(){const i=views.indexOf(document.body.dataset.page),p=$(".pill");
if(i<0){p.style.display="none";return}
$$(".tabs a").forEach((a,j)=>a.classList.toggle("on",j===i));
let prev=i;try{const s=sessionStorage.getItem("rg-tab");if(s!==null&&+s>=0&&+s<views.length)prev=+s}catch(e){}
p.style.transition="none";p.style.transform=`translateX(${prev*100}%)`;void p.offsetWidth;p.style.transition="";
p.style.transform=`translateX(${i*100}%)`;
if(prev!==i){p.classList.remove("sq");void p.offsetWidth;p.classList.add("sq")}
try{sessionStorage.setItem("rg-tab",i)}catch(e){}}
const sc=$$(".scenes i"),vs=[["Be still, and know that I am God.","Psalm 46:10"],["The Lord is my light and my salvation.","Psalm 27:1"],["Sing unto the Lord a new song.","Psalm 96:1"]];let si=0;try{si=+sessionStorage.getItem("rg-si")||0}catch(e){}
function scene(){try{sessionStorage.setItem("rg-si",si)}catch(e){}sc.forEach((s,i)=>s.classList.toggle("on",i===si%sc.length));const v=$("#verse");v.style.opacity=0;setTimeout(()=>{v.innerHTML=`“${vs[si][0]}”<br><small>${vs[si][1]}</small>`;v.style.opacity=1},350)}
setInterval(()=>{si=(si+1)%3;scene()},5500);
const goo=$(".goo"),dots=[...Array(7)].map((_,i)=>{const d=document.createElement("i");d.style.scale=1-i*.11;goo.appendChild(d);return{d,x:-99,y:-99}});
let tx=-99,ty=-99,gt;
addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;goo.classList.add("on");clearTimeout(gt);if(e.pointerType!=="mouse")gt=setTimeout(()=>goo.classList.remove("on"),700)});
(function loop(){let px=tx,py=ty;dots.forEach((o,i)=>{const k=.36-i*.035;o.x+=(px-o.x)*k;o.y+=(py-o.y)*k;o.d.style.transform=`translate(${o.x}px,${o.y}px)`;px=o.x;py=o.y});requestAnimationFrame(loop)})();
if(!CONTACT)$("#contact").style.display="none";
function socVis(){const s=$("#social");$$("#social .btn").forEach(b=>b.style.display=LINKS[b.textContent]?"":"none");s.style.display=Object.values(LINKS).some(Boolean)?"":"none"}
socVis();
renderAll();scene();route();
/* keep the liquid background moving from where it was on the previous page */
(function(){let t0=Date.now();try{t0=+sessionStorage.getItem("rg-t0")||0;if(!t0){t0=Date.now();sessionStorage.setItem("rg-t0",t0)}}catch(e){}
const el=Date.now()-t0;$$(".blob").forEach(b=>b.getAnimations().forEach(a=>{a.currentTime=el}))})();
/* Content from the admin page (Firestore). Falls back to the built-in values if nothing is saved. */
window.rgApply=function(d){
if(d.songs&&d.songs.length){
const L=d.songs.map(s=>({id:"d_"+s.id,t:esc(s.title||""),y:s.year||"",d:s.duration||"",u:s.download||"",a:s.audio||"",c:s.createdAt&&s.createdAt.toMillis?s.createdAt.toMillis():0}));
L.sort((a,b)=>b.c-a.c);latest=L[0];L.sort((a,b)=>a.t.localeCompare(b.t));
songs.length=0;songs.push(...L)}
if(d.events){events.length=0;const today=new Date().toISOString().slice(0,10);
d.events.filter(e=>e.date&&e.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).forEach(e=>events.push([esc(e.title||""),new Date(e.date+"T00:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),esc(e.place||"")]))}
const s=d.settings||{};if(s.social)Object.assign(LINKS,s.social);
renderAll();socVis();if(window.rgHome)window.rgHome(d)};
