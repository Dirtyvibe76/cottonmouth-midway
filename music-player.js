"use strict";
const player = document.getElementById("tentAudio");
const titleEl = document.getElementById("currentTrack");
const albumEl = document.getElementById("currentAlbum");
const statusEl = document.getElementById("playerStatus");
const libraryEl = document.getElementById("musicLibrary");
const prevButton = document.getElementById("previousTrack");
const nextButton = document.getElementById("nextTrack");
let tracks = [];
let playingIndex = -1;
const availability = new Map();
const setStatus = message => { statusEl.textContent = message; };

function selectedTrack(index, autoplay = false) {
  if (!availability.get(index)) return;
  playingIndex = index;
  const track = tracks[index];
  titleEl.textContent = track.title;
  albumEl.textContent = track.album || "Cottonmouth Clown";
  player.src = track.src;
  player.load();
  setStatus("Ready to play.");
  document.querySelectorAll(".tent-track").forEach((button) => {
    button.setAttribute("aria-current", String(Number(button.dataset.index) === index));
  });
  prevButton.disabled = previousAvailable(index) === -1;
  nextButton.disabled = nextAvailable(index) === -1;
  if (autoplay) player.play().catch(() => setStatus("Press play to listen."));
}
function previousAvailable(index) {
  for (let i = index - 1; i >= 0; i--) if (availability.get(i)) return i;
  return -1;
}
function nextAvailable(index) {
  for (let i = index + 1; i < tracks.length; i++) if (availability.get(i)) return i;
  return -1;
}
prevButton.addEventListener("click", () => {
  const previous = previousAvailable(playingIndex);
  if (previous !== -1) selectedTrack(previous, true);
});
nextButton.addEventListener("click", () => {
  const next = nextAvailable(playingIndex);
  if (next !== -1) selectedTrack(next, true);
});
player.addEventListener("ended", () => {
  const next = nextAvailable(playingIndex);
  if (next !== -1) selectedTrack(next, true);
});
player.addEventListener("error", () => setStatus("This audio could not be played. Please try another track."));

// Confirm a real audio file exists before enabling the song. The website
// does not pretend missing MP3s are playable.
async function isAvailable(src) {
  try {
    const response = await fetch(src, { method: "HEAD", cache: "no-store" });
    return response.ok && (response.headers.get("content-type") || "").toLowerCase().includes("audio");
  } catch (_) {
    return false;
  }
}
async function initialize() {
  try {
    const response = await fetch("music-library.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Music catalog unavailable");
    const data = await response.json();
    tracks = Array.isArray(data.tracks) ? data.tracks : [];
    const grouped = new Map();
    tracks.forEach((track, i) => {
      const album = track.album || "Singles";
      if (!grouped.has(album)) grouped.set(album, []);
      grouped.get(album).push([track, i]);
    });
    grouped.forEach((entries, album) => {
      const section = document.createElement("section");
      section.className = "tent-album";
      const heading = document.createElement("h3");
      heading.textContent = album;
      section.append(heading);
      const list = document.createElement("ol");
      list.className = "tent-song-list";
      entries.forEach(([track, i]) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.className = "tent-track";
        button.dataset.index = i;
        button.textContent = track.title;
        button.disabled = true;
        button.title = "Audio not yet hosted";
        button.addEventListener("click", () => selectedTrack(i, true));
        li.append(button);
        list.append(li);
      });
      section.append(list);
      libraryEl.append(section);
    });
    await Promise.all(tracks.map(async (track, i) => {
      const available = await isAvailable(track.src);
      availability.set(i, available);
      const button = document.querySelector(`.tent-track[data-index="${i}"]`);
      if (button) {
        button.disabled = !available;
        button.title = available ? "Play on the Midway" : "Audio not yet hosted";
      }
    }));
    const ready = tracks.map((track, i) => ({ track, i })).filter(({ i }) => availability.get(i));
    if (!ready.length) {
      setStatus("The tracklist is ready. Audio files still need to be uploaded to activate playback.");
      return;
    }
    // Releases with dates take priority; otherwise use the last playable catalog entry.
    ready.sort((a,b) => (b.track.releaseDate || "").localeCompare(a.track.releaseDate || "") || b.i - a.i);
    selectedTrack(ready[0].i);
    setStatus("Ready. Press play to listen.");
  } catch (error) {
    setStatus("The music library could not be loaded.");
    console.error(error);
  }
}
initialize();
