(() => {
"use strict";
const lineup=document.getElementById("artistLineup");
const search=document.getElementById("artistSearch");
const count=document.getElementById("artistCount");
const artistTitle=document.getElementById("stageArtist");
const songTitle=document.getElementById("stageSong");
const desc=document.getElementById("stageDescription");
const videoContainer=document.getElementById("videoContainer");
const channelLink=document.getElementById("stageChannel");
const videoLink=document.getElementById("stageVideo");
let artists=[];
let selected=null;

// Keep embeds and outgoing links limited to legitimate YouTube URLs.
function parseVideo(value) {
  try {
    const url=new URL(value);
    const host=url.hostname.toLowerCase();
    let id="";
    if(host==="youtu.be"||host==="www.youtu.be") id=url.pathname.split("/")[1];
    if(["youtube.com","www.youtube.com","m.youtube.com","music.youtube.com","www.youtube-nocookie.com"].includes(host)) {
      if(url.pathname==="/watch") id=url.searchParams.get("v")||"";
      else if(/^\/(shorts|embed|live)\//.test(url.pathname)) id=url.pathname.split("/")[2];
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id)?id:null;
  } catch {return null;}
}
function parseChannel(value) {
  try {
    const url=new URL(value);
    if(url.protocol!=="https:")return null;
    if(!["youtube.com","www.youtube.com","m.youtube.com"].includes(url.hostname.toLowerCase()))return null;
    if(!/^\/(?:@[^/?#]+|channel\/[A-Za-z0-9_-]+|c\/[A-Za-z0-9_-]+|user\/[A-Za-z0-9_-]+)\/?$/.test(url.pathname))return null;
    url.search="";url.hash="";
    return url.toString();
  }catch{return null;}
}
function textNode(type,cls,value) {
  const e=document.createElement(type);if(cls)e.className=cls;e.textContent=value;return e;
}
function showError(message) {
  lineup.replaceChildren(textNode("p","bigtop-empty",message));
  count.textContent="";
}
function choose(artist,video,button) {
  const id=parseVideo(video.url);
  if(!id)return;
  selected={artist,video};
  artistTitle.textContent=artist.name;
  songTitle.textContent=video.title;
  desc.textContent=artist.description||"Discover this artist and support their channel.";
  channelLink.href=artist.channel;
  channelLink.classList.remove("hidden");
  videoLink.href="https://www.youtube.com/watch?v="+id;
  videoLink.classList.remove("hidden");
  // Replacing the iframe stops any previous performance. No autoplay.
  const frame=document.createElement("iframe");
  frame.src="https://www.youtube-nocookie.com/embed/"+id+"?rel=0";
  frame.title=video.title+" by "+artist.name+" — YouTube player";
  frame.allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen=true;
  frame.referrerPolicy="strict-origin-when-cross-origin";
  frame.loading="lazy";
  videoContainer.replaceChildren(frame);
  document.querySelectorAll(".bigtop-song-button").forEach(b=>b.setAttribute("aria-pressed","false"));
  if(button)button.setAttribute("aria-pressed","true");
  document.querySelector(".bigtop-stage").scrollIntoView({behavior:"smooth",block:"start"});
}
function render() {
  const term=search.value.trim().toLowerCase();
  const filtered=artists.filter(a=>(a.name+" "+a.description+" "+a.videos.map(v=>v.title).join(" ")).toLowerCase().includes(term));
  lineup.replaceChildren();
  count.textContent=filtered.length+" "+(filtered.length===1?"artist":"artists");
  if(!artists.length){
    showError("The Big Top is ready for its first guest. Featured artists will appear here once added to the lineup.");
    return;
  }
  if(!filtered.length){lineup.append(textNode("p","bigtop-empty","No acts match that search."));return;}
  filtered.forEach(artist=>{
    const card=document.createElement("article");card.className="bigtop-artist-card";
    card.append(textNode("p","bigtop-kicker","GUEST ARTIST"),textNode("h3","",artist.name));
    if(artist.description)card.append(textNode("p","bigtop-artist-description",artist.description));
    const songs=document.createElement("div");songs.className="bigtop-song-list";
    artist.videos.forEach(video=>{
      const b=document.createElement("button");
      b.type="button";b.className="bigtop-song-button";
      b.textContent="▶ "+video.title;
      b.setAttribute("aria-label","Play "+video.title+" by "+artist.name);
      b.setAttribute("aria-pressed",String(selected?.video.url===video.url));
      b.addEventListener("click",()=>choose(artist,video,b));
      songs.append(b);
    });
    if(!artist.videos.length) songs.append(textNode("p","bigtop-artist-description","Visit the artist's channel to hear their music. Featured videos will be added soon."));
    card.append(songs);
    const link=document.createElement("a");
    link.href=artist.channel;link.target="_blank";link.rel="noopener noreferrer";
    link.className="bigtop-channel-link";link.textContent="Visit "+artist.name+"'s YouTube Channel ↗";
    card.append(link);lineup.append(card);
  });
}
async function load() {
  try {
    const response=await fetch("bigtop-artists.json",{cache:"no-cache"});
    if(!response.ok)throw new Error("Lineup could not be loaded.");
    const data=await response.json();
    if(!Array.isArray(data.artists))throw new Error("The lineup configuration is invalid.");
    artists=data.artists.map(a=>{
      if(!a || typeof a.name!=="string" || !a.name.trim() || !parseChannel(a.channel))return null;
      const videos=Array.isArray(a.videos)?a.videos.filter(v=>v&&typeof v.title==="string"&&v.title.trim()&&typeof v.url==="string"&&parseVideo(v.url)):[];
      return {name:a.name.trim().slice(0,100),description:typeof a.description==="string"?a.description.slice(0,600):"",channel:parseChannel(a.channel),videos:videos.slice(0,15)};
    }).filter(Boolean);
    render();
    // Spotlight the first curated track without auto-playing or contacting YouTube.
    if(artists.length){
      const first=artists[0],video=first.videos[0];
      artistTitle.textContent=first.name;
      songTitle.textContent=video?"Featured song: "+video.title:"Discover their music on YouTube";
      desc.textContent=first.description||"Select Play on a track to watch here.";
      channelLink.href=first.channel;channelLink.classList.remove("hidden");
      if(video){videoLink.href="https://www.youtube.com/watch?v="+parseVideo(video.url);videoLink.classList.remove("hidden");}
      else videoLink.classList.add("hidden");
      if(video){
        const play=document.createElement("button");play.type="button";play.className="bigtop-preview-button";
        play.textContent="▶ PLAY FEATURED PERFORMANCE";
        play.addEventListener("click",()=>choose(first,video,null));
        videoContainer.replaceChildren(play);
      }else{
        const container=document.createElement("div");container.className="bigtop-video-placeholder";
        container.append(textNode("span","","🎙️"),textNode("strong","","DISCOVER BLIND RIVER JOHNSON"));
        const link=document.createElement("a");link.href=first.channel;link.target="_blank";link.rel="noopener noreferrer";link.className="listen-button";link.textContent="LISTEN ON THEIR CHANNEL ↗";
        container.append(link);videoContainer.replaceChildren(container);
      }
    }
  }catch(err){showError("The lineup is temporarily unavailable. Please check back soon.");}
}
search.addEventListener("input",render);
load();
})();
