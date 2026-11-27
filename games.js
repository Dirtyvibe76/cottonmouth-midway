(() => {
"use strict";
const $ = id => document.getElementById(id);
const pick = n => Math.floor(Math.random()*n);
const getBest = key => {try {return Math.max(0,Number(localStorage.getItem("midway-game-"+key))||0)}catch{return 0}};
function saveBest(key,score){if(score>getBest(key)){try{localStorage.setItem("midway-game-"+key,String(score))}catch{}}}
function gameButton(label,cls,callback) {
 const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",callback);return b;
}
const balloon={running:false,points:0,left:20,timer:null,positions:[],els:[]};
function balloonTarget(i){
 if(!balloon.running)return;
 const b=balloon.els[i];
 if(b.disabled)return;
 const gold=b.dataset.gold==="true";
 balloon.points+=gold?3:1;$("balloonScore").textContent=balloon.points;
 b.disabled=true;b.classList.add("popped");b.textContent="✦";
 setTimeout(()=>{if(balloon.running)resetBalloon(i)},320);
}
function resetBalloon(i){
 const b=balloon.els[i];const gold=Math.random()<.16;
 b.dataset.gold=String(gold);b.className="balloon-target"+(gold?" golden":"");
 b.textContent=gold?"★":"●";b.disabled=!balloon.running;
 b.setAttribute("aria-label",gold?"Pop golden balloon, 3 points":"Pop balloon, 1 point");
}
for(let i=0;i<12;i++){
 const b=gameButton("●","balloon-target",()=>balloonTarget(i));
 b.disabled=true;$("balloonBoard").append(b);balloon.els.push(b);
}
function stopBalloon(){
 balloon.running=false;clearInterval(balloon.timer);
 balloon.els.forEach(b=>b.disabled=true);saveBest("balloon",balloon.points);
 $("balloonBest").textContent=getBest("balloon");
 $("balloonStart").disabled=false;$("balloonStart").textContent="🎟 PLAY AGAIN";
 $("balloonMessage").textContent="Round over! You scored "+balloon.points+" points. Heh heh heh!";
}
$("balloonStart").addEventListener("click",()=>{
 clearInterval(balloon.timer);balloon.running=true;balloon.points=0;balloon.left=20;
 $("balloonScore").textContent=0;$("balloonTime").textContent=20;
 $("balloonStart").disabled=true;$("balloonMessage").textContent="POP 'EM!";
 balloon.els.forEach((b,i)=>resetBalloon(i));
 balloon.timer=setInterval(()=>{balloon.left--;$("balloonTime").textContent=balloon.left;if(balloon.left<=0)stopBalloon()},1000);
});
$("balloonBest").textContent=getBest("balloon");

const clown={running:false,points:0,left:20,target:-1,interval:null,timer:null,boxes:[]};
for(let i=0;i<9;i++){
 const b=gameButton("▣","clown-hole",()=>{
   if(!clown.running||clown.target!==i)return;
   clown.points++;$("clownScore").textContent=clown.points;
   clown.target=-1;b.textContent="💥";b.classList.remove("active");b.setAttribute("aria-label","Empty box");
 });
 b.disabled=true;b.setAttribute("aria-label","Empty box");
 $("clownBoard").append(b);clown.boxes.push(b);
}
function moveClown(){
 clown.boxes.forEach(b=>{b.textContent="▣";b.classList.remove("active");b.setAttribute("aria-label","Empty box")});
 clown.target=pick(clown.boxes.length);
 const b=clown.boxes[clown.target];b.textContent="🤡";b.classList.add("active");b.setAttribute("aria-label","Whack this clown");
}
function stopClown(){
 clown.running=false;clearInterval(clown.interval);clearInterval(clown.timer);clown.target=-1;
 clown.boxes.forEach(b=>{b.disabled=true;b.textContent="▣";b.classList.remove("active")});
 saveBest("clown",clown.points);$("clownBest").textContent=getBest("clown");
 $("clownStart").disabled=false;$("clownStart").textContent="🎟 PLAY AGAIN";
 $("clownMessage").textContent="Show's over! You got "+clown.points+" clowns.";
}
$("clownStart").addEventListener("click",()=>{
 clearInterval(clown.timer);clearInterval(clown.interval);
 clown.running=true;clown.points=0;clown.left=20;
 $("clownTime").textContent=20;$("clownScore").textContent=0;$("clownStart").disabled=true;
 $("clownMessage").textContent="GET THOSE CLOWNS!";
 clown.boxes.forEach(b=>b.disabled=false);moveClown();
 clown.interval=setInterval(moveClown,720);
 clown.timer=setInterval(()=>{clown.left--;$("clownTime").textContent=clown.left;if(clown.left<=0)stopClown()},1000);
});
$("clownBest").textContent=getBest("clown");

const striker={running:false,swings:3,score:0,power:0,last:0,raf:0};
function strikerFrame(t){
 if(!striker.running)return;
 // Independent of the display's frame rate. Full bar cycle ≈ 1.7s.
 striker.power=(Math.sin(t/270)+1)/2;
 $("strikerMarker").style.left=(striker.power*100)+"%";
 striker.raf=requestAnimationFrame(strikerFrame);
}
function stopStriker(){
 striker.running=false;cancelAnimationFrame(striker.raf);$("strikerHit").disabled=true;
 $("strikerStart").disabled=false;$("strikerStart").textContent="🎟 PLAY AGAIN";
 saveBest("striker",striker.score);$("strikerBest").textContent=getBest("striker");
 $("strikerMessage").textContent="Round over! Total: "+striker.score+" out of 300.";
}
$("strikerStart").addEventListener("click",()=>{
 cancelAnimationFrame(striker.raf);striker.running=true;striker.swings=3;striker.score=0;
 $("strikerSwings").textContent=3;$("strikerScore").textContent=0;
 $("strikerStart").disabled=true;$("strikerHit").disabled=false;
 $("strikerMessage").textContent="TIME YOUR SWING!";
 $("strikerPower").textContent="Aim for the center!";striker.raf=requestAnimationFrame(strikerFrame);
});
$("strikerHit").addEventListener("click",()=>{
 if(!striker.running)return;
 const distance=Math.abs(striker.power-.5);
 const points=Math.max(0,Math.round(100*(1-distance*2)**2));
 striker.score+=points;striker.swings--;
 $("strikerScore").textContent=striker.score;$("strikerSwings").textContent=striker.swings;
 $("strikerPower").textContent=points>=90?"DING! PERFECT HIT — "+points+"!":points>=60?"THAT'S A HIT! "+points+" points!":"CLANG! "+points+" points!";
 if(striker.swings<=0)stopStriker();
});
$("strikerBest").textContent=getBest("striker");
// Give an obvious affordance to keyboard players, too.
document.addEventListener("keydown",e=>{
 if(e.code==="Space"&&striker.running&&document.activeElement===document.body){e.preventDefault();$("strikerHit").click()}
});
window.addEventListener("pagehide",()=>{
 clearInterval(balloon.timer);clearInterval(clown.timer);clearInterval(clown.interval);
 cancelAnimationFrame(striker.raf);
});
})();