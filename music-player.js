(() => {
"use strict";
const albums = window.MIDWAY_CATALOG || [];
const tracks = albums.flatMap(album => album.tracks);
const byId = new Map(tracks.map(t => [t.id,t]));
const audio = document.querySelector("#tentAudio");
const list = document.querySelector("#trackList");
const albumsEl = document.querySelector("#albumButtons");
const search = document.querySelector("#trackSearch");
const nowTitle = document.querySelector("#nowTitle");
const nowAlbum = document.querySelector("#nowAlbum");
const status = document.querySelector("#playerStatus");
const play = document.querySelector("#playToggle");
const previous = document.querySelector("#previousTrack");
const next = document.querySelector("#nextTrack");
const seek = document.querySelector("#seekTrack");
const time = document.querySelector("#trackTime");
const volume = document.querySelector("#volumeTrack");
const shuffleButton = document.querySelector("#shuffleToggle");
const repeatButton = document.querySelector("#repeatToggle");
const queue = document.querySelector("#queueCount");
let selectedAlbum = "all", current = null, shuffle = false, repeat = false;
let checked = new Map(), requestVersion = 0;
const fmt = n => Number.isFinite(n) ? `${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}` : "0:00";
function notice(message) { status.textContent = message; }
function setMedia() {
  if(!("mediaSession" in navigator) || !current) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title:current.title,artist:"Cottonmouth Clown",album:current.album
  });
  navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
}
function button(label, cls, onClick) {
  const b=document.createElement("button");
  b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",onClick);return b;
}
function renderAlbums() {
  albumsEl.replaceChildren();
  [["all","All Songs"],...albums.map(a=>[a.id,a.title])].forEach(([id,label])=>{
    const b=button(label,"music-filter"+(selectedAlbum===id?" active":""),()=>{
      selectedAlbum=id;renderAlbums();renderTracks();
    });
    b.setAttribute("aria-pressed",String(selectedAlbum===id));albumsEl.append(b);
  });
}
function visibleTracks() {
  const term=search.value.trim().toLowerCase();
  return tracks.filter(t=>(selectedAlbum==="all"||albums.some(a=>a.id===selectedAlbum && a.title===t.album)) &&
    (!term || (t.title+" "+t.album).toLowerCase().includes(term)));
}
function renderTracks() {
  list.replaceChildren();
  const visible=visibleTracks();
  queue.textContent=`${visible.length} songs`;
  if(!visible.length) { const p=document.createElement("p");p.textContent="No songs match that search.";list.append(p);return; }
  visible.forEach((t,i)=>{
    const li=document.createElement("li");li.className="jukebox-track"+(current?.id===t.id?" current":"");
    const b=button(`${String(i+1).padStart(2,"0")} · ${t.title}`,"track-select",()=>select(t));
    b.setAttribute("aria-label","Play "+t.title);
    const meta=document.createElement("span");meta.className="track-album";meta.textContent=t.album;
    li.append(b,meta);list.append(li);
  });
}
async function audioExists(src) {
  if(checked.has(src)) return checked.get(src);
  try {
    const r=await fetch(src,{method:"HEAD",cache:"no-store"});
    const ok=r.ok && /audio\/|application\/octet-stream/.test(r.headers.get("content-type")||"");
    checked.set(src,ok);return ok;
  } catch {checked.set(src,false);return false;}
}
async function select(t, autoplay=true) {
  const version=++requestVersion;
  audio.pause();audio.removeAttribute("src");audio.load();
  current=t;nowTitle.textContent=t.title;nowAlbum.textContent=t.album;
  seek.value=0;time.textContent="0:00 / 0:00";play.textContent="▶";renderTracks();
  notice("Checking available audio…");
  const exists=await audioExists(t.src);
  if(version!==requestVersion)return;
  if(!exists) {
    notice("This track's self-hosted audio hasn't been uploaded yet. Add "+t.id+".mp3 to assets/music/.");
    play.disabled=true;setMedia();return;
  }
  audio.src=t.src;play.disabled=false;notice("Ready to play");setMedia();
  if(autoplay) try {await audio.play();} catch {notice("Select Play to begin listening.");}
}
function step(direction) {
  if(!tracks.length)return;
  if(shuffle && direction>0) {
    const alternatives=tracks.filter(t=>t.id!==current?.id);
    return select(alternatives[Math.floor(Math.random()*alternatives.length)]||tracks[0]);
  }
  const index=tracks.findIndex(t=>t.id===current?.id);
  select(tracks[(index+direction+tracks.length)%tracks.length]);
}
play.addEventListener("click",async()=>{
  if(!current)return select(tracks[0]);
  if(audio.paused)try {await audio.play();}catch {notice("Playback unavailable.");}
  else audio.pause();
});
previous.addEventListener("click",()=>step(-1));
next.addEventListener("click",()=>step(1));
search.addEventListener("input",renderTracks);
shuffleButton.addEventListener("click",()=>{shuffle=!shuffle;shuffleButton.setAttribute("aria-pressed",String(shuffle));});
repeatButton.addEventListener("click",()=>{repeat=!repeat;repeatButton.setAttribute("aria-pressed",String(repeat));});
audio.addEventListener("play",()=>{play.textContent="❚❚";notice("Now playing");setMedia();});
audio.addEventListener("pause",()=>{play.textContent="▶";setMedia();});
audio.addEventListener("timeupdate",()=>{
  if(Number.isFinite(audio.duration)&&audio.duration>0)seek.value=String(audio.currentTime/audio.duration*100);
  time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
});
seek.addEventListener("input",()=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(seek.value)/100;});
volume.addEventListener("input",()=>{audio.volume=Number(volume.value)/100;});
audio.addEventListener("ended",()=>repeat? (audio.currentTime=0,audio.play()):step(1));
audio.addEventListener("error",()=>{notice("Audio file could not be played. Check that its MP3 is published correctly.");play.disabled=true;});
if("mediaSession" in navigator){
  navigator.mediaSession.setActionHandler("play",()=>play.click());
  navigator.mediaSession.setActionHandler("pause",()=>audio.pause());
  navigator.mediaSession.setActionHandler("previoustrack",()=>step(-1));
  navigator.mediaSession.setActionHandler("nexttrack",()=>step(1));
  navigator.mediaSession.setActionHandler("seekto",({seekTime})=>{if(Number.isFinite(seekTime))audio.currentTime=seekTime;});
}
renderAlbums();renderTracks();
notice("Select a track. Playback requires self-hosted MP3 files.");
})();