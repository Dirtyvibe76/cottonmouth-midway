const enterButton = document.getElementById("enterButton");
const landing = document.getElementById("landing");
const gateFlash = document.getElementById("gateFlash");
const midway = document.getElementById("midway");

enterButton.addEventListener("click", () => {
  landing.style.display = "none";
  gateFlash.style.display = "flex";

  setTimeout(() => {
    gateFlash.style.display = "none";
    midway.classList.remove("hidden");
    window.scrollTo(0, 0);
  }, 1800);
});