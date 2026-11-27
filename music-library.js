// Only self-hosted, licensed audio is played. Add published MP3/OGG files under assets/music/.
// File names are stable slugs; titles and album grouping reflect the existing Music Tent.
window.MIDWAY_CATALOG = [
  {id:"carnival",title:"Carnival of Chaos",tracks:[
    ["carnival-of-chaos","Carnival of Chaos"],["clown-shoes-chaos","Clown Shoes & Chaos (Whoop Whoop)"],
    ["under-the-big-top","Under the Big Top"],["life-of-a-juggalo","Life of a Juggalo"],
    ["family-dont-fold","Family Don’t Fold"],["carnival-bloodline","Carnival Bloodline"],
    ["laughing-at-the-world","Laughing at the World"],["the-carnival-in-my-head","The Carnival in My Head"],
    ["one-more-ride","One More Ride (Freak Cut)"],["two-voices-one-smile","Two Voices, One Smile"],
    ["after-the-tents-fold","After the Tents Fold"]
  ]},
  {id:"midway",title:"Midway of Marvels",tracks:[
    ["open-the-gates","Open the Gates"],["funhouse-breathing","Funhouse Breathing"],
    ["midway-after-dark","Midway After Dark"],["midway-of-marvels","Midway of Marvels"],
    ["dirt-familiar","Dirt Familiar"],["midway-riot","Midway Riot"],
    ["family-in-the-fog","Family in the Fog"],["funhouse-mirror","Funhouse Mirror"],
    ["everythings-fine","Everything’s Fine"]
  ]}
].map(album=>({...album,tracks:album.tracks.map(([id,title])=>({id,title,album:album.title,src:'assets/music/'+id+'.mp3',published:['carnival-of-chaos','midway-riot','open-the-gates'].includes(id)}))}));

// Added from the owner-reviewed DistroKid upload folder.
window.MIDWAY_CATALOG.push({
  id:"reviewed", title:"Additional Recordings", tracks: [
    {"id": "6-feet-down", "title": "6 Feet Down", "album": "Additional Recordings", "src": "assets/music/6-feet-down.mp3", "published": true},
    {"id": "a-midway-sermon", "title": "A Midway Sermon", "album": "Additional Recordings", "src": "assets/music/a-midway-sermon.mp3", "published": true},
    {"id": "arrival", "title": "Arrival", "album": "Additional Recordings", "src": "assets/music/arrival.mp3", "published": true},
    {"id": "autopsy-of-language", "title": "AUTOPSY OF LANGUAGE", "album": "Additional Recordings", "src": "assets/music/autopsy-of-language.mp3", "published": true},
    {"id": "back-door-bounce", "title": "Back Door Bounce", "album": "Additional Recordings", "src": "assets/music/back-door-bounce.mp3", "published": true},
    {"id": "clowns-creepin", "title": "Clowns Creepin", "album": "Additional Recordings", "src": "assets/music/clowns-creepin.mp3", "published": true},
    {"id": "every-day", "title": "Every Day", "album": "Additional Recordings", "src": "assets/music/every-day.mp3", "published": true},
    {"id": "family-at-the-gate", "title": "Family At The Gate", "album": "Additional Recordings", "src": "assets/music/family-at-the-gate.mp3", "published": true},
    {"id": "funhouse-frequency", "title": "Funhouse Frequency", "album": "Additional Recordings", "src": "assets/music/funhouse-frequency.mp3", "published": true},
    {"id": "midway-down-under", "title": "Midway Down Under", "album": "Additional Recordings", "src": "assets/music/midway-down-under.mp3", "published": true},
    {"id": "midway-night-ride", "title": "Midway Night Ride", "album": "Additional Recordings", "src": "assets/music/midway-night-ride.mp3", "published": true},
    {"id": "midway-pressure", "title": "MIDWAY PRESSURE", "album": "Additional Recordings", "src": "assets/music/midway-pressure.mp3", "published": true},
    {"id": "midway-theory", "title": "MIDWAY THEORY", "album": "Additional Recordings", "src": "assets/music/midway-theory.mp3", "published": true},
    {"id": "only-at-the-gathering", "title": "ONLY AT THE GATHERING", "album": "Additional Recordings", "src": "assets/music/only-at-the-gathering.mp3", "published": true},
    {"id": "resurrection-protocol", "title": "RESURRECTION PROTOCOL", "album": "Additional Recordings", "src": "assets/music/resurrection-protocol.mp3", "published": true},
    {"id": "rise-of-the-midway", "title": "Rise of the Midway", "album": "Additional Recordings", "src": "assets/music/rise-of-the-midway.mp3", "published": true},
    {"id": "step-right-up", "title": "Step Right Up", "album": "Additional Recordings", "src": "assets/music/step-right-up.mp3", "published": true},
    {"id": "tent-of-teeth", "title": "Tent of Teeth", "album": "Additional Recordings", "src": "assets/music/tent-of-teeth.mp3", "published": true},
    {"id": "the-confrontation", "title": "THE CONFRONTATION", "album": "Additional Recordings", "src": "assets/music/the-confrontation.mp3", "published": true},
    {"id": "the-floor-swung-first", "title": "The Floor Swung First", "album": "Additional Recordings", "src": "assets/music/the-floor-swung-first.mp3", "published": true},
    {"id": "the-lights-don-t-shut-off", "title": "The Lights Don’t Shut Off", "album": "Additional Recordings", "src": "assets/music/the-lights-don-t-shut-off.mp3", "published": true},
    {"id": "the-midway-owes-me-blood", "title": "THE MIDWAY OWES ME BLOOD", "album": "Additional Recordings", "src": "assets/music/the-midway-owes-me-blood.mp3", "published": true},
    {"id": "the-smile-i-lost", "title": "The Smile I Lost", "album": "Additional Recordings", "src": "assets/music/the-smile-i-lost.mp3", "published": true},
    {"id": "the-trial", "title": "The Trial", "album": "Additional Recordings", "src": "assets/music/the-trial.mp3", "published": true},
    {"id": "welcome-home", "title": "Welcome Home", "album": "Additional Recordings", "src": "assets/music/welcome-home.mp3", "published": true},
  ]
});
