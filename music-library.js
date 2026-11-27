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
