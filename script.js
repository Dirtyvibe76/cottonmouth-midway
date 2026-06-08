const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.animate([
{opacity:0,transform:"translateY(50px)"},
{opacity:1,transform:"translateY(0px)"}
],{
duration:1000,
fill:"forwards"
});

}

});

});

sections.forEach(section=>{
observer.observe(section);
});