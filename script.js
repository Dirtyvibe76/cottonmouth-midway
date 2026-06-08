const enterButton = document.getElementById("enterButton");
const landing = document.getElementById("landing");
const gateFlash = document.getElementById("gateFlash");
const midway = document.getElementById("midway");

enterButton.addEventListener("click", () => {
  landing.classList.add("fade-out");

  setTimeout(() => {
    landing.style.display = "none";
    gateFlash.style.display = "flex";
    gateFlash.classList.add("gate-shake");
  }, 800);

  setTimeout(() => {
    gateFlash.textContent = "WELCOME TO THE MIDWAY";
  }, 1800);

  setTimeout(() => {
    gateFlash.style.display = "none";
    midway.classList.remove("hidden");
    midway.classList.add("midway-reveal");
    window.scrollTo(0, 0);
  }, 3000);
});